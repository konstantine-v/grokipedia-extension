import { parseArticle, type Article } from "../article";

const PAGE_PREFIX = "/page/";

export function currentArticle(): Article | null {
  if (!location.pathname.startsWith(PAGE_PREFIX)) return null;
  const slug = decodeURIComponent(location.pathname.slice(PAGE_PREFIX.length));
  const title = document.querySelector("h1")?.textContent?.trim() || slug.replaceAll("_", " ");
  const canonical = document.querySelector('link[rel="canonical"]');
  const url = canonical instanceof HTMLLinkElement ? canonical.href : location.href;
  return parseArticle({ slug, title, url });
}
