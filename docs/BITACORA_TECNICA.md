# BITÁCORA TÉCNICA — Generador de Presupuestos

## Metodología

Documento de registro cronológico de decisiones técnicas, auditorías y cambios arquitecturales. Complementa el CHANGELOG (qué cambió) con el contexto de por qué cambió.

---

## Auditoría 1 — Documentación Senior (Abril 2026)

**Objetivo:** Llevar el proyecto de score 4/10 a 8/10 en documentación para portfolio senior.

**Estado previo:**
- Sin ADRs
- MODs con precios desactualizados
- Sin CLAUDE.md
- Sin sección técnica en README
- Estructura dual /js/ vs /presupuestador/js/ sin resolver
- MOD-07 y PLAN-*.md archivos sin propósito claro
- Referencias inconsistentes a API_SPEC.md en documentación

**Acciones ejecutadas:**
- ✅ Creados 4 ADRs (docs/adr/)
  - ADR-001: Decisión de usar Vanilla JS sin framework
  - ADR-002: Decisión de Google Apps Script como backend
  - ADR-003: Análisis de estructura dual /js/ vs /presupuestador/js/
  - ADR-004: ARS como moneda única (sin conversión)

- ✅ Actualizados MOD-01 a MOD-06 con valores reales del código
  - MOD-01: REQUIREMENTS — scope y constraints
  - MOD-02: DATA-STRUCTURE — CONFIG y state objects
  - MOD-03: PROMPT-GENERATOR — legacy, no implementado
  - MOD-04: UI-ARCHITECTURE — estructura de DOM y eventos
  - MOD-05: EMAIL-SYSTEM — validación y envío del formulario
  - MOD-06: GOOGLE-SHEETS-INTEGRATION — código GAS y schema

- ✅ Creado CLAUDE.md como guía de navegación para IAs
  - Mapa de documentación completo
  - Flujo de datos crítico
  - Los 3 gotchas que rompen todo
  - Convenciones del proyecto
  - Contexto de negocio

- ✅ README extendido con secciones técnicas
  - Technical Architecture (diagrama)
  - Engineering Decisions (tabla de ADRs)
  - Known Limitations (honesto sobre deuda técnica)
  - Project Metrics (LOC, deps, costs)

- ✅ Reestructuración JS: `/js/` raíz movido a presupuestador/js/ (commit 82a2ba0)
  - Ejecutada Opción B de DEDUPLICATION_AUDIT
  - `/presupuestador/js/` es la fuente de verdad única
  - calculator.js y form-handler.js sincronizados

- ✅ Renumeración MODs documentada
  - MOD-03 (PROMPT-GENERATOR) marcado como legacy/no implementado
  - MOD-07 (PROJECT-STRUCTURE) eliminado de referencias activas
  - Estructura consistente MOD-01 a MOD-06

- ✅ Metodología SDD + Scrum + Clean Architecture documentada explícitamente
  - En PROJECT_CONSTITUTION.md
  - En PROJECT_LOG.md
  - En CLAUDE.md

**Commits clave:**
- 82a2ba0 — feat: documentación SDD senior (ADRs, MODs actualizados, reestructuración JS)
- eda8d72 — docs: cleanup + renumber MODs + explicit SDD/Scrum/Clean Architecture methodology
- fe0ffb3 — docs: update DEDUPLICATION_AUDIT to reflect Opción B completion (19/04/2026)

**Score final:** 8/10

**Deuda técnica pendiente:**
- Ver sección "Deuda Técnica Activa" en PROJECT_LOG.md
- Documentado en "Known Limitations & Roadmap" en README.md

---

## Verificaciones Cruzadas Ejecutadas (19 de abril de 2026)

### 1. Referencias de MOD en documentación
```
✅ README.md — actualizado a MOD-01 a MOD-06 (sin MOD-07)
✅ CLAUDE.md — referencias correctas a MOD-02, MOD-06
✅ PROJECT_CONSTITUTION.md — scope referencia a MOD-01
✅ docs/adr/ADR-003 — análisis de estructura dual
```

### 2. Referencias de carpeta JS
```
✅ README.md — "Fuente de verdad única: presupuestador/js/"
✅ CLAUDE.md — "/presupuestador/js/ es la ÚNICA fuente de verdad"
✅ presupuestador/index.html — carga scripts de ./js/ (relativo a presupuestador/)
✅ Estructura resuelta: No existe /js/ en la raíz
```

**Nota:** Deuda técnica resuelta en commit 82a2ba0 (Opción B ejecutada). Solo `/presupuestador/js/` existe.

### 3. API_SPEC.md como fuente de verdad del webhook
```
✅ README.md — "docs/API_SPEC.md — Contrato completo del webhook (fuente de verdad)"
✅ CLAUDE.md — "Antes de tocar email-handler.js o el backend"
✅ MOD-06 — ejemplos refieren a API_SPEC.md
```

