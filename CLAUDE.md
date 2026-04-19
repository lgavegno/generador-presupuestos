# CLAUDE.md — Contexto para IA

## Qué hace este proyecto (30 palabras)

Formulario web que calcula presupuestos de sitios web en ARS, los guarda en Google Sheets y notifica por email al propietario de la agencia.

---

## Stack en una línea

HTML + Vanilla JS + Google Apps Script + Google Sheets + Gmail — sin frameworks, sin npm, sin build step.

---

## Mapa de documentación

| Archivo | Qué contiene | Cuándo leerlo |
|---------|-------------|---------------|
| `README.md` | Visión general, precios, payload webhook, troubleshooting | Siempre primero |
| `docs/PROJECT_CONSTITUTION.md` | Scope, constraints, fases del proyecto, diagrama de flujo | Contexto de negocio |
| `docs/API_SPEC.md` | Contrato exacto del webhook (payload, respuesta, schema Sheets) | **Antes de tocar email-handler.js o el backend** |
| `docs/MOD-02-DATA-STRUCTURE.md` | Objetos CONFIG y state, lógica de cálculo detallada | Antes de tocar calculator.js |
| `docs/DATA-NORMALIZATION.md` | Cómo se mapean valores técnicos a nombres legibles | Antes de agregar secciones o funcionalidades |
| `docs/MOD-06-GOOGLE-SHEETS-INTEGRATION.md` | Código de Google Apps Script + estructura de Sheets | Para cambios en backend GAS |
| `docs/SETUP-GOOGLE-SHEETS.md` | Instrucciones de configuración inicial | Solo para setup nuevo |
| `docs/adr/` | Decisiones de arquitectura con contexto y trade-offs | Para entender "por qué" algo está así |
| `DEDUPLICATION_AUDIT.md` | Análisis de archivos duplicados y deuda técnica pendiente | Si hay confusión sobre qué archivo editar |
| `CHANGELOG.md` | Historial de bugs corregidos y cambios | Para entender la evolución del proyecto |

---

## Flujo de datos crítico

```
Usuario rellena form (presupuestador/index.html)
        |
        | onchange en selects/checkboxes
        v
calculator.js: updatePresupuesto()
  - Lee CONFIG.PRESUPUESTO_BASE[tipo] → precio base
  - Filtra secciones incluidas (no cobrables)
  - Calcula: subtotal = base + seccionesCobrables*50k + features*60k
  - IVA = subtotal * 0.21 (SOLO informativo, NO se suma al total)
  - total = subtotal
        |
        | updateUI() → actualiza DOM
        | saveToStorage() → localStorage
        v
Usuario hace click en "Enviar Cotización"
        |
        v
form-handler.js: submitForm()
  - validateForm() → nombre, email (required), tipo_sitio (si no es custom)
  - collectFormData() → mapea valores técnicos a legibles (SECCION_LABELS/FEATURE_LABELS)
  - Si is_custom → presupuesto = {todos ceros}, tipo_sitio = "WEB APP / CUSTOM"
        |
        | fetch() con mode: 'no-cors'
        v
email-handler.js → POST a GOOGLE_SCRIPT_URL
        |
        v
Google Apps Script (doPost)
  - Parsea JSON
  - Appenda fila en Google Sheets (columnas A-Q)
  - Envía email con MailApp al propietario
  - Retorna {success, submission_id} (opaco por no-cors, el frontend no lo puede leer)
        |
        v
Frontend: showSuccess() o showError()
Form reset + resetPresupuesto()
```

---

## Los 3 gotchas que rompen todo

### 1. `mode: 'no-cors'` hace que la respuesta sea siempre "exitosa" para el frontend

En `email-handler.js:14`, el fetch usa `mode: 'no-cors'`. Esto significa que si el Google Apps Script retorna un error 500, el frontend lo ignora y muestra "Cotización procesada exitosamente" igual. Para debuggear errores de backend, hay que ir **directamente a Google Sheets → hoja LOGS**.

### 2. `/presupuestador/js/` es la ÚNICA fuente de verdad

`presupuestador/index.html` carga los scripts de `./js/` (relativo a presupuestador/), que apunta a `/presupuestador/js/`. Esta es la única carpeta JS activa en el proyecto. No existe `/js/` en la raíz. Ver `DEDUPLICATION_AUDIT.md` para contexto histórico (Opción B ejecutada en commit 82a2ba0).

### 3. El IVA se calcula pero NO se suma al total

El presupuesto tiene un campo `iva` que es `subtotal * 0.21`, pero el `total` final es igual al `subtotal` — el IVA **nunca se suma**. Esto es por diseño: el IVA se muestra como información desglosada. Si sumás IVA al total, sobreestimás el precio. Ver `calculator.js:87`: `const total = subtotal; // IVA NOT included in final total`.

---

## Convenciones de este proyecto

### Naming
- Variables de estado: `state.websiteType`, `state.sections[]`, `state.features[]`
- Funciones de cálculo: camelCase con prefijo de acción (`updatePresupuesto`, `resetPresupuesto`)
- IDs del DOM: kebab-case (`tipo_sitio`, `precio-base`, `submit-btn`)
- Valores técnicos de secciones: snake_case corto (`hero`, `about`, `products`)
- Valores en email/Sheets: friendly name en español (`Inicio/Hero`, `Acerca de`)

### Patrones
- El estado global (`state`) vive en `main.js` y es modificado por `calculator.js`
- El mapeo técnico→legible ocurre en `form-handler.js:collectFormData()` **antes** del POST
- Los campos de la respuesta del webhook usan `camelCase` (ej: `customDescription`, no `custom_description`)
- Los campos del payload usan `snake_case` (ej: `tipo_sitio`, `secciones_elegidas`)

### Lo que NO hacer
- No agregar dependencias npm (no hay package.json, es por diseño)
- No mover el CSS inline a archivos externos sin discutirlo antes
- No crear carpeta `/js/` en la raíz (la deuda técnica fue resuelta: usa solo `/presupuestador/js/`)
- No cambiar `mode: 'no-cors'` a `mode: 'cors'` sin configurar headers en Google Apps Script

---

## Contexto de negocio

- **Cliente/usuario:** visitante del sitio web de Ongevag Studio que quiere cotizar un sitio web
- **Propietario:** Leo (Ongevag Studio) — recibe emails con cada cotización
- **Mercado:** PyMEs argentinas, precios en ARS
- **Dos flujos:** Standard (4 tipos de sitio + secciones + funcionalidades) y Custom (Web Apps/SaaS → deriva a entrevista)
- **Monetización:** No aplica (herramienta de captación de leads)

---

## Para la próxima IA

Antes de tocar código, verificá:

1. **Qué archivo JS está activo:** La app usa `/presupuestador/js/` (única fuente de verdad). Ver `DEDUPLICATION_AUDIT.md` para contexto histórico.
2. **Precios vigentes:** El precio en producción está en `CONFIG.PRESUPUESTO_BASE` en `js/main.js`. Algunos docs reflejan versiones anteriores ($180k-$500k) que ya no aplican.
3. **Modo custom vs standard:** Muchas funciones tienen bifurcación `if (state.isCustom)`. Si agregás lógica nueva, pensá si aplica a ambos modos.
4. **Contrato del webhook:** Antes de cambiar `collectFormData()` en `form-handler.js`, leé `docs/API_SPEC.md` para no romper el schema de Google Sheets.
5. **La deuda de estructura dual** está documentada en `DEDUPLICATION_AUDIT.md` y los ADRs. Salvo que el usuario pida explícitamente resolverla, no la toques.
