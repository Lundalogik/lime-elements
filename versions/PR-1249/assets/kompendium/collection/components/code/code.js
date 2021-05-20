import { Component, h, Prop, Element } from '@stencil/core';
import Prism from 'prismjs';
import 'prismjs/components/prism-jsx.js';
import 'prismjs/components/prism-scss.js';
import 'prismjs/components/prism-less.js';
import 'prismjs/components/prism-tsx.js';
import 'prismjs/components/prism-typescript.js';
/**
 * @exampleComponent kompendium-example-code
 */
export class Code {
    componentDidLoad() {
        this.renderCode();
    }
    componentDidUpdate() {
        this.renderCode();
    }
    render() {
        const classList = {};
        classList[`language-${this.language}`] = true;
        return (h("pre", { class: classList },
            h("slot", null),
            h("code", { class: "root" })));
    }
    renderCode() {
        const container = this.host.shadowRoot.querySelector('.root');
        container.innerHTML = Prism.highlight(this.findCode(), Prism.languages[this.language]);
    }
    findCode() {
        const slot = this.host.shadowRoot.querySelector('slot');
        return [...slot.assignedNodes()]
            .map((node) => node.textContent)
            .join('');
    }
    static get is() { return "kompendium-code"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["code.scss"]
    }; }
    static get styleUrls() { return {
        "$": ["code.css"]
    }; }
    static get properties() { return {
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
            "attribute": "language",
            "reflect": false
        },
        "random": {
            "type": "number",
            "mutable": false,
            "complexType": {
                "original": "number",
                "resolved": "number",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [{
                        "text": undefined,
                        "name": "ignore"
                    }],
                "text": ""
            },
            "attribute": "random",
            "reflect": false
        },
        "code": {
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
                "text": "Source code"
            },
            "attribute": "code",
            "reflect": false
        }
    }; }
    static get elementRef() { return "host"; }
}
