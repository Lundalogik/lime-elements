import { Component, Listen, Prop, State, Watch } from '@stencil/core';

@Component({
    tag: 'limel-example-text-field',
    shadow: true
})
export class TextFieldExample {

    @Prop({ mutable: true }) required: boolean = false;

    @State() disabled: boolean = false;
    @State() invalid: boolean = false;
    @State() value: any;

    @Listen('change')
    changeListen(event) {
        console.log('listen on value')
        this.value = event.detail;
        this.invalid = this.required && !this.value;
    }

    @Watch('required')
    watchRequired() {
        console.log('watch required')
        this.invalid = this.required && !this.value;
    }

    render() {
        return [
            <limel-button-group>
                <limel-button
                    onClick={() => this.disabled = !this.disabled}
                    label={this.disabled ? 'Enable' : 'Disable'} />
                <limel-button
                    onClick={() => this.required = !this.required}
                    label={this.required ? 'Set optional' : 'Set required'} />
            </limel-button-group>,
            <limel-text-field
                disabled={this.disabled}
                invalid={this.invalid}
                label='Text Field Label'
                required={this.required}
                value={this.value}/>,
            <span>Value: {this.value}</span>
        ];
    }
}
