import { Component, h, State } from '@stencil/core';

const MIN_LENGTH = 6;

/**
 * Input Field with Error Icon
 */
@Component({
    tag: 'limel-example-input-field-error-icon',
    shadow: true,
})
export class InputFieldErrorIconExample {
    @State()
    private valueNative: string;

    @State()
    private valueConsumer: string;

    public render() {
        return [
            <limel-input-field
                label="Text Field with native validation"
                minlength={MIN_LENGTH}
                value={this.valueNative}
                onChange={this.onChangeNative}
            />,
            <limel-input-field
                label="Text Field with consumer validation"
                type={'email'}
                invalid={this.isInvalid()}
                helperText="Please enter an email with the domain 'test.com'"
                value={this.valueConsumer}
                onChange={this.onChangeConsumer}
            />,
        ];
    }

    private onChangeNative = (event: CustomEvent<string>) => {
        this.valueNative = event.detail;
    };

    private onChangeConsumer = (event: CustomEvent<string>) => {
        this.valueConsumer = event.detail;
    };

    private isInvalid = () => {
        return !!(
            this.valueConsumer && !this.valueConsumer.endsWith('@test.com')
        );
    };
}
