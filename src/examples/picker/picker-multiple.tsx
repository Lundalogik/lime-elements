import { Component, State } from '@stencil/core';
import { ListItem } from '../../interface';

const NETWORK_DELAY = 500;

@Component({
    tag: 'limel-example-picker-multiple',
    shadow: true,
})
export class PickerMultipleExample {
    private allItems: ListItem[] = [
        { text: 'Admiral Swiggins', id: 1 },
        { text: 'Ayla', id: 2 },
        { text: 'Clunk', id: 3 },
        { text: 'Coco', id: 4 },
        { text: 'Derpl', id: 5 },
        { text: 'Froggy G', id: 6 },
        { text: 'Gnaw', id: 7 },
        { text: 'Lonestar', id: 8 },
        { text: 'Leon', id: 9 },
        { text: 'Raelynn', id: 10 },
        { text: 'Skølldir', id: 11 },
        { text: 'Voltar', id: 12 },
        { text: 'Yuri', id: 13 },
    ];

    @State()
    private selectedItems: ListItem[] = [];

    public render() {
        return [
            <limel-picker
                multiple={true}
                onChange={event => {
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
            <hr />,
            <p>
                When importing ListItem or PickerSearchResult, see{' '}
                <a href="/usage#import-statements">Usage</a>
            </p>,
        ];
    }

    private search(query: string) {
        return new Promise(resolve => {
            if (query === '') {
                resolve([]);
            }
            // Simulate some network delay
            setTimeout(() => {
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
