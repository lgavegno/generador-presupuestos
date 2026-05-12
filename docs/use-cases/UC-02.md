# UC-02 — Cambio de tipo de sitio que invalida selecciones activas

**Módulo**: MOD-07 — Lógica Condicional  
**Versión**: 1.0  
**Fecha**: 2026-05-12

---

## Actor

Usuario del formulario de cotización.

## Precondiciones

- El usuario tiene al menos una funcionalidad activa en `state.features` que depende del tipo de sitio actual (ej: "Carrito & Pagos" activo con `state.websiteType === "ecommerce"`).

## Trigger

El usuario cambia el selector de tipo de sitio a un valor incompatible con las funcionalidades activas (ej: E-Commerce → Institucional).

## Happy Path

1. El evento `change` en el selector `tipo_sitio` activa el engine de validación.
2. El engine compara `state.features` actual contra las reglas de negocio de MOD-07 §2 con el nuevo `websiteType`.
3. El engine actualiza `state.features` eliminando las funcionalidades incompatibles **(fuente de verdad primero)**.
4. El DOM se actualiza a partir del `state` limpio: checkboxes incompatibles pasan a `unchecked + disabled`.
5. `updatePresupuesto()` se ejecuta con el estado limpio — el precio total se recalcula.
6. El usuario recibe feedback visual indicando qué funcionalidades fueron desactivadas automáticamente.

## Post-condición

`state.features` no contiene selecciones incompatibles con `state.websiteType`. El presupuesto es coherente.

## Excepciones

| ID | Escenario | Comportamiento requerido |
| :--- | :--- | :--- |
| E1 | Dependencia en cascada: "Gestión de Stock" estaba activa cuando se desactiva "Carrito & Pagos" | El engine resuelve la cascada en orden: primero restricciones de tipo, luego dependencias entre funcionalidades. Ver [SEQ-01](./SEQ-01-conditional-logic.puml) |
| E2 | El DOM se actualiza antes de que `state` se limpie | Invariante: `state` siempre es fuente de verdad. Nunca inferir estado desde el DOM |
| E3 | El usuario cambia el tipo de sitio múltiples veces en rápida sucesión | Cada cambio dispara una validación completa desde cero — no hay acumulación de estado intermedio |

---

*Ver también*: [UC-01](./UC-01.md) — intento de activar funcionalidad bloqueada | [UC-03](./UC-03.md) — caso específico Landing Page | [SEQ-01](./SEQ-01-conditional-logic.puml)
