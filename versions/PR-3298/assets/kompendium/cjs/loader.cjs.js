'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-4264cbf1.js');

/*
 Stencil Client Patch Esm v2.6.0 | MIT Licensed | https://stenciljs.com
 */
const patchEsm = () => {
    return index.promiseResolve();
};

const defineCustomElements = (win, options) => {
  if (typeof window === 'undefined') return Promise.resolve();
  return patchEsm().then(() => {
  return index.bootstrapLazy([["kompendium-component.cjs",[[1,"kompendium-component",{"docs":[16],"schemas":[16],"match":[16],"examplePropsFactory":[16]}]]],["kompendium-type.cjs",[[1,"kompendium-type",{"types":[16],"match":[16],"type":[32]}]]],["kompendium-example-code.cjs",[[1,"kompendium-example-code"]]],["kompendium-example-markdown.cjs",[[1,"kompendium-example-markdown"]]],["kompendium-guide.cjs",[[1,"kompendium-guide",{"data":[16],"route":[32]}]]],["context-consumer.cjs",[[0,"context-consumer",{"context":[16],"renderer":[16],"subscribe":[16],"unsubscribe":[32]}]]],["kompendium-debug.cjs",[[1,"kompendium-debug",{"docs":[16],"schemas":[16],"match":[16]}]]],["stencil-async-content.cjs",[[0,"stencil-async-content",{"documentLocation":[1,"document-location"],"content":[32]}]]],["stencil-route-link.cjs",[[4,"stencil-route-link",{"url":[1],"urlMatch":[1,"url-match"],"activeClass":[1,"active-class"],"exact":[4],"strict":[4],"custom":[1],"anchorClass":[1,"anchor-class"],"anchorRole":[1,"anchor-role"],"anchorTitle":[1,"anchor-title"],"anchorTabIndex":[1,"anchor-tab-index"],"anchorId":[1,"anchor-id"],"history":[16],"location":[16],"root":[1],"ariaHaspopup":[1,"aria-haspopup"],"ariaPosinset":[1,"aria-posinset"],"ariaSetsize":[2,"aria-setsize"],"ariaLabel":[1,"aria-label"],"match":[32]}]]],["stencil-route-title.cjs",[[0,"stencil-route-title",{"titleSuffix":[1,"title-suffix"],"pageTitle":[1,"page-title"]}]]],["stencil-router-prompt.cjs",[[0,"stencil-router-prompt",{"when":[4],"message":[1],"history":[16],"unblock":[32]}]]],["stencil-router-redirect.cjs",[[0,"stencil-router-redirect",{"history":[16],"root":[1],"url":[1]}]]],["kompendium-code.cjs",[[1,"kompendium-code",{"language":[1],"code":[32]}]]],["kompendium-markdown.cjs",[[1,"kompendium-markdown",{"text":[1]}]]],["kompendium-playground.cjs",[[1,"kompendium-playground",{"component":[16],"schema":[16],"propsFactory":[16],"activeTab":[32],"theme":[32]}]]],["kompendium-proplist_2.cjs",[[1,"kompendium-proplist",{"items":[16]}],[1,"kompendium-taglist",{"tags":[16],"compact":[4]}]]],["kompendium-app_7.cjs",[[1,"kompendium-app",{"path":[1],"examplePropsFactory":[16],"data":[32],"index":[32]}],[1,"kompendium-navigation",{"menu":[16],"header":[1],"logo":[1],"index":[8],"route":[32],"displayNavPanel":[32]}],[0,"stencil-route",{"group":[513],"componentUpdated":[16],"match":[1040],"url":[1],"component":[1],"componentProps":[16],"exact":[4],"routeRender":[16],"scrollTopOffset":[2,"scroll-top-offset"],"routeViewsUpdated":[16],"location":[16],"history":[16],"historyType":[1,"history-type"]}],[4,"stencil-route-switch",{"group":[513],"scrollTopOffset":[2,"scroll-top-offset"],"location":[16],"routeViewsUpdated":[16]}],[4,"stencil-router",{"root":[1],"historyType":[1,"history-type"],"titleSuffix":[1,"title-suffix"],"scrollTopOffset":[2,"scroll-top-offset"],"location":[32],"history":[32]}],[1,"kompendium-darkmode-switch",{"theme":[32],"systemSettingIsDark":[32]}],[1,"kompendium-search",{"index":[8],"documents":[32]}]]]], options);
  });
};

exports.defineCustomElements = defineCustomElements;
