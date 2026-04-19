# 🔍 AUDITORÍA DE DUPLICACIÓN — Reporte Detallado

**Fecha:** 13 de abril de 2026
**Estado:** Análisis Completo — ESPERANDO CONFIRMACIÓN antes de cambios
**Auditor:** Claude Senior Architect

---

## 📊 HALLAZGOS PRINCIPALES

### 1️⃣ ARCHIVOS JAVASCRIPT — ESTATUS DE SINCRONIZACIÓN

#### ✅ SINCRONIZADOS (4 archivos)
```
✅ email-handler.js    [32 líneas] ↔ [32 líneas]    100% IDÉNTICO
✅ main.js             [68 líneas] ↔ [68 líneas]    100% IDÉNTICO
✅ storage.js          [2 líneas]  ↔ [2 líneas]     100% IDÉNTICO
✅ ui-updater.js       [2 líneas]  ↔ [2 líneas]     100% IDÉNTICO
```

#### ❌ DESINCRONIZADOS (2 archivos)

**calculator.js — CRÍTICO**
```
Raíz:              js/calculator.js           [227 líneas]
Presupuestador:    presupuestador/js/calculator.js  [176 líneas]
Diferencia:        51 LÍNEAS FALTANTES en presupuestador/
```

**ANÁLISIS DETALLADO:**
La versión raíz (`js/calculator.js`) tiene código MÁS ACTUALIZADO/COMPLETO:

| Característica | Raíz | Presupuestador |
|---|---|---|
| Logging para debug | ✅ Sí (25+ logs) | ❌ No |
| Custom mode detection | ✅ Sí | ❌ No |
| Deshabilitar UI en custom mode | ✅ Sí | ❌ No |
| Cambiar text de botón | ✅ Sí | ❌ No |
| Lógica base | ✅ Sí | ✅ Sí |

**RECOMENDACIÓN:** `js/calculator.js` es la versión correcta.
El archivo `presupuestador/js/calculator.js` es viejo y debe reemplazarse.

---

**form-handler.js — TRIVIAL**
```
Raíz:              js/form-handler.js           [200 líneas]
Presupuestador:    presupuestador/js/form-handler.js  [201 líneas]
Diferencia:        SOLO FORMATTING (espacios en blanco)
```

**ANÁLISIS DETALLADO:**
El código funcional es IDÉNTICO. Las diferencias son:
- Línea 123: Presupuestador tiene espacio extra en blanco
- Línea 125-127: Presupuestador tiene indentación diferente (4 espacios vs 12)
- Línea 189: Presupuestador tiene newline extra
- Línea 201: Presupuestador tiene newline final (buena práctica)

**RECOMENDACIÓN:** Ambas versiones funcionan igual. Usar la raíz como "source of truth" y actualizar presupuestador/ con formatting correcto.

---

### 2️⃣ ARCHIVOS CSS — ESTATUS DE SINCRONIZACIÓN

#### ✅ PERFECTAMENTE SINCRONIZADOS
```
✅ styles.css      [3 líneas] ↔ [3 líneas]    100% IDÉNTICO
✅ responsive.css  [5 líneas] ↔ [5 líneas]    100% IDÉNTICO
```

**NOTA IMPORTANTE:** Ambos directorios tienen CSS MINIMAL (3-5 líneas cada uno).
La mayoría del CSS (~54KB) está INLINE en los archivos HTML, no en estos archivos.

**RECOMENDACIÓN:** Los archivos CSS son "stubs" innecesarios. Podrían eliminarse si se extrae todo el CSS inline a archivos externos (tarea futura).

---

### 3️⃣ ARCHIVOS DATA — ESTATUS DE SINCRONIZACIÓN

#### ✅ IDÉNTICOS
```
✅ pricing.json    [8 líneas] ↔ [8 líneas]    100% IDÉNTICO
```

**PROBLEMA:** Este archivo está **MUERTO/OBSOLETO**
- No se importa en ningún archivo .js
- No se referencia en ningún lado
- Los precios están **DESACTUALIZADOS**:
  - JSON: landing $180k vs CONFIG: $200k
  - JSON: simple $200k vs CONFIG: $250k
  - JSON: portfolio $300k vs CONFIG: $350k
  - JSON: ecommerce $500k vs CONFIG: $600k

**RECOMENDACIÓN:** ELIMINAR ambas copias (`/data/pricing.json` y `/presupuestador/data/pricing.json`)
La fuente de verdad es `CONFIG.PRESUPUESTO_BASE` en `js/main.js`

---

### 4️⃣ ARCHIVOS HTML — ANÁLISIS DE PROPÓSITO Y CONTENIDO

#### index.html (RAÍZ) — LANDING PAGE

**Propósito:** Página de inicio estática
```html
<!-- Landing page con:
     - Header con gradiente azul-verde
     - 1 tarjeta de servicio ("Generar Presupuesto")
     - Botón que enlaza a presupuestador/
     - Footer copyright
-->
```

