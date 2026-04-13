# BITACORA_TECNICA.md — Auditoría Técnica del Proyecto

**Auditoría Realizada:** 13 de abril de 2026
**Auditor:** Claude Senior Architect (AI)
**Estado General:** Producción con Deuda Técnica
**Score Técnico:** 6.5/10 (Ver score al final)

---

## 📊 RESUMEN EJECUTIVO

| Aspecto | Status | Severidad | Esfuerzo |
|---------|--------|-----------|----------|
| **Arquitectura** | ⚠️ Frágil | MEDIA | Alto |
| **Código JS** | ⚠️ Desincronizado | ALTA | Bajo |
| **CSS** | ❌ Desordenado | MEDIA | Alto |
| **Integración Google** | ⚠️ Sin retry | MEDIA | Alto |
| **Accesibilidad** | ❌ Deficiente | BAJA | Medio |
| **Tests** | ❌ Nulo | BAJA | Alto |
| **Documentación** | ✅ Buena | N/A | N/A |
| **Seguridad** | ✅ Básica OK | BAJA | Bajo |

---

## 🚨 ISSUES CRÍTICOS (ALTA SEVERIDAD)

### ISSUE #1: Desincronización de archivos JavaScript
**Severity:** ALTA
**Ubicación:** `/js/` vs `/presupuestador/js/`
**Descripción:**

Los archivos en dos directorios diferentes están FUERA DE SINCRONIZACIÓN:

```bash
# Comparación de líneas
wc -l /js/*.js /presupuestador/js/*.js

/js/calculator.js               227 líneas
/presupuestador/js/calculator.js 176 líneas  ← 51 líneas de diferencia

/js/form-handler.js             200 líneas
/presupuestador/js/form-handler.js 201 líneas  ← 1 línea de diferencia (EOL)

/js/email-handler.js             32 líneas
/presupuestador/js/email-handler.js 32 líneas  ✅ SYNC OK
```

**Análisis detallado de calculator.js:**

El archivo `/js/calculator.js` tiene código ADICIONAL y MÁS MADURO:
- Logging mejorado (25+ console.log statements)
- Manejo de custom mode más robusto (deshabilita checkboxes, opacidad)
- UI updates mejoradas (botón cambia de texto según modo)
- Validaciones adicionales

El archivo `/presupuestador/js/calculator.js` es una versión más VIEJA/SIMPLIFICADA:
- Sin logging
- Custom mode incompleto
- UI updates básicas

**Problema:**
Si un desarrollador modifica `/presupuestador/js/calculator.js` (la que REALMENTE se usa), los cambios no aparecen en `/js/calculator.js`. O viceversa.

**¿Cuál se usa realmente?**
```html
<!-- presupuestador/index.html carga: -->
<script src="js/main.js"></script>
<script src="js/calculator.js"></script>
<!-- ... etc ... -->

<!-- index.html (raíz) carga: -->
<!-- Nada (es solo landing page) -->
```

**Conclusión:** Se usa `/presupuestador/js/calculator.js` pero la versión "real" está en `/js/`.

**Recomendación:**
1. **Corto plazo:** Sincronizar manualmente (copiar `/js/` → `/presupuestador/js/`)
2. **Largo plazo:** Eliminar la duplicación (ver REFACTOR abajo)

**Esfuerzo para arreglar:** BAJO (30 minutos)

---

### ISSUE #2: pricing.json Obsoleto
**Severity:** ALTA
**Ubicación:** `/data/pricing.json` y `/presupuestador/data/pricing.json`
**Descripción:**

Existe un archivo `pricing.json` que contiene precios INCONSISTENTES con `CONFIG`:

```json
// /data/pricing.json PRECIOS VIEJOS
{
  "website_types": {
    "landing": {"price_ars": 180000},      // CONFIG: 200000
    "simple": {"price_ars": 200000},       // CONFIG: 250000
    "portfolio": {"price_ars": 300000},    // CONFIG: 350000
    "ecommerce": {"price_ars": 500000}     // CONFIG: 600000
  }
}
```

