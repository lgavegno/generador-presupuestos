# PROJECT CONSTITUTION - GENERADOR DE PRESUPUESTOS

**Status:** ACTIVE
**Version:** 2.0
**Last Updated:** 2026-05-12
**Methodology:** SDD (Spec-Driven Development) + Clean Architecture (hibrida)

---

## Objetivo del Proyecto

Formulario web que calcula presupuestos de sitios web en ARS, los guarda en Google Sheets y notifica por email al propietario de Ongevag Studio.

---

## Scope

### En scope
- Presupuestador con tipo de sitio, secciones y funcionalidades
- Calculos de precios en tiempo real (ARS)
- Modo Custom (Web Apps / SaaS — deriva a entrevista)
- Logica condicional de seleccion (restricciones por tipo de sitio)
- Google Sheets integration (via Google Apps Script webhook)
- Notificaciones por email (Gmail / MailApp)
- Responsive design (mobile/tablet/desktop)
- Despliegue en GitHub Pages

### Fuera de scope
- CRM integration
- Procesamiento de pagos
- Export PDF
- Analiticas avanzadas
- Tests automatizados

---

## Estructura de Precios

**Tipo de Sitio (precio base):**
| Tipo | Precio ARS |
| :--- | ---: |
| Landing Page | $200.000 |
| Sitio Simple (3-5 pag) | $250.000 |
| Portfolio | $350.000 |
| E-Commerce | $600.000 |

**Secciones incluidas sin costo adicional:**
- Landing / Simple: Hero
- Portfolio: Hero + Acerca de
- E-Commerce: Hero + Acerca de + Productos

**Secciones adicionales:** $50.000 ARS c/u
**Funcionalidades:** $60.000 ARS c/u
**IVA:** 21% (informativo — nunca sumado al total)

---

## Stack Tecnologico

### Frontend
- HTML5 (Vanilla)
- CSS3 inline en `presupuestador/index.html`
- JavaScript ES6+ (Vanilla, sin frameworks)
- Modulos IIFE — sin ES Modules (constraint de ADR-001)

### Backend
- Google Apps Script (serverless, sin infraestructura propia)
- Google Sheets (storage)
- Gmail / MailApp (notificaciones)

### Hosting
- GitHub Pages (frontend)
- Google Cloud (backend GAS)

### Zero Dependencies
- Sin npm, sin package.json, sin build step
- Sin frameworks JavaScript
- Sin CDN (salvo Google Fonts)
- Servidor de desarrollo: `python -m http.server 8000`

---

## Arquitectura de Capas

El sistema usa **Clean Architecture parcial** (ver ADR-006). Los modulos de logica condicional siguen separacion estricta de capas; los modulos legacy coexisten con acceso directo a `state` y al DOM.

```
presupuestador/js/
├── domain/
│   └── ConstraintEngine.js     [DOMAIN] Logica de negocio pura. Sin DOM, sin state.
│                                         Funcion pura testeable de forma aislada.
├── application/
│   └── UpdateWebsiteTypeUseCase.js  [APPLICATION] Orquestacion: Domain → state → Presenter.
│                                                   Unico punto que limpia state.features.
├── infrastructure/
│   └── ui-renderer.js          [INFRASTRUCTURE / PRESENTER] Traduce state a DOM.
│                                                              No contiene logica de negocio.
│
├── main.js         [LEGACY] CONFIG, state global, DOMContentLoaded, storage.
├── calculator.js   [LEGACY] updatePresupuesto(), updateUI(), resetPresupuesto().
├── form-handler.js [LEGACY] collectFormData(), validateForm(), submitForm().
├── email-handler.js [LEGACY] sendToGoogleSheets(), fetch no-cors.
├── storage.js      [STUB] Sin implementacion activa.
└── ui-updater.js   [STUB] Sin implementacion activa.
```

**Invariantes de arquitectura:**
1. `domain/` no puede acceder a `state` ni al DOM.
2. El UseCase es el unico que modifica `state.features` en el flujo de restricciones.
3. El Presenter solo lee `state` — nunca escribe.
4. Logica de negocio pura va en `domain/`. Los calculos de precios (legacy) estan en `calculator.js` — candidato a migrar si el dominio crece.

---

## Modulos SDD

| MOD | Modulo | Proposito | Status |
| :--- | :--- | :--- | :--- |
| MOD-01 | Requirements | Requerimientos funcionales y acceptance criteria | Activo |
| MOD-02 | Data Structure | Schema de datos, CONFIG, state, contratos | Activo |
| MOD-03 | UI Architecture | Componentes DOM, estilos, paleta visual | Activo |
| MOD-04 | Email System | Integracion de notificaciones email | Activo |
| MOD-05 | Google Sheets Integration | Backend GAS, schema Sheets | Activo |
| MOD-06 | Project Structure | Arquitectura de carpetas, capas, deployment | Activo |
| MOD-07 | Conditional Logic | Logica condicional y restricciones de seleccion | Activo (v2 — Clean Arch) |

---

## Casos de Uso Documentados

