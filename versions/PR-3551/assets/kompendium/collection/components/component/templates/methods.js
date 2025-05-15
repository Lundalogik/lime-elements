import { h } from '@stencil/core';
export function MethodList({ methods, id, }) {
    if (!methods.length) {
        return;
    }
    return [h("h4", { id: id }, "Methods"), ...methods.map(renderMethod)];
}
function renderMethod(method) {
    const items = [
        {
            key: 'Signature',
            value: method.signature,
        },
    ];
    return (h("div", null,
        h("h5", null, method.name),
        h("kompendium-markdown", { text: method.docs }),
        h("kompendium-taglist", { tags: method.docsTags }),
        h("kompendium-proplist", { items: items })));
}
