import { Component, h, State } from '@stencil/core';
import { ListItem, ListSeparator } from '../../interface';

@Component({
    tag: 'limel-example-list-selectable',
    shadow: true,
})
export class SelectableListExample {
    @State()
    private items: Array<ListItem<number> | ListSeparator> = [
        { text: 'King of Tokyo', value: 1 },
        { text: 'Smash Up!', value: 2 },
        { text: 'Pandemic', value: 3, selected: true },
        { separator: true },
        { text: 'Catan', value: 4 },
        { text: 'Ticket to Ride', value: 5 },
    ];

    constructor() {
        this.handleChange = this.handleChange.bind(this);
    }

    public render() {
        return (
            <limel-list
                onChange={this.handleChange}
                type="selectable"
                items={this.items}
            />
        );
    }

    private handleChange(event: CustomEvent<ListItem>) {
        this.items = this.items.map((item: ListItem) => {
            if (item.value === event.detail.value) {
                return event.detail;
            }

            return item;
        });
    }
}
