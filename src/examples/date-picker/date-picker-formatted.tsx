import { Component, State } from '@stencil/core';

@Component({
    tag: 'limel-example-date-picker-formatted',
    shadow: true,
})
export class DatePickerFormattedExample {
    @State()
    private valueNo = new Date('2018-11-04');
    private valueFi = new Date('2018-11-04');

    public render() {
        return [
            <limel-date-picker
                language="no"
                type="datetime"
                label="Localized date"
                value={this.valueNo}
                onChange={this.handleChangeNo}
            />,
            <p style={{ 'font-size': 'small' }}>
                Value: <code>{this.valueNo.toString()}</code>
            </p>,
            <limel-date-picker
                language="fi"
                format="YYYY-MM-DD"
                type="datetime"
                label="Date with custom format"
                value={this.valueFi}
                onChange={this.handleChangeFi}
            />,
            <p style={{ 'font-size': 'small' }}>
                Value: <code>{this.valueFi.toString()}</code>
            </p>,
        ];
    }

    private handleChangeNo(event) {
        this.valueNo = event.detail;
    }

    private handleChangeFi(event) {
        this.valueFi = event.detail;
    }
}
