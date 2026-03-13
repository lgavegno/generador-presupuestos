---

# MOD-02: DATA STRUCTURE SPECIFICATION

**Status:** ACTIVE
**Version:** 2.2.0
**Last Updated:** Marzo 2026
**Author:** Software Developer  

---

## 📋 OBJECTIVE

Define the complete data structure for the presupuestador system, including form fields, calculations, storage format, and API contracts.

---

## 🏗️ OVERALL DATA ARCHITECTURE

```text
Frontend (HTML/JS)
↓
Form Data Collection (45+ fields)
↓
JavaScript Processing
├─ Validation
├─ Calculation
├─ Prompt Generation
└─ Serialization
↓
Google Apps Script Webhook
├─ Receive JSON
├─ Parse & Validate
└─ Store + Email
↓
Google Sheets + Email
```

---

## 📊 PRESUPUESTADOR DATA STRUCTURE (MINIMALISTA)

### SECTION 1: Website Type
```json
{
  "website_type": "landing|simple|portfolio|ecommerce"
}
```

### SECTION 2: Sections Selected
```json
{
  "sections": [
    "hero",
    "about",
    "products",
    "gallery",
    "testimonials",
    "faq",
    "blog",
    "contact",
    "newsletter"
  ]
}
```

### SECTION 3: Features Selected
```json
{
  "features": [
    "tiendanube",
    "cart",
    "search",
    "filters",
    "multilingual",
    "seo",
    "analytics",
    "booking"
  ]
}
```

### SECTION 4: Contact Information (MINIMAL)
```json
{
  "contact": {
    "nombre": "string (required)",
    "email": "string (email, required)",
    "telefono": "string (optional)",
    "observaciones": "string (optional)"
  }
}
```

---

## 💰 PRESUPUESTO CALCULATION

### Standard Mode (Cotización Estándar)
```javascript
BASE_PRICES = {
  landing: 200000,
  simple: 250000,
  portfolio: 350000,
  ecommerce: 600000
}

SECTION_PRICE = 50000
FEATURE_PRICE = 60000
TAX_RATE = 0.21

// Base Included Sections Logic:
// 'landing': ['hero']
// 'simple': ['hero']
// 'portfolio': ['hero', 'about']
// 'ecommerce': ['hero', 'about', 'products']
// These sections are marked automatically and DO NOT sum to sections_count.

// Calculation:
subtotal = base_price + (chargeable_sections_count * 50000) + (features_count * 60000)
iva = subtotal * 0.21  // Informational ONLY (NOT summed to total)
total_ars = subtotal   // IVA NOT included in final total
```

### Custom Mode (Proyectos a Medida - Web Apps/SaaS)
```javascript
// Triggered by: document.getElementById('custom-project-desc').value.trim().length > 0

is_custom = true
tipo_sitio = "WEB APP / CUSTOM"  // Automatic assignment
customDescription = textarea_content  // CamelCase required for backend
presupuesto = {
  base: 0,
  secciones: 0,
  funcionalidades: 0,
  subtotal: 0,
  iva: 0,
  total: 0
}
// Cotización realizada tras entrevista técnica (SLA: 24h contacto, 48h propuesta)
```

---

## 📝 COMPLETE PRESUPUESTADOR SUBMISSION
```json
{
  "timestamp": "2026-03-05T14:30:00Z",
  "submission_id": "SUB-202603-1234",
  
  "website_type": "ecommerce",
  "sections": ["hero", "products", "testimonials", "contacto"],
  "features": ["seo", "analytics"],
  
  "contact": {
    "nombre": "Juan García",
    "email": "juan@email.com",
    "telefono": "+54 3492 123456",
    "observaciones": "Quiero algo moderno"
  },
  
  "presupuesto": {
    "precio_base": 500000,
    "precio_secciones": 160000,
    "precio_funcionalidades": 100000,
    "subtotal_ars": 760000,
    "impuesto_iva": 159600,
    "total_ars": 919600,
    "total_usd": 2554
  },
  
  "metadata": {
    "user_agent": "Mozilla/5.0...",
    "submission_source": "presupuestador",
    "form_version": "1.0"
  }
}
```

---

## 🔄 CALCULATION RULES

### JavaScript Implementation
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
  IVA: 0.21,
  TIPO_CAMBIO: 360
};

