# Código de Google Apps Script

Copia y pega el siguiente código en tu proyecto de Google Apps Script:

```javascript
function sendAdminEmail(data, submissionId, presupuesto) {
  // Se define la lista de destinatarios corregida (separados por coma)
  const recipients = "ongevag@gmail.com, lgavegno@gmail.com";
  
  const subject = "Nueva Cotización - " + (data.nombre || "Sin Nombre");
  
  // Usamos las llaves mapeadas en el frontend (base, secciones, funcionalidades...)
  const body = `
NUEVA COTIZACIÓN RECIBIDA
========================

ID: ${submissionId}
Fecha: ${new Date().toLocaleString('es-AR')}

CLIENTE:
Nombre: ${data.nombre || 'No provisto'}
Email: ${data.email || 'No provisto'}
Teléfono: ${data.telefono || 'No provisto'}

ESPECIFICACIONES:
Tipo de Sitio: ${data.tipo_sitio || 'No especificado'}
Secciones: ${(data.secciones_elegidas ? data.secciones_elegidas.join(", ") : "Ninguna")}
Funcionalidades: ${(data.funcionalidades ? data.funcionalidades.join(", ") : "Ninguna")}

PRESUPUESTO:
Base: $${presupuesto.base || 0}
Secciones: $${presupuesto.secciones || 0}
Funcionalidades: $${presupuesto.funcionalidades || 0}
─────────────────────────
Subtotal: $${presupuesto.subtotal || 0}
IVA (21%): $${presupuesto.iva || 0}
═════════════════════════
TOTAL: $${presupuesto.total || 0} ARS (~USD $${presupuesto.totalUSD || 0})

Observaciones:
${data.observaciones || "Ninguna"}

========================
Ready to process.
  `;
  
  GmailApp.sendEmail(recipients, subject, body);
}

function sendCustomerEmail(data, submissionId, presupuesto) {
  if (!data.email) return;
  
  const subject = "Tu Cotización - Generador de Presupuestos";
  
  const body = `
Hola ${data.nombre},

¡Gracias por usar nuestro Generador de Presupuestos!

TU COTIZACIÓN:
ID: ${submissionId}
Fecha: ${new Date().toLocaleString('es-AR')}

PRESUPUESTO ESTIMADO:
Total: $${presupuesto.total || 0} ARS
~USD: $${presupuesto.totalUSD || 0}

Vigencia: 7 días

Próximos pasos:
1. Revisamos tu presupuesto
2. Confirmamos detalles
3. Iniciamos el proyecto

Saludos,
Ongevag Studio
  `;
  
  GmailApp.sendEmail(data.email, subject, body);
}
```