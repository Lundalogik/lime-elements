import { Component, h, Prop, State, getAssetPath, Element, } from '@stencil/core';
/**
 * @private
 */
export class Navigation {
    constructor() {
        this.route = '';
        this.toggleMenu = () => {
            const panel = this.host.shadowRoot.querySelector('.nav-panel');
            if (!panel) {
                return;
            }
            panel.classList.toggle('display-nav-panel');
        };
        this.setRoute = this.setRoute.bind(this);
        this.renderMenuItem = this.renderMenuItem.bind(this);
    }
    componentWillLoad() {
        window.addEventListener('hashchange', this.setRoute);
        this.setRoute();
    }
    componentDidUnload() {
        window.removeEventListener('hashchange', this.setRoute);
    }
    setRoute() {
        this.route = location.hash.substr(1);
    }
    render() {
        return (h("nav", { class: "nav-panel" },
            h("a", { class: "nav-panel__responsive-menu", onClick: this.toggleMenu },
                h("span", { class: "show-nav" }, "|||"),
                h("span", { class: "hide-nav" }, "\u2A2F")),
            h("header", { class: "panel-header" },
                h("h1", null,
                    h("a", { href: "#" }, this.header)),
                h("kompendium-search", null)),
            this.renderChapters(this.menu)));
    }
    renderChapters(menu) {
        if (!menu || !menu.length) {
            return;
        }
        return h("ul", { class: "panel-list" }, menu.map(this.renderMenuItem));
    }
    renderMenuItem(item) {
        const classList = {
            active: this.isRouteActive(item.path),
            chapters: true,
            'panel-list': true,
        };
        const anchorClassList = {
            'panel-link': true,
            active: this.isRouteActive(item.path),
        };
        const chapters = item.children || [];
        const path = getAssetPath('../collection/assets/icons/arrow-right-s-line.svg');
        return (h("li", { class: "panel-item" },
            h("a", { class: anchorClassList, href: '#' + item.path },
                h("span", { class: "link-text" },
                    h("img", { src: path }),
                    item.title)),
            h("ul", { class: classList }, chapters.map(this.renderMenuItem))));
    }
    isRouteActive(route) {
        return this.route.startsWith(route);
    }
    static get is() { return "kompendium-navigation"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["navigation.scss"]
    }; }
    static get styleUrls() { return {
        "$": ["navigation.css"]
    }; }
    static get properties() { return {
        "menu": {
            "type": "unknown",
            "mutable": false,
            "complexType": {
                "original": "MenuItem[]",
                "resolved": "MenuItem[]",
                "references": {
                    "MenuItem": {
                        "location": "import",
                        "path": "../../kompendium/config"
                    }
                }
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": "The menu to display"
            }
        },
        "header": {
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
                "text": "Title to display at the top of the navigation"
            },
            "attribute": "header",
            "reflect": false
        }
    }; }
    static get states() { return {
        "route": {}
    }; }
    static get elementRef() { return "host"; }
}
// function hasContent(item: MenuItem) {
//     return item.children?.length > 0;
// }
