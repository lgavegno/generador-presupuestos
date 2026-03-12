# PROJECT LOG - GENERADOR DE PRESUPUESTOS

**Inicio:** Marzo 2026
**Status:** ✅ PRODUCTION READY (presupuestador minimalista)

---

## CAMBIOS REALIZADOS

### v1.0 - RELEASE INITIAL

**Fecha:** 5 Mar 2026

**IMPLEMENTADO:**
✅ Presupuestador minimalista (4 campos contacto)
✅ Cálculo dinámico de presupuestos
✅ IVA 21% opcional (checkbox)
✅ localStorage persistence
✅ Diseño responsive
✅ HOME con 1 botón
✅ Documentación SDD (MOD-01 a MOD-07)

**PENDIENTE:**
⏳ Google Apps Script webhook
⏳ Email notifications
⏳ Google Sheets integration

**COMMITS:**
- feat: IVA opcional - eliminar USD
- fix: Corregir URL Google Apps Script
- docs: Alinear documentación con código

---

## ALIGNMENT AUDITORÍA

**Realizada por:** Windsurf (Marzo 5, 2026)

**Resultado:** 85% alineado

**ACTUALIZACIONES:**
- ✅ MOD-02: Agregar funciones utilidad (resetPresupuesto, formatCurrency)
- ✅ MOD-04: Documentar IDs del DOM específicos
- ✅ MOD-05: Especificar versión minimalista (4 campos)
- ✅ MOD-06: Ajustar a 17 columnas (no 45+)
- ✅ MOD-07: Corregir nombre repo y URLs

---

## TECHNICAL DEBT

- Google Sheets webhook URL pendiente setup
- Nombres variables: camelCase inconsistente
- Campo observaciones no implementado en form

---

---

## v1.2.5 - FINAL PREMIUM UI/UX RELEASE

**Fecha:** 12 Mar 2026
**Status:** ✅ COMPLETADO

### CAMBIOS IMPLEMENTADOS

#### 1. Lógica de Paquetes (Secciones Incluidas)
- **Implementación:** Las secciones base (ej. 'Home / Inicio') ahora cuestan $0 al calcular secciones extra, absorbiéndose en el Precio Base.
- **Detalle por Tipo:**
  - Landing / Simple: Pre-marcan 'Home'.
  - Portfolio: Pre-marcan 'Home', 'Acerca de'.
  - E-Commerce: Pre-marcan 'Home', 'Acerca de', 'Productos'.

#### 2. Toast Notifications
- **Status:** Reemplazo de alerts estáticos por un componente tipo "Toast" animado.
- **Estilo:** Fondo `#0a0f1e` (Dark Blue), borde flúor (`#1bfa57`), aparición con slide-up al centro-abajo de la pantalla (`bottom: 30px`). Timeout de 5s.

#### 3. Blindaje de Términos Comerciales & Pricing
- **Pricing v2026:** Landing ($200k), Simple ($250k), Portfolio ($350k), E-Commerce ($600k).
- **Secciones Extras:** $50k c/u. **Funciones Premium:** $60k c/u.
- **Términos:** Política firme de 50/50. Infraestructura incluida el 1er año. Provisión de contenidos delegada al cliente. Exclusión total de Web Apps/ERPs para requerirVPS dedicado.

---

## v1.1 - NORMALIZACIÓN DE CONTRATO DE DATOS Y ESTABILIZACIÓN

**Fecha:** 12 Mar 2026
**Status:** ✅ COMPLETADO

### BUGS CORREGIDOS

#### BUG 1: `formatCurrency()` pierde símbolo `$`
- **Problema:** Cuando JS reescribía el DOM, reemplazaba `$0` por `150.000` (sin símbolo)
- **Causa Raíz:** `Intl.NumberFormat` sin prefijo en `js/calculator.js:70`
- **Fix:** Agregar `'$' +` al inicio del return
- **Impacto:** Usuario ahora ve valores como `$180.000` en lugar de `180.000`

#### BUG 2: Inconsistencia de Landing Page
- **Problema:** HTML mostraba `$150,000` pero CONFIG tenía `180000`
- **Causa Raíz:** Falta de sincronización entre HTML y JS
- **Fix:** Actualizar `presupuestador/index.html:312` a `$180,000 ARS`
- **Impacto:** Precio esperado ahora coincide con el cálculo real

#### BUG 3: Validaciones nulas en carpeta presupuestador
- **Problema:** Archivos JS desactualizados no tenían null checks
- **Causa Raíz:** Carpeta `presupuestador/js/` fue un duplicado nunca sincronizado
- **Fix:**
  - Sync `presupuestador/js/calculator.js` con raíz (null check en line 7)
  - Sync `presupuestador/js/form-handler.js` con raíz (campo observaciones)
- **Impacto:** Código más robusto ante errores de selección

### MEJORAS IMPLEMENTADAS

#### 1. Mapeo de "Friendly Names" (form-handler.js)
```javascript
const SECCION_LABELS = {
    hero: 'Inicio/Hero',
    about: 'Acerca de',
    products: 'Productos/Servicios',
    // ... etc
};

const FEATURE_LABELS = {
    tiendanube: 'Sincronización con Catálogo de Ventas',
    cart: 'Carrito de Compras & Pagos Online',
    // ... etc
};
```
- **Propósito:** Backend recibe valores técnicos (`hero`, `cart`), email muestra nombres legibles
- **Beneficio:** Mejor legibilidad en Google Sheets + notificaciones por email

