# Plan de Implementación: Lógica Condicional de Selección

**Sprint**: Sprint-Logic-Coherence
**Spec**: [docs/modules/conditional-logic/MOD-07-CONDITIONAL-LOGIC.md](../../modules/conditional-logic/MOD-07-CONDITIONAL-LOGIC.md)
**ADRs relacionados**: [ADR-001](../../adr/ADR-001_vanilla-js-sin-framework.md)
**Arquitectura**: Clean Architecture — Domain / Application / Infrastructure

---

## Fase 1: Setup de la Feature (P1)

- [x] **T001** `git:` Crear rama `feat/conditional-selection-logic`.
- [x] **T002** `docs:` Registrar inicio de la feature y migración a Clean Architecture en `BITACORA_TECNICA.md`.

---

## Fase 2: Domain Layer — Lógica Pura (P1)

- [x] **T003** `feat(js):` Implementar `presupuestador/js/domain/ConstraintEngine.js`.
  - Exportar función pura `validateConstraints(websiteType, features)`.
  - Sin acceso al DOM ni al objeto `state` global.
  - Retorna `ValidationResult` según contrato definido en MOD-07 §4.
  - Cubre: restricciones de tipo (CA-01, CA-03) y cascada de dependencias (CA-02, §7 Escenario B).
  - _(Spec: MOD-07 §2, §4 Contrato ValidationResult)_

---

## Fase 3: Application Layer — Orquestación (P1)

- [x] **T004** `feat(js):` Implementar `presupuestador/js/application/UpdateWebsiteTypeUseCase.js`.
  - Orquesta: llama a `ConstraintEngine`, actualiza `state` (fuente de verdad primero), invoca al Presenter.
  - Garantiza que `state.features` se limpie antes de cualquier mutación del DOM.
  - Maneja el evento `change` en `tipo_sitio` como punto de entrada.
  - _(Spec: MOD-07 UC-02-state-cleanup, CA-04, §7 Escenario A)_

---

## Fase 4: Infrastructure Layer — Presenter / UI Renderer (P1)

- [x] **T005** `feat(js):` Implementar `presupuestador/js/infrastructure/ui-renderer.js`.
  - Función `renderConstraints(state, reasons)` que traduce state a mutaciones del DOM.
  - Deshabilita checkboxes incompatibles (`disabled=true`, `checked=false`).
  - Renderiza feedback visual por feature usando `reasons[featureId]` del `ValidationResult`.
  - Llama `updatePresupuesto()` al finalizar el render.
  - _(Spec: MOD-07 CA-01 a CA-06, UC-01-selection-constraints, UC-03-visual-feedback)_

---

## Fase 5: Implementación CA-06 — Feedback Visual (P1)

> **Estado:** PENDIENTE DE IMPLEMENTACION — deuda tecnica alta.
> `ui-renderer.js` recibe `reasons` del ValidationResult pero solo hace `console.log`. CA-06 requiere feedback visible en el DOM.

- [ ] **T011** `feat(js):` Implementar feedback visual en `ui-renderer.js:renderConstraints()`.
  - Para cada `featureId` en `reasons`, inyectar el mensaje en un elemento de feedback asociado al checkbox.
  - Estrategia sugerida: elemento `<span class="constraint-hint">` adyacente al label del checkbox, insertado/actualizado/eliminado dinamicamente.
  - Cuando el tipo cambia a uno compatible, eliminar todos los hints existentes.
  - _(Spec: MOD-07 CA-06, UC-03-visual-feedback.md Paso 3)_

- [ ] **T012** `test(manual):` Verificar CA-06 — cada restriccion activa muestra mensaje visible al usuario (no solo en consola).

---

## Fase 6: Validación Manual del Sprint (P1)

- [ ] **T006** `test(manual):` Verificar CA-01 — "Carrito & Pagos" `disabled` en tipos != ecommerce.
- [ ] **T007** `test(manual):` Verificar CA-02 — "Gestión de Stock" `disabled` si "Carrito & Pagos" no está en state.
- [ ] **T008** `test(manual):` Verificar CA-03 — "Multi-idioma" y "Blog" `disabled` en Landing Page.
- [ ] **T009** `test(manual):` Verificar CA-04 — cambio E-Commerce → Institucional limpia state.features.
- [ ] **T010** `test(manual):` Verificar CA-05 — al volver a E-Commerce, los checkboxes se habilitan nuevamente.

---

## Definition of Done (DoD)

- [ ] No se pueden seleccionar funcionalidades incompatibles en ningún tipo de sitio.
- [ ] Al cambiar de E-Commerce a otro tipo, las opciones incompatibles se desmarcan automáticamente y `state.features` queda limpio (CA-04).
- [ ] "Gestión de Stock" se deshabilita en cascada si "Carrito & Pagos" es eliminado (CA-02, §7 Escenario B).
- [ ] El DOM es siempre derivado de `state` — nunca al revés (§7 invariante).
- [ ] Cada restricción activa muestra un mensaje de feedback visual al usuario **en el DOM** (CA-06). `console.log` no cuenta.
- [ ] `ConstraintEngine` es una función pura: no importa DOM, no modifica `state`, retorna `ValidationResult`.
