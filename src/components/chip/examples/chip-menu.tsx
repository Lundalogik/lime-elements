import {
    LimelChipCustomEvent,
    ListSeparator,
    MenuItem,
} from '@limetech/lime-elements';
import { Component, State, h } from '@stencil/core';

/**
 * When an array of menu items is provided, the chip will render
 * an ellipsis menu with the supplied items. When an item is selected,
 * the `onMenuItemSelected` event will be emitted, reflecting the
 * `value` of the selected item.
 *
 * :::note
 * This will hide the "remove button" on the chip, when `removable={true}`,
 * as the remove button will automatically become the last item in the menu.
 *
 * Clicking the remove button will emit the same `onRemove` event.
 * :::
 */
@Component({
    tag: 'limel-example-chip-menu',
    shadow: true,
})
export class ChipMenuExample {
    @State()
    private removeButtonClicked: boolean = false;

    @State()
    private menuItemSelected: MenuItem | ListSeparator = null;

    @State()
    private menuItems: Array<MenuItem | ListSeparator> = [
        {
            text: 'Email',
            secondaryText: 'beffie@lime.tech',
            icon: 'email_sign',
            value: 1,
        },
        {
            text: 'Direct phone',
            secondaryText: '+46 987 654 321',
            icon: 'phone',
            value: 2,
        },
        {
            text: 'Mobile',
            secondaryText: '+46 123 456 789',
            icon: 'touchscreen_smartphone',
            value: 3,
        },
    ];

    public render() {
        return [
            <limel-chip
                text="Beffie Kiaskompis"
                removable={true}
                onRemove={this.handleRemove}
                menuItems={this.menuItems}
                onMenuItemSelected={this.handleMenuItemSelected}
            />,
            <limel-example-value
                label="Menu item clicked"
                value={this.menuItemSelected}
            />,
            <limel-example-value
                label="Remove"
                value={this.removeButtonClicked}
            />,
        ];
    }

    private handleRemove = () => {
        this.removeButtonClicked = true;
    };

    private handleMenuItemSelected = (
        event: LimelChipCustomEvent<MenuItem>
    ) => {
        this.menuItemSelected = event.detail;
    };
}
