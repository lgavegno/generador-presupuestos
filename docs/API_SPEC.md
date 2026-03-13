# API SPECIFICATION - GOOGLE APPS SCRIPT WEBHOOK

**Status:** ACTIVE
**Version:** 2.2.0
**Last Updated:** Marzo 2026
**Author:** Software Developer
**Endpoint:** Google Apps Script Web App (doPost handler)

---

## 📋 OVERVIEW

El Google Apps Script actúa como middleware serverless que:
1. **Recibe** POST JSON del frontend (Fetch API, no-cors)
2. **Valida** estructura de datos y completitud
3. **Enriquece** con metadatos (timestamp, ID generado)
4. **Persiste** en Google Sheets
5. **Notifica** vía Gmail al propietario del negocio
6. **Responde** con confirmación + ID de cotización

**Costo:** $0/mes (Google Workspace free tier)

---

## 🔗 ENDPOINT

```
URL: https://script.google.com/macros/s/AKfycby9Bz6bXnt06aGHfWEAv76xKWvcc_NBaNhzO5Zijx6RYLr0aNyoH2zpoW-_YYqa0rlS/exec

METHOD: POST
Content-Type: application/json
CORS: no-cors (opaque response)
```

---

## 📥 REQUEST PAYLOAD

### Standard Mode (Cotización Estándar)

```json
{
  "timestamp": "2026-03-13T14:30:00.000Z",
  "is_custom": false,
  "customDescription": "",
  "nombre": "Juan García",
  "email": "juan@example.com",
  "telefono": "+54 9 3492 123456",
  "tipo_sitio": "landing",
  "asunto": "Nuevo Presupuesto Web - Juan García",
  "secciones_elegidas": ["Inicio/Hero", "Acerca de"],
  "funcionalidades": ["SEO", "Google Analytics"],
  "presupuesto": {
    "base": 200000,
    "secciones": 100000,
    "funcionalidades": 120000,
    "subtotal": 420000,
    "iva": 88200,
    "total": 420000
  },
  "observaciones": "Requiero diseño minimalista"
}
```

### Custom Mode (Proyectos a Medida)

