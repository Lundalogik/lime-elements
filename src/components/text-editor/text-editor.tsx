import { Component, Event, EventEmitter, Prop, h } from '@stencil/core';
import { FormComponent } from '../form/form.types';
/**
 * A rich text editor that allows the user to input and format text
 * The `limel-text-editor` can be used as a form field
 *
 * @exampleComponent limel-example-text-editor-basic
 * @beta
 * @private
 */
@Component({
    tag: 'limel-text-editor',
    shadow: true,
    styleUrl: 'text-editor.scss',
})
export class TextEditor implements FormComponent<{ html: string }> {
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
     * Description of the text inside the editor
     */
    @Prop({ reflect: true })
    public value: { html: string };

    /**
     * Dispatched when a change is made to the editor
     */
    @Event()
    public change: EventEmitter<{ html: string }>;

    public render() {
        return (
            <limel-prosemirror-adapter
                onChange={this.handleChange}
                value={this.value}
            />
        );
    }

    private handleChange = () => (event: CustomEvent<{ html: string }>) => {
        event.stopPropagation();
        this.change.emit(event.detail);
    };
}
