import { h } from '@stencil/core';
import { PropertyList } from '../../component/templates/props';
import { MethodList } from '../../component/templates/methods';
export function Interface({ type, }) {
    return [
        h("h1", { id: type.name }, type.name),
        h("kompendium-markdown", { text: type.docs }),
        h("kompendium-taglist", { tags: type.docsTags }),
        h(PropertyList, { props: type.props }),
        h(MethodList, { methods: type.methods }),
    ];
}
