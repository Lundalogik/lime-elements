const h = window.LimeElements.h;

class ListCheckboxIconsExample {
    constructor() {
        this.items = [
            {
                text: 'Pikachu',
                value: 1,
                selected: true,
                icon: 'pokemon',
                iconColor: 'var(--lime-yellow)',
            },
            {
                text: 'Charmander',
                value: 2,
                selected: false,
                disabled: true,
                icon: 'fire_element',
                iconColor: 'var(--lime-red)',
            },
            {
                text: 'Super Mario',
                value: 3,
                selected: false,
                icon: 'super_mario',
                iconColor: 'var(--lime-deep-red)',
            },
            {
                text: 'Yoshi',
                value: 4,
                selected: false,
                disabled: true,
                icon: 'easter_egg',
                iconColor: 'var(--lime-green)',
            },
            {
                text: 'Minion',
                value: 6,
                selected: true,
                icon: 'minion_1',
                iconColor: 'var(--lime-blue)',
            },
            {
                text: 'Pokéball',
                value: 5,
                selected: false,
                icon: 'pokeball',
                iconColor: 'var(--lime-magenta)',
            },
        ];
        this.selectedItems = [];
        this.selectedItems = this.items.filter(item => {
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
    static get is() { return "limel-example-list-checkbox-icons"; }
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

export { ListCheckboxIconsExample as LimelExampleListCheckboxIcons };
