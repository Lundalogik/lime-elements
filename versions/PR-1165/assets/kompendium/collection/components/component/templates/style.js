import { h } from '@stencil/core';
export function StyleList({ styles, id, }) {
    if (!styles.length) {
        return;
    }
    return [
        h("h3", { class: "docs-layout-section-heading", id: id }, "Styles"),
        ...styles.map(renderStyle),
    ];
}
function renderStyle(style) {
    return (h("div", { class: "styles-layout" },
        h("div", { class: "styles-title" },
            h("code", null, style.name)),
        h("div", { class: "styles-content" },
            h("kompendium-markdown", { text: style.docs }))));
}
