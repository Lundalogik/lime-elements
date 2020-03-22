import { ListItem } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

@Component({
    tag: 'limel-example-list-radio-button-icons',
    shadow: true,
    styleUrl: 'list.scss',
})
export class ListRadioButtonIconsExample {
    @State()
    private items: ListItem[] = [
        {
            text: 'Pikachu',
            value: 1,
            selected: false,
            icon: 'pokemon',
            iconColor: 'var(--lime-yellow)',
        },
        {
            text: 'Charmander',
            value: 2,
            selected: false,
            disabled: true,
            icon: 'fire_element',
            iconColor: 'var(--lime-red)',
        },
        {
            text: 'Super Mario',
            value: 3,
            selected: false,
            icon: 'super_mario',
            iconColor: 'var(--lime-deep-red)',
        },
        {
            text: 'Yoshi',
            value: 4,
            selected: false,
            disabled: true,
            icon: 'easter_egg',
            iconColor: 'var(--lime-green)',
        },
        {
            text: 'Minion',
            value: 6,
            selected: true,
            icon: 'minion_1',
            iconColor: 'var(--lime-blue)',
        },
        {
            text: 'Pokéball',
            value: 5,
            selected: false,
            icon: 'pokeball',
            iconColor: 'var(--lime-magenta)',
        },
    ];

    @State()
    private selectedItem: ListItem;

    constructor() {
        this.selectedItem = this.items.filter((item) => {
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
