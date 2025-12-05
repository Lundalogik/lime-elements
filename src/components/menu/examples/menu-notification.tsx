import {
    MenuItem,
    ListSeparator,
    LimelMenuCustomEvent,
} from '@limetech/lime-elements';
import { Component, h } from '@stencil/core';

/**
 * With notification
 *
 * It is possible to display a notification badge on each individual
 * list item inside the menu's dropdown.
 *
 * These notification badges are supposed to inform the user that
 * there is something in the menu item that requires their attention.
 *
 * This is typically done by displaying a number, which summarizes
 * the quantity of the items that require user's attention.
 * However, if a number is not meaningful, it is possible to send an
 * empty string (`badge: ''`), which will display a circle on the
 * list item.
 *
 * Since list items in the menu are hidden away, users would not
 * realize that there is something inside the menu which requires their
 * attention. Which is why the trigger automatically displays a
 * notification badge on its top-right corner,
 * when the menu contains badges.
 *
 * By default, the badge is red and its text is white.
 * This is to attract users' attention. However, this is possible to override using
 * [provided style variables](#/component/limel-menu/styles/).
 *
 * :::warning
 * - Do not negatively exploit this possibility and spam users' attention.
 * Crowding the UI with too much noise _will_ negatively affect the user experience.
 * - Notification badges *must* be cleared as soon as the list item is clicked by the user!
 * :::
 */
@Component({
    tag: 'limel-example-menu-notification',
    shadow: true,
})
export class MenuNotificationExample {
    private items: Array<MenuItem | ListSeparator> = [
        { text: 'Profile', icon: 'cat_profile' },
        { text: 'Settings', icon: 'horizontal_settings_mixer', badge: '' },
        { text: 'Notifications', icon: 'bell', badge: 7 },
        { separator: true },
        { text: 'Log out' },
    ];

    public render() {
        return (
            <limel-menu items={this.items} onSelect={this.handleSelect}>
                <limel-icon-button
                    slot="trigger"
                    icon="gender_neutral_user"
                    label="User Menu"
                    elevated={true}
                />
            </limel-menu>
        );
    }

    private handleSelect = (event: LimelMenuCustomEvent<MenuItem>) => {
        console.log(event.detail.text);
    };
}
