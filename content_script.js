// content_script.js

console.log("My Simple AdBlocker: Content script loaded.");

// This function will attempt to hide elements that match common ad selectors.
// In a real ad blocker, this list would be huge and regularly updated.
const commonAdSelectors = [
    '.ad',            // Class named 'ad'
    '.ads',           // Class named 'ads'
    '.google-ads',    // Class named 'google-ads'
    'div[id*="ad-"]', // Divs with IDs containing 'ad-'
    'iframe[src*="ads"]', // Iframes with 'ads' in their source URL
    '[class*="banner-ad"]', // Any element with a class containing 'banner-ad'
    '.ad-container'
];

function hideElements() {
    let hiddenCount = 0;
    commonAdSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(element => {
            if (element.style.display !== 'none') { // Only hide if not already hidden
                element.style.setProperty('display', 'none', 'important'); // Use 'important' to override inline styles
                hiddenCount++;
            }
        });
    });
    if (hiddenCount > 0) {
        console.log(`My Simple AdBlocker: Hidden ${hiddenCount} elements on this page.`);
    }
}

// Run the hiding function and initialize MutationObserver when the DOM is fully loaded
window.addEventListener('DOMContentLoaded', () => {
    hideElements(); // Initial hiding of elements

    // Also, use a MutationObserver to detect and hide elements that are
    // dynamically added to the page after initial load.
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length > 0) {
                hideElements(); // Re-run hideElements when new nodes are added
            }
        });
    });

    // Start observing the entire document body for changes
    // { childList: true, subtree: true } means observe direct children and their descendants
    // We check if document.body exists, though DOMContentLoaded should ensure it.
    if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
    } else {
        console.warn("My Simple AdBlocker: document.body not found for MutationObserver.");
    }
});