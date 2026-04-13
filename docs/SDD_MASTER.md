# SDD_MASTER.md — Especificación Integral del Proyecto

**Versión:** 2.0 (Auditoría Técnica)
**Fecha de Auditoría:** 13 de abril de 2026
**Estado:** Producción con Deuda Técnica
**Clasificación:** Sistema No-Crítico (valor bajo de datos, no monetario)

---

## 📋 RESUMEN EJECUTIVO

**¿Qué es?**
Generador de Presupuestos para sitios web: formulario interactivo que calcula cotizaciones personalizadas en tiempo real.

**¿Para quién?**
Propietarios de agencias web en Argentina. Los clientes usan la herramienta; el propietario recibe emails con leads.

**Stack Técnico:**
- **Frontend:** Vanilla JS + HTML5 + CSS3 (54KB inline) | Acceso: `presupuestador/index.html`
- **Backend:** Google Apps Script (webhook) | Costo: $0
- **Storage:** Google Sheets | Costo: $0
- **Hosting:** GitHub Pages o Static HTTP | Costo: $0

---

## 🔄 DIAGRAMA DE FLUJO COMPLETO

```
┌─────────────────────────────────────────────────────────┐
│ Usuario entra a presupuestador/index.html               │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ↓
        ┌──────────────────────────────────┐
        │ PASO 1: Selecciona Tipo de Sitio  │
        │ (4 option-cards: landing/simple/  │
        │  portfolio/ecommerce)             │
        └──────────────┬───────────────────┘
                       │
        ┌──────────────┴────────────────┐
        │ Hay 2 flujos posibles:        │
        └──────────────┬────────────────┘
                       │
        ┌──────────────┴────────────────────┐
        │                                   │
        ↓                                   ↓
   FLUJO ESTÁNDAR              FLUJO CUSTOM (Web Apps)
   ───────────────              ──────────────────────
   • Selecciona tipo            • Completa textarea
   • Agrega secciones           • "Desarrollo 100% a medida"
   • Agrega funcionalidades     • Las demás opciones se
   • Ve presupuesto calculado     deshabilitan
   • Envía formulario           • Presupuesto = "A Medida"
                                • Botón: "Solicitar Entrevista"
                                • Email SLA: 24h respuesta
        │                                   │
        └──────────────┬───────────────────┘
                       │
                       ↓
        ┌──────────────────────────────────┐
        │ PASO 2 & 3: Secciones +          │
        │ Funcionalidades (si no custom)   │
        │ Incluidas por defecto según tipo │
        │ - Landing: hero                  │
        │ - Simple: hero                   │
        │ - Portfolio: hero, about         │
        │ - Ecommerce: hero, about, prod   │
        └──────────────┬───────────────────┘
                       │
                       ↓
        ┌──────────────────────────────────┐
        │ PASO 4: Datos de Contacto        │
        │ nombre, email, teléfono (req)    │
        │ + observaciones (opt)            │
        └──────────────┬───────────────────┘
                       │
                       ↓
        ┌──────────────────────────────────┐
        │ PASO 5: Validar Formulario       │
        │ - Email format check             │
        │ - Si estándar: tipo_sitio req    │
        │ - Si custom: descripción req     │
        └──────────────┬───────────────────┘
                       │
                       ↓
        ┌──────────────────────────────────┐
        │ PASO 6: Enviar a Google Sheets   │
        │ POST → Google Apps Script        │
        │ Webhook URL (hardcoded)          │
        │ JSON payload con presupuesto     │
        └──────────────┬───────────────────┘
                       │
                       ↓
        ┌──────────────────────────────────┐
        │ Google Apps Script (Cloud):      │
        │ 1. Valida JSON                   │
        │ 2. Almacena en SUBMISSIONS       │
        │ 3. Actualiza STATISTICS          │
        │ 4. Envía email vía MailApp       │
        │ 5. Registra en LOGS              │
        └──────────────┬───────────────────┘
                       │
                       ↓
        ┌──────────────────────────────────┐
        │ Propietario recibe:              │
        │ - Email con resumen              │
        │ - Link a Google Sheets           │
        │ - Para contactar al cliente      │
        └──────────────────────────────────┘
```

---

## 🏗️ DECISIONES DE ARQUITECTURA (ADRs)

