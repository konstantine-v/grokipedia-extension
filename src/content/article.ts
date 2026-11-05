import { articleSlugFromPath, parseArticle, type Article } from "../article";

export function currentArticle(): Article | null {
  const slug = articleSlugFromPath(location.pathname);
  if (!slug) return null;
  const title = document.querySelector("h1")?.textContent?.trim() || slug.replaceAll("_", " ");
  const canonical = document.querySelector('link[rel="canonical"]');
  const url = canonical instanceof HTMLLinkElement ? canonical.href : location.href;
  return parseArticle({ slug, title, url });
}
