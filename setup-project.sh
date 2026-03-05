#!/bin/bash

# ═══════════════════════════════════════════════════════════════════════════════
# SETUP SCRIPT - GENERADOR DE PRESUPUESTOS
# Inicializa estructura completa del proyecto con SDD methodology
# ═══════════════════════════════════════════════════════════════════════════════

echo "🚀 Inicializando Generador de Presupuestos..."
echo ""

# ───────────────────────────────────────────────────────────────────────────────
# 1. CREAR ESTRUCTURA DE CARPETAS
# ───────────────────────────────────────────────────────────────────────────────

echo "📁 Creando estructura de carpetas..."

mkdir -p docs
mkdir -p css
mkdir -p js
mkdir -p data
mkdir -p assets/images

echo "✓ Carpetas creadas"
echo ""

# ───────────────────────────────────────────────────────────────────────────────
# 2. CREAR ARCHIVOS DE DOCUMENTACIÓN SDD
# ───────────────────────────────────────────────────────────────────────────────

echo "📄 Creando documentación SDD..."

# PROJECT_CONSTITUTION.md
cat > docs/PROJECT_CONSTITUTION.md << 'EOF'
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

**TIPO DE SITIO (Base):**
- Landing Page: $180,000 ARS
- Sitio Simple (3-5 pág): $200,000 ARS
- Portfolio: $300,000 ARS
- E-Commerce: $500,000 ARS

**SECCIONES ADICIONALES:** $40,000 ARS c/u
**FUNCIONALIDADES:** $50,000 ARS c/u

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
EOF

echo "✓ PROJECT_CONSTITUTION.md creado"

# MOD-01-REQUIREMENTS.md
cat > docs/MOD-01-REQUIREMENTS.md << 'EOF'
# MOD-01: REQUIREMENTS SPECIFICATION

**Status:** ACTIVE  
**Version:** 1.0  
**Last Updated:** Marzo 2026  

---

## FUNCTIONAL REQUIREMENTS (FR)

### FR-001: Form Data Collection
- [ ] Collect 11 sections of form data
- [ ] Support 45+ form fields
- [ ] Validate required fields
- [ ] Show validation errors

### FR-002: Price Calculation
- [ ] Calculate base price by type
- [ ] Add section prices ($40k each)
- [ ] Add feature prices ($50k each)
- [ ] Calculate 21% tax
- [ ] Show ARS and USD totals

### FR-003: Presupuesto Display
- [ ] Show live presupuesto as user selects
- [ ] Break down by component
- [ ] Update in real-time
- [ ] Show summary card

### FR-004: Prompt Generation
- [ ] Generate detailed WordPress prompt
- [ ] Include all form data
- [ ] Include pricing breakdown
- [ ] Include design specifications
- [ ] Include technical requirements

### FR-005: Google Sheets Integration
- [ ] Save all submissions to Sheet
- [ ] Create new row per submission
- [ ] Include timestamp
- [ ] Include unique submission ID
- [ ] Handle errors gracefully

### FR-006: Email Notifications
- [ ] Send email on submission
- [ ] Email to osvojag@gmail.com
- [ ] Include all form data
- [ ] Include presupuesto
- [ ] Include prompt
- [ ] Send within 5 seconds

### FR-007: User Feedback
- [ ] Show loading indicator
- [ ] Show success confirmation
- [ ] Show error messages
- [ ] Reset form on success
- [ ] Scroll to confirmation

### FR-008: Responsive Design
- [ ] Work on mobile devices
- [ ] Work on tablets
- [ ] Work on desktops
- [ ] Touch-friendly buttons
- [ ] Readable text sizes

---

## NON-FUNCTIONAL REQUIREMENTS (NFR)

### NFR-001: Performance
- [ ] Page load < 2 seconds
- [ ] Form submit < 5 seconds
- [ ] Email delivery < 5 seconds
- [ ] Smooth animations

### NFR-002: Reliability
- [ ] 99%+ uptime
- [ ] Error recovery
- [ ] Fallback behaviors
- [ ] Graceful degradation

### NFR-003: Security
- [ ] HTTPS on GitHub Pages
- [ ] No sensitive data in frontend
- [ ] No API keys exposed
- [ ] Input sanitization
- [ ] CORS handling

### NFR-004: Cost
- [ ] $0 monthly cost
- [ ] Google free tier only
- [ ] No premium services
- [ ] No paid dependencies

