/**
 * This script runs in the MAIN world (page execution context) of WhatsApp Web.
 * It bypasses the isolated Chrome Extension context to avoid prototype mismatch errors
 * when constructing File, Blob, and DataTransfer objects.
 */

console.log("Main World: main-world.js loaded successfully.");

// Store the original click method
const originalInputClick = HTMLInputElement.prototype.click;

// Global container to hold the file and caption to be injected when a click is intercepted
window.pendingSyllabusFile = null;
window.pendingSyllabusCaption = null;

// Diagnostic toast helper for real-time visual feedback to the user
function showToast(message, isError = false) {
  let toast = document.getElementById("wa-assistant-diagnostic-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "wa-assistant-diagnostic-toast";
    toast.style.position = "fixed";
    toast.style.bottom = "24px";
    toast.style.right = "24px";
    toast.style.backgroundColor = "rgba(15, 23, 42, 0.95)";
    toast.style.color = "#ffffff";
    toast.style.padding = "14px 20px";
    toast.style.borderRadius = "10px";
    toast.style.boxShadow = "0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2)";
    toast.style.zIndex = "999999";
    toast.style.fontFamily = "Segoe UI, -apple-system, BlinkMacSystemFont, Roboto, sans-serif";
    toast.style.fontSize = "13px";
    toast.style.fontWeight = "600";
    toast.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
    toast.style.direction = "rtl";
    toast.style.borderLeft = "5px solid #3b82f6";
    toast.style.display = "flex";
    toast.style.alignItems = "center";
    toast.style.gap = "8px";
    (document.body || document.documentElement).appendChild(toast);
  }
  
  toast.style.borderLeftColor = isError ? "#ef4444" : "#10b981";
  toast.innerHTML = isError 
    ? `⚠️ <span style="margin-right: 4px;">${message}</span>`
    : `✨ <span style="margin-right: 4px;">${message}</span>`;
  toast.style.opacity = "1";
  toast.style.transform = "translateY(0)";
  
  // Auto-hide after 5 seconds
  if (window.toastTimeout) clearTimeout(window.toastTimeout);
  window.toastTimeout = setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
  }, 5000);
}

// Override click on HTMLInputElement globally in page context
// This intercepts WhatsApp's programmatic .click() on the hidden file input
// and injects the pending syllabus file directly, preventing the native file picker dialog!
HTMLInputElement.prototype.click = function() {
  if (this.type === 'file' && window.pendingSyllabusFile) {
    console.log("Main World: Intercepted HTMLInputElement.click() on file input!");
    const fileObj = window.pendingSyllabusFile;
    window.pendingSyllabusFile = null; // consume file
    
    try {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(fileObj);
      
      // Bypass React wrapper to set files list directly on the native element
      const filesSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'files').set;
      filesSetter.call(this, dataTransfer.files);
      
      // Dispatch events to trigger WhatsApp's React event listeners
      this.dispatchEvent(new Event("change", { bubbles: true }));
      this.dispatchEvent(new Event("input", { bubbles: true }));
      
      console.log("Main World: File injected successfully into native input.");
      showToast("הסילבוס הועלה לצ'אט בהצלחה!");
      
      if (window.pendingSyllabusCaption) {
        startCaptionPolling(window.pendingSyllabusCaption);
        window.pendingSyllabusCaption = null; // consume
      }
    } catch (e) {
      console.error("Main World: Intercepted click injection failed:", e);
      // Fallback: run original click if programmatic override fails
      originalInputClick.apply(this, arguments);
    }
  } else {
    // Normal behavior for user-initiated manual uploads
    originalInputClick.apply(this, arguments);
  }
};

// Helper to simulate a native user mouse click (dispatching pointerdown, mousedown, pointerup, mouseup, click)
function clickElement(el) {
  try {
    if (!el) return;
    const clickTarget = el.querySelector('[role="button"]') || 
                        el.querySelector('[role="gridcell"]') ||
                        el.querySelector('[data-testid="cell-frame-container"]') || 
                        el.querySelector('div[class*="cell"]') ||
                        el.querySelector('img') ||
                        el;
    
    const opts = { bubbles: true, cancelable: true, view: window };
    try { clickTarget.dispatchEvent(new PointerEvent("pointerdown", opts)); } catch(e) {}
    try { clickTarget.dispatchEvent(new MouseEvent("mousedown", opts)); } catch(e) {}
    try { clickTarget.dispatchEvent(new PointerEvent("pointerup", opts)); } catch(e) {}
    try { clickTarget.dispatchEvent(new MouseEvent("mouseup", opts)); } catch(e) {}
    try { clickTarget.dispatchEvent(new MouseEvent("click", opts)); } catch(e) {}
    try { if (typeof clickTarget.click === "function") clickTarget.click(); } catch(e) {}
  } catch (e) {
    try { el.click(); } catch(err) {}
  }
}

