import { r as registerInstance, h } from './core-804afdbc.js';

const InputFieldIconExample = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
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
};

export { InputFieldIconExample as limel_example_input_field_icon };
