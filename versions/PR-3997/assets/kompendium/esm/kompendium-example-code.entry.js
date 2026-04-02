import { r as registerInstance, h } from './index-9UrzenzW.js';

const code = `
import foo from 'foo';

foo();
`;
const CodeExample = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        return h("kompendium-code", { key: '03405a3a1ab839b1b9caa99cf938230a1ff61c18', language: "ts" }, code);
    }
};

export { CodeExample as kompendium_example_code };
//# sourceMappingURL=kompendium-example-code.entry.js.map
