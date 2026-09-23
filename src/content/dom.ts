export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export function iconButton({ className, label, icon }: { className: string; label: string; icon: string }) {
  const button = el("button", className);
  button.type = "button";
  setLabel(button, label);
  button.innerHTML = icon;
  return button;
}

export function textButton(className: string, text: string): HTMLButtonElement {
  const button = el("button", className, text);
  button.type = "button";
  return button;
}

export function setLabel(button: HTMLButtonElement, label: string): void {
  button.ariaLabel = label;
  button.title = label;
}
