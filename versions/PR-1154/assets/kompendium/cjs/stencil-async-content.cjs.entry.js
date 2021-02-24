'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-11d6cb66.js');

const AsyncContent = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
        this.content = '';
    }
    componentWillLoad() {
        if (this.documentLocation != null) {
            return this.fetchNewContent(this.documentLocation);
        }
    }
    fetchNewContent(newDocumentLocation) {
        return fetch(newDocumentLocation)
            .then(response => response.text())
            .then(data => {
            this.content = data;
        });
    }
    render() {
        return (index.h("div", { innerHTML: this.content }));
    }
    static get watchers() { return {
        "documentLocation": ["fetchNewContent"]
    }; }
};

exports.stencil_async_content = AsyncContent;
