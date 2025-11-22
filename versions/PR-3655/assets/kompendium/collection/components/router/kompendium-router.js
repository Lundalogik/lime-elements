import { h } from "@stencil/core";
/**
 * Custom router component for Kompendium
 * Manages routing state using hash-based navigation
 */
export class KompendiumRouter {
    constructor() {
        this.historyType = 'hash';
    }
    render() {
        return h("slot", { key: '75207145a746fe01f142a501c51f1621db349486' });
    }
    static get is() { return "kompendium-router"; }
    static get properties() {
        return {
            "historyType": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "'hash' | 'browser'",
                    "resolved": "\"browser\" | \"hash\"",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "history-type",
                "defaultValue": "'hash'"
            }
        };
    }
}
//# sourceMappingURL=kompendium-router.js.map
