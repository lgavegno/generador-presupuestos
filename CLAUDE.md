# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Project Status:** Production (v2.2.0) with Technical Debt
**Last Audit:** 13 de abril de 2026
**Audit Score:** 6.5/10 — See `/docs/BITACORA_TECNICA.md` for critical issues

---

## 📖 DOCUMENTATION ROADMAP

Start here based on your task:

1. **New to the project?** Read `/docs/SDD_MASTER.md` (5 min overview)
2. **Changing prices?** Go to `/docs/MOD-01_PRICING.md`
3. **Debugging webhook?** Go to `/docs/MOD-02_WEBHOOK.md`
4. **Auditing code?** Go to `/docs/BITACORA_TECNICA.md`
5. **Setup Google Sheets?** Go to `/docs/SETUP-GOOGLE-SHEETS.md`

---

## 🚀 Quick Commands

**Run local development server:**
```bash
python -m http.server 8000
open http://localhost:8000/presupuestador/index.html
```

**Development server with auto-reload (optional):**
```bash
cd presupuestador && python -m http.server 8000
```

No build process, package manager, or compilation needed. Pure vanilla JavaScript.

---

## 🏗️ Architecture Overview

This is a **serverless quote generator** with three-tier architecture:

### Frontend (Vanilla JS, ~20KB)
- **Entry point:** `presupuestador/index.html` (inline CSS + inline script tags)
- **JS modules in** `presupuestador/js/`:
  - `main.js` - Global `CONFIG` object (pricing tiers) + `state` object (form state)
  - `calculator.js` - Real-time price calculations (updatePresupuesto function)
  - `form-handler.js` - Form validation + field filtering based on website type
  - `email-handler.js` - Fetch POST to Google Apps Script webhook
  - `storage.js` - localStorage management (minimal)
  - `ui-updater.js` - DOM updates (minimal)

### Backend (Google Apps Script)
- **Location:** script.google.com (deployed as "Web App")
- **Entry point:** `doPost()` webhook handler
- **Responsibilities:**
  - Validate/sanitize JSON payload from frontend
  - Store submissions in Google Sheets
  - Send email notification via Gmail API
  - Log events to LOGS sheet

### Storage (Google Sheets)
- **Sheets in workbook:** SUBMISSIONS, STATISTICS, TEMPLATE, LOGS
- **Webhook URL:** hardcoded in `email-handler.js` as `GOOGLE_SCRIPT_URL` (value starts with `AKfycby9Bz6bXnt06aGHfWEAv76xKWvcc_...`)

---

## 📝 Key Concepts

### 1. Global CONFIG Object
Located in `main.js`, defines all pricing and options:
```javascript
const CONFIG = {
    PRESUPUESTO_BASE: {
        landing: 200000,
        simple: 250000,
        portfolio: 350000,
        ecommerce: 600000
    },
    PRECIO_SECCION: 50000,
    PRECIO_FUNCIONALIDAD: 60000,
    IVA: 0.21
};
```

### 2. Global state Object
Tracks form state across the session:
```javascript
const state = {
    websiteType: null,
    sections: [],         // User-selected sections
    features: [],         // User-selected features
    presupuesto: { ... }  // Calculated pricing breakdown
};
```

### 3. Two Pricing Modes
- **Standard Mode:** Select website type → add sections/features → get price
- **Custom Mode:** User enters description in "Desarrollo a medida" field → UI switches to custom mode (sections/features hidden) → presupuesto.total becomes 0 → button text changes to "Solicitar Entrevista"

**Activation logic:** Any text in `#custom-project-desc` textarea triggers `resetToCustomMode()` function.

### 4. Sections as "Included by Default"
Each website type includes certain sections for free:
```javascript
const SECCIONES_INCLUIDAS = {
    'landing': ['hero'],
    'simple': ['hero'],
    'portfolio': ['hero', 'about'],
    'ecommerce': ['hero', 'about', 'products']
};
```
Extra sections beyond these are $50k each.

### 5. File Sync Pattern
**Critical:** Files in `presupuestador/js/` and root `js/` must be kept in sync:
- Changes to `presupuestador/js/calculator.js` → copy to `js/calculator.js`
- Both directories exist for backward compatibility (old version may reference `/js/`)
- Verify both are identical after edits

---

