import { h } from "@stencil/core";
import { markdownExample } from "./markdown-example";
/**
 * This is a simple example of how the `kompendium-markdown` component is used
 * @sourceFile markdown-example.ts
 */
export class MarkdownExample {
    render() {
        return h("kompendium-markdown", { key: '3182f8225d8f819a363ef5ca80f4bda468b78856', text: markdownExample });
    }
    static get is() { return "kompendium-example-markdown"; }
    static get encapsulation() { return "shadow"; }
}