**Problema:**
- El archivo NO se usa en ningún lado (grepped toda la codebase)
- Causa confusión: ¿cuál es la fuente de verdad?
- Los precios son ~$20-100k MÁS BAJOS que CONFIG
- Si alguien lo actualizara y lo empezara a usar, el sistema usaría precios viejos

**Búsqueda:**
```bash
grep -r "pricing.json" . 2>/dev/null
# No hay resultados → archivo NO se usa
```

**Recomendación:** Eliminar ambas copias
```bash
rm /data/pricing.json
rm /presupuestador/data/pricing.json
```

**Esfuerzo para arreglar:** BAJO (1 minuto - solo delete)

---

### ISSUE #3: Webhook URL Hardcodeada en Frontend (Exposición)
**Severity:** ALTA (por principio, BAJA en práctica)
**Ubicación:** `/presupuestador/js/email-handler.js:6`
**Descripción:**

```javascript
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby9Bz6bXnt06aGHfWEAv76xKWvcc_NBaNhzO5Zijx6RYLr0aNyoH2zpoW-_YYqa0rlS/exec";
```

La URL completa (incluyendo el token) está visible en:
- Código fuente (GitHub público)
- DevTools del navegador
- Network tab de cualquiera

**¿Es un problema?**
- ✅ La URL es INTENCIONALMENTE pública (Google Apps Script "Deploy as: Anyone")
- ✅ El webhook es **read-only del punto de vista del atacante** (solo acepta POST específico)
- ❌ Un atacante PODRÍA spamear el webhook con requests falsos
- ❌ Un atacante PODRÍA DoS el Google Sheets si hace 1000 requests/min
- ❌ Un atacante PODRÍA conocer tu Sheet ID si extrae el Apps Script

**Mitigation Actual:** Ninguna (es por diseño)

**Recomendación:**
1. **Aceptar el riesgo** (es bajo, y Google lo maneja)
2. **Monitorear LOGS sheet** en Google Sheets para requests anómalos
3. **Rate limiting en Apps Script:** Rechazar IPs sospechosas

**Esfuerzo para mejorar:** MEDIO (mover a .env, pero esto requiere build process)

---

## ⚠️ ISSUES MEDIANOS (SEVERIDAD MEDIA)

### ISSUE #4: No hay Retry Logic en Webhook
**Severity:** MEDIA
**Ubicación:** `/presupuestador/js/email-handler.js:sendToGoogleSheets()`
**Descripción:**

```javascript
async function sendToGoogleSheets(formData) {
    try {
        await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            ...
        });
        showSuccess('Cotización procesada exitosamente');
        return true;
    } catch (error) {
        showError('Error enviando cotización: ' + error.message);
        return false;
    }
}
```

**Problemas:**
1. Si el fetch falla (red error, timeout, Google down), no hay reintentos
2. Con `mode: 'no-cors'`, NO sabemos si realmente funcionó (respuesta opaca)
3. Si Google está down por 2 minutos, el usuario pierde el lead

**¿Cuándo falla el webhook?**
- Google Apps Script está down (~0.1% del tiempo)
- Red del usuario está lenta (timeout)
- Google rate limiting (300 req/min)
- Browser cierra tab antes de que se envíe

**Recomendación:** Implementar exponential backoff
```javascript
async function sendToGoogleSheets(formData, attempt = 1, maxAttempts = 3) {
    try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'cors',  // Cambiar a CORS
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();

        if (data.success) {
            showSuccess('Cotización enviada con éxito');
            return true;
        }
    } catch (error) {
        if (attempt < maxAttempts) {
            const delay = Math.pow(2, attempt - 1) * 1000;  // 1s, 2s, 4s
            console.log(`Reintentar en ${delay}ms...`);
            await new Promise(r => setTimeout(r, delay));
            return sendToGoogleSheets(formData, attempt + 1, maxAttempts);
        }
        showError('Error: no se pudo enviar. Intenta nuevamente.');
        return false;
    }
}
```

