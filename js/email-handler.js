// ═══════════════════════════════════════════════════════════════════════════════
// EMAIL-HANDLER.JS - INTEGRACIÓN CON GOOGLE SHEETS
// ═══════════════════════════════════════════════════════════════════════════════

// REEMPLAZA ESTO CON TU WEBHOOK URL DE GOOGLE APPS SCRIPT
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/d/YOUR_DEPLOYMENT_ID/usercontent";

async function sendToGoogleSheets(formData) {
    try {
        console.log('📤 Enviando a Google Sheets...', formData);
        
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
            console.log('✓ Enviado exitosamente');
            showSuccess(`Cotización enviada (ID: ${result.submission_id})`);
            return true;
        } else {
            throw new Error(result.error || 'Error desconocido');
        }
        
    } catch(error) {
        console.error('❌ Error:', error);
        showError('Error enviando cotización: ' + error.message);
        return false;
    }
}
