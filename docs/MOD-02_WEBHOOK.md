# MOD-02_WEBHOOK.md — Integración Google Apps Script

**Versión:** 2.2.0
**Última Actualización:** 13 de abril de 2026
**Clasificación:** Especificación Permanente (SDD-Methodology)

---

## 🎯 OBJETIVO

Documentar cómo funciona la integración con Google Apps Script, cómo testear el webhook localmente, y qué esperar cuando se envía un formulario.

---

## 🔄 FLUJO COMPLETO DE INTEGRACIÓN

```
┌─────────────────────────┐
│ Usuario en navegador    │
│ presupuestador/ form    │
└────────────┬────────────┘
             │ Click "Enviar Cotización"
             ↓
      validateForm()
             │ OK
             ↓
    collectFormData()
    (crear JSON payload)
             │
             ↓
    sendToGoogleSheets(formData)
             │
             ↓
  fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    body: JSON.stringify(formData)
  })
             │
             ↓ POST request a Google
  ┌─────────────────────────┐
  │ Google Apps Script      │
  │ doPost(e) handler       │
  │ (corriendo en cloud)    │
  └────────────┬────────────┘
               │
     JSON.parse(e.postData.contents)
               │
    Validar y sanitizar datos
               │
    ┌─────────┴──────────┐
    │                    │
    ↓                    ↓
 Append a       Send email via
 SUBMISSIONS    MailApp.sendEmail
 sheet          (a: osvojag@gmail.com)
    │                    │
    ↓                    ↓
 Update       (Gmail entrega email)
 STATISTICS
 (counters)
    │
    ↓
 Append log
 entry a LOGS
 sheet
    │
    ↓
 Return response
 {"success": true}
    │
    ↓ Response vuelve a navegador
┌─────────────────────────┐
│ showSuccess() toast     │
│ "Cotización procesada"  │
└─────────────────────────┘
```

---

## 📤 FLUJO DE ENVÍO (FRONTEND)

**Ubicación:** `/presupuestador/js/email-handler.js:8-32`

```javascript
async function sendToGoogleSheets(formData) {
    try {
        console.log('📤 Enviando a Google Sheets...', formData);

        // mode: 'no-cors' evita bloqueo CORS
        // La respuesta es opaca (no podemos leer status ni body)
        await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            cache: 'no-cache',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        console.log('✓ Enviado exitosamente (modo no-cors)');
        showSuccess('Cotización procesada exitosamente');
        return true;

    } catch (error) {
        console.error('❌ Error:', error);
        showError('Error enviando cotización: ' + error.message);
        return false;
    }
}
```

**Puntos críticos:**

1. **`mode: 'no-cors'`**: Permite POST sin preflight request
   - Trade-off: No podemos leer la respuesta (opaca)
   - Por eso asumimos éxito si no hay excepción

2. **`GOOGLE_SCRIPT_URL`** (línea 6): Hardcodeada, pública en el código
   ```javascript
   const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby9Bz6bXnt06aGHfWEAv76xKWvcc_NBaNhzO5Zijx6RYLr0aNyoH2zpoW-_YYqa0rlS/exec";
   ```
   - Esta es la URL de deployment del Google Apps Script
   - Se puede cambiar sin afectar HTML

3. **`showSuccess()` siempre se llama**
   - Incluso si el webhook falló (no hay forma de saberlo con no-cors)
   - Esto es un problema: el usuario cree que se envió pero podría no haberse guardado

---

## 📥 ESTRUCTURA DEL PAYLOAD

### Modo Estándar (Normal)

