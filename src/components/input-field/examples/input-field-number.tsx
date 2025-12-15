import { Component, h, Host, State, Watch } from '@stencil/core';

/**
 * Input Field of Type Number
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
    private value = '';

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
}
