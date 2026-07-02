'use strict';

var index = require('./index-B_xYBJw_.js');
var methods = require('./methods-CAkVjVmM.js');
var anchors = require('./anchors-Dc5oV13m.js');
var _commonjsHelpers = require('./_commonjsHelpers-BJu3ubxk.js');
var anchorScroll = require('./anchor-scroll-BnJqBEEe.js');
var componentTitle = require('./component-title-ClxX3mdx.js');

function EventList({ events, id, slugId, }) {
    if (!events.length) {
        return;
    }
    return [
        slugId ? (index.h("span", { class: "section-anchor", id: slugId, "aria-hidden": "true" })) : null,
        index.h("h3", { class: "docs-layout-section-heading", id: id }, "Events", slugId ? index.h("kompendium-anchor", { slug: slugId, label: "Events" }) : null),
        ...events.map(renderEvent(slugId)),
    ];
}
const renderEvent = (sectionSlug) => (event) => {
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
    const slug = sectionSlug ? anchors.entrySlug(sectionSlug, event.event) : null;
    return (index.h("div", { class: "props-events-layout" }, index.h("h4", { id: slug }, event.event, slug ? (index.h("kompendium-anchor", { slug: slug, label: event.event })) : null), index.h("kompendium-taglist", { tags: event.docsTags }), index.h("div", { class: "markdown-props" }, index.h("kompendium-markdown", { text: event.docs }), index.h("kompendium-proplist", { items: items }))));
};

/**
 * Stencil reports a component's unnamed (default) slot with an empty
 * string name. Normalize to a user-facing label so it renders and
 * slugifies consistently across the docs page and the TOC.
 * @param {string} name the raw slot name from JsonDocs
 * @returns {string} the display name to use for headings and TOC entries
 */
function slotDisplayName(name) {
    return name || 'default';
}

function SlotList({ slots, id, slugId, }) {
    if (!slots.length) {
        return;
    }
    return [
        slugId ? (index.h("span", { class: "section-anchor", id: slugId, "aria-hidden": "true" })) : null,
        index.h("h3", { class: "docs-layout-section-heading", id: id }, "Slots", slugId ? index.h("kompendium-anchor", { slug: slugId, label: "Slots" }) : null),
        ...slots.map(renderSlot(slugId)),
    ];
}
const renderSlot = (sectionSlug) => (slot) => {
    const name = slotDisplayName(slot.name);
    const slug = sectionSlug ? anchors.entrySlug(sectionSlug, name) : null;
    return (index.h("div", null, index.h("h4", { id: slug }, name, slug ? (index.h("kompendium-anchor", { slug: slug, label: name })) : null), index.h("kompendium-markdown", { text: slot.docs })));
};

function StyleList({ styles, id, slugId, }) {
    if (!styles.length) {
        return;
    }
    return [
        slugId ? (index.h("span", { class: "section-anchor", id: slugId, "aria-hidden": "true" })) : null,
        index.h("h3", { class: "docs-layout-section-heading", id: id }, "Styles", slugId ? index.h("kompendium-anchor", { slug: slugId, label: "Styles" }) : null),
        ...styles.map(renderStyle(slugId)),
    ];
}
const renderStyle = (sectionSlug) => (style) => {
    const slug = sectionSlug ? anchors.entrySlug(sectionSlug, style.name) : null;
    return (index.h("div", { class: "styles-layout" }, index.h("div", { class: "styles-title", id: slug }, index.h("code", null, style.name), slug ? (index.h("kompendium-anchor", { slug: slug, label: style.name })) : null), index.h("div", { class: "styles-content" }, index.h("kompendium-markdown", { text: style.docs }))));
};

