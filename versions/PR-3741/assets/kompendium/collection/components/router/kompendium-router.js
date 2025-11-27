import { Component, h, Prop } from '@stencil/core';
/**
 * Custom router component for Kompendium
 * Manages routing state using hash-based navigation
 */
export class KompendiumRouter {
  constructor() {
    this.historyType = 'hash';
  }
  render() {
    return h("slot", null);
  }
  static get is() { return "kompendium-router"; }
  static get properties() { return {
    "historyType": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "'hash' | 'browser'",
        "resolved": "\"browser\" | \"hash\"",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": ""
      },
      "attribute": "history-type",
      "reflect": false,
      "defaultValue": "'hash'"
    }
  }; }
}
