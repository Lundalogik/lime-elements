import { LimelPickerCustomEvent, ListItem } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';
import { AUTHORS } from './authors';

/**
 * With a value as an object
 */
@Component({
    tag: 'limel-example-picker-value-as-object',
    shadow: true,
})
export class PickerValueAsObjectExample {
    @State()
    private selectedItems: Array<ListItem<{ id: string; limetype: string }>> =
        [];

    private allItems: Array<ListItem<{ id: string; limetype: string }>> =
        AUTHORS;

    public render() {
        return [
            <limel-picker
                label="Favorite authors"
                value={this.selectedItems}
                searchLabel="Search your favorite authors"
                emptyResultMessage="No matching authors found"
                multiple={true}
                allItems={this.allItems}
                onChange={this.onChange}
                onInteract={this.onInteract}
            />,
            <limel-example-value value={this.selectedItems} />,
        ];
    }

    private onChange = (
        event: LimelPickerCustomEvent<
            Array<
                ListItem<{
                    id: string;
                    limetype: string;
                }>
            >
        >
    ) => {
        this.selectedItems = event.detail;
    };

    private onInteract = (
        event: LimelPickerCustomEvent<
            ListItem<{ id: string; limetype: string }>
        >
    ) => {
        console.log('Value interacted with:', event.detail);
    };
}
