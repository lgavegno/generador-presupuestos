# UC-01 — Activar funcionalidad incompatible con el tipo de sitio actual

**Módulo**: MOD-07 — Lógica Condicional  
**Versión**: 1.0  
**Fecha**: 2026-05-12

---

## Actor

Usuario del formulario de cotización.

## Precondiciones

- El formulario está cargado y en estado válido.
- El tipo de sitio seleccionado es distinto de E-Commerce (`state.websiteType !== "ecommerce"`).

## Trigger

El usuario intenta seleccionar una funcionalidad incompatible con el tipo de sitio activo (ej: "Carrito & Pagos" en Landing Page).

## Happy Path

1. El sistema evalúa `state.websiteType` contra las reglas de negocio de MOD-07 §2.
2. El checkbox de la funcionalidad incompatible se renderiza con atributo `disabled=true` **antes** de cualquier interacción del usuario.
3. El sistema muestra feedback visual explicando el requisito no cumplido (ej: "Solo disponible en planes E-Commerce").
4. El objeto `state` no registra la funcionalidad como activa — `state.features` no contiene el valor.

## Post-condición

La selección no ocurre. El presupuesto permanece sin cambios.

## Excepciones

| ID | Escenario | Comportamiento requerido |
| :--- | :--- | :--- |
| E1 | El DOM se renderiza antes de que el engine de validación ejecute | El checkbox debe inicializarse en `disabled` desde el setup inicial, no agregarse post-render |
| E2 | El usuario manipula el DOM directamente (DevTools) | El submit valida `state`, no el DOM — una selección forzada en el DOM no llega al payload |

---

*Ver también*: [UC-02](./UC-02.md) — cambio de tipo que invalida selecciones activas | [SEQ-01](./SEQ-01-conditional-logic.puml)