```json
{
  "timestamp": "2026-04-13T14:30:00.000Z",
  "asunto": "Nuevo Presupuesto Web - Juan García",
  "is_custom": false,
  "customDescription": "",
  "nombre": "Juan García",
  "email": "juan@empresa.com.ar",
  "telefono": "+54 9 3492 555123",
  "tipo_sitio": "landing",
  "secciones_elegidas": [
    "Inicio/Hero",
    "Acerca de"
  ],
  "funcionalidades": [
    "Optimización SEO",
    "Google Analytics / Estadísticas"
  ],
  "presupuesto": {
    "base": 200000,
    "secciones": 100000,
    "funcionalidades": 120000,
    "subtotal": 420000,
    "iva": 88200,
    "total": 420000
  },
  "observaciones": "Prefiero diseño minimalista"
}
```

**Notas:**
- `secciones_elegidas` y `funcionalidades` contienen NOMBRES LEGIBLES (friendly names)
- Los IDs técnicos (hero, seo) se mapean a nombres en `form-handler.js:collectFormData()`
- Google Sheets recibe texto, no código

### Modo Custom (Web Apps / Desarrollo a Medida)

```json
{
  "timestamp": "2026-04-13T14:30:00.000Z",
  "asunto": "SOLICITUD PROYECTO CUSTOM - María Rodríguez",
  "is_custom": true,
  "customDescription": "Necesito SaaS con OAuth, panel admin, reportes en PDF",
  "nombre": "María Rodríguez",
  "email": "maria@startup.com.ar",
  "telefono": "+54 9 3495 999888",
  "tipo_sitio": "WEB APP / CUSTOM",
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

**Diferencias:**
- `is_custom`: true
- `customDescription`: contiene la descripción que escribió el usuario
- `tipo_sitio`: siempre "WEB APP / CUSTOM"
- `asunto`: empieza con "SOLICITUD PROYECTO CUSTOM" (para filtrado automático en Gmail)
- Presupuesto: todos ceros (se cotiza después de entrevista)
- Secciones y funcionalidades: arrays vacíos

---

## 🛠️ CÓMO TESTEAR EL WEBHOOK EN LOCAL

### Opción 1: Usar `curl` desde terminal

```bash
# Preparar JSON
cat > payload.json <<'EOF'
{
  "timestamp": "2026-04-13T14:30:00.000Z",
  "asunto": "Test Webhook",
  "is_custom": false,
  "customDescription": "",
  "nombre": "Test User",
  "email": "test@test.com",
  "telefono": "+54 9 1234567890",
  "tipo_sitio": "landing",
  "secciones_elegidas": ["Inicio/Hero"],
  "funcionalidades": [],
  "presupuesto": {
    "base": 200000,
    "secciones": 0,
    "funcionalidades": 0,
    "subtotal": 200000,
    "iva": 42000,
    "total": 200000
  },
  "observaciones": "Test desde curl"
}
EOF

# Enviar POST
curl -X POST \
  -H "Content-Type: application/json" \
  -d @payload.json \
  "https://script.google.com/macros/s/AKfycby9Bz6bXnt06aGHfWEAv76xKWvcc_NBaNhzO5Zijx6RYLr0aNyoH2zpoW-_YYqa0rlS/exec"
```

### Opción 2: Usar Postman/Insomnia

1. New Request
2. Method: `POST`
3. URL: Webhook URL completa
4. Headers: `Content-Type: application/json`
5. Body (raw JSON): Copiar payload de arriba
6. Click Send
7. Debería responder `{"success": true}`

### Opción 3: Mock en el navegador (test local)

```javascript
// En presupuestador/index.html, antes de cargar email-handler.js, agregar:
window.MOCK_GOOGLE_SHEETS = true;

