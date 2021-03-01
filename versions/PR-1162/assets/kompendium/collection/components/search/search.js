import { Component, h, Element } from '@stencil/core';
export class Search {
    componentDidLoad() {
        this.host.shadowRoot.querySelector('input').focus();
    }
    render() {
        return (h("div", { class: "search-box" },
            h("input", { type: "search", autoFocus: true, placeholder: "Search" }),
            h("ul", { class: "result" })));
    }
    static get is() { return "kompendium-search"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["search.scss"]
    }; }
    static get styleUrls() { return {
        "$": ["search.css"]
    }; }
    static get elementRef() { return "host"; }
}
