# Grokipedia Chrome Extension

Unofficial extension that reroutes Wikipedia article navigations to [Grokipedia](https://grokipedia.com/).

Built as a small Manifest V3 project. Uses bun for install, build, and typecheck.

## Routes

Only **main-frame** Wikipedia article URLs are rewritten. Assets, XHR, and other resource types are left alone.

| From | To |
| --- | --- |
| `https://wikipedia.org/wiki/<title>` | `https://grokipedia.com/page/<title>` |
| `https://<lang>.wikipedia.org/wiki/<title>` | `https://grokipedia.com/page/<title>` |

Examples:

- `https://en.wikipedia.org/wiki/Earth` → `https://grokipedia.com/page/Earth`
- `https://de.wikipedia.org/wiki/Berlin` → `https://grokipedia.com/page/Berlin`

`<lang>` is a single hostname label of letters and hyphens (for example `en`, `zh-yue`). Nested hosts such as `en.m.wikipedia.org` are not matched.

The toolbar popup can turn the redirect on or off. It is on by default.

## Grokipedia page additions

A content script adds a few controls to grokipedia.com:

- **Ask Grok** (article header, next to Listen / Copy link / Edits history): opens [Grok](https://grok.com/) in a new tab with a prompt about the current article.
- **Read later** (+ button, same row): saves the article to a list in `chrome.storage.local`. Click again to remove.
- **Read later list** (book icon next to the theme toggle): hover to see recent items, click to open a modal where you can open saved articles on Grokipedia or in Grok, or remove them.

## Setup

```sh
bun install
```

## Build

```sh
bun run build
```

Outputs `service-worker.js`, `popup.js`, `content.js`, and `content.css` to the project root.

## Type check

```sh
bun run typecheck
```

## Loading the extension

1. Open `chrome://extensions` in Chrome
2. Enable **Developer mode**
3. Click **Load unpacked** and select this directory
