import { Component, Host, Prop, h } from '@stencil/core';

/**
 * This is an internal and private component that many input fields
 * use to display a helper text, along with a character counter below the
 * input field.
 *
 * We created this to keep the visual styles the same everywhere
 * and to avoid importing styles separately.
 *
 * Also this enables us to open the helper line in limel-portal,
 * more easily without having to send the styles to the portal.
 *
 * :::note
 * When the component has no content, it will get a `display: none`
 * as styles to avoid creating empty holes in the UI of the parent component.
 * For example, in a `flex` or `grid` component that has a `gap`,
 * we don't want the empty `limel-helper-line` to render and cause unnecessary
 * gaps in the UI.
 * However, to be more resourceful, the parent component can choose not
 * to render the helper-line as well.
 * :::
 *
 * @exampleComponent limel-example-helper-line
 * @exampleComponent limel-example-helper-line-invalid
 * @exampleComponent limel-example-helper-line-long-text
 * @exampleComponent limel-example-helper-line-long-text-no-counter
 * @exampleComponent limel-example-helper-line-character-counter
 * @private
 */
@Component({
    tag: 'limel-helper-line',
    shadow: true,
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
                    show: this.hasContent(),
                }}
                aria-hidden={!this.hasContent()}
            >
                {this.renderHelperText()}
                {this.renderCharacterCounter()}
            </Host>
        );
    }

    private hasContent = () => {
        if (
            this.maxLength ||
            this.helperText.length > 0 ||
            this.helperText !== null ||
            this.helperText !== undefined
        ) {
            return true;
        }
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
        const counter = `${this.length} / ${this.maxLength}`;

        if (!this.maxLength) {
            return;
        }

        return <span class="counter">{counter}</span>;
    };
}
