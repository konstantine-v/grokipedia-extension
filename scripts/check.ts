import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

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
  if (file !== STORAGE_FILE && text.includes("chrome.storage")) {
    errors.push(`${file}: chrome.storage belongs in ${STORAGE_FILE}.`);
  }
  return errors;
}

export function lockfileError(present: boolean): string | null {
  return present ? "package-lock.json: this repo uses bun.lock only." : null;
}

function walk(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(path));
    else if (entry.name.endsWith(".ts")) files.push(path);
  }
  return files;
}

const pastMistakes: readonly (readonly [string, string])[] = [
  ["src/popup.ts", `document.getElementById("toggle") as HTMLInputElement`],
  ["src/popup.ts", `result.enabled as boolean`],
  ["src/types.ts", `const o = value as Record<string, unknown>`],
  ["src/service-worker.ts", `chrome.storage.local.get<ExtensionLocalStorage>(DEFAULT_STORAGE)`],
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

for (const file of walk("src")) {
  errors.push(...sourceErrors(file, readFileSync(file, "utf8")));
}

const lockfile = lockfileError(existsSync("package-lock.json"));
if (lockfile) errors.push(lockfile);

if (errors.length > 0) {
  for (const error of errors) console.error(error);
  process.exit(1);
}
