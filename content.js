// Default seed data to ensure they always have templates ready
const DEFAULT_CATEGORIES = ["כללי", "קורסים", "AI", "פוולואפים"];
const DEFAULT_TEMPLATES = [
  {
    id: "seed-5",
    title: "קורס שיווק דיגיטלי - HackerU",
    shortcut: "-שיווק",
    category: "מכירות",
    content: `היי {First Name}, שמחתי להכיר! 😊

הנה תמצית המסלול שיהפוך אותך למאסטר בשיווק דיגיטלי ב-HackerU. אנחנו נלמד אותך לשלוט בפלטפורמות המובילות ולנצח בעזרת בינה מלאכותית (AI):
📊 פרטי הקורס: Digital Marketing Master + AI Tools

📅 תאריך פתיחה: {תאריך}.
🕘 מסלול: {בוקר / ערב}.
💻 מתכונת לימודים: {היברידי / אונליין}.
🗓️ימי לימוד: {ימי לימוד}.
⏰ שעות: {שעות}.
⏳ משך הקורס: כ-3.5 / 8.5 חודשים  (335 שעות אקדמיות).

🚀 מה בתכל'ס לומדים?
Social 360: בניית אסטרטגיה מנצחת לפייסבוק ואינסטגרם, כולל עיצוב ב-Canva.
Video & Reels: צילום ועריכה ב-CapCut לסרטונים ויראליים בטיקטוק.
פרסום ממומן (PPC): ניהול קמפיינים ותקציבים בגוגל וברשתות החברתיות.
GEO & AI: אופטימיזציה למנועי בינה מלאכותית (כמו ChatGPT) כדי שה-AI ימליץ עליך.

💰 סיכום עלויות:

לגבי העלויות, נכון להיום אושרה לך מלגה אישית על סך {מלגה} ₪ שתקפה למועד הפתיחה הקרוב. המלגות שלנו מתעדכנות בין מחזור למחזור בהתאם להקצאות, לכן אני רוצה שנוודא שאנחנו סוגרים לך את המקום בתנאים האלו לפני שהם משתנים.

סיכום עלויות: מחיר מלא: ~~17,900 ₪~~ | מחיר סופי עבורך: {מחיר לאחר הנחה} ₪ בלבד! (כולל מע"מ).

💳 אפשרויות תשלום:
עד 12 תשלומים ללא ריבית בהוראת קבע.
10% הנחה נוספת בתשלום אחד.
מוכר לתשלום בפיקדון הצבאי.
פריסה של עד 60 תשלומים (לא תופס מסגרת).

🎯 השמה לעבודה: ליווי אישי של מחלקת ההשמה שלנו וחיבור ל-2,690 חברות בתעשייה.

אני זמין לכל שאלה כדי שנוכל לשריין לך מקום,
ערן, יועץ לימודים | HackerU 🎓`
  },
  {
    id: "seed-1",
    title: "הודעת פתיחה וברכה",
    shortcut: "/שלום",
    category: "כללי",
    content: "שלום {שם לקוח},\nשמח ליצור איתך קשר! כאן {השם שלי} מחברת האקר-יו.\nנשמח לעזור לך בכל שאלה לגבי {נושא}.\nבאיזה שעה הכי נוח לדבר?"
  },
  {
    id: "seed-2",
    title: "קישור לתשלום",
    shortcut: "/תשלום",
    category: "מכירות",
    content: "היי {שם לקוח},\nבהמשך לשיחתנו, מצורף קישור לתשלום מאובטח על סך {סכום} ש\"ח עבור {עבור}.\nנא לחץ על הקישור להשלמת ההרשמה: {קישור_לתשלום}\nלאחר התשלום אנא שלח לי צילום מסך."
  },
  {
    id: "seed-3",
    title: "מחוץ לשעות הפעילות",
    shortcut: "/סגור",
    category: "שירות לקוחות",
    content: "שלום {שם לקוח},\nקיבלנו את הודעתך בברכה.\nשעות הפעילות של המשרד הן בימים א'-ה' בין השעות 09:00-18:00.\nנחזור אליך ביום העסקים הקרוב בשעות הבוקר.\nהמשך יום נעים!"
  }
];

// Gracefully suppress unavoidable Chrome extension context invalidation errors on orphaned tabs
window.addEventListener("error", (event) => {
  if (event && event.message && event.message.includes("Extension context invalidated")) {
    event.stopImmediatePropagation();
    event.preventDefault();
    return true;
  }
}, true);

window.addEventListener("unhandledrejection", (event) => {
  if (event && event.reason && String(event.reason).includes("Extension context invalidated")) {
    event.stopImmediatePropagation();
    event.preventDefault();
  }
}, true);

let templates = [];
let categories = [];
let sidebarOpen = false;
let activeCategory = "all";
let geminiApiKey = "";
let placeholderHistory = {};
let lastWorkingModel = "";
let reminders = [];
let leadsTracker = [];
let paymentsTracker = [];
let shownAlertIds = [];
let activeLeadsFilter = "active";
let activePaymentsFilter = "pending"; // "pending" or "completed"
let voicenterExt = "";
let voicenterCode = "";
let dialerType = "local";
let syllabusFiles = [];
let archivedReminders = [];
let remindersViewMode = "active";
var reminderIndicatorInterval = null;
var reminderCheckInterval = null;
var lastCopiedPhone = "";
var lastCopiedName = "";
var lastCopiedEmail = "";

// Firebase Real-time Cloud Sync Global State
var firebaseDbUrl = "https://eran-sync-whatsapp-default-rtdb.firebaseio.com";
var firebaseSyncKey = "eran_sync";
var firebaseSyncEnabled = true;
var firebaseSyncStatus = "disconnected"; // "connected", "syncing", "error", "disabled"
var firebaseEventSource = null;
var isApplyingCloudUpdate = false;
var cloudSyncDebounceTimer = null;
var lastCloudUpdatedAt = 0;

function getCurrentPlatform() {
  const host = (window.location.hostname || "").toLowerCase();
  if (host.includes("whatsapp.com")) return "whatsapp";
  if (host.includes("sharepoint.com") || host.includes("excel") || host.includes("onedrive") || host.includes("office.live.com") || (host.includes("office365.com") && !host.includes("outlook"))) {
    return "excel";
  }
  if (host.includes("outlook") || host.includes("mail.google.com") || host.includes("cloud.microsoft")) {
    return "mail";
  }
  return "web";
}

let enabledFeatures = {
  // Individual Floating Screen Buttons (Shortcut Circles)
  btnSidebar: true,
  btnSyllabus: true,
  btnDialer: true,
  btnCopyPhone: true,
  btnReminder: true,

  // App tabs and features
  templates: true,
  reminders: true,
  copyPhone: true,
  quickDialer: true,
  leadsTracker: true,
  paymentsTracker: true,
  syllabus: true,
  pinnedShortcuts: true,

  // Granular platform-specific button visibility
  platformSettings: {
    whatsapp: {
      btnSidebar: true,
      btnSyllabus: true,
      btnDialer: true,
      btnCopyPhone: true,
      btnReminder: true
    },
    mail: {
      btnSidebar: true,
      btnSyllabus: true,
      btnDialer: false,
      btnCopyPhone: false,
      btnReminder: true
    },
    excel: {
      btnSidebar: false,
      btnSyllabus: false,
      btnDialer: true,
      btnCopyPhone: true,
      btnReminder: true
    },
    web: {
      btnSidebar: true,
      btnSyllabus: false,
      btnDialer: true,
      btnCopyPhone: true,
      btnReminder: true
    }
  }
};

function isFeatureEnabledForPlatform(featureKey, platform = null) {
  let p = platform || getCurrentPlatform();
  if (p === "other") p = "web";
  if (enabledFeatures && enabledFeatures.platformSettings && enabledFeatures.platformSettings[p] && typeof enabledFeatures.platformSettings[p][featureKey] === "boolean") {
    return enabledFeatures.platformSettings[p][featureKey];
  }
  return enabledFeatures ? enabledFeatures[featureKey] !== false : true;
}

// Live Cross-Tab Synchronization Channel (0ms instant sync across all tabs and windows)
const crossTabSyncChannel = (typeof BroadcastChannel !== "undefined") ? new BroadcastChannel("hackeru_assistant_sync_channel") : null;

function broadcastCrossTabMessage(type, payload = {}) {
  if (crossTabSyncChannel) {
    try {
      crossTabSyncChannel.postMessage({ type, ...payload });
    } catch (e) {}
  }
}

function broadcastRemindersUpdate(type = "REMINDERS_UPDATED", extra = {}) {
  broadcastCrossTabMessage(type, {
    reminders: reminders || [],
    archivedReminders: archivedReminders || [],
    ...extra
  });
  pushStateToCloud();
}

// ==========================================
// ☁️ FIREBASE REAL-TIME CLOUD SYNC ENGINE
// ==========================================
function updateCloudSyncStatusIndicator() {
  const badge = document.getElementById("wa-cloud-status-badge");
  if (!badge) return;
  if (!firebaseSyncEnabled) {
    badge.textContent = "כבוי ⚪";
    badge.style.background = "#64748b";
  } else if (firebaseSyncStatus === "connected") {
    badge.textContent = "מחובר 🟢";
    badge.style.background = "#059669";
  } else if (firebaseSyncStatus === "syncing") {
    badge.textContent = "מסנכרן... 🟡";
    badge.style.background = "#d97706";
  } else if (firebaseSyncStatus === "error") {
    badge.textContent = "שגיאת חיבור 🔴";
    badge.style.background = "#dc2626";
  } else {
    badge.textContent = "מתחבר... ⚪";
    badge.style.background = "#64748b";
  }
}

function handleIncomingCloudSync(cloudData, path = "/") {
  if (!cloudData || isApplyingCloudUpdate) return;
  
  let fullState = cloudData;
  if (path && path !== "/") {
    const key = path.replace(/^\//, "").split("/")[0];
    if (key === "reminders") fullState = { reminders: cloudData };
    else if (key === "archivedReminders") fullState = { archivedReminders: cloudData };
    else if (key === "leadsTracker") fullState = { leadsTracker: cloudData };
    else if (key === "paymentsTracker") fullState = { paymentsTracker: cloudData };
    else if (key === "templates") fullState = { templates: cloudData };
    else return;
  }

  isApplyingCloudUpdate = true;
  try {
    let hasRemindersChange = false;
    let hasLeadsChange = false;
    let hasPaymentsChange = false;
    let hasTemplatesChange = false;

    if (fullState.reminders !== undefined && Array.isArray(fullState.reminders)) {
      reminders = fullState.reminders || [];
      hasRemindersChange = true;
    }
    if (fullState.archivedReminders !== undefined && Array.isArray(fullState.archivedReminders)) {
      archivedReminders = fullState.archivedReminders || [];
      hasRemindersChange = true;
    }
    if (fullState.leadsTracker !== undefined && Array.isArray(fullState.leadsTracker)) {
      leadsTracker = fullState.leadsTracker || [];
      hasLeadsChange = true;
    }
    if (fullState.paymentsTracker !== undefined && Array.isArray(fullState.paymentsTracker)) {
      paymentsTracker = fullState.paymentsTracker || [];
      hasPaymentsChange = true;
    }
    if (fullState.templates !== undefined && Array.isArray(fullState.templates) && fullState.templates.length > 0) {
      templates = fullState.templates || [];
      hasTemplatesChange = true;
    }
    if (fullState.updatedAt) {
      lastCloudUpdatedAt = fullState.updatedAt;
    }

    if (hasRemindersChange) {
      safeStorageSet({ reminders, archivedReminders }, () => {
        renderFloatingAlertCard();
        renderSidebarReminders();
        updateReminderIndicators();
      });
      broadcastCrossTabMessage("REMINDERS_UPDATED", { reminders, archivedReminders });
    }
    if (hasLeadsChange) {
      safeStorageSet({ leadsTracker }, () => {
        renderSidebarLeads();
        updateReminderIndicators();
      });
      broadcastCrossTabMessage("LEADS_UPDATED", { leadsTracker });
    }
    if (hasPaymentsChange) {
      safeStorageSet({ paymentsTracker }, () => {
        renderSidebarPayments();
      });
      broadcastCrossTabMessage("PAYMENTS_UPDATED", { paymentsTracker });
    }
    if (hasTemplatesChange) {
      safeStorageSet({ templates }, () => {
        renderSidebarTemplates();
        renderFloatingPinnedBar();
      });
      broadcastCrossTabMessage("TEMPLATES_UPDATED", { templates });
    }

    firebaseSyncStatus = "connected";
    updateCloudSyncStatusIndicator();
    console.log("Firebase Live Sync: Applied real-time cloud update!");
  } finally {
    setTimeout(() => {
      isApplyingCloudUpdate = false;
    }, 250);
  }
}

function startFirebaseLiveSync() {
  if (!firebaseSyncEnabled || !firebaseDbUrl || !firebaseSyncKey) {
    firebaseSyncStatus = "disabled";
    updateCloudSyncStatusIndicator();
    return;
  }

  if (firebaseEventSource) {
    try { firebaseEventSource.close(); } catch(e) {}
    firebaseEventSource = null;
  }

  const cleanUrl = firebaseDbUrl.replace(/\/+$/, "");
  const streamUrl = `${cleanUrl}/sync/${encodeURIComponent(firebaseSyncKey)}.json`;

  try {
    firebaseEventSource = new EventSource(streamUrl);

    firebaseEventSource.addEventListener("open", () => {
      console.log("Firebase Live Sync: SSE Connected successfully.");
      firebaseSyncStatus = "connected";
      updateCloudSyncStatusIndicator();
    });

    firebaseEventSource.addEventListener("put", (e) => {
      try {
        const payload = JSON.parse(e.data);
        if (payload && payload.data !== undefined) {
          handleIncomingCloudSync(payload.data, payload.path);
        }
      } catch(err) {
        console.warn("Firebase SSE parse error:", err);
      }
    });

    firebaseEventSource.addEventListener("patch", (e) => {
      try {
        const payload = JSON.parse(e.data);
        if (payload && payload.data !== undefined) {
          handleIncomingCloudSync(payload.data, payload.path);
        }
      } catch(err) {}
    });

    firebaseEventSource.addEventListener("error", () => {
      firebaseSyncStatus = "error";
      updateCloudSyncStatusIndicator();
    });
  } catch(err) {
    console.warn("Failed to init Firebase EventSource:", err);
    firebaseSyncStatus = "error";
    updateCloudSyncStatusIndicator();
  }
}

function pushStateToCloud(immediate = false) {
  if (!firebaseSyncEnabled || !firebaseDbUrl || !firebaseSyncKey || isApplyingCloudUpdate) return;

  if (cloudSyncDebounceTimer) clearTimeout(cloudSyncDebounceTimer);

  const doPush = () => {
    firebaseSyncStatus = "syncing";
    updateCloudSyncStatusIndicator();

    const cleanUrl = firebaseDbUrl.replace(/\/+$/, "");
    const endpoint = `${cleanUrl}/sync/${encodeURIComponent(firebaseSyncKey)}.json`;

    const now = Date.now();
    lastCloudUpdatedAt = now;

    const payload = {
      updatedAt: now,
      reminders: reminders || [],
      archivedReminders: archivedReminders || [],
      leadsTracker: leadsTracker || [],
      paymentsTracker: paymentsTracker || [],
      templates: templates || []
    };

    fetch(endpoint, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).then(res => {
      if (res.ok) {
        console.log("Cloud Sync: Pushed local changes to Firebase successfully.");
        firebaseSyncStatus = "connected";
        updateCloudSyncStatusIndicator();
      } else {
        console.warn("Cloud Sync error HTTP:", res.status);
        firebaseSyncStatus = "error";
        updateCloudSyncStatusIndicator();
      }
    }).catch(err => {
      console.warn("Cloud Sync fetch error:", err);
      firebaseSyncStatus = "error";
      updateCloudSyncStatusIndicator();
    });
  };

  if (immediate) {
    doPush();
  } else {
    cloudSyncDebounceTimer = setTimeout(doPush, 400);
  }
}

function fetchInitialCloudSync(callback) {
  if (!firebaseSyncEnabled || !firebaseDbUrl || !firebaseSyncKey) {
    if (callback) callback();
    return;
  }

  const cleanUrl = firebaseDbUrl.replace(/\/+$/, "");
  const endpoint = `${cleanUrl}/sync/${encodeURIComponent(firebaseSyncKey)}.json`;

  fetch(endpoint).then(res => {
    if (res.ok) return res.json();
    throw new Error("HTTP " + res.status);
  }).then(cloudData => {
    if (cloudData && typeof cloudData === "object") {
      const hasCloudContent = ["reminders", "leadsTracker", "paymentsTracker", "templates"].some(key => cloudData[key]?.length > 0);
      const hasLocalContent = [reminders, leadsTracker, paymentsTracker].some(arr => arr?.length > 0);

      if (hasCloudContent) {
        handleIncomingCloudSync(cloudData);
      } else if (hasLocalContent) {
        // Initialize cloud with current local data
        pushStateToCloud(true);
      }
      firebaseSyncStatus = "connected";
    } else {
      // Cloud is empty, push local state to cloud
      pushStateToCloud(true);
    }
    updateCloudSyncStatusIndicator();
    startFirebaseLiveSync();
    if (callback) callback();
  }).catch(err => {
    console.warn("Initial Cloud Sync fetch error, running local mode:", err);
    firebaseSyncStatus = "error";
    updateCloudSyncStatusIndicator();
    startFirebaseLiveSync();
    if (callback) callback();
  });
}

let extensionContextDead = false;

function checkAndMarkDead() {
  if (extensionContextDead) return true;
  try {
    if (typeof chrome === "undefined" || !chrome.runtime || !chrome.runtime.id) {
      extensionContextDead = true;
    }
  } catch (e) {
    extensionContextDead = true;
  }
  if (extensionContextDead) {
    if (reminderCheckInterval) { clearInterval(reminderCheckInterval); reminderCheckInterval = null; }
    if (reminderIndicatorInterval) { clearInterval(reminderIndicatorInterval); reminderIndicatorInterval = null; }
    if (crossTabSyncChannel) { try { crossTabSyncChannel.close(); } catch(e) {} }
    return true;
  }
  return false;
}

function isExtensionValid() {
  if (extensionContextDead) return false;
  try {
    if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.id) {
      return true;
    } else {
      checkAndMarkDead();
      return false;
    }
  } catch (e) {
    checkAndMarkDead();
    return false;
  }
}

// Safe wrapper for chrome.storage.local.get to handle Extension context invalidated
function safeStorageGet(keys, callback) {
  try {
    if (isExtensionValid() && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(keys, (res) => {
        if (chrome.runtime && chrome.runtime.lastError) {
          console.warn("Storage get warning:", chrome.runtime.lastError);
        }
        if (callback) callback(res || {});
      });
    } else {
      if (callback) callback({});
    }
  } catch (e) {
    if (callback) callback({});
  }
}

// Safe wrapper for chrome.storage.local.set to handle Extension context invalidated and auto-sync
function safeStorageSet(data, callback) {
  try {
    // Automatically broadcast updates to all other tabs immediately!
    if (data) {
      if (data.reminders !== undefined || data.archivedReminders !== undefined) {
        broadcastCrossTabMessage("REMINDERS_UPDATED", {
          reminders: data.reminders !== undefined ? data.reminders : reminders,
          archivedReminders: data.archivedReminders !== undefined ? data.archivedReminders : archivedReminders
        });
      }
      if (data.leadsTracker !== undefined) {
        broadcastCrossTabMessage("LEADS_UPDATED", { leadsTracker: data.leadsTracker });
      }
      if (data.paymentsTracker !== undefined) {
        broadcastCrossTabMessage("PAYMENTS_UPDATED", { paymentsTracker: data.paymentsTracker });
      }
      if (data.templates !== undefined) {
        broadcastCrossTabMessage("TEMPLATES_UPDATED", { templates: data.templates });
      }
    }

    if (isExtensionValid() && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set(data, () => {
        if (chrome.runtime && chrome.runtime.lastError) {
          console.warn("Storage set warning:", chrome.runtime.lastError);
        }
        if (callback) callback();
      });
    } else {
      if (callback) callback();
    }
  } catch (e) {
    if (callback) callback();
  }
}

// Safe wrapper for chrome.storage.local.remove
function safeStorageRemove(keys, callback) {
  try {
    if (isExtensionValid() && chrome.storage && chrome.storage.local) {
      chrome.storage.local.remove(keys, () => {
        if (chrome.runtime && chrome.runtime.lastError) {
          console.warn("Storage remove warning:", chrome.runtime.lastError);
        }
        if (callback) callback();
      });
    } else {
      if (callback) callback();
    }
  } catch (e) {
    if (callback) callback();
  }
}

// Fetch templates from storage and listen to updates
function loadTemplates() {
  if (!isExtensionValid()) return;
  safeStorageGet(["templates", "categories", "geminiApiKey", "syllabusFiles", "placeholderHistory", "lastWorkingModel", "reminders", "archivedReminders", "leadsTracker", "paymentsTracker", "voicenterExt", "voicenterCode", "dialerType", "enabledFeatures", "lastCopiedPhone", "lastCopiedName", "lastCopiedEmail", "firebaseDbUrl", "firebaseSyncKey", "firebaseSyncEnabled"], (localResult) => {
    if (localResult.enabledFeatures) {
      enabledFeatures = { ...enabledFeatures, ...localResult.enabledFeatures };
    }
    geminiApiKey = localResult.geminiApiKey || "";
    syllabusFiles = localResult.syllabusFiles || [];
    placeholderHistory = localResult.placeholderHistory || {};
    lastWorkingModel = localResult.lastWorkingModel || "";
    reminders = localResult.reminders || [];
    archivedReminders = localResult.archivedReminders || [];
    if (purgeOldArchivedReminders()) {
      safeStorageSet({ archivedReminders });
    }
    leadsTracker = localResult.leadsTracker || [];
    paymentsTracker = localResult.paymentsTracker || [];
    voicenterExt = localResult.voicenterExt || "";
    voicenterCode = localResult.voicenterCode || "";
    dialerType = localResult.dialerType || "local";
    lastCopiedPhone = localResult.lastCopiedPhone || "";
    lastCopiedName = localResult.lastCopiedName || "";
    lastCopiedEmail = localResult.lastCopiedEmail || "";

    if (localResult.firebaseDbUrl !== undefined) firebaseDbUrl = localResult.firebaseDbUrl;
    if (localResult.firebaseSyncKey !== undefined) firebaseSyncKey = localResult.firebaseSyncKey;
    if (localResult.firebaseSyncEnabled !== undefined) firebaseSyncEnabled = localResult.firebaseSyncEnabled;
    
    // Prioritize local storage (unlimited)
    const localTemplates = localResult.templates || [];
    let changed = false;

    if (localTemplates.length > 0) {
      templates = localTemplates;
    } else {
      templates = DEFAULT_TEMPLATES;
      changed = true;
    }

    const localCategories = localResult.categories || [];
    if (localCategories.length > 0) {
      categories = localCategories;
    } else {
      categories = DEFAULT_CATEGORIES;
      changed = true;
    }

    // Initialize custom templates
    if (templates.length === 0) {
      templates = DEFAULT_TEMPLATES;
      changed = true;
    }

    if (categories.length === 0) {
      categories = DEFAULT_CATEGORIES;
      changed = true;
    }

    // Proactive migration check to add user's marketing template if missing
    if (!templates.find(t => t.shortcut === "-שיווק")) {
      const mktTpl = DEFAULT_TEMPLATES.find(t => t.shortcut === "-שיווק");
      if (mktTpl) {
        templates.push(mktTpl);
        changed = true;
      }
    }

    // Save to local storage only if data was modified/seeded
    if (changed) {
      safeStorageSet({ templates, categories, geminiApiKey, reminders, leadsTracker, paymentsTracker, voicenterExt, voicenterCode, dialerType });
    }

    if (sidebarOpen) {
      const keyInput = document.getElementById("wa-assistant-key-input");
      if (keyInput) keyInput.value = geminiApiKey;

      const voicenterExtInput = document.getElementById("wa-assistant-voicenter-ext-input");
      const voicenterCodeInput = document.getElementById("wa-assistant-voicenter-code-input");
      if (voicenterExtInput) voicenterExtInput.value = voicenterExt;
      if (voicenterCodeInput) voicenterCodeInput.value = voicenterCode;

      const dialerTypeSelect = document.getElementById("wa-assistant-dialer-type-select");
      if (dialerTypeSelect) dialerTypeSelect.value = dialerType;

      const apiWrapper = document.getElementById("wa-assistant-api-fields-wrapper");
      if (apiWrapper) apiWrapper.style.display = dialerType === "api" ? "flex" : "none";

      renderSidebarTemplates();
      renderSidebarCategories();
      renderSyllabusSettingsList();
      renderSidebarReminders();
      renderSidebarLeads();
      renderSidebarPayments();
      applyModularFeatures();
    }
    applyModularFeatures();
  });
}

if (crossTabSyncChannel) {
  crossTabSyncChannel.onmessage = (e) => {
    try {
      if (checkAndMarkDead()) return;
      const data = e.data;
      if (!data) return;
      if (data.type === "REMINDERS_UPDATED" || data.type === "REMINDER_DISMISSED" || data.type === "REMINDER_SNOOZED") {
        if (data.reminders !== undefined) {
          reminders = data.reminders || [];
        }
        if (data.archivedReminders !== undefined) {
          archivedReminders = data.archivedReminders || [];
        }
        if (data.remId) {
          activeDueReminders = (activeDueReminders || []).filter(r => r.id !== data.remId);
          shownAlertIds = (shownAlertIds || []).filter(id => id !== data.remId);
        }
        renderFloatingAlertCard();
        renderSidebarReminders();
        updateReminderIndicators();
      } else if (data.type === "NAVIGATE_WHATSAPP_CHAT") {
        const onWhatsApp = window.location.hostname.includes("whatsapp.com");
        if (onWhatsApp && data.phone) {
          window.focus();
          navigateToChat(data.phone, data.msgId, data.messageSnippet);
        }
      } else if (data.type === "LEADS_UPDATED") {
        if (data.leadsTracker !== undefined) leadsTracker = data.leadsTracker || [];
        renderSidebarLeads();
        updateReminderIndicators();
      } else if (data.type === "PAYMENTS_UPDATED") {
        if (data.paymentsTracker !== undefined) paymentsTracker = data.paymentsTracker || [];
        renderSidebarPayments();
      } else if (data.type === "TEMPLATES_UPDATED") {
        if (data.templates !== undefined) templates = data.templates || [];
        renderSidebarTemplates();
        renderFloatingPinnedBar();
      } else if (data.type === "WA_PHONE_NOT_FOUND") {
        if (data.phone) {
          const formatted = formatIsraeliPhoneWithDash(data.phone) || data.phone;
          showPhoneNotFoundModal(formatted, data.email || lastCopiedEmail, data.name || lastCopiedName);
        }
      }
    } catch (e) {}
  };
}

// Listen to messages from Main World (main-world.js)
window.addEventListener("message", (event) => {
  try {
    const msg = event.data;
    if (msg && msg.type === "WA_PHONE_NOT_FOUND") {
      const raw = msg.phone || "";
      const formatted = formatIsraeliPhoneWithDash(raw) || raw;
      showPhoneNotFoundModal(formatted, lastCopiedEmail, lastCopiedName);
      broadcastCrossTabMessage("WA_PHONE_NOT_FOUND", { phone: formatted, email: lastCopiedEmail, name: lastCopiedName });
    }
  } catch (err) {}
});

// Listen to direct messages from background service worker
if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.onMessage) {
  try {
    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
      try {
        if (checkAndMarkDead()) return;
        if (msg && msg.type === "EXTERNAL_NAVIGATE_TO_CHAT") {
          const onWhatsApp = window.location.hostname.includes("whatsapp.com");
          if (onWhatsApp && msg.phone) {
            window.focus();
            navigateToChat(msg.phone, msg.msgId, msg.messageSnippet);
            if (sendResponse) sendResponse({ success: true });
          }
        }
      } catch (err) {}
    });
  } catch (err) {}
}

// When switching to this tab or focusing window, immediately refresh storage to eliminate any stale alerts
document.addEventListener("visibilitychange", () => {
  try {
    if (checkAndMarkDead()) return;
    if (!document.hidden) {
      safeStorageGet(["reminders", "archivedReminders", "leadsTracker", "paymentsTracker"], (res) => {
        if (res.reminders) reminders = res.reminders;
        if (res.archivedReminders) archivedReminders = res.archivedReminders;
        if (res.leadsTracker) leadsTracker = res.leadsTracker;
        if (res.paymentsTracker) paymentsTracker = res.paymentsTracker;
        renderFloatingAlertCard();
        renderSidebarReminders();
        updateReminderIndicators();
      });
    }
  } catch (e) {}
});

window.addEventListener("focus", () => {
  try {
    if (checkAndMarkDead()) return;
    safeStorageGet(["reminders", "archivedReminders"], (res) => {
      if (res.reminders) reminders = res.reminders;
      if (res.archivedReminders) archivedReminders = res.archivedReminders;
      renderFloatingAlertCard();
      renderSidebarReminders();
      updateReminderIndicators();
    });
  } catch (e) {}
});

if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.onChanged) {
  try {
    chrome.storage.onChanged.addListener((changes, areaName) => {
      try {
        if (checkAndMarkDead()) return;
        if (areaName === "local" || areaName === "sync") {
          if (changes.reminders) {
            reminders = changes.reminders.newValue || [];
            renderFloatingAlertCard();
            renderSidebarReminders();
            updateReminderIndicators();
          }
          if (changes.archivedReminders) {
            archivedReminders = changes.archivedReminders.newValue || [];
            renderSidebarReminders();
          }
          if (changes.leadsTracker) {
            leadsTracker = changes.leadsTracker.newValue || [];
            renderSidebarLeads();
            updateReminderIndicators();
          }
          if (changes.paymentsTracker) {
            paymentsTracker = changes.paymentsTracker.newValue || [];
            renderSidebarPayments();
          }
          if (changes.templates) {
            templates = changes.templates.newValue || [];
            renderSidebarTemplates();
            renderFloatingPinnedBar();
          }
          if (changes.enabledFeatures) {
            enabledFeatures = { ...enabledFeatures, ...(changes.enabledFeatures.newValue || {}) };
            applyModularFeatures();
          }
          if (changes.syllabusFiles) {
            syllabusFiles = changes.syllabusFiles.newValue || [];
            renderSyllabusSettingsList();
          }
        }
      } catch (err) {}
    });
  } catch (err) {}
}

// Apply modular feature visibility (Show/Hide tools based on user preferences and platform)
function applyModularFeatures() {
  const p = getCurrentPlatform();
  const triggerBtn = document.getElementById("wa-assistant-trigger-btn");
  const syllabusBtn = document.getElementById("wa-syllabus-quick-trigger-btn");
  const dialerBtn = document.getElementById("wa-phone-quick-trigger-btn");
  const copyBtn = document.getElementById("wa-copy-phone-trigger-btn");
  const remBtn = document.getElementById("wa-reminder-quick-trigger-btn");

  if (triggerBtn) triggerBtn.style.display = isFeatureEnabledForPlatform("btnSidebar", p) ? "flex" : "none";
  if (syllabusBtn) syllabusBtn.style.display = isFeatureEnabledForPlatform("btnSyllabus", p) ? "flex" : "none";
  if (dialerBtn) dialerBtn.style.display = isFeatureEnabledForPlatform("btnDialer", p) ? "flex" : "none";
  if (copyBtn) copyBtn.style.display = isFeatureEnabledForPlatform("btnCopyPhone", p) ? "flex" : "none";
  if (remBtn) remBtn.style.display = isFeatureEnabledForPlatform("btnReminder", p) ? "flex" : "none";

  renderFloatingPinnedBar();

  const newTplBtn = document.getElementById("wa-assistant-new-btn");
  if (newTplBtn) newTplBtn.style.display = enabledFeatures.templates ? "block" : "none";

  const phoneChatSection = document.querySelector(".wa-assistant-phone-chat-section");
  if (phoneChatSection) {
    phoneChatSection.style.display = (p === "whatsapp" && enabledFeatures.quickDialer) ? "flex" : "none";
  }

  const templatesTabBtn = document.getElementById("wa-tab-templates-btn");
  const remindersTabBtn = document.getElementById("wa-tab-reminders-btn");
  const leadsTabBtn = document.getElementById("wa-tab-leads-btn");
  const paymentsTabBtn = document.getElementById("wa-tab-payments-btn");

  if (templatesTabBtn) templatesTabBtn.style.display = enabledFeatures.templates ? "block" : "none";
  if (remindersTabBtn) remindersTabBtn.style.display = enabledFeatures.reminders ? "block" : "none";
  if (leadsTabBtn) leadsTabBtn.style.display = enabledFeatures.leadsTracker ? "block" : "none";
  if (paymentsTabBtn) paymentsTabBtn.style.display = enabledFeatures.paymentsTracker !== false ? "block" : "none";

  // Tab fallback if active tab gets disabled
  if (activeTab === "templates" && !enabledFeatures.templates) {
    if (enabledFeatures.reminders && remindersTabBtn) remindersTabBtn.click();
    else if (enabledFeatures.leadsTracker && leadsTabBtn) leadsTabBtn.click();
    else if (enabledFeatures.paymentsTracker && paymentsTabBtn) paymentsTabBtn.click();
  } else if (activeTab === "reminders" && !enabledFeatures.reminders) {
    if (enabledFeatures.templates && templatesTabBtn) templatesTabBtn.click();
    else if (enabledFeatures.leadsTracker && leadsTabBtn) leadsTabBtn.click();
    else if (enabledFeatures.paymentsTracker && paymentsTabBtn) paymentsTabBtn.click();
  } else if (activeTab === "leads" && !enabledFeatures.leadsTracker) {
    if (enabledFeatures.templates && templatesTabBtn) templatesTabBtn.click();
    else if (enabledFeatures.reminders && remindersTabBtn) remindersTabBtn.click();
    else if (enabledFeatures.paymentsTracker && paymentsTabBtn) paymentsTabBtn.click();
  } else if (activeTab === "payments" && enabledFeatures.paymentsTracker === false) {
    if (enabledFeatures.templates && templatesTabBtn) templatesTabBtn.click();
    else if (enabledFeatures.reminders && remindersTabBtn) remindersTabBtn.click();
  }

  if (!enabledFeatures.reminders) {
    const alertCard = document.getElementById("wa-floating-alert-card");
    if (alertCard) alertCard.remove();
  }
}

// Initial load
loadTemplates();

// Wait for the DOM to load before injecting
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", injectAssistant);
} else {
  injectAssistant();
}

function injectAssistant() {
  if (!document.body) {
    setTimeout(injectAssistant, 100);
    return;
  }

  // Prevent duplicate injection
  if (document.getElementById("wa-assistant-trigger-btn")) return;

  // If running inside a sub-frame (iframe), set up keyboard listener for editor and return
  if (window !== window.top) {
    setupKeyboardListener();
    return;
  }

  const isWhatsApp = window.location.hostname.includes("whatsapp.com");
  let phoneTrigger = null;
  let copyTrigger = null;

  // Inject main-world.js script tag only on WhatsApp Web
  if (isWhatsApp) {
    try {
      const mainWorldScript = document.createElement("script");
      mainWorldScript.src = chrome.runtime.getURL("main-world.js");
      mainWorldScript.onload = () => mainWorldScript.remove();
      (document.head || document.documentElement).appendChild(mainWorldScript);
      console.log("Syllabus main-world script injected via content.js injection wrapper.");
    } catch (e) {
      console.error("Failed to inject main-world.js:", e);
    }
  }

  // 1. Create Floating Trigger Button (💬)
  const trigger = document.createElement("div");
  trigger.id = "wa-assistant-trigger-btn";
  trigger.className = `wa-assistant-trigger ${isWhatsApp ? "wa-trigger-whatsapp" : "wa-trigger-outlook"}`;
  trigger.innerHTML = "💬";
  trigger.title = isWhatsApp ? "עוזר הודעות מובנות ב-WhatsApp (גרור להזזה)" : "עוזר תבניות דוא\"ל ב-Outlook (גרור להזזה)";
  document.body.appendChild(trigger);

  safeStorageGet(["triggerPos"], (result) => {
    if (result.triggerPos && typeof result.triggerPos.left === "number" && typeof result.triggerPos.top === "number") {
      const maxLeft = Math.max(10, window.innerWidth - 60);
      const maxTop = Math.max(10, window.innerHeight - 60);
      trigger.style.left = `${Math.max(10, Math.min(result.triggerPos.left, maxLeft))}px`;
      trigger.style.top = `${Math.max(10, Math.min(result.triggerPos.top, maxTop))}px`;
      trigger.style.bottom = "auto";
      trigger.style.right = "auto";
    } else {
      trigger.style.bottom = "24px";
      trigger.style.right = "24px";
      trigger.style.left = "auto";
      trigger.style.top = "auto";
    }
  });

  // 2. Create Floating Quick Syllabus Trigger Button (📎)
  const syllabusTrigger = document.createElement("div");
  syllabusTrigger.id = "wa-syllabus-quick-trigger-btn";
  syllabusTrigger.className = `wa-assistant-trigger ${isWhatsApp ? "wa-trigger-whatsapp" : "wa-trigger-outlook"}`;
  syllabusTrigger.innerHTML = "📎";
  syllabusTrigger.title = "פתיחת תפריט סילבוסים מהיר להורדה והצמדה (גרור להזזה)";
  document.body.appendChild(syllabusTrigger);

  safeStorageGet(["syllabusTriggerPos"], (result) => {
    if (result.syllabusTriggerPos && typeof result.syllabusTriggerPos.left === "number" && typeof result.syllabusTriggerPos.top === "number") {
      const maxLeft = Math.max(10, window.innerWidth - 60);
      const maxTop = Math.max(10, window.innerHeight - 60);
      syllabusTrigger.style.left = `${Math.max(10, Math.min(result.syllabusTriggerPos.left, maxLeft))}px`;
      syllabusTrigger.style.top = `${Math.max(10, Math.min(result.syllabusTriggerPos.top, maxTop))}px`;
      syllabusTrigger.style.bottom = "auto";
      syllabusTrigger.style.right = "auto";
    } else {
      syllabusTrigger.style.bottom = "24px";
      syllabusTrigger.style.right = "72px";
      syllabusTrigger.style.left = "auto";
      syllabusTrigger.style.top = "auto";
    }
  });

  // 3. Create Floating Quick Phone / Dialer Trigger Button (📞)
  phoneTrigger = document.createElement("div");
  phoneTrigger.id = "wa-phone-quick-trigger-btn";
  phoneTrigger.className = `wa-assistant-trigger ${isWhatsApp ? "wa-trigger-whatsapp" : "wa-trigger-outlook"}`;
  phoneTrigger.innerHTML = "📞";
  phoneTrigger.title = "חייגן וחיפוש מספר מהיר (גרור להזזה)";
  document.body.appendChild(phoneTrigger);

  safeStorageGet(["phoneTriggerPos"], (result) => {
    if (result.phoneTriggerPos && typeof result.phoneTriggerPos.left === "number" && typeof result.phoneTriggerPos.top === "number") {
      const maxLeft = Math.max(10, window.innerWidth - 60);
      const maxTop = Math.max(10, window.innerHeight - 60);
      phoneTrigger.style.left = `${Math.max(10, Math.min(result.phoneTriggerPos.left, maxLeft))}px`;
      phoneTrigger.style.top = `${Math.max(10, Math.min(result.phoneTriggerPos.top, maxTop))}px`;
      phoneTrigger.style.bottom = "auto";
      phoneTrigger.style.right = "auto";
    } else {
      phoneTrigger.style.bottom = "24px";
      phoneTrigger.style.right = "120px";
      phoneTrigger.style.left = "auto";
      phoneTrigger.style.top = "auto";
    }
  });

  // 4. Create Floating Copy Phone Trigger Button (📋)
  copyTrigger = document.createElement("div");
  copyTrigger.id = "wa-copy-phone-trigger-btn";
  copyTrigger.className = `wa-assistant-trigger ${isWhatsApp ? "wa-trigger-whatsapp" : "wa-trigger-outlook"}`;
  copyTrigger.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: block;"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
  copyTrigger.title = "העתקת מספר טלפון מהירה (גרור להזזה)";
  document.body.appendChild(copyTrigger);

  safeStorageGet(["copyTriggerPos"], (result) => {
    if (result.copyTriggerPos && typeof result.copyTriggerPos.left === "number" && typeof result.copyTriggerPos.top === "number") {
      const maxLeft = Math.max(10, window.innerWidth - 60);
      const maxTop = Math.max(10, window.innerHeight - 60);
      copyTrigger.style.left = `${Math.max(10, Math.min(result.copyTriggerPos.left, maxLeft))}px`;
      copyTrigger.style.top = `${Math.max(10, Math.min(result.copyTriggerPos.top, maxTop))}px`;
      copyTrigger.style.bottom = "auto";
      copyTrigger.style.right = "auto";
    } else {
      copyTrigger.style.bottom = "24px";
      copyTrigger.style.right = "168px";
      copyTrigger.style.left = "auto";
      copyTrigger.style.top = "auto";
    }
  });

  // 5. Create Floating Quick Reminder Trigger Button (🔔)
  reminderTrigger = document.createElement("div");
  reminderTrigger.id = "wa-reminder-quick-trigger-btn";
  reminderTrigger.className = `wa-assistant-trigger ${isWhatsApp ? "wa-trigger-whatsapp" : "wa-trigger-outlook"}`;
  reminderTrigger.innerHTML = "🔔";
  reminderTrigger.title = "פתיחת תזכורת חדשה ללקוח (גרור להזזה)";
  document.body.appendChild(reminderTrigger);

  safeStorageGet(["reminderTriggerPos"], (result) => {
    if (result.reminderTriggerPos && typeof result.reminderTriggerPos.left === "number" && typeof result.reminderTriggerPos.top === "number") {
      const maxLeft = Math.max(10, window.innerWidth - 60);
      const maxTop = Math.max(10, window.innerHeight - 60);
      reminderTrigger.style.left = `${Math.max(10, Math.min(result.reminderTriggerPos.left, maxLeft))}px`;
      reminderTrigger.style.top = `${Math.max(10, Math.min(result.reminderTriggerPos.top, maxTop))}px`;
      reminderTrigger.style.bottom = "auto";
      reminderTrigger.style.right = "auto";
    } else {
      reminderTrigger.style.bottom = "24px";
      reminderTrigger.style.right = "216px";
      reminderTrigger.style.left = "auto";
      reminderTrigger.style.top = "auto";
    }
  });

  // Create Sidebar HTML
  const sidebar = document.createElement("div");
  sidebar.id = "wa-assistant-sidebar-panel";
  sidebar.className = "wa-assistant-sidebar";
  sidebar.innerHTML = `
    <div class="wa-assistant-header" style="display: flex; align-items: center; justify-content: space-between;">
      <h3 style="margin: 0; font-size: 14px;">💬 עוזר הודעות</h3>
      <div style="display: flex; gap: 6px; align-items: center;">
        <button id="wa-assistant-send-syllabus-btn" style="background: #007aff; border: none; color: white; cursor: pointer; font-size: 11px; font-weight: 600; padding: 4px 8px; border-radius: 4px; font-family: var(--wa-assistant-font); display: flex; align-items: center; gap: 2px;" title="שליחת/הורדת קובץ סילבוס (PDF)">📎 סילבוס</button>
        <button id="wa-assistant-ai-reply-btn" style="background: var(--wa-assistant-primary); border: none; color: white; cursor: pointer; font-size: 11px; font-weight: 600; padding: 4px 8px; border-radius: 4px; font-family: var(--wa-assistant-font); display: flex; align-items: center; gap: 2px;">🤖 מענה AI</button>
        <button id="wa-assistant-new-btn" style="background: transparent; border: 1px solid var(--wa-assistant-primary); color: var(--wa-assistant-primary); cursor: pointer; font-size: 11px; font-weight: 600; padding: 4px 8px; border-radius: 4px; font-family: var(--wa-assistant-font);">+ תבנית</button>
        <button class="wa-assistant-close-btn" id="wa-assistant-close-btn">&times;</button>
      </div>
    </div>

    <!-- Phone number quick routing container (Only shown on WhatsApp) -->
    <div class="wa-assistant-phone-chat-section" style="padding: 10px 16px; border-bottom: 1px solid var(--wa-assistant-border); background-color: var(--wa-assistant-card-bg); display: ${isWhatsApp ? "flex" : "none"}; gap: 8px;">
      <input type="text" id="wa-phone-chat-input" style="flex-grow: 1; background: var(--wa-assistant-bg); border: 1px solid var(--wa-assistant-border); color: var(--wa-assistant-text); font-size: 11px; padding: 6px 10px; border-radius: 6px; outline: none; font-family: var(--wa-assistant-font);" placeholder="מספר נייד (למשל: 0501234567)">
      <button id="wa-phone-chat-btn" style="background: var(--wa-assistant-primary); border: none; color: white; font-size: 11px; font-weight: 600; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-family: var(--wa-assistant-font);" title="פתח צ'אט בוואטסאפ">צ'אט 💬</button>
      <button id="wa-phone-call-btn" style="background: #2563eb; border: none; color: white; font-size: 11px; font-weight: 600; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-family: var(--wa-assistant-font);" title="חייג דרך Voicenter">חייג 📞</button>
    </div>

    <!-- Tabs header -->
    <div class="wa-assistant-tabs" style="display: flex; border-bottom: 1px solid var(--wa-assistant-border); background-color: var(--wa-assistant-card-bg);">
      <button id="wa-tab-templates-btn" class="wa-assistant-tab-btn active" style="flex: 1; padding: 10px 4px; background: transparent; border: none; border-bottom: 2px solid var(--wa-assistant-primary); color: var(--wa-assistant-text); font-size: 11px; font-weight: 600; cursor: pointer; font-family: var(--wa-assistant-font); outline: none;">💬 תבניות</button>
      <button id="wa-tab-reminders-btn" class="wa-assistant-tab-btn" style="flex: 1; padding: 10px 4px; background: transparent; border: none; border-bottom: 2px solid transparent; color: var(--wa-assistant-text-muted); font-size: 11px; font-weight: 600; cursor: pointer; font-family: var(--wa-assistant-font); outline: none;">🔔 תזכורות</button>
      <button id="wa-tab-leads-btn" class="wa-assistant-tab-btn" style="flex: 1; padding: 10px 4px; background: transparent; border: none; border-bottom: 2px solid transparent; color: var(--wa-assistant-text-muted); font-size: 11px; font-weight: 600; cursor: pointer; font-family: var(--wa-assistant-font); outline: none;">📋 מעקב</button>
      <button id="wa-tab-payments-btn" class="wa-assistant-tab-btn" style="flex: 1; padding: 10px 4px; background: transparent; border: none; border-bottom: 2px solid transparent; color: var(--wa-assistant-text-muted); font-size: 11px; font-weight: 600; cursor: pointer; font-family: var(--wa-assistant-font); outline: none;">💳 תשלומים</button>
    </div>

    <!-- Templates Tab Content Container -->
    <div id="wa-templates-tab-content" style="display: flex; flex-direction: column; flex-grow: 1; overflow: hidden;">
      <div class="wa-assistant-search-box">
        <input type="text" id="wa-assistant-search-input" class="wa-assistant-search-input" placeholder="חיפוש תבנית...">
      </div>
      <div class="wa-assistant-categories" id="wa-assistant-categories-list">
        <!-- Categories pills will be dynamically rendered -->
      </div>
      <div class="wa-assistant-list" id="wa-assistant-templates-list">
        <!-- Templates cards will be dynamically rendered -->
      </div>
    </div>

    <!-- Reminders Tab Content Container -->
    <div id="wa-reminders-tab-content" style="display: none; flex-direction: column; flex-grow: 1; overflow-y: auto; padding: 12px; gap: 8px;">
      <!-- Active Reminders list will be dynamically rendered -->
    </div>

    <!-- Leads Tab Content Container -->
    <div id="wa-leads-tab-content" style="display: none; flex-direction: column; flex-grow: 1; overflow: hidden;">
      <div style="padding: 10px 12px; border-bottom: 1px solid var(--wa-assistant-border); display: flex; gap: 6px; align-items: center; justify-content: space-between; background-color: var(--wa-assistant-card-bg);">
        <button id="wa-leads-add-btn" style="background: var(--wa-assistant-primary); border: none; color: white; cursor: pointer; font-size: 11px; font-weight: 600; padding: 6px 12px; border-radius: 6px; font-family: var(--wa-assistant-font); display: flex; align-items: center; gap: 4px; flex-grow: 1; justify-content: center;">➕ הוסף לקוח נוכחי למעקב</button>
        <button id="wa-leads-export-btn" title="יצוא מעקב לקובץ אקסל (CSV)" style="background: #0284c7; border: none; color: white; cursor: pointer; font-size: 11px; font-weight: 600; padding: 6px 10px; border-radius: 6px; font-family: var(--wa-assistant-font); display: flex; align-items: center; gap: 2px;">📥 יצוא</button>
      </div>
      <!-- Daily Dashboard Summary -->
      <div id="wa-leads-dashboard" style="background: rgba(0, 168, 132, 0.05); padding: 8px 12px; border-bottom: 1px solid var(--wa-assistant-border); display: flex; justify-content: space-around; align-items: center; font-size: 11px; color: var(--wa-assistant-text-muted); direction: rtl; font-family: var(--wa-assistant-font);">
        <!-- Dashboard values loaded dynamically -->
      </div>
      <div class="wa-assistant-search-box" style="padding: 8px 12px; border-bottom: 1px solid var(--wa-assistant-border);">
        <input type="text" id="wa-leads-search-input" class="wa-assistant-search-input" style="padding: 6px 10px; font-size: 11px; width: 100%;" placeholder="חיפוש ליד לפי שם או נייד...">
      </div>
      <div style="display: flex; background: var(--wa-assistant-bg); padding: 4px 12px; gap: 4px; border-bottom: 1px solid var(--wa-assistant-border);">
        <button id="wa-leads-filter-active" class="wa-leads-filter-btn active" style="flex: 1; border: none; background: transparent; color: var(--wa-assistant-text); font-size: 11px; font-weight: 600; cursor: pointer; padding: 6px; border-bottom: 2px solid var(--wa-assistant-primary); outline: none; font-family: var(--wa-assistant-font);">לידים פעילים</button>
        <button id="wa-leads-filter-archived" class="wa-leads-filter-btn" style="flex: 1; border: none; background: transparent; color: var(--wa-assistant-text-muted); font-size: 11px; font-weight: 600; cursor: pointer; padding: 6px; border-bottom: 2px solid transparent; outline: none; font-family: var(--wa-assistant-font);">סיום מעקב (ארכיון)</button>
      </div>
      <div class="wa-assistant-list" id="wa-leads-list" style="flex-grow: 1; overflow-y: auto; padding: 12px; display: flex; flex-direction: column; gap: 8px;">
        <!-- Leads cards will be dynamically rendered -->
      </div>
    </div>

    <!-- Payments Tab Content Container -->
    <div id="wa-payments-tab-content" style="display: none; flex-direction: column; flex-grow: 1; overflow: hidden;">
      <div style="padding: 10px 12px; border-bottom: 1px solid var(--wa-assistant-border); display: flex; gap: 6px; align-items: center; justify-content: space-between; background-color: var(--wa-assistant-card-bg);">
        <button id="wa-payments-add-btn" style="background: linear-gradient(135deg, #10b981, #059669); border: none; color: white; cursor: pointer; font-size: 11px; font-weight: 700; padding: 7px 12px; border-radius: 6px; font-family: var(--wa-assistant-font); display: flex; align-items: center; gap: 4px; flex-grow: 1; justify-content: center; box-shadow: 0 2px 6px rgba(16,185,129,0.2);">➕ הוסף סטודנט להסדר תשלום</button>
        <button id="wa-payments-export-btn" title="יצוא תשלומים לקובץ אקסל (CSV)" style="background: #0284c7; border: none; color: white; cursor: pointer; font-size: 11px; font-weight: 600; padding: 7px 10px; border-radius: 6px; font-family: var(--wa-assistant-font); display: flex; align-items: center; gap: 2px;">📥 יצוא</button>
      </div>
      <!-- Financial KPI Dashboard Summary -->
      <div id="wa-payments-dashboard" style="background: rgba(16, 185, 129, 0.06); padding: 8px 12px; border-bottom: 1px solid var(--wa-assistant-border); display: flex; justify-content: space-around; align-items: center; font-size: 11px; color: var(--wa-assistant-text-muted); direction: rtl; font-family: var(--wa-assistant-font);">
        <!-- Dashboard values loaded dynamically -->
      </div>
      <div class="wa-assistant-search-box" style="padding: 8px 12px; border-bottom: 1px solid var(--wa-assistant-border);">
        <input type="text" id="wa-payments-search-input" class="wa-assistant-search-input" style="padding: 6px 10px; font-size: 11px; width: 100%;" placeholder="חיפוש לפי שם, טלפון או קורס...">
      </div>
      <div style="display: flex; background: var(--wa-assistant-bg); padding: 4px 12px; gap: 4px; border-bottom: 1px solid var(--wa-assistant-border);">
        <button id="wa-payments-filter-pending" class="wa-payments-filter-btn active" style="flex: 1; border: none; background: transparent; color: var(--wa-assistant-text); font-size: 11px; font-weight: 700; cursor: pointer; padding: 6px; border-bottom: 2px solid #10b981; outline: none; font-family: var(--wa-assistant-font);">⏳ ממתינים להסדרה</button>
        <button id="wa-payments-filter-completed" class="wa-payments-filter-btn" style="flex: 1; border: none; background: transparent; color: var(--wa-assistant-text-muted); font-size: 11px; font-weight: 700; cursor: pointer; padding: 6px; border-bottom: 2px solid transparent; outline: none; font-family: var(--wa-assistant-font);">✅ הוסדרו (ארכיון)</button>
      </div>
      <div class="wa-assistant-list" id="wa-payments-list" style="flex-grow: 1; overflow-y: auto; padding: 12px; display: flex; flex-direction: column; gap: 10px;">
        <!-- Payments cards will be dynamically rendered -->
      </div>
    </div>
    
    <!-- Collapsible Modular Features Selector Section -->
    <div class="wa-assistant-section-collapse" style="border-top: 1px solid var(--wa-assistant-border); background-color: var(--wa-assistant-card-bg);">
      <button id="wa-assistant-features-toggle-btn" style="width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 10px 16px; background: transparent; border: none; color: var(--wa-assistant-text); cursor: pointer; font-family: var(--wa-assistant-font); font-size: 11px; font-weight: 600; outline: none; transition: background-color 0.2s ease;">
        <span style="display: flex; align-items: center; gap: 6px;">🎛️ בורר רכיבים וכלים (הפעל/כבה)</span>
        <span id="wa-assistant-features-toggle-icon" style="font-size: 8px; transition: transform 0.2s ease;">▼</span>
      </button>
      <div id="wa-assistant-features-collapse-content" style="padding: 10px 16px 14px 16px; display: none; border-top: 1px solid rgba(255, 255, 255, 0.05); flex-direction: column; gap: 8px;">
        <div style="font-size: 11px; font-weight: 700; color: var(--wa-assistant-primary); border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 4px; display: flex; justify-content: space-between; align-items: center;">
          <span>🔘 בחירת כפתורים צפים (לפי פלטפורמה):</span>
        </div>

        <!-- 4 Platform Tabs for granular customization -->
        <div style="display: flex; gap: 3px; background: rgba(0,0,0,0.25); padding: 3px; border-radius: 6px; margin-top: 2px; margin-bottom: 4px;">
          <button id="wa-feat-plat-tab-whatsapp" class="wa-feat-plat-tab" style="flex: 1; padding: 5px 2px; font-size: 10px; font-weight: 700; border-radius: 4px; border: none; cursor: pointer; background: var(--wa-assistant-primary); color: white; transition: all 0.2s ease;">💬 ווטסאפ</button>
          <button id="wa-feat-plat-tab-mail" class="wa-feat-plat-tab" style="flex: 1; padding: 5px 2px; font-size: 10px; font-weight: 700; border-radius: 4px; border: none; cursor: pointer; background: transparent; color: var(--wa-assistant-text-muted); transition: all 0.2s ease;">✉️ דוא"ל</button>
          <button id="wa-feat-plat-tab-excel" class="wa-feat-plat-tab" style="flex: 1; padding: 5px 2px; font-size: 10px; font-weight: 700; border-radius: 4px; border: none; cursor: pointer; background: transparent; color: var(--wa-assistant-text-muted); transition: all 0.2s ease;">📊 אקסל</button>
          <button id="wa-feat-plat-tab-web" class="wa-feat-plat-tab" style="flex: 1; padding: 5px 2px; font-size: 10px; font-weight: 700; border-radius: 4px; border: none; cursor: pointer; background: transparent; color: var(--wa-assistant-text-muted); transition: all 0.2s ease;">🌐 אתרי Web</button>
        </div>
        
        <label style="display: flex; align-items: center; justify-content: space-between; font-size: 11px; color: var(--wa-assistant-text); cursor: pointer; user-select: none; direction: rtl;">
          <span>💬 כפתור סרגל תבניות צף</span>
          <input type="checkbox" id="wa-feat-toggle-btn-sidebar" style="accent-color: var(--wa-assistant-primary); cursor: pointer;">
        </label>

        <label style="display: flex; align-items: center; justify-content: space-between; font-size: 11px; color: var(--wa-assistant-text); cursor: pointer; user-select: none; direction: rtl;">
          <span>📎 כפתור סילבוס מהיר צף</span>
          <input type="checkbox" id="wa-feat-toggle-btn-syllabus" style="accent-color: var(--wa-assistant-primary); cursor: pointer;">
        </label>

        <label style="display: flex; align-items: center; justify-content: space-between; font-size: 11px; color: var(--wa-assistant-text); cursor: pointer; user-select: none; direction: rtl;">
          <span>📞 כפתור חייגן / חיפוש מספר צף</span>
          <input type="checkbox" id="wa-feat-toggle-btn-dialer" style="accent-color: var(--wa-assistant-primary); cursor: pointer;">
        </label>

        <label style="display: flex; align-items: center; justify-content: space-between; font-size: 11px; color: var(--wa-assistant-text); cursor: pointer; user-select: none; direction: rtl;">
          <span>📋 כפתור העתקת מספר צף</span>
          <input type="checkbox" id="wa-feat-toggle-btn-copy" style="accent-color: var(--wa-assistant-primary); cursor: pointer;">
        </label>

        <label style="display: flex; align-items: center; justify-content: space-between; font-size: 11px; color: var(--wa-assistant-text); cursor: pointer; user-select: none; direction: rtl;">
          <span>🔔 כפתור תזכורת מהירה צף</span>
          <input type="checkbox" id="wa-feat-toggle-btn-reminder" style="accent-color: var(--wa-assistant-primary); cursor: pointer;">
        </label>

        <div style="font-size: 11px; font-weight: 700; color: var(--wa-assistant-primary); border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 4px; margin-top: 4px;">
          🎛️ רכיבי המערכת והסרגל:
        </div>

        <label style="display: flex; align-items: center; justify-content: space-between; font-size: 11px; color: var(--wa-assistant-text); cursor: pointer; user-select: none; direction: rtl;">
          <span>📑 לשונית תבניות והודעות</span>
          <input type="checkbox" id="wa-feat-toggle-templates" style="accent-color: var(--wa-assistant-primary); cursor: pointer;">
        </label>

        <label style="display: flex; align-items: center; justify-content: space-between; font-size: 11px; color: var(--wa-assistant-text); cursor: pointer; user-select: none; direction: rtl;">
          <span>🔔 לשונית תזכורות והתראות</span>
          <input type="checkbox" id="wa-feat-toggle-reminders" style="accent-color: var(--wa-assistant-primary); cursor: pointer;">
        </label>

        <label style="display: flex; align-items: center; justify-content: space-between; font-size: 11px; color: var(--wa-assistant-text); cursor: pointer; user-select: none; direction: rtl;">
          <span>📌 סרגל קיצורים מוצמדים למסך</span>
          <input type="checkbox" id="wa-feat-toggle-pinned" style="accent-color: var(--wa-assistant-primary); cursor: pointer;">
        </label>

        <label style="display: flex; align-items: center; justify-content: space-between; font-size: 11px; color: var(--wa-assistant-text); cursor: pointer; user-select: none; direction: rtl;">
          <span>📋 לשונית מעקב לידים (CRM)</span>
          <input type="checkbox" id="wa-feat-toggle-leads" style="accent-color: var(--wa-assistant-primary); cursor: pointer;">
        </label>

        <label style="display: flex; align-items: center; justify-content: space-between; font-size: 11px; color: var(--wa-assistant-text); cursor: pointer; user-select: none; direction: rtl;">
          <span>💳 לשונית הסדרי תשלום וגבייה</span>
          <input type="checkbox" id="wa-feat-toggle-payments" style="accent-color: var(--wa-assistant-primary); cursor: pointer;">
        </label>
      </div>
    </div>

    <!-- Collapsible System Settings Section -->
    <div class="wa-assistant-section-collapse" style="border-top: 1px solid var(--wa-assistant-border); background-color: var(--wa-assistant-card-bg);">
      <button id="wa-assistant-settings-toggle-btn" style="width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 10px 16px; background: transparent; border: none; color: var(--wa-assistant-text); cursor: pointer; font-family: var(--wa-assistant-font); font-size: 11px; font-weight: 600; outline: none; transition: background-color 0.2s ease;">
        <span style="display: flex; align-items: center; gap: 6px;">⚙️ הגדרות חיבורים (AI / Voicenter)</span>
        <span id="wa-assistant-settings-toggle-icon" style="font-size: 8px; transition: transform 0.2s ease;">▼</span>
      </button>
      <div id="wa-assistant-settings-collapse-content" style="padding: 0 16px 12px 16px; display: none; border-top: 1px solid rgba(255, 255, 255, 0.05); flex-direction: column; gap: 8px;">
        <div style="margin-top: 8px;">
          <label style="font-size: 10px; color: var(--wa-assistant-text-muted); display: block; margin-bottom: 4px;">מפתח API של Gemini ל-AI:</label>
          <input type="text" id="wa-assistant-key-input" autocomplete="off" data-lpignore="true" data-form-type="other" style="width: 100%; background: var(--wa-assistant-bg); border: 1px solid var(--wa-assistant-border); color: var(--wa-assistant-text); font-size: 11px; padding: 4px 8px; border-radius: 4px; outline: none; -webkit-text-security: disc;" placeholder="הזן מפתח API לשימוש ב-AI...">
        </div>
        <div style="display: flex; gap: 8px;">
          <div style="flex: 1;">
            <label style="font-size: 10px; color: var(--wa-assistant-text-muted); display: block; margin-bottom: 4px;">שלוחה (Voicenter):</label>
            <input type="text" id="wa-assistant-voicenter-ext-input" autocomplete="off" data-lpignore="true" style="width: 100%; background: var(--wa-assistant-bg); border: 1px solid var(--wa-assistant-border); color: var(--wa-assistant-text); font-size: 11px; padding: 4px 8px; border-radius: 4px; outline: none;" placeholder="101" value="${escapeHTML(voicenterExt)}">
          </div>
          <div style="flex: 2;">
            <label style="font-size: 10px; color: var(--wa-assistant-text-muted); display: block; margin-bottom: 4px;">קוד API של Voicenter:</label>
            <input type="text" id="wa-assistant-voicenter-code-input" autocomplete="off" data-lpignore="true" data-form-type="other" style="width: 100%; background: var(--wa-assistant-bg); border: 1px solid var(--wa-assistant-border); color: var(--wa-assistant-text); font-size: 11px; padding: 4px 8px; border-radius: 4px; outline: none; -webkit-text-security: disc;" placeholder="הזן קוד..." value="${escapeHTML(voicenterCode)}">
          </div>
        </div>
      </div>
    </div>

    <!-- Collapsible Cloud Sync Section -->
    <div class="wa-assistant-section-collapse" style="border-top: 1px solid var(--wa-assistant-border); background-color: var(--wa-assistant-card-bg);">
      <button id="wa-assistant-cloud-toggle-btn" style="width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 10px 16px; background: transparent; border: none; color: var(--wa-assistant-text); cursor: pointer; font-family: var(--wa-assistant-font); font-size: 11px; font-weight: 600; outline: none; transition: background-color 0.2s ease;">
        <span style="display: flex; align-items: center; gap: 6px;">☁️ סנכרון ענן (Chrome ⟷ Edge) <span id="wa-cloud-status-badge" style="font-size: 9px; padding: 2px 6px; border-radius: 8px; font-weight: 700; background: #059669; color: white;">מחובר 🟢</span></span>
        <span id="wa-assistant-cloud-toggle-icon" style="font-size: 8px; transition: transform 0.2s ease;">▼</span>
      </button>
      <div id="wa-assistant-cloud-collapse-content" style="padding: 0 16px 12px 16px; display: none; border-top: 1px solid rgba(255, 255, 255, 0.05); flex-direction: column; gap: 8px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 8px;">
          <span style="font-size: 11px; color: var(--wa-assistant-text); font-weight: 600;">הפעל סנכרון בזמן אמת</span>
          <input type="checkbox" id="wa-cloud-sync-enabled" style="accent-color: var(--wa-assistant-primary); cursor: pointer;">
        </div>
        <div>
          <label style="font-size: 10px; color: var(--wa-assistant-text-muted); display: block; margin-bottom: 4px;">כתובת Firebase Realtime DB:</label>
          <input type="text" id="wa-cloud-db-url-input" autocomplete="off" style="width: 100%; background: var(--wa-assistant-bg); border: 1px solid var(--wa-assistant-border); color: var(--wa-assistant-text); font-size: 11px; padding: 4px 8px; border-radius: 4px; outline: none; direction: ltr;" placeholder="https://eran-sync-whatsapp-default-rtdb.firebaseio.com">
        </div>
        <div>
          <label style="font-size: 10px; color: var(--wa-assistant-text-muted); display: block; margin-bottom: 4px;">מפתח סנכרון אישי (Sync Key):</label>
          <input type="text" id="wa-cloud-sync-key-input" autocomplete="off" style="width: 100%; background: var(--wa-assistant-bg); border: 1px solid var(--wa-assistant-border); color: var(--wa-assistant-text); font-size: 11px; padding: 4px 8px; border-radius: 4px; outline: none; direction: ltr;" placeholder="eran_sync">
        </div>
        <div style="display: flex; gap: 6px; margin-top: 4px;">
          <button id="wa-cloud-sync-now-btn" style="flex: 1; background: #2563eb; border: none; color: white; padding: 6px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; cursor: pointer; font-family: var(--wa-assistant-font);">🔄 סנכרן עכשיו</button>
        </div>
      </div>
    </div>

    <!-- Collapsible Syllabus Management Section -->
    <div class="wa-assistant-section-collapse" style="border-top: 1px solid var(--wa-assistant-border); background-color: var(--wa-assistant-card-bg);">
      <button id="wa-assistant-syllabus-toggle-btn" style="width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 10px 16px; background: transparent; border: none; color: var(--wa-assistant-text); cursor: pointer; font-family: var(--wa-assistant-font); font-size: 11px; font-weight: 600; outline: none; transition: background-color 0.2s ease;">
        <span style="display: flex; align-items: center; gap: 6px;">📎 ניהול קבצי סילבוס <span id="wa-assistant-syllabus-count-badge" style="background: var(--wa-assistant-primary); color: white; font-size: 9px; padding: 1px 5px; border-radius: 8px; font-weight: 700;">0</span></span>
        <span id="wa-assistant-syllabus-toggle-icon" style="font-size: 8px; transition: transform 0.2s ease;">▼</span>
      </button>
      <div id="wa-assistant-syllabus-collapse-content" style="padding: 0 16px 12px 16px; display: none; border-top: 1px solid rgba(255, 255, 255, 0.05);">
        <div id="wa-syllabus-list-container" style="display: flex; flex-direction: column; gap: 6px; margin-top: 8px; margin-bottom: 10px; max-height: 140px; overflow-y: auto; padding-right: 2px;">
          <!-- syllabus files list will be dynamically rendered -->
        </div>
        <button id="wa-assistant-add-syllabus-btn" style="width: 100%; background: transparent; border: 1px dashed var(--wa-assistant-primary); color: var(--wa-assistant-primary); cursor: pointer; font-size: 10px; padding: 6px 8px; border-radius: 4px; font-family: var(--wa-assistant-font); text-align: center; font-weight: 600;">+ הוסף קובץ סילבוס (PDF / תמונה)</button>
        <input type="file" id="wa-assistant-syllabus-file-input" accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
      </div>
    </div>

    <!-- Backup and Restore in sidebar footer -->
    <div style="padding: 12px; border-top: 1px solid var(--wa-assistant-border); display: flex; gap: 8px; justify-content: space-between; background-color: var(--wa-assistant-card-bg);">
      <button id="wa-assistant-export-btn" style="background: transparent; border: 1px solid var(--wa-assistant-border); color: var(--wa-assistant-text-muted); cursor: pointer; font-size: 10px; padding: 4px 8px; border-radius: 4px; flex: 1; font-family: var(--wa-assistant-font);">ייצוא 📤</button>
      <button id="wa-assistant-import-btn" style="background: transparent; border: 1px solid var(--wa-assistant-border); color: var(--wa-assistant-text-muted); cursor: pointer; font-size: 10px; padding: 4px 8px; border-radius: 4px; flex: 1; font-family: var(--wa-assistant-font);">ייבוא 📥</button>
      <button id="wa-assistant-reset-pos-btn" style="background: transparent; border: 1px solid var(--wa-assistant-border); color: var(--wa-assistant-text-muted); cursor: pointer; font-size: 10px; padding: 4px 8px; border-radius: 4px; flex: 1; font-family: var(--wa-assistant-font);" title="איפוס מיקומי הכפתורים הצפים למצב ברירת המחדל">אפס מיקומים 🔄</button>
      <input type="file" id="wa-assistant-import-file" accept=".json" style="display: none;">
    </div>
  `;
  document.body.appendChild(sidebar);

  const resetPosBtn = document.getElementById("wa-assistant-reset-pos-btn");
  if (resetPosBtn) {
    resetPosBtn.addEventListener("click", () => {
      safeStorageRemove(["triggerPos", "phoneTriggerPos", "copyTriggerPos", "reminderTriggerPos", "syllabusTriggerPos"], () => {
        trigger.style.bottom = "24px";
        trigger.style.right = "24px";
        trigger.style.left = "auto";
        trigger.style.top = "auto";
          if (phoneTrigger) {
            phoneTrigger.style.bottom = "24px";
            phoneTrigger.style.right = "72px";
            phoneTrigger.style.left = "auto";
            phoneTrigger.style.top = "auto";
          }
          if (copyTrigger) {
            copyTrigger.style.bottom = "24px";
            copyTrigger.style.right = "120px";
            copyTrigger.style.left = "auto";
            copyTrigger.style.top = "auto";
          }
          if (reminderTrigger) {
            reminderTrigger.style.bottom = "24px";
            reminderTrigger.style.right = "168px";
            reminderTrigger.style.left = "auto";
            reminderTrigger.style.top = "auto";
          }
          if (syllabusTrigger) {
            syllabusTrigger.style.bottom = "24px";
            syllabusTrigger.style.right = isWhatsApp ? "216px" : "72px";
            syllabusTrigger.style.left = "auto";
            syllabusTrigger.style.top = "auto";
          }
          showNotificationToast("מיקומי הכפתורים אופסו בהצלחה! 🔄");
      });
    });
  }

  // Setup Sidebar UI Events
  document.getElementById("wa-assistant-close-btn").addEventListener("click", toggleSidebar);
  document.getElementById("wa-assistant-search-input").addEventListener("input", renderSidebarTemplates);

  // Phone number quick routing handler
  const phoneBtn = document.getElementById("wa-phone-chat-btn");
  const phoneCallBtn = document.getElementById("wa-phone-call-btn");
  const phoneInput = document.getElementById("wa-phone-chat-input");
  
  if (phoneBtn && phoneInput) {
    phoneBtn.addEventListener("click", () => {
      let val = phoneInput.value.trim().replace(/\D/g, "");
      if (!val) {
        alert("נא להזין מספר טלפון תקין (רק ספרות)");
        return;
      }
      if (val.startsWith("0")) {
        val = "972" + val.slice(1);
      } else if (/^5\d{8}$/.test(val)) {
        val = "972" + val;
      }
      navigateToChat(val);
      phoneInput.value = "";
    });
    phoneInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        phoneBtn.click();
      }
    });
  }

  if (phoneCallBtn && phoneInput) {
    phoneCallBtn.addEventListener("click", () => {
      let val = phoneInput.value.trim().replace(/\D/g, "");
      if (!val) {
        alert("נא להזין מספר טלפון תקין (רק ספרות)");
        return;
      }
      if (val.startsWith("0")) {
        val = "972" + val.slice(1);
      } else if (/^5\d{8}$/.test(val)) {
        val = "972" + val;
      }
      triggerVoicenterCall(val);
      phoneInput.value = "";
    });
  }

  // Voicenter settings event listeners
  const voicenterExtInput = document.getElementById("wa-assistant-voicenter-ext-input");
  const voicenterCodeInput = document.getElementById("wa-assistant-voicenter-code-input");
  const dialerTypeSelect = document.getElementById("wa-assistant-dialer-type-select");
  const apiFieldsWrapper = document.getElementById("wa-assistant-api-fields-wrapper");

  if (dialerTypeSelect && apiFieldsWrapper) {
    dialerTypeSelect.addEventListener("change", () => {
      dialerType = dialerTypeSelect.value;
      safeStorageSet({ dialerType });
      apiFieldsWrapper.style.display = dialerType === "api" ? "flex" : "none";
    });
  }

  if (voicenterExtInput && voicenterCodeInput) {
    voicenterExtInput.addEventListener("change", () => {
      voicenterExt = voicenterExtInput.value.trim();
      safeStorageSet({ voicenterExt });
    });
    voicenterCodeInput.addEventListener("change", () => {
      voicenterCode = voicenterCodeInput.value.trim();
      safeStorageSet({ voicenterCode });
    });
  }

  // Tabs toggle logic
  const tabTemplatesBtn = document.getElementById("wa-tab-templates-btn");
  const tabRemindersBtn = document.getElementById("wa-tab-reminders-btn");
  const tabLeadsBtn = document.getElementById("wa-tab-leads-btn");
  const tabPaymentsBtn = document.getElementById("wa-tab-payments-btn");
  const templatesContent = document.getElementById("wa-templates-tab-content");
  const remindersContent = document.getElementById("wa-reminders-tab-content");
  const leadsContent = document.getElementById("wa-leads-tab-content");
  const paymentsContent = document.getElementById("wa-payments-tab-content");

  activeLeadsFilter = "active"; // "active" or "archived"
  activePaymentsFilter = "pending"; // "pending" or "completed"

  if (tabTemplatesBtn && tabRemindersBtn && tabLeadsBtn && tabPaymentsBtn && templatesContent && remindersContent && leadsContent && paymentsContent) {
    const deactivateAllTabs = () => {
      [tabTemplatesBtn, tabRemindersBtn, tabLeadsBtn, tabPaymentsBtn].forEach(btn => {
        btn.classList.remove("active");
        btn.style.borderBottom = "2px solid transparent";
        btn.style.color = "var(--wa-assistant-text-muted)";
      });
      [templatesContent, remindersContent, leadsContent, paymentsContent].forEach(c => {
        c.style.display = "none";
      });
    };

    tabTemplatesBtn.addEventListener("click", () => {
      deactivateAllTabs();
      activeTab = "templates";
      tabTemplatesBtn.classList.add("active");
      tabTemplatesBtn.style.borderBottom = "2px solid var(--wa-assistant-primary)";
      tabTemplatesBtn.style.color = "var(--wa-assistant-text)";
      templatesContent.style.display = "flex";
    });

    tabRemindersBtn.addEventListener("click", () => {
      deactivateAllTabs();
      activeTab = "reminders";
      tabRemindersBtn.classList.add("active");
      tabRemindersBtn.style.borderBottom = "2px solid var(--wa-assistant-primary)";
      tabRemindersBtn.style.color = "var(--wa-assistant-text)";
      remindersContent.style.display = "flex";
      renderSidebarReminders();
    });

    tabLeadsBtn.addEventListener("click", () => {
      deactivateAllTabs();
      activeTab = "leads";
      tabLeadsBtn.classList.add("active");
      tabLeadsBtn.style.borderBottom = "2px solid var(--wa-assistant-primary)";
      tabLeadsBtn.style.color = "var(--wa-assistant-text)";
      leadsContent.style.display = "flex";
      renderSidebarLeads();
    });

    tabPaymentsBtn.addEventListener("click", () => {
      deactivateAllTabs();
      activeTab = "payments";
      tabPaymentsBtn.classList.add("active");
      tabPaymentsBtn.style.borderBottom = "2px solid #10b981";
      tabPaymentsBtn.style.color = "var(--wa-assistant-text)";
      paymentsContent.style.display = "flex";
      renderSidebarPayments();
    });
  }

  // Leads CRM Tab Listeners
  const leadsAddBtn = document.getElementById("wa-leads-add-btn");
  if (leadsAddBtn) {
    leadsAddBtn.addEventListener("click", () => {
      openAddLeadModal();
    });
  }

  const leadsExportBtn = document.getElementById("wa-leads-export-btn");
  if (leadsExportBtn) {
    leadsExportBtn.addEventListener("click", () => {
      exportLeadsToCSV();
    });
  }

  const leadsSearchInput = document.getElementById("wa-leads-search-input");
  if (leadsSearchInput) {
    leadsSearchInput.addEventListener("input", () => {
      renderSidebarLeads();
    });
  }

  const filterActiveBtn = document.getElementById("wa-leads-filter-active");
  const filterArchivedBtn = document.getElementById("wa-leads-filter-archived");
  if (filterActiveBtn && filterArchivedBtn) {
    filterActiveBtn.addEventListener("click", () => {
      activeLeadsFilter = "active";
      filterActiveBtn.classList.add("active");
      filterActiveBtn.style.borderBottom = "2px solid var(--wa-assistant-primary)";
      filterActiveBtn.style.color = "var(--wa-assistant-text)";
      
      filterArchivedBtn.classList.remove("active");
      filterArchivedBtn.style.borderBottom = "2px solid transparent";
      filterArchivedBtn.style.color = "var(--wa-assistant-text-muted)";
      renderSidebarLeads();
    });

    filterArchivedBtn.addEventListener("click", () => {
      activeLeadsFilter = "archived";
      filterArchivedBtn.classList.add("active");
      filterArchivedBtn.style.borderBottom = "2px solid var(--wa-assistant-primary)";
      filterArchivedBtn.style.color = "var(--wa-assistant-text)";
      
      filterActiveBtn.classList.remove("active");
      filterActiveBtn.style.borderBottom = "2px solid transparent";
      filterActiveBtn.style.color = "var(--wa-assistant-text-muted)";
      renderSidebarLeads();
    });
  }

  // Payments Settlement Tab Listeners
  const paymentsAddBtn = document.getElementById("wa-payments-add-btn");
  if (paymentsAddBtn) {
    paymentsAddBtn.addEventListener("click", () => {
      openAddPaymentModal();
    });
  }

  const paymentsExportBtn = document.getElementById("wa-payments-export-btn");
  if (paymentsExportBtn) {
    paymentsExportBtn.addEventListener("click", () => {
      exportPaymentsToCSV();
    });
  }

  const paymentsSearchInput = document.getElementById("wa-payments-search-input");
  if (paymentsSearchInput) {
    paymentsSearchInput.addEventListener("input", () => {
      renderSidebarPayments();
    });
  }

  const payFilterPendingBtn = document.getElementById("wa-payments-filter-pending");
  const payFilterCompletedBtn = document.getElementById("wa-payments-filter-completed");
  if (payFilterPendingBtn && payFilterCompletedBtn) {
    payFilterPendingBtn.addEventListener("click", () => {
      activePaymentsFilter = "pending";
      payFilterPendingBtn.classList.add("active");
      payFilterPendingBtn.style.borderBottom = "2px solid #10b981";
      payFilterPendingBtn.style.color = "var(--wa-assistant-text)";

      payFilterCompletedBtn.classList.remove("active");
      payFilterCompletedBtn.style.borderBottom = "2px solid transparent";
      payFilterCompletedBtn.style.color = "var(--wa-assistant-text-muted)";
      renderSidebarPayments();
    });

    payFilterCompletedBtn.addEventListener("click", () => {
      activePaymentsFilter = "completed";
      payFilterCompletedBtn.classList.add("active");
      payFilterCompletedBtn.style.borderBottom = "2px solid #10b981";
      payFilterCompletedBtn.style.color = "var(--wa-assistant-text)";

      payFilterPendingBtn.classList.remove("active");
      payFilterPendingBtn.style.borderBottom = "2px solid transparent";
      payFilterPendingBtn.style.color = "var(--wa-assistant-text-muted)";
      renderSidebarPayments();
    });
  }

  // AI Reply Assistant button listener
  document.getElementById("wa-assistant-ai-reply-btn").addEventListener("click", () => {
    const threadHistory = getChatThreadHistory(10);
    if (threadHistory.length === 0) {
      alert("לא נמצאו הודעות בצ'אט הפעיל. אנא וודא שאתה בתוך שיחה פעילה ב-WhatsApp Web.");
      return;
    }
    openAIReplyModal(threadHistory);
  });

  

  // Helper to make any floating circular trigger button draggable across Edge, Chrome, Outlook & WhatsApp
  function makeButtonDraggable(el, storageKey, onClickCallback) {
    if (!el) return;

    let isDragging = false;
    let startX, startY, startLeft, startTop;
    const dragThreshold = 5;

    el.addEventListener("mousedown", (e) => {
      if (e.button !== 0) return; // Left click only
      e.preventDefault(); // Prevent native text/element drag in Edge & Chrome
      startX = e.clientX;
      startY = e.clientY;
      
      const rect = el.getBoundingClientRect();
      startLeft = rect.left;
      startTop = rect.top;
      isDragging = false;

      const onMouseMove = (me) => {
        const dx = me.clientX - startX;
        const dy = me.clientY - startY;

        if (!isDragging && (Math.abs(dx) > dragThreshold || Math.abs(dy) > dragThreshold)) {
          isDragging = true;
        }

        if (isDragging) {
          let newLeft = startLeft + dx;
          let newTop = startTop + dy;

          newLeft = Math.max(10, Math.min(window.innerWidth - 54, newLeft));
          newTop = Math.max(10, Math.min(window.innerHeight - 54, newTop));

          el.style.left = `${newLeft}px`;
          el.style.top = `${newTop}px`;
          el.style.bottom = "auto";
          el.style.right = "auto";
        }
      };

      const onMouseUp = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);

        if (isDragging) {
          const rect = el.getBoundingClientRect();
          safeStorageSet({ [storageKey]: { left: rect.left, top: rect.top } });

          el.style.pointerEvents = "none";
          setTimeout(() => {
            el.style.pointerEvents = "auto";
          }, 100);
        }
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    });

    if (onClickCallback) {
      el.addEventListener("click", (e) => {
        if (isDragging) {
          e.stopPropagation();
          e.preventDefault();
          return;
        }
        onClickCallback(e);
      });
    }
  }

  // Bind drag & click handlers for all 5 floating buttons
  makeButtonDraggable(trigger, "triggerPos", toggleSidebar);
  makeButtonDraggable(syllabusTrigger, "syllabusTriggerPos", (e) => toggleFloatingSyllabusMenu(syllabusTrigger, e));
  makeButtonDraggable(phoneTrigger, "phoneTriggerPos", () => openQuickPhoneModal());
  makeButtonDraggable(reminderTrigger, "reminderTriggerPos", () => openAddReminderModal());
  makeButtonDraggable(copyTrigger, "copyTriggerPos", () => {
    const clientInfo = extractClientFromPrizaOrSelection();
    if (clientInfo && (clientInfo.phone || clientInfo.email)) {
      const formatted = clientInfo.phone ? (clientInfo.formattedPhone || formatIsraeliPhoneWithDash(clientInfo.phone)) : "";
      if (clientInfo.phone) lastCopiedPhone = clientInfo.phone;
      if (clientInfo.name) lastCopiedName = clientInfo.name;
      if (clientInfo.email) lastCopiedEmail = clientInfo.email;
      safeStorageSet({ lastCopiedPhone, lastCopiedName, lastCopiedEmail });

      const textToCopy = formatted || clientInfo.email;
      const msg = clientInfo.name ? `הפרטים של ${clientInfo.name} (${textToCopy}) הועתקו! 📋` : `הועתק ללוח: ${textToCopy} 📋`;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showNotificationToast(msg);
        }).catch(() => {
          fallbackCopyTextToClipboard(textToCopy);
          showNotificationToast(msg);
        });
      } else {
        fallbackCopyTextToClipboard(textToCopy);
        showNotificationToast(msg);
      }
    } else {
      showNotificationToast("סמן מספר או מייל בעכבר ולחץ להעתקה 📋");
    }
  });

  // New template creation button inside WhatsApp Web
  document.getElementById("wa-assistant-new-btn").addEventListener("click", () => openManageTemplateModal());

  // API Key handler
  const keyInput = document.getElementById("wa-assistant-key-input");
  if (keyInput) {
    keyInput.value = geminiApiKey;
    const saveKeyUpdate = () => {
      const val = keyInput.value.trim();
      geminiApiKey = val;
      safeStorageSet({ geminiApiKey: val });
    };
    keyInput.addEventListener("input", saveKeyUpdate);
    keyInput.addEventListener("change", saveKeyUpdate);
  }

  // Collapsible Features Selector logic
  const featuresToggleBtn = document.getElementById("wa-assistant-features-toggle-btn");
  const featuresCollapseContent = document.getElementById("wa-assistant-features-collapse-content");
  const featuresToggleIcon = document.getElementById("wa-assistant-features-toggle-icon");
  let featuresCollapsed = true;

  if (featuresToggleBtn && featuresCollapseContent) {
    featuresToggleBtn.addEventListener("click", () => {
      featuresCollapsed = !featuresCollapsed;
      featuresCollapseContent.style.display = featuresCollapsed ? "none" : "flex";
      if (featuresToggleIcon) {
        featuresToggleIcon.style.transform = featuresCollapsed ? "rotate(0deg)" : "rotate(180deg)";
      }
    });
  }

  let currentViewedPlatform = getCurrentPlatform();
  if (currentViewedPlatform === "other") currentViewedPlatform = "web";

  const tabWa = document.getElementById("wa-feat-plat-tab-whatsapp");
  const tabMail = document.getElementById("wa-feat-plat-tab-mail");
  const tabExcel = document.getElementById("wa-feat-plat-tab-excel");
  const tabWeb = document.getElementById("wa-feat-plat-tab-web");

  const updatePlatformTabStyles = () => {
    [
      { btn: tabWa, p: "whatsapp" },
      { btn: tabMail, p: "mail" },
      { btn: tabExcel, p: "excel" },
      { btn: tabWeb, p: "web" }
    ].forEach(({ btn, p }) => {
      if (!btn) return;
      if (currentViewedPlatform === p) {
        btn.style.background = "var(--wa-assistant-primary)";
        btn.style.color = "white";
        btn.style.fontWeight = "700";
      } else {
        btn.style.background = "transparent";
        btn.style.color = "var(--wa-assistant-text-muted)";
        btn.style.fontWeight = "500";
      }
    });
  };

  const syncFeatureCheckboxes = () => {
    updatePlatformTabStyles();

    // Floating Screen Buttons for currentViewedPlatform
    const cbBtnSidebar = document.getElementById("wa-feat-toggle-btn-sidebar");
    const cbBtnSyllabus = document.getElementById("wa-feat-toggle-btn-syllabus");
    const cbBtnDialer = document.getElementById("wa-feat-toggle-btn-dialer");
    const cbBtnCopy = document.getElementById("wa-feat-toggle-btn-copy");
    const cbBtnReminder = document.getElementById("wa-feat-toggle-btn-reminder");

    if (cbBtnSidebar) cbBtnSidebar.checked = isFeatureEnabledForPlatform("btnSidebar", currentViewedPlatform);
    if (cbBtnSyllabus) cbBtnSyllabus.checked = isFeatureEnabledForPlatform("btnSyllabus", currentViewedPlatform);
    if (cbBtnDialer) cbBtnDialer.checked = isFeatureEnabledForPlatform("btnDialer", currentViewedPlatform);
    if (cbBtnCopy) cbBtnCopy.checked = isFeatureEnabledForPlatform("btnCopyPhone", currentViewedPlatform);
    if (cbBtnReminder) cbBtnReminder.checked = isFeatureEnabledForPlatform("btnReminder", currentViewedPlatform);

    // Sidebar Tabs & Modules (Global)
    const cbTemplates = document.getElementById("wa-feat-toggle-templates");
    const cbReminders = document.getElementById("wa-feat-toggle-reminders");
    const cbPinned = document.getElementById("wa-feat-toggle-pinned");
    const cbLeads = document.getElementById("wa-feat-toggle-leads");
    const cbPayments = document.getElementById("wa-feat-toggle-payments");

    if (cbTemplates) cbTemplates.checked = !!enabledFeatures.templates;
    if (cbReminders) cbReminders.checked = !!enabledFeatures.reminders;
    if (cbPinned) cbPinned.checked = !!enabledFeatures.pinnedShortcuts;
    if (cbLeads) cbLeads.checked = !!enabledFeatures.leadsTracker;
    if (cbPayments) cbPayments.checked = !!enabledFeatures.paymentsTracker;
  };

  if (tabWa) {
    tabWa.addEventListener("click", () => {
      currentViewedPlatform = "whatsapp";
      syncFeatureCheckboxes();
    });
  }
  if (tabMail) {
    tabMail.addEventListener("click", () => {
      currentViewedPlatform = "mail";
      syncFeatureCheckboxes();
    });
  }
  if (tabExcel) {
    tabExcel.addEventListener("click", () => {
      currentViewedPlatform = "excel";
      syncFeatureCheckboxes();
    });
  }
  if (tabWeb) {
    tabWeb.addEventListener("click", () => {
      currentViewedPlatform = "web";
      syncFeatureCheckboxes();
    });
  }

  const bindFloatingButtonToggle = (el, key) => {
    if (!el) return;
    el.addEventListener("change", () => {
      if (!enabledFeatures.platformSettings) {
        enabledFeatures.platformSettings = {};
      }
      if (!enabledFeatures.platformSettings[currentViewedPlatform]) {
        enabledFeatures.platformSettings[currentViewedPlatform] = {};
      }
      enabledFeatures.platformSettings[currentViewedPlatform][key] = el.checked;
      if (currentViewedPlatform === getCurrentPlatform()) {
        enabledFeatures[key] = el.checked;
      }
      safeStorageSet({ enabledFeatures }, () => {
        applyModularFeatures();
        const platName = currentViewedPlatform === "whatsapp" ? "ווטסאפ" : currentViewedPlatform === "mail" ? "דוא\"ל" : currentViewedPlatform === "excel" ? "אקסל" : "אתרי Web";
        showNotificationToast(`הגדרות הכפתורים עבור ${platName} עודכנו בהצלחה! 🎛️`);
      });
    });
  };

  bindFloatingButtonToggle(document.getElementById("wa-feat-toggle-btn-sidebar"), "btnSidebar");
  bindFloatingButtonToggle(document.getElementById("wa-feat-toggle-btn-syllabus"), "btnSyllabus");
  bindFloatingButtonToggle(document.getElementById("wa-feat-toggle-btn-dialer"), "btnDialer");
  bindFloatingButtonToggle(document.getElementById("wa-feat-toggle-btn-copy"), "btnCopyPhone");
  bindFloatingButtonToggle(document.getElementById("wa-feat-toggle-btn-reminder"), "btnReminder");

  const bindGlobalToggle = (el, key) => {
    if (!el) return;
    el.addEventListener("change", () => {
      enabledFeatures[key] = el.checked;
      safeStorageSet({ enabledFeatures }, () => {
        applyModularFeatures();
        showNotificationToast("הגדרות הרכיבים עודכנו בהצלחה! 🎛️");
      });
    });
  };

  bindGlobalToggle(document.getElementById("wa-feat-toggle-templates"), "templates");
  bindGlobalToggle(document.getElementById("wa-feat-toggle-reminders"), "reminders");
  bindGlobalToggle(document.getElementById("wa-feat-toggle-pinned"), "pinnedShortcuts");
  bindGlobalToggle(document.getElementById("wa-feat-toggle-leads"), "leadsTracker");
  bindGlobalToggle(document.getElementById("wa-feat-toggle-payments"), "paymentsTracker");

  syncFeatureCheckboxes();

  // Collapsible Connections Settings logic
  const settingsToggleBtn = document.getElementById("wa-assistant-settings-toggle-btn");
  const settingsCollapseContent = document.getElementById("wa-assistant-settings-collapse-content");
  const settingsToggleIcon = document.getElementById("wa-assistant-settings-toggle-icon");
  let settingsCollapsed = true;

  if (settingsToggleBtn && settingsCollapseContent) {
    settingsToggleBtn.addEventListener("click", () => {
      settingsCollapsed = !settingsCollapsed;
      settingsCollapseContent.style.display = settingsCollapsed ? "none" : "flex";
      if (settingsToggleIcon) {
        settingsToggleIcon.style.transform = settingsCollapsed ? "rotate(0deg)" : "rotate(180deg)";
      }
    });
  }

  // Collapsible Cloud Sync logic
  const cloudToggleBtn = document.getElementById("wa-assistant-cloud-toggle-btn");
  const cloudCollapseContent = document.getElementById("wa-assistant-cloud-collapse-content");
  const cloudToggleIcon = document.getElementById("wa-assistant-cloud-toggle-icon");
  let cloudCollapsed = true;

  if (cloudToggleBtn && cloudCollapseContent) {
    cloudToggleBtn.addEventListener("click", () => {
      cloudCollapsed = !cloudCollapsed;
      cloudCollapseContent.style.display = cloudCollapsed ? "none" : "flex";
      if (cloudToggleIcon) {
        cloudToggleIcon.style.transform = cloudCollapsed ? "rotate(0deg)" : "rotate(180deg)";
      }
    });
  }

  const cloudSyncEnabledCheck = document.getElementById("wa-cloud-sync-enabled");
  const cloudDbUrlInput = document.getElementById("wa-cloud-db-url-input");
  const cloudSyncKeyInput = document.getElementById("wa-cloud-sync-key-input");
  const cloudSyncNowBtn = document.getElementById("wa-cloud-sync-now-btn");

  if (cloudSyncEnabledCheck) {
    cloudSyncEnabledCheck.checked = firebaseSyncEnabled;
    cloudSyncEnabledCheck.addEventListener("change", () => {
      firebaseSyncEnabled = cloudSyncEnabledCheck.checked;
      safeStorageSet({ firebaseSyncEnabled });
      if (firebaseSyncEnabled) {
        fetchInitialCloudSync();
        showNotificationToast("סנכרון ענן הופעל! ☁️🟢");
      } else {
        if (firebaseEventSource) {
          try { firebaseEventSource.close(); } catch(e) {}
          firebaseEventSource = null;
        }
        firebaseSyncStatus = "disabled";
        updateCloudSyncStatusIndicator();
        showNotificationToast("סנכרון ענן כובה ⚪");
      }
    });
  }

  if (cloudDbUrlInput) {
    cloudDbUrlInput.value = firebaseDbUrl;
    cloudDbUrlInput.addEventListener("change", () => {
      firebaseDbUrl = cloudDbUrlInput.value.trim();
      safeStorageSet({ firebaseDbUrl });
      fetchInitialCloudSync();
    });
  }

  if (cloudSyncKeyInput) {
    cloudSyncKeyInput.value = firebaseSyncKey;
    cloudSyncKeyInput.addEventListener("change", () => {
      firebaseSyncKey = cloudSyncKeyInput.value.trim() || "eran_sync";
      safeStorageSet({ firebaseSyncKey });
      fetchInitialCloudSync();
    });
  }

  if (cloudSyncNowBtn) {
    cloudSyncNowBtn.addEventListener("click", () => {
      showNotificationToast("מבצע סנכרון ענן מלא... 🔄");
      fetchInitialCloudSync(() => {
        pushStateToCloud(true);
        showNotificationToast("סנכרון ענן הושלם בהצלחה! ☁️✨");
      });
    });
  }

  // Collapsible Syllabus logic
  const syllabusToggleBtn = document.getElementById("wa-assistant-syllabus-toggle-btn");
  const syllabusCollapseContent = document.getElementById("wa-assistant-syllabus-collapse-content");
  const syllabusToggleIcon = document.getElementById("wa-assistant-syllabus-toggle-icon");
  let syllabusCollapsed = true;

  if (syllabusToggleBtn && syllabusCollapseContent) {
    syllabusToggleBtn.addEventListener("click", () => {
      syllabusCollapsed = !syllabusCollapsed;
      syllabusCollapseContent.style.display = syllabusCollapsed ? "none" : "block";
      if (syllabusToggleIcon) {
        syllabusToggleIcon.style.transform = syllabusCollapsed ? "rotate(0deg)" : "rotate(180deg)";
      }
    });
  }

  // Add syllabus file button click
  const addSyllabusBtn = document.getElementById("wa-assistant-add-syllabus-btn");
  const syllabusFileInput = document.getElementById("wa-assistant-syllabus-file-input");

  if (addSyllabusBtn && syllabusFileInput) {
    addSyllabusBtn.addEventListener("click", () => syllabusFileInput.click());
    syllabusFileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = function(evt) {
        const base64Data = evt.target.result;
        const newId = "file-" + Date.now();
        const friendlyName = file.name.replace(/\.[^/.]+$/, "");
        
        syllabusFiles.push({
          id: newId,
          name: friendlyName,
          fileName: file.name,
          data: base64Data
        });
        
        safeStorageSet({ syllabusFiles }, () => {
          loadTemplates();
          alert("קובץ הסילבוס נטען ונשמר בהצלחה!");
        });
      };
      reader.readAsDataURL(file);
    });
  }

  // Send syllabus button listener
  const sendSyllabusBtn = document.getElementById("wa-assistant-send-syllabus-btn");
  if (sendSyllabusBtn) {
    sendSyllabusBtn.addEventListener("click", toggleSyllabusDropdown);
  }

  // Export templates
  document.getElementById("wa-assistant-export-btn").addEventListener("click", () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ templates, categories }, null, 2));
    const anchor = document.createElement("a");
    anchor.href = dataStr;
    anchor.download = `whatsapp-templates-backup.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  });

  // Import templates
  const fileInput = document.getElementById("wa-assistant-import-file");
  document.getElementById("wa-assistant-import-btn").addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(evt) {
      try {
        const data = JSON.parse(evt.target.result);
        if (data.templates && Array.isArray(data.templates)) {
          if (confirm("האם למזג עם התבניות הקיימות? (ביטול יחליף את הכל)")) {
            data.templates.forEach(newT => {
              if (!templates.find(t => t.shortcut === newT.shortcut)) templates.push(newT);
            });
            if (data.categories) {
              data.categories.forEach(c => {
                if (!categories.includes(c)) categories.push(c);
              });
            }
          } else {
            templates = data.templates;
            categories = data.categories || DEFAULT_CATEGORIES;
          }
          safeStorageSet({ templates, categories }, () => {
            loadTemplates();
            alert("הייבוא הושלם בהצלחה!");
          });
        }
      } catch(err) {
        alert("שגיאה בייבוא הקובץ: " + err.message);
      }
    };
    reader.readAsText(file);
  });

  // Listen for shortcuts in WhatsApp Web text inputs
  setupKeyboardListener();

  // Start background reminder alarm checking loop
  startReminderLoop();

  // Listen for outgoing messages to automatically log attempts in CRM
  document.addEventListener("click", (e) => {
    const sendBtn = e.target.closest('[data-testid="compose-btn-send"], [data-icon="send"], button[title="שליחה"]');
    if (sendBtn) {
      setTimeout(handleOutgoingMessageSent, 100);
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      const editor = getWhatsAppEditor();
      if (editor && e.target === editor) {
        setTimeout(handleOutgoingMessageSent, 100);
      }
    }
  });
}

function toggleSidebar() {
  const sidebar = document.getElementById("wa-assistant-sidebar-panel");
  const trigger = document.getElementById("wa-assistant-trigger-btn");
  const phoneTrigger = document.getElementById("wa-phone-quick-trigger-btn");
  const copyTrigger = document.getElementById("wa-copy-phone-trigger-btn");
  const reminderTrigger = document.getElementById("wa-reminder-quick-trigger-btn");
  const syllabusTrigger = document.getElementById("wa-syllabus-quick-trigger-btn");
  sidebarOpen = !sidebarOpen;

  if (sidebarOpen) {
    sidebar.classList.add("open");
    if (trigger) trigger.style.display = "none";
    if (phoneTrigger) phoneTrigger.style.display = "none";
    if (copyTrigger) copyTrigger.style.display = "none";
    if (reminderTrigger) reminderTrigger.style.display = "none";
    if (syllabusTrigger) syllabusTrigger.style.display = "none";
    
    // Sync API key value
    document.getElementById("wa-assistant-key-input").value = geminiApiKey;

    renderSidebarCategories();
    renderSidebarTemplates();
    renderSyllabusSettingsList();
    renderSidebarReminders();
    renderSidebarLeads();
    renderSidebarPayments();
  } else {
    sidebar.classList.remove("open");
    const p = getCurrentPlatform();
    if (trigger) trigger.style.display = isFeatureEnabledForPlatform("btnSidebar", p) ? "flex" : "none";
    if (phoneTrigger) phoneTrigger.style.display = isFeatureEnabledForPlatform("btnDialer", p) ? "flex" : "none";
    if (copyTrigger) copyTrigger.style.display = isFeatureEnabledForPlatform("btnCopyPhone", p) ? "flex" : "none";
    if (reminderTrigger) reminderTrigger.style.display = isFeatureEnabledForPlatform("btnReminder", p) ? "flex" : "none";
    if (syllabusTrigger) syllabusTrigger.style.display = isFeatureEnabledForPlatform("btnSyllabus", p) ? "flex" : "none";
  }
}

function renderSidebarCategories() {
  const catList = document.getElementById("wa-assistant-categories-list");
  if (!catList) return;

  catList.innerHTML = "";

  // "All" Category
  const allPill = document.createElement("span");
  allPill.className = `wa-assistant-cat-pill ${activeCategory === "all" ? "active" : ""}`;
  allPill.textContent = "הכל";
  allPill.addEventListener("click", () => {
    activeCategory = "all";
    updateActiveCategoryPills();
    renderSidebarTemplates();
  });
  catList.appendChild(allPill);

  // Individual categories
  categories.forEach(cat => {
    const pill = document.createElement("span");
    pill.className = `wa-assistant-cat-pill ${activeCategory === cat ? "active" : ""}`;
    pill.textContent = cat;
    pill.addEventListener("click", () => {
      activeCategory = cat;
      updateActiveCategoryPills();
      renderSidebarTemplates();
    });
    catList.appendChild(pill);
  });

  // Category management button
  const editCatBtn = document.createElement("span");
  editCatBtn.className = "wa-assistant-cat-pill";
  editCatBtn.style.border = "1px dashed var(--wa-assistant-primary)";
  editCatBtn.style.color = "var(--wa-assistant-primary)";
  editCatBtn.innerHTML = "⚙️ ערוך קטגוריות";
  editCatBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    openManageCategoriesModal();
  });
  catList.appendChild(editCatBtn);
}

function openManageCategoriesModal() {
  const existing = document.getElementById("wa-assistant-cat-modal");
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.id = "wa-assistant-cat-modal";
  overlay.className = "wa-modal-overlay";
  overlay.style.direction = "rtl";

  let catItemsHTML = "";
  categories.forEach((cat) => {
    catItemsHTML += `
      <div class="wa-cat-manage-row" style="display: flex; gap: 8px; align-items: center;">
        <input type="text" class="wa-cat-name-input" data-original="${escapeHTML(cat)}" value="${escapeHTML(cat)}" style="flex-grow: 1; background: var(--wa-assistant-bg); border: 1px solid var(--wa-assistant-border); color: var(--wa-assistant-text); font-size: 12px; padding: 6px 10px; border-radius: 6px; outline: none; font-family: var(--wa-assistant-font);" required>
        <button type="button" class="wa-cat-delete-btn" style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); color: #ef4444; border-radius: 6px; cursor: pointer; padding: 6px 10px; font-size: 11px;">🗑️ מחק</button>
      </div>
    `;
  });

  overlay.innerHTML = `
    <div class="wa-modal-box" style="position: relative; width: 420px; max-width: 95%; max-height: 85vh; display: flex; flex-direction: column;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid var(--wa-assistant-border); padding-bottom: 8px;">
        <h3 style="margin: 0; font-size: 15px; font-weight: 700; color: var(--wa-assistant-text);">⚙️ ניהול קטגוריות</h3>
        <button type="button" id="wa-cat-close-x" style="background: transparent; border: none; color: var(--wa-assistant-text-muted); font-size: 24px; cursor: pointer; line-height: 1; padding: 0 6px; border-radius: 4px;" title="סגור (Esc)">&times;</button>
      </div>
      <p style="font-size: 11px; color: var(--wa-assistant-text-muted); margin-bottom: 14px;">תוכל לשנות שמות קטגוריות, להוסיף חדשות או למחוק:</p>
      
      <div id="wa-cat-list-box" style="display: flex; flex-direction: column; gap: 8px; max-height: 45vh; overflow-y: auto; margin-bottom: 14px; padding-left: 4px;">
        ${catItemsHTML}
      </div>

      <button type="button" id="wa-add-cat-row-btn" style="width: 100%; background: transparent; border: 1px dashed var(--wa-assistant-primary); color: var(--wa-assistant-primary); padding: 8px; border-radius: 6px; font-size: 12px; cursor: pointer; font-family: var(--wa-assistant-font); margin-bottom: 16px;">+ הוסף קטגוריה חדשה</button>

      <div class="wa-modal-actions" style="margin-top: auto; padding-top: 10px; border-top: 1px solid var(--wa-assistant-border);">
        <button type="button" class="wa-modal-btn wa-modal-btn-secondary" id="wa-cat-cancel-btn">ביטול (Esc)</button>
        <button type="button" class="wa-modal-btn wa-modal-btn-primary" id="wa-cat-save-btn">שמור שינויים</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const close = () => {
    document.removeEventListener("keydown", onKeyDownEsc);
    overlay.remove();
  };

  const onKeyDownEsc = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      close();
    }
  };
  document.addEventListener("keydown", onKeyDownEsc);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });

  const closeXBtn = overlay.querySelector("#wa-cat-close-x");
  if (closeXBtn) closeXBtn.addEventListener("click", close);

  const cancelBtn = overlay.querySelector("#wa-cat-cancel-btn");
  if (cancelBtn) cancelBtn.addEventListener("click", close);

  const listBox = document.getElementById("wa-cat-list-box");
  listBox.addEventListener("click", (e) => {
    if (e.target.classList.contains("wa-cat-delete-btn")) {
      const row = e.target.closest(".wa-cat-manage-row");
      if (row) row.remove();
    }
  });

  document.getElementById("wa-add-cat-row-btn").addEventListener("click", () => {
    const newRow = document.createElement("div");
    newRow.className = "wa-cat-manage-row";
    newRow.style.display = "flex";
    newRow.style.gap = "8px";
    newRow.style.alignItems = "center";
    newRow.innerHTML = `
      <input type="text" class="wa-cat-name-input" data-original="" value="" placeholder="שם הקטגוריה..." style="flex-grow: 1; background: var(--wa-assistant-bg); border: 1px solid var(--wa-assistant-border); color: var(--wa-assistant-text); font-size: 12px; padding: 6px 10px; border-radius: 6px; outline: none; font-family: var(--wa-assistant-font);" required>
      <button type="button" class="wa-cat-delete-btn" style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); color: #ef4444; border-radius: 6px; cursor: pointer; padding: 6px 10px; font-size: 11px;">🗑️ מחק</button>
    `;
    listBox.appendChild(newRow);
    newRow.querySelector("input").focus();
  });

  document.getElementById("wa-cat-cancel-btn").addEventListener("click", () => overlay.remove());

  document.getElementById("wa-cat-save-btn").addEventListener("click", () => {
    const inputs = Array.from(listBox.querySelectorAll(".wa-cat-name-input"));
    const newCategories = [];
    const nameMap = {};

    inputs.forEach(input => {
      const newName = input.value.trim();
      const origName = input.getAttribute("data-original");
      if (newName) {
        if (!newCategories.includes(newName)) {
          newCategories.push(newName);
        }
        if (origName) {
          nameMap[origName] = newName;
        }
      }
    });

    if (newCategories.length === 0) {
      alert("נא להזין לפחות קטגוריה אחת!");
      return;
    }

    const defaultCat = newCategories[0] || "כללי";
    templates = templates.map(t => {
      if (nameMap[t.category]) {
        return { ...t, category: nameMap[t.category] };
      }
      if (!newCategories.includes(t.category)) {
        return { ...t, category: defaultCat };
      }
      return t;
    });

    categories = newCategories;

    if (activeCategory !== "all" && !categories.includes(activeCategory)) {
      activeCategory = "all";
    }

    safeStorageSet({ categories, templates }, () => {
      renderSidebarCategories();
      renderSidebarTemplates();
      overlay.remove();
    });
  });
}

function updateActiveCategoryPills() {
  const pills = document.querySelectorAll(".wa-assistant-cat-pill");
  pills.forEach(pill => {
    if (pill.textContent === "הכל" && activeCategory === "all") {
      pill.classList.add("active");
    } else if (pill.textContent === activeCategory) {
      pill.classList.add("active");
    } else {
      pill.classList.remove("active");
    }
  });
}

function renderSidebarTemplates() {
  const listContainer = document.getElementById("wa-assistant-templates-list");
  const searchInput = document.getElementById("wa-assistant-search-input");
  if (!listContainer) return;

  listContainer.innerHTML = "";
  const query = searchInput ? searchInput.value.toLowerCase().trim() : "";

  let filtered = templates;

  if (activeCategory !== "all") {
    filtered = filtered.filter(t => t.category === activeCategory);
  }

  if (query) {
    filtered = filtered.filter(t => 
      t.title.toLowerCase().includes(query) || 
      t.shortcut.toLowerCase().includes(query) || 
      t.content.toLowerCase().includes(query)
    );
  }

  if (filtered.length === 0) {
    listContainer.innerHTML = `<div style="text-align:center; padding:20px; color:var(--wa-assistant-text-muted); font-size:12px;">לא נמצאו תבניות מתאימות.</div>`;
    return;
  }

  filtered.forEach(tpl => {
    const item = document.createElement("div");
    item.className = "wa-assistant-item";
    
    const formattedContent = escapeHTML(tpl.content)
      .replace(/\{([^}]+)\}/g, "<mark>{$1}</mark>")
      .replace(/\[([^\]]+)\]/g, "<mark>[$1]</mark>");

    const associatedFile = tpl.associatedSyllabusId ? (syllabusFiles || []).find(f => f.id === tpl.associatedSyllabusId) : null;
    const syllabusBadgeHTML = associatedFile ? `
      <div class="wa-tpl-syllabus-badge" style="display: inline-flex; align-items: center; gap: 4px; background: rgba(0, 122, 255, 0.15); border: 1px solid rgba(0, 122, 255, 0.4); color: #60a5fa; font-size: 10px; font-weight: 600; padding: 2px 7px; border-radius: 4px; margin-bottom: 6px; cursor: pointer; font-family: var(--wa-assistant-font);" title="לחץ לשליחה או הורדה ישירה של קובץ הסילבוס">
        📎 סילבוס: ${escapeHTML(associatedFile.name)}
      </div>
    ` : "";

    item.innerHTML = `
      <div class="wa-assistant-item-header">
        <span class="wa-assistant-item-title">${escapeHTML(tpl.title)}</span>
        <span class="wa-assistant-item-shortcut">${escapeHTML(tpl.shortcut)}</span>
      </div>
      ${syllabusBadgeHTML}
      <div class="wa-assistant-item-body" style="margin-bottom: 8px;">${formattedContent}</div>
      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.03); padding-top: 6px;">
        <span style="font-size: 10px; color: var(--wa-assistant-primary); font-weight: 600;">הכנס הודעה ↵</span>
        <div style="display: flex; gap: 8px; align-items: center;">
          <button class="wa-assistant-card-pin" data-id="${tpl.id}" style="background: ${tpl.isPinned ? "rgba(245, 158, 11, 0.15)" : "transparent"}; border: 1px solid ${tpl.isPinned ? "rgba(245, 158, 11, 0.4)" : "transparent"}; color: ${tpl.isPinned ? "#f59e0b" : "var(--wa-assistant-text-muted)"}; cursor: pointer; font-size: 10px; font-weight: 600; padding: 2px 5px; border-radius: 4px;" title="${tpl.isPinned ? "בטל הצמדה למסך" : "הצמד כקיצור דרך מהיר על המסך"}">${tpl.isPinned ? "📍 מוצמד" : "📌 הצמד"}</button>
          <button class="wa-assistant-card-edit" data-id="${tpl.id}" style="background:none; border:none; color:var(--wa-assistant-text-muted); cursor:pointer; font-size:11px; padding: 2px;">✏️ ערוך</button>
          <button class="wa-assistant-card-delete" data-id="${tpl.id}" style="background:none; border:none; color:#ef4444; cursor:pointer; font-size:11px; padding: 2px;">🗑️ מחק</button>
        </div>
      </div>
    `;

    // Click pin button to toggle pinned state
    const pinBtn = item.querySelector(".wa-assistant-card-pin");
    if (pinBtn) {
      pinBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        tpl.isPinned = !tpl.isPinned;
        safeStorageSet({ templates }, () => {
          renderSidebarTemplates();
          renderFloatingPinnedBar();
          showNotificationToast(tpl.isPinned ? `התבנית "${tpl.title}" הוצמדה למסך כקיצור דרך מהיר! 📌` : `ההצמדה של "${tpl.title}" בוטלה. 📍`);
        });
      });
    }

    // Click syllabus badge to send/download directly
    const sylBadge = item.querySelector(".wa-tpl-syllabus-badge");
    if (sylBadge && associatedFile) {
      sylBadge.addEventListener("click", (e) => {
        e.stopPropagation();
        sendSyllabusFile(associatedFile);
      });
    }

    // Event listeners
    // Click card body/header to insert
    item.querySelector(".wa-assistant-item-body").addEventListener("click", (e) => {
      e.stopPropagation();
      handleTemplateSelection(tpl);
    });
    item.querySelector(".wa-assistant-item-header").addEventListener("click", (e) => {
      e.stopPropagation();
      handleTemplateSelection(tpl);
    });
    item.querySelector("span").addEventListener("click", (e) => {
      e.stopPropagation();
      handleTemplateSelection(tpl);
    });

    // Edit
    item.querySelector(".wa-assistant-card-edit").addEventListener("click", (e) => {
      e.stopPropagation();
      openManageTemplateModal(tpl);
    });

    // Delete
    item.querySelector(".wa-assistant-card-delete").addEventListener("click", (e) => {
      e.stopPropagation();
      if (confirm(`האם אתה בטוח שברצונך למחוק את התבנית "${tpl.title}"?`)) {
        templates = templates.filter(t => t.id !== tpl.id);
        safeStorageSet({ templates }, () => {
          broadcastCrossTabMessage("TEMPLATES_UPDATED", { templates });
          pushStateToCloud();
          loadTemplates();
        });
      }
    });

    listContainer.appendChild(item);
  });
}

// Floating Quick Pinned Shortcuts Bar (rendered on screen for 1-click execution)
function renderFloatingPinnedBar() {
  const existing = document.getElementById("wa-pinned-shortcuts-bar");
  
  if (!enabledFeatures.pinnedShortcuts) {
    if (existing) existing.remove();
    return;
  }

  const pinned = (templates || []).filter(t => t && t.isPinned);
  if (pinned.length === 0) {
    if (existing) existing.remove();
    return;
  }

  let bar = existing;
  if (!bar) {
    bar = document.createElement("div");
    bar.id = "wa-pinned-shortcuts-bar";
    bar.className = "wa-pinned-shortcuts-bar";
    bar.style.cssText = `
      position: fixed;
      z-index: 999997;
      background: rgba(15, 23, 42, 0.92);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.18);
      border-radius: 30px;
      padding: 6px 14px;
      display: flex;
      align-items: center;
      gap: 6px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.55);
      direction: rtl;
      font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
      user-select: none;
      max-width: 90vw;
      overflow-x: auto;
      pointer-events: auto;
    `;
    document.body.appendChild(bar);

    safeStorageGet(["pinnedBarPos"], (result) => {
      if (result.pinnedBarPos && typeof result.pinnedBarPos.left === "number" && typeof result.pinnedBarPos.top === "number") {
        const maxLeft = Math.max(10, window.innerWidth - 150);
        const maxTop = Math.max(10, window.innerHeight - 50);
        const safeLeft = Math.max(10, Math.min(result.pinnedBarPos.left, maxLeft));
        const safeTop = Math.max(10, Math.min(result.pinnedBarPos.top, maxTop));
        bar.style.left = `${safeLeft}px`;
        bar.style.top = `${safeTop}px`;
        bar.style.bottom = "auto";
        bar.style.right = "auto";
      } else {
        bar.style.bottom = "80px";
        bar.style.right = "24px";
        bar.style.left = "auto";
        bar.style.top = "auto";
      }
    });

    // Drag and drop for pinned bar
    let isDraggingBar = false;
    let startXBar, startYBar, startLeftBar, startTopBar;

    bar.addEventListener("mousedown", (e) => {
      if (e.target.closest(".wa-pinned-pill-btn")) return; // Don't drag when clicking buttons
      if (e.button !== 0) return;
      e.preventDefault();
      startXBar = e.clientX;
      startYBar = e.clientY;
      const rect = bar.getBoundingClientRect();
      startLeftBar = rect.left;
      startTopBar = rect.top;
      isDraggingBar = false;

      const onMouseMove = (me) => {
        const dx = me.clientX - startXBar;
        const dy = me.clientY - startYBar;
        if (!isDraggingBar && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
          isDraggingBar = true;
        }
        if (isDraggingBar) {
          let newLeft = startLeftBar + dx;
          let newTop = startTopBar + dy;
          newLeft = Math.max(10, Math.min(window.innerWidth - bar.offsetWidth - 10, newLeft));
          newTop = Math.max(10, Math.min(window.innerHeight - bar.offsetHeight - 10, newTop));
          bar.style.left = `${newLeft}px`;
          bar.style.top = `${newTop}px`;
          bar.style.bottom = "auto";
          bar.style.right = "auto";
        }
      };

      const onMouseUp = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        if (isDraggingBar) {
          const rect = bar.getBoundingClientRect();
          safeStorageSet({ pinnedBarPos: { left: rect.left, top: rect.top } });
        }
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    });
  }

  // Render pills inside the bar
  bar.innerHTML = `
    <span style="font-size: 11px; font-weight: 700; color: #94a3b8; display: flex; align-items: center; gap: 4px; cursor: grab; padding-left: 4px;" title="גרור להזזת סרגל הקיצורים">
      📌 <span style="font-size: 9px; opacity: 0.8;">מהירים:</span>
    </span>
  `;

  pinned.forEach(tpl => {
    const btn = document.createElement("button");
    btn.className = "wa-pinned-pill-btn";
    btn.style.cssText = `
      background: rgba(0, 168, 132, 0.2);
      border: 1px solid rgba(0, 168, 132, 0.5);
      color: #f8fafc;
      padding: 5px 11px;
      border-radius: 16px;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
      white-space: nowrap;
      display: flex;
      align-items: center;
      gap: 4px;
      transition: all 0.2s ease;
      outline: none;
    `;
    btn.title = `קיצור: ${tpl.shortcut}\nלחץ להכנסת התבנית מיידית!`;
    btn.innerHTML = `<span>⚡</span><span>${escapeHTML(tpl.title)}</span>`;
    
    btn.addEventListener("mouseenter", () => {
      btn.style.background = "var(--wa-assistant-primary, #00a884)";
      btn.style.borderColor = "var(--wa-assistant-primary, #00a884)";
      btn.style.color = "white";
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.background = "rgba(0, 168, 132, 0.2)";
      btn.style.borderColor = "rgba(0, 168, 132, 0.5)";
      btn.style.color = "#f8fafc";
    });

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      handleTemplateSelection(tpl);
    });

    bar.appendChild(btn);
  });
}

function getWhatsAppEditor() {
  const isAssistantUI = (el) => {
    if (!el) return false;
    return el.closest('#wa-assistant-sidebar-panel') ||
           el.closest('.wa-modal-overlay') ||
           el.closest('#wa-floating-alert-card') ||
           (el.id && el.id.startsWith('wa-')) ||
           el.classList.contains('wa-pl-input');
  };

  // 1. Explicitly target WhatsApp Web main chat editor in footer
  const waSelectors = [
    '#main footer div[contenteditable="true"]',
    '#main div[contenteditable="true"][data-tab="10"]',
    '#main div[contenteditable="true"]'
  ];
  for (const selector of waSelectors) {
    const editor = document.querySelector(selector);
    if (editor && !isAssistantUI(editor)) {
      return editor;
    }
  }

  // 2. Outlook Web / Gmail / External Webmail editors
  const outlookSelectors = [
    'div[contenteditable="true"][aria-label*="Message body" i]',
    'div[contenteditable="true"][aria-label*="גוף ההודעה" i]',
    'div[contenteditable="true"][aria-label*="תוכן" i]',
    'div[contenteditable="true"].elementToProof',
    'div[role="textbox"][contenteditable="true"]'
  ];
  for (const selector of outlookSelectors) {
    const editor = document.querySelector(selector);
    if (editor) return editor;
  }

  if (document.activeElement && !isAssistantUI(document.activeElement) && (
    document.activeElement.getAttribute('contenteditable') === 'true' ||
    document.activeElement.tagName === 'TEXTAREA' ||
    document.activeElement.tagName === 'INPUT' ||
    document.activeElement.getAttribute('role') === 'textbox'
  )) {
    return document.activeElement;
  }

  const editors = document.querySelectorAll('div[contenteditable="true"]');
  const validEditors = Array.from(editors).filter(e => !isAssistantUI(e));
  if (validEditors.length > 0) return validEditors[validEditors.length - 1];
  return null;
}

// Global flag to prevent re-entrant duplicate template injections during synthetic input events
let isInjectingTemplate = false;

// Helper function to thoroughly find and delete typed shortcut (including leading prefixes and trailing spaces) from target editor
function removeShortcutFromEditor(targetEditor, shortcutToReplace) {
  if (!targetEditor) return false;
  
  targetEditor.focus();

  const isWhatsApp = window.location.hostname.includes("whatsapp.com") || !!targetEditor.closest('#main');
  if (isWhatsApp) {
    try {
      document.execCommand('selectAll', false, null);
      document.execCommand('delete', false, null);
      targetEditor.dispatchEvent(new Event('input', { bubbles: true }));
      return true;
    } catch(e) {}
  }

  const isEmailEditor = window.location.hostname.includes("office") || 
                        window.location.hostname.includes("microsoft") || 
                        window.location.hostname.includes("live.com") ||
                        window.location.hostname.includes("gmail") ||
                        (targetEditor.querySelector && targetEditor.querySelector('div[id*="Signature"], div[class*="Signature"], [data-signature], img, table'));

  // 1. For TEXTAREA / INPUT elements
  if (targetEditor.tagName === 'TEXTAREA' || targetEditor.tagName === 'INPUT') {
    const val = targetEditor.value || "";
    const match = val.match(/(?:^|\s|\u00A0)([\/;!\.#-]?[\w\u0590-\u05FF]+)\s*$/);
    if (match) {
      const startIdx = match.index + (match[0].length - match[1].length);
      targetEditor.value = val.slice(0, startIdx);
      targetEditor.dispatchEvent(new Event('input', { bubbles: true }));
      return true;
    }
    return false;
  }

  // 2. If editor text contains ONLY the typed trigger/shortcut, wipe editor cleanly via execCommand delete
  const currentInnerText = (targetEditor.innerText || targetEditor.textContent || "").trim().toLowerCase();
  const rawShortcut = (shortcutToReplace || "").trim().toLowerCase();
  const strippedShortcut = rawShortcut.replace(/^[\/;\!\.-]+/, "");

  const isSingleShortcutOnly = currentInnerText === rawShortcut || 
                               currentInnerText === strippedShortcut || 
                               (currentInnerText.replace(/^[\/;\!\.-]+/, "") === strippedShortcut && strippedShortcut.length > 0) ||
                               (/^[\/;\!\.-]?[\w\u0590-\u05FF]{1,30}\s*$/.test(currentInnerText) && !isEmailEditor);

  if (isSingleShortcutOnly) {
    try {
      const sel = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(targetEditor);
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(range);
      }
      document.execCommand('delete', false, null);
      targetEditor.dispatchEvent(new Event('input', { bubbles: true }));
      return true;
    } catch(e) {}
  }

  // 3. For ContentEditable elements: Delete ONLY the shortcut text node immediately preceding the caret
  try {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      const textNode = range.endContainer;
      
      if (textNode && textNode.nodeType === Node.TEXT_NODE) {
        const val = textNode.nodeValue || "";
        const offset = range.endOffset;
        const textBefore = val.slice(0, offset);
        
        const match = textBefore.match(/(?:^|\s|\u00A0)([\/;!\.#-]?[\w\u0590-\u05FF]+)\s*$/);
        if (match) {
          const matchedWord = match[1];
          const wordStart = textBefore.lastIndexOf(matchedWord);
          if (wordStart !== -1) {
            let startIdx = wordStart;
            if (startIdx > 0 && /^[\/;\!\.-]/.test(textBefore[startIdx - 1])) {
              startIdx--;
            }
            try {
              const delRange = document.createRange();
              delRange.setStart(textNode, startIdx);
              delRange.setEnd(textNode, offset);
              sel.removeAllRanges();
              sel.addRange(delRange);
              document.execCommand('delete', false, null);
              targetEditor.dispatchEvent(new Event('input', { bubbles: true }));
              return true;
            } catch(e) {
              textNode.nodeValue = val.slice(0, startIdx) + val.slice(offset);
              targetEditor.dispatchEvent(new Event('input', { bubbles: true }));
              return true;
            }
          }
        }
      }
    }
  } catch (e) {
    console.warn("Targeted shortcut removal error:", e);
  }

  // Fallback: TreeWalker scan for last matching text node
  try {
    const sel = window.getSelection();
    const walk = document.createTreeWalker(targetEditor, NodeFilter.SHOW_TEXT, null, false);
    const textNodes = [];
    let n;
    while (n = walk.nextNode()) {
      textNodes.push(n);
    }

    for (let i = textNodes.length - 1; i >= 0; i--) {
      const textNode = textNodes[i];
      const val = textNode.nodeValue || "";
      const match = val.match(/(?:^|\s|\u00A0)([\/;!\.#-]?[\w\u0590-\u05FF]+)\s*$/);
      if (match) {
        const matchedWord = match[1];
        const wordStart = val.lastIndexOf(matchedWord);
        if (wordStart !== -1) {
          let startIdx = wordStart;
          if (startIdx > 0 && /^[\/;\!\.-]/.test(val[startIdx - 1])) {
            startIdx--;
          }
          try {
            const range = document.createRange();
            range.setStart(textNode, startIdx);
            range.setEnd(textNode, val.length);
            if (sel) {
              sel.removeAllRanges();
              sel.addRange(range);
            }
            document.execCommand('delete', false, null);
          } catch(e) {
            textNode.nodeValue = val.slice(0, startIdx);
          }
          targetEditor.dispatchEvent(new Event('input', { bubbles: true }));
          return true;
        }
      }
    }
  } catch(e) {}

  return false;
}

// Core text injection logic (Works for WhatsApp Web, Gmail, Outlook Web & Webmail)
function injectTextIntoEditor(editor, textToInsert, shortcutToReplace = null) {
  try {
    // 1. Always copy text to clipboard as a guaranteed fallback so user can Ctrl+V anywhere
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToInsert).catch(err => {
          fallbackCopyTextToClipboard(textToInsert);
        });
      } else {
        fallbackCopyTextToClipboard(textToInsert);
      }
    } catch (clipErr) {
      fallbackCopyTextToClipboard(textToInsert);
    }

    const targetEditor = editor || getWhatsAppEditor();

    if (!targetEditor) {
      showNotificationToast("ההודעה הועתקה ללוח! 📋 לחץ Ctrl+V להדבקה בתיבת ההודעות.");
      return;
    }

    targetEditor.focus();

    // 2. Remove typed shortcut if one was explicitly passed and typed
    if (shortcutToReplace) {
      removeShortcutFromEditor(targetEditor, shortcutToReplace);
    }

    // 3. Handling for TEXTAREA / INPUT elements
    if (targetEditor.tagName === 'TEXTAREA' || targetEditor.tagName === 'INPUT') {
      const start = targetEditor.selectionStart || 0;
      const end = targetEditor.selectionEnd || 0;
      const val = targetEditor.value || "";
      
      targetEditor.value = val.slice(0, start) + textToInsert + val.slice(end);
      targetEditor.selectionStart = start + textToInsert.length;
      targetEditor.selectionEnd = start + textToInsert.length;
      
      targetEditor.dispatchEvent(new Event('input', { bubbles: true }));
      targetEditor.dispatchEvent(new Event('change', { bubbles: true }));
      showNotificationToast("ההודעה הוכנסה בהצלחה! ✨");
      return;
    }

    // 4. Handling for ContentEditable (WhatsApp Web Lexical, Gmail & Outlook Web)
    const isWhatsAppEditor = window.location.hostname.includes("whatsapp.com") || !!targetEditor.closest('#main');
    const selection = window.getSelection();
    let isCaretInside = false;

    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      if (targetEditor.contains(range.commonAncestorContainer)) {
        isCaretInside = true;
      }
    }

    // Position caret safely inside the editor if not already inside
    if (!isCaretInside) {
      try {
        const range = document.createRange();
        const lastChild = targetEditor.lastChild || targetEditor;
        if (lastChild.nodeType === Node.TEXT_NODE) {
          range.setStart(lastChild, lastChild.nodeValue ? lastChild.nodeValue.length : 0);
        } else {
          range.selectNodeContents(lastChild);
          range.collapse(false);
        }
        if (selection) {
          selection.removeAllRanges();
          selection.addRange(range);
        }
      } catch(e) {}
    }

    let inserted = false;
    const lines = textToInsert.split(/\r?\n/);

    if (isWhatsAppEditor) {
      // Delegate to MAIN WORLD context where native DataTransfer paste and Lexical paragraph creation work 100% reliably!
      window.postMessage({
        type: "WA_INJECT_TEXT",
        text: textToInsert,
        shortcut: shortcutToReplace
      }, "*");
      inserted = true;
    } else {
      // Outlook Web / Gmail / Custom HTML editors
      try {
        const formattedHTML = lines.map(line => `<div>${escapeHTML(line) || '<br>'}</div>`).join('');
        inserted = document.execCommand('insertHTML', false, formattedHTML);
      } catch(e) {}

      if (!inserted) {
        try {
          inserted = document.execCommand('insertText', false, textToInsert);
        } catch(e) {}
      }
    }

    const inputEvent = new Event('input', { bubbles: true });
    targetEditor.dispatchEvent(inputEvent);
    const changeEvent = new Event('change', { bubbles: true });
    targetEditor.dispatchEvent(changeEvent);

    if (inserted) {
      showNotificationToast("ההודעה הוכנסה בהצלחה! ✨");
    } else {
      showNotificationToast("ההודעה הועתקה ללוח! 📋 לחץ Ctrl+V להדבקה.");
    }
  } catch (err) {
    console.error("Error in injectTextIntoEditor:", err);
    fallbackCopyTextToClipboard(textToInsert);
    showNotificationToast("ההודעה הועתקה ללוח! 📋 לחץ Ctrl+V להדבקה.");
  }
}

function fallbackCopyTextToClipboard(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
  } catch (err) {
    console.error('Fallback copy failed', err);
  }
  document.body.removeChild(textArea);
}

// Helper to send syllabus file if one is associated with the selected template
function triggerAssociatedSyllabus(tpl, compiledText = "") {
  if (tpl && tpl.associatedSyllabusId) {
    const file = syllabusFiles.find(f => f.id === tpl.associatedSyllabusId);
    if (file) {
      console.log("Triggering associated syllabus sending:", file.name);
      sendSyllabusFile(file, ""); // Empty caption so text is not duplicated on top of chat box
    } else {
      console.log("Associated syllabus file not present in local storage for ID:", tpl.associatedSyllabusId);
    }
  }
}

// Handle template execution (modal for variables vs direct insertion)
function handleTemplateSelection(tpl, shortcutUsed = null) {
  if (isInjectingTemplate) return;
  isInjectingTemplate = true;

  try {
    // Always resolve the main WhatsApp/Outlook chat box editor (bypassing sidebar input focus)
    const editor = getWhatsAppEditor();
    const actualShortcut = shortcutUsed;

    // WIPE SHORTCUT ONLY if user triggered by typing a shortcut
    if (editor && actualShortcut) {
      editor.focus();
      removeShortcutFromEditor(editor, actualShortcut);
    }

    const placeholders = getPlaceholders(tpl.content);

    if (placeholders.length === 0) {
      injectTextIntoEditor(editor, tpl.content, actualShortcut);
      if (tpl.associatedSyllabusId) {
        triggerAssociatedSyllabus(tpl, tpl.content);
      }
      if (sidebarOpen) toggleSidebar();
    } else {
      openPlaceholderModal(tpl, placeholders, editor, actualShortcut);
    }
  } finally {
    setTimeout(() => {
      isInjectingTemplate = false;
    }, 400);
  }
}


function getPlaceholders(text) {
  // Matches {var} and [var]
  const regex = /\{([^}]+)\}|\[([^\]]+)\]/g;
  const rawMatches = [];
  let match;

  while ((match = regex.exec(text)) !== null) {
    const fullMatch = match[0];
    const rawVal = (match[1] || match[2] || "").trim();
    if (!rawVal) continue;

    // Clean example text like ", למשל: 18,900 ₪" or ", לדוגמה: ..."
    let cleanVal = rawVal.replace(/,\s*(למשל|לדוגמה|לדוגמא)[\s\S]*/, "").trim();

    let label = cleanVal;
    let options = null;

    if (cleanVal.includes("|")) {
      const labelColonMatch = cleanVal.match(/^([^:|\d][^:|]*):(?!\d)/);
      if (labelColonMatch) {
        label = labelColonMatch[1].trim();
        const rest = cleanVal.slice(labelColonMatch[0].length);
        options = rest.split("|").map(opt => opt.trim()).filter(Boolean);
      } else {
        options = cleanVal.split("|").map(opt => opt.trim()).filter(Boolean);
        const joined = options.join(" ");
        if (/(ראשון|שני|שלישי|רביעי|חמישי|שישי|שבת)/.test(joined)) {
          label = "ימי לימוד";
        } else if (/\d{1,2}:\d{2}/.test(joined)) {
          label = "שעות לימוד";
        } else if (/(בוקר|ערב|היברידי|אונליין|פרונטלי)/.test(joined)) {
          label = "מסלול לימודים";
        } else if (options.length <= 2 && joined.length < 25) {
          label = options.join(" / ");
        } else {
          label = options[0];
        }
      }
    } else if (cleanVal.includes(":")) {
      const labelColonMatch = cleanVal.match(/^([^:|\d][^:|]*):(?!\d)/);
      if (labelColonMatch) {
        label = labelColonMatch[1].trim();
      } else {
        label = cleanVal;
      }
    }

    // Smart label normalization mapping
    if (label === "מספר" || label === "חודשים" || label === "מספר חודשים" || label === "משך") {
      label = "משך הקורס (בחודשים)";
    } else if (label === "מלגה" || label === "גובה המלגה") {
      label = "סכום המלגה";
    } else if (label === "שם" || label === "First Name" || label === "First_Name" || label === "שם פרטי") {
      label = "שם הסטודנט";
    }

    rawMatches.push({
      fullMatch: fullMatch,
      startIndex: match.index,
      rawVal: rawVal,
      label: label,
      options: options
    });
  }

  // Deduplication & Smart Context Assignment
  const placeholders = [];
  const labelCounts = {};
  rawMatches.forEach(m => {
    labelCounts[m.label] = (labelCounts[m.label] || 0) + 1;
  });

  const SHARED_LABELS = ["שם הסטודנט", "שם הקורס/המסלול", "שם הקורס", "שם המסלול"];
  const labelIndexTracker = {};

  rawMatches.forEach((m, idx) => {
    let finalLabel = m.label;
    const isShared = SHARED_LABELS.includes(m.label);

    if (!isShared && labelCounts[m.label] > 1) {
      // Find NEAREST preceding section keyword up to m.startIndex
      const textBefore = text.slice(0, m.startIndex);
      const lastBoker = textBefore.lastIndexOf("בוקר");
      const lastErev = textBefore.lastIndexOf("ערב");

      if (lastErev > lastBoker) {
        finalLabel = m.label.includes("בחודשים") ? "משך הקורס (ערב)" : `${m.label} (ערב)`;
      } else if (lastBoker > lastErev) {
        finalLabel = m.label.includes("בחודשים") ? "משך הקורס (בוקר)" : `${m.label} (בוקר)`;
      } else {
        labelIndexTracker[m.label] = (labelIndexTracker[m.label] || 0) + 1;
        finalLabel = `${m.label} (${labelIndexTracker[m.label]})`;
      }
    }

    m.finalLabel = finalLabel;

    if (!placeholders.find(p => p.label === finalLabel)) {
      placeholders.push({
        matchIdx: idx,
        label: finalLabel,
        raw: m.rawVal,
        fullMatch: m.fullMatch,
        startIndex: m.startIndex,
        options: m.options,
        isShared: isShared,
        originalLabel: m.label
      });
    }
  });

  return placeholders;
}

// Create and open placeholder dialog modal
function openPlaceholderModal(tpl, placeholders, editor, shortcutUsed) {
  const existing = document.getElementById("wa-assistant-placeholder-modal");
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.id = "wa-assistant-placeholder-modal";
  overlay.className = "wa-modal-overlay";

  let fieldsHTML = "";
  placeholders.forEach((pl, idx) => {
    if (pl.options && pl.options.length > 0) {
      let optionsHTML = "";
      pl.options.forEach(opt => {
        optionsHTML += `<option value="${escapeHTML(opt)}">${escapeHTML(opt)}</option>`;
      });
      fieldsHTML += `
        <div class="wa-modal-field-group">
          <label for="wa-pl-field-${idx}">${escapeHTML(pl.label)}</label>
          <select id="wa-pl-field-${idx}" class="wa-pl-input" data-raw-placeholder="${escapeHTML(pl.raw)}" data-placeholder-label="${escapeHTML(pl.label)}" style="width: 100%; background: var(--wa-assistant-bg); border: 1px solid var(--wa-assistant-border); color: var(--wa-assistant-text); font-size: 13px; padding: 8px 12px; border-radius: 6px; outline: none; font-family: var(--wa-assistant-font);">
            ${optionsHTML}
          </select>
        </div>
      `;
    } else {
      const historyKey = (tpl && tpl.id) ? `${tpl.id}_${pl.label}` : pl.label;
      const pastValues = placeholderHistory[historyKey] || placeholderHistory[pl.label] || [];
      
      let datalistHTML = "";
      const datalistId = `wa-pl-datalist-${idx}`;
      if (pastValues.length > 0) {
        datalistHTML = `<datalist id="${datalistId}">`;
        pastValues.forEach(v => {
          datalistHTML += `<option value="${escapeHTML(v)}">`;
        });
        datalistHTML += `</datalist>`;
      }

      fieldsHTML += `
        <div class="wa-modal-field-group">
          <label for="wa-pl-field-${idx}">${escapeHTML(pl.label)}</label>
          <input type="text" id="wa-pl-field-${idx}" class="wa-pl-input" data-raw-placeholder="${escapeHTML(pl.raw)}" data-placeholder-label="${escapeHTML(pl.label)}" ${pastValues.length > 0 ? `list="${datalistId}"` : ""} required autocomplete="on">
          ${datalistHTML}
        </div>
      `;
    }
  });

  overlay.innerHTML = `
    <div class="wa-modal-box" style="position: relative; max-height: 85vh; display: flex; flex-direction: column; width: 440px; max-width: 95%;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid var(--wa-assistant-border);">
        <div>
          <h3 style="margin: 0 0 4px 0; font-size: 15px; font-weight: 700; color: var(--wa-assistant-text);">✨ מילוי שדות דינמיים</h3>
          <p style="margin: 0; font-size: 12px; color: var(--wa-assistant-text-muted);">עבור תבנית: <strong>${escapeHTML(tpl.title)}</strong></p>
        </div>
        <button type="button" id="wa-modal-close-x" style="background: transparent; border: none; color: var(--wa-assistant-text-muted); font-size: 24px; cursor: pointer; line-height: 1; padding: 0 6px; border-radius: 4px;" title="סגור (Esc)">&times;</button>
      </div>
      <form id="wa-placeholder-form" style="display: flex; flex-direction: column; flex-grow: 1; overflow: hidden;">
        <div class="wa-modal-fields" style="flex-grow: 1; overflow-y: auto; max-height: 52vh; padding-right: 4px; margin-bottom: 14px;">
          ${fieldsHTML}
        </div>
        <div class="wa-modal-actions" style="margin-top: auto; padding-top: 10px; border-top: 1px solid var(--wa-assistant-border); display: flex; justify-content: flex-end; gap: 8px;">
          <button type="button" class="wa-modal-btn wa-modal-btn-secondary" id="wa-modal-cancel-btn">ביטול (Esc)</button>
          <button type="submit" class="wa-modal-btn wa-modal-btn-primary">הכנס להודעה 📥</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(overlay);

  const firstInput = document.getElementById("wa-pl-field-0");
  if (firstInput) setTimeout(() => firstInput.focus(), 100);

  const close = () => {
    document.removeEventListener("keydown", onKeyDownEsc);
    overlay.remove();
    if (editor && editor.focus) {
      try { editor.focus(); } catch (e) {}
    }
  };

  const onKeyDownEsc = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      close();
    }
  };
  document.addEventListener("keydown", onKeyDownEsc);

  // Click on background backdrop to close
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });

  const closeXBtn = overlay.querySelector("#wa-modal-close-x");
  if (closeXBtn) {
    closeXBtn.addEventListener("click", close);
  }

  const cancelBtn = overlay.querySelector("#wa-modal-cancel-btn");
  if (cancelBtn) {
    cancelBtn.addEventListener("click", close);
  }
  
  document.getElementById("wa-placeholder-form").addEventListener("submit", (e) => {
    try {
      e.preventDefault();
      
      let compiled = tpl.content;
      const valMap = {};
      const inputs = overlay.querySelectorAll(".wa-pl-input");
      let historyUpdated = false;

      inputs.forEach(input => {
        const rawKey = input.getAttribute("data-raw-placeholder");
        const plLabel = input.getAttribute("data-placeholder-label");
        const val = input.value.trim();
        if (plLabel) valMap[plLabel] = val;

        // Save value to history per course/template
        if (val && tpl && tpl.id && plLabel) {
          const historyKey = `${tpl.id}_${plLabel}`;
          if (!placeholderHistory[historyKey]) placeholderHistory[historyKey] = [];
          if (!placeholderHistory[historyKey].includes(val)) {
            placeholderHistory[historyKey].unshift(val);
            if (placeholderHistory[historyKey].length > 10) {
              placeholderHistory[historyKey] = placeholderHistory[historyKey].slice(0, 10);
            }
            historyUpdated = true;
          }
        }
      });

      // Smart compilation: match each placeholder in sequence or by shared label
      let matchCount = 0;
      compiled = compiled.replace(/\{([^}]+)\}|\[([^\]]+)\]/g, (fullMatch, p1, p2) => {
        const matchingPl = placeholders.find(p => p.fullMatch === fullMatch) || placeholders[matchCount];
        matchCount++;
        
        let targetLabel = matchingPl ? matchingPl.label : null;
        if (targetLabel && valMap[targetLabel] !== undefined) {
          return valMap[targetLabel];
        }

        // Fallback for raw match
        const rawKey = (p1 || p2 || "").trim();
        const escKey = rawKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        for (const [lbl, value] of Object.entries(valMap)) {
          if (value && (lbl.includes(rawKey) || rawKey.includes(lbl))) return value;
        }
        return fullMatch;
      });

      if (historyUpdated) {
        safeStorageSet({ placeholderHistory });
      }

      // Remove the modal first to return focus to the document
      close();
      
      setTimeout(() => {
        const freshEditor = getWhatsAppEditor() || editor;
        if (freshEditor) freshEditor.focus();
        injectTextIntoEditor(freshEditor, compiled, shortcutUsed || (tpl ? tpl.shortcut : null));
        if (tpl.associatedSyllabusId) {
          triggerAssociatedSyllabus(tpl, compiled);
        }
        if (sidebarOpen) toggleSidebar();
      }, 50);
    } catch (submitErr) {
      alert("שגיאה בשליחת הטופס של המשתנים:\n" + submitErr.message);
    }
  });
}

// Global Helper function to clean AI output by stripping English thinking & trailing check blocks
function cleanAIResultText(text) {
  if (!text) return "";
  let cleaned = text.trim();

  // Strip markdown code block wrappers
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```[a-zA-Z]*\n?/, "").replace(/\n?```$/, "").trim();
  }

  const lines = cleaned.split("\n");

  const isThinkingLine = (line) => {
    const trimmed = line.trim();
    if (!trimmed) return false;
    if (/^\*\s+/.test(trimmed)) return true; // Starts with "* " bullet
    if (/^\*\s*Let's/i.test(trimmed)) return true;
    if (/->\s*/.test(trimmed)) return true; // Contains "->"
    if (/\b(Need|Needs|Original|Improved|Keep|Add|Preserved|Role|Task|Check|Applying|Refine|Refined|Selection|Drafting|Draft|Output|Markdown|Polish|Reviewing|Rephrased|Rephrasing|Self-Correction|Constraint|Instruction)\b/i.test(trimmed)) return true;
    if (/^\(Self-|\(Self_|^Final\b|^\*Final\b|^\*Refined\b|^\*Draft\b/i.test(trimmed)) return true;
    if (/^[A-Z][a-zA-Z\s_-]+:/.test(trimmed)) return true;
    return false;
  };

  // Split into content blocks separated by thinking lines
  const blocks = [];
  let currentBlock = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (isThinkingLine(line)) {
      if (currentBlock.length > 0) {
        blocks.push(currentBlock);
        currentBlock = [];
      }
    } else {
      currentBlock.push(line);
    }
  }
  if (currentBlock.length > 0) {
    blocks.push(currentBlock);
  }

  // Find the LAST block that contains substantial Hebrew content
  for (let b = blocks.length - 1; b >= 0; b--) {
    const blockText = blocks[b].join("\n").trim();
    const hebrewChars = (blockText.match(/[\u0590-\u05FF]/g) || []).length;
    if (hebrewChars > 10) {
      return blockText;
    }
  }

  return cleaned;
}

// Global Helper function to query Gemini API with automatic model discovery & fallback
async function callGeminiAPI(promptText) {
  if (!geminiApiKey) {
    throw new Error("מפתח API של Gemini חסר. נא להזין מפתח תקין בתחתית המגירה.");
  }

  const cleanKey = geminiApiKey.trim();
  const payload = {
    system_instruction: {
      parts: [{ text: "You are a professional Israeli copywriting assistant. Output ONLY the final Hebrew message template. Strictly DO NOT output any English thinking process, reasoning, planning notes, bullet points, or markdown code blocks." }]
    },
    contents: [{
      parts: [{ text: promptText }]
    }]
  };

  // Helper to save discovered working model
  function saveWorkingModel(modelName) {
    lastWorkingModel = modelName;
    safeStorageSet({ lastWorkingModel: modelName });
  }

  // Speed Optimization: Try last working model first if cached
  if (lastWorkingModel) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${lastWorkingModel}:generateContent?key=${cleanKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const resData = await response.json();
        const resultText = resData.candidates?.[0]?.content?.parts?.[0]?.text;
        if (resultText) return cleanAIResultText(resultText);
      }
    } catch (e) {
      console.warn(`Cached model ${lastWorkingModel} failed, retrying discovery...`, e);
      lastWorkingModel = ""; // Clear invalid cache
    }
  }

  // Step 1: Try standard GA models
  const preferredModels = ["gemini-3.6-flash", "gemini-3.5-flash-lite", "gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.0-flash-lite"];
  
  for (const modelName of preferredModels) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${cleanKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const resData = await response.json();
        const resultText = resData.candidates?.[0]?.content?.parts?.[0]?.text;
        if (resultText) {
          saveWorkingModel(modelName);
          return cleanAIResultText(resultText);
        }
      }
    } catch (e) {
      console.warn(`Attempt with ${modelName} failed:`, e);
    }
  }

  // Step 2: Dynamic discovery via Google ListModels API endpoint
  try {
    const listRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${cleanKey}`);
    if (!listRes.ok) {
      const errData = await listRes.json().catch(() => ({}));
      const msg = errData.error?.message || `HTTP ${listRes.status}`;
      throw new Error(`שגיאה באימות מפתח ה-API מול גוגל (${msg}). אנא וודא שהמפתח שהזנת מ-Google AI Studio בתוקף.`);
    }

    const listData = await listRes.json();
    const availableModels = (listData.models || [])
      .filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent"))
      .map(m => m.name);

    if (availableModels.length === 0) {
      throw new Error("לא נמצאו מודלים זמינים עבור מפתח ה-API הזה בחשבון גוגל שלך.");
    }

    let discoveryLastErr = null;
    for (const chosenModelPath of availableModels) {
      try {
        const genRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/${chosenModelPath}:generateContent?key=${cleanKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (genRes.ok) {
          const genData = await genRes.json();
          const text = genData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            // Strip models/ prefix if present
            const modelName = chosenModelPath.replace(/^models\//, "");
            saveWorkingModel(modelName);
            return cleanAIResultText(text);
          }
        } else {
          const errData = await genRes.json().catch(() => ({}));
          discoveryLastErr = errData.error?.message || `HTTP ${genRes.status}`;
        }
      } catch (e) {
        discoveryLastErr = e.message;
      }
    }

    if (discoveryLastErr) {
      throw new Error(discoveryLastErr);
    }
  } catch (discoveryErr) {
    throw new Error(discoveryErr.message || "שגיאה בחיבור ל-Gemini API");
  }

  throw new Error("לא התקבל מענה מה-AI. נא לבדוק את תקינות מפתח ה-API.");
}

// Modal for Creating/Editing a template directly inside WhatsApp Web!
function openManageTemplateModal(tpl = null) {
  const existing = document.getElementById("wa-assistant-manage-modal");
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.id = "wa-assistant-manage-modal";
  overlay.className = "wa-modal-overlay";
  overlay.style.direction = "rtl";

  let optionsHTML = "";
  categories.forEach(cat => {
    optionsHTML += `<option value="${escapeHTML(cat)}" ${tpl && tpl.category === cat ? "selected" : ""}>${escapeHTML(cat)}</option>`;
  });

  let syllabusOptionsHTML = '<option value="">ללא קובץ מצורף</option>';
  syllabusFiles.forEach(file => {
    syllabusOptionsHTML += `<option value="${escapeHTML(file.id)}" ${tpl && tpl.associatedSyllabusId === file.id ? "selected" : ""}>${escapeHTML(file.name)}</option>`;
  });

  overlay.innerHTML = `
    <div class="wa-modal-box" style="position: relative; width: 500px; max-width: 95%; max-height: 88vh; display: flex; flex-direction: column;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid var(--wa-assistant-border); padding-bottom: 8px;">
        <h3 style="margin: 0; font-size: 15px; font-weight: 700; color: var(--wa-assistant-text);">${tpl ? "✏️ עריכת תבנית" : "➕ תבנית חדשה"}</h3>
        <button type="button" id="wa-manage-close-x" style="background: transparent; border: none; color: var(--wa-assistant-text-muted); font-size: 24px; cursor: pointer; line-height: 1; padding: 0 6px; border-radius: 4px;" title="סגור (Esc)">&times;</button>
      </div>
      <form id="wa-manage-form" style="display: flex; flex-direction: column; flex-grow: 1; overflow-y: auto; padding-right: 4px;">
        <div class="wa-modal-field-group">
          <label>כותרת התבנית</label>
          <input type="text" id="wa-manage-title" value="${tpl ? escapeHTML(tpl.title) : ""}" required placeholder="לדוגמה: קורס שיווק">
        </div>
        <div style="display: flex; gap: 12px; margin-bottom: 12px;">
          <div class="wa-modal-field-group" style="flex: 1; margin: 0;">
            <label>קיצור מקלדת (למשל: -שיווק)</label>
            <input type="text" id="wa-manage-shortcut" value="${tpl ? escapeHTML(tpl.shortcut) : ""}" required placeholder="לדוגמה: -שיווק">
          </div>
          <div class="wa-modal-field-group" style="flex: 1; margin: 0;">
            <label>קטגוריה</label>
            <select id="wa-manage-category" style="width: 100%; background: var(--wa-assistant-bg); border: 1px solid var(--wa-assistant-border); color: var(--wa-assistant-text); font-size: 13px; padding: 8px 12px; border-radius: 6px; outline: none; font-family: var(--wa-assistant-font);">
              ${optionsHTML}
            </select>
          </div>
        </div>
        
        <div class="wa-modal-field-group" style="margin-bottom: 12px;">
          <label>סילבוס מצורף אוטומטית (אופציונלי)</label>
          <select id="wa-manage-syllabus" style="width: 100%; background: var(--wa-assistant-bg); border: 1px solid var(--wa-assistant-border); color: var(--wa-assistant-text); font-size: 13px; padding: 8px 12px; border-radius: 6px; outline: none; font-family: var(--wa-assistant-font);">
            ${syllabusOptionsHTML}
          </select>
        </div>

        <div class="wa-modal-field-group">
          <label>תוכן ההודעה</label>
          <textarea id="wa-manage-content" rows="6" required style="width: 100%; background: var(--wa-assistant-bg); border: 1px solid var(--wa-assistant-border); color: var(--wa-assistant-text); font-size: 13px; padding: 8px 12px; border-radius: 6px; outline: none; font-family: var(--wa-assistant-font); resize: vertical;" placeholder="הקלד כאן. השתמש בסוגריים מסולסלים למשתנים, למשל: {שם לקוח}">${tpl ? escapeHTML(tpl.content) : ""}</textarea>
        </div>

        <!-- AI Writing Assistant directly inside WhatsApp Web! -->
        <div style="background: rgba(0, 168, 132, 0.05); border: 1px dashed rgba(0, 168, 132, 0.2); border-radius: 8px; padding: 10px; margin-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <span style="font-size: 11px; font-weight: 600; color: var(--wa-assistant-primary);">עוזר כתיבה AI ✨</span>
            <div style="display: flex; gap: 6px; align-items: center;">
              <button type="button" id="wa-ai-undo-btn" style="display: none; background: transparent; border: 1px solid var(--wa-assistant-border); color: var(--wa-assistant-text-muted); cursor: pointer; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-family: var(--wa-assistant-font);">↩️ בטל שינוי (Undo)</button>
              <span id="wa-ai-status" style="font-size: 10px; color: var(--wa-assistant-text-muted);"></span>
            </div>
          </div>
          <div style="display: flex; gap: 6px;">
            <input type="text" id="wa-ai-prompt" style="flex-grow:1; background:var(--wa-assistant-bg); border:1px solid var(--wa-assistant-border); color:var(--wa-assistant-text); font-size:11px; padding: 6px 10px; border-radius: 4px; outline:none;" placeholder="הנחיה ל-AI (למשל: הפוך ליותר שיווקי, קצר)...">
            <button type="button" id="wa-ai-btn" style="background:var(--wa-assistant-primary); border:none; color:white; font-size:11px; padding:6px 10px; border-radius:4px; cursor:pointer; font-family:var(--wa-assistant-font);">שפר טקסט</button>
          </div>
        </div>

        <div class="wa-modal-actions" style="margin-top: auto; padding-top: 10px; border-top: 1px solid var(--wa-assistant-border);">
          <button type="button" class="wa-modal-btn wa-modal-btn-secondary" id="wa-manage-cancel-btn">ביטול (Esc)</button>
          <button type="submit" class="wa-modal-btn wa-modal-btn-primary">שמור תבנית</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(overlay);
  
  const titleInput = document.getElementById("wa-manage-title");
  if (titleInput) titleInput.focus();

  // Close handlers
  const close = () => {
    document.removeEventListener("keydown", onKeyDownEsc);
    overlay.remove();
  };

  const onKeyDownEsc = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      close();
    }
  };
  document.addEventListener("keydown", onKeyDownEsc);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });

  const closeXBtn = overlay.querySelector("#wa-manage-close-x");
  if (closeXBtn) closeXBtn.addEventListener("click", close);

  const cancelBtn = overlay.querySelector("#wa-manage-cancel-btn");
  if (cancelBtn) cancelBtn.addEventListener("click", close);

  // Submit handler
  document.getElementById("wa-manage-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const title = titleInput.value.trim();
    let shortcut = document.getElementById("wa-manage-shortcut").value.trim();
    const category = document.getElementById("wa-manage-category").value;
    const associatedSyllabusId = document.getElementById("wa-manage-syllabus").value;
    const content = document.getElementById("wa-manage-content").value.trim();

    // Auto prepend / if missing prefix
    if (!shortcut.startsWith('/') && !shortcut.startsWith(';') && !shortcut.startsWith('!') && !shortcut.startsWith('.') && !shortcut.startsWith('-')) {
      shortcut = '/' + shortcut;
    }

    if (tpl) {
      // Edit existing
      templates = templates.map(t => t.id === tpl.id ? { id: tpl.id, title, shortcut, category, content, associatedSyllabusId } : t);
    } else {
      // Create new
      const newId = "tpl-" + Date.now();
      templates.push({ id: newId, title, shortcut, category, content, associatedSyllabusId });
    }

    safeStorageSet({ templates }, () => {
      if (sidebarOpen) {
        renderSidebarTemplates();
      }
      broadcastCrossTabMessage("TEMPLATES_UPDATED", { templates });
      pushStateToCloud();
      close();
    });
  });

  // Intercept Enter key inside AI prompt field so it triggers AI improvement instead of submitting the form!
  const aiPromptInput = document.getElementById("wa-ai-prompt");
  if (aiPromptInput) {
    aiPromptInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        document.getElementById("wa-ai-btn").click();
      }
    });
  }

  let previousTemplateContent = null;
  const undoBtn = document.getElementById("wa-ai-undo-btn");

  undoBtn.addEventListener("click", () => {
    if (previousTemplateContent !== null) {
      document.getElementById("wa-manage-content").value = previousTemplateContent;
      const statusSpan = document.getElementById("wa-ai-status");
      statusSpan.textContent = "בוטל ↩️";
      statusSpan.style.color = "var(--wa-assistant-text-muted)";
      undoBtn.style.display = "none";
    }
  });

  // AI Rewrite Click Listener
  document.getElementById("wa-ai-btn").addEventListener("click", async () => {
    if (!geminiApiKey) {
      alert("נא להזין מפתח API של Gemini בסרגל הצד (בתחתית המגירה) תחילה!");
      return;
    }

    const instruction = document.getElementById("wa-ai-prompt").value.trim();
    if (!instruction) {
      alert("נא להזין הנחיה ל-AI (למשל: 'הפוך ליותר שיווקי', 'הוסף אימוג'ים')");
      return;
    }

    const contentArea = document.getElementById("wa-manage-content");
    const originalContent = contentArea.value.trim();
    if (!originalContent) {
      alert("נא להזין תוכן להודעה תחילה כדי שה-AI יוכל לעבוד עליו!");
      return;
    }

    const statusSpan = document.getElementById("wa-ai-status");
    const aiBtn = document.getElementById("wa-ai-btn");
    
    statusSpan.textContent = "מנסח... ⏳";
    statusSpan.style.color = "var(--wa-assistant-primary)";
    aiBtn.disabled = true;

    try {
      const promptText = `You are an expert Israeli WhatsApp copywriting assistant.
Your task is to rewrite and optimize the following message template based on these instructions: "${instruction}".

CRITICAL FORMATTING & OUTPUT RULES:
- VISUAL FORMATTING FOR WHATSAPP: Use clear paragraphs with line breaks (double newlines) between sections so the message is clean, aesthetic, and easy to read on WhatsApp Web/Mobile.
- ADD MATCHING EMOJIS: Add subtle, highly matching emojis where appropriate (e.g. 📊, 📅, 🕒, 🗓️, ⏰, ⏳, 💰, 💳, 🎓, 🚀, 😊).
- GENDER NEUTRAL: If instructed to rewrite in gender-neutral language, use natural, professional Hebrew infinitives (like לקבל, לראות) or neutral phrasing so it flows naturally for both men and women without ugly slashes.
- PRESERVE ALL PLACEHOLDERS: Keep all placeholders exactly as they appear in curly braces or square brackets (e.g. "{שם}", "[תאריך]", "[שם הקורס]", "{ First Name }").
- OUTPUT ONLY THE FINAL HEBREW TEMPLATE: Strictly DO NOT output any thinking steps, reasoning, analysis notes, intermediate drafts, bullet evaluations, or English explanations. Output ONLY the single final Hebrew template.

Original template:
"""
${originalContent}
"""`;

      let resultText = await callGeminiAPI(promptText);
      if (resultText.startsWith("```")) {
        resultText = resultText.replace(/^```[a-zA-Z]*\n/, "").replace(/\n```$/, "");
      }

      // Save previous state before modifying content!
      previousTemplateContent = originalContent;
      undoBtn.style.display = "inline-flex";

      contentArea.value = resultText;
      statusSpan.textContent = "הושלם! ✨";
      statusSpan.style.color = "#10b981";
      document.getElementById("wa-ai-prompt").value = "";

    } catch (err) {
      console.error(err);
      statusSpan.textContent = "שגיאה ❌";
      statusSpan.style.color = "#ef4444";
      alert("שגיאה בהפעלת ה-AI: " + err.message);
    } finally {
      aiBtn.disabled = false;
    }
  });

  overlay.addEventListener("keydown", (e) => {
    e.stopPropagation();
    if (e.key === "Escape") close();
  });
  overlay.addEventListener("keyup", (e) => {
    e.stopPropagation();
  });
  overlay.addEventListener("keypress", (e) => {
    e.stopPropagation();
  });
}

// Autocomplete Menu Globals
let autocompleteDropdown = null;
let autocompleteMatches = [];
let autocompleteIndex = 0;
let autocompleteQuery = "";

function renderAutocompleteItems() {
  if (!autocompleteDropdown) return;
  autocompleteDropdown.innerHTML = "";
  
  autocompleteMatches.forEach((tpl, idx) => {
    const item = document.createElement("div");
    item.className = `wa-assistant-autocomplete-item ${idx === autocompleteIndex ? "selected" : ""}`;
    item.innerHTML = `
      <span>${escapeHTML(tpl.title)}</span>
      <span class="wa-assistant-autocomplete-shortcut">${escapeHTML(tpl.shortcut)}</span>
    `;
    
    item.addEventListener("click", () => {
      const q = autocompleteQuery;
      hideAutocompleteDropdown();
      handleTemplateSelection(tpl, q);
    });
    
    autocompleteDropdown.appendChild(item);
  });
}

function getCaretCoordinates() {
  try {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0).cloneRange();
      range.collapse(true);
      const rects = range.getClientRects();
      if (rects && rects.length > 0) {
        return rects[0];
      }
    }
  } catch(e) {}
  return null;
}

function showAutocompleteDropdown(editor, matches, query) {
  if (!autocompleteDropdown) {
    autocompleteDropdown = document.createElement("div");
    autocompleteDropdown.className = "wa-assistant-autocomplete-dropdown";
    autocompleteDropdown.style.zIndex = "2000000";
    document.body.appendChild(autocompleteDropdown);
  }
  
  const caretRect = getCaretCoordinates();
  const editorRect = editor ? editor.getBoundingClientRect() : null;
  const targetRect = (caretRect && caretRect.top > 0) ? caretRect : editorRect;

  if (targetRect) {
    const leftPos = Math.max(10, Math.min(targetRect.left, window.innerWidth - 300));
    if (targetRect.bottom + 220 < window.innerHeight) {
      autocompleteDropdown.style.top = `${targetRect.bottom + 4}px`;
      autocompleteDropdown.style.bottom = "auto";
    } else {
      autocompleteDropdown.style.bottom = `${window.innerHeight - targetRect.top + 4}px`;
      autocompleteDropdown.style.top = "auto";
    }
    autocompleteDropdown.style.left = `${leftPos}px`;
  }
  
  autocompleteMatches = matches;
  autocompleteQuery = query;
  if (autocompleteIndex >= matches.length) {
    autocompleteIndex = 0;
  }
  
  renderAutocompleteItems();
}

function hideAutocompleteDropdown() {
  if (autocompleteDropdown) {
    autocompleteDropdown.remove();
    autocompleteDropdown = null;
  }
  autocompleteMatches = [];
  autocompleteIndex = 0;
}

// Helper to reliably extract text immediately preceding the caret across Outlook Web, WhatsApp & standard text editors
function getTextBeforeCaret(editor) {
  if (!editor) return "";
  
  // For TEXTAREA / INPUT elements
  if (editor.tagName === 'TEXTAREA' || editor.tagName === 'INPUT') {
    const end = editor.selectionEnd || 0;
    return (editor.value || "").slice(0, end).replace(/[\u200B-\u200F\u202A-\u202E\uFEFF]/g, "");
  }

  // For ContentEditable (Outlook Web & WhatsApp Web)
  try {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      if (editor.contains(range.commonAncestorContainer)) {
        const preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(editor);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        let text = preCaretRange.toString();
        if (text) {
          return text.replace(/[\u200B-\u200F\u202A-\u202E\uFEFF]/g, "").replace(/\r/g, "");
        }
      }
    }
  } catch (e) {}

  // Fallback for raw text nodes
  try {
    const sel = window.getSelection();
    if (sel && sel.anchorNode) {
      const nodeText = sel.anchorNode.nodeValue || "";
      if (nodeText) {
        let text = nodeText.slice(0, sel.anchorOffset);
        return text.replace(/[\u200B-\u200F\u202A-\u202E\uFEFF]/g, "").replace(/\r/g, "");
      }
    }
  } catch(e) {}

  const raw = editor.innerText || editor.textContent || "";
  return raw.replace(/[\u200B-\u200F\u202A-\u202E\uFEFF]/g, "").replace(/\r/g, "");
}

// Keyboard shortcuts listener with autocomplete dropdown support
function setupKeyboardListener() {
  // Capture keydown phase to intercept Enter and arrows before app processes them!
  document.addEventListener("keydown", (e) => {
    const activeTarget = e.target;
    const isEditable = activeTarget && (
      activeTarget.isContentEditable || 
      (activeTarget.closest && activeTarget.closest('[contenteditable="true"]')) || 
      activeTarget.tagName === 'TEXTAREA' || 
      activeTarget.tagName === 'INPUT' ||
      (activeTarget.getAttribute && (activeTarget.getAttribute('contenteditable') === 'true' || activeTarget.getAttribute('role') === 'textbox'))
    );
    const editor = (isEditable ? (activeTarget.closest('[contenteditable="true"]') || activeTarget) : null) || getWhatsAppEditor();
    if (!editor) return;

    if (autocompleteDropdown && autocompleteMatches.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        e.stopPropagation();
        autocompleteIndex = (autocompleteIndex + 1) % autocompleteMatches.length;
        renderAutocompleteItems();
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        e.stopPropagation();
        autocompleteIndex = (autocompleteIndex - 1 + autocompleteMatches.length) % autocompleteMatches.length;
        renderAutocompleteItems();
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        const tpl = autocompleteMatches[autocompleteIndex];
        const q = autocompleteQuery;
        hideAutocompleteDropdown();
        handleTemplateSelection(tpl, q);
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        hideAutocompleteDropdown();
        return;
      }
    }
  }, true);

  const handleTypingEvent = (e) => {
    if (isInjectingTemplate) return;
    const activeTarget = e.target;
    const isEditable = activeTarget && (
      activeTarget.isContentEditable || 
      (activeTarget.closest && activeTarget.closest('[contenteditable="true"]')) || 
      activeTarget.tagName === 'TEXTAREA' || 
      activeTarget.tagName === 'INPUT' ||
      (activeTarget.getAttribute && (activeTarget.getAttribute('contenteditable') === 'true' || activeTarget.getAttribute('role') === 'textbox'))
    );
    const editor = (isEditable ? (activeTarget.closest('[contenteditable="true"]') || activeTarget) : null) || getWhatsAppEditor();
    if (!editor) return;

    // Skip helper keys inside keyup/input
    if (e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "Enter" || e.key === "Escape") {
      return;
    }

    const textToMatch = getTextBeforeCaret(editor);
    if (!textToMatch) {
      hideAutocompleteDropdown();
      return;
    }
    
    // Check if they typed space after a shortcut to auto-expand immediately
    if (e.key === " " || e.data === " ") {
      const match = textToMatch.match(/(?:^|\s|\u00A0)([\/;!\.#-][\w\u0590-\u05FF]+|[\w\u0590-\u05FF]+)\s*$/);
      if (match) {
        const typedShortcut = match[1].trim();
        const hasPrefix = /^[\/;\!\.-]/.test(typedShortcut);
        const strippedTyped = typedShortcut.replace(/^[\/;\!\.-]+/, "").toLowerCase();

        const foundTpl = templates.find(t => {
          const tLower = (t.shortcut || "").toLowerCase();
          const tHasPrefix = /^[\/;\!\.-]/.test(tLower);
          const tStripped = tLower.replace(/^[\/;\!\.-]+/, "");

          if (hasPrefix) {
            // User explicitly typed a prefix (e.g. .מיישם, -מיישם, /מיישם)
            return tLower === typedShortcut.toLowerCase() || tStripped === strippedTyped;
          } else {
            // User typed without prefix: match ONLY if the template shortcut itself has no prefix and matches exactly
            return !tHasPrefix && tLower === typedShortcut.toLowerCase();
          }
        });

        if (foundTpl) {
          hideAutocompleteDropdown();
          handleTemplateSelection(foundTpl, typedShortcut);
          return;
        }
      }
    }

    // Auto-complete suggestions trigger (ONLY when typing a prefix symbol like / or . or - or # or !)
    const autocompleteMatch = textToMatch.match(/(?:^|\s|\u00A0)([\/;!\.#-][\w\u0590-\u05FF\-]*)$/);
    if (autocompleteMatch) {
      const typedVal = autocompleteMatch[1];
      const searchVal = typedVal.toLowerCase();
      const cleanQuery = searchVal.replace(/^[\/;\!\.#-]+/, "").trim();
      
      const matches = templates.filter(t => {
        const tLower = (t.shortcut || "").toLowerCase();
        const tClean = tLower.replace(/^[\/;\!\.#-]+/, "").trim();
        const titleLower = (t.title || "").toLowerCase();

        // If user only typed the prefix (e.g. "." or "-"), show all templates
        if (!cleanQuery) return true;

        return (
          tLower.startsWith(searchVal) ||
          tClean.startsWith(cleanQuery) ||
          tClean.includes(cleanQuery) ||
          titleLower.includes(cleanQuery)
        );
      });
      
      if (matches.length > 0) {
        showAutocompleteDropdown(editor, matches, typedVal);
      } else {
        hideAutocompleteDropdown();
      }
    } else {
      hideAutocompleteDropdown();
    }
  };

  document.addEventListener("keyup", handleTypingEvent);
  document.addEventListener("input", handleTypingEvent);

  // Hide dropdown and close sidebar on click outside
  document.addEventListener("click", (e) => {
    if (autocompleteDropdown && !autocompleteDropdown.contains(e.target)) {
      hideAutocompleteDropdown();
    }

    if (sidebarOpen) {
      const sidebar = document.getElementById("wa-assistant-sidebar-panel");
      const trigger = document.getElementById("wa-assistant-trigger-btn");
      const activeModal = document.querySelector(".wa-modal-overlay");
      
      if (sidebar && !sidebar.contains(e.target) && 
          trigger && !trigger.contains(e.target) && 
          (!activeModal || !activeModal.contains(e.target))) {
        toggleSidebar();
      }
    }
  });
}

// Scrape full active chat thread history using direct physical X-coordinate positioning system
function getChatThreadHistory(limit = 10) {
  const main = document.getElementById('main');
  if (!main) return [];

  // Query message containers in chat log
  const rawNodes = Array.from(main.querySelectorAll('[data-testid="msg-container"], div[data-id], .focusable-list-item, .message-in, .message-out'));
  if (rawNodes.length === 0) return [];

  const containers = [];
  const seenNodes = new Set();

  rawNodes.forEach(node => {
    const top = node.closest('[data-testid="msg-container"]') || node.closest('[data-id]') || node;
    if (!seenNodes.has(top)) {
      seenNodes.add(top);
      containers.push(top);
    }
  });

  const mainRect = main.getBoundingClientRect();
  const mainMidX = mainRect.left + mainRect.width / 2;

  // Detect whether WhatsApp interface is in RTL (Hebrew) or LTR
  const isRTL = document.dir === 'rtl' || 
                document.documentElement.dir === 'rtl' || 
                document.body.dir === 'rtl' || 
                (window.getComputedStyle(document.body).direction === 'rtl');

  // Helper to determine sender ("אני" vs "לקוח")
  function determineSender(c) {
    // 1. Checkmark / Delivery SVGs (100% Outgoing from Me)
    const hasCheckmark = !!c.querySelector(
      '[data-icon*="check"], [data-icon*="dblcheck"], [data-testid="msg-dblcheck"], [data-testid="msg-check"], [data-icon="msg-time"], ' +
      'svg[aria-label*="נקראה"], svg[aria-label*="נמסרה"], svg[aria-label*="נשלחה"], svg[aria-label*="Read"], svg[aria-label*="Delivered"], svg[aria-label*="Sent"]'
    );
    if (hasCheckmark) return "אני";

    // 2. Tail icon test
    if (c.querySelector('[data-icon="tail-out"], [data-testid="tail-out"]')) return "אני";
    if (c.querySelector('[data-icon="tail-in"], [data-testid="tail-in"]')) return "לקוח";

    // 3. Direct Physical Bubble X-Coordinate Position
    // Find the text bubble inside container
    const bubble = c.querySelector('.copyable-text') || c.querySelector('[class*="selectable-text"]') || c.firstElementChild || c;
    const bubbleRect = bubble.getBoundingClientRect();

    if (bubbleRect.width > 0 && bubbleRect.height > 0 && bubbleRect.width < mainRect.width * 0.85) {
      const bubbleMidX = bubbleRect.left + bubbleRect.width / 2;
      if (isRTL) {
        // Hebrew RTL: Left side (< mainMidX) = Eran ("אני"), Right side (> mainMidX) = Client ("לקוח")
        return bubbleMidX < mainMidX ? "אני" : "לקוח";
      } else {
        // English LTR: Right side (> mainMidX) = Eran ("אני"), Left side (< mainMidX) = Client ("לקוח")
        return bubbleMidX > mainMidX ? "אני" : "לקוח";
      }
    }

    // 4. CSS Class Fallback
    if (c.classList.contains('message-out') || !!c.querySelector('.message-out') || !!c.closest('.message-out')) {
      return "אני";
    }
    if (c.classList.contains('message-in') || !!c.querySelector('.message-in') || !!c.closest('.message-in')) {
      return "לקוח";
    }

    return "לקוח";
  }

  const thread = [];
  const seenTexts = new Set();

  for (let i = containers.length - 1; i >= 0; i--) {
    const c = containers[i];
    const sender = determineSender(c);

    // Extract text
    const textSpan = c.querySelector('.copyable-text span, span.selectable-text, [class*="selectable-text"]');
    let text = "";
    if (textSpan) {
      text = (textSpan.innerText || textSpan.textContent).trim();
    } else {
      const copyable = c.querySelector('.copyable-text');
      if (copyable) {
        text = (copyable.innerText || copyable.textContent).trim();
      } else {
        text = (c.innerText || c.textContent || "").trim();
      }
      text = text.replace(/\n?\d{1,2}:\d{2}\s*$/, "").trim();
    }

    // Filter out system encryption messages and empty strings
    if (text && text.length > 0 && !text.includes("הודעות ושיחות אלה מוצפנות") && !text.includes("Messages and calls are end-to-end encrypted")) {
      const dedupKey = `${sender}:${text}`;
      if (!seenTexts.has(dedupKey)) {
        seenTexts.add(dedupKey);
        thread.unshift({ sender, text });
        if (thread.length >= limit) break;
      }
    }
  }

  return thread;
}

// Modal for drafting an AI Reply based on full conversation thread
function openAIReplyModal(threadHistory) {
  const existing = document.getElementById("wa-assistant-ai-reply-modal");
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.id = "wa-assistant-ai-reply-modal";
  overlay.className = "wa-modal-overlay";
  overlay.style.direction = "rtl";

  function renderThreadPreview() {
    let html = "";
    threadHistory.forEach((item, idx) => {
      const isMe = item.sender === "אני";
      const badge = isMe ? "💬 אני (נציג)" : "👤 לקוח";
      const bg = isMe ? "rgba(0, 168, 132, 0.12)" : "rgba(255, 255, 255, 0.05)";
      const color = isMe ? "var(--wa-assistant-primary)" : "var(--wa-assistant-text)";
      
      html += `
        <div style="background: ${bg}; border-radius: 6px; padding: 8px 10px; margin-bottom: 6px; border-right: 3px solid ${color}; display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
          <div style="flex-grow: 1;">
            <div style="font-size: 10px; font-weight: 700; color: ${color}; margin-bottom: 3px;">${badge}</div>
            <div style="font-size: 12px; color: var(--wa-assistant-text); white-space: pre-wrap; line-height: 1.4;">${escapeHTML(item.text)}</div>
          </div>
          <button type="button" class="wa-ai-toggle-sender-btn" data-idx="${idx}" style="background: transparent; border: 1px solid ${color}; color: ${color}; font-size: 10px; padding: 2px 6px; border-radius: 4px; cursor: pointer; font-family: var(--wa-assistant-font); white-space: nowrap;" title="לחץ להחלפת זיהוי השולח (אני / לקוח)">🔄 שנה שולח</button>
        </div>
      `;
    });
    return html;
  }

  overlay.innerHTML = `
    <div class="wa-modal-box" style="position: relative; width: 580px; max-width: 95%; max-height: 88vh; display: flex; flex-direction: column;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border-bottom: 1px solid var(--wa-assistant-border); padding-bottom: 8px;">
        <h3 style="margin: 0; font-size: 15px; font-weight: 700; color: var(--wa-assistant-text);">ניסוח תגובה חכמה ב-AI בהתאם לשרשור 🤖</h3>
        <button type="button" id="wa-ai-reply-close-x" style="background: transparent; border: none; color: var(--wa-assistant-text-muted); font-size: 24px; cursor: pointer; line-height: 1; padding: 0 6px; border-radius: 4px;" title="סגור (Esc)">&times;</button>
      </div>
      <p style="font-size: 11px; color: var(--wa-assistant-text-muted); margin-bottom: 8px;">התוסף קרא את שרשור ההודעות בצ'אט (${threadHistory.length} הודעות). ניתן ללחוץ על 🔄 שנה שולח במידת הצורך:</p>
      
      <div id="wa-ai-thread-preview-container" style="background: var(--wa-assistant-bg); border: 1px solid var(--wa-assistant-border); border-radius: 8px; padding: 10px; margin-bottom: 14px; max-height: 180px; overflow-y: auto;">
        ${renderThreadPreview()}
      </div>

      <form id="wa-ai-reply-form" style="display: flex; flex-direction: column; flex-grow: 1; overflow-y: auto;">
        <div style="display: flex; gap: 12px; margin-bottom: 12px;">
          <div class="wa-modal-field-group" style="flex: 2; margin: 0;">
            <label>מה ברצונך לענות? (הנחיה כללית ל-AI)</label>
            <input type="text" id="wa-ai-reply-instruction" style="width: 100%; background: var(--wa-assistant-bg); border: 1px solid var(--wa-assistant-border); color: var(--wa-assistant-text); font-size: 12px; padding: 8px 12px; border-radius: 6px; outline: none; font-family: var(--wa-assistant-font);" placeholder="לדוגמה: תציע שיחה קצרה לעבור על הסילבוס/הצעת מחיר...">
          </div>
          <div class="wa-modal-field-group" style="flex: 1; margin: 0;">
            <label>סגנון המענה</label>
            <select id="wa-ai-reply-style" style="width: 100%; background: var(--wa-assistant-bg); border: 1px solid var(--wa-assistant-border); color: var(--wa-assistant-text); font-size: 12px; padding: 8px 12px; border-radius: 6px; height: 36px; font-family: var(--wa-assistant-font); outline: none;">
              <option value="שיווקי ומזמין">שיווקי ומזמין 🚀</option>
              <option value="מקצועי ורשמי">מקצועי ורשמי 💼</option>
              <option value="חם וידידותי">חם וידידותי 😊</option>
              <option value="קצר ותמציתי">קצר ותמציתי ⚡</option>
            </select>
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end; align-items: center; margin-bottom: 16px; gap: 12px;">
          <span id="wa-ai-reply-status" style="font-size: 11px;"></span>
          <button type="button" id="wa-ai-reply-generate-btn" style="background: var(--wa-assistant-primary); border: none; color: white; font-size: 12px; font-weight: 600; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-family: var(--wa-assistant-font); display: flex; align-items: center; gap: 4px;">נסח תגובה ✨</button>
        </div>

        <div class="wa-modal-field-group">
          <label>תגובת ה-AI המוצעת:</label>
          <textarea id="wa-ai-reply-output" rows="5" style="width: 100%; background: var(--wa-assistant-bg); border: 1px solid var(--wa-assistant-border); color: var(--wa-assistant-text); font-size: 13px; padding: 8px 12px; border-radius: 6px; outline: none; font-family: var(--wa-assistant-font); resize: vertical;" placeholder="תגובת ה-AI תופיע כאן..."></textarea>
        </div>

        <div class="wa-modal-actions" style="margin-top: auto; padding-top: 10px; border-top: 1px solid var(--wa-assistant-border);">
          <button type="button" class="wa-modal-btn wa-modal-btn-secondary" id="wa-ai-reply-cancel-btn">ביטול (Esc)</button>
          <button type="submit" class="wa-modal-btn wa-modal-btn-primary" id="wa-ai-reply-submit-btn" disabled>הכנס לצ'אט 📥</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(overlay);

  // Bind toggle sender click handlers
  const attachToggleEvents = () => {
    const previewContainer = document.getElementById("wa-ai-thread-preview-container");
    if (!previewContainer) return;

    previewContainer.querySelectorAll(".wa-ai-toggle-sender-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.getAttribute("data-idx"), 10);
        if (!isNaN(idx) && threadHistory[idx]) {
          threadHistory[idx].sender = threadHistory[idx].sender === "אני" ? "לקוח" : "אני";
          previewContainer.innerHTML = renderThreadPreview();
          attachToggleEvents();
        }
      });
    });
  };
  attachToggleEvents();

  const instructionInput = document.getElementById("wa-ai-reply-instruction");
  if (instructionInput) setTimeout(() => instructionInput.focus(), 100);

  const close = () => {
    document.removeEventListener("keydown", onKeyDownEsc);
    overlay.remove();
  };

  const onKeyDownEsc = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      close();
    }
  };
  document.addEventListener("keydown", onKeyDownEsc);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });

  const closeXBtn = overlay.querySelector("#wa-ai-reply-close-x");
  if (closeXBtn) closeXBtn.addEventListener("click", close);

  const cancelBtn = overlay.querySelector("#wa-ai-reply-cancel-btn");
  if (cancelBtn) cancelBtn.addEventListener("click", close);

  // Submit form (inserts reply to WhatsApp)
  document.getElementById("wa-ai-reply-form").addEventListener("submit", (e) => {
    try {
      e.preventDefault();
      const outputText = document.getElementById("wa-ai-reply-output").value.trim();
      if (!outputText) return;

      const editor = getWhatsAppEditor();
      injectTextIntoEditor(editor, outputText);
      overlay.remove();
      
      if (sidebarOpen) toggleSidebar();
    } catch(err) {
      alert("שגיאה בהזנת תגובת ה-AI לצ'אט:\n" + err.message);
    }
  });

  // Generate Reply Click Listener
  document.getElementById("wa-ai-reply-generate-btn").addEventListener("click", async () => {
    if (!geminiApiKey) {
      alert("נא להזין מפתח API של Gemini בסרגל הצד (בתחתית המגירה) תחילה!");
      return;
    }

    const instruction = instructionInput.value.trim();
    const style = document.getElementById("wa-ai-reply-style").value;
    const outputArea = document.getElementById("wa-ai-reply-output");
    const statusSpan = document.getElementById("wa-ai-reply-status");
    const genBtn = document.getElementById("wa-ai-reply-generate-btn");
    const submitBtn = document.getElementById("wa-ai-reply-submit-btn");

    statusSpan.textContent = "מנסח תגובה... ⏳";
    statusSpan.style.color = "var(--wa-assistant-primary)";
    genBtn.disabled = true;
    submitBtn.disabled = true;

    try {
      const formattedContext = threadHistory.map(item => `${item.sender}: ${item.text}`).join("\n");
      const lastClientMsg = threadHistory.filter(i => i.sender === "לקוח").slice(-1)[0]?.text || "";

      const promptText = `You are an expert educational sales & academic consultant at HackerU academy in Israel. Your name is Eran ("אני").
You are having a WhatsApp conversation with a prospective student ("לקוח").

Below is the FULL recent WhatsApp chat thread history in chronological order:
--- CHAT THREAD HISTORY ---
${formattedContext}
--- END OF CHAT THREAD HISTORY ---

The prospective client's latest message: "${lastClientMsg}"

Eran's specific instruction for the reply (if any):
"${instruction || "המשך את השיחה בטבעיות ובחיוב, תשאל אם עבר על הסילבוס/הצעת המחיר או מתי נוח לשוחח"}"

Response style required: ${style}.

CRITICAL SALES RESPONSE REQUIREMENTS:
1. Understand the conversation context: Eran ("אני") is the HackerU consultant offering course options/proposals, and the client ("לקוח") is responding.
2. Draft a natural, highly effective, proactive follow-up WhatsApp message from Eran ("אני") that directly builds upon the latest exchange and advances the conversation forward (e.g. asking when is a good time for a quick call to discuss the syllabus/proposal details, or offering next steps).
3. Write the response in natural, convincing Hebrew.
4. Format for WhatsApp with short paragraphs, clear line breaks, and subtle matching emojis (e.g. 🎓, 🚀, 📞, 😊).
5. Output ONLY the final Hebrew response text. Strictly DO NOT include sender prefixes (like 'אני:'), labels, explanations, or markdown code blocks.`;

      let resultText = await callGeminiAPI(promptText);
      if (resultText.startsWith("```")) {
        resultText = resultText.replace(/^```[a-zA-Z]*\n/, "").replace(/\n```$/, "");
      }

      outputArea.value = resultText;
      statusSpan.textContent = "תגובה מוכנה! ✨";
      statusSpan.style.color = "#10b981";
      submitBtn.disabled = false;
    } catch (err) {
      console.error(err);
      statusSpan.textContent = "שגיאה ❌";
      statusSpan.style.color = "#ef4444";
      alert("שגיאה בניסוח התגובה: " + err.message);
    } finally {
      genBtn.disabled = false;
    }
  });
}

function base64ToBlob(base64, type) {
  const parts = base64.split(';base64,');
  const raw = window.atob(parts[1]);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);
  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }
  return new Blob([uInt8Array], { type: type });
}

function escapeHTML(str) {
  if (str === null || str === undefined) return "";
  const s = String(str);
  return s.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

function renderSyllabusSettingsList() {
  const container = document.getElementById("wa-syllabus-list-container");
  if (!container) return;

  const validFiles = (syllabusFiles || []).filter(f => f && typeof f === "object" && f.id);

  // Update count badge
  const countBadge = document.getElementById("wa-assistant-syllabus-count-badge");
  if (countBadge) {
    countBadge.textContent = validFiles.length;
  }

  container.innerHTML = "";
  
  if (validFiles.length === 0) {
    container.innerHTML = `<span style="font-size: 10px; color: var(--wa-assistant-text-muted); font-style: italic;">לא נטענו קבצים עדיין.</span>`;
    return;
  }
  
  validFiles.forEach((file, index) => {
    const row = document.createElement("div");
    row.className = "wa-syllabus-row";
    
    const upAttr = index === 0 ? "disabled style='opacity: 0.2; cursor: default; pointer-events: none; background: transparent; border: none; color: var(--wa-assistant-text); font-size: 10px; padding: 2px;'" : "style='background: rgba(255,255,255,0.08); border: 1px solid var(--wa-assistant-border); color: var(--wa-assistant-text); cursor: pointer; padding: 2px 6px; border-radius: 4px; font-size: 8px; font-family: var(--wa-assistant-font);'";
    const downAttr = index === validFiles.length - 1 ? "disabled style='opacity: 0.2; cursor: default; pointer-events: none; background: transparent; border: none; color: var(--wa-assistant-text); font-size: 10px; padding: 2px;'" : "style='background: rgba(255,255,255,0.08); border: 1px solid var(--wa-assistant-border); color: var(--wa-assistant-text); cursor: pointer; padding: 2px 6px; border-radius: 4px; font-size: 8px; font-family: var(--wa-assistant-font);'";

    row.innerHTML = `
      <input type="text" class="wa-syllabus-name-input" data-id="${file.id}" value="${escapeHTML(file.name)}" placeholder="שם הקובץ...">
      <span class="wa-syllabus-meta" title="${escapeHTML(file.fileName)}" style="font-size: 8px; color: var(--wa-assistant-text-muted); max-width: 50px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; direction: ltr; margin-left: 4px;">(${escapeHTML(file.fileName)})</span>
      <div style="display: flex; gap: 4px; align-items: center; margin-left: 4px;">
        <button class="wa-syllabus-move-up-btn" data-id="${file.id}" title="הזז למעלה" ${upAttr}>▲</button>
        <button class="wa-syllabus-move-down-btn" data-id="${file.id}" title="הזז למטה" ${downAttr}>▼</button>
      </div>
      <button class="wa-syllabus-delete-btn" data-id="${file.id}">🗑️</button>
    `;
    
    // Handle rename
    const nameInput = row.querySelector(".wa-syllabus-name-input");
    nameInput.addEventListener("change", () => {
      const newName = nameInput.value.trim();
      if (newName) {
        syllabusFiles = validFiles.map(f => f.id === file.id ? { ...f, name: newName } : f);
        safeStorageSet({ syllabusFiles });
      }
    });

    // Handle move up
    const upBtn = row.querySelector(".wa-syllabus-move-up-btn");
    if (upBtn) {
      upBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        console.log("Syllabus: Move Up clicked for index:", index, "file:", file.name);
        if (index > 0) {
          const temp = validFiles[index];
          validFiles[index] = validFiles[index - 1];
          validFiles[index - 1] = temp;
          syllabusFiles = validFiles;
          
          // Render UI immediately for instant feedback
          renderSyllabusSettingsList();
          
          safeStorageSet({ syllabusFiles }, () => {
            loadTemplates();
          });
        }
      });
    }

    // Handle move down
    const downBtn = row.querySelector(".wa-syllabus-move-down-btn");
    if (downBtn) {
      downBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        console.log("Syllabus: Move Down clicked for index:", index, "file:", file.name);
        if (index < validFiles.length - 1) {
          const temp = validFiles[index];
          validFiles[index] = validFiles[index + 1];
          validFiles[index + 1] = temp;
          syllabusFiles = validFiles;
          
          // Render UI immediately for instant feedback
          renderSyllabusSettingsList();
          
          safeStorageSet({ syllabusFiles }, () => {
            loadTemplates();
          });
        }
      });
    }
    
    // Handle delete
    row.querySelector(".wa-syllabus-delete-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (confirm(`האם למחוק את הקובץ "${file.name}"?`)) {
        syllabusFiles = validFiles.filter(f => f.id !== file.id);
        safeStorageSet({ syllabusFiles }, () => {
          renderSyllabusSettingsList();
          loadTemplates();
        });
      }
    });
    
    container.appendChild(row);
  });
}

function toggleSyllabusDropdown(e) {
  e.stopPropagation();
  const button = document.getElementById("wa-assistant-send-syllabus-btn");
  if (!button) return;
  
  // Remove any existing dropdown first
  const existing = document.getElementById("wa-syllabus-dropdown-menu");
  if (existing) {
    existing.remove();
    return;
  }
  
  if (syllabusFiles.length === 0) {
    alert("לא נטענו קבצי סילבוס עדיין. אנא טען אותם בתחתית המגירה.");
    return;
  }
  
  const dropdown = document.createElement("div");
  dropdown.id = "wa-syllabus-dropdown-menu";
  dropdown.className = "wa-syllabus-dropdown-menu";
  
  // Position absolutely relative to the header panel
  dropdown.style.top = "100%";
  dropdown.style.left = "10px";
  dropdown.style.right = "auto";
  
  syllabusFiles.forEach(file => {
    const item = document.createElement("div");
    item.className = "wa-syllabus-dropdown-item";
    item.textContent = file.name;
    
    item.addEventListener("click", () => {
      sendSyllabusFile(file);
      dropdown.remove();
    });
    
    dropdown.appendChild(item);
  });
  
  const header = document.getElementById("wa-assistant-sidebar-panel")?.querySelector(".wa-assistant-header");
  if (header) {
    header.appendChild(dropdown);
  } else {
    document.body.appendChild(dropdown);
  }
  
  // Close dropdown on click outside
  const closeDropdown = (event) => {
    if (!dropdown.contains(event.target) && event.target !== button) {
      dropdown.remove();
      document.removeEventListener("click", closeDropdown);
    }
  };
  setTimeout(() => document.addEventListener("click", closeDropdown), 10);
}

// Floating quick syllabus menu anchored to floating 📎 trigger button
function toggleFloatingSyllabusMenu(triggerEl, e) {
  if (e) e.stopPropagation();

  const existing = document.getElementById("wa-floating-syllabus-menu");
  if (existing) {
    existing.remove();
    return;
  }

  const validFiles = (syllabusFiles || []).filter(f => f && f.data);
  if (validFiles.length === 0) {
    showNotificationToast("לא נטענו קבצי סילבוס עדיין. ניתן להעלות קבצים בסרגל הצד (ניהול סילבוסים). 📎");
    return;
  }

  const rect = triggerEl.getBoundingClientRect();
  const menu = document.createElement("div");
  menu.id = "wa-floating-syllabus-menu";
  menu.style.cssText = `
    position: fixed;
    z-index: 100005;
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 10px;
    box-shadow: 0 12px 35px rgba(0,0,0,0.6);
    padding: 8px 0;
    min-width: 220px;
    max-width: 320px;
    max-height: 280px;
    overflow-y: auto;
    direction: rtl;
    font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
    color: #f8fafc;
  `;

  // Position nicely above or below the trigger
  const spaceAbove = rect.top;
  if (spaceAbove > 300) {
    menu.style.bottom = `${window.innerHeight - rect.top + 8}px`;
  } else {
    menu.style.top = `${rect.bottom + 8}px`;
  }
  
  if (rect.left + 240 > window.innerWidth) {
    menu.style.right = `${window.innerWidth - rect.right}px`;
  } else {
    menu.style.left = `${rect.left}px`;
  }

  const header = document.createElement("div");
  header.style.cssText = "padding: 6px 12px; font-size: 11px; font-weight: 700; color: #94a3b8; border-bottom: 1px solid #334155; display: flex; align-items: center; justify-content: space-between;";
  header.innerHTML = `
    <span>📎 בחר סילבוס להצמדה / שליחה:</span>
    <span style="font-size: 14px; opacity: 0.7; cursor: pointer; line-height: 1;" id="wa-floating-syllabus-close">&times;</span>
  `;
  menu.appendChild(header);

  validFiles.forEach(file => {
    const item = document.createElement("div");
    item.style.cssText = "padding: 8px 12px; font-size: 12px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; gap: 8px; transition: background 0.15s ease;";
    item.innerHTML = `
      <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 500;">📄 ${escapeHTML(file.name)}</span>
      <span style="font-size: 10px; color: #60a5fa; font-weight: 600; flex-shrink: 0; background: rgba(59, 130, 246, 0.15); padding: 2px 6px; border-radius: 4px;">הצמד 📥</span>
    `;
    item.addEventListener("mouseenter", () => item.style.background = "rgba(255,255,255,0.08)");
    item.addEventListener("mouseleave", () => item.style.background = "transparent");
    item.addEventListener("click", () => {
      sendSyllabusFile(file);
      menu.remove();
    });
    menu.appendChild(item);
  });

  document.body.appendChild(menu);

  menu.querySelector("#wa-floating-syllabus-close").addEventListener("click", () => menu.remove());

  const closeOnClickOutside = (evt) => {
    if (!menu.contains(evt.target) && evt.target !== triggerEl && !triggerEl.contains(evt.target)) {
      menu.remove();
      document.removeEventListener("click", closeOnClickOutside);
    }
  };
  setTimeout(() => document.addEventListener("click", closeOnClickOutside), 50);
}

async function sendSyllabusFile(file, captionText = "") {
  if (!file || !file.data) return;

  const onWhatsApp = window.location.hostname.includes("whatsapp.com");

  if (onWhatsApp) {
    const mainContainer = document.querySelector("#main");
    if (!mainContainer) {
      showNotificationToast("אנא ודא שאתה בתוך שיחה פעילה בוואטסאפ. ⚠️");
      return;
    }
    
    try {
      // Post message to window. The message will be picked up by main-world.js running in the MAIN world
      window.postMessage({
        type: "WA_SEND_SYLLABUS",
        file: {
          data: file.data, // base64 string
          fileName: file.fileName,
          caption: captionText
        }
      }, "*");
      console.log("Syllabus postMessage sent from isolated world to main world with caption.");
    } catch (err) {
      showNotificationToast("שגיאה בשליחת הסילבוס: " + err.message);
    }
    return;
  }

  // --- OUTLOOK WEB / GMAIL / WEBMAIL EMAIL HANDLER ---
  try {
    const blob = base64ToBlob(file.data, "application/pdf");
    const fileName = file.fileName || `${file.name || "syllabus"}.pdf`;
    const pdfFile = new File([blob], fileName, { type: "application/pdf" });

    // 1. Copy PDF File directly to clipboard
    try {
      if (navigator.clipboard && window.ClipboardItem) {
        const item = new ClipboardItem({
          [blob.type || "application/pdf"]: blob
        });
        await navigator.clipboard.write([item]);
      }
    } catch (clipErr) {
      console.log("ClipboardItem write attempted:", clipErr);
    }

    // 2. Dispatch synthetic paste event to target email editor so Outlook/Gmail attaches it natively
    const targetEditor = getWhatsAppEditor();
    if (targetEditor) {
      try {
        targetEditor.focus();
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(pdfFile);

        const pasteEvent = new ClipboardEvent("paste", {
          bubbles: true,
          cancelable: true,
          clipboardData: dataTransfer
        });
        targetEditor.dispatchEvent(pasteEvent);
      } catch (pasteErr) {
        console.log("Synthetic paste event attempted:", pasteErr);
      }
    }

    showNotificationToast(`📎 סילבוס "${file.name}" מוכן! לחץ Ctrl+V בטיוטת המייל לצירוף ישיר.`);
  } catch (emailErr) {
    console.error("Error processing syllabus for email:", emailErr);
    showNotificationToast("שגיאה בהכנת קובץ הסילבוס למייל. ⚠️");
  }
}

// Smoothly navigate to a chat internally via WhatsApp's React Router click interceptor (main-world context)
function navigateToChat(phone, msgId = null, messageSnippet = null) {
  try {
    const onWhatsApp = window.location.hostname.includes("whatsapp.com");
    const cleanNum = (phone || "").replace(/\D/g, "");

    if (!onWhatsApp) {
      // If we are on Priza / Excel / Outlook / any external Web page:
      // 1. Tell background service worker to find and focus the ALREADY OPEN WhatsApp tab
      try {
        if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.sendMessage) {
          chrome.runtime.sendMessage({
            action: "OPEN_OR_FOCUS_WHATSAPP",
            phone: cleanNum || phone,
            msgId: msgId,
            messageSnippet: messageSnippet
          });
        }
      } catch (err) {
        console.warn("Error sending OPEN_OR_FOCUS_WHATSAPP:", err);
      }

      // 2. Broadcast via BroadcastChannel so the open WhatsApp tab navigates immediately (0ms)
      broadcastCrossTabMessage("NAVIGATE_WHATSAPP_CHAT", {
        phone: cleanNum || phone,
        msgId: msgId,
        messageSnippet: messageSnippet
      });

      showNotificationToast("עובר לצ'אט ב-WhatsApp Web... 💬");
      return;
    }

    // When on WhatsApp Web:
    const query = cleanNum ? cleanNum : (phone ? phone.trim() : "");
    if (!query) return;

    window.postMessage({
      type: "WA_NAVIGATE_TO_CHAT",
      phone: query
    }, "*");
    console.log("Sent navigateToChat postMessage request for query:", query);
    if (msgId) {
      scrollToMessageAfterNavigation(msgId, messageSnippet);
    }
  } catch (e) {
    console.warn("postMessage navigation failed, falling back to location.href reload:", e);
    const cleanNum = (phone || "").replace(/\D/g, "");
    if (cleanNum) {
      window.location.href = `https://web.whatsapp.com/send?phone=${cleanNum}`;
    }
  }
}

// Wait for messages to load and smoothly scroll and flash the target reminder message
function scrollToMessageAfterNavigation(msgId, messageSnippet = null) {
  if (!window.location.hostname.includes("whatsapp.com")) return;
  showNotificationToast("מנווט לצ'אט ומחפש את ההודעה... 🔍");
  let attempts = 0;
  const maxAttempts = 30; // Try for 15 seconds
  const interval = setInterval(() => {
    attempts++;
    // Look for element having data-id matching or containing the msgId (case-insensitive)
    let msgEl = document.querySelector(`[data-id="${msgId}" i]`) || 
                document.querySelector(`[data-id*="${msgId}" i]`);
                
    if (!msgEl) {
      // Fallback 1: Scan all elements with data-id manually (to handle any potential DOM parsing anomalies)
      const allMsgEls = Array.from(document.querySelectorAll('[data-id]'));
      msgEl = allMsgEls.find(el => {
        const idAttr = el.getAttribute('data-id') || "";
        return idAttr.toLowerCase().includes(msgId.toLowerCase());
      });
    }

    if (!msgEl && messageSnippet) {
      // Fallback 2: Scan all message bubbles for matching text snippet (whitespace normalized)
      const normalize = str => str.replace(/\s+/g, ' ').trim();
      const normSnippet = normalize(messageSnippet);
      if (normSnippet && normSnippet.length > 4) {
        const bubbles = Array.from(document.querySelectorAll('.copyable-text, [class*="selectable-text"]'));
        const matchedBubble = bubbles.find(el => {
          const normText = normalize(el.innerText || el.textContent || "");
          return normText.includes(normSnippet) || normSnippet.includes(normText);
        });
        if (matchedBubble) {
          msgEl = matchedBubble.closest('[data-id]') || matchedBubble;
        }
      }
    }

    if (msgEl) {
      clearInterval(interval);
      console.log("Syllabus/Reminder: Found target message in DOM. Scrolling to it:", msgId);
      
      // Perform smooth scroll to center of viewport
      msgEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Locate the message bubble itself
      const bubble = msgEl.querySelector('.copyable-text') || msgEl.querySelector('[class*="selectable-text"]') || msgEl;
      
      // Save original styles
      const originalTransition = bubble.style.transition;
      const originalBoxShadow = bubble.style.boxShadow;
      const originalBg = bubble.style.backgroundColor;
      
      // Apply beautiful glowing transition using !important overrides
      bubble.style.transition = "all 0.4s ease";
      bubble.style.setProperty("box-shadow", "0 0 25px 8px rgba(234, 179, 8, 0.95)", "important");
      bubble.style.setProperty("background-color", "rgba(234, 179, 8, 0.35)", "important");
      
      // Show success toast
      showNotificationToast("ההודעה נמצאה והובלטה! ✨");

      // Reset styles after 2.5 seconds
      setTimeout(() => {
        bubble.style.boxShadow = originalBoxShadow;
        bubble.style.backgroundColor = originalBg;
        bubble.style.transition = originalTransition;
      }, 2500);
    } else {
      // If message is not found, scroll the chat history container to the top to trigger loading of older messages!
      let scrollEl = null;
      try {
        const main = document.getElementById("main");
        if (main) {
          const elements = main.querySelectorAll('*');
          for (const el of elements) {
            const style = window.getComputedStyle(el);
            const overflow = style.overflowY || style.overflow || "";
            if ((overflow === "auto" || overflow === "scroll" || el.style.overflowY === "scroll" || el.style.overflowY === "auto") && el.scrollHeight > el.clientHeight) {
              scrollEl = el;
              break;
            }
          }
        }
      } catch (e) {
        console.warn("Syllabus/Reminder: Error searching scroll container:", e);
      }
      
      if (!scrollEl) {
        scrollEl = document.querySelector('#main div[style*="overflow-y"]') || 
                   document.querySelector('#main .copyable-area') ||
                   document.querySelector('#main [class*="focusable-list-item"]')?.parentElement;
      }
      
      if (scrollEl) {
        console.log("Syllabus/Reminder: Message not in DOM yet. Scrolling to top to load history...");
        scrollEl.scrollTop = 0;
      }
      
      if (attempts >= maxAttempts) {
        clearInterval(interval);
        console.warn("Syllabus/Reminder: Could not find target message in DOM after navigation:", msgId);
        showNotificationToast("הצ'אט נפתח, אך ההודעה ישנה מדי ולא נטענה בהיסטוריה. ⏳");
      }
    }
  }, 500);
}

const ARCHIVE_RETENTION_DAYS = 5; // Auto-delete archived reminders older than 5 days

// Auto-purge old reminders from archive to prevent memory and storage bloat
function purgeOldArchivedReminders() {
  if (!archivedReminders || archivedReminders.length === 0) return false;
  const cutoffTime = Date.now() - (ARCHIVE_RETENTION_DAYS * 24 * 60 * 60 * 1000);
  const originalLength = archivedReminders.length;
  archivedReminders = archivedReminders.filter(r => {
    const ts = r.archivedAt || r.time || 0;
    return ts > cutoffTime;
  });
  // Cap max archived entries to 30 to keep storage clean and fast
  if (archivedReminders.length > 30) {
    archivedReminders = archivedReminders.slice(0, 30);
  }
  return archivedReminders.length !== originalLength;
}

function archiveReminder(rem, saveToStorage = true) {
  if (!rem) return;
  const archivedItem = { ...rem, archivedAt: Date.now() };
  archivedReminders = (archivedReminders || []).filter(r => r.id !== rem.id);
  archivedReminders.unshift(archivedItem);
  purgeOldArchivedReminders();
  if (saveToStorage) {
    safeStorageSet({ archivedReminders });
  }
}

function restoreArchivedReminder(remId) {
  const item = archivedReminders.find(r => r.id === remId);
  if (!item) return;
  archivedReminders = archivedReminders.filter(r => r.id !== remId);
  const restoredTime = (item.time && item.time > Date.now()) ? item.time : (Date.now() + 5 * 60 * 1000);
  const restored = { ...item, time: restoredTime };
  reminders.unshift(restored);
  broadcastRemindersUpdate("REMINDERS_UPDATED");
  safeStorageSet({ reminders, archivedReminders }, () => {
    renderSidebarReminders();
    updateReminderIndicators();
    renderFloatingAlertCard();
    showNotificationToast("התזכורת הוחזרה בהצלחה לתזכורות פעילות! 🔔");
  });
}

// Convert timestamp (ms) to local YYYY-MM-DDTHH:mm format for <input type="datetime-local">
function formatMsToDatetimeLocal(ms) {
  const d = new Date(ms || Date.now());
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// Convert YYYY-MM-DDTHH:mm string from <input type="datetime-local"> to timestamp (ms)
function parseDatetimeLocalToMs(timeStr) {
  if (!timeStr) return Date.now();
  const parts = timeStr.split("T");
  if (parts.length !== 2) return new Date(timeStr).getTime();
  const dateParts = parts[0].split("-").map(Number);
  const timeParts = parts[1].split(":").map(Number);
  
  const d = new Date();
  d.setFullYear(dateParts[0], dateParts[1] - 1, dateParts[2]);
  d.setHours(timeParts[0], timeParts[1], 0, 0);
  return d.getTime();
}

// Open modal to edit an existing reminder
function openEditReminderModal(rem) {
  if (!rem) return;
  const existing = document.getElementById("wa-rem-edit-modal");
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.id = "wa-rem-edit-modal";
  overlay.className = "wa-modal-overlay";
  overlay.style.direction = "rtl";
  overlay.style.zIndex = "100008";

  const remISOTime = formatMsToDatetimeLocal(rem.time);

  overlay.innerHTML = `
    <div class="wa-modal-box" style="width: 380px; max-width: 95%;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <h3 style="margin: 0; font-size: 14px; color: var(--wa-assistant-text);">✏️ עריכת תזכורת</h3>
        <button type="button" id="wa-edit-rem-close-x" style="background: transparent; border: none; color: var(--wa-assistant-text-muted); font-size: 22px; cursor: pointer; line-height: 1; padding: 0 4px; border-radius: 4px;" title="סגור">&times;</button>
      </div>
      
      <div class="wa-modal-field-group" style="margin-bottom: 12px;">
        <label>שם הלקוח / כותרת התזכורת:</label>
        <input type="text" id="wa-edit-rem-title" value="${escapeHTML(rem.chatTitle || "")}" style="width: 100%; background: var(--wa-assistant-bg); border: 1px solid var(--wa-assistant-border); color: var(--wa-assistant-text); font-size: 12px; padding: 8px 12px; border-radius: 6px; outline: none; font-family: var(--wa-assistant-font); text-align: right;" placeholder="שם הלקוח...">
      </div>

      <div class="wa-modal-field-group" style="margin-bottom: 14px;">
        <label>תוכן / נושא התזכורת:</label>
        <textarea id="wa-edit-rem-note" rows="3" style="width: 100%; background: var(--wa-assistant-bg); border: 1px solid var(--wa-assistant-border); color: var(--wa-assistant-text); font-size: 12px; padding: 8px 12px; border-radius: 6px; outline: none; font-family: var(--wa-assistant-font); resize: vertical; text-align: right; white-space: pre-wrap;" placeholder="נושא התזכורת...">${escapeHTML(rem.messageSnippet || "")}</textarea>
        <button type="button" id="wa-edit-rem-auto-extract-btn" style="width: 100%; margin-top: 6px; background: rgba(59, 130, 246, 0.15); border: 1px solid rgba(59, 130, 246, 0.4); color: #60a5fa; padding: 6px 10px; border-radius: 6px; font-size: 11px; font-weight: 600; cursor: pointer; font-family: var(--wa-assistant-font); display: flex; align-items: center; justify-content: center; gap: 4px; outline: none;">
          ✨ חלץ שם, טלפון ושעה מתוכן ההודעה
        </button>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 12px;">
        <button type="button" class="wa-edit-quick-time-btn" data-ms="${15 * 60 * 1000}" style="background: var(--wa-assistant-bg); border: 1px solid var(--wa-assistant-border); color: var(--wa-assistant-text); padding: 6px; border-radius: 6px; font-size: 11px; cursor: pointer; font-family: var(--wa-assistant-font);">⏱️ בעוד 15 דק'</button>
        <button type="button" class="wa-edit-quick-time-btn" data-ms="${60 * 60 * 1000}" style="background: var(--wa-assistant-bg); border: 1px solid var(--wa-assistant-border); color: var(--wa-assistant-text); padding: 6px; border-radius: 6px; font-size: 11px; cursor: pointer; font-family: var(--wa-assistant-font);">⏰ בעוד שעה</button>
        <button type="button" class="wa-edit-quick-time-btn" id="wa-edit-rem-tomorrow" style="background: var(--wa-assistant-bg); border: 1px solid var(--wa-assistant-border); color: var(--wa-assistant-text); padding: 6px; border-radius: 6px; font-size: 11px; cursor: pointer; font-family: var(--wa-assistant-font);">📅 מחר (09:00)</button>
        <button type="button" class="wa-edit-quick-time-btn" id="wa-edit-rem-evening" style="background: var(--wa-assistant-bg); border: 1px solid var(--wa-assistant-border); color: var(--wa-assistant-text); padding: 6px; border-radius: 6px; font-size: 11px; cursor: pointer; font-family: var(--wa-assistant-font);">🌙 הערב (18:00)</button>
      </div>

      <div class="wa-modal-field-group">
        <label>מועד התזכורת:</label>
        <input type="datetime-local" id="wa-edit-rem-custom-time" value="${remISOTime}" style="width: 100%; background: var(--wa-assistant-bg); border: 1px solid var(--wa-assistant-border); color: var(--wa-assistant-text); font-size: 12px; padding: 8px; border-radius: 6px; outline: none; font-family: var(--wa-assistant-font);">
      </div>

      <div class="wa-modal-actions" style="margin-top: 16px;">
        <button type="button" class="wa-modal-btn wa-modal-btn-secondary" id="wa-edit-rem-cancel">ביטול</button>
        <button type="button" class="wa-modal-btn wa-modal-btn-primary" id="wa-edit-rem-save">שמור שינויים</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const close = (e) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    document.removeEventListener("keydown", onKeyDownEsc);
    overlay.remove();
  };

  const onKeyDownEsc = (e) => {
    if (e.key === "Escape") close(e);
  };
  document.addEventListener("keydown", onKeyDownEsc);

  // Click on background backdrop to close
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close(e);
  });

  const cancelBtn = overlay.querySelector("#wa-edit-rem-cancel");
  if (cancelBtn) cancelBtn.addEventListener("click", close);

  const closeXBtn = overlay.querySelector("#wa-edit-rem-close-x");
  if (closeXBtn) closeXBtn.addEventListener("click", close);

  const customTimeInput = document.getElementById("wa-edit-rem-custom-time");
  const editTitleInput = document.getElementById("wa-edit-rem-title");
  const editNoteTextarea = document.getElementById("wa-edit-rem-note");
  const editExtractBtn = document.getElementById("wa-edit-rem-auto-extract-btn");

  const runEditAutoExtraction = (showToast = true) => {
    if (!editNoteTextarea) return;
    const parsed = extractReminderDetailsFromText(editNoteTextarea.value);
    if (parsed) {
      if (parsed.name && editTitleInput) editTitleInput.value = parsed.name;
      if (parsed.timeMs && customTimeInput) customTimeInput.value = formatMsToDatetimeLocal(parsed.timeMs);
      if (showToast && (parsed.name || parsed.timeMs)) {
        const parts = [];
        if (parsed.name) parts.push(`שם: ${parsed.name}`);
        if (parsed.timeLabel) parts.push(`שעה: ${parsed.timeLabel}`);
        showNotificationToast(`✨ חולצו נתונים: ${parts.join(" | ")}`);
      }
    }
  };

  if (editExtractBtn) {
    editExtractBtn.addEventListener("click", () => runEditAutoExtraction(true));
  }
  if (editNoteTextarea) {
    editNoteTextarea.addEventListener("input", () => runEditAutoExtraction(false));
    editNoteTextarea.addEventListener("paste", () => setTimeout(() => runEditAutoExtraction(true), 50));
  }

  // Quick time buttons in edit modal
  overlay.querySelectorAll(".wa-edit-quick-time-btn[data-ms]").forEach(btn => {
    btn.addEventListener("click", () => {
      const ms = parseInt(btn.getAttribute("data-ms"), 10);
      const newMs = Date.now() + ms;
      if (customTimeInput) customTimeInput.value = formatMsToDatetimeLocal(newMs);
    });
  });

  const tomorrowBtn = document.getElementById("wa-edit-rem-tomorrow");
  if (tomorrowBtn) {
    tomorrowBtn.addEventListener("click", () => {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      d.setHours(9, 0, 0, 0);
      if (customTimeInput) customTimeInput.value = formatMsToDatetimeLocal(d.getTime());
    });
  }

  const eveningBtn = document.getElementById("wa-edit-rem-evening");
  if (eveningBtn) {
    eveningBtn.addEventListener("click", () => {
      const d = new Date();
      d.setHours(18, 0, 0, 0);
      if (d.getTime() <= Date.now()) d.setDate(d.getDate() + 1);
      if (customTimeInput) customTimeInput.value = formatMsToDatetimeLocal(d.getTime());
    });
  }

  // Save changes handler
  document.getElementById("wa-edit-rem-save").addEventListener("click", () => {
    const newTitle = document.getElementById("wa-edit-rem-title").value.trim() || rem.chatTitle;
    const newNote = document.getElementById("wa-edit-rem-note").value.trim() || rem.messageSnippet;
    const timeVal = customTimeInput ? customTimeInput.value : "";
    let newTimeMs = rem.time;
    if (timeVal) {
      const parsedMs = parseDatetimeLocalToMs(timeVal);
      if (!isNaN(parsedMs)) newTimeMs = parsedMs;
    }

    reminders = reminders.map(r => r.id === rem.id ? {
      ...r,
      chatTitle: newTitle,
      messageSnippet: newNote,
      time: newTimeMs
    } : r);

    // If time was moved to the future, remove from currently active due popups
    if (newTimeMs > Date.now()) {
      activeDueReminders = (activeDueReminders || []).filter(r => r.id !== rem.id);
      shownAlertIds = (shownAlertIds || []).filter(id => id !== rem.id);
    }

    safeStorageSet({ reminders }, () => {
      renderSidebarReminders();
      updateReminderIndicators();
      renderFloatingAlertCard();
      close();
      showNotificationToast("התזכורת עודכנה בהצלחה! ✏️");
    });
  });
}

// Render reminders inside the sidebar tab
function renderSidebarReminders() {
  const container = document.getElementById("wa-reminders-tab-content");
  if (!container) return;

  container.innerHTML = "";

  // Add top bar with "+ תזכורת חדשה" button
  const topBar = document.createElement("div");
  topBar.style.cssText = "padding: 8px 10px; border-bottom: 1px solid var(--wa-assistant-border); display: flex; gap: 6px; align-items: center; justify-content: space-between; background-color: var(--wa-assistant-card-bg); margin-bottom: 6px;";
  topBar.innerHTML = `
    <button id="wa-reminders-add-btn" style="background: var(--wa-assistant-primary); border: none; color: white; cursor: pointer; font-size: 11px; font-weight: 600; padding: 6px 12px; border-radius: 6px; font-family: var(--wa-assistant-font); display: flex; align-items: center; gap: 4px; flex-grow: 1; justify-content: center;">➕ תזכורת חדשה</button>
  `;
  container.appendChild(topBar);

  document.getElementById("wa-reminders-add-btn").addEventListener("click", () => {
    openAddReminderModal(null);
  });

  // Sub-tabs for Active vs Archived Reminders
  const subTabs = document.createElement("div");
  subTabs.style.cssText = "display: flex; gap: 4px; padding: 4px; background: var(--wa-assistant-bg); border-radius: 6px; margin-bottom: 8px; border: 1px solid var(--wa-assistant-border);";
  subTabs.innerHTML = `
    <button id="wa-rem-mode-active" style="flex: 1; padding: 5px 6px; border-radius: 4px; font-size: 10px; font-weight: 600; cursor: pointer; border: none; font-family: var(--wa-assistant-font); transition: all 0.2s ease; ${remindersViewMode === 'active' ? 'background: var(--wa-assistant-card-bg); color: var(--wa-assistant-primary); box-shadow: 0 1px 3px rgba(0,0,0,0.2);' : 'background: transparent; color: var(--wa-assistant-text-muted);'}">
      🔔 פעילות (${reminders ? reminders.length : 0})
    </button>
    <button id="wa-rem-mode-archive" style="flex: 1; padding: 5px 6px; border-radius: 4px; font-size: 10px; font-weight: 600; cursor: pointer; border: none; font-family: var(--wa-assistant-font); transition: all 0.2s ease; ${remindersViewMode === 'archive' ? 'background: var(--wa-assistant-card-bg); color: var(--wa-assistant-primary); box-shadow: 0 1px 3px rgba(0,0,0,0.2);' : 'background: transparent; color: var(--wa-assistant-text-muted);'}">
      📦 היסטוריית ארכיון (${archivedReminders ? archivedReminders.length : 0})
    </button>
  `;
  container.appendChild(subTabs);

  document.getElementById("wa-rem-mode-active").addEventListener("click", () => {
    remindersViewMode = "active";
    renderSidebarReminders();
  });
  document.getElementById("wa-rem-mode-archive").addEventListener("click", () => {
    remindersViewMode = "archive";
    renderSidebarReminders();
  });

  const listContainer = document.createElement("div");
  listContainer.style.cssText = "display: flex; flex-direction: column; gap: 8px;";
  container.appendChild(listContainer);

  if (remindersViewMode === "active") {
    if (!reminders || reminders.length === 0) {
      const archiveCount = archivedReminders ? archivedReminders.length : 0;
      listContainer.innerHTML = `
        <div style="text-align: center; color: var(--wa-assistant-text-muted); font-size: 11px; padding: 20px 10px; line-height: 1.5; direction: rtl;">
          אין תזכורות פעילות כרגע. 📅<br>
          ${archiveCount > 0 ? `
            <button id="wa-rem-switch-archive-link" style="margin-top: 10px; background: rgba(59, 130, 246, 0.15); border: 1px solid rgba(59, 130, 246, 0.4); color: #60a5fa; padding: 7px 12px; border-radius: 6px; font-size: 11px; font-weight: 600; cursor: pointer; font-family: var(--wa-assistant-font); display: inline-flex; align-items: center; gap: 4px;">
              📦 לחץ לצפייה ב-${archiveCount} תזכורות בארכיון
            </button>
          ` : `<span style="font-size: 10px; opacity: 0.8;">לחץ על "➕ תזכורת חדשה" למעלה או על הפעמון 🔔 ליד הודעות בצ'אט.</span>`}
        </div>
      `;
      const archiveLink = listContainer.querySelector("#wa-rem-switch-archive-link");
      if (archiveLink) {
        archiveLink.addEventListener("click", () => {
          remindersViewMode = "archive";
          renderSidebarReminders();
        });
      }
      return;
    }

    const sorted = reminders.filter(r => r && r.time).sort((a, b) => a.time - b.time);

    sorted.forEach(rem => {
      const card = document.createElement("div");
      card.id = `wa-reminder-card-${rem.id}`;
      card.className = "wa-assistant-reminder-card";
      card.style.cssText = "background: var(--wa-assistant-card-bg); border: 1px solid var(--wa-assistant-border); border-radius: 8px; padding: 10px; display: flex; flex-direction: column; gap: 6px; direction: rtl; border-right: 4px solid var(--wa-assistant-primary);";

      const formattedTime = new Date(rem.time).toLocaleString("he-IL", {
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });

      const isPast = rem.time <= Date.now();
      const timeColor = isPast ? "#ef4444" : "var(--wa-assistant-primary)";

      const fullText = `${rem.clientPhone || ""} ${rem.messageSnippet || ""} ${rem.chatTitle || ""}`;
      const rawMatches = fullText.match(/\b\d[\d-]{7,14}\b/g) || [];
      const extractedPhones = Array.from(new Set(rawMatches.map(m => formatIsraeliPhoneTo972(m))))
        .filter(p => p.length >= 9 && p.length <= 12);

      let targetLeadPhone = rem.clientPhone || "";
      if (extractedPhones.length > 0) {
        const leadPhone = extractedPhones.find(p => p !== rem.chatId && !rem.chatId.includes(p.slice(-7))) || extractedPhones[0];
        targetLeadPhone = leadPhone;
      }

      let displayClientPhone = "";
      if (targetLeadPhone) {
        displayClientPhone = targetLeadPhone.startsWith("972") ? "0" + targetLeadPhone.slice(3) : targetLeadPhone;
      }

      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px;">
          <span style="font-weight: 700; font-size: 12px; color: var(--wa-assistant-text); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 130px;">${escapeHTML(rem.chatTitle)}</span>
          <span style="font-size: 10px; color: ${timeColor}; font-weight: 600; white-space: nowrap;">${isPast ? "⏳ עבר המועד!" : "🔔 " + formattedTime}</span>
        </div>
        ${rem.messageSnippet ? `<div style="font-size: 11px; color: var(--wa-assistant-text); background: var(--wa-assistant-bg); padding: 6px 8px; border-radius: 6px; direction: rtl; text-align: right; white-space: pre-wrap; word-break: break-word; max-height: 120px; overflow-y: auto; border-right: 3px solid var(--wa-assistant-primary); line-height: 1.4; margin-top: 2px;">${escapeHTML(rem.messageSnippet)}</div>` : ""}
        <div style="display: flex; gap: 4px; align-items: center; margin-top: 4px; width: 100%;">
          <button class="wa-rem-go-btn" style="background: transparent; border: 1px solid var(--wa-assistant-primary); color: var(--wa-assistant-primary); font-size: 9px; padding: 2px 6px; border-radius: 4px; cursor: pointer; font-family: var(--wa-assistant-font); flex-grow: 1;">📍 להודעה</button>
          ${targetLeadPhone ? `
            <button class="wa-rem-client-btn" style="background: var(--wa-assistant-primary); border: none; color: white; font-size: 9px; padding: 2px 6px; border-radius: 4px; cursor: pointer; font-family: var(--wa-assistant-font); flex-grow: 1;">💬 ללקוח (${displayClientPhone})</button>
          ` : ""}
          <button class="wa-rem-edit-btn" style="background: rgba(234, 179, 8, 0.15); border: 1px solid rgba(234, 179, 8, 0.4); color: #eab308; font-size: 9px; padding: 2px 6px; border-radius: 4px; cursor: pointer; font-family: var(--wa-assistant-font); flex-grow: 1; font-weight: 600;">✏️ ערוך</button>
          <button class="wa-rem-del-btn" title="העבר לארכיון" style="background: transparent; border: none; color: var(--wa-assistant-text-muted); font-size: 11px; cursor: pointer; font-family: var(--wa-assistant-font); margin-right: auto; padding: 2px;">📥</button>
        </div>
      `;

      card.querySelector(".wa-rem-go-btn").addEventListener("click", () => {
        navigateToChat(rem.chatId, rem.msgId, rem.messageSnippet);
      });

      card.querySelector(".wa-rem-edit-btn").addEventListener("click", () => {
        openEditReminderModal(rem);
      });

      if (targetLeadPhone) {
        const clientBtn = card.querySelector(".wa-rem-client-btn");
        if (clientBtn) {
          clientBtn.addEventListener("click", () => {
            showNotificationToast(`מנווט לצ'אט עם ${displayClientPhone}... 💬`);
            navigateToChat(targetLeadPhone);
          });
        }
      }

      card.querySelector(".wa-rem-del-btn").addEventListener("click", () => {
        archiveReminder(rem, false);
        reminders = reminders.filter(r => r.id !== rem.id);
        activeDueReminders = activeDueReminders.filter(r => r.id !== rem.id);
        broadcastRemindersUpdate("REMINDER_DISMISSED", { remId: rem.id });
        safeStorageSet({ reminders, archivedReminders }, () => {
          updateReminderIndicators();
          renderSidebarReminders();
          renderFloatingAlertCard();
          showNotificationToast("התזכורת הועברה לארכיון 📦 (ניתן לשחזר בלשונית ארכיון)");
        });
      });

      listContainer.appendChild(card);
    });
  } else {
    // ARCHIVE VIEW MODE
    purgeOldArchivedReminders();
    if (!archivedReminders || archivedReminders.length === 0) {
      listContainer.innerHTML = `
        <div style="text-align: center; color: var(--wa-assistant-text-muted); font-size: 11px; padding: 20px 10px; line-height: 1.5; direction: rtl;">
          ארכיון התזכורות ריק. 📦<br>
          <span style="font-size: 10px; opacity: 0.8;">תזכורות שתיסגרנה תישמרנה עד ${ARCHIVE_RETENTION_DAYS} ימים למקרה שתרצה לשחזרן, ולאחר מכן נמחקות אוטומטית.</span>
        </div>
      `;
      return;
    }

    // Top control bar for archive
    const archiveHeaderBar = document.createElement("div");
    archiveHeaderBar.style.cssText = "display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; padding: 0 4px; direction: rtl;";
    archiveHeaderBar.innerHTML = `
      <span style="font-size: 10px; color: var(--wa-assistant-text-muted);">
        📦 נשמרות ל-${ARCHIVE_RETENTION_DAYS} ימים ונמחקות לבד (${archivedReminders.length})
      </span>
      <button id="wa-clear-archive-btn" style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.35); color: #ef4444; font-size: 10px; padding: 2px 7px; border-radius: 4px; cursor: pointer; font-family: var(--wa-assistant-font); font-weight: 600;">
        רוקן הכל 🧹
      </button>
    `;
    listContainer.appendChild(archiveHeaderBar);

    archiveHeaderBar.querySelector("#wa-clear-archive-btn").addEventListener("click", () => {
      if (confirm("האם לרוקן את כל ארכיון התזכורות לצמיתות?")) {
        archivedReminders = [];
        broadcastRemindersUpdate("REMINDERS_UPDATED");
        safeStorageSet({ archivedReminders }, () => {
          renderSidebarReminders();
          showNotificationToast("ארכיון התזכורות רוקן לחלוטין 🧹");
        });
      }
    });

    archivedReminders.forEach(rem => {
      const card = document.createElement("div");
      card.className = "wa-assistant-reminder-card";
      card.style.cssText = "background: var(--wa-assistant-card-bg); border: 1px solid var(--wa-assistant-border); border-radius: 8px; padding: 10px; display: flex; flex-direction: column; gap: 6px; direction: rtl; border-right: 4px solid #6b7280; opacity: 0.9;";

      const closedTime = new Date(rem.archivedAt || Date.now()).toLocaleString("he-IL", {
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });

      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px;">
          <span style="font-weight: 700; font-size: 12px; color: var(--wa-assistant-text); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 140px;">${escapeHTML(rem.chatTitle)}</span>
          <span style="font-size: 10px; color: var(--wa-assistant-text-muted); white-space: nowrap;">נסגרה ב-${closedTime}</span>
        </div>
        ${rem.messageSnippet ? `<div style="font-size: 10px; color: var(--wa-assistant-text-muted); background: var(--wa-assistant-bg); padding: 5px 7px; border-radius: 4px; direction: rtl; text-align: right; white-space: pre-wrap; word-break: break-word; max-height: 80px; overflow-y: auto; line-height: 1.3;">${escapeHTML(rem.messageSnippet)}</div>` : ""}
        <div style="display: flex; gap: 6px; align-items: center; margin-top: 4px; width: 100%;">
          <button class="wa-rem-restore-btn" style="background: var(--wa-assistant-primary); border: none; color: white; font-size: 10px; font-weight: 600; padding: 3px 8px; border-radius: 4px; cursor: pointer; font-family: var(--wa-assistant-font); flex-grow: 1;">🔄 החזר לתזכורות</button>
          <button class="wa-rem-hard-del-btn" title="מחק לצמיתות מהארכיון" style="background: transparent; border: none; color: #ef4444; font-size: 10px; cursor: pointer; font-family: var(--wa-assistant-font); padding: 2px;">🗑️</button>
        </div>
      `;

      card.querySelector(".wa-rem-restore-btn").addEventListener("click", () => {
        restoreArchivedReminder(rem.id);
      });

      card.querySelector(".wa-rem-hard-del-btn").addEventListener("click", () => {
        if (confirm(`למחוק את התזכורת עבור "${rem.chatTitle}" לצמיתות מהארכיון?`)) {
          archivedReminders = archivedReminders.filter(r => r.id !== rem.id);
          safeStorageSet({ archivedReminders }, () => {
            renderSidebarReminders();
            showNotificationToast("התזכורת נמחקה לצמיתות מהארכיון.");
          });
        }
      });

      listContainer.appendChild(card);
    });
  }
}

// Format Israeli phone numbers safely to international 972 prefix
function formatIsraeliPhoneTo972(phone) {
  let clean = phone.replace(/\D/g, "");
  if (clean.startsWith("0")) {
    clean = "972" + clean.slice(1);
  } else if (clean.startsWith("5") && (clean.length === 9 || clean.length === 10)) {
    clean = "972" + clean;
  } else if (!clean.startsWith("972") && (clean.length === 9 || clean.length === 10)) {
    clean = "972" + clean;
  }
  return clean;
}

// Format Israeli phone numbers cleanly with local prefix and dash (e.g. 050-2322374)
function formatIsraeliPhoneWithDash(phone) {
  if (!phone) return "";
  let clean = phone.replace(/\D/g, "");
  if (clean.startsWith("972")) {
    clean = "0" + clean.slice(3);
  } else if (!clean.startsWith("0") && (clean.length === 9 || clean.length === 10)) {
    clean = "0" + clean;
  }
  
  // Mobile / 077: 05X-XXXXXXX, 07X-XXXXXXX
  if (clean.startsWith("05") || clean.startsWith("07")) {
    if (clean.length === 10) {
      return clean.slice(0, 3) + "-" + clean.slice(3);
    }
  }
  
  // Landlines: 02-XXXXXXX, 03-XXXXXXX, 04-XXXXXXX, 08-XXXXXXX, 09-XXXXXXX
  if (/^0[23489]/.test(clean)) {
    if (clean.length === 9) {
      return clean.slice(0, 2) + "-" + clean.slice(2);
    }
  }
  
  // General fallback for 8+ digits
  if (clean.length >= 8) {
    return clean.slice(0, 3) + "-" + clean.slice(3);
  }
  
  return clean;
}

// Retrieve active chat title from WhatsApp Web header
function getActiveChatTitle() {
  const header = document.querySelector("#main header");
  if (!header) return "לקוח";
  const titleEl = header.querySelector('[dir="auto"], span[title]');
  return titleEl ? (titleEl.title || titleEl.innerText || "").trim() : "לקוח";
}

// Retrieve active chat phone number or id from DOM
function getActiveChatPhone() {
  const main = document.getElementById("main");
  if (!main) return "";
  
  // Scan data-id attributes of child elements to count JID frequency (to prevent quoted/forwarded JID leakage!)
  const nodes = main.querySelectorAll('[data-id]');
  const counts = {};
  for (const node of nodes) {
    const dataId = node.getAttribute('data-id');
    if (dataId && dataId.includes('@c.us')) {
      const match = dataId.match(/_(\d+)@c\.us/);
      if (match) {
        const phone = match[1];
        counts[phone] = (counts[phone] || 0) + 1;
      }
    }
  }

  let mostFrequentPhone = "";
  let maxCount = 0;
  for (const phone in counts) {
    if (counts[phone] > maxCount) {
      maxCount = counts[phone];
      mostFrequentPhone = phone;
    }
  }

  if (mostFrequentPhone) {
    return formatIsraeliPhoneTo972(mostFrequentPhone);
  }

  // Fallback to title digits if title contains a phone number
  const title = getActiveChatTitle();
  const digits = title.replace(/\D/g, "");
  if (digits.length >= 7) {
    return formatIsraeliPhoneTo972(digits);
  }
  
  return title;
}

// Dedicated function to detect student details (name, phone, email) from WhatsApp Web, Priza CRM student page, or highlighted text
function extractClientFromPrizaOrSelection() {
  let name = "";
  let phone = "";
  let email = "";

  // 1. User highlighted selection (Priority 1)
  try {
    const selectedText = window.getSelection ? window.getSelection().toString().trim() : "";
    if (selectedText) {
      const pMatch = selectedText.match(/(?:05\d[- ]?\d{3}[- ]?\d{4}|05\d[- ]?\d{7}|0[23489][- ]?\d{7}|\b\d{9,12}\b)/);
      if (pMatch) {
        phone = pMatch[0].replace(/\D/g, "");
      }
      const eMatch = selectedText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      if (eMatch) {
        email = eMatch[0].trim();
      }
      if (phone || email) {
        return {
          phone: phone || "",
          formattedPhone: phone ? formatIsraeliPhoneWithDash(phone) : "",
          name: "",
          email: email || ""
        };
      }
    }
  } catch (e) {}

  // 2. WhatsApp Web active chat
  if (window.location.hostname.includes("whatsapp.com")) {
    const waPhone = getActiveChatPhone();
    const waTitle = getActiveChatTitle();
    if (waPhone && !/[a-zA-Z\u0590-\u05FF]/.test(waPhone)) {
      phone = waPhone.replace(/\D/g, "");
    }
    if (waTitle && waTitle !== "לקוח" && waTitle !== waPhone) {
      name = waTitle;
    }
    if (phone) {
      if (phone.startsWith("972") && phone.length === 12) {
        phone = "0" + phone.slice(3);
      }
      return {
        phone,
        formattedPhone: formatIsraeliPhoneWithDash(phone),
        name: name || "",
        email: lastCopiedEmail || ""
      };
    }
  }

  // 3. Priza CRM specific extraction ONLY (priza.net / hackeru)
  const isPriza = window.location.hostname.includes("priza.net") || window.location.hostname.includes("hackeru");
  if (isPriza) {
    try {
      const candidates = document.querySelectorAll("span, div, td, b, strong, p, a, label, h1, h2, h3, font");
      for (const el of candidates) {
        if (el.children.length > 6) continue;
        const text = (el.innerText || el.textContent || "").trim();
        if (!text) continue;

        // Name: "שם: עמית עטון" or "👤 שם: עמית עטון"
        if (!name && /(?:^|\s|👤)שם\s*:\s*([^🎂📞📱\n\r|<>]+)/i.test(text)) {
          const m = text.match(/(?:^|\s|👤)שם\s*:\s*([^🎂📞📱\n\r|<>]+)/i);
          if (m && m[1]) {
            const cleanName = m[1].replace(/^[^\w\u0590-\u05FF]+|[^\w\u0590-\u05FF]+$/g, "").trim();
            if (cleanName.length >= 2 && !cleanName.includes("טלפון") && !cleanName.includes("05") && !cleanName.includes("@")) {
              name = cleanName;
            }
          }
        }

        // Name from tab/breadcrumb: "עריכת רשומה 105613 - עמית עטון"
        if (!name && /עריכת רשומה\s*\d+\s*-\s*([^-\n\r<>]+)/i.test(text)) {
          const m = text.match(/עריכת רשומה\s*\d+\s*-\s*([^-\n\r<>]+)/i);
          if (m && m[1]) {
            const cleanName = m[1].trim();
            if (cleanName.length >= 2) name = cleanName;
          }
        }

        // Phone: "טלפון: 050-3672183" or "נייד: 0503672183"
        if (!phone && /(?:טלפון|נייד|סלולרי|פלאפון|סלולר|Phone|Mobile|Cell|📞|📱)\s*:\s*([0-9- ]{9,15})/i.test(text)) {
          const m = text.match(/(?:טלפון|נייד|סלולרי|פלאפון|סלולר|Phone|Mobile|Cell|📞|📱)\s*:\s*([0-9- ]{9,15})/i);
          if (m && m[1]) {
            const digits = m[1].replace(/\D/g, "");
            if (digits.length >= 9 && digits.length <= 12) {
              phone = digits;
            }
          }
        }

        // Email extraction
        if (!email && /(?:דוא"?ל|אימייל|דואר\s*אלקטרוני|Email|Mail|✉️|📧)\s*:\s*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i.test(text)) {
          const m = text.match(/(?:דוא"?ל|אימייל|דואר\s*אלקטרוני|Email|Mail|✉️|📧)\s*:\s*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i);
          if (m && m[1]) {
            email = m[1].trim();
          }
        } else if (!email) {
          const eMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
          if (eMatch) {
            email = eMatch[0].trim();
          }
        }
      }

      // Check for mailto: link
      if (!email) {
        const mailLinks = document.querySelectorAll('a[href^="mailto:"]');
        for (const a of mailLinks) {
          const href = a.getAttribute("href") || "";
          const cleanEmail = href.replace(/^mailto:/i, "").split("?")[0].trim();
          if (cleanEmail.includes("@")) {
            email = cleanEmail;
            break;
          }
        }
      }

      // Check input fields in Priza student form for email
      if (!email) {
        const emailInputs = document.querySelectorAll('input[type="email"], input[id*="email" i], input[id*="mail" i], input[name*="email" i]');
        for (const inp of emailInputs) {
          const val = (inp.value || "").trim();
          if (val.includes("@") && val.includes(".")) {
            email = val;
            break;
          }
        }
      }

      // Check for Priza tel: link
      if (!phone) {
        const telLinks = document.querySelectorAll('a[href^="tel:"]');
        for (const a of telLinks) {
          const href = a.getAttribute("href") || "";
          const digits = href.replace(/\D/g, "");
          if (digits.length >= 9 && digits.length <= 12) {
            phone = digits;
            break;
          }
        }
      }

      // Check input fields in Priza student form for phone
      if (!phone) {
        const phoneInputs = document.querySelectorAll('input[type="tel"], input[id*="phone" i], input[id*="cell" i], input[id*="mobile" i], input[name*="phone" i], input[name*="cell" i]');
        for (const inp of phoneInputs) {
          const val = (inp.value || "").trim();
          const digits = val.replace(/\D/g, "");
          if (digits.length >= 9 && digits.length <= 12) {
            phone = digits;
            break;
          }
        }
      }
    } catch (e) {}
  }

  if (phone || email) {
    if (phone && phone.startsWith("972") && phone.length === 12) {
      phone = "0" + phone.slice(3);
    }
    return {
      phone: phone || "",
      formattedPhone: phone ? formatIsraeliPhoneWithDash(phone) : "",
      name: name || "",
      email: email || ""
    };
  }

  return null;
}

// Persistent interactive alert modal when phone number has no WhatsApp account
function showPhoneNotFoundModal(phone, email = "", name = "") {
  const existing = document.getElementById("wa-phone-not-found-modal");
  if (existing) existing.remove();

  const formattedPhone = formatIsraeliPhoneWithDash(phone) || phone;
  const targetEmail = email || lastCopiedEmail || "";
  const targetName = name || lastCopiedName || "";

  const overlay = document.createElement("div");
  overlay.id = "wa-phone-not-found-modal";
  overlay.className = "wa-modal-overlay";
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000005;
    direction: rtl;
    font-family: var(--wa-assistant-font);
  `;

  overlay.innerHTML = `
    <div class="wa-modal-box" style="width: 380px; max-width: 95%; background: #1e293b; color: #f8fafc; border: 1px solid #ef4444; border-top: 5px solid #ef4444; border-radius: 12px; padding: 22px 20px; box-shadow: 0 20px 45px rgba(0,0,0,0.6); text-align: center;">
      <div style="font-size: 38px; margin-bottom: 8px; line-height: 1;">⚠️</div>
      <h3 style="margin: 0 0 6px 0; font-size: 16px; font-weight: 800; color: #f87171;">לא נמצא חשבון וואטסאפ</h3>
      
      <div style="font-size: 15px; font-weight: 800; color: #ffffff; background: #0f172a; padding: 8px 14px; border-radius: 6px; border: 1px solid #334155; margin: 10px auto 14px auto; display: inline-block; direction: ltr;">
        ${escapeHTML(formattedPhone)}
      </div>

      ${targetName ? `<p style="font-size: 13px; font-weight: 700; color: #93c5fd; margin: 0 0 8px 0;">👤 סטודנט: ${escapeHTML(targetName)}</p>` : ''}

      ${targetEmail ? `
        <div style="background: rgba(59, 130, 246, 0.15); border: 1px solid rgba(59, 130, 246, 0.35); border-radius: 8px; padding: 10px 12px; margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between; gap: 8px;">
          <span style="font-size: 12px; font-weight: 600; color: #93c5fd; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; direction: ltr;">📧 ${escapeHTML(targetEmail)}</span>
          <button id="wa-copy-email-btn" style="background: #2563eb; border: none; color: white; padding: 5px 10px; border-radius: 5px; font-size: 11px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 4px; font-family: inherit; white-space: nowrap;">
            📋 העתק מייל
          </button>
        </div>
      ` : ''}

      <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px;">
        <button id="wa-copy-crm-note-btn" style="background: rgba(255,255,255,0.06); border: 1px solid #475569; color: #e2e8f0; padding: 9px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; font-family: inherit;">
          📋 העתק דיווח ל-CRM: "אין וואטסאפ למספר ${escapeHTML(formattedPhone)}"
        </button>
      </div>

      <div style="display: flex; gap: 8px;">
        <button id="wa-phone-not-found-ok-btn" style="flex: 1; background: linear-gradient(135deg, #ef4444, #dc2626); border: none; color: white; font-size: 14px; font-weight: 700; padding: 10px 16px; border-radius: 8px; cursor: pointer; font-family: inherit; box-shadow: 0 4px 12px rgba(239,68,68,0.35);">
          אישור (OK)
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const close = () => {
    document.removeEventListener("keydown", onKeyDown);
    overlay.remove();
  };

  const onKeyDown = (e) => {
    if (e.key === "Escape" || e.key === "Enter") {
      e.preventDefault();
      close();
    }
  };
  document.addEventListener("keydown", onKeyDown);

  const okBtn = overlay.querySelector("#wa-phone-not-found-ok-btn");
  if (okBtn) okBtn.addEventListener("click", close);

  const copyEmailBtn = overlay.querySelector("#wa-copy-email-btn");
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener("click", () => {
      if (targetEmail) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(targetEmail);
        } else {
          fallbackCopyTextToClipboard(targetEmail);
        }
        copyEmailBtn.textContent = "✅ הועתק!";
        setTimeout(() => { copyEmailBtn.textContent = "📋 העתק מייל"; }, 2000);
        showNotificationToast(`כתובת הדוא"ל (${targetEmail}) הועתקה ללוח! 📋`);
      }
    });
  }

  const copyCrmBtn = overlay.querySelector("#wa-copy-crm-note-btn");
  if (copyCrmBtn) {
    copyCrmBtn.addEventListener("click", () => {
      const crmText = `אין וואטסאפ למספר ${formattedPhone}`;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(crmText);
      } else {
        fallbackCopyTextToClipboard(crmText);
      }
      copyCrmBtn.textContent = "✅ הדיווח הועתק ללוח!";
      setTimeout(() => { copyCrmBtn.textContent = `📋 העתק דיווח ל-CRM: "אין וואטסאפ למספר ${formattedPhone}"`; }, 2000);
      showNotificationToast(`הדיווח ל-CRM הועתק ללוח! 📋 הדבק בפריזה ב-Ctrl+V`);
    });
  }
}

// Smart Hebrew NLP/Regex Time Parser for Reminders
function detectHebrewTimeSuggestion(text) {
  if (!text) return null;
  const clean = text.trim();

  let minutes = 0;
  let label = "";

  if (/שלוש\s*רבעי\s*שעה/i.test(clean)) {
    minutes = 45;
    label = "שלוש רבעי שעה (45 דק')";
  } else if (/רבע\s*שעה/i.test(clean)) {
    minutes = 15;
    label = "רבע שעה (15 דק')";
  } else if (/חצי\s*שעה/i.test(clean)) {
    minutes = 30;
    label = "חצי שעה (30 דק')";
  } else if (/שעתיים/i.test(clean)) {
    minutes = 120;
    label = "שעתיים (120 דק')";
  } else if (/\bשעה\b/i.test(clean) && !/חצי|רבע|שלוש/i.test(clean)) {
    minutes = 60;
    label = "שעה (60 דק')";
  } else {
    // Number of minutes: e.g., "10 דקות", "בעוד 15 דק'", "20 דק"
    const minMatch = clean.match(/(?:בעוד|עוד)?\s*(\d+)\s*(?:דקות|דק'|דק)\b/i);
    if (minMatch) {
      minutes = parseInt(minMatch[1], 10);
      label = `${minutes} דקות`;
    } else {
      // Number of hours: e.g., "3 שעות", "בעוד 2 שעות"
      const hrMatch = clean.match(/(?:בעוד|עוד)?\s*(\d+)\s*(?:שעות|שעה)\b/i);
      if (hrMatch) {
        minutes = parseInt(hrMatch[1], 10) * 60;
        label = `${hrMatch[1]} שעות`;
      }
    }
  }

  if (minutes > 0) {
    return {
      targetTimeMs: Date.now() + minutes * 60 * 1000,
      label
    };
  }

  // Exact time pattern e.g., "ב-16:00", "בשעה 14:30", or standalone "14:00"
  const timeMatch = clean.match(/(?:ב-?|בשעה\s*)?(\d{1,2}):(\d{2})/i);
  if (timeMatch) {
    const hr = parseInt(timeMatch[1], 10);
    const mn = parseInt(timeMatch[2], 10);
    if (hr >= 0 && hr <= 23 && mn >= 0 && mn <= 59) {
      const d = new Date();
      d.setHours(hr, mn, 0, 0);
      if (d.getTime() <= Date.now()) {
        d.setDate(d.getDate() + 1); // Tomorrow if time passed
      }
      return {
        targetTimeMs: d.getTime(),
        label: `בשעה ${hr.toString().padStart(2, '0')}:${mn.toString().padStart(2, '0')}`
      };
    }
  }

  // Tomorrow check
  if (/מחר/i.test(clean)) {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(9, 0, 0, 0);
    return {
      targetTimeMs: d.getTime(),
      label: "מחר בבוקר (09:00)"
    };
  }

  return null;
}

// (Duplicate safeStorageSet removed)

// Comprehensive Details Extractor from text (Name, Phone & Time)
function extractReminderDetailsFromText(text) {
  if (!text) return null;
  const raw = String(text).trim();
  if (!raw) return null;

  let extractedName = "";
  let extractedPhone = "";
  let extractedTimeMs = null;
  let extractedTimeLabel = "";

  // 1. Extract Name (e.g., "שם: נעם AI 17 גיל: 0.1", "שם הלקוח: ישראל ישראלי" or tab-delimited "586209806 עדי גוגל כללי 17:00")
  const nameMatch = raw.match(/שם(?:\s*הלקוח)?\s*:\s*([^\n\r,:]+)/i);
  if (nameMatch) {
    let candidate = nameMatch[1].trim();
    // Clean trailing metadata tags like "גיל...", "גיל: 0.1", "טלפון...", "דוא"ל...", "רוצה..."
    candidate = candidate.replace(/\s+(?:גיל|טלפון|דוא"ל|נייד|מייל|קורס|מקור|רוצה|שעה)[\s:].*$/i, "").trim();
    candidate = candidate.replace(/\s+\bגיל\b.*$/i, "").trim();
    if (candidate) extractedName = candidate;
  } else {
    // Tab or space-delimited row parsing (e.g. "586209806\tעדי\tגוגל\tכללי\t17:00")
    const rawMatches = raw.match(/\b\d[\d-]{7,14}\b/g) || [];
    if (rawMatches.length > 0) {
      let cleaned = raw.replace(rawMatches[0], "").replace(/\t/g, " ").replace(/\s+/g, " ").trim();
      cleaned = cleaned.replace(/\b\d{1,2}:\d{2}(?::\d{2})?\b/g, "").trim();
      let words = cleaned.split(/\s+/).filter(w => w.length > 0);
      let nameWords = words.filter(w => !["פייס", "פייסבוק", "גוגל", "SEO", "לינקדאין", "אתר", "שיווק", "סייבר", "פיתוח", "בדיקות", "כללי", "טיקטוק", "אינסטגרם", "טאסק", "ליד"].includes(w));
      if (nameWords.length > 0) {
        extractedName = nameWords.slice(0, 2).join(" ");
      }
    }
  }

  // 2. Extract Phone (e.g., "טלפון: 054-4270554", "054-4270554", "0544270554")
  const phoneMatch = raw.match(/(?:טלפון|נייד|סלולרי)?\s*:\s*([\d-]{8,15})/i) || raw.match(/\b\d[\d-]{7,14}\b/);
  if (phoneMatch) {
    const rawPhone = phoneMatch[1] || phoneMatch[0];
    const cleanDigits = rawPhone.replace(/\D/g, "");
    if (cleanDigits.length >= 8 && cleanDigits.length <= 12) {
      extractedPhone = formatIsraeliPhoneTo972(cleanDigits);
    }
  }

  // 3. Extract Time (e.g., "רוצה לשוחח ב 18:00", "שעה 18:00", "בשעה 16:30", "18:00", "מחר", "בעוד 20 דק'")
  const timeSuggestion = detectHebrewTimeSuggestion(raw);
  if (timeSuggestion) {
    extractedTimeMs = timeSuggestion.targetTimeMs;
    extractedTimeLabel = timeSuggestion.label;
  }

  return {
    name: extractedName,
    phone: extractedPhone,
    timeMs: extractedTimeMs,
    timeLabel: extractedTimeLabel
  };
}

// Modal for adding a message reminder
function openAddReminderModal(container) {
  let messageSnippet = "";
  if (container) {
    const copyable = container.querySelector('.copyable-text');
    if (copyable) {
      messageSnippet = (copyable.innerText || copyable.textContent || "").trim();
    } else {
      const selText = container.querySelector('[class*="selectable-text"]');
      if (selText) {
        messageSnippet = (selText.innerText || selText.textContent || "").trim();
      } else {
        const textSpan = container.querySelector('.copyable-text span, span.selectable-text, span[dir="ltr"], span[dir="rtl"], div[dir="auto"]');
        if (textSpan) {
          messageSnippet = (textSpan.innerText || textSpan.textContent || "").trim();
        } else {
          messageSnippet = (container.innerText || container.textContent || "קובץ/מדיה").trim();
        }
      }
    }
  } else {
    // Check if user selected / highlighted text in Excel Online, SharePoint, Outlook, or page
    try {
      const selected = window.getSelection ? window.getSelection().toString().trim() : "";
      if (selected) {
        messageSnippet = selected;
      }
    } catch(e) {}
  }

  // Clean the snippet to remove trailing times, symbols, etc.
  messageSnippet = messageSnippet.replace(/\n?\d{1,2}:\d{2}\s*$/, "").trim();

  // Smart Details Extraction (Name, Phone & Follow-up Time from snippet)
  const parsedDetails = extractReminderDetailsFromText(messageSnippet);

  const onWhatsApp = window.location.hostname.includes("whatsapp.com");
  let chatId = onWhatsApp ? getActiveChatPhone() : "";
  let chatTitle = onWhatsApp ? getActiveChatTitle() : "";
  if (chatTitle === "לקוח") chatTitle = "";
  let clientPhone = "";

  if (!onWhatsApp) {
    const pageClient = extractClientFromPrizaOrSelection();
    if (pageClient) {
      if (pageClient.phone && !clientPhone) {
        clientPhone = formatIsraeliPhoneTo972(pageClient.phone);
        chatId = clientPhone;
      }
      if (pageClient.name && !chatTitle) {
        chatTitle = pageClient.name;
      }
    }
  }

  if (parsedDetails && parsedDetails.phone) {
    clientPhone = parsedDetails.phone;
    chatId = clientPhone;
  }

  if (parsedDetails && parsedDetails.name) {
    chatTitle = parsedDetails.name;
  } else {
    // Fallback: Smart extraction from tab/space-separated data line
    const rawMatches = messageSnippet.match(/\b\d[\d-]{7,14}\b/g) || [];
    const extractedPhones = rawMatches.map(m => m.replace(/\D/g, "")).filter(cleaned => cleaned.length >= 8 && cleaned.length <= 12);
    if (extractedPhones.length > 0) {
      let extractedPhone = extractedPhones[0];
      if (!clientPhone) {
        clientPhone = formatIsraeliPhoneTo972(extractedPhone);
        chatId = clientPhone;
      }
      let cleanedSnippet = messageSnippet.replace(rawMatches[0], "").replace(/\t/g, " ").replace(/\s+/g, " ").trim();
      cleanedSnippet = cleanedSnippet.replace(/\b\d{1,2}:\d{2}(?::\d{2})?\b/g, "").trim();
      let words = cleanedSnippet.split(/\s+/).filter(w => w.length > 0);
      let nameWords = words.filter(w => !["פייס", "גוגל", "SEO", "לינקדאין", "אתר", "שיווק", "סייבר", "פיתוח", "בדיקות", "כללי"].includes(w));
      let finalName = nameWords.slice(0, 3).join(" ") || words.slice(0, 3).join(" ");
      if (!chatTitle) chatTitle = finalName || `לקוח: ${extractedPhone}`;
    }
  }

  let msgId = "";
  if (container) {
    const msgElement = container.closest('[data-id]') || container.querySelector('[data-id]');
    if (msgElement) {
      msgId = msgElement.getAttribute("data-id") || "";
    }
  }

  // Detect intelligent time suggestion from Hebrew message text!
  const timeSuggestion = (parsedDetails && parsedDetails.timeMs) ? { targetTimeMs: parsedDetails.timeMs, label: parsedDetails.timeLabel } : detectHebrewTimeSuggestion(messageSnippet);
  const now = new Date();
  const nowISOTime = formatMsToDatetimeLocal(now.getTime());
  
  let suggestedISOTime = timeSuggestion ? formatMsToDatetimeLocal(timeSuggestion.targetTimeMs) : nowISOTime;
  let suggestionBannerHtml = "";

  if (timeSuggestion) {
    const sugDate = new Date(timeSuggestion.targetTimeMs);
    suggestionBannerHtml = `
      <div style="background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); color: #10b981; padding: 8px 12px; border-radius: 6px; font-size: 11px; font-weight: 700; margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between; direction: rtl;">
        <span>✨ חולץ אוטומטית: <strong>${escapeHTML(chatTitle || "לקוח")} (${formatIsraeliPhoneWithDash(clientPhone) || "ללא טלפון"}) | ${escapeHTML(timeSuggestion.label)}</strong></span>
        <span style="font-size: 10px; opacity: 0.85; background: rgba(0,0,0,0.2); padding: 2px 6px; border-radius: 4px;">תופעל ב-${sugDate.toLocaleTimeString("he-IL", { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
    `;
  }

  const existingModal = document.getElementById("wa-rem-add-modal");
  if (existingModal) existingModal.remove();

  const overlay = document.createElement("div");
  overlay.id = "wa-rem-add-modal";
  overlay.className = "wa-modal-overlay";
  overlay.style.direction = "rtl";
  overlay.style.zIndex = "1000008";

  overlay.innerHTML = `
    <div class="wa-modal-box" style="width: 360px; max-width: 95%;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <h3 style="margin: 0; font-size: 14px; color: var(--wa-assistant-text);">🔔 הוספת תזכורת חכמה</h3>
        <button type="button" id="wa-rem-add-close-x" style="background: transparent; border: none; color: var(--wa-assistant-text-muted); font-size: 22px; cursor: pointer; line-height: 1; padding: 0 4px; border-radius: 4px;" title="סגור">&times;</button>
      </div>
      
      ${suggestionBannerHtml}

      <div class="wa-modal-field-group" style="margin-bottom: 10px;">
        <label>שם הלקוח / כותרת התזכורת:</label>
        <input type="text" id="wa-rem-title" value="${escapeHTML(chatTitle)}" style="width: 100%; background: var(--wa-assistant-bg); border: 1px solid var(--wa-assistant-border); color: var(--wa-assistant-text); font-size: 12px; padding: 8px 12px; border-radius: 6px; outline: none; font-family: var(--wa-assistant-font); text-align: right;" placeholder="הקלד שם הלקוח...">
      </div>

      <div class="wa-modal-field-group" style="margin-bottom: 10px;">
        <label>טלפון ליצירת קשר / WhatsApp (חולץ אוטומטית):</label>
        <input type="text" id="wa-rem-phone" value="${escapeHTML(formatIsraeliPhoneWithDash(clientPhone))}" style="width: 100%; background: var(--wa-assistant-bg); border: 1px solid var(--wa-assistant-border); color: var(--wa-assistant-text); font-size: 12px; padding: 8px 12px; border-radius: 6px; outline: none; font-family: var(--wa-assistant-font); text-align: right;" placeholder="05X-XXXXXXX">
      </div>

      <div class="wa-modal-field-group" style="margin-bottom: 14px;">
        <label>נושא התזכורת / פרטי הפנייה:</label>
        <textarea id="wa-rem-note" rows="3" style="width: 100%; background: var(--wa-assistant-bg); border: 1px solid var(--wa-assistant-border); color: var(--wa-assistant-text); font-size: 12px; padding: 8px 12px; border-radius: 6px; outline: none; font-family: var(--wa-assistant-font); resize: vertical; text-align: right; white-space: pre-wrap;" placeholder="פרטי הפנייה / נושא התזכורת...">${escapeHTML(messageSnippet)}</textarea>
        <button type="button" id="wa-rem-auto-extract-btn" style="width: 100%; margin-top: 6px; background: rgba(59, 130, 246, 0.15); border: 1px solid rgba(59, 130, 246, 0.4); color: #60a5fa; padding: 6px 10px; border-radius: 6px; font-size: 11px; font-weight: 600; cursor: pointer; font-family: var(--wa-assistant-font); display: flex; align-items: center; justify-content: center; gap: 4px; outline: none;">
          ✨ חלץ שם, טלפון ושעה מתוכן ההודעה
        </button>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;">
        <button type="button" class="wa-quick-time-btn" data-ms="${15 * 60 * 1000}" style="background: var(--wa-assistant-bg); border: 1px solid var(--wa-assistant-border); color: var(--wa-assistant-text); padding: 8px; border-radius: 6px; font-size: 11px; cursor: pointer; font-family: var(--wa-assistant-font);">⏱️ בעוד 15 דק'</button>
        <button type="button" class="wa-quick-time-btn" data-ms="${60 * 60 * 1000}" style="background: var(--wa-assistant-bg); border: 1px solid var(--wa-assistant-border); color: var(--wa-assistant-text); padding: 8px; border-radius: 6px; font-size: 11px; cursor: pointer; font-family: var(--wa-assistant-font);">⏰ בעוד שעה</button>
        <button type="button" class="wa-quick-time-btn" id="wa-rem-tomorrow-btn" style="background: var(--wa-assistant-bg); border: 1px solid var(--wa-assistant-border); color: var(--wa-assistant-text); padding: 8px; border-radius: 6px; font-size: 11px; cursor: pointer; font-family: var(--wa-assistant-font);">📅 מחר בבוקר (09:00)</button>
        <button type="button" class="wa-quick-time-btn" id="wa-rem-evening-btn" style="background: var(--wa-assistant-bg); border: 1px solid var(--wa-assistant-border); color: var(--wa-assistant-text); padding: 8px; border-radius: 6px; font-size: 11px; cursor: pointer; font-family: var(--wa-assistant-font);">🌙 הערב (18:00)</button>
      </div>

      <div class="wa-modal-field-group">
        <label>או בחר מועד מדויק (אושר/כוון אוטומטית):</label>
        <input type="datetime-local" id="wa-rem-custom-time" value="${suggestedISOTime}" style="width: 100%; background: var(--wa-assistant-bg); border: 1px solid var(--wa-assistant-border); color: var(--wa-assistant-text); font-size: 12px; padding: 8px; border-radius: 6px; outline: none; font-family: var(--wa-assistant-font); position: relative;">
      </div>

      <div class="wa-modal-actions" style="margin-top: 16px;">
        <button type="button" class="wa-modal-btn wa-modal-btn-secondary" id="wa-rem-cancel-btn">ביטול</button>
        <button type="button" class="wa-modal-btn wa-modal-btn-primary" id="wa-rem-save-btn">שמור תזכורת</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const close = (e) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    document.removeEventListener("keydown", onKeyDownEsc);
    overlay.remove();
  };

  const onKeyDownEsc = (e) => {
    if (e.key === "Escape") close(e);
  };
  document.addEventListener("keydown", onKeyDownEsc);

  // Click on background backdrop to close
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close(e);
  });

  // Cancel and Close buttons
  const cancelBtn = overlay.querySelector("#wa-rem-cancel-btn");
  if (cancelBtn) {
    cancelBtn.addEventListener("click", close);
  }
  const closeXBtn = overlay.querySelector("#wa-rem-add-close-x");
  if (closeXBtn) {
    closeXBtn.addEventListener("click", close);
  }

  // Autofocus the note textarea (longer timeout to ensure WhatsApp Web focus grabbing is bypassed)
  const noteTextarea = overlay.querySelector("#wa-rem-note");
  const remTitleInput = overlay.querySelector("#wa-rem-title");
  const remPhoneInput = overlay.querySelector("#wa-rem-phone");
  const customTimeInput = overlay.querySelector("#wa-rem-custom-time");
  const extractBtn = overlay.querySelector("#wa-rem-auto-extract-btn");

  if (noteTextarea) {
    setTimeout(() => {
      noteTextarea.focus({ preventScroll: true });
    }, 250);
  }

  const runAutoExtraction = (showToast = true) => {
    if (!noteTextarea) return;
    const text = noteTextarea.value;
    const parsed = extractReminderDetailsFromText(text);
    if (parsed) {
      if (parsed.name && remTitleInput) {
        remTitleInput.value = parsed.name;
        chatTitle = parsed.name;
      }
      if (parsed.phone) {
        clientPhone = parsed.phone;
        chatId = parsed.phone;
        if (remPhoneInput) {
          remPhoneInput.value = formatIsraeliPhoneWithDash(parsed.phone);
        }
      }
      if (parsed.timeMs && customTimeInput) {
        customTimeInput.value = formatMsToDatetimeLocal(parsed.timeMs);
      }
      if (showToast && (parsed.name || parsed.phone || parsed.timeMs)) {
        const parts = [];
        if (parsed.name) parts.push(`שם: ${parsed.name}`);
        if (parsed.phone) parts.push(`נייד: ${formatIsraeliPhoneWithDash(parsed.phone)}`);
        if (parsed.timeLabel) parts.push(`שעה: ${parsed.timeLabel}`);
        showNotificationToast(`✨ חולצו נתונים: ${parts.join(" | ")}`);
      }
    }
  };

  if (extractBtn) {
    extractBtn.addEventListener("click", () => runAutoExtraction(true));
  }

  if (noteTextarea) {
    noteTextarea.addEventListener("input", () => runAutoExtraction(false));
    noteTextarea.addEventListener("paste", () => setTimeout(() => runAutoExtraction(true), 50));
  }

  // Set minimum custom date-time to now
  if (customTimeInput) {
    customTimeInput.min = nowISOTime;
    if (!customTimeInput.value) {
      customTimeInput.value = suggestedISOTime;
    }
  }

  const saveReminder = (targetTimeMs) => {
    let customTitle = document.getElementById("wa-rem-title") ? document.getElementById("wa-rem-title").value.trim() : "";
    if (!customTitle) {
      customTitle = chatTitle || "לקוח";
    }
    let inputPhone = document.getElementById("wa-rem-phone") ? document.getElementById("wa-rem-phone").value.trim() : "";
    if (inputPhone) {
      clientPhone = formatIsraeliPhoneTo972(inputPhone);
      chatId = clientPhone;
    }
    let customNote = document.getElementById("wa-rem-note") ? document.getElementById("wa-rem-note").value.trim() : "";
    if (!customNote) {
      customNote = messageSnippet; // fallback to clicked message if he typed nothing
    }
    const newRem = {
      id: "rem-" + Date.now(),
      chatId: chatId || clientPhone,
      chatTitle: customTitle,
      messageSnippet: customNote, // Save full text to preserve numbers and context
      time: targetTimeMs,
      msgId: msgId,
      clientPhone: clientPhone
    };
    reminders.push(newRem);
    safeStorageSet({ reminders }, () => {
      try {
        renderSidebarReminders();
      } catch (e) {
        console.error("Error rendering sidebar reminders:", e);
      }
      try {
        updateReminderIndicators();
      } catch (e) {
        console.error("Error updating reminder indicators:", e);
      }
      close();
      showNotificationToast(`התזכורת נשמרה עבור ${customTitle}! 🔔`);
    });
  };

  // Track if the picker was opened via clicking the calendar area (left 60px)
  if (customTimeInput) {
    customTimeInput.addEventListener("click", (e) => {
      const rect = customTimeInput.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      if (clickX <= 60) {
        customTimeInput.dataset.pickerOpened = "true";
      } else {
        customTimeInput.dataset.pickerOpened = "false";
      }
    });

    // Auto-save and close immediately ONLY if the date was selected via the calendar picker popup
    customTimeInput.addEventListener("change", () => {
      if (customTimeInput.dataset.pickerOpened === "true") {
        const val = customTimeInput.value;
        if (val) {
          const targetMs = parseDatetimeLocalToMs(val);
          if (!isNaN(targetMs) && targetMs > Date.now()) {
            console.log("Auto-saving committed custom reminder date from calendar picker:", val);
            saveReminder(targetMs);
          }
        }
        customTimeInput.dataset.pickerOpened = "false"; // reset
      }
    });
  }

  // Quick time buttons
  overlay.querySelectorAll(".wa-quick-time-btn[data-ms]").forEach(btn => {
    btn.addEventListener("click", () => {
      const ms = parseInt(btn.getAttribute("data-ms"), 10);
      saveReminder(Date.now() + ms);
    });
  });

  // Tomorrow 09:00
  document.getElementById("wa-rem-tomorrow-btn").addEventListener("click", () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);
    saveReminder(tomorrow.getTime());
  });

  // Evening 18:00
  document.getElementById("wa-rem-evening-btn").addEventListener("click", () => {
    const evening = new Date();
    evening.setHours(18, 0, 0, 0);
    if (evening.getTime() <= Date.now()) {
      evening.setDate(evening.getDate() + 1);
    }
    saveReminder(evening.getTime());
  });

  // Custom Time Save
  document.getElementById("wa-rem-save-btn").addEventListener("click", () => {
    const val = customTimeInput.value;
    if (!val) {
      alert("נא לבחור תאריך ושעה לתזכורת!");
      return;
    }
    const targetMs = new Date(val).getTime();
    if (targetMs <= Date.now()) {
      alert("נא לבחור מועד עתידי!");
      return;
    }
    saveReminder(targetMs);
  });
}

// Show a visual floating confirmation / alert toast message
function showNotificationToast(msg, isError = false) {
  const existing = document.getElementById("wa-assistant-toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.id = "wa-assistant-toast";
  toast.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: ${isError ? "#dc2626" : "#00a884"};
    color: white;
    font-size: 13px;
    font-weight: 700;
    padding: 13px 22px;
    border-radius: 9px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.4);
    z-index: 1000000;
    direction: rtl;
    font-family: var(--wa-assistant-font);
    opacity: 0;
    transition: opacity 0.3s ease, transform 0.3s ease;
    transform: translateY(10px);
    display: flex;
    align-items: center;
    gap: 8px;
    border: 1px solid ${isError ? "#ef4444" : "#059669"};
  `;
  toast.innerHTML = isError ? `<span>⚠️</span> <span>${escapeHTML(msg)}</span>` : `<span>${escapeHTML(msg)}</span>`;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";
  }, 10);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    setTimeout(() => toast.remove(), 300);
  }, isError ? 5000 : 3000);
}

// --- LEADS CRM TRACKER MODULE ---

// Sort leads based on Eran's priorities: active reminders -> yellow highlights -> SEO/Google sources -> newest
function sortLeads(leadsList) {
  return leadsList.sort((a, b) => {
    // 1. Leads with active callback time (reminders) first, sorted chronologically
    const aReminder = reminders.find(r => r.chatId === a.phone || r.chatTitle === a.name);
    const bReminder = reminders.find(r => r.chatId === b.phone || r.chatTitle === b.name);
    if (aReminder && bReminder) return aReminder.time - bReminder.time;
    if (aReminder) return -1;
    if (bReminder) return 1;
    
    // 2. Leads marked with "**" or "ממתינה" (need callback / wait) next
    const aHasYellow = a.day1 === "**" || a.day2 === "**" || a.day3 === "**" || a.day4 === "**" || a.status === "ממתינה";
    const bHasYellow = b.day1 === "**" || b.day2 === "**" || b.day3 === "**" || b.day4 === "**" || b.status === "ממתינה";
    if (aHasYellow && !bHasYellow) return -1;
    if (!aHasYellow && bHasYellow) return 1;
    
    // 3. Priority sources (SEO, גוגל, google) next
    const aPri = a.source && (a.source.toLowerCase().includes("seo") || a.source.includes("גוגל") || a.source.toLowerCase().includes("google"));
    const bPri = b.source && (b.source.toLowerCase().includes("seo") || b.source.includes("גוגל") || b.source.toLowerCase().includes("google"));
    if (aPri && !bPri) return -1;
    if (!aPri && bPri) return 1;
    
    // 4. Default: newest first
    return b.createdAt - a.createdAt;
  });
}

// Render Leads Tracker tab list
function renderSidebarLeads() {
  updateLeadsDashboard();
  const container = document.getElementById("wa-leads-list");
  if (!container) return;
  
  container.innerHTML = "";
  const searchVal = (document.getElementById("wa-leads-search-input")?.value || "").trim().toLowerCase();
  
  let filtered = leadsTracker.filter(l => {
    // Filter active vs archived
    const matchesArchive = activeLeadsFilter === "archived" ? l.archived : !l.archived;
    if (!matchesArchive) return false;
    
    // Filter search text
    if (searchVal) {
      const nameMatch = l.name.toLowerCase().includes(searchVal);
      const phoneMatch = l.phone.toLowerCase().includes(searchVal);
      return nameMatch || phoneMatch;
    }
    return true;
  });
  
  // Sort leads by smart priorities
  filtered = sortLeads(filtered);
  
  if (filtered.length === 0) {
    container.innerHTML = `<div style="font-size: 11px; color: var(--wa-assistant-text-muted); text-align: center; margin-top: 20px;">אין לידים להצגה</div>`;
    return;
  }
  
  filtered.forEach(lead => {
    // Check if there is a reminder scheduled for this client
    const reminder = reminders.find(r => r.chatId === lead.phone || r.chatTitle === lead.name);
    let reminderText = "";
    if (reminder) {
      const remDate = new Date(reminder.time);
      const timeStr = remDate.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" }) + " " + remDate.toLocaleDateString("he-IL", { day: "2-digit", month: "2-digit" });
      reminderText = `⏰ חזרה ב-${timeStr}`;
    }
    
    // Check if the card should be highlighted in yellow (if status is "ממתינה" or any day has "**")
    const isHighlighted = lead.status === "ממתינה" || lead.day1 === "**" || lead.day2 === "**" || lead.day3 === "**" || lead.day4 === "**";
    
    const card = document.createElement("div");
    card.className = `wa-lead-card ${isHighlighted ? "wa-lead-card-highlighted" : ""}`;
    
    // Construct Options list for status dropdown
    const leadStatuses = ["טאסק + ליד", "דוחות", "טאסק", "לרשום?", "ביטל הרשמה", "נרשם - מיון", "למחר ב", "בבוקר", "ממתינה", "ווצאפ", "גבייה", "מייל", "ה.מחיר", "ש.שימור", "פולואפ", "ה.שיחה?", 'בחו"ל'];
    let statusOptionsHTML = "";
    leadStatuses.forEach(st => {
      statusOptionsHTML += `<option value="${st}" ${lead.status === st ? "selected" : ""}>${st}</option>`;
    });
    // Add custom status if not in list
    if (lead.status && !leadStatuses.includes(lead.status)) {
      statusOptionsHTML += `<option value="${lead.status}" selected>${lead.status}</option>`;
    }
    
    // Day boxes values
    const d1 = lead.day1 || "";
    const d2 = lead.day2 || "";
    const d3 = lead.day3 || "";
    const d4 = lead.day4 || "";

    const getDayBoxClass = (val) => {
      if (!val) return "";
      if (val === "*") return "filled wa-attempt-1";
      if (val === "**") return "filled wa-attempt-2";
      if (val === "***") return "filled wa-attempt-3";
      if (val === "תפוס" || val === "לא ענה") return "filled wa-attempt-busy";
      if (val === "הודעה") return "filled wa-attempt-msg";
      return "filled wa-attempt-custom";
    };
    
    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px;">
        <div style="font-weight: 700; font-size: 12px; color: var(--wa-assistant-text);">${escapeHTML(lead.name)}</div>
        <div style="display: flex; gap: 4px; align-items: center;">
          <span style="font-size: 10px; padding: 2px 6px; border-radius: 4px; background: rgba(0, 168, 132, 0.1); color: var(--wa-assistant-primary); font-weight: 600;">${escapeHTML(lead.source)}</span>
          <span style="font-size: 10px; padding: 2px 6px; border-radius: 4px; background: rgba(255, 255, 255, 0.05); color: var(--wa-assistant-text-muted);">${escapeHTML(lead.course)}</span>
        </div>
      </div>
      
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <div style="font-size: 10px; color: var(--wa-assistant-text-muted); display: flex; align-items: center; gap: 6px;">
          <span>${escapeHTML(lead.phone)}</span>
          <button class="wa-lead-chat-btn" style="background: transparent; border: none; color: #10b981; font-size: 11px; cursor: pointer; padding: 0;" title="מעבר לצ'אט">💬</button>
          <button class="wa-lead-call-btn" style="background: transparent; border: none; color: #2563eb; font-size: 11px; cursor: pointer; padding: 0;" title="חיוג דרך Voicenter">📞</button>
        </div>
        ${reminderText ? `<div style="font-size: 10px; color: #eab308; font-weight: 700;">${reminderText}</div>` : ""}
      </div>

      <!-- 4 Days attempts tracker row -->
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-bottom: 8px;">
        <div class="wa-lead-day-box ${getDayBoxClass(d1)}" data-day="1">${d1 || "יום 1"}</div>
        <div class="wa-lead-day-box ${getDayBoxClass(d2)}" data-day="2">${d2 || "יום 2"}</div>
        <div class="wa-lead-day-box ${getDayBoxClass(d3)}" data-day="3">${d3 || "יום 3"}</div>
        <div class="wa-lead-day-box ${getDayBoxClass(d4)}" data-day="4">${d4 || "יום 4"}</div>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed rgba(255,255,255,0.08); padding-top: 6px; margin-top: 6px;">
        <select class="wa-lead-status-select" style="background: var(--wa-assistant-bg); border: 1px solid var(--wa-assistant-border); color: var(--wa-assistant-text); font-size: 10px; padding: 2px 4px; border-radius: 4px; outline: none; font-family: var(--wa-assistant-font); width: 85px;">
          ${statusOptionsHTML}
          <option value="custom_status_prompt">✍️ סטטוס חופשי...</option>
        </select>
        
        <button class="wa-lead-quick-follow-btn" style="background: rgba(0, 168, 132, 0.1); border: 1px solid rgba(0, 168, 132, 0.3); color: var(--wa-assistant-primary); font-size: 10px; cursor: pointer; padding: 2px 6px; border-radius: 4px; font-family: var(--wa-assistant-font); display: flex; align-items: center; gap: 2px; font-weight: 600;">⚡ פולואפ</button>
        
        <div style="display: flex; gap: 8px; align-items: center;">
          ${lead.archived ? `
            <button class="wa-lead-restore-btn" style="background: transparent; border: none; color: var(--wa-assistant-primary); font-size: 10px; cursor: pointer; font-family: var(--wa-assistant-font);">החזר</button>
          ` : `
            <button class="wa-lead-archive-btn" style="background: transparent; border: none; color: #10b981; font-size: 10px; cursor: pointer; font-family: var(--wa-assistant-font);">סיום ✅</button>
          `}
          <button class="wa-lead-del-btn" style="background: transparent; border: none; color: #ef4444; font-size: 10px; cursor: pointer; font-family: var(--wa-assistant-font);">🗑️</button>
        </div>
      </div>
    `;
    
    // Bind Lead card elements listeners
    // Navigate chat
    card.querySelector(".wa-lead-chat-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      navigateToChat(lead.phone);
    });

    // Voicenter Click2Call Call
    card.querySelector(".wa-lead-call-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      triggerVoicenterCall(lead.phone);
    });
    
    // Quick follow-up button click
    const followBtn = card.querySelector(".wa-lead-quick-follow-btn");
    if (followBtn) {
      followBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        openQuickFollowMenu(lead, followBtn);
      });
    }
    
    // Day boxes clicks (to set attempts)
    card.querySelectorAll(".wa-lead-day-box").forEach(box => {
      box.addEventListener("click", () => {
        const dayNum = box.getAttribute("data-day");
        openLeadDayMenu(lead.id, dayNum, box);
      });
    });
    
    // Status select change
    const statusSelect = card.querySelector(".wa-lead-status-select");
    statusSelect.addEventListener("change", () => {
      const selectedVal = statusSelect.value;
      if (selectedVal === "custom_status_prompt") {
        const customSt = prompt("הקלד סטטוס חופשי עבור הלקוח:");
        if (customSt && customSt.trim()) {
          updateLeadStatus(lead.id, customSt.trim());
        } else {
          statusSelect.value = lead.status || "";
        }
      } else {
        updateLeadStatus(lead.id, selectedVal);
      }
    });

    // Archive button
    const archiveBtn = card.querySelector(".wa-lead-archive-btn");
    if (archiveBtn) {
      archiveBtn.addEventListener("click", () => {
        updateLeadArchive(lead.id, true);
      });
    }

    // Restore button
    const restoreBtn = card.querySelector(".wa-lead-restore-btn");
    if (restoreBtn) {
      restoreBtn.addEventListener("click", () => {
        updateLeadArchive(lead.id, false);
      });
    }

    // Delete button
    card.querySelector(".wa-lead-del-btn").addEventListener("click", () => {
      if (confirm(`האם למחוק את הלקוח ${lead.name} מרשימת המעקב?`)) {
        deleteLead(lead.id);
      }
    });
    
    container.appendChild(card);
  });
}

// Open day choice popover
function openLeadDayMenu(leadId, dayNum, element) {
  const existing = document.getElementById("wa-lead-day-modal");
  if (existing) existing.remove();

  const rect = element.getBoundingClientRect();
  
  const modal = document.createElement("div");
  modal.id = "wa-lead-day-modal";
  modal.style.cssText = `
    position: fixed;
    top: ${rect.bottom + window.scrollY + 6}px;
    left: ${Math.max(10, rect.left + window.scrollX - 40)}px;
    background: var(--wa-assistant-card-bg);
    border: 1px solid var(--wa-assistant-border);
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.5);
    z-index: 100005;
    padding: 8px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;
    width: 180px;
    direction: rtl;
  `;

  const values = ["*", "**", "***", "תפוס", "לא ענה", "הודעה", "נקה"];
  values.forEach(val => {
    const btn = document.createElement("button");
    btn.textContent = val;
    btn.style.cssText = `
      background: var(--wa-assistant-bg);
      border: 1px solid var(--wa-assistant-border);
      color: var(--wa-assistant-text);
      padding: 4px;
      font-size: 10px;
      border-radius: 4px;
      cursor: pointer;
      font-family: var(--wa-assistant-font);
      outline: none;
    `;
    btn.addEventListener("click", () => {
      const finalVal = val === "נקה" ? "" : val;
      updateLeadDayValue(leadId, dayNum, finalVal);
      modal.remove();
    });
    modal.appendChild(btn);
  });

  // Add custom text input option
  const customBtn = document.createElement("button");
  customBtn.textContent = "חופשי...";
  customBtn.style.cssText = `
    grid-column: span 3;
    background: var(--wa-assistant-primary);
    border: none;
    color: white;
    padding: 4px;
    font-size: 10px;
    border-radius: 4px;
    cursor: pointer;
    font-family: var(--wa-assistant-font);
    outline: none;
  `;
  customBtn.addEventListener("click", () => {
    const inputVal = prompt("הקלד תיעוד חופשי ליום זה (למשל 16:00):");
    if (inputVal !== null) {
      updateLeadDayValue(leadId, dayNum, inputVal.trim());
    }
    modal.remove();
  });
  modal.appendChild(customBtn);

  document.body.appendChild(modal);

  // Close popover on click outside
  const closePopover = (e) => {
    if (!modal.contains(e.target) && e.target !== element) {
      modal.remove();
      document.removeEventListener("click", closePopover);
    }
  };
  setTimeout(() => document.addEventListener("click", closePopover), 10);
}

// Render and update the daily leads dashboard statistics
function updateLeadsDashboard() {
  const dashboard = document.getElementById("wa-leads-dashboard");
  if (!dashboard) return;
  
  const activeCount = leadsTracker.filter(l => !l.archived).length;
  const yellowCount = leadsTracker.filter(l => !l.archived && (l.status === "ממתינה" || l.day1 === "**" || l.day2 === "**" || l.day3 === "**" || l.day4 === "**")).length;
  const todayStr = new Date().toLocaleDateString("he-IL");
  const pendingToday = leadsTracker.filter(l => !l.archived && l.lastAttemptDate !== todayStr).length;
  
  dashboard.innerHTML = `
    <div style="text-align: center; flex: 1;">
      <strong style="font-size: 13px; color: var(--wa-assistant-text);">${activeCount}</strong>
      <span style="font-size: 9px; display: block; opacity: 0.8; margin-top: 2px;">פעילים</span>
    </div>
    <div style="text-align: center; flex: 1; border-right: 1px solid rgba(255,255,255,0.08); border-left: 1px solid rgba(255,255,255,0.08);">
      <strong style="font-size: 13px; color: #eab308;">${yellowCount}</strong>
      <span style="font-size: 9px; display: block; opacity: 0.8; color: var(--wa-assistant-text-muted); margin-top: 2px;">ממתינה / 🌟</span>
    </div>
    <div style="text-align: center; flex: 1;">
      <strong style="font-size: 13px; color: var(--wa-assistant-primary);">${pendingToday}</strong>
      <span style="font-size: 9px; display: block; opacity: 0.8; color: var(--wa-assistant-text-muted); margin-top: 2px;">נותרו להיום</span>
    </div>
  `;
}

// Open quick follow-up template options popover
function openQuickFollowMenu(lead, element) {
  const existing = document.getElementById("wa-lead-follow-modal");
  if (existing) existing.remove();
  
  const rect = element.getBoundingClientRect();
  const modal = document.createElement("div");
  modal.id = "wa-lead-follow-modal";
  modal.style.cssText = `
    position: fixed;
    top: ${rect.bottom + window.scrollY + 6}px;
    left: ${Math.max(10, rect.left + window.scrollX - 60)}px;
    background: var(--wa-assistant-card-bg);
    border: 1px solid var(--wa-assistant-border);
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.5);
    z-index: 100005;
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 160px;
    direction: rtl;
  `;
  
  const firstName = lead.name.split(" ")[0];
  const options = [
    {
      label: "📞 לא היה מענה",
      text: `היי ${firstName}, ניסיתי לתפוס אותך טלפונית ולא היה מענה. מתי נוח לך לשוחח? 😊`
    },
    {
      label: "📎 המשך שיחה (סילבוס)",
      text: `היי ${firstName}, יצא לך להציץ בסילבוס ובפרטים ששלחתי? אשמח לשמוע מה דעתך. 🎓`
    },
    {
      label: "💬 פולואפ כללי",
      text: `היי ${firstName}, אשמח לעזור לך לגבי הלימודים ב-HackerU. מתי הכי נוח לדבר היום?`
    }
  ];
  
  options.forEach(opt => {
    const btn = document.createElement("button");
    btn.textContent = opt.label;
    btn.style.cssText = `
      background: var(--wa-assistant-bg);
      border: 1px solid var(--wa-assistant-border);
      color: var(--wa-assistant-text);
      padding: 6px 8px;
      font-size: 11px;
      border-radius: 4px;
      cursor: pointer;
      font-family: var(--wa-assistant-font);
      text-align: right;
      outline: none;
      transition: background-color 0.2s;
    `;
    btn.addEventListener("mouseenter", () => {
      btn.style.backgroundColor = "var(--wa-assistant-border)";
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.backgroundColor = "var(--wa-assistant-bg)";
    });
    btn.addEventListener("click", () => {
      navigateToChat(lead.phone);
      setTimeout(() => {
        const editor = getWhatsAppEditor();
        if (editor) {
          injectTextIntoEditor(editor, opt.text);
        }
      }, 300);
      modal.remove();
    });
    modal.appendChild(btn);
  });
  
  document.body.appendChild(modal);
  
  const closePopover = (e) => {
    if (!modal.contains(e.target) && e.target !== element) {
      modal.remove();
      document.removeEventListener("click", closePopover);
    }
  };
  setTimeout(() => document.addEventListener("click", closePopover), 10);
}

// Automatically log attempt when an outgoing message is sent to a tracked lead
function handleOutgoingMessageSent() {
  const phone = getActiveChatPhone();
  const title = getActiveChatTitle();
  if (!phone && !title) return;
  
  // Find lead by phone or name
  const lead = leadsTracker.find(l => {
    if (phone && l.phone) {
      const cleanL = l.phone.replace(/\D/g, "");
      const cleanP = phone.replace(/\D/g, "");
      if (cleanL === cleanP) return true;
    }
    return l.name === title;
  });
  
  if (lead && !lead.archived) {
    const todayStr = new Date().toLocaleDateString("he-IL");
    if (lead.lastAttemptDate === todayStr) {
      return; // Already logged an attempt today
    }
    
    // Find first empty day
    let targetDay = null;
    if (!lead.day1) targetDay = 1;
    else if (!lead.day2) targetDay = 2;
    else if (!lead.day3) targetDay = 3;
    else if (!lead.day4) targetDay = 4;
    
    if (targetDay) {
      lead[`day${targetDay}`] = "הודעה";
      lead.lastAttemptDate = todayStr;
      
      // Save leads and render
      safeStorageSet({ leadsTracker }, () => {
        renderSidebarLeads();
        showLocalToast(`סומן אוטומטית: יום ${targetDay} (הודעה) עבור ${lead.name} ⚡`);
      });
    }
  }
}

// Show a temporary helper toast on the screen
function showLocalToast(message, isError = false) {
  let toast = document.getElementById("wa-assistant-local-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "wa-assistant-local-toast";
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      background-color: rgba(15, 23, 42, 0.95);
      color: #ffffff;
      padding: 12px 18px;
      border-radius: 8px;
      box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3);
      z-index: 100010;
      font-family: var(--wa-assistant-font);
      font-size: 12px;
      font-weight: 600;
      transition: all 0.3s ease;
      direction: rtl;
      border-left: 4px solid #10b981;
    `;
    document.body.appendChild(toast);
  }
  
  toast.style.borderLeftColor = isError ? "#ef4444" : "#10b981";
  toast.textContent = message;
  toast.style.opacity = "1";
  toast.style.transform = "translateY(0)";
  
  if (window.localToastTimeout) clearTimeout(window.localToastTimeout);
  window.localToastTimeout = setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
  }, 4000);
}

// Update lead day attempt value
function updateLeadDayValue(leadId, dayNum, value) {
  leadsTracker = leadsTracker.map(lead => {
    if (lead.id === leadId) {
      const updated = { ...lead };
      updated[`day${dayNum}`] = value;
      return updated;
    }
    return lead;
  });
  saveLeads();
}

// Update lead overall status
function updateLeadStatus(leadId, status) {
  leadsTracker = leadsTracker.map(lead => {
    if (lead.id === leadId) {
      return { ...lead, status };
    }
    return lead;
  });
  saveLeads();
}

// Archive/unarchive lead
function updateLeadArchive(leadId, archived) {
  leadsTracker = leadsTracker.map(lead => {
    if (lead.id === leadId) {
      return { ...lead, archived };
    }
    return lead;
  });
  saveLeads();
}

// Delete lead from tracker
function deleteLead(leadId) {
  leadsTracker = leadsTracker.filter(lead => lead.id !== leadId);
  saveLeads();
}

// Save leads to local storage
function saveLeads() {
  safeStorageSet({ leadsTracker }, () => {
    renderSidebarLeads();
    updateReminderIndicators(); // Update glows dynamically
    broadcastCrossTabMessage("LEADS_UPDATED", { leadsTracker });
    pushStateToCloud();
  });
}

// Open modal to add a lead
function openAddLeadModal() {
  const activeName = getActiveChatTitle();
  const activePhone = getActiveChatPhone();
  
  const existing = document.getElementById("wa-leads-add-modal");
  if (existing) existing.remove();
  
  const overlay = document.createElement("div");
  overlay.id = "wa-leads-add-modal";
  overlay.className = "wa-modal-overlay";
  overlay.style.direction = "rtl";
  overlay.style.zIndex = "100004";
  
  // Prefill default lists
  const sources = ["פייס", "גוגל", "SEO", "לינקדאין", "אתר"];
  let sourceOptions = "";
  sources.forEach(src => sourceOptions += `<option value="${src}">${src}</option>`);
  
  const courses = ["ניהול AI", "שיווק", "SEO", "עיצוב", "כללי", "סייבר", "פיתוח", "בדיקות"];
  let courseOptions = "";
  courses.forEach(c => courseOptions += `<option value="${c}">${c}</option>`);
  
  overlay.innerHTML = `
    <div class="wa-modal-box" style="position: relative; width: 360px; max-width: 95%; max-height: 85vh; display: flex; flex-direction: column;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid var(--wa-assistant-border); padding-bottom: 8px;">
        <h3 style="margin: 0; font-size: 15px; font-weight: 700; color: var(--wa-assistant-text);">➕ הוספת לקוח למעקב</h3>
        <button type="button" id="wa-lead-close-x" style="background: transparent; border: none; color: var(--wa-assistant-text-muted); font-size: 24px; cursor: pointer; line-height: 1; padding: 0 6px; border-radius: 4px;" title="סגור (Esc)">&times;</button>
      </div>
      <form id="wa-leads-add-form" style="display: flex; flex-direction: column; flex-grow: 1; overflow-y: auto;">
        <div class="wa-modal-field-group">
          <label>שם הלקוח</label>
          <input type="text" id="wa-lead-add-name" value="${escapeHTML(activeName)}" required placeholder="הקלד שם הלקוח...">
        </div>
        <div class="wa-modal-field-group">
          <label>מספר טלפון / נייד</label>
          <input type="text" id="wa-lead-add-phone" value="${escapeHTML(activePhone)}" required placeholder="הקלד מספר טלפון...">
        </div>
        <div style="display: flex; gap: 12px; margin-bottom: 12px;">
          <div class="wa-modal-field-group" style="flex: 1; margin: 0;">
            <label>מקור הגעה</label>
            <select id="wa-lead-add-source" style="width: 100%; background: var(--wa-assistant-bg); border: 1px solid var(--wa-assistant-border); color: var(--wa-assistant-text); font-size: 13px; padding: 8px 12px; border-radius: 6px; outline: none; font-family: var(--wa-assistant-font);">
              ${sourceOptions}
              <option value="custom_source">✍️ מקור חופשי...</option>
            </select>
          </div>
          <div class="wa-modal-field-group" style="flex: 1; margin: 0;">
            <label>תחום עניין / קורס</label>
            <select id="wa-lead-add-course" style="width: 100%; background: var(--wa-assistant-bg); border: 1px solid var(--wa-assistant-border); color: var(--wa-assistant-text); font-size: 13px; padding: 8px 12px; border-radius: 6px; outline: none; font-family: var(--wa-assistant-font);">
              ${courseOptions}
              <option value="custom_course">✍️ קורס חופשי...</option>
            </select>
          </div>
        </div>
        <div class="wa-modal-actions" style="margin-top: auto; padding-top: 10px; border-top: 1px solid var(--wa-assistant-border);">
          <button type="button" class="wa-modal-btn wa-modal-btn-secondary" id="wa-lead-add-cancel">ביטול (Esc)</button>
          <button type="submit" class="wa-modal-btn wa-modal-btn-primary">הוסף למעקב</button>
        </div>
      </form>
    </div>
  `;
  
  document.body.appendChild(overlay);
  
  // Close handler
  const close = () => {
    document.removeEventListener("keydown", onKeyDownEsc);
    overlay.remove();
  };

  const onKeyDownEsc = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      close();
    }
  };
  document.addEventListener("keydown", onKeyDownEsc);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });

  const closeXBtn = overlay.querySelector("#wa-lead-close-x");
  if (closeXBtn) closeXBtn.addEventListener("click", close);

  const cancelBtn = overlay.querySelector("#wa-lead-add-cancel");
  if (cancelBtn) cancelBtn.addEventListener("click", close);
  
  // Form submit handler
  document.getElementById("wa-leads-add-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("wa-lead-add-name").value.trim();
    let phone = document.getElementById("wa-lead-add-phone").value.trim().replace(/\D/g, "");
    
    // Auto format phone number
    if (phone.startsWith("0")) {
      phone = "972" + phone.slice(1);
    }
    
    let source = document.getElementById("wa-lead-add-source").value;
    if (source === "custom_source") {
      const customSrc = prompt("הקלד מקור הגעה חופשי:");
      source = customSrc && customSrc.trim() ? customSrc.trim() : "אחר";
    }
    
    let course = document.getElementById("wa-lead-add-course").value;
    if (course === "custom_course") {
      const customCrse = prompt("הקלד שם קורס/תחום עניין:");
      course = customCrse && customCrse.trim() ? customCrse.trim() : "כללי";
    }
    
    const newLead = {
      id: "lead-" + Date.now(),
      name,
      phone,
      source,
      course,
      status: "טאסק + ליד", // default initial status
      day1: "",
      day2: "",
      day3: "",
      day4: "",
      createdAt: Date.now(),
      archived: false
    };
    
    leadsTracker.push(newLead);
    saveLeads();
    close();
  });
}

// Export Leads CRM to clean CSV file compatible with Excel Hebrew
function exportLeadsToCSV() {
  if (!leadsTracker || leadsTracker.length === 0) {
    alert("אין לידים לייצוא.");
    return;
  }
  
  // Hebrew CSV support requires UTF-8 BOM byte order mark
  let csv = "\uFEFF";
  
  // Header row
  csv += "מספר טלפון,שם פרטי,מקור הגעה,תחום עניין,יום 1,יום 2,יום 3,יום 4,סטטוס כללי,תאריך יצירה,הסתיים מעקב\r\n";
  
  leadsTracker.forEach(lead => {
    const createdStr = new Date(lead.createdAt).toLocaleDateString("he-IL");
    const archivedStr = lead.archived ? "כן" : "לא";
    
    // Escape values with double quotes to prevent CSV injection / syntax breaking
    const line = [
      `"${(lead.phone || '').replace(/"/g, '""')}"`,
      `"${(lead.name || '').replace(/"/g, '""')}"`,
      `"${(lead.source || '').replace(/"/g, '""')}"`,
      `"${(lead.course || '').replace(/"/g, '""')}"`,
      `"${(lead.day1 || '').replace(/"/g, '""')}"`,
      `"${(lead.day2 || '').replace(/"/g, '""')}"`,
      `"${(lead.day3 || '').replace(/"/g, '""')}"`,
      `"${(lead.day4 || '').replace(/"/g, '""')}"`,
      `"${(lead.status || '').replace(/"/g, '""')}"`,
      `"${createdStr}"`,
      `"${archivedStr}"`
    ].join(",");
    
    csv += line + "\r\n";
  });
  
  // Download file natively
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `מעקב_לידים_${new Date().toLocaleDateString("he-IL").replace(/\//g, "-")}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ==========================================
// 💳 Payment Settlement & Tracking Module
// ==========================================

// Save payments to local storage
function savePayments() {
  safeStorageSet({ paymentsTracker }, () => {
    renderSidebarPayments();
    updateReminderIndicators();
    broadcastCrossTabMessage("PAYMENTS_UPDATED", { paymentsTracker });
    pushStateToCloud();
  });
}

// Open modal to add or edit a student payment settlement record
function openAddPaymentModal(editItem = null) {
  const activeName = getActiveChatTitle();
  const activePhone = getActiveChatPhone();
  
  const existing = document.getElementById("wa-payments-add-modal");
  if (existing) existing.remove();
  
  const overlay = document.createElement("div");
  overlay.id = "wa-payments-add-modal";
  overlay.className = "wa-modal-overlay";
  overlay.style.direction = "rtl";
  overlay.style.zIndex = "100004";

  const coursesList = [
    "מיישם AI בארגונים (AI Solutions Architect)",
    "ניהול AI למנהלים (AI Management)",
    "DevOps Engineer",
    "סייבר ואבטחת מידע (Cyber & Security)",
    "שיווק דיגיטלי (Digital Marketing Master)",
    "פיתוח Full Stack",
    "Data Analyst & BI",
    "עיצוב UI/UX & Product Design",
    "בדיקות תוכנה QA & Automation",
    "קידום אתרים SEO"
  ];

  let courseOptionsHtml = "";
  coursesList.forEach(c => {
    const isSelected = editItem && editItem.courseName === c;
    courseOptionsHtml += `<option value="${c}" ${isSelected ? "selected" : ""}>${c}</option>`;
  });
  courseOptionsHtml += `<option value="custom_course">✍️ קורס אחר / מותאם אישית...</option>`;

  const fundingMethods = [
    "פיקדון צבאי",
    "הוראת קבע (ERN)",
    "UPAY (כרטיס אשראי)",
    "פריסה נוחה עד 60 תשלומים",
    "העברה בנקאית",
    "מימון מעסיק / סבסוד",
    "תשלום אחד מזומן / צ'ק",
    "אחר"
  ];

  let fundingOptionsHtml = "";
  fundingMethods.forEach(m => {
    const isSelected = editItem && editItem.paymentMethod === m;
    fundingOptionsHtml += `<option value="${m}" ${isSelected ? "selected" : ""}>${m}</option>`;
  });

  const statuses = [
    { key: "pending_funding", label: "⏳ ממתין למימוש פיקדון צבאי" },
    { key: "pending_forms", label: "📝 ממתין לטפסי הו\"ק / ERN / UPAY" },
    { key: "deposit_only", label: "🟡 שולמה מקדמה בלבד (דמי הרשמה)" },
    { key: "delayed", label: "⚠️ חריג / עיכוב בהסדרה" },
    { key: "completed", label: "✅ הוסדר ושולם במלואו" }
  ];

  let statusOptionsHtml = "";
  statuses.forEach(s => {
    const isSelected = editItem && editItem.status === s.key;
    statusOptionsHtml += `<option value="${s.key}" ${isSelected ? "selected" : ""}>${s.label}</option>`;
  });

  const initialName = editItem ? editItem.studentName : (activeName || "");
  const initialPhone = editItem ? editItem.phone : (activePhone || "");
  const initialStartDate = editItem ? (editItem.courseStartDate || "") : "";
  const initialTotal = editItem ? editItem.totalAmount : "";
  const initialPaid = editItem ? editItem.paidAmount : "0";
  const initialNotes = editItem ? (editItem.notes || "") : "";

  overlay.innerHTML = `
    <div class="wa-modal-box" style="width: 440px; max-width: 95%;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; border-bottom: 1px solid var(--wa-assistant-border); padding-bottom: 8px;">
        <h3 style="margin: 0; font-size: 15px; font-weight: 700; color: #10b981; display: flex; align-items: center; gap: 6px;">
          💳 ${editItem ? "עריכת הסדר תשלום" : "הוספת סטודנט להסדר תשלום"}
        </h3>
        <button id="wa-pay-close-btn" style="background: none; border: none; font-size: 18px; color: var(--wa-assistant-text-muted); cursor: pointer;">&times;</button>
      </div>

      <form id="wa-payments-add-form" style="display: flex; flex-direction: column; gap: 10px;">
        <div style="display: flex; gap: 10px;">
          <div class="wa-modal-field-group" style="flex: 1.2; margin: 0;">
            <label style="font-size: 11px; font-weight: 600;">שם הסטודנט</label>
            <input type="text" id="wa-pay-student-name" value="${escapeHTML(initialName)}" required placeholder="שם מלא...">
          </div>
          <div class="wa-modal-field-group" style="flex: 1; margin: 0;">
            <label style="font-size: 11px; font-weight: 600;">טלפון / נייד</label>
            <input type="text" id="wa-pay-phone" value="${escapeHTML(initialPhone)}" required placeholder="050-1234567">
          </div>
        </div>

        <div class="wa-modal-field-group" style="margin: 0;">
          <label style="font-size: 11px; font-weight: 600;">קורס שנרשם אליו</label>
          <select id="wa-pay-course" style="width: 100%; background: var(--wa-assistant-bg); border: 1px solid var(--wa-assistant-border); color: var(--wa-assistant-text); font-size: 12px; padding: 7px 10px; border-radius: 6px; outline: none; font-family: var(--wa-assistant-font);">
            ${courseOptionsHtml}
          </select>
        </div>

        <div style="display: flex; gap: 10px;">
          <div class="wa-modal-field-group" style="flex: 1; margin: 0;">
            <label style="font-size: 11px; font-weight: 600;">📅 תאריך פתיחת הקורס</label>
            <input type="date" id="wa-pay-start-date" value="${initialStartDate}" style="width: 100%; background: var(--wa-assistant-bg); border: 1px solid var(--wa-assistant-border); color: var(--wa-assistant-text); font-size: 12px; padding: 6px 10px; border-radius: 6px; outline: none; font-family: var(--wa-assistant-font);">
          </div>
          <div class="wa-modal-field-group" style="flex: 1; margin: 0;">
            <label style="font-size: 11px; font-weight: 600;">שיטת מימון / הסדרה</label>
            <select id="wa-pay-method" style="width: 100%; background: var(--wa-assistant-bg); border: 1px solid var(--wa-assistant-border); color: var(--wa-assistant-text); font-size: 12px; padding: 7px 10px; border-radius: 6px; outline: none; font-family: var(--wa-assistant-font);">
              ${fundingOptionsHtml}
            </select>
          </div>
        </div>

        <div style="display: flex; gap: 10px; background: rgba(0,0,0,0.2); padding: 8px 10px; border-radius: 8px; border: 1px solid var(--wa-assistant-border);">
          <div class="wa-modal-field-group" style="flex: 1; margin: 0;">
            <label style="font-size: 11px; font-weight: 600; color: #94a3b8;">💰 מחיר כולל (₪)</label>
            <input type="number" id="wa-pay-total-amount" value="${initialTotal}" placeholder="למשל: 19840" style="width: 100%; background: var(--wa-assistant-bg); border: 1px solid var(--wa-assistant-border); color: var(--wa-assistant-text); font-size: 12px; padding: 6px 10px; border-radius: 6px; outline: none; font-weight: 700;">
          </div>
          <div class="wa-modal-field-group" style="flex: 1; margin: 0;">
            <label style="font-size: 11px; font-weight: 600; color: #94a3b8;">💵 שולם עד כה (₪)</label>
            <input type="number" id="wa-pay-paid-amount" value="${initialPaid}" placeholder="0" style="width: 100%; background: var(--wa-assistant-bg); border: 1px solid var(--wa-assistant-border); color: var(--wa-assistant-text); font-size: 12px; padding: 6px 10px; border-radius: 6px; outline: none; font-weight: 700;">
          </div>
          <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; border-right: 1px dashed var(--wa-assistant-border); padding-right: 6px;">
            <span style="font-size: 10px; color: var(--wa-assistant-text-muted);">יתרה לתשלום:</span>
            <span id="wa-pay-calc-balance" style="font-size: 14px; font-weight: 800; color: #34d399;">₪ 0</span>
          </div>
        </div>

        <div class="wa-modal-field-group" style="margin: 0;">
          <label style="font-size: 11px; font-weight: 600;">סטטוס הסדרה נוכחי</label>
          <select id="wa-pay-status" style="width: 100%; background: var(--wa-assistant-bg); border: 1px solid var(--wa-assistant-border); color: var(--wa-assistant-text); font-size: 12px; padding: 7px 10px; border-radius: 6px; outline: none; font-family: var(--wa-assistant-font);">
            ${statusOptionsHtml}
          </select>
        </div>

        <div class="wa-modal-field-group" style="margin: 0;">
          <label style="font-size: 11px; font-weight: 600;">הערות ודגשים לגבייה</label>
          <textarea id="wa-pay-notes" rows="2" placeholder="למשל: ביקש שנתקשר ביום ראשון אחרי שיבדוק עם הבנק..." style="width: 100%; background: var(--wa-assistant-bg); border: 1px solid var(--wa-assistant-border); color: var(--wa-assistant-text); font-size: 11px; padding: 6px 10px; border-radius: 6px; outline: none; font-family: var(--wa-assistant-font); resize: vertical;">${escapeHTML(initialNotes)}</textarea>
        </div>

        <div class="wa-modal-actions" style="margin-top: 10px; display: flex; gap: 8px; justify-content: flex-end;">
          <button type="button" class="wa-modal-btn wa-modal-btn-secondary" id="wa-pay-cancel-btn">ביטול</button>
          <button type="submit" class="wa-modal-btn wa-modal-btn-primary" style="background: linear-gradient(135deg, #10b981, #059669); border: none;">${editItem ? "שמור שינויים ✨" : "שמור סטודנט במעקב 💳"}</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(overlay);

  // Live balance calculation
  const totalInput = document.getElementById("wa-pay-total-amount");
  const paidInput = document.getElementById("wa-pay-paid-amount");
  const balanceSpan = document.getElementById("wa-pay-calc-balance");

  const updateBalanceDisplay = () => {
    const total = parseFloat(totalInput.value) || 0;
    const paid = parseFloat(paidInput.value) || 0;
    const remaining = Math.max(0, total - paid);
    balanceSpan.textContent = `₪ ${remaining.toLocaleString()}`;
    balanceSpan.style.color = remaining === 0 ? "#10b981" : "#f59e0b";
  };
  totalInput.addEventListener("input", updateBalanceDisplay);
  paidInput.addEventListener("input", updateBalanceDisplay);
  updateBalanceDisplay();

  // Close handlers
  const close = () => {
    document.removeEventListener("keydown", onKeyDownEsc);
    overlay.remove();
  };

  const onKeyDownEsc = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      close();
    }
  };
  document.addEventListener("keydown", onKeyDownEsc);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });

  document.getElementById("wa-pay-close-btn").addEventListener("click", close);
  document.getElementById("wa-pay-cancel-btn").addEventListener("click", close);

  // Form submit handler
  document.getElementById("wa-payments-add-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const studentName = document.getElementById("wa-pay-student-name").value.trim();
    let phone = document.getElementById("wa-pay-phone").value.trim().replace(/\D/g, "");
    if (phone.startsWith("0")) phone = "972" + phone.slice(1);

    let courseName = document.getElementById("wa-pay-course").value;
    if (courseName === "custom_course") {
      const customC = prompt("הקלד שם קורס:");
      courseName = customC && customC.trim() ? customC.trim() : "כללי";
    }

    const courseStartDate = document.getElementById("wa-pay-start-date").value;
    const paymentMethod = document.getElementById("wa-pay-method").value;
    const totalAmount = parseFloat(totalInput.value) || 0;
    const paidAmount = parseFloat(paidInput.value) || 0;
    const remainingAmount = Math.max(0, totalAmount - paidAmount);
    const status = document.getElementById("wa-pay-status").value;
    const notes = document.getElementById("wa-pay-notes").value.trim();

    if (editItem) {
      paymentsTracker = paymentsTracker.map(p => {
        if (p.id === editItem.id) {
          return {
            ...p,
            studentName,
            phone,
            courseName,
            courseStartDate,
            paymentMethod,
            totalAmount,
            paidAmount,
            remainingAmount,
            status,
            notes,
            completed: status === "completed",
            updatedAt: Date.now()
          };
        }
        return p;
      });
      showLocalToast(`הסדר התשלום עבור ${studentName} עודכן בהצלחה! ✨`);
    } else {
      const newPayment = {
        id: "pay-" + Date.now(),
        studentName,
        phone,
        courseName,
        courseStartDate,
        paymentMethod,
        totalAmount,
        paidAmount,
        remainingAmount,
        status,
        notes,
        completed: status === "completed",
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      paymentsTracker.push(newPayment);
      showLocalToast(`סטודנט ${studentName} נוסף למעקב הסדרי תשלום! 💳`);
    }

    savePayments();
    close();
  });
}

// Render the payments sidebar list with financial KPI dashboard
function renderSidebarPayments() {
  const container = document.getElementById("wa-payments-list");
  const dashboard = document.getElementById("wa-payments-dashboard");
  if (!container) return;

  // Filter calculations
  const searchInput = document.getElementById("wa-payments-search-input");
  const query = searchInput ? (searchInput.value || "").trim().toLowerCase() : "";

  let list = paymentsTracker || [];

  // Filter by Active/Completed sub-tabs
  if (activePaymentsFilter === "completed") {
    list = list.filter(p => p.completed || p.status === "completed");
  } else {
    list = list.filter(p => !p.completed && p.status !== "completed");
  }

  // Filter by search query
  if (query) {
    list = list.filter(p => {
      const name = (p.studentName || "").toLowerCase();
      const phone = (p.phone || "").toLowerCase();
      const course = (p.courseName || "").toLowerCase();
      const notes = (p.notes || "").toLowerCase();
      return name.includes(query) || phone.includes(query) || course.includes(query) || notes.includes(query);
    });
  }

  // Sort: students whose course starts soonest first!
  list.sort((a, b) => {
    if (!a.courseStartDate) return 1;
    if (!b.courseStartDate) return -1;
    return new Date(a.courseStartDate) - new Date(b.courseStartDate);
  });

  // Calculate Dashboard Summary KPIs
  if (dashboard) {
    const pendingItems = paymentsTracker.filter(p => !p.completed && p.status !== "completed");
    const completedItems = paymentsTracker.filter(p => p.completed || p.status === "completed");
    const totalRemainingSum = pendingItems.reduce((acc, p) => acc + (p.remainingAmount || 0), 0);

    dashboard.innerHTML = `
      <div style="text-align: center;">
        <div style="font-weight: 800; font-size: 13px; color: #f59e0b;">₪ ${totalRemainingSum.toLocaleString()}</div>
        <div style="font-size: 9px; color: var(--wa-assistant-text-muted);">סה"כ לגבייה</div>
      </div>
      <div style="text-align: center; border-right: 1px solid var(--wa-assistant-border); padding-right: 8px; border-left: 1px solid var(--wa-assistant-border); padding-left: 8px;">
        <div style="font-weight: 800; font-size: 13px; color: #38bdf8;">${pendingItems.length}</div>
        <div style="font-size: 9px; color: var(--wa-assistant-text-muted);">ממתינים</div>
      </div>
      <div style="text-align: center;">
        <div style="font-weight: 800; font-size: 13px; color: #10b981;">${completedItems.length}</div>
        <div style="font-size: 9px; color: var(--wa-assistant-text-muted);">הוסדרו ✅</div>
      </div>
    `;
  }

  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 24px 12px; color: var(--wa-assistant-text-muted); font-size: 12px;">
        ${query ? "לא נמצאו סטודנטים התואמים לחיפוש." : (activePaymentsFilter === "completed" ? "אין עדיין סטודנטים בארכיון שהוסדרו." : "אין סטודנטים ממתינים להסדר תשלום. לחץ על '➕ הוסף סטודנט' למעלה!")}
      </div>
    `;
    return;
  }

  const statusLabels = {
    pending_funding: { text: "⏳ ממתין לפיקדון", color: "#f59e0b", bg: "rgba(245,158,11,0.15)" },
    pending_forms: { text: "📝 ממתין לטפסים / הו\"ק", color: "#38bdf8", bg: "rgba(56,189,248,0.15)" },
    deposit_only: { text: "🟡 שולמה מקדמה", color: "#eab308", bg: "rgba(234,179,8,0.15)" },
    delayed: { text: "⚠️ חריג / עיכוב", color: "#ef4444", bg: "rgba(239,68,68,0.15)" },
    completed: { text: "✅ הוסדר במלואו", color: "#10b981", bg: "rgba(16,185,129,0.15)" }
  };

  list.forEach(item => {
    const card = document.createElement("div");
    card.className = "wa-payment-card";
    card.id = `wa-payment-card-${item.id}`;
    card.style.cssText = `
      background: var(--wa-assistant-card-bg);
      border: 1px solid var(--wa-assistant-border);
      border-radius: 10px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      transition: all 0.2s ease;
      box-shadow: 0 2px 5px rgba(0,0,0,0.15);
      direction: rtl;
    `;

    // Calculate days remaining to course opening
    let countdownBadgeHtml = "";
    if (item.courseStartDate) {
      const now = new Date();
      now.setHours(0,0,0,0);
      const start = new Date(item.courseStartDate);
      start.setHours(0,0,0,0);
      const diffDays = Math.ceil((start - now) / (1000 * 60 * 60 * 24));

      if (diffDays > 0) {
        const isUrgent = diffDays <= 7;
        const color = isUrgent ? "#ef4444" : "#f59e0b";
        const bg = isUrgent ? "rgba(239,68,68,0.15)" : "rgba(245,158,11,0.15)";
        countdownBadgeHtml = `<span style="font-size: 10px; font-weight: 700; color: ${color}; background: ${bg}; padding: 2px 6px; border-radius: 4px;">📅 פתיחה: ${new Date(item.courseStartDate).toLocaleDateString("he-IL")} (עוד ${diffDays} ימים!)</span>`;
      } else if (diffDays === 0) {
        countdownBadgeHtml = `<span style="font-size: 10px; font-weight: 700; color: #ef4444; background: rgba(239,68,68,0.2); padding: 2px 6px; border-radius: 4px;">⚠️ פתיחת הקורס היום!</span>`;
      } else {
        countdownBadgeHtml = `<span style="font-size: 10px; font-weight: 600; color: var(--wa-assistant-text-muted); background: rgba(255,255,255,0.05); padding: 2px 6px; border-radius: 4px;">הקורס נפתח ב-${new Date(item.courseStartDate).toLocaleDateString("he-IL")}</span>`;
      }
    }

    const stInfo = statusLabels[item.status] || { text: item.status || "בטיפול", color: "#38bdf8", bg: "rgba(56,189,248,0.15)" };
    const formattedPhone = formatIsraeliPhoneWithDash(item.phone || "");

    // Progress percentage
    const total = item.totalAmount || 0;
    const paid = item.paidAmount || 0;
    const remaining = item.remainingAmount !== undefined ? item.remainingAmount : Math.max(0, total - paid);
    const percent = total > 0 ? Math.min(100, Math.round((paid / total) * 100)) : (item.completed ? 100 : 0);

    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <div style="font-weight: 700; font-size: 13px; color: var(--wa-assistant-text); display: flex; align-items: center; gap: 6px;">
            <span>${escapeHTML(item.studentName)}</span>
            <span style="font-size: 11px; color: var(--wa-assistant-text-muted); font-weight: normal;">(${formattedPhone})</span>
          </div>
          <div style="font-size: 11px; color: #a5b4fc; font-weight: 600; margin-top: 2px;">🎓 ${escapeHTML(item.courseName || 'כללי')}</div>
        </div>
        <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 4px;">
          <span style="font-size: 10px; font-weight: 700; color: ${stInfo.color}; background: ${stInfo.bg}; padding: 2px 8px; border-radius: 6px;">${stInfo.text}</span>
          ${item.paymentMethod ? `<span style="font-size: 9px; color: var(--wa-assistant-text-muted); background: rgba(255,255,255,0.04); padding: 1px 5px; border-radius: 4px;">🏷️ ${escapeHTML(item.paymentMethod)}</span>` : ""}
        </div>
      </div>

      ${countdownBadgeHtml ? `<div style="margin-top: 2px;">${countdownBadgeHtml}</div>` : ""}

      <!-- Financial Progress Bar -->
      <div style="background: rgba(0,0,0,0.25); padding: 8px 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); margin-top: 2px;">
        <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: 600; margin-bottom: 4px;">
          <span style="color: var(--wa-assistant-text-muted);">שולם: ₪${paid.toLocaleString()} מתוך ₪${total.toLocaleString()}</span>
          <span style="color: ${remaining === 0 ? '#10b981' : '#f59e0b'}; font-weight: 800;">יתרה: ₪${remaining.toLocaleString()}</span>
        </div>
        <div style="width: 100%; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden;">
          <div style="width: ${percent}%; height: 100%; background: ${remaining === 0 ? '#10b981' : 'linear-gradient(90deg, #38bdf8, #10b981)'}; border-radius: 3px; transition: width 0.3s ease;"></div>
        </div>
      </div>

      ${item.notes ? `
        <div style="font-size: 10px; color: #cbd5e1; background: rgba(255,255,255,0.02); padding: 6px 8px; border-radius: 6px; border-right: 3px solid #38bdf8;">
          📝 ${escapeHTML(item.notes)}
        </div>
      ` : ""}

      <!-- Quick Action Buttons -->
      <div style="display: flex; gap: 6px; align-items: center; margin-top: 4px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 8px;">
        <button class="wa-pay-action-chat-btn" title="פתח צ'אט ושלח הודעת הסדרה" style="background: #10b981; border: none; color: white; cursor: pointer; padding: 5px 10px; border-radius: 5px; font-size: 11px; font-weight: 600; display: flex; align-items: center; gap: 4px; font-family: var(--wa-assistant-font);">
          💬 ווטסאפ
        </button>
        <button class="wa-pay-action-call-btn" title="חייג דרך Voicenter" style="background: #2563eb; border: none; color: white; cursor: pointer; padding: 5px 8px; border-radius: 5px; font-size: 11px; font-weight: 600; display: flex; align-items: center; gap: 2px; font-family: var(--wa-assistant-font);">
          📞
        </button>
        <button class="wa-pay-action-rem-btn" title="קבע שיחת תזכורת להסדר תשלום" style="background: #f59e0b; border: none; color: white; cursor: pointer; padding: 5px 8px; border-radius: 5px; font-size: 11px; font-weight: 600; display: flex; align-items: center; gap: 2px; font-family: var(--wa-assistant-font);">
          🔔
        </button>
        <button class="wa-pay-action-edit-btn" title="ערוך פרטי הסדר תשלום" style="background: rgba(255,255,255,0.08); border: none; color: var(--wa-assistant-text); cursor: pointer; padding: 5px 8px; border-radius: 5px; font-size: 11px; font-weight: 600; display: flex; align-items: center; gap: 2px; font-family: var(--wa-assistant-font);">
          ✏️
        </button>
        <button class="wa-pay-action-toggle-complete-btn" title="${item.completed || item.status === 'completed' ? 'החזר לממתינים' : 'סמן כהוסדר במלואו'}" style="background: ${item.completed || item.status === 'completed' ? 'rgba(255,255,255,0.08)' : 'rgba(16,185,129,0.15)'}; border: 1px solid ${item.completed || item.status === 'completed' ? 'rgba(255,255,255,0.1)' : 'rgba(16,185,129,0.3)'}; color: ${item.completed || item.status === 'completed' ? 'var(--wa-assistant-text-muted)' : '#34d399'}; cursor: pointer; padding: 5px 8px; border-radius: 5px; font-size: 11px; font-weight: 700; margin-right: auto; font-family: var(--wa-assistant-font);">
          ${item.completed || item.status === 'completed' ? '↩️ החזר' : '✅ שולם'}
        </button>
        <button class="wa-pay-action-delete-btn" title="מחק סטודנט ממעקב תשלומים" style="background: none; border: none; color: #ef4444; cursor: pointer; padding: 4px; font-size: 12px;">
          🗑️
        </button>
      </div>
    `;

    // Bind card action buttons
    card.querySelector(".wa-pay-action-chat-btn").addEventListener("click", () => {
      if (item.phone) {
        navigateToChat(item.phone);
        // Prompt to inject payment reminder template
        setTimeout(() => {
          const editor = getWhatsAppEditor();
          if (editor) {
            const firstName = (item.studentName || "").split(" ")[0] || item.studentName;
            const remainingText = item.remainingAmount ? `על סך ₪${item.remainingAmount.toLocaleString()}` : "";
            const paymentMsg = `היי ${firstName}, כאן ערן מ-HackerU 👋\nשמח לראות אותך ברשימת הנרשמים לקורס ${item.courseName || ''}! 🎓\nרציתי לבדוק לגבי הסדרת יתרת התשלום ${remainingText} כדי שנוכל לשריין לך את המקום באופן סופי לקראת מועד הפתיחה.\nמתי נוח לך שנדבר קצרות כדי לסגור את הפרטים הטכניים? 😊`;
            injectTextIntoEditor(editor, paymentMsg);
          }
        }, 400);
      }
    });

    card.querySelector(".wa-pay-action-call-btn").addEventListener("click", () => {
      if (item.phone) triggerVoicenterCall(item.phone);
    });

    card.querySelector(".wa-pay-action-rem-btn").addEventListener("click", () => {
      openPaymentReminderModal(item);
    });

    card.querySelector(".wa-pay-action-edit-btn").addEventListener("click", () => {
      openAddPaymentModal(item);
    });

    card.querySelector(".wa-pay-action-toggle-complete-btn").addEventListener("click", () => {
      togglePaymentCompleted(item.id);
    });

    card.querySelector(".wa-pay-action-delete-btn").addEventListener("click", () => {
      if (confirm(`האם אתה בטוח שברצונך למחוק את מעקב התשלום עבור ${item.studentName}?`)) {
        deletePayment(item.id);
      }
    });

    container.appendChild(card);
  });
}

// Toggle payment record between completed and pending
function togglePaymentCompleted(paymentId) {
  paymentsTracker = paymentsTracker.map(p => {
    if (p.id === paymentId) {
      const isNowCompleted = !(p.completed || p.status === "completed");
      return {
        ...p,
        completed: isNowCompleted,
        status: isNowCompleted ? "completed" : "pending_funding",
        paidAmount: isNowCompleted ? (p.totalAmount || p.paidAmount) : p.paidAmount,
        remainingAmount: isNowCompleted ? 0 : Math.max(0, (p.totalAmount || 0) - (p.paidAmount || 0)),
        updatedAt: Date.now()
      };
    }
    return p;
  });
  savePayments();
}

// Delete payment from tracker
function deletePayment(paymentId) {
  paymentsTracker = paymentsTracker.filter(p => p.id !== paymentId);
  savePayments();
}

// Open special reminder modal with payment tag
function openPaymentReminderModal(paymentItem) {
  const existing = document.getElementById("wa-payment-rem-modal");
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.id = "wa-payment-rem-modal";
  overlay.className = "wa-modal-overlay";
  overlay.style.direction = "rtl";
  overlay.style.zIndex = "100005";

  const now = new Date();
  const defDate = now.toISOString().split("T")[0];
  const defTime = `${String(now.getHours() + 1).padStart(2, '0')}:00`;

  overlay.innerHTML = `
    <div class="wa-modal-box" style="position: relative; width: 360px; max-width: 95%; max-height: 85vh; display: flex; flex-direction: column;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid var(--wa-assistant-border); padding-bottom: 8px;">
        <h3 style="margin: 0; font-size: 15px; font-weight: 700; color: #10b981;">🔔 תזכורת להסדר תשלום</h3>
        <button type="button" id="wa-pay-rem-close-x" style="background: transparent; border: none; color: var(--wa-assistant-text-muted); font-size: 24px; cursor: pointer; line-height: 1; padding: 0 6px; border-radius: 4px;" title="סגור (Esc)">&times;</button>
      </div>
      <div style="font-size: 12px; color: var(--wa-assistant-text); margin-bottom: 10px; background: rgba(0,0,0,0.2); padding: 8px; border-radius: 6px;">
        <strong>סטודנט:</strong> ${escapeHTML(paymentItem.studentName)}<br>
        <strong>קורס:</strong> ${escapeHTML(paymentItem.courseName || '')}<br>
        <strong>יתרה לתשלום:</strong> ₪${(paymentItem.remainingAmount || 0).toLocaleString()}
      </div>
      <form id="wa-payment-rem-form" style="display: flex; flex-direction: column; flex-grow: 1; overflow-y: auto;">
        <div style="display: flex; gap: 8px; margin-bottom: 12px;">
          <div class="wa-modal-field-group" style="flex: 1.2; margin: 0;">
            <label>תאריך</label>
            <input type="date" id="wa-pay-rem-date" value="${defDate}" required>
          </div>
          <div class="wa-modal-field-group" style="flex: 1; margin: 0;">
            <label>שעה</label>
            <input type="time" id="wa-pay-rem-time" value="${defTime}" required>
          </div>
        </div>
        <div class="wa-modal-field-group" style="margin-bottom: 12px;">
          <label>הודעת תזכורת / דגשים לשיחה</label>
          <input type="text" id="wa-pay-rem-snippet" value="שיחת הסדר תשלום לקורס ${escapeHTML(paymentItem.courseName || '')} - יתרה: ₪${(paymentItem.remainingAmount || 0).toLocaleString()}" required>
        </div>
        <div class="wa-modal-actions" style="margin-top: auto; padding-top: 10px; border-top: 1px solid var(--wa-assistant-border);">
          <button type="button" class="wa-modal-btn wa-modal-btn-secondary" id="wa-pay-rem-cancel">ביטול (Esc)</button>
          <button type="submit" class="wa-modal-btn wa-modal-btn-primary" style="background: #10b981;">קבע תזכורת 🔔</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(overlay);

  const close = () => {
    document.removeEventListener("keydown", onKeyDownEsc);
    overlay.remove();
  };

  const onKeyDownEsc = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      close();
    }
  };
  document.addEventListener("keydown", onKeyDownEsc);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });

  const closeXBtn = overlay.querySelector("#wa-pay-rem-close-x");
  if (closeXBtn) closeXBtn.addEventListener("click", close);

  const cancelBtn = overlay.querySelector("#wa-pay-rem-cancel");
  if (cancelBtn) cancelBtn.addEventListener("click", close);

  document.getElementById("wa-payment-rem-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const dVal = document.getElementById("wa-pay-rem-date").value;
    const tVal = document.getElementById("wa-pay-rem-time").value;
    const snippet = document.getElementById("wa-pay-rem-snippet").value.trim();

    const remTime = new Date(`${dVal}T${tVal}`).getTime();
    if (isNaN(remTime)) {
      alert("נא להזין תאריך ושעה תקינים.");
      return;
    }

    const newReminder = {
      id: "rem-pay-" + Date.now(),
      chatId: paymentItem.phone,
      chatTitle: paymentItem.studentName,
      clientPhone: paymentItem.phone,
      time: remTime,
      messageSnippet: snippet,
      category: "payment",
      courseName: paymentItem.courseName,
      remainingAmount: paymentItem.remainingAmount,
      createdAt: Date.now()
    };

    reminders.push(newReminder);
    safeStorageSet({ reminders }, () => {
      renderSidebarReminders();
      updateReminderIndicators();
      showLocalToast(`נקבעה תזכורת שיחת תשלום עבור ${paymentItem.studentName} ב-${dVal} ${tVal} 🔔`);
    });

    close();
  });
}

// Export Payments Settlement Hub to clean CSV file compatible with Excel Hebrew
function exportPaymentsToCSV() {
  if (!paymentsTracker || paymentsTracker.length === 0) {
    alert("אין רשומות תשלומים לייצוא.");
    return;
  }
  
  // Hebrew CSV support requires UTF-8 BOM byte order mark
  let csv = "\uFEFF";
  
  // Header row
  csv += "שם הסטודנט,מספר טלפון,שם הקורס,מועד פתיחת הקורס,עלות כוללת,שולם עד כה,יתרה לתשלום,שיטת מימון,סטטוס,הערות,הוסדר במלואו,תאריך יצירה\r\n";
  
  paymentsTracker.forEach(item => {
    const createdStr = new Date(item.createdAt || Date.now()).toLocaleDateString("he-IL");
    const startStr = item.courseStartDate ? new Date(item.courseStartDate).toLocaleDateString("he-IL") : "";
    const isCompletedStr = item.completed || item.status === "completed" ? "כן" : "לא";
    
    const line = [
      `"${(item.studentName || '').replace(/"/g, '""')}"`,
      `"${(item.phone || '').replace(/"/g, '""')}"`,
      `"${(item.courseName || '').replace(/"/g, '""')}"`,
      `"${startStr}"`,
      `"${item.totalAmount || 0}"`,
      `"${item.paidAmount || 0}"`,
      `"${item.remainingAmount !== undefined ? item.remainingAmount : 0}"`,
      `"${(item.paymentMethod || '').replace(/"/g, '""')}"`,
      `"${(item.status || '').replace(/"/g, '""')}"`,
      `"${(item.notes || '').replace(/"/g, '""')}"`,
      `"${isCompletedStr}"`,
      `"${createdStr}"`
    ].join(",");
    
    csv += line + "\r\n";
  });
  
  // Download file natively
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `מעקב_הסדרי_תשלום_סטודנטים_${new Date().toLocaleDateString("he-IL").replace(/\//g, "-")}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Background reminder check interval loop (every 2 seconds)
// Periodically scans DOM to inject/remove glowing bell icons for contacts with active reminders (WhatsApp only)
function updateReminderIndicators() {
  if (checkAndMarkDead()) return;
  if (!window.location.hostname.includes("whatsapp.com")) return;
  try {
    if (!reminders || reminders.length === 0) {
      // Clean up all indicator elements if no active reminders exist
      document.querySelectorAll(".wa-header-glowing-bell, .wa-list-glowing-bell").forEach(el => el.remove());
      return;
    }

    const activeChatId = getActiveChatPhone();
    const activeChatTitle = getActiveChatTitle();
    const activeDigits = (activeChatId || activeChatTitle || "").replace(/\D/g, "");

    // 1. Active Chat Header Indicator
    const header = document.querySelector("#main header");
    if (header) {
      const hasActiveHeaderReminder = reminders.some(r => {
        if (!r || !r.time) return false;
        if (r.chatId && activeChatId && r.chatId === activeChatId) return true;
        if (r.chatTitle && activeChatTitle && r.chatTitle === activeChatTitle) return true;
        const rDigits = (r.chatId || r.chatTitle || "").replace(/\D/g, "");
        return activeDigits && rDigits && activeDigits.length >= 7 && rDigits.length >= 7 && (rDigits === activeDigits || activeDigits.includes(rDigits) || rDigits.includes(activeDigits));
      });

      const titleEl = header.querySelector('[dir="auto"], span[title]');
      const titleParent = titleEl ? titleEl.parentElement : null;
      
      if (titleParent) {
        let existingIndicator = titleParent.querySelector(".wa-header-glowing-bell");
        if (hasActiveHeaderReminder) {
          if (!existingIndicator) {
            existingIndicator = document.createElement("span");
            existingIndicator.className = "wa-header-glowing-bell";
            existingIndicator.innerHTML = "🔔";
            existingIndicator.title = "יש תזכורת פעילה ללקוח זה! לחץ לפתיחת לשונית תזכורות.";
            existingIndicator.style.cssText = `
              margin-right: 8px;
              margin-left: 8px;
              font-size: 16px;
              animation: wa-bell-glow 1.5s infinite alternate;
              cursor: pointer;
              display: inline-block;
            `;
            existingIndicator.addEventListener("click", (e) => {
              e.stopPropagation();
              if (!sidebarOpen) toggleSidebar();
              const tabBtn = document.getElementById("wa-tab-reminders-btn");
              if (tabBtn) tabBtn.click();
              
              const rem = reminders.find(r => r && (r.chatId === activeChatId || r.chatTitle === activeChatTitle));
              if (rem) {
                setTimeout(() => {
                  const card = document.getElementById(`wa-reminder-card-${rem.id}`);
                  if (card) {
                    card.scrollIntoView({ behavior: "smooth", block: "center" });
                    card.style.transition = "all 0.3s ease";
                    card.style.outline = "2px solid #ca8a04";
                    card.style.boxShadow = "0 0 15px rgba(234, 179, 8, 0.4)";
                    setTimeout(() => {
                      card.style.outline = "none";
                      card.style.boxShadow = "none";
                    }, 2000);
                  }
                }, 150);
              }
            });
            titleParent.appendChild(existingIndicator);
          }
        } else {
          titleParent.querySelectorAll(".wa-header-glowing-bell").forEach(el => el.remove());
        }
      }
    }

    // 2. Chat List (Left Pane) Indicator
    const chatCells = document.querySelectorAll('[data-testid="cell-frame-container"]');
    chatCells.forEach(cell => {
      let state = cellStateCache.get(cell);

      // If we don't have a state, or the previously cached nameEl is no longer connected to the DOM, re-query it
      if (!state || !state.nameEl || !state.nameEl.isConnected) {
        state = { nameEl: cell.querySelector('[dir="auto"], span[title]') };
        cellStateCache.set(cell, state);
      }

      const nameEl = state.nameEl;
      if (!nameEl) return;

      // We must re-read the text content on each tick because WhatsApp Web uses a
      // virtualized list and recycles these DOM nodes when scrolling.
      const rawCellText = (nameEl.title || nameEl.innerText || "").replace(/🔔/g, "").trim();
      const cellDigits = rawCellText.replace(/\D/g, "");
      
      const hasReminder = reminders.some(r => {
        if (!r || !r.time) return false;
        if (r.chatTitle && r.chatTitle === rawCellText) return true;
        if (r.chatId && r.chatId === rawCellText) return true;
        const rDigits = (r.chatId || r.chatTitle || "").replace(/\D/g, "");
        if (cellDigits && rDigits && cellDigits.length >= 7 && rDigits.length >= 7) {
          return cellDigits === rDigits || cellDigits.includes(rDigits) || rDigits.includes(cellDigits);
        }
        return false;
      });
      
      if (hasReminder) {
        // If React re-rendered and wiped our injected bell, we must re-inject it.
        // We verify that state.bellEl is still connected to the DOM.
        if (!state.hasBell || (state.bellEl && !state.bellEl.isConnected)) {
          const existingBells = cell.querySelectorAll(".wa-list-glowing-bell");
          if (existingBells.length === 0) {
            const cellBell = document.createElement("span");
            cellBell.className = "wa-list-glowing-bell";
            cellBell.innerHTML = "🔔";
            cellBell.title = "יש תזכורת פעילה! לחץ לצפייה מהירה.";
            cellBell.style.cssText = `
              margin-right: 6px;
              margin-left: 6px;
              font-size: 13px;
              animation: wa-bell-glow 1.5s infinite alternate;
              color: #eab308;
              display: inline-block;
              cursor: pointer;
            `;
            cellBell.addEventListener("click", (e) => {
              e.stopPropagation();
              if (!sidebarOpen) toggleSidebar();
              const tabBtn = document.getElementById("wa-tab-reminders-btn");
              if (tabBtn) tabBtn.click();

              const rem = reminders.find(r => r && (r.chatTitle === rawCellText || r.chatId === rawCellText || (cellDigits && r.chatId && r.chatId.includes(cellDigits))));
              if (rem) {
                setTimeout(() => {
                  const card = document.getElementById(`wa-reminder-card-${rem.id}`);
                  if (card) {
                    card.scrollIntoView({ behavior: "smooth", block: "center" });
                    card.style.transition = "all 0.3s ease";
                    card.style.outline = "2px solid #ca8a04";
                    card.style.boxShadow = "0 0 15px rgba(234, 179, 8, 0.4)";
                    setTimeout(() => {
                      card.style.outline = "none";
                      card.style.boxShadow = "none";
                    }, 2000);
                  }
                }, 150);
              }
            });
            const nameParent = nameEl.parentElement;
            if (nameParent) {
              nameParent.appendChild(cellBell);
              state.hasBell = true;
              state.bellEl = cellBell;
            }
          } else {
            state.hasBell = true;
            state.bellEl = existingBells[0];
          }
        }
      } else {
        if (state.hasBell || state.hasBell === undefined) {
          if (state.bellEl && state.bellEl.isConnected) {
            state.bellEl.remove();
          } else {
            const existingBells = cell.querySelectorAll(".wa-list-glowing-bell");
            existingBells.forEach(el => el.remove());
          }
          state.hasBell = false;
          state.bellEl = null;
        }
      }
    });
  } catch (err) {
    console.error("Critical error in updateReminderIndicators:", err);
  }
}
const cellStateCache = new WeakMap();
let lastStorageSyncCheck = 0;

// Background reminder check loop (Synchronized across all open tabs)
function checkTriggeredReminders() {
  if (checkAndMarkDead()) return;

  const now = Date.now();

  // Periodic direct storage verification (every 2.5s) to guarantee 100% cross-window sync
  if (now - lastStorageSyncCheck > 2500) {
    lastStorageSyncCheck = now;
    safeStorageGet(["reminders", "archivedReminders"], (res) => {
      if (res && res.reminders) {
        const localStr = JSON.stringify(reminders);
        const fetchedStr = JSON.stringify(res.reminders);
        if (localStr !== fetchedStr) {
          reminders = res.reminders || [];
          if (res.archivedReminders) archivedReminders = res.archivedReminders;
          const currentDueIds = new Set(reminders.filter(r => r && r.time && r.time <= Date.now()).map(r => r.id));
          shownAlertIds = (shownAlertIds || []).filter(id => currentDueIds.has(id));
          renderFloatingAlertCard();
          renderSidebarReminders();
          updateReminderIndicators();
        }
      }
    });
  }

  const triggered = (reminders || []).filter(r => r && r.time && r.time <= now);
  if (triggered.length > 0) {
    triggered.forEach(rem => {
      if (!shownAlertIds.includes(rem.id)) {
        shownAlertIds.push(rem.id);
        triggerDesktopNotification(rem);
      }
    });
    renderFloatingAlertCard();
  } else {
    // If no reminders are due (e.g. they were all snoozed, edited, or closed from another tab), dismiss floating alert immediately!
    const existingCard = document.getElementById("wa-floating-alert-card");
    if (existingCard) existingCard.remove();
  }
}

function startReminderLoop() {
  if (checkAndMarkDead()) return;
  const isWhatsApp = window.location.hostname.includes("whatsapp.com");

  if (isWhatsApp) {
    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      try {
        Notification.requestPermission();
      } catch(e) {}
    }
    setTimeout(() => { if (!checkAndMarkDead()) updateReminderIndicators(); }, 1000);
    reminderIndicatorInterval = setInterval(() => {
      if (checkAndMarkDead()) return;
      updateReminderIndicators();
    }, 2000);
  }

  // Only run check loop if reminders feature is enabled
  if (enabledFeatures && enabledFeatures.reminders !== false) {
    setTimeout(() => { if (!checkAndMarkDead()) checkTriggeredReminders(); }, 1000);
    reminderCheckInterval = setInterval(() => {
      if (checkAndMarkDead()) return;
      checkTriggeredReminders();
    }, 2500);
  }
}

function triggerDesktopNotification(rem) {
  const title = `תזכורת חזרה ללקוח: ${rem.chatTitle} 🔔`;
  const body = rem.messageSnippet ? `הודעה: "${rem.messageSnippet}"` : `הגיע הזמן לחזור ללקוח זה!`;

  if (typeof Notification !== "undefined" && Notification.permission === "granted") {
    try {
      const n = new Notification(title, {
        body,
        icon: "https://web.whatsapp.com/img/favicon/1x/favicon.png",
        requireInteraction: true
      });
      n.onclick = () => {
        window.focus();
        navigateToChat(rem.chatId);
        n.close();
      };
    } catch (e) {}
  }
}

// Draggable, non-blocking floating alert card state
let activeDueReminders = [];
let currentAlertIdx = 0;
let alertPos = { top: 100, left: 100 };

function showVisualAlertModal(rem) {
  renderFloatingAlertCard();
}

function renderFloatingAlertCard() {
  activeDueReminders = reminders.filter(r => r && r.time && r.time <= Date.now());
  
  const existingCard = document.getElementById("wa-floating-alert-card");
  if (activeDueReminders.length === 0) {
    if (existingCard) existingCard.remove();
    return;
  }

  if (currentAlertIdx >= activeDueReminders.length) {
    currentAlertIdx = activeDueReminders.length - 1;
  }
  if (currentAlertIdx < 0) currentAlertIdx = 0;

  const rem = activeDueReminders[currentAlertIdx];
  const dueCount = activeDueReminders.length;

  let card = existingCard;
  if (!card) {
    card = document.createElement("div");
    card.id = "wa-floating-alert-card";
    card.style.cssText = `
      position: fixed;
      top: ${alertPos.top}px;
      left: ${alertPos.left}px;
      z-index: 999999;
      width: 380px;
      max-width: 90vw;
      border-radius: 12px;
      box-shadow: 0 12px 35px rgba(0,0,0,0.6);
      font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
      background-color: #1e293b !important;
      color: #f8fafc !important;
      border: 1px solid #334155;
      border-top: 5px solid ${rem.category === "payment" ? "#10b981" : "#ef4444"};
      direction: rtl;
      pointer-events: auto;
      user-select: none;
      overflow: hidden;
    `;
    document.body.appendChild(card);
  }

  const isPaymentAlert = rem.category === "payment" || rem.isPayment;
  if (card) {
    card.style.borderTop = `5px solid ${isPaymentAlert ? "#10b981" : "#ef4444"}`;
  }

  // Extract phone numbers (look for 9 to 12 digit sequences)
  const rawMatches = rem.messageSnippet ? (rem.messageSnippet.match(/\b\d[\d-]{7,14}\b/g) || []) : [];
  const extractedPhones = Array.from(new Set(rawMatches.map(m => formatIsraeliPhoneTo972(m))));
  
  let snippetHtml = "";
  if (rem.messageSnippet) {
    snippetHtml = `
      <div style="font-size: 12px; color: #cbd5e1; background: #0f172a; padding: 10px; border-radius: 6px; max-height: 140px; overflow-y: auto; text-align: right; white-space: pre-wrap; word-break: break-word; border: 1px solid #334155; margin-bottom: ${extractedPhones.length > 0 ? "8px" : "12px"}; direction: rtl; font-family: inherit; user-select: text;">
        ${escapeHTML(rem.messageSnippet)}
      </div>
    `;
    
    if (extractedPhones.length > 0) {
      snippetHtml += `
        <div style="display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; margin-bottom: 12px;">
          ${extractedPhones.map(phone => {
            const formattedPhone = formatIsraeliPhoneWithDash(phone);
            return `
              <button class="wa-alert-copy-extracted-btn" data-phone="${formattedPhone}" style="background: rgba(59, 130, 246, 0.15); border: 1px solid rgba(59, 130, 246, 0.4); color: #60a5fa; cursor: pointer; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 600; font-family: inherit; display: inline-flex; align-items: center; gap: 4px; outline: none;">
                📋 העתק מספר: ${formattedPhone}
              </button>
            `;
          }).join("")}
        </div>
      `;
    }
  }

  // Get primary phone number (if extracted) for the direct chat button label
  let primaryPhone = rem.clientPhone || "";
  let displayPhone = "";
  if (primaryPhone) {
    displayPhone = formatIsraeliPhoneWithDash(primaryPhone);
  } else if (extractedPhones.length > 0) {
    primaryPhone = extractedPhones[0];
    displayPhone = formatIsraeliPhoneWithDash(primaryPhone);
  }

  card.innerHTML = `
    <div id="wa-alert-drag-handle" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: #0f172a; border-bottom: 1px solid #334155; cursor: grab;">
      <span style="font-weight: 700; font-size: 13px; color: #f8fafc; display: flex; align-items: center; gap: 6px;">
        ${isPaymentAlert ? `💳 שיחת הסדר תשלום!` : `🔔 הגיע מועד התזכורת!`} ${dueCount > 1 ? `<span style="background: ${isPaymentAlert ? "#10b981" : "#ef4444"}; color: white; padding: 2px 7px; border-radius: 10px; font-size: 10px; font-weight: 700;">(${currentAlertIdx + 1}/${dueCount})</span>` : ""}
      </span>
      <span style="font-size: 10px; color: #94a3b8;">🖐️ גרור להזזה</span>
    </div>

    ${dueCount > 1 ? `
      <div style="display: flex; gap: 8px; justify-content: space-between; align-items: center; padding: 6px 14px; background: ${isPaymentAlert ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)"}; border-bottom: 1px solid #334155;">
        <button id="wa-alert-prev-btn" ${currentAlertIdx === 0 ? "disabled style='opacity:0.4; cursor:default;'" : "style='cursor:pointer;'"} style="background: transparent; border: 1px solid rgba(255,255,255,0.2); color: #f8fafc; font-size: 10px; padding: 3px 8px; border-radius: 4px; font-family: inherit;">▶️ קודמת</button>
        <span style="font-size: 11px; font-weight: 700; color: ${isPaymentAlert ? "#34d399" : "#f87171"};">תזכורת ${currentAlertIdx + 1} מתוך ${dueCount}</span>
        <button id="wa-alert-next-btn" ${currentAlertIdx === dueCount - 1 ? "disabled style='opacity:0.4; cursor:default;'" : "style='cursor:pointer;'"} style="background: transparent; border: 1px solid rgba(255,255,255,0.2); color: #f8fafc; font-size: 10px; padding: 3px 8px; border-radius: 4px; font-family: inherit;">הבאה ◀️</button>
      </div>
    ` : ""}

    <div style="padding: 14px; text-align: center;">
      <p style="font-size: 13px; font-weight: 700; color: #f8fafc; margin: 0 0 10px 0; display: flex; align-items: center; justify-content: center; gap: 8px;">
        <span>${isPaymentAlert ? "סטודנט:" : "חזרה ללקוח:"} ${escapeHTML(rem.chatTitle)}</span>
        <button id="wa-alert-copy-phone-btn" title="העתק מספר טלפון נקי" style="background: rgba(0, 230, 118, 0.15); border: 1px solid rgba(0, 230, 118, 0.4); color: #00e676; cursor: pointer; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; font-family: inherit; display: inline-flex; align-items: center; gap: 2px;">📋 העתק</button>
      </p>
      
      ${snippetHtml}
      
      <div style="display: flex; flex-direction: column; gap: 8px; align-items: center; margin-bottom: 12px; width: 100%;">
        ${primaryPhone ? `
          <button id="wa-alert-go-client-btn" style="background: linear-gradient(135deg, #00e676, #00a884); border: none; color: white; padding: 9px 16px; border-radius: 6px; font-weight: 700; cursor: pointer; font-family: inherit; width: 90%; display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 12px;">
            💬 מעבר לצ'אט של הלקוח (${displayPhone})
          </button>
        ` : ""}
        <div style="display: flex; gap: 6px; justify-content: center; width: 90%;">
          <button id="wa-alert-go-btn" style="background: ${primaryPhone ? "rgba(255, 255, 255, 0.1)" : "#00a884"}; border: 1px solid rgba(255,255,255,0.2); color: white; padding: 8px 10px; border-radius: 6px; font-weight: 600; cursor: pointer; font-family: inherit; flex: 1; display: flex; align-items: center; justify-content: center; gap: 4px; font-size: 11px;">
            📍 להודעה
          </button>
          <button id="wa-alert-edit-btn" style="background: rgba(234, 179, 8, 0.2); border: 1px solid rgba(234, 179, 8, 0.5); color: #facc15; padding: 8px 10px; border-radius: 6px; font-weight: 600; cursor: pointer; font-family: inherit; flex: 1; display: flex; align-items: center; justify-content: center; gap: 4px; font-size: 11px;">
            ✏️ ערוך
          </button>
          <button id="wa-alert-close-btn" style="background: #334155; border: 1px solid #475569; color: #f8fafc; padding: 8px 10px; border-radius: 6px; cursor: pointer; font-family: inherit; flex: 1; font-size: 11px;">
            סגור ❌
          </button>
          ${dueCount > 1 ? `
            <button id="wa-alert-close-all-btn" style="background: rgba(239, 68, 68, 0.2); border: 1px solid rgba(239, 68, 68, 0.5); color: #f87171; padding: 8px 10px; border-radius: 6px; cursor: pointer; font-family: inherit; font-size: 11px; font-weight: 700;">
              סגור הכל (${dueCount})
            </button>
          ` : ""}
        </div>
      </div>

      <div style="margin-top: 10px; border-top: 1px dashed #334155; padding-top: 10px; display: flex; gap: 8px; justify-content: center; align-items: center;">
        <span style="font-size: 11px; color: #94a3b8;">הזכר לי שוב:</span>
        <button id="wa-alert-snooze-5" style="background: rgba(234, 179, 8, 0.15); border: 1px solid rgba(234, 179, 8, 0.4); color: #facc15; padding: 4px 10px; border-radius: 4px; font-size: 10px; cursor: pointer; font-family: inherit; font-weight: 600;">⏰ בעוד 5 דק'</button>
        <button id="wa-alert-snooze-10" style="background: rgba(234, 179, 8, 0.15); border: 1px solid rgba(234, 179, 8, 0.4); color: #facc15; padding: 4px 10px; border-radius: 4px; font-size: 10px; cursor: pointer; font-family: inherit; font-weight: 600;">⏰ בעוד 10 דק'</button>
      </div>
    </div>
  `;

  // Attach Edit listener
  const editBtn = card.querySelector("#wa-alert-edit-btn");
  if (editBtn) {
    editBtn.addEventListener("click", () => {
      openEditReminderModal(rem);
    });
  }

  // Attach Drag Listeners to Header Handle
  const handle = card.querySelector("#wa-alert-drag-handle");
  if (handle) {
    let isDragging = false;
    let startX, startY, startLeft, startTop;

    handle.addEventListener("dragstart", (e) => e.preventDefault());
    handle.addEventListener("mousedown", (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      startX = e.clientX;
      startY = e.clientY;
      const rect = card.getBoundingClientRect();
      startLeft = rect.left;
      startTop = rect.top;
      isDragging = true;
      handle.style.cursor = "grabbing";

      const onMouseMove = (me) => {
        if (!isDragging) return;
        const dx = me.clientX - startX;
        const dy = me.clientY - startY;
        let newLeft = startLeft + dx;
        let newTop = startTop + dy;
        newLeft = Math.max(10, Math.min(window.innerWidth - 390, newLeft));
        newTop = Math.max(10, Math.min(window.innerHeight - 300, newTop));
        card.style.left = `${newLeft}px`;
        card.style.top = `${newTop}px`;
        alertPos = { left: newLeft, top: newTop };
      };

      const onMouseUp = () => {
        isDragging = false;
        handle.style.cursor = "grab";
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    });
  }

  // Navigation listeners
  if (dueCount > 1) {
    const prevBtn = card.querySelector("#wa-alert-prev-btn");
    const nextBtn = card.querySelector("#wa-alert-next-btn");
    if (prevBtn && currentAlertIdx > 0) {
      prevBtn.addEventListener("click", () => {
        currentAlertIdx--;
        renderFloatingAlertCard();
      });
    }
    if (nextBtn && currentAlertIdx < dueCount - 1) {
      nextBtn.addEventListener("click", () => {
        currentAlertIdx++;
        renderFloatingAlertCard();
      });
    }
    const closeAllBtn = card.querySelector("#wa-alert-close-all-btn");
    if (closeAllBtn) {
      closeAllBtn.addEventListener("click", () => {
        activeDueReminders.forEach(r => archiveReminder(r, false));
        reminders = reminders.filter(r => !r.time || r.time > Date.now());
        activeDueReminders = [];
        currentAlertIdx = 0;
        broadcastRemindersUpdate("REMINDERS_UPDATED");
        safeStorageSet({ reminders, archivedReminders }, () => {
          renderFloatingAlertCard();
          renderSidebarReminders();
          updateReminderIndicators();
          showNotificationToast(`כל ${dueCount} התזכורות נסגרו ואופסנו בארכיון 📦`);
        });
      });
    }
  }

  // Close single alert
  card.querySelector("#wa-alert-close-btn").addEventListener("click", () => {
    archiveReminder(rem, false);
    reminders = reminders.filter(r => r.id !== rem.id);
    activeDueReminders = activeDueReminders.filter(r => r.id !== rem.id);
    currentAlertIdx = Math.max(0, currentAlertIdx - 1);
    broadcastRemindersUpdate("REMINDER_DISMISSED", { remId: rem.id });
    safeStorageSet({ reminders, archivedReminders }, () => {
      renderFloatingAlertCard();
      renderSidebarReminders();
      updateReminderIndicators();
      showNotificationToast("התזכורת נסגרה ואופסנה בארכיון 📦");
    });
  });

  // Snooze handlers (Instant sync across all open tabs via safeStorageSet & BroadcastChannel)
  const snoozeFn = (mins) => {
    const newTime = Date.now() + mins * 60 * 1000;
    reminders = reminders.map(r => r.id === rem.id ? { ...r, time: newTime } : r);
    activeDueReminders = activeDueReminders.filter(r => r.id !== rem.id);
    shownAlertIds = shownAlertIds.filter(id => id !== rem.id);
    broadcastRemindersUpdate("REMINDER_SNOOZED", { remId: rem.id, newTime });
    safeStorageSet({ reminders }, () => {
      renderFloatingAlertCard();
      renderSidebarReminders();
      updateReminderIndicators();
      showNotificationToast(`התזכורת נדחתה ב-${mins} דקות! ⏰`);
    });
  };
  card.querySelector("#wa-alert-snooze-5").addEventListener("click", () => snoozeFn(5));
  card.querySelector("#wa-alert-snooze-10").addEventListener("click", () => snoozeFn(10));

  // Copy phone listeners
  const copyBtn = card.querySelector("#wa-alert-copy-phone-btn");
  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      const rawTarget = primaryPhone || rem.clientPhone || rem.chatId || "";
      const formatted = formatIsraeliPhoneWithDash(rawTarget);
      if (!formatted || /[a-zA-Z\u0590-\u05FF]/.test(formatted)) {
        showNotificationToast("לא נמצא מספר טלפון להעתקה בתזכורת זו. ⚠️");
        return;
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(formatted).then(() => {
          showNotificationToast(`המספר הועתק: ${formatted} 📋`);
        }).catch(() => {
          fallbackCopyTextToClipboard(formatted);
          showNotificationToast(`המספר הועתק: ${formatted} 📋`);
        });
      } else {
        fallbackCopyTextToClipboard(formatted);
        showNotificationToast(`המספר הועתק: ${formatted} 📋`);
      }
    });
  }

  card.querySelectorAll(".wa-alert-copy-extracted-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const p = btn.getAttribute("data-phone");
      if (p) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(p).then(() => {
            showNotificationToast(`המספר הועתק: ${p} 📋`);
          }).catch(() => {
            fallbackCopyTextToClipboard(p);
            showNotificationToast(`המספר הועתק: ${p} 📋`);
          });
        } else {
          fallbackCopyTextToClipboard(p);
          showNotificationToast(`המספר הועתק: ${p} 📋`);
        }
      }
    });
  });

  // Go to client / Go to message
  const goClientBtn = card.querySelector("#wa-alert-go-client-btn");
  if (goClientBtn && primaryPhone) {
    goClientBtn.addEventListener("click", () => {
      navigateToChat(primaryPhone);
    });
  }
  card.querySelector("#wa-alert-go-btn").addEventListener("click", () => {
    navigateToChat(rem.chatId, rem.msgId, rem.messageSnippet);
  });
}

// Helper to check if a message container is outgoing (sent by us)
function isOutgoingMessage(container) {
  const msgElement = container.closest('[data-id]') || container.querySelector('[data-id]');
  if (msgElement) {
    const dataId = msgElement.getAttribute('data-id');
    if (dataId) {
      if (dataId.startsWith('true_')) return true;
      if (dataId.startsWith('false_')) return false;
    }
  }
  const wrapper = container.closest('.message-in, .message-out');
  if (wrapper) {
    return wrapper.classList.contains('message-out');
  }
  return false;
}

// Clean up any stray message hover bells when no reminder is being created
function removeAllMessageHoverBells() {
  document.querySelectorAll(".wa-assistant-bell-btn").forEach(el => el.remove());
}

// Restore hover bell button on message bubbles for quick reminder creation directly from message text!
document.addEventListener("mouseover", (e) => {
  const container = e.target.closest('[data-testid="msg-container"], .message-in, .message-out');
  if (!container || container.querySelector(".wa-assistant-bell-btn")) return;

  const isOutgoing = isOutgoingMessage(container);
  const bell = document.createElement("div");
  bell.className = "wa-assistant-bell-btn " + (isOutgoing ? "wa-outgoing" : "wa-incoming");
  bell.innerHTML = "🔔";
  bell.title = "הוסף תזכורת להודעה זו";

  bell.addEventListener("click", (evt) => {
    evt.stopPropagation();
    evt.preventDefault();
    openAddReminderModal(container);
  });

  container.appendChild(bell);
});

// Open centered overlay modal to search/start chat by phone number
function openQuickPhoneModal() {
  const existing = document.getElementById("wa-quick-phone-modal");
  if (existing) {
    const inp = existing.querySelector("input");
    if (inp) { inp.focus(); }
    return;
  }

  const overlay = document.createElement("div");
  overlay.id = "wa-quick-phone-modal";
  overlay.className = "wa-modal-overlay";
  overlay.style.zIndex = "100002";
  overlay.style.direction = "rtl";

  overlay.innerHTML = `
    <div class="wa-modal-box" style="width: 340px; max-width: 95%; padding: 18px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
        <h3 style="margin: 0; font-size: 14px; font-weight: 700; display: flex; align-items: center; gap: 6px;">💬 פתיחת צ'אט מהיר בוואטסאפ</h3>
        <button id="wa-quick-phone-close" style="background: transparent; border: none; color: var(--wa-assistant-text-muted); font-size: 18px; cursor: pointer;">&times;</button>
      </div>

      <div style="display: flex; gap: 8px; margin-bottom: 14px;">
        <input type="text" id="wa-quick-phone-input" style="flex-grow: 1; background: var(--wa-assistant-bg); border: 1px solid var(--wa-assistant-border); color: var(--wa-assistant-text); font-size: 15px; font-weight: 700; padding: 10px 12px; border-radius: 6px; outline: none; font-family: var(--wa-assistant-font); text-align: center; direction: ltr;" placeholder="הקלד או הדבק מספר..." value="" autofocus>
      </div>
      <div style="display: flex; gap: 8px;">
        <button id="wa-quick-phone-submit" style="flex: 1; background: linear-gradient(135deg, #10b981, #059669); border: none; color: white; font-size: 13px; font-weight: 700; padding: 10px 16px; border-radius: 6px; cursor: pointer; font-family: var(--wa-assistant-font); display: flex; align-items: center; justify-content: center; gap: 6px; box-shadow: 0 2px 6px rgba(16,185,129,0.25);">💬 פתח צ'אט בוואטסאפ</button>
        <button id="wa-quick-phone-call-btn" style="background: rgba(255,255,255,0.06); border: 1px solid var(--wa-assistant-border); color: var(--wa-assistant-text-muted); font-size: 13px; padding: 10px 14px; border-radius: 6px; cursor: pointer; font-family: var(--wa-assistant-font); display: flex; align-items: center; justify-content: center; gap: 2px;" title="חיוג מהיר ב-Voicenter">📞</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const close = () => overlay.remove();
  document.getElementById("wa-quick-phone-close").addEventListener("click", close);

  const input = document.getElementById("wa-quick-phone-input");
  const submitBtn = document.getElementById("wa-quick-phone-submit");
  const callBtn = document.getElementById("wa-quick-phone-call-btn");

  setTimeout(() => {
    if (input) input.focus();
  }, 50);

  const doSubmit = () => {
    let val = input.value.trim().replace(/\D/g, "");
    if (!val) {
      alert("נא להזין מספר טלפון תקין (רק ספרות)");
      return;
    }
    if (val.startsWith("0")) {
      val = "972" + val.slice(1);
    }
    navigateToChat(val);
    close();
  };

  const doCall = () => {
    let val = input.value.trim();
    if (!val) {
      alert("נא להזין מספר טלפון תקין");
      return;
    }
    triggerVoicenterCall(val);
    close();
  };

  submitBtn.addEventListener("click", doSubmit);
  if (callBtn) callBtn.addEventListener("click", doCall);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      doSubmit();
    }
    if (e.key === "Escape") {
      close();
    }
  });

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      close();
    }
  });
}

// Trigger outbound Click2Call via Voicenter API or local tel: protocol
function triggerVoicenterCall(phone) {
  let cleanNum = phone.replace(/\D/g, "");
  if (!cleanNum) {
    alert("מספר טלפון אינו תקין לחיוג");
    return;
  }

  if (dialerType === "local") {
    // If it's a local tel: handler, we prefer the local 05... formatting so the Windows dialer dials normally.
    let dialNum = cleanNum;
    if (dialNum.startsWith("972") && dialNum.length === 12) {
      dialNum = "0" + dialNum.slice(3);
    }
    showLocalToast(`פותח חייגן מקומי עבור ${dialNum}... 📞`);
    window.open(`tel:${dialNum}`, "_self");
    return;
  }
  
  if (!voicenterExt || !voicenterCode) {
    alert("נא להגדיר שלוחה וקוד API של Voicenter בהגדרות שבתחתית סרגל הכלים!");
    return;
  }
  
  if (cleanNum.startsWith("0")) {
    cleanNum = "972" + cleanNum.slice(1);
  }
  
  showLocalToast(`מחייג ל-${cleanNum} דרך Voicenter... 📞`);
  
  const url = `https://api.voicenter.com/ForwardDialer/click2call.aspx?phone=${encodeURIComponent(voicenterExt)}&target=${encodeURIComponent(cleanNum)}&code=${encodeURIComponent(voicenterCode)}&action=call`;
  
  // Perform the background API fetch request
  fetch(url)
    .then(response => response.text())
    .then(data => {
      console.log("Voicenter Click2Call Response:", data);
      
      // Check for XML or text error response from Voicenter
      if (data.includes("<ERRORMESSAGE>") || data.includes("<ERROR>")) {
        const match = data.match(/<ERRORMESSAGE>(.*?)<\/ERRORMESSAGE>/) || data.match(/<ERROR>(.*?)<\/ERROR>/);
        const errMsg = match ? match[1] : "שגיאת מרכזיה לא ידועה";
        alert(`שגיאת מרכזיית Voicenter: ${errMsg}`);
        showLocalToast(`שגיאת מרכזיה: ${errMsg}`, true);
      } else if (data.includes("error") || data.includes("Error") || data.includes("Failed")) {
        alert(`שגיאת Voicenter: ${data}`);
        showLocalToast(`שגיאת מרכזיה: ${data}`, true);
      } else {
        showLocalToast("שיחה הופעלה בהצלחה בחייגן! 📞");
      }
    })
    .catch(err => {
      console.error("Voicenter Click2Call Error:", err);
      alert(`שגיאת חיבור לחייגן Voicenter (ייתכן שגיאת CORS/רשת): ${err.message}`);
      showLocalToast("שגיאה בחיבור לחייגן Voicenter", true);
    });
}




