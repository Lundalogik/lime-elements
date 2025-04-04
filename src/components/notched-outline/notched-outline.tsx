import { Component, Prop, h } from '@stencil/core';

/**
 * This is a private component, used to render a notched outline
 * around all input elements that can have a floating label.
 * Inspired by Material Design's styles for input fields.
 * We use it in various components to unify styles and avoid
 * repeating code.
 *
 * :::important
 * Note that this component will render itself using `position: absolute;`
 * This is to:
 * 1. remain independent from the elements within the consumer component
 * 1. inherit its height and width from the consumer component and
 * visually appear to be wrapping around the elements.
 *
 * This means the consumer component should have proper layout strategies
 * for excluding the variable height of its `limel-helper-line`, ensuring that
 * the notched outline is not visually wrapping the helper line.
 *
 * Also, the `pointer-events: none;` style enables the consumer to
 * place this component as the top-most layer in the stacking context,
 * without affecting interactivity with elements below.
 * :::
 *
 * :::note
 * The component has `shadow: false`. This is to improve performance,
 * and ensure that its internal elements are considered as a internal elements
 * of the consumer's DOM. This way, the id of `<label for="id">` would
 * be correctly associated with the input element of the consumer.
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
     * labeled by this label, suing the `labelId` prop.
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
     * Set to `true` when the user has entered a value for the input element.
     * This applies proper visual styles, such as shrinking the label in size,
     * and visually rendering it above the entered value.
     */
    @Prop({ reflect: true })
    public hasValue = false;

    public render() {
        return [
            <slot name="content" />,
            <span class="limel-notched-outline">
                <span class="limel-notched-outline--leading-outline" />
                {this.renderLabel()}
                <span class="limel-notched-outline--trailing-outline" />
            </span>,
        ];
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
}
