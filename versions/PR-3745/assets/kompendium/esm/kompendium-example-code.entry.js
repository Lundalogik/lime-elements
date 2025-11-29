import { r as registerInstance, h } from './index-DOaZxWLP.js';

const code = `
import foo from 'foo';

foo();
`;
const CodeExample = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        return h("kompendium-code", { key: '39753fdbf54b9d27625ac4e5058ec7a016d38b37', language: "ts" }, code);
    }
};

export { CodeExample as kompendium_example_code };
//# sourceMappingURL=kompendium-example-code.entry.js.map
