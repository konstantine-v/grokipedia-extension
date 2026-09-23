import type { Article } from "./read-later";

const GROK_BASE = "https://grok.com/";

function grokUrl({ title, url }: Article): string {
  const prompt = `I'm reading the Grokipedia article "${title}" (${url}). Give me an overview and help me dive deeper into this topic.`;
  return `${GROK_BASE}?q=${encodeURIComponent(prompt)}`;
}

export function openInGrok(article: Article): void {
  window.open(grokUrl(article), "_blank", "noopener");
}
