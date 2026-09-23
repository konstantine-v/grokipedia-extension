import { openInGrok } from "../grok";
import { addItem, getItems, onItemsChanged, removeItem, type ReadLaterItem } from "../read-later";
import { currentArticle } from "./article";
import { iconButton, setLabel } from "./dom";
import { checkIcon, grokIcon, plusIcon } from "./icons";
import { showToast } from "./toast";

const BUTTON_CLASS =
  "text-fg-secondary hover:text-fg-primary flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-surface-l2";

export function injectArticleActions(): void {
  const article = currentArticle();
  const anchor = document.getElementById("edits-history-btn");
  if (!article || !anchor) return;

  const grokButton = iconButton({ className: BUTTON_CLASS, label: "Ask Grok about this article", icon: grokIcon });
  grokButton.addEventListener("click", () => openInGrok(article));

  const saveButton = iconButton({ className: BUTTON_CLASS, label: "Add to read later", icon: plusIcon });
  let saved = false;

  const render = (items: ReadLaterItem[]) => {
    saved = items.some((i) => i.slug === article.slug);
    setLabel(saveButton, saved ? "Remove from read later" : "Add to read later");
    saveButton.ariaPressed = String(saved);
    saveButton.innerHTML = saved ? checkIcon : plusIcon;
  };

  saveButton.addEventListener("click", async () => {
    if (saved) {
      await removeItem(article.slug);
      showToast("Removed from your reading list");
    } else {
      await addItem(article);
      showToast("Added to your reading list");
    }
  });

  anchor.after(grokButton, saveButton);
  void getItems().then(render);
  onItemsChanged(render);
}
