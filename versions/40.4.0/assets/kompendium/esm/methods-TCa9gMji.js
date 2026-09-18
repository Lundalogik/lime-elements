import { h } from './index-26EzvxF0.js';
import { e as entrySlug } from './anchors-Dbl3lcfk.js';

function PropertyList({ props, id, slugId, }) {
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

function MethodList({ methods, id, slugId, }) {
    if (!methods.length) {
        return;
    }
    return [
        slugId ? (h("span", { class: "section-anchor", id: slugId, "aria-hidden": "true" })) : null,
        h("h3", { class: "docs-layout-section-heading", id: id }, "Methods", slugId ? (h("kompendium-anchor", { slug: slugId, label: "Methods" })) : null),
        ...methods.map(renderMethod(slugId)),
    ];
}
const renderMethod = (sectionSlug) => (method) => {
    const items = [
        {
            key: 'Signature',
            value: method.signature,
        },
    ].filter((item) => item.value !== undefined);
    const slug = sectionSlug ? entrySlug(sectionSlug, method.name) : null;
    return (h("div", { class: "methods-layout" }, h("h4", { class: "methods-title", id: slug }, method.name, slug ? (h("kompendium-anchor", { slug: slug, label: method.name })) : null), h("div", { class: "methods-content" }, h("div", null, h("kompendium-markdown", { text: method.docs })), h("div", null, h("kompendium-taglist", { tags: method.docsTags }), h("kompendium-proplist", { items: items }), h(ParamList, { params: method.parameters }))), h("div", { class: "methods-returns" }, h(Returns, { value: method.returns }))));
};
function ParamList({ params }) {
    if (!params.length) {
        return;
    }
    return [h("h5", null, "Parameters"), ...params.map(renderParam)];
}
function renderParam(param) {
    const items = [
        {
            key: 'Type',
            value: param.type,
        },
        {
            key: 'Optional',
            value: String(param.optional),
        },
        {
            key: 'Default',
            value: param.default,
        },
    ].filter((item) => item.value !== undefined);
    return (h("div", null, h("h6", null, param.name), h("kompendium-markdown", { text: param.docs }), h("kompendium-proplist", { items: items })));
}
function Returns({ value }) {
    if (!value) {
        return;
    }
    const type = '`' + value.type + '`';
    return [
        h("h5", null, "Returns"),
        h("kompendium-markdown", { text: value.docs }),
        h("kompendium-markdown", { text: type }),
    ];
}

export { MethodList as M, PropertyList as P };
