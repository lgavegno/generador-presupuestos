---

# PLAN-002: EMAIL & GOOGLE SHEETS IMPLEMENTATION

**Status:** PENDING  
**Phase:** Integration  
**Duration:** 2-3 days  
**Last Updated:** Marzo 2026  

---

## 🎯 OBJECTIVE

Define the complete plan for integrating Google Sheets and email notifications into the presupuestador application.

---

## 📋 OVERVIEW

The presupuestador currently sends form data but emails are NOT delivered because Google Sheets webhook is not configured.

This plan outlines the complete setup process.

---

## 🏗️ ARCHITECTURE

```
Presupuestador Frontend
    ↓
User submits form
    ↓
form-handler.js: submitForm()
    ↓
email-handler.js: sendToGoogleSheets(formData)
    ↓
POST to Google Apps Script webhook
    ↓
Google Apps Script receives JSON
    ↓
Parse and validate data
    ↓
Save to Google Sheets
    ↓
Send email notification
    ↓
Return success/error
    ↓
Show confirmation to user
```

---

## 📅 IMPLEMENTATION TIMELINE

### STEP 1: Create Google Sheets (30 min)

**Duration:** 30 minutes  
**Status:** ⏳ Pending

Tasks:
1. Go to https://sheets.google.com
2. Create new spreadsheet: "Presupuestador-Cotizaciones"
3. Create columns (45+ for complete data):
   - Timestamp
   - Submission ID
   - Nombre
   - Email
   - Teléfono
   - Website Type
   - Secciones (count)
   - Funcionalidades (count)
   - Presupuesto Base
   - Presupuesto Secciones
   - Presupuesto Funcionalidades
   - Subtotal
   - IVA
   - Total ARS
   - Total USD
   - Observaciones
   - Metadata (user agent, etc.)

4. Format as professional spreadsheet
5. Share with yourself (email)
6. Keep URL handy for later

**Output:** Working Google Sheet with columns ready

---

### STEP 2: Create Google Apps Script (45 min)

**Duration:** 45 minutes  
**Status:** ⏳ Pending

Tasks:
1. Open Google Sheets created in STEP 1
2. Click "Extensions" → "Apps Script"
3. Delete default code
4. Paste complete webhook script (see below)
5. Deploy as webhook:
   - Click "Deploy" → "New deployment"
   - Type: "Web app"
   - Execute as: Your email
   - Who has access: "Anyone"
   - Copy the deployment URL

**Output:** Active webhook URL

---

### STEP 3: Update JavaScript (15 min)

**Duration:** 15 minutes  
**Status:** ⏳ Pending

Task:
1. Open: presupuestador/js/email-handler.js
2. Find line: `const GOOGLE_SCRIPT_URL = "..."`
3. Replace with webhook URL from STEP 2
4. Save file

**Output:** Email handler pointing to webhook

---

### STEP 4: Test Integration (30 min)

**Duration:** 30 minutes  
**Status:** ⏳ Pending

Tasks:
1. Run locally: `python -m http.server 8000`
2. Open http://localhost:8000/presupuestador/
3. Fill form with test data
4. Click "Enviar Cotización"
5. Check:
   - ✓ Loading spinner shows
   - ✓ Success message appears
   - ✓ Google Sheet updates (refresh page)
   - ✓ Email arrives in inbox

**Output:** Working end-to-end flow

---

### STEP 5: Deploy to GitHub (15 min)

**Duration:** 15 minutes  
**Status:** ⏳ Pending

Tasks:
1. Commit changes:
   ```
   git add .
   git commit -m "feat: Integrate Google Sheets webhook"
   ```
2. Push to GitHub:
   ```
   git push origin main
   ```
3. Verify on GitHub Pages (wait 2-3 min)
4. Test on live URL

**Output:** Live integration on GitHub Pages

---

## 🔌 GOOGLE APPS SCRIPT CODE

