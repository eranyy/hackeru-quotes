// Helpers
function escapeHTML(str) {
  if (!str) return '';
  return String(str).replace(/[&<>'"]/g,
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

// Global Error Handlers for options page
window.onerror = function(message, source, lineno, colno, error) {
  const errDiv = document.createElement('div');
  errDiv.id = 'error-banner';
  errDiv.style.position = 'fixed';
  errDiv.style.top = '0';
  errDiv.style.left = '0';
  errDiv.style.width = '100%';
  errDiv.style.background = '#ef4444';
  errDiv.style.color = 'white';
  errDiv.style.padding = '20px';
  errDiv.style.zIndex = '99999';
  errDiv.style.fontFamily = 'monospace';
  errDiv.style.direction = 'ltr';
  errDiv.style.textAlign = 'left';
  errDiv.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
  errDiv.innerHTML = `<h3>JS Error:</h3><p>${escapeHTML(String(message))}</p><p>Source: ${escapeHTML(String(source))}:${lineno}</p>`;
  (document.body || document.documentElement).appendChild(errDiv);
  return false;
};
window.onunhandledrejection = function(event) {
  const errDiv = document.createElement('div');
  errDiv.id = 'error-banner-rejection';
  errDiv.style.position = 'fixed';
  errDiv.style.top = '60px';
  errDiv.style.left = '0';
  errDiv.style.width = '100%';
  errDiv.style.background = '#f59e0b';
  errDiv.style.color = 'white';
  errDiv.style.padding = '20px';
  errDiv.style.zIndex = '99999';
  errDiv.style.fontFamily = 'monospace';
  errDiv.style.direction = 'ltr';
  errDiv.style.textAlign = 'left';
  errDiv.innerHTML = `<h3>Promise Rejection:</h3><p>${escapeHTML(String(event.reason))}</p>`;
  (document.body || document.documentElement).appendChild(errDiv);
};

// Default Seed Data in Hebrew
const DEFAULT_CATEGORIES = ["כללי", "מכירות", "שירות לקוחות", "מעקבים"];
const DEFAULT_TEMPLATES = [
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
  },
  {
    id: "seed-4",
    title: "תזכורת שיחה שלא נענתה",
    shortcut: "/לאענה",
    category: "מעקבים",
    content: "היי {שם},\nניסיתי לתפוס אותך בנייד אך ללא מענה.\nנשמח לחזור אליך במועד שנוח לך. מתי מתאים לך שנתקשר?"
  },
  {
    id: "seed-5",
    title: "קורס שיווק דיגיטלי - HackerU",
    shortcut: "-שיווק",
    category: "מכירות",
    content: "היי {First Name}, שמחתי להכיר! 😊\n\nהנה תמצית המסלול שיהפוך אותך למאסטר בשיווק דיגיטלי ב-HackerU. אנחנו נלמד אותך לשלוט בפלטפורמות המובילות ולנצח בעזרת בינה מלאכותית (AI):\n📊 פרטי הקורס: Digital Marketing Master + AI Tools\n\n📅 תאריך פתיחה: {תאריך}.\n🕘 מסלול: {בוקר / ערב}.\n💻 מתכונת לימודים: {היברידי / אונליין}.\n🗓️ימי לימוד: {ימי לימוד}.\n⏰ שעות: {שעות}.\n⏳ משך הקורס: כ-3.5 / 8.5 חודשים  (335 שעות אקדמיות).\n\n🚀 מה בתכל'ס לומדים?\nSocial 360: בניית אסטרטגיה מנצחת לפייסבוק ואינסטגרם, כולל עיצוב ב-Canva.\nVideo & Reels: צילום ועריכה ב-CapCut לסרטונים ויראליים בטיקטוק.\nפרסום ממומן (PPC): ניהול קמפיינים ותקציבים בגוגל וברשתות החברתיות.\nGEO & AI: אופטימיזציה למנועי בינה מלאכותית (כמו ChatGPT) כדי שה-AI ימליץ עליך.\n\n💰 סיכום עלויות:\n\nלגבי העלויות, נכון להיום אושרה לך מלגה אישית על סך {מלגה} ₪ שתקפה למועד הפתיחה הקרוב. המלגות שלנו מתעדכנות בין מחזור למחזור בהתאם להקצאות, לכן אני רוצה שנוודא שאנחנו סוגרים לך את המקום בתנאים האלו לפני שהם משתנים.\n\nסיכום עלויות: מחיר מלא: ~~17,900 ₪~~ | מחיר סופי עבורך: {מחיר לאחר הנחה} ₪ בלבד! (כולל מע\"מ).\n\n💳 אפשרויות תשלום:\nעד 12 תשלומים ללא ריבית בהוראת קבע.\n10% הנחה נוספת בתשלום אחד.\nמוכר לתשלום בפיקדון הצבאי.\nפריסה של עד 60 תשלומים (לא תופס מסגרת).\n\n🎯 השמה לעבודה: ליווי אישי של מחלקת ההשמה שלנו וחיבור ל-2,690 חברות בתעשייה.\n\nאני זמין לכל שאלה כדי שנוכל לשריין לך מקום,\nערן, יועץ לימודים | HackerU 🎓"
  }
];


let templates = [];
let categories = [];
let currentCategory = "all";

let enabledFeatures = {
  btnSidebar: true,
  btnSyllabus: true,
  btnDialer: true,
  btnCopyPhone: true,
  btnReminder: true,
  templates: true,
  reminders: true,
  copyPhone: true,
  quickDialer: true,
  leadsTracker: true,
  paymentsTracker: true,
  syllabus: true,
  pinnedShortcuts: true,
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
let currentViewedPlatform = "whatsapp";

function isFeatureEnabledForPlatform(featureKey, platform = "whatsapp") {
  const p = platform === "other" ? "web" : platform;
  if (enabledFeatures && enabledFeatures.platformSettings && enabledFeatures.platformSettings[p] && typeof enabledFeatures.platformSettings[p][featureKey] === "boolean") {
    return enabledFeatures.platformSettings[p][featureKey];
  }
  return enabledFeatures ? enabledFeatures[featureKey] !== false : true;
}

// Elements
const categoriesList = document.getElementById("categoriesList");
const templatesGrid = document.getElementById("templatesGrid");
const searchInput = document.getElementById("searchInput");
const newTemplateBtn = document.getElementById("newTemplateBtn");
const emptyStateCreateBtn = document.getElementById("emptyStateCreateBtn");
const emptyState = document.getElementById("emptyState");
const currentCategoryTitle = document.getElementById("currentCategoryTitle");
const templateCounter = document.getElementById("templateCounter");

// Template Modal Elements
const templateModal = document.getElementById("templateModal");
const templateForm = document.getElementById("templateForm");
const modalTitle = document.getElementById("modalTitle");
const closeModalBtn = document.getElementById("closeModalBtn");
const cancelModalBtn = document.getElementById("cancelModalBtn");
const tplId = document.getElementById("templateId");
const tplTitle = document.getElementById("tplTitle");
const tplShortcut = document.getElementById("tplShortcut");
const tplCategory = document.getElementById("tplCategory");
const tplContent = document.getElementById("tplContent");

// Category Modal Elements
const addCategoryBtn = document.getElementById("addCategoryBtn");
const categoryModal = document.getElementById("categoryModal");
const categoryForm = document.getElementById("categoryForm");
const closeCategoryModalBtn = document.getElementById("closeCategoryModalBtn");
const cancelCategoryModalBtn = document.getElementById("cancelCategoryModalBtn");
const catName = document.getElementById("catName");

// Backup Elements
const exportBtn = document.getElementById("exportBtn");
const importBtn = document.getElementById("importBtn");
const importFile = document.getElementById("importFile");

// Initialize Extension Storage
document.addEventListener("DOMContentLoaded", () => {
  // Check if Chrome extension environment is fully available
  if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
    chrome.storage.local.get(["templates", "categories", "geminiApiKey", "enabledFeatures"], (result) => {
      // Set API key if present
      const apiKeyInput = document.getElementById("aiApiKey");
      if (apiKeyInput && result.geminiApiKey) {
        apiKeyInput.value = result.geminiApiKey;
      }

      if (result.enabledFeatures) {
        enabledFeatures = { ...enabledFeatures, ...result.enabledFeatures };
      }

      if (!result.templates || result.templates.length === 0) {
        templates = DEFAULT_TEMPLATES;
        categories = DEFAULT_CATEGORIES;
        chrome.storage.local.set({ templates, categories }, () => {
          initApp();
        });
      } else {
        templates = result.templates || [];
        categories = result.categories || DEFAULT_CATEGORIES;
        // Proactive migration check to add user's marketing template if missing
        if (!templates.find(t => t.shortcut === "-שיווק")) {
          const mktTpl = DEFAULT_TEMPLATES.find(t => t.shortcut === "-שיווק");
          if (mktTpl) {
            templates.push(mktTpl);
            chrome.storage.local.set({ templates });
          }
        }
        initApp();
      }
    });
  } else {
    // Non-extension fallback for development styling preview
    templates = DEFAULT_TEMPLATES;
    categories = DEFAULT_CATEGORIES;
    initApp();
  }
});

function initApp() {
  renderCategories();
  renderCategoryDropdown();
  renderTemplates();
  initFeaturesSelector();
  setupEventListeners();
}

// Render the categories sidebar
function renderCategories() {
  // Clear dynamic elements (leave only 'all' which is hardcoded)
  const allLi = categoriesList.querySelector('[data-category="all"]');
  categoriesList.innerHTML = "";
  categoriesList.appendChild(allLi);

  // Update "All" counter
  document.getElementById("count-all").textContent = templates.length;

  categories.forEach(cat => {
    const count = templates.filter(t => t.category === cat).length;
    const li = document.createElement("li");
    if (currentCategory === cat) li.className = "active";
    li.setAttribute("data-category", cat);
    li.innerHTML = `
      <span class="category-icon">📁</span>
      <span class="category-name">${escapeHTML(cat)}</span>
      <span class="category-count">${count}</span>
      <button class="delete-cat-btn" style="background:none; border:none; color:var(--text-secondary); cursor:pointer; margin-right:8px; font-size:10px; display:none;">&times;</button>
    `;

    // Show delete button on category hover
    li.addEventListener("mouseenter", () => {
      const delBtn = li.querySelector(".delete-cat-btn");
      if (delBtn) delBtn.style.display = "inline-block";
    });
    li.addEventListener("mouseleave", () => {
      const delBtn = li.querySelector(".delete-cat-btn");
      if (delBtn) delBtn.style.display = "none";
    });

    li.querySelector(".delete-cat-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      deleteCategory(cat);
    });

    li.addEventListener("click", () => {
      document.querySelectorAll(".categories-nav li").forEach(el => el.classList.remove("active"));
      li.classList.add("active");
      currentCategory = cat;
      currentCategoryTitle.textContent = cat;
      renderTemplates();
    });

    categoriesList.appendChild(li);
  });
}

// Render the Category dropdown options inside the Modal
function renderCategoryDropdown() {
  tplCategory.innerHTML = "";
  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    tplCategory.appendChild(opt);
  });
}

