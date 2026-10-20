import { readEnabled } from "./storage";
import type { ToggleMessage } from "./types";

const toggle = document.getElementById("toggle");
if (!(toggle instanceof HTMLInputElement)) {
  throw new Error("Missing #toggle");
}

void readEnabled().then((enabled) => {
  toggle.checked = enabled;
});

toggle.addEventListener("change", () => {
  const message: ToggleMessage = { type: "toggle", enabled: toggle.checked };
  chrome.runtime.sendMessage(message, () => {
    void chrome.runtime.lastError;
  });
});
