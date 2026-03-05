---

# MOD-03: PROMPT GENERATOR SPECIFICATION

**Status:** ACTIVE  
**Version:** 1.0  
**Last Updated:** Marzo 2026  

---

## 🎯 OBJECTIVE

Define the structure, format, and generation logic for the WordPress AI Assistant prompt that is automatically created from form data in the presupuestador.

---

## 📋 PROMPT PURPOSE

The generated prompt is a detailed briefing document for WordPress AI Assistant that includes:
- Complete client specifications
- Website requirements
- Design preferences
- Pricing breakdown
- Ready-to-use for AI-powered website generation

---

## 🏗️ PROMPT STRUCTURE

The generated prompt follows this 10-section structure:

```
1. BRIEFING EJECUTIVO
2. INFORMACIÓN DEL CLIENTE
3. ESPECIFICACIONES DEL SITIO WEB
4. PALETA DE COLORES
5. TIPOGRAFÍA
6. SECCIONES DETALLADAS
7. FUNCIONALIDADES
8. REQUISITOS TÉCNICOS
9. PRESUPUESTO DESGLOSADO
10. INSTRUCCIONES DE ENTREGA
```

---

## 📝 PROMPT TEMPLATE

```
════════════════════════════════════════════════════════════
GENERACIÓN DE SITIO WEB - WORDPRESS AI ASSISTANT
════════════════════════════════════════════════════════════

BRIEFING EJECUTIVO:
Crear un sitio web de [TIPO_SITIO] con enfoque en [OBJETIVO].
Plataforma: WordPress
Diseño: Moderno, responsivo, profesional

INFORMACIÓN DEL CLIENTE:
Nombre: [NOMBRE]
Email: [EMAIL]
Teléfono: [TELEFONO]

ESPECIFICACIONES DEL SITIO WEB:

Tipo de Sitio: [TIPO_SITIO]
- Landing Page: Página única optimizada para conversión
- Sitio Simple: 3-5 páginas informativas
- Portfolio: Showcase de trabajos/productos
- E-Commerce: Tienda online completa

Secciones Incluidas:
[PARA CADA SECCIÓN SELECCIONADA]
- Hero/Header: Banner principal de bienvenida
- About: Acerca de la empresa
- Products: Catálogo de productos/servicios
- Gallery: Galería de imágenes
- Testimonials: Opiniones de clientes
- FAQ: Preguntas frecuentes
- Blog: Sección de noticias/artículos
- Contact: Formulario de contacto
- Newsletter: Suscripción a newsletter

Funcionalidades Incluidas:
[PARA CADA FUNCIONALIDAD SELECCIONADA]
- Integración Tienda Nube: Conexión con plataforma de ventas
- Carrito de compras: Sistema de compra online
- Búsqueda avanzada: Motor de búsqueda funcional
- Sistema de filtros: Filtros para productos/contenido
- Múltiples idiomas: Soporte multiidioma
- Optimización SEO: Mejora para buscadores
- Analytics: Rastreo de visitantes
- Sistema de reservas: Booking de servicios/eventos

REQUISITOS GENERALES:
✓ WCAG 2.1 AA accessible
✓ Optimizado para SEO
✓ Compatible con Chrome, Firefox, Safari, Edge
✓ Responsive en móvil (Mobile-first)
✓ Formularios funcionales
✓ Integración con analytics
✓ Velocidad de carga optimizada (< 3 segundos)
✓ HTTPS/SSL obligatorio

PRESUPUESTO DESGLOSADO:
Base ([TIPO_SITIO]): $[PRECIO_BASE] ARS
Secciones ([COUNT] × $40k): $[PRECIO_SECCIONES] ARS
Funcionalidades ([COUNT] × $50k): $[PRECIO_FUNCIONALIDADES] ARS
────────────────────────────────────
Subtotal: $[SUBTOTAL] ARS
IVA (21%): $[IVA] ARS
════════════════════════════════════
TOTAL: $[TOTAL] ARS (~USD $[USD])

Vigencia de oferta: 7 días
════════════════════════════════════

OBSERVACIONES ESPECIALES:
[OBSERVACIONES_USUARIO]

PRÓXIMOS PASOS:
1. Confirmación de presupuesto
2. Contrato y pago de seña
3. Inicio de desarrollo
4. Revisiones y ajustes
5. Entrega final
```

