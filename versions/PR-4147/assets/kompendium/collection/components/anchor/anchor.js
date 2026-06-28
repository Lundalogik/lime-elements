import { h } from "@stencil/core";
import { anchorHref, currentRoute } from "../component/anchors";
import { getAnchorId } from "../anchor-scroll";
/**
 * Inline paragraph-link (¶) placed next to a heading. Picks up the parent
 * heading's font-size, stays hidden until the heading is hovered, and
 * highlights persistently when its slug matches the current URL anchor.
 * @private
 */
export class Anchor {
    constructor() {
        this.active = false;
        this.handleClick = (event) => {
            if (!this.active) {
                return;
            }
            event.preventDefault();
            const url = new URL(window.location.href);
            url.hash = currentRoute();
            history.replaceState(history.state, '', url);
            this.updateActive();
        };
        this.handleHashChange = this.handleHashChange.bind(this);
    }
    connectedCallback() {
        this.updateActive();
        window.addEventListener('hashchange', this.handleHashChange);
    }
    disconnectedCallback() {
        window.removeEventListener('hashchange', this.handleHashChange);
    }
    render() {
        return (h("a", { key: 'ebbe73e04e41b32353275d538aaaa2faaf4b9b00', class: { anchor: true, active: this.active }, href: anchorHref(this.slug), "aria-label": `Link to ${this.label}`, onClick: this.handleClick }, "\u00B6"));
    }
    handleHashChange() {
        this.updateActive();
    }
    updateActive() {
        this.active = getAnchorId() === this.slug;
    }
    static get is() { return "kompendium-anchor"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "$": ["anchor.scss"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["anchor.css"]
        };
    }
    static get properties() {
        return {
            "slug": {
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
                    "text": "Slug used as the URL anchor fragment and scroll target."
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "slug"
            },
            "label": {
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
                    "text": "Human-readable label for the target, used for the aria-label."
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "label"
            }
        };
    }
    static get states() {
        return {
            "active": {}
        };
    }
}
