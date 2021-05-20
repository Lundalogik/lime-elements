import { Component, h, State } from '@stencil/core';

/**
 * Input Field of Type Textarea
 */
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
    private readonly = false;

    @State()
    private value: string;

    public render() {
        const MAX_LENGTH = 500;

        return [
            <limel-input-field
                label="Message"
                type="textarea"
                helperText="Please enter a useful message!"
                maxlength={MAX_LENGTH}
                value={this.value}
                required={this.required}
                onChange={this.changeHandler}
                disabled={this.disabled}
                readonly={this.readonly}
            />,
            <p>
                <limel-flex-container justify="end">
                    <limel-checkbox
                        onChange={this.setDisabled}
                        label="Disabled"
                    />
                    <limel-checkbox
                        onChange={this.setReadonly}
                        label="Readonly"
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

    private changeHandler = (event: CustomEvent<string>) => {
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
