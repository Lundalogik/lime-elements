import { Component, h, State } from '@stencil/core';
import { DockItem } from '@limetech/lime-elements';

/**
 * Displaying a notification badge
 *
 * It is possible to display a notification badge on each individual
 * button in the Dock. Badges are supposed to inform the user that
 * there is something in the menu that requires their attention.
 *
 * This is typically done by displaying a number, which summarizes
 * the quantity of the items that require user's attention.
 *
 * :::important
 * The menus are not a part of the Dock. They are individual components
 * that you develop separately. Make sure that the information
 * and interactions regarding the notifications are correctly handled.
 *
 * For example, when the items that require user's attention are
 * seen or handled by the user after opening the menu, the badge on the
 * Dock button should disappear.
 * :::
 *
 * When this quantity is unclear or undefined, you can simply pass an
 * empty string (`badge: ''`), which will only render a circle on the button.
 * This is enough to attract user's attention.
 * However, it is also possible to use a short string such as "·" or "!"
 * for such cases, if considered necessary.
 *
 * :::warning
 * Do not negatively exploit this possibility and spam users' awareness.
 * The Dock is the most important and most dominant structural part of
 * the UI of your application. Therefore crowding it with too much noise
 * _will_ negatively affect the user experience.
 * :::
 *
 *
 */
@Component({
    tag: 'limel-example-dock-notification',
    shadow: true,
    styleUrl: 'dock-notification.scss',
})
export class DockNotificationExample {
    @State()
    private dockItems: DockItem[] = [
        {
            id: 'home',
            label: 'Home',
            selected: true,
            icon: '-lime-logo-go-filled',
        },
        {
            id: 'tables',
            label: 'Tables',
            icon: 'insert_table',
        },
        {
            id: 'search',
            label: 'Search',
            icon: 'search',
            badge: '',
        },
    ];

    @State()
    private dockFooterItems: DockItem[] = [
        {
            id: 'user',
            label: 'Account',
            icon: 'user',
            badge: 5,
            dockMenu: { componentName: 'my-custom-menu-with-notifications' },
        },
    ];

    public render() {
        return (
            <div class="application">
                <limel-dock
                    accessibleLabel="Dock Example: dock with notification badges"
                    dockItems={this.dockItems}
                    dockFooterItems={this.dockFooterItems}
                    onItemSelected={this.handleSelected}
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
