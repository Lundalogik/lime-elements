import { p as promiseResolve, g as globalScripts, b as bootstrapLazy } from './index-26EzvxF0.js';
export { s as setNonce } from './index-26EzvxF0.js';

/*
 Stencil Client Patch Browser v4.43.5 | MIT Licensed | https://stenciljs.com
 */

var patchBrowser = () => {
  const importMeta = import.meta.url;
  const opts = {};
  if (importMeta !== "") {
    opts.resourcesUrl = new URL(".", importMeta).href;
  }
  return promiseResolve(opts);
};

patchBrowser().then(async (options) => {
  await globalScripts();
  return bootstrapLazy([["kompendium-component",[[1,"kompendium-component",{"docs":[16],"schemas":[16],"match":[16],"examplePropsFactory":[16]}]]],["kompendium-type",[[1,"kompendium-type",{"types":[16],"match":[16],"type":[32]}]]],["kompendium-example-code",[[1,"kompendium-example-code"]]],["kompendium-markdown",[[1,"kompendium-markdown",{"text":[1]}]]],["kompendium-example-inline-links",[[1,"kompendium-example-inline-links"]]],["kompendium-example-markdown",[[1,"kompendium-example-markdown"]]],["kompendium-guide",[[1,"kompendium-guide",{"data":[16],"route":[32]}]]],["kompendium-debug",[[1,"kompendium-debug",{"docs":[16],"schemas":[16],"match":[16],"examplePropsFactory":[16]}]]],["kompendium-code",[[257,"kompendium-code",{"language":[1],"code":[32]}]]],["kompendium-anchor_3",[[1,"kompendium-proplist",{"items":[16]}],[1,"kompendium-taglist",{"tags":[16],"compact":[4]}],[1,"kompendium-anchor",{"slug":[1],"label":[1],"active":[32]}]]],["kompendium-playground_2",[[1,"kompendium-playground",{"component":[16],"schema":[16],"propsFactory":[16],"anchorSlug":[1,"anchor-slug"],"activeTab":[32],"theme":[32]}],[1,"kompendium-toc",{"entries":[16],"open":[32],"userToggles":[32]},null,{"entries":[{"onEntriesChange":0}],"open":[{"onOpenChange":0}]}]]],["kompendium-app_7",[[1,"kompendium-app",{"path":[1],"examplePropsFactory":[16],"data":[32],"index":[32]},null,{"data":[{"watchData":0}]}],[1,"kompendium-navigation",{"menu":[16],"header":[1],"logo":[1],"index":[8],"route":[32],"displayNavPanel":[32]}],[260,"stencil-route",{"url":[1],"component":[1],"componentProps":[16],"routeRender":[16],"currentPath":[32]}],[260,"stencil-route-switch",{"scrollTopOffset":[2,"scroll-top-offset"],"currentPath":[32]}],[260,"stencil-router"],[1,"kompendium-darkmode-switch",{"theme":[32],"systemSettingIsDark":[32]}],[1,"kompendium-search",{"index":[8],"documents":[32]}]]]], options);
});
