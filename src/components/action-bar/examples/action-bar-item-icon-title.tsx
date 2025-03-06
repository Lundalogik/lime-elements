import { Component, h, State } from '@stencil/core';
import {
    ActionBarItem,
    ListItem,
    ListSeparator,
} from '@limetech/lime-elements';

/**
 * Proper usage of the `title` property in the `Icon` interface
 *
 * In some scenarios, the `title` property of the item's icon must be used to
 * improve accessibility for unsighted users.
 *
 * In most cases, the item's `text` is descriptive enough for the users to understand
 * the meaning of the action. In such cases, the icon is primarily used to improve
 * the visual appearance of the item, and make it more quickly and easily recognizable
 * for the users.
 *
 * However, some designs favor a cleaner and more minimal user interface,
 * by removing unnecessary words, relying on an already present icon which
 * can be interpreted as a word by the user.
 *
 * Here you see examples of such icons followed by a short text:
 * - **➕ icon followed by "Todo"**: For a sighted user,
 * this combination of icon and text would be interpreted as "Add New Todo"
 * - **🔄 icon followed by "List"**: Would be visually read as "Refresh List"
 * - **🗑️ icon followed by "Selected"**: Would be visually read as "Delete Selected"
 *
 * For sighted users, the text is enough to understand the meaning of the action,
 * but a screen reader cannot interpret the icon as a word, unless you provide a
 * proper `title` property for the icon. In fact, the icons that have no `title`
 * are completely hidden from the screen readers.
 *
 * This example showcases how user experience can be improved not only for both
 * users of assistive technologies, but also for those who see a descriptive tooltip,
 * while hovering the action, which is constructed from the combination of
 * the `title` and `text`.
 */
@Component({
    tag: 'limel-example-action-bar-icon-title',
    shadow: true,
    styleUrl: 'action-bar-floating.scss',
})
export class ActionBarIconTitleExample {
    @State()
    private iconOnly = false;

    @State()
    private actionBarItems: Array<ActionBarItem | ListSeparator> = [
        {
            text: 'Todo',
            icon: {
                name: 'plus_math',
                title: 'Add New',
                color: 'rgb(var(--color-lime-default))',
            },
            iconOnly: this.iconOnly,
        },
        {
            text: 'List',
            icon: {
                name: 'refresh',
                title: 'Refresh',
            },
            iconOnly: this.iconOnly,
        },
        { separator: true },
        {
            text: 'Selected',
            icon: {
                name: 'trash',
                title: 'Delete',
                color: 'rgb(var(--color-red-default))',
            },
            iconOnly: this.iconOnly,
        },
    ];

    private listItems: Array<ListItem<number>> = [
        { text: 'Buy groceries', value: 1, icon: 'checked' },
        { text: 'Schedule dentist appointment', value: 2, icon: 'circle' },
        { text: 'Complete project report', value: 3, icon: 'circle' },
        { text: 'Call internet provider', value: 4, icon: 'checked' },
        { text: 'Plan weekend activities', value: 5, icon: 'circle' },
    ];

    public render() {
        return [
            <div class="application has-floating-action-bar is-resizable">
                <limel-list
                    items={this.listItems}
                    class="has-striped-rows"
                    type="checkbox"
                />
                <limel-action-bar
                    accessibleLabel="Contextual Action Bar"
                    actions={this.actionBarItems}
                    openDirection="top"
                    layout="floating"
                />
            </div>,
            <limel-example-controls>
                <limel-checkbox
                    checked={this.iconOnly}
                    label="iconOnly"
                    onChange={this.setIconOnly}
                />
            </limel-example-controls>,
        ];
    }

    private setIconOnly = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.iconOnly = event.detail;

        // Update iconOnly property for all items
        this.actionBarItems = this.actionBarItems.map((item) => {
            if ('separator' in item) {
                return item;
            }

            return {
                ...item,
                iconOnly: this.iconOnly,
            } as ActionBarItem;
        });
    };
}
