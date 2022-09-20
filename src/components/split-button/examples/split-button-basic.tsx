import { Component, h } from '@stencil/core';
import { ListSeparator, MenuItem } from '@limetech/lime-elements';

/**
 * Basic Example
 *
 * When used correctly, a split button reduces visual complexity of the user interface
 * by grouping similar commands together.
 *
 * :::important
 * Commands which are included in the menu must be variations of the default command,
 * or be very relevant to it.
 * :::
 */
@Component({
    tag: 'limel-example-split-button-basic',
    shadow: true,
})
export class SplitButtonBasicExample {
    private items: Array<ListSeparator | MenuItem> = [
        { text: 'Later today', secondaryText: 'at 16:45' },
        { text: 'Tomorrow', secondaryText: 'at 08:00' },
        { separator: true },
        { text: 'Custom time', icon: 'calendar' },
    ];

    public render() {
        return (
            <limel-split-button
                label="Send"
                icon="send"
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
