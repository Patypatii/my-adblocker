// filterParser.js

// This function will parse a single ABP-like filter rule
// and convert it into a declarativeNetRequest rule.
// It's simplified for common cases.
function parseFilterRule(ruleText, ruleId) {
    let actionType = "block";
    let urlFilter = ruleText;
    let resourceTypes = ["main_frame", "sub_frame", "script", "image", "stylesheet", "object", "xmlhttprequest", "ping", "media", "font", "csp_report", "other"]; // Default to all common types
    let domains = [];
    let excludedDomains = [];

    // Check for whitelist rule
    if (ruleText.startsWith("@@")) {
        actionType = "allow";
        urlFilter = ruleText.substring(2); // Remove '@@'
    }

    // Check for options (e.g., $script, $image, $domain=)
    const optionsIndex = urlFilter.indexOf('$');
    if (optionsIndex !== -1) {
        const optionsString = urlFilter.substring(optionsIndex + 1);
        urlFilter = urlFilter.substring(0, optionsIndex); // Remove options from URL filter

        const options = optionsString.split(',');
        resourceTypes = []; // Reset default if specific types are provided

        options.forEach(option => {
            if (option === "script") resourceTypes.push("script");
            else if (option === "image") resourceTypes.push("image");
            else if (option === "stylesheet") resourceTypes.push("stylesheet");
            else if (option === "media") resourceTypes.push("media");
            else if (option === "font") resourceTypes.push("font");
            else if (option === "xmlhttprequest") resourceTypes.push("xmlhttprequest");
            else if (option === "main_frame") resourceTypes.push("main_frame");
            else if (option === "sub_frame") resourceTypes.push("sub_frame");
            // Add more resource types as needed

            // Handle domain option: $domain=example.com|~anothersite.com
            if (option.startsWith("domain=")) {
                const domainList = option.substring("domain=".length);
                domainList.split('|').forEach(dom => {
                    if (dom.startsWith("~")) {
                        excludedDomains.push(dom.substring(1));
                    } else {
                        domains.push(dom);
                    }
                });
            }
        });

        // If no specific resource types were mentioned in options, revert to all default types
        if (resourceTypes.length === 0) {
            resourceTypes = ["main_frame", "sub_frame", "script", "image", "stylesheet", "object", "xmlhttprequest", "ping", "media", "font", "csp_report", "other"];
        }
    }

    // Convert ABP specific symbols to declarativeNetRequest patterns
    // ||example.com^ -> *://*.example.com/* or *://example.com/* depending on context
    // The `^` character acts as a separator. For `declarativeNetRequest`, we typically
    // translate these to hostname filters or more explicit `urlFilter`s.
    if (urlFilter.startsWith("||") && urlFilter.endsWith("^")) {
        const domain = urlFilter.substring(2, urlFilter.length - 1);
        urlFilter = `*://*.${domain}/*`; // Blocks subdomains as well
        // Also add the base domain: *://domain.com/*
        // For simplicity, we'll stick to wildcard subdomains for now.
    } else if (urlFilter.startsWith("||")) { // ||example.com (without ^ implies exact domain)
        const domain = urlFilter.substring(2);
        urlFilter = `*://*.${domain}/*`;
    } else if (urlFilter.endsWith("^")) { // path/to/resource^
        urlFilter = urlFilter.substring(0, urlFilter.length - 1) + '*'; // Trailing wildcard for completeness
    } else if (urlFilter.startsWith("/")) { // /path/to/resource
        urlFilter = `*${urlFilter}*`; // Assume wildcards around paths
    }


    const rule = {
        id: ruleId,
        priority: 1, // Will need a more sophisticated priority system later
        action: { type: actionType },
        condition: { urlFilter: urlFilter }
    };

    if (resourceTypes.length > 0) {
        rule.condition.resourceTypes = resourceTypes;
    }
    if (domains.length > 0) {
        rule.condition.requestDomains = domains;
    }
    if (excludedDomains.length > 0) {
        rule.condition.excludedRequestDomains = excludedDomains;
    }

    return rule;
}

// Export the function so background.js can use it
// In Manifest V3, service workers use ES Modules, so use 'export'
export { parseFilterRule };