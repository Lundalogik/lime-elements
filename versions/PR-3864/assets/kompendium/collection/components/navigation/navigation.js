import { h } from "@stencil/core";
/**
 * @private
 */
export class Navigation {
    constructor() {
        this.route = '';
        this.displayNavPanel = false;
        this.toggleMenu = () => {
            this.displayNavPanel = !this.displayNavPanel;
        };
        this.stopPropagationOfNavClick = (event) => {
            event.stopPropagation();
        };
        this.setRoute = this.setRoute.bind(this);
        this.renderMenuItem = this.renderMenuItem.bind(this);
    }
    connectedCallback() {
        window.addEventListener('hashchange', this.setRoute);
        this.setRoute();
    }
    disconnectedCallback() {
        window.removeEventListener('hashchange', this.setRoute);
    }
    setRoute() {
        this.route = location.hash.substr(1);
    }
    render() {
        return [
            h("div", { key: '0abf57dba46d2c55f777e6b0a62756f1531b716a', class: {
                    'nav-panel-scrim': true,
                    'display-nav-panel': this.displayNavPanel,
                }, onClick: this.toggleMenu }),
            h("nav", { key: '47f1e62abae92f0ee5a90a980f79b5cec0508364', class: {
                    'nav-panel': true,
                    'display-nav-panel': this.displayNavPanel,
                }, onClick: this.stopPropagationOfNavClick }, h("a", { key: '25fd2d738007fc596447cf4ac0a2bbbcf92df332', class: "nav-panel__responsive-menu", onClick: this.toggleMenu }, h("span", { key: '2b4056f7793e879a86bd0ed40ce45366d891cf5a' }), h("span", { key: 'c2174de261be61fa807e8b6dadcf6b7119bbec30' }), h("span", { key: 'd755597e3c961b057f7ed4cb042aa45c8ca336c1' }), h("span", { key: 'a3442946e847e5b870afc0dcce8baf47cc4fb03a' })), h("header", { key: '46a15de390a19d9cb9b0bd8973e82b4c33bb6d62', class: "panel-header" }, h("div", { key: '3c280f8409cef9848c3e58c6ac907a4e6ae53a8e', class: "branding-and-mode" }, h("h1", { key: 'c38675cafe5bdf1a119a3e06cdca78f5d5ad5b25' }, this.renderHeader()), h("kompendium-darkmode-switch", { key: 'ec6564ee68633fffabc3deecf34a09d431d7634a' })), h("kompendium-search", { key: '8aa459ff257cc6a1adb726ca4b6b4cdf397ccb57', index: this.index })), this.renderChapters(this.menu)),
        ];
    }
    renderHeader() {
        let content = this.header;
        if (this.logo) {
            content = h("img", { alt: this.header, src: this.logo });
        }
        return h("a", { href: "#" }, content);
    }
    renderChapters(menu) {
        if (!menu || !menu.length) {
            return;
        }
        return (h("ul", { class: "panel-list" }, menu.map(this.renderMenuItem), h("div", { class: "powered-by" }, h("p", null, "Powered by\u00A0", h("a", { href: "https://github.com/jgroth/kompendium" }, "Kompendium")))));
    }
    renderMenuItem(item) {
        const itemClassList = {
            active: this.isRouteActive(item.path),
            'panel-item': true,
        };
        const chapterClassList = {
            active: this.isRouteActive(item.path),
            chapters: true,
            'panel-list': true,
        };
        const chapters = item.children || [];
        const anchorClassList = {
            'panel-link': true,
            active: this.isRouteActive(item.path),
            'has-children': !!chapters.length,
        };
        const anchorAdditionalProps = {};
        if (!chapters.length) {
            anchorAdditionalProps.onClick = this.toggleMenu;
        }
        return (h("li", { class: itemClassList }, h("a", { class: anchorClassList, href: '#' + item.path, ...anchorAdditionalProps }, h("span", { class: "link-text" }, item.title), h("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", width: "24", height: "24" }, h("path", { fill: "none", d: "M0 0h24v24H0z" }), h("path", { id: "arrow", d: "M13.172 12l-4.95-4.95 1.414-1.414L16 12l-6.364 6.364-1.414-1.414z", fill: "currentColor" }))), h("ul", { class: chapterClassList }, chapters.map(this.renderMenuItem))));
    }
    isRouteActive(route) {
        return this.route.startsWith(route);
    }
    static get is() { return "kompendium-navigation"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "$": ["navigation.scss"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["navigation.css"]
        };
    }
    static get properties() {
        return {
            "menu": {
                "type": "unknown",
                "mutable": false,
                "complexType": {
                    "original": "MenuItem[]",
                    "resolved": "MenuItem[]",
                    "references": {
                        "MenuItem": {
                            "location": "import",
                            "path": "../../types",
                            "id": "src/types.ts::MenuItem"
                        }
                    }
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": "The menu to display"
                },
                "getter": false,
                "setter": false
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
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "header"
            },
            "logo": {
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
                    "text": "Optional logo to display instead of the header"
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "logo"
            },
            "index": {
                "type": "any",
                "mutable": false,
                "complexType": {
                    "original": "any",
                    "resolved": "any",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": "Index containing searchable documents"
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "index"
            }
        };
    }
    static get states() {
        return {
            "route": {},
            "displayNavPanel": {}
        };
    }
}
// function hasContent(item: MenuItem) {
//     return item.children?.length > 0;
// }
//# sourceMappingURL=navigation.js.map
