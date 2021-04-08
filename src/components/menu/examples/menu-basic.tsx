import { ListItem, ListSeparator } from '@limetech/lime-elements';
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

    private items: Array<ListItem | ListSeparator> = [
        { text: 'Copy' },
        { text: 'Cut' },
        { separator: true },
        { text: 'Paste' },
    ];

    constructor() {
        this.handleSelect = this.handleSelect.bind(this);
    }

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

    private handleSelect(event: CustomEvent<ListItem>) {
        this.lastSelectedItem = event.detail.text;
    }
}