// Helper to decode Base64 data to a Blob natively in Main World
function base64ToBlob(base64Data) {
  try {
    let contentType = 'application/pdf';
    let base64Str = base64Data;
    
    if (base64Data && base64Data.includes(';base64,')) {
      const parts = base64Data.split(';base64,');
      contentType = parts[0].split(':')[1] || 'application/pdf';
      base64Str = parts[1];
    }
    
    const raw = window.atob(base64Str);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);
    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], { type: contentType });
  } catch (err) {
    console.error("Main World: base64ToBlob failed:", err);
    throw err;
  }
}

// Helper to trigger Document upload by programmatically clicking Attach -> Document
function triggerNativeDocumentUpload() {
  const chatArea = document.querySelector("#main");
  if (!chatArea) {
    showToast("שגיאה: לא נמצאה שיחה פעילה בוואטסאפ.", true);
    window.pendingSyllabusFile = null;
    return false;
  }

  // CRITICAL UX SAFETY: Focus search exclusively to the chat input footer (composer)
  const composer = chatArea.querySelector('footer') || 
                   chatArea.querySelector('[data-testid="composer-background"]') || 
                   chatArea;

  // 1. Try composer-specific selectors first
  let attachBtn = composer.querySelector('[data-testid="chat-plus"]') ||
                  composer.querySelector('[data-icon="chat-plus"]') ||
                  composer.querySelector('[data-testid="clip"]') || 
                  composer.querySelector('[data-testid="plus"]') || 
                  composer.querySelector('button[title*="צרוף"]') ||
                  composer.querySelector('button[title*="צירוף"]') ||
                  composer.querySelector('span[data-icon="clip"]') ||
                  composer.querySelector('span[data-icon="plus"]');
                  
  // 2. Search inside the composer area only using Hebrew/English titles
  if (!attachBtn) {
    const allEls = Array.from(composer.querySelectorAll('button, div, span, [role="button"]'));
    attachBtn = allEls.find(el => {
      const title = (el.getAttribute('title') || '').toLowerCase();
      const label = (el.getAttribute('aria-label') || '').toLowerCase();
      return title.includes('צרוף') || title.includes('צירוף') || title.includes('הוספה') || 
             label.includes('צרוף') || label.includes('צירוף') || label.includes('הוספה') ||
             title.includes('attach') || label.includes('attach') ||
             title.includes('plus') || label.includes('plus');
    });
  }

  // 3. Proximity search next to conversation text input (within composer parent tree only)
  if (!attachBtn) {
    const textInput = composer.querySelector('[contenteditable="true"]') || 
                      composer.querySelector('[data-testid="conversation-text-input"]');
    if (textInput) {
      let parent = textInput.parentElement;
      for (let i = 0; i < 4 && parent; i++) {
        const buttons = Array.from(parent.querySelectorAll('button, [role="button"], [data-testid*="plus"], [data-icon*="plus"]'));
        if (buttons.length > 0) {
          attachBtn = buttons.find(b => b.querySelector('[data-icon]') || b.getAttribute('data-icon') || b.querySelector('span')) || buttons[0];
          break;
        }
        parent = parent.parentElement;
      }
    }
  }
                    
  if (!attachBtn) {
    showToast("שגיאה: לא נמצא כפתור צירוף קבצים בשורת הכתיבה.", true);
    window.pendingSyllabusFile = null;
    return false;
  }

  showToast("מאתר ומפעיל את תפריט הצירוף בוואטסאפ...");

  // Click the attach button using full mouse simulation
  clickElement(attachBtn);
  
  // Wait and poll for the Document option to mount (up to 2000ms)
  let attempts = 0;
  const pollInterval = setInterval(() => {
    attempts++;
    let docBtn = document.querySelector('[data-testid="attach-document"]') || 
                 document.querySelector('button[aria-label*="מסמך"]') ||
                 document.querySelector('button[title*="מסמך"]') ||
                 document.querySelector('span[data-icon="attach-document"]') ||
                 document.querySelector('li[data-testid*="document"]') ||
                 document.querySelector('[data-testid="mi-document"]') ||
                 document.querySelector('[data-testid="mi-attach-document"]') ||
                 document.querySelector('[data-testid="attach-menu-item-document"]') ||
                 document.querySelector('[data-testid*="document"]') ||
                 document.querySelector('[data-testid*="doc"]') ||
                 document.querySelector('[data-icon*="document"]') ||
                 document.querySelector('[data-icon*="doc"]');
                 
    if (!docBtn) {
      // Find element containing the word "מסמך" or "document" (multilingual fallback)
      const elements = Array.from(document.querySelectorAll('span, div, button, li, p'));
      docBtn = elements.find(el => {
        const text = (el.textContent || '').trim().toLowerCase();
        return text === "מסמך" || text === "document" || text.includes("מסמך");
      });
    }
                   
    if (docBtn) {
      clearInterval(pollInterval);
      showToast("מפעיל את כפתור בחירת המסמך...");
      clickElement(docBtn);
    } else if (attempts >= 40) { // 40 attempts * 50ms = 2000ms max wait
      clearInterval(pollInterval);
      console.log("Main World: Document menu option not found, closing menu...");
      showToast("שגיאה: לא נמצא כפתור 'מסמך' בתפריט הצירוף.", true);
      window.pendingSyllabusFile = null;
      clickElement(attachBtn); // close menu
    }
  }, 50);

  return true;
}

