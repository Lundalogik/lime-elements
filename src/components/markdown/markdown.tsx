import { Component, h, Prop, Watch } from '@stencil/core';
import { markdownToHTML } from './markdown-parser';
import { globalConfig } from '../../global/config';
import { CustomElementDefinition } from '../../global/shared-types/custom-element.types';

/**
 * The Markdown component receives markdown syntax
 * and renders it as HTML.
 *
 * @exampleComponent limel-example-markdown-headings
 * @exampleComponent limel-example-markdown-emphasis
 * @exampleComponent limel-example-markdown-lists
 * @exampleComponent limel-example-markdown-links
 * @exampleComponent limel-example-markdown-images
 * @exampleComponent limel-example-markdown-code
 * @exampleComponent limel-example-markdown-footnotes
 * @exampleComponent limel-example-markdown-tables
 * @exampleComponent limel-example-markdown-html
 * @exampleComponent limel-example-markdown-keys
 * @exampleComponent limel-example-markdown-blockquotes
 * @exampleComponent limel-example-markdown-horizontal-rule
 * @exampleComponent limel-example-markdown-composite
 * @exampleComponent limel-example-markdown-custom-component
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

    /**
     * Whitelisted html elements.
     *
     * Any custom element added here will not be sanitized and thus rendered.
     * Can also be set via `limel-config`. Setting this property will override
     * the global config.
     * @alpha
     */
    @Prop()
    public whitelist?: CustomElementDefinition[] =
        globalConfig.markdownWhitelist;

    @Watch('value')
    public async textChanged() {
        try {
            const html = await markdownToHTML(this.value, {
                forceHardLineBreaks: true,
                whitelist: this.whitelist ?? [],
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
