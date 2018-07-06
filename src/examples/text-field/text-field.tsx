import { Component, Listen, Prop, State, Watch } from '@stencil/core';

@Component({
    shadow: true,
    tag: 'limel-example-text-field',
})
export class TextFieldExample {
    @Prop({ mutable: true })
    public required: boolean = false;

    @State() public disabled: boolean = false;
    @State() public invalid: boolean = false;
    @State() public value: any;

    @Listen('change')
    public changeListen(event) {
        console.log('listen on value');
        this.value = event.detail;
        this.invalid = this.required && !this.value;
    }

    @Watch('required')
    public watchRequired() {
        console.log('watch required');
        this.invalid = this.required && !this.value;
    }

    public render() {
        return [
            <limel-button-group>
                <limel-button
                    onClick={() => {
                        this.disabled = !this.disabled;
                    }}
                    label={this.disabled ? 'Enable' : 'Disable'}
                />
                <limel-button
                    onClick={() => {
                        this.required = !this.required;
                    }}
                    label={this.required ? 'Set optional' : 'Set required'}
                />
            </limel-button-group>,
            <limel-text-field
                disabled={this.disabled}
                invalid={this.invalid}
                label="Text Field Label"
                required={this.required}
                value={this.value}
            />,
            <span>Value: {this.value}</span>,
        ];
    }
}
