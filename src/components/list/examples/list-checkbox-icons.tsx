import { LimelListCustomEvent, ListItem } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

/**
 * List with checkboxes and icons
 */
@Component({
    tag: 'limel-example-list-checkbox-icons',
    shadow: true,
})
export class ListCheckboxIconsExample {
    @State()
    private items: ListItem[] = [
        {
            text: 'Pikachu',
            value: 1,
            selected: true,
            icon: {
                name: 'pokemon',
                color: 'var(--lime-yellow)',
            },
        },
        {
            text: 'Charmander',
            value: 2,
            selected: false,
            disabled: true,
            icon: {
                name: 'fire_element',
                color: 'var(--lime-red)',
            },
        },
        {
            text: 'Super Mario',
            value: 3,
            selected: false,
            icon: {
                name: 'super_mario',
                color: 'var(--lime-deep-red)',
            },
        },
        {
            text: 'Yoshi',
            value: 4,
            selected: false,
            disabled: true,
            icon: {
                name: 'easter_egg',
                color: 'var(--lime-green)',
            },
        },
        {
            text: 'Minion',
            value: 6,
            selected: true,
            icon: {
                name: 'minion_1',
                color: 'var(--lime-blue)',
            },
        },
        {
            text: 'Pokéball',
            value: 5,
            selected: false,
            icon: {
                name: 'pokeball',
                color: 'var(--lime-magenta)',
            },
        },
    ];

    @State()
    private selectedItems: ListItem[] = [];

    constructor() {
        this.selectedItems = this.items.filter((item) => {
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

    private handleChange = (event: LimelListCustomEvent<ListItem[]>) => {
        this.selectedItems = event.detail;
        this.items = this.items.map((item: ListItem) => {
            const selected = event.detail.some((selectedItem: ListItem) => {
                return selectedItem.value === item.value;
            });

            return { ...item, selected: selected };
        });
    };
}
