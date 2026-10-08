import { h } from "@stencil/core";
const code = `
import foo from 'foo';

foo();
`;
export class CodeExample {
    render() {
        return h("kompendium-code", { key: '503b97b84d0003cd4feaba3657ef13b3085ad2e7', language: "ts" }, code);
    }
    static get is() { return "kompendium-example-code"; }
    static get encapsulation() { return "shadow"; }
}