## 🔌 Integration with Google Apps Script

### Webhook Flow
1. User submits form → `sendToGoogleSheets()` in `email-handler.js`
2. Fetch POST to `GOOGLE_SCRIPT_URL` with JSON payload
3. Google Apps Script `doPost()` receives request
4. Script validates, stores row in SUBMISSIONS sheet, sends email
5. Response sent back (success or error)

### Payload Structure - Standard Mode
```json
{
  "timestamp": "2026-03-12T14:30:00.000Z",
  "is_custom": false,
  "nombre": "Juan García",
  "email": "juan@email.com",
  "telefono": "+54 9 3492 123456",
  "tipo_sitio": "landing",
  "secciones_elegidas": ["Inicio/Hero", "Acerca de"],
  "funcionalidades": ["SEO", "Analytics"],
  "presupuesto": { "base": 200000, "secciones": 100000, ... },
  "observaciones": "User notes"
}
```

### Payload Structure - Custom Mode
```json
{
  "timestamp": "2026-03-12T14:30:00.000Z",
  "is_custom": true,
  "customDescription": "Necesito una Web App SaaS con OAuth...",
  "nombre": "María Rodríguez",
  "email": "maria@startup.com",
  ...
  "presupuesto": { "base": 0, "secciones": 0, "funcionalidades": 0, "total": 0 }
}
```

---

## 📂 File Structure

```
presupuestador/
├── index.html                 # Main form (includes inline CSS + scripts)
├── js/
│   ├── main.js               # CONFIG + state + DOMContentLoaded
│   ├── calculator.js         # Price calculations
│   ├── form-handler.js       # Form validation + mode switching
│   ├── email-handler.js      # Google Apps Script POST
│   ├── storage.js            # localStorage helpers
│   └── ui-updater.js         # DOM updates
├── css/
│   └── (styles may be inline in index.html)
└── data/
    └── (optional JSON data files)

js/
├── calculator.js             # ✅ MUST SYNC with presupuestador/js/
├── form-handler.js           # ✅ MUST SYNC with presupuestador/js/
├── email-handler.js          # ✅ MUST SYNC with presupuestador/js/
├── main.js                   # ✅ MUST SYNC with presupuestador/js/
├── storage.js                # ✅ MUST SYNC with presupuestador/js/
└── ui-updater.js             # ✅ MUST SYNC with presupuestador/js/

docs/
├── PROJECT_CONSTITUTION.md    # Project charter
├── MOD-01.md through MOD-07.md # Specifications (permanent)
├── PLAN-*.md                  # Temporary implementation plans
├── SETUP-GOOGLE-SHEETS.md     # Integration guide
└── PROJECT_LOG.md             # Change history
```

---

## 🔧 Common Development Tasks

### Updating Pricing
1. Edit `CONFIG.PRESUPUESTO_BASE` in `main.js`
2. Update same in `presupuestador/js/main.js` (keep sync)
3. Update pricing table in `/docs/PROJECT_CONSTITUTION.md`
4. Test in browser: change website type → verify new price

### Adding a New Section or Feature
1. Add to HTML checkboxes in `presupuestador/index.html`
2. HTML structure: `<input type="checkbox" name="sections" value="section-id">`
3. Add label or display name mapping if needed
4. Test: check/uncheck → verify price calculation updates

### Updating Google Sheets Integration
1. Check current webhook URL in `email-handler.js` (`GOOGLE_SCRIPT_URL`)
2. If deploying new Google Apps Script:
   - Deploy as "Web App"
   - Copy new URL
   - Update `GOOGLE_SCRIPT_URL` in both `email-handler.js` AND `presupuestador/js/email-handler.js`
   - Test with browser console: `sendToGoogleSheets()`

### Testing Custom Mode
1. Focus on textarea `#custom-project-desc`
2. Enter any text → should trigger `resetToCustomMode()`
3. Verify:
   - Section/feature checkboxes are disabled
   - Presupuesto shows "A Medida" or 0
   - Submit button text is "Solicitar Entrevista"

### Debugging
- **Open Console:** F12 → Console tab
- **Common logs:** Look for `updatePresupuesto() llamada`, `Select changed to:`, `Form submission blocked`
- **Check Network:** F12 → Network → POST request to Google Apps Script URL
- **Check localStorage:** `localStorage.getItem('presupuesto_state')`

