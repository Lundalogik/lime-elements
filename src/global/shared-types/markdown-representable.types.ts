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
     */
    toMarkdown(): Promise<string>;
}
