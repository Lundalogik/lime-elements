import { Component } from '@stencil/core';
import { ListItem } from '../../interface';

@Component({
    tag: 'limel-example-list-checkboxes',
    shadow: true,
})
export class ListCheckboxesExample {
    private items: ListItem[] = [
        { text: 'King of Tokyo', id: 1 },
        { text: 'Smash Up!', id: 2, checked: true },
        { text: 'Pandemic', id: 3 },
        { text: 'Catan', id: 4 },
        { text: 'Ticket to Ride', id: 5 },
    ];

    public render() {
        return [
            <limel-list
                onChange={event => {
                    console.log(event.detail);
                }}
                includeCheckboxes={true}
                items={this.items}
            />,
            <hr />,
            <p>
                When importing ListItem, see{' '}
                <a href="/usage#import-statements">Usage</a>
            </p>,
        ];
    }
}
