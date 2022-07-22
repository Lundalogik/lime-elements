import { Component, h, State } from '@stencil/core';
import { DockItem } from '../dock.types';

/**
 * Basic Example expanded
 */
@Component({
    tag: 'limel-example-dock-expanded',
    shadow: true,
    styleUrl: 'dock-basic.scss',
})
export class DockExpandedExample {
    @State()
    private dockItems: DockItem[] = [
        {
            id: 'home',
            label: 'Lime',
            helperLabel: 'Cmd + H',
            selected: true,
            icon: '-lime-logo-outlined-colored',
        },
        {
            id: 'tables',
            label: 'Tables',
            icon: 'insert_table',
            dockMenu: { componentName: 'my-custom-menu' },
        },
        {
            id: 'search',
            label: 'Search',
            icon: 'search',
        },
    ];

    @State()
    private footerItems: DockItem[] = [
        {
            id: 'create',
            label: 'Create object',
            icon: 'plus_math',
        },
        {
            id: 'settings',
            label: 'Settings',
            icon: 'settings',
        },
    ];

    public render() {
        return (
            <div class="application">
                <limel-dock
                    dockItems={this.dockItems}
                    footerItems={this.footerItems}
                    onSelected={this.handleSelected}
                    allowResize={false}
                    expanded={true}
                />
            </div>
        );
    }

    private handleSelected = (event: CustomEvent<DockItem>) => {
        const setSelection = (item: DockItem) => {
            return {
                ...item,
                selected: item.id === event.detail.id,
            };
        };

        this.dockItems = this.dockItems.map(setSelection);
        this.footerItems = this.footerItems.map(setSelection);
    };
}
