import { DEFAULT_STORAGE, readEnabled, type ExtensionLocalStorage, type ToggleMessage } from "./types";

const toggle = document.getElementById("toggle");
if (!(toggle instanceof HTMLInputElement)) {
  throw new Error("Missing #toggle");
}

void chrome.storage.local.get<ExtensionLocalStorage>(DEFAULT_STORAGE).then((items) => {
  toggle.checked = readEnabled(items);
});

toggle.addEventListener("change", () => {
  const message: ToggleMessage = { type: "toggle", enabled: toggle.checked };
  chrome.runtime.sendMessage(message, () => {
    void chrome.runtime.lastError;
  });
});
