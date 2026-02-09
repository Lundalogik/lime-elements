import { h } from "@stencil/core";
import { markdownToHtml } from "../../kompendium/markdown";
import { getTypes } from "./markdown-types";
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
        this.scrollToAnchor();
    }
    async renderMarkdown() {
        const types = getTypes();
        const file = await markdownToHtml(this.text, types);
        this.host.shadowRoot.querySelector('#root').innerHTML =
            file === null || file === void 0 ? void 0 : file.toString();
        // After content renders, scroll to anchor if present in URL
        this.scrollToAnchor();
    }
    scrollToAnchor() {
        const hash = window.location.hash;
        if (!hash) {
            return;
        }
        // Extract anchor ID from hash (remove leading #)
        // Handle both simple anchors (#section) and route-based anchors (#/guide/page#section)
        const anchorMatch = hash.match(/#([^#]+)$/);
        if (!anchorMatch) {
            return;
        }
        const anchorId = anchorMatch[1];
        // Wait for next frame to ensure DOM is ready, then scroll
        requestAnimationFrame(() => {
            this.scrollToElement(anchorId, 'smooth');
            // Retry after a delay to handle layout shifts from async content
            // (images, lazy-loaded components, etc.). Use 'auto' to avoid
            // visible re-scrolling if position changed.
            setTimeout(() => this.scrollToElement(anchorId, 'auto'), 500);
        });
    }
    scrollToElement(id, behavior) {
        const element = this.host.shadowRoot.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior });
        }
    }
    render() {
        return h("div", { key: '4fb946cc506ddcee204c7c84c6f6536815bf8b25', id: "root" });
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
