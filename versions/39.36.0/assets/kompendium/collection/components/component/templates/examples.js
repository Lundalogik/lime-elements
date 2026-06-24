import { h } from "@stencil/core";
export function ExampleList({ examples, slugs, id, slugId, schema, propsFactory, }) {
    if (!examples.length) {
        return;
    }
    return [
        slugId ? (h("span", { class: "section-anchor", id: slugId, "aria-hidden": "true" })) : null,
        h("h2", { class: "docs-layout-section-heading", id: id }, "Examples", slugId ? (h("kompendium-anchor", { slug: slugId, label: "Examples" })) : null),
        examples.map(renderExample(slugs, schema, propsFactory)),
    ];
}
const renderExample = (slugs, schema, factory) => (example, index) => {
    const slug = slugs[index];
    return (h("div", { class: "example-wrapper", id: slug }, h("kompendium-playground", { anchorSlug: slug, component: example, schema: schema, propsFactory: factory })));
};
export const isExampleTag = (name) => (tag) => {
    return tag.text.startsWith(name);
};
