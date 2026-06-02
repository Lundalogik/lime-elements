'use strict';

var index = require('./index-DYiJ6dQL.js');

const code = `
import foo from 'foo';

foo();
`;
const CodeExample = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
    }
    render() {
        return index.h("kompendium-code", { key: '03405a3a1ab839b1b9caa99cf938230a1ff61c18', language: "ts" }, code);
    }
};

exports.kompendium_example_code = CodeExample;
//# sourceMappingURL=kompendium-example-code.entry.cjs.js.map
