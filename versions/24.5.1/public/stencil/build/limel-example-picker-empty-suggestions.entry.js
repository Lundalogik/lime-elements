import { r as registerInstance, h } from './core-804afdbc.js';

const NETWORK_DELAY = 500;
const PickerExample = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.allItems = [
            { text: 'Admiral Swiggins', value: 1 },
            { text: 'Ayla', value: 2 },
            { text: 'Clunk', value: 3 },
            { text: 'Coco', value: 4 },
            { text: 'Derpl', value: 5 },
            { text: 'Froggy G', value: 6 },
            { text: 'Gnaw', value: 7 },
            { text: 'Lonestar', value: 8 },
            { text: 'Leon', value: 9 },
            { text: 'Raelynn', value: 10 },
            { text: 'Skølldir', value: 11 },
            { text: 'Voltar', value: 12 },
            { text: 'Yuri', value: 13 },
        ];
        this.required = false;
        this.readonly = false;
        this.disabled = false;
        this.search = this.search.bind(this);
        this.onChange = this.onChange.bind(this);
        this.setDisabled = this.setDisabled.bind(this);
        this.setReadonly = this.setReadonly.bind(this);
        this.setRequired = this.setRequired.bind(this);
    }
    render() {
        return [
            h("limel-picker", { label: "Favorite awesomenaut", value: this.selectedItem, searcher: this.search, emptyResultMessage: "No results", onChange: this.onChange, onInteract: this.onInteract, required: this.required, readonly: this.readonly, disabled: this.disabled }),
            h("p", null, h("limel-flex-container", { justify: "end" }, h("limel-checkbox", { label: "Disabled", onChange: this.setDisabled, checked: this.disabled }), h("limel-checkbox", { label: "Readonly", onChange: this.setReadonly, checked: this.readonly }), h("limel-checkbox", { label: "Required", onChange: this.setRequired, checked: this.required }))),
            h("p", null, "Value: ", h("code", null, JSON.stringify(this.selectedItem))),
        ];
    }
    search(query) {
        return new Promise(resolve => {
            if (query === '') {
                // Simulate some network delay
                setTimeout(() => {
                    resolve([]);
                }, NETWORK_DELAY);
            }
            // Simulate some network delay
            setTimeout(() => {
                const filteredItems = this.allItems.filter(item => {
                    return item.text
                        .toLowerCase()
                        .includes(query.toLowerCase());
                });
                resolve(filteredItems);
            }, NETWORK_DELAY);
        });
    }
    onChange(event) {
        this.selectedItem = event.detail;
    }
    onInteract(event) {
        console.log('Value interacted with:', event.detail);
    }
    setDisabled(event) {
        this.disabled = event.detail;
    }
    setReadonly(event) {
        this.readonly = event.detail;
    }
    setRequired(event) {
        this.required = event.detail;
    }
    static get style() { return "p {\n  font-size: small;\n}"; }
};

export { PickerExample as limel_example_picker_empty_suggestions };
