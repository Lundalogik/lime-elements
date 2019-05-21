const h = window.LimeElements.h;

class SelectExample {
    constructor() {
        this.options = [
            { text: '', value: '', disabled: true },
            { text: 'Luke Skywalker', value: 'luke' },
            { text: 'Han Solo', value: 'han' },
            { text: 'Leia Organo', value: 'leia' },
        ];
        this.onChange = this.onChange.bind(this);
    }
    render() {
        return (h("section", null,
            h("limel-select", { label: "Favorite hero", value: this.value, options: this.options, onChange: this.onChange, required: true }),
            h("p", null,
                "Value: ",
                JSON.stringify(this.value))));
    }
    onChange(event) {
        this.value = event.detail;
    }
    static get is() { return "limel-example-select-initially-empty-required"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "value": {
            "state": true
        }
    }; }
    static get style() { return "p {\n  font-size: small;\n}"; }
}

export { SelectExample as LimelExampleSelectInitiallyEmptyRequired };
