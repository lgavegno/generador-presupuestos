// ═══════════════════════════════════════════════════════════════
// CALCULATOR.JS - LÓGICA DE CÁLCULOS
// ═══════════════════════════════════════════════════════════════

function updatePresupuesto() {
    console.log('updatePresupuesto() llamada');
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

    const customDesc = document.getElementById('custom-project-desc')?.value.trim();
    const isCustom = customDesc && customDesc.length > 0;
    state.isCustom = isCustom;

    const step2Card = document.getElementById('step-2-card');
    const step3Card = document.getElementById('step-3-card');
    const allCheckboxes = document.querySelectorAll('input[name="sections"], input[name="features"]');

    if (isCustom) {
        if (step2Card) { step2Card.style.opacity = '0.4'; step2Card.style.pointerEvents = 'none'; }
        if (step3Card) { step3Card.style.opacity = '0.4'; step3Card.style.pointerEvents = 'none'; }
        allCheckboxes.forEach(cb => { cb.checked = false; cb.disabled = true; });
    } else {
        if (step2Card) { step2Card.style.opacity = '1'; step2Card.style.pointerEvents = 'auto'; }
        if (step3Card) { step3Card.style.opacity = '1'; step3Card.style.pointerEvents = 'auto'; }
        allCheckboxes.forEach(cb => cb.disabled = false);
    }

    const SECCIONES_INCLUIDAS = {
        'landing': ['hero'],
        'simple': ['hero'],
        'portfolio': ['hero', 'about'],
        'ecommerce': ['hero', 'about', 'products']
    };

    // Si el usuario cambia de tipo de sitio, seteamos las secciones incluidas por defecto
    if (state.websiteType !== selectedType) {
        state.websiteType = selectedType;

        if (!isCustom) {
            // Resetear todas las secciones
            const allSectionCheckboxes = document.querySelectorAll('input[name="sections"]');
            allSectionCheckboxes.forEach(cb => cb.checked = false);

            // Marcar las incluidas
            const incluidas = SECCIONES_INCLUIDAS[selectedType] || [];
            incluidas.forEach(secId => {
                const cb = document.querySelector(`input[name="sections"][value="${secId}"]`);
                if (cb) cb.checked = true;
            });
        }
    }

    console.log('  - Tipo asignado:', state.websiteType);

    // Secciones
    const sectionCheckboxes = document.querySelectorAll('input[name="sections"]:checked');
    state.sections = Array.from(sectionCheckboxes).map(el => el.value);

    // Funcionalidades
    const featureCheckboxes = document.querySelectorAll('input[name="features"]:checked');
    state.features = Array.from(featureCheckboxes).map(el => el.value);

    // Cálculos
    const basePrecio = CONFIG.PRESUPUESTO_BASE[selectedType] || 0;

    // Descartamos del cobro las secciones que ya están incluidas en el tipo de sitio elegido
    const incluidasActuales = SECCIONES_INCLUIDAS[selectedType] || [];
    const seccionesCobrables = state.sections.filter(sec => !incluidasActuales.includes(sec)).length;
    const seccionesPrecio = seccionesCobrables * CONFIG.PRECIO_SECCION;

    const funcionalidadesPrecio = state.features.length * CONFIG.PRECIO_FUNCIONALIDAD;

    const subtotal = basePrecio + seccionesPrecio + funcionalidadesPrecio;

    // El IVA se calcula SOLO para información/desglose, no se suma al total final
    const iva = subtotal * CONFIG.IVA;
    const total = subtotal;  // Total = Subtotal (sin IVA sumado)
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

    const totalEl = document.getElementById('total');
    const submitBtn = document.getElementById('submit-btn');
    const noteEl = document.querySelector('.p-total__note');

    if (state.isCustom) {
        // MODO CUSTOM: Ocultar desglose y mostrar "A Medida"
        document.getElementById('precio-base') && (document.getElementById('precio-base').parentElement.style.display = 'none');
        document.getElementById('count-sections') && (document.getElementById('count-sections').parentElement.parentElement.style.display = 'none');
        document.getElementById('count-features') && (document.getElementById('count-features').parentElement.parentElement.style.display = 'none');
        document.getElementById('precio-secciones') && (document.getElementById('precio-secciones').parentElement.style.display = 'none');
        document.getElementById('precio-features') && (document.getElementById('precio-features').parentElement.style.display = 'none');
        document.getElementById('subtotal') && (document.getElementById('subtotal').parentElement.style.display = 'none');
        document.getElementById('impuesto') && (document.getElementById('impuesto').parentElement.style.display = 'none');

        if (totalEl) {
            totalEl.innerText = "A Medida";
            totalEl.style.fontSize = "1.8rem";
        }
        if (submitBtn) submitBtn.innerHTML = "Solicitar Entrevista";
        if (noteEl) noteEl.innerText = "* Proyecto a Medida - Cotización vía Entrevista";
    } else {
        // MODO ESTÁNDAR: Mostrar desglose y total
        document.getElementById('precio-base') && (document.getElementById('precio-base').parentElement.style.display = 'flex');
        document.getElementById('count-sections') && (document.getElementById('count-sections').parentElement.parentElement.style.display = 'flex');
        document.getElementById('count-features') && (document.getElementById('count-features').parentElement.parentElement.style.display = 'flex');
        document.getElementById('precio-secciones') && (document.getElementById('precio-secciones').parentElement.style.display = 'flex');
        document.getElementById('precio-features') && (document.getElementById('precio-features').parentElement.style.display = 'flex');
        document.getElementById('subtotal') && (document.getElementById('subtotal').parentElement.style.display = 'flex');
        document.getElementById('impuesto') && (document.getElementById('impuesto').parentElement.style.display = 'flex');

        document.getElementById('precio-base') && (document.getElementById('precio-base').innerText = formatCurrency(state.presupuesto.base));
        document.getElementById('count-sections') && (document.getElementById('count-sections').innerText = state.sections.length);
        document.getElementById('precio-secciones') && (document.getElementById('precio-secciones').innerText = formatCurrency(state.presupuesto.secciones));
        document.getElementById('count-features') && (document.getElementById('count-features').innerText = state.features.length);
        document.getElementById('precio-features') && (document.getElementById('precio-features').innerText = formatCurrency(state.presupuesto.funcionalidades));
        document.getElementById('subtotal') && (document.getElementById('subtotal').innerText = formatCurrency(state.presupuesto.subtotal));
        document.getElementById('impuesto') && (document.getElementById('impuesto').innerText = formatCurrency(state.presupuesto.iva));

        if (totalEl) {
            totalEl.innerText = formatCurrency(state.presupuesto.total);
            totalEl.style.fontSize = "inherit";
        }
        if (submitBtn) submitBtn.innerHTML = "Enviar Cotización";
        if (noteEl) noteEl.innerText = "* Presupuesto válido por 15 días";
    }
    console.log('  - UI actualizada con:', {
        isCustom: state.isCustom,
        precioBase: formatCurrency(state.presupuesto.base),
        total: formatCurrency(state.presupuesto.total)
    });
}

