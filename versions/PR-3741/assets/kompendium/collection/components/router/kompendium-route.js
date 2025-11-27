import { Component, h, Prop, Element, State } from '@stencil/core';
import { getHashPath, matchRoute } from './route-matching';
import { hasPreviousMatchingSibling } from './route-switch-logic';
import { generateComponentKey } from './component-key';
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
    if (hasPreviousMatchingSibling(this.el, currentPath)) {
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
      const props = Object.assign(Object.assign({}, this.componentProps), { match: match });
      // Create element dynamically using h() with string tag name
      // Use match params as key to force recreation when params change
      const key = generateComponentKey(match.params);
      return h(this.component, Object.assign({ key: key }, props));
    }
    return h("slot", null);
  }
  static get is() { return "kompendium-route"; }
  static get properties() { return {
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
      "attribute": "url",
      "reflect": false
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
      "attribute": "component",
      "reflect": false
    },
    "componentProps": {
      "type": "unknown",
      "mutable": false,
      "complexType": {
        "original": "Record<string, any>",
        "resolved": "{ [x: string]: any; }",
        "references": {
          "Record": {
            "location": "global"
          }
        }
      },
      "required": false,
      "optional": true,
      "docs": {
        "tags": [],
        "text": ""
      }
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
      "attribute": "exact",
      "reflect": false,
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
            "path": "./route-matching"
          }
        }
      },
      "required": false,
      "optional": true,
      "docs": {
        "tags": [],
        "text": ""
      }
    }
  }; }
  static get states() { return {
    "currentPath": {}
  }; }
  static get elementRef() { return "el"; }
}
