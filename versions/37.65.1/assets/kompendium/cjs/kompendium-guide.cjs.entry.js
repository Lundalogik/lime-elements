'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-4264cbf1.js');

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
    return index.h("kompendium-markdown", { text: this.text });
  }
  findGuide() {
    const guide = this.data.guides.find((g) => g.data.path + '/' === this.route);
    if (guide) {
      this.text = guide.content;
    }
  }
};

exports.kompendium_guide = Guide;
