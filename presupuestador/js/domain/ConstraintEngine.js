// ═══════════════════════════════════════════════════════════════
// DOMAIN / ConstraintEngine.js
// ─ Capa: Domain (Clean Architecture)
// ─ Responsabilidad: lógica de negocio pura sobre restricciones de selección.
//
// CONTRATO:
//   - No importa nada de state.js ni del DOM.
//   - Recibe parámetros explícitos, retorna ValidationResult.
//   - Es una función pura: mismos inputs → mismo output, sin side effects.
//
// NOTA DE MAPEO (2026-05-12):
//   MOD-07 §2 usa IDs de spec ('carrito_pagos', 'gestion_stock', 'multi_idioma').
//   Los valores reales del HTML son 'cart', 'tiendanube', 'multilingual'.
//   Este engine usa los valores del HTML — fuente de verdad.
// ═══════════════════════════════════════════════════════════════

const ConstraintEngine = (function () {

  // ─── Reglas config-driven ─────────────────────────────────────────────────
  //
  // TYPE_CONSTRAINTS: restricciones por tipo de sitio.
  //   allowedTypes — tipos en los que la feature ESTÁ disponible.
  //   Agregar una nueva restricción = agregar una entrada aquí; no tocar la lógica.
  //
  const TYPE_CONSTRAINTS = {
    cart: {
      allowedTypes: ['ecommerce'],
      reason: 'Solo disponible en plan E-Commerce'
    },
    tiendanube: {
      allowedTypes: ['ecommerce'],
      reason: 'Solo disponible en plan E-Commerce'
    },
    multilingual: {
      allowedTypes: ['simple', 'portfolio', 'ecommerce'],
      reason: 'No disponible en Landing Page (sitio de una sola página)'
    }
  };

  // DEPENDENCY_CONSTRAINTS: restricciones de dependencia entre features.
  //   requires — featureId que debe estar presente Y válido.
  //   Agregar una cascada nueva = agregar una entrada aquí.
  //
  const DEPENDENCY_CONSTRAINTS = {
    tiendanube: {
      requires: 'cart',
      reason: 'Requiere "Carrito & Pagos Online" activo'
    }
  };

  // ─── Engine ───────────────────────────────────────────────────────────────

  /**
   * Evalúa las restricciones de selección para el estado dado.
   *
   * @param {string|null} websiteType  Valor de state.websiteType
   *                                   ('landing' | 'simple' | 'portfolio' | 'ecommerce' | null)
   * @param {string[]}    features     Array de IDs de features activas (state.features)
   *
   * @returns {ValidationResult}
   *   {
   *     isValid:        boolean,   — true si no hay ninguna restricción activa
   *     invalidFeatures: string[], — IDs a desmarcar
   *     reasons:        object,    — { [featureId]: string } para el Presenter
   *     newFeatures:    string[]   — features limpias (sin las inválidas)
   *   }
   */
  function validateConstraints(websiteType, features) {
    const invalidSet = new Set();
    const reasons    = {};

    // Fase 1: Restricciones por tipo de sitio
    for (const featureId of features) {
      const rule = TYPE_CONSTRAINTS[featureId];
      if (!rule) continue;

      if (!websiteType || !rule.allowedTypes.includes(websiteType)) {
        invalidSet.add(featureId);
        reasons[featureId] = rule.reason;
      }
    }

    // Fase 2: Cascada de dependencias entre features
    // Itera hasta que ningún cambio nuevo ocurra (convergencia).
    let changed = true;
    while (changed) {
      changed = false;
      for (const featureId of features) {
        if (invalidSet.has(featureId)) continue;

        const dep = DEPENDENCY_CONSTRAINTS[featureId];
        if (!dep) continue;

        const depMissing = !features.includes(dep.requires);
        const depInvalid = invalidSet.has(dep.requires);

        if (depMissing || depInvalid) {
          invalidSet.add(featureId);
          reasons[featureId] = dep.reason;
          changed = true;
        }
      }
    }

    const invalidFeatures = Array.from(invalidSet);

    return {
      isValid:        invalidFeatures.length === 0,
      invalidFeatures,
      reasons,
      newFeatures:    features.filter(f => !invalidSet.has(f))
    };
  }

  // API pública del módulo
  return { validateConstraints };

})();
