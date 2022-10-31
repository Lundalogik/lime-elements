import { ListItem } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

const NETWORK_DELAY = 500;

/**
 * With no suggestions and a message for empty search results
 *
 * :::important
 * This example simulates that searching is done on the server. Because these
 * examples do not _actually_ send requests to the server, we simulate a small
 * delay, using `setTimeout`. **Please do NOT copy that to production code!**
 * See the other examples for code that does not include this artificial delay.
 * :::
 */
@Component({
    tag: 'limel-example-picker-empty-suggestions',
    shadow: true,
})
export class PickerExample {
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
                emptyResultMessage="No results"
                onChange={this.onChange}
                onInteract={this.onInteract}
            />,
            <limel-example-value value={this.selectedItem} />,
        ];
    }

    private search = (query: string): Promise<ListItem[]> => {
        return new Promise((resolve) => {
            if (query === '') {
                // Simulate some network delay
                setTimeout(() => {
                    resolve([]);
                }, NETWORK_DELAY);
            }

            // Simulate some network delay
            setTimeout(() => {
                const filteredItems = this.allItems.filter((item) => {
                    return item.text
                        .toLowerCase()
                        .includes(query.toLowerCase());
                });
                resolve(filteredItems);
            }, NETWORK_DELAY);
        });
    };

    private onChange = (event: CustomEvent<ListItem<number>> | Event) => {
        if (event instanceof CustomEvent<ListItem<number>>) {
            this.selectedItem = event.detail;
        }
    };

    private onInteract = (event) => {
        console.log('Value interacted with:', event.detail);
    };
}
