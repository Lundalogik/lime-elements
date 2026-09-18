import { h } from "@stencil/core";
import { entrySlug } from "../anchors";
export function StyleList({ styles, id, slugId, }) {
    if (!styles.length) {
        return;
    }
    return [
        slugId ? (h("span", { class: "section-anchor", id: slugId, "aria-hidden": "true" })) : null,
        h("h3", { class: "docs-layout-section-heading", id: id }, "Styles", slugId ? h("kompendium-anchor", { slug: slugId, label: "Styles" }) : null),
        ...styles.map(renderStyle(slugId)),
    ];
}
const renderStyle = (sectionSlug) => (style) => {
    const slug = sectionSlug ? entrySlug(sectionSlug, style.name) : null;
    return (h("div", { class: "styles-layout" }, h("div", { class: "styles-title", id: slug }, h("code", null, style.name), slug ? (h("kompendium-anchor", { slug: slug, label: style.name })) : null), h("div", { class: "styles-content" }, h("kompendium-markdown", { text: style.docs }))));
};