```json
{
  "timestamp": "2026-03-13T14:30:00.000Z",
  "is_custom": true,
  "customDescription": "Necesito una Web App SaaS con autenticación OAuth, panel de admin y reportes en PDF. Integraciones con Stripe y SendGrid",
  "nombre": "María Rodríguez",
  "email": "maria@startup.com",
  "telefono": "+54 9 3495 555555",
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

### Request Body Field Specification

| Campo | Tipo | Required | Validación | Notas |
|-------|------|----------|-----------|-------|
| timestamp | ISO8601 | ✅ | RFC3339 format | Frontend genera: `new Date().toISOString()` |
| is_custom | Boolean | ✅ | true\|false | Controla flujo: standard vs custom |
| customDescription | String | ❌ | max 5000 chars | Solo si is_custom=true, sino vacío |
| nombre | String | ✅ | 3-100 chars | Requerido en validación frontend |
| email | String | ✅ | Valid email | Requerido, validado en frontend |
| telefono | String | ❌ | Any format | Opcional, puede ser vacío |
| tipo_sitio | Enum | ✅ | landing\|simple\|portfolio\|ecommerce\|WEB APP / CUSTOM | Si custom, DEBE ser "WEB APP / CUSTOM" |
| asunto | String | ✅ | Pattern | "Nuevo Presupuesto Web - {nombre}" o "SOLICITUD PROYECTO CUSTOM - {nombre}" |
| secciones_elegidas | Array<String> | ❌ | [] if custom | Nombres legibles (ej. "Inicio/Hero") |
| funcionalidades | Array<String> | ❌ | [] if custom | Nombres legibles (ej. "Google Analytics") |
| presupuesto.base | Number | ✅ | >= 0 | 0 si custom |
| presupuesto.secciones | Number | ✅ | >= 0 | 0 si custom |
| presupuesto.funcionalidades | Number | ✅ | >= 0 | 0 si custom |
| presupuesto.subtotal | Number | ✅ | >= 0 | sin IVA |
| presupuesto.iva | Number | ✅ | >= 0 | subtotal * 0.21 (informativo) |
| presupuesto.total | Number | ✅ | >= 0 | = subtotal (NO suma IVA) |
| observaciones | String | ❌ | max 1000 chars | Campo libre cliente |

---

## 📤 RESPONSE PAYLOAD

### Success Response (200 OK)

```json
{
  "success": true,
  "submission_id": "SUB-202603-5432",
  "message": "Cotización guardada y email enviado al propietario",
  "timestamp": "2026-03-13T14:30:05.000Z",
  "is_custom": false,
  "contact_email": "juan@example.com"
}
```

### Error Response (Bad Request)

```json
{
  "success": false,
  "error": "VALIDATION_ERROR",
  "message": "Campo requerido faltante: email",
  "timestamp": "2026-03-13T14:30:05.000Z"
}
```

---

## 🔄 PROCESSING FLOW (Google Apps Script)

### Pseudo-código del handler doPost(e)

```javascript
function doPost(e) {
  try {
    // 1. PARSE JSON
    const formData = JSON.parse(e.postData.contents);

    // 2. VALIDATE REQUIRED FIELDS
    validateFormData(formData);  // Throws if invalid

    // 3. GENERATE SUBMISSION ID
    const submissionId = generateSubmissionID();  // SUB-YYYYMM-XXXX

    // 4. APPEND TO SHEETS
    appendToSheet(formData, submissionId);

    // 5. SEND EMAIL NOTIFICATION
    sendNotificationEmail(formData, submissionId);

    // 6. LOG EVENT
    logEvent({
      submission_id: submissionId,
      event_type: "SUBMISSION_RECEIVED",
      is_custom: formData.is_custom,
      timestamp: new Date().toISOString()
    });

    // 7. RETURN SUCCESS
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      submission_id: submissionId,
      message: "Cotización guardada y email enviado al propietario",
      timestamp: new Date().toISOString(),
      is_custom: formData.is_custom,
      contact_email: formData.email
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    logEvent({
      event_type: "ERROR",
      message: error.message,
      timestamp: new Date().toISOString()
    });

    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.name,
      message: error.message,
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

---

## 💾 GOOGLE SHEETS SCHEMA (Columns A-Q)

| Col | Header | Source | Type | Notes |
|-----|--------|--------|------|-------|
| A | Timestamp | formData.timestamp | ISO8601 | `2026-03-13T14:30:00.000Z` |
| B | Nombre | formData.nombre | String | Cliente |
| C | Email | formData.email | Email | Para followup |
| D | Teléfono | formData.telefono | String | Opcional |
| E | Tipo de Sitio | formData.tipo_sitio | Enum | landing\|simple\|portfolio\|ecommerce\|WEB APP / CUSTOM |
| F | Secciones | formData.secciones_elegidas.join(", ") | String | Desglose readable |
| G | Funcionalidades | formData.funcionalidades.join(", ") | String | Desglose readable |
| H | Base ($) | formData.presupuesto.base | Number | 0 si custom |
| I | Secciones ($) | formData.presupuesto.secciones | Number | 0 si custom |
| J | Funcionalidades ($) | formData.presupuesto.funcionalidades | Number | 0 si custom |
| K | Subtotal ($) | formData.presupuesto.subtotal | Number | Sin IVA |
| L | IVA 21% ($) | formData.presupuesto.iva | Number | Informativo only |
| M | Total ($) | formData.presupuesto.total | Number | Sin IVA sumado |
| N | is_custom | formData.is_custom | Boolean | true\|false |
| O | customDescription | formData.customDescription | String | Requerimientos si custom |
| P | Observaciones | formData.observaciones \| formData.customDescription | String | Si custom, inyecta customDescription |
| Q | Asunto | formData.asunto | String | "Nuevo Presupuesto Web..." o "SOLICITUD PROYECTO CUSTOM..." |

---

## 📧 EMAIL NOTIFICATION

### Template - Standard Mode

**To:** propietario@email.com
**Subject:** Nuevo Presupuesto Web - Juan García

```
====================================
NUEVA COTIZACIÓN RECIBIDA
====================================

Fecha: 13 Mar 2026, 14:30

CLIENTE:
- Nombre: Juan García
- Email: juan@example.com
- Teléfono: +54 9 3492 123456

SELECCIÓN:
- Tipo de Sitio: Landing Page
- Secciones Extras: Acerca de
- Funcionalidades: SEO, Google Analytics

PRESUPUESTO:
- Base del Sitio: $200,000
- Secciones Extra: $100,000 (1 x $50k)
- Funcionalidades: $120,000 (2 x $60k)
- Subtotal: $420,000
- IVA 21%: $88,200 (informativo)
- TOTAL: $420,000

Observaciones: "Requiero diseño minimalista"

ID Cotización: SUB-202603-5432

====================================
Revisar en Google Sheets: [LINK]
====================================
```

### Template - Custom Mode

**To:** propietario@email.com
**Subject:** SOLICITUD PROYECTO CUSTOM - María Rodríguez

```
====================================
SOLICITUD PROYECTO A MEDIDA (CUSTOM)
====================================

Fecha: 13 Mar 2026, 14:30

CLIENTE:
- Nombre: María Rodríguez
- Email: maria@startup.com
- Teléfono: +54 9 3495 555555

DESCRIPCIÓN DEL PROYECTO:
"Necesito una Web App SaaS con autenticación OAuth,
panel de admin y reportes en PDF. Integraciones con
Stripe y SendGrid"

SLA:
✓ Contactar dentro de 24h hábiles
✓ Propuesta técnica dentro de 48h

ID Cotización: SUB-202603-5433

====================================
Revisar en Google Sheets: [LINK]
Responder a: maria@startup.com
====================================
```

---

## 🔐 SECURITY CONSIDERATIONS

### Data Validation
- ✅ JSON.parse con try/catch
- ✅ Email regex validation
- ✅ Enum validation para tipo_sitio
- ✅ String length constraints
- ✅ Number range validation

### CORS Handling
- Frontend: `mode: 'no-cors'` (opaque response)
- Backend: ContentService returns JSON
- No credentials needed (public webhook)

### Input Sanitization
- Google Sheets escapa automáticamente HTML
- Email fields sanitizados por Gmail API
- customDescription truncado a 5000 chars

### Rate Limiting
- No implementado (Google Apps Script free tier)
- Recomendación: Implementar si >1000 req/día

---

## 🧪 TESTING

### Test Standard Mode
```bash
curl -X POST https://script.google.com/macros/s/.../exec \
  -H "Content-Type: application/json" \
  -d '{
    "timestamp": "2026-03-13T14:30:00.000Z",
    "is_custom": false,
    "customDescription": "",
    "nombre": "Test User",
    "email": "test@example.com",
    "telefono": "+54 9 3492 000000",
    "tipo_sitio": "landing",
    "asunto": "Nuevo Presupuesto Web - Test User",
    "secciones_elegidas": [],
    "funcionalidades": [],
    "presupuesto": {"base": 200000, "secciones": 0, "funcionalidades": 0, "subtotal": 200000, "iva": 42000, "total": 200000},
    "observaciones": ""
  }'
```

### Test Custom Mode
```bash
curl -X POST https://script.google.com/macros/s/.../exec \
  -H "Content-Type: application/json" \
  -d '{
    "timestamp": "2026-03-13T14:30:00.000Z",
    "is_custom": true,
    "customDescription": "Test Web App con OAuth",
    "nombre": "Test Custom",
    "email": "custom@example.com",
    "telefono": "+54 9 3495 000000",
    "tipo_sitio": "WEB APP / CUSTOM",
    "asunto": "SOLICITUD PROYECTO CUSTOM - Test Custom",
    "secciones_elegidas": [],
    "funcionalidades": [],
    "presupuesto": {"base": 0, "secciones": 0, "funcionalidades": 0, "subtotal": 0, "iva": 0, "total": 0},
    "observaciones": ""
  }'
```

---

## 📊 MONITORING

### Google Sheets - Sheet "LOGS"

**Columns:**
- A: Timestamp
- B: Event Type (SUBMISSION_RECEIVED, EMAIL_SENT, ERROR, etc.)
- C: Submission ID
- D: is_custom (true/false)
- E: Message
- F: Error Details (si aplica)

### Alerts (Gmail)
- ✅ Envío exitoso → "NUEVA COTIZACIÓN RECIBIDA"
- ⚠️ Error en processing → "ERROR EN PROCESAMIENTO DE COTIZACIÓN"

---

## 🚀 DEPLOYMENT CHECKLIST

- [x] Google Apps Script creado y deployado
- [x] Endpoint URL configurado en frontend
- [x] Google Sheets creada con schema correcto
- [x] Email notifications configurado
- [x] Validaciones implementadas
- [x] Test estándar y custom completado
- [x] Documentación actualizada
- [x] Monitoreo vía LOGS sheet

---

## 📞 SLA COMERCIAL

| Modo | Contacto | Propuesta | Validez |
|------|----------|-----------|---------|
| Standard | Automático | N/A | 15 días |
| Custom | 24h máximo | 48h después entrevista | Según negociación |

---

**Related:** README.md, MOD-02-DATA-STRUCTURE.md, PROJECT_LOG.md v2.2.0
