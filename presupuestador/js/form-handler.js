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

    const nombreVal = document.getElementById('nombre')?.value || '';
    const customDesc = document.getElementById('custom-project-desc')?.value.trim() || '';
    const isCustom = customDesc.length > 0;

    const asuntoFinal = isCustom
        ? `SOLICITUD PROYECTO CUSTOM - ${nombreVal}`
        : `Nuevo Presupuesto Web - ${nombreVal}`;

    // Si es custom, asignar tipo automático; si no, usar valor seleccionado
    const tipoSitio = isCustom ? 'WEB APP / CUSTOM' : (document.getElementById('tipo_sitio')?.value || '');

    // Si es custom, presupuesto con ceros; si no, usar valores del estado
    const presupuestoData = isCustom
        ? { base: 0, secciones: 0, funcionalidades: 0, subtotal: 0, iva: 0, total: 0 }
        : {
            base: state.presupuesto.base,
            secciones: state.presupuesto.secciones,
            funcionalidades: state.presupuesto.funcionalidades,
            subtotal: state.presupuesto.subtotal,
            iva: state.presupuesto.iva,
            total: state.presupuesto.total
        };

    return {
        timestamp: new Date().toISOString(),
        asunto: asuntoFinal,
        is_custom: isCustom,
        customDescription: customDesc,  // ✅ CamelCase requerido para backend
        nombre: nombreVal,
        email: document.getElementById('email')?.value || '',
        telefono: document.getElementById('telefono')?.value || '',
        tipo_sitio: tipoSitio,
        secciones_elegidas: seccionesLegibles,
        funcionalidades: funcionalidadesLegibles,
        // Desglose numérico - si es custom, todos en ceros
        presupuesto: presupuestoData,
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
    const customDesc = document.getElementById('custom-project-desc')?.value.trim() || '';
    const isCustom = customDesc.length > 0;
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

    // Solo validar tipo_sitio si NO es un proyecto custom
    if (!isCustom && !tipo) {
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
        
        if (formData.is_custom) {
             showSuccess('✅ Solicitud de entrevista enviada con éxito. Te contactaremos en 24h hábiles.');
        } else {
             showSuccess('✅ Cotización enviada con éxito. Revisá tu casilla de correo.');
        }
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
        if (btn) btn.textContent = 'Enviar Cotización';
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
    // Using a toast style at bottom center
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translate(-50%, 20px);
        background: #0a0f1e;
        color: #ffffff;
        border: 1px solid #1bfa57;
        box-shadow: var(--shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.7));
        padding: 16px 24px;
        border-radius: 8px;
        z-index: 10000;
        font-weight: 500;
        text-align: center;
        opacity: 0;
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Trigger reflow to start animation
    requestAnimationFrame(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translate(-50%, 0)';
    });

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translate(-50%, 20px)';
        setTimeout(() => notification.remove(), 400);
    }, 5000);
}
