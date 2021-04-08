import { ListItem, ListSeparator } from '@limetech/lime-elements';
import { Component, h } from '@stencil/core';

/**
 * Disabled
 *
 * Note that both the `limel-menu` and the trigger button are disabled.
 * The `disabled` property on `limel-menu` prevents the menu from opening, but
 * does not affect the styling or behavior of the `limel-button` trigger
 * element.
 */
@Component({
    tag: 'limel-example-menu-disabled',
    shadow: true,
})
export class MenuDisabledExample {
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
        return (
            <limel-menu
                items={this.items}
                disabled={true}
                onSelect={this.handleSelect}
            >
                <limel-button label="Menu" disabled={true} slot="trigger" />
            </limel-menu>
        );
    }

    private handleSelect(event: CustomEvent<ListItem>) {
        console.error(
            'This should never happen, since the menu is disabled.',
            event
        );
    }
}
