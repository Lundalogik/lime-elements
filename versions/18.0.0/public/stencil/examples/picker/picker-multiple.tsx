import { Component, State } from '@stencil/core';
import { ListItem } from '../../interface';

@Component({
    tag: 'limel-example-picker-multiple',
    shadow: true,
})
export class PickerMultipleExample {
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

    @State()
    private selectedItems: Array<ListItem<number>> = [];

    public render() {
        return [
            <limel-picker
                multiple={true}
                onChange={(event: CustomEvent<Array<ListItem<number>>>) => {
                    this.selectedItems = [...event.detail];
                }}
                label="Favorite awesomenaut"
                searcher={this.search.bind(this)}
                value={this.selectedItems}
            />,
            <br />,
            <br />,
            <div>
                Value: <code>{JSON.stringify(this.selectedItems)}</code>
            </div>,
        ];
    }

    private search(query: string) {
        return new Promise(resolve => {
            // Simulate some network delay
            const NETWORK_DELAY = 500;
            setTimeout(() => {
                if (query === '') {
                    const NUMBER_OF_SUGGESTIONS = 3;
                    resolve(this.allItems.slice(0, NUMBER_OF_SUGGESTIONS));
                    return;
                }

                const filteredItems = this.allItems.filter(item => {
                    return item.text
                        .toLowerCase()
                        .includes(query.toLowerCase());
                });

                resolve(filteredItems);
            }, NETWORK_DELAY);
        });
    }
}
