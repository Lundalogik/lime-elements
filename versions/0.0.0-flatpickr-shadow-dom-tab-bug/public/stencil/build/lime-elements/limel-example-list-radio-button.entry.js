const h = window.LimeElements.h;

class ListRadioButtonExample {
    constructor() {
        this.items = [
            { text: 'Pikachu', value: 1, selected: false },
            { text: 'Charmander', value: 2, selected: false, disabled: true },
            { text: 'Super Mario', value: 3, selected: false },
            { separator: true },
            { text: 'Yoshi', value: 4, selected: false, disabled: true },
            { text: 'Minion', value: 6, selected: true },
            { text: 'Pokéball', value: 5, selected: false },
        ];
        this.selectedItem = this.items.filter((item) => {
            return !!item.selected;
        })[0];
        this.handleChange = this.handleChange.bind(this);
    }
    render() {
        return [
            h("limel-list", { onChange: this.handleChange, items: this.items, type: "radio" }),
            h("p", null,
                "Value: ",
                h("code", null, JSON.stringify(this.selectedItem))),
        ];
    }
    handleChange(event) {
        this.selectedItem = event.detail;
        this.items = this.items.map((item) => {
            if (item.value === event.detail.value) {
                return event.detail;
            }
            return item;
        });
    }
    static get is() { return "limel-example-list-radio-button"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "items": {
            "state": true
        },
        "selectedItem": {
            "state": true
        }
    }; }
    static get style() { return "p {\n  font-size: small;\n}"; }
}

export { ListRadioButtonExample as LimelExampleListRadioButton };