function injectWhatsAppTextMainWorld(textToInsert, shortcutToReplace) {
  try {
    const editor = document.querySelector('#main footer div[contenteditable="true"]') ||
                   document.querySelector('#main div[contenteditable="true"][data-tab="10"]') ||
                   document.querySelector('#main div[contenteditable="true"]');
    
    if (!editor) {
      console.warn("Main World: WhatsApp chat editor not found.");
      return;
    }

    editor.focus();

    // 1. Thoroughly wipe shortcut or existing typed text in the editor
    document.execCommand('selectAll', false, null);
    document.execCommand('delete', false, null);

    try {
      const walk = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT, null, false);
      let n;
      while (n = walk.nextNode()) {
        n.nodeValue = "";
      }
    } catch(e) {}

    // 2. Paste text natively using DataTransfer in the page execution context!
    // In the main page context, Lexical intercepts paste and automatically converts \n into real paragraphs!
    const dataTransfer = new DataTransfer();
    dataTransfer.setData('text/plain', textToInsert);
    const pasteEvent = new ClipboardEvent('paste', {
      bubbles: true,
      cancelable: true,
      composed: true,
      clipboardData: dataTransfer
    });
    editor.dispatchEvent(pasteEvent);

    // 3. Fallback check: If paste did not populate the editor, use line-by-line paragraph insertion
    setTimeout(() => {
      const editorText = (editor.innerText || editor.textContent || "").trim();
      if (editorText.length < 5 && textToInsert.trim().length > 0) {
        editor.focus();
        document.execCommand('selectAll', false, null);
        document.execCommand('delete', false, null);
        const lines = textToInsert.split(/\r?\n/);
        for (let i = 0; i < lines.length; i++) {
          if (i > 0) {
            document.execCommand('insertParagraph', false, null) || document.execCommand('insertLineBreak', false, null);
          }
          if (lines[i]) {
            document.execCommand('insertText', false, lines[i]);
          }
        }
        editor.dispatchEvent(new Event('input', { bubbles: true }));
        editor.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, 50);

    editor.dispatchEvent(new Event('input', { bubbles: true }));
    editor.dispatchEvent(new Event('change', { bubbles: true }));
    console.log("Main World: Text injected successfully into WhatsApp Web.");
  } catch (err) {
    console.error("Main World: injectWhatsAppTextMainWorld error:", err);
  }
}

window.addEventListener("message", async (event) => {
  const message = event.data;
  if (message && message.type === "WA_INJECT_TEXT") {
    injectWhatsAppTextMainWorld(message.text, message.shortcut);
  } else if (message && message.type === "WA_SEND_SYLLABUS") {
    try {
      console.log("Main World: Received WA_SEND_SYLLABUS request for:", message.file.fileName);
      showToast("מעבד את קובץ הסילבוס ושולח...");

      // Decode Base64 Data URL to Blob natively in Main World context
      const blob = base64ToBlob(message.file.data);

      // Construct native File object in page context
      const fileObj = new File([blob], message.file.fileName, { 
        type: blob.type || "application/pdf",
        lastModified: Date.now()
      });

      // Set the pending file and caption to be consumed by the intercepted click method
      window.pendingSyllabusFile = fileObj;
      window.pendingSyllabusCaption = message.file.caption || null;

      // Trigger native document menu navigation. 
      // The moment WhatsApp's JS calls click() on the file input, our prototype override will capture it!
      triggerNativeDocumentUpload();

    } catch (err) {
      window.pendingSyllabusFile = null;
      console.error("Main World: Error during syllabus upload flow:", err);
      showToast("שגיאה במהלך העלאת הסילבוס: " + err.message, true);
    }
  } else if (message && message.type === "WA_NAVIGATE_TO_CHAT") {
    let searchQuery = message.phone;
    const cleanNum = message.phone.replace(/\D/g, "");
    
    // Helper to check if two phone strings match regardless of local/intl format
    function phonesMatch(p1, p2) {
      const c1 = (p1 || "").replace(/\D/g, "");
      const c2 = (p2 || "").replace(/\D/g, "");
      if (!c1 || !c2) return false;
      const norm1 = c1.startsWith("0") ? "972" + c1.slice(1) : (c1.startsWith("972") ? c1 : "972" + c1);
      const norm2 = c2.startsWith("0") ? "972" + c2.slice(1) : (c2.startsWith("972") ? c2 : "972" + c2);
      return norm1 === norm2 || norm1.includes(norm2) || norm2.includes(norm1);
    }

    // Helper to detect if a sidebar chat item or search result is the user's self-chat
    function isSelfChatItem(item) {
      if (!item) return false;
      const titleEl = item.querySelector('[data-testid="cell-frame-title"]') || 
                       item.querySelector('[dir="auto"]') || 
                       item.querySelector('span[title]');
      if (!titleEl) return false;
      const titleText = (titleEl.title || titleEl.innerText || "").trim().toLowerCase();
      return (
        titleText.includes("ערן") || 
        titleText.includes("עצמי") || 
        titleText.includes("את/ה") || 
        titleText.includes("(את/ה)") || 
        titleText.includes("you")
      );
    }

    let formattedNum = cleanNum.startsWith("0") ? "972" + cleanNum.slice(1) : (cleanNum.startsWith("972") ? cleanNum : "972" + cleanNum);
    console.log("Main World: Received WA_NAVIGATE_TO_CHAT request. Target:", formattedNum);
    window.currentNavigatingPhone = formattedNum;
    window.currentNavigatingTime = Date.now();

    // Step 0: Always ensure any prior search query is cleaned up
    cleanupSearchBar();

    // Step 1: Click directly if already visible in sidebar list (STRICT Title matching ONLY, EXCLUDING self-chat!)
    try {
      const listItems = Array.from(document.querySelectorAll('#side [role="button"], #side [data-testid="cell-frame-container"]'));
      const targetChatItem = listItems.find(item => {
        if (isSelfChatItem(item)) return false; // Exclude self-chat from matching as client!
        
        const titleEl = item.querySelector('[data-testid="cell-frame-title"]') || 
                         item.querySelector('[dir="auto"]') || 
                         item.querySelector('span[title]');
        if (!titleEl) return false;
        
        const titleText = (titleEl.title || titleEl.innerText || "").trim();
        const cleanTitle = titleText.replace(/\D/g, "");
        if (cleanNum && cleanTitle.length >= 7) {
          return phonesMatch(cleanTitle, cleanNum) || phonesMatch(cleanTitle, searchQuery);
        }
        return false;
      });
      if (targetChatItem) {
        console.log("Main World: Found client chat in visible sidebar list by title, clicking directly.");
        clickElement(targetChatItem);
        cleanupSearchBar();
        return;
      }
    } catch (e) {
      console.warn("Main World: Direct sidebar click failed:", e);
    }

    // Step 2: Direct Native WhatsApp URL Navigation (0 search bar touching, 0 text in #side!)
    console.log("Main World: Opening chat via native URL handler for:", formattedNum);
    try {
      // Try internal Store Cmd router if available
      if (window.Store && window.Store.Cmd && typeof window.Store.Cmd.openChatAt === 'function') {
        try {
          window.Store.Cmd.openChatAt(formattedNum + '@c.us');
          cleanupSearchBar();
          return;
        } catch (stErr) {}
      }

      const navUrls = [
        `https://web.whatsapp.com/send?phone=${formattedNum}`,
        `https://api.whatsapp.com/send?phone=${formattedNum}`,
        `https://wa.me/${formattedNum}`
      ];
      
      let navContainer = document.querySelector('#main') || document.body || document.documentElement;
      let navLink = document.getElementById("wa-assistant-native-nav-link");
      if (!navLink) {
        navLink = document.createElement("a");
        navLink.id = "wa-assistant-native-nav-link";
        navLink.style.display = "none";
        navContainer.appendChild(navLink);
      }
      
      for (const url of navUrls) {
        navLink.setAttribute("href", url);
        navLink.setAttribute("target", "_self");
        
        const mouseEvt = new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window
        });
        navLink.dispatchEvent(mouseEvt);
      }

      cleanupSearchBar();
      
      // Check after 350ms if chat header opened cleanly
      setTimeout(() => {
        const mainHeader = document.querySelector('#main header');
        const headerText = mainHeader ? (mainHeader.innerText || "") : "";
        if (headerText && phonesMatch(headerText.replace(/\D/g, ""), formattedNum)) {
          console.log("Main World: Chat opened successfully via native URL handler!");
          cleanupSearchBar();
          return;
        }
        
        // Fallback: If native URL handler did not switch chat, trigger search bar automation as 3rd priority
        console.log("Main World: Native URL handler fallback to search automation...");
        runSearchBarFallback(searchQuery, cleanNum, formattedNum);
      }, 350);
      return;
    } catch (e) {
      console.warn("Main World: Native link navigation failed, running search fallback:", e);
      runSearchBarFallback(searchQuery, cleanNum, formattedNum);
      return;
    }
  }
});

