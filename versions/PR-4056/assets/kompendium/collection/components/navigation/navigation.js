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
            h("div", { key: '73b5ead76c3caebf82f92f0446f1fd2d8ef34c9a', class: {
                    'nav-panel-scrim': true,
                    'display-nav-panel': this.displayNavPanel,
                }, onClick: this.toggleMenu }),
            h("nav", { key: 'de2d992290cc30bead85cd1c72f2aa978a9255d8', class: {
                    'nav-panel': true,
                    'display-nav-panel': this.displayNavPanel,
                }, onClick: this.stopPropagationOfNavClick }, h("a", { key: 'addfb1cfba7601a247e9d242432da428a89370d3', class: "nav-panel__responsive-menu", onClick: this.toggleMenu }, h("span", { key: '4c0b3f1813c6dfc7a2a1f519bffa4a5ed109426d' }), h("span", { key: '9292fc50998a2c94986dba97203932bf8755e700' }), h("span", { key: '9a3bdc5917f668e47c89aa479dd4aaf2c6b055af' }), h("span", { key: '2e0af12be237f471f7004c48b803df053d07bc4b' })), h("header", { key: '656146ba6ad69eda77e1fe254020265c78748194', class: "panel-header" }, h("div", { key: '3a724ddd3bb51d151ebbd1fa30266f372fe63694', class: "branding-and-mode" }, h("h1", { key: '5974a364b58d1af4bfed568063dacced9595e69f' }, this.renderHeader()), h("kompendium-darkmode-switch", { key: 'f1e37e2f65518571b3dbd9caf09b75d14ac2eb29' })), h("kompendium-search", { key: '2d9bb94fbe8f7d4d72c21ebbdf832efbd8133aa7', index: this.index })), this.renderChapters(this.menu)),
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
                            "id": "src/types.ts::MenuItem",
                            "referenceLocation": "MenuItem"
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
