import { Component, h, State } from '@stencil/core';

@Component({
    tag: 'limel-example-input-field-textarea',
    shadow: true,
    styleUrl: 'input-field.scss',
})
export class InputFieldTextareaExample {
    @State()
    private required = false;

    @State()
    private disabled = false;

    @State()
    private value: string;

    constructor() {
        this.changeHandler = this.changeHandler.bind(this);
        this.toggleEnabled = this.toggleEnabled.bind(this);
        this.toggleRequired = this.toggleRequired.bind(this);
    }

    public render() {
        const MAX_LENGTH = 240;

        return [
            <limel-input-field
                label="Message"
                type="textarea"
                helperText="Please enter a useful message!"
                maxlength={MAX_LENGTH}
                value={this.value}
                required={this.required}
                disabled={this.disabled}
                onChange={this.changeHandler}
            />,
            <p>
                <limel-flex-container justify="end">
                    <limel-checkbox
                        onClick={this.toggleEnabled}
                        label="Enabled"
                    />
                    <limel-checkbox
                        onClick={this.toggleRequired}
                        label="Required"
                    />
                </limel-flex-container>
            </p>,
            <p>Value: {this.value}</p>,
        ];
    }

    private changeHandler(event) {
        this.value = event.detail;
    }

    private toggleEnabled() {
        this.disabled = !this.disabled;
    }

    private toggleRequired() {
        this.required = !this.required;
    }
}