// Helper function to force-clear input / contenteditable elements thoroughly
function forceClearSearchElement(el) {
  if (!el) return;
  try {
    el.focus();
    el.textContent = "";
    el.innerText = "";
    el.innerHTML = "";

    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
      if (nativeSetter) nativeSetter.call(el, "");
    }

    try {
      el.dispatchEvent(new InputEvent("input", { bubbles: true, cancelable: true, inputType: "deleteContentBackward" }));
    } catch (e) {}
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));

    const reactKey = Object.keys(el).find(k => k.startsWith('__reactFiber$') || k.startsWith('__reactProps$'));
    if (reactKey && el[reactKey] && el[reactKey].memoizedProps && typeof el[reactKey].memoizedProps.onChange === 'function') {
      try { el[reactKey].memoizedProps.onChange({ target: { value: "" } }); } catch(e) {}
    }

    const escOpts = { key: "Escape", code: "Escape", keyCode: 27, which: 27, bubbles: true, cancelable: true };
    el.dispatchEvent(new KeyboardEvent("keydown", escOpts));
    el.dispatchEvent(new KeyboardEvent("keyup", escOpts));
    el.blur();
  } catch (err) {
    console.warn("forceClearSearchElement error:", err);
  }
}

// Helper function to guarantee search bar in #side is thoroughly emptied and restored to normal
function cleanupSearchBar() {
  try {
    // 1. Clear all contenteditable / input fields inside #side & search containers
    const searchInputs = Array.from(document.querySelectorAll(
      '#side [data-testid="chat-list-search"] [contenteditable="true"], ' +
      '#side [contenteditable="true"], #side input, #side textarea, ' +
      '[data-testid="chat-list-search"] [contenteditable="true"], [data-testid="chat-list-search"] input'
    )).filter(el => !el.closest('#main'));

    searchInputs.forEach(searchInput => {
      forceClearSearchElement(searchInput);
    });

    // 2. Find and click all X, Back, Clear buttons or icons in #side
    const xIcons = Array.from(document.querySelectorAll(
      '#side [data-icon="x-alt"], #side [data-icon="x"], #side [data-icon="back"], ' +
      '#side [data-testid="x-alt"], #side [data-testid="search-back-button"], ' +
      '#side [data-testid="x"], #side [aria-label*="נקה"], #side [aria-label*="Clear"], ' +
      '#side [aria-label*="חזרה"], #side [aria-label*="ביטול"], ' +
      '[data-testid="chat-list-search"] button, [data-testid="search-back-button"]'
    ));

    xIcons.forEach(icon => {
      const target = icon.closest('button') || icon.closest('[role="button"]') || icon.parentElement || icon;
      clickElement(target);
    });

    // 3. Multi-stage delayed cleanup (50ms, 150ms, 300ms, 500ms, 800ms) to ensure React unmounts search view
    [50, 150, 300, 500, 800].forEach(delay => {
      setTimeout(() => {
        const remainingInputs = Array.from(document.querySelectorAll(
          '#side [contenteditable="true"], #side input, [data-testid="chat-list-search"] [contenteditable="true"], [data-testid="chat-list-search"] input'
        )).filter(el => !el.closest('#main'));

        remainingInputs.forEach(input => {
          if (input.textContent || (input.value && input.value.trim())) {
            forceClearSearchElement(input);
          }
        });

        const remainingIcons = Array.from(document.querySelectorAll(
          '#side [data-icon="x-alt"], #side [data-icon="x"], #side [data-icon="back"], ' +
          '#side [data-testid="search-back-button"], #side [data-testid="x-alt"], ' +
          '#side [aria-label*="נקה"], #side [aria-label*="Clear"]'
        ));
        remainingIcons.forEach(icon => {
          const target = icon.closest('button') || icon.closest('[role="button"]') || icon.parentElement || icon;
          clickElement(target);
        });
      }, delay);
    });

  } catch (e) {
    console.warn("Main World: Search bar cleanup error:", e);
  }
}

