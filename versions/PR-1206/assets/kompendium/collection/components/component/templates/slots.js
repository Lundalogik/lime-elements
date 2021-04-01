import { h } from '@stencil/core';
export function SlotList({ slots, id, }) {
    if (!slots.length) {
        return;
    }
    return [
        h("h3", { class: "docs-layout-section-heading", id: id }, "Slots"),
        ...slots.map(renderSlot),
    ];
}
function renderSlot(slot) {
    return (h("div", null,
        h("h4", null, slot.name),
        h("kompendium-markdown", { text: slot.docs })));
}
