# UC-01 — Restricción de Selección por Tipo de Sitio

**Módulo**: MOD-07 — Lógica Condicional
**Version**: 2.0 (Clean Architecture)
**Fecha**: 2026-05-12

---

## Actor

Usuario del formulario de cotización.

## Precondiciones

- El formulario está cargado y en estado válido.
- El tipo de sitio seleccionado es distinto de E-Commerce (`state.websiteType !== "ecommerce"`).

## Trigger

El usuario intenta interactuar con un checkbox de funcionalidad incompatible con el tipo de sitio activo (ej: "Carrito & Pagos" en Landing Page).

## Happy Path

| Paso | Capa | Responsabilidad |
| :--- | :--- | :--- |
| 1 | **UI Layer** | Al renderizar el formulario, el event listener solicita al UseCase el estado inicial de restricciones. |
| 2 | **UseCase** | Llama a `ConstraintEngine.validateConstraints(state.websiteType, state.features)` con el tipo de sitio actual. |
| 3 | **Domain (ConstraintEngine)** | Evalúa reglas de negocio (MOD-07 §2). Retorna `ValidationResult` con `invalidFeatures` y `reasons`. |
| 4 | **UseCase** | No modifica `state.features` (no hay cambio activo). Pasa `ValidationResult` al Presenter. |
| 5 | **Presenter** | Renderiza los checkboxes incompatibles con `disabled=true`. Muestra `reasons[featureId]` como feedback visual. |
| 6 | **UI Layer** | El checkbox permanece deshabilitado — el usuario no puede seleccionarlo. |

## Post-condición

La selección no ocurre. El presupuesto permanece sin cambios. `state.features` no contiene la funcionalidad incompatible.

## Excepciones

| ID | Escenario | Comportamiento requerido |
| :--- | :--- | :--- |
| E1 | El Presenter renderiza antes de que el Domain ejecute | El UseCase inicializa restricciones en el setup del formulario — el Presenter nunca renderiza un estado sin validar |
| E2 | El usuario manipula el DOM directamente (DevTools) | El submit valida `state` directamente, no el DOM. Una manipulación del DOM no modifica `state.features` |

---

*Ver también*: [UC-02-state-cleanup.md](./UC-02-state-cleanup.md) | [SEQ-01](./SEQ-01-conditional-logic.puml)
