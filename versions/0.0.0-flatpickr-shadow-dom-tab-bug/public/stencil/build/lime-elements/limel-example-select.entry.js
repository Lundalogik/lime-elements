const h = window.LimeElements.h;

class SelectExample {
    constructor() {
        this.disabled = false;
        this.options = [
            { text: 'Luke Skywalker', value: 'luke' },
            { text: 'Han Solo', value: 'han' },
            { text: 'Leia Organo', value: 'leia' },
        ];
        this.onChange = this.onChange.bind(this);
        this.toggleEnabled = this.toggleEnabled.bind(this);
    }
    render() {
        return (h("section", null,
            h("limel-select", { label: "Favorite hero", value: this.value, options: this.options, disabled: this.disabled, onChange: this.onChange }),
            h("p", null,
                h("limel-flex-container", { justify: "end" },
                    h("limel-button", { onClick: this.toggleEnabled, label: this.disabled ? 'Enable' : 'Disable' }))),
            h("p", null,
                "Value: ",
                JSON.stringify(this.value))));
    }
    onChange(event) {
        this.value = event.detail;
    }
    toggleEnabled() {
        this.disabled = !this.disabled;
    }
    static get is() { return "limel-example-select"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "disabled": {
            "state": true
        },
        "value": {
            "state": true
        }
    }; }
    static get style() { return "p {\n  font-size: small;\n}"; }
}

export { SelectExample as LimelExampleSelect };
