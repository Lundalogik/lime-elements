const h = window.LimeElements.h;

class InputFieldIconExample {
    constructor() {
        this.onChange = this.onChange.bind(this);
        this.onAction = this.onAction.bind(this);
    }
    render() {
        return (h("limel-input-field", { label: "Email address", type: "email", value: this.value, trailingIcon: "filled_message", onChange: this.onChange, onAction: this.onAction }));
    }
    onChange(event) {
        this.value = event.detail;
    }
    onAction() {
        console.log(`sending email to ${this.value}`);
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
