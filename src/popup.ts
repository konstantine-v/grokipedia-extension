import { readEnabled, writeEnabled } from "./storage";

const toggle = document.getElementById("toggle");
if (!(toggle instanceof HTMLInputElement)) {
  throw new Error("Missing #toggle");
}

void readEnabled().then((enabled) => {
  toggle.checked = enabled;
  toggle.disabled = false;
});

toggle.addEventListener("change", () => {
  void writeEnabled(toggle.checked);
});