// Fallback search bar automation (only executed if direct link navigation did not open header)
function runSearchBarFallback(searchQuery, cleanNum, formattedNum) {
  try {
    let searchInput = document.querySelector('#side [data-testid="chat-list-search"] [contenteditable="true"]') ||
                      document.querySelector('#side [contenteditable="true"]') ||
                      document.querySelector('#side [aria-label*="search" i]') ||
                      document.querySelector('#side [aria-label*="חיפוש" i]') ||
                      document.querySelector('[data-testid="chat-list-search"] [contenteditable="true"]') ||
                      document.querySelector('#side input') ||
                      document.querySelector('#side textarea');
    
    if (!searchInput) {
      const editables = Array.from(document.querySelectorAll('[contenteditable="true"], input[type="text"], input:not([type]), textarea'));
      searchInput = editables.find(el => !el.closest('#main'));
    }

    if (searchInput) {
      try {
        const wrapper = searchInput.closest('[data-testid="chat-list-search"]') || searchInput.parentElement;
        if (wrapper) {
          const opts = { bubbles: true, cancelable: true, view: window };
          wrapper.dispatchEvent(new MouseEvent("mousedown", opts));
          wrapper.dispatchEvent(new MouseEvent("mouseup", opts));
          wrapper.dispatchEvent(new MouseEvent("click", opts));
        }
        searchInput.focus();
      } catch(e) {}
      
      try {
        if (searchInput.tagName === 'INPUT' || searchInput.tagName === 'TEXTAREA') {
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
          nativeInputValueSetter.call(searchInput, searchQuery);
          searchInput.dispatchEvent(new Event('input', { bubbles: true }));
        } else {
          searchInput.focus();
          const range = document.createRange();
          range.selectNodeContents(searchInput);
          const sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
          
          document.execCommand("delete", false, null);
          document.execCommand("insertText", false, searchQuery);
          
          if (!searchInput.textContent || searchInput.textContent.trim() !== searchQuery.trim()) {
            searchInput.textContent = searchQuery;
          }
          
          try {
            searchInput.dispatchEvent(new InputEvent("input", { bubbles: true, cancelable: true, inputType: "insertText", data: searchQuery }));
          } catch (e) {
            searchInput.dispatchEvent(new Event("input", { bubbles: true }));
          }
          
          const keyopts = { bubbles: true, cancelable: true, view: window };
          searchInput.dispatchEvent(new KeyboardEvent("keydown", keyopts));
          searchInput.dispatchEvent(new KeyboardEvent("keypress", keyopts));
          searchInput.dispatchEvent(new KeyboardEvent("keyup", keyopts));
        }
      } catch (err) {
        searchInput.innerText = searchQuery;
        searchInput.dispatchEvent(new Event("input", { bubbles: true }));
      }
      
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        
        const sideContainer = document.querySelector('#side') || document.body;
        const candidateNodes = Array.from(sideContainer.querySelectorAll('[role="button"], [data-testid*="cell"], [data-testid*="contact"], [tabindex="-1"], div[class*="cell"], span, div, p'))
          .filter(el => !el.contains(searchInput));

        let targetItem = null;

        for (const el of candidateNodes) {
          const text = (el.innerText || el.textContent || "").trim();
          if (text.includes("צ'אט עם") || text.includes("Chat with") || text.includes("שוחחו בצ'אט")) {
            const cleanText = text.replace(/\D/g, "");
            if (cleanNum && (phonesMatch(cleanText, cleanNum) || cleanText.includes(searchQuery))) {
              targetItem = el.closest('[role="button"]') || 
                           el.closest('[role="gridcell"]') || 
                           el.closest('[tabindex]') || 
                           el.closest('[data-testid*="cell"]') || 
                           el.parentElement || 
                           el;
              break;
            }
          }
        }

        if (!targetItem) {
          for (const el of candidateNodes) {
            if (isSelfChatItem(el)) continue;
            const titleEl = el.querySelector('[data-testid="cell-frame-title"]') || 
                             el.querySelector('[dir="auto"]') || 
                             el.querySelector('span[title]');
            if (!titleEl) continue;
            const titleText = (titleEl.title || titleEl.innerText || "").trim();
            const cleanTitle = titleText.replace(/\D/g, "");
            if (cleanNum && cleanTitle.length >= 7 && (phonesMatch(cleanTitle, cleanNum) || phonesMatch(cleanTitle, searchQuery))) {
              targetItem = el.closest('[role="button"]') || 
                           el.closest('[role="gridcell"]') || 
                           el.closest('[tabindex]') || 
                           el.closest('[data-testid*="cell"]') || 
                           el.parentElement || 
                           el;
              break;
            }
          }
        }

        if (targetItem) {
          clearInterval(interval);
          clickElement(targetItem);
          setTimeout(() => cleanupSearchBar(), 350);
        } else if (attempts >= 25) {
          clearInterval(interval);
          const rawTarget = cleanNum.startsWith("0") ? cleanNum : (cleanNum.startsWith("972") ? "0" + cleanNum.slice(3) : cleanNum);
          const displayTarget = rawTarget.length === 10 ? `${rawTarget.slice(0,3)}-${rawTarget.slice(3)}` : (rawTarget || searchQuery);
          showToast(`לא נמצא חשבון וואטסאפ עבור ${displayTarget}`, true);
          window.postMessage({ type: "WA_PHONE_NOT_FOUND", phone: displayTarget }, "*");
          setTimeout(() => cleanupSearchBar(), 150);
        }
      }, 100);
    }
  } catch (e) {
    console.warn("Main World: Search automation failed:", e);
  }
}

