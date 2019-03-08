import { Component, State } from '@stencil/core';

@Component({
    tag: 'limel-example-input-field-autocomplete',
    shadow: true,
})
export class InputFieldAutocompleteExample {
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
            <limel-input-field
                label="Autocomplete"
                disabled={this.disabled}
                completions={this.completions}
                required={this.required}
                value={this.value}
                onChange={event => {
                    this.value = event.detail;
                }}
            />,
            <div class="test-output">Value: {this.value}</div>,
        ];
    }
}
