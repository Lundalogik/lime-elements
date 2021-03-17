import { r as registerInstance, c as getElement } from './index-fb5abbae.js';
import { A as ActiveRouter } from './active-router-5b4f4f5f.js';
// Get the URL for this route link without the root from the router
var getUrl = function (url, root) {
    // Don't allow double slashes
    if (url.charAt(0) == '/' && root.charAt(root.length - 1) == '/') {
        return root.slice(0, root.length - 1) + url;
    }
    return root + url;
};
var Redirect = /** @class */ (function () {
    function Redirect(hostRef) {
        registerInstance(this, hostRef);
    }
    Redirect.prototype.componentWillLoad = function () {
        if (this.history && this.root && this.url) {
            return this.history.replace(getUrl(this.url, this.root));
        }
    };
    Object.defineProperty(Redirect.prototype, "el", {
        get: function () { return getElement(this); },
        enumerable: false,
        configurable: true
    });
    return Redirect;
}());
ActiveRouter.injectProps(Redirect, [
    'history',
    'root'
]);
export { Redirect as stencil_router_redirect };
