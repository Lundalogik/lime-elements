import { r as registerInstance, h } from './core-804afdbc.js';

const DatePickerExample = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.value = new Date();
        this.handleChange = this.handleChange.bind(this);
    }
    render() {
        return (h("p", null, h("limel-date-picker", { type: "month", label: "month", value: this.value, onChange: this.handleChange }), h("p", { style: { 'font-size': 'small' } }, "Value:", ' ', h("code", null, this.value
            ? this.value.toString()
            : JSON.stringify(this.value)))));
    }
    handleChange(event) {
        this.value = event.detail;
    }
};

export { DatePickerExample as limel_example_date_picker_month };
