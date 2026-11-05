import { el } from "./dom";

const TOAST_DURATION_MS = 2500;

let current: { node: HTMLElement; timer: number } | null = null;

export function showToast(message: string): void {
  if (current) {
    window.clearTimeout(current.timer);
    current.node.remove();
  }

  const node = el("div", "gpx-toast", message);
  node.role = "status";
  document.body.append(node);

  // A newer toast clears this timer, so when it fires `node` is still the current toast.
  const timer = window.setTimeout(() => {
    node.remove();
    current = null;
  }, TOAST_DURATION_MS);
  current = { node, timer };
}