// Poll for the caption input element inside WhatsApp Web's document preview screen and insert the text
function startCaptionPolling(caption) {
  if (!caption || !caption.trim()) return;
  
  console.log("Main World: Starting polling for caption input...");
  let attempts = 0;
  const interval = setInterval(() => {
    attempts++;
    
    // Select the caption input box ONLY within the active media/document preview overlay
    const mediaDialog = document.querySelector('[data-animate-media-viewer="true"]') ||
                        document.querySelector('[data-testid="media-editor-container"]') ||
                        document.querySelector('div[role="dialog"]') ||
                        document.querySelector('#app [tabindex="-1"]');
    
    let captionInput = null;
    
    if (mediaDialog) {
      captionInput = mediaDialog.querySelector('[data-testid="media-editor-caption-input"]') ||
                     mediaDialog.querySelector('[data-testid="caption-input"]') ||
                     mediaDialog.querySelector('[aria-placeholder*="כיתוב"]') ||
                     mediaDialog.querySelector('[aria-placeholder*="caption"]') ||
                     mediaDialog.querySelector('[aria-label*="כיתוב"]') ||
                     mediaDialog.querySelector('[aria-label*="caption"]') ||
                     mediaDialog.querySelector('div[contenteditable="true"][data-tab="1"]') ||
                     mediaDialog.querySelector('div[contenteditable="true"]');
    }
    
    // Explicitly reject if element is inside the main chat footer or side pane
    if (captionInput && (captionInput.closest('#main footer') || captionInput.closest('.copyable-area') || captionInput.closest('#side'))) {
      captionInput = null;
    }
                         
    if (captionInput) {
      clearInterval(interval);
      console.log("Main World: Found caption input, scheduling insertion after stabilization delay...");
      
      // Wait 350ms for WhatsApp's file preview loading to stabilize and prevent race conditions
      setTimeout(() => {
        try {
          captionInput.focus();
          
          // Clear text values safely without destroying Draft.js React block nodes
          const walk = document.createTreeWalker(captionInput, NodeFilter.SHOW_TEXT, null, false);
          let node;
          while (node = walk.nextNode()) {
            node.nodeValue = "";
          }
          
          const selection = window.getSelection();
          const range = document.createRange();
          const targetNode = captionInput.querySelector('p, span[data-text="true"]') || captionInput;
          
          range.selectNodeContents(targetNode);
          range.collapse(false); // position cursor inside it
          selection.removeAllRanges();
          selection.addRange(range);
          
          // Write to clipboard as fallback so Ctrl+V works
          try {
            navigator.clipboard.writeText(caption);
          } catch (e) {
            console.warn("Main World: Failed to write to clipboard in main world context", e);
          }
          
          // 1. Try simulated paste event (most reliable for React state)
          const dataTransfer = new DataTransfer();
          dataTransfer.setData('text/plain', caption);
          const pasteEvent = new ClipboardEvent('paste', {
            bubbles: true,
            cancelable: true,
            clipboardData: dataTransfer
          });
          captionInput.dispatchEvent(pasteEvent);
          
          // Dispatch input events
          captionInput.dispatchEvent(new Event("input", { bubbles: true }));
          captionInput.dispatchEvent(new Event("change", { bubbles: true }));
          
          console.log("Main World: Caption stabilization insertion completed.");
        } catch (err) {
          console.error("Main World: Error during caption insertion:", err);
        }
      }, 350);
      
    } else if (attempts >= 60) { // 60 * 50ms = 3000ms max wait
      clearInterval(interval);
      console.warn("Main World: Caption input not found, falling back to clipboard copy");
      try {
        navigator.clipboard.writeText(caption);
      } catch (e) {}
    }
  }, 50);
}

