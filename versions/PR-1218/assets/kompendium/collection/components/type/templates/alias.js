import { h } from '@stencil/core';
export function Alias({ type }) {
    const alias = '`' + type.alias + '`';
    return [
        h("h1", { id: type.name }, type.name),
        h("kompendium-markdown", { text: type.docs }),
        h("kompendium-taglist", { tags: type.docsTags }),
        h("kompendium-markdown", { text: alias }),
    ];
}
