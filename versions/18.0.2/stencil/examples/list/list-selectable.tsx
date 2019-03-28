import { Component } from '@stencil/core';
import { ListItem } from '../../interface';

@Component({
    tag: 'limel-example-list-selectable',
    shadow: true,
})
export class SelectableListExample {
    private items: Array<ListItem<number>> = [
        { text: 'King of Tokyo', value: 1 },
        { text: 'Smash Up!', value: 2 },
        { text: 'Pandemic', value: 3 },
        { text: 'Catan', value: 4 },
        { text: 'Ticket to Ride', value: 5 },
    ];

    public render() {
        return (
            <limel-list
                onChange={this.onChange}
                selectable={true}
                items={this.items}
            />
        );
    }

    private onChange(event) {
        console.log(event.detail);
    }
}
