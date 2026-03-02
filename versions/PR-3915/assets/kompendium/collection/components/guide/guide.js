import { h } from "@stencil/core";
export class Guide {
    constructor() {
        this.setRoute = this.setRoute.bind(this);
    }
    connectedCallback() {
        window.addEventListener('hashchange', this.setRoute);
        this.setRoute();
    }
    disconnectedCallback() {
        window.removeEventListener('hashchange', this.setRoute);
    }
    setRoute() {
        this.route = location.hash.replace('#', '');
    }
    render() {
        this.findGuide();
        return h("kompendium-markdown", { key: '8df12c70deaae9f377a9e0674b7f274bc62076df', text: this.text });
    }
    findGuide() {
        const guide = this.data.guides.find((g) => g.data.path + '/' === this.route);
        if (guide) {
            this.text = guide.content;
        }
    }
    static get is() { return "kompendium-guide"; }
    static get encapsulation() { return "shadow"; }
    static get properties() {
        return {
            "data": {
                "type": "unknown",
                "mutable": false,
                "complexType": {
                    "original": "KompendiumData",
                    "resolved": "KompendiumData",
                    "references": {
                        "KompendiumData": {
                            "location": "import",
                            "path": "../../types",
                            "id": "src/types.ts::KompendiumData"
                        }
                    }
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false
            }
        };
    }
    static get states() {
        return {
            "route": {}
        };
    }
}
//# sourceMappingURL=guide.js.map
