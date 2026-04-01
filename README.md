# Grokipedia Chrome Extension

An extension to reroute links to wikipedia over to Grokipedia

This is mainly to learn how to create chrome extensions

Utilized bun for easily building the project and managing and dependencies

## Setup

```sh
bun install
```

## Build

```sh
bun run build
```

Outputs `service-worker.js` and `popup.js` to the project root.

## Type check

```sh
bun run typecheck
```

## Loading the extension

1. Open `chrome://extensions` in Chrome
2. Enable **Developer mode**
3. Click **Load unpacked** and select this directory
