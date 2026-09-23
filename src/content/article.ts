import type { Article } from "../read-later";

const PAGE_PREFIX = "/page/";

export function currentArticle(): Article | null {
  if (!location.pathname.startsWith(PAGE_PREFIX)) return null;
  const slug = decodeURIComponent(location.pathname.slice(PAGE_PREFIX.length));
  const title = document.querySelector("h1")?.textContent?.trim() || slug.replaceAll("_", " ");
  const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href;
  return { slug, title, url: canonical || location.href };
}
