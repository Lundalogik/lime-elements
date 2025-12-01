'use strict';

var index = require('./index-CI2W1cDY.js');

const Guide = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
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
        return index.h("kompendium-markdown", { key: '8df12c70deaae9f377a9e0674b7f274bc62076df', text: this.text });
    }
    findGuide() {
        const guide = this.data.guides.find((g) => g.data.path + '/' === this.route);
        if (guide) {
            this.text = guide.content;
        }
    }
};

exports.kompendium_guide = Guide;
//# sourceMappingURL=kompendium-guide.entry.cjs.js.map
