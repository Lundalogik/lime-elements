import { r as registerInstance, h } from './core-804afdbc.js';

const SliderMultiplierExample = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.value = 0.25;
        this.factor = 100;
        this.minValue = 0;
        this.maxValue = 1;
        this.onChange = this.onChange.bind(this);
    }
    render() {
        return (h("section", null, h("limel-slider", { label: "Slider with multiplier", unit: "\u200A%", value: this.value, factor: this.factor, valuemax: this.maxValue, valuemin: this.minValue, onChange: this.onChange }), h("p", null, "Current value: ", this.value)));
    }
    onChange(event) {
        this.value = event.detail;
    }
    static get style() { return "p {\n  font-size: small;\n}"; }
};

export { SliderMultiplierExample as limel_example_slider_multiplier };
