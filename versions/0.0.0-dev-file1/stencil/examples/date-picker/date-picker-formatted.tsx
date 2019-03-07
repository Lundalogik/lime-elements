import { Component, State } from '@stencil/core';

@Component({
    tag: 'limel-example-date-picker-formatted',
    shadow: true,
})
export class DatePickerFormattedExample {
    @State()
    private value = new Date('2018-11-04');

    public handleChange(event) {
        this.value = event.detail;
    }

    public render() {
        return [
            <limel-date-picker
                language="no"
                type="datetime"
                label="localized Date"
                value={this.value}
                onChange={this.handleChange}
            />,
            <limel-date-picker
                language="fi"
                format="YYYY-MM-DD"
                type="datetime"
                label="Date with custom format"
                value={this.value}
                onChange={this.handleChange}
            />,
        ];
    }
}