// Continuously monitor for WhatsApp's native "Phone number is invalid / not on WhatsApp" modal popups
function watchForInvalidNumberDialog() {
  let lastHandledTime = 0;

  const observer = new MutationObserver(() => {
    try {
      const modals = document.querySelectorAll('div[role="dialog"], [data-animate-modal-popup="true"], [data-testid="popup-contents"], [data-testid="confirm-popup"]');
      for (const modal of modals) {
        const text = (modal.innerText || modal.textContent || "").toLowerCase();
        const isInvalidMsg = text.includes("אינו משתמש ב-whatsapp") ||
                             text.includes("אינו תקף") ||
                             text.includes("אינו רשום") ||
                             text.includes("לא רשום") ||
                             text.includes("לא משתמש") ||
                             text.includes("לא נמצא חשבון") ||
                             text.includes("not on whatsapp") ||
                             text.includes("is invalid") ||
                             text.includes("is not on whatsapp") ||
                             text.includes("phone number shared via url is invalid");
        
        if (isInvalidMsg && Date.now() - lastHandledTime > 1500) {
          lastHandledTime = Date.now();
          console.log("Main World: Detected WhatsApp invalid number popup dialog:", text);
          
          // Auto-click OK / Cancel to dismiss WhatsApp's native blocking modal cleanly
          const okBtn = modal.querySelector('button, [data-testid="popup-controls-ok"], [role="button"]');
          if (okBtn) {
            try { clickElement(okBtn); } catch(e) {}
          }
          
          let targetPhone = window.currentNavigatingPhone || "";
          const match = text.match(/(?:05\d-?\d{7}|972\d{8,9}|\d{9,12})/);
          if (match) targetPhone = match[0];
          
          let clean = (targetPhone || "").replace(/\D/g, "");
          if (clean.startsWith("972") && clean.length === 12) clean = "0" + clean.slice(3);
          const formatted = clean.length === 10 ? `${clean.slice(0,3)}-${clean.slice(3)}` : (clean || targetPhone || "זה");
          
          showToast(`לא נמצא חשבון וואטסאפ עבור ${formatted}`, true);
          window.postMessage({ type: "WA_PHONE_NOT_FOUND", phone: formatted }, "*");
          break;
        }
      }
    } catch(err) {
      console.warn("watchForInvalidNumberDialog error:", err);
    }
  });

  observer.observe(document.body || document.documentElement, {
    childList: true,
    subtree: true
  });
}

// Start watching for invalid number popups immediately
watchForInvalidNumberDialog();

