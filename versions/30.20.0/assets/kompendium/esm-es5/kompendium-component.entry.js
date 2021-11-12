var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import { h, r as registerInstance, c as getElement } from './index-fb5abbae.js';
import { P as PropertyList, M as MethodList } from './methods-872c3837.js';
function EventList(_a) {
    var events = _a.events, id = _a.id;
    if (!events.length) {
        return;
    }
    return __spreadArrays([
        h("h3", { class: "docs-layout-section-heading", id: id }, "Events")
    ], events.map(renderEvent));
}
function renderEvent(event) {
    var items = [
        {
            key: 'Detail',
            value: event.detail,
        },
        {
            key: 'Bubbles',
            value: String(event.bubbles),
        },
        {
            key: 'Cancelable',
            value: String(event.cancelable),
        },
        {
            key: 'Composed',
            value: String(event.composed),
        },
    ];
    return (h("div", { class: "props-events-layout" }, h("h4", null, event.event), h("kompendium-taglist", { tags: event.docsTags }), h("div", { class: "markdown-props" }, h("kompendium-markdown", { text: event.docs }), h("kompendium-proplist", { items: items }))));
}
function SlotList(_a) {
    var slots = _a.slots, id = _a.id;
    if (!slots.length) {
        return;
    }
    return __spreadArrays([
        h("h3", { class: "docs-layout-section-heading", id: id }, "Slots")
    ], slots.map(renderSlot));
}
function renderSlot(slot) {
    return (h("div", null, h("h4", null, slot.name), h("kompendium-markdown", { text: slot.docs })));
}
function StyleList(_a) {
    var styles = _a.styles, id = _a.id;
    if (!styles.length) {
        return;
    }
    return __spreadArrays([
        h("h3", { class: "docs-layout-section-heading", id: id }, "Styles")
    ], styles.map(renderStyle));
}
function renderStyle(style) {
    return (h("div", { class: "styles-layout" }, h("div", { class: "styles-title" }, h("code", null, style.name)), h("div", { class: "styles-content" }, h("kompendium-markdown", { text: style.docs }))));
}
function ExampleList(_a) {
    var examples = _a.examples, id = _a.id;
    if (!examples.length) {
        return;
    }
    return [
        h("h3", { class: "docs-layout-section-heading", id: id }, "Examples"),
        examples.map(renderExample),
    ];
}
var renderExample = function (example) {
    return h("kompendium-playground", { component: example });
};
/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';
/**
 * Creates a function that negates the result of the predicate `func`. The
 * `func` predicate is invoked with the `this` binding and arguments of the
 * created function.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Function
 * @param {Function} predicate The predicate to negate.
 * @returns {Function} Returns the new negated function.
 * @example
 *
 * function isEven(n) {
 *   return n % 2 == 0;
 * }
 *
 * _.filter([1, 2, 3, 4, 5, 6], _.negate(isEven));
 * // => [1, 3, 5]
 */
