import { p as promiseResolve, g as globalScripts, b as bootstrapLazy } from './index-DOaZxWLP.js';
export { s as setNonce } from './index-DOaZxWLP.js';

/*
 Stencil Client Patch Browser v4.38.0 | MIT Licensed | https://stenciljs.com
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
  return bootstrapLazy([["kompendium-component",[[257,"kompendium-component",{"docs":[16],"schemas":[16],"match":[16],"examplePropsFactory":[16]}]]],["kompendium-type",[[257,"kompendium-type",{"types":[16],"match":[16],"type":[32]}]]],["kompendium-example-code",[[257,"kompendium-example-code"]]],["kompendium-example-markdown",[[257,"kompendium-example-markdown"]]],["kompendium-guide",[[257,"kompendium-guide",{"data":[16],"route":[32]}]]],["kompendium-debug",[[257,"kompendium-debug",{"docs":[16],"schemas":[16],"match":[16],"examplePropsFactory":[16]}]]],["kompendium-code",[[257,"kompendium-code",{"language":[1],"code":[32]}]]],["kompendium-markdown",[[257,"kompendium-markdown",{"text":[1]}]]],["kompendium-playground",[[257,"kompendium-playground",{"component":[16],"schema":[16],"propsFactory":[16],"activeTab":[32],"theme":[32]}]]],["kompendium-proplist_2",[[257,"kompendium-proplist",{"items":[16]}],[257,"kompendium-taglist",{"tags":[16],"compact":[4]}]]],["kompendium-app_7",[[257,"kompendium-app",{"path":[1],"examplePropsFactory":[16],"data":[32],"index":[32]},null,{"data":["watchData"]}],[257,"kompendium-navigation",{"menu":[16],"header":[1],"logo":[1],"index":[8],"route":[32],"displayNavPanel":[32]}],[260,"kompendium-route",{"url":[1],"component":[1],"componentProps":[16],"routeRender":[16],"currentPath":[32]}],[260,"kompendium-route-switch",{"scrollTopOffset":[2,"scroll-top-offset"],"currentPath":[32]}],[260,"kompendium-router"],[257,"kompendium-darkmode-switch",{"theme":[32],"systemSettingIsDark":[32]}],[257,"kompendium-search",{"index":[8],"documents":[32]}]]]], options);
});
//# sourceMappingURL=kompendium.js.map
