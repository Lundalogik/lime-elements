import { h } from '@stencil/core';
export function Enum({ type }) {
    return [
        h("h1", { id: type.name }, type.name),
        h("kompendium-markdown", { text: type.docs }),
        h("kompendium-taglist", { tags: type.docsTags }),
        h(MemberList, { members: type.members }),
    ];
}
function MemberList({ members }) {
    if (!members.length) {
        return;
    }
    return [h("h3", null, "Members"), ...members.map(renderMember)];
}
function renderMember(member) {
    const items = [
        {
            key: 'Value',
            value: member.value,
        },
    ];
    return (h("div", null,
        h("h4", null, member.name),
        h("kompendium-markdown", { text: member.docs }),
        h("kompendium-taglist", { tags: member.docsTags }),
        h("kompendium-proplist", { items: items })));
}