// Render templates grid based on current filters (category, search)
function renderTemplates() {
  templatesGrid.innerHTML = "";
  const query = searchInput.value.toLowerCase().trim();

  let filtered = templates;

  // Filter by category
  if (currentCategory !== "all") {
    filtered = filtered.filter(t => t.category === currentCategory);
  }

  // Filter by search query
  if (query) {
    filtered = filtered.filter(t => 
      t.title.toLowerCase().includes(query) || 
      t.shortcut.toLowerCase().includes(query) || 
      t.content.toLowerCase().includes(query)
    );
  }

  // Update counters
  templateCounter.textContent = `${filtered.length} מתוך ${templates.length} תבניות`;

  if (filtered.length === 0) {
    templatesGrid.style.display = "none";
    emptyState.style.display = "flex";
  } else {
    templatesGrid.style.display = "grid";
    emptyState.style.display = "none";

    filtered.forEach(tpl => {
      const card = document.createElement("div");
      card.className = "template-card";
      
      // Highlight placeholders {name} with markup
      const formattedContent = escapeHTML(tpl.content).replace(/\{([^}]+)\}/g, "<mark>{$1}</mark>");

      card.innerHTML = `
        <div class="card-header">
          <div class="card-title-group">
            <h3>${escapeHTML(tpl.title)}</h3>
            <span class="card-category">${escapeHTML(tpl.category)}</span>
          </div>
          <span class="card-shortcut">${escapeHTML(tpl.shortcut)}</span>
        </div>
        <div class="card-body">${formattedContent}</div>
        <div class="card-actions">
          <button class="btn btn-secondary btn-sm edit-tpl-btn" data-id="${tpl.id}">✏️ ערוך</button>
          <button class="btn btn-danger btn-sm delete-tpl-btn" data-id="${tpl.id}">🗑️ מחק</button>
        </div>
      `;

      // Event listeners
      card.querySelector(".edit-tpl-btn").addEventListener("click", () => openEditModal(tpl));
      card.querySelector(".delete-tpl-btn").addEventListener("click", () => deleteTemplate(tpl.id));

      templatesGrid.appendChild(card);
    });
  }
}


