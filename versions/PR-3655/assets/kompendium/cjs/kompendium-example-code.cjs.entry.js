'use strict';

var index = require('./index-CI2W1cDY.js');

const code = `
import foo from 'foo';

foo();
`;
const CodeExample = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
    }
    render() {
        return index.h("kompendium-code", { key: '39753fdbf54b9d27625ac4e5058ec7a016d38b37', language: "ts" }, code);
    }
};

exports.kompendium_example_code = CodeExample;
//# sourceMappingURL=kompendium-example-code.entry.cjs.js.map
