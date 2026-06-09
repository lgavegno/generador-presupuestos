// ═══════════════════════════════════════════════════════════════
// MAIN.JS - ORCHESTRADOR PRINCIPAL
// ═══════════════════════════════════════════════════════════════

console.log('🚀 Generador de Presupuestos iniciado');

// Configuración global
const CONFIG = {
    PRESUPUESTO_BASE: {
        landing: 600000,
        simple: 1200000,
        portfolio: 1500000,
        ecommerce: 2000000
    },
    PRECIO_SECCION: 100000,
    PRECIO_FUNCIONALIDAD: 150000,
    IVA: 0.21,
    TIPO_CAMBIO: 360
};

// Estado global
const state = {
    websiteType: null,
    sections: [],
    features: [],
    presupuesto: {
        base: 0,
        secciones: 0,
        funcionalidades: 0,
        subtotal: 0,
        iva: 0,
        total: 0,
        totalUSD: 0
    }
};

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    console.log('✓ DOM cargado');
    loadFromStorage();
    UpdateWebsiteTypeUseCase.init();

    // Event listener para custom project description
    const customDescInput = document.getElementById('custom-project-desc');
    if (customDescInput) {
        // Disparar resetToCustomMode en 'input' y 'focus'
        const handleCustomInput = () => {
            const hasContent = customDescInput.value.trim().length > 0;
            if (hasContent) {
                resetToCustomMode();
            }
        };

        customDescInput.addEventListener('input', handleCustomInput);
        customDescInput.addEventListener('focus', handleCustomInput);
    }
});

function saveToStorage() {
    localStorage.setItem('presupuesto_state', JSON.stringify(state));
    localStorage.setItem('presupuesto_config_version', '2.0');
}

function loadFromStorage() {
    const CONFIG_VERSION = '2.0'; // incrementar cuando cambien precios base
    const saved = localStorage.getItem('presupuesto_state');
    const savedVersion = localStorage.getItem('presupuesto_config_version');

    if (saved && savedVersion === CONFIG_VERSION) {
        Object.assign(state, JSON.parse(saved));
        console.log('✓ Estado restaurado (v' + CONFIG_VERSION + ')');
    } else {
        localStorage.removeItem('presupuesto_state');
        localStorage.setItem('presupuesto_config_version', CONFIG_VERSION);
        console.log('✓ Cache limpiado — nueva versión de CONFIG detectada');
    }
}
