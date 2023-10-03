import { Component, h, State } from '@stencil/core';
import { ActionBarItem, ListSeparator } from '@limetech/lime-elements';

/**
 * Using colors
 *
 * You can specify colors for single actions, by setting `iconColor`.
 *
 * :::note
 * Make sure not to overuse colors!
 * It is perfectly fine that most of the actions in the bar use the default color.
 * Colors should be used to add an extra layer of meaning for the actions.
 * :::
 *
 */
@Component({
    tag: 'limel-example-action-bar-colors',
    shadow: true,
})
export class ActionBarColorsExample {
    @State()
    private actionBarItems: Array<ActionBarItem | ListSeparator> = [
        {
            text: 'Record',
            icon: 'dot_circle',
            iconOnly: true,
            iconColor: 'rgb(var(--color-red-default))',
        },
        {
            text: 'Stop',
            icon: 'stop',
            iconOnly: true,
        },
        { separator: true },
        {
            text: 'Previous',
            icon: '-lime-filter-previous',
            iconOnly: true,
        },
        {
            text: 'Play',
            icon: 'play',
            iconOnly: true,
        },
        {
            text: 'Next',
            icon: '-lime-filter-next',
            iconOnly: true,
        },
    ];

    public render() {
        return (
            <div>
                <limel-action-bar
                    accessibleLabel="Toolbar"
                    actions={this.actionBarItems}
                />
            </div>
        );
    }
}
