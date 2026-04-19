# ADR-003: Estructura dual de archivos (raíz /js/ + /presupuestador/)

**Estado:** Parcialmente resuelto — deuda técnica activa
**Fecha:** Marzo-Abril 2026 (ver PLAN-003 y DEDUPLICATION_AUDIT.md)
**Autor:** Leo (Ongevag Studio)

---

## Contexto

El proyecto creció desde un formulario completo de Tienda Nube hacia un presupuestador minimalista. En algún punto de la evolución, la decisión fue crear una subcarpeta `/presupuestador/` para el nuevo formulario mientras se mantenía la estructura original en la raíz como backup/referencia.

Esto generó una situación donde los mismos archivos JS existen en dos lugares:
- `/js/` (raíz) — scripts "fuente de verdad"
- `/presupuestador/js/` — copia (parcialmente desincronizada)

## Decisión original

Crear la subcarpeta `/presupuestador/` como un módulo independiente con sus propios assets copiados, para poder iterar sin romper la versión anterior.

## Estado actual (inferido del DEDUPLICATION_AUDIT.md)

El `DEDUPLICATION_AUDIT.md` del 13 de abril 2026 revela que:

```
presupuestador/index.html carga scripts de ../js/ (la carpeta raíz)
NO carga scripts de presupuestador/js/
```

Esto significa que:
1. La carpeta `/presupuestador/js/` es efectivamente **código muerto** — no se ejecuta
2. La fuente de verdad real es `/js/` en la raíz
3. La carpeta duplicada existe como legacy sin propósito funcional

### Divergencias encontradas

| Archivo | /js/ (raíz) | /presupuestador/js/ |
|---------|-------------|---------------------|
| calculator.js | 227 líneas, completo | 176 líneas, sin modo custom |
| form-handler.js | 200 líneas | 201 líneas (solo formato) |
| email-handler.js | 32 líneas | 32 líneas (idéntico) |
| main.js | 68 líneas | 68 líneas (idéntico) |

## Consecuencias positivas (en su momento)

- Permitió desarrollar el presupuestador minimalista sin tocar el formulario original
- Redujo el riesgo durante la transición
- El index.html raíz (landing page) y el presupuestador quedaron claramente separados en propósito

## Trade-offs asumidos (deuda técnica)

- **Confusión de paths:** Un desarrollador nuevo no sabrá cuál carpeta JS es la que se usa
- **Riesgo de sincronización:** Si se edita `/presupuestador/js/calculator.js` creyendo que es el activo, los cambios no se reflejan en la app
- **Archivos muertos:** `/presupuestador/js/`, `/presupuestador/css/`, `/presupuestador/data/` y `/data/` no tienen función activa

## Estado de resolución

El `DEDUPLICATION_AUDIT.md` propone **Opción B** (limpiar completamente) que implica:
1. Eliminar `/js/` de la raíz
2. Mover los scripts a `/presupuestador/js/`
3. Actualizar paths en `presupuestador/index.html` de `../js/` a `./js/`

**Al momento de esta documentación, esa limpieza está pendiente de ejecución.**

## Recomendación

Ejecutar la **Opción B** del DEDUPLICATION_AUDIT.md. El riesgo es bajo (presupuestador/index.html ya carga de ../js/, no de presupuestador/js/). El beneficio es eliminar la deuda técnica y la confusión de estructura.

> ⚠️ Inferido del código y DEDUPLICATION_AUDIT.md — requiere validación del autor
