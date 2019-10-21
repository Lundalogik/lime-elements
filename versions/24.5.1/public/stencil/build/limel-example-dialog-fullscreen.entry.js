import { r as registerInstance, h } from './core-804afdbc.js';

const DialogSizeExample = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.isOpen = false;
        this.openDialog = this.openDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
    }
    render() {
        return [
            h("limel-button", { primary: true, label: "Open", onClick: this.openDialog }),
            h("limel-dialog", { open: this.isOpen, fullscreen: true, onClose: this.closeDialog }, h("p", null, "This dialog is fullscreen"), h("limel-flex-container", { justify: "end", slot: "button" }, h("limel-button", { label: "Ok", onClick: this.closeDialog }))),
        ];
    }
    openDialog() {
        this.isOpen = true;
    }
    closeDialog() {
        this.isOpen = false;
    }
};

export { DialogSizeExample as limel_example_dialog_fullscreen };
