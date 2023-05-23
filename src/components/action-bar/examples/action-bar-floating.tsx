import { Component, h, State } from '@stencil/core';
import { ActionBarItem } from '../action-bar.types';
import { ListSeparator } from 'src/interface';

/**
 * Floating Example
 *
 * For some designs, it may make sense to display the action bar as
 * a floating element on top of the page's content.
 * Set the `isFloating` prop to `true` to get the basics styles of
 * a floating bar.
 *
 * :::note
 * 1. In this case, the action bar gets some elevation effect
 * using a `box-shadow`. This is to properly separate the action bar
 * form its surrounding context. You can override this by setting another
 * `box-shadow`.
 * 2. Make sure to use a proper `openDirection` for the
 * overflow menu.
 * 3. Make sure there is space on the sides of the action bar,
 * so that it doesn't stretch out completely from left edge to the right
 * edge. The component is already doing so using a `max-width`,
 * but you can override it by providing another `max-width`.
 * :::
 */
@Component({
    tag: 'limel-example-action-bar-floating',
    shadow: true,
    styleUrl: 'action-bar-floating.scss',
})
export class ActionBarFloatingExample {
    @State()
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
            icon: 'whole_hand',
        },
        {
            text: 'Park',
            icon: 'circled_pause',
            iconColor: 'rgb(var(--color-orange-default))',
        },
        {
            text: 'Close',
            icon: 'do_not_disturb',
            iconColor: 'rgb(var(--color-red-default))',
        },
    ];

    public render() {
        return (
            <div class="application has-floating-action-bar">
                <limel-action-bar
                    accessibleLabel="Contextual Action Bar"
                    actionBarItems={this.actionBarItems}
                    openDirection="top"
                    layout="floating"
                />
            </div>
        );
    }
}