### ADR-1: ¿Por qué Vanilla JavaScript?
**Decisión:** No usar frameworks (React, Vue).
**Justificación:**
- Formulario simple, sin estado complejo
- Usuarios de PyMEs no tienen CI/CD, no pueden compilar
- Cero dependencias = cero superficie de ataque
- Deployment: copiar HTML a GitHub Pages
**Trade-offs:**
- Más código boilerplate que React
- Sin validación de props/tipos en compile-time
- Harder to test sin framework test utils

### ADR-2: ¿Por qué Google Sheets + Apps Script?
**Decisión:** No usar base de datos propia (PostgreSQL, Firebase).
**Justificación:**
- Costo: $0 (Google Workspace ya existía)
- Control total: Cliente propietario de los datos
- Reporting: Hojas de cálculo nativamente exportables a PDF/email
- No hay que mantener servidor
**Trade-offs:**
- Google Sheets API tiene rate limits (300 req/min)
- No es buena para analytics en tiempo real
- Query language limitado

### ADR-3: ¿Por qué estructura dual-file (raíz + presupuestador/)?
**Decisión:** Mantener dos copias de JS en dos directorios.
**Justificación ORIGINAL (según comentarios):**
- Backwards compatibility con estructura antigua
- Permite cambiar URL de deployment sin actualizar imports
**Realidad Actual:**
- ✅ Alias está ROTO: `/js/calculator.js` ≠ `/presupuestador/js/calculator.js`
- ✅ Introduce deuda técnica (hay que mantener dos versiones)
- ❌ Probablemente NO es necesaria
**Recomendación:** Eliminar en refactor futuro (ver BITACORA_TECNICA)

### ADR-4: ¿Cómo se sincroniza el estado (state object)?
**Decisión:** Objeto global `state` con propiedades mutables.
**Justificación:**
- Simple de entender
- Acceso desde cualquier función
- localStorage.setItem() al cambiar
**Trade-offs:**
- Sin validación de tipos (no hay types, no hay TypeScript)
- Cambios globales = difícil de trackear bugs
- Sin undo/redo capability

---

## 📦 CONTRATOS DE DATOS

### CONFIG Object (main.js)
```javascript
const CONFIG = {
    // Precios base (ARS) - FUENTE DE VERDAD ✅
    PRESUPUESTO_BASE: {
        landing: 200000,        // Landing Page (1 página)
        simple: 250000,         // Sitio Simple (3-5 páginas)
        portfolio: 350000,      // Portfolio (proyecto de diseñador)
        ecommerce: 600000       // E-Commerce (tienda online)
    },

    // Precios por unidad adicional (ARS)
    PRECIO_SECCION: 50000,      // Por cada sección extra (Home, About, etc.)
    PRECIO_FUNCIONALIDAD: 60000, // Por cada feature (SEO, Analytics, etc.)

    // Fiscalidad
    IVA: 0.21,                  // 21% (mostrado solo para info, no sumado)

    // Conversión (solo usado en estado, no en UI)
    TIPO_CAMBIO: 360            // ARS a USD
};
```

**Notas:**
- Los precios en `/data/pricing.json` (180k, 200k, 300k, 500k) son **OBSOLETOS** y no se usan
- Esta es la fuente de verdad del sistema

### state Object (global)
```javascript
const state = {
    websiteType: null,          // 'landing'|'simple'|'portfolio'|'ecommerce'|null
    sections: [],               // Array de IDs: ['hero', 'about', 'products']
    features: [],               // Array de IDs: ['seo', 'analytics', 'cart']
    isCustom: false,            // true si usuario escribió en textarea custom

    presupuesto: {
        base: 0,                // CONFIG.PRESUPUESTO_BASE[websiteType]
        secciones: 0,           // (número de secciones cobrables) × 50000
        funcionalidades: 0,     // (número de features) × 60000
        subtotal: 0,            // base + secciones + funcionalidades
        iva: 0,                 // subtotal × 0.21 (para información)
        total: 0,               // subtotal (sin IVA sumado) — REGLA DE NEGOCIO
        totalUSD: 0,            // total / 360 (opcional, no mostrado)
        tieneIva: true          // Flag para UI
    }
};
```