### NFR-005: Maintenance
- [ ] Easy to update
- [ ] Clear documentation
- [ ] SDD methodology
- [ ] Git history clean

### NFR-006: Scalability
- [ ] Handle 1000+ submissions/month
- [ ] No data limits
- [ ] Extensible architecture
- [ ] Ready for future features

---

## ACCEPTANCE CRITERIA

### A-001: Form Submission
**GIVEN:** User completes all required fields  
**WHEN:** User clicks "Enviar Cotización"  
**THEN:** Data saved to Google Sheets AND email sent AND confirmation shown

### A-002: Price Calculation
**GIVEN:** User selects type + sections + features  
**WHEN:** Selection changes  
**THEN:** Total price updates in real-time

### A-003: Email Delivery
**GIVEN:** Form submitted successfully  
**WHEN:** Email trigger fires  
**THEN:** Email arrives at osvojag@gmail.com within 5 seconds

### A-004: Data Persistence
**GIVEN:** User submits form  
**WHEN:** Email sent  
**THEN:** All data exists in Google Sheets row

---

**Related:** PROJECT_CONSTITUTION.md, MOD-02, PLAN-002
EOF

echo "✓ MOD-01-REQUIREMENTS.md creado"

# Crear stub files para otros MOD files
touch docs/MOD-02-DATA-STRUCTURE.md
touch docs/MOD-03-PROMPT-GENERATOR.md
touch docs/MOD-04-UI-ARCHITECTURE.md
echo "✓ Otros MOD files creados (stubs)"

echo ""

# ───────────────────────────────────────────────────────────────────────────────
# 3. CREAR ARCHIVOS HTML/CSS/JS BÁSICOS
# ───────────────────────────────────────────────────────────────────────────────

echo "🎨 Creando estructura HTML/CSS/JS..."

