const h = window.LimeElements.h;

class CollapsibleSectionExample {
    constructor() {
        this.secondExampleIsOpen = false;
        this.percentage = 34;
        this.toggleSecondExample = this.toggleSecondExample.bind(this);
        this.secondExampleOnOpen = this.secondExampleOnOpen.bind(this);
        this.secondExampleOnClose = this.secondExampleOnClose.bind(this);
    }
    render() {
        return [
            h("section", null,
                h("h3", null, "Basic example"),
                h("limel-collapsible-section", { header: "This text becomes the header" },
                    h("p", null, "This element becomes the body."))),
            h("hr", null),
            h("section", null,
                h("h3", null, "Closing and opening from outside the component"),
                h("limel-flex-container", { justify: "end" },
                    h("limel-button", { label: 'toggle', primary: true, onClick: this.toggleSecondExample })),
                h("limel-collapsible-section", { header: "Click me or click the button", isOpen: this.secondExampleIsOpen, onOpen: this.secondExampleOnOpen, onClose: this.secondExampleOnClose },
                    h("p", null,
                        "Either way, the section will toggle!",
                        h("limel-slider", { unit: "%", value: this.percentage })))),
        ];
    }
    toggleSecondExample() {
        this.secondExampleIsOpen = !this.secondExampleIsOpen;
    }
    secondExampleOnOpen() {
        console.log('Second example opened');
        this.secondExampleIsOpen = true;
    }
    secondExampleOnClose() {
        console.log('Second example closed');
        this.secondExampleIsOpen = false;
    }
    static get is() { return "limel-example-collapsible-section"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "percentage": {
            "state": true
        },
        "secondExampleIsOpen": {
            "state": true
        }
    }; }
}

export { CollapsibleSectionExample as LimelExampleCollapsibleSection };
