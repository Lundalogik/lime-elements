import { Component, h, State } from '@stencil/core';
import { ActionBarItem, ListSeparator } from '@limetech/lime-elements';
/**
 * Made just to showcase a feature in a docs example for `limel-card`.
 * @private
 */
@Component({
    tag: 'limel-example-card-nested-component',
    shadow: true,
    styleUrl: 'card-nested-component.scss',
})
export class CardNestedComponentExample {
    @State()
    private actionBarItems: Array<ActionBarItem | ListSeparator> = [
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
        { separator: true },
        {
            text: 'Repeat',
            icon: 'repeat_one',
            iconOnly: true,
        },
        {
            text: 'Shuffle',
            icon: 'shuffle',
            iconOnly: true,
        },
    ];

    public render() {
        return [
            <limel-slider value={34} valuemax={128} />,
            <limel-action-bar
                accessibleLabel="Toolbar"
                actions={this.actionBarItems}
            />,
        ];
    }
}
