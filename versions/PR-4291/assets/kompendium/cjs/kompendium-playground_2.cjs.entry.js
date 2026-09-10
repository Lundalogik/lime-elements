'use strict';

var index = require('./index-B_xYBJw_.js');
var types = require('./types-SjA7Kcy_.js');
var anchors = require('./anchors-Dc5oV13m.js');
var anchorScroll = require('./anchor-scroll-BnJqBEEe.js');

/**
 * Split an example's docs into a title (the first non-empty line) and the
 * remaining body. Kept in a separate module from the kompendium-playground
 * component so it can be unit-tested directly -- Stencil only allows a
 * component module to export the component class itself.
 * @param {string} docs the example's docs text
 * @returns {{title: string; body: string}} the title and remaining body
 */
function splitDocs(docs) {
    const lines = (docs || '').split('\n');
    const titleIndex = lines.findIndex((line) => line.trim().length > 0);
    if (titleIndex === -1) {
        return { title: '', body: '' };
    }
    return {
        title: anchors.firstLine(docs),
        body: lines
            .slice(titleIndex + 1)
            .join('\n')
            .trim(),
    };
}

const playgroundCss = () => `:root{--width-nav-panel:16rem}:host{display:block}.tab-panel{height:100%;display:flex;flex-direction:column}.tab-bar{display:flex;padding:0.1875rem 1rem 0 1rem;overflow-y:auto}.tab-bar .tab span{overflow:hidden;white-space:nowrap;text-overflow:ellipsis;display:inline-block;width:100%;padding:0.125rem 0}.tab-bar .tab{transition:background-color 0.2s ease;cursor:pointer;position:relative;display:inline-block;padding:0.5rem 1rem;text-align:center;line-height:0.9375rem;color:rgb(var(--kompendium-contrast-1000));font-size:1rem;border-radius:0.5rem 0.5rem 0 0;margin:0 0.125rem;min-width:3.75rem}.tab-bar .tab:before,.tab-bar .tab:after{transition:background-color 0.2s ease;content:"";display:block;width:0.625rem;height:0.625rem;position:absolute;bottom:0;-webkit-mask-image:url("data:image/svg+xml; utf8, <svg xmlns='http://www.w3.org/2000/svg' fill-rule='evenodd' stroke-linejoin='round' stroke-miterlimit='2' clip-rule='evenodd' viewBox='0 0 50 50'><defs/><path d='M0 0c0 27.594 22.406 50 50 50H0V0z'/></svg>");mask-image:url("data:image/svg+xml; utf8, <svg xmlns='http://www.w3.org/2000/svg' fill-rule='evenodd' stroke-linejoin='round' stroke-miterlimit='2' clip-rule='evenodd' viewBox='0 0 50 50'><defs/><path d='M0 0c0 27.594 22.406 50 50 50H0V0z'/></svg>");background:transparent}.tab-bar .tab:before{left:-0.625rem;transform:rotateY(180deg)}.tab-bar .tab:after{right:-0.625rem}.tab-bar .tab:hover{background-color:rgb(var(--kompendium-contrast-100))}.tab-bar .tab:hover:before,.tab-bar .tab:hover:after{background-color:rgb(var(--kompendium-contrast-100))}.tab-bar .tab.active{z-index:1;color:rgb(var(--kompendium-contrast-1100));background:rgb(var(--kompendium-color-code-background))}.tab-bar .tab.active:before,.tab-bar .tab.active:after{background:rgb(var(--kompendium-color-code-background))}.tab-items{display:flex;max-height:31.25rem}.tab-items .tab-item{width:100%;display:none}.tab-items .tab-item.active{display:flex}kompendium-code{display:block}kompendium-code:before,kompendium-code:after{content:"";z-index:1;display:block;position:absolute;left:0;right:0;border-radius:0.5625rem;pointer-events:none}kompendium-code:before{top:2.4375rem;height:1.5rem;background-image:linear-gradient(rgb(var(--kompendium-color-code-background)), rgba(var(--kompendium-color-code-background), 0))}kompendium-code:after{bottom:0;height:2rem;background-image:linear-gradient(rgba(var(--kompendium-color-code-background), 0), rgb(var(--kompendium-color-code-background)))}section.example{transition:border-color 0.3s ease 0.05s;padding-bottom:2.5rem;margin-bottom:2.5rem;border-bottom:1px solid rgb(var(--kompendium-contrast-500))}section.example .result,section.example .code{box-sizing:border-box;display:inline-block;vertical-align:top;width:50%}section.example .result{padding-right:2.5rem}section.example .result kompendium-markdown{margin-bottom:2rem}section.example .code{position:sticky;top:0}@media (max-width: 1000px){section.example .result,section.example .code{width:100%;padding-right:0;margin-bottom:5rem}section.example .code{position:relative;margin-bottom:2.5rem}}.show-case_description{padding:0.75rem;--kompendium-markdown-h3-font-size:1.125rem;--kompendium-markdown-h3-line-height:1.125rem;--kompendium-markdown-h3-margin-top:0.75rem}.example-heading{margin:0 0 0.75rem 0;font-size:1.125rem;line-height:1.125rem;font-weight:500}.example-heading:hover{--kompendium-anchor-opacity:1}.show-case_component{font-family:var(--kompendium-example-font-family, inherit);font-size:var(--kompendium-example-font-size, inherit);line-height:var(--kompendium-example-line-height, inherit);color:var(--kompendium-example-color, inherit);padding:1.25rem;border-radius:0.875rem;background-color:rgb(var(--kompendium-contrast-100));border:1px solid rgb(var(--kompendium-contrast-300));box-shadow:var(--shadow-showcase)}.debug{display:flex;justify-content:flex-end}.debug a.debug-link{transition:background-color 0.2s ease, box-shadow 0.2s ease, transform 0.1s ease-out}.debug a.debug-link:hover{box-shadow:var(--kompendium-button-shadow-hovered)}.debug a.debug-link:active{box-shadow:var(--kompendium-button-shadow-pressed);transform:translate3d(0, 0.08rem, 0)}.debug a.debug-link:focus{outline:none}.debug a.debug-link:focus-visible{outline:none;box-shadow:var(--kompendium-shadow-depth-8-focused)}.debug a.debug-link{transition:background-color 0.2s ease, box-shadow 0.2s ease, transform 0.1s ease-out, opacity 0.2s ease;width:1.75rem;height:1.75rem;font-size:0;margin:-3.25rem -1rem 0 0;border-radius:50%;color:rgb(var(--kompendium-contrast-1200));opacity:0.6}.debug a.debug-link:hover{opacity:1;background-color:rgb(var(--kompendium-contrast-100))}`;

