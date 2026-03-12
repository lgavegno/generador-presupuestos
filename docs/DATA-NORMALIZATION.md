# DATA NORMALIZATION - Mapeo de Valores Técnicos a Nombres Legibles

**Status:** ✅ Active
**Version:** 1.1.0
**Last Updated:** Marzo 12, 2026
**Author:** Leo (OmniStock SDD Team)

---

## 🎯 Objetivo

Garantizar que los datos técnicos enviados por el frontend sean legibles automáticamente en Google Sheets y emails, sin necesidad de lógica adicional en el backend.

---

## 📊 Arquitectura de Normalización

```
┌─────────────────────────────────────┐
│  Frontend Form (HTML)               │
│  - user.sections = ['hero', 'products']
└────────────────┬────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────┐
│  form-handler.js (Normalization)    │
│  - Map 'hero' → 'Inicio/Hero'       │
│  - Map 'products' → 'Productos/...' │
└────────────────┬────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────┐
│  POST data to Google Apps Script    │
│  - secciones_elegidas = [           │
│      'Inicio/Hero',                 │
│      'Productos/Servicios'          │
│    ]                                │
└────────────────┬────────────────────┘
                 │
         ┌───────┴──────────┐
         ↓                  ↓
    ┌─────────┐         ┌──────────┐
    │ Sheets  │         │ Email    │
    │ (readable)        │ (readable)
    └─────────┘         └──────────┘
```

---

## 🔐 Mapeo de Secciones

### HTML (form)
```html
<label class="checkbox-item">
    <input type="checkbox" name="sections" value="hero" onchange="updatePresupuesto()">
    <span>Home/Inicio</span>
</label>
```

### JavaScript (form-handler.js)
```javascript
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

function collectFormData() {
    const seccionesLegibles = state.sections.map(s => SECCION_LABELS[s] || s);

    return {
        // ... otros campos
        secciones_elegidas: seccionesLegibles,
        // ... resto de data
    };
}
```

### Ejemplo de Flujo

**User selecciona:**
- ☑ Home/Inicio (value: `hero`)
- ☑ Productos (value: `products`)

**JavaScript map:**
```javascript
state.sections = ['hero', 'products']
seccionesLegibles = ['Inicio/Hero', 'Productos/Servicios']
```

**Google Sheets recibe:**
```
Secciones_Elegidas: "Inicio/Hero, Productos/Servicios"
```

**Email muestra:**
```
🌐 ESPECIFICACIONES DEL SITIO
Secciones: Inicio/Hero, Productos/Servicios
```

---

## 🔐 Mapeo de Funcionalidades

### HTML (form)
```html
<label class="checkbox-item">
    <input type="checkbox" name="features" value="seo" onchange="updatePresupuesto()">
    <span>Posicionamiento en Google (SEO)</span>
</label>
```

### JavaScript (form-handler.js)
```javascript
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
    const funcionalidadesLegibles = state.features.map(f => FEATURE_LABELS[f] || f);

    return {
        // ... otros campos
        funcionalidades: funcionalidadesLegibles,
        // ... resto de data
    };
}
```

### Ejemplo de Flujo

**User selecciona:**
- ☑ SEO (value: `seo`)
- ☑ Analytics (value: `analytics`)

**JavaScript map:**
```javascript
state.features = ['seo', 'analytics']
funcionalidadesLegibles = ['Optimización SEO', 'Google Analytics / Estadísticas']
```

**Google Sheets recibe:**
```
Funcionalidades: "Optimización SEO, Google Analytics / Estadísticas"
```

**Email muestra:**
```
🌐 ESPECIFICACIONES DEL SITIO
Funcionalidades: Optimización SEO, Google Analytics / Estadísticas
```

---

## 🛡️ Fallback (Seguridad)

Para garantizar que campos desconocidos no queden en blanco:

```javascript
// Si un nuevo campo se agrega en el futuro sin mapeo:
const seccionesLegibles = state.sections.map(s => SECCION_LABELS[s] || s);
//                                                                   ↑
//                                              Si no existe en LABELS, usa el original
```

**Ejemplo:**
- Si `value="custom_section"` se envía pero no está en `SECCION_LABELS`
- Google Sheets recibirá: `custom_section` (no quebrado, no vacío)

---

## 📈 Ventajas de Este Enfoque

| Aspecto | Ventaja |
|--------|---------|
| **Mantenibilidad** | Mapeo centralizado en `form-handler.js`, fácil de actualizar |
| **Escalabilidad** | Agregar nuevas opciones solo requiere una línea en LABELS |
| **UX** | Google Sheets y emails muestran valores legibles automáticamente |
| **Backend-agnostic** | Google Apps Script NO necesita lógica de mapeo |
| **Fallback** | Si algo falla, al menos aparece el valor técnico |
| **Localización** | Cambiar idioma: solo editar LABELS |

---

## 🔄 Extensión Futura: Multi-idioma

Para soportar múltiples idiomas, extender así:

```javascript
const SECCION_LABELS_ES = { /* ... */ };
const SECCION_LABELS_EN = {
    hero: 'Home/Header',
    about: 'About Us',
    // ...
};

const CURRENT_LANG = 'es'; // O detectar del navegador

const SECCION_LABELS = CURRENT_LANG === 'es' ? SECCION_LABELS_ES : SECCION_LABELS_EN;
```

---

## 🔗 Implementación en Código Real

**Archivo:** `js/form-handler.js` (líneas 5-54)

```javascript
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
        secciones_elegidas: seccionesLegibles,  // ← AQUÍ SE MAPEA
        funcionalidades: funcionalidadesLegibles,  // ← AQUÍ SE MAPEA
        presupuesto: { /* ... */ },
        observaciones: document.getElementById('observaciones')?.value || ''
    };
}
```

---

## 📋 Checklist de Validación

- ✅ SECCION_LABELS tiene todas las opciones del HTML
- ✅ FEATURE_LABELS tiene todas las funcionalidades
- ✅ collectFormData() mapea ambas listas
- ✅ Email (Google Apps Script) recibe nombres legibles
- ✅ Google Sheets muestra valores legibles
- ✅ Fallback `|| s` / `|| f` está implementado
- ✅ Documentación actualizada (este archivo)

---

## 🔗 Referencias

- **MOD-06:** `/docs/MOD-06-GOOGLE-SHEETS-INTEGRATION.md`
- **form-handler.js:** `/js/form-handler.js`
- **PROJECT_LOG:** `/docs/PROJECT_LOG.md` (v1.1.0)

---

**Responsable:** Leo (OmniStock SDD Team)
**Última revisión:** 12 Marzo 2026
