import { ListItem } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

/**
 * Single value can be picked.
 *
 * - "Search" is done locally in the frontend.
 */
@Component({
    tag: 'limel-example-picker-single',
    shadow: true,
})
export class PickerSingleExample {
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
                searcher={this.search}
                onChange={this.onChange}
                onInteract={this.onInteract}
            />,
            <limel-example-value value={this.selectedItem} />,
        ];
    }

    private search = (query: string): Promise<ListItem[]> => {
        return new Promise((resolve) => {
            if (query === '') {
                return resolve(this.allItems);
            }

            const filteredItems = this.allItems.filter((item) => {
                return item.text.toLowerCase().includes(query.toLowerCase());
            });

            return resolve(filteredItems);
        });
    };

    private onChange = (event: CustomEvent<ListItem<number>>) => {
        this.selectedItem = event.detail;
    };

    private onInteract = (event: CustomEvent<ListItem<number>>) => {
        console.log('Value interacted with:', event.detail);
    };
}
