# MOD-01_PRICING.md — Sistema de Precios Detallado

**Versión:** 2.2.0
**Última Actualización:** 13 de abril de 2026
**Clasificación:** Especificación Permanente (SDD-Methodology)

---

## 🎯 OBJETIVO

Documentar cómo funciona el sistema de precios, cómo se calcula, qué flujos existen, y cómo agregar nuevas categorías sin romper el código.

---

## 💰 ESTRUCTURA DE PRECIOS — MODO ESTÁNDAR

### Tier 1: Tipo de Sitio (Base)

|Tipo|Descripción|Precio Base (ARS)|Secciones Incluidas|
|---|---|---|---|
|**landing**|1 página con CTA|$200,000|Hero|
|**simple**|3-5 páginas básicas|$250,000|Hero|
|**portfolio**|Portfolio profesional|$350,000|Hero, Acerca De|
|**ecommerce**|Tienda online|$600,000|Hero, Acerca De, Productos|

**Ubicación en código:** `CONFIG.PRESUPUESTO_BASE` en `js/main.js:9-14`

**Cambiar un precio:**
```javascript
// Antes
landing: 200000,

// Después
landing: 220000,

// IMPORTANTE: Actualizar AMBAS ubicaciones:
// 1. js/main.js
// 2. presupuestador/js/main.js (OBLIGATORIO)
```

---

### Tier 2: Secciones Adicionales

Precio por sección adicional (por defecto): **$50,000 ARS**

**¿Qué es una "sección"?**
Componente de página independiente: Hero, Acerca de, Productos, Galería, Testimonios, FAQ, Blog, Contacto, Newsletter, Servicios, Portafolio.

**¿Cómo se cobran?**
Solo se cobran las secciones que NO están incluidas en el tipo de sitio elegido.

**Ejemplo:**
- Usuario elige: **Landing** (incluye "hero" gratis)
- Usuario agrega: "about", "gallery" (2 secciones cobrables)
- Costo secciones: 2 × $50,000 = **$100,000**

**Ubicación en código:** `CONFIG.PRECIO_SECCION` en `js/main.js:15`

**Cambiar el precio:**
```javascript
// Antes
PRECIO_SECCION: 50000,

// Después
PRECIO_SECCION: 55000,
```

---

### Tier 3: Funcionalidades Premium

Precio por funcionalidad: **$60,000 ARS**

**Lista de funcionalidades disponibles:**
1. Sincronización con Tienda Nube (catálogo dinámico)
2. Carrito de Compras & Pagos Online
3. Buscador Interno
4. Filtros de Búsqueda Avanzados
5. Sitio Multilingüe
6. Optimización SEO
7. Google Analytics
8. Sistema de Reservas y Turnos
9. Gestor de Contenido (CMS)

**¿Cómo se cobran?**
Una funcionalidad = $60,000 ARS. No hay descuentos por cantidad.

**Ejemplo:**
- Usuario elige: "seo", "analytics", "booking" (3 funcionalidades)
- Costo funcionalidades: 3 × $60,000 = **$180,000**

**Ubicación en código:** `CONFIG.PRECIO_FUNCIONALIDAD` en `js/main.js:16`

**Cambiar el precio:**
```javascript
// Antes
PRECIO_FUNCIONALIDAD: 60000,

// Después
PRECIO_FUNCIONALIDAD: 65000,
```

---

### IVA (Impuesto)

**Porcentaje:** 21% (argentino)

**¿Se suma al total?** NO
- El IVA se calcula y muestra en el desglose
- El **total final** es: base + secciones + funcionalidades (SIN IVA)
- El usuario ve: "Subtotal: $X | IVA: $Y | Total: $X" (el total está sin IVA)

**Regla de negocio:** El cliente es responsable de este cálculo en la factura final.

**Ubicación en código:** `CONFIG.IVA` en `js/main.js:17`

**Cambiar el porcentaje (si sube el impuesto):**
```javascript
// Antes
IVA: 0.21,

// Después (si sube a 23%)
IVA: 0.23,
```

---

## 🧮 FÓRMULA DE CÁLCULO

