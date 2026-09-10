import { r as registerInstance, h } from './index-26EzvxF0.js';

const code = `
import foo from 'foo';

foo();
`;
const CodeExample = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        return h("kompendium-code", { key: '503b97b84d0003cd4feaba3657ef13b3085ad2e7', language: "ts" }, code);
    }
};

export { CodeExample as kompendium_example_code };
