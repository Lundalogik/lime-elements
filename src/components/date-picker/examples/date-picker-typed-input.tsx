import { Component, h, State } from '@stencil/core';
import { LimelSelectCustomEvent, Option } from '@limetech/lime-elements';

const DATE_FORMATS: Array<Option<string>> = [
    { text: 'US — MM/DD/YYYY', value: 'MM/DD/YYYY' },
    { text: 'European — DD/MM/YYYY', value: 'DD/MM/YYYY' },
    { text: 'Swedish (ISO) — YYYY-MM-DD', value: 'YYYY-MM-DD' },
];

/**
 * Typing a date directly
 *
 * Try typing a date directly into the field and pressing <kbd>Tab</kbd> or
 * clicking away. A valid date is committed just like picking one from the
 * calendar. An unparseable value is flagged with a helper message, and your
 * typed text stays visible until it's corrected.
 *
 * Use the format picker below to test typing against different date
 * formats.
 */
@Component({
    tag: 'limel-example-date-picker-typed-input',
    shadow: true,
    styleUrl: 'date-picker-typed-input.scss',
})
export class DatePickerTypedInputExample {
    @State()
    private format = DATE_FORMATS[0].value;

    @State()
    private formatTestValue: Date;

    public render() {
        return [
            <limel-select
                label="Date format"
                helperText="Choose how dates appear across the app."
                options={DATE_FORMATS}
                value={this.getSelectedFormat()}
                onChange={this.handleFormatChange}
            />,
            <limel-date-picker
                type="date"
                label="Date"
                format={this.format}
                value={this.formatTestValue}
                onChange={this.handleFormatTestValueChange}
            />,
            <limel-example-value value={this.formatTestValue} />,
        ];
    }

    private getSelectedFormat() {
        return DATE_FORMATS.find((option) => option.value === this.format);
    }

    private handleFormatChange = (
        event: LimelSelectCustomEvent<Option<string>>
    ) => {
        this.format = event.detail.value;
    };

    private handleFormatTestValueChange = (event) => {
        this.formatTestValue = event.detail;
    };
}
