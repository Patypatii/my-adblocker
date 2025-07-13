# My Simple AdBlocker 🚫

## Overview
My Simple AdBlocker is a basic browser extension designed to block common advertisements and trackers, aiming to provide a cleaner and faster Browse experience. This project serves as a practical demonstration of building a content blocker using **Manifest V3** APIs, specifically focusing on `declarativeNetRequest` for network blocking and content scripts for cosmetic filtering.

---

## Features ✨
* **Ad Blocking:** Blocks common ad network requests.
* **Tracker Blocking:** Prevents known tracking scripts from loading (basic implementation).
* **Cosmetic Filtering:** Hides visible ad elements on webpages that might not be blocked at the network level.
* **Toggle Control:** Easily enable or disable the blocker from the extension popup.
* **Options Page:** A dedicated page for future configuration and settings.
* **Resource-Efficient:** Built with Manifest V3's performance-oriented design.

---

## How it Works 🛠️
* **`manifest.json`**: The core configuration file for the extension, declaring permissions, scripts, and UI.
* **`background.js` (Service Worker)**:
    * Utilizes the **`chrome.declarativeNetRequest` API** to efficiently block network requests (ads, trackers) based on predefined rules. This API handles blocking natively within the browser, offering superior performance and privacy compared to older methods.
    * Manages the state of the blocker (enabled/disabled) using `chrome.storage.local`.
* **`content_script.js`**:
    * Injected into every webpage.
    * Performs **cosmetic filtering** by identifying and hiding visible elements (e.g., empty ad containers, residual ad spaces) using CSS.
    * Uses a `MutationObserver` to dynamically hide elements that are added to the page after the initial load.
* **`popup.html` & `popup.js`**:
    * Provides a simple user interface when the extension icon is clicked.
    * Allows users to toggle the ad blocker on/off.
    * Displays the current status of the blocker.
* **`options.html` & `options.js`**:
    * A dedicated page for more advanced settings and configurations (currently includes placeholders for future features like blocking specific trackers or allowing non-intrusive ads).

---

## Installation (Developer Mode) 🚀

To install and run this extension in your browser:

1.  **Clone the Repository (or download the ZIP):**
    ```bash
    git clone [https://github.com/your-username/my-simple-adblocker-clone.git](https://github.com/your-username/my-simple-adblocker-clone.git)
    cd my-simple-adblocker-clone
    ```
    (If you don't have a Git repository yet, just make sure you have the `my-adblocker-clone` folder with all the generated files.)

2.  **Open your Browser's Extension Page:**
    * **Chrome/Brave/Edge:** Go to `chrome://extensions/`
    * **Firefox:** Go to `about:debugging#/runtime/this-firefox`

3.  **Enable Developer Mode:**
    * In Chrome/Edge, toggle on **"Developer mode"** in the top right corner.
    * In Firefox, this step is not needed as it's part of the `about:debugging` page.

4.  **Load the Extension:**
    * Click **"Load unpacked"** (Chrome/Edge) or **"Load Temporary Add-on..."** (Firefox).
    * Navigate to and select the `my-adblocker-clone` folder (the one containing `manifest.json`).

5.  **You should now see "My Simple AdBlocker" listed!** Click its icon in the toolbar to interact with it.

---

## Future Enhancements 💡
* **Comprehensive Filter List Parsing:** Implement robust parsing for standard ad-blocking filter lists (e.g., EasyList, EasyPrivacy) to vastly improve blocking capabilities.
* **Automatic Filter List Updates:** Mechanism to fetch and apply updated filter lists periodically.
* **Whitelisting/Blacklisting:** Allow users to specify websites where the blocker should (or shouldn't) run.
* **Element Picker Tool:** An interactive tool similar to uBlock Origin's element picker for users to select and block specific elements on a page.
* **Advanced Cosmetic Filtering:** More sophisticated methods to hide ad containers and prevent "anti-adblock" messages.
* **Performance Optimization:** Further fine-tuning for minimal resource usage.
* **Detailed Statistics:** Display how many ads/trackers have been blocked on the current page or globally.

---

## Contributing 🤝
Contributions are welcome! If you have suggestions for improvements or want to add new features, please open an issue or submit a pull request.

---

## License 📄
This project is open-source and available under the [MIT License](LICENSE).

---

## Disclaimer ⚠️
This is a **learning project** and a basic demonstration. It is not intended to be a full-fledged replacement for mature, professionally maintained ad blockers like uBlock Origin. While it implements core concepts, it lacks the extensive, constantly updated filter lists and sophisticated anti-adblock circumvention techniques of such tools.