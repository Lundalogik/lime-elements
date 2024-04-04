import { Component, h } from '@stencil/core';
import { markdownExample } from './markdown-example';
/**
 * This is a simple example of how the `kompendium-markdown` component is used
 *
 * @link markdown-example.ts
 */
export class MarkdownExample {
  render() {
    return h("kompendium-markdown", { text: markdownExample });
  }
  static get is() { return "kompendium-example-markdown"; }
  static get encapsulation() { return "shadow"; }
}
