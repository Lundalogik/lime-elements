var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import { h, r as registerInstance } from './index-fb5abbae.js';
import { P as PropertyList, M as MethodList } from './methods-872c3837.js';
function Interface(_a) {
    var type = _a.type;
    return [
        h("h1", { id: type.name }, type.name),
        h("kompendium-markdown", { text: type.docs }),
        h("kompendium-taglist", { tags: type.docsTags }),
        h(PropertyList, { props: type.props }),
        h(MethodList, { methods: type.methods }),
    ];
}
function Alias(_a) {
    var type = _a.type;
    var alias = '`' + type.alias + '`';
    return [
        h("h1", { id: type.name }, type.name),
        h("kompendium-markdown", { text: type.docs }),
        h("kompendium-taglist", { tags: type.docsTags }),
        h("kompendium-markdown", { text: alias }),
    ];
}
function Enum(_a) {
    var type = _a.type;
    return [
        h("h1", { id: type.name }, type.name),
        h("kompendium-markdown", { text: type.docs }),
        h("kompendium-taglist", { tags: type.docsTags }),
        h(MemberList, { members: type.members }),
    ];
}
function MemberList(_a) {
    var members = _a.members;
    if (!members.length) {
        return;
    }
    return __spreadArrays([h("h3", null, "Members")], members.map(renderMember));
}
function renderMember(member) {
    var items = [
        {
            key: 'Value',
            value: member.value,
        },
    ];
    return (h("div", null, h("h4", null, member.name), h("kompendium-markdown", { text: member.docs }), h("kompendium-taglist", { tags: member.docsTags }), h("kompendium-proplist", { items: items })));
}
var componentCss = "*,*::before,*::after{-webkit-box-sizing:border-box;box-sizing:border-box}ul[class],ol[class]{padding:0}body,h1,h2,h3,h4,p,ul[class],ol[class],li,figure,figcaption,blockquote,dl,dd{margin:0}ul[class],ol[class]{list-style:none}a:not([class]){-webkit-text-decoration-skip:ink;text-decoration-skip-ink:auto}img{max-width:100%}input,button,textarea,select{font:inherit}@media (prefers-reduced-motion: reduce){*{-webkit-animation-duration:0.01ms !important;animation-duration:0.01ms !important;-webkit-animation-iteration-count:1 !important;animation-iteration-count:1 !important;-webkit-transition-duration:0.01ms !important;transition-duration:0.01ms !important;scroll-behavior:auto !important}}:root{--width-nav-panel:16rem}p,a,li{font-size:0.875rem}h1,h2,h3,h4,h5,h6{margin-bottom:0.5rem;font-weight:normal;font-weight:500}h1{font-size:2rem;line-height:2.25rem;margin-top:1.5rem;letter-spacing:-0.0625rem;font-weight:400}h2{font-size:1.625rem;line-height:1.25rem;margin-top:1.25rem;margin-bottom:1rem}h3{font-size:1.375rem;line-height:1.5rem;margin-top:1rem}h4{font-size:1.25rem;line-height:1.25rem;margin-top:1rem}h5{font-size:1.125rem;line-height:1.125rem;margin-top:0.75rem}h6{font-size:1rem;font-variant:all-small-caps;letter-spacing:0.0625rem}p,blockquote{margin-top:0;margin-bottom:0.5rem}p:only-child,blockquote:only-child{margin-bottom:0}a{-webkit-transition:color 0.2s ease;transition:color 0.2s ease;color:rgb(var(--color-blue-default));text-decoration:none}a:hover{color:rgb(var(--color-blue-light))}ul{list-style:none}ul li{position:relative;margin-left:0.75rem}ul li:before{content:\"\";position:absolute;left:-0.5rem;top:0.625rem;width:0.25rem;height:0.25rem;border-radius:50%;background-color:rgb(var(--contrast-700));display:block}ol{list-style:decimal inside}ol,ul{padding-left:0;margin-top:0}ul ul,ul ol,ol ol,ol ul{margin:0.9375rem 0 0.9375rem 1.875rem;font-size:90%}li{margin-bottom:0.625rem}th,td{padding:0.75rem 1rem;text-align:left;border-bottom:1px solid rgb(var(--contrast-600))}th:first-child,td:first-child{padding-left:0}th:last-child,td:last-child{padding-right:0}hr{margin:1.75rem 0 2rem 0;border-width:0;border-top:1px solid rgb(var(--contrast-600))}:root{--width-nav-panel:16rem}kompendium-playground{width:100%}.docs-layout-section-heading{padding-top:2.5rem;margin:2.5rem 0 1.25rem 0;border-top:1px solid rgb(var(--contrast-500))}.docs-layout-section-heading:before{content:\"\";width:0.125rem;height:0.75rem;display:inline-block;background-color:rgba(var(--color-code-blue), 0.4);border-radius:0.0625rem;-webkit-transform:translateX(-0.5rem);transform:translateX(-0.5rem)}.props-events-layout .markdown-props{display:grid;grid-gap:1.25rem;grid-auto-flow:column;grid-template-columns:1fr 1fr}@media (max-width: 1000px){.props-events-layout .markdown-props{grid-gap:0.75rem;grid-auto-flow:row;grid-template-columns:unset}}.methods-layout{border-radius:0.375rem;margin-bottom:2.5rem;background-color:rgb(var(--contrast-400))}.methods-title{margin:0;border-radius:0.375rem 0.375rem 0 0;padding:0.75rem 1rem;background-color:rgb(var(--contrast-500));font-size:1.0625rem}.methods-content{display:grid;grid-gap:1.25rem;grid-auto-flow:column;grid-template-columns:1fr 1fr;padding:1rem 1.25rem 1.5rem 1.25rem}.methods-returns{padding:1rem 1.25rem 1.5rem 1.25rem;border-radius:0 0 0.375rem 0.375rem;border-top:1px solid rgb(var(--contrast-600))}.methods-returns h5{margin-top:0}@media (max-width: 1000px){.methods-content{grid-gap:0.75rem;grid-auto-flow:row;grid-template-columns:unset}}.styles-layout{display:grid;grid-auto-flow:column;grid-template-columns:1fr 1fr;grid-gap:0 0.75rem;border:solid rgb(var(--contrast-500));border-width:1px 1px 0 1px;padding:0.5rem;background-color:rgb(var(--contrast-300))}.styles-layout:first-of-type{border-top-right-radius:0.375rem;border-top-left-radius:0.375rem}.styles-layout:last-of-type{border-bottom-right-radius:0.375rem;border-bottom-left-radius:0.375rem;border-bottom-width:1px}.styles-layout:nth-of-type(odd){background-color:rgb(var(--contrast-400))}.styles-title code{font-family:var(--kompendium-font-code);border-radius:0.25rem;border:1px solid rgba(var(--contrast-1100), 0.1);font-size:0.6875rem;white-space:nowrap;color:rgb(var(--contrast-1100));padding:0.125rem 0.3125rem;margin:0 0.125rem;background:rgba(var(--contrast-1100), 0.05)}@media (max-width: 1000px){.styles-layout{grid-auto-flow:row;grid-template-columns:unset;grid-gap:0.75rem 0}}:host{display:block}.docs kompendium-markdown{display:block;width:calc(50% - 2rem)}@media (max-width: 1400px){.docs kompendium-markdown{width:100%}}";
var Type = /** @class */ (function () {
    function Type(hostRef) {
        registerInstance(this, hostRef);
    }
    Type.prototype.componentWillRender = function () {
        this.findType();
    };
    Type.prototype.render = function () {
        if (!this.type) {
            return;
        }
        var type = this.type;
        var componentMap = {
            interface: Interface,
            alias: Alias,
            enum: Enum,
        };
        var TypeComponent = componentMap[this.type.type];
        return (h("article", { class: "type" }, h("section", { class: "docs" }, h(TypeComponent, { type: type }))));
    };
    Type.prototype.findType = function () {
        var _this = this;
        var type = this.types.find(function (type) { return type.name === _this.match.params.name; });
        if (type) {
            this.type = type;
        }
    };
    return Type;
}());
Type.style = componentCss;
export { Type as kompendium_type };
