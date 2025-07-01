import {
    MenuItem,
    ListSeparator,
    LimelMenuCustomEvent,
} from '@limetech/lime-elements';
import { Component, h } from '@stencil/core';

/**
 * Disabled
 *
 * Note that you don't need to disable the trigger button separately, as the
 * component takes care of this for you.
 */
@Component({
    tag: 'limel-example-menu-disabled',
    shadow: true,
})
export class MenuDisabledExample {
    private items: Array<MenuItem | ListSeparator> = [
        { text: 'Copy' },
        { text: 'Cut' },
        { separator: true },
        { text: 'Paste' },
    ];

    public render() {
        return (
            <limel-menu
                items={this.items}
                disabled={true}
                onSelect={this.handleSelect}
            >
                <limel-button label="Menu" slot="trigger" />
            </limel-menu>
        );
    }

    private handleSelect = (event: LimelMenuCustomEvent<MenuItem>) => {
        console.error(
            'This should never happen, since the menu is disabled.',
            event
        );
    };
}