**Invariantes:**
1. Si `isCustom === true` → `presupuesto.total === 0` y `secciones/features === []`
2. Si `isCustom === false` → `websiteType` debe ser válido
3. `total` nunca incluye IVA (regla comercial)
4. `sections` NO incluye las secciones incluidas por defecto (se filtran en cálculo)

### Payload JSON al Webhook

**Modo Estándar:**
```json
{
  "timestamp": "2026-04-13T14:30:00.000Z",
  "asunto": "Nuevo Presupuesto Web - Juan García",
  "is_custom": false,
  "customDescription": "",
  "nombre": "Juan García",
  "email": "juan@empresa.com.ar",
  "telefono": "+54 9 3492 555123",
  "tipo_sitio": "landing",
  "secciones_elegidas": ["Inicio/Hero", "Acerca de"],      // FRIENDLY NAMES
  "funcionalidades": ["SEO", "Analytics"],                 // FRIENDLY NAMES
  "presupuesto": {
    "base": 200000,
    "secciones": 100000,
    "funcionalidades": 120000,
    "subtotal": 420000,
    "iva": 88200,
    "total": 420000
  },
  "observaciones": "Prefiero diseño minimalista"
}
```

**Modo Custom:**
```json
{
  "timestamp": "2026-04-13T14:30:00.000Z",
  "asunto": "SOLICITUD PROYECTO CUSTOM - María Rodríguez",
  "is_custom": true,
  "customDescription": "Necesito SaaS con OAuth, panel admin, reportes PDF",
  "nombre": "María Rodríguez",
  "email": "maria@startup.com.ar",
  "telefono": "+54 9 3495 999888",
  "tipo_sitio": "WEB APP / CUSTOM",
  "secciones_elegidas": [],
  "funcionalidades": [],
  "presupuesto": {
    "base": 0,
    "secciones": 0,
    "funcionalidades": 0,
    "subtotal": 0,
    "iva": 0,
    "total": 0
  },
  "observaciones": ""
}
```

**Mappings (form-handler.js):**

Seción IDs → Friendly Names:
- `hero` → `Inicio/Hero`
- `about` → `Acerca de`
- `products` → `Productos/Servicios`
- `gallery` → `Galería`
- `testimonials` → `Testimonios`
- `faq` → `Preguntas Frecuentes`
- `blog` → `Blog`
- `contact` → `Contacto`
- `newsletter` → `Newsletter`
- `services` → `Servicios`
- `portfolio` → `Portafolio`

Feature IDs → Friendly Names:
- `tiendanube` → `Sincronización con Catálogo de Ventas`
- `cart` → `Carrito de Compras & Pagos Online`
- `search` → `Buscador Interno`
- `filters` → `Filtros de Búsqueda Avanzados`
- `multilingual` → `Sitio Multilingüe`
- `seo` → `Optimización SEO`
- `analytics` → `Google Analytics / Estadísticas`
- `booking` → `Sistema de Reservas y Turnos`
- `cms` → `Gestor de Contenido (CMS)`

---

## 🛑 LÍMITES DEL SISTEMA

### ¿QUÉ HACE?
- ✅ Calcula cotizaciones en tiempo real basado en selecciones
- ✅ Valida email + campos requeridos
- ✅ Persiste estado en localStorage
- ✅ Integra con Google Sheets vía webhook
- ✅ Envía notificaciones por email (via Apps Script)
- ✅ Soporta dos modos: Standard y Custom (Web Apps)
- ✅ Responsive en mobile/tablet/desktop

### ¿QUÉ NO HACE?
- ❌ Almacena datos en servidor propio (usa Google Sheets)
- ❌ Procesa pagos (es solo cotizador)
- ❌ Genera PDFs (manual desde Sheets)
- ❌ Validación de teléfono (solo acepta cualquier formato)
- ❌ Multi-idioma (solo español)
- ❌ CMS integrado (solo enlaza a Tienda Nube API, no implementada)
- ❌ Tests automatizados

---

## 🚨 DEUDA TÉCNICA IDENTIFICADA

### SEVERIDAD ALTA

1. **Desincronización de archivos JS** (calculator.js tiene 51 líneas de diferencia)
   - Ubicación: `/js/calculator.js` vs `/presupuestador/js/calculator.js`
   - Impacto: Si alguien modifica presupuestador/, no se refleja en raíz
   - Esfuerzo para arreglar: BAJO (merge + delete una carpeta)

