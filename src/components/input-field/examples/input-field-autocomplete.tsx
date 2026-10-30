import { Component, h, State, Watch } from '@stencil/core';
import {
    Languages,
    LimelSelectCustomEvent,
    Option,
} from '@limetech/lime-elements';

/**
 * Input Field with Completions
 *
 * When the list of suggestions opens, a screen reader speaks how many there
 * are, and how to reach them. `language` sets the language of that message.
 * It is English unless you set it.
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
    private language: Languages = 'en';

    private readonly languages: Option[] = [
        { text: 'English', value: 'en' },
        { text: 'Svenska', value: 'sv' },
        { text: 'Dansk', value: 'da' },
        { text: 'Norsk', value: 'no' },
        { text: 'Suomi', value: 'fi' },
        { text: 'Deutsch', value: 'de' },
        { text: 'Français', value: 'fr' },
        { text: 'Nederlands', value: 'nl' },
    ];

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
                language={this.language}
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
                <limel-select
                    label="Language"
                    value={this.languages.find(
                        (option) => option.value === this.language
                    )}
                    options={this.languages}
                    onChange={this.setLanguage}
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

    private readonly setLanguage = (event: LimelSelectCustomEvent<Option>) => {
        event.stopPropagation();
        this.language = event.detail.value as Languages;
    };
}
