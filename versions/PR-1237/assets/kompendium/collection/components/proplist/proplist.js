import { Component, h, Prop } from '@stencil/core';
export class Proplist {
    render() {
        return h("dl", null, this.items.map(this.renderProperty));
    }
    renderProperty(property) {
        const { key, value } = property;
        return [
            h("dt", null, key),
            h("dd", { class: `value--${value}` },
                h("kompendium-markdown", { text: `\`${value}\`` })),
        ];
    }
    static get is() { return "kompendium-proplist"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["proplist.scss"]
    }; }
    static get styleUrls() { return {
        "$": ["proplist.css"]
    }; }
    static get properties() { return {
        "items": {
            "type": "unknown",
            "mutable": false,
            "complexType": {
                "original": "ProplistItem[]",
                "resolved": "ProplistItem[]",
                "references": {
                    "ProplistItem": {
                        "location": "local"
                    }
                }
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": "List of properties"
            }
        }
    }; }
}
