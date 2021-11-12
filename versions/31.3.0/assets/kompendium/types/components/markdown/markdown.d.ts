/**
 * This component renders markdown
 *
 * @exampleComponent kompendium-example-markdown
 */
export declare class Markdown {
    /**
     * The text to render
     */
    text: string;
    private host;
    protected componentDidLoad(): void;
    protected componentDidUpdate(): void;
    private renderMarkdown;
    render(): HTMLElement;
}
