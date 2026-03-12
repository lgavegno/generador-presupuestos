// ═══════════════════════════════════════════════════════════════
// EMAIL-HANDLER.JS - INTEGRACIÓN GOOGLE SHEETS
// ═══════════════════════════════════════════════════════════════

// ACTUALIZA ESTO CON TU WEBHOOK URL DE GOOGLE APPS SCRIPT
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyFwUNeByzPZnSS0l1OsvUPB10x4U7s6k3CrIP3NDINsDa0fTOVee-0wBxQ7fPxr4g/exec";

async function sendToGoogleSheets(formData) {
    try {
        console.log('📤 Enviando a Google Sheets...', formData);

        // mode: 'no-cors' evita el bloqueo de CORS en localhost.
        // La respuesta es opaca (no podemos leer status ni body),
        // por lo que asumimos éxito si no se lanza ninguna excepción.
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
