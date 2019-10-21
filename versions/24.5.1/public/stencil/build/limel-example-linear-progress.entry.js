import { r as registerInstance, h } from './core-804afdbc.js';

const FRACTION = 100;
const LinearProgressExample = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.value = 0.7;
        this.onChange = this.onChange.bind(this);
    }
    render() {
        return [
            h("limel-input-field", { label: "Value", value: (this.value * FRACTION).toFixed(0), onChange: this.onChange }),
            h("p", null, h("limel-linear-progress", { value: this.value })),
        ];
    }
    onChange(event) {
        this.value = +event.detail / FRACTION;
    }
};

export { LinearProgressExample as limel_example_linear_progress };
