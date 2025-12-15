import { Option, ListSeparator } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';
/**
 * Select with separators between options
 *
 * Separators are simple yet powerful design elements that can be
 * employed in lists of items. They offer significant usability advantages
 * by providing valuable visual cues that aid users in perceiving
 * and navigating through lists. Read more about advantages of using
 * separators in the
 * [List component's documentations](#/component/limel-list/).
 */
@Component({
    shadow: true,
    tag: 'limel-example-select-with-separators',
})
export class SelectSeparatorsExample {
    @State()
    public value: Option;

    private options: Array<Option | ListSeparator> = [
        { separator: true, text: 'Alaskan / Hawaiian' },
        {
            text: 'Alaska',
            value: 'AK',
        },
        {
            text: 'Hawaii',
            value: 'HI',
        },
        { separator: true, text: 'Pacific' },
        {
            text: 'California',
            value: 'CA',
        },
        {
            text: 'Nevada',
            value: 'NV',
        },
        {
            text: 'Oregon',
            value: 'OR',
        },
        {
            text: 'Washington',
            value: 'WA',
        },
        { separator: true, text: 'Mountain' },
        {
            text: 'Arizona',
            value: 'AZ',
        },
        {
            text: 'Colorado',
            value: 'CO',
        },
        {
            text: 'Idaho',
            value: 'ID',
        },
        {
            text: 'Montana',
            value: 'MT',
        },
        {
            text: 'Nebraska',
            value: 'NE',
        },
        {
            text: 'North Dakota',
            value: 'ND',
        },
        {
            text: 'New Mexico',
            value: 'NM',
        },
        {
            text: 'Utah',
            value: 'UT',
        },
        {
            text: 'Wyoming',
            value: 'WY',
        },
        { separator: true, text: 'Central Time Zone' },
        {
            text: 'Alabama',
            value: 'AL',
        },
        {
            text: 'Arkansas',
            value: 'AR',
        },
        {
            text: 'Illinois',
            value: 'IL',
        },
        {
            text: 'Iowa',
            value: 'IA',
        },
        {
            text: 'Kansas',
            value: 'KS',
        },
        {
            text: 'Louisiana',
            value: 'LA',
        },
        {
            text: 'Minnesota',
            value: 'MN',
        },
        {
            text: 'Mississippi',
            value: 'MS',
        },
        {
            text: 'Missouri',
            value: 'MO',
        },
        {
            text: 'Oklahoma',
            value: 'OK',
        },
        {
            text: 'Texas',
            value: 'TX',
        },
        {
            text: 'Wisconsin',
            value: 'WI',
        },
        { separator: true, text: 'Eastern Time Zone' },
        {
            text: 'Connecticut',
            value: 'CT',
        },
        {
            text: 'Delaware',
            value: 'DE',
        },
        {
            text: 'Florida',
            value: 'FL',
        },
        {
            text: 'Georgia',
            value: 'GA',
        },
        {
            text: 'Indiana',
            value: 'IN',
        },
        {
            text: 'Kentucky',
            value: 'KY',
        },
        {
            text: 'Maine',
            value: 'ME',
        },
        {
            text: 'Maryland',
            value: 'MD',
        },
        {
            text: 'Massachusetts',
            value: 'MA',
        },
        {
            text: 'Michigan',
            value: 'MI',
        },
        {
            text: 'New Hampshire',
            value: 'NH',
        },
        {
            text: 'New Jersey',
            value: 'NJ',
        },
        {
            text: 'New York',
            value: 'NY',
        },
        {
            text: 'North Carolina',
            value: 'NC',
        },
        {
            text: 'Ohio',
            value: 'OH',
        },
        {
            text: 'Pennsylvania',
            value: 'PA',
        },
        {
            text: 'Rhode Island',
            value: 'RI',
        },
        {
            text: 'South Carolina',
            value: 'SC',
        },
        {
            text: 'Tennessee',
            value: 'TN',
        },
        {
            text: 'Vermont',
            value: 'VT',
        },
        {
            text: 'Virginia',
            value: 'VA',
        },
        {
            text: 'West Virginia',
            value: 'WV',
        },
        {
            text: 'Washington D.C.',
            value: 'DC',
        },
    ];

    public render() {
        return (
            <section>
                <limel-select
                    label="Timezone"
                    value={this.value}
                    options={this.options}
                    onChange={this.handleChange}
                />
                <limel-example-value value={this.value} />
            </section>
        );
    }

    private handleChange = (event) => {
        this.value = event.detail;
    };
}
