import { h } from "@stencil/core";
export function ExampleList({ examples, id, schema, propsFactory, }) {
    if (!examples.length) {
        return;
    }
    return [
        h("h3", { class: "docs-layout-section-heading", id: id }, "Examples"),
        examples.map(renderExample(schema, propsFactory)),
    ];
}
const renderExample = (schema, factory) => (example) => {
    return (h("kompendium-playground", { component: example, schema: schema, propsFactory: factory }));
};
export const isExampleTag = (name) => (tag) => {
    return tag.text.startsWith(name);
};
//# sourceMappingURL=examples.js.map
