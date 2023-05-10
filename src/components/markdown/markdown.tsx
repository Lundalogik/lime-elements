import { Component, h, Prop, Watch } from '@stencil/core';
import { markdownToHTML } from './markdown-parser';

/**
 * The Markdown component receives markdown syntax
 * and renders it as HTML.
 * @exampleComponent limel-example-markdown-headings
 * @exampleComponent limel-example-markdown-emphasis
 * @exampleComponent limel-example-markdown-lists
 * @exampleComponent limel-example-markdown-links
 * @exampleComponent limel-example-markdown-images
 * @exampleComponent limel-example-markdown-code
 * @exampleComponent limel-example-markdown-footnotes
 * @exampleComponent limel-example-markdown-tables
 * @exampleComponent limel-example-markdown-html
 * @exampleComponent limel-example-markdown-blockquotes
 * @exampleComponent limel-example-markdown-horizontal-rule
 */
@Component({
    tag: 'limel-markdown',
    styleUrl: 'markdown.scss',
    shadow: true,
})
export class Markdown {
    /**
     * The input text. Treated as GitHub Flavored Markdown, with the addition
     * that any included HTML will be parsed and rendered as HTML, rather than
     * as text.
     */
    @Prop()
    public value: string;

    @Watch('value')
    public async textChanged() {
        try {
            const html = await markdownToHTML(this.value, {
                forceHardLineBreaks: true,
            });
            this.rootElement.innerHTML = html;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }
    }

    public async componentDidLoad() {
        this.textChanged();
    }

    private rootElement: HTMLDivElement;

    public render() {
        return [
            <div
                id="markdown"
                ref={(el) => (this.rootElement = el as HTMLDivElement)}
            />,
        ];
    }
}
