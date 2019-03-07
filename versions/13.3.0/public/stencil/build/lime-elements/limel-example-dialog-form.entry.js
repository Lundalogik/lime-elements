const h = window.LimeElements.h;

const MIN_NAME_LENGTH = 5;
const MIN_AGE = 20;
const MAX_AGE = 50;
class DialogFormExample {
    constructor() {
        this.isOpen = false;
        this.name = '';
        this.percentage = 45;
        this.isConfirmationOpen = false;
        this.submitForm = () => {
            alert(`${this.name} is ${this.age} years old`);
            this.closeDialog();
        };
        this.closeDialog = () => {
            this.isOpen = false;
        };
    }
    render() {
        return [
            h("limel-button", { primary: true, label: "Open", onClick: () => {
                    this.isOpen = true;
                } }),
            h("limel-dialog", { heading: "Registration", open: this.isOpen, onClose: () => {
                    this.isOpen = false;
                }, onClosing: () => {
                    console.log('dialog is closing now!');
                    this.isConfirmationOpen = true;
                } },
                h("form", null,
                    h("p", null,
                        h("limel-input-field", { label: "Name", value: this.name, required: true, invalid: !this.nameValid(), onChange: event => {
                                this.name = event.detail;
                            } })),
                    h("p", null,
                        h("limel-input-field", { label: "Age", value: this.age, required: true, invalid: !this.ageValid(), onChange: event => {
                                this.age = event.detail;
                            } })),
                    h("p", null,
                        h("limel-slider", { unit: "%", value: this.percentage }))),
                h("limel-button-group", { class: "reverse-order", slot: "button" },
                    h("limel-button", { primary: true, label: "Save", disabled: !this.nameValid() || !this.ageValid(), onClick: this.submitForm }),
                    h("limel-button", { label: "Cancel", onClick: this.closeDialog }))),
            h("limel-dialog", { open: this.isConfirmationOpen, onClose: () => {
                    this.isConfirmationOpen = false;
                } },
                h("p", null, "Are you sure you want to close this? "),
                h("limel-button-group", { slot: "button" },
                    h("limel-button", { label: "Yes", onClick: () => {
                            this.isConfirmationOpen = false;
                            this.isOpen = false;
                        } }),
                    h("limel-button", { label: "No", onClick: () => {
                            this.isOpen = true;
                            this.isConfirmationOpen = false;
                        } }))),
        ];
    }
    nameValid() {
        return this.name.length >= MIN_NAME_LENGTH;
    }
    ageValid() {
        return +this.age > MIN_AGE && +this.age < MAX_AGE;
    }
    static get is() { return "limel-example-dialog-form"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "age": {
            "state": true
        },
        "isConfirmationOpen": {
            "state": true
        },
        "isOpen": {
            "state": true
        },
        "name": {
            "state": true
        },
        "percentage": {
            "state": true
        }
    }; }
}

export { DialogFormExample as LimelExampleDialogForm };