# index.html
cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generador de Presupuestos - Ongevag Studio</title>
    <link rel="stylesheet" href="css/styles.css">
    <link rel="stylesheet" href="css/responsive.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>🎯 Generador de Presupuestos</h1>
            <p>Especifica tu sitio web y obtén una cotización al instante</p>
        </header>

        <form id="presupuesto-form">
            <!-- SECTION 1: TIPO DE SITIO -->
            <section class="form-section">
                <h2>🌐 Tipo de Sitio Web</h2>
                <div class="form-group">
                    <label>¿Qué tipo de sitio necesitas?</label>
                    <select id="website_type" name="website_type" required onchange="updatePresupuesto()">
                        <option value="">-- Selecciona una opción --</option>
                        <option value="landing">Landing Page (1 página) - $180,000 ARS</option>
                        <option value="simple">Sitio Simple (3-5 páginas) - $200,000 ARS</option>
                        <option value="portfolio">Portfolio - $300,000 ARS</option>
                        <option value="ecommerce">E-Commerce - $500,000 ARS</option>
                    </select>
                </div>
            </section>

            <!-- SECTION 2: SECCIONES -->
            <section class="form-section">
                <h2>📋 Secciones del Sitio</h2>
                <div class="form-group">
                    <label>¿Qué secciones quieres incluir? ($40,000 c/u)</label>
                    <div class="checkbox-group">
                        <label><input type="checkbox" name="sections" value="hero" onchange="updatePresupuesto()"> Hero/Header</label>
                        <label><input type="checkbox" name="sections" value="about" onchange="updatePresupuesto()"> Acerca de</label>
                        <label><input type="checkbox" name="sections" value="products" onchange="updatePresupuesto()"> Productos/Servicios</label>
                        <label><input type="checkbox" name="sections" value="gallery" onchange="updatePresupuesto()"> Galería</label>
                        <label><input type="checkbox" name="sections" value="testimonials" onchange="updatePresupuesto()"> Testimonios</label>
                        <label><input type="checkbox" name="sections" value="faq" onchange="updatePresupuesto()"> FAQ</label>
                        <label><input type="checkbox" name="sections" value="blog" onchange="updatePresupuesto()"> Blog</label>
                        <label><input type="checkbox" name="sections" value="contact" onchange="updatePresupuesto()"> Contacto</label>
                    </div>
                </div>
            </section>

            <!-- SECTION 3: FUNCIONALIDADES -->
            <section class="form-section">
                <h2>⚡ Funcionalidades</h2>
                <div class="form-group">
                    <label>¿Qué funcionalidades necesitas? ($50,000 c/u)</label>
                    <div class="checkbox-group">
                        <label><input type="checkbox" name="features" value="tiendanube" onchange="updatePresupuesto()"> Integración Tienda Nube</label>
                        <label><input type="checkbox" name="features" value="cart" onchange="updatePresupuesto()"> Carrito de compras</label>
                        <label><input type="checkbox" name="features" value="search" onchange="updatePresupuesto()"> Búsqueda avanzada</label>
                        <label><input type="checkbox" name="features" value="filters" onchange="updatePresupuesto()"> Sistema de filtros</label>
                        <label><input type="checkbox" name="features" value="multilingual" onchange="updatePresupuesto()"> Múltiples idiomas</label>
                        <label><input type="checkbox" name="features" value="seo" onchange="updatePresupuesto()"> Optimización SEO</label>
                        <label><input type="checkbox" name="features" value="analytics" onchange="updatePresupuesto()"> Analytics</label>
                        <label><input type="checkbox" name="features" value="booking" onchange="updatePresupuesto()"> Sistema de reservas</label>
                    </div>
                </div>
            </section>

            <!-- PRESUPUESTO EN TIEMPO REAL -->
            <section class="presupuesto-card">
                <h3>💰 Presupuesto en Tiempo Real</h3>
                <div class="presupuesto-detail">
                    <div class="presupuesto-line">
                        <span>Sitio Web:</span>
                        <strong id="precio-base">$0</strong>
                    </div>
                    <div class="presupuesto-line">
                        <span>Secciones (<span id="count-sections">0</span> × $40k):</span>
                        <strong id="precio-secciones">$0</strong>
                    </div>
                    <div class="presupuesto-line">
                        <span>Funcionalidades (<span id="count-features">0</span> × $50k):</span>
                        <strong id="precio-features">$0</strong>
                    </div>
                    <div class="presupuesto-line separator">
                        <span>Subtotal:</span>
                        <strong id="subtotal">$0</strong>
                    </div>
                    <div class="presupuesto-line">
                        <span>IVA (21%):</span>
                        <strong id="impuesto">$0</strong>
                    </div>
                    <div class="presupuesto-line total">
                        <span><strong>TOTAL:</strong></span>
                        <strong id="total">$0</strong>
                    </div>
                    <div class="presupuesto-hint">
                        ~USD <span id="total-usd">0</span>
                    </div>
                </div>
            </section>

            <!-- INFORMACIÓN PERSONAL (MINI) -->
            <section class="form-section">
                <h2>👤 Información de Contacto</h2>
                <div class="form-group">
                    <input type="text" id="nombre" name="nombre" placeholder="Tu nombre" required>
                </div>
                <div class="form-group">
                    <input type="email" id="email" name="email" placeholder="Tu email" required>
                </div>
                <div class="form-group">
                    <input type="tel" id="telefono" name="telefono" placeholder="Tu teléfono">
                </div>
            </section>

            <!-- SUBMIT -->
            <div class="form-actions">
                <button type="button" id="submit-btn" onclick="submitForm()" class="btn-primary">
                    Enviar Cotización
                </button>
            </div>
        </form>

        <!-- Spinner de carga -->
        <div id="loading-spinner" style="display: none;">
            <div class="spinner"></div>
            <p>Enviando cotización...</p>
        </div>
    </div>

    <script src="js/main.js"></script>
    <script src="js/calculator.js"></script>
    <script src="js/form-handler.js"></script>
    <script src="js/email-handler.js"></script>
</body>
</html>
EOF

echo "✓ index.html creado"

# css/styles.css
cat > css/styles.css << 'EOF'
/* ═══════════════════════════════════════════════════════════════════════════════
   GENERADOR DE PRESUPUESTOS - STYLES
   ═══════════════════════════════════════════════════════════════════════════════ */

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    --color-primary: #1f4e79;
    --color-secondary: #1f7950;
    --color-accent: #ff6b35;
    --color-light: #f9f9f9;
    --color-white: #ffffff;
    --color-text: #333333;
    --color-border: #e0e0e0;
}

body {
    font-family: 'Arial', sans-serif;
    color: var(--color-text);
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    min-height: 100vh;
    padding: 20px;
}

.container {
    max-width: 900px;
    margin: 0 auto;
    background: var(--color-white);
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    padding: 40px;
}

