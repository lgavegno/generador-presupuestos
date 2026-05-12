# ADR-005: Clarificación de Previsualización en Sidebar

**Estado**: Propuesto  
**Fecha**: 2026-05-12  
**Autor**: Leo (Analyst Jr. / Student)

## Contexto
Se detectó que el texto "Actualizado en tiempo real" genera una falsa sensación de finalización. El usuario ve el precio y puede abandonar el sitio sin enviar el formulario, lo que rompe el flujo de captación de leads de Ongevag Studio.

## Decisión
Modificar el lenguaje visual del sidebar en `presupuestador/index.html` para dejar claro que el valor es una estimación previa al envío formal.

1. **Cambio de Label**: Reemplazar "Actualizado en tiempo real" por "Previsualización Estimada".
2. **Disclaimer**: Añadir una nota aclaratoria: *"Este valor es orientativo. Enviá el formulario para recibir el presupuesto final por email."*

## Consecuencias
* **Positivas**: Mejora en la conversión de leads al obligar a la acción de envío y alinear expectativas.
* **Negativas**: Mayor carga textual en el sidebar.