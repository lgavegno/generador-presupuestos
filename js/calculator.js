// ═══════════════════════════════════════════════════════════════
// CALCULATOR.JS - LÓGICA DE CÁLCULOS
// ═══════════════════════════════════════════════════════════════

function updatePresupuesto() {
    const typeSelect = document.getElementById('website_type');
    const selectedType = typeSelect.value;
    const facturaIva = document.getElementById('factura-iva');
    const tieneIva = facturaIva ? facturaIva.checked : false;

    if (!selectedType) {
        resetPresupuesto();
        return;
    }

    state.websiteType = selectedType;

    // Secciones
    const sectionCheckboxes = document.querySelectorAll('input[name="sections"]:checked');
    state.sections = Array.from(sectionCheckboxes).map(el => el.value);

    // Funcionalidades
    const featureCheckboxes = document.querySelectorAll('input[name="features"]:checked');
    state.features = Array.from(featureCheckboxes).map(el => el.value);

    // Cálculos
    const basePrecio = CONFIG.PRESUPUESTO_BASE[selectedType];
    const seccionesPrecio = state.sections.length * CONFIG.PRECIO_SECCION;
    const funcionalidadesPrecio = state.features.length * CONFIG.PRECIO_FUNCIONALIDAD;

    const subtotal = basePrecio + seccionesPrecio + funcionalidadesPrecio;

    // IVA SOLO si checkbox está marcado
    const iva = tieneIva ? (subtotal * CONFIG.IVA) : 0;
    const total = subtotal + iva;

    state.presupuesto = {
        base: basePrecio,
        secciones: seccionesPrecio,
        funcionalidades: funcionalidadesPrecio,
        subtotal: subtotal,
        iva: iva,
        total: total,
        tieneIva: tieneIva
    };

    updateUI();
    saveToStorage();
}

function updateUI() {
    const ivaLine = document.getElementById('iva-line');
    const tieneIva = state.presupuesto.tieneIva;

    if (document.getElementById('precio-base')) {
        document.getElementById('precio-base').textContent = formatCurrency(state.presupuesto.base);
    }
    if (document.getElementById('count-sections')) {
        document.getElementById('count-sections').textContent = state.sections.length;
    }
    if (document.getElementById('precio-secciones')) {
        document.getElementById('precio-secciones').textContent = formatCurrency(state.presupuesto.secciones);
    }
    if (document.getElementById('count-features')) {
        document.getElementById('count-features').textContent = state.features.length;
    }
    if (document.getElementById('precio-features')) {
        document.getElementById('precio-features').textContent = formatCurrency(state.presupuesto.funcionalidades);
    }
    if (document.getElementById('subtotal')) {
        document.getElementById('subtotal').textContent = formatCurrency(state.presupuesto.subtotal);
    }

    // Mostrar/ocultar IVA según checkbox
    if (ivaLine) {
        ivaLine.style.display = tieneIva ? 'flex' : 'none';
    }

    if (document.getElementById('impuesto')) {
        document.getElementById('impuesto').textContent = formatCurrency(state.presupuesto.iva);
    }
    if (document.getElementById('total')) {
        document.getElementById('total').textContent = formatCurrency(state.presupuesto.total);
    }
}

function resetPresupuesto() {
    state.presupuesto = { base: 0, secciones: 0, funcionalidades: 0, subtotal: 0, iva: 0, total: 0, totalUSD: 0 };
    updateUI();
}

function formatCurrency(value) {
    return new Intl.NumberFormat('es-AR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}
