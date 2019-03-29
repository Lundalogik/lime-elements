const h = window.LimeElements.h;

class SelectableListExample {
    constructor() {
        this.items = [
            { text: 'King of Tokyo', value: 1 },
            { text: 'Smash Up!', value: 2 },
            { text: 'Pandemic', value: 3 },
            { text: 'Catan', value: 4 },
            { text: 'Ticket to Ride', value: 5 },
        ];
    }
    render() {
        return (h("limel-list", { onChange: this.onChange, selectable: true, items: this.items }));
    }
    onChange(event) {
        console.log(event.detail);
    }
    static get is() { return "limel-example-list-selectable"; }
    static get encapsulation() { return "shadow"; }
}

export { SelectableListExample as LimelExampleListSelectable };
