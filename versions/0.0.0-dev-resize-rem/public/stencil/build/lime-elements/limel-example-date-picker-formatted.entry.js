const h = window.LimeElements.h;

class DatePickerFormattedExample {
    constructor() {
        this.valueNo = new Date('2018-11-04');
        this.valueFi = new Date('2018-11-04');
    }
    render() {
        return [
            h("limel-date-picker", { language: "no", type: "datetime", label: "Localized date", value: this.valueNo, onChange: this.handleChangeNo.bind(this) }),
            h("p", { style: { 'font-size': 'small' } },
                "Value:",
                ' ',
                h("code", null, this.valueNo ? this.valueNo.toString() : 'invalid')),
            h("limel-date-picker", { language: "fi", format: "YYYY-MM-DD", type: "datetime", label: "Date with custom format", value: this.valueFi, onChange: this.handleChangeFi.bind(this) }),
            h("p", { style: { 'font-size': 'small' } },
                "Value:",
                ' ',
                h("code", null, this.valueFi ? this.valueFi.toString() : 'invalid')),
        ];
    }
    handleChangeNo(event) {
        this.valueNo = event.detail;
    }
    handleChangeFi(event) {
        this.valueFi = event.detail;
    }
    static get is() { return "limel-example-date-picker-formatted"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "valueFi": {
            "state": true
        },
        "valueNo": {
            "state": true
        }
    }; }
}

export { DatePickerFormattedExample as LimelExampleDatePickerFormatted };
