# ADR-001: Vanilla JS sin framework (sin React/Vue/Angular)

**Estado:** Aceptado
**Fecha:** Marzo 2026 (inferida del CHANGELOG v1.0.0)
**Autor:** Leo (Ongevag Studio)

---

## Contexto

Había que elegir el stack de frontend para una herramienta de cotización que sería mantenida por un desarrollador solo, deployada en GitHub Pages (hosting estático), y que debería funcionar sin costo alguno. La audiencia técnica es un freelancer/agencia, no un equipo de ingeniería.

## Decisión

Se eligió JavaScript vanilla (ES6+) sin ningún framework, sin herramientas de build, sin package.json, sin bundler.

## Consecuencias positivas

- **Zero build step:** El proyecto se puede editar con cualquier editor y ver en el navegador directamente con `python -m http.server`. No hay `npm install`, no hay webpack, no hay transpilación.
- **Deploya solo:** GitHub Pages sirve el HTML/CSS/JS tal cual están en el repositorio. No hay CI/CD necesaria.
- **Tiempo de carga mínimo:** El presupuestador carga en < 1 segundo. No hay bundle de React (45KB+) que descargar.
- **Mantenible sin ecosistema:** No hay dependencias que se deprecen o requieran actualización de seguridad.
- **Cero dependencias externas:** El único CDN externo es Google Fonts (Inter). Si falla, el texto sigue siendo legible.

## Trade-offs asumidos

- **Sin gestión de estado reactiva:** El estado global (`state` en `main.js`) se actualiza manualmente. Si el formulario creciera a >20 campos con interdependencias complejas, esto se volvería difícil de mantener.
- **Sin tipado estático:** No hay TypeScript. Los errores de tipo se detectan en runtime, no en compilación.
- **Sin componentes reutilizables:** El HTML está inline en los archivos `.html`. No hay sistema de templates que permita reutilizar cards o secciones.
- **Sin hot reload:** Cambiar código requiere hacer F5 manualmente en el navegador.

## Alternativas descartadas

| Alternativa | Por qué se descartó |
|-------------|---------------------|
| React + Vite | Requiere npm, bundler, CI/CD para deployar. Overhead desproporcionado para un form de cotización. |
| Vue 3 | Ídem React. Agrega complejidad innecesaria. |
| Alpine.js | Hubiera sido una opción razonable (directivas declarativas, sin build), pero se descartó para no introducir ninguna dependencia. |
| Svelte | Requiere compilación. |

## Nota

La arquitectura actual tiene **531 líneas de JS distribuidas en 6 archivos**. El punto de inflexión donde un framework empezaría a justificarse sería alrededor de 1500-2000 líneas o cuando haya múltiples desarrolladores trabajando simultáneamente.

> ⚠️ Inferido del código — requiere validación del autor
