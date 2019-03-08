const h = window.LimeElements.h;

class IconsListExample {
    constructor() {
        this.items = [
            { text: 'King of Tokyo', id: 1, icon: 'gorilla' },
            { text: 'Smash Up!', id: 2, icon: 'alien' },
            { text: 'Pandemic', id: 3, icon: 'virus' },
            { text: 'Catan', id: 4, icon: 'wheat' },
            { text: 'Ticket to Ride', id: 5, icon: 'steam_engine' },
        ];
    }
    render() {
        return [
            h("limel-list", { items: this.items }),
            h("hr", null),
            h("p", null,
                "When importing ListItem, see",
                ' ',
                h("a", { href: "/lime-elements/usage#import-statements" }, "Usage")),
        ];
    }
    static get is() { return "limel-example-list-icons"; }
    static get encapsulation() { return "shadow"; }
}

export { IconsListExample as LimelExampleListIcons };
