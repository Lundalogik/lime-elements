'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-4264cbf1.js');

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
