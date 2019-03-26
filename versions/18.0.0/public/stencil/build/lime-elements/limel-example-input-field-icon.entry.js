const h = window.LimeElements.h;

class InputFieldIconExample {
    render() {
        return (h("limel-input-field", { label: "Email address", type: "email", value: this.value, trailingIcon: "filled_message", onChange: event => {
                this.value = event.detail;
            }, onAction: () => {
                console.log(`sending email to ${this.value}`);
            } }));
    }
    static get is() { return "limel-example-input-field-icon"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "value": {
            "state": true
        }
    }; }
}

export { InputFieldIconExample as LimelExampleInputFieldIcon };
