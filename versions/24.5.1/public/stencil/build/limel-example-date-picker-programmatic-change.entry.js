import { r as registerInstance, h } from './core-804afdbc.js';
import './_commonjsHelpers-bccf23a2.js';
import { m as moment } from './moment-c104bdcd.js';

const DatePickerExample = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.value = new Date();
        this.handleChange = this.handleChange.bind(this);
        this.addOneHour = this.addOneHour.bind(this);
    }
    render() {
        return (h("p", null, h("limel-date-picker", { type: "datetime", label: "datetime", value: this.value, onChange: this.handleChange }), h("p", null, h("limel-flex-container", { justify: "end" }, h("limel-button", { onClick: this.addOneHour, label: "Add one hour" }))), h("p", { style: { 'font-size': 'small' } }, "Value:", ' ', h("code", null, this.value
            ? this.value.toString()
            : JSON.stringify(this.value)))));
    }
    handleChange(event) {
        this.value = event.detail;
    }
    addOneHour() {
        this.value = moment(this.value)
            .add(1, 'hour')
            .toDate();
    }
};

export { DatePickerExample as limel_example_date_picker_programmatic_change };
