'use strict';

var index = require('./index-B_xYBJw_.js');
var componentTitle = require('./component-title-ClxX3mdx.js');

const debugCss = () => `.context-heading{margin:0;font-weight:500;color:rgb(var(--kompendium-contrast-900))}h2.context-heading{font-size:0.875rem;line-height:1.25rem}h3.context-heading{font-size:0.75rem;line-height:1rem;margin-bottom:0.5rem}`;

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
        return (index.h("article", { key: 'fbad346439a20f0cee130fb23e3e117e68edc2dd', class: "component" }, index.h("section", { key: '25e41ce4d1ba532fd045068373c9bf8c5382f691', class: "docs debug" }, this.renderComponent(component))));
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
        return [
            this.renderHeadings(component, ownerComponent),
            index.h("div", { class: "show-case" }, index.h("div", { class: "show-case_component" }, index.h(ExampleComponent, { ...props }))),
        ];
    }
    /*
     * Render the same heading context as the component page, so that the
     * heading outline of an example is identical on both pages, e.g. when
     * testing for accessibility
     */
    renderHeadings(component, ownerComponent) {
        var _a;
        const exampleTitle = (_a = component.docs) === null || _a === void 0 ? void 0 : _a.split('\n')[0];
        return [
            index.h("h2", { class: "context-heading" }, componentTitle.getComponentTitle(ownerComponent.tag)),
            !!exampleTitle && index.h("h3", { class: "context-heading" }, exampleTitle),
        ];
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
KompendiumDebug.style = debugCss();

exports.kompendium_debug = KompendiumDebug;
