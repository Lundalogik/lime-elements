import { h } from "@stencil/core";
import { markdownExample } from "./markdown-example";
/**
 * This is a simple example of how the `kompendium-markdown` component is used
 * @sourceFile markdown-example.ts
 */
export class MarkdownExample {
    render() {
        return h("kompendium-markdown", { key: '6db38675f45e524403707a714226b9f794ea1285', text: markdownExample });
    }
    static get is() { return "kompendium-example-markdown"; }
    static get encapsulation() { return "shadow"; }
}
//# sourceMappingURL=markdown.js.map
