# UC-02 — Limpieza de State al Cambiar Tipo de Sitio

**Módulo**: MOD-07 — Lógica Condicional
**Version**: 2.0 (Clean Architecture)
**Fecha**: 2026-05-12

---

## Actor

Usuario del formulario de cotización.

## Precondiciones

- El usuario tiene al menos una funcionalidad activa en `state.features` que depende del tipo de sitio actual (ej: `carrito_pagos` con `state.websiteType === "ecommerce"`).

## Trigger

El usuario cambia el selector `tipo_sitio` a un valor incompatible con las funcionalidades activas (ej: E-Commerce → Institucional).

## Happy Path

| Paso | Capa | Responsabilidad |
| :--- | :--- | :--- |
| 1 | **UI Layer** | El event listener captura el evento `change` en `tipo_sitio`. Invoca `UpdateWebsiteTypeUseCase.execute({ newType, currentFeatures })`. |
| 2 | **UseCase** | Llama a `ConstraintEngine.validateConstraints(newType, state.features)`. |
| 3 | **Domain (ConstraintEngine)** | Fase 1: evalúa restricciones de tipo. Fase 2: resuelve cascada (ej: si `carrito_pagos` es inválido, `gestion_stock` también). Retorna `ValidationResult`. |
| 4 | **UseCase** | Actualiza `state.websiteType = newType` **primero**. Elimina `invalidFeatures` de `state.features` (fuente de verdad antes del DOM). |
| 5 | **Presenter** | Recibe `state` limpio y `ValidationResult.reasons`. Actualiza DOM: `unchecked + disabled` en features inválidas. |
| 6 | **Presenter** | Llama `updatePresupuesto()` — el precio se recalcula con el estado limpio. |

## Post-condición

`state.features` no contiene selecciones incompatibles con `state.websiteType`. El DOM es derivado de `state`. El presupuesto es coherente.

## Excepciones

| ID | Escenario | Comportamiento requerido |
| :--- | :--- | :--- |
| E1 | Cascada: "Gestión de Stock" activa cuando se invalida "Carrito & Pagos" | El Domain resuelve dependencias en cascada en Fase 2. El UseCase elimina ambas del state en una sola operación atómica |
| E2 | El Presenter actualiza el DOM antes de que el UseCase limpie el state | Invariante: UseCase siempre limpia `state` antes de invocar al Presenter. Ver SEQ-01 v2 |
| E3 | El usuario cambia el tipo múltiples veces en rápida sucesión | Cada invocación del UseCase ejecuta validación completa desde cero — no hay acumulación de estado intermedio |

---

*Ver también*: [UC-01-selection-constraints.md](./UC-01-selection-constraints.md) | [UC-03-visual-feedback.md](./UC-03-visual-feedback.md) | [SEQ-01](./SEQ-01-conditional-logic.puml)
