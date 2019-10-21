import { r as registerInstance, h } from './core-804afdbc.js';

const SelectMultipleExample = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.value = [];
        this.disabled = false;
        this.required = false;
        this.options = [
            { text: 'Luke Skywalker', value: 'luke' },
            { text: 'Han Solo', value: 'han' },
            { text: 'Leia Organo', value: 'leia' },
        ];
        this.onChange = this.onChange.bind(this);
        this.toggleEnabled = this.toggleEnabled.bind(this);
        this.toggleRequired = this.toggleRequired.bind(this);
    }
    render() {
        return (h("section", null, h("limel-select", { label: "Favorite heroes", value: this.value, options: this.options, disabled: this.disabled, required: this.required, onChange: this.onChange, multiple: true }), h("p", null, h("limel-flex-container", { justify: "end" }, h("limel-checkbox", { label: "Disabled", onChange: this.toggleEnabled, checked: this.disabled }), h("limel-checkbox", { label: "Required", onChange: this.toggleRequired, checked: this.required }))), h("p", null, "Value: ", JSON.stringify(this.value))));
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
    static get style() { return "p {\n  font-size: small;\n}"; }
};

export { SelectMultipleExample as limel_example_select_multiple };
