const h = window.LimeElements.h;

class SliderMultiplierExample {
    constructor() {
        this.value = 0.25;
        this.factor = 100;
        this.minValue = 0;
        this.maxValue = 1;
        this.onChange = this.onChange.bind(this);
    }
    render() {
        return (h("section", null,
            h("limel-slider", { label: "Slider with multiplier", unit: "\u200A%", value: this.value, factor: this.factor, valuemax: this.maxValue, valuemin: this.minValue, onChange: this.onChange }),
            h("p", null,
                "Current value: ",
                this.value)));
    }
    onChange(event) {
        this.value = event.detail;
    }
    static get is() { return "limel-example-slider-multiplier"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "value": {
            "state": true
        }
    }; }
    static get style() { return "p {\n  font-size: small;\n}"; }
}

export { SliderMultiplierExample as LimelExampleSliderMultiplier };