function saveToStorage() {
  if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
    chrome.storage.local.set({ templates, categories }, () => {
      renderCategories();
      renderTemplates();
    });
  } else {
    // Non-extension save simulation
    renderCategories();
    renderTemplates();
  }
}

// Event Listeners setup
function setupEventListeners() {
  // Search
  searchInput.addEventListener("input", renderTemplates);

  // New Template Modal Open
  newTemplateBtn.addEventListener("click", () => openAddModal());
  emptyStateCreateBtn.addEventListener("click", () => openAddModal());

  // Close modals
  closeModalBtn.addEventListener("click", () => templateModal.style.display = "none");
  cancelModalBtn.addEventListener("click", () => templateModal.style.display = "none");
  
  // Save Template
  templateForm.addEventListener("submit", (e) => {
    e.preventDefault();
    saveTemplate();
  });

  // Category Modal Open
  addCategoryBtn.addEventListener("click", () => {
    catName.value = "";
    categoryModal.style.display = "flex";
  });

  closeCategoryModalBtn.addEventListener("click", () => categoryModal.style.display = "none");
  cancelCategoryModalBtn.addEventListener("click", () => categoryModal.style.display = "none");

  // Create Category
  categoryForm.addEventListener("submit", (e) => {
    e.preventDefault();
    createCategory();
  });

  // Click on backdrop to close modals
  window.addEventListener("click", (e) => {
    if (e.target === templateModal) templateModal.style.display = "none";
    if (e.target === categoryModal) categoryModal.style.display = "none";
  });

  // Export templates
  exportBtn.addEventListener("click", exportTemplates);

  // Import templates
  importBtn.addEventListener("click", () => importFile.click());
  importFile.addEventListener("change", importTemplates);

  // Save API Key on input change
  const apiKeyInput = document.getElementById("aiApiKey");
  if (apiKeyInput) {
    apiKeyInput.addEventListener("change", () => {
      const apiKey = apiKeyInput.value.trim();
      if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ geminiApiKey: apiKey });
      }
    });
  }

  // AI Prompt Generate Button
  const aiGenerateBtn = document.getElementById("aiGenerateBtn");
  if (aiGenerateBtn) {
    aiGenerateBtn.addEventListener("click", generateAIText);
  }
}

