import { r as registerInstance, h } from './core-804afdbc.js';

const SliderExample = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.disabled = false;
        this.value = 25;
        this.minValue = 15;
        this.maxValue = 75;
        this.onChange = this.onChange.bind(this);
        this.toggleEnabled = this.toggleEnabled.bind(this);
    }
    render() {
        return (h("section", null, h("limel-slider", { label: "Basic slider", unit: "\u200A%", value: this.value, valuemax: this.maxValue, valuemin: this.minValue, disabled: this.disabled, onChange: this.onChange }), h("limel-flex-container", { justify: "end" }, h("limel-button", { onClick: this.toggleEnabled, label: this.disabled ? 'Enable' : 'Disable' })), h("p", null, "Current value: ", this.value)));
    }
    onChange(event) {
        this.value = event.detail;
    }
    toggleEnabled() {
        this.disabled = !this.disabled;
    }
    static get style() { return "p {\n  font-size: small;\n}"; }
};

export { SliderExample as limel_example_slider };
