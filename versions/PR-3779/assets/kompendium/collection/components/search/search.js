import { Component, h, Element, Prop, State } from '@stencil/core';
import debounce from 'lodash/debounce';
export class Search {
  constructor() {
    this.documents = [];
    this.renderDocument = (document) => {
      return (h("li", null,
        h("a", { href: '#' + document.path, onClick: this.handleLinkClick },
          h("span", { class: "link-text" }, document.title))));
    };
    this.handleChangeInput = (event) => {
      const query = event.target.value;
      this.search(query);
    };
    this.handleLinkClick = () => {
      var _a;
      (_a = this.host.shadowRoot.activeElement) === null || _a === void 0 ? void 0 : _a.blur();
    };
    this.search = debounce(this.search, 300);
  }
  componentDidLoad() {
    this.host.shadowRoot.querySelector('input').focus();
  }
  render() {
    const classList = {
      result: true,
      'has-results': this.documents.length > 0,
    };
    return (h("div", { class: "search-box" },
      h("input", { type: "search", autoFocus: true, placeholder: "Search", onInput: this.handleChangeInput }),
      h("ul", { class: classList }, this.documents.map(this.renderDocument))));
  }
  search(query) {
    const index = this.index;
    const result = index.search(query);
    this.documents = result.map((doc) => doc.item).slice(0, 10);
  }
  static get is() { return "kompendium-search"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() { return {
    "$": ["search.scss"]
  }; }
  static get styleUrls() { return {
    "$": ["search.css"]
  }; }
  static get properties() { return {
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
    "documents": {}
  }; }
  static get elementRef() { return "host"; }
}
