const h = window.LimeElements.h;

class DialogSizeExample {
    constructor() {
        this.isOpen = false;
        this.openDialog = this.openDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
    }
    render() {
        return [
            h("limel-button", { primary: true, label: "Open", onClick: this.openDialog }),
            h("limel-dialog", { open: this.isOpen, onClose: this.closeDialog },
                h("p", null, "This dialog has a custom size set through CSS variables:"),
                h("p", null,
                    h("code", null, "--dialog-width: pxToRem(400)")),
                h("p", null,
                    h("code", null, "--dialog-height: 50%")),
                h("limel-flex-container", { justify: "end", slot: "button" },
                    h("limel-button", { label: "Ok", onClick: this.closeDialog }))),
        ];
    }
    openDialog() {
        this.isOpen = true;
    }
    closeDialog() {
        this.isOpen = false;
    }
    static get is() { return "limel-example-dialog-size"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "isOpen": {
            "state": true
        }
    }; }
    static get style() { return "limel-dialog {\n  --dialog-width: pxToRem(400);\n  --dialog-height: 50%;\n}"; }
}

export { DialogSizeExample as LimelExampleDialogSize };
