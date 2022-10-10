import { MenuItem, ListSeparator } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

/**
 * With `secondaryText`
 *
 * Menu items can display secondary text as well. By default, the secondary text
 * will be displayed in two lines, and then get truncated.
 *
 * :::important
 * Keep in mind that a menu's drop-down surface will stretch as much as its default
 * maximum width values allow. However, if this default maximum width does not suit
 * your use case, you can override it using the `--menu-surface-width` variable.
 *
 * But do not forget that menus should still behave responsively, thus assigning a fixed value
 * should be avoided. To make the width responsive, try using the `min()` function.
 * This function selects the smallest value from a list of comma-separated expressions
 * which are placed within the parentheses.
 *
 * For example, `--menu-surface-width: min(90vw, 40rem);` will output
 * `width: min(90wv, 40rem);` which will tell the browser to render the menu
 * content in a grid that's allowed to take up 90% of the viewport's width (`90vw`)
 * up to a maximum of `40rem`.
 * :::
 */
@Component({
    tag: 'limel-example-menu-secondary-text',
    shadow: true,
    styleUrl: 'menu-basic-secondary-text.scss',
})
export class MenuBasicExample {
    @State()
    private lastSelectedItem: string;

    private items: Array<MenuItem | ListSeparator> = [
        {
            text: 'This item only has one line of primary text',
        },
        { separator: true },
        {
            text: 'Very long primary texts like this one can truncate based on what you specify for `--menu-surface-width`.',
            secondaryText: 'This is a short secondary text.',
        },
        {
            text: 'This item only has one line of primary text',
            secondaryText:
                'The length of secondary text exceeds maximum allowed number of lines, which is two. This happens because `--menu-surface-width` specified here is not so large. Thus the lines will truncate.',
        },
    ];

    public render() {
        return [
            <limel-menu items={this.items} onSelect={this.handleSelect}>
                <limel-button label="Menu" slot="trigger" />
            </limel-menu>,
            <limel-example-value
                label="Last selected item"
                value={this.lastSelectedItem}
            />,
        ];
    }

    private handleSelect = (event: CustomEvent<MenuItem>) => {
        this.lastSelectedItem = event.detail.text;
    };
}
