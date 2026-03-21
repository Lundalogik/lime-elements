import { h } from "@stencil/core";
const code = `
import foo from 'foo';

foo();
`;
export class CodeExample {
    render() {
        return h("kompendium-code", { key: '03405a3a1ab839b1b9caa99cf938230a1ff61c18', language: "ts" }, code);
    }
    static get is() { return "kompendium-example-code"; }
    static get encapsulation() { return "shadow"; }
}
//# sourceMappingURL=code.js.map
