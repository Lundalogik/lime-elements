import { Component, h, Prop, Watch, Event, EventEmitter } from '@stencil/core';
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
    @Prop()
    public lazyLoadImages = false;

    /**
     * Emitted when a task list checkbox is clicked.
     * The event detail contains the updated markdown text.
     */
    @Event()
    public taskListChange: EventEmitter<string>;

    @Watch('value')
    public async textChanged() {
        try {
            this.cleanupImageIntersectionObserver();

            const html = await markdownToHTML(this.value, {
                forceHardLineBreaks: true,
                whitelist: this.whitelist ?? [],
                lazyLoadImages: this.lazyLoadImages,
            });

            this.rootElement.innerHTML = html;

            this.setupImageIntersectionObserver();
            this.setupTaskListHandlers();
        } catch (error) {
            console.error(error);
        }
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
        return <div id="markdown" ref={(el) => (this.rootElement = el)} />;
    }

    private setupTaskListHandlers() {
        // Make task list checkboxes interactive and sync back to markdown
        const checkboxes = this.rootElement.querySelectorAll(
            '.task-list-item input[type="checkbox"]'
        );

        // Parse the current markdown to find task list items
        const lines = this.value.split('\n');
        let taskListIndex = 0;

        for (const checkbox of checkboxes) {
            const inputElement = checkbox as HTMLInputElement;
            const currentTaskIndex = taskListIndex++;

            inputElement.addEventListener('change', () => {
                // Find the corresponding line in the markdown
                let taskCounter = 0;

                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i];
                    // Match both checked and unchecked task list items
                    // Using a more specific regex to avoid backtracking issues
                    const taskListRegex = /^(\s*)- \[([x ])\] (.+)$/;
                    const taskListMatch = taskListRegex.exec(line);

                    if (taskListMatch) {
                        if (taskCounter === currentTaskIndex) {
                            // Update this line
                            const indent = taskListMatch[1];
                            const newState = inputElement.checked ? 'x' : ' ';
                            const text = taskListMatch[3];
                            lines[i] = `${indent}- [${newState}] ${text}`;

                            // Emit the updated markdown
                            const updatedMarkdown = lines.join('\n');
                            this.taskListChange.emit(updatedMarkdown);
                            break;
                        }
                        taskCounter++;
                    }
                }
            });
        }
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
