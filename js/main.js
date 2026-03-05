// ═══════════════════════════════════════════════════════════════════════════════
// MAIN.JS - ORCHESTRADOR PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════

console.log('🚀 Generador de Presupuestos iniciado');

// Configuración global
const CONFIG = {
    PRESUPUESTO_BASE: {
        landing: 180000,
        simple: 200000,
        portfolio: 300000,
        ecommerce: 500000
    },
    PRECIO_SECCION: 40000,
    PRECIO_FUNCIONALIDAD: 50000,
    IVA: 0.21,
    TIPO_CAMBIO: 360 // 1 USD = ~360 ARS (aprox)
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
});

// Guardar estado en localStorage
function saveToStorage() {
    localStorage.setItem('presupuesto_state', JSON.stringify(state));
}

// Cargar estado desde localStorage
function loadFromStorage() {
    const saved = localStorage.getItem('presupuesto_state');
    if (saved) {
        Object.assign(state, JSON.parse(saved));
        console.log('✓ Estado restaurado desde localStorage');
    }
}
