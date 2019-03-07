const h = window.LimeElements.h;

const FRACTION = 100;
class LinearProgressExample {
    constructor() {
        this.value = 0.7;
    }
    render() {
        return [
            h("limel-input-field", { label: "Value", value: (this.value * FRACTION).toFixed(0), onChange: event => {
                    this.value = +event.detail / FRACTION;
                } }),
            h("br", null),
            h("limel-linear-progress", { value: this.value }),
        ];
    }
    static get is() { return "limel-example-linear-progress"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "value": {
            "state": true
        }
    }; }
}

export { LinearProgressExample as LimelExampleLinearProgress };
