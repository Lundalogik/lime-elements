import { Component, h, State, Watch } from '@stencil/core';

/**
 * Input Field of Type Text
 */
@Component({
    tag: 'limel-example-input-field-text',
    shadow: true,
})
export class InputFieldTextExample {
    @State()
    private required = false;

    @State()
    private disabled = false;

    @State()
    private readonly = false;

    @State()
    private invalid = false;

    @State()
    private value: string;

    public render() {
        const MAX_LENGTH = 15;

        return [
            <limel-input-field
                label="Text Field"
                helperText="Please enter a useful message!"
                maxlength={MAX_LENGTH}
                value={this.value}
                required={this.required}
                invalid={this.invalid}
                disabled={this.disabled}
                readonly={this.readonly}
                onChange={this.handleChange}
            />,
            <limel-example-controls>
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
            </limel-example-controls>,
            <limel-example-value value={this.value} />,
        ];
    }

    @Watch('required')
    @Watch('value')
    protected checkValidity() {
        this.invalid = this.required && !this.value;
    }

    private handleChange = (event: CustomEvent<string>) => {
        this.value = event.detail;
    };

    private setDisabled = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
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
