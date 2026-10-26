import { h, Host } from "@stencil/core";
import { THEME_EVENT_NAME } from "../darkmode-switch/types";
import { splitDocs } from "./split-docs";
export class Playground {
    constructor() {
        /**
         * Factory for creating props for example components
         * @returns {Record<string, unknown>} props
         */
        this.propsFactory = () => ({});
        this.activateTab = (id) => () => {
            this.activeTab = id;
        };
        this.themeListener = (event) => {
            this.theme = event.detail;
        };
        this.renderTab = this.renderTab.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }
    connectedCallback() {
        this.theme = document.querySelector('html').dataset.theme;
        document.addEventListener(THEME_EVENT_NAME, this.themeListener);
    }
    disconnectedCallback() {
        document.removeEventListener(THEME_EVENT_NAME, this.themeListener);
    }
    render() {
        if (!this.component) {
            return;
        }
        const sources = this.component.sources || [];
        return (h(Host, { "data-theme": this.theme }, h("section", { class: "example" }, h("div", { class: "result" }, this.renderResult()), h("aside", { class: "code" }, h("nav", { class: "tab-bar" }, this.renderTabs(sources)), h("div", { class: "tab-items" }, this.renderItems(sources))))));
    }
    renderTabs(sources) {
        return sources.map(this.renderTab);
    }
    renderTab(source, index) {
        const classList = {
            tab: true,
            active: this.isTabActive(source, index),
        };
        return (h("a", { class: classList, onClick: this.activateTab(source.filename) }, h("span", null, source.filename)));
    }
    renderItems(sources) {
        return sources.map(this.renderItem);
    }
    renderResult() {
        const ExampleComponent = this.component.tag;
        const factory = this.propsFactory;
        const props = {
            schema: this.schema,
            ...factory(ExampleComponent),
        };
        const { title, body } = splitDocs(this.component.docs);
        const heading = title || this.component.tag;
        return (h("div", { class: "show-case" }, h("div", { class: "show-case_description" }, h("h3", { class: "example-heading" }, heading, this.anchorSlug ? (h("kompendium-anchor", { slug: this.anchorSlug, label: heading })) : null), body ? h("kompendium-markdown", { text: body }) : null), h("div", { class: "show-case_component" }, this.renderDebugButton(this.component.tag), h(ExampleComponent, { ...props }))));
    }
    renderItem(source, index) {
        const classList = {
            'tab-item': true,
            active: this.isTabActive(source, index),
        };
        const code = source.source.replace(/\/\*\*.+?\*\//gms, '');
        const key = [this.component.tag, source.filename].join('/');
        return (h("kompendium-code", { class: classList, language: source.type, key: key }, code));
    }
    renderDebugButton(tag) {
        if (!['localhost', '127.0.0.1'].includes(location.hostname)) {
            return;
        }
        const href = `#/debug/${tag}`;
        return (h("div", { class: "debug" }, h("a", { class: "debug-link", href: href, title: "Debug" }, h("svg", { viewBox: "0 0 400 400", xmlns: "http://www.w3.org/2000/svg", "fill-rule": "evenodd", "clip-rule": "evenodd", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-miterlimit": "1.5" }, h("path", { fill: "none", d: "M0 0h400v400H0z" }), h("path", { d: "M194.97 254.84h77.555", fill: "none", stroke: "currentColor", "stroke-opacity": ".6", "stroke-width": "20" }), h("path", { d: "M127.474 145.16l54.84 54.84M182.315 200l-54.84 54.84", fill: "none", stroke: "currentColor", "stroke-width": "20" })))));
    }
    isTabActive(source, index) {
        let isActive = this.activeTab === source.filename;
        if (!isActive) {
            isActive = index === 0 && !this.activeTab;
        }
        return isActive;
    }
    static get is() { return "kompendium-playground"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "$": ["playground.scss"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["playground.css"]
        };
    }
    static get properties() {
        return {
            "component": {
                "type": "unknown",
                "mutable": false,
                "complexType": {
                    "original": "JsonDocsComponent",
                    "resolved": "JsonDocsComponent",
                    "references": {
                        "JsonDocsComponent": {
                            "location": "import",
                            "path": "@stencil/core/internal",
                            "id": "node_modules::JsonDocsComponent",
                            "referenceLocation": "JsonDocsComponent"
                        }
                    }
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": "The component to display"
                },
                "getter": false,
                "setter": false
            },
            "schema": {
                "type": "unknown",
                "mutable": false,
                "complexType": {
                    "original": "Record<string, any>",
                    "resolved": "any | string",
                    "references": {
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
                    "text": "Schema for the component"
                },
                "getter": false,
                "setter": false
            },
            "propsFactory": {
                "type": "unknown",
                "mutable": false,
                "complexType": {
                    "original": "PropsFactory",
                    "resolved": "(name: string) => Record<string, unknown>",
                    "references": {
                        "PropsFactory": {
                            "location": "import",
                            "path": "./playground.types",
                            "id": "src/components/playground/playground.types.ts::PropsFactory",
                            "referenceLocation": "PropsFactory"
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
            },
            "anchorSlug": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": "Slug used as the URL anchor for linking to this example."
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "anchor-slug"
            }
        };
    }
    static get states() {
        return {
            "activeTab": {},
            "theme": {}
        };
    }
}
