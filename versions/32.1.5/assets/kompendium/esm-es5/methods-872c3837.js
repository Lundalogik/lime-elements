var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import { h } from './index-fb5abbae.js';
function PropertyList(_a) {
    var props = _a.props, id = _a.id;
    if (!props.length) {
        return;
    }
    return __spreadArrays([
        h("h3", { class: "docs-layout-section-heading", id: id }, "Properties")
    ], props.map(renderProperty));
}
function renderProperty(property) {
    var items = [
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
    ].filter(function (item) { return item.value !== undefined && item.value !== 'undefined'; });
    return (h("div", { class: "props-events-layout" }, h("h4", null, property.name), h("kompendium-taglist", { tags: property.docsTags }), h("div", { class: "markdown-props" }, h("kompendium-markdown", { text: property.docs }), h("kompendium-proplist", { items: items }))));
}
function MethodList(_a) {
    var methods = _a.methods, id = _a.id;
    if (!methods.length) {
        return;
    }
    return __spreadArrays([
        h("h3", { class: "docs-layout-section-heading", id: id }, "Methods")
    ], methods.map(renderMethod));
}
function renderMethod(method) {
    var items = [
        {
            key: 'Signature',
            value: method.signature,
        },
    ].filter(function (item) { return item.value !== undefined; });
    return (h("div", { class: "methods-layout" }, h("h4", { class: "methods-title" }, method.name), h("div", { class: "methods-content" }, h("div", null, h("kompendium-markdown", { text: method.docs })), h("div", null, h("kompendium-taglist", { tags: method.docsTags }), h("kompendium-proplist", { items: items }), h(ParamList, { params: method.parameters }))), h("div", { class: "methods-returns" }, h(Returns, { value: method.returns }))));
}
function ParamList(_a) {
    var params = _a.params;
    if (!params.length) {
        return;
    }
    return __spreadArrays([h("h5", null, "Parameters")], params.map(renderParam));
}
function renderParam(param) {
    var items = [
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
    ].filter(function (item) { return item.value !== undefined; });
    return (h("div", null, h("h6", null, param.name), h("kompendium-markdown", { text: param.docs }), h("kompendium-proplist", { items: items })));
}
function Returns(_a) {
    var value = _a.value;
    if (!value) {
        return;
    }
    var type = '`' + value.type + '`';
    return [
        h("h5", null, "Returns"),
        h("kompendium-markdown", { text: value.docs }),
        h("kompendium-markdown", { text: type }),
    ];
}
export { MethodList as M, PropertyList as P };
