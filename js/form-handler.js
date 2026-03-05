// ═══════════════════════════════════════════════════════════════════════════════
// FORM-HANDLER.JS - MANEJO DEL FORMULARIO
// ═══════════════════════════════════════════════════════════════════════════════

function collectFormData() {
    return {
        timestamp: new Date().toISOString(),
        
        // Datos personales
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
        
        // Sitio web
        tipo_sitio: document.getElementById('website_type').value,
        secciones_elegidas: state.sections,
        funcionalidades: state.features,
        
        // Presupuesto
        presupuesto: state.presupuesto,
        
        // Metadata
        user_agent: navigator.userAgent
    };
}

function validateForm() {
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const tipo = document.getElementById('website_type').value;
    
    if (!nombre) {
        showError('Por favor ingresa tu nombre');
        return false;
    }
    
    if (!email || !isValidEmail(email)) {
        showError('Por favor ingresa un email válido');
        return false;
    }
    
    if (!tipo) {
        showError('Por favor selecciona un tipo de sitio');
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

async function submitForm() {
    // Validar
    if (!validateForm()) {
        return;
    }
    
    // Recopilar datos
    const formData = collectFormData();
    
    // Mostrar loading
    showLoadingIndicator(true);
    
    // Enviar a Google
    const success = await sendToGoogleSheets(formData);
    
    if (success) {
        // Limpiar form
        document.getElementById('presupuesto-form').reset();
        state.presupuesto = {};
        updateUI();
    }
    
    showLoadingIndicator(false);
}

function showLoadingIndicator(show) {
    const btn = document.getElementById('submit-btn');
    const spinner = document.getElementById('loading-spinner');
    
    if (show) {
        btn.disabled = true;
        btn.textContent = 'Enviando...';
        spinner.style.display = 'block';
    } else {
        btn.disabled = false;
        btn.textContent = 'Enviar Cotización';
        spinner.style.display = 'none';
    }
}

function showError(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #f44336;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = '❌ ' + message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 5000);
}

function showSuccess(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = '✓ ' + message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 5000);
}
