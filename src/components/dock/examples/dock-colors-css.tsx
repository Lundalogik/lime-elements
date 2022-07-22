import { Component, h, State } from '@stencil/core';
import { DockItem } from '../dock.types';

/**
 * Using CSS color variables for themeing the Dock
 *
 * A few CSS variables can be used to customize the look and feel of the steps.
 *
 * :::note
 * Using CSS variables to tweak the colors, applies the colors globally to the
 * component, not to individual Dock items!
 * To add colors to individual items, read the previous section.
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
    private footerItems: DockItem[] = [
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
                    dockItems={this.dockItems}
                    footerItems={this.footerItems}
                    onSelected={this.handleSelected}
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