```javascript
// Paso 1: Identificar tipo de sitio
const basePrecio = CONFIG.PRESUPUESTO_BASE[tipo_sitio];
// Ejemplo: landing → $200,000

// Paso 2: Calcular secciones cobrables (excluir incluidas)
const SECCIONES_INCLUIDAS = {
    'landing': ['hero'],
    'simple': ['hero'],
    'portfolio': ['hero', 'about'],
    'ecommerce': ['hero', 'about', 'products']
};
const incluidasActuales = SECCIONES_INCLUIDAS[tipo_sitio];
const seccionesCobrables = userSelectedSections.filter(
    sec => !incluidasActuales.includes(sec)
).length;
const seccionesPrecio = seccionesCobrables * CONFIG.PRECIO_SECCION;
// Ejemplo: user picks [hero, about, gallery], landing incluye [hero]
//          cobrables = [about, gallery] = 2 × $50,000 = $100,000

// Paso 3: Calcular funcionalidades
const funcionalidadesPrecio = userSelectedFeatures.length * CONFIG.PRECIO_FUNCIONALIDAD;
// Ejemplo: user picks [seo, analytics] = 2 × $60,000 = $120,000

// Paso 4: Subtotal
const subtotal = basePrecio + seccionesPrecio + funcionalidadesPrecio;
// Ejemplo: $200,000 + $100,000 + $120,000 = $420,000

// Paso 5: IVA (solo para información)
const iva = subtotal * CONFIG.IVA;
// Ejemplo: $420,000 × 0.21 = $88,200

// Paso 6: Total (sin IVA sumado)
const total = subtotal;  // ← LA REGLA CLAVE
// Ejemplo: $420,000 (no es $508,200)
```

**Ubicación:** `calculator.js:updatePresupuesto()` líneas 45-75

---

## 📋 EJEMPLOS NUMÉRICOS REALES

### Ejemplo 1: Landing Simple
```
Tipo: Landing → $200,000
Secciones: ninguna extra (hero incluida)
Funcionalidades: ninguna
─────────────────────────
Total: $200,000
IVA (info): $42,000
Presupuesto Final: $200,000
```

### Ejemplo 2: Portfolio con SEO
```
Tipo: Portfolio → $350,000
Incluye: Hero, About (gratis)
Secciones agregadas: Galería, Testimonios (+2 × $50k = $100k)
Funcionalidades: SEO (+1 × $60k = $60k)
─────────────────────────
Base: $350,000
+ Secciones: $100,000
+ Funcionalidades: $60,000
Subtotal: $510,000
IVA (info): $107,100
Presupuesto Final: $510,000
```

### Ejemplo 3: E-Commerce Premium
```
Tipo: E-Commerce → $600,000
Incluye: Hero, About, Products (gratis)
Secciones agregadas: Blog, FAQ (+2 × $50k = $100k)
Funcionalidades: Carrito, SEO, Analytics, Tienda Nube
                 (+4 × $60k = $240k)
─────────────────────────
Base: $600,000
+ Secciones: $100,000
+ Funcionalidades: $240,000
Subtotal: $940,000
IVA (info): $197,400
Presupuesto Final: $940,000
```

---

## 🔄 FLUJO STANDARD vs CUSTOM

### Standard (Normal)
```
User selects:
  1. Website type
  2. Additional sections
  3. Features

→ Presupuesto = CALCULADO (formula arriba)
→ Button: "Enviar Cotización"
```

**Código relevante:** `calculator.js:updatePresupuesto()` + `updateUI()` (lineas 5-165)

### Custom (Web Apps / Desarrollo a Medida)
```
User writes in "Desarrollo 100% a medida" textarea:
  "Necesito SaaS con OAuth, panel admin, reportes en PDF"

→ Sistema entra en modo CUSTOM
→ Secciones/Funcionalidades se deshabilitan (opacidad 0.4)
→ Presupuesto = "A Medida" (no calculado)
→ Button: "Solicitar Entrevista"
→ Email enviado con asunto "SOLICITUD PROYECTO CUSTOM"
```

**Código relevante:** `calculator.js:resetToCustomMode()` (lineas 128-169)

**Transición automática:** Cualquier caracter en textarea `#custom-project-desc` dispara `resetToCustomMode()`

---

## ➕ CÓMO AGREGAR UN NUEVO TIPO DE SITIO

### Paso 1: Agregar a CONFIG
```javascript
// js/main.js
const CONFIG = {
    PRESUPUESTO_BASE: {
        landing: 200000,
        simple: 250000,
        portfolio: 350000,
        ecommerce: 600000,

        // NUEVO
        apps_web: 800000  // SaaS / Web App base
    },
    // ...
};
```

### Paso 2: Agregar secciones incluidas
```javascript
// calculator.js
const SECCIONES_INCLUIDAS = {
    'landing': ['hero'],
    'simple': ['hero'],
    'portfolio': ['hero', 'about'],
    'ecommerce': ['hero', 'about', 'products'],

    // NUEVO
    'apps_web': ['hero', 'about', 'features']  // 3 secciones gratis
};
```

