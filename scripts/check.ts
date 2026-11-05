import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

const STORAGE_FILE = "src/storage.ts";

export function sourceErrors(file: string, text: string): string[] {
  const errors: string[] = [];
  if (/\bas\b/.test(text)) {
    errors.push(`${file}: type assertion. Narrow with a type guard, or parse chrome values in ${STORAGE_FILE}.`);
  }
  if (/\bany\b/.test(text)) {
    errors.push(`${file}: use unknown and narrow it. Do not use any.`);
  }
  if (text.includes("@ts-ignore") || text.includes("@ts-expect-error")) {
    errors.push(`${file}: do not suppress the type checker. Parse the value in ${STORAGE_FILE}.`);
  }
  if (text.includes(".get<") || text.includes("querySelector<")) {
    errors.push(
      `${file}: a type argument here is not checked at runtime. Narrow with instanceof, or parse in ${STORAGE_FILE}.`,
    );
  }
  if (/\b(?:innerHTML|outerHTML|insertAdjacentHTML)\b/.test(text)) {
    errors.push(`${file}: build DOM with createElement or createElementNS, not HTML strings.`);
  }
  if (file !== STORAGE_FILE && text.includes("chrome.storage")) {
    errors.push(`${file}: chrome.storage belongs in ${STORAGE_FILE}.`);
  }
  return errors;
}

export function lockfileError(present: boolean): string | null {
  return present ? "package-lock.json: this repo uses bun.lock only." : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isExecFailure(error: unknown): error is { status: number } {
  return isRecord(error) && typeof error.status === "number";
}

function walk(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(path));
    else files.push(path);
  }
  return files;
}

export function ignoredBy(gitignore: string, paths: readonly string[]): string[] {
  const dir = join(tmpdir(), `gpx-ignore-${process.pid}-${Date.now()}`);
  mkdirSync(dir, { recursive: true });
  try {
    writeFileSync(join(dir, ".gitignore"), gitignore);
    for (const path of paths) {
      const file = join(dir, path);
      mkdirSync(dirname(file), { recursive: true });
      writeFileSync(file, "");
    }
    execFileSync("git", ["init", "-q"], { cwd: dir });
    try {
      const output = execFileSync("git", ["check-ignore", "--no-index", ...paths], {
        cwd: dir,
        encoding: "utf8",
      });
      return output.trim().split("\n").filter((line) => line.length > 0);
    } catch (error) {
      if (isExecFailure(error) && error.status === 1) return [];
      throw error;
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

const pastMistakes: readonly (readonly [string, string])[] = [
  ["src/popup.ts", `document.getElementById("toggle") as HTMLInputElement`],
  ["src/popup.ts", `result.enabled as boolean`],
  ["src/types.ts", `const o = value as Record<string, unknown>`],
  ["src/service-worker.ts", `chrome.storage.local.get<ExtensionLocalStorage>(DEFAULT_STORAGE)`],
  ["src/content/dom.ts", `button.innerHTML = icon`],
];

const errors: string[] = [];

for (const [file, text] of pastMistakes) {
  if (sourceErrors(file, text).length === 0) {
    errors.push(`check no longer flags ${file}`);
  }
}

if (!lockfileError(true)) {
  errors.push("check no longer flags package-lock.json");
}

const srcFiles = walk("src");

for (const file of srcFiles.filter((file) => file.endsWith(".ts"))) {
  errors.push(...sourceErrors(file, readFileSync(file, "utf8")));
}

const historicalGitignore = `CLAUDE.md
node_modules/
service-worker.js
popup.js
content.js
content.css
.claude/
.cursor/
`;

if (!ignoredBy(historicalGitignore, ["src/content.css"]).includes("src/content.css")) {
  errors.push("check no longer flags a gitignore rule that ignores src/content.css");
}

const ignoredSrc = ignoredBy(readFileSync(".gitignore", "utf8"), srcFiles);
if (ignoredSrc.length > 0) {
  errors.push(
    `gitignore matches source (${ignoredSrc.join(", ")}). Build into dist/ and ignore dist/ only.`,
  );
}

const buildScript = readFileSync("scripts/build.ts", "utf8");
if (!buildScript.includes("--outdir=dist")) {
  errors.push("scripts/build.ts must pass --outdir=dist so build output cannot share names with src/.");
}

if (!/^dist\/$/m.test(readFileSync(".gitignore", "utf8"))) {
  errors.push(".gitignore must ignore dist/.");
}

const lockfile = lockfileError(existsSync("package-lock.json"));
if (lockfile) errors.push(lockfile);

if (errors.length > 0) {
  for (const error of errors) console.error(error);
  process.exit(1);
}
