import { injectArticleActions } from "./content/article-actions";
import { injectReadLaterMenu } from "./content/read-later-menu";
import { watchItems } from "./read-later";

const renderers = [injectArticleActions(), injectReadLaterMenu()].filter((render) => render !== null);

if (renderers.length > 0) {
  watchItems((items) => {
    for (const render of renderers) render(items);
  });
}
