import { Component, h, State } from '@stencil/core';

/**
 * Custom date formatter
 *
 * You can provide a function to customize the date formatting.
 */
@Component({
    tag: 'limel-example-date-picker-custom-formatter',
    shadow: true,
})
export class DatePickerExample {
    @State()
    private value = new Date();

    public render() {
        return (
            <p>
                <limel-date-picker
                    type="date"
                    label="date"
                    value={this.value}
                    formatter={this.myCustomFormatter}
                    onLimelChange={this.handleChange}
                />
                <limel-example-value value={this.value} />
            </p>
        );
    }

    private handleChange = (event) => {
        this.value = event.detail;
    };

    private myCustomFormatter = (value: Date) => {
        return Intl.DateTimeFormat('en-GB', {
            dateStyle: 'medium',
            timeStyle: 'short',
        }).format(value);
    };
}
