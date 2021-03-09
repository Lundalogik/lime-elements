import { h } from '@stencil/core';
export function ExampleList({ examples, id, }) {
    if (!examples.length) {
        return;
    }
    return [
        h("h3", { class: "docs-layout-section-heading", id: id }, "Examples"),
        examples.map(renderExample),
    ];
}
const renderExample = (example) => {
    return h("kompendium-playground", { component: example });
};
export const isExampleTag = (name) => (tag) => {
    return tag.text.startsWith(name);
};
