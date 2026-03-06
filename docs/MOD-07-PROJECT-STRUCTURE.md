---

# MOD-07: PROJECT STRUCTURE & DEPLOYMENT

**Status:** ACTIVE  
**Version:** 1.0  
**Repository:** generador-presupuestos (NO formulario-tienda-nube)

## DIRECTORY STRUCTURE
```
generador-presupuestos/ (root)
├── index.html (HOME - 1 botón)
├── tienda-nube.html (Formulario completo - guardado)
├── presupuestador/ (subfolder minimalista)
│   ├── index.html
│   ├── css/ (copiado)
│   ├── js/ (copiado)
│   └── data/ (copiado)
├── css/ (original)
├── js/ (original)
├── data/ (original)
└── docs/ (MOD + PLAN)
```

## URL MAPPING
```
HOME: https://lgavegno.github.io/generador-presupuestos/
Presupuestador: https://lgavegno.github.io/generador-presupuestos/presupuestador/
Tienda Nube: https://lgavegno.github.io/generador-presupuestos/tienda-nube.html
```

## PRESUPUESTADOR MINIMALISTA

**4 Campos de Contacto:**
- Nombre (required)
- Email (required)
- Teléfono (optional)
- Observaciones (optional)

**Especificaciones:**
- Tipo de Sitio (1 select)
- Secciones (9 checkboxes, $40k c/u)
- Funcionalidades (8 checkboxes, $50k c/u)

**Cálculo:**
- Subtotal (base + secciones + features)
- IVA 21% (checkbox optional)
- Total ARS

**NO incluye:**
- DNI/CUIT, fiscal, domicilio
- Redes sociales, medios pago
- Información del negocio

## TIENDA NUBE

Archivo guardado para futuro uso (WordPress, etc).
No está enlazado en HOME.

---
