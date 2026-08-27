import { DEFAULT_STORAGE, isToggleMessage, readEnabled, type ExtensionLocalStorage } from "./types";

const RULE_ID = 1;

const GROKIPEDIA_BASE = "https://grokipedia.com/";

const REDIRECT_RULE: chrome.declarativeNetRequest.Rule = {
  id: RULE_ID,
  priority: 1,
  action: {
    type: chrome.declarativeNetRequest.RuleActionType.REDIRECT,
    redirect: {
      regexSubstitution: `${GROKIPEDIA_BASE}page/\\1`,
    },
  },
  condition: {
    regexFilter: "^https://(?:[a-z-]+\\.)?wikipedia\\.org/wiki/(.+)$",
    isUrlFilterCaseSensitive: false,
    resourceTypes: [chrome.declarativeNetRequest.ResourceType.MAIN_FRAME],
  },
};

async function setRedirect(enabled: boolean) {
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [RULE_ID],
    addRules: enabled ? [REDIRECT_RULE] : [],
  });
}

async function isEnabled(): Promise<boolean> {
  const raw = await chrome.storage.local.get<ExtensionLocalStorage>(DEFAULT_STORAGE);
  return readEnabled(raw);
}

async function syncRedirectState() {
  await setRedirect(await isEnabled());
}

async function persistToggle(enabled: boolean) {
  await chrome.storage.local.set({ enabled });
  await setRedirect(enabled);
}

chrome.runtime.onInstalled.addListener(() => {
  void syncRedirectState();
});

chrome.runtime.onStartup.addListener(() => {
  void syncRedirectState();
});

chrome.runtime.onMessage.addListener((message: unknown) => {
  if (!isToggleMessage(message)) return;
  void persistToggle(message.enabled);
});
