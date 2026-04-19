// ═══════════════════════════════════════════════════════════════
// MAIN.JS - ORCHESTRADOR PRINCIPAL
// ═══════════════════════════════════════════════════════════════

console.log('🚀 Generador de Presupuestos iniciado');

// Configuración global
const CONFIG = {
    PRESUPUESTO_BASE: {
        landing: 200000,
        simple: 250000,
        portfolio: 350000,
        ecommerce: 600000
    },
    PRECIO_SECCION: 50000,
    PRECIO_FUNCIONALIDAD: 60000,
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
}

function loadFromStorage() {
    const saved = localStorage.getItem('presupuesto_state');
    if (saved) {
        Object.assign(state, JSON.parse(saved));
        console.log('✓ Estado restaurado');
    }
}
