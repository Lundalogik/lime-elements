const h = window.LimeElements.h;

const FRACTION = 100;
class LinearProgressExample {
    constructor() {
        this.value = 0.7;
        this.onChange = this.onChange.bind(this);
    }
    render() {
        return [
            h("limel-input-field", { label: "Value", value: (this.value * FRACTION).toFixed(0), onChange: this.onChange }),
            h("p", null,
                h("limel-linear-progress", { value: this.value })),
        ];
    }
    onChange(event) {
        this.value = +event.detail / FRACTION;
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