**Esfuerzo para arreglar:** MEDIO (2-3 horas de testing)

---

### ISSUE #5: CSS 100% Inline (no reutilizable)
**Severity:** MEDIA
**Ubicación:** `presupuestador/index.html` líneas 13-850+ (54KB de inline CSS)
**Descripción:**

Todo el CSS está dentro de un solo `<style>` tag en el HTML:

```html
<head>
    <style>
        /* 54KB de CSS inline aquí */
        :root { --bg-page: #0f172a; ... }
        body { font-family: 'Inter', ... }
        .page-wrapper { ... }
        /* ... 850 líneas ... */
    </style>
</head>
```

**Problemas:**
- ❌ No se puede reutilizar en `/index.html` (landing page)
- ❌ Archivo HTML es GIGANTE (54KB)
- ❌ No hay separación de concerns (HTML + CSS + JS todo en uno)
- ❌ Imposible cachear CSS por separado en browser
- ❌ Linters no pueden analizar CSS modular

**Los archivos CSS que existen son "fake":**
```bash
ls -la presupuestador/css/
-rw-r--r-- 3 lines styles.css    # Solo tiene 3 líneas
-rw-r--r-- 5 lines responsive.css # Solo tiene 5 líneas
```

**Recomendación:** Extraer CSS a archivo externo
```bash
# 1. Crear presupuestador/css/main.css con todo el CSS
# 2. En presupuestador/index.html, reemplazar <style> con:
<link rel="stylesheet" href="css/main.css">

# 3. Beneficios:
# - HTML baja de 54KB a 10KB
# - CSS cacheable por navegador
# - Puedo compartir CSS entre páginas
# - Código más limpio
```

**Esfuerzo para arreglar:** MEDIO (1-2 horas de refactor)

---

### ISSUE #6: Falta Manejo de Errores en Google Sheets Fetch
**Severity:** MEDIA
**Ubicación:** `email-handler.js:sendToGoogleSheets()`
**Descripción:**

Con `mode: 'no-cors'`, la respuesta del servidor es completamente opaca:

```javascript
await fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',  // ← Respuesta opaca
    ...
});

// Incluso si Google responde con 500 Internal Error,
// el fetch() NO falla, simplemente no podemos leerlo
console.log('✓ Enviado exitosamente');  // Se muestra siempre
showSuccess('Cotización procesada exitosamente');  // Se muestra siempre
```

**Problema:** User ve "éxito" pero datos podrían no haberse guardado

**Solución:** Cambiar a CORS
```javascript
const response = await fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    mode: 'cors',  // ← Respuesta legible
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
});

const data = await response.json();
if (data.success) {
    showSuccess('Éxito');
} else {
    showError(`Error: ${data.error}`);
}
```

**Requisito:** Google Apps Script debe agregar CORS headers (simple fix)

**Esfuerzo para arreglar:** MEDIO

---

### ISSUE #7: Estado Global Sin Encapsulación
**Severity:** MEDIA
**Ubicación:** `main.js:22-35` (objeto `state`)
**Descripción:**

```javascript
const state = {
    websiteType: null,
    sections: [],
    features: [],
    presupuesto: { ... }
};

// Cualquier función puede modificar directamente:
state.websiteType = 'landing';  // ✅ Works
state.presupuesto.total = 999999;  // ✅ Works (pero es un BUG!)
```

**Problemas:**
- ✅ Sin validación de tipos (podría asignar string a number)
- ✅ Sin auditoría de cambios (quién modificó `state.total`?)
- ✅ Sin undo/redo capability
- ✅ Difícil de testear (necesito mockear objeto global)
- ✅ Concurrencia: si dos funciones modifican state al mismo tiempo, orden indefinido

**Recomendación:** Encapsular con getters/setters
```javascript
const createState = () => {
    let state = { ... };

    return {
        getState: () => ({ ...state }),
        updateState: (updates) => {
            // Validar y auditar aquí
            state = { ...state, ...updates };
            saveToStorage();
        }
    };
};

const stateManager = createState();
stateManager.updateState({ websiteType: 'landing' });
```

