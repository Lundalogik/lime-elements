import { Component, h, State } from '@stencil/core';

/**
 * month
 */
@Component({
    tag: 'limel-example-date-picker-month',
    shadow: true,
})
export class DatePickerExample {
    @State()
    private value = new Date();

    public render() {
        return (
            <p>
                <limel-date-picker
                    type="month"
                    label="month"
                    value={this.value}
                    onChange={this.handleChange}
                />
                <limel-example-value value={this.value} />
            </p>
        );
    }

    private handleChange = (event) => {
        this.value = event.detail;
    };
}
