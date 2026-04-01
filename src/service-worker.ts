import type { ToggleMessage } from "./types";

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
  const { enabled } = await chrome.storage.local.get({ enabled: true });
  return enabled as boolean;
}

async function syncRedirectState() {
  await setRedirect(await isEnabled());
}

chrome.runtime.onInstalled.addListener(syncRedirectState);
chrome.runtime.onStartup.addListener(syncRedirectState);

chrome.runtime.onMessage.addListener((message: ToggleMessage) => {
  if (message.type === "toggle") {
    chrome.storage.local.set({ enabled: message.enabled });
    setRedirect(message.enabled);
  }
});
