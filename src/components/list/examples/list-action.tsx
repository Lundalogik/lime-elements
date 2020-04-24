import { ListItem } from '@limetech/lime-elements';
import { Component, h } from '@stencil/core';

@Component({
    tag: 'limel-example-list-action',
    shadow: true,
})
export class ListActionExample {
    private actionItems: Array<ListItem<number>> = [
        { text: 'Go to my fab object', value: 10 },
        { text: 'Delete object', value: 11 },
    ];

    private items: Array<ListItem<number>> = [
        {
            text: 'King of Tokyo',
            value: 1,
            icon: 'gorilla',
            actions: this.actionItems,
        },
        { text: 'Smash Up!', value: 2, icon: 'alien' },
        { text: 'Pandemic', value: 3, icon: 'virus' },
        { text: 'Catan', value: 4, icon: 'wheat' },
        { text: 'Ticket to Ride', value: 5, icon: 'steam_engine' },
    ];

    public render() {
        return <limel-list items={this.items} onSelect={this.onSelectAction} />;
    }

    private onSelectAction(event: CustomEvent<ListItem>) {
        console.log('Executing action: ', event.detail);
    }
}
