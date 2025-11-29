'use strict';

var index = require('./index-CI2W1cDY.js');
var methods = require('./methods-VwzZxRXE.js');
var _commonjsHelpers = require('./_commonjsHelpers-B83fTs8d.js');

function EventList({ events, id, }) {
    if (!events.length) {
        return;
    }
    return [
        index.h("h3", { class: "docs-layout-section-heading", id: id }, "Events"),
        ...events.map(renderEvent),
    ];
}
function renderEvent(event) {
    const items = [
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
    return (index.h("div", { class: "props-events-layout" }, index.h("h4", null, event.event), index.h("kompendium-taglist", { tags: event.docsTags }), index.h("div", { class: "markdown-props" }, index.h("kompendium-markdown", { text: event.docs }), index.h("kompendium-proplist", { items: items }))));
}

function SlotList({ slots, id, }) {
    if (!slots.length) {
        return;
    }
    return [
        index.h("h3", { class: "docs-layout-section-heading", id: id }, "Slots"),
        ...slots.map(renderSlot),
    ];
}
function renderSlot(slot) {
    return (index.h("div", null, index.h("h4", null, slot.name), index.h("kompendium-markdown", { text: slot.docs })));
}

function StyleList({ styles, id, }) {
    if (!styles.length) {
        return;
    }
    return [
        index.h("h3", { class: "docs-layout-section-heading", id: id }, "Styles"),
        ...styles.map(renderStyle),
    ];
}
function renderStyle(style) {
    return (index.h("div", { class: "styles-layout" }, index.h("div", { class: "styles-title" }, index.h("code", null, style.name)), index.h("div", { class: "styles-content" }, index.h("kompendium-markdown", { text: style.docs }))));
}

function ExampleList({ examples, id, schema, propsFactory, }) {
    if (!examples.length) {
        return;
    }
    return [
        index.h("h3", { class: "docs-layout-section-heading", id: id }, "Examples"),
        examples.map(renderExample(schema, propsFactory)),
    ];
}
const renderExample = (schema, factory) => (example) => {
    return (index.h("kompendium-playground", { component: example, schema: schema, propsFactory: factory }));
};

/** Error message constants. */

var negate_1;
var hasRequiredNegate;

function requireNegate () {
	if (hasRequiredNegate) return negate_1;
	hasRequiredNegate = 1;
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
	  return function() {
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

	negate_1 = negate;
	return negate_1;
}

var negateExports = requireNegate();
var negate = /*@__PURE__*/_commonjsHelpers.getDefaultExportFromCjs(negateExports);

const componentCss = "*,*::before,*::after{box-sizing:border-box}ul[class],ol[class]{padding:0}body,h1,h2,h3,h4,p,ul[class],ol[class],li,figure,figcaption,blockquote,dl,dd{margin:0}ul[class],ol[class]{list-style:none}a:not([class]){text-decoration-skip-ink:auto}img{max-width:100%}input,button,textarea,select{font:inherit}@media (prefers-reduced-motion: reduce){*{animation-duration:0.01ms !important;animation-iteration-count:1 !important;transition-duration:0.01ms !important;scroll-behavior:auto !important}}:root{--width-nav-panel:16rem}p,a,li{font-size:0.9375rem}h1,h2,h3,h4,h5,h6{margin-bottom:0.5rem;font-weight:normal;font-weight:500}h1{font-size:2rem;line-height:2.25rem;margin-top:1.5rem;letter-spacing:-0.0625rem;font-weight:400}h2{font-size:1.625rem;line-height:1.25rem;margin-top:1.25rem;margin-bottom:1rem}h3{font-size:1.375rem;line-height:1.5rem;margin-top:1rem}h4{font-size:1.25rem;line-height:1.25rem;margin-top:1rem}h5{font-size:1.125rem;line-height:1.125rem;margin-top:0.75rem}h6{font-size:1rem;font-variant:all-small-caps;letter-spacing:0.0625rem}p,blockquote{margin-top:0;margin-bottom:0.5rem}p:only-child,blockquote:only-child{margin-bottom:0}a{transition:color 0.2s ease;color:rgb(var(--kompendium-color-blue-default));text-decoration:none;border-radius:0.125rem}a:hover{color:rgb(var(--kompendium-color-blue-light))}a:focus{outline:none}a:focus-visible{outline:none;box-shadow:var(--kompendium-shadow-depth-8-focused)}ul{list-style:none}ul li{position:relative;margin-left:0.75rem}ul li:before{content:\"\";position:absolute;left:-0.5rem;top:0.625rem;width:0.25rem;height:0.25rem;border-radius:50%;background-color:rgb(var(--kompendium-contrast-700));display:block}ol{list-style:decimal inside}ol,ul{padding-left:0;margin-top:0}ul ul,ul ol,ol ol,ol ul{margin:0.9375rem 0 0.9375rem 1.875rem;font-size:90%}li{margin-bottom:0.625rem}th,td{padding:0.75rem 1rem;text-align:left;border-bottom:1px solid rgb(var(--kompendium-contrast-600))}th:first-child,td:first-child{padding-left:0}th:last-child,td:last-child{padding-right:0}hr{margin:1.75rem 0 2rem 0;border-width:0;border-top:1px solid rgb(var(--kompendium-contrast-600))}kbd{font-family:var(--kompendium-font-code);font-size:0.875rem;font-weight:600;color:rgb(var(--kompendium-contrast-1000));background-color:rgb(var(--kompendium-contrast-200));white-space:pre;word-spacing:normal;word-break:normal;word-wrap:normal;line-height:normal;padding:0.125rem 0.5rem;margin:0 0.25rem;box-shadow:var(--kompendium-button-shadow-normal), 0 0.03125rem 0.21875rem 0 rgba(var(--kompendium-contrast-100), 0.5) inset;border-radius:0.25rem;border-style:solid;border-color:rgba(var(--kompendium-contrast-600), 0.8);border-width:0 1px 0.125rem 1px}@media (prefers-color-scheme: dark){kbd:not([data-theme=force-light]){background-color:rgb(var(--kompendium-contrast-200));color:rgb(var(--kompendium-contrast-1100));border-color:rgba(var(--kompendium-contrast-500), 0.8)}}kbd[data-theme=force-dark]{background-color:rgb(var(--kompendium-contrast-200));color:rgb(var(--kompendium-contrast-1100));border-color:rgba(var(--kompendium-contrast-500), 0.8)}@media (prefers-color-scheme: dark){:host(:not([data-theme=force-light])) kbd{background-color:rgb(var(--kompendium-contrast-200));color:rgb(var(--kompendium-contrast-1100));border-color:rgba(var(--kompendium-contrast-500), 0.8)}}:host([data-theme=force-dark]) kbd{background-color:rgb(var(--kompendium-contrast-200));color:rgb(var(--kompendium-contrast-1100));border-color:rgba(var(--kompendium-contrast-500), 0.8)}kompendium-playground{width:100%}.docs-layout-section-heading{transition:border-color 0.3s ease 0.05s;padding-top:pxToRem(40);margin:pxToRem(40) 0 pxToRem(20) 0;border-top:1px solid rgb(var(--kompendium-contrast-500))}.docs-layout-section-heading:before{content:\"\";width:pxToRem(2);height:pxToRem(12);display:inline-block;background-color:rgba(var(--kompendium-color-code-blue), 0.4);border-radius:pxToRem(1);transform:translateX(pxToRem(-8))}.props-events-layout .markdown-props{display:grid;grid-gap:pxToRem(20);grid-auto-flow:column;grid-template-columns:1fr 1fr}@media (max-width: 800px){.props-events-layout .markdown-props{grid-gap:pxToRem(12);grid-auto-flow:row;grid-template-columns:unset}}.methods-layout{border-radius:pxToRem(6);margin-bottom:pxToRem(40);background-color:rgb(var(--kompendium-contrast-400))}.methods-title{margin:0;border-radius:pxToRem(6) pxToRem(6) 0 0;padding:pxToRem(12) pxToRem(16);background-color:rgb(var(--kompendium-contrast-500));font-size:pxToRem(17)}.methods-content{display:grid;grid-gap:pxToRem(20);grid-auto-flow:column;grid-template-columns:1fr 1fr;padding:pxToRem(16) pxToRem(20) pxToRem(24) pxToRem(20)}.methods-returns{padding:pxToRem(16) pxToRem(20) pxToRem(24) pxToRem(20);border-radius:0 0 pxToRem(6) pxToRem(6);border-top:1px solid rgb(var(--kompendium-contrast-600))}.methods-returns h5{margin-top:0}@media (max-width: 800px){.methods-content{grid-gap:pxToRem(12);grid-auto-flow:row;grid-template-columns:unset}}.styles-layout{display:grid;grid-auto-flow:column;grid-template-columns:1fr 1fr;grid-gap:0 pxToRem(12);border:solid rgb(var(--kompendium-contrast-500));border-width:1px 1px 0 1px;padding:pxToRem(8);background-color:rgb(var(--kompendium-contrast-300))}.styles-layout:first-of-type{border-top-right-radius:pxToRem(6);border-top-left-radius:pxToRem(6)}.styles-layout:last-of-type{border-bottom-right-radius:pxToRem(6);border-bottom-left-radius:pxToRem(6);border-bottom-width:1px}.styles-layout:nth-of-type(odd){background-color:rgb(var(--kompendium-contrast-400))}.styles-title code{font-family:var(--kompendium-font-code);border-radius:pxToRem(4);border:1px solid rgba(var(--kompendium-contrast-1100), 0.1);font-size:pxToRem(11);white-space:pre-wrap;color:rgb(var(--kompendium-contrast-1100));padding:0.125rem 0.3125rem;margin:0 0.125rem;background:rgba(var(--kompendium-contrast-1100), 0.05)}@media (max-width: 800px){.styles-layout{grid-auto-flow:row;grid-template-columns:unset;grid-gap:pxToRem(12) 0}}:host{display:block}.docs kompendium-markdown{display:block;width:100%;max-width:pxToRem(960)}";

const KompendiumComponent = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
        this.scrollToOnNextUpdate = null;
        this.handleRouteChange = this.handleRouteChange.bind(this);
    }
    connectedCallback() {
        window.addEventListener('hashchange', this.handleRouteChange);
    }
    disconnectedCallback() {
        window.removeEventListener('hashchange', this.handleRouteChange);
    }
    componentDidLoad() {
        const route = this.getRoute();
        this.scrollToElement(route);
    }
    componentDidUpdate() {
        if (this.scrollToOnNextUpdate) {
            this.scrollToElement(this.scrollToOnNextUpdate);
            this.scrollToOnNextUpdate = null;
        }
    }
    handleRouteChange() {
        const route = this.getRoute();
        this.scrollToOnNextUpdate = route;
    }
    scrollToElement(id) {
        const element = this.host.shadowRoot.getElementById(id);
        if (!element) {
            return;
        }
        element.scrollIntoView();
    }
    render() {
        const tag = this.match.params.name;
        const component = findComponent(tag, this.docs);
        return (index.h("article", { key: '25c0da9ed6bd380bab2c45dd05ad451f829c2067', class: "component" }, index.h("section", { key: '029617283bc0aaf08ae97e0efe8ce8c09037fe6a', class: "docs" }, this.renderDocs(tag, component))));
    }
    renderDocs(tag, component) {
        let title = tag.split('-').slice(1).join(' ');
        title = title[0].toLocaleUpperCase() + title.slice(1);
        const examples = findExamples(component, this.docs);
        const tags = component.docsTags
            .filter(negate(isTag('slot')))
            .filter(negate(isTag('exampleComponent')));
        const schema = this.schemas.find((s) => s.$id === tag);
        return [
            index.h("h1", { id: this.getId() }, title),
            index.h("kompendium-markdown", { text: component.docs }),
            index.h("kompendium-taglist", { tags: tags }),
            index.h(ExampleList, { examples: examples, id: this.getId('examples'), schema: schema, propsFactory: this.examplePropsFactory }),
            index.h(methods.PropertyList, { props: component.props, id: this.getId('properties') }),
            index.h(EventList, { events: component.events, id: this.getId('events') }),
            index.h(methods.MethodList, { methods: component.methods, id: this.getId('methods') }),
            index.h(SlotList, { slots: component.slots, id: this.getId('slots') }),
            index.h(StyleList, { styles: component.styles, id: this.getId('styles') }),
        ];
    }
    getId(name) {
        const route = this.getRoute().split('/').slice(0, 3).join('/');
        return [route, name].filter((item) => !!item).join('/') + '/';
    }
    getRoute() {
        return location.hash.substr(1);
    }
    get host() { return index.getElement(this); }
};
function findExamples(component, docs) {
    return component.docsTags
        .filter(isTag('exampleComponent'))
        .map(findComponentByTag(docs));
}
function findComponent(tag, docs) {
    return docs.components.find((doc) => doc.tag === tag);
}
const findComponentByTag = (docs) => (tag) => {
    return docs.components.find((component) => component.tag === tag.text);
};
const isTag = (name) => (tag) => {
    return tag.name === name;
};
KompendiumComponent.style = componentCss;

exports.kompendium_component = KompendiumComponent;
//# sourceMappingURL=kompendium-component.entry.cjs.js.map
