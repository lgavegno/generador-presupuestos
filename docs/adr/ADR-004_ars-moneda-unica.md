# ADR-004: ARS como moneda única del presupuesto (sin conversión USD en frontend)

**Estado:** Aceptado
**Fecha:** Marzo 2026 (inferida del CHANGELOG v1.1.0)
**Autor:** Leandro Gavegno (Ongevag Studio)

---

## Contexto

El generador de presupuestos cotiza servicios de desarrollo web para **PyMEs argentinas**. El contexto económico de Argentina (inflación, tipo de cambio variable, brechas cambiarias) hace que la gestión de precios en múltiples monedas sea técnicamente problemática y comercialmente confusa.

En versiones anteriores del sistema, se calculaba un equivalente en USD (`totalUSD = total / TIPO_CAMBIO`). Este campo existía en el estado y se enviaba al backend.

## Decisión

A partir de v1.1.0, se eliminó el campo `totalUSD` de la **vista del cliente** en el frontend. El cálculo sigue existiendo internamente (`TIPO_CAMBIO: 360` en `main.js:18`) y se envía al backend para fines informativos del propietario, pero nunca se muestra al usuario final.

El total que el cliente ve siempre es en ARS.

## Consecuencias positivas

- **Claridad comercial:** El cliente argentino ve el precio final en la moneda que va a pagar. No hay ambigüedad sobre qué tipo de cambio se aplica.
- **Sin errores de redondeo visibles:** La conversión ARS→USD con tipo de cambio fijo puede mostrar valores incoherentes si el tipo de cambio se actualiza pero el código no.
- **Cotización honesta:** En contexto de alta inflación, mostrar USD puede generar expectativas incorrectas (el cliente asume que el precio en ARS "equivale" a ese USD a un tipo de cambio que quizás no sea el oficial).
- **Simplificación del UI:** La card de presupuesto muestra menos información, más clara.

## Trade-offs asumidos

- **Sin referencia dura para el propietario:** El dueño del negocio no puede ver inmediatamente el equivalente en USD desde el presupuestador. Debe consultarlo en Google Sheets (donde sí se almacena `totalUSD`).
- **Tipo de cambio fijo:** `TIPO_CAMBIO: 360` en `main.js` es un valor hardcodeado. Si el propietario quiere un tipo de cambio actualizado para los cálculos internos del backend, debe editar el código y volver a deployar.

## Estado actual del código

```javascript
// js/main.js
const CONFIG = {
    PRESUPUESTO_BASE: {
        landing: 200000,
        simple: 250000,
        portfolio: 350000,
        ecommerce: 600000
    },
    PRECIO_SECCION: 50000,
    PRECIO_FUNCIONALIDAD: 60000,
    IVA: 0.21,
    TIPO_CAMBIO: 360  // Solo para cálculo interno, no se muestra en UI
};
```

El campo `totalUSD` sigue calculándose en `calculator.js:88` pero no se renderiza en ningún elemento del DOM.

## Contexto de negocio relevante

Los clientes objetivo son PyMEs argentinas que pagan en ARS. Los precios base ($200k-$600k ARS) están alineados con el mercado local de desarrollo web en 2026. Un tipo de cambio fijo de 360 ARS/USD implicaría valores de $555-$1.666 USD aproximados, coherentes con tarifas de agencias pequeñas en LATAM.

## Alternativas descartadas

| Alternativa | Por qué se descartó |
|-------------|---------------------|
| Mostrar ambas monedas (ARS + USD) | Confunde al cliente y puede generar disputas sobre qué moneda aplica |
| Precio en USD con conversión a ARS | Inadecuado para el mercado local; requiere actualización constante del tipo de cambio |
| Conectar a API de tipo de cambio (ej. Bluelytics) | Agrega dependencia externa, costo potencial, y punto de falla. Excede el scope del proyecto |

> ⚠️ Inferido del código y CHANGELOG — requiere validación del autor
