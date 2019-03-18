const h = window.LimeElements.h;

class SecondaryTextListExample {
    constructor() {
        this.items = [
            { text: 'King of Tokyo', secondaryText: '2-6 players', id: 1 },
            { text: 'Smash Up!', secondaryText: '2-4 players', id: 2 },
            { text: 'Pandemic', secondaryText: '2-4 players', id: 3 },
            { text: 'Catan', secondaryText: '3-4 players', id: 4 },
            { text: 'Ticket to Ride', secondaryText: '2-5 players', id: 5 },
        ];
    }
    render() {
        return h("limel-list", { items: this.items });
    }
    static get is() { return "limel-example-list-secondary"; }
    static get encapsulation() { return "shadow"; }
}

export { SecondaryTextListExample as LimelExampleListSecondary };
