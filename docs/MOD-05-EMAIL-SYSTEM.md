# MOD-05: EMAIL SYSTEM SPECIFICATION

**Status:** ACTIVE  
**Version:** 1.0  
**Last Updated:** Marzo 2026  
**Author:** Leo (OmniStock SDD Team)  

---

## 📋 OBJECTIVE

Define the architecture, requirements, and specifications for the email notification system that sends form submissions to **osvojag@gmail.com** automatically via Google Sheets + Apps Script.

**VERSION:** Minimalista (4 campos: nombre, email, teléfono, observaciones)
**STATUS:** Pendiente webhook setup
**SCOPE:** Presupuestador lead magnet (no formulario completo de 11 secciones)

---

## 🎯 REQUIREMENTS

### Functional Requirements (FR)

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-001 | System must send email to osvojag@gmail.com on form submission | CRITICAL | PENDING |
| FR-002 | Email must include ONLY minimal form data (4 fields) | CRITICAL | PENDING |
| FR-003 | Email must include calculated presupuesto (ARS + USD) | CRITICAL | PENDING |
| FR-004 | Email must include generated WordPress prompt | HIGH | PENDING |
| FR-005 | Data must be saved to Google Sheets simultaneously | CRITICAL | PENDING |
| FR-006 | Email must be human-readable and professional | HIGH | PENDING |
| FR-007 | Email must be sent within 5 seconds of submission | MEDIUM | PENDING |
| FR-008 | System must log all submissions in Google Sheets | HIGH | PENDING |
| FR-009 | User must see confirmation message after submission | MEDIUM | PENDING |
| FR-010 | System must handle errors gracefully | MEDIUM | PENDING |

### Non-Functional Requirements (NFR)

| ID | Requirement | Status |
|----|-------------|--------|
| NFR-001 | Zero cost (Google Sheets + Apps Script free tier) | PENDING |
| NFR-002 | No backend infrastructure required | PENDING |
| NFR-003 | Ultra-simple setup (10 minutes max) | PENDING |
| NFR-004 | Works entirely within GitHub Pages + Google | PENDING |
| NFR-005 | Reliable (99%+ uptime via Google) | PENDING |
| NFR-006 | Secure (API keys not exposed in frontend) | PENDING |

---

## 🏗️ ARCHITECTURE

### System Flow

```
┌─────────────────────────┐
│   GITHUB PAGES          │
│   (Frontend)            │
│                         │
│ - index.html            │
│ - css/                  │
│ - js/form-handler.js    │
└────────────┬────────────┘
             │
      User clicks SUBMIT
             │
             ▼
    ┌────────────────┐
    │ JavaScript     │
    │ validates data │
    │ generates      │
    │ presupuesto    │
    │ creates prompt │
    └────────┬───────┘
             │
             ▼
    ┌────────────────────────────┐
    │ Google Apps Script         │
    │ WebApp (Webhook)           │
    │                            │
    │ URL: deployed webapp URL   │
    └────────┬───────────────────┘
             │
      ┌──────┴──────┐
      │             │
      ▼             ▼
  ┌─────────┐  ┌──────────────┐
  │ Google  │  │ Google       │
  │ Sheets  │  │ Gmail/Resend │
  │ (Save)  │  │ (Email)      │
  └─────────┘  └──────────────┘
      │             │
      └─────┬───────┘
            │
            ▼
      ┌──────────────┐
      │ User Email   │
      │ osvojag@     │
      │ gmail.com    │
      └──────────────┘
```

### Components

#### Frontend (JavaScript)
- **Responsibility:** Collect data, validate, format
- **Technology:** Vanilla JS (ES6+)
- **Key Functions:**
  - `collectFormData()` - Recopila datos de 11 secciones
  - `calculatePresupuesto()` - Calcula total en ARS/USD
  - `generatePrompt()` - Genera prompt para WordPress AI
  - `sendToGoogleSheets()` - Envía webhook a Apps Script

#### Backend (Google Apps Script)
- **Responsibility:** Receive data, save to Sheets, send email
- **Technology:** Google Apps Script (JavaScript en Google)
- **Key Functions:**
  - `doPost(e)` - Webhook endpoint
  - `saveToSheet(data)` - Guarda en Google Sheets
  - `sendEmail(data)` - Envía email a användare@gmail.com
  - `formatEmailBody(data)` - Formatea email HTML

#### Data Storage (Google Sheets)
- **Responsibility:** Persist all form submissions
- **Structure:** 1 row = 1 submission
- **Columns:** (Ver MOD-06)

---

## 📊 DATA STRUCTURE (MINIMALISTA)

### Data Sent from Frontend
```javascript
{
  timestamp: "2026-03-05T14:30:00Z",
  nombre: "Juan García",
  email: "juan@email.com",
  telefono: "+54 3492 123456",
  website_type: "simple",
  secciones_elegidas: ["hero", "products"],
  funcionalidades: ["seo"],
  presupuesto: {
    precio_base: 200000,
    precio_secciones: 80000,
    precio_funcionalidades: 50000,
    subtotal_ars: 330000,
    impuesto: 69300,
    total_ars: 399300,
    tieneIva: true
  },
  observaciones: "Quiero algo moderno"
}
```

**NOTA:** Versión minimalista (4 campos contacto)
**NO incluye:** DNI, fiscal, domicilio, redes sociales

---

## 🚀 SUBMISSION FLOW

### Step-by-Step

1. **User completes form** (11 sections)
   - All validations pass
   - Data ready in JavaScript object

