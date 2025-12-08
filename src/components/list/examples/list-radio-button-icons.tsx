import { LimelListCustomEvent, ListItem } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

/**
 * List with radio buttons and icons
 *
 * By setting `type="radio"`, each list item will
 * render a radio button next to it, indicating the user can select
 * only one of the items at a time, empowering you to create
 * UIs that clearly indicate single selections.
 */
@Component({
    tag: 'limel-example-list-radio-button-icons',
    shadow: true,
})
export class ListRadioButtonIconsExample {
    @State()
    private items: ListItem[] = [
        {
            text: 'Pikachu',
            value: 1,
            selected: false,
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
    private selectedItem: ListItem;

    @State()
    private showIcons: boolean = true;

    private originalIcons: Record<string, ListItem['icon']> = {};

    constructor() {
        this.selectedItem = this.items.find((item) => {
            return !!item.selected;
        });

        for (const item of this.items) {
            this.originalIcons[String(item.value)] = item.icon;
        }
    }

    public render() {
        return [
            <limel-list
                onChange={this.handleChange}
                items={this.items}
                type="radio"
            />,
            <limel-example-value value={this.selectedItem} />,
            <limel-example-controls>
                <limel-switch
                    value={this.showIcons}
                    label="icon"
                    onChange={this.setIcon}
                />
            </limel-example-controls>,
        ];
    }

    private handleChange = (event: LimelListCustomEvent<ListItem>) => {
        this.selectedItem = event.detail;
        this.items = this.items.map((item: ListItem) => {
            if (item.value === event.detail.value) {
                return event.detail;
            }

            return item;
        });
    };

    private setIcon = (event: CustomEvent<boolean>) => {
        this.showIcons = event.detail;
        this.items = this.items.map((item) => ({
            ...item,
            icon: this.showIcons
                ? this.originalIcons[String(item.value)]
                : undefined,
        }));
    };
}
