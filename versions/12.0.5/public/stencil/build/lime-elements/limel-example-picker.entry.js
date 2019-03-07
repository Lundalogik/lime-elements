const h = window.LimeElements.h;

const NETWORK_DELAY = 500;
class PickerExample {
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
    }
    render() {
        return [
            h("limel-picker", { onChange: event => {
                    this.selectedItem = event.detail;
                }, label: "Favorite awesomenaut", searcher: this.search.bind(this), value: this.selectedItem }),
            h("br", null),
            h("br", null),
            h("div", null,
                "Value: ",
                h("code", null, JSON.stringify(this.selectedItem))),
            h("hr", null),
            h("p", null,
                "When importing ListItem or PickerSearchResult, see",
                ' ',
                h("a", { href: "/usage#import-statements" }, "Usage")),
        ];
    }
    search(query) {
        return new Promise(resolve => {
            if (query === '') {
                resolve([]);
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
    static get is() { return "limel-example-picker"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "selectedItem": {
            "state": true
        }
    }; }
}

export { PickerExample as LimelExamplePicker };
