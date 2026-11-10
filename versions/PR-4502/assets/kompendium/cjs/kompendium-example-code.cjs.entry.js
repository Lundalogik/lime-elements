'use strict';

var index = require('./index-B_xYBJw_.js');

const code = `
import foo from 'foo';

foo();
`;
const CodeExample = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
    }
    render() {
        return index.h("kompendium-code", { key: '503b97b84d0003cd4feaba3657ef13b3085ad2e7', language: "ts" }, code);
    }
};

exports.kompendium_example_code = CodeExample;
