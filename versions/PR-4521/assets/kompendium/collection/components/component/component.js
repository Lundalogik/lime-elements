import { h } from "@stencil/core";
import { PropertyList } from "./templates/props";
import { EventList } from "./templates/events";
import { MethodList } from "./templates/methods";
import { SlotList } from "./templates/slots";
import { StyleList } from "./templates/style";
import { ExampleList } from "./templates/examples";
import negate from "lodash/negate";
import { getAnchorId, getRoute, scrollToAnchor, scrollToElement, } from "../anchor-scroll";
import { SECTION_SLUGS, entrySlug, firstLine, slugify, uniqueExampleSlugs, } from "./anchors";
import { slotDisplayName } from "./slots";
import { getComponentTitle } from "../component-title";
export class KompendiumComponent {
    constructor() {
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
        scrollToAnchor(this.host.shadowRoot);
    }
    componentDidUpdate() {
        if (this.scrollToOnNextUpdate) {
            scrollToElement(this.host.shadowRoot, this.scrollToOnNextUpdate);
            this.scrollToOnNextUpdate = null;
        }
    }
    handleRouteChange() {
        this.scrollToOnNextUpdate = this.getScrollTargetId();
        scrollToAnchor(this.host.shadowRoot);
    }
    getScrollTargetId() {
        return getAnchorId() || getRoute().split('#')[0] || null;
    }
    render() {
        const tag = this.match.params.name;
        const component = findComponent(tag, this.docs);
        const examples = findExamples(component, this.docs).filter((example) => Boolean(example));
        const exampleSlugs = uniqueExampleSlugs(examples);
        return (h("article", { key: 'd2fd2f81fb7090c3546c431b645e0ac07dbc9411', class: "component" }, h("section", { key: '67a88e4326dd9f827914ebc18419a7cf98e17acc', class: "docs" }, this.renderDocs(tag, component, examples, exampleSlugs)), h("kompendium-toc", { key: '77e0cab8be3a13f58a3e22c6f3c84995dd209200', entries: buildTocEntries(component, examples, exampleSlugs) })));
    }
    renderDocs(tag, component, examples, exampleSlugs) {
        const title = getComponentTitle(tag);
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
            h("h1", { id: this.getId() }, title),
            h("kompendium-markdown", { text: component.docs }),
            h("kompendium-taglist", { tags: tags }),
            h(ExampleList, { examples: examples, slugs: exampleSlugs, id: this.getId('examples'), slugId: SECTION_SLUGS.examples, schema: schema, propsFactory: this.examplePropsFactory }),
            h(PropertyList, { props: component.props, id: this.getId('properties'), slugId: SECTION_SLUGS.properties }),
            h(EventList, { events: component.events, id: this.getId('events'), slugId: SECTION_SLUGS.events }),
            h(MethodList, { methods: component.methods, id: this.getId('methods'), slugId: SECTION_SLUGS.methods }),
            h(SlotList, { slots: component.slots, id: this.getId('slots'), slugId: SECTION_SLUGS.slots }),
            h(StyleList, { styles: component.styles, id: this.getId('styles'), slugId: SECTION_SLUGS.styles }),
        ];
    }
    getId(name) {
        const route = getRoute().split('#')[0].split('/').slice(0, 3).join('/');
        return [route, name].filter((item) => !!item).join('/') + '/';
    }
    static get is() { return "kompendium-component"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "$": ["component.scss"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["component.css"]
        };
    }
    static get properties() {
        return {
            "docs": {
                "type": "unknown",
                "mutable": false,
                "complexType": {
                    "original": "JsonDocs",
                    "resolved": "JsonDocs",
                    "references": {
                        "JsonDocs": {
                            "location": "import",
                            "path": "@stencil/core/internal",
                            "id": "node_modules::JsonDocs",
                            "referenceLocation": "JsonDocs"
                        }
                    }
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": "The generated documentation data"
                },
                "getter": false,
                "setter": false
            },
            "schemas": {
                "type": "unknown",
                "mutable": false,
                "complexType": {
                    "original": "Array<Record<string, any>>",
                    "resolved": "Record<string, any>[]",
                    "references": {
                        "Array": {
                            "location": "global",
                            "id": "global::Array"
                        },
                        "Record": {
                            "location": "global",
                            "id": "global::Record"
                        }
                    }
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": "Component schemas"
                },
                "getter": false,
                "setter": false
            },
            "match": {
                "type": "unknown",
                "mutable": false,
                "complexType": {
                    "original": "MatchResults",
                    "resolved": "MatchResults",
                    "references": {
                        "MatchResults": {
                            "location": "import",
                            "path": "@limetech/stencil-router",
                            "id": "node_modules::MatchResults",
                            "referenceLocation": "MatchResults"
                        }
                    }
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": "Matched route parameters"
                },
                "getter": false,
                "setter": false
            },
            "examplePropsFactory": {
                "type": "unknown",
                "mutable": false,
                "complexType": {
                    "original": "PropsFactory",
                    "resolved": "(name: string) => Record<string, unknown>",
                    "references": {
                        "PropsFactory": {
                            "location": "import",
                            "path": "../playground/playground.types",
                            "id": "src/components/playground/playground.types.ts::PropsFactory",
                            "referenceLocation": "PropsFactory"
                        }
                    }
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": "Factory for creating props for example components"
                },
                "getter": false,
                "setter": false
            }
        };
    }
    static get elementRef() { return "host"; }
}
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
            id: SECTION_SLUGS.examples,
            title: 'Examples',
            collapsible: true,
            defaultExpanded: true,
            children: examples.map((example, index) => {
                const id = exampleSlugs[index];
                const title = exampleTitle(example) || prettifyTag(slugify(example.tag));
                return { id: id, title: title };
            }),
        });
    }
    if ((_a = component.props) === null || _a === void 0 ? void 0 : _a.length) {
        entries.push(collapsibleSection(SECTION_SLUGS.properties, 'Properties', component.props.map((prop) => prop.name)));
    }
    if ((_b = component.events) === null || _b === void 0 ? void 0 : _b.length) {
        entries.push(collapsibleSection(SECTION_SLUGS.events, 'Events', component.events.map((event) => event.event)));
    }
    if ((_c = component.methods) === null || _c === void 0 ? void 0 : _c.length) {
        entries.push(collapsibleSection(SECTION_SLUGS.methods, 'Methods', component.methods.map((method) => method.name)));
    }
    if ((_d = component.slots) === null || _d === void 0 ? void 0 : _d.length) {
        entries.push(collapsibleSection(SECTION_SLUGS.slots, 'Slots', component.slots.map((slot) => slotDisplayName(slot.name))));
    }
    if ((_e = component.styles) === null || _e === void 0 ? void 0 : _e.length) {
        entries.push(collapsibleSection(SECTION_SLUGS.styles, 'Styles', component.styles.map((style) => style.name)));
    }
    return entries;
}
function collapsibleSection(sectionSlug, title, names) {
    return {
        id: sectionSlug,
        title: title,
        collapsible: true,
        children: names.map((name) => ({
            id: entrySlug(sectionSlug, name),
            title: name,
        })),
    };
}
function exampleTitle(example) {
    return firstLine(example.docs);
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