2. **Pricing.json obsoleto**
   - Ubicación: `/data/pricing.json` y `/presupuestador/data/pricing.json`
   - Impacto: Confusión sobre cuál es la fuente de verdad
   - Esfuerzo: BAJO (eliminar archivos)

3. **Webhook URL hardcodeada en frontend**
   - Ubicación: `/presupuestador/js/email-handler.js:6`
   - Impacto: URL pública en código fuente (baja severidad: es intencionalmente pública)
   - Esfuerzo: MEDIO (mover a .env o config file)

### SEVERIDAD MEDIA

4. **Falta de retry logic en webhook**
   - Ubicación: `email-handler.js:sendToGoogleSheets()`
   - Impacto: Si Google Apps Script está down, usuario piensa que se envió pero no
   - Esfuerzo: ALTO (implementar exponential backoff)

5. **CSS 100% inline**
   - Ubicación: 54KB de inline `<style>` en presupuestador/index.html
   - Impacto: Imposible reutilizar CSS en otras páginas; archivo HTML GIGANTE
   - Esfuerzo: ALTO (extraer a `presupuestador/css/main.css`)

6. **Doble estructura de selección (hidden select + option cards)**
   - Ubicación: presupuestador/index.html (hidden `<select id="tipo_sitio">` + 4 `.option-card`)
   - Impacto: Doble DOM, confusión, accesibilidad pobre
   - Esfuerzo: MEDIO (eliminar select, usar dataset en cards)

### SEVERIDAD BAJA

7. **Sin validación de entrada en cliente**
   - Ubicación: validateForm() solo valida email format
   - Impacto: Datos basura llegan a Google Sheets si user manipula DOM
   - Esfuerzo: BAJO

8. **Sin TypeScript**
   - Ubicación: Todo el proyecto
   - Impacto: Sin validación de tipos en compile-time
   - Esfuerzo: ALTO (propuesta para refactor futuro)

9. **Accesibilidad limitada**
   - Ubicación: Falta aria-labels, aria-selected, semantic HTML
   - Impacto: Usuarios con lectores de pantalla ven UI confusa
   - Esfuerzo: MEDIO

10. **Sin tests automatizados**
    - Ubicación: Todo el proyecto
    - Impacto: Cambios quebrantan funcionalidad sin ser detectados
    - Esfuerzo: ALTO (escribir suite de tests)

---

## 📊 MATRIX DE DECISIONES TÉCNICAS

| Decisión | Opción Elegida | Alternativas | Por Qué |
|----------|----------------|--------------|--------|
| **Framework JS** | Vanilla | React/Vue | Simplicidad, cero dependencias |
| **Storage** | Google Sheets | Firebase/Postgres | Costo $0, datos del cliente |
| **Backend** | Google Apps Script | Node.js/Python | Serverless, sin infraestructura |
| **Host** | GitHub Pages | Vercel/Netlify | Gratis, integrado con git |
| **Estado** | Global object | Redux/Context | Simple para forma, cambios centralizados |
| **Comunicación** | Fetch + no-cors | Axios/fetch + CORS | Compatible con cualquier origen |
| **Persistencia** | localStorage | IndexedDB/Session | Suficiente para usar case |

---

## ✅ CHECKLIST PARA PRODUCCIÓN

- [x] Cálculo de presupuestos validado manualmente
- [x] Validación de email en cliente
- [x] Integración con Google Sheets configurada
- [x] Email notifications testeadas
- [x] localStorage persistence funcionando
- [x] Responsive en mobile/tablet/desktop
- [x] DOS FALTA: Tests automatizados
- [x] DOS FALTA: Documentación de Google Apps Script
- [x] DOS FALTA: SLA de respuesta documentado (24h para custom)

---

## 🔗 REFERENCIAS CRUZADAS

- `/docs/MOD-01-REQUIREMENTS.md` - Especificación funcional
- `/docs/MOD-02-DATA-STRUCTURE.md` - Contratos de datos detallados
- `/docs/MOD-06-GOOGLE-SHEETS-INTEGRATION.md` - Setup de webhooks
- `/CHANGELOG.md` - Historial de versiones y bugs corregidos
- `CLAUDE.md` - Guía para desarrolladores (actualizada 13-04-2026)
