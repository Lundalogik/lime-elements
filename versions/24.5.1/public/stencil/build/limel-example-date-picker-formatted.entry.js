import { r as registerInstance, h } from './core-804afdbc.js';

const DatePickerFormattedExample = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.valueNo = new Date('2018-11-04');
        this.valueFi = new Date('2018-11-04');
        this.handleChangeNo = this.handleChangeNo.bind(this);
        this.handleChangeFi = this.handleChangeFi.bind(this);
    }
    render() {
        return [
            h("limel-date-picker", { language: "no", type: "datetime", label: "Localized date", value: this.valueNo, onChange: this.handleChangeNo }),
            h("p", { style: { 'font-size': 'small' } }, "Value:", ' ', h("code", null, this.valueNo ? this.valueNo.toString() : 'invalid')),
            h("limel-date-picker", { language: "fi", format: "YYYY-MM-DD", type: "datetime", label: "Date with custom format", value: this.valueFi, onChange: this.handleChangeFi }),
            h("p", { style: { 'font-size': 'small' } }, "Value:", ' ', h("code", null, this.valueFi ? this.valueFi.toString() : 'invalid')),
        ];
    }
    handleChangeNo(event) {
        this.valueNo = event.detail;
    }
    handleChangeFi(event) {
        this.valueFi = event.detail;
    }
};

export { DatePickerFormattedExample as limel_example_date_picker_formatted };
