# UC-03 — Feedback Visual por Restricción Activa

**Módulo**: MOD-07 — Lógica Condicional
**Version**: 2.0 (Clean Architecture)
**Fecha**: 2026-05-12

---

## Actor

Usuario del formulario de cotización.

## Precondiciones

- El Presenter recibió un `ValidationResult` con al menos una entrada en `reasons`.
- El estado del formulario es coherente (`state.features` ya fue limpiado por el UseCase).

## Trigger

El Presenter ejecuta `render(state, reasons)` como resultado de un cambio de tipo de sitio o de la inicialización del formulario.

## Happy Path

| Paso | Capa | Responsabilidad |
| :--- | :--- | :--- |
| 1 | **UseCase** | Tras limpiar `state`, invoca `Presenter.render(state, ValidationResult.reasons)`. |
| 2 | **Presenter** | Para cada feature en `reasons`, obtiene el mensaje de restricción (ej: `"Solo disponible en planes E-Commerce"`). |
| 3 | **Presenter** | Inyecta el mensaje en el elemento de feedback asociado al checkbox (tooltip, texto inline o clase CSS). |
| 4 | **Presenter** | Si la restricción fue activada por un cambio de tipo (no por init), muestra un aviso global: `"Se desactivaron opciones incompatibles con el tipo seleccionado"`. |
| 5 | **UI Layer** | El usuario ve visualmente por qué una funcionalidad está bloqueada, sin confundirlo con un error del sistema. |

## Post-condición

Cada funcionalidad deshabilitada tiene un mensaje de feedback visible que identifica el requisito no cumplido. El usuario entiende la restricción como una regla de negocio, no como un bug.

## Excepciones

| ID | Escenario | Comportamiento requerido |
| :--- | :--- | :--- |
| E1 | El mensaje de feedback no tiene un elemento destino en el DOM | El Presenter degrada con gracia: la restricción se aplica (disabled) aunque no haya elemento visual disponible |
| E2 | Múltiples funcionalidades deshabilitadas simultáneamente | Cada una recibe su propio mensaje individual desde `reasons[featureId]`. El aviso global se muestra una única vez |
| E3 | El usuario regresa a un tipo compatible (ej: vuelve a E-Commerce) | El Presenter elimina los mensajes de feedback y habilita los checkboxes — el estado de feedback no persiste |

---

*Ver también*: [UC-01-selection-constraints.md](./UC-01-selection-constraints.md) | [UC-02-state-cleanup.md](./UC-02-state-cleanup.md) | [SEQ-01](./SEQ-01-conditional-logic.puml)
