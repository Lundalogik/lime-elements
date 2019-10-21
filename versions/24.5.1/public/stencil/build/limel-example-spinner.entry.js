import { r as registerInstance, h } from './core-804afdbc.js';

const SpinnerExample = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        return [
            h("limel-spinner", null),
            h("limel-spinner", { size: "mini" }),
            h("limel-spinner", { size: "x-small" }),
            h("limel-spinner", { size: "small" }),
            h("limel-spinner", { size: "medium" }),
            h("limel-spinner", { size: "large" }),
        ];
    }
};

export { SpinnerExample as limel_example_spinner };
