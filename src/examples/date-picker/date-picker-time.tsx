import { Component, h, State } from '@stencil/core';

@Component({
    tag: 'limel-example-date-picker-time',
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
                    type="time"
                    label="time"
                    value={this.value}
                    onChange={this.handleChange}
                />
                <p style={{ 'font-size': 'small' }}>
                    Value:{' '}
                    <code>
                        {this.value
                            ? this.value.toString()
                            : JSON.stringify(this.value)}
                    </code>
                </p>
            </p>
        );
    }

    private handleChange(event) {
        this.value = event.detail;
    }
}
