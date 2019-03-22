const h = window.LimeElements.h;

class SliderExample {
    constructor() {
        this.disabled = true;
        this.basicExampleValue = 25;
        this.basicExampleMinValue = 15;
        this.basicExampleMaxValue = 75;
        this.factorExampleValue = 0.25;
        this.factor = 100;
        this.factorExampleMinValue = 0;
        this.factorExampleMaxValue = 1;
        this.disableExampleValue = 35;
        this.disableExampleMinValue = 0;
        this.disableExampleMaxValue = 100;
    }
    render() {
        return [
            h("section", null,
                h("h3", null, "Basic Usage"),
                h("limel-slider", { label: "Basic slider", unit: "\u200A%", value: this.basicExampleValue, valuemax: this.basicExampleMaxValue, valuemin: this.basicExampleMinValue, onChange: event => {
                        this.basicExampleValue = event.detail;
                    } }),
                h("p", null,
                    "Current value: ",
                    this.basicExampleValue)),
            h("section", null,
                h("h3", null, "With multiplier factor"),
                h("limel-slider", { label: "Slider with multiplier", unit: "\u200A%", value: this.factorExampleValue, factor: this.factor, valuemax: this.factorExampleMaxValue, valuemin: this.factorExampleMinValue, onChange: event => {
                        this.factorExampleValue = event.detail;
                    } }),
                h("p", null,
                    "Current value: ",
                    this.factorExampleValue)),
            h("section", null,
                h("h3", null, "Disabled"),
                h("limel-flex-container", { justify: "end" },
                    h("limel-button", { onClick: () => {
                            this.disabled = !this.disabled;
                        }, label: this.disabled ? 'Enable' : 'Disable' })),
                h("limel-slider", { label: "Can be disabled", disabled: this.disabled, unit: "\u200A%", value: this.disableExampleValue, valuemax: this.disableExampleMaxValue, valuemin: this.disableExampleMinValue, onChange: event => {
                        this.disableExampleValue = event.detail;
                    } }),
                h("p", null,
                    "Current value: ",
                    this.disableExampleValue)),
        ];
    }
    static get is() { return "limel-example-slider"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "basicExampleValue": {
            "state": true
        },
        "disabled": {
            "state": true
        },
        "disableExampleValue": {
            "state": true
        },
        "factorExampleValue": {
            "state": true
        }
    }; }
}

export { SliderExample as LimelExampleSlider };
