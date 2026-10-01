import { h } from "@stencil/core";
import { entrySlug } from "../anchors";
export function EventList({ events, id, slugId, }) {
    if (!events.length) {
        return;
    }
    return [
        slugId ? (h("span", { class: "section-anchor", id: slugId, "aria-hidden": "true" })) : null,
        h("h3", { class: "docs-layout-section-heading", id: id }, "Events", slugId ? h("kompendium-anchor", { slug: slugId, label: "Events" }) : null),
        ...events.map(renderEvent(slugId)),
    ];
}
const renderEvent = (sectionSlug) => (event) => {
    const items = [
        {
            key: 'Detail',
            value: event.detail,
        },
        {
            key: 'Bubbles',
            value: String(event.bubbles),
        },
        {
            key: 'Cancelable',
            value: String(event.cancelable),
        },
        {
            key: 'Composed',
            value: String(event.composed),
        },
    ];
    const slug = sectionSlug ? entrySlug(sectionSlug, event.event) : null;
    return (h("div", { class: "props-events-layout" }, h("h4", { id: slug }, event.event, slug ? (h("kompendium-anchor", { slug: slug, label: event.event })) : null), h("kompendium-taglist", { tags: event.docsTags }), h("div", { class: "markdown-props" }, h("kompendium-markdown", { text: event.docs }), h("kompendium-proplist", { items: items }))));
};