---

## 🐛 Critical Implementation Details

### Event Listeners in main.js
When adding new form inputs, register event listeners in the `DOMContentLoaded` block:
```javascript
document.getElementById('tipo_sitio').addEventListener('change', updatePresupuesto);
document.querySelectorAll('input[name="sections"]').forEach(cb => {
    cb.addEventListener('change', updatePresupuesto);
});
```

### IVA (Tax) Display
- Calculated as 21% but **NOT added to total** (displayed for transparency only)
- Total = base + sections + features (no IVA included)
- This is a business rule, not a bug

### Currency
- ARS (Argentine Peso) throughout
- No automatic USD conversion in frontend
- USD display handled separately (if at all)

### Form Validation
- Email validation: basic regex in `form-handler.js`
- Required fields: nombre, email, telefono
- No backend validation (trust frontend + Google Apps Script)

---

## 📖 Documentation Files

- **PROJECT_CONSTITUTION.md** - Read first for project objectives and scope
- **MOD-01 to MOD-07** - Permanent specifications (reference when making changes)
- **SETUP-GOOGLE-SHEETS.md** - Step-by-step Google Sheets + Apps Script setup
- **PROJECT_LOG.md** - Commit history and release notes
- **.antigravityrules** - Windsurf IDE configuration (for context only)

---

## 🔐 Important Security Notes

- ✅ Frontend validates email + required fields
- ✅ No sensitive data (API keys) in frontend code
- ✅ CORS handled with `mode: 'no-cors'` in fetch
- ✅ All data stored in user's Google Sheets (not third-party)
- ⚠️ Google Apps Script webhook URL is public (design choice, acceptable for this use case)

---

## ⚠️ GOTCHAS FOR THE NEXT AI (Critical Issues)

### GOTCHA #1: Files are OUT OF SYNC
The `/js/` and `/presupuestador/js/` directories have DIFFERENT versions of calculator.js:
- `/js/calculator.js` = 227 lines (has logging, custom mode logic)
- `/presupuestador/js/calculator.js` = 176 lines (simplified, older)

**Which one is used?** `/presupuestador/js/` (the presupuestador app loads that)

**What to do:** Every time you modify a JS file, copy to BOTH locations. See sync checklist below.

### GOTCHA #2: pricing.json is DEAD CODE
Files `/data/pricing.json` and `/presupuestador/data/pricing.json` exist but are NOT USED.
They contain OLD PRICES (landing: 180k, vs CONFIG: 200k).
Delete them or update if you use them. Better: delete.

### GOTCHA #3: Webhook mode: 'no-cors' hides errors
The fetch to Google Apps Script uses `mode: 'no-cors'` which makes the response completely opaque.
This means: **user sees "success" even if webhook failed**.
The webhook must be monitored via Google Sheets → LOGS sheet.

### GOTCHA #4: CSS is 100% INLINE
All 54KB of CSS is inside a single `<style>` tag in presupuestador/index.html.
You can't use the CSS files in `/presupuestador/css/` — they're stubs (3 lines each).
To change styling, edit the `<style>` in the HTML directly.

### GOTCHA #5: IVA is NOT summed to total
The rule: `total = base + sections + features` (WITHOUT IVA)
IVA is calculated and displayed for information only.
If you see `total = subtotal + iva`, that's a BUG.

---

## 📌 File Sync Checklist

Whenever modifying JavaScript files, **always update both locations**:

- [ ] `presupuestador/js/main.js` ↔ `js/main.js`
- [ ] `presupuestador/js/calculator.js` ↔ `js/calculator.js`
- [ ] `presupuestador/js/form-handler.js` ↔ `js/form-handler.js`
- [ ] `presupuestador/js/email-handler.js` ↔ `js/email-handler.js`
- [ ] `presupuestador/js/storage.js` ↔ `js/storage.js`
- [ ] `presupuestador/js/ui-updater.js` ↔ `js/ui-updater.js`

Use diff or a comparison tool to verify before committing.

---

## 🚢 Deployment

- **Development:** `python -m http.server 8000`
- **Production:** GitHub Pages (or any static host)
- **No build step required**

Git commits should reference the feature/bug fixed (e.g., `fix: sync root index.html with latest commercial logic`).
