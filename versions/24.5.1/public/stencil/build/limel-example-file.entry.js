import { r as registerInstance, h } from './core-804afdbc.js';

const FileExample = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.value = { filename: 'bla.jpg', id: 123 };
        this.required = false;
        this.handleChange = this.handleChange.bind(this);
        this.toggleRequired = this.toggleRequired.bind(this);
    }
    render() {
        return [
            h("limel-switch", { label: "Toggle required", value: this.required, onChange: this.toggleRequired }),
            h("limel-file", { label: "File", value: this.value, required: this.required, onChange: this.handleChange }),
        ];
    }
    handleChange(event) {
        this.value = event.detail;
        console.log('onChange', this.value);
    }
    toggleRequired() {
        this.required = !this.required;
    }
};

export { FileExample as limel_example_file };
