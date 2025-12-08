import { Component, h, State, Watch } from '@stencil/core';

/**
 * Input Field with Completions
 */
@Component({
    tag: 'limel-example-input-field-autocomplete',
    shadow: true,
})
export class InputFieldAutocompleteExample {
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
            <limel-input-field
                label="Autocomplete"
                value={this.value}
                completions={this.completions}
                required={this.required}
                invalid={this.invalid}
                disabled={this.disabled}
                readonly={this.readonly}
                onChange={this.handleChange}
            />,
            <limel-example-controls>
                <limel-switch
                    value={this.disabled}
                    label="Disabled"
                    onChange={this.setDisabled}
                />
                <limel-switch
                    value={this.readonly}
                    label="Readonly"
                    onChange={this.setReadonly}
                />
                <limel-switch
                    value={this.required}
                    label="Required"
                    onChange={this.setRequired}
                />
            </limel-example-controls>,
            <limel-example-value value={this.value} />,
        ];
    }

    @Watch('required')
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