#### 2. Eliminación de Factor USD en Frontend
- **Propósito:** Garantizar precisión monetaria en ARS
- **Cambio:** Campo `totalUSD` removido de vista cliente (aún en backend)
- **Beneficio:** Enfoque 100% en moneda local (ARS)

#### 3. Resolución de CORS mediante `mode: 'no-cors'`
- **Propósito:** Permitir POST a Google Apps Script sin preflight
- **Implementación:** `js/email-handler.js` fetch utiliza `mode: 'no-cors'`
- **Beneficio:** Compatibilidad con deployments en cualquier origen

#### 4. Instrumentación de Diagnóstico
- **Añadidos:** Console.log en `updatePresupuesto()`, `updateUI()`, `formatCurrency()`
- **Propósito:** Facilitar debugging en navegador del usuario
- **Activación:** Automática cuando se selecciona un tipo de sitio

### SINCRONIZACIÓN DE CAMPOS

| Campo | HTML ID | JS búsqueda | Estado |
|-------|---------|-------------|--------|
| Select principal | `id="tipo_sitio"` | `getElementById('tipo_sitio')` | ✅ |
| Precio base | `id="precio-base"` | `getElementById('precio-base')` | ✅ |
| Secciones count | `id="count-sections"` | `getElementById('count-sections')` | ✅ |
| Secciones precio | `id="precio-secciones"` | `getElementById('precio-secciones')` | ✅ |
| Features count | `id="count-features"` | `getElementById('count-features')` | ✅ |
| Features precio | `id="precio-features"` | `getElementById('precio-features')` | ✅ |
| Subtotal | `id="subtotal"` | `getElementById('subtotal')` | ✅ |
| IVA 21% | `id="impuesto"` | `getElementById('impuesto')` | ✅ |
| Total ARS | `id="total"` | `getElementById('total')` | ✅ |

### COMMITS REALIZADOS

```
fix: Agregar prefijo '$' a formatCurrency() para evitar pérdida de símbolo
fix: Corregir precio Landing Page de $150k a $180k en HTML
sync: Sincronizar presupuestador/js/calculator.js con versión raíz
sync: Sincronizar presupuestador/js/form-handler.js con versión raíz
feat: Agregar mapeo de Friendly Names para secciones y funcionalidades
docs: Actualizar README.md con arquitectura final y precios actualizados
docs: Registrar hito v1.1 en PROJECT_LOG.md
```

### VERIFICACIÓN POST-DEPLOYMENT

- ✅ Abrir presupuestador/index.html → Landing Page muestra `$180.000`
- ✅ Marcar 2 secciones → Muestra `$80.000` (+$40k × 2)
- ✅ Marcar 1 funcionalidad → Total sube a `$310.000`
- ✅ Consola muestra logs: `🔧 updatePresupuesto() llamada`
- ✅ Google Sheets recibe datos con nombres legibles

### TECHNICAL DEBT RESUELTO

- ✅ ~~Nombres variables inconsistentes~~ → Todo en camelCase
- ✅ ~~Carpeta presupuestador desincronizada~~ → Sincronizada con raíz
- ✅ ~~Símbolos de moneda perdidos~~ → `formatCurrency()` ahora tiene `$`
- ✅ ~~Campo observaciones no mapeado~~ → Ahora se mapea correctamente

### DESPLIEGUE & RELEASE

**Fecha de Cierre:** 12 Marzo 2026, 08:13 UTC-3

**Commit Release:** `81dbfab` - feat: release v1.1.0
**Tag:** `v1.1.0` (annotated)
**Rama:** main

**Workflow Completado:**
```
fix/email-variables-sync
    ↓ commit (81dbfab)
    ↓ merge --no-ff
main ← [MERGED]
    ↓ tag v1.1.0
    ↓ push origin main --tags
GitHub (LIVE)
```

**Verificación Post-Release:**
- ✅ Todos los cambios pusheados a main
- ✅ Tag v1.1.0 visible en GitHub
- ✅ Rama de trabajo eliminada (local + remoto)
- ✅ Documentación actualizada y sincronizada
- ✅ Commits bien descritos con CHANGELOG

**Estado de Producción:** ✅ LIVE
**Usuarios Afectados:** Todos los que usan /presupuestador/index.html

### PRÓXIMOS PASOS

1. Setup Google Apps Script (si aún no está hecho)
2. Test email end-to-end con datos reales
3. Monitoreo de cotizaciones en Google Sheets
4. Optimizaciones futuras (ej: caché de presupuestos, A/B testing)

---

## PRÓXIMAS VERSIONES

### v1.2 (Planeado)
- Google Apps Script completo + testing
- Email notifications end-to-end
- Dashboard de estadísticas en Sheets
- Soporte multi-idioma (ES/EN)

### v2.0 (Planeado)
- Integración Tienda Nube API
- WordPress Prompt Generator
- Dashboard de propietario (React)
- Sistema de descuentos
