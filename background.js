// background.js

console.log("My Simple AdBlocker: Background Service Worker loaded.");

// Define an array of declarativeNetRequest rules
const BLOCKING_RULES = [
    {
        id: 1,
        priority: 1,
        action: { type: "block" },
        condition: {
            urlFilter: "doubleclick.net",
            resourceTypes: ["script", "image", "media", "stylesheet", "font", "xmlhttprequest", "ping", "csp_report", "main_frame", "sub_frame", "other"]
        }
    },
    {
        id: 2,
        priority: 1,
        action: { type: "block" },
        condition: {
            urlFilter: "googlesyndication.com",
            resourceTypes: ["script", "image", "media", "stylesheet", "font", "xmlhttprequest", "ping", "csp_report", "main_frame", "sub_frame", "other"]
        }
    },
    {
        id: 3,
        priority: 1,
        action: { type: "block" },
        condition: {
            urlFilter: "/ads/",
            resourceTypes: ["image", "script", "stylesheet"]
        }
    }
];

// Function to set (or update) the dynamic declarativeNetRequest rules
async function updateBlockingRules() {
    try {
        const currentRules = await chrome.declarativeNetRequest.getDynamicRules();
        const ruleIdsToRemove = currentRules.map(rule => rule.id);

        await chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: ruleIdsToRemove,
            addRules: BLOCKING_RULES
        });
        console.log("My Simple AdBlocker: Blocking rules updated successfully.");
    } catch (error) {
        console.error("My Simple AdBlocker: Error updating blocking rules:", error);
    }
}

// Listen for the extension being installed or updated
chrome.runtime.onInstalled.addListener(() => {
    updateBlockingRules();
    // Set initial blocking state to true
    chrome.storage.local.set({ isBlockingEnabled: true });
});

// Listen for messages from the popup or options page
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "toggleBlocking") {
        if (message.enabled) {
            updateBlockingRules();
            console.log("My Simple AdBlocker: Blocking re-enabled.");
        } else {
            chrome.declarativeNetRequest.updateDynamicRules({
                removeRuleIds: BLOCKING_RULES.map(rule => rule.id)
            }).then(() => {
                console.log("My Simple AdBlocker: Blocking temporarily disabled.");
            }).catch(error => {
                console.error("Error disabling rules:", error);
            });
        }
        chrome.storage.local.set({ isBlockingEnabled: message.enabled }); // Save state
        sendResponse({ status: "ok" });
    } else if (message.type === "getBlockingStatus") {
        chrome.storage.local.get("isBlockingEnabled", (data) => {
            sendResponse({ enabled: data.isBlockingEnabled });
        });
        return true; // Indicate that sendResponse will be called asynchronously
    }
});