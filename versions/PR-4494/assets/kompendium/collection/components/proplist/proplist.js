import { h } from "@stencil/core";
export class Proplist {
    render() {
        return h("dl", { key: 'bfac216b395a349661b91d2cfea7c56896c17a53' }, this.items.map(this.renderProperty));
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
                            "path": "/home/runner/work/kompendium/kompendium/src/components/proplist/proplist.tsx",
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
