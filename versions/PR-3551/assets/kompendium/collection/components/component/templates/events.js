import { h } from '@stencil/core';
export function EventList({ events, id, }) {
    if (!events.length) {
        return;
    }
    return [h("h4", { id: id }, "Events"), ...events.map(renderEvent)];
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
    return (h("div", null,
        h("h5", null, event.event),
        h("kompendium-markdown", { text: event.docs }),
        h("kompendium-taglist", { tags: event.docsTags }),
        h("kompendium-proplist", { items: items })));
}
