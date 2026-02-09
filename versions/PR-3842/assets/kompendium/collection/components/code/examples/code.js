import { h } from "@stencil/core";
const code = `
import foo from 'foo';

foo();
`;
export class CodeExample {
    render() {
        return h("kompendium-code", { key: '39753fdbf54b9d27625ac4e5058ec7a016d38b37', language: "ts" }, code);
    }
    static get is() { return "kompendium-example-code"; }
    static get encapsulation() { return "shadow"; }
}
//# sourceMappingURL=code.js.map
