# MOD-06: GOOGLE SHEETS INTEGRATION SPECIFICATION

**Status:** ACTIVE  
**Version:** 1.0  
**Last Updated:** Marzo 2026  
**Author:** Leo (OmniStock SDD Team)  

---

## 📋 OBJECTIVE

Define the Google Sheets structure, Apps Script code, and integration points for storing all form submissions and triggering automatic emails.

---

## 📊 GOOGLE SHEETS STRUCTURE

### Spreadsheet Overview

**Name:** `Cotizaciones-Generador-Presupuestos`

**Sheets (tabs):**
1. **SUBMISSIONS** (Main data)
2. **STATISTICS** (Automatic summaries)
3. **TEMPLATE** (Reference data)
4. **LOGS** (Errors/debugging)

---

## 🔲 SHEET 1: SUBMISSIONS

### Column Structure (A to Z and beyond)

| # | Column | Type | Description | Example |
|----|--------|------|-------------|---------|
| A | Timestamp | DateTime | When submitted | 2026-03-05 14:30:00 |
| B | Submission_ID | Text | Unique identifier | SUB-2026-001 |
| C | Nombre | Text | Full name | Juan García |
| D | Email | Email | Contact email | juan@email.com |
| E | Telefono | Text | Phone number | +54 3492 123456 |
| F | DNI | Text | Documento | 12345678 |
| G | Nombre_Comercial | Text | Business name | JG Negocios |
| H | AFIP_Condition | Text | Fiscal status | Monotributista |
| I | CUIT | Text | CUIT number | 27123456789 |
| J | Rubro | Text | Business category | E-commerce |
| K | Descripcion_Producto | Text | Product description | [Long text] |
| L | Horarios | Text | Business hours | 9 AM - 6 PM |
| M | Sitio_Web_Existente | Text | Current website | www.ejemplo.com |
| N | Instagram | Text | Social handle | @juangarcia |
| O | Facebook | Text | Facebook page | JG Negocios |
| P | WhatsApp | Text | WhatsApp number | +54 3492 123456 |
| Q | Peso_Producto | Decimal | Product weight (kg) | 2.5 |
| R | Dimensiones | Text | Product size | 50x30x20cm |
| S | Precio_Venta | Currency | Product price (ARS) | 45000 |
| T | Stock_Inicial | Number | Initial stock | 100 |
| U | Medios_Cobro | Text | Payment methods | Pago Nube, Mercado Pago |
| V | Medios_Envio | Text | Shipping methods | Correo, Andreani |
| W | Provincia | Text | Province | Santa Fe |
| X | Ciudad | Text | City | Rafaela |
| Y | Banco_Preferido | Text | Preferred bank | BBVA |
| Z | Color_Paleta | Text | Color palette chosen | Tropical Vibrante |
| AA | Tipografia_Elegida | Text | Typography choice | Verdana |
| AB | Tipo_Sitio | Text | Website type | Sitio Simple |
| AC | Secciones_Elegidas | Text | Selected sections | Hero, Productos, Testimonios |
| AD | Funcionalidades | Text | Selected features | SEO, Analytics |
| AE | Observaciones_Colores | Text | Color adjustments | Quiero más verde |
| AF | Observaciones_Sitio | Text | Website notes | Minimalista |
| AG | Comentarios_Generales | Text | General comments | [Text] |
| AH | Precio_Base | Currency | Base price (ARS) | 200000 |
| AI | Precio_Secciones | Currency | Sections price (ARS) | 160000 |
| AJ | Precio_Funcionalidades | Currency | Features price (ARS) | 100000 |
| AK | Subtotal_ARS | Currency | Subtotal (ARS) | 460000 |
| AL | Impuesto_21 | Currency | Tax 21% (ARS) | 96600 |
| AM | Total_ARS | Currency | Total (ARS) | 556600 |
| AN | Total_USD | Currency | Total (USD approx) | 1545 |
| AO | Prompt_WordPress | Text (long) | Generated prompt | [MEGA PROMPT] |
| AP | Email_Enviado | Boolean | Email sent? | TRUE |
| AQ | Error_Message | Text | If any | [Error details] |
| AR | User_Agent | Text | Browser info | Mozilla/5.0... |
| AS | Status | Text | Processing status | COMPLETED |