| ID | Caso de Uso | Flujo |
| :--- | :--- | :--- |
| UC-01 | Restriccion de seleccion por tipo de sitio | Constraint Engine → disabled checkbox |
| UC-02 | Limpieza de state al cambiar tipo de sitio | E-Commerce → otro tipo → auto-desmarque |
| UC-03 | Feedback visual por restriccion activa | Mensaje inline por feature bloqueada |
| UC-04 | Envio de cotizacion | Submit → validate → POST → Sheets + email |
| UC-05 | Activacion de modo custom | Textarea custom → "A Medida" display |

---

## Architecture Decision Records

| ADR | Titulo | Estado |
| :--- | :--- | :--- |
| ADR-001 | Vanilla JS sin framework | Aceptado |
| ADR-002 | Google Apps Script como backend | Aceptado |
| ADR-003 | Estructura dual /js/ resuelta | Resuelto (Opcion B ejecutada) |
| ADR-004 | ARS como moneda unica | Aceptado |
| ADR-005 | Clarificacion terminologia "Previsualizacion Estimada" | Aceptado |
| ADR-006 | Clean Architecture hibrida | Aceptado |

---

## Flujo de Datos End-to-End

```
Usuario (navegador)
        |
        | Abre presupuestador/index.html
        v
[STEP 1] Seleccion de tipo de sitio (#tipo_sitio)
  → UpdateWebsiteTypeUseCase.execute(newType)
    → ConstraintEngine.validateConstraints()  [DOMAIN]
    → state.features limpiado atomicamente   [APPLICATION]
    → UIRenderer.renderConstraints()          [INFRASTRUCTURE]
    → updatePresupuesto()                     [LEGACY]

[STEP 2] Secciones / Funcionalidades (checkboxes)
  → onchange: updatePresupuesto()             [LEGACY]
  → subtotal = base + seccionesExtra*50k + features*60k
  → iva = subtotal * 0.21 (informativo)
  → total = subtotal (IVA nunca sumado)
  → updateUI() + saveToStorage()

[MODO CUSTOM - alternativo]
  → input/focus en #custom-project-desc
    → resetToCustomMode()
    → state.isCustom = true, tipo = null
    → UI: "A Medida" / "Solicitar Entrevista"

[STEP 3] Datos de contacto (nombre*, email*, telefono, observaciones)

[SUBMIT] Click en boton
  → validateForm()
  → collectFormData()  [mapeo tecnico → legible]
  → fetch(GOOGLE_SCRIPT_URL, { mode: 'no-cors' })
  → POST JSON a Google Apps Script
  → GAS: appendRow() + MailApp.sendEmail()
  → Frontend: showSuccess() / showError()
  → form.reset() + resetPresupuesto()
```

### Notas criticas del flujo

- `mode: 'no-cors'` hace la respuesta siempre opaca. El frontend no puede detectar errores del backend. Debug: hoja LOGS en Google Sheets.
- IVA nunca se suma al total. Es desglose informativo unicamente.
- El modo custom y el modo estandar son mutuamente excluyentes. La fuente de verdad en runtime es el contenido del textarea.

---

## Metricas de Exito

| Metrica | Objetivo | Estado |
| :--- | :--- | :--- |
| Tiempo de setup | < 10 min | Completado |
| Entrega de email | 100% | En produccion |
| Tiempo de email | < 5 seg | En produccion |
| Precision de presupuesto | 100% | Verificado |
| Costo mensual | $0 USD | Mantenido |
| Carga de pagina | < 2 seg | Verificado |

---

## Entregables

- [x] Project Constitution (este documento)
- [x] MOD-01 a MOD-07 (especificaciones de modulos)
- [x] ADR-001 a ADR-006 (decisiones arquitecturales)
- [x] UC-01 a UC-05 (casos de uso documentados)
- [x] API_SPEC.md (contrato del webhook)
- [x] BITACORA_TECNICA.md (log de decisiones tecnicas)
- [x] CLAUDE.md (guia de navegacion para IAs)
- [x] Frontend (HTML/CSS/JS) — en produccion
- [x] Google Apps Script — desplegado
- [x] GitHub Pages — activo
- [ ] Tests automatizados — fuera de scope (sin test runner)
- [ ] CA-06: Feedback visual por restriccion activa — DoD abierto

---

## Deuda Tecnica Activa

| Item | Severidad | Estado |
| :--- | :--- | :--- |
| CA-06: feedback visual por restriccion sin implementar en ui-renderer.js | Alta | Abierto |
| GOOGLE_SCRIPT_URL hardcodeada en email-handler.js | Baja | Aceptado |
| state.isCustom no declarado en shape inicial de state | Media | Aceptado |
| console.log() de debug en produccion (calculator.js) | Baja | Aceptado |
| storage.js y ui-updater.js son stubs vacios | Baja | Aceptado |

---

## Equipo

- **Product Owner / Developer / QA:** Leo (Ongevag Studio)
- **Deployment:** GitHub Pages + Google Apps Script

---

**Siguiente documento:** docs/modules/MOD-01-REQUIREMENTS.md
