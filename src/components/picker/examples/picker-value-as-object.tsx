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
                searchLabel={'Search your favorite authors'}
                multiple={true}
                searcher={this.search}
                onChange={this.onChange}
                onInteract={this.onInteract}
            />,
            <limel-example-value value={this.selectedItems} />,
        ];
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
        this.selectedItems = event.detail;
    };

    private onInteract = (
        event: LimelPickerCustomEvent<
            ListItem<{ id: string; limetype: string }>
        >,
    ) => {
        console.log('Value interacted with:', event.detail);
    };
}
