// Background Service Worker for Smart Tab Switching and WhatsApp Session Protection

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "OPEN_OR_FOCUS_WHATSAPP") {
    const { phone, msgId, messageSnippet } = request;
    const cleanPhone = (phone || "").replace(/\D/g, "");

    // Query for any existing WhatsApp Web tabs
    chrome.tabs.query({ url: "*://web.whatsapp.com/*" }, (tabs) => {
      if (tabs && tabs.length > 0) {
        // WhatsApp tab already exists! Focus it instead of opening a duplicate session
        const targetTab = tabs[0];

        // Focus the tab
        chrome.tabs.update(targetTab.id, { active: true }, (updatedTab) => {
          if (targetTab.windowId) {
            chrome.windows.update(targetTab.windowId, { focused: true });
          }
        });

        // Instruct the WhatsApp content script to navigate internally to the client's chat and scroll to message
        chrome.tabs.sendMessage(targetTab.id, {
          type: "EXTERNAL_NAVIGATE_TO_CHAT",
          phone: cleanPhone || phone,
          msgId: msgId,
          messageSnippet: messageSnippet
        }, (response) => {
          if (chrome.runtime.lastError) {
            // In case content script was reloading, the BroadcastChannel will also handle it
            console.log("Direct tab message sent with response:", response);
          }
        });

        sendResponse({ status: "focused_existing", tabId: targetTab.id });
      } else {
        // No WhatsApp tab is currently open, create a single new active tab
        const targetUrl = cleanPhone ? `https://web.whatsapp.com/send?phone=${cleanPhone}` : "https://web.whatsapp.com";
        chrome.tabs.create({ url: targetUrl, active: true }, (newTab) => {
          sendResponse({ status: "created_new", tabId: newTab.id });
        });
      }
    });

    return true; // Keep sendResponse channel open for async response
  }
});

// Auto-refresh relevant active tabs when extension updates/reloads
chrome.runtime.onInstalled.addListener(() => {
  chrome.tabs.query({}, (tabs) => {
    if (!tabs) return;
    tabs.forEach((tab) => {
      if (tab.url && (tab.url.includes("whatsapp.com") || tab.url.includes("priza.net"))) {
        try {
          chrome.tabs.reload(tab.id);
        } catch (e) {}
      }
    });
  });
});

