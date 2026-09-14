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
        return (h("div", { key: '1223bdf557f84830f7dfbf991b155a4fa0519244', class: "root" }, h("slot", { key: 'bea1a859be69faeb324818a729eb12559bafe96d' }), h("pre", { key: '9757a854f31ae6bc736e0c829ea664fe4705d7bc', class: classList }, h("code", { key: '7d0ec3bd83d8a99c0e6d66abc172941497df8951' }, this.code))));
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
