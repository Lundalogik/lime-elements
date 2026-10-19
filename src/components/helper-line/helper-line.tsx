import { Component, Host, Prop, h } from '@stencil/core';

/**
 * This is an internal and private component that many input fields
 * use to display a helper text, along with a character counter below the
 * input field.
 *
 * We created this to keep the visual styles the same everywhere
 * and to avoid importing styles separately.
 *
 * :::note
 * The component has `shadow: false`, so that the helper text is part of the
 * DOM of the consumer. This way, the `id` of the helper text can be used in
 * the `aria-describedby` of the input element in the consumer, which is
 * not possible across a shadow root.
 * :::
 *
 * @exampleComponent limel-example-helper-line-basic
 * @exampleComponent limel-example-helper-line-invalid
 * @exampleComponent limel-example-helper-line-long-text
 * @exampleComponent limel-example-helper-line-long-text-no-counter
 * @exampleComponent limel-example-helper-line-character-counter
 * @exampleComponent limel-example-helper-line-empty
 * @exampleComponent limel-example-helper-line-animation
 * @private
 */
@Component({
    tag: 'limel-helper-line',
    shadow: false,
    styleUrl: 'helper-line.scss',
})
export class HelperLine {
    /**
     * The helper text that is displayed on the left side.
     */
    @Prop({ reflect: true })
    public helperText?: string;

    /**
     * Length of the current input value, coming from the parent component.
     * Used in the character counter section on the right side.
     */
    @Prop({ reflect: true })
    public length?: number;

    /**
     * Maximum length of the characters, defined on the parent component.
     * Used in the character counter section on the right side.
     */
    @Prop({ reflect: true })
    public maxLength?: number;

    /**
     * Turns `true`, when the parent component is invalid.
     * For example, when the parent component is `required` but is left empty.
     * Or when the input format is invalid.
     */
    @Prop({ reflect: true })
    public invalid?: boolean = false;

    /**
     * Used by `aria-controls` and `aria-describedby` in the parent component.
     */
    @Prop({ reflect: true })
    public helperTextId?: string;

    public render() {
        return (
            <Host
                tabIndex={-1}
                class={{
                    invalid: this.invalid,
                }}
                style={this.hasContent() ? {} : { display: 'none' }}
                aria-hidden={!this.hasContent()}
            >
                <div>
                    {this.renderHelperText()}
                    {this.renderCharacterCounter()}
                </div>
            </Host>
        );
    }

    private hasContent = () => {
        return !!(
            this.maxLength > 0 ||
            (this.helperText && this.helperText.length > 0)
        );
    };

    private renderHelperText = () => {
        if (!this.helperText) {
            return;
        }

        return (
            <span class="helper-text" id={this.helperTextId}>
                {this.helperText}
            </span>
        );
    };

    private renderCharacterCounter = () => {
        if (!this.maxLength) {
            return;
        }

        const counter = `${this.length} / ${this.maxLength}`;

        return <span class="counter">{counter}</span>;
    };
}
