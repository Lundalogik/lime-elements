import { r as registerInstance, h } from './core-804afdbc.js';

const InputFieldNumberExample = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.required = false;
        this.disabled = false;
        this.invalid = false;
        this.formatNumber = true;
        this.changeHandler = this.changeHandler.bind(this);
        this.toggleFormatting = this.toggleFormatting.bind(this);
        this.toggleEnabled = this.toggleEnabled.bind(this);
        this.toggleRequired = this.toggleRequired.bind(this);
    }
    render() {
        return [
            h("limel-input-field", { label: "Number Field Label", value: this.value, type: "number", formatNumber: this.formatNumber, disabled: this.disabled, invalid: this.invalid, required: this.required, onChange: this.changeHandler }),
            h("p", null, h("limel-flex-container", { justify: "end" }, h("limel-button", { label: this.formatNumber
                    ? 'Unformat number'
                    : 'Format number', onClick: this.toggleFormatting }), h("limel-button", { label: this.disabled ? 'Enable' : 'Disable', onClick: this.toggleEnabled }), h("limel-button", { label: this.required ? 'Set optional' : 'Set required', onClick: this.toggleRequired }))),
            h("p", null, "Value: ", this.value),
        ];
    }
    checkValidity() {
        this.invalid = this.required && !this.value;
    }
    changeHandler(event) {
        this.value = event.detail;
        this.checkValidity();
    }
    toggleFormatting() {
        this.formatNumber = !this.formatNumber;
    }
    toggleEnabled() {
        this.disabled = !this.disabled;
    }
    toggleRequired() {
        this.required = !this.required;
    }
    static get watchers() { return {
        "required": ["checkValidity"]
    }; }
    static get style() { return "p {\n  font-size: small;\n}"; }
};

export { InputFieldNumberExample as limel_example_input_field_number };
