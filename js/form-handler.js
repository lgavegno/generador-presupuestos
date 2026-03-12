// ═══════════════════════════════════════════════════════════════
// FORM-HANDLER.JS - MANEJO DEL FORMULARIO
// ═══════════════════════════════════════════════════════════════

// Mapeo de valores técnicos a nombres legibles para el email
const SECCION_LABELS = {
    hero: 'Inicio/Hero',
    about: 'Acerca de',
    products: 'Productos/Servicios',
    gallery: 'Galería',
    testimonials: 'Testimonios',
    faq: 'Preguntas Frecuentes',
    blog: 'Blog',
    contact: 'Contacto',
    newsletter: 'Newsletter',
    services: 'Servicios',
    portfolio: 'Portafolio'
};

const FEATURE_LABELS = {
    tiendanube: 'Sincronización con Catálogo de Ventas',
    cart: 'Carrito de Compras & Pagos Online',
    search: 'Buscador Interno',
    filters: 'Filtros de Búsqueda Avanzados',
    multilingual: 'Sitio Multilingüe',
    seo: 'Optimización SEO',
    analytics: 'Google Analytics / Estadísticas',
    booking: 'Sistema de Reservas y Turnos',
    cms: 'Gestor de Contenido (CMS)'
};

function collectFormData() {
    const seccionesLegibles = state.sections.map(s => SECCION_LABELS[s] || s);
    const funcionalidadesLegibles = state.features.map(f => FEATURE_LABELS[f] || f);

    return {
        timestamp: new Date().toISOString(),
        nombre: document.getElementById('nombre')?.value || '',
        email: document.getElementById('email')?.value || '',
        telefono: document.getElementById('telefono')?.value || '',
        tipo_sitio: document.getElementById('tipo_sitio')?.value || '',
        secciones_elegidas: seccionesLegibles,
        funcionalidades: funcionalidadesLegibles,
        // Desglose numérico completo para la hoja de cálculo y el email
        presupuesto: {
            base: state.presupuesto.base,
            secciones: state.presupuesto.secciones,
            funcionalidades: state.presupuesto.funcionalidades,
            subtotal: state.presupuesto.subtotal,
            iva: state.presupuesto.iva,
            total: state.presupuesto.total
        },
        observaciones: document.getElementById('observaciones')?.value || ''
    };
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateForm() {
    const nombre = document.getElementById('nombre')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const tipo = document.getElementById('tipo_sitio')?.value;

    if (!nombre) {
        showError('Por favor ingresa tu nombre');
        return false;
    }

    if (!email) {
        showError('Por favor ingresa tu email');
        return false;
    }

    if (!isValidEmail(email)) {
        showError('Por favor ingresa un email válido');
        return false;
    }

    if (!tipo) {
        showError('Por favor selecciona un tipo de sitio');
        return false;
    }

    return true;
}

async function submitForm() {
    if (!validateForm()) return;

    const formData = collectFormData();
    showLoadingIndicator(true);

    const success = await sendToGoogleSheets(formData);

    if (success) {
        document.getElementById('presupuesto-form').reset();
        resetPresupuesto();
    }

    showLoadingIndicator(false);
}

function showLoadingIndicator(show) {
    const btn = document.getElementById('submit-btn');
    const spinner = document.getElementById('loading-spinner');

    if (show) {
        if (btn) btn.disabled = true;
        if (btn) btn.textContent = 'Enviando...';
        if (spinner) spinner.style.display = 'block';
    } else {
        if (btn) btn.disabled = false;
        if (btn) btn.textContent = '📧 Enviar Cotización';
        if (spinner) spinner.style.display = 'none';
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