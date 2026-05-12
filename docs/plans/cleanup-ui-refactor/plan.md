# Plan de Implementación: Limpieza Raíz y Refactor UX Sidebar

**Fecha**: 2026-05-12
**Sprint**: Sprint-Refactor-Mayo
**ADRs relacionados**: [ADR-003](../../adr/ADR-003_dual-file-structure.md) · [ADR-005](../../adr/ADR-005_clarificacion-previsualizacion.md)

---

## Resumen
Eliminación del archivo legacy en la raíz y corrección de la "falsa sensación de tiempo real" en el sidebar del presupuestador.

---

## Contexto Técnico
**Stack**: HTML5 / Vanilla JS
**Fuente de verdad**: `presupuestador/`

---

## Fase 1: Setup & Cleanup (P1)
- [ ] **T001** `chore(cleanup):` Eliminar `/index.html` (raíz).
- [ ] **T002** `docs(bitacora):` Registrar la eliminación en `BITACORA_TECNICA.md`.

## Fase 2: Refactor UI Sidebar (P1)
- [ ] **T003** `feat(ui):` Cambiar label a "Previsualización Estimada" en `presupuestador/index.html`.
- [ ] **T004** `feat(ui):` Agregar disclaimer de presupuesto orientativo en el sidebar de `presupuestador/index.html`.
- [ ] **T005** `test(manual):` Verificar carga correcta vía `python -m http.server 8000`.

---

## Definition of Done (DoD)
- [ ] El archivo de la raíz ya no existe.
- [ ] El presupuestador carga correctamente desde la subcarpeta.
- [ ] El sidebar muestra la nueva terminología de previsualización.
