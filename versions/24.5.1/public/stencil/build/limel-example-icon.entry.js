import { r as registerInstance, h } from './core-804afdbc.js';

const IconExample = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        return [
            h("section", { class: "lime-green" }, h("h3", null, "X-small icons"), h("limel-icon", { name: "citrus", size: "x-small" }), h("limel-icon", { name: "alps", size: "x-small" }), h("limel-icon", { name: "ninja", size: "x-small" }), h("limel-icon", { name: "thor_hammer", size: "x-small" }), h("limel-icon", { name: "mate", size: "x-small" }), h("limel-icon", { name: "croissant", size: "x-small" })),
            h("section", { class: "loving-magenta" }, h("h3", null, "Small icons"), h("limel-icon", { name: "citrus", size: "small" }), h("limel-icon", { name: "curls_with_dumbbells", size: "small" }), h("limel-icon", { name: "bench_press", size: "small" }), h("limel-icon", { name: "squats", size: "small" }), h("limel-icon", { name: "pullups", size: "small" }), h("limel-icon", { name: "pushups", size: "small" })),
            h("section", { class: "simply-blue" }, h("h3", null, "Medium icons"), h("limel-icon", { name: "citrus", size: "medium" }), h("limel-icon", { name: "day_of_the_tentacle", size: "medium" }), h("limel-icon", { name: "bad_piggies", size: "medium" }), h("limel-icon", { name: "triforce", size: "medium" }), h("limel-icon", { name: "mana", size: "medium" }), h("limel-icon", { name: "pokemon", size: "medium" })),
            h("section", { class: "sellable-orange" }, h("h3", null, "Large icons"), h("limel-icon", { name: "citrus", size: "large" }), h("limel-icon", { name: "dragon", size: "large" }), h("limel-icon", { name: "caterpillar", size: "large" }), h("limel-icon", { name: "frog", size: "large" }), h("limel-icon", { name: "octopus", size: "large" }), h("limel-icon", { name: "gorilla", size: "large" })),
            h("section", { class: "custom-size" }, h("h3", null, "Custom sized icons"), h("p", null, " Size set in css."), h("limel-icon", { name: "citrus" }), h("limel-icon", { name: "strawberry" }), h("limel-icon", { name: "broccoli" }), h("limel-icon", { name: "paprika" }), h("limel-icon", { name: "pear" })),
        ];
    }
    static get style() { return ".lime-green limel-icon {\n  color: var(--lime-green);\n}\n\n.loving-magenta limel-icon {\n  color: var(--lime-magenta);\n}\n\n.simply-blue limel-icon {\n  color: var(--lime-blue);\n}\n\n.sellable-orange limel-icon {\n  color: var(--lime-orange);\n}\n\n.custom-size limel-icon {\n  height: 6.25rem;\n  width: 6.25rem;\n}"; }
};

export { IconExample as limel_example_icon };
