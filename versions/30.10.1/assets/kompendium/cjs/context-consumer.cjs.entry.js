'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-11d6cb66.js');

const ContextConsumer = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
        this.context = {};
        this.renderer = () => null;
    }
    connectedCallback() {
        if (this.subscribe != null) {
            this.unsubscribe = this.subscribe(this.el, 'context');
        }
    }
    disconnectedCallback() {
        if (this.unsubscribe != null) {
            this.unsubscribe();
        }
    }
    render() {
        return this.renderer(Object.assign({}, this.context));
    }
    get el() { return index.getElement(this); }
};

exports.context_consumer = ContextConsumer;
