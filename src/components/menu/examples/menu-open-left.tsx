import { ListItem, ListSeparator } from '@limetech/lime-elements';
import { Component, h } from '@stencil/core';

/**
 * Opening to the left
 */
@Component({
    tag: 'limel-example-menu-open-left',
    shadow: true,
})
export class MenuOpenLeftExample {
    private items: Array<ListItem | ListSeparator> = [
        { text: 'Copy' },
        { text: 'Cut' },
        { separator: true },
        { text: 'Paste' },
    ];

    public render() {
        return (
            <limel-menu label="Menu" items={this.items} openDirection="left">
                <limel-button label="Menu" slot="trigger" />
            </limel-menu>
        );
    }
}