---

## 🔧 JAVASCRIPT PROMPT GENERATION

```javascript
function generatePrompt(formData) {
  const p = formData.presupuesto;
  const sections = formData.secciones_elegidas;
  const features = formData.funcionalidades;
  
  let prompt = `
════════════════════════════════════════════════════════════
GENERACIÓN DE SITIO WEB - WORDPRESS AI ASSISTANT
════════════════════════════════════════════════════════════

BRIEFING EJECUTIVO:
Crear un sitio web de ${formData.website_type} profesional y moderno.
Cliente: ${formData.nombre}
Email: ${formData.email}
Teléfono: ${formData.telefono}

ESPECIFICACIONES:
Tipo: ${formData.website_type}
Secciones: ${sections.join(', ')}
Funcionalidades: ${features.join(', ')}

Observaciones: ${formData.observaciones || 'Ninguna'}

PRESUPUESTO:
Base: $${p.precio_base}
Secciones (${sections.length}): $${p.precio_secciones}
Funcionalidades (${features.length}): $${p.precio_funcionalidades}
Subtotal: $${p.subtotal_ars}
IVA (21%): $${p.impuesto}
TOTAL: $${p.total_ars} ARS (~USD $${p.total_usd})
════════════════════════════════════════════════════════════
  `;
  
  return prompt;
}

// Uso:
const prompt = generatePrompt(formData);
console.log(prompt);
```

---

## 📋 SECTION DETAILS

### HERO/HEADER
- Banner principal 600-700px altura
- Headline impactante
- Subheadline descriptivo
- CTA primario
- Imagen/Video fondo
- Mobile-responsive

### PRODUCTOS/SERVICIOS
- Grid 3 columnas (desktop), 1 (mobile)
- Imagen, nombre, descripción, precio
- Botón "Ver más" o "Comprar"
- 6-9 productos recomendados

### TESTIMONIOS
- Carrusel o grid
- Foto cliente (círculo)
- Nombre, testimonial, rating (5 estrellas)
- 4-6 testimonios

### CONTACTO
- Formulario: nombre, email, teléfono, mensaje
- Mapa integrado (opcional)
- Email de respuesta automática

### FUNCIONALIDADES DETALLADAS

**SEO Optimization:**
- Meta títulos únicos (<60 chars)
- Meta descriptions (<160 chars)
- H1 único por página
- Alt text en imágenes
- URL amigable
- Sitemap.xml
- robots.txt

**Analytics:**
- Google Analytics 4
- Rastreo de eventos
- Rastreo de conversiones
- Dashboard personalizado
- Reportes automáticos

**E-Commerce (si aplica):**
- Carrito funcional
- Checkout seguro
- Integración Tienda Nube
- Opciones de pago
- Confirmación de orden

---

## ✅ ACCEPTANCE CRITERIA

- [ ] Prompt incluye todos los datos del formulario
- [ ] Prompt está correctamente formateado
- [ ] Prompt es copy-paste ready para WordPress AI
- [ ] Todas las secciones incluidas
- [ ] Todas las funcionalidades incluidas
- [ ] Presupuesto desglose correcto
- [ ] Legible y profesional

---

## 🔄 WORKFLOW

```
User completes presupuestador
    ↓
Click "Enviar Cotización"
    ↓
JavaScript calls generatePrompt(formData)
    ↓
Prompt generated dynamically
    ↓
Sent to Google Sheets in JSON
    ↓
Email includes full prompt
    ↓
Ready to use with WordPress AI
```

---

**Related:** MOD-02, MOD-04
