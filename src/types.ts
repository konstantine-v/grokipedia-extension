export type ToggleMessage = { type: "toggle"; enabled: boolean };

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