**Esfuerzo para arreglar:** MEDIO (refactor, testing)

---

### ISSUE #8: Estructura Dual-File (Deuda Técnica)
**Severity:** MEDIA
**Ubicación:** `/` y `/presupuestador/` directorios
**Descripción:**

El proyecto mantiene DOS copias de todo:
```
/index.html              (landing page)
/js/main.js, calculator.js, ...  (versión antigua/diferente)

/presupuestador/index.html     (presupuestador form)
/presupuestador/js/main.js, calculator.js, ... (versión real)
```

**¿Por qué existe?**
CLAUDE.md dice: "backwards compatibility con estructura antigua"

**¿Es necesaria?**
- ❌ NO. Es deuda técnica pura.
- La versión "/js/" ni siquiera se carga (index.html raíz no hace referencia)
- Los usuarios solo usan /presupuestador/

**Costo actual:**
- Hay que actualizar dos lugares (error-prone)
- Bytes desperdiciados en hosting/git
- Confusión para nuevos desarrolladores

**Recomendación:** Eliminar la carpeta `/js/` en refactor futuro
```bash
# Mantener solo:
presupuestador/index.html
presupuestador/js/main.js
presupuestador/js/calculator.js
# ... etc

# Eliminar:
/index.html (reemplazar con redirección a presupuestador/)
/js/ (directorio completo)
/css/ (directorio completo)
/data/ (directorio completo)
```

**Esfuerzo para arreglar:** BAJO-MEDIO (cambiar URLs, testing)

---

## 🔴 ISSUES MENORES (SEVERIDAD BAJA)

### ISSUE #9: Sin TypeScript (Sin validación de tipos)
**Severity:** BAJA
**Ubicación:** Todo el proyecto (Vanilla JS)
**Descripción:**

Todas las funciones son sin tipos:
```javascript
// Sin tipos
function updatePresupuesto() { ... }

// TypeScript sería:
function updatePresupuesto(): void { ... }
```

**Impacto:** Developer error prone cuando refactoring
**Recomendación:** Migrar a TypeScript en v3.0
**Esfuerzo:** ALTO (rewrite del 50% del código)

---

### ISSUE #10: Validación Deficiente de Teléfono
**Severity:** BAJA
**Ubicación:** `form-handler.js:validateForm()`
**Descripción:**

El campo teléfono es requerido pero SIN validación de formato:

```javascript
// Solo valida que no esté vacío
if (!email) {
    showError('Por favor ingresa tu email');
    return false;
}

// Teléfono: no hay validación
// User puede poner: "abc123" y funciona
```

**Recomendación:** Validar formato básico
```javascript
function isValidPhone(phone) {
    const re = /^\+?[0-9\s\-\(\)]{7,}$/;  // Al menos 7 dígitos
    return re.test(phone.replace(/\s/g, ''));
}
```

**Esfuerzo:** BAJO

---

### ISSUE #11: Sin Pruebas Automatizadas
**Severity:** BAJA (pero importante)
**Ubicación:** No hay `/tests/` directorio
**Descripción:**

No hay tests para:
- Cálculos de presupuesto (¿y si alguien cambia CONFIG?)
- Validaciones de form
- Integración con Google Sheets
- Custom mode vs Standard mode

**Impacto:**
- Si cambio CONFIG.PRESUPUESTO_BASE['landing'] de 200000 a 150000, cálculos rompen
- No hay forma de detectar que rompí algo

**Recomendación:** Agregar suite de tests con Jest o Vitest
```javascript
// tests/calculator.test.js
describe('updatePresupuesto()', () => {
    test('landing + 2 sections + 1 feature = correct total', () => {
        // Setup DOM
        // Call updatePresupuesto()
        // Assert state.presupuesto.total === 450000
    });
});
```

**Esfuerzo:** ALTO (2-3 días para suite completa)

---

### ISSUE #12: Accesibilidad Limitada
**Severity:** BAJA
**Ubicación:** HTML presupuestador
**Descripción:**

