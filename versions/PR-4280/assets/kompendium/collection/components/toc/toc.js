import { h } from "@stencil/core";
import { anchorHref } from "../component/anchors";
import { getAnchorId } from "../anchor-scroll";
import { collectIds, findAncestorsOf, findEntryById } from "./toc.tree";
/**
 * Floating table-of-contents menu. Clicking the button reveals an overlay
 * listing the entries. Selecting an entry updates the URL hash with a slug
 * anchor (e.g. `#/component/my-component#basic-example`) so the page can
 * scroll to the target and the location can be shared.
 * @private
 */
export class Toc {
    constructor() {
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
            return (h("li", { class: { entry: true, collapsible: collapsible } }, h("div", { class: "entry-row" }, collapsible ? (h("button", { type: "button", class: { toggle: true, expanded: expanded }, onClick: this.toggleExpanded(entry.id), "aria-expanded": expanded ? 'true' : 'false', "aria-label": `Toggle ${entry.title}` }, renderChevron())) : null, h("a", { class: "link", href: anchorHref(entry.id), onClick: this.handleLinkClick }, entry.title)), hasChildren && expanded ? (h("ul", { class: "children" }, children.map(this.renderEntry))) : null));
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
            return h("div", { class: "toc hidden" });
        }
        return (h("div", { class: { toc: true, open: this.open } }, h("div", { class: "scrim", onClick: this.close, "aria-hidden": "true" }), h("div", { class: "panel", role: "dialog", "aria-modal": "true", "aria-label": "Table of contents", onClick: stopPropagation }, h("h2", { class: "heading" }, "On this page"), h("ul", { class: "entries" }, this.entries.map(this.renderEntry))), h("button", { type: "button", class: "fab", onClick: this.toggle, "aria-label": "Table of contents", "aria-expanded": this.open ? 'true' : 'false' }, this.open ? renderCloseIcon() : renderMenuIcon())));
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
        const activeId = getAnchorId();
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
    static get is() { return "kompendium-toc"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "$": ["toc.scss"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["toc.css"]
        };
    }
    static get properties() {
        return {
            "entries": {
                "type": "unknown",
                "mutable": false,
                "complexType": {
                    "original": "TocEntry[]",
                    "resolved": "TocEntry[]",
                    "references": {
                        "TocEntry": {
                            "location": "import",
                            "path": "./toc.types",
                            "id": "src/components/toc/toc.types.ts::TocEntry",
                            "referenceLocation": "TocEntry"
                        }
                    }
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": "Entries to show in the menu. A flat or nested list of links."
                },
                "getter": false,
                "setter": false,
                "defaultValue": "[]"
            }
        };
    }
    static get states() {
        return {
            "open": {},
            "userToggles": {}
        };
    }
    static get elementRef() { return "host"; }
    static get watchers() {
        return [{
                "propName": "entries",
                "methodName": "onEntriesChange"
            }, {
                "propName": "open",
                "methodName": "onOpenChange"
            }];
    }
}
const stopPropagation = (event) => {
    event.stopPropagation();
};
const icon = (d, size = 24) => (h("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", width: String(size), height: String(size), "aria-hidden": "true" }, h("path", { fill: "currentColor", d: d })));
const renderMenuIcon = () => icon('M3 4h18v2H3V4zm0 7h12v2H3v-2zm0 7h18v2H3v-2z');
const renderCloseIcon = () => icon('M18.3 5.71 12 12l6.3 6.29-1.41 1.42L10.58 13.4l-6.29 6.3-1.42-1.41L9.17 12 2.87 5.71 4.29 4.3l6.29 6.3 6.3-6.3z');
const renderChevron = () => icon('M8.59 16.34 13.17 11.75 8.59 7.17 10 5.75l6 6-6 6z', 16);
