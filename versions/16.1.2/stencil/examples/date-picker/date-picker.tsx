import { Component, State } from '@stencil/core';
import { DateType } from '../../components/date-picker/date-type';

const types = ['datetime', 'date', 'time', 'week', 'month', 'quarter', 'year'];

@Component({
    tag: 'limel-example-date-picker',
    shadow: true,
})
export class DatePickerExample {
    @State()
    private datetime = new Date();

    @State()
    private date = new Date();

    @State()
    private time = new Date();

    @State()
    private week = new Date();

    @State()
    private month = new Date();

    @State()
    private quarter = new Date();

    @State()
    private year = new Date();

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
                            {this[type]
                                ? this[type].toString()
                                : JSON.stringify(this[type])}
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
