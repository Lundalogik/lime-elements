import { Component, State } from '@stencil/core';
import { ListItem, ListSeparator } from '../../interface';

@Component({
    tag: 'limel-example-list-checkbox',
    shadow: true,
    styleUrl: 'list.scss',
})
export class ListCheckboxExample {
    @State()
    private allItems: Array<ListItem | ListSeparator> = [
        { text: 'Pikachu', value: 1, selected: true },
        { text: 'Charmander', value: 2, selected: false, disabled: true },
        { text: 'Super Mario', value: 3, selected: false },
        { separator: true },
        { text: 'Yoshi', value: 4, selected: false, disabled: true },
        { text: 'Minion', value: 6, selected: true },
        { text: 'Pokéball', value: 5, selected: false },
    ];

    @State()
    private selectedItems: Array<ListItem | ListSeparator> = [];

    constructor() {
        this.selectedItems = this.allItems.filter((item: ListItem) => {
            return !!item.selected;
        });
        this.handleChange = this.handleChange.bind(this);
    }

    public render() {
        return [
            <limel-list
                onChange={this.handleChange}
                selectable={true}
                items={this.allItems}
                multiple={true}
            />,
            <p>
                Value: <code>{JSON.stringify(this.selectedItems)}</code>
            </p>,
        ];
    }

    private handleChange(event: CustomEvent<ListItem[]>) {
        this.selectedItems = event.detail;
        this.allItems = this.allItems.map((item: ListItem) => {
            const selected = !!event.detail.find((selectedItem: ListItem) => {
                return selectedItem.value === item.value;
            });

            return { ...item, selected: selected };
        });
    }
}