**Scripts cargados:** NINGUNO (sin <script src="">)
**CSS:** Inline (no referencia /css/)
**Propósito:** 100% ESTÁTICO (no necesita interactividad)

---

#### presupuestador/index.html — APLICACIÓN INTERACTIVA

**Propósito:** Formulario presupuestador con cálculos en tiempo real
```html
<!-- App con:
     - 54KB de CSS inline
     - Form interactivo (múltiples steps)
     - Presupuesto sidebar sticky
     - 4 option-cards para tipo de sitio
     - Validaciones y cálculos en JS
-->
```

**Scripts cargados:** SÍ
```html
<script src="../js/main.js"></script>
<script src="../js/calculator.js"></script>
<script src="../js/form-handler.js"></script>
<script src="../js/email-handler.js"></script>
```

**Nota CRÍTICA:** Carga scripts desde **../js/** (la carpeta raíz)
NO carga scripts de presupuestador/js/

**CSS:** Inline (no referencia /presupuestador/css/ ni /css/)

---

#### CONCLUSIÓN SOBRE HTMLS

```
┌──────────────────────┬──────────────────────────┐
│  index.html (raíz)   │ presupuestador/index.html│
├──────────────────────┼──────────────────────────┤
│ LANDING PAGE         │ PRESUPUESTADOR APP       │
│ 100% estático        │ 100% interactivo         │
│ Sin scripts .js      │ Carga 4 scripts .js      │
│ Línea de mando       │ Aplicación de verdad     │
│ Botón: ir a app      │ Núcleo funcional         │
└──────────────────────┴──────────────────────────┘
```

**DECISIÓN:** NO son duplicados. Tienen propósitos COMPLETAMENTE DISTINTOS.
No deben tocarse (o al menos, no "eliminar uno").

---

### 5️⃣ tienda-nube.html — ANÁLISIS DE USO

**Ubicación:** `/tienda-nube.html` (raíz, 84 KB)
**Propósito:** Formulario de integración con Tienda Nube API (legacy)

**Status: LEGACY/DEPRECATED**
```
❌ No se referencia en index.html
❌ No se referencia en presupuestador/index.html
❌ No se carga en ningún lado
❌ No mencionado en README.md
❌ No usado en la arquitectura actual
✅ Mencionaste que "ya tiene su propio repo separado"
```

**RECOMENDACIÓN:** ELIMINAR del proyecto
- Es código viejo de un proyecto anterior
- Ya existe en su propio repositorio separado
- Solo ocupa espacio (84 KB) sin ser usado
- Confunde a desarrolladores nuevos

---

## 📋 ESTRUCTURA ACTUAL (antes de cambios)

```
generador-presupuestos/
│
├── index.html                          ← LANDING PAGE (no scripts)
├── tienda-nube.html                    ← LEGACY (no se usa) ❌ ELIMINAR
│
├── /js/                                ← Scripts "source of truth"
│   ├── main.js                         ✅ SYNC OK
│   ├── calculator.js                   ⚠️  MÁS ACTUALIZADO (usar como base)
│   ├── form-handler.js                 ✅ SYNC OK (minor formatting)
│   ├── email-handler.js                ✅ SYNC OK
│   ├── storage.js                      ✅ SYNC OK
│   └── ui-updater.js                   ✅ SYNC OK
│
├── /presupuestador/                    ← APP (carga scripts de ../)
│   ├── index.html                      ← Presupuestador app (54KB CSS inline)
│   ├── /js/                            ← COPIA (desincronizado)
│   │   ├── main.js                     ✅ OK
│   │   ├── calculator.js               ❌ VIEJO (51 líneas menos)
│   │   ├── form-handler.js             ✅ OK (formatting only)
│   │   ├── email-handler.js            ✅ OK
│   │   ├── storage.js                  ✅ OK
│   │   └── ui-updater.js               ✅ OK
│   ├── /css/                           ✅ OK (identicos pero son stubs)
│   └── /data/                          ✅ OK (identicos pero obsoleto)
│
├── /css/                               ← CSS (3-5 líneas, mayormente vacío)
│   ├── styles.css                      ✅ OK (idéntico)
│   └── responsive.css                  ✅ OK (idéntico)
│
└── /data/                              ← DATA (obsoleto)
    └── pricing.json                    ❌ OBSOLETO (no se usa)
```

---

## 🎯 RECOMENDACIONES DE ACCIÓN

### OPCIÓN A: MÍNIMA (Mantener dual-file)
**Objetivo:** Sincronizar lo que existe sin cambiar estructura

**Acciones:**
1. ✅ Copiar `/js/calculator.js` → `/presupuestador/js/calculator.js` (reemplazar)
2. ✅ Sincronizar form-handler.js (formato)
3. ✅ Eliminar `/data/pricing.json` y `/presupuestador/data/pricing.json`
4. ✅ Eliminar `tienda-nube.html`

**Resultado:** Proyecto sin archivos muertos, dual-file sincronizado

**Tiempo:** 30 minutos

---

### OPCIÓN B: RECOMENDADA (Eliminar duplicación)
**Objetivo:** Limpiar estructura, eliminar carpetas redundantes

**Acciones:**
1. ✅ Eliminar carpeta `/js/` (completamente)
2. ✅ Renombrar `/presupuestador/js/` → `/js/` (mover contenido)
3. ✅ Actualizar paths en `presupuestador/index.html`: `../js/` → `./js/`
4. ✅ Eliminar carpetas `/css/` y `/presupuestador/css/` (son stubs)
5. ✅ Eliminar carpetas `/data/` y `/presupuestador/data/` (obsoleto)
6. ✅ Eliminar `tienda-nube.html`

**Resultado:**
```
generador-presupuestos/
├── index.html
├── presupuestador/
│   ├── index.html
│   ├── /js/
│   │   ├── main.js
│   │   ├── calculator.js
│   │   └── ...
│   └── /css/ (extracted from inline)
└── /docs/
```

**Tiempo:** 2 horas (incluye tests)

---

## 🔄 RUTA RECOMENDADA

Mi recomendación: **OPCIÓN B (Eliminar duplicación)**

**Justificación:**
- ✅ Elimina confusión (un solo lugar para editar)
- ✅ Reduce mantenimiento (no hay que sincronizar dos carpetas)
- ✅ Limpia proyecto (elimina archivos muertos)
- ✅ No rompe funcionalidad (presupuestador/index.html ya carga de `../js/`)
- ✅ Mejora DX (más fácil de entender para nuevos devs)

---

## 📋 CHECKLIST DE CAMBIOS PROPUESTOS

**SI APRUEBAS, EJECUTARÉ ESTOS CAMBIOS:**

### FASE 1: Sincronizar Archivos Críticos
- [ ] Copiar `/js/calculator.js` → `/presupuestador/js/calculator.js` (reemplazar)
- [ ] Sincronizar `/js/form-handler.js` → `/presupuestador/js/form-handler.js` (formato)

### FASE 2: Eliminar Duplicación
- [ ] Eliminar carpeta `/js/` (completa)
- [ ] Eliminar carpeta `/css/` (completa)
- [ ] Eliminar carpeta `/data/` (completa)

### FASE 3: Eliminar Legacy
- [ ] Eliminar `tienda-nube.html`

### FASE 4: Verificación
- [ ] Revisar que presupuestador/index.html aún funciona
- [ ] Revisar que index.html raíz aún funciona
- [ ] Tests manuales en navegador

---

## ⚠️ RIESGOS Y MITIGACIÓN

| Riesgo | Mitigación |
|--------|-----------|
| Romper presupuestador/ | Ya carga de ../js/, no de presupuestador/js/ |
| Perder código | Todo se unifica, no se pierde nada |
| Confundir paths | Solo presupuestador/ carga scripts (futura: ./js/) |
| Romper landing page | index.html raíz no carga scripts, no afecta |

---

## ✅ ESTADO ACTUAL vs PROPUESTO

**ANTES:**
```
/js/                          (6 archivos)
/css/                         (2 archivos stubs)
/data/                        (1 archivo obsoleto)
/presupuestador/js/           (6 archivos - desincronizado)
/presupuestador/css/          (2 archivos stubs)
/presupuestador/data/         (1 archivo obsoleto)
tienda-nube.html             (legacy)

Total: 20 archivos, 4 carpetas redundantes
```

**DESPUÉS:**
```
presupuestador/
  ├── index.html
  ├── js/                    (6 archivos sincronizados)
  ├── css/                   (2 archivos, o extraídos)
  └── data/                  (si decidimos mantener)

index.html                    (landing page)

Total: 11 archivos, 1 carpeta de app
```

**Limpieza:** -45% de archivos duplicados

---

## 🎯 TU DECISIÓN

**Por favor confirma cuál opción prefieres:**

### OPCIÓN A (Mínima)
- Sincronizar calculator.js
- Eliminar pricing.json y tienda-nube.html
- Mantener estructura dual (/js/ + /presupuestador/js/)
- ✅ Rápido (30 min)
- ❌ Mantiene confusión estructural

### OPCIÓN B (Recomendada)
- Eliminar todas las carpetas redundantes
- Limpiar proyecto completamente
- Mantener solo /presupuestador/ con sus /js/, /css/
- ✅ Limpio, profesional
- ✅ Mejor DX
- ⏱️ Medio (2 horas)

### OPCIÓN C (Custom)
- Otra estructura que tengas en mente
- Dime y la ejecuto

---

**Esperando tu confirmación.**

