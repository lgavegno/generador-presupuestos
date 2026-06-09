# UC-04 — Envío de Cotización

**Modulo**: Core — Flujo Principal
**Version**: 1.0
**Fecha**: 2026-05-12

---

## Actor

Usuario del formulario de cotización (cliente de Ongevag Studio).

## Precondiciones

- El formulario está cargado y en estado válido.
- El usuario completó al menos el tipo de sitio (modo estándar) o la descripción custom (modo custom).
- `state.presupuesto` tiene valores calculados o ceros (modo custom).

## Trigger

El usuario hace click en el botón "Enviar Cotización" (modo estándar) o "Solicitar Entrevista" (modo custom).

## Happy Path — Modo Estándar

| Paso | Archivo | Responsabilidad |
| :--- | :--- | :--- |
| 1 | `form-handler.js` | `submitForm()` invoca `validateForm()`. |
| 2 | `form-handler.js` | `validateForm()` verifica: `nombre` (required), `email` (required + regex), `tipo_sitio` (required si no es custom). |
| 3 | `form-handler.js` | `collectFormData()` construye el payload: mapea valores técnicos (`hero`, `cart`) a nombres legibles (`Inicio/Hero`, `Carrito & Pagos`), agrega desglose de presupuesto de `state.presupuesto`. |
| 4 | `form-handler.js` | `showLoadingIndicator(true)`: deshabilita botón, muestra spinner. |
| 5 | `email-handler.js` | `sendToGoogleSheets(formData)`: POST a `GOOGLE_SCRIPT_URL` con `mode: 'no-cors'`. |
| 6 | `email-handler.js` | Si no se lanza excepción: retorna `true` (respuesta siempre opaca por no-cors). |
| 7 | `form-handler.js` | `form.reset()`, `resetPresupuesto()`, `showSuccess(mensaje)`. |
| 8 | `form-handler.js` | `showLoadingIndicator(false)`. |

## Happy Path — Modo Custom

Idéntico al estándar salvo:
- Paso 2: `tipo_sitio` no es requerido.
- Paso 3: `tipo_sitio = "WEB APP / CUSTOM"`, `presupuesto = {todos ceros}`, `customDescription = textarea.value`.
- Paso 7: mensaje de éxito diferente: `"Solicitud de entrevista enviada. Te contactaremos en 24h hábiles."`.

## Post-condición

- El formulario queda reseteado.
- `state.presupuesto` vuelve a ceros.
- Google Sheets tiene una nueva fila en hoja SUBMISSIONS (columnas A-Q).
- El propietario recibe email de notificación vía Google MailApp.

## Excepciones

| ID | Escenario | Comportamiento requerido |
| :--- | :--- | :--- |
| E1 | `validateForm()` falla | `showError(mensaje)` con razón específica. Submit se detiene. Loading indicator no se activa. |
| E2 | `fetch()` lanza excepción (sin red, timeout) | `showError('Error enviando cotización: ' + error.message)`. Formulario NO se resetea — el usuario puede reintentar. |
| E3 | Google Apps Script retorna error 500 | El frontend no puede detectarlo (respuesta opaca). Se muestra éxito igual. El único canal de debug es hoja LOGS en Google Sheets. |
| E4 | El usuario hace doble-click en el botón | `showLoadingIndicator(true)` deshabilita el botón en el paso 4 — el segundo click no genera segundo POST. |

## Notas de Implementación

- El fetch usa `mode: 'no-cors'` (ver ADR-002). La respuesta es siempre opaca — `sendToGoogleSheets()` retorna `true` si no hay excepción JavaScript.
- `collectFormData()` es el único punto de mapeo técnico→legible. El backend recibe `snake_case` en el payload; `customDescription` usa `camelCase` por requisito del schema de Sheets (ver `API_SPEC.md`).
- El campo `is_custom: boolean` en el payload determina el routing en Google Apps Script (asunto del email, columnas de Sheets).

---

*Ver también*: [UC-05-modo-custom.md](./UC-05-modo-custom.md) | [docs/API_SPEC.md](../API_SPEC.md)