// Add/Edit Template Action
function openAddModal() {
  modalTitle.textContent = "יצירת תבנית חדשה";
  tplId.value = "";
  tplTitle.value = "";
  tplShortcut.value = "";
  tplContent.value = "";
  if (categories.length > 0) {
    tplCategory.value = categories[0];
  }
  templateModal.style.display = "flex";
  tplTitle.focus();
}

function openEditModal(tpl) {
  modalTitle.textContent = "עריכת תבנית";
  tplId.value = tpl.id;
  tplTitle.value = tpl.title;
  tplShortcut.value = tpl.shortcut;
  tplCategory.value = tpl.category;
  tplContent.value = tpl.content;
  templateModal.style.display = "flex";
  tplTitle.focus();
}

function saveTemplate() {
  const id = tplId.value;
  const title = tplTitle.value.trim();
  let shortcut = tplShortcut.value.trim();
  const category = tplCategory.value;
  const content = tplContent.value.trim();

  // Validate shortcut prefixes
  if (!shortcut.startsWith('/') && !shortcut.startsWith(';') && !shortcut.startsWith('!') && !shortcut.startsWith('.') && !shortcut.startsWith('-')) {
    shortcut = '/' + shortcut;
  }

  // Check for duplicate shortcut
  const duplicate = templates.find(t => t.shortcut === shortcut && t.id !== id);
  if (duplicate) {
    alert(`קיצור הדרך ${shortcut} כבר נמצא בשימוש עבור התבנית: "${duplicate.title}"`);
    return;
  }

  if (id) {
    // Edit existing
    templates = templates.map(t => t.id === id ? { id, title, shortcut, category, content } : t);
  } else {
    // Create new
    const newId = "tpl-" + Date.now();
    templates.push({ id: newId, title, shortcut, category, content });
  }

  saveToStorage();
  templateModal.style.display = "none";
}

