/**
 * Stencil reports a component's unnamed (default) slot with an empty
 * string name. Normalize to a user-facing label so it renders and
 * slugifies consistently across the docs page and the TOC.
 * @param {string} name the raw slot name from JsonDocs
 * @returns {string} the display name to use for headings and TOC entries
 */
export function slotDisplayName(name) {
    return name || 'default';
}
