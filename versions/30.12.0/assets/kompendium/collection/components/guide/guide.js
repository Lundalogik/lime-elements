import { Component, h, Prop, State } from '@stencil/core';
export class Guide {
    constructor() {
        this.setRoute = this.setRoute.bind(this);
    }
    componentWillLoad() {
        window.addEventListener('hashchange', this.setRoute);
        this.setRoute();
    }
    componentDidUnload() {
        window.removeEventListener('hashchange', this.setRoute);
    }
    setRoute() {
        this.route = location.hash.replace('#', '');
    }
    render() {
        this.findGuide();
        return h("kompendium-markdown", { text: this.text });
    }
    findGuide() {
        const guide = this.data.guides.find((g) => g.data.path + '/' === this.route);
        if (guide) {
            this.text = guide.content;
        }
    }
    static get is() { return "kompendium-guide"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "data": {
            "type": "unknown",
            "mutable": false,
            "complexType": {
                "original": "KompendiumData",
                "resolved": "KompendiumData",
                "references": {
                    "KompendiumData": {
                        "location": "import",
                        "path": "../../types"
                    }
                }
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            }
        }
    }; }
    static get states() { return {
        "route": {}
    }; }
}
