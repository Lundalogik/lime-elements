import { Component, h, State } from '@stencil/core';
import { DockItem } from '../dock.types';

/**
 * Using colors css
 *
 */

@Component({
    tag: 'limel-example-dock-colors-css',
    shadow: true,
    styleUrl: 'dock-colors-css.scss',
})
export class DockColorsCSSExample {
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
        },
        {
            value: '3',
            label: 'Calls',
            icon: 'phone',
        },

        {
            value: '4',
            label: 'Chats',
            icon: 'chat',
        },
        {
            isFooterStart: true,

            value: '5',
            label: 'Settings',
            icon: 'settings',
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
