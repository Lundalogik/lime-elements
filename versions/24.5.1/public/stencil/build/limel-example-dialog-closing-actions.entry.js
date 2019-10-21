import { r as registerInstance, h } from './core-804afdbc.js';

const DialogClosingActionsExample = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.isOpen = false;
        this.triggerOnClick = this.triggerOnClick.bind(this);
        this.onClose = this.onClose.bind(this);
        this.okOnClick = this.okOnClick.bind(this);
    }
    render() {
        return [
            h("limel-button", { primary: true, label: "Open", onClick: this.triggerOnClick }),
            h("limel-dialog", { open: this.isOpen, closingActions: { escapeKey: false, scrimClick: false }, onClose: this.onClose }, h("p", null, "This dialog doesn't close by clicking the scrim or pressing the escape key. Only the Ok-button triggers a close event."), h("limel-flex-container", { justify: "end", slot: "button" }, h("limel-button", { label: "Ok", onClick: this.okOnClick }))),
        ];
    }
    triggerOnClick() {
        this.isOpen = true;
    }
    okOnClick() {
        this.isOpen = false;
    }
    onClose() {
        this.isOpen = false;
    }
};

export { DialogClosingActionsExample as limel_example_dialog_closing_actions };
