import { Component, h, Prop, Watch } from '@stencil/core';
import { markdownToHTML } from './markdown-parser';
import { globalConfig } from '../../global/config';
import { CustomElementDefinition } from '../../global/shared-types/custom-element.types';
import { ImageIntersectionObserver } from './image-intersection-observer';

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
 * @exampleComponent limel-example-markdown-custom-component
 * @exampleComponent limel-example-markdown-remove-empty-paragraphs
 * @exampleComponent limel-example-markdown-composite
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
    public value: string = '';

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

    /**
     * Enable lazy loading for images
     */
    @Prop({ reflect: true })
    public lazyLoadImages = false;

    /**
     * Set to `false` to preserve empty paragraphs before rendering.
     * Empty paragraphs are paragraphs that do not contain
     * any meaningful content (text, images, etc.), or only contain
     * whitespace (`<br />` or `&nbsp;`).
     */
    @Prop({ reflect: true })
    public removeEmptyParagraphs = true;

    @Watch('value')
    public async textChanged() {
        try {
            this.cleanupImageIntersectionObserver();

            const html = await markdownToHTML(this.value, {
                forceHardLineBreaks: true,
                whitelist: this.whitelist ?? [],
                lazyLoadImages: this.lazyLoadImages,
                removeEmptyParagraphs: this.removeEmptyParagraphs,
            });

            this.rootElement.innerHTML = html;

            this.setupImageIntersectionObserver();
        } catch (error) {
            console.error(error);
        }
    }

    @Watch('removeEmptyParagraphs')
    public handleRemoveEmptyParagraphsChange() {
        return this.textChanged();
    }

    private rootElement: HTMLDivElement;
    private imageIntersectionObserver: ImageIntersectionObserver | null = null;

    public async componentDidLoad() {
        this.textChanged();
    }

    public disconnectedCallback() {
        this.cleanupImageIntersectionObserver();
    }

    public render() {
        return [
            <div
                id="markdown"
                ref={(el) => (this.rootElement = el as HTMLDivElement)}
            />,
        ];
    }

    private setupImageIntersectionObserver() {
        if (this.lazyLoadImages) {
            this.imageIntersectionObserver = new ImageIntersectionObserver(
                this.rootElement
            );
        }
    }

    private cleanupImageIntersectionObserver() {
        if (this.imageIntersectionObserver) {
            this.imageIntersectionObserver.disconnect();
            this.imageIntersectionObserver = null;
        }
    }
}
