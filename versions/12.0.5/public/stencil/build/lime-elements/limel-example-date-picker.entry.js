const h = window.LimeElements.h;

const types = {
    datetime: new Date('2018-12-25 16:00'),
    date: new Date('2018-12-25'),
    time: new Date('2018-12-25 16:00'),
    week: new Date('2018-12-24'),
    month: new Date('2018-12-01'),
    quarter: new Date('2018-10-01'),
    year: new Date('2018-10-01'),
};
class DatePickerExample {
    constructor() {
        this.handleChange = Object.keys(types).map((_, index) => {
            return event => {
                this.values[index] = event.detail;
            };
        });
        this.values = Object.values(types);
    }
    render() {
        return Object.keys(types).map((type, index) => {
            return (h("limel-date-picker", { type: type, label: type, value: this.values[index], onChange: this.handleChange[index] }));
        });
    }
    static get is() { return "limel-example-date-picker"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "values": {
            "state": true
        }
    }; }
}

export { DatePickerExample as LimelExampleDatePicker };
