import { r as registerInstance, h } from './core-804afdbc.js';

const IconButtonExample = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.disabled = false;
        this.toggleEnabled = this.toggleEnabled.bind(this);
    }
    render() {
        return [
            h("limel-icon-button", { label: "Add favourite", icon: "heart_outlined", disabled: this.disabled, onClick: this.onClick }),
            h("limel-flex-container", { justify: "end" }, h("limel-button", { onClick: this.toggleEnabled, label: this.disabled ? 'Enable' : 'Disable' })),
        ];
    }
    onClick() {
        console.log('Button clicked.');
    }
    toggleEnabled() {
        this.disabled = !this.disabled;
    }
};

export { IconButtonExample as limel_example_icon_button };
