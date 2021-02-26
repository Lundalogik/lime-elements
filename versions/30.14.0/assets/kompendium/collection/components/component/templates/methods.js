import { h } from '@stencil/core';
export function MethodList({ methods, id, }) {
    if (!methods.length) {
        return;
    }
    return [
        h("h3", { class: "docs-layout-section-heading", id: id }, "Methods"),
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
    return (h("div", { class: "methods-layout" },
        h("h4", { class: "methods-title" }, method.name),
        h("div", { class: "methods-content" },
            h("div", null,
                h("kompendium-markdown", { text: method.docs })),
            h("div", null,
                h("kompendium-taglist", { tags: method.docsTags }),
                h("kompendium-proplist", { items: items }),
                h(ParamList, { params: method.parameters }))),
        h("div", { class: "methods-returns" },
            h(Returns, { value: method.returns }))));
}
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
    return (h("div", null,
        h("h6", null, param.name),
        h("kompendium-markdown", { text: param.docs }),
        h("kompendium-proplist", { items: items })));
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
