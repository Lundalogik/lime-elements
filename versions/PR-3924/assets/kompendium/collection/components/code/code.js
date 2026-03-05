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
        return (h("div", { key: '95723df383f836be24b3190b74dc5ee555da29d7', class: "root" }, h("slot", { key: '5fd9fc3b9d1499fd4f81d2ffda23e42318e33e66' }), h("pre", { key: 'a5e18f68729a29bc9b1d154e2d15b9a14ed4c7ef', class: classList }, h("code", { key: 'bc2cb099497051902f8a616e7a5a70330c5c9579' }, this.code))));
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
