import { r as registerInstance, h, c as getElement } from './core-804afdbc.js';

const SNACKBAR_TIMEOUT = 5000;
const PickerExample = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.dismissible = false;
        this.triggerSnackbarWithoutAction = this.triggerSnackbar.bind(this, 'limel-snackbar');
        this.triggerSnackbarWithAction = this.triggerSnackbar.bind(this, 'limel-snackbar:last-child');
        this.onChange = this.onChange.bind(this);
    }
    render() {
        return [
            h("limel-checkbox", { label: "Dismissible", checked: this.dismissible, onChange: this.onChange }),
            h("br", null),
            h("br", null),
            h("limel-button", { primary: true, label: "Show snackbar", onClick: this.triggerSnackbarWithoutAction }),
            h("br", null),
            h("br", null),
            h("limel-button", { primary: true, label: "Show snackbar with action", onClick: this.triggerSnackbarWithAction }),
            h("limel-snackbar", { message: "Please do not leave your luggage unattended! It might be taken away!", timeout: SNACKBAR_TIMEOUT, dismissible: this.dismissible, onHide: this.snackbarWithoutActionOnHide }),
            h("limel-snackbar", { message: "Your luggage has been taken away!", actionText: "Reclaim", dismissible: this.dismissible, onAction: this.snackbarOnAction, onHide: this.snackbarWithActionOnHide }),
        ];
    }
    triggerSnackbar(selector) {
        const snackbar = this.host.shadowRoot.querySelector(selector);
        snackbar.show();
    }
    snackbarWithoutActionOnHide() {
        console.log('It will soon be taken away!');
    }
    snackbarOnAction() {
        console.log('You claimed your luggage!');
    }
    snackbarWithActionOnHide() {
        console.log('You were too late. Your luggage has been destroyed!');
    }
    onChange(event) {
        this.dismissible = event.detail;
    }
    get host() { return getElement(this); }
};

export { PickerExample as limel_example_snackbar };
