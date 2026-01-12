'use strict';

var index = require('./index-Ku28b8UE.js');

const KompendiumDebug = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
        /**
         * Factory for creating props for example components
         * @returns {Record<string, unknown>} props
         */
        this.examplePropsFactory = () => ({});
    }
    render() {
        const tag = this.match.params.name;
        const component = findComponent(tag, this.docs);
        return (index.h("article", { key: '29c045c23cd107d1d0006467db9abad681bb7e2e', class: "component" }, index.h("section", { key: 'ae3e9fe451f3663a720d2113d140f1efb42a5da8', class: "docs debug" }, this.renderComponent(component))));
    }
    renderComponent(component) {
        const ExampleComponent = component.tag;
        const ownerComponent = this.docs.components.find(isOwnerOf(component));
        const schema = this.schemas.find((s) => s.$id === ownerComponent.tag);
        const factory = this.examplePropsFactory;
        const props = {
            schema: schema,
            ...factory(ExampleComponent),
        };
        return (index.h("div", { class: "show-case" }, index.h("div", { class: "show-case_component" }, index.h(ExampleComponent, { ...props }))));
    }
};
function findComponent(tag, docs) {
    return docs.components.find((doc) => doc.tag === tag);
}
const isOwnerOf = (example) => (component) => {
    return !!component.docsTags
        .filter(isTag('exampleComponent'))
        .find(hasText(example.tag));
};
const isTag = (name) => (tag) => {
    return tag.name === name;
};
const hasText = (name) => (tag) => {
    return tag.text === name;
};

exports.kompendium_debug = KompendiumDebug;
//# sourceMappingURL=kompendium-debug.entry.cjs.js.map
