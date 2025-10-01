import { Component, Host, State, h } from '@stencil/core';
import {
    LimelChipCustomEvent,
    LimelChipSetCustomEvent,
} from '@limetech/lime-elements';
import { MenuItem } from '../../menu/menu.types';
import { Chip } from '../chip.types';
import { ListSeparator } from '../../list-item/list-item.types';

const MENU_ITEMS: Array<MenuItem | ListSeparator> = [
    {
        text: 'Edit permissions',
        secondaryText: 'Can make changes & manage sharing',
        icon: 'keyhole_shield',
        value: 1,
    },
    {
        text: 'Direct phone',
        secondaryText: '+46 123 456 789 0',
        icon: 'phone',
        value: 2,
    },
];

/**
 * Input chip set, containing items with menus
 * While chips inside a chip set of `type="input"` can be clicked on, resulting in
 * an action, they can also have an ellipsis menu which will provide the end users with
 * additional actions.
 *
 * When a menu item is selected from the ellipsis menu, the `onMenuItemSelected` event
 * will be emitted, reflecting the `value` of the selected item.
 *
 * :::note
 * When a chip has `removable={true}` and when there are menu items, the "remove button" on the
 * chip will be automatically added as the last item in the ellipsis menu.
 *
 * Clicking the remove button will emit the same `onRemove` event.
 * :::
 */
@Component({
    tag: 'limel-example-chip-set-input-type-with-menu-items',
    shadow: true,
})
export class ChipSetInputTypeWithMenuItemsExample {
    @State()
    private selectedItem: MenuItem | ListSeparator = null;

    @State()
    private value: Chip[] = [
        {
            id: 1,
            text: 'Lucy',
            image: {
                src: 'https://lundalogik.github.io/lime-elements/780af2a6-d3d1-4593-8642-f03210d09271.png',
                alt: 'A picture of Lucy Chyzhova, UX Designer at Lime Technologies',
            },
            removable: true,
            menuItems: MENU_ITEMS,
            value: 1,
        },
        {
            id: 2,
            text: 'Befkadu',
            removable: true,
            icon: 'person_male',
            value: 2,
        },
    ];

    public render() {
        return (
            <Host onMenuItemSelected={this.onMenuItemSelected}>
                <limel-chip-set
                    type="input"
                    inputType="text"
                    label="Meeting participants"
                    value={this.value}
                    onChange={this.handleChange}
                    onInteract={this.handleInteraction}
                />
                <limel-example-value
                    label="Selected menu item"
                    value={this.selectedItem}
                />
            </Host>
        );
    }

    private handleInteraction = (event: CustomEvent<Chip>) => {
        console.log('Interaction', event.detail);
    };

    private handleChange = (event: LimelChipSetCustomEvent<Chip[]>) => {
        this.value = event.detail;
        this.selectedItem = null;
    };

    private onMenuItemSelected = (event: LimelChipCustomEvent<MenuItem>) => {
        event.stopPropagation();

        this.selectedItem = { ...event.detail };
    };
}
