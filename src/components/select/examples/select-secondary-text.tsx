import { Option } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';
/**
 * Select with secondary text for options
 * Using a `secondaryText` you can provide additional information about
 * each option in the list, helping the users to select the right choice.
 *
 * :::note
 * 1. The secondary text is only visible in the dropdown list,
 * not on the selected option in the input field.
 * 1. Additionally, on touch screen devices, the secondary text will not
 * be visible in the dropdown list, since the component uses the "native"
 * select, which does not have support for additional features like this,
 * or displaying icons beside the options.
 * :::
 */
@Component({
    shadow: true,
    tag: 'limel-example-select-with-secondary-text',
})
export class SelectSecondaryTextExample {
    @State()
    public value: Option;

    private options: Option[] = [
        {
            text: 'Auto',
            value: 'auto',
        },
        {
            text: 'English (United States)',
            secondaryText: '4/4/24 | 123,456.001',
            value: 'en-US',
        },
        {
            text: 'English (United Kingdom)',
            secondaryText: '04/04/2024 | 123,456.001',
            value: 'en-GB',
        },
        {
            text: 'Svenska',
            secondaryText: '2024-04-04 | 123 456,001',
            value: 'sv-SE',
        },
        {
            text: 'Soumi',
            secondaryText: '4.4.2024 | 123 456,001',
            value: 'fi-FI',
        },
        {
            text: 'Nederlands',
            secondaryText: '04-04-2024 | 123.456,001',
            value: 'nl-NL',
        },
    ];

    public render() {
        return [
            <limel-select
                label="Formatting standard"
                helperText="Affects how dates, and numbers are displayed."
                value={this.value}
                options={this.options}
                onChange={this.handleChange}
            />,
            <limel-example-value value={this.value} />,
        ];
    }

    private handleChange = (event: LimelSelectCustomEvent<Option>) => {
        this.value = event.detail;
    };
}
