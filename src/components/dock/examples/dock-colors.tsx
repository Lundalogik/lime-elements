import { Component, h, State } from '@stencil/core';
import { DockItem } from '../dock.types';

/**
 * Using color properties for individual Dock items
 *
 * It is possible to adjust the colors of individual Dock items by defining
 * colors directly within the array of items.
 * - `iconColor`: allows changing the fill color of the icons
 * (when the Dock item is deselected),
 * - `selectedBackgroundColor`: lets you define a specific background color for an
 * individual Dock item, when it is selected.
 * - `selectedTextColor`: allows you to change the label color of an individual
 * Dock item, when it is selected.
 * :::note
 * Icon of a selected Dock item will always inherit its color from the label.
 * :::
 * :::important
 * Make sure to have a good contrast between the text color and
 * background color of the Dock item.
 * Poor contrast will result in less readability, which in turn makes the component
 * less accessible. Notice how we have specified `selectedTextColor` only for those
 * items which would otherwise have a low contrast between background and text.
 * :::
 */

@Component({
    tag: 'limel-example-dock-colors',
    shadow: true,
    styleUrl: 'dock-basic.scss',
})
export class DockColorsExample {
    @State()
    private dockItems: DockItem[] = [
        {
            value: '1',
            label: 'Home',
            selected: true,
            icon: 'home',
        },
        {
            value: '2',
            label: 'Search',
            icon: 'search',
            iconColor: 'rgb(var(--color-blue-light))',
            selectedBackgroundColor: 'rgb(var(--color-blue-light))',
        },
        {
            value: '3',
            label: 'Calls',
            icon: 'phone',
            iconColor: 'rgb(var(--color-lime-default))',
            selectedBackgroundColor: 'rgb(var(--color-lime-dark))',
            selectedTextColor: 'rgb(var(--color-white))',
        },

        {
            value: '4',
            label: 'Chats',
            icon: 'chat',
            iconColor: 'rgb(var(--color-amber-default))',
            selectedBackgroundColor: 'rgb(var(--color-amber-default))',
        },
        {
            isFooterStart: true,

            value: '5',
            label: 'Settings',
            icon: 'settings',
            iconColor: 'rgb(var(--color-pink-default))',
            selectedBackgroundColor: 'rgb(var(--color-pink-default))',
            selectedTextColor: 'rgb(var(--color-white))',
        },
    ];

    public render() {
        return [
            <div class="application">
                <limel-dock
                    dockItems={this.dockItems}
                    onChange={this.handleChange}
                    expanded={true}
                />
            </div>,

            <limel-example-value
                value={this.dockItems.find((i) => i.selected)}
            />,
        ];
    }

    private handleChange = (event: CustomEvent<DockItem>) => {
        this.dockItems = this.dockItems.map((item) => {
            return {
                ...item,
                selected: item.value === event.detail?.value,
            };
        });
    };
}
