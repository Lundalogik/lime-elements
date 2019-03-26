const h = window.LimeElements.h;

class DialogExample {
    constructor() {
        this.isOpen = false;
    }
    render() {
        return [
            h("limel-button", { primary: true, label: "Open", onClick: () => {
                    this.isOpen = true;
                } }),
            h("limel-dialog", { open: this.isOpen, onClose: () => {
                    this.isOpen = false;
                } },
                h("p", null, "This is a simple alert-dialog."),
                h("limel-flex-container", { justify: "end", slot: "button" },
                    h("limel-button", { label: "Ok", onClick: () => {
                            this.isOpen = false;
                        } }))),
        ];
    }
    static get is() { return "limel-example-dialog"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "isOpen": {
            "state": true
        }
    }; }
}

export { DialogExample as LimelExampleDialog };
