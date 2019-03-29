const h = window.LimeElements.h;

class ListCheckboxExample {
    constructor() {
        this.allItems = [
            { text: 'Pikachu', value: 1, selected: true },
            { text: 'Charmander', value: 2, selected: false },
            { text: 'Super Mario', value: 3, selected: false },
            { separator: true },
            { text: 'Yoshi', value: 4, selected: false },
            { text: 'Minion', value: 6, selected: true },
            { text: 'Pokéball', value: 5, selected: false },
        ];
        this.selectedItems = [];
        this.selectedItems = this.allItems.filter((item) => {
            return !!item.selected;
        });
        this.handleChange = this.handleChange.bind(this);
    }
    render() {
        return [
            h("limel-list", { onChange: this.handleChange, selectable: true, items: this.allItems, multiple: true }),
            h("p", null,
                "Value: ",
                h("code", null, JSON.stringify(this.selectedItems))),
        ];
    }
    handleChange(event) {
        this.selectedItems = event.detail;
        this.allItems = this.allItems.map((item) => {
            const selected = !!event.detail.find((selectedItem) => {
                return selectedItem.value === item.value;
            });
            return Object.assign({}, item, { selected: selected });
        });
    }
    static get is() { return "limel-example-list-checkbox"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "allItems": {
            "state": true
        },
        "selectedItems": {
            "state": true
        }
    }; }
    static get style() { return "p {\n  font-size: small; }"; }
}

export { ListCheckboxExample as LimelExampleListCheckbox };
