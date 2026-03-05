// ═══════════════════════════════════════════════════════════════════════════════
// CALCULATOR.JS - LÓGICA DE CÁLCULOS
// ═══════════════════════════════════════════════════════════════════════════════

function updatePresupuesto() {
    // Obtener tipo de sitio
    const typeSelect = document.getElementById('website_type');
    const selectedType = typeSelect.value;
    
    if (!selectedType) {
        resetPresupuesto();
        return;
    }
    
    state.websiteType = selectedType;
    
    // Obtener secciones seleccionadas
    const sectionCheckboxes = document.querySelectorAll('input[name="sections"]:checked');
    state.sections = Array.from(sectionCheckboxes).map(el => el.value);
    
    // Obtener funcionalidades seleccionadas
    const featureCheckboxes = document.querySelectorAll('input[name="features"]:checked');
    state.features = Array.from(featureCheckboxes).map(el => el.value);
    
    // Calcular precios
    const basePrecio = CONFIG.PRESUPUESTO_BASE[selectedType];
    const seccionesPrecio = state.sections.length * CONFIG.PRECIO_SECCION;
    const funcionalidadesPrecio = state.features.length * CONFIG.PRECIO_FUNCIONALIDAD;
    
    const subtotal = basePrecio + seccionesPrecio + funcionalidadesPrecio;
    const iva = subtotal * CONFIG.IVA;
    const total = subtotal + iva;
    const totalUSD = total / CONFIG.TIPO_CAMBIO;
    
    // Actualizar estado
    state.presupuesto = {
        base: basePrecio,
        secciones: seccionesPrecio,
        funcionalidades: funcionalidadesPrecio,
        subtotal: subtotal,
        iva: iva,
        total: total,
        totalUSD: totalUSD
    };
    
    // Actualizar UI
    updateUI();
    
    // Guardar estado
    saveToStorage();
}

function updateUI() {
    // Precio base
    document.getElementById('precio-base').textContent = 
        formatCurrency(state.presupuesto.base);
    
    // Precios secciones y funcionalidades
    document.getElementById('count-sections').textContent = state.sections.length;
    document.getElementById('precio-secciones').textContent = 
        formatCurrency(state.presupuesto.secciones);
    
    document.getElementById('count-features').textContent = state.features.length;
    document.getElementById('precio-features').textContent = 
        formatCurrency(state.presupuesto.funcionalidades);
    
    // Totales
    document.getElementById('subtotal').textContent = 
        formatCurrency(state.presupuesto.subtotal);
    document.getElementById('impuesto').textContent = 
        formatCurrency(state.presupuesto.iva);
    document.getElementById('total').textContent = 
        formatCurrency(state.presupuesto.total);
    document.getElementById('total-usd').textContent = 
        formatCurrency(state.presupuesto.totalUSD);
}

function resetPresupuesto() {
    state.presupuesto = {
        base: 0,
        secciones: 0,
        funcionalidades: 0,
        subtotal: 0,
        iva: 0,
        total: 0,
        totalUSD: 0
    };
    updateUI();
}

function formatCurrency(value) {
    return new Intl.NumberFormat('es-AR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}
