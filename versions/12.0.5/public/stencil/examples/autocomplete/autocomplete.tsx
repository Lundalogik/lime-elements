import { Component, Listen, State } from '@stencil/core';

@Component({
    tag: 'limel-example-autocomplete',
    shadow: true,
})
export class PickerExample {
    @State()
    private required: boolean = false;
    @State()
    private disabled: boolean = false;
    @State()
    private value: string;
    @State()
    private completions: string[] = [
        'Lundalogik AB',
        'Lundalogik AS',
        'SAAB AB',
        'Lundalogistik & Spedition AB',
        'Aftonbladet AB',
        'Expressen AB',
        'Swedbank',
        'Handelsbanken',
        'Väderstad',
    ];

    @Listen('autoCompleteChange')
    public handleChange(event) {
        this.value = event.detail;
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
            <limel-autocomplete
                label="Autocomplete"
                disabled={this.disabled}
                completions={this.completions}
                required={this.required}
                value={this.value}
            />,
            <div class="test-output">Value: {this.value}</div>,
        ];
    }
}
