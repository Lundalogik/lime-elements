import { h } from "@stencil/core";
import { entrySlug } from "../anchors";
export function PropertyList({ props, id, slugId, }) {
    if (!props.length) {
        return;
    }
    return [
        slugId ? (h("span", { class: "section-anchor", id: slugId, "aria-hidden": "true" })) : null,
        h("h3", { class: "docs-layout-section-heading", id: id }, "Properties", slugId ? (h("kompendium-anchor", { slug: slugId, label: "Properties" })) : null),
        ...props.map(renderProperty(slugId)),
    ];
}
const renderProperty = (sectionSlug) => (property) => {
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
    const slug = sectionSlug ? entrySlug(sectionSlug, property.name) : null;
    return (h("div", { class: "props-events-layout" }, h("h4", { id: slug }, property.name, slug ? (h("kompendium-anchor", { slug: slug, label: property.name })) : null), h("kompendium-taglist", { tags: property.docsTags }), h("div", { class: "markdown-props" }, h("kompendium-markdown", { text: property.docs }), h("kompendium-proplist", { items: items }))));
};
