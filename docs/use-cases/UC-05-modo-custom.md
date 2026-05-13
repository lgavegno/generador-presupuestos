# UC-05 — Activación del Modo Custom (Proyecto a Medida)

**Modulo**: Core — Flujo Alternativo
**Version**: 1.0
**Fecha**: 2026-05-12

---

## Actor

Usuario del formulario de cotización que tiene un proyecto no estándar (Web App, SaaS, sistema a medida).

## Precondiciones

- El formulario está cargado.
- El campo `#custom-project-desc` está vacío inicialmente.

## Trigger

El usuario comienza a escribir en el textarea `#custom-project-desc` (evento `input` o `focus` con contenido).

## Happy Path — Activación de Modo Custom

| Paso | Archivo | Responsabilidad |
| :--- | :--- | :--- |
| 1 | `main.js` | Event listener `input`/`focus` en `#custom-project-desc` detecta que `value.trim().length > 0`. Invoca `resetToCustomMode()`. |
| 2 | `calculator.js` | `resetToCustomMode()`: resetea `state` completamente (`websiteType=null`, `features=[]`, `sections=[]`, `isCustom=true`). |
| 3 | `calculator.js` | Desmarca todas las `.option-card` y radio inputs. Resetea `#tipo_sitio` a valor vacío. Desmarca todos los checkboxes. |
| 4 | `calculator.js` | `updateUI()`: oculta el desglose de precios (precio-base, secciones, features, subtotal, IVA). Muestra "A Medida" en `#total`. Cambia botón a "Solicitar Entrevista". |
| 5 | `calculator.js` | `saveToStorage()`: persiste el estado custom en localStorage. |

## Happy Path — Desactivación (usuario borra el texto)

| Paso | Archivo | Responsabilidad |
| :--- | :--- | :--- |
| 1 | `main.js` | `input` detecta que `value.trim().length === 0`. `resetToCustomMode()` NO se invoca. |
| 2 | `calculator.js` | El estado permanece con `isCustom=true` hasta que el usuario seleccione un tipo de sitio. |
| 3 | `calculator.js` | `updatePresupuesto()` evalúa `isCustom` basándose en el contenido actual del textarea en tiempo de ejecución, no en `state.isCustom`. |

## Post-condición — Modo Custom Activo

- `state.isCustom = true`, `state.websiteType = null`, `state.features = []`, `state.sections = []`.
- Sidebar muestra "A Medida" en el total.
- Pasos 2 y 3 del formulario (secciones y funcionalidades) tienen `opacity: 0.4` y `pointer-events: none`.
- El botón de submit muestra "Solicitar Entrevista".
- Al enviar: `tipo_sitio = "WEB APP / CUSTOM"`, `presupuesto = {ceros}`, `asunto = "SOLICITUD PROYECTO CUSTOM - [nombre]"`.

## Excepciones

| ID | Escenario | Comportamiento requerido |
| :--- | :--- | :--- |
| E1 | El usuario selecciona un tipo de sitio mientras hay texto en el textarea | `updatePresupuesto()` lee el textarea en tiempo real: si tiene texto, mantiene modo custom y bloquea las secciones. La selección de tipo de sitio no activa el modo estándar mientras haya descripción custom. |
| E2 | El usuario borra el texto del textarea y selecciona un tipo de sitio | `updatePresupuesto()` detecta textarea vacío: desactiva modo custom, restaura secciones y funcionalidades, muestra desglose de precios. |
| E3 | El estado custom persiste en localStorage entre sesiones | `loadFromStorage()` en `DOMContentLoaded` restaura `state.isCustom = true`. El formulario inicia en modo custom si la última sesión quedó así. |

## Notas de Diseño

- El modo custom y el modo estándar son **mutuamente excluyentes**. No puede haber un tipo de sitio seleccionado y una descripción custom activa simultáneamente.
- La fuente de verdad del modo custom en tiempo de ejecución es el **contenido del textarea**, no `state.isCustom`. `state.isCustom` se usa para la UI y la persistencia, pero `updatePresupuesto()` y `collectFormData()` re-evalúan el textarea cada vez.
- La discriminación ocurre en dos puntos independientes: `calculator.js:updatePresupuesto()` (para la UI) y `form-handler.js:collectFormData()` (para el payload). Ambos leen `customDesc = document.getElementById('custom-project-desc')?.value.trim()`.

---

*Ver también*: [UC-04-cotizacion-submit.md](./UC-04-cotizacion-submit.md)
