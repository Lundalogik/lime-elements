const h = window.LimeElements.h;

class InputFieldTextExample {
    constructor() {
        this.required = false;
        this.disabled = false;
        this.invalid = false;
        this.checkValidity = this.checkValidity.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
        this.toggleEnabled = this.toggleEnabled.bind(this);
        this.toggleRequired = this.toggleRequired.bind(this);
    }
    render() {
        return [
            h("limel-input-field", { label: "Text Field", value: this.value, required: this.required, invalid: this.invalid, disabled: this.disabled, onChange: this.changeHandler }),
            h("p", null,
                h("limel-flex-container", { justify: "end" },
                    h("limel-button", { onClick: this.toggleEnabled, label: this.disabled ? 'Enable' : 'Disable' }),
                    h("limel-button", { onClick: this.toggleRequired, label: this.required ? 'Set Optional' : 'Set Required' }))),
            h("p", null,
                "Value: ",
                this.value),
        ];
    }
    checkValidity() {
        this.invalid = this.required && !this.value;
    }
    changeHandler(event) {
        this.value = event.detail;
        this.checkValidity();
    }
    toggleEnabled() {
        this.disabled = !this.disabled;
    }
    toggleRequired() {
        this.required = !this.required;
    }
    static get is() { return "limel-example-input-field-text"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
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

export { InputFieldTextExample as LimelExampleInputFieldText };
