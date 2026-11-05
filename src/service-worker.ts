import { GROKIPEDIA_ARTICLE_SUBSTITUTION, WIKIPEDIA_ARTICLE_FILTER } from "./redirect";
import { onEnabledChanged, readEnabled } from "./storage";

const RULE_ID = 1;

const REDIRECT_RULE: chrome.declarativeNetRequest.Rule = {
  id: RULE_ID,
  priority: 1,
  action: {
    type: chrome.declarativeNetRequest.RuleActionType.REDIRECT,
    redirect: { regexSubstitution: GROKIPEDIA_ARTICLE_SUBSTITUTION },
  },
  condition: {
    regexFilter: WIKIPEDIA_ARTICLE_FILTER,
    isUrlFilterCaseSensitive: false,
    resourceTypes: [chrome.declarativeNetRequest.ResourceType.MAIN_FRAME],
  },
};

async function setRedirect(enabled: boolean): Promise<void> {
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [RULE_ID],
    addRules: enabled ? [REDIRECT_RULE] : [],
  });
}

// Dynamic rules persist across browser restarts, so the rule only needs to be
// (re)applied on install or update, and whenever the stored toggle changes.
chrome.runtime.onInstalled.addListener(() => {
  void readEnabled().then(setRedirect);
});

onEnabledChanged((enabled) => {
  void setRedirect(enabled);
});
