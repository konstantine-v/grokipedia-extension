import { parseReadLater, type ReadLaterItem } from "./article";

const ENABLED_KEY = "enabled";
const READ_LATER_KEY = "readLater";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function readKey(key: string): Promise<unknown> {
  const items: unknown = await chrome.storage.local.get(key);
  if (!isRecord(items) || !(key in items)) return undefined;
  return items[key];
}

export async function readEnabled(): Promise<boolean> {
  const value = await readKey(ENABLED_KEY);
  return typeof value === "boolean" ? value : true;
}

export async function writeEnabled(enabled: boolean): Promise<void> {
  await chrome.storage.local.set({ [ENABLED_KEY]: enabled });
}

export async function readReadLater(): Promise<ReadLaterItem[]> {
  return parseReadLater(await readKey(READ_LATER_KEY));
}

export async function writeReadLater(items: readonly ReadLaterItem[]): Promise<void> {
  await chrome.storage.local.set({ [READ_LATER_KEY]: items });
}

export function onReadLaterChanged(callback: (items: ReadLaterItem[]) => void): void {
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local" || !(READ_LATER_KEY in changes)) return;
    callback(parseReadLater(changes[READ_LATER_KEY]?.newValue));
  });
}
