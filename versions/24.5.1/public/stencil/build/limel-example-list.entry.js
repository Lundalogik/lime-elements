import { r as registerInstance, h } from './core-804afdbc.js';

const ListExample = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.items = [
            { text: 'King of Tokyo', value: 1 },
            { text: 'Smash Up!', value: 2 },
            { text: 'Pandemic', value: 3 },
            { separator: true },
            { text: 'Catan', value: 4 },
            { text: 'Ticket to Ride', value: 5 },
        ];
    }
    render() {
        return h("limel-list", { items: this.items });
    }
};

export { ListExample as limel_example_list };
