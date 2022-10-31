import { ListItem, ListSeparator } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

/**
 * List with checkboxes
 */
@Component({
    tag: 'limel-example-list-checkbox',
    shadow: true,
})
export class ListCheckboxExample {
    @State()
    private items: Array<ListItem | ListSeparator> = [
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
        this.selectedItems = this.items.filter((item: ListItem) => {
            return !!item.selected;
        });
    }

    public render() {
        return [
            <limel-list
                onChange={this.handleChange}
                items={this.items}
                type="checkbox"
            />,
            <limel-example-value value={this.selectedItems} />,
        ];
    }

    private handleChange = (event: CustomEvent<ListItem[]> | Event) => {
        if (event instanceof CustomEvent<ListItem[]>) {
            this.selectedItems = event.detail;
            this.items = this.items.map((item: ListItem) => {
                const selected = !!event.detail.find(
                    (selectedItem: ListItem) => {
                        return selectedItem.value === item.value;
                    }
                );

                return { ...item, selected: selected };
            });
        }
    };
}
