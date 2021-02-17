import { h } from '@stencil/core';
export function EventList({ events, id, }) {
    if (!events.length) {
        return;
    }
    return [
        h("h3", { class: "docs-layout-section-heading", id: id }, "Events"),
        ...events.map(renderEvent),
    ];
}
function renderEvent(event) {
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
    return (h("div", { class: "props-events-layout" },
        h("h4", null, event.event),
        h("kompendium-taglist", { tags: event.docsTags }),
        h("div", { class: "markdown-props" },
            h("kompendium-markdown", { text: event.docs }),
            h("kompendium-proplist", { items: items }))));
}