```javascript
// Deploy as webhook: Execute as your email, Anyone can access

function doPost(e) {
  try {
    // Get the sheet
    const sheet = SpreadsheetApp.getActiveSheet();
    
    // Parse incoming JSON
    const data = JSON.parse(e.postData.contents);
    
    // Extract values
    const timestamp = data.timestamp;
    const nombre = data.nombre;
    const email = data.email;
    const telefono = data.telefono;
    const website_type = data.website_type;
    const secciones = data.secciones_elegidas ? data.secciones_elegidas.length : 0;
    const funcionalidades = data.funcionalidades ? data.funcionalidades.length : 0;
    const presupuesto = data.presupuesto;
    const observaciones = data.observaciones;
    
    // Create submission ID
    const submission_id = "SUB-" + Utilities.formatDate(new Date(), "GMT", "yyyyMMdd-HHmmss");
    
    // Append row to sheet
    sheet.appendRow([
      timestamp,
      submission_id,
      nombre,
      email,
      telefono,
      website_type,
      secciones,
      funcionalidades,
      presupuesto.precio_base,
      presupuesto.precio_secciones,
      presupuesto.precio_funcionalidades,
      presupuesto.subtotal_ars,
      presupuesto.impuesto,
      presupuesto.total_ars,
      presupuesto.total_usd,
      observaciones,
      e.postData.contents
    ]);
    
    // Send email notification
    GmailApp.sendEmail(
      "osvojag@gmail.com", // Recipient
      "Nueva Cotización - " + nombre,
      generateEmailBody(data, submission_id)
    );
    
    // Also send to customer
    GmailApp.sendEmail(
      email,
      "Tu Cotización - Generador de Presupuestos",
      generateCustomerEmail(data, submission_id)
    );
    
    // Return success
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      submission_id: submission_id,
      message: "Cotización guardada y email enviado",
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function generateEmailBody(data, submissionId) {
  const p = data.presupuesto;
  
  return `
NUEVA COTIZACIÓN RECIBIDA
========================

ID: ${submissionId}
Fecha: ${new Date().toLocaleString()}

CLIENTE:
- Nombre: ${data.nombre}
- Email: ${data.email}
- Teléfono: ${data.telefono}

ESPECIFICACIONES:
- Tipo de Sitio: ${data.website_type}
- Secciones: ${data.secciones_elegidas.join(', ')}
- Funcionalidades: ${data.funcionalidades.join(', ')}

PRESUPUESTO:
- Base: $${p.precio_base}
- Secciones (${data.secciones_elegidas.length}): $${p.precio_secciones}
- Funcionalidades (${data.funcionalidades.length}): $${p.precio_funcionalidades}
- Subtotal: $${p.subtotal_ars}
- IVA (21%): $${p.impuesto}
TOTAL: $${p.total_ars} ARS (~USD $${p.total_usd})

Observaciones:
${data.observaciones || 'Ninguna'}

========================
Cotización lista para procesar.
  `;
}

function generateCustomerEmail(data, submissionId) {
  const p = data.presupuesto;
  
  return `
Hola ${data.nombre},

¡Gracias por usar nuestro Generador de Presupuestos!

TU COTIZACIÓN:
ID: ${submissionId}

Tipo de Sitio: ${data.website_type}
Secciones: ${data.secciones_elegidas.length}
Funcionalidades: ${data.funcionalidades.length}

PRESUPUESTO:
Base: $${p.precio_base}
+ Secciones: $${p.precio_secciones}
+ Funcionalidades: $${p.precio_funcionalidades}
─────────────────────
Subtotal: $${p.subtotal_ars}
IVA (21%): $${p.impuesto}
═════════════════════
TOTAL: $${p.total_ars} ARS
~USD $${p.total_usd}

Vigencia: 7 días

Próximos pasos:
1. Revisamos tu cotización
2. Confirmamos presupuesto
3. Iniciamos desarrollo

¿Preguntas? Respondemos dentro de 24 horas.

Saludos,
Zespag Studio
  `;
}
```

---

