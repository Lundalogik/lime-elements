const h = window.LimeElements.h;

class SliderExample {
    constructor() {
        this.disabled = false;
        this.value = 25;
        this.minValue = 15;
        this.maxValue = 75;
        this.onChange = this.onChange.bind(this);
        this.toggleEnabled = this.toggleEnabled.bind(this);
    }
    render() {
        return (h("section", null,
            h("limel-slider", { label: "Basic slider", unit: "\u200A%", value: this.value, valuemax: this.maxValue, valuemin: this.minValue, disabled: this.disabled, onChange: this.onChange }),
            h("limel-flex-container", { justify: "end" },
                h("limel-button", { onClick: this.toggleEnabled, label: this.disabled ? 'Enable' : 'Disable' })),
            h("p", null,
                "Current value: ",
                this.value)));
    }
    onChange(event) {
        this.value = event.detail;
    }
    toggleEnabled() {
        this.disabled = !this.disabled;
    }
    static get is() { return "limel-example-slider"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "disabled": {
            "state": true
        },
        "value": {
            "state": true
        }
    }; }
    static get style() { return "p {\n  font-size: small;\n}"; }
}

export { SliderExample as LimelExampleSlider };
