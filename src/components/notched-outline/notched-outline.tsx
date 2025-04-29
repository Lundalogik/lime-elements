import { Component, Prop, h } from '@stencil/core';

/**
 * This is a private component, used to render a notched outline
 * around all input elements that can have a floating label.
 * Inspired by Material Design's styles for input fields.
 * We use it in various components to unify styles and avoid
 * repeating code.
 *
 * :::note
 * The component has `shadow: false`. This is to improve performance,
 * and ensure that its internal elements are considered as internal parts
 * of the consumer's DOM. This way, the value `for` in `<label for="id-of-input-element">`
 * would be correctly associated with the input element's `id`, in the consumer component.
 * :::
 * @exampleComponent limel-example-notched-outline-basic
 * @private
 */
@Component({
    tag: 'limel-notched-outline',
    styleUrl: 'notched-outline.scss',
    shadow: false,
})
export class NotchedOutline {
    /**
     * Set to `true` when the input element is required.
     * This applies proper visual styles, such as inclusion of an asterisk
     * beside the label.
     */
    @Prop({ reflect: true })
    public required = false;

    /**
     * Set to `true` when the input element is readonly.
     * This applies proper visual styles, such as making the outline transparent.
     */
    @Prop({ reflect: true })
    public readonly = false;

    /**
     * Set to `true` to indicate that the current value of the input element is
     * invalid. This applies proper visual styles, such as making the outlines red.
     */
    @Prop({ reflect: true })
    public invalid = false;

    /**
     * Set to `true` to indicate that the input element is
     * disabled. This applies proper visual styles, such as making the outlines
     * and the label transparent.
     */
    @Prop({ reflect: true })
    public disabled = false;

    /**
     * Label to display for the input element.
     * :::important
     * Note that the input element of the consumer component will be
     * labeled by this label, using the `labelId` prop.
     * :::
     */
    @Prop({ reflect: true })
    public label?: string;

    /**
     * The `id` of the input element which should be
     * labeled by the provided label.
     */
    @Prop({ reflect: true })
    public labelId?: string;

    /**
     * Set to `true` when the user has entered a value for the input element,
     * shrinking the label in size, and visually rendering it above the entered value.
     */
    @Prop({ reflect: true })
    public hasValue = false;

    /**
     * Set to `true` when the consumer element displays a leading icon.
     * This applies proper visual styles, such as rendering the label
     * correctly placed beside the leading icon.
     */
    @Prop({ reflect: true })
    public hasLeadingIcon = false;

    /**
     * Set to `true` when the consumer element needs to render the
     * label above the input element, despite existence of a `value`.
     * For example in the `text-editor` or `limel-select`,
     * where the default layout requires a floating label.
     */
    @Prop({ reflect: true })
    public hasFloatingLabel = false;

    public render() {
        return (
            <div class="limel-notched-outline">
                <slot name="content" />
                <span
                    class="limel-notched-outline--outlines"
                    aria-hidden="true"
                >
                    <span class="limel-notched-outline--leading-outline" />
                    {this.renderLabel()}
                    <span class="limel-notched-outline--trailing-outline" />
                    {this.renderEmptyReadonlyValue()}
                </span>
            </div>
        );
    }

    private renderLabel() {
        if (!this.label) {
            return;
        }

        return (
            <span class="limel-notched-outline--notch">
                <label htmlFor={this.labelId}>{this.label}</label>
            </span>
        );
    }

    private renderEmptyReadonlyValue() {
        if (!this.readonly || this.hasValue) {
            return;
        }

        return (
            <span
                class="limel-notched-outline--empty-readonly-value"
                aria-hidden="true"
            >
                –
            </span>
        );
    }
}
