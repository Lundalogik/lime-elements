/**
 * Implemented by a custom element that can describe itself in markdown,
 * for a target that cannot render the element — the clipboard, say.
 *
 * `limel-markdown` calls it on every whitelisted element it has rendered
 * when asked for its own `toMarkdown()`.
 *
 * @alpha
 */
export interface MarkdownRepresentable {
    /**
     * The markdown this element stands for. Resolves once the element
     * has whatever it needs to describe itself — a loaded record, say.
     *
     * The markdown must follow from the element's attributes and content
     * alone: a viewer asks a fresh copy of the element made from its
     * markup, not the one on screen.
     */
    toMarkdown(): Promise<string>;
}
