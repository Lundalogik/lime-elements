import { r as registerInstance, h } from './core-804afdbc.js';

const SelectExample = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.options = [
            { text: '', value: '' },
            { text: 'Luke Skywalker', value: 'luke' },
            { text: 'Han Solo', value: 'han' },
            { text: 'Leia Organo', value: 'leia' },
        ];
        this.onChange = this.onChange.bind(this);
    }
    render() {
        return (h("section", null, h("limel-select", { label: "Favorite hero", value: this.value, options: this.options, onChange: this.onChange }), h("p", null, "Value: ", JSON.stringify(this.value))));
    }
    onChange(event) {
        this.value = event.detail;
    }
    static get style() { return "p {\n  font-size: small;\n}"; }
};

export { SelectExample as limel_example_select_initially_empty };
