# ADR-002: Google Apps Script como backend serverless

**Estado:** Aceptado
**Fecha:** Marzo 2026 (inferida de PROJECT_CONSTITUTION.md)
**Autor:** Leandro Gavegno (Ongevag Studio)

---

## Contexto

El sistema necesitaba:
1. Recibir datos del formulario por POST
2. Guardar cotizaciones de forma persistente
3. Enviar notificaciones por email al propietario

El constraint más duro era **costo $0/mes** para una herramienta de uso interno de una agencia pequeña. No había presupuesto para infraestructura.

## Decisión

Se eligió Google Apps Script como "backend":
- Función `doPost(e)` actúa como webhook HTTP
- Google Sheets actúa como base de datos
- `MailApp.sendEmail()` envía las notificaciones

El endpoint se deploya como **Web App pública** en Google Cloud (sin servidor que administrar).

## Consecuencias positivas

- **Costo real: $0/mes.** Google Apps Script y Sheets están dentro del Google Workspace free tier. Se estima capacidad para ~1000 submissions/mes sin costo.
- **Zero infrastructure:** No hay servidor, no hay containers, no hay VPS, no hay nginx, no hay certificados SSL que renovar.
- **Email incluido:** `MailApp` usa la cuenta Gmail del propietario directamente. No hay necesidad de SendGrid, Mailgun, ni SMTP configurado.
- **Trazabilidad automática:** Google Sheets funciona como dashboard de cotizaciones, historial, y panel de monitoreo (hoja LOGS) sin esfuerzo adicional.
- **Uptime de Google:** La disponibilidad depende de la infraestructura de Google, que históricamente supera el 99.9%.

## Trade-offs asumidos

- **Respuesta opaca (CORS):** Google Apps Script no permite configurar CORS headers correctamente cuando se accede desde un dominio externo. La solución fue usar `mode: 'no-cors'` en el fetch del frontend, lo que significa que **la respuesta del servidor es opaca** — no se puede leer si fue exitosa o no. El frontend asume éxito si no hay excepción de red.
- **Cold start:** Si el script no fue ejecutado recientemente, puede haber un delay de 1-3 segundos en la primera ejecución.
- **Sin ambiente de staging:** El mismo script deployado es el de producción. No hay forma nativa de tener un environment de test separado sin deployar una segunda Web App.
- **Vendor lock-in Google:** Migrar a un backend real (Node.js, etc.) requeriría reescribir el handler y migrar los datos de Sheets.
- **Sin autenticación de requests:** El webhook es público. Cualquiera que conozca la URL puede enviar datos. Actualmente no hay rate limiting ni validación de origen.
- **Sin transacciones:** Si el email falla después de guardar en Sheets, los datos quedan guardados pero sin notificación. No hay mecanismo de rollback.

## Alternativas descartadas

| Alternativa | Por qué se descartó |
|-------------|---------------------|
| Node.js en VPS | Costo mínimo ~$5/mes + mantenimiento del servidor. Fuera de presupuesto. |
| Supabase (free tier) | Requería conocimiento adicional de la plataforma. GAS ya era familiar. |
| Netlify Functions | Buena opción técnica, pero los datos necesitaban vivir en Sheets de todos modos (cliente ya lo usaba). |
| Formspree / Typeform | No permite personalizar el procesamiento ni el formato del email. |
| Firebase Cloud Functions | Mismo vendor lock-in pero más complejo de configurar. |

## Contexto adicional

La URL de producción actual está hardcodeada en `js/email-handler.js:6`. Si el script se re-deploya, la URL cambia y debe actualizarse manualmente en el frontend.

> ⚠️ Inferido del código y docs — requiere validación del autor
