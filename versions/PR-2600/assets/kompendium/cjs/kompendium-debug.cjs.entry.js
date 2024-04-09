'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-4264cbf1.js');

const KompendiumDebug = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
  }
  render() {
    const tag = this.match.params.name;
    const component = findComponent(tag, this.docs);
    return (index.h("article", { class: "component" }, index.h("section", { class: "docs debug" }, this.renderComponent(component))));
  }
  renderComponent(component) {
    const ExampleComponent = component.tag;
    const ownerComponent = this.docs.components.find(isOwnerOf(component));
    const schema = this.schemas.find((s) => s.$id === ownerComponent.tag);
    const props = {
      schema: schema,
    };
    return (index.h("div", { class: "show-case" }, index.h("div", { class: "show-case_component" }, index.h(ExampleComponent, Object.assign({}, props)))));
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
