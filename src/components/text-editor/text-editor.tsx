import { Component, Event, EventEmitter, Host, Prop, h } from '@stencil/core';
import { FormComponent } from '../form/form.types';
import { createRandomString } from 'src/util/random-string';
/**
 * A rich text editor that offers a rich text editing experience with markdown support,
 * in the sense that you can easily type markdown syntax and see the rendered
 * result as rich text in real-time. For instance, you can type `# Hello, world!`
 * and see it directly turning to a heading 1 (an `<h1>` HTML element).
 *
 * Naturally, you can use standard keyboard hotkeys such as <kbd>Ctrl</kbd> + <kbd>B</kbd>
 * to toggle bold text, <kbd>Ctrl</kbd> + <kbd>I</kbd> to toggle italic text, and so on.
 *
 * @exampleComponent limel-example-text-editor-basic
 * @exampleComponent limel-example-text-editor-as-form-component
 * @exampleComponent limel-example-text-editor-composite
 * @exampleComponent limel-example-text-editor-with-markdown
 * @exampleComponent limel-example-text-editor-with-html
 * @exampleComponent limel-example-text-editor-height
 * @beta
 * @private
 */
@Component({
    tag: 'limel-text-editor',
    shadow: true,
    styleUrl: 'text-editor.scss',
})
export class TextEditor implements FormComponent<string> {
    /** The type of content that the editor should handle and emit, defaults to `markdown`
     *
     * Assumed to be set only once, so not reactive to changes
     */
    @Prop()
    public contentType: 'markdown' | 'html' = 'markdown';

    /**
     * Set to `true` to disable the field.
     * Use `disabled` to indicate that the field can normally be interacted
     * with, but is currently disabled. This tells the user that if certain
     * requirements are met, the field may become enabled again.
     */
    @Prop({ reflect: true })
    public disabled?: boolean;

    /**
     * Set to `true` to make the component read-only.
     * Use `readonly` when the field is only there to present the data it holds,
     * and will not become possible for the current user to edit.
     * :::note
     * Consider that it might be better to use `limel-markdown`
     * instead of `limel-text-editor` when the goal is visualizing data.
     * :::
     */
    @Prop({ reflect: true })
    public readonly?: boolean = false;

    /**
     * Optional helper text to display below the input field when it has focus
     */
    @Prop({ reflect: true })
    public helperText?: string;

    /**
     * The placeholder text shown inside the input field,
     * when the field is empty.
     */
    @Prop({ reflect: true })
    public placeholder?: string;

    /**
     * The label of the editor
     */
    @Prop({ reflect: true })
    public label?: string;

    /**
     * Set to `true` to indicate that the current value of the editor is
     * invalid.
     */
    @Prop({ reflect: true })
    public invalid?: boolean = false;

    /**
     * Description of the text inside the editor as markdown
     */
    @Prop({ reflect: true })
    public value: string;

    /**
     * Dispatched when a change is made to the editor
     */
    @Event()
    public change: EventEmitter<string>;

    private helperTextId: string;
    private editorId: string;

    public constructor() {
        this.helperTextId = createRandomString();
        this.editorId = createRandomString();
    }

    public render() {
        return (
            <Host
                class={{
                    'has-helper-text': !!this.helperText,
                }}
            >
                <span class="notched-outline">
                    <span class="leading-outline" />
                    {this.renderLabel()}
                    <span class="trailing-outline" />
                </span>
                {this.renderEditor()}
            </Host>
        );
    }

    private renderEditor() {
        if (this.readonly && !this.value) {
            return [
                <span class="lime-looks-like-input-value">–</span>,
                this.renderHelperLine(),
            ];
        }

        if (this.readonly) {
            return [
                <limel-markdown
                    value={this.value}
                    aria-controls={this.helperTextId}
                    id={this.editorId}
                />,
                this.renderPlaceholder(),
                this.renderHelperLine(),
            ];
        }

        return [
            <limel-prosemirror-adapter
                aria-placeholder={this.placeholder}
                contentType={this.contentType}
                onChange={this.handleChange}
                value={this.value}
                aria-controls={this.helperTextId}
                id={this.editorId}
            />,
            this.renderPlaceholder(),
            this.renderHelperLine(),
        ];
    }

    private renderLabel() {
        if (!this.label) {
            return;
        }

        return (
            <span class="notch">
                <label htmlFor={this.editorId}>{this.label}</label>
            </span>
        );
    }

    private renderPlaceholder() {
        if (!this.placeholder || this.value) {
            return;
        }

        return (
            <span class="placeholder" aria-hidden="true">
                {this.placeholder}
            </span>
        );
    }

    private renderHelperLine = () => {
        if (!this.helperText) {
            return;
        }

        return (
            <limel-helper-line
                helperText={this.helperText}
                helperTextId={this.helperTextId}
                invalid={this.isInvalid()}
            />
        );
    };

    private isInvalid = () => {
        if (this.readonly) {
            // A readonly field can never be invalid.
            return false;
        }

        if (this.invalid) {
            return true;
        }
    };

    private handleChange = () => (event: CustomEvent<string>) => {
        event.stopPropagation();
        this.change.emit(event.detail);
    };
}
