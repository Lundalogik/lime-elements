/**
 * Implemented by a custom element that can describe itself in markdown,
 * for a target that cannot render the element — the clipboard, say.
 *
 * When asked for its own `toMarkdown()`, `limel-markdown` calls this on
 * a fresh copy of every whitelisted element in its value.
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
     * markup, not the one on screen. The copy is connected, hidden, for
     * as long as this takes, so connecting must have no effect beyond
     * the element itself — no events the page acts on, no writes.
     */
    toMarkdown(): Promise<string>;
}
