'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-ae7b1a30.js');

const Guide = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
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
        return index.h("kompendium-markdown", { text: this.text });
    }
    findGuide() {
        const guide = this.data.guides.find((guide) => guide.data.frontmatter.path === this.route);
        if (guide) {
            this.text = guide.content;
        }
    }
};

exports.kompendium_guide = Guide;
