import { h } from "@stencil/core";
import { getHashPath, matchRoute } from "./route-matching";
import { hasPreviousMatchingSibling } from "./route-switch-logic";
import { generateComponentKey } from "./component-key";
/**
 * Custom route component for Kompendium
 * Renders a component when the route matches
 */
export class KompendiumRoute {
    constructor() {
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
        this.currentPath = getHashPath();
    }
    render() {
        // Check if a previous sibling route matches (first-match wins)
        if (hasPreviousMatchingSibling(this.el, this.currentPath)) {
            return null;
        }
        // Check if this route matches
        let match;
        if (this.url) {
            match = matchRoute(this.currentPath, this.url);
        }
        else {
            match = { params: {} }; // Catch-all route
        }
        if (!match) {
            return null;
        }
        // Render the matched route
        if (this.routeRender) {
            return this.routeRender({ match: match });
        }
        if (this.component) {
            const props = {
                ...this.componentProps,
                match: match,
            };
            // Create element dynamically using h() with string tag name
            // Use match params as key to force recreation when params change
            const key = generateComponentKey(match.params);
            return h(this.component, { key: key, ...props });
        }
        return h("slot", null);
    }
    static get is() { return "kompendium-route"; }
    static get properties() {
        return {
            "url": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
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
                "attribute": "url"
            },
            "component": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
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
                "attribute": "component"
            },
            "componentProps": {
                "type": "unknown",
                "mutable": false,
                "complexType": {
                    "original": "Record<string, any>",
                    "resolved": "{ [x: string]: any; }",
                    "references": {
                        "Record": {
                            "location": "global",
                            "id": "global::Record"
                        }
                    }
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false
            },
            "routeRender": {
                "type": "unknown",
                "mutable": false,
                "complexType": {
                    "original": "(props: { match: MatchResults }) => any",
                    "resolved": "(props: { match: MatchResults; }) => any",
                    "references": {
                        "MatchResults": {
                            "location": "import",
                            "path": "./route-matching",
                            "id": "src/components/router/route-matching.ts::MatchResults"
                        }
                    }
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false
            }
        };
    }
    static get states() {
        return {
            "currentPath": {}
        };
    }
    static get elementRef() { return "el"; }
}
//# sourceMappingURL=kompendium-route.js.map
