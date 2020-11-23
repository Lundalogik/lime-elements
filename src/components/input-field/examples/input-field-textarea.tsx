import { Component, h, State } from '@stencil/core';

/**
 * Input Field of Type Textarea
 */
@Component({
    tag: 'limel-example-input-field-textarea',
    shadow: true,
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
        this.setEnabled = this.setEnabled.bind(this);
        this.setRequired = this.setRequired.bind(this);
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
                        onChange={this.setEnabled}
                        label="Disabled"
                    />
                    <limel-checkbox
                        onChange={this.setRequired}
                        label="Required"
                    />
                </limel-flex-container>
            </p>,
            <limel-example-value value={this.value} />,
        ];
    }

    private changeHandler(event) {
        this.value = event.detail;
    }

    private setEnabled(event: CustomEvent<boolean>) {
        event.stopPropagation();
        this.disabled = event.detail;
    }

    private setRequired(event: CustomEvent<boolean>) {
        event.stopPropagation();
        this.required = event.detail;
    }
}
