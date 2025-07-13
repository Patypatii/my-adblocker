// background.js

// Import the parser function from filterParser.js
import { parseFilterRule } from './filterParser.js';

console.log("My Simple AdBlocker: Background Service Worker loaded.");

// A sample set of ABP-like filter rules.
// In a real ad blocker, this would be fetched from remote sources.
const SAMPLE_ABP_RULES = [
    "||doubleclick.net^",
    "||googlesyndication.com^",
    "||google-analytics.com^",
    "/ads/image.gif",
    "/banner/$image", // Block 'banner' path only for images
    "||tracking.example.com^$script", // Block tracking.example.com only for scripts
    "@@||allowedsite.com^", // Example whitelist rule (should override blocks)
    "||malicious.site^$domain=badsite.com|~goodsite.com" // Block malicious.site only on badsite.com, not on goodsite.com
];

let activeBlockingRules = []; // To store the parsed declarativeNetRequest rules

// Function to parse ABP rules and set declarativeNetRequest rules
async function setDeclarativeNetRequestRules() {
    activeBlockingRules = []; // Clear previous rules
    let ruleIdCounter = 1; // Start ID counter

    for (const ruleText of SAMPLE_ABP_RULES) {
        if (ruleText.startsWith("!") || ruleText.startsWith("#")) {
            // Ignore comments and cosmetic rules starting with # (for now)
            continue;
        }
        try {
            const parsedRule = parseFilterRule(ruleText, ruleIdCounter++);
            if (parsedRule) {
                activeBlockingRules.push(parsedRule);
            }
        } catch (e) {
            console.warn(`My Simple AdBlocker: Failed to parse rule "${ruleText}":`, e);
        }
    }

    try {
        // Clear all existing dynamic rules before adding new ones
        const currentRules = await chrome.declarativeNetRequest.getDynamicRules();
        const ruleIdsToRemove = currentRules.map(rule => rule.id);

        await chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: ruleIdsToRemove,
            addRules: activeBlockingRules
        });
        console.log(`My Simple AdBlocker: ${activeBlockingRules.length} declarativeNetRequest rules updated successfully.`);
    } catch (error) {
        console.error("My Simple AdBlocker: Error updating declarativeNetRequest rules:", error);
    }
}

// Function to enable blocking (by setting rules)
async function enableBlocking() {
    await setDeclarativeNetRequestRules();
    console.log("My Simple AdBlocker: Blocking enabled.");
}

// Function to disable blocking (by removing all dynamic rules)
async function disableBlocking() {
    try {
        const currentRules = await chrome.declarativeNetRequest.getDynamicRules();
        const ruleIdsToRemove = currentRules.map(rule => rule.id);
        await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: ruleIdsToRemove });
        console.log("My Simple AdBlocker: Blocking disabled.");
    } catch (error) {
        console.error("My Simple AdBlocker: Error disabling blocking rules:", error);
    }
}

// Listen for the extension being installed or updated
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ isBlockingEnabled: true }, () => {
        enableBlocking(); // Enable blocking by default on install
    });
});

// Also enable on startup in case the service worker was terminated
chrome.runtime.onStartup.addListener(() => {
    chrome.storage.local.get("isBlockingEnabled", (data) => {
        if (data.isBlockingEnabled) {
            enableBlocking();
        }
    });
});


// Listen for messages from the popup or options page
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "toggleBlocking") {
        if (message.enabled) {
            enableBlocking();
        } else {
            disableBlocking();
        }
        chrome.storage.local.set({ isBlockingEnabled: message.enabled });
        sendResponse({ status: "ok" });
    } else if (message.type === "getBlockingStatus") {
        chrome.storage.local.get("isBlockingEnabled", (data) => {
            sendResponse({ enabled: data.isBlockingEnabled });
        });
        return true; // Indicate that sendResponse will be called asynchronously
    }
});