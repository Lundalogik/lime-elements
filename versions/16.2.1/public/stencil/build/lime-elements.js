
(function(win, doc, namespace, fsNamespace, resourcesUrl, appCore, appCoreSsr, appCorePolyfilled, hydratedCssClass, components) {

  function init(win, doc, namespace, fsNamespace, resourcesUrl, appCore, appCorePolyfilled, hydratedCssClass, cmpTags, HTMLElementPrototype, App, x, y, scriptElm) {
    // create global namespace if it doesn't already exist
    App = win[namespace] = win[namespace] || {};
    if (cmpTags) {
        // auto hide components until they been fully hydrated
        // reusing the "x" and "i" variables from the args for funzies
        x = doc.createElement('style');
        x.innerHTML = cmpTags + '{visibility:hidden}.' + hydratedCssClass + '{visibility:inherit}';
        x.setAttribute('data-styles', '');
        y = doc.head.querySelector('meta[charset]');
        doc.head.insertBefore(x, y ? y.nextSibling : doc.head.firstChild);
    }
    createComponentOnReadyPrototype(win, namespace, HTMLElementPrototype);
    resourcesUrl = resourcesUrl || App.resourcesUrl;
    // figure out the script element for this current script
    y = doc.querySelectorAll('script');
    for (x = y.length - 1; x >= 0; x--) {
        scriptElm = y[x];
        if (scriptElm.src || scriptElm.hasAttribute('data-resources-url')) {
            break;
        }
    }
    // get the resource path attribute on this script element
    y = scriptElm.getAttribute('data-resources-url');
    if (!resourcesUrl && y) {
        // the script element has a data-resources-url attribute, always use that
        resourcesUrl = y;
    }
    if (!resourcesUrl && scriptElm.src) {
        // we don't have an exact resourcesUrl, so let's
        // figure it out relative to this script's src and app's filesystem namespace
        y = scriptElm.src.split('/').slice(0, -1);
        resourcesUrl = (y.join('/')) + (y.length ? '/' : '') + fsNamespace + '/';
    }
    // request the core this browser needs
    // test for native support of custom elements and fetch
    // if either of those are not supported, then use the core w/ polyfills
    // also check if the page was build with ssr or not
    x = doc.createElement('script');
    if (usePolyfills(win, win.location, x, 'import("")')) {
        // requires the es5/polyfilled core
        x.src = resourcesUrl + appCorePolyfilled;
    }
    else {
        // let's do this!
        x.src = resourcesUrl + appCore;
        x.setAttribute('type', 'module');
        x.setAttribute('crossorigin', true);
    }
    x.setAttribute('data-resources-url', resourcesUrl);
    x.setAttribute('data-namespace', fsNamespace);
    doc.head.appendChild(x);
}
function usePolyfills(win, location, scriptElm, dynamicImportTest) {
    // fyi, dev mode has verbose if/return statements
    // but it minifies to a nice 'lil one-liner ;)
    if (location.search.indexOf('core=esm') > 0) {
        // force esm build
        return false;
    }
    if ((location.search.indexOf('core=es5') > 0) ||
        (location.protocol === 'file:') ||
        (!(win.customElements && win.customElements.define)) ||
        (!win.fetch) ||
        (!(win.CSS && win.CSS.supports && win.CSS.supports('color', 'var(--c)'))) ||
        (!('noModule' in scriptElm))) {
        // es5 build w/ polyfills
        return true;
    }
    // final test to see if this browser support dynamic imports
    return doesNotSupportsDynamicImports(dynamicImportTest);
}
function doesNotSupportsDynamicImports(dynamicImportTest) {
    try {
        new Function(dynamicImportTest);
        return false;
    }
    catch (e) { }
    return true;
}
function createComponentOnReadyPrototype(win, namespace, HTMLElementPrototype) {
    (win['s-apps'] = win['s-apps'] || []).push(namespace);
    if (!HTMLElementPrototype.componentOnReady) {
        HTMLElementPrototype.componentOnReady = function componentOnReady() {
            /*tslint:disable*/
            var elm = this;
            function executor(resolve) {
                if (elm.nodeName.indexOf('-') > 0) {
                    // window hasn't loaded yet and there's a
                    // good chance this is a custom element
                    var apps = win['s-apps'];
                    var appsReady = 0;
                    // loop through all the app namespaces
                    for (var i = 0; i < apps.length; i++) {
                        // see if this app has "componentOnReady" setup
                        if (win[apps[i]].componentOnReady) {
                            // this app's core has loaded call its "componentOnReady"
                            if (win[apps[i]].componentOnReady(elm, resolve)) {
                                // this component does belong to this app and would
                                // have fired off the resolve fn
                                // let's stop here, we're good
                                return;
                            }
                            appsReady++;
                        }
                    }
                    if (appsReady < apps.length) {
                        // not all apps are ready yet
                        // add it to the queue to be figured out when they are
                        (win['s-cr'] = win['s-cr'] || []).push([elm, resolve]);
                        return;
                    }
                }
                // not a recognized app component
                resolve(null);
            }
            // callback wasn't provided, let's return a promise
            if (win.Promise) {
                // use native/polyfilled promise
                return new win.Promise(executor);
            }
            // promise may not have been polyfilled yet
            return { then: executor };
        };
    }
}


  init(win, doc, namespace, fsNamespace, resourcesUrl, appCore, appCoreSsr, appCorePolyfilled, hydratedCssClass, components);

  })(window, document, "LimeElements","lime-elements",0,"lime-elements.core.js","es5-build-disabled.js","hydrated","limel-badge,limel-button,limel-button-group,limel-chart,limel-checkbox,limel-chip-set,limel-collapsible-section,limel-config,limel-date-picker,limel-dialog,limel-example,limel-example-badge,limel-example-button,limel-example-button-click,limel-example-button-group,limel-example-chart-bar,limel-example-chart-custom-colors,limel-example-chart-default-colors,limel-example-chart-line,limel-example-checkbox,limel-example-chip-set,limel-example-chip-set-choice,limel-example-chip-set-filter,limel-example-chip-set-input,limel-example-collapsible-section,limel-example-color,limel-example-color-table,limel-example-date-picker,limel-example-date-picker-formatted,limel-example-dialog,limel-example-dialog-closing-actions,limel-example-dialog-form,limel-example-dialog-fullscreen,limel-example-dialog-size,limel-example-grid,limel-example-icon,limel-example-icon-button,limel-example-input-field-autocomplete,limel-example-input-field-icon,limel-example-input-field-number,limel-example-input-field-text,limel-example-linear-progress,limel-example-linear-progress-color,limel-example-linear-progress-indeterminate,limel-example-list,limel-example-list-badge-icons,limel-example-list-icons,limel-example-list-secondary,limel-example-list-selectable,limel-example-menu,limel-example-multi-select,limel-example-picker,limel-example-picker-icons,limel-example-picker-multiple,limel-example-select,limel-example-slider,limel-example-snackbar,limel-example-spinner,limel-example-spinner-color,limel-example-switch,limel-grid,limel-icon,limel-icon-button,limel-input-field,limel-linear-progress,limel-list,limel-menu,limel-multi-select,limel-picker,limel-props,limel-select,limel-slider,limel-snackbar,limel-spinner,limel-switch,select-test-wrapper",HTMLElement.prototype);