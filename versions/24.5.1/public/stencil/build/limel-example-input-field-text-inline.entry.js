import { r as registerInstance, h } from './core-804afdbc.js';

const InputFieldTextExample = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.firstOnChange = this.firstOnChange.bind(this);
        this.secondOnChange = this.secondOnChange.bind(this);
    }
    render() {
        return (h("section", null, h("limel-input-field", { label: "First Field", value: this.firstValue, onChange: this.firstOnChange }), h("limel-input-field", { label: "Second Field", value: this.secondValue, onChange: this.secondOnChange })));
    }
    firstOnChange(event) {
        this.firstValue = event.detail;
    }
    secondOnChange(event) {
        this.secondValue = event.detail;
    }
    static get style() { return "p {\n  font-size: small;\n}\n\nsection {\n  position: relative;\n}\nsection limel-input-field {\n  display: inline-block;\n  width: calc(50% - .625rem);\n}\nsection limel-input-field:first-of-type {\n  margin-right: 1.25rem;\n}"; }
};

export { InputFieldTextExample as limel_example_input_field_text_inline };
