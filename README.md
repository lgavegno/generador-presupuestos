# 🎯 Generador de Presupuestos

Herramienta web profesional para generar cotizaciones automáticas con integración a Google Sheets y notificaciones por email.

**Status:** ✅ Production Ready
**Version:** 1.1.0 (Stabilization & Data Normalization)
**Last Updated:** Marzo 2026

---

## 🚀 Quick Start

```bash
# Clonar repositorio
git clone https://github.com/lgavegno/generador-presupuestos.git
cd generador-presupuestos

# Iniciar servidor local
python -m http.server 8000

# Abrir en navegador
open http://localhost:8000/presupuestador/index.html
```

---

## 📋 Descripción General

El **Generador de Presupuestos** es una aplicación web minimalista que permite a clientes generar cotizaciones personalizadas en tiempo real. El flujo es:

1. **Frontend** (Vanilla JS) → Cálculo dinámico de presupuestos
2. **Google Apps Script** (Webhook) → Recibe datos via POST
3. **Google Sheets** → Almacena cotizaciones + estadísticas
4. **Gmail** → Envía notificaciones al propietario del negocio

**Costo:** $0/mes (infraestructura serverless)

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────┐
│  Frontend (Vanilla JS)          │
│  - HTML5 + CSS3                 │
│  - calculatePresupuesto()       │
│  - formatCurrency()             │
│  - Friendly Name mapping        │
└────────────────┬────────────────┘
                 │ POST (JSON)
                 ↓
┌─────────────────────────────────┐
│  Google Apps Script             │
│  - doPost() webhook handler     │
│  - Data validation & enrichment │
│  - Email notification           │
└────────────────┬────────────────┘
                 │
         ┌───────┴────────┐
         ↓                ↓
    ┌─────────┐      ┌──────────┐
    │ Sheets  │      │ Gmail    │
    │ Storage │      │ Notify   │
    └─────────┘      └──────────┘
```

---

## 🛠️ Tecnologías

| Capa | Tecnología | Propósito |
|------|-----------|----------|
| **Frontend** | HTML5, CSS3, Vanilla JS | Interfaz de usuario + cálculos |
| **Comunicación** | Fetch API | POST a webhook |
| **Backend** | Google Apps Script | Procesamiento de datos |
| **Storage** | Google Sheets API | Base de datos |
| **Notificación** | Gmail (MailApp) | Email al propietario |
| **Hosting** | GitHub Pages / Local | Entrega de contenido |

---

## 📊 Estructura de Datos

### Tipos de Sitio Web (Home incluida)
| Tipo | Precio Base ARS | Secciones Base Incluidas ($0 extra) |
|------|-----------------|---------------------------------|
| Landing Page (1 página) | $200,000 | Home / Hero |
| Sitio Simple (3-5 páginas) | $250,000 | Home / Hero |
| Portfolio | $350,000 | Home, Acerca de |
| E-Commerce | $600,000 | Home, Acerca de, Productos |

> **Nota Comercial:** Los presupuestos de los sitios listados arriba incluyen el primer año de Hosting (Plan Premium) y Dominio (.com o .com.ar). El cliente es responsable de proveer textos, logos y fotos (los servicios de copywriting o diseño gráfico se cotizan por separado).
> **Exclusión:** Los sistemas a medida (Web Apps, ERP, Gestores) quedan excluidos de esta lista de precios base ya que requieren servidores VPS dedicados.

### Secciones Adicionales
- Precio por sección extra: **$50,000 ARS**
- Opciones: Home/Hero, Acerca de, Productos, Galería, Testimonios, FAQ, Blog, Contacto, Newsletter

### Funcionalidades Premium
- Precio por funcionalidad: **$60,000 ARS**
- Opciones: Sincronización Tienda Nube, Carrito de Compras, Buscador, Filtros, Multi-idioma, SEO, Analytics, Sistema de Reservas

### Impuestos
- **IVA:** 21% (incluido automáticamente en el total)
- **Divisa:** ARS (sin conversión USD en frontend)

---

## 📝 Documentación

1. **README.md** (este archivo) - Visión general
2. **docs/PROJECT_CONSTITUTION.md** - Especificación del proyecto
3. **docs/SETUP-GOOGLE-SHEETS.md** - Instrucciones de configuración
4. **docs/MOD-06-GOOGLE-SHEETS-INTEGRATION.md** - Esquema de datos
5. **docs/PROJECT_LOG.md** - Historial de cambios

---

## 🔧 Instalación & Configuración

### 1. Preparar Google Sheets
```
1. Crear nueva hoja de cálculo (Cotizaciones-Generador-Presupuestos)
2. Crear sheets: SUBMISSIONS, STATISTICS, TEMPLATE, LOGS
3. Copiar enlace de la hoja (Sheet ID)
```

### 2. Crear Google Apps Script
```
1. Ir a script.google.com
2. Crear nuevo proyecto
3. Copiar código de MOD-06-GOOGLE-SHEETS-INTEGRATION.md
4. Reemplazar SHEET_ID con el ID real
5. Deploy como "Web App" (accessible to anyone)
6. Copiar URL de deployment
```

### 3. Actualizar Frontend
```javascript
// En js/email-handler.js, reemplazar:
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/[YOUR_ID]/usercontent";
```

### 4. Iniciar servidor
```bash
python -m http.server 8000
open http://localhost:8000/presupuestador/index.html
```

---

## 🎯 Flujo de Usuario

1. **Selecciona tipo de sitio** → Precio base actualizado
2. **Elige secciones** (checkboxes) → Precio adicional calculado (+$40k c/u)
3. **Selecciona funcionalidades** (checkboxes) → Precio adicional (+$50k c/u)
4. **Completa datos de contacto** → Nombre, Email, Teléfono
5. **Envía formulario** → Datos enviados a Google Apps Script
6. **Confirmación** → Script guarda en Sheets + envía email

---

## 🔌 Integración Backend

### Webhook URL
```
POST https://script.google.com/macros/s/[ID]/usercontent
Content-Type: application/json

