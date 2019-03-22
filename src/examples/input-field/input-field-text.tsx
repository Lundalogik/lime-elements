import { Component, State, Watch } from '@stencil/core';

@Component({
    tag: 'limel-example-input-field-text',
    shadow: true,
    styleUrl: 'input-field.scss',
})
export class InputFieldTextExample {
    @State()
    private required = false;

    @State()
    private disabled = false;

    @State()
    private invalid = false;

    @State()
    private value;

    constructor() {
        this.checkValidity = this.checkValidity.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
        this.toggleEnabled = this.toggleEnabled.bind(this);
        this.toggleRequired = this.toggleRequired.bind(this);
    }

    public render() {
        return [
            <limel-input-field
                label="Text Field"
                value={this.value}
                required={this.required}
                invalid={this.invalid}
                disabled={this.disabled}
                onChange={this.changeHandler}
            />,
            <p>
                <limel-flex-container justify="end">
                    <limel-button
                        onClick={this.toggleEnabled}
                        label={this.disabled ? 'Enable' : 'Disable'}
                    />
                    <limel-button
                        onClick={this.toggleRequired}
                        label={this.required ? 'Set Optional' : 'Set Required'}
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

    private toggleEnabled() {
        this.disabled = !this.disabled;
    }

    private toggleRequired() {
        this.required = !this.required;
    }
}
