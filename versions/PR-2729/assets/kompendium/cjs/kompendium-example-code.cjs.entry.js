'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-d017bb3a.js');

const code = `
import foo from 'foo';

foo();
`;
const CodeExample = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
  }
  render() {
    return index.h("kompendium-code", { language: "ts" }, code);
  }
};

exports.kompendium_example_code = CodeExample;
