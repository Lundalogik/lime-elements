'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-05806c6d.js');
const activeRouter = require('./active-router-fab29ac1.js');

const RouteTitle = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.titleSuffix = '';
    this.pageTitle = '';
  }
  updateDocumentTitle() {
    const el = this.el;
    if (el.ownerDocument) {
      el.ownerDocument.title = `${this.pageTitle}${this.titleSuffix || ''}`;
    }
  }
  componentWillLoad() {
    this.updateDocumentTitle();
  }
  get el() { return index.getElement(this); }
  static get watchers() { return {
    "pageTitle": ["updateDocumentTitle"]
  }; }
};
activeRouter.ActiveRouter.injectProps(RouteTitle, [
  'titleSuffix',
]);

exports.stencil_route_title = RouteTitle;
