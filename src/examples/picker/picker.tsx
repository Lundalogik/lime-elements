import { Component, h, State } from '@stencil/core';
import { ListItem } from '../../interface';

const NETWORK_DELAY = 500;

@Component({
    tag: 'limel-example-picker',
    shadow: true,
    styleUrl: 'picker.scss',
})
export class PickerExample {
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
    private selectedItem: ListItem<number>;

    constructor() {
        this.search = this.search.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    public render() {
        return [
            <limel-picker
                label="Favorite awesomenaut"
                value={this.selectedItem}
                searcher={this.search}
                onChange={this.onChange}
                onInteract={this.onInteract}
            />,
            <p>
                Value: <code>{JSON.stringify(this.selectedItem)}</code>
            </p>,
        ];
    }

    private search(query: string): Promise<ListItem[]> {
        return new Promise(resolve => {
            if (query === '') {
                resolve(this.allItems);
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

    private onChange(event: CustomEvent<ListItem<number>>) {
        this.selectedItem = event.detail;
    }

    private onInteract(event) {
        console.log('Value interacted with:', event.detail);
    }
}
