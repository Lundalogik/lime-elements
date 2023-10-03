import { Component, h, State } from '@stencil/core';
import { DockItem } from '@limetech/lime-elements';

/**
 * Using CSS color variables for theming the Dock
 *
 * A few CSS variables can be used to customize the look and feel of the steps.
 *
 * :::note
 * Using CSS variables to tweak the colors, applies the colors globally to the
 * component, not to individual Dock items!
 * :::
 * :::important
 * Make sure that:
 * - text has enough contrast with its background and is readable.
 * :::
 */

@Component({
    tag: 'limel-example-dock-colors-css',
    shadow: true,
    styleUrl: 'dock-colors-css.scss',
})
export class DockColorsCssExample {
    @State()
    private dockItems: DockItem[] = [
        {
            id: '1',
            label: 'Home',
            selected: true,
            icon: 'home',
        },
        {
            id: '2',
            label: 'Search',
            icon: 'search',
        },
        {
            id: '3',
            label: 'Calls',
            icon: 'phone',
        },
        {
            id: '4',
            label: 'Chats',
            icon: 'chat',
        },
    ];

    @State()
    private dockFooterItems: DockItem[] = [
        {
            id: '5',
            label: 'Settings',
            icon: 'settings',
        },
    ];

    public render() {
        return (
            <div class="application">
                <limel-dock
                    accessibleLabel="Dock Example: CSS color variables"
                    dockItems={this.dockItems}
                    dockFooterItems={this.dockFooterItems}
                    onItemSelected={this.handleSelected}
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
        this.dockFooterItems = this.dockFooterItems.map(setSelection);
    };
}
