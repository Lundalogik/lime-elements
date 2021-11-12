import { Component, h } from '@stencil/core';
import { bacon } from './bacon';
/**
 * This is a simple example of how the `kompendium-markdown` component is used
 *
 * @link bacon.ts
 */
export class MarkdownExample {
    render() {
        return h("kompendium-markdown", { text: bacon });
    }
    static get is() { return "kompendium-example-markdown"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["markdown.scss"]
    }; }
    static get styleUrls() { return {
        "$": ["markdown.css"]
    }; }
}
