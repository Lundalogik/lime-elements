import { Component, h, State, Prop } from '@stencil/core';
import { setTypes } from '../markdown/markdown-types';
export class App {
    constructor() {
        /**
         * Path to `kompendium.json`
         */
        this.path = '/kompendium.json';
        this.onMessage = this.onMessage.bind(this);
    }
    componentWillLoad() {
        this.createWebSocket();
        this.fetchData();
    }
    createWebSocket() {
        if (this.socket) {
            return;
        }
        const url = getSocketUrl(location);
        this.socket = new WebSocket(url);
        this.socket.addEventListener('message', this.onMessage);
    }
    onMessage(event) {
        var _a;
        try {
            const data = JSON.parse(event.data);
            if (((_a = data.buildLog) === null || _a === void 0 ? void 0 : _a.progress) === 1) {
                this.fetchData();
            }
        }
        catch (e) {
            console.error(e);
        }
    }
    async fetchData() {
        const data = await fetch(this.path);
        this.data = await data.json();
        const typeNames = this.data.types.map((type) => type.name);
        setTypes(typeNames);
    }
    render() {
        if (!this.data) {
            return (h("div", { class: "loading-screen" },
                h("div", { class: "loading-screen-icon" }),
                h("div", { class: "loading-screen-text" }, "Loading...")));
        }
        return (h("div", { class: "kompendium-body" },
            h("kompendium-navigation", { menu: this.data.menu, header: this.data.title, logo: this.data.logo }),
            h("main", { role: "main" },
                h("stencil-router", { historyType: "hash" },
                    h("stencil-route-switch", { scrollTopOffset: 0 },
                        h("stencil-route", { url: "/", component: "kompendium-markdown", componentProps: {
                                text: this.data.readme,
                            }, exact: true }),
                        h("stencil-route", { url: "/component/:name/:section?", component: "kompendium-component", componentProps: {
                                docs: this.data.docs,
                            } }),
                        h("stencil-route", { url: "/type/:name", component: "kompendium-type", componentProps: {
                                types: this.data.types,
                            } }),
                        h("stencil-route", { component: "kompendium-guide", componentProps: {
                                data: this.data,
                            } }))))));
    }
    static get is() { return "kompendium-app"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["app.scss"]
    }; }
    static get styleUrls() { return {
        "$": ["app.css"]
    }; }
    static get properties() { return {
        "path": {
            "type": "string",
            "mutable": false,
            "complexType": {
                "original": "string",
                "resolved": "string",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": "Path to `kompendium.json`"
            },
            "attribute": "path",
            "reflect": false,
            "defaultValue": "'/kompendium.json'"
        }
    }; }
    static get states() { return {
        "data": {}
    }; }
}
function getSocketUrl(location) {
    const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${location.hostname}:${location.port}/`;
}
