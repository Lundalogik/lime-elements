import { MenuItem, ListSeparator } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

/**
 * Basic example
 *
 * With a simple `onSelect` handler.
 */
@Component({
    tag: 'limel-example-menu-basic',
    shadow: true,
})
export class MenuBasicExample {
    @State()
    private lastSelectedItem: string;

    private items: Array<MenuItem | ListSeparator> = [
        { text: 'Copy' },
        { text: 'Cut' },
        { separator: true },
        { text: 'Paste' },
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
