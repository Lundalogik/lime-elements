import { Component, h, State } from '@stencil/core';
import moment from 'moment/moment';

/**
 * Changing the input programmatically
 */
@Component({
    tag: 'limel-example-date-picker-programmatic-change',
    shadow: true,
})
export class DatePickerExample {
    @State()
    private value = new Date();

    public render() {
        return [
            <limel-button
                onClick={this.addOneHour}
                label="Add one hour"
                style={{ 'margin-bottom': '1rem' }}
            />,
            <limel-date-picker
                type="datetime"
                label="datetime"
                value={this.value}
                onChange={this.handleChange}
            />,
            <kompendium-example-value value={this.value} />,
        ];
    }

    private handleChange = (event) => {
        this.value = event.detail;
    };

    private addOneHour = () => {
        this.value = moment(this.value).add(1, 'hour').toDate();
    };
}
