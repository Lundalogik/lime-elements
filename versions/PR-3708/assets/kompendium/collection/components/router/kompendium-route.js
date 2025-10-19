import { h } from "@stencil/core";
import { getHashPath, matchRoute } from "./router-utils";
/**
 * Type guard to check if an element is a route element with expected properties
 * @param {Element} element - The element to check
 * @returns {boolean} True if the element is a kompendium-route with a url property
 */
function isRouteElement(element) {
    return (element.tagName.toLowerCase() === 'kompendium-route' && 'url' in element);
}
/**
 * Custom route component for Kompendium
 * Renders a component when the route matches
 */
export class KompendiumRoute {
    constructor() {
        this.currentPath = '/';
        this.exact = false;
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
        // Use current path from state (updated by hashchange listener)
        const currentPath = this.currentPath;
        // Check if a previous sibling route matches (first-match wins)
        if (this.hasPreviousMatchingSibling(currentPath)) {
            return null;
        }
        // Check if this route matches
        let match;
        if (this.url) {
            match = matchRoute(currentPath, this.url);
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
            // Sort param keys for deterministic key generation
            const key = Object.keys(match.params)
                .sort()
                .map((k) => `${k}=${match.params[k]}`)
                .join('&');
            return h(this.component, { key: key, ...props });
        }
        return h("slot", null);
    }
    hasPreviousMatchingSibling(currentPath) {
        const parent = this.el.parentElement;
        if ((parent === null || parent === void 0 ? void 0 : parent.tagName.toLowerCase()) !== 'kompendium-route-switch') {
            return false;
        }
        const siblings = Array.from(parent.children);
        const myIndex = siblings.indexOf(this.el);
        // Check all previous siblings
        for (let i = 0; i < myIndex; i++) {
            const sibling = siblings[i];
            // Use type guard to ensure element has expected route properties
            if (!isRouteElement(sibling)) {
                continue;
            }
            // Access sibling's URL property with type safety
            const siblingUrl = sibling.url;
            // Check if sibling matches current path
            let siblingMatch;
            if (siblingUrl) {
                siblingMatch = matchRoute(currentPath, siblingUrl);
            }
            else {
                siblingMatch = { params: {} }; // Routes without URL are catch-all
            }
            if (siblingMatch) {
                return true;
            }
        }
        return false;
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
            "exact": {
                "type": "boolean",
                "mutable": false,
                "complexType": {
                    "original": "boolean",
                    "resolved": "boolean",
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
                "attribute": "exact",
                "defaultValue": "false"
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
                            "path": "./router-utils",
                            "id": "src/components/router/router-utils.ts::MatchResults"
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
