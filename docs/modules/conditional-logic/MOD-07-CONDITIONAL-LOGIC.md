# MOD-07: Lógica Condicional y Restricciones de Selección

**Estado**: Aprobado — v2.0 (Clean Architecture)
**Fecha**: 2026-05-12
**Autor**: Leo (Analyst Jr.) — revisado por Auditoría SDD

---

## 1. Problema

El sistema permite combinaciones técnicamente incoherentes (ej: Pagos Online en una Landing Page), generando presupuestos que no representan un producto viable. El objetivo es proteger la coherencia del modelo de negocio impidiendo selecciones incompatibles.

---

## 2. Reglas de Negocio (Constraints)

| Funcionalidad | Requisito / Dependencia | Acción en UI |
| :--- | :--- | :--- |
| **Carrito & Pagos** | Requiere "E-Commerce" como Tipo de Sitio | Deshabilitar si no es E-Commerce |
| **Gestión de Stock** | Requiere "Carrito & Pagos" activo | Deshabilitar si Carrito & Pagos está inactivo |
| **Multi-idioma** | Excluir en "Landing Page" (1 sola sección) | Deshabilitar en Landing Page |
| **Blog / Noticias** | Requiere "Institucional" o "E-Commerce" | Deshabilitar en Landing Page |

---

## 3. Requisito Técnico de Alto Nivel

El sistema debe exponer un mecanismo de validación reactivo que:

- Se ejecute cada vez que cambia el campo `tipo_sitio` en el formulario.
- Evalúe el estado global de selecciones contra las reglas de negocio definidas en la Sección 2.
- Modifique el estado de los inputs de UI (habilitado/deshabilitado) y el objeto de estado interno de forma atómica.

> **Nota de scope**: El detalle de implementación (funciones específicas, archivos, estrategia de event listeners) pertenece al Plan de Implementación, no a este documento.

---

## 4. Separación de Responsabilidades (Clean Architecture)

La implementación sigue una separación estricta de capas. Cada capa tiene una responsabilidad única y no puede importar de capas superiores.

| Capa | Archivo | Responsabilidad |
| :--- | :--- | :--- |
| **Domain** | `domain/ConstraintEngine.js` | Lógica de negocio pura. Sin acceso al DOM ni a `state`. Recibe parámetros, retorna `ValidationResult`. Testeable de forma aislada. |
| **Application** | `application/UpdateWebsiteTypeUseCase.js` | Orquesta el flujo: invoca el Domain, actualiza `state` (fuente de verdad), delega la renderización al Presenter. |
| **Infrastructure / Presenter** | `infrastructure/ui-renderer.js` | Traduce `state` y `ValidationResult.reasons` a mutaciones del DOM. No contiene lógica de negocio. |

### Contrato: `ValidationResult`

Objeto retornado por `ConstraintEngine.validateConstraints(websiteType, features)`:

```javascript
// ValidationResult
{
  invalidFeatures: string[],         // IDs de features que violan restricciones activas
  reasons: {                         // Mensaje legible por el usuario, keyed por featureId
    [featureId: string]: string      // Ej: { carrito_pagos: "Solo disponible en E-Commerce" }
  }
}
```

**Invariante:** Si `invalidFeatures` está vacío, `reasons` también lo está. No existe `reasons[id]` sin que `id` esté en `invalidFeatures`.

---

## 5. Casos de Uso

Los casos de uso están documentados como archivos individuales en `docs/use-cases/`. Cada uno describe el Happy Path en términos de capas de Clean Architecture.

| Archivo | Descripción |
| :--- | :--- |
| [UC-01-selection-constraints.md](../../use-cases/UC-01-selection-constraints.md) | Restricción de selección: el usuario intenta activar una funcionalidad bloqueada |
| [UC-02-state-cleanup.md](../../use-cases/UC-02-state-cleanup.md) | Limpieza de state: cambio de tipo invalida funcionalidades activas |
| [UC-03-visual-feedback.md](../../use-cases/UC-03-visual-feedback.md) | Feedback visual: el Presenter muestra el motivo de cada restricción activa |

El diagrama de secuencia (arquitectura v2) está en [SEQ-01-conditional-logic.puml](../../use-cases/SEQ-01-conditional-logic.puml).

---

## 6. Criterios de Aceptación

| ID | Criterio | Medición |
| :--- | :--- | :--- |
| CA-01 | El checkbox "Carrito & Pagos" está `disabled` si `state.websiteType !== "ecommerce"` | Atributo HTML `disabled=true` en el input |
| CA-02 | El checkbox "Gestión de Stock" está `disabled` si "Carrito & Pagos" no está en `state.features` | Atributo HTML `disabled=true` en el input |
| CA-03 | Los checkboxes "Multi-idioma" y "Blog" están `disabled` si `state.websiteType === "landing"` | Atributo HTML `disabled=true` en ambos inputs |
| CA-04 | Al cambiar de E-Commerce a otro tipo, las funcionalidades incompatibles desaparecen de `state.features` | `state.features` no contiene `"carrito_pagos"` ni `"gestion_stock"` tras el cambio |
| CA-05 | El presupuesto se recalcula inmediatamente tras cualquier desmarque automático | El valor del DOM `#precio-total` refleja el nuevo cálculo antes del próximo render |
| CA-06 | Se muestra un mensaje de feedback visual cuando una funcionalidad está deshabilitada | Elemento de tooltip o mensaje visible con descripción del requisito |

---

## 7. Manejo de Errores — Integridad del Objeto `state`

### Escenario A: Desmarque forzado por cambio de tipo de sitio

**Riesgo:** Si el desmarque del checkbox y la actualización de `state.features` no ocurren de forma atómica, el objeto `state` puede quedar en un estado inconsistente (UI muestra desmarcado pero `state` aún contiene el valor).

**Comportamiento requerido:**
1. Al detectar un cambio de tipo incompatible, primero actualizar `state.features` (fuente de verdad).
2. Luego actualizar el estado visual del DOM a partir del `state` actualizado.
3. Nunca inferir el estado de selección desde el DOM — el DOM es siempre derivado de `state`.

**Invariante a preservar:** `state.features` nunca debe contener una funcionalidad cuyo constraint no sea satisfecho por `state.websiteType`.

### Escenario B: Dependencia en cascada (Gestión de Stock)

**Riesgo:** "Gestión de Stock" depende de "Carrito & Pagos". Si "Carrito & Pagos" es deshabilitada, "Gestión de Stock" también debe deshabilitarse en cascada sin que el usuario tenga que intervenir.

**Comportamiento requerido:** El engine de validación debe resolver dependencias en cascada. Orden de evaluación:
1. Primero: restricciones de tipo de sitio (Sección 2, Columna 2).
2. Segundo: restricciones de dependencia entre funcionalidades (ej: Stock → Carrito).

---

## 8. Feedback Visual (Requisito de UX)

Cada funcionalidad deshabilitada debe mostrar al usuario el motivo de por qué no está disponible. El mecanismo exacto (tooltip, texto inline, clase CSS) es decisión de implementación, pero el contenido debe:

- Identificar el requisito no cumplido (ej: "Requiere plan E-Commerce").
- No generar confusión sobre si es un error del sistema o una restricción de negocio.

---

**Versión:** 2.0
**Próxima revisión:** Al completar Fase 2 (Domain layer implementado)
