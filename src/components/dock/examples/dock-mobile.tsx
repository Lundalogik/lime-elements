import { Component, h, State } from '@stencil/core';
import { DockItem } from '@limetech/lime-elements';

/**
 * Setting a horizontal layout for mobile devices.
 *
 * By default, the component has a vertical layout, placing the
 * Dock items in a column. However, the component will render the
 * Dock items in a horizontal layout when the screen width is smaller
 * than `700px`.
 *
 * If you prefer the component to switch to the horizontal mobile layout
 * at another breakpoint, use the `mobileBreakPoint` property and give it
 * a desired value in pixels (without `px`).
 *
 * In this example, we have chosen a very large number (`5000`) to force
 * the component to be rendered in mobile layout here in the documentation,
 * no matter how large the reader's screen size is.
 *
 * :::important
 * Triggering the mobile layout does not automatically adjust the position
 * of the component at the bottom of the screen. You should do that manually
 * yourself in a proper way, depending on where the component is used;
 * for example by using CSS media queries, and setting `position: fixed`.
 * :::
 *
 * :::note
 * Labels are not displayed in horizontal layout, but they will be instead
 * displayed as tooltips.
 * :::
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
            id: 'home',
            label: 'Lime',
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
    private dockFooterItems: DockItem[] = [
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
                    accessibleLabel="Dock Example: mobile layout"
                    dockItems={this.dockItems}
                    dockFooterItems={this.dockFooterItems}
                    onItemSelected={this.handleSelected}
                    mobileBreakPoint={5000}
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
