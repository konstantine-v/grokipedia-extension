import type { Article, ArticleSlug, ReadLaterItem } from "./article";
import { onReadLaterChanged, readReadLater, writeReadLater } from "./storage";

export async function getItems(): Promise<ReadLaterItem[]> {
  return readReadLater();
}

export async function addItem(article: Article): Promise<void> {
  const items = await getItems();
  await writeReadLater([
    { ...article, addedAt: Date.now() },
    ...items.filter((item) => item.slug !== article.slug),
  ]);
}

export async function removeItem(slug: ArticleSlug): Promise<void> {
  const items = await getItems();
  await writeReadLater(items.filter((item) => item.slug !== slug));
}

export function onItemsChanged(callback: (items: ReadLaterItem[]) => void): void {
  onReadLaterChanged(callback);
}
