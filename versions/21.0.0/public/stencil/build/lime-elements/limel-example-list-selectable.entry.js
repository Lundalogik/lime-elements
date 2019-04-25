const h = window.LimeElements.h;

class SelectableListExample {
    constructor() {
        this.items = [
            { text: 'King of Tokyo', value: 1 },
            { text: 'Smash Up!', value: 2 },
            { text: 'Pandemic', value: 3, selected: true },
            { separator: true },
            { text: 'Catan', value: 4 },
            { text: 'Ticket to Ride', value: 5 },
        ];
        this.handleChange = this.handleChange.bind(this);
    }
    render() {
        return (h("limel-list", { onChange: this.handleChange, type: "selectable", items: this.items }));
    }
    handleChange(event) {
        this.items = this.items.map((item) => {
            if (item.value === event.detail.value) {
                return event.detail;
            }
            return item;
        });
    }
    static get is() { return "limel-example-list-selectable"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "items": {
            "state": true
        }
    }; }
}

export { SelectableListExample as LimelExampleListSelectable };
