# UC-03 — Selección de tipo Landing Page

**Módulo**: MOD-07 — Lógica Condicional  
**Versión**: 1.0  
**Fecha**: 2026-05-12

---

## Actor

Usuario del formulario de cotización.

## Precondiciones

- Cualquier tipo de sitio previo puede estar seleccionado.
- Cero o más funcionalidades pueden estar activas en `state.features`.

## Trigger

El usuario selecciona "Landing Page" en el selector `tipo_sitio`.

## Happy Path

1. El engine de validación detecta `state.websiteType === "landing"`.
2. El engine identifica las funcionalidades incompatibles con Landing Page: `multi_idioma`, `blog_noticias`.
3. Si alguna estaba en `state.features`, se eliminan (aplica lógica de [UC-02](./UC-02.md)).
4. Los checkboxes `multi_idioma` y `blog_noticias` pasan a `unchecked + disabled` simultáneamente.
5. `updatePresupuesto()` recalcula el precio con el estado limpio.

## Post-condición

El formulario solo contiene selecciones válidas para una Landing Page. `state.features` no incluye `multi_idioma` ni `blog_noticias`.

## Excepciones

| ID | Escenario | Comportamiento requerido |
| :--- | :--- | :--- |
| E1 | El usuario tenía "Multi-idioma" y "Blog" activos simultáneamente | Ambos se desmarcan en la misma pasada del engine — no hay orden de precedencia entre ellos |
| E2 | El usuario regresa de Landing Page a Institucional | El engine no restaura selecciones previas — el estado previo no se persiste. El usuario elige de nuevo |

---

*Ver también*: [UC-02](./UC-02.md) — patrón general de invalidación | [SEQ-01](./SEQ-01-conditional-logic.puml)
