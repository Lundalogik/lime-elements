const h = window.LimeElements.h;

class DialogClosingActionsExample {
    constructor() {
        this.isOpen = false;
    }
    render() {
        return [
            h("limel-button", { primary: true, label: "Open", onClick: () => {
                    this.isOpen = true;
                } }),
            h("limel-dialog", { open: this.isOpen, closingActions: { escapeKey: false, scrimClick: false }, onClose: () => {
                    this.isOpen = false;
                } },
                h("p", null, "This dialog doesn't close by clicking the scrim or pressing the escape key. Only the Ok-button triggers a close event."),
                h("limel-flex-container", { justify: "end", slot: "button" },
                    h("limel-button", { label: "Ok", onClick: () => {
                            this.isOpen = false;
                        } }))),
        ];
    }
    static get is() { return "limel-example-dialog-closing-actions"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "isOpen": {
            "state": true
        }
    }; }
}

export { DialogClosingActionsExample as LimelExampleDialogClosingActions };
