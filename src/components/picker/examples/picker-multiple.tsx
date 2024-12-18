import { LimelPickerCustomEvent, ListItem } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

/**
 * Multiple values can be picked.
 *
 * - Already picked items are removed from the available options.
 */
@Component({
    tag: 'limel-example-picker-multiple',
    shadow: true,
})
export class PickerMultipleExample {
    @State()
    private selectedItems: Array<ListItem<number>> = [];

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

    private availableItems: Array<ListItem<number>> = [...this.allItems];

    public render() {
        return [
            <limel-picker
                label="Favorite awesomenaut"
                value={this.selectedItems}
                multiple={true}
                allItems={this.availableItems}
                emptyResultMessage="No matching awesomenauts found"
                onChange={this.onChange}
                onInteract={this.onInteract}
            />,
            <limel-example-value value={this.selectedItems} />,
        ];
    }

    private onChange = (
        event: LimelPickerCustomEvent<Array<ListItem<number>>>,
    ) => {
        this.selectedItems = [...event.detail];
        this.updateAvailableItems();
    };

    private updateAvailableItems = () => {
        this.availableItems = this.allItems.filter((item) => {
            return !this.selectedItems.find((selectedItem) => {
                return item.value === selectedItem.value;
            });
        });
    };

    private onInteract = (event: LimelPickerCustomEvent<ListItem<number>>) => {
        console.log('Value interacted with:', event.detail);
    };
}
