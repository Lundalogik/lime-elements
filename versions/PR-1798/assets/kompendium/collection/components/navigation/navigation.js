import { Component, h, Prop, State } from '@stencil/core';
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
      h("div", { class: {
          'nav-panel-scrim': true,
          'display-nav-panel': this.displayNavPanel,
        }, onClick: this.toggleMenu }),
      h("nav", { class: {
          'nav-panel': true,
          'display-nav-panel': this.displayNavPanel,
        }, onClick: this.stopPropagationOfNavClick },
        h("a", { class: "nav-panel__responsive-menu", onClick: this.toggleMenu },
          h("span", null),
          h("span", null),
          h("span", null),
          h("span", null)),
        h("header", { class: "panel-header" },
          h("div", { class: "branding-and-mode" },
            h("h1", null, this.renderHeader()),
            h("kompendium-darkmode-switch", null)),
          h("kompendium-search", { index: this.index })),
        this.renderChapters(this.menu)),
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
    return (h("ul", { class: "panel-list" },
      menu.map(this.renderMenuItem),
      h("div", { class: "powered-by" },
        h("p", null,
          "Powered by\u00A0",
          h("a", { href: "https://github.com/jgroth/kompendium" }, "Kompendium")))));
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
    return (h("li", { class: itemClassList },
      h("a", Object.assign({ class: anchorClassList, href: '#' + item.path }, anchorAdditionalProps),
        h("span", { class: "link-text" }, item.title),
        h("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", width: "24", height: "24" },
          h("path", { fill: "none", d: "M0 0h24v24H0z" }),
          h("path", { id: "arrow", d: "M13.172 12l-4.95-4.95 1.414-1.414L16 12l-6.364 6.364-1.414-1.414z", fill: "currentColor" }))),
      h("ul", { class: chapterClassList }, chapters.map(this.renderMenuItem))));
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
            "path": "../../types"
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
      "attribute": "logo",
      "reflect": false
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
      "attribute": "index",
      "reflect": false
    }
  }; }
  static get states() { return {
    "route": {},
    "displayNavPanel": {}
  }; }
}
// function hasContent(item: MenuItem) {
//     return item.children?.length > 0;
// }
