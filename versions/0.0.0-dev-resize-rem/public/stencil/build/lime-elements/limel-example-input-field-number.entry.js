const h = window.LimeElements.h;

class InputFieldNumberExample {
    constructor() {
        this.required = false;
        this.disabled = false;
        this.invalid = false;
        this.formatNumber = true;
    }
    render() {
        return [
            h("section", null,
                h("limel-flex-container", { justify: "end" },
                    h("limel-button", { onClick: () => {
                            this.formatNumber = !this.formatNumber;
                        }, label: this.formatNumber
                            ? 'Unformat number'
                            : 'Format number' })),
                h("limel-flex-container", { justify: "end" },
                    h("limel-button", { onClick: () => {
                            this.disabled = !this.disabled;
                        }, label: this.disabled ? 'Enable' : 'Disable' }),
                    h("limel-button", { onClick: () => {
                            this.required = !this.required;
                        }, label: this.required ? 'Set optional' : 'Set required' })),
                h("limel-input-field", { label: "Number Field Label", value: this.value, onChange: event => {
                        this.changeHandler(event);
                    }, type: "number", formatNumber: this.formatNumber, disabled: this.disabled, invalid: this.invalid, required: this.required }),
                h("span", null,
                    "Value: ",
                    this.value)),
        ];
    }
    /*
     * `public`, `protected`, and `private` are just compiler hints
     * in TypeScript, and doesn't actually affect the compiled code
     * in any way. We can take advantage of this, because while
     * watchers are being called from outside the component by the
     * "framework" code, they should never be called by any outside
     * code we write ourselves. The `protected`-label ensures we
     * would get a compiler-error if we tried to call the function
     * from outside the component, while also *not* giving a compiler
     * error because the function isn't used internally (like `private`
     * would have done).
     */
    watchRequired() {
        console.log('watch required');
        this.invalid = this.required && !this.value;
    }
    changeHandler(event) {
        console.log('listen on value');
        this.value = event.detail;
        this.invalid = this.required && !this.value;
    }
    static get is() { return "limel-example-input-field-number"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "disabled": {
            "state": true
        },
        "formatNumber": {
            "state": true
        },
        "invalid": {
            "state": true
        },
        "required": {
            "type": Boolean,
            "attr": "required",
            "mutable": true,
            "watchCallbacks": ["watchRequired"]
        },
        "value": {
            "state": true
        }
    }; }
}

export { InputFieldNumberExample as LimelExampleInputFieldNumber };
