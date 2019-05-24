const h = window.LimeElements.h;

class PickerMultipleExample {
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
        this.selectedItems = [];
        this.onChange = this.onChange.bind(this);
        this.search = this.search.bind(this);
    }
    render() {
        return [
            h("limel-picker", { label: "Favorite awesomenaut", value: this.selectedItems, multiple: true, searcher: this.search, onChange: this.onChange, onInteract: this.onInteract }),
            h("p", null,
                "Value: ",
                h("code", null, JSON.stringify(this.selectedItems))),
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
    static get is() { return "limel-example-picker-multiple"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "selectedItems": {
            "state": true
        }
    }; }
    static get style() { return "p {\n  font-size: small;\n}"; }
}

export { PickerMultipleExample as LimelExamplePickerMultiple };