function deleteTemplate(id) {
  if (confirm("האם אתה בטוח שברצונך למחוק תבנית זו?")) {
    templates = templates.filter(t => t.id !== id);
    saveToStorage();
  }
}

// Category Management
function createCategory() {
  const name = catName.value.trim();
  if (!name) return;

  if (categories.includes(name)) {
    alert("קטגוריה זו כבר קיימת!");
    return;
  }

  categories.push(name);
  saveToStorage();
  renderCategoryDropdown();
  categoryModal.style.display = "none";
}

function deleteCategory(name) {
  if (confirm(`האם למחוק את הקטגוריה "${name}"? שים לב: תבניות בקטגוריה זו יועברו ל"כללי".`)) {
    categories = categories.filter(c => c !== name);
    templates = templates.map(t => {
      if (t.category === name) {
        return { ...t, category: "כללי" };
      }
      return t;
    });
    if (currentCategory === name) {
      currentCategory = "all";
      currentCategoryTitle.textContent = "כל התבניות";
      document.querySelector('[data-category="all"]').classList.add("active");
    }
    
    // Ensure "כללי" is in categories
    if (!categories.includes("כללי")) {
      categories.unshift("כללי");
    }
    
    saveToStorage();
    renderCategoryDropdown();
  }
}

// Backup & Restore
function exportTemplates() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ templates, categories }, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `whatsapp-templates-backup-${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

function importTemplates(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      if (data.templates && Array.isArray(data.templates)) {
        if (confirm("האם למזג את התבניות המיובאות עם התבניות הקיימות? (ביטול יחליף את כל התבניות הקימות)")) {
          // Merge logic
          data.templates.forEach(newTpl => {
            if (!templates.find(t => t.shortcut === newTpl.shortcut)) {
              templates.push(newTpl);
            }
          });
          if (data.categories) {
            data.categories.forEach(cat => {
              if (!categories.includes(cat)) categories.push(cat);
            });
          }
        } else {
          // Overwrite logic
          templates = data.templates;
          categories = data.categories || DEFAULT_CATEGORIES;
        }
        
        saveToStorage();
        renderCategoryDropdown();
        alert("הייבוא הושלם בהצלחה!");
      } else {
        alert("קובץ הגיבוי אינו תקין.");
      }
    } catch (err) {
      alert("שגיאה בקריאת הקובץ: " + err.message);
    }
  };
  reader.readAsText(file);
}

// AI writing assistance generator
async function generateAIText() {
  const apiKeyInput = document.getElementById("aiApiKey");
  const apiKey = apiKeyInput ? apiKeyInput.value.trim() : "";
  if (!apiKey) {
    alert("נא להזין מפתח API של Gemini בסרגל הצד תחילה!");
    return;
  }

  const promptInput = document.getElementById("aiPrompt");
  const instruction = promptInput ? promptInput.value.trim() : "";
  if (!instruction) {
    alert("נא להזין הנחיה ל-AI (למשל: 'הפוך ליותר שיווקי')");
    return;
  }

  const originalContent = tplContent.value.trim();
  if (!originalContent) {
    alert("נא להזין תוכן להודעה תחילה כדי שה-AI יוכל לעבוד עליו!");
    return;
  }

  const statusSpan = document.getElementById("aiStatus");
  const aiGenerateBtn = document.getElementById("aiGenerateBtn");
  
  statusSpan.textContent = "מנסח כעת... ⏳";
  statusSpan.style.color = "var(--primary)";
  aiGenerateBtn.disabled = true;

  try {
    const promptText = `You are a professional Israeli copywriting assistant.
