import { Component, h } from '@stencil/core';
import { ListSeparator, MenuItem } from '@limetech/lime-elements';

/**
 * Repeating the default command in the menu
 *
 * The default command must be the most commonly used action.
 * Such actions typically have a very short label.
 *
 * However, sometimes it could be useful to repeat the default command again
 * in the list of commands, using a more descriptive label which
 * clarifies the default action.
 *
 * :::tip
 * - **Limit the overall number of choices** within the menu to less than 10
 * - **Order the items within the menu by popularity** and put the most popular ones on top.
 * :::
 */
@Component({
    tag: 'limel-example-split-button-repeat-default-command',
    shadow: true,
})
export class SplitButtonRepeatDefaultCommandExample {
    private items: Array<ListSeparator | MenuItem> = [
        {
            text: 'Save',
            secondaryText: 'and update this file',
            commandText: '⌘ + S',
        },
        { text: 'Save as a new file', commandText: '⌘ + ⌥ + S' },
    ];

    public render() {
        return (
            <limel-split-button
                label="Save"
                icon="save"
                primary={true}
                items={this.items}
                onClick={this.onClick}
                onSelect={this.handleSelect}
            />
        );
    }

    private onClick = () => {
        console.log('Button clicked.');
    };

    private handleSelect = (event: CustomEvent<MenuItem>) => {
        console.log('Menu item chosen', event.detail.text);
    };
}
