const h = window.LimeElements.h;

const types = ['datetime', 'date', 'time', 'week', 'month', 'quarter', 'year'];
class DatePickerExample {
    constructor() {
        this.datetime = new Date();
        this.date = new Date();
        this.time = new Date();
        this.week = new Date();
        this.month = new Date();
        this.quarter = new Date();
        this.year = new Date();
    }
    render() {
        return types.map((type) => {
            return (h("p", null,
                h("limel-date-picker", { type: type, label: type, value: this[type], onChange: event => {
                        this.handleChange(event, type);
                    } }),
                h("p", { style: { 'font-size': 'small' } },
                    "Value:",
                    ' ',
                    h("code", null, this[type]
                        ? this[type].toString()
                        : JSON.stringify(this[type])))));
        });
    }
    handleChange(event, type) {
        this[type] = event.detail;
    }
    static get is() { return "limel-example-date-picker"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "date": {
            "state": true
        },
        "datetime": {
            "state": true
        },
        "month": {
            "state": true
        },
        "quarter": {
            "state": true
        },
        "time": {
            "state": true
        },
        "week": {
            "state": true
        },
        "year": {
            "state": true
        }
    }; }
}

export { DatePickerExample as LimelExampleDatePicker };
