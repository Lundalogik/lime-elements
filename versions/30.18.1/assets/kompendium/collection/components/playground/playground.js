import { Component, h, Prop, State } from '@stencil/core';
export class Playground {
    constructor() {
        this.activateTab = (id) => () => {
            this.activeTab = id;
        };
        this.renderTab = this.renderTab.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }
    render() {
        if (!this.component) {
            return;
        }
        const sources = this.component['sources'] || [];
        return (h("section", { class: "example" },
            h("div", { class: "result" }, this.renderResult()),
            h("aside", { class: "code" },
                h("nav", { class: "tab-bar" }, this.renderTabs(sources)),
                h("div", { class: "tab-items" }, this.renderItems(sources)))));
    }
    renderTabs(sources) {
        return sources.map(this.renderTab);
    }
    renderTab(source, index) {
        const classList = {
            tab: true,
            active: this.isTabActive(source, index),
        };
        return (h("a", { class: classList, onClick: this.activateTab(source.filename) },
            h("span", null, source.filename)));
    }
    renderItems(sources) {
        return sources.map(this.renderItem);
    }
    renderResult() {
        const ExampleComponent = this.component.tag;
        const text = '##### ' + this.component.docs;
        return (h("div", { class: "show-case" },
            h("div", { class: "show-case_description" },
                h("kompendium-markdown", { text: text })),
            h("div", { class: "show-case_component" },
                h(ExampleComponent, null))));
    }
    renderItem(source, index) {
        const classList = {
            'tab-item': true,
            active: this.isTabActive(source, index),
        };
        const code = source.source.replace(/\/\*\*.+?\*\//gms, '');
        return (h("kompendium-code", { random: Math.random(), class: classList, language: source.type }, code));
    }
    isTabActive(source, index) {
        let isActive = this.activeTab === source.filename;
        if (!isActive) {
            isActive = index === 0 && !this.activeTab;
        }
        return isActive;
    }
    static get is() { return "kompendium-playground"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["playground.scss"]
    }; }
    static get styleUrls() { return {
        "$": ["playground.css"]
    }; }
    static get properties() { return {
        "component": {
            "type": "unknown",
            "mutable": false,
            "complexType": {
                "original": "JsonDocsComponent",
                "resolved": "JsonDocsComponent",
                "references": {
                    "JsonDocsComponent": {
                        "location": "import",
                        "path": "@stencil/core/internal"
                    }
                }
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": "The component to display"
            }
        }
    }; }
    static get states() { return {
        "activeTab": {}
    }; }
}
