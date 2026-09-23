export interface Article {
  slug: string;
  title: string;
  url: string;
}

export interface ReadLaterItem extends Article {
  addedAt: number;
}

const STORAGE_KEY = "readLater";

export function isReadLaterItem(value: unknown): value is ReadLaterItem {
  return (
    typeof value === "object" &&
    value !== null &&
    "slug" in value &&
    "title" in value &&
    "url" in value &&
    "addedAt" in value &&
    typeof value.slug === "string" &&
    typeof value.title === "string" &&
    typeof value.url === "string" &&
    typeof value.addedAt === "number"
  );
}

function parseItems(value: unknown): ReadLaterItem[] {
  return Array.isArray(value) ? value.filter(isReadLaterItem) : [];
}

export async function getItems(): Promise<ReadLaterItem[]> {
  const raw = await chrome.storage.local.get(STORAGE_KEY);
  return parseItems(raw[STORAGE_KEY]);
}

async function setItems(items: ReadLaterItem[]): Promise<void> {
  await chrome.storage.local.set({ [STORAGE_KEY]: items });
}

export async function addItem(article: Article): Promise<void> {
  const items = await getItems();
  await setItems([{ ...article, addedAt: Date.now() }, ...items.filter((i) => i.slug !== article.slug)]);
}

export async function removeItem(slug: string): Promise<void> {
  const items = await getItems();
  await setItems(items.filter((i) => i.slug !== slug));
}

export function onItemsChanged(callback: (items: ReadLaterItem[]) => void): void {
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local" || !(STORAGE_KEY in changes)) return;
    callback(parseItems(changes[STORAGE_KEY].newValue));
  });
}
