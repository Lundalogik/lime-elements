import { r as registerInstance, c as getElement } from './index-fb5abbae.js';
import { A as ActiveRouter } from './active-router-5b4f4f5f.js';
var RouteTitle = /** @class */ (function () {
    function RouteTitle(hostRef) {
        registerInstance(this, hostRef);
        this.titleSuffix = '';
        this.pageTitle = '';
    }
    RouteTitle.prototype.updateDocumentTitle = function () {
        var el = this.el;
        if (el.ownerDocument) {
            el.ownerDocument.title = "" + this.pageTitle + (this.titleSuffix || '');
        }
    };
    RouteTitle.prototype.componentWillLoad = function () {
        this.updateDocumentTitle();
    };
    Object.defineProperty(RouteTitle.prototype, "el", {
        get: function () { return getElement(this); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RouteTitle, "watchers", {
        get: function () {
            return {
                "pageTitle": ["updateDocumentTitle"]
            };
        },
        enumerable: false,
        configurable: true
    });
    return RouteTitle;
}());
ActiveRouter.injectProps(RouteTitle, [
    'titleSuffix',
]);
export { RouteTitle as stencil_route_title };
