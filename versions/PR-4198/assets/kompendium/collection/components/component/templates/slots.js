import { h } from "@stencil/core";
import { entrySlug } from "../anchors";
import { slotDisplayName } from "../slots";
export function SlotList({ slots, id, slugId, }) {
    if (!slots.length) {
        return;
    }
    return [
        slugId ? (h("span", { class: "section-anchor", id: slugId, "aria-hidden": "true" })) : null,
        h("h3", { class: "docs-layout-section-heading", id: id }, "Slots", slugId ? h("kompendium-anchor", { slug: slugId, label: "Slots" }) : null),
        ...slots.map(renderSlot(slugId)),
    ];
}
const renderSlot = (sectionSlug) => (slot) => {
    const name = slotDisplayName(slot.name);
    const slug = sectionSlug ? entrySlug(sectionSlug, name) : null;
    return (h("div", null, h("h4", { id: slug }, name, slug ? (h("kompendium-anchor", { slug: slug, label: name })) : null), h("kompendium-markdown", { text: slot.docs })));
};
