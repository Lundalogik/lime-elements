import { p as promiseResolve, b as bootstrapLazy } from './index-b6960280.js';

/*
 Stencil Client Patch Browser v2.6.0 | MIT Licensed | https://stenciljs.com
 */
const patchBrowser = () => {
    const importMeta = import.meta.url;
    const opts = {};
    if (importMeta !== '') {
        opts.resourcesUrl = new URL('.', importMeta).href;
    }
    return promiseResolve(opts);
};

patchBrowser().then(options => {
  return bootstrapLazy([["kompendium-component",[[1,"kompendium-component",{"docs":[16],"schemas":[16],"match":[16],"examplePropsFactory":[16]}]]],["kompendium-type",[[1,"kompendium-type",{"types":[16],"match":[16],"type":[32]}]]],["kompendium-example-code",[[1,"kompendium-example-code"]]],["kompendium-example-markdown",[[1,"kompendium-example-markdown"]]],["kompendium-guide",[[1,"kompendium-guide",{"data":[16],"route":[32]}]]],["kompendium-debug",[[1,"kompendium-debug",{"docs":[16],"schemas":[16],"match":[16],"examplePropsFactory":[16]}]]],["kompendium-code",[[1,"kompendium-code",{"language":[1],"code":[32]}]]],["kompendium-markdown",[[1,"kompendium-markdown",{"text":[1]}]]],["kompendium-playground",[[1,"kompendium-playground",{"component":[16],"schema":[16],"propsFactory":[16],"activeTab":[32],"theme":[32]}]]],["kompendium-proplist_2",[[1,"kompendium-proplist",{"items":[16]}],[1,"kompendium-taglist",{"tags":[16],"compact":[4]}]]],["kompendium-app_7",[[1,"kompendium-app",{"path":[1],"examplePropsFactory":[16],"data":[32],"index":[32]}],[1,"kompendium-navigation",{"menu":[16],"header":[1],"logo":[1],"index":[8],"route":[32],"displayNavPanel":[32]}],[4,"stencil-route",{"url":[1],"component":[1],"componentProps":[16],"routeRender":[16],"currentPath":[32]}],[4,"stencil-route-switch",{"scrollTopOffset":[2,"scroll-top-offset"],"currentPath":[32]}],[4,"stencil-router"],[1,"kompendium-darkmode-switch",{"theme":[32],"systemSettingIsDark":[32]}],[1,"kompendium-search",{"index":[8],"documents":[32]}]]]], options);
});
