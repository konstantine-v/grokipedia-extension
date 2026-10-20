declare const articleSlugBrand: unique symbol;
declare const articleUrlBrand: unique symbol;

export type ArticleSlug = string & { readonly [articleSlugBrand]: "ArticleSlug" };
export type ArticleUrl = string & { readonly [articleUrlBrand]: "ArticleUrl" };

export type Article = {
  slug: ArticleSlug;
  title: string;
  url: ArticleUrl;
};

export type ReadLaterItem = Article & {
  addedAt: number;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isArticleSlug(value: unknown): value is ArticleSlug {
  return typeof value === "string" && value.length > 0;
}

export function isArticleUrl(value: unknown): value is ArticleUrl {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function parseArticle(value: unknown): Article | null {
  if (!isRecord(value)) return null;
  const { slug, title, url } = value;
  if (!isArticleSlug(slug) || typeof title !== "string" || title.length === 0 || !isArticleUrl(url)) return null;
  return { slug, title, url };
}

function isAddedAt(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function parseReadLaterItem(value: unknown): ReadLaterItem | null {
  const article = parseArticle(value);
  if (!article || !isRecord(value) || !isAddedAt(value.addedAt)) return null;
  return { ...article, addedAt: value.addedAt };
}

export function parseReadLater(value: unknown): ReadLaterItem[] {
  if (!Array.isArray(value)) return [];
  const items: ReadLaterItem[] = [];
  for (const entry of value) {
    const item = parseReadLaterItem(entry);
    if (item) items.push(item);
  }
  return items;
}
