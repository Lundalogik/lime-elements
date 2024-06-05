import { Component, h, Prop } from '@stencil/core';
/**
 * asd
 */
export class Taglist {
  constructor() {
    /**
     * Set to `true` if the list should be rendered in compact mode
     */
    this.compact = false;
  }
  render() {
    return this.tags.map(this.renderTag);
  }
  renderTag(tag) {
    const classList = {
      'tag-list': true,
    };
    classList[`tag--${tag.name}`] = true;
    return (h("div", { class: classList },
      h("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24" },
        h("path", { d: "M5 2h14a1 1 0 0 1 1 1v19.143a.5.5 0 0 1-.766.424L12 18.03l-7.234 4.536A.5.5 0 0 1 4 22.143V3a1 1 0 0 1 1-1z", fill: "currentColor" })),
      h("code", null,
        "@",
        tag.name),
      h("kompendium-markdown", { text: tag.text })));
  }
  static get is() { return "kompendium-taglist"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() { return {
    "$": ["taglist.scss"]
  }; }
  static get styleUrls() { return {
    "$": ["taglist.css"]
  }; }
  static get properties() { return {
    "tags": {
      "type": "unknown",
      "mutable": false,
      "complexType": {
        "original": "JsonDocsTag[]",
        "resolved": "JsonDocsTag[]",
        "references": {
          "JsonDocsTag": {
            "location": "import",
            "path": "@stencil/core/internal"
          }
        }
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "List of tags to render"
      }
    },
    "compact": {
      "type": "boolean",
      "mutable": false,
      "complexType": {
        "original": "boolean",
        "resolved": "boolean",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "Set to `true` if the list should be rendered in compact mode"
      },
      "attribute": "compact",
      "reflect": false,
      "defaultValue": "false"
    }
  }; }
}