Your task is to rewrite the following message template based on these instructions: "${instruction}".

CRITICAL REQUIREMENT:
- You must preserve all placeholders in the text (placeholders are words inside curly braces like "{שם}", "{תאריך}", "{First Name}", etc.).
- Do not translate, rename, delete, or modify any of the placeholders. They must appear exactly as they are in the original text (e.g. if the original has "{תאריך}", the output must have "{תאריך}").
- Keep the language of the message as Hebrew.

Original template:
"""
${originalContent}
"""

Provide ONLY the rewritten message template. Do not include any introduction, explanations, markdown code blocks, or other commentary.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: promptText }]
        }]
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error?.message || `HTTP ${response.status}`);
    }

    const resData = await response.json();
    let resultText = resData.candidates?.[0]?.content?.parts?.[0]?.text;
    if (resultText) {
      resultText = resultText.trim();
      
      // Clean up markdown block wraps if AI ignored instructions
      if (resultText.startsWith("```")) {
        resultText = resultText.replace(/^```[a-zA-Z]*\n/, "").replace(/\n```$/, "");
      }

      tplContent.value = resultText;
      statusSpan.textContent = "הושלם בהצלחה! ✨";
      statusSpan.style.color = "var(--success)";
      if (promptInput) promptInput.value = ""; // Clear prompt input
    } else {
      throw new Error("לא התקבל מענה מה-AI");
    }
  } catch (err) {
    console.error("AI Generation Error:", err);
    statusSpan.textContent = "שגיאה בניסוח ❌";
    statusSpan.style.color = "var(--danger)";
    alert("שגיאה בהפעלת ה-AI: " + err.message + "\n\nנא לוודא שמפתח ה-API תקין ושיש חיבור לאינטרנט.");
  } finally {
    aiGenerateBtn.disabled = false;
  }
}

// Background reminder check interval loop for options page
function startOptionsReminderLoop() {
  if (typeof Notification !== "undefined" && Notification.permission === "default") {
    Notification.requestPermission();
  }

  const shownIds = [];
  function checkReminders() {
    chrome.storage.local.get(["reminders"], (res) => {
      const reminders = res.reminders || [];
      const now = Date.now();
      const triggered = reminders.filter(r => r.time <= now && !shownIds.includes(r.id));
      if (triggered.length > 0) {
        triggered.forEach(rem => {
          shownIds.push(rem.id);
          if (typeof Notification !== "undefined" && Notification.permission === "granted") {
            try {
              const n = new Notification(`תזכורת חזרה ללקוח: ${rem.chatTitle} 🔔`, {
                body: rem.messageSnippet ? `הודעה: "${rem.messageSnippet}"` : `הגיע הזמן לחזור ללקוח זה!`,
                icon: "https://web.whatsapp.com/img/favicon/1x/favicon.png",
                requireInteraction: true
              });
              n.onclick = () => {
                window.focus();
                n.close();
              };
            } catch (e) {
              console.warn("Options notification error:", e);
            }
          }
        });
      }
    });
  }

  setInterval(checkReminders, 10000);
  setTimeout(checkReminders, 1500);
}

