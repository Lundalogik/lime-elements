import { Component, h, Prop, State } from '@stencil/core';
import { Interface } from './templates/interface';
import { Alias } from './templates/alias';
import { Enum } from './templates/enum';
export class Type {
    componentWillRender() {
        this.findType();
    }
    render() {
        if (!this.type) {
            return;
        }
        const type = this.type;
        const componentMap = {
            interface: Interface,
            alias: Alias,
            enum: Enum,
        };
        const TypeComponent = componentMap[this.type.type];
        return (h("article", { class: "type" },
            h("section", { class: "docs" },
                h(TypeComponent, { type: type }))));
    }
    findType() {
        const type = this.types.find((type) => type.name === this.match.params.name);
        if (type) {
            this.type = type;
        }
    }
    static get is() { return "kompendium-type"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["../component/component.scss"]
    }; }
    static get styleUrls() { return {
        "$": ["../component/component.css"]
    }; }
    static get properties() { return {
        "types": {
            "type": "unknown",
            "mutable": false,
            "complexType": {
                "original": "TypeDescription[]",
                "resolved": "TypeDescription[]",
                "references": {
                    "TypeDescription": {
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
                        "path": "@stencil/router"
                    }
                }
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": "Matched route parameters"
            }
        }
    }; }
    static get states() { return {
        "type": {}
    }; }
}
