const h = window.LimeElements.h;

class InputFieldAutocompleteExample {
    constructor() {
        this.required = false;
        this.disabled = false;
        this.completions = [
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
    }
    render() {
        return [
            h("limel-flex-container", { justify: "end" },
                h("limel-button", { onClick: () => {
                        this.disabled = !this.disabled;
                    }, label: this.disabled ? 'Enable' : 'Disable' }),
                h("limel-button", { onClick: () => {
                        this.required = !this.required;
                    }, label: this.required ? 'Set optional' : 'Set required' })),
            h("limel-input-field", { label: "Autocomplete", disabled: this.disabled, completions: this.completions, required: this.required, value: this.value, onChange: event => {
                    this.value = event.detail;
                } }),
            h("div", { class: "test-output" },
                "Value: ",
                this.value),
        ];
    }
    static get is() { return "limel-example-input-field-autocomplete"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "completions": {
            "state": true
        },
        "disabled": {
            "state": true
        },
        "required": {
            "state": true
        },
        "value": {
            "state": true
        }
    }; }
}

export { InputFieldAutocompleteExample as LimelExampleInputFieldAutocomplete };
