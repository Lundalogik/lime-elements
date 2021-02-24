import { h } from '@stencil/core';
export function PropertyList({ props, id, }) {
    if (!props.length) {
        return;
    }
    return [
        h("h3", { class: "docs-layout-section-heading", id: id }, "Properties"),
        ...props.map(renderProperty),
    ];
}
function renderProperty(property) {
    const items = [
        {
            key: 'Type',
            value: property.type,
        },
        {
            key: 'Attribute name',
            value: property.attr,
        },
        {
            key: 'Default value',
            value: property.default,
        },
        {
            key: 'Optional',
            value: String(property.optional),
        },
        {
            key: 'Required',
            value: String(property.required),
        },
    ].filter((item) => item.value !== undefined && item.value !== 'undefined');
    return (h("div", { class: "props-events-layout" },
        h("h4", null, property.name),
        h("kompendium-taglist", { tags: property.docsTags }),
        h("div", { class: "markdown-props" },
            h("kompendium-markdown", { text: property.docs }),
            h("kompendium-proplist", { items: items }))));
}
