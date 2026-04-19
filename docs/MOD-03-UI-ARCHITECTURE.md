---

# MOD-03: UI ARCHITECTURE SPECIFICATION

**Status:** ACTIVE  
**Version:** 1.0  
**Last Updated:** Marzo 2026  

---

## 🎯 OBJECTIVE

Define the user interface structure, components, layout, interactions, and responsive design for the presupuestador minimalista application.

---

## 🏗️ PAGE STRUCTURE

```
┌─────────────────────────────────────────┐
│ HEADER / HERO                           │
│ 💰 Generador de Presupuestos            │
│ Especifica tu sitio y obtén cotización  │
│ ← Volver (link superior izquierdo)      │
└─────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────┐
│ MAIN FORM CONTAINER                     │
│                                         │
│ SECTION 1: Tipo de Sitio               │
│ ┌───────────────────────────────────┐  │
│ │ Select dropdown (4 opciones)      │  │
│ │ - Landing Page ($200k)            │  │
│ │ - Sitio Simple ($250k)            │  │
│ │ - Portfolio ($350k)               │  │
│ │ - E-Commerce ($600k)              │  │
│ └───────────────────────────────────┘  │
│                                         │
│ SECTION 2: Secciones ($50,000 c/u)    │
│ ┌───────────────────────────────────┐  │
│ │ Grid de 9 checkboxes:             │  │
│ │ ☑ Hero/Header  ☑ About            │  │
│ │ ☑ Products     ☑ Gallery          │  │
│ │ ☑ Testimonials ☑ FAQ              │  │
│ │ ☑ Blog         ☑ Contact          │  │
│ │ ☑ Newsletter                      │  │
│ └───────────────────────────────────┘  │
│                                         │
│ SECTION 3: Funcionalidades ($60k c/u) │
│ ┌───────────────────────────────────┐  │
│ │ Grid de 9 checkboxes:             │  │
│ │ ☑ Tienda Nube  ☑ Carrito          │  │
│ │ ☑ Búsqueda     ☑ Filtros          │  │
│ │ ☑ Idiomas      ☑ SEO              │  │
│ │ ☑ Analytics    ☑ Reservas         │  │
│ │ ☑ CMS                             │  │
│ └───────────────────────────────────┘  │
│                                         │
│ PRESUPUESTO EN TIEMPO REAL              │
│ ┌───────────────────────────────────┐  │
│ │ Sitio Base:      $200,000         │  │
│ │ +Secciones (2):  +$80,000         │  │
│ │ +Features (2):   +$100,000        │  │
│ │ ───────────────────────────────   │  │
│ │ Subtotal:        $380,000         │  │
│ │ IVA (21%):       +$79,800         │  │
│ │ TOTAL:           $459,800 ARS     │  │
│ │ ~$1,277 USD                       │  │
│ └───────────────────────────────────┘  │
│                                         │
│ SECTION 4: Información de Contacto     │
│ ┌───────────────────────────────────┐  │
│ │ Nombre: [input *]                 │  │
│ │ Email: [input *]                  │  │
│ │ Teléfono: [input]                 │  │
│ │ Observaciones: [textarea]         │  │
│ └───────────────────────────────────┘  │
│                                         │
│ [📧 ENVIAR COTIZACIÓN]                  │
│                                         │
└─────────────────────────────────────────┘
```

---

## 📱 COMPONENTS

### HEADER COMPONENT

```html
<header class="header">
  <h1>💰 Generador de Presupuestos</h1>
  <p>Especifica tu sitio web y obtén una cotización al instante</p>
  <a href="../" class="back-link">← Volver</a>
</header>
```

