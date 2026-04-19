# PROJECT CONSTITUTION - GENERADOR DE PRESUPUESTOS

**Status:** ACTIVE  
**Version:** 1.0  
**Last Updated:** Marzo 2026  
**Methodology:** SDD (Spec-Driven Development)  

---

## 🎯 PROJECT OBJECTIVE

Create a web-based quote/presupuesto generator that:
1. Collects client requirements via interactive form
2. Calculates pricing dynamically (ARS currency)
3. Generates a detailed WordPress AI prompt
4. Saves all data to Google Sheets automatically
5. Sends automatic email notification to osvojag@gmail.com
6. Requires ZERO backend infrastructure (Google-powered)

---

## 📊 PROJECT SCOPE

### IN SCOPE ✓
- Presupuestador with 11 form sections
- Real-time price calculation
- WordPress prompt generation
- Google Sheets integration
- Email notifications (via Apps Script)
- Responsive design (mobile/tablet/desktop)
- GitHub Pages deployment
- SDD documentation

### OUT OF SCOPE ✗
- CRM integration (future)
- Payment processing (future)
- PDF export (future)
- Multi-language (future)
- Advanced analytics (future)

---

## 💰 PRICING STRUCTURE

> **Nota (actualizado):** Los precios abajo reflejan los valores en producción (v2.2.0). Los valores originales de la especificación inicial eran más bajos y ya no aplican.

**TIPO DE SITIO (Base):**
- Landing Page: $200,000 ARS
- Sitio Simple (3-5 pág): $250,000 ARS
- Portfolio: $350,000 ARS
- E-Commerce: $600,000 ARS

**SECCIONES INCLUIDAS SIN COSTO:** cada tipo incluye secciones base (Landing/Simple: Hero; Portfolio: Hero+About; E-Commerce: Hero+About+Products)

**SECCIONES ADICIONALES:** $50,000 ARS c/u
**FUNCIONALIDADES:** $60,000 ARS c/u

**IMPUESTOS:** 21% IVA (Argentina)

---

## 🛠️ TECHNOLOGY STACK

### Frontend
- HTML5 (Vanilla)
- CSS3 (Vanilla, no preprocessors)
- JavaScript ES6+ (Vanilla, no frameworks)

### Backend
- Google Apps Script (No server needed)
- Google Sheets (Database)
- Google MailApp (Email)

### Hosting
- GitHub Pages (Frontend)
- Google Cloud (Backend/Email)

### Version Control
- Git (GitHub)
- SDD methodology (MOD + PLAN files)

### Zero Dependencies
- No npm packages
- No build tools
- No frameworks
- No CDN required
- Works offline after load

---

## 📈 SUCCESS METRICS

| Metric | Target | Status |
|--------|--------|--------|
| Setup Time | < 10 min | PENDING |
| Form Completion Rate | > 80% | PENDING |
| Email Delivery | 100% | PENDING |
| Email Time | < 5 sec | PENDING |
| Presupuesto Accuracy | 100% | PENDING |
| Uptime | > 99% | PENDING |
| Page Load | < 2 sec | PENDING |
| Cost/Month | $0 USD | PENDING |

---

## 📋 DELIVERABLES

- [x] Project Constitution
- [x] MOD-01 through MOD-06 (Specifications)
- [x] PLAN-001, PLAN-002 (Implementation plans)
- [x] SETUP guides (Practical instructions)
- [ ] Frontend code (HTML/CSS/JS)
- [ ] Google Sheets setup
- [ ] Apps Script deployment
- [ ] GitHub Pages deployment
- [ ] Testing & QA
- [ ] Production launch

---

## 🎯 PROJECT PHASES

### PHASE 1: Foundation (Day 1)
- Documentación SDD completa
- Google Sheets setup
- Apps Script code
- Webhook deployment

### PHASE 2: Frontend (Day 2)
- HTML structure
- CSS styling
- JavaScript logic
- Form handling

### PHASE 3: Integration (Day 3)
- Connect frontend to webhook
- End-to-end testing
- Production deployment

