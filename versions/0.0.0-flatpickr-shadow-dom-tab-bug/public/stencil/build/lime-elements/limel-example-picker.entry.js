const h = window.LimeElements.h;

const NETWORK_DELAY = 500;
class PickerExample {
    constructor() {
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
        this.search = this.search.bind(this);
        this.onChange = this.onChange.bind(this);
    }
    render() {
        return [
            h("limel-picker", { label: "Favorite awesomenaut", value: this.selectedItem, searcher: this.search, onChange: this.onChange, onInteract: this.onInteract }),
            h("p", null,
                "Value: ",
                h("code", null, JSON.stringify(this.selectedItem))),
        ];
    }
    search(query) {
        return new Promise(resolve => {
            if (query === '') {
                resolve(this.allItems);
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
    static get is() { return "limel-example-picker"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "selectedItem": {
            "state": true
        }
    }; }
    static get style() { return "p {\n  font-size: small;\n}"; }
}

export { PickerExample as LimelExamplePicker };
