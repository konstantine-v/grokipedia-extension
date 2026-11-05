import { openInGrok } from "../grok";
import { addItem, removeItem, type ItemsRenderer } from "../read-later";
import { currentArticle } from "./article";
import { iconButton, setLabel } from "./dom";
import { checkIcon, grokIcon, plusIcon } from "./icons";
import { showToast } from "./toast";

const BUTTON_CLASS =
  "text-fg-secondary hover:text-fg-primary flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-surface-l2";

const ADD_LABEL = "Add to read later";
const REMOVE_LABEL = "Remove from read later";

export function injectArticleActions(): ItemsRenderer | null {
  const article = currentArticle();
  const anchor = document.getElementById("edits-history-btn");
  if (!article || !anchor) return null;

  const grokButton = iconButton({ className: BUTTON_CLASS, label: "Ask Grok about this article", icon: grokIcon() });
  grokButton.addEventListener("click", () => openInGrok(article));

  const plus = plusIcon();
  const check = checkIcon();
  const saveButton = iconButton({ className: BUTTON_CLASS, label: ADD_LABEL, icon: plus });
  saveButton.ariaPressed = "false";
  let saved = false;

  const toggleSaved = async (): Promise<void> => {
    if (saved) {
      await removeItem(article.slug);
      showToast("Removed from your reading list");
    } else {
      await addItem(article);
      showToast("Added to your reading list");
    }
  };
  saveButton.addEventListener("click", () => void toggleSaved());

  anchor.after(grokButton, saveButton);

  return (items) => {
    saved = items.some((item) => item.slug === article.slug);
    setLabel(saveButton, saved ? REMOVE_LABEL : ADD_LABEL);
    saveButton.ariaPressed = String(saved);
    saveButton.replaceChildren(saved ? check : plus);
  };
}
