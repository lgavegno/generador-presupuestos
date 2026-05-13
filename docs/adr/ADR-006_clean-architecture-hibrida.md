# ADR-006: Arquitectura Híbrida — Clean Architecture parcial coexistiendo con globals legacy

**Estado:** ACEPTADO
**Fecha:** 2026-05-12
**Autor:** Leo (Ongevag Studio) — revisado por Auditoría SDD

---

## Contexto

Durante el Sprint-Logic-Coherence (implementación de `feat/conditional-selection-logic`) se adoptó Clean Architecture con tres capas explícitas (`domain/`, `application/`, `infrastructure/`). Sin embargo, los módulos anteriores (`main.js`, `calculator.js`, `form-handler.js`, `email-handler.js`) permanecen como scripts de carga global con estado compartido mutable (`const state`).

El resultado es una arquitectura híbrida:

- Las tres capas del `ConstraintEngine` siguen separación estricta y contratos explícitos.
- Los módulos legacy acceden a `state` global y al DOM sin restricción de capa.
- El Presenter (`ui-renderer.js`) llama a `updatePresupuesto()` (legacy) al final del ciclo de renderizado — cruzando la frontera entre capas.

---

## Decisión

**Se acepta la coexistencia de ambos estilos en el estado actual del proyecto.**

No se refactorizan los módulos legacy (`main.js`, `calculator.js`, `form-handler.js`) hacia Clean Architecture.

---

## Razones

1. **Scope acotado:** El proyecto es una herramienta de lead generation de una sola página, no un sistema de múltiples dominios. La complejidad adicional de refactorizar los módulos legacy no aporta valor proporcional.

2. **Frontera clara:** La feature de lógica condicional (el único dominio con reglas de negocio no triviales) ya está completamente encapsulada en `domain/ConstraintEngine.js`. El resto es orquestación de UI sin lógica de negocio pura.

3. **Sin tests automatizados:** El valor principal de Clean Architecture es la testeabilidad aislada. Sin test runner, el beneficio se reduce al diseño expresivo y la documentación.

4. **Costo de refactor:** Migrar `calculator.js` a Clean Architecture requeriría eliminar el acceso directo a `state` y al DOM, introducir inyección de dependencias y reorganizar el orden de carga de scripts — todo con riesgo de regresión sin cobertura automatizada.

---

## Consecuencias

### Positivas

- `ConstraintEngine.validateConstraints()` es verificable con `console.assert()` sin levantar el formulario.
- La separación Domain / Application / Presenter está documentada y es mantenible para nuevas features con reglas de negocio.
- El punto de entrada del dominio (`UpdateWebsiteTypeUseCase.execute()`) es el único lugar que modifica `state.websiteType` y `state.features` para el flujo de restricciones.

### Negativas / Riesgos

- **Riesgo de estado inconsistente:** `calculator.js` también modifica `state.websiteType` directamente (línea 47). Si ambos flujos se ejecutan en el mismo ciclo, hay una condición de race potencial. El orden actual de listeners lo evita, pero es frágil.
- **Acoplamiento DOM-state:** `calculator.js:updateUI()` y `ui-renderer.js:renderConstraints()` mutan el mismo DOM sin coordinación explícita. El orden correcto actual es: `renderConstraints()` → `updatePresupuesto()` → `updateUI()`.
- **`state.isCustom` no declarado:** Se agrega dinámicamente en `calculator.js:22`. Si `loadFromStorage()` restaura un state serializado antes de que existiera esta propiedad, el valor es `undefined`.

### Invariantes que deben mantenerse

1. En la capa `domain/`, ningún archivo puede acceder a `state` global ni al DOM.
2. El UseCase (`application/`) es el único punto que limpia `state.features` como respuesta a un cambio de tipo de sitio.
3. El Presenter (`infrastructure/`) solo lee `state` — nunca escribe sobre él.
4. Ninguna lógica de negocio (reglas de precios, restricciones de features) puede vivir en archivos de UI.

---

## Alternativas rechazadas

| Alternativa | Por qué se rechazó |
| :--- | :--- |
| Refactorizar todos los módulos a Clean Architecture | Alcance desproporcionado para el tamaño del proyecto sin cobertura de tests |
| Mantener todo como legacy (no adoptar Clean Architecture) | La lógica condicional tiene reglas de negocio que se benefician de función pura testeable |
| Usar ES Modules (`import`/`export`) | Requiere un bundler o servidor con MIME types correctos; rompe el constraint de "sin build step" (ADR-001) |

---

## Regla de precedente

Nuevas features con lógica de negocio no trivial deben implementarse en `domain/` como funciones puras. El acceso directo al DOM global o a `state` desde domain está prohibido. Para features de UI pura sin reglas de negocio, el estilo legacy es aceptable.
