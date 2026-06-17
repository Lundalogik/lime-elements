import { h } from "@stencil/core";
import { getComponentTitle } from "../component-title";
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
        return (h("article", { key: '8b5d377dbd6cfab7baf0f003c8cefef5e6e26b06', class: "component" }, h("section", { key: '91ca7f808a73325d1d08248f9fd44f4092e19ba2', class: "docs debug" }, this.renderComponent(component))));
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
            h("div", { class: "show-case" }, h("div", { class: "show-case_component" }, h(ExampleComponent, { ...props }))),
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
            h("h2", { class: "context-heading" }, getComponentTitle(ownerComponent.tag)),
            !!exampleTitle && h("h3", { class: "context-heading" }, exampleTitle),
        ];
    }
    static get is() { return "kompendium-debug"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "$": ["debug.scss"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["debug.css"]
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
