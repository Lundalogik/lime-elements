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
        const types = getTypes();
        const file = await markdownToHtml(this.text, types);
        this.host.shadowRoot.querySelector('#root').innerHTML =
            file === null || file === void 0 ? void 0 : file.toString();
        // After content renders, scroll to anchor if present in URL
        scrollToAnchor(this.host.shadowRoot);
    }
    render() {
        return h("div", { key: '03130f8b44ce47f211641bbed852459660804523', id: "root" });
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
