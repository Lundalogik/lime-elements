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
            h("limel-dialog", { open: this.isOpen, fullscreen: true, onClose: this.closeDialog },
                h("p", null, "This dialog is fullscreen"),
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
    static get is() { return "limel-example-dialog-fullscreen"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "isOpen": {
            "state": true
        }
    }; }
}

export { DialogSizeExample as LimelExampleDialogFullscreen };
