import { Component, h } from '@stencil/core';
const code = `
import foo from 'foo';

foo();
`;
export class CodeExample {
    render() {
        return h("kompendium-code", { language: "ts" }, code);
    }
    static get is() { return "kompendium-example-code"; }
    static get encapsulation() { return "shadow"; }
}