function updatePresupuesto() {
  const selectedType = document.getElementById('tipo_sitio')?.value;
  const customDesc = document.getElementById('custom-project-desc')?.value.trim() || '';
  const isCustom = customDesc.length > 0;

  if (!selectedType && !isCustom) {
    resetPresupuesto();
    return;
  }

  if (isCustom) {
    resetToCustomMode();
    return;
  }

  const basePrecio = CONFIG.PRESUPUESTO_BASE[selectedType];
  const SECCIONES_INCLUIDAS = {
    'landing': ['hero'],
    'simple': ['hero'],
    'portfolio': ['hero', 'about'],
    'ecommerce': ['hero', 'about', 'products']
  };

  const incluidasActuales = SECCIONES_INCLUIDAS[selectedType] || [];
  const sectionCheckboxes = document.querySelectorAll('input[name="sections"]:checked');
  const state.sections = Array.from(sectionCheckboxes).map(el => el.value);

  const seccionesCobrables = state.sections.filter(sec => !incluidasActuales.includes(sec)).length;
  const seccionesPrecio = seccionesCobrables * CONFIG.PRECIO_SECCION;

  const featureCheckboxes = document.querySelectorAll('input[name="features"]:checked');
  const funcionalidadesPrecio = featureCheckboxes.length * CONFIG.PRECIO_FUNCIONALIDAD;

  const subtotal = basePrecio + seccionesPrecio + funcionalidadesPrecio;
  const iva = subtotal * CONFIG.IVA;
  const total = subtotal;  // IVA NOT summed to total
  const totalUSD = total / CONFIG.TIPO_CAMBIO;

  state.presupuesto = {
    base: basePrecio,
    secciones: seccionesPrecio,
    funcionalidades: funcionalidadesPrecio,
    subtotal,
    iva,
    total,
    totalUSD,
    tieneIva: true
  };

  updateUI();
  saveToStorage();
}
```

---

## 💾 UTILITY FUNCTIONS

### resetPresupuesto()
Limpia el presupuesto a ceros.
```javascript
function resetPresupuesto() {
  state.presupuesto = {
    base: 0,
    secciones: 0,
    funcionalidades: 0,
    subtotal: 0,
    iva: 0,
    total: 0,
    tieneIva: false
  };
  updateUI();
}
```

### formatCurrency(number)
Formatea números a ARS con separadores de miles.
```javascript
function formatCurrency(num) {
  return '$' + num.toLocaleString('es-AR');
}
```

### localStorage Persistence
Datos persisten en navegador:
- Key: `presupuesto_state`
- Restaura al recargar página
- JSON serializado

---

## 💾 STORAGE FORMAT

### localStorage (Client-side)
```json
{
  "presupuesto_state": {
    "websiteType": "ecommerce",
    "sections": ["hero", "products"],
    "features": ["seo"],
    "presupuesto": { /* calculations */ }
  }
}
```

### Google Sheets (Server-side)
45+ columns with complete submission data

### Email Format
Structured HTML with all sections organized

---

## 🔐 DATA VALIDATION RULES

| Field | Type | Validation | Required |
|-------|------|-----------|----------|
| nombre | string | min 3 chars, max 100 | YES |
| email | email | valid format | YES |
| telefono | string | optional | NO |
| website_type | enum | [landing, simple, portfolio, ecommerce] | YES |

---

## 📊 Google Sheets Column Mapping (A-Q)

| Col | Name | Source | Type | Notes |
|-----|------|--------|------|-------|
| A | Timestamp | formData.timestamp | ISO8601 | YYYY-MM-DDTHH:mm:ssZ |
| B | Nombre | formData.nombre | String | Required |
| C | Email | formData.email | Email | Required + Validated |
| D | Teléfono | formData.telefono | String | Optional |
| E | Tipo de Sitio | formData.tipo_sitio | Enum | landing\|simple\|portfolio\|ecommerce\|WEB APP / CUSTOM |
| F | Secciones | formData.secciones_elegidas | Array<String> | Comma-separated |
| G | Funcionalidades | formData.funcionalidades | Array<String> | Comma-separated |
| H | Base ($) | formData.presupuesto.base | Number | 0 if custom |
| I | Secciones ($) | formData.presupuesto.secciones | Number | 0 if custom |
| J | Funcionalidades ($) | formData.presupuesto.funcionalidades | Number | 0 if custom |
| K | Subtotal ($) | formData.presupuesto.subtotal | Number | Without IVA |
| L | IVA 21% ($) | formData.presupuesto.iva | Number | Informational only |
| M | Total ($) | formData.presupuesto.total | Number | WITHOUT IVA |
| N | is_custom | formData.is_custom | Boolean | true\|false |
| O | customDescription | formData.customDescription | String | CamelCase - Web App requirements |
| P | Observaciones | formData.observaciones | String | Custom notes (if custom, injects customDescription) |
| Q | Asunto | formData.asunto | String | "Nuevo Presupuesto Web" or "SOLICITUD PROYECTO CUSTOM" |

---

## 🔗 Custom Mode Activation Logic

### Frontend Detection
```javascript
const customDesc = document.getElementById('custom-project-desc')?.value.trim() || '';
const isCustom = customDesc.length > 0;

