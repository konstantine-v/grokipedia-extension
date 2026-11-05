import { parseReadLater, type ReadLaterItem } from "./article";

const ENABLED_KEY = "enabled";
const READ_LATER_KEY = "readLater";

async function readKey(key: string): Promise<unknown> {
  const items = await chrome.storage.local.get(key);
  return items[key];
}

function onKeyChanged(key: string, callback: (value: unknown) => void): void {
  chrome.storage.local.onChanged.addListener((changes) => {
    const change = changes[key];
    if (change) callback(change.newValue);
  });
}

function parseEnabled(value: unknown): boolean {
  return typeof value === "boolean" ? value : true;
}

export async function readEnabled(): Promise<boolean> {
  return parseEnabled(await readKey(ENABLED_KEY));
}

export async function writeEnabled(enabled: boolean): Promise<void> {
  await chrome.storage.local.set({ [ENABLED_KEY]: enabled });
}

export function onEnabledChanged(callback: (enabled: boolean) => void): void {
  onKeyChanged(ENABLED_KEY, (value) => callback(parseEnabled(value)));
}

export async function readReadLater(): Promise<ReadLaterItem[]> {
  return parseReadLater(await readKey(READ_LATER_KEY));
}

export async function writeReadLater(items: readonly ReadLaterItem[]): Promise<void> {
  await chrome.storage.local.set({ [READ_LATER_KEY]: items });
}

export function onReadLaterChanged(callback: (items: ReadLaterItem[]) => void): void {
  onKeyChanged(READ_LATER_KEY, (value) => callback(parseReadLater(value)));
}
