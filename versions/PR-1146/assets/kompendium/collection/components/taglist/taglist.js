import { Component, h, Prop, getAssetPath } from '@stencil/core';
/**
 * asd
 */
export class Taglist {
    constructor() {
        /**
         * Set to `true` if the list should be rendered in compact mode
         */
        this.compact = false;
    }
    render() {
        return this.tags.map(this.renderTag);
    }
    renderTag(tag) {
        const classList = {
            'tag-list': true,
        };
        const path = getAssetPath('../collection/assets/icons/bookmark-fill.svg');
        classList[`tag--${tag.name}`] = true;
        return (h("div", { class: classList },
            h("img", { src: path }),
            h("code", null,
                "@",
                tag.name),
            h("kompendium-markdown", { text: tag.text })));
    }
    static get is() { return "kompendium-taglist"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["taglist.scss"]
    }; }
    static get styleUrls() { return {
        "$": ["taglist.css"]
    }; }
    static get properties() { return {
        "tags": {
            "type": "unknown",
            "mutable": false,
            "complexType": {
                "original": "JsonDocsTag[]",
                "resolved": "JsonDocsTag[]",
                "references": {
                    "JsonDocsTag": {
                        "location": "import",
                        "path": "@stencil/core/internal"
                    }
                }
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": "List of tags to render"
            }
        },
        "compact": {
            "type": "boolean",
            "mutable": false,
            "complexType": {
                "original": "boolean",
                "resolved": "boolean",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": "Set to `true` if the list should be rendered in compact mode"
            },
            "attribute": "compact",
            "reflect": false,
            "defaultValue": "false"
        }
    }; }
}
