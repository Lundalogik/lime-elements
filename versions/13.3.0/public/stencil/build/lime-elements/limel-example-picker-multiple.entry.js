const h = window.LimeElements.h;

class PickerMultipleExample {
    constructor() {
        this.allItems = [
            { text: 'Admiral Swiggins', id: 1 },
            { text: 'Ayla', id: 2 },
            { text: 'Clunk', id: 3 },
            { text: 'Coco', id: 4 },
            { text: 'Derpl', id: 5 },
            { text: 'Froggy G', id: 6 },
            { text: 'Gnaw', id: 7 },
            { text: 'Lonestar', id: 8 },
            { text: 'Leon', id: 9 },
            { text: 'Raelynn', id: 10 },
            { text: 'Skølldir', id: 11 },
            { text: 'Voltar', id: 12 },
            { text: 'Yuri', id: 13 },
        ];
        this.selectedItems = [];
    }
    render() {
        return [
            h("limel-picker", { multiple: true, onChange: event => {
                    this.selectedItems = [...event.detail];
                }, label: "Favorite awesomenaut", searcher: this.search.bind(this), value: this.selectedItems }),
            h("br", null),
            h("br", null),
            h("div", null,
                "Value: ",
                h("code", null, JSON.stringify(this.selectedItems))),
            h("hr", null),
            h("p", null,
                "When importing ListItem or PickerSearchResult, see",
                ' ',
                h("a", { href: "/usage#import-statements" }, "Usage")),
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
    static get is() { return "limel-example-picker-multiple"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "selectedItems": {
            "state": true
        }
    }; }
}

export { PickerMultipleExample as LimelExamplePickerMultiple };
