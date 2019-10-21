import { ListItem, ListSeparator } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

@Component({
    tag: 'limel-example-list-radio-button',
    shadow: true,
    styleUrl: 'list.scss',
})
export class ListRadioButtonExample {
    @State()
    private items: Array<ListItem | ListSeparator> = [
        { text: 'Pikachu', value: 1, selected: false },
        { text: 'Charmander', value: 2, selected: false, disabled: true },
        { text: 'Super Mario', value: 3, selected: false },
        { separator: true },
        { text: 'Yoshi', value: 4, selected: false, disabled: true },
        { text: 'Minion', value: 6, selected: true },
        { text: 'Pokéball', value: 5, selected: false },
    ];

    @State()
    private selectedItem: ListItem | ListSeparator;

    constructor() {
        this.selectedItem = this.items.filter((item: ListItem) => {
            return !!item.selected;
        })[0];
        this.handleChange = this.handleChange.bind(this);
    }

    public render() {
        return [
            <limel-list
                onChange={this.handleChange}
                items={this.items}
                type="radio"
            />,
            <p>
                Value: <code>{JSON.stringify(this.selectedItem)}</code>
            </p>,
        ];
    }

    private handleChange(event: CustomEvent<ListItem>) {
        this.selectedItem = event.detail;
        this.items = this.items.map((item: ListItem) => {
            if (item.value === event.detail.value) {
                return event.detail;
            }

            return item;
        });
    }
}