// En email-handler.js, reemplazar la función:
async function sendToGoogleSheets(formData) {
    if (window.MOCK_GOOGLE_SHEETS) {
        console.log('🟡 MODO MOCK - No enviando a Google');
        console.log('Payload simulado:', formData);
        showSuccess('✅ Simulación exitosa (modo MOCK)');
        return true;
    }

    // ... resto del código original ...
}
```

### Opción 4: Chrome DevTools Network tab

1. Abrir presupuestador/index.html
2. F12 → Network tab
3. Rellenar y enviar formulario
4. Debería aparecer un POST request a `script.google.com`
5. Verificar status 200 (aunque es opaca con no-cors)

---

## 📊 VALIDACIÓN EN GOOGLE APPS SCRIPT

Esperar que el Google Apps Script valide:

```javascript
// Pseudo-código del doPost() handler
function doPost(e) {
    try {
        // 1. Parsear JSON
        const data = JSON.parse(e.postData.contents);

        // 2. Validar campos requeridos
        if (!data.nombre || !data.email || !data.tipo_sitio) {
            return ContentService.createTextOutput(
                JSON.stringify({success: false, error: "Campos faltantes"})
            );
        }

        // 3. Validar email format
        if (!data.email.includes('@')) {
            return ContentService.createTextOutput(
                JSON.stringify({success: false, error: "Email inválido"})
            );
        }

        // 4. Guardar en Sheets
        const sheet = SpreadsheetApp.getActiveSheet();
        sheet.appendRow([data.timestamp, data.nombre, data.email, ...]);

        // 5. Enviar email
        MailApp.sendEmail(data.email, "Tu cotización", ...);
        MailApp.sendEmail("osvojag@gmail.com", data.asunto, ...);

        // 6. Retornar éxito
        return ContentService.createTextOutput(
            JSON.stringify({success: true, submission_id: "SUB-123456"})
        );

    } catch (error) {
        Logger.log("Error: " + error);
        return ContentService.createTextOutput(
            JSON.stringify({success: false, error: error.toString()})
        );
    }
}
```

**Ubicación real:** Documentada en `/docs/MOD-06-GOOGLE-SHEETS-INTEGRATION.md`

---

## 🔍 DEBUGGING — Qué hacer si algo falla

### Escenario 1: "El formulario se envía pero no llega nada a Google Sheets"

**Paso 1: Verificar que el webhook existe**
```bash
curl -X GET "https://script.google.com/macros/s/AKfycby9Bz6bXnt06aGHfWEAv76xKWvcc_NBaNhzO5Zijx6RYLr0aNyoH2zpoW-_YYqa0rlS/exec"
# Debería retornar HTML o error (no "404 Not Found")
```

**Paso 2: Verificar que el JSON es válido**
```javascript
// En presupuestador/js/form-handler.js, antes de sendToGoogleSheets():
const formData = collectFormData();
console.log('Payload a enviar:', JSON.stringify(formData, null, 2));

// Copiar consola → validar en jsonlint.com
```

**Paso 3: Verificar Google Sheets**
- Abrir la hoja en Google Drive
- ¿El sheet "SUBMISSIONS" existe?
- ¿Tiene headers en la primera fila?
- ¿El Apps Script está deployed como "Web App"?

### Escenario 2: "El webhook responde pero el email no llega"

**Causa probable:** Gmail bloqueó o Apps Script no tiene permisos

**Solución:**
- Ir a https://script.google.com
- Abrir el proyecto
- Ejecutar doPost() manualmente para permitir permisos
- MailApp.sendEmail() pedirá autorización

### Escenario 3: "showSuccess() se muestra pero no hay fila en Sheets"

**Problema:** `mode: 'no-cors'` hace la respuesta opaca
- No sabemos si el webhook realmente funcionó
- User ve "éxito" pero backend falló silenciosamente

**Solución transitoria:** Revisar Google Sheets → LOGS sheet
- ¿Hay logs de error?
- Buscar timestamp aproximado

**Solución a largo plazo:** Remover `no-cors`, implementar CORS + retry logic (ver BITACORA_TECNICA)

---

## 📋 CONFIGURACIÓN OBLIGATORIA EN GOOGLE SHEETS

### Paso 1: Crear hoja de cálculo
```
Nombre: Cotizaciones-Generador-Presupuestos
URL: https://docs.google.com/spreadsheets/d/SHEET_ID/edit
```

### Paso 2: Crear 4 sheets (pestañas)

**Sheet 1: SUBMISSIONS**
```
Headers:
| Timestamp | Nombre | Email | Teléfono | Tipo Sitio | Secciones | Funcionalidades | Total ARS | Observaciones |
```

**Sheet 2: STATISTICS**
```
Métricas (actualizadas automáticamente):
| Total Cotizaciones | Promedio USD | Tipo Más Popular | Secciones Populares |
```

**Sheet 3: TEMPLATE**
```
Plantillas de email (opcional para Apps Script):
| Tipo | Asunto | Cuerpo |
```

**Sheet 4: LOGS**
```
Headers:
| Timestamp | Event | submission_id | Status | Message |
```

### Paso 3: Obtener SHEET_ID

```
URL ejemplo: https://docs.google.com/spreadsheets/d/1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7qr8stu9v/edit

