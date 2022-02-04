import { h } from '@stencil/core';
export function ExampleList({ examples, id, schema, }) {
  if (!examples.length) {
    return;
  }
  return [
    h("h3", { class: "docs-layout-section-heading", id: id }, "Examples"),
    examples.map(renderExample(schema)),
  ];
}
const renderExample = (schema) => (example) => {
  return h("kompendium-playground", { component: example, schema: schema });
};
export const isExampleTag = (name) => (tag) => {
  return tag.text.startsWith(name);
};