{
  "timestamp": "2026-03-12T14:30:00.000Z",
  "nombre": "Juan García",
  "email": "juan@email.com",
  "telefono": "+54 9 3492 123456",
  "tipo_sitio": "landing",
  "secciones_elegidas": ["Inicio/Hero", "Acerca de"],
  "funcionalidades": ["SEO", "Analytics"],
  "presupuesto": {
    "base": 180000,
    "secciones": 80000,
    "funcionalidades": 100000,
    "subtotal": 360000,
    "iva": 75600,
    "total": 435600
  },
  "observaciones": "Quiero diseño minimalista"
}
```

### Respuesta
```json
{
  "success": true,
  "submission_id": "SUB-202603-4521",
  "message": "Cotización guardada y email enviado"
}
```

---

## 🐛 Diagnóstico

### Verificar si el cálculo funciona:
1. Abrir Developer Tools (`F12`)
2. Ir a Console
3. Seleccionar un tipo de sitio
4. Verificar logs: `🔧 updatePresupuesto() llamada`

### Verificar si el email se envía:
1. Ir a Google Sheets → LOGS
2. Ver eventos: SUBMISSION_RECEIVED, EMAIL_SENT, ERROR

---

## 📈 Monitoreo en Producción

### Google Sheets - Sheet "STATISTICS"
- Total cotizaciones generadas
- Promedio de presupuesto (ARS)
- Distribución por tipo de sitio
- Secciones/funcionalidades más populares
- Tasa de éxito en envío de emails

### Google Sheets - Sheet "LOGS"
- Cada evento: timestamp, submission_id, tipo, mensaje, estado
- Debuggear errores en tiempo real

---

## 📦 Estructura del Proyecto

```
generador-presupuestos/
├── presupuestador/
│   ├── index.html                    # Formulario principal
│   └── js/
│       ├── calculator.js             # Lógica de cálculos (raíz)
│       ├── form-handler.js           # Validación de formulario
│       ├── email-handler.js          # Comunicación con webhook
│       ├── main.js                   # CONFIG y estado global
│       ├── storage.js                # localStorage management
│       └── ui-updater.js             # Actualización de DOM
├── js/
│   ├── calculator.js                 # ✅ (sincronizada)
│   ├── form-handler.js               # ✅ (sincronizada)
│   ├── email-handler.js              # ✅ (sincronizada)
│   ├── main.js                       # ✅ (sincronizada)
│   ├── storage.js                    # ✅ (sincronizada)
│   └── ui-updater.js                 # ✅ (sincronizada)
├── docs/
│   ├── PROJECT_CONSTITUTION.md
│   ├── MOD-01 a MOD-07.md
│   ├── PLAN-*.md
│   ├── PROJECT_LOG.md
│   └── SETUP-GOOGLE-SHEETS.md
└── README.md                         # (este archivo)
```

---

## 🐛 Issues & Troubleshooting

### "El sumador no reacciona"
1. Verificar que `id="tipo_sitio"` existe en HTML
2. Abrir Console (F12) y cambiar el select
3. Buscar logs: `Select changed to:`
4. Si no hay logs, hay error en carga de scripts

### "Google Sheets no recibe datos"
1. Verificar GOOGLE_SCRIPT_URL es correcta (copied from deployment)
2. Ver Console → Network → POST request
3. Verificar que Apps Script está deployed como "Web App"

### "Emails no se envían"
1. Verificar EMAIL_TO en Code.gs es correcto
2. Revisar Google Sheets → LOGS para errores
3. Verificar permisos de MailApp en Apps Script

---

## 🔐 Seguridad

- ✅ Frontend: Validación de email + campos requeridos
- ✅ Backend: JSON.parse con try/catch
- ✅ CORS: Configurado en email-handler.js con `mode: 'no-cors'`
- ✅ Datos: Guardados solo en Google Sheets (propiedad del usuario)

---

## 📄 Licencia

Proyecto privado de Leo (OmniStock SDD Team)

---

## 📞 Contacto

Para soporte o preguntas sobre la arquitectura:
- Email: osvojag@gmail.com
- Docs: Revisar `/docs/` para detalles técnicos
