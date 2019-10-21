import { Component, h, State, Watch } from '@stencil/core';

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
    private invalid = false;

    @State()
    private formatNumber = true;

    @State()
    private value;

    constructor() {
        this.changeHandler = this.changeHandler.bind(this);
        this.toggleFormatting = this.toggleFormatting.bind(this);
        this.toggleEnabled = this.toggleEnabled.bind(this);
        this.toggleRequired = this.toggleRequired.bind(this);
    }

    public render() {
        return [
            <limel-input-field
                label="Number Field Label"
                value={this.value}
                type="number"
                formatNumber={this.formatNumber}
                disabled={this.disabled}
                invalid={this.invalid}
                required={this.required}
                onChange={this.changeHandler}
            />,
            <p>
                <limel-flex-container justify="end">
                    <limel-button
                        label={
                            this.formatNumber
                                ? 'Unformat number'
                                : 'Format number'
                        }
                        onClick={this.toggleFormatting}
                    />
                    <limel-button
                        label={this.disabled ? 'Enable' : 'Disable'}
                        onClick={this.toggleEnabled}
                    />
                    <limel-button
                        label={this.required ? 'Set optional' : 'Set required'}
                        onClick={this.toggleRequired}
                    />
                </limel-flex-container>
            </p>,
            <p>Value: {this.value}</p>,
        ];
    }

    @Watch('required')
    private checkValidity() {
        this.invalid = this.required && !this.value;
    }

    private changeHandler(event) {
        this.value = event.detail;
        this.checkValidity();
    }

    private toggleFormatting() {
        this.formatNumber = !this.formatNumber;
    }

    private toggleEnabled() {
        this.disabled = !this.disabled;
    }

    private toggleRequired() {
        this.required = !this.required;
    }
}
