import { Component, h, State } from '@stencil/core';

@Component({
    tag: 'limel-example-date-picker-week',
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
                    type="week"
                    label="week"
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
