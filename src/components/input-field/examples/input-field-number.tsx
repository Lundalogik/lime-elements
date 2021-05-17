import { Component, h, State, Watch } from '@stencil/core';

/**
 * Input Field of Type Number
 */
@Component({
    tag: 'limel-example-input-field-number',
    shadow: true,
    styleUrl: 'input-field.scss',
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
    private value;

    public render() {
        return [
            <limel-input-field
                label="Number Field Label"
                value={this.value}
                type="number"
                formatNumber={this.formatNumber}
                disabled={this.disabled}
                readonly={this.readonly}
                invalid={this.invalid}
                required={this.required}
                onChange={this.changeHandler}
            />,
            <p>
                <limel-flex-container justify="end">
                    <limel-checkbox
                        checked={this.formatNumber}
                        label="Format value"
                        onChange={this.setFormatNumber}
                    />
                    <limel-checkbox
                        checked={this.disabled}
                        label="Disabled"
                        onChange={this.setDisabled}
                    />
                    <limel-checkbox
                        checked={this.readonly}
                        label="Readonly"
                        onChange={this.setReadonly}
                    />
                    <limel-checkbox
                        checked={this.required}
                        label="Required"
                        onChange={this.setRequired}
                    />
                </limel-flex-container>
            </p>,
            <limel-example-value value={this.value} />,
        ];
    }

    @Watch('required')
    private checkValidity() {
        this.invalid = this.required && !this.value;
    }

    private changeHandler = (event: CustomEvent<string>) => {
        this.value = event.detail;
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
}
