// ═══════════════════════════════════════════════════════════════
// CALCULATOR.JS - LÓGICA DE CÁLCULOS
// ═══════════════════════════════════════════════════════════════

function updatePresupuesto() {
    console.log('🔧 updatePresupuesto() llamada');
    const typeSelect = document.getElementById('tipo_sitio');
    const selectedType = typeSelect ? typeSelect.value : null;

    console.log('  - typeSelect elemento:', typeSelect);
    console.log('  - selectedType:', selectedType);
    console.log('  - CONFIG.PRESUPUESTO_BASE:', CONFIG.PRESUPUESTO_BASE);

    if (!selectedType) {
        console.log('  - Sin tipo seleccionado, reseteando');
        resetPresupuesto();
        return;
    }

    state.websiteType = selectedType;
    console.log('  - Tipo asignado:', state.websiteType);

    // Secciones
    const sectionCheckboxes = document.querySelectorAll('input[name="sections"]:checked');
    state.sections = Array.from(sectionCheckboxes).map(el => el.value);

    // Funcionalidades
    const featureCheckboxes = document.querySelectorAll('input[name="features"]:checked');
    state.features = Array.from(featureCheckboxes).map(el => el.value);

    // Cálculos
    const basePrecio = CONFIG.PRESUPUESTO_BASE[selectedType] || 0;
    const seccionesPrecio = state.sections.length * CONFIG.PRECIO_SECCION;
    const funcionalidadesPrecio = state.features.length * CONFIG.PRECIO_FUNCIONALIDAD;

    const subtotal = basePrecio + seccionesPrecio + funcionalidadesPrecio;

    // El IVA ahora se calcula SIEMPRE para que los datos viajen correctos al backend
    const iva = subtotal * CONFIG.IVA;
    const total = subtotal + iva;
    const totalUSD = total / CONFIG.TIPO_CAMBIO;

    state.presupuesto = {
        base: basePrecio,
        secciones: seccionesPrecio,
        funcionalidades: funcionalidadesPrecio,
        subtotal: subtotal,
        iva: iva,
        total: total,
        totalUSD: totalUSD,
        tieneIva: true
    };

    console.log('  - Presupuesto calculado:', {
        basePrecio,
        seccionesPrecio,
        funcionalidadesPrecio,
        subtotal,
        total: state.presupuesto.total
    });

    updateUI();
    saveToStorage();
    console.log('✓ updatePresupuesto() completada');
}

function updateUI() {
    if (!state.presupuesto) return;

    console.log('  - Actualizando UI...');
    document.getElementById('precio-base') && (document.getElementById('precio-base').innerText = formatCurrency(state.presupuesto.base));
    document.getElementById('count-sections') && (document.getElementById('count-sections').innerText = state.sections.length);
    document.getElementById('precio-secciones') && (document.getElementById('precio-secciones').innerText = formatCurrency(state.presupuesto.secciones));
    document.getElementById('count-features') && (document.getElementById('count-features').innerText = state.features.length);
    document.getElementById('precio-features') && (document.getElementById('precio-features').innerText = formatCurrency(state.presupuesto.funcionalidades));
    document.getElementById('subtotal') && (document.getElementById('subtotal').innerText = formatCurrency(state.presupuesto.subtotal));
    document.getElementById('impuesto') && (document.getElementById('impuesto').innerText = formatCurrency(state.presupuesto.iva));
    document.getElementById('total') && (document.getElementById('total').innerText = formatCurrency(state.presupuesto.subtotal));
    console.log('  - UI actualizada con:', {
        precioBase: formatCurrency(state.presupuesto.base),
        total: formatCurrency(state.presupuesto.subtotal)
    });
}

function resetPresupuesto() {
    state.presupuesto = { base: 0, secciones: 0, funcionalidades: 0, subtotal: 0, iva: 0, total: 0, totalUSD: 0 };
    updateUI();
}

function formatCurrency(value) {
    return '$' + new Intl.NumberFormat('es-AR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}
