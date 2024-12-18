import { LimelPickerCustomEvent, ListItem } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

/**
 * Single value can be picked.
 *
 * Since all items are already loaded from the server, we can use the
 * `allItems` property to provide the picker with all the items at once.
 * The picker uses a default search function that filters the items based on
 * the `text` and `secondaryText` properties of the items.
 *
 * :::note
 * For performance reasons, the default searcher will never return more
 * than 20 items, but if there are more than 20 items, the rest can be
 * found by typing more characters in the search field.
 * :::
 */
@Component({
    tag: 'limel-example-picker-basic',
    shadow: true,
})
export class PickerBasicExample {
    @State()
    private selectedItem: ListItem<number>;

    private allItems: Array<ListItem<number>> = [
        { text: 'Admiral Swiggins', value: 1 },
        { text: 'Ayla', value: 2 },
        { text: 'Clunk', value: 3 },
        { text: 'Coco', value: 4 },
        { text: 'Derpl', value: 5 },
        { text: 'Froggy G', value: 6 },
        { text: 'Gnaw', value: 7 },
        { text: 'Lonestar', value: 8 },
        { text: 'Leon', value: 9 },
        { text: 'Raelynn', value: 10 },
        { text: 'Skølldir', value: 11 },
        { text: 'Voltar', value: 12 },
        { text: 'Yuri', value: 13 },
    ];

    public render() {
        return [
            <limel-picker
                label="Favorite awesomenaut"
                value={this.selectedItem}
                allItems={this.allItems}
                emptyResultMessage="No matching awesomenauts found"
                onChange={this.onChange}
                onInteract={this.onInteract}
            />,
            <limel-example-value value={this.selectedItem} />,
        ];
    }

    private onChange = (event: LimelPickerCustomEvent<ListItem<number>>) => {
        this.selectedItem = event.detail;
    };

    private onInteract = (event: LimelPickerCustomEvent<ListItem<number>>) => {
        console.log('Value interacted with:', event.detail);
    };
}
