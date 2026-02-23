import { Component, h, Prop, Watch, Host } from '@stencil/core';
import { markdownToHTML } from './markdown-parser';
import { globalConfig } from '../../global/config';
import { CustomElementDefinition } from '../../global/shared-types/custom-element.types';
import { ImageIntersectionObserver } from './image-intersection-observer';
import { hydrateCustomElements } from './hydrate-custom-elements';
import { DEFAULT_MARKDOWN_WHITELIST } from './default-whitelist';

/**
 * The Markdown component receives markdown syntax
 * and renders it as HTML.
 *
 * A built-in set of lime-elements components is whitelisted by default
 * and can be used directly in markdown content without any configuration.
 * Consumers can extend this list via the `whitelist` prop or `limel-config`.
 *
 * When custom elements use JSON attribute values, any URL-bearing
 * properties (`href`, `src`, `cite`, `longDesc`) are automatically
 * sanitized using the same protocol allowlists as rehype-sanitize.
 * URLs with dangerous schemes (e.g. `javascript:`, `data:`) are
 * removed (with a console warning) to prevent script injection.
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
 * @exampleComponent limel-example-markdown-custom-component-with-json-props
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
     * Additional whitelisted custom elements to render inside markdown.
     *
     * A built-in set of lime-elements components (such as `limel-chip`,
     * `limel-icon`, `limel-badge`, `limel-callout`, etc.) is always
     * allowed by default. Any entries provided here are **merged** with
     * those defaults — if both define the same `tagName`, their
     * attributes are combined.
     *
     * Can also be set via `limel-config`. Setting this property will
     * override the global config.
     *
     * JSON attribute values that contain URL-bearing properties
     * (`href`, `src`, `cite`, `longDesc`) are automatically sanitized
     * using the same protocol allowlists as rehype-sanitize. URLs with
     * dangerous schemes (e.g. `javascript:`, `data:`) are removed
     * (with a console warning).
     *
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

            // The whitelist merge and default import live here (not in
            // markdown-parser.ts) because this component orchestrates both
            // the parser and hydration, which both need the combined list.
            if (
                !this.cachedCombinedWhitelist ||
                this.whitelist !== this.cachedConsumerWhitelist
            ) {
                this.cachedConsumerWhitelist = this.whitelist;
                this.cachedCombinedWhitelist = mergeWhitelists(
                    DEFAULT_MARKDOWN_WHITELIST,
                    this.whitelist
                );
            }

            const combinedWhitelist = this.cachedCombinedWhitelist;

            const html = await markdownToHTML(this.value, {
                forceHardLineBreaks: true,
                whitelist: combinedWhitelist,
                lazyLoadImages: this.lazyLoadImages,
                removeEmptyParagraphs: this.removeEmptyParagraphs,
            });

            this.rootElement.innerHTML = html;

            // Hydration parses JSON attribute values (e.g. link='{"href":"..."}')
            // into JS properties. URL sanitization happens here because
            // rehype-sanitize can't inspect values inside JSON strings.
            hydrateCustomElements(this.rootElement, combinedWhitelist);

            this.setupImageIntersectionObserver();
        } catch (error) {
            console.error(error);
        }
    }

    @Watch('whitelist')
    public handleWhitelistChange() {
        return this.textChanged();
    }

    @Watch('removeEmptyParagraphs')
    public handleRemoveEmptyParagraphsChange() {
        return this.textChanged();
    }

    private rootElement: HTMLDivElement;
    private imageIntersectionObserver: ImageIntersectionObserver | null = null;
    private cachedConsumerWhitelist?: CustomElementDefinition[];
    private cachedCombinedWhitelist?: CustomElementDefinition[];

    public async componentDidLoad() {
        this.textChanged();
    }

    public disconnectedCallback() {
        this.cleanupImageIntersectionObserver();
    }

    public render() {
        return (
            <Host>
                <div
                    id="markdown"
                    ref={(el) => (this.rootElement = el as HTMLDivElement)}
                />
            </Host>
        );
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

/**
 * Merge the default whitelist with a consumer-provided one.
 * If both define the same tagName, their attributes are combined.
 * @param defaults
 * @param consumer
 */
function mergeWhitelists(
    defaults: CustomElementDefinition[],
    consumer?: CustomElementDefinition[]
): CustomElementDefinition[] {
    if (!consumer?.length) {
        return defaults.map((def) => ({
            ...def,
            attributes: [...def.attributes],
        }));
    }

    const merged = new Map<string, Set<string>>();

    for (const def of [...defaults, ...consumer]) {
        const existing = merged.get(def.tagName);
        if (existing) {
            for (const attr of def.attributes) {
                existing.add(attr);
            }
        } else {
            merged.set(def.tagName, new Set(def.attributes));
        }
    }

    return [...merged.entries()].map(([tagName, attrs]) => ({
        tagName,
        attributes: [...attrs],
    }));
}
