import { expect, test } from "bun:test";
import { GROKIPEDIA_ARTICLE_SUBSTITUTION, WIKIPEDIA_ARTICLE_FILTER } from "../src/redirect";

// The rule sets isUrlFilterCaseSensitive: false. RE2 writes groups as \1, JS as $1.
const filter = new RegExp(WIKIPEDIA_ARTICLE_FILTER, "i");
const substitution = GROKIPEDIA_ARTICLE_SUBSTITUTION.replace("\\1", "$1");

function redirect(url: string): string | null {
  return filter.test(url) ? url.replace(filter, substitution) : null;
}

test("redirects article pages on language and bare hosts", () => {
  expect(redirect("https://en.wikipedia.org/wiki/Earth")).toBe("https://grokipedia.com/page/Earth");
  expect(redirect("https://de.wikipedia.org/wiki/Berlin")).toBe("https://grokipedia.com/page/Berlin");
  expect(redirect("https://zh-yue.wikipedia.org/wiki/Earth")).toBe("https://grokipedia.com/page/Earth");
  expect(redirect("https://wikipedia.org/wiki/Earth")).toBe("https://grokipedia.com/page/Earth");
  expect(redirect("https://EN.Wikipedia.org/wiki/Earth")).toBe("https://grokipedia.com/page/Earth");
});

test("leaves non-article and nested hosts alone", () => {
  expect(redirect("https://en.m.wikipedia.org/wiki/Earth")).toBeNull();
  expect(redirect("https://en.wikipedia.org/w/index.php?title=Earth")).toBeNull();
  expect(redirect("https://en.wikipedia.org/wiki/")).toBeNull();
  expect(redirect("http://en.wikipedia.org/wiki/Earth")).toBeNull();
});

test("does not match hosts that only look like wikipedia", () => {
  expect(redirect("https://evilwikipedia.org/wiki/Earth")).toBeNull();
  expect(redirect("https://wikipedia.org.example.com/wiki/Earth")).toBeNull();
  expect(redirect("https://example.com/https://en.wikipedia.org/wiki/Earth")).toBeNull();
});

test("always lands on grokipedia.com", () => {
  for (const title of ["//example.com", "@example.com", "..%2F..%2Fexample.com"]) {
    const target = redirect(`https://en.wikipedia.org/wiki/${title}`);
    expect(target === null ? null : new URL(target).host).toBe("grokipedia.com");
  }
});