2. **User clicks "Enviar Cotización"**
   - JavaScript collects all form data
   - Calculates presupuesto dynamically
   - Generates WordPress prompt
   - Calls `sendToGoogleSheets(data)`

3. **JavaScript sends POST to Google Apps Script**
   ```javascript
   fetch(GOOGLE_SCRIPT_URL, {
     method: 'POST',
     body: JSON.stringify(formData)
   })
   ```

4. **Google Apps Script receives webhook**
   - `doPost(e)` function triggered
   - Validates data
   - Saves to Google Sheets (Row N+1)
   - Sends email to osvojag@gmail.com
   - Returns success response

5. **User sees confirmation**
   - "✓ Cotización enviada"
   - Email received in osvojag@gmail.com (< 5 sec)
   - Data saved in Google Sheets (< 5 sec)

---

## 📧 EMAIL FORMAT

### Email Structure

```
TO: osvojag@gmail.com
FROM: Google Script <[email protected]>
SUBJECT: 🎯 NUEVA COTIZACIÓN - [NOMBRE CLIENTE]

────────────────────────────────────

BRIEFING RÁPIDO
═══════════════════════════════════

Cliente: Juan García
Email: juan@email.com
Teléfono: +54 3492 123456
Fecha: 2026-03-05 14:30

COTIZACIÓN SOLICITADA
═══════════════════════════════════

Tipo Sitio: Sitio Simple (3-5 pág)
Secciones: Hero, Productos, Testimonios, Contacto
Funcionalidades: SEO, Analytics

PRESUPUESTO
═══════════════════════════════════

Sitio Web Simple: $200.000 ARS
Secciones (4 x $40k): +$160.000 ARS
Funcionalidades (2 x $50k): +$100.000 ARS
─────────────────────────────────
Subtotal: $460.000 ARS
Impuesto (21%): +$96.600 ARS
═════════════════════════════════════
TOTAL: $556.600 ARS
Equivalente: ~$1.545 USD

DATOS COMPLETOS
═══════════════════════════════════

[Todas las 11 secciones listadas]

INFORMACIÓN DEL NEGOCIO
═══════════════════════════════════

[Datos del cliente]

PREFERENCIAS DE DISEÑO
═══════════════════════════════════

Paleta: Tropical Vibrante
Tipografía: Verdana
Observaciones: [Del cliente]

ESPECIFICACIONES TÉCNICAS
═══════════════════════════════════

[Datos técnicos completos]

PROMPT PARA WORDPRESS AI
═══════════════════════════════════

[PROMPT MEGA DETALLADO - Copia y pega en WordPress AI]

────────────────────────────────────

📊 Submission ID: SUB-2026-001
🔗 Datos también guardados en Google Sheets
⏰ Tiempo procesamiento: < 5 segundos

────────────────────────────────────

INSTRUCCIÓN:
Si necesitas actualizar presupuesto, 
contacta al cliente por: [email/whatsapp]

════════════════════════════════════
```

---

## 🔐 SECURITY CONSIDERATIONS

### API Key Management
- **Google Script URL:** Public (no secrets)
- **Validation:** Server-side in Apps Script
- **Rate Limiting:** Google provides limits
- **No sensitive data exposed** in frontend

### Data Protection
- HTTPS via Google (automatic)
- No credentials stored in GitHub
- All data encrypted in Google
- GDPR-compliant (CCPA-compliant)

### Error Handling
- Try/catch in JavaScript
- Try/catch in Apps Script
- User sees friendly error message
- Admin gets error log in Sheets

---

## 📈 MONITORING & LOGGING

### What Gets Logged

**Google Sheets will contain:**
- Timestamp of submission
- All form data (11 sections)
- Calculated presupuesto
- Email sent? (Yes/No)
- Error messages (if any)
- User agent
- Submission ID

### Metrics to Track

- Total submissions/day
- Avg presupuesto value
- Most popular: tipo_sitio
- Most popular: secciones
- Most popular: funcionalidades
- Email delivery rate (should be 100%)

---

## 🔄 UPDATE POLICY

### When to update MOD-05:

- Major changes to email format
- New validations added
- Security improvements
- Architecture changes

### When to create new PLAN:

- Implementation phase
- Testing phase
- Deployment phase
- Monitoring phase

---

## 📝 ACCEPTANCE CRITERIA

### System is ready when:

- [ ] Form data successfully saved to Google Sheets
- [ ] Email received at osvojag@gmail.com within 5 seconds
- [ ] Email includes all 11 sections of form
- [ ] Email includes calculated presupuesto
- [ ] Email includes generated WordPress prompt
- [ ] User sees confirmation message
- [ ] Error messages display gracefully
- [ ] System handles 100+ submissions without issues
- [ ] No personal data exposed in frontend
- [ ] Google Sheets has proper backup

---

## 🚀 NEXT STEPS

1. Create MOD-06-GOOGLE-SHEETS-INTEGRATION.md
2. Create PLAN-002-EMAIL-IMPLEMENTATION.md
3. Write Apps Script code
4. Test end-to-end
5. Deploy to production

---

**Version Control:**
- v1.0: Initial specification (SDD)
- [Future versions tracked here]

**Related Documents:**
- MOD-01-REQUIREMENTS.md
- MOD-02-DATA-STRUCTURE.md
- MOD-06-GOOGLE-SHEETS-INTEGRATION.md
- PLAN-002-EMAIL-IMPLEMENTATION.md