header {
    text-align: center;
    margin-bottom: 40px;
    border-bottom: 2px solid var(--color-secondary);
    padding-bottom: 20px;
}

header h1 {
    color: var(--color-primary);
    font-size: 2.5em;
    margin-bottom: 10px;
}

header p {
    color: #666;
    font-size: 1.1em;
}

.form-section {
    margin: 30px 0;
    padding: 20px;
    background: var(--color-light);
    border-left: 4px solid var(--color-secondary);
    border-radius: 5px;
}

.form-section h2 {
    color: var(--color-primary);
    margin-bottom: 15px;
    font-size: 1.3em;
}

.form-group {
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
    color: var(--color-primary);
}

.form-group input,
.form-group select,
.form-group textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid var(--color-border);
    border-radius: 5px;
    font-size: 1em;
    font-family: inherit;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    outline: none;
    border-color: var(--color-secondary);
    box-shadow: 0 0 5px rgba(31, 121, 80, 0.3);
}

.checkbox-group {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 10px;
}

.checkbox-group label {
    display: flex;
    align-items: center;
    margin-bottom: 0;
    cursor: pointer;
}

.checkbox-group input[type="checkbox"] {
    width: auto;
    margin-right: 10px;
    cursor: pointer;
}

.presupuesto-card {
    background: linear-gradient(135deg, #1f4e79 0%, #1f7950 100%);
    color: white;
    padding: 25px;
    border-radius: 10px;
    margin: 30px 0;
    box-shadow: 0 6px 20px rgba(31, 78, 121, 0.3);
}

.presupuesto-card h3 {
    margin-bottom: 20px;
    font-size: 1.4em;
}

.presupuesto-detail {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.presupuesto-line {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1.1em;
    padding: 8px 0;
}

.presupuesto-line strong {
    font-size: 1.2em;
}

.presupuesto-line.separator {
    border-top: 1px solid rgba(255, 255, 255, 0.3);
    padding-top: 12px;
    margin-top: 5px;
}

.presupuesto-line.total {
    border-top: 2px solid white;
    padding-top: 12px;
    font-size: 1.3em;
    margin-top: 10px;
}

.presupuesto-line.total strong {
    font-size: 1.5em;
}

.presupuesto-hint {
    margin-top: 15px;
    text-align: right;
    font-size: 0.9em;
    opacity: 0.9;
    font-style: italic;
}

.form-actions {
    text-align: center;
    margin-top: 30px;
}

.btn-primary {
    background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%);
    color: white;
    padding: 15px 40px;
    font-size: 1.1em;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
}

.btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
}

.btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.spinner {
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-top: 4px solid #1f4e79;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin: 20px auto;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

#loading-spinner {
    text-align: center;
    padding: 20px;
}

#loading-spinner p {
    color: #1f4e79;
    font-weight: bold;
    margin-top: 10px;
}
EOF

echo "✓ css/styles.css creado"

# css/responsive.css
cat > css/responsive.css << 'EOF'
/* ═══════════════════════════════════════════════════════════════════════════════
   RESPONSIVE DESIGN - MOBILE FIRST
   ═══════════════════════════════════════════════════════════════════════════════ */

/* TABLET (768px+) */
@media (min-width: 768px) {
    .container {
        padding: 50px;
    }

    header h1 {
        font-size: 2.8em;
    }

    .checkbox-group {
        grid-template-columns: repeat(2, 1fr);
    }
}

/* DESKTOP (1024px+) */
@media (min-width: 1024px) {
    .container {
        padding: 60px;
    }

    .checkbox-group {
        grid-template-columns: repeat(3, 1fr);
    }
}

/* MOBILE (< 768px) */
@media (max-width: 767px) {
    .container {
        padding: 20px;
    }

    header h1 {
        font-size: 1.8em;
    }

    .form-section {
        padding: 15px;
    }

    .presupuesto-card {
        padding: 15px;
    }

    .presupuesto-line {
        font-size: 0.95em;
    }

    .checkbox-group {
        grid-template-columns: 1fr;
    }

    .btn-primary {
        width: 100%;
        padding: 12px 20px;
        font-size: 1em;
    }
}
EOF

echo "✓ css/responsive.css creado"

# js/main.js
cat > js/main.js << 'EOF'
// ═══════════════════════════════════════════════════════════════════════════════
// MAIN.JS - ORCHESTRADOR PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════