WCAG 2.1 AA violations:
- ❌ No hay `aria-labels` en inputs
- ❌ Option cards no tienen `aria-selected`
- ❌ Spinner no tiene `role="status"`
- ❌ Color contrast en algunos elementos podría ser mejor
- ❌ Labels no siempre están asociados a inputs correctamente

**Impacto:** Usuarios con lectores de pantalla ven UI confusa

**Recomendación:**
```html
<!-- Actualizar -->
<input id="nombre" aria-label="Tu nombre completo" />

<!-- Option card -->
<div class="option-card" role="radio" aria-selected="false">
    <input type="radio" name="option" value="landing" />
    ...
</div>
```

**Esfuerzo:** BAJO-MEDIO

---

## 📊 SCORING TÉCNICO

| Aspecto | Score | Justificación |
|---------|-------|---|
| **Funcionalidad** | 9/10 | Core logic funciona, pero sin retry logic |
| **Mantenibilidad** | 5/10 | Desincronización, CSS inline, sin tests |
| **Seguridad** | 7/10 | Básica OK, pero webhook sin validación fuerte |
| **Accesibilidad** | 4/10 | WCAG violations, falta aria labels |
| **Escalabilidad** | 5/10 | Dual-file structure, sin caching CSS |
| **Documentación** | 8/10 | MOD-* y README buenos, pero técnica incompleta |
| **DX (Developer Experience)** | 4/10 | Confuso para newbies, deuda técnica |

**SCORE GENERAL: 6.5/10**

---

## 📋 CHECKLIST DE ARREGLOS PRIORIZADOS

### Semana 1 (Urgente)
- [ ] #2: Eliminar pricing.json obsoleto
- [ ] #1: Sincronizar `/js/` y `/presupuestador/js/`
- [ ] #10: Validación de teléfono
- [ ] #12: Agregar aria-labels básicos

### Semana 2 (Important)
- [ ] #5: Extraer CSS a archivo externo
- [ ] #4: Implementar retry logic en webhook
- [ ] #6: Cambiar a CORS + error handling
- [ ] #9: Agregar JSDoc comments

### Mes 1 (Nice to have)
- [ ] #7: Refactor estado con encapsulación
- [ ] #11: Escribir test suite básica
- [ ] #8: Eliminar estructura dual-file
- [ ] #12: Auditoría WCAG completa

### Futuro (v3.0)
- [ ] #9: Migrar a TypeScript
- [ ] Agregar CI/CD pipeline
- [ ] Agregar API de administración

---

## 🎯 RECOMENDACIONES POR TIPO DE USUARIO

### Para un Freelancer (solo mantenimiento)
1. Sincronizar `/js/` y `/presupuestador/js/` (1 hora)
2. Eliminar pricing.json (5 minutos)
3. Agregar aria-labels (30 minutos)
4. ✅ Listo. Proyecto estable para mantenimiento.

### Para una Agencia (plan de mejora)
1. Hacer todo lo de freelancer
2. Extraer CSS a archivo (2 horas)
3. Implementar retry logic (3 horas)
4. Agregar básica test suite (8 horas)
5. Documentar Google Apps Script (4 horas)
6. **Estimado:** 2-3 semanas a tiempo parcial

### Para escalar a Múltiples Clientes
1. Migrar a TypeScript (5-7 días)
2. Implementar multi-tenant architecture
3. Agregar CMS integrado
4. Agregar API de admin
5. Agregar analytics dashboard
6. **Estimado:** 4-6 semanas

---

## 🔗 REFERENCIAS

- **SDD_MASTER.md** - Arquitectura y decisiones
- **MOD-01_PRICING.md** - Cálculos de precios
- **MOD-02_WEBHOOK.md** - Integración Google
- **CLAUDE.md** - Guía para desarrolladores
- **README.md** - Información general

---

## Firma de Auditoría

**Auditor:** Claude Senior Architect
**Fecha:** 13 de abril de 2026
**Estado:** Completada
**Próxima auditoría recomendada:** 13 de octubre de 2026 (6 meses)

