// popup.js

document.addEventListener('DOMContentLoaded', () => {
    const blockerToggle = document.getElementById('blockerToggle');
    const blockerStatus = document.getElementById('blockerStatus');

    // Get initial blocking status from background script
    chrome.runtime.sendMessage({ type: "getBlockingStatus" }, (response) => {
        if (response && typeof response.enabled === 'boolean') {
            blockerToggle.checked = response.enabled;
            blockerStatus.textContent = response.enabled ? "Enabled" : "Disabled";
            blockerStatus.style.color = response.enabled ? "green" : "red";
        } else {
            blockerStatus.textContent = "Error loading status.";
            blockerStatus.style.color = "orange";
        }
    });

    // Listen for changes on the toggle switch
    blockerToggle.addEventListener('change', (event) => {
        const enabled = event.target.checked;
        blockerStatus.textContent = enabled ? "Enabled" : "Disabled";
        blockerStatus.style.color = enabled ? "green" : "red";

        // Send message to background script to toggle blocking
        chrome.runtime.sendMessage({ type: "toggleBlocking", enabled: enabled }, (response) => {
            if (response && response.status === "ok") {
                console.log("Blocking toggled successfully.");
            } else {
                console.error("Failed to toggle blocking.");
            }
        });
    });
});