function resetPresupuesto() {
    state.presupuesto = { base: 0, secciones: 0, funcionalidades: 0, subtotal: 0, iva: 0, total: 0, totalUSD: 0 };
    state.isCustom = false;
    state.sections = [];
    state.features = [];
    updateUI();
}

function resetToCustomMode() {
    console.log('🔄 resetToCustomMode() activada - Usuario escribiendo custom description');

    // 1. Resetear estado completamente
    state.presupuesto = { base: 0, secciones: 0, funcionalidades: 0, subtotal: 0, iva: 0, total: 0, totalUSD: 0 };
    state.isCustom = true;
    state.sections = [];
    state.features = [];
    state.websiteType = null;

    // 2. Desmarcar option cards - Remover TODAS las clases de estado
    document.querySelectorAll('.option-card').forEach(card => {
        // Remover clases de estado
        card.classList.remove('selected', 'active', 'checked');

        // Resetear radio input interno
        const radio = card.querySelector('input[type="radio"]');
        if (radio) radio.checked = false;

        // Limpiar atributos de estado
        card.removeAttribute('aria-selected');
        card.removeAttribute('data-selected');
    });

    // 3. Resetear select de tipo de sitio
    const typeSelect = document.getElementById('tipo_sitio');
    if (typeSelect) typeSelect.value = '';

    // 4. Desmarcar todos los checkboxes
    document.querySelectorAll('input[name="sections"], input[name="features"]').forEach(cb => {
        cb.checked = false;
    });

    // 5. Actualizar UI inmediatamente
    updateUI();

    // 6. Force reflow para asegurar que el DOM se actualiza visualmente
    void document.documentElement.offsetHeight;

    saveToStorage();
    console.log('✓ resetToCustomMode() completada - State:', state);
}

function formatCurrency(value) {
    return '$' + new Intl.NumberFormat('es-AR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}
