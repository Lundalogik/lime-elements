import { h } from "@stencil/core";
export class Proplist {
    render() {
        return h("dl", { key: 'cfbb5f0d2740828fc9880f336468b47562e73b3a' }, this.items.map(this.renderProperty));
    }
    renderProperty(property) {
        const { key, value } = property;
        return [
            h("dt", null, key),
            h("dd", { class: `value--${value}` }, h("kompendium-markdown", { text: `\`${value}\`` })),
        ];
    }
    static get is() { return "kompendium-proplist"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "$": ["proplist.scss"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["proplist.css"]
        };
    }
    static get properties() {
        return {
            "items": {
                "type": "unknown",
                "mutable": false,
                "complexType": {
                    "original": "ProplistItem[]",
                    "resolved": "ProplistItem[]",
                    "references": {
                        "ProplistItem": {
                            "location": "local",
                            "path": "/Users/adrian.schmidt/src/kompendium/upgrade-stencil/src/components/proplist/proplist.tsx",
                            "id": "src/components/proplist/proplist.tsx::ProplistItem"
                        }
                    }
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": "List of properties"
                },
                "getter": false,
                "setter": false
            }
        };
    }
}
//# sourceMappingURL=proplist.js.map