### Paso 3: Agregar opción al HTML
```html
<!-- presupuestador/index.html -->
<div class="option-cards-grid">
    <!-- ... cards existentes ... -->

    <!-- NUEVO -->
    <label class="option-card">
        <input type="radio" name="option" value="apps_web" />
        <div class="option-card__icon">⚙️</div>
        <div class="option-card__name">Web App / SaaS</div>
        <div class="option-card__price">$800.000</div>
        <ul class="option-card__features">
            <li>Autenticación</li>
            <li>Panel Admin</li>
            <li>Reportes</li>
        </ul>
    </label>
</div>
```

### Paso 4: JavaScript event listener (si usa option-cards)
```javascript
// main.js DOMContentLoaded
document.querySelectorAll('.option-card input').forEach(radio => {
    radio.addEventListener('change', () => {
        const value = radio.value;
        document.getElementById('tipo_sitio').value = value;
        updatePresupuesto();
    });
});
```

### Paso 5: Actualizar AMBAS carpetas
```bash
# Copiar cambios a:
cp js/main.js presupuestador/js/main.js
cp js/calculator.js presupuestador/js/calculator.js
cp presupuestador/index.html index.html (si aplica)

# Verificar sincronización
diff js/main.js presupuestador/js/main.js
```

---

## 🔍 CÓMO DEBUGGEAR PROBLEMAS DE PRECIO

### Problema: "El total no se actualiza"

**Debug paso 1:** Abrir Console (F12) y ejecutar:
```javascript
console.log('CONFIG:', CONFIG);
console.log('state:', state);
console.log('selectedType:', document.getElementById('tipo_sitio').value);
```

**Debug paso 2:** Cambiar el select y verificar logs:
```javascript
// Debería ver
updatePresupuesto() llamada
  - typeSelect elemento: <select>
  - selectedType: landing
  - CONFIG.PRESUPUESTO_BASE: {landing: 200000, ...}
  - Presupuesto calculado: {base: 200000, ...}
```

**Debug paso 3:** Verificar que el HTML tenga los elementos:
```javascript
console.log(document.getElementById('total'));  // Debe existir
console.log(document.getElementById('precio-base'));  // Debe existir
```

### Problema: "El precio base es incorrecto"

**Causa probable:** Cambió CONFIG pero no sincronizó archivos.

**Solución:**
```bash
# Verificar que AMBOS archivos tienen mismo CONFIG
grep -n "landing: " js/main.js presupuestador/js/main.js

# Debería mostrar:
# js/main.js:10:        landing: 200000,
# presupuestador/js/main.js:10:        landing: 200000,
```

---

## 📊 ANÁLISIS DE PRECIOS (Benchmarking)

**Comparativa con mercado argentino (2026):**

| Rango | Nuestro Precio | Posición |
|-------|----------------|----------|
|Landing page|$200k|Competitivo (agencias: $150-300k)|
|Sitio simple|$250k|Competitivo|
|Portfolio|$350k|Bajo-medio (disenadores cobran $400-600k)|
|E-Commerce|$600k|Bajo (integradores cobran $800-1200k)|

**Estrategia de precios:**
- Precio bajo para capturar volumen de leads
- Margen en servicios adicionales (secciones/features)
- SLA de respuesta diferenciado por tipo (custom = 24h)

---

## ⚠️ REGLAS A RESPETAR

1. **Nunca** cambiar precios en HTML hardcoded
   - HTML solo tiene `<div class="option-card__price">$800.000</div>` para DISPLAY
   - La FUENTE DE VERDAD es siempre `CONFIG.PRESUPUESTO_BASE`

2. **Siempre** mantener sincronizado:
   - `js/main.js` ↔ `presupuestador/js/main.js`
   - Si falla la sincronización, el usuario ve un precio pero paga otro

3. **El total nunca suma IVA**
   - Si alguien ve `total = subtotal + iva`, es un BUG
   - El email debe informar: "Total (IVA a cargo del cliente)"

4. **Las secciones incluidas son un regalo**
   - No se pueden cobrar las secciones ya incluidas
   - El filtro en calculator.js:50 es crítico

---

## 🔗 REFERENCIAS

- `CONFIG` definido en: `js/main.js:8-19`
- Cálculo realizado en: `calculator.js:45-75`
- UI actualizada en: `calculator.js:77-119`
- HTML presupuestador: `presupuestador/index.html:312-400`
- Payload al backend: `form-handler.js:collectFormData()`
