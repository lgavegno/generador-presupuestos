// ═══════════════════════════════════════════════════════════════
// INFRASTRUCTURE / ui-renderer.js
// ─ Capa: Infrastructure / Presenter (Clean Architecture)
// ─ Responsabilidad: derivar mutaciones del DOM desde el state.
//
// CONTRATO:
//   - Recibe `state` (fuente de verdad) y `reasons` (del ValidationResult).
//   - No contiene lógica de negocio — solo traduce state a DOM.
//   - Toda mutación de DOM ocurre DESPUÉS de que state está actualizado.
//   - Llama a updatePresupuesto() al finalizar para recalcular precios.
//
// IDs reales del HTML (fuente de verdad):
//   Features: input[name="features"][value="cart|tiendanube|multilingual"]
//   Sección:  input[name="sections"][value="blog"]
// ═══════════════════════════════════════════════════════════════

const UIRenderer = (function () {

  // IDs de features genéricas gestionadas por el Presenter
  const MANAGED_FEATURE_VALUES = ['cart', 'tiendanube', 'multilingual'];

  /**
   * Sincroniza el DOM con el state limpio recibido del UseCase.
   *
   * Invariante: state es la fuente de verdad — el DOM se deriva de él,
   * nunca al revés.
   *
   * @param {object} state    Estado global (post-cleanup del UseCase)
   * @param {object} reasons  { [featureId]: string } del ValidationResult
   */
  function renderConstraints(state, reasons) {
    console.log('[UIRenderer] Restricciones activas:', reasons);

    _renderFeatures(state);
    _renderBlogSection(state);

    // Recalcular precios con el state limpio
    if (typeof updatePresupuesto === 'function') {
      updatePresupuesto();
    }
  }

  // ─── Internals ────────────────────────────────────────────────────────────

  /**
   * Sincroniza los checkboxes de features con state.features.
   * Una feature no presente en state.features → disabled + unchecked.
   */
  function _renderFeatures(state) {
    for (const value of MANAGED_FEATURE_VALUES) {
      const input = document.querySelector(
        `input[name="features"][value="${value}"]`
      );
      if (!input) continue;

      const isAllowed = state.features.includes(value);
      input.disabled = !isAllowed;
      if (!isAllowed) {
        input.checked = false;
      }
    }
  }

  /**
   * Caso especial: Blog (name="sections" value="blog").
   * Landing Page (tipo de una sola página) no puede tener sección Blog.
   * En cualquier otro tipo, el input se habilita.
   */
  function _renderBlogSection(state) {
    const blogInput = document.querySelector(
      'input[name="sections"][value="blog"]'
    );
    if (!blogInput) return;

    if (state.websiteType === 'landing') {
      blogInput.checked  = false;
      blogInput.disabled = true;
    } else {
      blogInput.disabled = false;
    }
  }

  // API pública del módulo
  return { renderConstraints };

})();