**Styling:**
- Background: Gradient #0f172a → #1a4a2a (Dark Navy → Dark Green)
- Color: White (#ffffff)
- Padding: 40px
- Text-align: Center
- Back-link: Absolute position top-left

---

### FORM SECTION COMPONENT

```html
<section class="form-section">
  <h2>🌐 Título de Sección</h2>
  <div class="form-group">
    <label>Etiqueta del campo</label>
    <input/select />
  </div>
</section>
```

**Styling:**
- Background: #1e293b (Dark Card)
- Border-left: 4px solid #16c946 (Green Accent)
- Padding: 20px
- Margin: 30px 0
- Border-radius: 5px
- Text Color: #e2e8f0 (Light Secondary)

---

### PRESUPUESTO CARD COMPONENT

```html
<div class="presupuesto-card">
  <h3>💰 Presupuesto en Tiempo Real</h3>
  <div class="presupuesto-lines">
    <div class="presupuesto-line">
      <span>Base:</span>
      <strong id="precio-base">$0</strong>
    </div>
    <!-- más líneas -->
  </div>
</div>
```

**Styling:**
- Background: Linear gradient #0a4d2e → #1a6b4a (Dark Green gradient)
- Color: White (#ffffff)
- Padding: 25px
- Border-radius: 10px
- Box-shadow: 0 8px 25px rgba(22, 201, 70, 0.2)
- Border: 1px solid #16c946 (Green accent border)

---

### CHECKBOX ITEM COMPONENT

```html
<div class="checkbox-item">
  <input 
    type="checkbox" 
    name="sections" 
    value="hero" 
    id="section-hero"
    onchange="updatePresupuesto()"
  >
  <label for="section-hero">Hero/Header</label>
</div>
```

**DOM IDs (sections):**
- `#section-hero`, `#section-about`, `#section-products`, etc.

**DOM IDs (features):**
- `#feature-tiendanube`, `#feature-cart`, `#feature-search`, etc.

**Event:** `onchange="updatePresupuesto()"`
- Dispara recálculo inmediato
- Actualiza card presupuesto

---

### BUTTON COMPONENT

```html
<button class="btn-primary" onclick="submitForm()">
  📧 Enviar Cotización
</button>
```

**Styling:**
- Background: Linear gradient #16c946 → #12a83a (Green gradient)
- Color: #0a2e14 (Dark green text)
- Padding: 14px 30px
- Font-size: 1em
- Font-weight: 600
- Border-radius: 6px
- Cursor: Pointer
- Transition: all 0.3s ease
- Hover: Brightness increased, enhanced shadow
- Disabled: Opacity 0.6, cursor not-allowed
- Active: Scale 0.98 on click

---

## 🎨 COLOR SYSTEM

**Current Theme (Dark Mode — Actual as of presupuestador/index.html):**

```css
--bg-page: #0f172a (Dark Navy Background)
--bg-card: #1e293b (Dark Card Background)
--bg-input: #0a1120 (Darker Input Background)
--accent: #16c946 (Bright Green Accent)
--accent-dark: #12a83a (Darker Green)
--text-primary: #ffffff (White Primary Text)
--text-secondary: #e2e8f0 (Light Secondary Text)
--text-muted: #94a3b8 (Muted Text)
--border: #334155 (Dark Border)
--border-focus: #16c946 (Green Focus Border)
```

**Note:** All CSS is inline in `presupuestador/index.html` (~54KB). No external .css files.

---

## 📐 GRID SYSTEM

### Desktop (1024px+)

```css
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 60px;
}

.checkbox-group {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}
```

### Tablet (768px - 1023px)

```css
.container {
  padding: 50px;
}

.checkbox-group {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}
```

### Mobile (< 768px)

```css
.container {
  padding: 20px;
}

.checkbox-group {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

.btn-primary {
  width: 100%;
}
```

---

## 🔄 INTERACTIONS

### On Type Selection

```
User selects website type
    ↓
onchange="updatePresupuesto()" triggered
    ↓
calculator.js: updatePresupuesto() called
    ↓
Presupuesto card updates (animated)
    ↓
Base price displayed
```

### On Section/Feature Toggle

```
User checks/unchecks checkbox
    ↓
onchange="updatePresupuesto()" triggered
    ↓
Count updated dynamically
    ↓
Price recalculated
    ↓
Presupuesto card animates
    ↓
Total updates (live)
```

### On Form Submit

```
User clicks submit
    ↓
showLoadingIndicator() displays spinner
    ↓
validateForm() checks required fields
    ↓
collectFormData() gathers all data
    ↓
sendToGoogleSheets(formData) sends webhook
    ↓
If success: showSuccess(), reset form
    ↓
If error: showError(), keep data
    ↓
showLoadingIndicator(false) hides spinner
```

---

## ✨ ANIMATION & FEEDBACK

### Loading Spinner

```css
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.spinner {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 20px auto;
}
```

### Success Notification

```css
.confirmation-message {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translate(-50%, 20px);
  background: #0a0f1e (Dark navy);
  color: #ffffff (White text);
  border: 1px solid #1bfa57 (Bright green border);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.7);
  padding: 16px 24px;
  border-radius: 8px;
  font-weight: 500;
  text-align: center;
  animation: slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes slideUp {
  from { transform: translate(-50%, 20px); opacity: 0; }
  to { transform: translate(-50%, 0); opacity: 1; }
}
```

### Error Notification

```css
.error-message {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #dc2626 (Red for errors);
  color: #ffffff (White text);
  padding: 15px 20px;
  border-radius: 5px;
  border: 1px solid #991b1b (Darker red border);
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from { transform: translateX(400px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
```

---

## 🧪 USER FLOWS

### Main Flow: Presupuestador Minimalista

```
1. User lands on presupuestador/
   ↓
2. Sees header "Generador de Presupuestos"
   ↓
3. Select type of site (dropdown)
   ↓
4. Select sections (checkboxes)
   ↓
5. Select features (checkboxes)
   ↓
6. See presupuesto update in real-time
   ↓
7. Enter contact info (name, email, teléfono)
   ↓
8. Add observaciones (optional)
   ↓
9. Click "📧 Enviar Cotización"
   ↓
10. Loading spinner appears
    ↓
11. Data sent to Google Sheets
    ↓
12. Email sent to user
    ↓
13. Success confirmation shows
    ↓
14. Form resets
    ↓
15. Data saved in localStorage
    ↓
16. "← Volver" button available anytime
```

---

## ✅ ACCEPTANCE CRITERIA

- [ ] All sections visible and functional
- [ ] Form validation working correctly
- [ ] Presupuesto updates in real-time
- [ ] Button disabled during submission
- [ ] Loading indicator displays properly
- [ ] Success/error messages show correctly
- [ ] Responsive on mobile (< 768px)
- [ ] Responsive on tablet (768-1023px)
- [ ] Responsive on desktop (1024px+)
- [ ] All colors match brand palette
- [ ] All spacing correct
- [ ] Animations smooth (no jank)
- [ ] Back link functional (← Volver)
- [ ] localStorage working

---

## 📊 LAYOUT BREAKPOINTS

```
Mobile: < 768px
Tablet: 768px - 1023px
Desktop: 1024px+

Checkbox Grid:
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3 columns

Container Padding:
- Mobile: 20px
- Tablet: 50px
- Desktop: 60px
```

---

**Related:** MOD-02, MOD-03
