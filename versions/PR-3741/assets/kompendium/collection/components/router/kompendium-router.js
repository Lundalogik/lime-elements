import { Component, h } from '@stencil/core';
/**
 * Custom router component for Kompendium
 * Manages routing state using hash-based navigation
 */
export class KompendiumRouter {
  render() {
    return h("slot", null);
  }
  static get is() { return "kompendium-router"; }
}