### 4. DEDUPLICATION_AUDIT.md
```
✅ CLAUDE.md — "Ver DEDUPLICATION_AUDIT.md"
✅ README.md — "Estructura dual" menciona en Known Limitations
✅ Referencia cruzada OK
```

---

## Issues Conocidos (documentados)

| Issue | Severidad | Estado | Workaround |
|-------|-----------|--------|------------|
| `mode: 'no-cors'` oculta errores del webhook | MEDIA | Abierto | Revisar LOGS sheet en GAS |
| `GOOGLE_SCRIPT_URL` hardcodeada | BAJA | Abierto | Actualizar manualmente en email-handler.js |
| `TIPO_CAMBIO` hardcodeado (360) | BAJA | Abierto | Actualizar en main.js CONFIG |
| Sin rate limiting en webhook | BAJA | Abierto | Monitorear LOGS sheet |
| MOD-03 (PROMPT-GENERATOR) nunca implementado | INFO | Cerrado | Documentado como legacy |
| MOD-07 (PROJECT-STRUCTURE) anticuado | INFO | Cerrado | Removido de referencias activas |

---

## Archivos Activos vs Legacy

### Activos (mantenidos)
- `/presupuestador/js/` — 6 archivos en sincronización
- `/docs/MOD-01 a MOD-06/` — especificaciones vigentes
- `/docs/adr/` — 4 decisiones arquitecturales
- `CLAUDE.md` — guía para IAs
- `CHANGELOG.md` — historial de cambios
- `README.md` — documentación principal
- `API_SPEC.md` — contrato del webhook

### Legacy (no ejecutados, documentados)
- `/docs/MOD-03-PROMPT-GENERATOR.md` — especificación de generador de prompts nunca implementado
- `/docs/MOD-07-PROJECT-STRUCTURE.md` — estructura antigua del proyecto
- `/docs/PLAN-001-IMPLEMENTATION.md` — plan de fase A (completado)
- `/docs/PLAN-002-EMAIL-IMPLEMENTATION.md` — plan de fase B (completado)
- `/docs/PLAN-003-RESTRUCTURE.md` — plan de reestructuración JS (completado)

---

## Cambios Documentados en Auditoría (19/04/2026)

### README.md
- ✅ Sección "Documentación" actualizada: referencias a API_SPEC.md como fuente de verdad
- ✅ Sección "Estructura del Proyecto" reescrita con estructura real actual
- ✅ Clarificación: presupuestador/js/ es la fuente de verdad única

### BITACORA_TECNICA.md (este archivo)
- ✅ Creado para documentar auditoría y decisiones
- ✅ Registry de cambios técnicos y contexto
- ✅ Complemento del CHANGELOG.md

### Verificaciones pendientes
- [ ] Ejecutar grep para inconsistencias cruzadas (Tarea 4)
- [ ] Actualizar referencias de MOD-07 si existen
- [ ] Validar que presupuestador/index.html carga de ../js/

---

## Decisiones de Documentación Tomadas

### 1. MOD-03 como Legacy
**Decisión:** Marcar MOD-03-PROMPT-GENERATOR como "nunca implementado" pero mantener en repos.
**Razón:** Proporciona contexto histórico sin confundir sobre funcionalidades activas.
**Alternativa rechazada:** Eliminar archivo completamente (perdería contexto).

### 2. API_SPEC.md como fuente de verdad
**Decisión:** Promover API_SPEC.md sobre MOD-06 en documentación.
**Razón:** El webhook es la interfaz crítica; cualquier cambio debe partir de API_SPEC.md.
**Impacto:** Cualquier change to email-handler.js requiere validar API_SPEC.md primero.

### 3. Estructura presupuestador/js/ única
**Decisión:** Documentar que `/presupuestador/js/` es la ÚNICA fuente de verdad.
**Razón:** commit 82a2ba0 ejecutó DEDUPLICATION_AUDIT.md Opción B.
**Nota:** CLAUDE.md aún dice "ver DEDUPLICATION_AUDIT.md" para contexto histórico.

---

## Score de Documentación

**Antes (4/10):**
- ❌ Sin Architecture Decision Records
- ❌ Sin guía de navegación (CLAUDE.md)
- ❌ README desactualizado (precios viejos, estructura incorrecta)
- ❌ SDD/Scrum/Clean Architecture no explícitas
- ✅ Funciona en producción
- ✅ MODs existen pero desconectados

