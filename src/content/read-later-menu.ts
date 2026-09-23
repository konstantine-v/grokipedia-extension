import { openInGrok } from "../grok";
import { getItems, onItemsChanged, removeItem, type ReadLaterItem } from "../read-later";
import { el, iconButton, textButton } from "./dom";
import { bookIcon, closeIcon, grokIcon, trashIcon } from "./icons";

const RECENT_COUNT = 5;
const CLOSE_DELAY_MS = 150;

const HEADER_BUTTON_CLASS =
  "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-fg-secondary transition hover:bg-surface-l1";

function articleLink(item: ReadLaterItem, className: string): HTMLAnchorElement {
  const link = el("a", className, item.title);
  link.href = item.url;
  return link;
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function renderDropdown(dropdown: HTMLElement, items: ReadLaterItem[], openModal: () => void): void {
  dropdown.replaceChildren(el("div", "gpx-dropdown-title", "Read later"));

  if (items.length === 0) {
    dropdown.append(el("div", "gpx-empty", "No saved articles yet"));
    return;
  }

  const list = el("ul", "gpx-dropdown-list");
  for (const item of items.slice(0, RECENT_COUNT)) {
    const row = el("li", "");
    row.append(articleLink(item, "gpx-dropdown-link"));
    list.append(row);
  }

  const viewAll = textButton("gpx-view-all", `View all (${items.length})`);
  viewAll.addEventListener("click", openModal);

  dropdown.append(list, viewAll);
}

function createModal() {
  let items: ReadLaterItem[] = [];
  let confirmingSlug: string | null = null;

  const backdrop = el("div", "gpx-backdrop");
  backdrop.hidden = true;
  const dialog = el("div", "gpx-modal");
  dialog.role = "dialog";
  dialog.ariaModal = "true";
  dialog.ariaLabel = "Read later";

  const header = el("div", "gpx-modal-header");
  const closeButton = iconButton({ className: "gpx-icon-btn", label: "Close", icon: closeIcon });
  header.append(el("h2", "gpx-modal-title", "Read later"), closeButton);

  const body = el("div", "gpx-modal-body");
  dialog.append(header, body);
  backdrop.append(dialog);

  const renderRow = (item: ReadLaterItem): HTMLLIElement => {
    const row = el("li", "gpx-row");
    const info = el("div", "gpx-row-info");
    info.append(articleLink(item, "gpx-row-title"), el("span", "gpx-row-date", `Added ${formatDate(item.addedAt)}`));

    const actions = el("div", "gpx-row-actions");
    if (confirmingSlug === item.slug) {
      const yes = textButton("gpx-btn gpx-btn-danger", "Remove");
      yes.addEventListener("click", () => {
        confirmingSlug = null;
        void removeItem(item.slug);
      });
      const cancel = textButton("gpx-btn", "Cancel");
      cancel.addEventListener("click", () => {
        confirmingSlug = null;
        render();
      });
      actions.append(el("span", "gpx-confirm-text", "Remove?"), yes, cancel);
    } else {
      const grok = iconButton({ className: "gpx-icon-btn", label: "Open in Grok", icon: grokIcon });
      grok.addEventListener("click", () => openInGrok(item));
      const remove = iconButton({
        className: "gpx-icon-btn gpx-icon-btn-danger",
        label: "Remove from read later",
        icon: trashIcon,
      });
      remove.addEventListener("click", () => {
        confirmingSlug = item.slug;
        render();
      });
      actions.append(grok, remove);
    }

    row.append(info, actions);
    return row;
  };

  const render = () => {
    if (items.length === 0) {
      body.replaceChildren(el("div", "gpx-empty", "No saved articles yet. Use the + button on an article to add it."));
      return;
    }
    const list = el("ul", "gpx-modal-list");
    list.append(...items.map(renderRow));
    body.replaceChildren(list);
  };

  const onKeydown = (event: KeyboardEvent) => {
    if (event.key === "Escape") close();
  };

  const open = () => {
    confirmingSlug = null;
    render();
    backdrop.hidden = false;
    document.addEventListener("keydown", onKeydown);
    closeButton.focus();
  };

  const close = () => {
    backdrop.hidden = true;
    document.removeEventListener("keydown", onKeydown);
  };

  closeButton.addEventListener("click", close);
  backdrop.addEventListener("click", (event) => {
    if (event.target === backdrop) close();
  });

  document.body.append(backdrop);

  return {
    open,
    update(next: ReadLaterItem[]) {
      items = next;
      render();
    },
  };
}

export function injectReadLaterMenu(): void {
  const anchor = document.getElementById("theme-toggle-desktop");
  if (!anchor) return;

  const modal = createModal();

  const wrapper = el("div", "gpx-menu");
  const button = iconButton({ className: HEADER_BUTTON_CLASS, label: "Read later", icon: bookIcon });
  const dropdown = el("div", "gpx-dropdown");
  dropdown.hidden = true;
  wrapper.append(button, dropdown);

  let closeTimer: number | undefined;
  const showDropdown = () => {
    window.clearTimeout(closeTimer);
    dropdown.hidden = false;
  };
  const hideDropdown = () => {
    window.clearTimeout(closeTimer);
    closeTimer = window.setTimeout(() => {
      dropdown.hidden = true;
    }, CLOSE_DELAY_MS);
  };
  const openModal = () => {
    window.clearTimeout(closeTimer);
    dropdown.hidden = true;
    modal.open();
  };

  wrapper.addEventListener("mouseenter", showDropdown);
  wrapper.addEventListener("mouseleave", hideDropdown);
  wrapper.addEventListener("focusin", showDropdown);
  wrapper.addEventListener("focusout", (event) => {
    if (!(event.relatedTarget instanceof Node) || !wrapper.contains(event.relatedTarget)) hideDropdown();
  });
  button.addEventListener("click", openModal);

  const render = (items: ReadLaterItem[]) => {
    renderDropdown(dropdown, items, openModal);
    modal.update(items);
  };

  anchor.after(wrapper);
  void getItems().then(render);
  onItemsChanged(render);
}
