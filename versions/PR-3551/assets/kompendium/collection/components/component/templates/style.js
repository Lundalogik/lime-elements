import { h } from '@stencil/core';
export function StyleList({ styles, id, }) {
    if (!styles.length) {
        return;
    }
    return [h("h4", { id: id }, "Styles"), ...styles.map(renderStyle)];
}
function renderStyle(style) {
    return (h("div", null,
        h("h5", null, style.name),
        h("kompendium-markdown", { text: style.docs })));
}
