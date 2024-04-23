import { Component, Event, EventEmitter, Prop, h } from '@stencil/core';
import { FormComponent } from '../form/form.types';
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
    public readonly?: boolean;

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
    public invalid?: boolean;

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

    public render() {
        return (
            <fieldset disabled={this.readonly || this.disabled}>
                {this.renderLabel()}
                {this.renderEditor()}
            </fieldset>
        );
    }

    private renderEditor() {
        if (this.readonly && !this.value) {
            return (
                <span class="lime-empty-value-for-readonly lime-looks-like-input-value">
                    –
                </span>
            );
        }

        if (this.readonly) {
            return <limel-markdown value={this.value} />;
        }

        return (
            <limel-prosemirror-adapter
                onChange={this.handleChange}
                value={this.value}
            />
        );
    }

    private renderLabel() {
        if (!this.label) {
            return;
        }

        return <legend>{this.label}</legend>;
    }

    private handleChange = () => (event: CustomEvent<string>) => {
        event.stopPropagation();
        this.change.emit(event.detail);
    };
}