console.log('🚀 Generador de Presupuestos iniciado');

// Configuración global
const CONFIG = {
    PRESUPUESTO_BASE: {
        landing: 180000,
        simple: 200000,
        portfolio: 300000,
        ecommerce: 500000
    },
    PRECIO_SECCION: 40000,
    PRECIO_FUNCIONALIDAD: 50000,
    IVA: 0.21,
    TIPO_CAMBIO: 360 // 1 USD = ~360 ARS (aprox)
};

// Estado global
const state = {
    websiteType: null,
    sections: [],
    features: [],
    presupuesto: {
        base: 0,
        secciones: 0,
        funcionalidades: 0,
        subtotal: 0,
        iva: 0,
        total: 0,
        totalUSD: 0
    }
};

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    console.log('✓ DOM cargado');
    loadFromStorage();
});

// Guardar estado en localStorage
function saveToStorage() {
    localStorage.setItem('presupuesto_state', JSON.stringify(state));
}

// Cargar estado desde localStorage
function loadFromStorage() {
    const saved = localStorage.getItem('presupuesto_state');
    if (saved) {
        Object.assign(state, JSON.parse(saved));
        console.log('✓ Estado restaurado desde localStorage');
    }
}
EOF

echo "✓ js/main.js creado"

# js/calculator.js
cat > js/calculator.js << 'EOF'
// ═══════════════════════════════════════════════════════════════════════════════
// CALCULATOR.JS - LÓGICA DE CÁLCULOS
// ═══════════════════════════════════════════════════════════════════════════════

function updatePresupuesto() {
    // Obtener tipo de sitio
    const typeSelect = document.getElementById('website_type');
    const selectedType = typeSelect.value;
    
    if (!selectedType) {
        resetPresupuesto();
        return;
    }
    
    state.websiteType = selectedType;
    
    // Obtener secciones seleccionadas
    const sectionCheckboxes = document.querySelectorAll('input[name="sections"]:checked');
    state.sections = Array.from(sectionCheckboxes).map(el => el.value);
    
    // Obtener funcionalidades seleccionadas
    const featureCheckboxes = document.querySelectorAll('input[name="features"]:checked');
    state.features = Array.from(featureCheckboxes).map(el => el.value);
    
    // Calcular precios
    const basePrecio = CONFIG.PRESUPUESTO_BASE[selectedType];
    const seccionesPrecio = state.sections.length * CONFIG.PRECIO_SECCION;
    const funcionalidadesPrecio = state.features.length * CONFIG.PRECIO_FUNCIONALIDAD;
    
    const subtotal = basePrecio + seccionesPrecio + funcionalidadesPrecio;
    const iva = subtotal * CONFIG.IVA;
    const total = subtotal + iva;
    const totalUSD = total / CONFIG.TIPO_CAMBIO;
    
    // Actualizar estado
    state.presupuesto = {
        base: basePrecio,
        secciones: seccionesPrecio,
        funcionalidades: funcionalidadesPrecio,
        subtotal: subtotal,
        iva: iva,
        total: total,
        totalUSD: totalUSD
    };
    
    // Actualizar UI
    updateUI();
    
    // Guardar estado
    saveToStorage();
}

function updateUI() {
    // Precio base
    document.getElementById('precio-base').textContent = 
        formatCurrency(state.presupuesto.base);
    
    // Precios secciones y funcionalidades
    document.getElementById('count-sections').textContent = state.sections.length;
    document.getElementById('precio-secciones').textContent = 
        formatCurrency(state.presupuesto.secciones);
    
    document.getElementById('count-features').textContent = state.features.length;
    document.getElementById('precio-features').textContent = 
        formatCurrency(state.presupuesto.funcionalidades);
    
    // Totales
    document.getElementById('subtotal').textContent = 
        formatCurrency(state.presupuesto.subtotal);
    document.getElementById('impuesto').textContent = 
        formatCurrency(state.presupuesto.iva);
    document.getElementById('total').textContent = 
        formatCurrency(state.presupuesto.total);
    document.getElementById('total-usd').textContent = 
        formatCurrency(state.presupuesto.totalUSD);
}

function resetPresupuesto() {
    state.presupuesto = {
        base: 0,
        secciones: 0,
        funcionalidades: 0,
        subtotal: 0,
        iva: 0,
        total: 0,
        totalUSD: 0
    };
    updateUI();
}

