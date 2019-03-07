const h = window.LimeElements.h;

class DatePickerFormattedExample {
    constructor() {
        this.value = new Date('2018-11-04');
    }
    handleChange(event) {
        this.value = event.detail;
    }
    render() {
        return [
            h("limel-date-picker", { language: "no", type: "datetime", label: "localized Date", value: this.value, onChange: this.handleChange }),
            h("limel-date-picker", { language: "fi", format: "YYYY-MM-DD", type: "datetime", label: "Date with custom format", value: this.value, onChange: this.handleChange }),
        ];
    }
    static get is() { return "limel-example-date-picker-formatted"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "value": {
            "state": true
        }
    }; }
}

export { DatePickerFormattedExample as LimelExampleDatePickerFormatted };
