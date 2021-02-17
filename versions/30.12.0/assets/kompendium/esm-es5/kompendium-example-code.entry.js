import { r as registerInstance, h } from './index-fb5abbae.js';
var code = "\nimport foo from 'foo';\n\nfoo();\n";
var CodeExample = /** @class */ (function () {
    function CodeExample(hostRef) {
        registerInstance(this, hostRef);
    }
    CodeExample.prototype.render = function () {
        return h("kompendium-code", { language: "ts" }, code);
    };
    return CodeExample;
}());
export { CodeExample as kompendium_example_code };
