import { cpSync, mkdirSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";

const watch = process.argv.includes("--watch");

rmSync("dist", { recursive: true, force: true });
mkdirSync("dist");

for (const file of ["manifest.json", "popup.html", "grok_logo.png"]) {
  cpSync(file, `dist/${file}`);
}

const args = [
  "src/service-worker.ts",
  "src/popup.ts",
  "src/content.ts",
  "src/content.css",
  "--outdir=dist",
  "--bundle",
  "--format=iife",
];
if (watch) args.push("--watch");

const build = spawnSync("esbuild", args, { stdio: "inherit" });
if (build.error) throw build.error;
if (build.status !== 0) process.exit(build.status ?? 1);