### Data Validation Rules

```
- Timestamp: AUTO (Google Sheets NOW())
- Submission_ID: AUTO (=CONCATENATE("SUB-",YEAR(A2),"-",ROW(A2)))
- Email: Must be valid email
- Telefono: Must start with +54
- DNI: Numeric only
- Precio_*: Auto calculated
- Total_*: Auto calculated
- Email_Enviado: TRUE/FALSE (AUTO from Apps Script)
- Status: COMPLETED / ERROR / PENDING
```

---

## 🔲 SHEET 2: STATISTICS

### Auto-calculated metrics

```
TOTAL COTIZACIONES:
=COUNTA(SUBMISSIONS!A:A)-1

PROMEDIO PRESUPUESTO (ARS):
=AVERAGE(SUBMISSIONS!AM:AM)

PROMEDIO PRESUPUESTO (USD):
=AVERAGE(SUBMISSIONS!AN:AN)

DISTRIBUCIÓN POR TIPO SITIO:
Landing: =COUNTIF(SUBMISSIONS!AB:AB,"Landing Page")
Simple: =COUNTIF(SUBMISSIONS!AB:AB,"Sitio Simple")
Portfolio: =COUNTIF(SUBMISSIONS!AB:AB,"Portfolio")
E-Commerce: =COUNTIF(SUBMISSIONS!AB:AB,"E-Commerce")

SECCIÓN MÁS POPULAR:
[Pivot table o COUNTIF para cada sección]

EMAIL SUCCESS RATE:
=COUNTIF(SUBMISSIONS!AP:AP,TRUE)/COUNTA(SUBMISSIONS!A:A)-1

ÚLTIMAS 10 COTIZACIONES:
[Query que trae últimos 10 rows]
```

---

## 🔲 SHEET 3: TEMPLATE

Reference data for the system

```
TIPOS_SITIO:
Landing Page | $180,000 ARS
Sitio Simple | $200,000 ARS
Portfolio | $300,000 ARS
E-Commerce | $500,000 ARS

SECCIONES (precio cada una): $40,000 ARS
- Hero/Header
- Acerca de
- Productos
- Galería
- Testimonios
- FAQ
- Blog
- Contacto
- Newsletter
- Equipo

FUNCIONALIDADES (precio cada una): $50,000 ARS
- Integración Tienda Nube
- Carrito de compras
- Búsqueda avanzada
- Sistema de filtros
- Múltiples idiomas
- Optimización SEO
- Analytics
- Sistema de reservas

PALETAS (11):
- Clásica Elegante
- Naturaleza Fresca
- Atardecer Cálido
- Vibrante Moderno
- Minimalista Premium
- Tropical Vibrante
- Corporativo Profesional
- Artístico Sofisticado
- Oceánico Profundo
- Retro Vintage
- Neón Futuro

TIPOGRAFÍAS (18):
[Lista de 18 tipografías]
```

---

## 🔲 SHEET 4: LOGS

For debugging and monitoring

```
Column A: Timestamp
Column B: Submission_ID
Column C: Event Type (SUBMISSION_RECEIVED, EMAIL_SENT, ERROR, etc)
Column D: Message
Column E: Status (SUCCESS, FAILED)
Column F: Error Details (if any)
```

---

## 🔧 GOOGLE APPS SCRIPT CODE

### File: `Code.gs`

