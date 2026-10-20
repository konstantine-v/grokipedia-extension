import { expect, test } from "bun:test";
import { parseArticle, parseReadLater } from "../src/article";

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

test("parseArticle rejects an empty slug", () => {
  expect(parseArticle({ ...earth, slug: "" })).toBeNull();
});

test("parseReadLater drops corrupt rows", () => {
  const items = parseReadLater([
    { ...earth, addedAt: 1 },
    { slug: "Nope" },
    { ...earth, addedAt: Number.NaN },
  ]);
  expect(items.map((item) => item.slug)).toEqual(["Earth"]);
});
