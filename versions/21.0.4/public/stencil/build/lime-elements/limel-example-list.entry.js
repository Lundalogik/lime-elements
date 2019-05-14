const h = window.LimeElements.h;

class ListExample {
    constructor() {
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
    static get is() { return "limel-example-list"; }
    static get encapsulation() { return "shadow"; }
}

export { ListExample as LimelExampleList };
