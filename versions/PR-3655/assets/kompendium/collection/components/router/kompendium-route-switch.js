import { h } from "@stencil/core";
import { getHashPath } from "./route-matching";
/**
 * Custom route switch component for Kompendium
 * Manages navigation state and passes current path to child routes
 */
export class KompendiumRouteSwitch {
    constructor() {
        this.scrollTopOffset = 0;
        this.currentPath = '/';
        this.handleHashChange = this.handleHashChange.bind(this);
    }
    connectedCallback() {
        window.addEventListener('hashchange', this.handleHashChange);
        this.handleHashChange();
    }
    disconnectedCallback() {
        window.removeEventListener('hashchange', this.handleHashChange);
    }
    handleHashChange() {
        const newPath = getHashPath();
        if (newPath !== this.currentPath) {
            this.currentPath = newPath;
            if (this.scrollTopOffset !== undefined) {
                window.scrollTo(0, this.scrollTopOffset);
            }
        }
    }
    render() {
        // Simply render child routes
        // The @State currentPath will trigger re-render when hash changes
        // Each route component will re-render and check if it matches
        return h("slot", { key: 'ae22e3681abcaa480b5d58dc87e903583c2f7b36' });
    }
    static get is() { return "kompendium-route-switch"; }
    static get properties() {
        return {
            "scrollTopOffset": {
                "type": "number",
                "mutable": false,
                "complexType": {
                    "original": "number",
                    "resolved": "number",
                    "references": {}
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "scroll-top-offset",
                "defaultValue": "0"
            }
        };
    }
    static get states() {
        return {
            "currentPath": {}
        };
    }
}
//# sourceMappingURL=kompendium-route-switch.js.map
