import { r as registerInstance, h } from './index-DOaZxWLP.js';

const KompendiumDebug = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        /**
         * Factory for creating props for example components
         * @returns {Record<string, unknown>} props
         */
        this.examplePropsFactory = () => ({});
    }
    render() {
        const tag = this.match.params.name;
        const component = findComponent(tag, this.docs);
        return (h("article", { key: 'b676d1eb960cfd8dfc193199fcdca96283eb6f89', class: "component" }, h("section", { key: 'fc6d38340d0384e5b4129333f7703d2f0cd2542b', class: "docs debug" }, this.renderComponent(component))));
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
        return (h("div", { class: "show-case" }, h("div", { class: "show-case_component" }, h(ExampleComponent, { ...props }))));
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

export { KompendiumDebug as kompendium_debug };
//# sourceMappingURL=kompendium-debug.entry.js.map
