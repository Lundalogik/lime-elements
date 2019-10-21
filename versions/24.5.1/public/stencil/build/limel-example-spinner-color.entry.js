import { r as registerInstance, h } from './core-804afdbc.js';

const SpinnerColorExample = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        return [
            h("limel-spinner", { style: { color: 'orange' } }),
            h("div", { style: { color: 'blue' } }, h("limel-spinner", null)),
        ];
    }
};

export { SpinnerColorExample as limel_example_spinner_color };