function ExampleList({ examples, slugs, id, slugId, schema, propsFactory, }) {
    if (!examples.length) {
        return;
    }
    return [
        slugId ? (index.h("span", { class: "section-anchor", id: slugId, "aria-hidden": "true" })) : null,
        index.h("h2", { class: "docs-layout-section-heading", id: id }, "Examples", slugId ? (index.h("kompendium-anchor", { slug: slugId, label: "Examples" })) : null),
        examples.map(renderExample(slugs, schema, propsFactory)),
    ];
}
const renderExample = (slugs, schema, factory) => (example, index$1) => {
    const slug = slugs[index$1];
    return (index.h("div", { class: "example-wrapper", id: slug }, index.h("kompendium-playground", { anchorSlug: slug, component: example, schema: schema, propsFactory: factory })));
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

const componentCss = () => `*,*::before,*::after{box-sizing:border-box}ul[class],ol[class]{padding:0}body,h1,h2,h3,h4,p,ul[class],ol[class],li,figure,figcaption,blockquote,dl,dd{margin:0}ul[class],ol[class]{list-style:none}a:not([class]){text-decoration-skip-ink:auto}img{max-width:100%}input,button,textarea,select{font:inherit}@media (prefers-reduced-motion: reduce){*{animation-duration:0.01ms !important;animation-iteration-count:1 !important;transition-duration:0.01ms !important;scroll-behavior:auto !important}}:root{--width-nav-panel:16rem}p,a,li{font-size:0.9375rem}h1,h2,h3,h4,h5,h6{margin-bottom:0.5rem;font-weight:normal;font-weight:500}h1{font-size:2rem;line-height:2.25rem;margin-top:1.5rem;letter-spacing:-0.0625rem;font-weight:400}h2{font-size:1.625rem;line-height:1.25rem;margin-top:1.25rem;margin-bottom:1rem}h3{font-size:1.375rem;line-height:1.5rem;margin-top:1rem}h4{font-size:1.25rem;line-height:1.25rem;margin-top:1rem}h5{font-size:1.125rem;line-height:1.125rem;margin-top:0.75rem}h6{font-size:1rem;font-variant:all-small-caps;letter-spacing:0.0625rem}p,blockquote{margin-top:0;margin-bottom:0.5rem}p:only-child,blockquote:only-child{margin-bottom:0}a{transition:color 0.2s ease;color:rgb(var(--kompendium-color-blue-default));text-decoration:none;border-radius:0.125rem}a:hover{color:rgb(var(--kompendium-color-blue-light))}a:focus{outline:none}a:focus-visible{outline:none;box-shadow:var(--kompendium-shadow-depth-8-focused)}ul{list-style:none}ul li{position:relative;margin-left:0.75rem}ul li:before{content:"";position:absolute;left:-0.5rem;top:0.625rem;width:0.25rem;height:0.25rem;border-radius:50%;background-color:rgb(var(--kompendium-contrast-700));display:block}ol{list-style:decimal inside}ol,ul{padding-left:0;margin-top:0}ul ul,ul ol,ol ol,ol ul{margin:0.9375rem 0 0.9375rem 1.875rem;font-size:90%}li{margin-bottom:0.625rem}th,td{padding:0.75rem 1rem;text-align:left;border-bottom:1px solid rgb(var(--kompendium-contrast-600))}th:first-child,td:first-child{padding-left:0}th:last-child,td:last-child{padding-right:0}hr{margin:1.75rem 0 2rem 0;border-width:0;border-top:1px solid rgb(var(--kompendium-contrast-600))}kbd{font-family:var(--kompendium-font-code);font-size:0.875rem;font-weight:600;color:rgb(var(--kompendium-contrast-1000));background-color:rgb(var(--kompendium-contrast-200));white-space:pre;word-spacing:normal;word-break:normal;word-wrap:normal;line-height:normal;padding:0.125rem 0.5rem;margin:0 0.25rem;box-shadow:var(--kompendium-button-shadow-normal), 0 0.03125rem 0.21875rem 0 rgba(var(--kompendium-contrast-100), 0.5) inset;border-radius:0.25rem;border-style:solid;border-color:rgba(var(--kompendium-contrast-600), 0.8);border-width:0 1px 0.125rem 1px}@media (prefers-color-scheme: dark){kbd:not([data-theme=force-light]){background-color:rgb(var(--kompendium-contrast-200));color:rgb(var(--kompendium-contrast-1100));border-color:rgba(var(--kompendium-contrast-500), 0.8)}}kbd[data-theme=force-dark]{background-color:rgb(var(--kompendium-contrast-200));color:rgb(var(--kompendium-contrast-1100));border-color:rgba(var(--kompendium-contrast-500), 0.8)}@media (prefers-color-scheme: dark){:host(:not([data-theme=force-light])) kbd{background-color:rgb(var(--kompendium-contrast-200));color:rgb(var(--kompendium-contrast-1100));border-color:rgba(var(--kompendium-contrast-500), 0.8)}}:host([data-theme=force-dark]) kbd{background-color:rgb(var(--kompendium-contrast-200));color:rgb(var(--kompendium-contrast-1100));border-color:rgba(var(--kompendium-contrast-500), 0.8)}kompendium-playground{width:100%}.docs-layout-section-heading{transition:border-color 0.3s ease 0.05s;padding-top:2.5rem;margin:2.5rem 0 1.25rem 0;border-top:1px solid rgb(var(--kompendium-contrast-500));font-size:1.375rem;line-height:1.5rem}.docs-layout-section-heading:before{content:"";width:0.125rem;height:0.75rem;display:inline-block;background-color:rgba(var(--kompendium-color-code-blue), 0.4);border-radius:0.0625rem;transform:translateX(-0.5rem)}.props-events-layout .markdown-props{display:grid;grid-gap:1.25rem;grid-auto-flow:column;grid-template-columns:1fr 1fr}@media (max-width: 800px){.props-events-layout .markdown-props{grid-gap:0.75rem;grid-auto-flow:row;grid-template-columns:unset}}.methods-layout{border-radius:0.375rem;margin-bottom:2.5rem;background-color:rgb(var(--kompendium-contrast-400))}.methods-title{margin:0;border-radius:0.375rem 0.375rem 0 0;padding:0.75rem 1rem;background-color:rgb(var(--kompendium-contrast-500));font-size:1.0625rem}.methods-content{display:grid;grid-gap:1.25rem;grid-auto-flow:column;grid-template-columns:1fr 1fr;padding:1rem 1.25rem 1.5rem 1.25rem}.methods-returns{padding:1rem 1.25rem 1.5rem 1.25rem;border-radius:0 0 0.375rem 0.375rem;border-top:1px solid rgb(var(--kompendium-contrast-600))}.methods-returns h5{margin-top:0}@media (max-width: 800px){.methods-content{grid-gap:0.75rem;grid-auto-flow:row;grid-template-columns:unset}}.styles-layout{display:grid;grid-auto-flow:column;grid-template-columns:1fr 1fr;grid-gap:0 0.75rem;border:solid rgb(var(--kompendium-contrast-500));border-width:1px 1px 0 1px;padding:0.5rem;background-color:rgb(var(--kompendium-contrast-300))}.styles-layout:first-of-type{border-top-right-radius:0.375rem;border-top-left-radius:0.375rem}.styles-layout:last-of-type{border-bottom-right-radius:0.375rem;border-bottom-left-radius:0.375rem;border-bottom-width:1px}.styles-layout:nth-of-type(odd){background-color:rgb(var(--kompendium-contrast-400))}.styles-title code{font-family:var(--kompendium-font-code);border-radius:0.25rem;border:1px solid rgba(var(--kompendium-contrast-1100), 0.1);font-size:0.6875rem;white-space:pre-wrap;color:rgb(var(--kompendium-contrast-1100));padding:0.125rem 0.3125rem;margin:0 0.125rem;background:rgba(var(--kompendium-contrast-1100), 0.05)}@media (max-width: 800px){.styles-layout{grid-auto-flow:row;grid-template-columns:unset;grid-gap:0.75rem 0}}:host{display:block}.docs kompendium-markdown{display:block;width:100%;max-width:60rem}.section-anchor{display:block;height:0;width:0;overflow:hidden;pointer-events:none}.docs-layout-section-heading:hover,.props-events-layout h4:hover,.methods-title:hover,.styles-title:hover,.docs h4:hover{--kompendium-anchor-opacity:1}`;

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
        anchorScroll.scrollToAnchor(this.host.shadowRoot);
    }
    componentDidUpdate() {
        if (this.scrollToOnNextUpdate) {
            anchorScroll.scrollToElement(this.host.shadowRoot, this.scrollToOnNextUpdate);
            this.scrollToOnNextUpdate = null;
        }
    }
    handleRouteChange() {
        this.scrollToOnNextUpdate = this.getScrollTargetId();
        anchorScroll.scrollToAnchor(this.host.shadowRoot);
    }
    getScrollTargetId() {
        return anchorScroll.getAnchorId() || anchorScroll.getRoute().split('#')[0] || null;
    }
    render() {
        const tag = this.match.params.name;
        const component = findComponent(tag, this.docs);
        const examples = findExamples(component, this.docs).filter((example) => Boolean(example));
        const exampleSlugs = anchors.uniqueExampleSlugs(examples);
        return (index.h("article", { key: 'd2fd2f81fb7090c3546c431b645e0ac07dbc9411', class: "component" }, index.h("section", { key: '67a88e4326dd9f827914ebc18419a7cf98e17acc', class: "docs" }, this.renderDocs(tag, component, examples, exampleSlugs)), index.h("kompendium-toc", { key: '77e0cab8be3a13f58a3e22c6f3c84995dd209200', entries: buildTocEntries(component, examples, exampleSlugs) })));
    }
    renderDocs(tag, component, examples, exampleSlugs) {
        const title = componentTitle.getComponentTitle(tag);
        const tags = component.docsTags
            .filter(negate(isTag('slot')))
            .filter(negate(isTag('exampleComponent')));
        const schema = this.schemas.find((s) => s.$id === tag);
        // Each section carries two ids by design: a legacy route-based id on
        // the heading (e.g. `component/<tag>/examples/`, kept so existing
        // sidebar links and `scrollToElement` keep working) and a short,
        // URL-fragment-safe `slugId` on a sibling section-anchor span (the
        // target for the in-page TOC and ¶ anchors). The route-based id cannot
        // double as a hash fragment, hence both coexist.
        return [
            index.h("h1", { id: this.getId() }, title),
            index.h("kompendium-markdown", { text: component.docs }),
            index.h("kompendium-taglist", { tags: tags }),
            index.h(ExampleList, { examples: examples, slugs: exampleSlugs, id: this.getId('examples'), slugId: anchors.SECTION_SLUGS.examples, schema: schema, propsFactory: this.examplePropsFactory }),
            index.h(methods.PropertyList, { props: component.props, id: this.getId('properties'), slugId: anchors.SECTION_SLUGS.properties }),
            index.h(EventList, { events: component.events, id: this.getId('events'), slugId: anchors.SECTION_SLUGS.events }),
            index.h(methods.MethodList, { methods: component.methods, id: this.getId('methods'), slugId: anchors.SECTION_SLUGS.methods }),
            index.h(SlotList, { slots: component.slots, id: this.getId('slots'), slugId: anchors.SECTION_SLUGS.slots }),
            index.h(StyleList, { styles: component.styles, id: this.getId('styles'), slugId: anchors.SECTION_SLUGS.styles }),
        ];
    }
    getId(name) {
        const route = anchorScroll.getRoute().split('#')[0].split('/').slice(0, 3).join('/');
        return [route, name].filter((item) => !!item).join('/') + '/';
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
function buildTocEntries(component, examples, exampleSlugs) {
    var _a, _b, _c, _d, _e;
    const entries = [];
    if (examples.length) {
        entries.push({
            id: anchors.SECTION_SLUGS.examples,
            title: 'Examples',
            collapsible: true,
            defaultExpanded: true,
            children: examples.map((example, index) => {
                const id = exampleSlugs[index];
                const title = exampleTitle(example) || prettifyTag(anchors.slugify(example.tag));
                return { id: id, title: title };
            }),
        });
    }
    if ((_a = component.props) === null || _a === void 0 ? void 0 : _a.length) {
        entries.push(collapsibleSection(anchors.SECTION_SLUGS.properties, 'Properties', component.props.map((prop) => prop.name)));
    }
    if ((_b = component.events) === null || _b === void 0 ? void 0 : _b.length) {
        entries.push(collapsibleSection(anchors.SECTION_SLUGS.events, 'Events', component.events.map((event) => event.event)));
    }
    if ((_c = component.methods) === null || _c === void 0 ? void 0 : _c.length) {
        entries.push(collapsibleSection(anchors.SECTION_SLUGS.methods, 'Methods', component.methods.map((method) => method.name)));
    }
    if ((_d = component.slots) === null || _d === void 0 ? void 0 : _d.length) {
        entries.push(collapsibleSection(anchors.SECTION_SLUGS.slots, 'Slots', component.slots.map((slot) => slotDisplayName(slot.name))));
    }
    if ((_e = component.styles) === null || _e === void 0 ? void 0 : _e.length) {
        entries.push(collapsibleSection(anchors.SECTION_SLUGS.styles, 'Styles', component.styles.map((style) => style.name)));
    }
    return entries;
}
function collapsibleSection(sectionSlug, title, names) {
    return {
        id: sectionSlug,
        title: title,
        collapsible: true,
        children: names.map((name) => ({
            id: anchors.entrySlug(sectionSlug, name),
            title: name,
        })),
    };
}
function exampleTitle(example) {
    return anchors.firstLine(example.docs);
}
function prettifyTag(slug) {
    if (!slug) {
        return slug;
    }
    const words = slug.split('-').filter(Boolean);
    if (!words.length) {
        return slug;
    }
    return (words[0][0].toLocaleUpperCase() +
        words[0].substring(1) +
        (words.length > 1 ? ' ' + words.slice(1).join(' ') : ''));
}
KompendiumComponent.style = componentCss();

exports.kompendium_component = KompendiumComponent;
