import { r as registerInstance, h } from './core-804afdbc.js';

const ColorExample = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        return [
            h("limel-button", { label: "I'm blue!" }),
            h("br", null),
            h("br", null),
            h("limel-button", { primary: true, label: "Do not press!", style: {
                    '--lime-primary-color': 'var(--lime-red)',
                } }),
            h("br", null),
            h("br", null),
            h("div", { class: "box" }),
        ];
    }
    static get style() { return "limel-button {\n  --lime-primary-color: var(--lime-blue);\n}\n\n.box {\n  background-color: var(--lime-green);\n  width: 3.125rem;\n  height: 3.125rem;\n}"; }
};

export { ColorExample as limel_example_color };
