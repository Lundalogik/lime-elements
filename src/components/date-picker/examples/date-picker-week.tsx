import { Component, h, State } from '@stencil/core';

/**
 * week
 */
@Component({
    tag: 'limel-example-date-picker-week',
    shadow: true,
})
export class DatePickerExample {
    @State()
    private value = new Date();

    public render() {
        return (
            <p>
                <limel-date-picker
                    type="week"
                    label="week"
                    value={this.value}
                    onChange={this.handleChange}
                />
                <kompendium-example-value value={this.value} />
            </p>
        );
    }

    private handleChange = (event) => {
        this.value = event.detail;
    };
}
