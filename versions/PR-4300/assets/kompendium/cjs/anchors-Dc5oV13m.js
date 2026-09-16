'use strict';

/**
 * Slug identifiers used by the table-of-contents and URL anchors on the
 * component docs page. Kept separate so the component and its templates
 * can share the same strings.
 */
const SECTION_SLUGS = {
    examples: 'examples',
    properties: 'properties',
    events: 'events',
    methods: 'methods',
    slots: 'slots',
    styles: 'styles',
};
/**
 * Return the first non-empty line of a text blob, trimmed. Returns an
 * empty string if no non-empty line is found.
 * @param {string} text the input text
 * @returns {string} the first non-empty line
 */
function firstLine(text) {
    const found = (text || '')
        .split('\n')
        .find((line) => line.trim().length > 0);
    return found ? found.trim() : '';
}
/**
 * Derive an anchor id for an example component from its title (first line
 * of its docs). Falls back to the example's tag if no title is available.
 * @param {string} docs the example's docs text
 * @param {string} fallbackTag tag to slugify if the docs have no title
 * @returns {string} the anchor id to use in the URL hash
 */
function exampleAnchorId(docs, fallbackTag) {
    return slugify(firstLine(docs)) || slugify(fallbackTag);
}
/**
 * Read the current route part of the URL hash, stripping any trailing
 * `#fragment` anchor.
 * @returns {string} the route, without leading `#`
 */
function currentRoute() {
    const hash = window.location.hash.replace(/^#/, '');
    const separatorIndex = hash.indexOf('#');
    return separatorIndex === -1 ? hash : hash.substring(0, separatorIndex);
}
/**
 * Build an `href` that preserves the current route and adds a secondary
 * `#slug` anchor, e.g. `#/component/my-component#basic-example`.
 * @param {string} slug the anchor id to link to
 * @returns {string} the full href value
 */
function anchorHref(slug) {
    return `#${currentRoute()}#${slug}`;
}
/**
 * Turn an arbitrary identifier (camelCase, CSS custom property, etc.) into
 * a URL-safe slug.
 * @param {string} name the identifier to slugify
 * @returns {string} the slugified identifier
 */
function slugify(name) {
    return name
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}
/**
 * Build a slug for an entry nested under a section, e.g. `properties-value`.
 * @param {string} sectionSlug the section slug
 * @param {string} name the entry name
 * @returns {string} the combined slug
 */
function entrySlug(sectionSlug, name) {
    return `${sectionSlug}-${slugify(name)}`;
}
/**
 * Compute unique anchor ids for a list of example components, appending
 * `-2`, `-3`, ... suffixes when two examples would otherwise collide on
 * the same slug (e.g. two examples share a title).
 * @param {Array<{docs: string; tag: string}>} examples the examples in render order
 * @returns {string[]} unique slugs in the same order
 */
function uniqueExampleSlugs(examples) {
    const counts = new Map();
    return examples.map((example) => {
        const base = exampleAnchorId(example.docs, example.tag);
        const count = counts.get(base) || 0;
        counts.set(base, count + 1);
        return count === 0 ? base : `${base}-${count + 1}`;
    });
}

exports.SECTION_SLUGS = SECTION_SLUGS;
exports.anchorHref = anchorHref;
exports.currentRoute = currentRoute;
exports.entrySlug = entrySlug;
exports.firstLine = firstLine;
exports.slugify = slugify;
exports.uniqueExampleSlugs = uniqueExampleSlugs;
