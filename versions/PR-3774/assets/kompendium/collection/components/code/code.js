import { h } from "@stencil/core";
import Prism from "prismjs";
import "prismjs/components/prism-jsx.js";
import "prismjs/components/prism-scss.js";
import "prismjs/components/prism-less.js";
import "prismjs/components/prism-tsx.js";
import "prismjs/components/prism-typescript.js";
import "prismjs/plugins/toolbar/prism-toolbar.js";
import "prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard.js";
/**
 * @exampleComponent kompendium-example-code
 */
export class Code {
    componentDidLoad() {
        setTimeout(() => {
            this.code = this.findCode();
        });
    }
    componentWillRender() {
        this.code = this.findCode();
    }
    componentDidRender() {
        const container = this.host.shadowRoot.querySelector('.root pre code');
        Prism.highlightElement(container);
    }
    render() {
        const classList = {};
        classList[`language-${this.language}`] = true;
        return (h("div", { key: '89f5f19a3a41bbdfa8d0393675ee7ddeaec2ba5d', class: "root" }, h("slot", { key: 'b8c56c9edb8c519497c95d9ef66705c174e4b64f' }), h("pre", { key: '77a867e7b4c1d0d70cd94695d884b52302d2fc90', class: classList }, h("code", { key: 'fa4947b12a7b1ead2c7e1dc5b9eae9ee21b2e37d' }, this.code))));
    }
    findCode() {
        const slot = this.host.shadowRoot.querySelector('slot');
        if (!slot) {
            return;
        }
        return [...slot.assignedNodes()]
            .map((node) => node.textContent)
            .join('');
    }
    static get is() { return "kompendium-code"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "$": ["code.scss"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["code.css"]
        };
    }
    static get properties() {
        return {
            "language": {
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
                    "text": "The language of the code"
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "language"
            }
        };
    }
    static get states() {
        return {
            "code": {}
        };
    }
    static get elementRef() { return "host"; }
}
//# sourceMappingURL=code.js.map
