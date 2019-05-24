const h = window.LimeElements.h;

class ListCheckboxExample {
    constructor() {
        this.items = [
            { text: 'Pikachu', value: 1, selected: true },
            { text: 'Charmander', value: 2, selected: false, disabled: true },
            { text: 'Super Mario', value: 3, selected: false },
            { separator: true },
            { text: 'Yoshi', value: 4, selected: false, disabled: true },
            { text: 'Minion', value: 6, selected: true },
            { text: 'Pokéball', value: 5, selected: false },
        ];
        this.selectedItems = [];
        this.selectedItems = this.items.filter((item) => {
            return !!item.selected;
        });
        this.handleChange = this.handleChange.bind(this);
    }
    render() {
        return [
            h("limel-list", { onChange: this.handleChange, items: this.items, type: "checkbox" }),
            h("p", null,
                "Value: ",
                h("code", null, JSON.stringify(this.selectedItems))),
        ];
    }
    handleChange(event) {
        this.selectedItems = event.detail;
        this.items = this.items.map((item) => {
            const selected = !!event.detail.find((selectedItem) => {
                return selectedItem.value === item.value;
            });
            return Object.assign({}, item, { selected: selected });
        });
    }
    static get is() { return "limel-example-list-checkbox"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "items": {
            "state": true
        },
        "selectedItems": {
            "state": true
        }
    }; }
    static get style() { return "p {\n  font-size: small;\n}"; }
}

export { ListCheckboxExample as LimelExampleListCheckbox };