const Playground = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
        /**
         * Factory for creating props for example components
         * @returns {Record<string, unknown>} props
         */
        this.propsFactory = () => ({});
        this.activateTab = (id) => () => {
            this.activeTab = id;
        };
        this.themeListener = (event) => {
            this.theme = event.detail;
        };
        this.renderTab = this.renderTab.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }
    connectedCallback() {
        this.theme = document.querySelector('html').dataset.theme;
        document.addEventListener(types.THEME_EVENT_NAME, this.themeListener);
    }
    disconnectedCallback() {
        document.removeEventListener(types.THEME_EVENT_NAME, this.themeListener);
    }
    render() {
        if (!this.component) {
            return;
        }
        const sources = this.component.sources || [];
        return (index.h(index.Host, { "data-theme": this.theme }, index.h("section", { class: "example" }, index.h("div", { class: "result" }, this.renderResult()), index.h("aside", { class: "code" }, index.h("nav", { class: "tab-bar" }, this.renderTabs(sources)), index.h("div", { class: "tab-items" }, this.renderItems(sources))))));
    }
    renderTabs(sources) {
        return sources.map(this.renderTab);
    }
    renderTab(source, index$1) {
        const classList = {
            tab: true,
            active: this.isTabActive(source, index$1),
        };
        return (index.h("a", { class: classList, onClick: this.activateTab(source.filename) }, index.h("span", null, source.filename)));
    }
    renderItems(sources) {
        return sources.map(this.renderItem);
    }
    renderResult() {
        const ExampleComponent = this.component.tag;
        const factory = this.propsFactory;
        const props = {
            schema: this.schema,
            ...factory(ExampleComponent),
        };
        const { title, body } = splitDocs(this.component.docs);
        const heading = title || this.component.tag;
        return (index.h("div", { class: "show-case" }, index.h("div", { class: "show-case_description" }, index.h("h3", { class: "example-heading" }, heading, this.anchorSlug ? (index.h("kompendium-anchor", { slug: this.anchorSlug, label: heading })) : null), body ? index.h("kompendium-markdown", { text: body }) : null), index.h("div", { class: "show-case_component" }, this.renderDebugButton(this.component.tag), index.h(ExampleComponent, { ...props }))));
    }
    renderItem(source, index$1) {
        const classList = {
            'tab-item': true,
            active: this.isTabActive(source, index$1),
        };
        const code = source.source.replace(/\/\*\*.+?\*\//gms, '');
        const key = [this.component.tag, source.filename].join('/');
        return (index.h("kompendium-code", { class: classList, language: source.type, key: key }, code));
    }
    renderDebugButton(tag) {
        if (!['localhost', '127.0.0.1'].includes(location.hostname)) {
            return;
        }
        const href = `#/debug/${tag}`;
        return (index.h("div", { class: "debug" }, index.h("a", { class: "debug-link", href: href, title: "Debug" }, index.h("svg", { viewBox: "0 0 400 400", xmlns: "http://www.w3.org/2000/svg", "fill-rule": "evenodd", "clip-rule": "evenodd", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-miterlimit": "1.5" }, index.h("path", { fill: "none", d: "M0 0h400v400H0z" }), index.h("path", { d: "M194.97 254.84h77.555", fill: "none", stroke: "currentColor", "stroke-opacity": ".6", "stroke-width": "20" }), index.h("path", { d: "M127.474 145.16l54.84 54.84M182.315 200l-54.84 54.84", fill: "none", stroke: "currentColor", "stroke-width": "20" })))));
    }
    isTabActive(source, index) {
        let isActive = this.activeTab === source.filename;
        if (!isActive) {
            isActive = index === 0 && !this.activeTab;
        }
        return isActive;
    }
};
Playground.style = playgroundCss();

/**
 * Tree helpers for navigating a (possibly nested) list of TocEntry nodes.
 * Kept in a separate module from the kompendium-toc component so they can be
 * unit-tested directly -- Stencil only allows a component module to export the
 * component class itself.
 */
function collectIds(entries, acc = new Set()) {
    for (const entry of entries) {
        acc.add(entry.id);
        collectIds(entry.children || [], acc);
    }
    return acc;
}
function findEntryById(id, entries) {
    for (const entry of entries) {
        if (entry.id === id) {
            return entry;
        }
        const deeper = findEntryById(id, entry.children || []);
        if (deeper) {
            return deeper;
        }
    }
    return null;
}
function findAncestorsOf(targetId, entries, trail = []) {
    for (const entry of entries) {
        const children = entry.children || [];
        if (children.some((child) => child.id === targetId)) {
            return [...trail, entry];
        }
        const deeper = findAncestorsOf(targetId, children, [...trail, entry]);
        if (deeper.length) {
            return deeper;
        }
    }
    return [];
}

const tocCss = () => `:root{--width-nav-panel:16rem}:host{display:contents;font-family:var(--kompendium-font-primary)}.toc.hidden{display:none}.fab{position:fixed;top:1.5rem;right:1.5rem;z-index:110;width:3rem;height:3rem;border-radius:50%;border:none;cursor:pointer;padding:0;background-color:rgb(var(--kompendium-contrast-200));color:rgb(var(--kompendium-contrast-1100));display:flex;align-items:center;justify-content:center;transition:background-color 0.2s ease, box-shadow 0.2s ease, transform 0.1s ease-out;box-shadow:var(--kompendium-button-shadow-normal)}.fab:hover{box-shadow:var(--kompendium-button-shadow-hovered)}.fab:active{box-shadow:var(--kompendium-button-shadow-pressed);transform:translate3d(0, 0.08rem, 0)}.fab:focus{outline:none}.fab:focus-visible{outline:none;box-shadow:var(--kompendium-shadow-depth-8-focused)}.scrim{display:none;position:fixed;inset:0;z-index:100;background-color:rgba(var(--kompendium-color-black), 0.24);backdrop-filter:blur(0.125rem)}.panel{display:none;position:fixed;z-index:105;right:1.5rem;top:5.25rem;width:min(22.5rem, 100vw - 3rem);max-height:calc(100vh - 7.5rem);overflow-y:auto;background-color:rgb(var(--kompendium-contrast-200));color:rgb(var(--kompendium-contrast-1100));border-radius:0.75rem;box-shadow:var(--kompendium-shadow-depth-16);padding:1rem 1.25rem}.heading{margin:0 0 0.5rem 0;font-size:0.8125rem;font-variant:all-small-caps;letter-spacing:0.0625rem;color:rgb(var(--kompendium-contrast-900));font-weight:500}.entries{list-style:none;padding:0;margin:0}.entry{margin:0;padding:0}.entry::before{display:none;content:none}.entry-row{display:flex;align-items:center;gap:0.125rem}.toggle{flex-shrink:0;display:inline-flex;align-items:center;justify-content:center;width:1.25rem;height:1.25rem;padding:0;background:transparent;border:none;border-radius:0.25rem;cursor:pointer;color:rgb(var(--kompendium-contrast-900))}.toggle svg{transition:transform 0.15s ease}.toggle.expanded svg{transform:rotate(90deg)}.toggle:hover{background-color:rgba(var(--kompendium-contrast-400), 0.8);color:rgb(var(--kompendium-contrast-1100))}.toggle:focus{outline:none}.toggle:focus-visible{outline:none;box-shadow:var(--kompendium-shadow-depth-8-focused)}.link{flex:1;display:block;padding:0.375rem 0.5rem;border-radius:0.25rem;color:rgb(var(--kompendium-contrast-1100));text-decoration:none;font-size:0.875rem;line-height:1.25rem}.link:hover{background-color:rgba(var(--kompendium-contrast-400), 0.8);color:rgb(var(--kompendium-color-blue-default))}.link:focus{outline:none}.link:focus-visible{outline:none;box-shadow:var(--kompendium-shadow-depth-8-focused)}.children{list-style:none;margin:0.125rem 0 0.25rem 0.75rem;padding:0 0 0 0.75rem;border-left:1px solid rgb(var(--kompendium-contrast-500))}.children .entry::before{display:none;content:none}.children .link{font-size:0.8125rem;color:rgb(var(--kompendium-contrast-1000))}.toc.open .scrim,.toc.open .panel{display:block}@media (max-width: 1000px){.panel{right:1rem;left:1rem;max-width:none}.fab{top:1rem;right:1rem}}`;

const Toc = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
        /**
         * Entries to show in the menu. A flat or nested list of links.
         */
        this.entries = [];
        this.open = false;
        this.userToggles = new Map();
        this.renderEntry = (entry) => {
            const children = entry.children || [];
            const hasChildren = children.length > 0;
            const collapsible = !!entry.collapsible && hasChildren;
            const expanded = collapsible ? this.isEntryExpanded(entry) : true;
            return (index.h("li", { class: { entry: true, collapsible: collapsible } }, index.h("div", { class: "entry-row" }, collapsible ? (index.h("button", { type: "button", class: { toggle: true, expanded: expanded }, onClick: this.toggleExpanded(entry.id), "aria-expanded": expanded ? 'true' : 'false', "aria-label": `Toggle ${entry.title}` }, renderChevron())) : null, index.h("a", { class: "link", href: anchors.anchorHref(entry.id), onClick: this.handleLinkClick }, entry.title)), hasChildren && expanded ? (index.h("ul", { class: "children" }, children.map(this.renderEntry))) : null));
        };
        this.toggle = () => {
            this.open = !this.open;
        };
        this.close = () => {
            this.open = false;
        };
        this.handleLinkClick = (event) => {
            if (event.metaKey ||
                event.ctrlKey ||
                event.shiftKey ||
                event.altKey ||
                event.button !== 0) {
                return;
            }
            this.close();
        };
        this.toggleExpanded = (id) => (event) => {
            event.preventDefault();
            event.stopPropagation();
            const entry = findEntryById(id, this.entries);
            const current = entry ? this.isEntryExpanded(entry) : false;
            const next = new Map(this.userToggles);
            next.set(id, !current);
            this.userToggles = next;
        };
        this.handleKeydown = this.handleKeydown.bind(this);
        this.handleHashChange = this.handleHashChange.bind(this);
    }
    connectedCallback() {
        document.addEventListener('keydown', this.handleKeydown);
        window.addEventListener('hashchange', this.handleHashChange);
        this.expandSectionForActiveAnchor();
    }
    disconnectedCallback() {
        document.removeEventListener('keydown', this.handleKeydown);
        window.removeEventListener('hashchange', this.handleHashChange);
    }
    onEntriesChange(newEntries) {
        const validIds = collectIds(newEntries || []);
        const pruned = new Map();
        for (const [id, value] of this.userToggles) {
            if (validIds.has(id)) {
                pruned.set(id, value);
            }
        }
        this.userToggles = pruned;
        this.expandSectionForActiveAnchor();
    }
    onOpenChange(isOpen, wasOpen) {
        if (isOpen === wasOpen) {
            return;
        }
        const shadow = this.host.shadowRoot;
        if (!shadow) {
            return;
        }
        if (isOpen) {
            requestAnimationFrame(() => {
                const first = shadow.querySelector('.panel .link') ||
                    shadow.querySelector('.panel a, .panel button');
                first === null || first === void 0 ? void 0 : first.focus();
            });
        }
        else {
            const fab = shadow.querySelector('.fab');
            fab === null || fab === void 0 ? void 0 : fab.focus();
        }
    }
    render() {
        if (!this.entries || !this.entries.length) {
            return index.h("div", { class: "toc hidden" });
        }
        return (index.h("div", { class: { toc: true, open: this.open } }, index.h("div", { class: "scrim", onClick: this.close, "aria-hidden": "true" }), index.h("div", { class: "panel", role: "dialog", "aria-modal": "true", "aria-label": "Table of contents", onClick: stopPropagation }, index.h("h2", { class: "heading" }, "On this page"), index.h("ul", { class: "entries" }, this.entries.map(this.renderEntry))), index.h("button", { type: "button", class: "fab", onClick: this.toggle, "aria-label": "Table of contents", "aria-expanded": this.open ? 'true' : 'false' }, this.open ? renderCloseIcon() : renderMenuIcon())));
    }
    isEntryExpanded(entry) {
        const explicit = this.userToggles.get(entry.id);
        if (explicit !== undefined) {
            return explicit;
        }
        return !!entry.defaultExpanded;
    }
    handleKeydown(event) {
        if (event.key === 'Escape' && this.open) {
            this.open = false;
        }
    }
    handleHashChange() {
        this.expandSectionForActiveAnchor();
    }
    expandSectionForActiveAnchor() {
        const activeId = anchorScroll.getAnchorId();
        if (!activeId) {
            return;
        }
        const ancestors = findAncestorsOf(activeId, this.entries).filter((entry) => entry.collapsible);
        if (!ancestors.length) {
            return;
        }
        const next = new Map(this.userToggles);
        let changed = false;
        for (const ancestor of ancestors) {
            if (!this.isEntryExpanded(ancestor)) {
                next.set(ancestor.id, true);
                changed = true;
            }
        }
        if (changed) {
            this.userToggles = next;
        }
    }
    get host() { return index.getElement(this); }
    static get watchers() { return {
        "entries": [{
                "onEntriesChange": 0
            }],
        "open": [{
                "onOpenChange": 0
            }]
    }; }
};
const stopPropagation = (event) => {
    event.stopPropagation();
};
const icon = (d, size = 24) => (index.h("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", width: String(size), height: String(size), "aria-hidden": "true" }, index.h("path", { fill: "currentColor", d: d })));
const renderMenuIcon = () => icon('M3 4h18v2H3V4zm0 7h12v2H3v-2zm0 7h18v2H3v-2z');
const renderCloseIcon = () => icon('M18.3 5.71 12 12l6.3 6.29-1.41 1.42L10.58 13.4l-6.29 6.3-1.42-1.41L9.17 12 2.87 5.71 4.29 4.3l6.29 6.3 6.3-6.3z');
const renderChevron = () => icon('M8.59 16.34 13.17 11.75 8.59 7.17 10 5.75l6 6-6 6z', 16);
Toc.style = tocCss();

exports.kompendium_playground = Playground;
exports.kompendium_toc = Toc;
