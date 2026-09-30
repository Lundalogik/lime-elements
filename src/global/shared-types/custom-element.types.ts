/**
 * Custom Element definition
 *
 * Used to define a Custom Element
 *
 * @alpha
 */
export interface CustomElementDefinition {
    tagName: string;
    attributes: string[];
}

/**
 * Custom Element
 *
 * @alpha
 */
export type CustomElement = Omit<CustomElementDefinition, 'attributes'> & {
    /**
     * Record of attributes and values to apply to the node
     */
    attributes: Record<string, any>;
};

/**
 * A custom element that can describe itself as markdown.
 *
 * `limel-markdown` calls `toMarkdown` on every whitelisted element that
 * implements it when its own `toMarkdown` is called, and puts the result
 * in the element's place. Use it to give targets that cannot render the
 * element, such as the clipboard, a markdown form of what it shows.
 *
 * The returned markdown takes the element's place as is, without
 * escaping. An element that is rendered inline, such as a chip, should
 * return inline markdown, such as a link.
 *
 * Implement `toMarkdown` as a method of the element's class, since
 * `limel-markdown` looks for it on the class of each whitelisted tag.
 *
 * @alpha
 */
export interface MarkdownDescribable {
    /**
     * Describe the element as markdown.
     *
     * @returns The markdown that represents the element.
     */
    toMarkdown(): Promise<string>;
}
