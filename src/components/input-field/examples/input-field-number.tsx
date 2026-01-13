import { Component, h, Host, State, Watch } from '@stencil/core';
import { LimelSelectCustomEvent, Option } from '@limetech/lime-elements';

/**
 * Input Field of Type Number
 *
 * The `number` type creates a numeric input field that only accepts numerical values.
 * It provides built-in validation to ensure only valid numbers can be entered.
 *
 * **The `step` prop**
 *
 * The `step` prop controls which numeric values are considered valid and determines
 * the increment/decrement behavior when using spinner controls or arrow keys:
 *
 * - `step={1}` - Only whole numbers are valid (1, 2, 3, ...)
 * - `step={0.1}` - Allows decimals with one decimal place (0.1, 0.2, 0.3, ...)
 * - `step='any'` - Allows any numeric value without restrictions (default)
 *
 * This prop determines which values users can enter or increment/decrement using UI controls.
 * Read more about [the `step` attribute in the MDN.](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/step)
 * ***
 *
 * **The `formatNumber` prop**
 *
 * The `formatNumber` prop controls how the number is displayed when the field is not focused.
 * When `true` (default), numbers are formatted according to the browser's locale (e.g., `1,234.56`).
 * When `false`, numbers are displayed in their raw form (e.g., `1234.56`).
 *
 * :::note
 * This prop only affects the visual presentation when the field is blurred.
 * It does not affect:
 * - The actual value stored or emitted by the component
 * - The `step` validation or increment/decrement behavior
 * - How the number appears when the field is focused (always shows raw input)
 * :::
 */
@Component({
    tag: 'limel-example-input-field-number',
    shadow: true,
})
export class InputFieldNumberExample {
    @State()
    private required = false;

    @State()
    private disabled = false;

    @State()
    private readonly = false;

    @State()
    private invalid = false;

    @State()
    private formatNumber = true;

    @State()
    private selectedStepOption: Option = { text: 'any', value: 'any' };

    @State()
    private value = '';

    private get stepValue(): number | 'any' {
        const val = this.selectedStepOption?.value;
        return val === 'any' ? 'any' : +val;
    }

    public render() {
        return (
            <Host>
                <limel-input-field
                    label="Number Field Label"
                    value={this.value}
                    type="number"
                    formatNumber={this.formatNumber}
                    disabled={this.disabled}
                    readonly={this.readonly}
                    invalid={this.invalid}
                    required={this.required}
                    onChange={this.handleChange}
                    step={this.stepValue}
                />
                <limel-example-controls>
                    <limel-switch
                        value={this.formatNumber}
                        label="Format value"
                        onChange={this.setFormatNumber}
                    />
                    <limel-switch
                        value={this.disabled}
                        label="Disabled"
                        onChange={this.setDisabled}
                    />
                    <limel-switch
                        value={this.readonly}
                        label="Readonly"
                        onChange={this.setReadonly}
                    />
                    <limel-switch
                        value={this.required}
                        label="Required"
                        onChange={this.setRequired}
                    />
                    <limel-select
                        label="Step"
                        value={this.selectedStepOption}
                        onChange={this.handleStepChange}
                        options={[
                            { text: 'any', value: 'any' },
                            { text: '0.01', value: '0.01' },
                            { text: '0.1', value: '0.1' },
                            { text: '0.2', value: '0.2' },
                            { text: '0.5', value: '0.5' },
                            { text: '1', value: '1' },
                            { text: '2', value: '2' },
                            { text: '5', value: '5' },
                            { text: '10', value: '10' },
                        ]}
                    />
                </limel-example-controls>
                <limel-example-value value={this.value} />
            </Host>
        );
    }

    @Watch('required')
    private checkValidity() {
        this.invalid = this.required && !this.value;
    }

    private handleChange = (event: CustomEvent<string | number>) => {
        this.value = event.detail + '';
        this.checkValidity();
    };

    private setFormatNumber = (event: CustomEvent<boolean>) => {
        this.formatNumber = event.detail;
    };

    private setDisabled = (event: CustomEvent<boolean>) => {
        this.disabled = event.detail;
    };

    private setReadonly = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.readonly = event.detail;
    };

    private setRequired = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.required = event.detail;
    };

    private handleStepChange = (event: LimelSelectCustomEvent<Option>) => {
        this.selectedStepOption = event.detail;
    };
}
