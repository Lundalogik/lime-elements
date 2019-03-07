const h = window.LimeElements.h;

class ListExample {
    constructor() {
        this.items = [
            { text: 'King of Tokyo', id: 1 },
            { text: 'Smash Up!', id: 2 },
            { text: 'Pandemic', id: 3 },
            { separator: true },
            { text: 'Catan', id: 4 },
            { text: 'Ticket to Ride', id: 5 },
        ];
    }
    render() {
        return [
            h("limel-list", { items: this.items }),
            h("hr", null),
            h("p", null,
                "When importing ListItem and ListSeparator, see",
                ' ',
                h("a", { href: "/lime-elements/usage#import-statements" }, "Usage")),
        ];
    }
    static get is() { return "limel-example-list"; }
    static get encapsulation() { return "shadow"; }
}

export { ListExample as LimelExampleList };