### PHASE 4: Optimization (Week 2)
- Performance tuning
- Analytics setup
- Monitoring

---

## 🔒 CONSTRAINTS

- Must use Google (free tier)
- Must work on GitHub Pages
- Must not require backend server
- Must be WCAG accessible
- Must be mobile-responsive
- Must have SDD documentation

---

## 📞 TEAM

- **Product Owner:** Leo (OmniStock)
- **Developer:** Leo
- **QA:** Manual testing
- **Deployment:** GitHub Pages + Google

---

## 📅 TIMELINE

- **Week 1:** Setup & Foundation
- **Week 2:** Development & Testing
- **Week 3:** Deployment & Launch
- **Ongoing:** Monitoring & Optimization

---

## 🚀 LAUNCH CHECKLIST

- [ ] All MOD files approved
- [ ] All PLAN files approved
- [ ] Google Sheets configured
- [ ] Apps Script deployed
- [ ] Frontend developed
- [ ] Integration tested
- [ ] End-to-end tested
- [ ] Documentation complete
- [ ] GitHub repo ready
- [ ] GitHub Pages enabled
- [ ] Domain configured (if custom)
- [ ] Monitoring active
- [ ] Ready for production

---

**Next Document:** MOD-01-REQUIREMENTS.md

---

## 🔄 FLUJO DE DATOS END-TO-END

Diagrama completo del ciclo de vida de una cotización:

```
Usuario (navegador)
        |
        | Abre presupuestador/index.html
        v
+-----------------------------------------------+
|  STEP 1: Selección de tipo de sitio           |
|  <select id="tipo_sitio">                     |
|  → onchange: updatePresupuesto()              |
|  → auto-marca secciones incluidas             |
+-----------------------------------------------+
        |
        v
+-----------------------------------------------+
|  STEP 2: Selección de secciones/features      |
|  <input type="checkbox" name="sections">      |
|  → onchange: updatePresupuesto()              |
|  → Secciones incluidas en base: gratis        |
|  → Secciones extra: $50k c/u                 |
|  → Features: $60k c/u                        |
+-----------------------------------------------+
        |
        | [Modo Custom: si escribe en textarea  |
        |  custom-project-desc, resetToCustomMode()]
        v
+-----------------------------------------------+
|  calculator.js: updatePresupuesto()           |
|  subtotal = base + secExtra*50k + feat*60k    |
|  iva = subtotal * 0.21 (informativo, no suma) |
|  total = subtotal                             |
|  → updateUI() (actualiza DOM)                |
|  → saveToStorage() (localStorage)            |
+-----------------------------------------------+
        |
        v
+-----------------------------------------------+
|  STEP 3: Datos de contacto                   |
|  nombre* | email* | telefono | observaciones  |
+-----------------------------------------------+
        |
        | Click "Enviar Cotización"
        v
+-----------------------------------------------+
|  form-handler.js: submitForm()               |
|  → validateForm()                            |
|    - nombre (required)                        |
|    - email (required, regex)                  |
|    - tipo_sitio (required si no es custom)   |
|  → collectFormData()                         |
|    - mapea ['hero'] → ['Inicio/Hero']        |
|    - si custom: presupuesto = {ceros}         |
|    - asunto diferente por modo               |
+-----------------------------------------------+
        |
        | fetch(GOOGLE_SCRIPT_URL, { mode: 'no-cors' })
        | POST JSON
        v
+-----------------------------------------------+
|  Google Apps Script: doPost(e)               |
|  → JSON.parse(e.postData.contents)           |
|  → generateSubmissionId()  (SUB-YYYYMM-XXXX) |
|  → appendRow() en hoja SUBMISSIONS (cols A-Q)|
|  → MailApp.sendEmail() a propietario         |
|  → logEvent() en hoja LOGS                  |
|  → return {success, submission_id}           |
+-----------------------------------------------+
        |               |
        v               v
+-------------+  +------------------+
| Google      |  | Gmail            |
| Sheets      |  | Notificación al  |
| SUBMISSIONS |  | propietario      |
| LOGS        |  | (< 5 segundos)   |
+-------------+  +------------------+
        |
        | (respuesta opaca por no-cors)
        v
+-----------------------------------------------+
|  Frontend: showSuccess() / showError()        |
|  → form.reset()                              |
|  → resetPresupuesto()                        |
+-----------------------------------------------+
```

