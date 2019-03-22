const h = window.LimeElements.h;

class IconsListExample {
    constructor() {
        this.items = [
            { text: 'King of Tokyo', value: 1, icon: 'gorilla' },
            { text: 'Smash Up!', value: 2, icon: 'alien' },
            { text: 'Pandemic', value: 3, icon: 'virus' },
            { text: 'Catan', value: 4, icon: 'wheat' },
            { text: 'Ticket to Ride', value: 5, icon: 'steam_engine' },
        ];
    }
    render() {
        return h("limel-list", { items: this.items });
    }
    static get is() { return "limel-example-list-icons"; }
    static get encapsulation() { return "shadow"; }
}

export { IconsListExample as LimelExampleListIcons };