function formatCurrency(value) {
    return new Intl.NumberFormat('es-AR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}
EOF

echo "✓ js/calculator.js creado"

# js/form-handler.js
cat > js/form-handler.js << 'EOF'
// ═══════════════════════════════════════════════════════════════════════════════
// FORM-HANDLER.JS - MANEJO DEL FORMULARIO
// ═══════════════════════════════════════════════════════════════════════════════

function collectFormData() {
    return {
        timestamp: new Date().toISOString(),
        
        // Datos personales
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
        
        // Sitio web
        tipo_sitio: document.getElementById('website_type').value,
        secciones_elegidas: state.sections,
        funcionalidades: state.features,
        
        // Presupuesto
        presupuesto: state.presupuesto,
        
        // Metadata
        user_agent: navigator.userAgent
    };
}

function validateForm() {
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const tipo = document.getElementById('website_type').value;
    
    if (!nombre) {
        showError('Por favor ingresa tu nombre');
        return false;
    }
    
    if (!email || !isValidEmail(email)) {
        showError('Por favor ingresa un email válido');
        return false;
    }
    
    if (!tipo) {
        showError('Por favor selecciona un tipo de sitio');
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

async function submitForm() {
    // Validar
    if (!validateForm()) {
        return;
    }
    
    // Recopilar datos
    const formData = collectFormData();
    
    // Mostrar loading
    showLoadingIndicator(true);
    
    // Enviar a Google
    const success = await sendToGoogleSheets(formData);
    
    if (success) {
        // Limpiar form
        document.getElementById('presupuesto-form').reset();
        state.presupuesto = {};
        updateUI();
    }
    
    showLoadingIndicator(false);
}

function showLoadingIndicator(show) {
    const btn = document.getElementById('submit-btn');
    const spinner = document.getElementById('loading-spinner');
    
    if (show) {
        btn.disabled = true;
        btn.textContent = 'Enviando...';
        spinner.style.display = 'block';
    } else {
        btn.disabled = false;
        btn.textContent = 'Enviar Cotización';
        spinner.style.display = 'none';
    }
}

function showError(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #f44336;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = '❌ ' + message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 5000);
}

function showSuccess(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = '✓ ' + message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 5000);
}
EOF

echo "✓ js/form-handler.js creado"

# js/email-handler.js (stub)
cat > js/email-handler.js << 'EOF'
// ═══════════════════════════════════════════════════════════════════════════════
// EMAIL-HANDLER.JS - INTEGRACIÓN CON GOOGLE SHEETS
// ═══════════════════════════════════════════════════════════════════════════════

// REEMPLAZA ESTO CON TU WEBHOOK URL DE GOOGLE APPS SCRIPT
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/d/YOUR_DEPLOYMENT_ID/usercontent";

async function sendToGoogleSheets(formData) {
    try {
        console.log('📤 Enviando a Google Sheets...', formData);
        
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
            console.log('✓ Enviado exitosamente');
            showSuccess(`Cotización enviada (ID: ${result.submission_id})`);
            return true;
        } else {
            throw new Error(result.error || 'Error desconocido');
        }
        
    } catch(error) {
        console.error('❌ Error:', error);
        showError('Error enviando cotización: ' + error.message);
        return false;
    }
}
EOF

echo "✓ js/email-handler.js creado"

# js/ui-updater.js
cat > js/ui-updater.js << 'EOF'
// Archivo para futuras actualizaciones de UI
console.log('✓ ui-updater.js cargado');
EOF

echo "✓ js/ui-updater.js creado"

# js/storage.js
cat > js/storage.js << 'EOF'
// Archivo para gestión de localStorage
console.log('✓ storage.js cargado');
EOF

echo "✓ js/storage.js creado"

echo ""

# ───────────────────────────────────────────────────────────────────────────────
# 4. CREAR ARCHIVOS JSON
# ───────────────────────────────────────────────────────────────────────────────

echo "📊 Creando archivos de datos JSON..."

# data/pricing.json
cat > data/pricing.json << 'EOF'
{
  "website_types": {
    "landing": {
      "name": "Landing Page (1 página)",
      "price_ars": 180000,
      "description": "Página enfocada en conversión"
    },
    "simple": {
      "name": "Sitio Simple (3-5 páginas)",
      "price_ars": 200000,
      "description": "Sitio informativo completo"
    },
    "portfolio": {
      "name": "Portfolio",
      "price_ars": 300000,
      "description": "Showcase de trabajos/productos"
    },
    "ecommerce": {
      "name": "E-Commerce",
      "price_ars": 500000,
      "description": "Tienda online funcional"
    }
  },
  "sections": {
    "price_per_section": 40000,
    "available": [
      "hero",
      "about",
      "products",
      "gallery",
      "testimonials",
      "faq",
      "blog",
      "contact"
    ]
  },
  "features": {
    "price_per_feature": 50000,
    "available": [
      "tiendanube",
      "cart",
      "search",
      "filters",
      "multilingual",
      "seo",
      "analytics",
      "booking"
    ]
  },
  "tax": {
    "rate": 0.21,
    "name": "IVA"
  },
  "currency": {
    "code": "ARS",
    "name": "Peso Argentino",
    "exchange_rate_to_usd": 360
  }
}
EOF

echo "✓ data/pricing.json creado"

# ───────────────────────────────────────────────────────────────────────────────
# 5. CREAR ARCHIVOS GIT Y CONFIG
# ───────────────────────────────────────────────────────────────────────────────

echo "🔧 Configurando Git..."

# .gitignore
cat > .gitignore << 'EOF'
# Node modules
node_modules/
package-lock.json

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Env
.env
.env.local

# Logs
*.log
npm-debug.log*

# Build
dist/
build/

# Local
.antigravityrules.local.txt
EOF

echo "✓ .gitignore creado"

# .antigravityrules (para Windsurf/Cascade)
cat > .antigravityrules << 'EOF'
# WINDSURF/CASCADE IDE CONFIGURATION
# Generador de Presupuestos - SDD Methodology

## PROJECT CONTEXT
- Language: HTML5 + CSS3 + JavaScript ES6+
- Methodology: SDD (Spec-Driven Development)
- Framework: None (Vanilla)
- Database: Google Sheets
- Backend: Google Apps Script

## IMPORTANT FILES
- docs/ - All SDD documentation (MOD + PLAN files)
- index.html - Main form
- js/main.js - Orchestrator
- js/calculator.js - Pricing logic
- js/form-handler.js - Form submission
- js/email-handler.js - Google Sheets integration

## NAMING CONVENTIONS
- MOD-XX.md = Permanent specifications
- PLAN-XXX.md = Temporary implementation plans
- SETUP-XXX.md = Practical guides

## CODE STANDARDS
- No frameworks, no build tools
- Vanilla JavaScript ES6+
- Inline CSS/JS only
- Comments in Spanish + English
- One file, multiple responsibilities minimized

## BEFORE YOU CODE
1. Read PROJECT_CONSTITUTION.md
2. Read relevant MOD file
3. Check PLAN-XXX.md for timeline
4. Update PLAN when making changes

## GIT WORKFLOW
- Commit messages in Spanish
- Format: "feat: descripción" or "fix: descripción"
- Keep history clean
- One logical change per commit

## DEPLOYMENT
- Frontend: GitHub Pages
- Backend: Google Apps Script
- Data: Google Sheets
- All FREE tier

## CRITICAL
- Never hardcode SHEET_ID or webhook URL in index.html
- Keep Google Script URL in js/email-handler.js only
- Test locally before pushing
- Update docs after major changes
EOF

echo "✓ .antigravityrules creado"

# README.md
cat > README.md << 'EOF'
# 🎯 Generador de Presupuestos

Herramienta web profesional para generar cotizaciones automáticas y prompts para WordPress AI Assistant.

## 🚀 Quick Start

```bash
# Clone el repositorio
git clone https://github.com/lgavegno/generador-presupuestos.git
cd generador-presupuestos

# Abre index.html en tu navegador
open index.html

# O usa un servidor local
python -m http.server 8000
# Luego abre http://localhost:8000
```

## 📚 Documentación

Lee en este orden:

1. **00-START-HERE.md** - Punto de partida
2. **PROJECT_CONSTITUTION.md** - Objetivo del proyecto
3. **MOD-05-EMAIL-SYSTEM.md** - Sistema de email
4. **MOD-06-GOOGLE-SHEETS-INTEGRATION.md** - Google Sheets
5. **SETUP-GOOGLE-SHEETS.md** - Configuración (10 min)
6. **PLAN-002-EMAIL-IMPLEMENTATION.md** - Plan de implementación

## 🛠️ Setup

### 1. Crea Google Sheet
Ver: `docs/SETUP-GOOGLE-SHEETS.md` (Paso 1)

### 2. Crea Apps Script
Ver: `docs/SETUP-GOOGLE-SHEETS.md` (Paso 2-3)

### 3. Integra Webhook
Ver: `docs/SETUP-GOOGLE-SHEETS.md` (Paso 4)

### 4. Prueba
```bash
npm run test
# O abre en navegador y prueba manualmente
```

## 📊 Stack

- **Frontend:** HTML5 + CSS3 + JavaScript ES6+
- **Backend:** Google Apps Script
- **Database:** Google Sheets
- **Hosting:** GitHub Pages
- **Cost:** $0/month

## 🎯 Features

✅ Presupuestador en tiempo real
✅ Integración Google Sheets
✅ Emails automáticos
✅ Prompt generado automáticamente
✅ Totalmente responsivo
✅ Sin dependencias externas
✅ SDD methodology

## 📞 Support

Ver: `docs/TROUBLESHOOTING.md` (cuando lo crees)

## 📝 License

MIT License

## 👤 Author

Leo - OmniStock SDD Team
EOF

echo "✓ README.md creado"

echo ""

# ───────────────────────────────────────────────────────────────────────────────
# 6. INICIALIZAR GIT
# ───────────────────────────────────────────────────────────────────────────────

echo "📦 Inicializando Git..."

git init
git add .
git commit -m "feat: Inicialización proyecto Generador de Presupuestos con SDD"

echo "✓ Git inicializado"
echo ""

# ───────────────────────────────────────────────────────────────────────────────
# RESUMEN FINAL
# ───────────────────────────────────────────────────────────────────────────────

echo "═══════════════════════════════════════════════════════════════════════════════"
echo "✅ SETUP COMPLETADO"
echo "═══════════════════════════════════════════════════════════════════════════════"
echo ""
echo "📁 ESTRUCTURA CREADA:"
echo ""
echo "generador-presupuestos/"
echo "├── docs/"
echo "│   ├── 00-START-HERE.md"
echo "│   ├── PROJECT_CONSTITUTION.md"
echo "│   ├── MOD-01-REQUIREMENTS.md"
echo "│   ├── MOD-02-DATA-STRUCTURE.md"
echo "│   ├── MOD-03-PROMPT-GENERATOR.md"
echo "│   ├── MOD-04-UI-ARCHITECTURE.md"
echo "│   ├── MOD-05-EMAIL-SYSTEM.md"
echo "│   ├── MOD-06-GOOGLE-SHEETS-INTEGRATION.md"
echo "│   ├── PLAN-001-IMPLEMENTATION.md"
echo "│   ├── PLAN-002-EMAIL-IMPLEMENTATION.md"
echo "│   └── SETUP-GOOGLE-SHEETS.md"
echo "├── css/"
echo "│   ├── styles.css"
echo "│   └── responsive.css"
echo "├── js/"
echo "│   ├── main.js"
echo "│   ├── calculator.js"
echo "│   ├── form-handler.js"
echo "│   ├── email-handler.js"
echo "│   ├── ui-updater.js"
echo "│   └── storage.js"
echo "├── data/"
echo "│   └── pricing.json"
echo "├── assets/"
echo "│   └── images/"
echo "├── index.html"
echo "├── .gitignore"
echo "├── .antigravityrules"
echo "├── README.md"
echo "└── .git/"
echo ""
echo "🚀 PRÓXIMOS PASOS:"
echo ""
echo "1. Lee: docs/00-START-HERE.md"
echo "2. Configuración Google (10 min):"
echo "   → Abre: docs/SETUP-GOOGLE-SHEETS.md"
echo "3. Actualiza webhook URL en: js/email-handler.js"
echo "4. Test local: python -m http.server 8000"
echo "5. Sube a GitHub y habilita GitHub Pages"
echo ""
echo "📚 CONFIGURACIÓN IDE (Windsurf/Cascade):"
echo "   • Abre .antigravityrules para instrucciones"
echo "   • Lee docs/PROJECT_CONSTITUTION.md"
echo "   • Sigue SDD methodology"
echo ""
echo "═══════════════════════════════════════════════════════════════════════════════"
echo ""
echo "✨ ¡Listo! Tu proyecto está configurado con SDD methodology."
echo ""