### Notas clave del flujo

- **Modo Custom** se activa cuando el campo `#custom-project-desc` tiene texto. Deshabilita secciones y funcionalidades, muestra "A Medida" en el total, cambia el botón a "Solicitar Entrevista" y asigna `tipo_sitio = "WEB APP / CUSTOM"` automáticamente.
- **`mode: 'no-cors'`** en el fetch hace que la respuesta del servidor sea opaca. El frontend no puede distinguir si el backend retornó éxito o error. El único canal de debug del backend es la hoja **LOGS** en Google Sheets.
- **IVA nunca se suma al total.** Se calcula y muestra como desglose informativo. El `total` que ve el cliente = `subtotal` sin IVA.

---

## 📐 Metodología de Desarrollo

### SDD — Specification-Driven Development

Cada módulo del sistema tiene una especificación en `/docs/MOD-XX-nombre.md` que define requerimientos, contratos de datos y criterios de aceptación **antes** de escribir código. Los MODs son la fuente de verdad del diseño.

| MOD | Módulo | Propósito | Status |
|-----|--------|-----------|--------|
| MOD-01 | Requirements | Requerimientos funcionales y acceptance criteria | ✅ |
| MOD-02 | Data Structure | Schema de datos y contratos | ✅ |
| MOD-03 | UI Architecture | Componentes, estilos y paleta visual | ✅ |
| MOD-04 | Email System | Integración de notificaciones | ✅ |
| MOD-05 | Google Sheets | Integración con backend GAS | ✅ |
| MOD-06 | Project Structure | Arquitectura de carpetas y capas | ✅ |

### Clean Architecture — Capas del Sistema

```
┌──────────────────────────────┐
│  Presentación                │  ← index.html
│  (Interfaz, CSS, eventos)    │     presupuestador/index.html
├──────────────────────────────┤
│  Aplicación                  │  ← main.js
│  (CONFIG, state, init)       │     Orquestación de capas
├──────────────────────────────┤
│  Dominio                     │  ← calculator.js
│  (Lógica de negocio pura)    │     updatePresupuesto()
│  (Precios, cálculos)         │     resetPresupuesto()
├──────────────────────────────┤
│  Infraestructura             │  ← email-handler.js
│  (APIs externas)             │     form-handler.js
│  (Google Apps Script)        │     storage.js
│  (localStorage)              │
└──────────────────────────────┘
```

**Ventajas:**
- ✅ Lógica de negocio independiente de UI
- ✅ Fácil de testear (lógica pura en `calculator.js`)
- ✅ Bajo acoplamiento entre módulos
- ✅ Fácil migrar o cambiar backend

### Scrum-inspired

- **Ramas:** Trabajo en feature branches con patrón `feature/descripcion`
- **Merges:** A develop vía PR o merge explícito con `--no-ff`
- **Releases:** main recibe solo versiones estables (tags semánticos)
- **Documentación:** ADRs registran decisiones arquitecturales irreversibles

| Tipo de rama | Patrón | Origen | Destino |
|-------------|--------|--------|---------|
| Desarrollo | `feature/descripcion` | develop | develop (PR + review) |
| Bugfix | `fix/descripcion` | develop | develop |
| Release | `release/x.y.z` | develop | main (tag vx.y.z) |
| Hotfix | `hotfix/descripcion` | main | main + develop |

---

## 📚 Decisiones Arquitecturales (ADRs)

Decisiones irreversibles o costosas de cambiar están documentadas en `/docs/adr/`:

1. **ADR-001:** Vanilla JS (sin frameworks) — Costo $0/mes, despliegue simple
2. **ADR-002:** Google Apps Script backend — Serverless, email + storage incluido
3. **ADR-003:** Estructura dual /js/ + /presupuestador/js — Legado, a resolver
4. **ADR-004:** Moneda única ARS — Mercado local, evita confusión

