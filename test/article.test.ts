import { expect, test } from "bun:test";
import { articleSlugFromPath, parseArticle, parseReadLater } from "../src/article";

const earth = {
  slug: "Earth",
  title: "Earth",
  url: "https://grokipedia.com/page/Earth",
};

test("parseArticle accepts a grokipedia page", () => {
  expect(parseArticle(earth)?.title).toBe("Earth");
});

test("parseArticle rejects a non-url", () => {
  expect(parseArticle({ ...earth, url: "Earth" })).toBeNull();
});

test("parseArticle rejects a script url", () => {
  expect(parseArticle({ ...earth, url: "javascript:alert(1)" })).toBeNull();
});

test("parseArticle rejects an empty slug", () => {
  expect(parseArticle({ ...earth, slug: "" })).toBeNull();
});

test("parseReadLater drops corrupt rows", () => {
  const items = parseReadLater([
    { ...earth, addedAt: 1 },
    { slug: "Nope" },
    { ...earth, addedAt: Number.NaN },
  ]);
  expect(items.map((item): string => item.slug)).toEqual(["Earth"]);
});

test("parseReadLater ignores a non-array", () => {
  expect(parseReadLater({ 0: { ...earth, addedAt: 1 } })).toEqual([]);
});

test("articleSlugFromPath decodes a page path", () => {
  const slug: string | null = articleSlugFromPath("/page/Caf%C3%A9_au_lait");
  expect(slug).toBe("Café_au_lait");
});

test("articleSlugFromPath ignores other paths", () => {
  expect(articleSlugFromPath("/")).toBeNull();
  expect(articleSlugFromPath("/page/")).toBeNull();
  expect(articleSlugFromPath("/search/page/Earth")).toBeNull();
});

test("articleSlugFromPath returns null for malformed escapes instead of throwing", () => {
  expect(articleSlugFromPath("/page/%E0%A4%A")).toBeNull();
});
