/** RE2 filter for main-frame Wikipedia article URLs. Group 1 is the article title. */
export const WIKIPEDIA_ARTICLE_FILTER = "^https://(?:[a-z-]+\\.)?wikipedia\\.org/wiki/(.+)$";

/** Where a matched article goes. `\1` is the title captured by the filter. */
export const GROKIPEDIA_ARTICLE_SUBSTITUTION = "https://grokipedia.com/page/\\1";
