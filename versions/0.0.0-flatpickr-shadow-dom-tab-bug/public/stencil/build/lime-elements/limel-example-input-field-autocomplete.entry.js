const h = window.LimeElements.h;

class InputFieldAutocompleteExample {
    constructor() {
        this.required = false;
        this.disabled = false;
        this.invalid = false;
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
        this.checkValidity = this.checkValidity.bind(this);
        this.onChange = this.onChange.bind(this);
        this.toggleEnabled = this.toggleEnabled.bind(this);
        this.toggleRequired = this.toggleRequired.bind(this);
    }
    render() {
        return [
            h("limel-input-field", { label: "Autocomplete", value: this.value, completions: this.completions, required: this.required, invalid: this.invalid, disabled: this.disabled, onChange: this.onChange }),
            h("p", null,
                h("limel-flex-container", { justify: "end" },
                    h("limel-button", { label: this.disabled ? 'Enable' : 'Disable', onClick: this.toggleEnabled }),
                    h("limel-button", { label: this.required ? 'Set Optional' : 'Set Required', onClick: this.toggleRequired }))),
            h("p", null,
                "Value: ",
                this.value),
        ];
    }
    checkValidity() {
        this.invalid = this.required && !this.value;
    }
    onChange(event) {
        this.value = event.detail;
    }
    toggleEnabled() {
        this.disabled = !this.disabled;
    }
    toggleRequired() {
        this.required = !this.required;
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
        "invalid": {
            "state": true
        },
        "required": {
            "state": true,
            "watchCallbacks": ["checkValidity"]
        },
        "value": {
            "state": true
        }
    }; }
    static get style() { return "p {\n  font-size: small;\n}"; }
}

export { InputFieldAutocompleteExample as LimelExampleInputFieldAutocomplete };
