import { Component, h, State } from '@stencil/core';
import { ActionBarItem, ListSeparator } from '@limetech/lime-elements';

/**
 * Styling
 *
 * Using provided custom CSS properties,
 * it is possible to style the action bar.
 *
 * :::note
 * The `--action-bar-item-icon-color` affects all icons.
 * However, the `iconColor` specified on individual items
 * will override that.
 * :::
 */
@Component({
    tag: 'limel-example-action-bar-styling',
    shadow: true,
    styleUrl: 'action-bar-styling.scss',
})
export class ActionBarStylingExample {
    @State()
    private actionBarItems: Array<ActionBarItem | ListSeparator> = [
        {
            text: 'Edit',
            icon: 'pencil_tip',
        },
        {
            text: 'Download',
            icon: 'download',
        },
        {
            text: 'Mark as read',
            icon: 'double_tick',
        },
        { separator: true },
        {
            text: 'Delete',
            icon: 'trash',
            iconColor: 'rgb(var(--color-red-default))',
        },
    ];

    public render() {
        return (
            <div class="application has-floating-action-bar">
                <limel-action-bar
                    accessibleLabel="Contextual Action Bar"
                    actions={this.actionBarItems}
                    openDirection="top"
                    layout="floating"
                />
            </div>
        );
    }
}
