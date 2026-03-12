# CHANGELOG - Generador de Presupuestos

Formato: Basado en [Keep a Changelog](https://keepachangelog.com/)
Versionado: [Semantic Versioning](https://semver.org/)

---

## [1.1.0] - 2026-03-12

### 📌 Hito: Normalización de Contrato de Datos y Estabilización

#### Fixed (Bugs Corregidos)

**BUG 1: formatCurrency() pierde símbolo `$`**
- `js/calculator.js:70` - Agregado prefijo `'$'` a Intl.NumberFormat
- Efecto: Valores ahora muestran como `$180.000` en lugar de `180.000`
- Impacto: Crítico (visual bug que hacía parecer que el cálculo no funcionaba)

**BUG 2: Inconsistencia de precio Landing Page**
- `presupuestador/index.html:312` - Actualizado de `$150,000` a `$180,000`
- Alineado con `CONFIG.PRESUPUESTO_BASE.landing = 180000` en `main.js:10`
- Impacto: Usuario ve el precio correcto en el dropdown

**BUG 3: Validaciones nulas en carpeta presupuestador/**
- `presupuestador/js/calculator.js:7` - Agregado null check: `typeSelect ? typeSelect.value : null`
- `presupuestador/js/calculator.js:25` - Agregado fallback: `CONFIG.PRESUPUESTO_BASE[selectedType] || 0`
- `presupuestador/js/form-handler.js` - Sincronizado con versión raíz (incluye `observaciones`)
- Impacto: Carpeta presupuestador/ ahora está en sync con `/js/`

#### Added (Nuevas Características)

**Mapeo de "Friendly Names"**
- `form-handler.js` - Agregadas constantes `SECCION_LABELS` y `FEATURE_LABELS`
- Propósito: Frontend envía valores técnicos (`hero`, `cart`), email muestra nombres legibles
- Beneficio: Google Sheets y notificaciones son 100% legibles para usuarios no técnicos

**Instrumentación de Diagnóstico**
- `js/calculator.js` - Agregados console.log en `updatePresupuesto()` y `updateUI()`
- Propósito: Facilitar debugging cuando el usuario reporta problemas
- Activación: Automática, visible en Developer Tools (F12)

#### Changed (Cambios)

**Eliminación de Factor USD en Frontend**
- Campo `totalUSD` removido de vista cliente
- Aún se envía al backend (Google Apps Script) pero no se muestra en presupuesto
- Propósito: Garantizar precisión monetaria en ARS (evitar errores de redondeo)

**CORS Resolution**
- `js/email-handler.js` - Implementado `mode: 'no-cors'` en fetch
- Propósito: Permitir POST a Google Apps Script sin request preflight
- Beneficio: Compatible con deployments en cualquier origen

#### Documentation

- ✅ **README.md** - Completamente reescrito con arquitectura, tecnologías, precios actualizados
- ✅ **PROJECT_LOG.md** - Registrado hito v1.1 con detalles técnicos
- ✅ **MOD-06-GOOGLE-SHEETS-INTEGRATION.md** - Agregada sección de "Friendly Names"
- ✅ **CHANGELOG.md** - Este archivo (nuevo)

#### Testing

| Escenario | Resultado | Status |
|-----------|-----------|--------|
| Seleccionar Landing Page | Muestra `$180.000` | ✅ |
| Marcar 2 secciones | Suma correcta `$80.000` | ✅ |
| Marcar 1 funcionalidad | Suma correcta `$310.000` | ✅ |
| Console logs al cambiar select | Aparecen logs de diagnóstico | ✅ |
| IDs del HTML | Todos coinciden con búsquedas JS | ✅ |

#### Dependencies

- Sin cambios de dependencias (Vanilla JS, sin librerías externas)

#### Migration Guide (si aplica)

No hay cambios que requieran migración. El sistema es completamente backward-compatible.

---

## [1.0.0] - 2026-03-05

### 📌 Hito: Release Initial

#### Added
- ✅ Presupuestador minimalista (4 campos contacto)
- ✅ Cálculo dinámico de presupuestos
- ✅ IVA 21% incluido automáticamente
- ✅ localStorage persistence
- ✅ Diseño responsive
- ✅ HOME con 1 botón (enlace a presupuestador)
- ✅ Documentación SDD (MOD-01 a MOD-07)

#### Pending
- ⏳ Google Apps Script webhook (implementado pero no testeado)
- ⏳ Email notifications (configurado en Apps Script)
- ⏳ Google Sheets integration (estructura diseñada)

---

## Estructura de Versiones Futuras

### v1.2 (Planeado)
- [ ] Google Apps Script completo + testing
- [ ] Email notifications end-to-end
- [ ] Dashboard de estadísticas en Sheets
- [ ] Soporte para múltiples idiomas (ES/EN)

### v2.0 (Planeado)
- [ ] Integración con Tienda Nube API
- [ ] WordPress Prompt Generator
- [ ] Dashboard de propietario (React)
- [ ] Sistema de descuentos y promociones

---

## 🔗 Referencias

- **Repo:** https://github.com/lgavegno/generador-presupuestos
- **Docs:** `/docs/` (MOD-01 a MOD-07)
- **Contact:** osvojag@gmail.com
