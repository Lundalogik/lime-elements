import { Component, State } from '@stencil/core';
import debounce from 'lodash.debounce';
import { ListItem } from '../../components/list/list-item';

const DEBOUNCE_DELAY = 300;
const NETWORK_DELAY = 500;

@Component({
    tag: 'limel-example-picker',
    shadow: true,
})
export class PickerExample {
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
    private items: ListItem[] = [];

    @State()
    private selectedItem;

    constructor() {
        this.search = debounce(this.search, DEBOUNCE_DELAY).bind(this);
    }

    public render() {
        return [
            <limel-picker
                onChange={event => {
                    this.selectedItem = this.items.find(
                        item => item === event.detail
                    );
                    this.items = [];
                }}
                label="Favorite awesomenaut"
                onInput={this.handleInput.bind(this)}
                value={this.selectedItem}
                items={this.items}
            />,
            <br />,
            <br />,
            <div>
                Value: <code>{JSON.stringify(this.selectedItem)}</code>
            </div>,
        ];
    }

    private handleInput(event) {
        if (!event.detail) {
            this.items = [];
            return;
        }

        this.search(event.detail);
    }

    private search(text) {
        // Simulate some network delay
        setTimeout(() => {
            this.items = this.allItems.filter(item => {
                return item.text.toLowerCase().includes(text.toLowerCase());
            });
        }, NETWORK_DELAY);
    }
}
