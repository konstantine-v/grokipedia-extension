export type ToggleMessage = { readonly type: "toggle"; readonly enabled: boolean };

/** Keys persisted in `chrome.storage.local` for this extension. */
export interface ExtensionLocalStorage {
  enabled: boolean;
}

export const DEFAULT_STORAGE: ExtensionLocalStorage = {
  enabled: true,
} as const;

export function isToggleMessage(value: unknown): value is ToggleMessage {
  if (typeof value !== "object" || value === null) return false;
  const o = value as Record<string, unknown>;
  return o.type === "toggle" && typeof o.enabled === "boolean";
}

/** Normalize `storage.local.get` results (values may be missing or corrupted). */
export function readEnabled(items: object): boolean {
  if (!("enabled" in items)) return DEFAULT_STORAGE.enabled;
  const v = (items as { enabled: unknown }).enabled;
  return typeof v === "boolean" ? v : DEFAULT_STORAGE.enabled;
}
