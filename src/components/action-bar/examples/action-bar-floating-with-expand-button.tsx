import { Component, h } from '@stencil/core';
import { ActionBarItem, ListSeparator } from '@limetech/lime-elements';

/**
 * Floating action bar with expand button
 *
 * Some designs may require a floating action bar with an expand button.
 * It can be useful if action bar is covering important content.
 * To make the action bar expandable, set the `collapsible` prop to `true`.
 *
 */
@Component({
    tag: 'limel-example-action-bar-floating-expand',
    shadow: true,
    styleUrl: 'action-bar-floating.scss',
})
export class ActionBarFloatingExpandExample {
    private actionBarItems: Array<ActionBarItem | ListSeparator> = [
        {
            text: 'Add',
            icon: 'plus_math',
            iconOnly: true,
        },
        {
            text: 'Refresh',
            icon: 'refresh',
            iconOnly: true,
        },
        { separator: true },
        {
            text: 'Assign me',
            commandText: 'Cmd + H',
            icon: 'whole_hand_right',
        },
        {
            text: 'Park',
            icon: {
                name: 'circled_pause',
                color: 'rgb(var(--color-orange-default))',
            },
        },
        {
            text: 'Close',
            icon: {
                name: 'do_not_disturb',
                color: 'rgb(var(--color-red-default))',
            },
        },
    ];

    public render() {
        return (
            <div class="application has-floating-action-bar is-resizable">
                <limel-action-bar
                    accessibleLabel="Contextual Action Bar"
                    actions={this.actionBarItems}
                    openDirection="top"
                    layout="floating"
                    collapsible={true}
                />
            </div>
        );
    }
}