```javascript
// ═══════════════════════════════════════════════════════════
// GENERADOR DE PRESUPUESTOS - GOOGLE APPS SCRIPT
// ═══════════════════════════════════════════════════════════

const SHEET_ID = "YOUR_SHEET_ID_HERE"; // Will be auto-filled
const SHEET_NAME = "SUBMISSIONS";
const EMAIL_TO = "osvojag@gmail.com";

// ───────────────────────────────────────────────────────────
// 1. WEBHOOK HANDLER (Frontend sends data here)
// ───────────────────────────────────────────────────────────

function doPost(e) {
  try {
    // Parse data from frontend
    const data = JSON.parse(e.postData.contents);
    
    // Add metadata
    data.timestamp = new Date();
    data.submission_id = generateSubmissionId();
    data.status = "COMPLETED";
    
    // Save to Google Sheets
    const saveResult = saveToSheet(data);
    
    // Send email
    const emailResult = sendEmailNotification(data);
    
    // Log event
    logEvent(data.submission_id, "SUBMISSION_RECEIVED", "Data saved", "SUCCESS");
    
    // Return success
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        submission_id: data.submission_id,
        message: "Cotización guardada y email enviado"
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch(error) {
    // Log error
    logEvent("UNKNOWN", "ERROR", error.toString(), "FAILED");
    
    // Return error
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ───────────────────────────────────────────────────────────
// 2. SAVE TO GOOGLE SHEETS
// ───────────────────────────────────────────────────────────

function saveToSheet(data) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    
    // Prepare row data (matching column order from MOD-06)
    const row = [
      data.timestamp,
      data.submission_id,
      data.nombre || "",
      data.email || "",
      data.telefono || "",
      data.dni || "",
      data.nombre_comercial || "",
      data.afip_condition || "",
      data.cuit || "",
      data.rubro || "",
      data.descripcion_producto || "",
      data.horarios || "",
      data.sitio_web_existente || "",
      data.instagram || "",
      data.facebook || "",
      data.whatsapp || "",
      data.peso_producto || "",
      data.dimensiones || "",
      data.precio_venta || "",
      data.stock_inicial || "",
      data.medios_cobro || "",
      data.medios_envio || "",
      data.provincia || "",
      data.ciudad || "",
      data.banco_preferido || "",
      data.color_paleta || "",
      data.tipografia_elegida || "",
      data.tipo_sitio || "",
      (data.secciones_elegidas || []).join(", "),
      (data.funcionalidades || []).join(", "),
      data.observaciones_colores || "",
      data.observaciones_sitio || "",
      data.comentarios_generales || "",
      data.presupuesto?.precio_base || 0,
      data.presupuesto?.precio_secciones || 0,
      data.presupuesto?.precio_funcionalidades || 0,
      data.presupuesto?.subtotal_ars || 0,
      data.presupuesto?.impuesto_21 || 0,
      data.presupuesto?.total_ars || 0,
      data.presupuesto?.total_usd || 0,
      data.prompt_wordpress || "",
      true, // Email sent
      "", // Error message
      e?.userAgent || ""
    ];
    
    // Append row to sheet
    sheet.appendRow(row);
    
    return { success: true, row: sheet.getLastRow() };
    
  } catch(error) {
    throw new Error("Error saving to sheet: " + error.toString());
  }
}

// ───────────────────────────────────────────────────────────
// 3. SEND EMAIL
// ───────────────────────────────────────────────────────────

function sendEmailNotification(data) {
  try {
    const subject = `🎯 NUEVA COTIZACIÓN - ${data.nombre || "Cliente"}`;
    const body = formatEmailBody(data);
    
    MailApp.sendEmail(EMAIL_TO, subject, body, {
      htmlBody: body
    });
    
    return { success: true, email: EMAIL_TO };
    
  } catch(error) {
    throw new Error("Error sending email: " + error.toString());
  }
}

// ───────────────────────────────────────────────────────────
// 4. FORMAT EMAIL BODY (HTML)
// ───────────────────────────────────────────────────────────

function formatEmailBody(data) {
  const p = data.presupuesto;
  
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; color: #333; }
    .header { background: #1f4e79; color: white; padding: 20px; border-radius: 5px; }
    .section { margin: 20px 0; padding: 15px; background: #f9f9f9; border-left: 4px solid #1f7950; }
    .label { font-weight: bold; color: #1f4e79; }
    .price { font-size: 18px; font-weight: bold; color: #1f7950; }
    table { width: 100%; border-collapse: collapse; }
    td { padding: 8px; border-bottom: 1px solid #eee; }
  </style>
</head>
<body>

<div class="header">
  <h2>🎯 NUEVA COTIZACIÓN RECIBIDA</h2>
  <p>ID: ${data.submission_id}</p>
</div>

<div class="section">
  <h3>👤 INFORMACIÓN DEL CLIENTE</h3>
  <table>
    <tr><td class="label">Nombre:</td><td>${data.nombre}</td></tr>
    <tr><td class="label">Email:</td><td>${data.email}</td></tr>
    <tr><td class="label">Teléfono:</td><td>${data.telefono}</td></tr>
    <tr><td class="label">DNI:</td><td>${data.dni}</td></tr>
  </table>
</div>

<div class="section">
  <h3>🏢 INFORMACIÓN DEL NEGOCIO</h3>
  <table>
    <tr><td class="label">Nombre Comercial:</td><td>${data.nombre_comercial}</td></tr>
    <tr><td class="label">Rubro:</td><td>${data.rubro}</td></tr>
    <tr><td class="label">Descripción:</td><td>${data.descripcion_producto}</td></tr>
    <tr><td class="label">Horarios:</td><td>${data.horarios}</td></tr>
  </table>
</div>

<div class="section">
  <h3>🌐 ESPECIFICACIONES DEL SITIO</h3>
  <table>
    <tr><td class="label">Tipo Sitio:</td><td>${data.tipo_sitio}</td></tr>
    <tr><td class="label">Secciones:</td><td>${(data.secciones_elegidas || []).join(", ")}</td></tr>
    <tr><td class="label">Funcionalidades:</td><td>${(data.funcionalidades || []).join(", ")}</td></tr>
  </table>
</div>

<div class="section">
  <h3>🎨 PREFERENCIAS DE DISEÑO</h3>
  <table>
    <tr><td class="label">Paleta:</td><td>${data.color_paleta}</td></tr>
    <tr><td class="label">Tipografía:</td><td>${data.tipografia_elegida}</td></tr>
  </table>
</div>

<div class="section">
  <h3>💰 PRESUPUESTO</h3>
  <table>
    <tr><td class="label">Tipo Sitio:</td><td class="price">${formatCurrency(p.precio_base)} ARS</td></tr>
    <tr><td class="label">Secciones (${p.secciones_count || 0} × $40k):</td><td class="price">+${formatCurrency(p.precio_secciones)} ARS</td></tr>
    <tr><td class="label">Funcionalidades (${p.funcionalidades_count || 0} × $50k):</td><td class="price">+${formatCurrency(p.precio_funcionalidades)} ARS</td></tr>
    <tr style="border-top: 2px solid #333;"><td class="label"><strong>Subtotal:</strong></td><td class="price">${formatCurrency(p.subtotal_ars)} ARS</td></tr>
    <tr><td class="label">Impuesto (21%):</td><td class="price">+${formatCurrency(p.impuesto_21)} ARS</td></tr>
    <tr style="background: #1f7950; color: white;"><td class="label"><strong>TOTAL:</strong></td><td class="price">${formatCurrency(p.total_ars)} ARS ≈ USD ${formatCurrency(p.total_usd)}</td></tr>
  </table>
</div>

<div class="section">
  <h3>📋 PROMPT PARA WORDPRESS AI</h3>
  <pre style="background: #f0f0f0; padding: 10px; border-radius: 3px; overflow-x: auto;">
${data.prompt_wordpress}
  </pre>
</div>

<div class="section">
  <p><strong>Submission ID:</strong> ${data.submission_id}</p>
  <p><strong>Fecha:</strong> ${data.timestamp}</p>
  <p><em>Todos los datos están guardados en Google Sheets.</em></p>
</div>

</body>
</html>
  `;
}

