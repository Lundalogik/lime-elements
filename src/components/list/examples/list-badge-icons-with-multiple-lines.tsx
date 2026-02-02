import { Option } from '@limetech/lime-elements';
import { ListItem } from '@limetech/lime-elements';
import { Component, h, Host, State } from '@stencil/core';

/**
 * Multi-line versus single-line layout
 * By default, list items will always truncate the `text` line, which is displayed
 * either alone, or as a primary heading (when there are both `text` and `secondaryText`)
 * available. This means users will only see one line of text which is as wides as
 * the list item, and no more. Thus, it is a good idea not to add long strings of
 * text in the heading, as on mobile phones or small containers, they will be
 * chopped off and truncated.
 *
 * However, the `secondaryText` which appears as a sub-heading is not truncated
 * that quickly. By default, lists will display 3 lines of text, and then truncate
 * the rest. Nevertheless, you can increase or decrease this number by specifying
 * `maxLinesSecondaryText`.
 * :::note
 * Do not use `0`, negative numbers, decimal numbers, or very large numbers.
 * :::
 */
@Component({
    tag: 'limel-example-list-badge-icons-with-multiple-lines',
    shadow: true,
})
export class BadgeIconsListExample {
    @State()
    private maxLines: Option = { text: '2', value: '2' };

    private options: Option[] = [
        { text: '1', value: '1' },
        { text: '2', value: '2' },
        { text: '3', value: '3' },
        { text: '4', value: '4' },
        { text: '5', value: '5' },
    ];

    private items: Array<ListItem<number>> = [
        {
            text: 'This item only has one line of primary text, and no secondary text',
            value: 1,
            icon: 'text_width',
        },
        {
            text: 'Very long primary texts like this one will truncate and you cannot do anything about it. Just avoid having long primary texts.',
            secondaryText: 'This is a short secondary text.',
            value: 2,
            icon: 'text_width',
        },
        {
            text: 'This item only has one line of primary text',
            value: 3,
            secondaryText:
                'The lengt of secondary text does not exceed maximum allowed number of lines (of course depending on the width of your screen), thus the lines will not truncate.',
            icon: 'text_width',
        },
        {
            text: 'This is a short primary text',
            secondaryText:
                'Very long secondary texts like this one will not truncate on the first line. By default, the list will render 3 lines of text and then truncates the rest. If you need more lines of text to be shown, you can simply define it in your code, and add a maximum number there. For more information regarding this, please read the documentation.',
            value: 4,
            icon: 'text_width',
        },
    ];

    public render() {
        return (
            <Host>
                <limel-list
                    items={this.items}
                    badgeIcons={true}
                    maxLinesSecondaryText={Number(this.maxLines?.value)}
                />
                <limel-example-controls>
                    <limel-select
                        label="maxLinesSecondaryText"
                        options={this.options}
                        value={this.maxLines}
                        onChange={this.handleChange}
                    />
                </limel-example-controls>
            </Host>
        );
    }

    private handleChange = (event) => {
        event.stopPropagation();
        const detail = event.detail;
        this.maxLines = Array.isArray(detail) ? detail[0] : detail;
    };
}
