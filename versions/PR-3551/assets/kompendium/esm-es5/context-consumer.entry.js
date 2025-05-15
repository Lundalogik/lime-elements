import { r as registerInstance, c as getElement } from './index-2f7cd895.js';
var ContextConsumer = /** @class */ (function () {
    function ContextConsumer(hostRef) {
        registerInstance(this, hostRef);
        this.context = {};
        this.renderer = function () { return null; };
    }
    ContextConsumer.prototype.connectedCallback = function () {
        if (this.subscribe != null) {
            this.unsubscribe = this.subscribe(this.el, 'context');
        }
    };
    ContextConsumer.prototype.disconnectedCallback = function () {
        if (this.unsubscribe != null) {
            this.unsubscribe();
        }
    };
    ContextConsumer.prototype.render = function () {
        return this.renderer(Object.assign({}, this.context));
    };
    Object.defineProperty(ContextConsumer.prototype, "el", {
        get: function () { return getElement(this); },
        enumerable: false,
        configurable: true
    });
    return ContextConsumer;
}());
export { ContextConsumer as context_consumer };
