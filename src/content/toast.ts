const TOAST_DURATION_MS = 2500;

let current: { node: HTMLElement; timer: number } | null = null;

export function showToast(message: string): void {
  if (current) {
    window.clearTimeout(current.timer);
    current.node.remove();
  }

  const node = document.createElement("div");
  node.className = "gpx-toast";
  node.role = "status";
  node.textContent = message;
  document.body.append(node);

  const timer = window.setTimeout(() => {
    node.remove();
    if (current?.node === node) current = null;
  }, TOAST_DURATION_MS);
  current = { node, timer };
}
