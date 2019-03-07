const h = window.LimeElements.h;

class SelectableListExample {
    constructor() {
        this.items = [
            { text: 'King of Tokyo', id: 1 },
            { text: 'Smash Up!', id: 2 },
            { text: 'Pandemic', id: 3 },
            { text: 'Catan', id: 4 },
            { text: 'Ticket to Ride', id: 5 },
        ];
    }
    render() {
        return [
            h("limel-list", { onChange: event => {
                    console.log(event.detail);
                }, selectable: true, items: this.items }),
            h("hr", null),
            h("p", null,
                "When importing ListItem, see",
                ' ',
                h("a", { href: "/usage#import-statements" }, "Usage")),
        ];
    }
    static get is() { return "limel-example-list-selectable"; }
    static get encapsulation() { return "shadow"; }
}

export { SelectableListExample as LimelExampleListSelectable };
