var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import { h, r as registerInstance, c as getElement } from './index-2f7cd895.js';
function PropertyList(_a) {
    var props = _a.props, id = _a.id;
    if (!props.length) {
        return;
    }
    return __spreadArrays([h("h4", { id: id }, "Properties")], props.map(renderProperty));
}
function renderProperty(property) {
    var items = [
        {
            key: 'Type',
            value: property.type,
        },
        {
            key: 'Attribute name',
            value: property.attr,
        },
        {
            key: 'Default value',
            value: property.default,
        },
        {
            key: 'Optional',
            value: String(property.optional),
        },
        {
            key: 'Required',
            value: String(property.required),
        },
    ];
    return (h("div", null, h("h5", null, property.name), h("kompendium-markdown", { text: property.docs }), h("kompendium-taglist", { tags: property.docsTags }), h("kompendium-proplist", { items: items })));
}
function EventList(_a) {
    var events = _a.events, id = _a.id;
    if (!events.length) {
        return;
    }
    return __spreadArrays([h("h4", { id: id }, "Events")], events.map(renderEvent));
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
    return (h("div", null, h("h5", null, event.event), h("kompendium-markdown", { text: event.docs }), h("kompendium-taglist", { tags: event.docsTags }), h("kompendium-proplist", { items: items })));
}
function MethodList(_a) {
    var methods = _a.methods, id = _a.id;
    if (!methods.length) {
        return;
    }
    return __spreadArrays([h("h4", { id: id }, "Methods")], methods.map(renderMethod));
}
function renderMethod(method) {
    var items = [
        {
            key: 'Signature',
            value: method.signature,
        },
    ];
    return (h("div", null, h("h5", null, method.name), h("kompendium-markdown", { text: method.docs }), h("kompendium-taglist", { tags: method.docsTags }), h("kompendium-proplist", { items: items })));
}
function SlotList(_a) {
    var slots = _a.slots, id = _a.id;
    if (!slots.length) {
        return;
    }
    return __spreadArrays([h("h4", { id: id }, "Slots")], slots.map(renderSlot));
}
function renderSlot(slot) {
    return (h("div", null, h("h5", null, slot.name), h("kompendium-markdown", { text: slot.docs })));
}
function StyleList(_a) {
    var styles = _a.styles, id = _a.id;
    if (!styles.length) {
        return;
    }
    return __spreadArrays([h("h4", { id: id }, "Styles")], styles.map(renderStyle));
}
function renderStyle(style) {
    return (h("div", null, h("h5", null, style.name), h("kompendium-markdown", { text: style.docs })));
}
function ExampleList(_a) {
    var examples = _a.examples, id = _a.id;
    if (!examples.length) {
        return;
    }
    return [h("h4", { id: id }, "Examples"), examples.map(renderExample)];
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
var componentCss = "*,*::before,*::after{-webkit-box-sizing:border-box;box-sizing:border-box}ul[class],ol[class]{padding:0}body,h1,h2,h3,h4,p,ul[class],ol[class],li,figure,figcaption,blockquote,dl,dd{margin:0}ul[class],ol[class]{list-style:none}a:not([class]){-webkit-text-decoration-skip:ink;text-decoration-skip-ink:auto}img{max-width:100%;display:block}input,button,textarea,select{font:inherit}@media (prefers-reduced-motion: reduce){*{-webkit-animation-duration:0.01ms !important;animation-duration:0.01ms !important;-webkit-animation-iteration-count:1 !important;animation-iteration-count:1 !important;-webkit-transition-duration:0.01ms !important;transition-duration:0.01ms !important;scroll-behavior:auto !important}}p,a,li{font-size:0.875rem}h1,h2,h3,h4,h5,h6{margin-top:0;margin-bottom:1.25rem;font-weight:300}h1{font-size:2.5rem;line-height:1.2;letter-spacing:-0.0625rem}h2{font-size:2.25rem;line-height:1.25;letter-spacing:-0.0625rem}h3{font-size:1.875rem;line-height:1.3;letter-spacing:-0.0625rem}h4{font-size:1.5rem;line-height:1.35;letter-spacing:-0.05rem}h5{font-size:1.125rem;line-height:1.5;letter-spacing:-0.03125rem}h6{font-size:0, 9375rem;line-height:1.6;letter-spacing:0}@media (min-width: 550px){h1{font-size:3.125rem}h2{font-size:2.625rem}h3{font-size:2.5rem}h4{font-size:1.875rem}h5{font-size:1.5rem}h6{font-size:0.9375rem}}p{margin-top:0;margin-bottom:1rem}a{color:var(--kompendium-primary-color)}a:hover{color:var(--kompendium-primary-color)}ul{list-style:circle inside}ol{list-style:decimal inside}ol,ul{padding-left:0;margin-top:0}ul ul,ul ol,ol ol,ol ul{margin:0.9375rem 0 0.9375rem 1.875rem;font-size:90%}li{margin-bottom:0.625rem}th,td{padding:12px 15px;text-align:left;border-bottom:1px solid #e1e1e1}th:first-child,td:first-child{padding-left:0}th:last-child,td:last-child{padding-right:0}hr{margin-top:1.875rem;margin-bottom:2.1875rem;border-width:0;border-top:1px solid #e1e1e1}dt{font-weight:500}:host{display:block}.docs{padding:1.25rem 2rem}.docs h1,.docs h2,.docs h3,.docs h4,.docs h5,.docs kompendium-markdown,.docs kompendium-taglist{width:50%}.docs kompendium-playground{width:100%}kompendium-taglist{margin-bottom:1rem}kompendium-proplist{margin-bottom:2rem}h5{border-bottom:1px solid rgb(var(--contrast-600))}@media (max-width: 1000px){.docs{padding-top:2.625rem}.docs h1,.docs h2,.docs h3,.docs h4,.docs h5,.docs kompendium-markdown,.docs kompendium-taglist{width:100%}}";
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
