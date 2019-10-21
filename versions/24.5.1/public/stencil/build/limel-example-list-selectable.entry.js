import { r as registerInstance, h } from './core-804afdbc.js';

const SelectableListExample = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
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
};

export { SelectableListExample as limel_example_list_selectable };
