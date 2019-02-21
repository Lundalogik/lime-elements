import { Component, State } from '@stencil/core';
import { DateType } from '../../components/date-picker/date-type';

const types = ['datetime', 'date', 'time', 'week', 'month', 'quarter', 'year'];

@Component({
    tag: 'limel-example-date-picker',
    shadow: true,
})
export class DatePickerExample {
    @State()
    private datetime = new Date('2018-12-25 16:00');

    @State()
    private date = new Date('2018-12-25');

    @State()
    private time = new Date('2018-12-25 16:00');

    @State()
    private week = new Date('2018-12-24');

    @State()
    private month = new Date('2018-12-01');

    @State()
    private quarter = new Date('2018-10-01');

    @State()
    private year = new Date('2018-10-01');

    public render() {
        return types.map((type: DateType) => {
            return (
                <p>
                    <limel-date-picker
                        type={type}
                        label={type}
                        value={this[type]}
                        onChange={event => {
                            this.handleChange(event, type);
                        }}
                    />
                    <p style={{ 'font-size': 'small' }}>
                        Value:{' '}
                        <code>
                            {this[type] ? this[type].toString() : 'invalid'}
                        </code>
                    </p>
                </p>
            );
        });
    }

    private handleChange(event, type: DateType) {
        this[type] = event.detail;
    }
}