// If isCustom:
// 1. state.isCustom = true
// 2. state.websiteType = null
// 3. Hide all presupuesto breakdown rows
// 4. Show "A Medida" in total
// 5. Change button to "📅 Solicitar Entrevista"
// 6. formData.customDescription = customDesc (CamelCase)
// 7. formData.tipo_sitio = "WEB APP / CUSTOM"
// 8. formData.presupuesto = all zeros
```

### Backend Reception (Google Apps Script)
```javascript
// In doPost(e):
const formData = JSON.parse(e.postData.contents);

if (formData.is_custom) {
  // Route to custom project handler
  // Store customDescription in column O
  // Inject customDescription into column P (Observaciones)
  // Send SLA email: "Contacto en 24h hábiles"
  // Set tipo_sitio = "WEB APP / CUSTOM" in column E
}
```

---

## 📤 API CONTRACT (Google Apps Script Webhook)

### Request (Standard Mode)
```http
POST https://script.google.com/macros/s/AKfycby9Bz6bXnt06aGHfWEAv76xKWvcc_NBaNhzO5Zijx6RYLr0aNyoH2zpoW-_YYqa0rlS/exec
Content-Type: application/json

{
  "timestamp": "2026-03-05T14:30:00Z",
  "is_custom": false,
  "customDescription": "",
  "nombre": "Juan García",
  "email": "juan@email.com",
  "telefono": "+54 3492 123456",
  "tipo_sitio": "ecommerce",
  "asunto": "Nuevo Presupuesto Web - Juan García",
  "secciones_elegidas": ["hero", "productos", "testimonios"],
  "funcionalidades": ["seo", "analytics"],
  "presupuesto": {
    "base": 600000,
    "secciones": 150000,
    "funcionalidades": 120000,
    "subtotal": 870000,
    "iva": 182700,
    "total": 870000
  },
  "observaciones": "Quiero diseño moderno"
}
```

### Request (Custom Mode - Web App/SaaS)
```http
POST https://script.google.com/macros/s/AKfycby9Bz6bXnt06aGHfWEAv76xKWvcc_NBaNhzO5Zijx6RYLr0aNyoH2zpoW-_YYqa0rlS/exec
Content-Type: application/json

{
  "timestamp": "2026-03-05T14:30:00Z",
  "is_custom": true,
  "customDescription": "Necesito un SaaS con autenticación OAuth, panel admin y reportes PDF",
  "nombre": "María Rodríguez",
  "email": "maria@startup.com",
  "telefono": "+54 3495 555555",
  "tipo_sitio": "WEB APP / CUSTOM",
  "asunto": "SOLICITUD PROYECTO CUSTOM - María Rodríguez",
  "secciones_elegidas": [],
  "funcionalidades": [],
  "presupuesto": {
    "base": 0,
    "secciones": 0,
    "funcionalidades": 0,
    "subtotal": 0,
    "iva": 0,
    "total": 0
  },
  "observaciones": ""
}
```

### Response
```json
{
  "success": true,
  "submission_id": "SUB-202603-1234",
  "message": "Cotización guardada y email enviado",
  "timestamp": "2026-03-05T14:30:05Z"
}
```

---

## 🔄 DATA FLOW

```text
User fills form (HTML)
↓
JavaScript collects data
↓
Calculate presupuesto
↓
Validate data
↓
Serialize to JSON
↓
POST to webhook (fetch API)
↓
Google Apps Script receives
↓
Parse JSON
↓
Save to Google Sheets
↓
Send email
↓
Return success response
↓
Show confirmation (JavaScript)
```

---

## 📊 DATA EXAMPLE
```json
{
  "timestamp": "2026-03-05T14:30:00Z",
  "submission_id": "SUB-202603-5432",
  
  "nombre": "Juan García",
  "email": "juan@example.com",
  "telefono": "+54 3492 123456",
  "website_type": "ecommerce",
  "secciones_elegidas": ["hero", "productos", "testimonios", "contacto"],
  "funcionalidades": ["seo", "analytics"],
  "observaciones": "Quiero que sea colorido",
  
  "presupuesto": {
    "precio_base": 500000,
    "precio_secciones": 160000,
    "precio_funcionalidades": 100000,
    "subtotal_ars": 760000,
    "impuesto": 159600,
    "total_ars": 919600,
    "total_usd": 2554
  }
}
```

---

## ✅ ACCEPTANCE CRITERIA

- [ ] All form fields captured correctly
- [ ] Calculations accurate (ARS + USD)
- [ ] Data serializes to valid JSON
- [ ] Webhook receives complete data
- [ ] Data saves to Google Sheets correctly
- [ ] Email includes all data sections

---

**Related:** MOD-01, MOD-03, MOD-06
