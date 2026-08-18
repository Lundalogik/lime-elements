import { h } from "@stencil/core";
import { inlineLinksExample } from "./inline-links-example";
/**
 * Inline `@link` references
 *
 * Demonstrates how inline `{@link Target}` references in markdown are
 * turned into clickable links.
 * @sourceFile inline-links-example.ts
 */
export class InlineLinksExample {
    render() {
        return h("kompendium-markdown", { key: 'c7d9c35768b82399af32d1a0f706860226697e6c', text: inlineLinksExample });
    }
    static get is() { return "kompendium-example-inline-links"; }
    static get encapsulation() { return "shadow"; }
}
