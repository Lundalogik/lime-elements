import { h } from "@stencil/core";
export class KompendiumDebug {
    constructor() {
        /**
         * Factory for creating props for example components
         * @returns {Record<string, unknown>} props
         */
        this.examplePropsFactory = () => ({});
    }
    render() {
        const tag = this.match.params.name;
        const component = findComponent(tag, this.docs);
        return (h("article", { key: '29c045c23cd107d1d0006467db9abad681bb7e2e', class: "component" }, h("section", { key: 'ae3e9fe451f3663a720d2113d140f1efb42a5da8', class: "docs debug" }, this.renderComponent(component))));
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
    static get is() { return "kompendium-debug"; }
    static get encapsulation() { return "shadow"; }
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
                            "path": "@limetech/stencil-router",
                            "id": "node_modules::MatchResults"
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
                "optional": true,
                "docs": {
                    "tags": [{
                            "name": "returns",
                            "text": "props"
                        }],
                    "text": "Factory for creating props for example components"
                },
                "getter": false,
                "setter": false,
                "defaultValue": "() => ({})"
            }
        };
    }
}
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
//# sourceMappingURL=debug.js.map
