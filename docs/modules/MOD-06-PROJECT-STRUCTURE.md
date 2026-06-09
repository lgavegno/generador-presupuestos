# MOD-06: Project Structure & Deployment

**Status:** ACTIVE
**Version:** 2.0
**Last Updated:** 2026-05-12

---

## Estructura de Directorios (Estado Actual)

```
generador-presupuestos/          (raiz del repositorio)
├── presupuestador/              (unica fuente de verdad del frontend)
│   ├── index.html               (formulario completo — HTML + eventos)
│   ├── css/
│   │   └── style.css            (todos los estilos — 741 lineas, archivo externo)
│   ├── sitio-web-vs-landing.png (imagen de referencia)
│   └── js/
│       ├── domain/
│       │   └── ConstraintEngine.js          [DOMAIN] Logica pura de restricciones
│       ├── application/
│       │   └── UpdateWebsiteTypeUseCase.js  [APPLICATION] Orquestacion de flujo
│       ├── infrastructure/
│       │   └── ui-renderer.js               [INFRASTRUCTURE] Presenter / mutaciones DOM
│       ├── main.js              [LEGACY] CONFIG, state global, init
│       ├── calculator.js        [LEGACY] Calculos de precios, updateUI, reset
│       ├── form-handler.js      [LEGACY] Validacion, collectFormData, submitForm
│       ├── email-handler.js     [LEGACY] fetch a Google Apps Script
│       ├── storage.js           [STUB] Sin implementacion activa
│       └── ui-updater.js        [STUB] Sin implementacion activa
├── docs/                        (documentacion SDD)
│   ├── PROJECT_CONSTITUTION.md
│   ├── PROJECT_LOG.md
│   ├── BITACORA_TECNICA.md
│   ├── API_SPEC.md
│   ├── DATA-NORMALIZATION.md
│   ├── SETUP-GOOGLE-SHEETS.md
│   ├── modules/                 (especificaciones de modulos)
│   │   ├── MOD-01-REQUIREMENTS.md
│   │   ├── MOD-02-DATA-STRUCTURE.md
│   │   ├── MOD-03-UI-ARCHITECTURE.md
│   │   ├── MOD-04-EMAIL-SYSTEM.md
│   │   ├── MOD-05-GOOGLE-SHEETS-INTEGRATION.md
│   │   ├── MOD-06-PROJECT-STRUCTURE.md   (este archivo)
│   │   └── conditional-logic/
│   │       └── MOD-07-CONDITIONAL-LOGIC.md
│   ├── adr/                     (Architecture Decision Records)
│   │   ├── ADR-001_vanilla-js-sin-framework.md
│   │   ├── ADR-002_google-apps-script-backend.md
│   │   ├── ADR-003_dual-file-structure.md
│   │   ├── ADR-004_ars-moneda-unica.md
│   │   ├── ADR-005_clarificacion-previsualizacion.md
│   │   └── ADR-006_clean-architecture-hibrida.md
│   ├── use-cases/               (casos de uso formales)
│   │   ├── UC-01-selection-constraints.md  (v2 — Clean Arch)
│   │   ├── UC-02-state-cleanup.md          (v2 — Clean Arch)
│   │   ├── UC-03-visual-feedback.md        (v2 — Clean Arch)
│   │   ├── UC-04-cotizacion-submit.md
│   │   ├── UC-05-modo-custom.md
│   │   ├── UC-01.md                        (v1 — legacy, supersedido por UC-01-*)
│   │   ├── UC-02.md                        (v1 — legacy, supersedido por UC-02-*)
│   │   ├── UC-03.md                        (v1 — legacy, supersedido por UC-03-*)
│   │   └── SEQ-01-conditional-logic.puml   (diagrama de secuencia PlantUML)
│   ├── plans/                   (planes de ejecucion por sprint)
│   │   ├── feature-conditional-logic/
│   │   │   └── plan.md
│   │   └── ui-cleanup-refactor/
│   │       └── plan.md
│   └── archive/                 (documentacion legacy — vacío, reservado)
├── CLAUDE.md                    (guia de navegacion para IAs)
├── README.md
├── CHANGELOG.md
└── .gitignore
```

---

## Orden de Carga de Scripts en index.html

El orden es critico. Las capas Clean Architecture deben cargarse antes que los modulos legacy que las invocan:

```html
<!-- DOMAIN (sin dependencias) -->
<script src="./js/domain/ConstraintEngine.js"></script>

<!-- APPLICATION (depende de ConstraintEngine) -->
<script src="./js/application/UpdateWebsiteTypeUseCase.js"></script>

<!-- INFRASTRUCTURE / PRESENTER (depende de updatePresupuesto del siguiente bloque) -->
<script src="./js/infrastructure/ui-renderer.js"></script>

<!-- LEGACY (globals compartidos, dependen de todo lo anterior) -->
<script src="./js/storage.js"></script>
<script src="./js/ui-updater.js"></script>
<script src="./js/calculator.js"></script>
<script src="./js/form-handler.js"></script>
<script src="./js/email-handler.js"></script>
<script src="./js/main.js"></script>  <!-- init() al final -->
```

**Nota:** `ui-renderer.js` usa un guard defensivo `if (typeof UIRenderer !== 'undefined')` para tolerar carga fuera de orden durante desarrollo incremental.

---

## URL de Produccion

```
Presupuestador: https://lgavegno.github.io/generador-presupuestos/presupuestador/
Repositorio:    https://github.com/lgavegno/generador-presupuestos
```

---

## Servidor de Desarrollo Local

```bash
# Desde la raiz del repo
python -m http.server 8000

# Abrir en browser
http://localhost:8000/presupuestador/index.html
```

No hay build step, no hay hot reload, no hay bundler.

---

## Historial de Estructura

| Version | Fecha | Cambio |
| :--- | :--- | :--- |
| 1.0 | Mar 2026 | Estructura dual `/js/` + `/presupuestador/js/` |
| 1.1 | Abr 2026 | ADR-003: deduplicacion. `/presupuestador/js/` como fuente de verdad unica. `/js/` raiz eliminado. |
| 1.2 | May 2026 | Eliminado `/index.html` raiz (remanente legacy). |
| 2.0 | May 2026 | Agregadas subcarpetas `domain/`, `application/`, `infrastructure/` para Clean Architecture de feature MOD-07. |

---

## Nota sobre Archivos Stub

`storage.js` y `ui-updater.js` existen como archivos con solo un `console.log`. Se mantienen por:
1. Estan referenciados en el orden de carga de scripts en `index.html`.
2. Reservan el namespace para implementacion futura si el proyecto escala.

Si se eliminan, tambien deben removerse sus `<script>` tags en `index.html`.
