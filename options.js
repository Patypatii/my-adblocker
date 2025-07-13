// options.js

document.addEventListener('DOMContentLoaded', () => {
    const blockTrackersCheckbox = document.getElementById('blockTrackersCheckbox');
    const allowNonIntrusiveAdsCheckbox = document.getElementById('allowNonIntrusiveAdsCheckbox');
    const saveOptionsButton = document.getElementById('saveOptions');
    const statusMessage = document.getElementById('statusMessage');

    // Function to load saved options
    function loadOptions() {
        chrome.storage.local.get(['blockTrackers', 'allowNonIntrusiveAds'], (result) => {
            blockTrackersCheckbox.checked = result.blockTrackers !== undefined ? result.blockTrackers : true; // Default to true
            allowNonIntrusiveAdsCheckbox.checked = result.allowNonIntrusiveAds !== undefined ? result.allowNonIntrusiveAds : false; // Default to false
            // Note: 'Allow Non-Intrusive Ads' is just a placeholder UI element, not functional yet.
        });
    }

    // Function to save options
    function saveOptions() {
        chrome.storage.local.set({
            blockTrackers: blockTrackersCheckbox.checked,
            allowNonIntrusiveAds: allowNonIntrusiveAdsCheckbox.checked
        }, () => {
            statusMessage.textContent = 'Settings saved!';
            statusMessage.style.color = 'green';
            setTimeout(() => {
                statusMessage.textContent = '';
            }, 3000); // Clear message after 3 seconds

            // In a real scenario, saving options might trigger background.js
            // to update its rules (e.g., if tracker blocking is enabled/disabled).
            // For now, we'll just save the state.
            console.log("Options saved:", {
                blockTrackers: blockTrackersCheckbox.checked,
                allowNonIntrusiveAds: allowNonIntrusiveAdsCheckbox.checked
            });
        });
    }

    // Load options when the page is loaded
    loadOptions();

    // Add event listener to the save button
    saveOptionsButton.addEventListener('click', saveOptions);
});