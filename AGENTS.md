# Rules

| Rule | Enforcement |
| --- | --- |
| Parse `chrome.storage` in `src/storage.ts`. No `as`, `any`, or unchecked type arguments on `.get` / `querySelector`. | `scripts/check.ts` |
| Build DOM with `createElement` / `createElementNS`. No `innerHTML`, `outerHTML`, or `insertAdjacentHTML`. | `scripts/check.ts` |
| One lockfile, `bun.lock`. | `scripts/check.ts` |
| Build into `dist/`. Gitignore must not match files under `src/`. | `scripts/check.ts` |
