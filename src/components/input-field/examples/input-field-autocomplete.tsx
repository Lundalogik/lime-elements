import { Component, h, State, Watch } from '@stencil/core';

/**
 * Input Field with Completions
 */
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

    constructor() {
        this.checkValidity = this.checkValidity.bind(this);
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
                readonly={this.readonly}
                onChange={this.changeHandler}
            />,
            <p>
                <limel-flex-container justify="end">
                    <limel-checkbox
                        checked={this.disabled}
                        label="Disabled"
                        onChange={this.setDisabled}
                    />
                    <limel-checkbox
                        checked={this.readonly}
                        label="Readonly"
                        onChange={this.setReadonly}
                    />
                    <limel-checkbox
                        checked={this.required}
                        label="Required"
                        onChange={this.setRequired}
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
