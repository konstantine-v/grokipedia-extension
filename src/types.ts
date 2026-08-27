export type ToggleMessage = { type: "toggle"; enabled: boolean };

export interface ExtensionLocalStorage {
  enabled: boolean;
}

export const DEFAULT_STORAGE: ExtensionLocalStorage = { enabled: true };

export function isToggleMessage(value: unknown): value is ToggleMessage {
  return (
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    "enabled" in value &&
    value.type === "toggle" &&
    typeof value.enabled === "boolean"
  );
}

export function readEnabled(items: { enabled?: unknown }): boolean {
  return typeof items.enabled === "boolean" ? items.enabled : DEFAULT_STORAGE.enabled;
}
