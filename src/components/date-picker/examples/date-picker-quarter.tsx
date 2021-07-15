import { Component, h, State } from '@stencil/core';

/**
 * quarter
 */
@Component({
    tag: 'limel-example-date-picker-quarter',
    shadow: true,
})
export class DatePickerExample {
    @State()
    private value = new Date();

    public render() {
        return (
            <p>
                <limel-date-picker
                    type="quarter"
                    label="quarter"
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
