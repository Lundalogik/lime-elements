import { MenuItem, ListSeparator } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

/**
 * Menu with supporting hotkeys
 *
 */
@Component({
    tag: 'limel-example-menu-hotkeys',
    shadow: true,
})
export class MenuHotkeysExample {
    @State()
    private lastSelectedItem: string;

    private items: Array<ListSeparator | MenuItem> = [
        { text: 'Copy', commandText: 'alt + C' },
        { text: 'Cut', commandText: 'alt + X' },
        { separator: true },
        { text: 'Paste', commandText: 'alt + V' },
    ];

    public render() {
        console.log(this.items);

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
