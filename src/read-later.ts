import type { Article, ArticleSlug, ReadLaterItem } from "./article";
import { onReadLaterChanged, readReadLater, writeReadLater } from "./storage";

export type ItemsRenderer = (items: readonly ReadLaterItem[]) => void;

export async function addItem(article: Article): Promise<void> {
  const items = await readReadLater();
  await writeReadLater([
    { ...article, addedAt: Date.now() },
    ...items.filter((item) => item.slug !== article.slug),
  ]);
}

export async function removeItem(slug: ArticleSlug): Promise<void> {
  const items = await readReadLater();
  await writeReadLater(items.filter((item) => item.slug !== slug));
}

/** Calls `render` with the saved items now, then again after every change. */
export function watchItems(render: ItemsRenderer): void {
  onReadLaterChanged(render);
  void readReadLater().then(render);
}
