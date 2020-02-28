import { ListItem } from '@limetech/lime-elements';
import { Component, h } from '@stencil/core';

@Component({
    tag: 'limel-example-list-icons',
    shadow: true,
})
export class IconsListExample {
    private items: Array<ListItem<number>> = [
        { text: 'King of Tokyo', value: 1, icon: 'gorilla' },
        { text: 'Smash Up!', value: 2, icon: 'alien' },
        { text: 'Pandemic', value: 3, icon: 'virus' },
        { text: 'Catan', value: 4, icon: 'wheat' },
        { text: 'Ticket to Ride', value: 5, icon: 'steam_engine' },
    ];

    public render() {
        return <limel-list items={this.items} />;
    }
}