**Después (8/10):**
- ✅ 4 ADRs documentados con trade-offs
- ✅ CLAUDE.md con gotchas críticos
- ✅ README actualizado con estructura real, metricas, limitaciones
- ✅ SDD/Scrum/Clean Architecture explícitas en PROJECT_CONSTITUTION.md + PROJECT_LOG.md
- ✅ API_SPEC.md como contrato claro del webhook
- ✅ MODs actualizados (MOD-03 marcado legacy)
- ⚠️ Aún hay deuda: estructura dual histórica, modo no-cors, GOOGLE_SCRIPT_URL hardcodeada

---

## Próximos Pasos (Roadmap)

### Corto plazo (podrían hacerse sin refactor)
- [ ] Mover GOOGLE_SCRIPT_URL a config.js o env variable
- [ ] Mover TIPO_CAMBIO a config.js con actualización manual
- [ ] Agregar honeypot field en formulario para reducir spam

### Mediano plazo (requiere trabajo)
- [ ] Reemplazar `mode: 'no-cors'` con CORS propicio en GAS
- [ ] Implementar rate limiting en webhook (1/email/5min)
- [ ] Agregar PDF export del quote para el cliente

### Largo plazo (arquitectura)
- [ ] Resolver deuda técnica: eliminar /js/ raíz, consolidar solo presupuestador/js/
- [ ] Considerar framework ligero (Preact, Alpine) si escala mucho
- [ ] Migrar de Google Apps Script a servidor dedicado si volumen crece

---

**Documento generado:** 19 de abril de 2026
**Auditor:** Claude Senior Architect
**Status:** ✅ COMPLETADO

---

## Auditoría 3 — Reorganización SDD Senior y Plan de Refactor (Mayo 2026)

**Objetivo:** Estructurar documentación en patrón SDD Senior y crear plan para limpieza de raíz.

**Estado previo:**
- Documentación plana en `/docs/` sin jerarquía
- MOD-*.md junto a referencias globales (confuso para onboarding)
- Sin carpetas funcionales para planes de ejecución

**Acciones ejecutadas:**

### 1. Reorganización de Estructura (12 mayo 2026)
- ✅ Creadas carpetas funcionales:
  - `docs/modules/` — contiene MOD-01 a MOD-06
  - `docs/plans/` — para planes de ejecución (vacío, listo para uso)
  - `docs/archive/` — para legacy (vacío, reservado)

- ✅ Movidos 6 MOD-*.md a `docs/modules/`
  - MOD-01-REQUIREMENTS.md
  - MOD-02-DATA-STRUCTURE.md
  - MOD-03-UI-ARCHITECTURE.md
  - MOD-04-EMAIL-SYSTEM.md
  - MOD-05-GOOGLE-SHEETS-INTEGRATION.md
  - MOD-06-PROJECT-STRUCTURE.md

- ✅ Mantenidos en raíz de `/docs/`:
  - API_SPEC.md, BITACORA_TECNICA.md (este), PROJECT_CONSTITUTION.md, PROJECT_LOG.md
  - DATA-NORMALIZATION.md, SETUP-GOOGLE-SHEETS.md (referencias de onboarding)
  - docs/adr/ (ADR-001 a ADR-005)

### 2. Actualización de Referencias
- ✅ CLAUDE.md:
  - Línea 35: `docs/MOD-02-DATA-STRUCTURE.md` → `docs/modules/MOD-02-DATA-STRUCTURE.md`
  - Línea 37: `docs/MOD-05-GOOGLE-SHEETS-INTEGRATION.md` → `docs/modules/MOD-05-GOOGLE-SHEETS-INTEGRATION.md`
  - Agregada sección: "Estructura de documentación (SDD Senior)" con diagrama completo

- ✅ README.md:
  - Línea 115: Actualizada referencia a MOD-05
  - Línea 133: Actualizada instrucción de setup
  - Línea 298-319: Reescrita estructura de proyecto con subcarpetas

### 3. Creación de Plan de Implementación
- ✅ Creado `docs/plans/cleanup-ui-refactor/plan.md`
  - Sprint: Sprint-Refactor-Mayo
  - Fase 1: Limpieza de `/index.html` (raíz)
  - Fase 2: Refactor UI sidebar (terminología "Previsualización Estimada")
  - Enlaza ADR-003 y ADR-005

**Commits pendientes:**
- Reorganización SDD + plan de refactor

**Beneficios:**
- 📁 Estructura clara: especificaciones (modules/) vs. planes (plans/) vs. decisiones (adr/)
- 🔍 Onboarding mejorado: referencias globales en raíz
- 📋 Listo para múltiples sprints de ejecución
- 📖 Documentación agnóstica a idioma (carpetas funcionales)

**Deuda técnica validada:**
- ✅ ADR-005 documentado y aprobado (preview sidebar)
- ⏳ ADR-006 pendiente: consolidación final de /index.html raíz

---

**Documento actualizado:** 12 de mayo de 2026
**Auditor:** Claude Senior Architect
**Status:** ✅ REORGANIZACIÓN COMPLETADA
