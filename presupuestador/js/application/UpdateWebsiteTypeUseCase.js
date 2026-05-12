// ═══════════════════════════════════════════════════════════════
// APPLICATION / UpdateWebsiteTypeUseCase.js
// ─ Capa: Application (Clean Architecture)
// ─ Responsabilidad: orquestar el flujo al cambiar el tipo de sitio.
//
// CONTRATO:
//   - Lee state desde el global `state` (main.js).
//   - Invoca ConstraintEngine.validateConstraints() — no contiene lógica de negocio.
//   - Actualiza state.websiteType y state.features ANTES de tocar el DOM.
//   - Delega la renderización a UIRenderer (Infrastructure layer).
//   - No accede al DOM directamente, salvo para registrar el event listener en init().
//
// MAPEO DE IDs REALES (HTML vs MOD-07 spec):
//   - Select tipo de sitio : id="tipo_sitio"
//   - Feature "Carrito"   : value="cart"       (name="features")
//   - Feature "Tiendanube": value="tiendanube"  (name="features")
//   - Feature "Multi-idioma": value="multilingual" (name="features")
//   - Sección "Blog"      : value="blog"        (name="sections")  ← gestionada en T005/Presenter
// ═══════════════════════════════════════════════════════════════

const UpdateWebsiteTypeUseCase = (function () {

  /**
   * Orquesta el cambio de tipo de sitio.
   *
   * Orden garantizado (ver UC-02, Escenario A):
   *   1. Validar constraints con el nuevo tipo.
   *   2. Actualizar state (fuente de verdad) — atomicamente, antes del DOM.
   *   3. Persistir en localStorage.
   *   4. Invocar al Presenter para que derive el DOM desde el state limpio.
   *
   * @param {string|null} newType  Nuevo valor de tipo de sitio
   *                               ('landing' | 'simple' | 'portfolio' | 'ecommerce' | null)
   * @returns {ValidationResult}   Resultado del engine (útil para testing)
   */
  function execute(newType) {
    // Fase 1: Validar restricciones (Domain layer — función pura)
    const result = ConstraintEngine.validateConstraints(newType, state.features);

    // Fase 2: Actualizar state ANTES de cualquier mutación del DOM
    state.websiteType = newType;
    state.features    = result.newFeatures;

    // Fase 3: Persistir
    saveToStorage();

    // Fase 4: Delegar renderización al Presenter (Infrastructure layer)
    // UIRenderer se registra en T005. Guard defensivo para desarrollo incremental.
    if (typeof UIRenderer !== 'undefined' && typeof UIRenderer.renderConstraints === 'function') {
      UIRenderer.renderConstraints(state, result.reasons);
    }

    return result;
  }

  /**
   * Registra el event listener sobre el select #tipo_sitio.
   * Debe llamarse una sola vez desde DOMContentLoaded (main.js).
   */
  function init() {
    const tipoSitioSelect = document.getElementById('tipo_sitio');
    if (!tipoSitioSelect) return;

    tipoSitioSelect.addEventListener('change', function (event) {
      const newType = event.target.value || null;
      execute(newType);
    });
  }

  // API pública del módulo
  return { execute, init };

})();
