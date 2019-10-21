import { r as registerInstance, h } from './core-804afdbc.js';

const PickerMultipleExample = class {
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
        this.selectedItems = [];
        this.required = false;
        this.readonly = false;
        this.disabled = false;
        this.onChange = this.onChange.bind(this);
        this.search = this.search.bind(this);
        this.setDisabled = this.setDisabled.bind(this);
        this.setReadonly = this.setReadonly.bind(this);
        this.setRequired = this.setRequired.bind(this);
    }
    render() {
        return [
            h("limel-picker", { label: "Favorite awesomenaut", value: this.selectedItems, multiple: true, searcher: this.search, onChange: this.onChange, onInteract: this.onInteract, required: this.required, readonly: this.readonly, disabled: this.disabled }),
            h("p", null, h("limel-flex-container", { justify: "end" }, h("limel-checkbox", { label: "Disabled", onChange: this.setDisabled, checked: this.disabled }), h("limel-checkbox", { label: "Readonly", onChange: this.setReadonly, checked: this.readonly }), h("limel-checkbox", { label: "Required", onChange: this.setRequired, checked: this.required }))),
            h("p", null, "Value: ", h("code", null, JSON.stringify(this.selectedItems))),
        ];
    }
    search(query) {
        return new Promise(resolve => {
            // Simulate some network delay
            const NETWORK_DELAY = 500;
            setTimeout(() => {
                if (query === '') {
                    const NUMBER_OF_SUGGESTIONS = 3;
                    resolve(this.allItems.slice(0, NUMBER_OF_SUGGESTIONS));
                    return;
                }
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
        this.selectedItems = [...event.detail];
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

export { PickerMultipleExample as limel_example_picker_multiple };
