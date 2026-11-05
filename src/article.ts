declare const articleSlugBrand: unique symbol;
declare const articleUrlBrand: unique symbol;

export type ArticleSlug = string & { readonly [articleSlugBrand]: "ArticleSlug" };
export type ArticleUrl = string & { readonly [articleUrlBrand]: "ArticleUrl" };

export type Article = {
  readonly slug: ArticleSlug;
  readonly title: string;
  readonly url: ArticleUrl;
};

export type ReadLaterItem = Article & {
  readonly addedAt: number;
};

const PAGE_PREFIX = "/page/";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isArticleSlug(value: unknown): value is ArticleSlug {
  return typeof value === "string" && value.length > 0;
}

function isArticleUrl(value: unknown): value is ArticleUrl {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function isAddedAt(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

/** The slug of a grokipedia.com `/page/<slug>` path, or null for other or malformed paths. */
export function articleSlugFromPath(pathname: string): ArticleSlug | null {
  if (!pathname.startsWith(PAGE_PREFIX)) return null;
  let slug: string;
  try {
    slug = decodeURIComponent(pathname.slice(PAGE_PREFIX.length));
  } catch {
    return null;
  }
  return isArticleSlug(slug) ? slug : null;
}

export function parseArticle(value: unknown): Article | null {
  if (!isRecord(value)) return null;
  const { slug, title, url } = value;
  if (!isArticleSlug(slug) || typeof title !== "string" || title.length === 0 || !isArticleUrl(url)) return null;
  return { slug, title, url };
}

function parseReadLaterItem(value: unknown): ReadLaterItem | null {
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
