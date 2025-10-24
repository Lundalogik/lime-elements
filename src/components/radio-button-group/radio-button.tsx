import { Component, Host, Prop, h } from '@stencil/core';

/**
 * This is a low-level private component that renders individual radio button elements.
 * It's used internally by the list-item component to render radio buttons when
 * `type="radio"` is specified.
 *
 * ## Usage in the Library
 *
 * This template is primarily used by:
 * - `limel-list` component when `type="radio"`
 * - `limel-radio-button-group` component (which wraps `limel-list`)
 *
 * ## Why This Exists
 *
 * While we have `limel-radio-button-group` for most use cases, this template provides
 * the actual radio button HTML structure with proper MDC classes and accessibility
 * attributes. It ensures consistent styling and behavior across all radio button
 * implementations in the library.
 *
 * ## Design Philosophy
 *
 * This follows the principle that individual radio buttons should not be standalone
 * components, as a single radio button is never useful in a UI. Instead, this template
 * is used to build groups of radio buttons through higher-level components.
 *
 * However, since this is a private component, consumers who need to use a radio button
 * outside of the context of a list or group, can still use the `limel-radio-button`
 * component directly according to in their UI needs.
 *
 * @private
 */
@Component({
    tag: 'limel-radio-button',
    shadow: false,
    styleUrl: 'radio-button.scss',
})
export class RadioButtonComponent {
    /**
     * Indicates whether the radio button is checked.
     */
    @Prop({ reflect: true })
    public checked?: boolean;

    /**
     * Disables the radio button when set to `true`.
     */
    @Prop({ reflect: true })
    public disabled?: boolean;

    /**
     * Associates the internal input with an external label.
     */
    @Prop()
    public id!: string;

    /**
     * Visual label shown next to the radio button.
     */
    @Prop()
    public label?: string;

    /**
     * Change handler forwarded to the underlying input element.
     */
    @Prop()
    public onChange?: (event: Event) => void;

    public render() {
        return (
            <Host
                class={{
                    'boolean-input': true,
                    'radio-button': true,
                    checked: this.checked,
                    disabled: this.disabled,
                }}
            >
                <input
                    type="radio"
                    id={this.id}
                    checked={this.checked}
                    disabled={this.disabled}
                    onChange={this.onChange}
                />
                <div class="box" />
                <label class="boolean-input-label" htmlFor={this.id}>
                    {this.label}
                </label>
            </Host>
        );
    }
}