function negate(predicate) {
    if (typeof predicate != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
    }
    return function () {
        var args = arguments;
        switch (args.length) {
            case 0: return !predicate.call(this);
            case 1: return !predicate.call(this, args[0]);
            case 2: return !predicate.call(this, args[0], args[1]);
            case 3: return !predicate.call(this, args[0], args[1], args[2]);
        }
        return !predicate.apply(this, args);
    };
}
var negate_1 = negate;
var componentCss = "*,*::before,*::after{-webkit-box-sizing:border-box;box-sizing:border-box}ul[class],ol[class]{padding:0}body,h1,h2,h3,h4,p,ul[class],ol[class],li,figure,figcaption,blockquote,dl,dd{margin:0}ul[class],ol[class]{list-style:none}a:not([class]){-webkit-text-decoration-skip:ink;text-decoration-skip-ink:auto}img{max-width:100%}input,button,textarea,select{font:inherit}@media (prefers-reduced-motion: reduce){*{-webkit-animation-duration:0.01ms !important;animation-duration:0.01ms !important;-webkit-animation-iteration-count:1 !important;animation-iteration-count:1 !important;-webkit-transition-duration:0.01ms !important;transition-duration:0.01ms !important;scroll-behavior:auto !important}}:root{--width-nav-panel:16rem}p,a,li{font-size:0.875rem}h1,h2,h3,h4,h5,h6{margin-bottom:0.5rem;font-weight:normal;font-weight:500}h1{font-size:2rem;line-height:2.25rem;margin-top:1.5rem;letter-spacing:-0.0625rem;font-weight:400}h2{font-size:1.625rem;line-height:1.25rem;margin-top:1.25rem;margin-bottom:1rem}h3{font-size:1.375rem;line-height:1.5rem;margin-top:1rem}h4{font-size:1.25rem;line-height:1.25rem;margin-top:1rem}h5{font-size:1.125rem;line-height:1.125rem;margin-top:0.75rem}h6{font-size:1rem;font-variant:all-small-caps;letter-spacing:0.0625rem}p,blockquote{margin-top:0;margin-bottom:0.5rem}p:only-child,blockquote:only-child{margin-bottom:0}a{-webkit-transition:color 0.2s ease;transition:color 0.2s ease;color:rgb(var(--color-blue-default));text-decoration:none}a:hover{color:rgb(var(--color-blue-light))}ul{list-style:none}ul li{position:relative;margin-left:0.75rem}ul li:before{content:\"\";position:absolute;left:-0.5rem;top:0.625rem;width:0.25rem;height:0.25rem;border-radius:50%;background-color:rgb(var(--contrast-700));display:block}ol{list-style:decimal inside}ol,ul{padding-left:0;margin-top:0}ul ul,ul ol,ol ol,ol ul{margin:0.9375rem 0 0.9375rem 1.875rem;font-size:90%}li{margin-bottom:0.625rem}th,td{padding:0.75rem 1rem;text-align:left;border-bottom:1px solid rgb(var(--contrast-600))}th:first-child,td:first-child{padding-left:0}th:last-child,td:last-child{padding-right:0}hr{margin:1.75rem 0 2rem 0;border-width:0;border-top:1px solid rgb(var(--contrast-600))}:root{--width-nav-panel:16rem}kompendium-playground{width:100%}.docs-layout-section-heading{padding-top:2.5rem;margin:2.5rem 0 1.25rem 0;border-top:1px solid rgb(var(--contrast-500))}.docs-layout-section-heading:before{content:\"\";width:0.125rem;height:0.75rem;display:inline-block;background-color:rgba(var(--color-code-blue), 0.4);border-radius:0.0625rem;-webkit-transform:translateX(-0.5rem);transform:translateX(-0.5rem)}.props-events-layout .markdown-props{display:grid;grid-gap:1.25rem;grid-auto-flow:column;grid-template-columns:1fr 1fr}@media (max-width: 1000px){.props-events-layout .markdown-props{grid-gap:0.75rem;grid-auto-flow:row;grid-template-columns:unset}}.methods-layout{border-radius:0.375rem;margin-bottom:2.5rem;background-color:rgb(var(--contrast-400))}.methods-title{margin:0;border-radius:0.375rem 0.375rem 0 0;padding:0.75rem 1rem;background-color:rgb(var(--contrast-500));font-size:1.0625rem}.methods-content{display:grid;grid-gap:1.25rem;grid-auto-flow:column;grid-template-columns:1fr 1fr;padding:1rem 1.25rem 1.5rem 1.25rem}.methods-returns{padding:1rem 1.25rem 1.5rem 1.25rem;border-radius:0 0 0.375rem 0.375rem;border-top:1px solid rgb(var(--contrast-600))}.methods-returns h5{margin-top:0}@media (max-width: 1000px){.methods-content{grid-gap:0.75rem;grid-auto-flow:row;grid-template-columns:unset}}.styles-layout{display:grid;grid-auto-flow:column;grid-template-columns:1fr 1fr;grid-gap:0 0.75rem;border:solid rgb(var(--contrast-500));border-width:1px 1px 0 1px;padding:0.5rem;background-color:rgb(var(--contrast-300))}.styles-layout:first-of-type{border-top-right-radius:0.375rem;border-top-left-radius:0.375rem}.styles-layout:last-of-type{border-bottom-right-radius:0.375rem;border-bottom-left-radius:0.375rem;border-bottom-width:1px}.styles-layout:nth-of-type(odd){background-color:rgb(var(--contrast-400))}.styles-title code{font-family:var(--kompendium-font-code);border-radius:0.25rem;border:1px solid rgba(var(--contrast-1100), 0.1);font-size:0.6875rem;white-space:nowrap;color:rgb(var(--contrast-1100));padding:0.125rem 0.3125rem;margin:0 0.125rem;background:rgba(var(--contrast-1100), 0.05)}@media (max-width: 1000px){.styles-layout{grid-auto-flow:row;grid-template-columns:unset;grid-gap:0.75rem 0}}:host{display:block}.docs kompendium-markdown{display:block;width:calc(50% - 2rem)}@media (max-width: 1400px){.docs kompendium-markdown{width:100%}}";
var KompendiumComponent = /** @class */ (function () {
    function KompendiumComponent(hostRef) {
        registerInstance(this, hostRef);
        this.handleRouteChange = this.handleRouteChange.bind(this);
    }
    KompendiumComponent.prototype.componentWillLoad = function () {
        window.addEventListener('hashchange', this.handleRouteChange);
    };
    KompendiumComponent.prototype.componentDidUnload = function () {
        window.removeEventListener('hashchange', this.handleRouteChange);
    };
    KompendiumComponent.prototype.componentDidLoad = function () {
        var route = this.getRoute();
        this.scrollToElement(route);
    };
    KompendiumComponent.prototype.handleRouteChange = function () {
        var route = this.getRoute();
        this.scrollToElement(route);
    };
    KompendiumComponent.prototype.scrollToElement = function (id) {
        var element = this.host.shadowRoot.getElementById(id);
        if (!element) {
            return;
        }
        element.scrollIntoView();
    };
    KompendiumComponent.prototype.render = function () {
        var tag = this.match.params.name;
        var component = findComponent(tag, this.docs);
        return (h("article", { class: "component" }, h("section", { class: "docs" }, this.renderDocs(tag, component))));
    };
    KompendiumComponent.prototype.renderDocs = function (tag, component) {
        var title = tag.split('-').slice(1).join(' ');
        title = title[0].toLocaleUpperCase() + title.slice(1);
        var examples = findExamples(component, this.docs);
        var tags = component.docsTags
            .filter(negate_1(isTag('slot')))
            .filter(negate_1(isTag('exampleComponent')));
        return [
            h("h1", { id: this.getId() }, title),
            h("kompendium-markdown", { text: component.docs }),
            h("kompendium-taglist", { tags: tags }),
            h(ExampleList, { examples: examples, id: this.getId('examples') }),
            h(PropertyList, { props: component.props, id: this.getId('properties') }),
            h(EventList, { events: component.events, id: this.getId('events') }),
            h(MethodList, { methods: component.methods, id: this.getId('methods') }),
            h(SlotList, { slots: component.slots, id: this.getId('slots') }),
            h(StyleList, { styles: component.styles, id: this.getId('styles') }),
        ];
    };
    KompendiumComponent.prototype.getId = function (name) {
        var route = this.getRoute().split('/').slice(0, 3).join('/');
        return [route, name].filter(function (item) { return !!item; }).join('/');
    };
    KompendiumComponent.prototype.getRoute = function () {
        return location.hash.substr(1);
    };
    Object.defineProperty(KompendiumComponent.prototype, "host", {
        get: function () { return getElement(this); },
        enumerable: false,
        configurable: true
    });
    return KompendiumComponent;
}());
function findExamples(component, docs) {
    return component.docsTags
        .filter(isTag('exampleComponent'))
        .map(findComponentByTag(docs));
}
function findComponent(tag, docs) {
    return docs.components.find(function (doc) { return doc.tag === tag; });
}
var findComponentByTag = function (docs) { return function (tag) {
    return docs.components.find(function (component) { return component.tag === tag.text; });
}; };
var isTag = function (name) { return function (tag) {
    return tag.name === name;
}; };
KompendiumComponent.style = componentCss;
export { KompendiumComponent as kompendium_component };
