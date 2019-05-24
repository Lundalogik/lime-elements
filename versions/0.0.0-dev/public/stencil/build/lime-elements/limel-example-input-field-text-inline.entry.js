const h = window.LimeElements.h;

class InputFieldTextExample {
    constructor() {
        this.firstOnChange = this.firstOnChange.bind(this);
        this.secondOnChange = this.secondOnChange.bind(this);
    }
    render() {
        return (h("section", null,
            h("limel-input-field", { label: "First Field", value: this.firstValue, onChange: this.firstOnChange }),
            h("limel-input-field", { label: "Second Field", value: this.secondValue, onChange: this.secondOnChange })));
    }
    firstOnChange(event) {
        this.firstValue = event.detail;
    }
    secondOnChange(event) {
        this.secondValue = event.detail;
    }
    static get is() { return "limel-example-input-field-text-inline"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "firstValue": {
            "state": true
        },
        "secondValue": {
            "state": true
        }
    }; }
    static get style() { return "p {\n  font-size: small;\n}\n\nsection {\n  position: relative;\n}\nsection limel-input-field {\n  display: inline-block;\n  width: calc(50% - pxToRem(10));\n}\nsection limel-input-field:first-of-type {\n  margin-right: 1.25rem;\n}"; }
}

export { InputFieldTextExample as LimelExampleInputFieldTextInline };
