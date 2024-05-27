import {
    LimelChipCustomEvent,
    LimelPickerCustomEvent,
    ListItem,
    MenuItem,
} from '@limetech/lime-elements';
import { Component, h, Host, State } from '@stencil/core';
import { AUTHORS } from './authors';

const ACTIONS = [
    {
        '1': [
            {
                text: 'Email',
                secondaryText: 'erick.remarque@lime.tech',
                icon: 'email_sign',
                value: 1,
            },
            {
                text: 'Direct phone',
                secondaryText: '+46 987 654 321',
                icon: 'phone',
                value: 2,
            },
        ],
    },
    {
        '2': [
            {
                text: 'Email',
                secondaryText: 'ernest.hemingway@lime.tech',
                icon: 'email_sign',
                value: 1,
            },
        ],
    },
];

/**
 * Picker with `value` as an object, containing items with menus
 * While chips inside the picker can be clicked on, resulting in
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
    tag: 'limel-example-picker-value-as-object-with-actions',
    shadow: true,
})
export class PickerValueAsObjectWithActionsExample {
    @State()
    private selectedItems: Array<ListItem<{ id: string; limetype: string }>> =
        [];

    private allItems: Array<ListItem<{ id: string; limetype: string }>> =
        AUTHORS;

    public render() {
        return (
            <Host onMenuItemSelected={this.onMenuItemSelected}>
                <limel-picker
                    label="Favorite authors"
                    value={this.selectedItems}
                    searchLabel={'Find your favorite authors'}
                    multiple={true}
                    searcher={this.search}
                    onChange={this.onChange}
                    onInteract={this.onInteract}
                />
                <limel-example-value value={this.selectedItems} />
            </Host>
        );
    }

    private search = (query: string): Promise<ListItem[]> => {
        return new Promise((resolve) => {
            if (query === '') {
                resolve([]);
            }

            const filteredItems = this.allItems.filter((item) => {
                const searchText =
                    item.text.toLowerCase() +
                    ' ' +
                    item.secondaryText.toLowerCase();

                return searchText.includes(query.toLowerCase());
            });
            resolve(filteredItems);
        });
    };

    private onChange = (
        event: LimelPickerCustomEvent<
            Array<
                ListItem<{
                    id: string;
                    limetype: string;
                }>
            >
        >,
    ) => {
        this.selectedItems = [...event.detail].map((item) => {
            const itemActions = ACTIONS.find((action) =>
                Object.prototype.hasOwnProperty.call(action, item.value.id),
            );

            return {
                ...item,
                actions: itemActions?.[item.value.id],
            };
        });
    };

    private onInteract = (
        event: LimelPickerCustomEvent<
            ListItem<{ id: string; limetype: string }>
        >,
    ) => {
        console.log('Value interacted with:', event.detail);
    };

    private onMenuItemSelected = (event: LimelChipCustomEvent<MenuItem>) => {
        event.stopPropagation();
        console.log('Selected action:', event.detail);
    };
}
