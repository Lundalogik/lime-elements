import { Component, h, State } from '@stencil/core';
import { DockItem } from '../dock.types';

/**
 * Basic Example
 */
@Component({
    tag: 'limel-example-dock-mobile',
    shadow: true,
    styleUrl: 'dock-mobile.scss',
})
export class DockMobileExample {
    @State()
    private dockItems: DockItem[] = [
        {
            value: 'home',
            label: 'Lime',
            selected: true,
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
        },
        {
            value: 'create',
            label: 'Create object',
            icon: 'plus_math',
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
                    mobileBreakPoint={5000}
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
