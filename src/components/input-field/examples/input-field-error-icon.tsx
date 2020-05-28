import { Component, h, State } from '@stencil/core';
const MIN_LENGTH = 6;

@Component({
    tag: 'limel-example-input-field-error-icon',
    shadow: true,
})
export class InputFieldErrorIconExample {
    @State()
    private valueNative: string;

    @State()
    private valueConsumer: string;

    constructor() {
        this.onChangeNative = this.onChangeNative.bind(this);
        this.onChangeConsumer = this.onChangeConsumer.bind(this);
        this.isInvalid = this.isInvalid.bind(this);
    }

    public render() {
        return [
            <limel-input-field
                label="Text Field with native validation"
                minlength={MIN_LENGTH}
                helperText="Please enter at least 6 characters!"
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

    private onChangeNative(event: CustomEvent<string>) {
        this.valueNative = event.detail;
    }
    private onChangeConsumer(event: CustomEvent<string>) {
        this.valueConsumer = event.detail;
    }

    private isInvalid() {
        const substringLength = 9;
        return !!(
            this.valueConsumer &&
            this.valueConsumer.substr(-substringLength, substringLength) !==
                '@test.com'
        );
    }
}
