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

    constructor() {
        this.handleChange = this.handleChange.bind(this);
        this.addOneHour = this.addOneHour.bind(this);
    }

    public render() {
        return (
            <p>
                <limel-date-picker
                    type="datetime"
                    label="datetime"
                    value={this.value}
                    onChange={this.handleChange}
                />
                <p>
                    <limel-flex-container justify="end">
                        <limel-button
                            onClick={this.addOneHour}
                            label="Add one hour"
                        />
                    </limel-flex-container>
                </p>
                <limel-example-value value={this.value} />
            </p>
        );
    }

    private handleChange(event) {
        this.value = event.detail;
    }

    private addOneHour() {
        this.value = moment(this.value).add(1, 'hour').toDate();
    }
}
