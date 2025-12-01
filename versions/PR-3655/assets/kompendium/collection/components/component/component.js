import { h } from "@stencil/core";
import { PropertyList } from "./templates/props";
import { EventList } from "./templates/events";
import { MethodList } from "./templates/methods";
import { SlotList } from "./templates/slots";
import { StyleList } from "./templates/style";
import { ExampleList } from "./templates/examples";
import negate from "lodash/negate";
export class KompendiumComponent {
    constructor() {
        this.scrollToOnNextUpdate = null;
        this.handleRouteChange = this.handleRouteChange.bind(this);
    }
    connectedCallback() {
        window.addEventListener('hashchange', this.handleRouteChange);
    }
    disconnectedCallback() {
        window.removeEventListener('hashchange', this.handleRouteChange);
    }
    componentDidLoad() {
        const route = this.getRoute();
        this.scrollToElement(route);
    }
    componentDidUpdate() {
        if (this.scrollToOnNextUpdate) {
            this.scrollToElement(this.scrollToOnNextUpdate);
            this.scrollToOnNextUpdate = null;
        }
    }
    handleRouteChange() {
        const route = this.getRoute();
        this.scrollToOnNextUpdate = route;
    }
    scrollToElement(id) {
        const element = this.host.shadowRoot.getElementById(id);
        if (!element) {
            return;
        }
        element.scrollIntoView();
    }
    render() {
        const tag = this.match.params.name;
        const component = findComponent(tag, this.docs);
        return (h("article", { key: '25c0da9ed6bd380bab2c45dd05ad451f829c2067', class: "component" }, h("section", { key: '029617283bc0aaf08ae97e0efe8ce8c09037fe6a', class: "docs" }, this.renderDocs(tag, component))));
    }
    renderDocs(tag, component) {
        let title = tag.split('-').slice(1).join(' ');
        title = title[0].toLocaleUpperCase() + title.slice(1);
        const examples = findExamples(component, this.docs);
        const tags = component.docsTags
            .filter(negate(isTag('slot')))
            .filter(negate(isTag('exampleComponent')));
        const schema = this.schemas.find((s) => s.$id === tag);
        return [
            h("h1", { id: this.getId() }, title),
            h("kompendium-markdown", { text: component.docs }),
            h("kompendium-taglist", { tags: tags }),
            h(ExampleList, { examples: examples, id: this.getId('examples'), schema: schema, propsFactory: this.examplePropsFactory }),
            h(PropertyList, { props: component.props, id: this.getId('properties') }),
            h(EventList, { events: component.events, id: this.getId('events') }),
            h(MethodList, { methods: component.methods, id: this.getId('methods') }),
            h(SlotList, { slots: component.slots, id: this.getId('slots') }),
            h(StyleList, { styles: component.styles, id: this.getId('styles') }),
        ];
    }
    getId(name) {
        const route = this.getRoute().split('/').slice(0, 3).join('/');
        return [route, name].filter((item) => !!item).join('/') + '/';
    }
    getRoute() {
        return location.hash.substr(1);
    }
    static get is() { return "kompendium-component"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "$": ["component.scss"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["component.css"]
        };
    }
    static get properties() {
        return {
            "docs": {
                "type": "unknown",
                "mutable": false,
                "complexType": {
                    "original": "JsonDocs",
                    "resolved": "JsonDocs",
                    "references": {
                        "JsonDocs": {
                            "location": "import",
                            "path": "@stencil/core/internal",
                            "id": "node_modules::JsonDocs"
                        }
                    }
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": "The generated documentation data"
                },
                "getter": false,
                "setter": false
            },
            "schemas": {
                "type": "unknown",
                "mutable": false,
                "complexType": {
                    "original": "Array<Record<string, any>>",
                    "resolved": "Record<string, any>[]",
                    "references": {
                        "Array": {
                            "location": "global",
                            "id": "global::Array"
                        },
                        "Record": {
                            "location": "global",
                            "id": "global::Record"
                        }
                    }
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": "Component schemas"
                },
                "getter": false,
                "setter": false
            },
            "match": {
                "type": "unknown",
                "mutable": false,
                "complexType": {
                    "original": "MatchResults",
                    "resolved": "MatchResults",
                    "references": {
                        "MatchResults": {
                            "location": "import",
                            "path": "../router/route-matching",
                            "id": "src/components/router/route-matching.ts::MatchResults"
                        }
                    }
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": "Matched route parameters"
                },
                "getter": false,
                "setter": false
            },
            "examplePropsFactory": {
                "type": "unknown",
                "mutable": false,
                "complexType": {
                    "original": "PropsFactory",
                    "resolved": "(name: string) => Record<string, unknown>",
                    "references": {
                        "PropsFactory": {
                            "location": "import",
                            "path": "../playground/playground.types",
                            "id": "src/components/playground/playground.types.ts::PropsFactory"
                        }
                    }
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": "Factory for creating props for example components"
                },
                "getter": false,
                "setter": false
            }
        };
    }
    static get elementRef() { return "host"; }
}
function findExamples(component, docs) {
    return component.docsTags
        .filter(isTag('exampleComponent'))
        .map(findComponentByTag(docs));
}
function findComponent(tag, docs) {
    return docs.components.find((doc) => doc.tag === tag);
}
const findComponentByTag = (docs) => (tag) => {
    return docs.components.find((component) => component.tag === tag.text);
};
const isTag = (name) => (tag) => {
    return tag.name === name;
};
//# sourceMappingURL=component.js.map
