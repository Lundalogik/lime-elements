import { Component, h, State } from '@stencil/core';
import { DockItem } from '../dock.types';

/**
 * Basic Example
 */
@Component({
    tag: 'limel-example-dock-basic',
    shadow: true,
    styleUrl: 'dock-basic.scss',
})
export class DockBasicExample {
    @State()
    private dockItems: DockItem[] = [
        {
            value: 'home',
            label: 'Lime',
            helperLabel: 'Cmd + H',
            selected: true,
            selectedColor: 'rgb(var(--contrast-800))',
            icon: '-lime-logo-outlined-colored',
        },
        {
            value: 'tables',
            label: 'Tables',
            icon: 'insert_table',
            component: { name: 'my-custom-menu' },
        },
        {
            value: 'search',
            label: 'Search',
            icon: 'search',
            iconColor: 'red',
        },
        {
            value: 'person',
            label: 'Preferences',
            icon: 'user',
            isFooterStart: true,
        },
        {
            value: 'setting',
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
