import { r as registerInstance, h } from './core-804afdbc.js';

const GridExample = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        return (h("limel-grid", null, h("my-deep-red-component", null), h("my-red-component", null), h("my-orange-component", null), h("my-yellow-component", null), h("my-green-component", null), h("my-turquoise-component", null), h("my-blue-component", null), h("my-dark-blue-component", null), h("my-magenta-component", null), h("my-light-grey-component", null), h("my-dark-grey-component", null)));
    }
    static get style() { return "my-deep-red-component {\n  grid-area: drd;\n}\n\nmy-red-component {\n  grid-area: red;\n}\n\nmy-orange-component {\n  grid-area: ora;\n}\n\nmy-yellow-component {\n  grid-area: yel;\n}\n\nmy-green-component {\n  grid-area: grn;\n}\n\nmy-turquoise-component {\n  grid-area: trq;\n}\n\nmy-blue-component {\n  grid-area: blu;\n}\n\nmy-dark-blue-component {\n  grid-area: dbl;\n}\n\nmy-magenta-component {\n  grid-area: mag;\n}\n\nmy-light-grey-component {\n  grid-area: lgr;\n}\n\nmy-dark-grey-component {\n  grid-area: dgr;\n}\n\nlimel-grid {\n  --lime-grid-columns: 4;\n  --lime-grid-area:\n      \"drd drd blu dbl\"\n      \"trq trq blu dbl\"\n      \"red red red red\"\n      \"dgr mag mag lgr\"\n      \"ora ora yel yel\"\n      \"grn grn .   .  \"\n      \"grn grn .   .  \";\n}\n\nmy-deep-red-component {\n  background-color: var(--lime-deep-red);\n}\n\nmy-red-component {\n  background-color: var(--lime-red);\n}\n\nmy-orange-component {\n  background-color: var(--lime-orange);\n}\n\nmy-yellow-component {\n  background-color: var(--lime-yellow);\n}\n\nmy-green-component {\n  background-color: var(--lime-green);\n}\n\nmy-turquoise-component {\n  background-color: var(--lime-turquoise);\n}\n\nmy-blue-component {\n  background-color: var(--lime-blue);\n}\n\nmy-dark-blue-component {\n  background-color: var(--lime-dark-blue);\n}\n\nmy-magenta-component {\n  background-color: var(--lime-magenta);\n}\n\nmy-light-grey-component {\n  background-color: var(--lime-light-grey);\n}\n\nmy-dark-grey-component {\n  background-color: var(--lime-dark-grey);\n}"; }
};

export { GridExample as limel_example_grid };