## 📊 GOOGLE SHEETS COLUMNS

| Column | Type | Description |
|--------|------|-------------|
| Timestamp | DateTime | When submitted |
| Submission ID | String | Unique identifier |
| Nombre | String | Client name |
| Email | String | Client email |
| Teléfono | String | Client phone |
| Website Type | String | landing/simple/portfolio/ecommerce |
| Secciones Count | Number | Number of sections |
| Funcionalidades Count | Number | Number of features |
| Precio Base | Number | Base price |
| Precio Secciones | Number | Sections cost |
| Precio Funcionalidades | Number | Features cost |
| Subtotal | Number | Before tax |
| IVA | Number | Tax amount |
| Total ARS | Number | Final price ARS |
| Total USD | Number | Final price USD |
| Observaciones | String | Client notes |
| Raw JSON | String | Complete JSON data |

---

## ✅ TESTING CHECKLIST

### STEP 1: Google Sheets Created

- [ ] Sheet created at https://sheets.google.com
- [ ] Columns added (at least 17)
- [ ] Headers formatted
- [ ] URL copied and saved

### STEP 2: Google Apps Script Deployed

- [ ] Apps Script created
- [ ] Code pasted and formatted
- [ ] Deployed as Web app
- [ ] Deployment URL copied
- [ ] URL points to Apps Script

### STEP 3: JavaScript Updated

- [ ] email-handler.js found
- [ ] GOOGLE_SCRIPT_URL updated
- [ ] File saved in presupuestador/js/

### STEP 4: Local Testing

- [ ] python -m http.server 8000 running
- [ ] Form loads at http://localhost:8000/presupuestador/
- [ ] Test data entered
- [ ] "Enviar Cotización" clicked
- [ ] Spinner shows
- [ ] Success message appears
- [ ] Google Sheet updated (refresh to see)
- [ ] Email in inbox
- [ ] Email to customer sent

### STEP 5: GitHub Deployed

- [ ] git commit successful
- [ ] git push successful
- [ ] GitHub Pages updated (wait 2-3 min)
- [ ] Live test at https://lgavegno.github.io/generador-presupuestos/presupuestador/
- [ ] All above tests pass on live URL

---

## 🐛 TROUBLESHOOTING

### Email not arriving

**Check:**
1. GOOGLE_SCRIPT_URL is correct (no trailing spaces)
2. Google Apps Script is deployed (not just saved)
3. Deployment is as "Web app" (not library)
4. Who has access: "Anyone"
5. Check spam folder

**Fix:**
- Redeploy Google Apps Script
- Update URL in email-handler.js
- Test again

### Google Sheet not updating

**Check:**
1. Google Sheet exists and is accessible
2. Columns are named correctly
3. Google Apps Script can access sheet
4. Webhook URL is correct

**Fix:**
- Open Google Apps Script
- Click "Executions" tab
- Look for errors
- Fix code if needed

### Form validation errors

**Check:**
1. All required fields filled
2. Email format correct
3. Console (F12) for JavaScript errors

**Fix:**
- Fill all required fields
- Check email syntax
- Fix any console errors

---

## 📈 SUCCESS METRICS

When complete, measure:

- [ ] 100% of submissions saved to Google Sheets
- [ ] 100% of emails delivered
- [ ] Average delivery time < 5 seconds
- [ ] Zero failed submissions (error rate = 0%)
- [ ] User sees success confirmation

---

## 📝 NOTES

### Security Considerations

⚠️ Warning: Anyone can POST to this webhook

To restrict:
1. Add API key validation
2. Verify origin
3. Rate limiting
4. Input sanitization

Current setup is OK for MVP, upgrade for production.

### Future Enhancements

- Add payment processing
- Send PDF invoice
- Integrate with CRM
- Add Slack notification
- Schedule follow-up emails

---

**Related:** MOD-05-EMAIL-SYSTEM.md, MOD-06-GOOGLE-SHEETS-INTEGRATION.md, SETUP-GOOGLE-SHEETS.md