function initFeaturesSelector() {
  const tabWa = document.getElementById("opt-feat-tab-whatsapp");
  const tabMail = document.getElementById("opt-feat-tab-mail");
  const tabExcel = document.getElementById("opt-feat-tab-excel");
  const tabWeb = document.getElementById("opt-feat-tab-web");
  const openFullTabBtn = document.getElementById("openFullTabBtn");

  if (openFullTabBtn) {
    openFullTabBtn.addEventListener("click", () => {
      if (chrome.runtime && chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
      } else {
        window.open(chrome.runtime.getURL("options.html"), "_blank");
      }
    });
  }

  const updatePlatformTabStyles = () => {
    [
      { btn: tabWa, p: "whatsapp" },
      { btn: tabMail, p: "mail" },
      { btn: tabExcel, p: "excel" },
      { btn: tabWeb, p: "web" }
    ].forEach(({ btn, p }) => {
      if (!btn) return;
      if (currentViewedPlatform === p) {
        btn.style.background = "var(--primary)";
        btn.style.color = "white";
        btn.style.fontWeight = "700";
      } else {
        btn.style.background = "transparent";
        btn.style.color = "var(--text-secondary)";
        btn.style.fontWeight = "500";
      }
    });
  };

  const syncFeatureCheckboxes = () => {
    updatePlatformTabStyles();

    // Floating Screen Buttons for currentViewedPlatform
    const cbBtnSidebar = document.getElementById("opt-toggle-btn-sidebar");
    const cbBtnSyllabus = document.getElementById("opt-toggle-btn-syllabus");
    const cbBtnDialer = document.getElementById("opt-toggle-btn-dialer");
    const cbBtnCopy = document.getElementById("opt-toggle-btn-copy");
    const cbBtnReminder = document.getElementById("opt-toggle-btn-reminder");

    if (cbBtnSidebar) cbBtnSidebar.checked = isFeatureEnabledForPlatform("btnSidebar", currentViewedPlatform);
    if (cbBtnSyllabus) cbBtnSyllabus.checked = isFeatureEnabledForPlatform("btnSyllabus", currentViewedPlatform);
    if (cbBtnDialer) cbBtnDialer.checked = isFeatureEnabledForPlatform("btnDialer", currentViewedPlatform);
    if (cbBtnCopy) cbBtnCopy.checked = isFeatureEnabledForPlatform("btnCopyPhone", currentViewedPlatform);
    if (cbBtnReminder) cbBtnReminder.checked = isFeatureEnabledForPlatform("btnReminder", currentViewedPlatform);

    // Sidebar Tabs & Modules (Global)
    const cbTemplates = document.getElementById("opt-toggle-templates");
    const cbReminders = document.getElementById("opt-toggle-reminders");
    const cbPinned = document.getElementById("opt-toggle-pinned");
    const cbLeads = document.getElementById("opt-toggle-leads");
    const cbPayments = document.getElementById("opt-toggle-payments");

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
      if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ enabledFeatures });
      }
    });
  };

  bindFloatingButtonToggle(document.getElementById("opt-toggle-btn-sidebar"), "btnSidebar");
  bindFloatingButtonToggle(document.getElementById("opt-toggle-btn-syllabus"), "btnSyllabus");
  bindFloatingButtonToggle(document.getElementById("opt-toggle-btn-dialer"), "btnDialer");
  bindFloatingButtonToggle(document.getElementById("opt-toggle-btn-copy"), "btnCopyPhone");
  bindFloatingButtonToggle(document.getElementById("opt-toggle-btn-reminder"), "btnReminder");

  const bindGlobalToggle = (el, key) => {
    if (!el) return;
    el.addEventListener("change", () => {
      enabledFeatures[key] = el.checked;
      if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ enabledFeatures });
      }
    });
  };

  bindGlobalToggle(document.getElementById("opt-toggle-templates"), "templates");
  bindGlobalToggle(document.getElementById("opt-toggle-reminders"), "reminders");
  bindGlobalToggle(document.getElementById("opt-toggle-pinned"), "pinnedShortcuts");
  bindGlobalToggle(document.getElementById("opt-toggle-leads"), "leadsTracker");
  bindGlobalToggle(document.getElementById("opt-toggle-payments"), "paymentsTracker");

  syncFeatureCheckboxes();
}

startOptionsReminderLoop();
