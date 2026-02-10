/**
 * This component renders markdown
 * @exampleComponent kompendium-example-markdown
 */
export declare class Markdown {
    /**
     * The text to render
     */
    text: string;
    private host;
    constructor();
    protected connectedCallback(): void;
    protected disconnectedCallback(): void;
    protected componentDidLoad(): void;
    protected componentDidUpdate(): void;
    private handleHashChange;
    private renderMarkdown;
    render(): HTMLElement;
}
