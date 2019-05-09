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
        this.openDialog = this.openDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.onClosing = this.onClosing.bind(this);
        this.nameOnChange = this.nameOnChange.bind(this);
        this.ageOnChange = this.ageOnChange.bind(this);
        this.closeConfirmation = this.closeConfirmation.bind(this);
        this.onConfirmPositive = this.onConfirmPositive.bind(this);
        this.onConfirmNegative = this.onConfirmNegative.bind(this);
    }
    render() {
        return [
            h("limel-button", { primary: true, label: "Open", onClick: this.openDialog }),
            h("limel-dialog", { heading: "Registration", open: this.isOpen, onClose: this.closeDialog, onClosing: this.onClosing },
                h("form", null,
                    h("p", null,
                        h("limel-input-field", { label: "Name", value: this.name, required: true, invalid: !this.nameValid(), onChange: this.nameOnChange })),
                    h("p", null,
                        h("limel-input-field", { label: "Age", value: this.age, required: true, invalid: !this.ageValid(), onChange: this.ageOnChange })),
                    h("p", null,
                        h("limel-slider", { unit: "%", value: this.percentage }))),
                h("limel-flex-container", { slot: "button", reverse: true },
                    h("limel-button", { primary: true, label: "Save", disabled: !this.nameValid() || !this.ageValid(), onClick: this.submitForm }),
                    h("limel-button", { label: "Cancel", onClick: this.closeDialog }))),
            h("limel-dialog", { open: this.isConfirmationOpen, onClose: this.closeConfirmation },
                h("p", null, "Are you sure you want to close this? "),
                h("limel-flex-container", { justify: "end", reverse: true, slot: "button" },
                    h("limel-button", { label: "Yes", onClick: this.onConfirmPositive }),
                    h("limel-button", { label: "No", onClick: this.onConfirmNegative }))),
        ];
    }
    nameValid() {
        return this.name.length >= MIN_NAME_LENGTH;
    }
    ageValid() {
        return +this.age > MIN_AGE && +this.age < MAX_AGE;
    }
    openDialog() {
        this.isOpen = true;
    }
    closeDialog() {
        this.isOpen = false;
    }
    onClosing() {
        console.log('dialog is closing now!');
        this.isConfirmationOpen = true;
    }
    nameOnChange(event) {
        this.name = event.detail;
    }
    ageOnChange(event) {
        this.age = event.detail;
    }
    closeConfirmation() {
        this.isConfirmationOpen = false;
    }
    onConfirmPositive() {
        this.isConfirmationOpen = false;
        this.isOpen = false;
    }
    onConfirmNegative() {
        this.isOpen = true;
        this.isConfirmationOpen = false;
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
    static get style() { return "limel-flex-container limel-button:not(:first-child) {\n  margin-right: 0.625rem; }"; }
}

export { DialogFormExample as LimelExampleDialogForm };