SHEET_ID = 1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7qr8stu9v
```

### Paso 4: Crear Google Apps Script

```
1. Ir a https://script.google.com
2. New Project
3. Copiar código de MOD-06-GOOGLE-SHEETS-INTEGRATION.md
4. Reemplazar SHEET_ID con el valor real
5. Reemplazar EMAIL_TO con "osvojag@gmail.com" (u otro)
6. Deploy → New deployment → Web App
7. Execute as: <tu email>
8. Who has access: Anyone
9. Copiar URL deployment → actualizar GOOGLE_SCRIPT_URL en email-handler.js
```

---

## ⚠️ LIMITACIONES Y GOTCHAS

### Límite 1: Google Sheets Rate Limiting
- Máximo 300 requests por minuto
- Máximo 5 MB por request
- Nuestro payload: ~2KB → OK

**Qué pasa si se alcanza el límite?**
- Google responde con 429 Too Many Requests
- El fetch() falla silenciosamente (con no-cors)
- Usuario ve "éxito" pero datos no se guardaron

**Mitigación:** Implementar retry con exponential backoff (ver BITACORA_TECNICA)

### Límite 2: CORS es complejo
- `mode: 'no-cors'` = respuesta opaca
- No podemos leer errors reales del servidor
- `mode: 'cors'` requiere que Google Apps Script agrege headers CORS

**Decisión actual:** no-cors (sacrificamos error reporting por compatibilidad)

### Límite 3: Gmail tiene límites
- MailApp: 100 emails/día por usuario
- sendEmail con attachments: 20 MB máximo

**Mitigación:** Actualmente no enviamos attachments, solo texto

---

## 📧 EMAILS GENERADOS

### Email 1: Confirmación al cliente

```
From: <no-reply@google-apps-script>
To: <email del cliente>
Subject: Tu cotización online está lista

Hola [nombre],

Hemos recibido tu solicitud. Aquí está el resumen:

Tipo de Sitio: [tipo_sitio]
Secciones: [secciones_elegidas]
Funcionalidades: [funcionalidades]

Presupuesto: $[total] ARS

Te contactaremos en breve.

Saludos,
Escut
```

### Email 2: Notificación al propietario

```
From: <no-reply@google-apps-script>
To: osvojag@gmail.com
Subject: [Nuevo Presupuesto Web - Juan García] o [SOLICITUD PROYECTO CUSTOM - María Rodríguez]

NUEVA COTIZACIÓN:

Nombre: [nombre]
Email: [email]
Teléfono: [telefono]

[Si es estándar]
Tipo: [tipo_sitio]
Total: $[total] ARS
Link: https://docs.google.com/spreadsheets/d/SHEET_ID/

[Si es custom]
Descripción: [customDescription]
SLA: Contactar en 24h hábiles
```

---

## 🔗 REFERENCIAS

- **Frontend webhook:** `/presupuestador/js/email-handler.js`
- **Form data collection:** `/presupuestador/js/form-handler.js:collectFormData()`
- **Apps Script code:** `/docs/MOD-06-GOOGLE-SHEETS-INTEGRATION.md`
- **Setup guide:** `/docs/SETUP-GOOGLE-SHEETS.md`
- **Payload examples:** Este documento
