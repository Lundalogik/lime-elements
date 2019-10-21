import { r as registerInstance, h } from './core-804afdbc.js';

const SecondaryTextListExample = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.items = [
            {
                text: 'King of Tokyo',
                secondaryText: '2-6 players',
                value: 1,
                disabled: true,
            },
            { text: 'Smash Up!', secondaryText: '2-4 players', value: 2 },
            { text: 'Pandemic', secondaryText: '2-4 players', value: 3 },
            { text: 'Catan', secondaryText: '3-4 players', value: 4 },
            { text: 'Ticket to Ride', secondaryText: '2-5 players', value: 5 },
        ];
    }
    render() {
        return h("limel-list", { items: this.items });
    }
};

export { SecondaryTextListExample as limel_example_list_secondary };
