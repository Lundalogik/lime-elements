import { r as registerInstance, h } from './index-2f7cd895.js';
var Guide = /** @class */ (function () {
    function Guide(hostRef) {
        registerInstance(this, hostRef);
        this.setRoute = this.setRoute.bind(this);
    }
    Guide.prototype.componentWillLoad = function () {
        window.addEventListener('hashchange', this.setRoute);
        this.setRoute();
    };
    Guide.prototype.componentDidUnload = function () {
        window.removeEventListener('hashchange', this.setRoute);
    };
    Guide.prototype.setRoute = function () {
        this.route = location.hash.replace('#', '');
    };
    Guide.prototype.render = function () {
        this.findGuide();
        return h("kompendium-markdown", { text: this.text });
    };
    Guide.prototype.findGuide = function () {
        var _this = this;
        var guide = this.data.guides.find(function (guide) { return guide.data.frontmatter.path === _this.route; });
        if (guide) {
            this.text = guide.content;
        }
    };
    return Guide;
}());
export { Guide as kompendium_guide };
