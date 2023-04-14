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
    private readonly = false;

    @State()
    private value: string;

    public render() {
        const MAX_LENGTH = 500;

        return [
            <limel-input-field
                label="Job description"
                type="textarea"
                placeholder="What is your dream job? Describe it here..."
                helperText="This text will be displayed in your profile"
                maxlength={MAX_LENGTH}
                value={this.value}
                required={this.required}
                onChange={this.handleChange}
                disabled={this.disabled}
                readonly={this.readonly}
            />,
            <limel-example-controls>
                <limel-checkbox onChange={this.setDisabled} label="Disabled" />
                <limel-checkbox onChange={this.setReadonly} label="Readonly" />
                <limel-checkbox onChange={this.setRequired} label="Required" />
            </limel-example-controls>,
            <limel-example-value value={this.value} />,
        ];
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
