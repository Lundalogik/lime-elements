import { h } from '@stencil/core';
export function PropertyList({ props, id, }) {
    if (!props.length) {
        return;
    }
    return [h("h4", { id: id }, "Properties"), ...props.map(renderProperty)];
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
    ];
    return (h("div", null,
        h("h5", null, property.name),
        h("kompendium-markdown", { text: property.docs }),
        h("kompendium-taglist", { tags: property.docsTags }),
        h("kompendium-proplist", { items: items })));
}
