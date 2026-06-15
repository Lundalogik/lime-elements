import { h } from "@stencil/core";
import { markdownToHtml } from "../../kompendium/markdown";
import { getTypes } from "./markdown-types";
import { scrollToAnchor } from "../anchor-scroll";
/**
 * This component renders markdown
 * @exampleComponent kompendium-example-markdown
 */
export class Markdown {
    constructor() {
        this.renderSeq = 0;
        this.handleHashChange = this.handleHashChange.bind(this);
    }
    connectedCallback() {
        window.addEventListener('hashchange', this.handleHashChange);
    }
    disconnectedCallback() {
        window.removeEventListener('hashchange', this.handleHashChange);
    }
    componentDidLoad() {
        this.renderMarkdown();
    }
    componentDidUpdate() {
        this.renderMarkdown();
    }
    handleHashChange() {
        scrollToAnchor(this.host.shadowRoot);
    }
    async renderMarkdown() {
        const renderSeq = ++this.renderSeq;
        const currentText = this.text;
        const types = getTypes();
        const file = await markdownToHtml(currentText, types);
        // Abort if a newer render has started or text has changed
        if (renderSeq !== this.renderSeq || currentText !== this.text) {
            return;
        }
        this.host.shadowRoot.querySelector('#root').innerHTML =
            file === null || file === void 0 ? void 0 : file.toString();
        // After content renders, scroll to anchor if present in URL
        scrollToAnchor(this.host.shadowRoot);
    }
    render() {
        return h("div", { key: 'a234f58eaafe3daab181a26ec522739b62109f1a', id: "root" });
    }
    static get is() { return "kompendium-markdown"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "$": ["markdown.scss"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["markdown.css"]
        };
    }
    static get properties() {
        return {
            "text": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": "The text to render"
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "text"
            }
        };
    }
    static get elementRef() { return "host"; }
}
//# sourceMappingURL=markdown.js.map
