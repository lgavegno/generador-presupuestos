---

# MOD-02: DATA STRUCTURE SPECIFICATION

**Status:** ACTIVE  
**Version:** 1.0  
**Last Updated:** Marzo 2026  

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
```javascript
BASE_PRICES = {
  landing: 180000,
  simple: 200000,
  portfolio: 300000,
  ecommerce: 500000
}

SECTION_PRICE = 40000
FEATURE_PRICE = 50000
TAX_RATE = 0.21
EXCHANGE_RATE = 360 // ARS to USD

// Calculation:
subtotal = base_price + (sections_count * 40000) + (features_count * 50000)
tax = subtotal * 0.21
total_ars = subtotal + tax
total_usd = total_ars / 360
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
    landing: 180000,
    simple: 200000,
    portfolio: 300000,
    ecommerce: 500000
  },
  PRECIO_SECCION: 40000,
  PRECIO_FUNCIONALIDAD: 50000,
  IVA: 0.21,
  TIPO_CAMBIO: 360
};

function calculatePresupuesto(websiteType, sectionsCount, featuresCount) {
  const basePrecio = CONFIG.PRESUPUESTO_BASE[websiteType];
  const seccionesPrecio = sectionsCount * CONFIG.PRECIO_SECCION;
  const funcionalidadesPrecio = featuresCount * CONFIG.PRECIO_FUNCIONALIDAD;
  
  const subtotal = basePrecio + seccionesPrecio + funcionalidadesPrecio;
  const iva = subtotal * CONFIG.IVA;
  const total = subtotal + iva;
  const totalUSD = total / CONFIG.TIPO_CAMBIO;
  
  return {
    basePrecio,
    seccionesPrecio,
    funcionalidadesPrecio,
    subtotal,
    iva,
    total,
    totalUSD
  };
}
```

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

## 📤 API CONTRACT (Google Apps Script Webhook)

### Request
```http
POST /macros/d/[ID]/usercontent
Content-Type: application/json

{
  "timestamp": "2026-03-05T14:30:00Z",
  "website_type": "ecommerce",
  "sections": ["..."],
  "features": ["..."],
  "contact": {"..."},
  "presupuesto": {"..."},
  "metadata": {"..."}
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
