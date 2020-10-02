import { Component, h, State, Watch } from '@stencil/core';

@Component({
    tag: 'limel-example-input-field-autocomplete',
    shadow: true,
    styleUrl: 'input-field.scss',
})
export class InputFieldAutocompleteExample {
    @State()
    private required = false;

    @State()
    private disabled = false;

    @State()
    private invalid = false;

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

    constructor() {
        this.checkValidity = this.checkValidity.bind(this);
        this.onChange = this.onChange.bind(this);
        this.toggleEnabled = this.toggleEnabled.bind(this);
        this.toggleRequired = this.toggleRequired.bind(this);
    }

    public render() {
        return [
            <limel-input-field
                label="Autocomplete"
                value={this.value}
                completions={this.completions}
                required={this.required}
                invalid={this.invalid}
                disabled={this.disabled}
                onChange={this.onChange}
            />,
            <p>
                <limel-flex-container justify="end">
                    <limel-button
                        label={this.disabled ? 'Enable' : 'Disable'}
                        onClick={this.toggleEnabled}
                    />
                    <limel-button
                        label={this.required ? 'Set Optional' : 'Set Required'}
                        onClick={this.toggleRequired}
                    />
                </limel-flex-container>
            </p>,
            <limel-example-value value={this.value} />,
        ];
    }

    @Watch('required')
    private checkValidity() {
        this.invalid = this.required && !this.value;
    }

    private onChange(event) {
        this.value = event.detail;
    }

    private toggleEnabled() {
        this.disabled = !this.disabled;
    }

    private toggleRequired() {
        this.required = !this.required;
    }
}
