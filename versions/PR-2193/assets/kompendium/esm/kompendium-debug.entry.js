import { r as registerInstance, h } from './index-3601b4dc.js';

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
    return (h("article", { class: "component" }, h("section", { class: "docs debug" }, this.renderComponent(component))));
  }
  renderComponent(component) {
    const ExampleComponent = component.tag;
    const ownerComponent = this.docs.components.find(isOwnerOf(component));
    const schema = this.schemas.find((s) => s.$id === ownerComponent.tag);
    const factory = this.examplePropsFactory;
    const props = Object.assign({ schema: schema }, factory(ExampleComponent));
    return (h("div", { class: "show-case" }, h("div", { class: "show-case_component" }, h(ExampleComponent, Object.assign({}, props)))));
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