// ───────────────────────────────────────────────────────────
// 5. HELPER FUNCTIONS
// ───────────────────────────────────────────────────────────

function generateSubmissionId() {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000);
  return `SUB-${year}${month}-${random}`;
}

function formatCurrency(value) {
  return new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

function logEvent(submissionId, eventType, message, status) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName("LOGS");
    sheet.appendRow([
      new Date(),
      submissionId,
      eventType,
      message,
      status
    ]);
  } catch(e) {
    Logger.log("Error logging event: " + e);
  }
}
```

---

## 🔌 SETUP INSTRUCTIONS

### In Google Apps Script Editor:

1. Create new Apps Script project
2. Copy `Code.gs` content above
3. Replace `SHEET_ID` with your actual Sheet ID
4. Deploy as Web App:
   - Execute as: Your account
   - Who has access: Anyone
5. Copy the **Deployment URL** (this is your webhook)
6. Use that URL in frontend JavaScript

---

## 🏷️ MAPEO DE "FRIENDLY NAMES"

A partir de la v1.1, el frontend envía códigos técnicos que son mapeados a nombres legibles en Google Sheets y emails.

### Secciones (en `form-handler.js`)
```javascript
const SECCION_LABELS = {
    hero: 'Inicio/Hero',
    about: 'Acerca de',
    products: 'Productos/Servicios',
    gallery: 'Galería',
    testimonials: 'Testimonios',
    faq: 'Preguntas Frecuentes',
    blog: 'Blog',
    contact: 'Contacto',
    newsletter: 'Newsletter'
};
```

**Ejemplo:**
- Frontend: `['hero', 'products', 'blog']`
- Google Sheets: `Inicio/Hero, Productos/Servicios, Blog`
- Email: `• Inicio/Hero`<br>`• Productos/Servicios`<br>`• Blog`

### Funcionalidades (en `form-handler.js`)
```javascript
const FEATURE_LABELS = {
    tiendanube: 'Sincronización con Catálogo de Ventas',
    cart: 'Carrito de Compras & Pagos Online',
    search: 'Buscador Interno',
    filters: 'Filtros de Búsqueda Avanzados',
    multilingual: 'Sitio Multilingüe',
    seo: 'Optimización SEO',
    analytics: 'Google Analytics / Estadísticas',
    booking: 'Sistema de Reservas y Turnos'
};
```

**Ejemplo:**
- Frontend: `['seo', 'analytics']`
- Google Sheets: `Optimización SEO, Google Analytics / Estadísticas`
- Email: `• Optimización SEO`<br>`• Google Analytics / Estadísticas`

### Implementación en Backend

El Apps Script recibe la data YA MAPEADA desde el frontend:

```javascript
// En sendToGoogleSheets() del frontend, ANTES de enviar:
const seccionesLegibles = state.sections.map(s => SECCION_LABELS[s] || s);
const funcionalidadesLegibles = state.features.map(f => FEATURE_LABELS[f] || f);

