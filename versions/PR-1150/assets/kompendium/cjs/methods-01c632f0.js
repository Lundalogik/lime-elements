'use strict';

const index = require('./index-11d6cb66.js');

function PropertyList({ props, id, }) {
    if (!props.length) {
        return;
    }
    return [
        index.h("h3", { class: "docs-layout-section-heading", id: id }, "Properties"),
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
    return (index.h("div", { class: "props-events-layout" },
        index.h("h4", null, property.name),
        index.h("kompendium-taglist", { tags: property.docsTags }),
        index.h("div", { class: "markdown-props" },
            index.h("kompendium-markdown", { text: property.docs }),
            index.h("kompendium-proplist", { items: items }))));
}

function MethodList({ methods, id, }) {
    if (!methods.length) {
        return;
    }
    return [
        index.h("h3", { class: "docs-layout-section-heading", id: id }, "Methods"),
        ...methods.map(renderMethod),
    ];
}
function renderMethod(method) {
    const items = [
        {
            key: 'Signature',
            value: method.signature,
        },
    ].filter((item) => item.value !== undefined);
    return (index.h("div", { class: "methods-layout" },
        index.h("h4", { class: "methods-title" }, method.name),
        index.h("div", { class: "methods-content" },
            index.h("div", null,
                index.h("kompendium-markdown", { text: method.docs })),
            index.h("div", null,
                index.h("kompendium-taglist", { tags: method.docsTags }),
                index.h("kompendium-proplist", { items: items }),
                index.h(ParamList, { params: method.parameters }))),
        index.h("div", { class: "methods-returns" },
            index.h(Returns, { value: method.returns }))));
}
function ParamList({ params }) {
    if (!params.length) {
        return;
    }
    return [index.h("h5", null, "Parameters"), ...params.map(renderParam)];
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
    return (index.h("div", null,
        index.h("h6", null, param.name),
        index.h("kompendium-markdown", { text: param.docs }),
        index.h("kompendium-proplist", { items: items })));
}
function Returns({ value }) {
    if (!value) {
        return;
    }
    const type = '`' + value.type + '`';
    return [
        index.h("h5", null, "Returns"),
        index.h("kompendium-markdown", { text: value.docs }),
        index.h("kompendium-markdown", { text: type }),
    ];
}

exports.MethodList = MethodList;
exports.PropertyList = PropertyList;
