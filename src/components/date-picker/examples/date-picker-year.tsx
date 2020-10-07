import { Component, h, State } from '@stencil/core';

/**
 * year
 */
@Component({
    tag: 'limel-example-date-picker-year',
    shadow: true,
})
export class DatePickerExample {
    @State()
    private value = new Date();

    constructor() {
        this.handleChange = this.handleChange.bind(this);
    }

    public render() {
        return (
            <p>
                <limel-date-picker
                    type="year"
                    label="year"
                    value={this.value}
                    onChange={this.handleChange}
                />
                <limel-example-value value={this.value} />
            </p>
        );
    }

    private handleChange(event) {
        this.value = event.detail;
    }
}
