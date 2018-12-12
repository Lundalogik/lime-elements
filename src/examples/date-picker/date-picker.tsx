import { Component, State } from '@stencil/core';
import { DateType } from '../../components/date-picker/date-type';

const types = {
    datetime: new Date('2018-12-25 16:00'),
    date: new Date('2018-12-25'),
    time: new Date('2018-12-25 16:00'),
    week: new Date('2018-12-24'),
    month: new Date('2018-12-01'),
    quarter: new Date('2018-10-01'),
    year: new Date('2018-10-01'),
};

@Component({
    tag: 'limel-example-date-picker',
    shadow: true,
})
export class DatePickerExample {
    public handleChange = Object.keys(types).map((_, index) => {
        return event => {
            this.values[index] = event.detail;
        };
    });

    @State()
    private values = (Object as any).values(types);

    public render() {
        return Object.keys(types).map((type: DateType, index) => {
            return (
                <limel-date-picker
                    type={type}
                    label={type}
                    value={this.values[index]}
                    onChange={this.handleChange[index]}
                />
            );
        });
    }
}
