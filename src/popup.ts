import type { ToggleMessage } from "./types";

const toggle = document.getElementById("toggle") as HTMLInputElement;

chrome.storage.local.get({ enabled: true }, (result) => {
  toggle.checked = result.enabled as boolean;
});

toggle.addEventListener("change", () => {
  const message: ToggleMessage = { type: "toggle", enabled: toggle.checked };
  chrome.runtime.sendMessage(message);
});
