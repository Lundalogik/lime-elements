import { r as registerInstance, h } from './core-804afdbc.js';

const DialogExample = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.isOpen = false;
        this.openDialog = this.openDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
    }
    render() {
        return [
            h("limel-button", { primary: true, label: "Open", onClick: this.openDialog }),
            h("limel-dialog", { open: this.isOpen, onClose: this.closeDialog }, h("p", null, "This is a simple alert-dialog."), h("limel-flex-container", { justify: "end", slot: "button" }, h("limel-button", { label: "Ok", onClick: this.closeDialog }))),
        ];
    }
    openDialog() {
        this.isOpen = true;
    }
    closeDialog() {
        this.isOpen = false;
    }
};

export { DialogExample as limel_example_dialog };
