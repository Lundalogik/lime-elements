import { h } from "@stencil/core";
import { markdownToHtml } from "../../kompendium/markdown";
import { getTypes } from "./markdown-types";
/**
 * This component renders markdown
 * @exampleComponent kompendium-example-markdown
 */
export class Markdown {
    componentDidLoad() {
        this.renderMarkdown();
    }
    componentDidUpdate() {
        this.renderMarkdown();
    }
    async renderMarkdown() {
        const types = getTypes();
        const file = await markdownToHtml(this.text, types);
        this.host.shadowRoot.querySelector('#root').innerHTML =
            file === null || file === void 0 ? void 0 : file.toString();
    }
    render() {
        return h("div", { key: 'a26da8feaabfd7d048c1413770ee5e7cef07c711', id: "root" });
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
