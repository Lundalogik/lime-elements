/**
 * Slug identifiers used by the table-of-contents and URL anchors on the
 * component docs page. Kept separate so the component and its templates
 * can share the same strings.
 */
export declare const SECTION_SLUGS: {
    readonly examples: "examples";
    readonly properties: "properties";
    readonly events: "events";
    readonly methods: "methods";
    readonly slots: "slots";
    readonly styles: "styles";
};
export type SectionSlug = (typeof SECTION_SLUGS)[keyof typeof SECTION_SLUGS];
/**
 * Return the first non-empty line of a text blob, trimmed. Returns an
 * empty string if no non-empty line is found.
 * @param {string} text the input text
 * @returns {string} the first non-empty line
 */
export declare function firstLine(text: string): string;
/**
 * Derive an anchor id for an example component from its title (first line
 * of its docs). Falls back to the example's tag if no title is available.
 * @param {string} docs the example's docs text
 * @param {string} fallbackTag tag to slugify if the docs have no title
 * @returns {string} the anchor id to use in the URL hash
 */
export declare function exampleAnchorId(docs: string, fallbackTag: string): string;
/**
 * Read the current route part of the URL hash, stripping any trailing
 * `#fragment` anchor.
 * @returns {string} the route, without leading `#`
 */
export declare function currentRoute(): string;
/**
 * Build an `href` that preserves the current route and adds a secondary
 * `#slug` anchor, e.g. `#/component/my-component#basic-example`.
 * @param {string} slug the anchor id to link to
 * @returns {string} the full href value
 */
export declare function anchorHref(slug: string): string;
/**
 * Turn an arbitrary identifier (camelCase, CSS custom property, etc.) into
 * a URL-safe slug.
 * @param {string} name the identifier to slugify
 * @returns {string} the slugified identifier
 */
export declare function slugify(name: string): string;
/**
 * Build a slug for an entry nested under a section, e.g. `properties-value`.
 * @param {string} sectionSlug the section slug
 * @param {string} name the entry name
 * @returns {string} the combined slug
 */
export declare function entrySlug(sectionSlug: string, name: string): string;
/**
 * Compute unique anchor ids for a list of example components, appending
 * `-2`, `-3`, ... suffixes when two examples would otherwise collide on
 * the same slug (e.g. two examples share a title).
 * @param {Array<{docs: string; tag: string}>} examples the examples in render order
 * @returns {string[]} unique slugs in the same order
 */
export declare function uniqueExampleSlugs(examples: Array<{
    docs: string;
    tag: string;
}>): string[];