// Se envía al webhook:
{
  "secciones_elegidas": ["Inicio/Hero", "Productos/Servicios"],
  "funcionalidades": ["Optimización SEO", "Google Analytics / Estadísticas"]
}
```

**Ventaja:** Google Sheets y emails muestran nombres legibles automáticamente, sin lógica adicional en el backend.

---

## 🔗 FRONTEND INTEGRATION

### JavaScript code sends data:

```javascript
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/d/[YOUR_ID]/usercontent";

async function sendToGoogleSheets(formData) {
  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({
        nombre: formData.nombre,
        email: formData.email,
        // ... all other fields
        presupuesto: calculatedPresupuesto,
        prompt_wordpress: generatedPrompt
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      showConfirmation(`✓ Cotización enviada (ID: ${result.submission_id})`);
    } else {
      showError(result.error);
    }
  } catch(error) {
    showError("Error enviando cotización: " + error);
  }
}
```

---

## 📈 MONITORING

### View Statistics:
Go to STATISTICS sheet to see:
- Total submissions
- Average presupuesto
- Distribution by type
- Most popular sections
- Email success rate

### Debug Issues:
Check LOGS sheet for errors

---

**Related Documents:**
- MOD-05-EMAIL-SYSTEM.md
- PLAN-002-EMAIL-IMPLEMENTATION.md
- SETUP-GOOGLE-SHEETS.md
