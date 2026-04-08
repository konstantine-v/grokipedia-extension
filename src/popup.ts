import { DEFAULT_STORAGE, readEnabled, type ToggleMessage } from "./types";

const toggle = document.getElementById("toggle");

if (!(toggle instanceof HTMLInputElement)) {
  throw new Error('Grokipedia popup: expected <input type="checkbox" id="toggle">');
}

void chrome.storage.local.get(DEFAULT_STORAGE).then((items) => {
  toggle.checked = readEnabled(items);
});

toggle.addEventListener("change", () => {
  const message: ToggleMessage = { type: "toggle", enabled: toggle.checked };
  chrome.runtime.sendMessage(message, () => {
    void chrome.runtime.lastError;
  });
});
