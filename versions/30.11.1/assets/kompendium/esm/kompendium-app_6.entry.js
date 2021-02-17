import { r as registerInstance, h, g as getAssetPath, c as getElement, e as getContext } from './index-fb5abbae.js';
import { A as ActiveRouter } from './active-router-5b4f4f5f.js';
import { m as matchPath, a as matchesAreEqual, s as storageAvailable, b as supportsHistory, c as supportsPopStateOnHashChange, d as stripTrailingSlash, e as addLeadingSlash, f as createLocation, g as createKey, h as hasBasename, i as stripBasename, j as createPath, k as getConfirmation, l as isExtraneousPopstateEvent, n as supportsGoWithoutReloadUsingHash, o as stripLeadingSlash, p as locationsAreEqual } from './dom-utils-96bcc231.js';
import { s as setTypes } from './markdown-types-85472f5b.js';

const appCss = "*,*::before,*::after{-webkit-box-sizing:border-box;box-sizing:border-box}ul[class],ol[class]{padding:0}body,h1,h2,h3,h4,p,ul[class],ol[class],li,figure,figcaption,blockquote,dl,dd{margin:0}ul[class],ol[class]{list-style:none}a:not([class]){-webkit-text-decoration-skip:ink;text-decoration-skip-ink:auto}img{max-width:100%}input,button,textarea,select{font:inherit}@media (prefers-reduced-motion: reduce){*{-webkit-animation-duration:0.01ms !important;animation-duration:0.01ms !important;-webkit-animation-iteration-count:1 !important;animation-iteration-count:1 !important;-webkit-transition-duration:0.01ms !important;transition-duration:0.01ms !important;scroll-behavior:auto !important}}:root{--width-nav-panel:16rem}@-webkit-keyframes spin{to{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@keyframes spin{to{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}.loading-screen{display:-ms-flexbox;display:flex;-ms-flex-direction:row;flex-direction:row;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;position:absolute;top:0;right:0;bottom:0;left:0}.loading-screen-icon{-webkit-animation:spin 0.35s linear infinite;animation:spin 0.35s linear infinite;border-radius:50%;border-style:solid;border-width:0.125rem;border-color:rgb(var(--color-blue-default));border-top-color:transparent;display:inline-block;height:1.25rem;width:1.25rem}.loading-screen-text{padding-left:0.75rem;color:rgb(var(--contrast-1100))}:host{display:block;margin:0;padding:0}main{padding:1.25rem 2rem;margin-left:var(--width-nav-panel)}main kompendium-guide{display:block;width:100%;max-width:60rem}@media (max-width: 1400px){main{padding-top:2.625rem;margin-left:0}}";

const App = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        /**
         * Path to `kompendium.json`
         */
        this.path = '/kompendium.json';
        this.onMessage = this.onMessage.bind(this);
    }
    componentWillLoad() {
        this.createWebSocket();
        this.fetchData();
    }
    createWebSocket() {
        if (this.socket) {
            return;
        }
        const url = getSocketUrl(location);
        this.socket = new WebSocket(url);
        this.socket.addEventListener('message', this.onMessage);
    }
    onMessage(event) {
        var _a;
        try {
            const data = JSON.parse(event.data);
            if (((_a = data.buildLog) === null || _a === void 0 ? void 0 : _a.progress) === 1) {
                this.fetchData();
            }
        }
        catch (e) {
            console.error(e);
        }
    }
    async fetchData() {
        const data = await fetch(this.path);
        this.data = await data.json();
        const typeNames = this.data.types.map((type) => type.name);
        setTypes(typeNames);
    }
    render() {
        if (!this.data) {
            return (h("div", { class: "loading-screen" }, h("div", { class: "loading-screen-icon" }), h("div", { class: "loading-screen-text" }, "Loading...")));
        }
        return (h("div", { class: "kompendium-body" }, h("kompendium-navigation", { menu: this.data.menu, header: this.data.title, logo: this.data.logo }), h("main", { role: "main" }, h("stencil-router", { historyType: "hash" }, h("stencil-route-switch", { scrollTopOffset: 0 }, h("stencil-route", { url: "/", component: "kompendium-markdown", componentProps: {
                text: this.data.readme,
            }, exact: true }), h("stencil-route", { url: "/component/:name/:section?", component: "kompendium-component", componentProps: {
                docs: this.data.docs,
            } }), h("stencil-route", { url: "/type/:name", component: "kompendium-type", componentProps: {
                types: this.data.types,
            } }), h("stencil-route", { component: "kompendium-guide", componentProps: {
                data: this.data,
            } }))))));
    }
};
function getSocketUrl(location) {
    const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${location.hostname}:${location.port}/`;
}
App.style = appCss;

const navigationCss = "*,*::before,*::after{-webkit-box-sizing:border-box;box-sizing:border-box}ul[class],ol[class]{padding:0}body,h1,h2,h3,h4,p,ul[class],ol[class],li,figure,figcaption,blockquote,dl,dd{margin:0}ul[class],ol[class]{list-style:none}a:not([class]){-webkit-text-decoration-skip:ink;text-decoration-skip-ink:auto}img{max-width:100%}input,button,textarea,select{font:inherit}@media (prefers-reduced-motion: reduce){*{-webkit-animation-duration:0.01ms !important;animation-duration:0.01ms !important;-webkit-animation-iteration-count:1 !important;animation-iteration-count:1 !important;-webkit-transition-duration:0.01ms !important;transition-duration:0.01ms !important;scroll-behavior:auto !important}}:root{--width-nav-panel:16rem}:host{display:block;font-family:var(--kompendium-font-primary);--size-show-nav-panel-button:2.25rem}header a{text-decoration:none;color:unset}.nav-panel{-webkit-transition:margin 0.2s ease;transition:margin 0.2s ease;z-index:100;width:var(--width-nav-panel);height:100vh;position:fixed;background-color:rgb(var(--contrast-400));display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column}.nav-panel .panel-header{-ms-flex-direction:row;flex-direction:row;padding:1rem;border-bottom:1px solid rgb(var(--contrast-600));margin-bottom:0.5rem}.nav-panel .panel-header h1{text-transform:uppercase;font-size:1rem;font-weight:normal;letter-spacing:0.5ch;color:rgb(var(--contrast-800));margin:0.125rem 0 0.5rem 0}.nav-panel .panel-list{overflow-y:auto}.nav-panel .panel-list:not(.chapters){padding:0 0.25rem 2rem 0.25rem}.nav-panel__responsive-menu{-webkit-transition:background-color 0.2s ease, -webkit-box-shadow 0.2s ease, -webkit-transform 0.1s ease-out;transition:background-color 0.2s ease, -webkit-box-shadow 0.2s ease, -webkit-transform 0.1s ease-out;transition:background-color 0.2s ease, box-shadow 0.2s ease, transform 0.1s ease-out;transition:background-color 0.2s ease, box-shadow 0.2s ease, transform 0.1s ease-out, -webkit-box-shadow 0.2s ease, -webkit-transform 0.1s ease-out;-webkit-box-shadow:var(--button-shadow-normal);box-shadow:var(--button-shadow-normal);-webkit-transition:all 0.2s ease;transition:all 0.2s ease;display:none;cursor:pointer;position:absolute;top:0.75rem;right:calc((var(--size-show-nav-panel-button) * -1) - 1rem);width:var(--size-show-nav-panel-button);height:var(--size-show-nav-panel-button);margin:0.25rem;border-radius:50%;text-align:center;font-weight:bold;background-color:rgba(var(--contrast-200), 0.7);-webkit-backdrop-filter:blur(0.25rem);backdrop-filter:blur(0.25rem);color:rgb(var(--contrast-900))}.nav-panel__responsive-menu:hover{-webkit-box-shadow:var(--button-shadow-hovered);box-shadow:var(--button-shadow-hovered)}.nav-panel__responsive-menu:active{-webkit-box-shadow:var(--button-shadow-pressed);box-shadow:var(--button-shadow-pressed);-webkit-transform:translate3d(0, 0.08rem, 0);transform:translate3d(0, 0.08rem, 0)}.nav-panel__responsive-menu span{-webkit-transition:background-color 0.2s ease, opacity 0.15s ease 0.3s, -webkit-transform 0.2s ease 0.3s;transition:background-color 0.2s ease, opacity 0.15s ease 0.3s, -webkit-transform 0.2s ease 0.3s;transition:background-color 0.2s ease, transform 0.2s ease 0.3s, opacity 0.15s ease 0.3s;transition:background-color 0.2s ease, transform 0.2s ease 0.3s, opacity 0.15s ease 0.3s, -webkit-transform 0.2s ease 0.3s;display:block;position:absolute;left:0;right:0;margin:auto;height:0.125rem;width:1rem;border-radius:0.25rem;background-color:rgb(var(--contrast-900))}.nav-panel__responsive-menu span:nth-child(1){top:0.75rem}.nav-panel__responsive-menu span:nth-child(2),.nav-panel__responsive-menu span:nth-child(3){top:0;bottom:0}.nav-panel__responsive-menu span:nth-child(4){bottom:0.75rem}.nav-panel__responsive-menu:hover span{background-color:rgb(var(--contrast-1200))}@media (max-width: 1400px){.nav-panel{margin-left:calc(var(--width-nav-panel) * -1)}.nav-panel.display-nav-panel{margin-left:0;-webkit-box-shadow:0 0.09375rem 0.225rem 0 rgba(0, 0, 0, 0.232), 0 0.01875rem 0.05625rem 0 rgba(0, 0, 0, 0.208);box-shadow:0 0.09375rem 0.225rem 0 rgba(0, 0, 0, 0.232), 0 0.01875rem 0.05625rem 0 rgba(0, 0, 0, 0.208)}.nav-panel.display-nav-panel .nav-panel__responsive-menu{right:calc((var(--size-show-nav-panel-button) * -1) - 0.3125rem);border-radius:0 0.5rem 0.5rem 0}.nav-panel.display-nav-panel .nav-panel__responsive-menu span:nth-child(1),.nav-panel.display-nav-panel .nav-panel__responsive-menu span:nth-child(4){-webkit-transform:scaleX(0);transform:scaleX(0);opacity:0}.nav-panel.display-nav-panel .nav-panel__responsive-menu span:nth-child(2){-webkit-transform:rotate(45deg);transform:rotate(45deg)}.nav-panel.display-nav-panel .nav-panel__responsive-menu span:nth-child(3){-webkit-transform:rotate(-45deg);transform:rotate(-45deg)}.nav-panel__responsive-menu{display:block}}.panel-item{-webkit-transition:opacity 0.2s ease;transition:opacity 0.2s ease;width:100%;padding-right:0.75rem}.panel-link{display:grid;grid-auto-flow:column;grid-template-columns:1.25rem 1fr;line-height:1.75rem;color:rgb(var(--contrast-900));text-decoration:none;border-radius:0.375rem}.panel-link:hover,.panel-link.active{color:rgb(var(--color-blue-default))}.panel-link.active img{-webkit-transform:rotate(90deg) scale(0.8);transform:rotate(90deg) scale(0.8)}.panel-link img{-webkit-transition:-webkit-transform 0.2s ease;transition:-webkit-transform 0.2s ease;transition:transform 0.2s ease;transition:transform 0.2s ease, -webkit-transform 0.2s ease;-webkit-transform:scale(0.8);transform:scale(0.8);height:2rem}.link-text{overflow:hidden;white-space:nowrap;text-overflow:ellipsis;width:100%;padding-left:0.5rem}.chapters{height:0;-webkit-transition:height 0.2s ease;transition:height 0.2s ease}.chapters.active{height:100%;padding-left:1.25rem}.chapters.active .panel-item{opacity:1;-webkit-transition-delay:0.2s;transition-delay:0.2s}.chapters.active .panel-item:nth-child(1){-webkit-transition-delay:0s;transition-delay:0s}.chapters.active .panel-item:nth-child(2){-webkit-transition-delay:0.04s;transition-delay:0.04s}.chapters.active .panel-item:nth-child(3){-webkit-transition-delay:0.06s;transition-delay:0.06s}.chapters.active .panel-item:nth-child(4){-webkit-transition-delay:0.08s;transition-delay:0.08s}.chapters.active .panel-item:nth-child(5){-webkit-transition-delay:0.1s;transition-delay:0.1s}.chapters.active .panel-item:nth-child(6){-webkit-transition-delay:0.12s;transition-delay:0.12s}.chapters.active .panel-item:nth-child(7){-webkit-transition-delay:0.14s;transition-delay:0.14s}.chapters.active .panel-item:nth-child(8){-webkit-transition-delay:0.15s;transition-delay:0.15s}.chapters.active .panel-item:nth-child(9){-webkit-transition-delay:0.16s;transition-delay:0.16s}.chapters.active .panel-item:nth-child(10){-webkit-transition-delay:0.17s;transition-delay:0.17s}.chapters.active .panel-item:nth-child(11){-webkit-transition-delay:0.18s;transition-delay:0.18s}.chapters.active .panel-item:nth-child(12){-webkit-transition-delay:0.19s;transition-delay:0.19s}.chapters.active .panel-item:last-child{margin-bottom:1rem}.chapters img{visibility:hidden}.chapters .panel-item{opacity:0}.chapters .panel-item .chapters{font-size:0.8125rem;padding-left:0.5rem}.chapters .panel-item .chapters:first-child{margin-top:0.25rem}.chapters .panel-item .chapters:last-child{margin-bottom:0.5rem}";

const Navigation = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.route = '';
        this.toggleMenu = () => {
            const panel = this.host.shadowRoot.querySelector('.nav-panel');
            if (!panel) {
                return;
            }
            panel.classList.toggle('display-nav-panel');
        };
        this.setRoute = this.setRoute.bind(this);
        this.renderMenuItem = this.renderMenuItem.bind(this);
    }
    componentWillLoad() {
        window.addEventListener('hashchange', this.setRoute);
        this.setRoute();
    }
    componentDidUnload() {
        window.removeEventListener('hashchange', this.setRoute);
    }
    setRoute() {
        this.route = location.hash.substr(1);
    }
    render() {
        return (h("nav", { class: "nav-panel" }, h("a", { class: "nav-panel__responsive-menu", onClick: this.toggleMenu }, h("span", null), h("span", null), h("span", null), h("span", null)), h("header", { class: "panel-header" }, h("h1", null, this.renderHeader()), h("kompendium-search", null)), this.renderChapters(this.menu)));
    }
    renderHeader() {
        let content = this.header;
        if (this.logo) {
            content = h("img", { alt: this.header, src: this.logo });
        }
        return h("a", { href: "#" }, content);
    }
    renderChapters(menu) {
        if (!menu || !menu.length) {
            return;
        }
        return h("ul", { class: "panel-list" }, menu.map(this.renderMenuItem));
    }
    renderMenuItem(item) {
        const classList = {
            active: this.isRouteActive(item.path),
            chapters: true,
            'panel-list': true,
        };
        const anchorClassList = {
            'panel-link': true,
            active: this.isRouteActive(item.path),
        };
        const chapters = item.children || [];
        const path = getAssetPath('../collection/assets/icons/arrow-right-s-line.svg');
        return (h("li", { class: "panel-item" }, h("a", { class: anchorClassList, href: '#' + item.path }, h("img", { src: path }), h("span", { class: "link-text" }, item.title)), h("ul", { class: classList }, chapters.map(this.renderMenuItem))));
    }
    isRouteActive(route) {
        return this.route.startsWith(route);
    }
    get host() { return getElement(this); }
};
Navigation.style = navigationCss;

const searchCss = "*,*::before,*::after{-webkit-box-sizing:border-box;box-sizing:border-box}ul[class],ol[class]{padding:0}body,h1,h2,h3,h4,p,ul[class],ol[class],li,figure,figcaption,blockquote,dl,dd{margin:0}ul[class],ol[class]{list-style:none}a:not([class]){-webkit-text-decoration-skip:ink;text-decoration-skip-ink:auto}img{max-width:100%}input,button,textarea,select{font:inherit}@media (prefers-reduced-motion: reduce){*{-webkit-animation-duration:0.01ms !important;animation-duration:0.01ms !important;-webkit-animation-iteration-count:1 !important;animation-iteration-count:1 !important;-webkit-transition-duration:0.01ms !important;transition-duration:0.01ms !important;scroll-behavior:auto !important}}:host{display:block}.search-box{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column}input{-webkit-transition:background-color 0.2s ease;transition:background-color 0.2s ease;border:0;border-radius:0.25rem;padding:0 0.5rem;color:rgb(var(--contrast-1200));background-color:rgb(var(--contrast-300));height:2rem;line-height:2rem}input::-webkit-input-placeholder{color:rgb(var(--contrast-800))}input::-moz-placeholder{color:rgb(var(--contrast-800))}input:-ms-input-placeholder{color:rgb(var(--contrast-800))}input::-ms-input-placeholder{color:rgb(var(--contrast-800))}input::placeholder{color:rgb(var(--contrast-800))}input:active,input:focus,input:hover{background-color:rgb(var(--contrast-200))}input:focus{outline:none}input::-webkit-search-cancel-button{-webkit-appearance:none;-webkit-transition:background-color 0.2s ease;transition:background-color 0.2s ease;height:1.25rem;width:1.25rem;border-radius:50%;margin-right:-0.25rem;cursor:pointer;background-color:rgb(var(--contrast-800));background-repeat:no-repeat;background-position:center;background-size:0.75rem;background-image:url(\"data:image/svg+xml; utf8, <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><defs/><path fill='rgb(255,255,255)' d='M7.219 5.781L5.78 7.22 14.563 16 5.78 24.781 7.22 26.22 16 17.437l8.781 8.782 1.438-1.438L17.437 16l8.782-8.781L24.78 5.78 16 14.563z'/></svg>\")}input::-webkit-search-cancel-button:hover{background-color:rgb(var(--contrast-1000))}";

const Search = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    componentDidLoad() {
        this.host.shadowRoot.querySelector('input').focus();
    }
    render() {
        return (h("div", { class: "search-box" }, h("input", { type: "search", autoFocus: true, placeholder: "Search" }), h("ul", { class: "result" })));
    }
    get host() { return getElement(this); }
};
Search.style = searchCss;

const routeCss = "stencil-route.inactive{display:none}";

const Route = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.group = null;
        this.match = null;
        this.componentProps = {};
        this.exact = false;
        this.scrollOnNextRender = false;
        this.previousMatch = null;
    }
    // Identify if the current route is a match.
    computeMatch(newLocation) {
        const isGrouped = this.group != null || (this.el.parentElement != null && this.el.parentElement.tagName.toLowerCase() === 'stencil-route-switch');
        if (!newLocation || isGrouped) {
            return;
        }
        this.previousMatch = this.match;
        return this.match = matchPath(newLocation.pathname, {
            path: this.url,
            exact: this.exact,
            strict: true
        });
    }
    async loadCompleted() {
        let routeViewOptions = {};
        if (this.history && this.history.location.hash) {
            routeViewOptions = {
                scrollToId: this.history.location.hash.substr(1)
            };
        }
        else if (this.scrollTopOffset) {
            routeViewOptions = {
                scrollTopOffset: this.scrollTopOffset
            };
        }
        // After all children have completed then tell switch
        // the provided callback will get executed after this route is in view
        if (typeof this.componentUpdated === 'function') {
            this.componentUpdated(routeViewOptions);
            // If this is an independent route and it matches then routes have updated.
            // If the only change to location is a hash change then do not scroll.
        }
        else if (this.match && !matchesAreEqual(this.match, this.previousMatch) && this.routeViewsUpdated) {
            this.routeViewsUpdated(routeViewOptions);
        }
    }
    async componentDidUpdate() {
        await this.loadCompleted();
    }
    async componentDidLoad() {
        await this.loadCompleted();
    }
    render() {
        // If there is no activeRouter then do not render
        // Check if this route is in the matching URL (for example, a parent route)
        if (!this.match || !this.history) {
            return null;
        }
        // component props defined in route
        // the history api
        // current match data including params
        const childProps = Object.assign({}, this.componentProps, { history: this.history, match: this.match });
        // If there is a routerRender defined then use
        // that and pass the component and component props with it.
        if (this.routeRender) {
            return this.routeRender(Object.assign({}, childProps, { component: this.component }));
        }
        if (this.component) {
            const ChildComponent = this.component;
            return (h(ChildComponent, Object.assign({}, childProps)));
        }
    }
    get el() { return getElement(this); }
    static get watchers() { return {
        "location": ["computeMatch"]
    }; }
};
ActiveRouter.injectProps(Route, [
    'location',
    'history',
    'historyType',
    'routeViewsUpdated'
]);
Route.style = routeCss;

const getUniqueId = () => {
    return ((Math.random() * 10e16).toString().match(/.{4}/g) || []).join('-');
};
const getMatch = (pathname, url, exact) => {
    return matchPath(pathname, {
        path: url,
        exact: exact,
        strict: true
    });
};
const isHTMLStencilRouteElement = (elm) => {
    return elm.tagName === 'STENCIL-ROUTE';
};
const RouteSwitch = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.group = getUniqueId();
        this.subscribers = [];
        this.queue = getContext(this, "queue");
    }
    componentWillLoad() {
        if (this.location != null) {
            this.regenerateSubscribers(this.location);
        }
    }
    async regenerateSubscribers(newLocation) {
        if (newLocation == null) {
            return;
        }
        let newActiveIndex = -1;
        this.subscribers = Array.prototype.slice.call(this.el.children)
            .filter(isHTMLStencilRouteElement)
            .map((childElement, index) => {
            const match = getMatch(newLocation.pathname, childElement.url, childElement.exact);
            if (match && newActiveIndex === -1) {
                newActiveIndex = index;
            }
            return {
                el: childElement,
                match: match
            };
        });
        if (newActiveIndex === -1) {
            return;
        }
        // Check if this actually changes which child is active
        // then just pass the new match down if the active route isn't changing.
        if (this.activeIndex === newActiveIndex) {
            this.subscribers[newActiveIndex].el.match = this.subscribers[newActiveIndex].match;
            return;
        }
        this.activeIndex = newActiveIndex;
        // Set all props on the new active route then wait until it says that it
        // is completed
        const activeChild = this.subscribers[this.activeIndex];
        if (this.scrollTopOffset) {
            activeChild.el.scrollTopOffset = this.scrollTopOffset;
        }
        activeChild.el.group = this.group;
        activeChild.el.match = activeChild.match;
        activeChild.el.componentUpdated = (routeViewUpdatedOptions) => {
            // After the new active route has completed then update visibility of routes
            this.queue.write(() => {
                this.subscribers.forEach((child, index) => {
                    child.el.componentUpdated = undefined;
                    if (index === this.activeIndex) {
                        return child.el.style.display = '';
                    }
                    if (this.scrollTopOffset) {
                        child.el.scrollTopOffset = this.scrollTopOffset;
                    }
                    child.el.group = this.group;
                    child.el.match = null;
                    child.el.style.display = 'none';
                });
            });
            if (this.routeViewsUpdated) {
                this.routeViewsUpdated(Object.assign({ scrollTopOffset: this.scrollTopOffset }, routeViewUpdatedOptions));
            }
        };
    }
    render() {
        return (h("slot", null));
    }
    get el() { return getElement(this); }
    static get watchers() { return {
        "location": ["regenerateSubscribers"]
    }; }
};
ActiveRouter.injectProps(RouteSwitch, [
    'location',
    'routeViewsUpdated'
]);

const warning = (value, ...args) => {
    if (!value) {
        console.warn(...args);
    }
};

// Adapted from the https://github.com/ReactTraining/history and converted to TypeScript
const createTransitionManager = () => {
    let prompt;
    let listeners = [];
    const setPrompt = (nextPrompt) => {
        warning(prompt == null, 'A history supports only one prompt at a time');
        prompt = nextPrompt;
        return () => {
            if (prompt === nextPrompt) {
                prompt = null;
            }
        };
    };
    const confirmTransitionTo = (location, action, getUserConfirmation, callback) => {
        // TODO: If another transition starts while we're still confirming
        // the previous one, we may end up in a weird state. Figure out the
        // best way to handle this.
        if (prompt != null) {
            const result = typeof prompt === 'function' ? prompt(location, action) : prompt;
            if (typeof result === 'string') {
                if (typeof getUserConfirmation === 'function') {
                    getUserConfirmation(result, callback);
                }
                else {
                    warning(false, 'A history needs a getUserConfirmation function in order to use a prompt message');
                    callback(true);
                }
            }
            else {
                // Return false from a transition hook to cancel the transition.
                callback(result !== false);
            }
        }
        else {
            callback(true);
        }
    };
    const appendListener = (fn) => {
        let isActive = true;
        const listener = (...args) => {
            if (isActive) {
                fn(...args);
            }
        };
        listeners.push(listener);
        return () => {
            isActive = false;
            listeners = listeners.filter(item => item !== listener);
        };
    };
    const notifyListeners = (...args) => {
        listeners.forEach(listener => listener(...args));
    };
    return {
        setPrompt,
        confirmTransitionTo,
        appendListener,
        notifyListeners
    };
};

const createScrollHistory = (win, applicationScrollKey = 'scrollPositions') => {
    let scrollPositions = new Map();
    const set = (key, value) => {
        scrollPositions.set(key, value);
        if (storageAvailable(win, 'sessionStorage')) {
            const arrayData = [];
            scrollPositions.forEach((value, key) => {
                arrayData.push([key, value]);
            });
            win.sessionStorage.setItem('scrollPositions', JSON.stringify(arrayData));
        }
    };
    const get = (key) => {
        return scrollPositions.get(key);
    };
    const has = (key) => {
        return scrollPositions.has(key);
    };
    const capture = (key) => {
        set(key, [win.scrollX, win.scrollY]);
    };
    if (storageAvailable(win, 'sessionStorage')) {
        const scrollData = win.sessionStorage.getItem(applicationScrollKey);
        scrollPositions = scrollData ?
            new Map(JSON.parse(scrollData)) :
            scrollPositions;
    }
    if ('scrollRestoration' in win.history) {
        history.scrollRestoration = 'manual';
    }
    return {
        set,
        get,
        has,
        capture
    };
};

// Adapted from the https://github.com/ReactTraining/history and converted to TypeScript
const PopStateEvent = 'popstate';
const HashChangeEvent = 'hashchange';
/**
 * Creates a history object that uses the HTML5 history API including
 * pushState, replaceState, and the popstate event.
 */
const createBrowserHistory = (win, props = {}) => {
    let forceNextPop = false;
    const globalHistory = win.history;
    const globalLocation = win.location;
    const globalNavigator = win.navigator;
    const canUseHistory = supportsHistory(win);
    const needsHashChangeListener = !supportsPopStateOnHashChange(globalNavigator);
    const scrollHistory = createScrollHistory(win);
    const forceRefresh = (props.forceRefresh != null) ? props.forceRefresh : false;
    const getUserConfirmation = (props.getUserConfirmation != null) ? props.getUserConfirmation : getConfirmation;
    const keyLength = (props.keyLength != null) ? props.keyLength : 6;
    const basename = props.basename ? stripTrailingSlash(addLeadingSlash(props.basename)) : '';
    const getHistoryState = () => {
        try {
            return win.history.state || {};
        }
        catch (e) {
            // IE 11 sometimes throws when accessing window.history.state
            // See https://github.com/ReactTraining/history/pull/289
            return {};
        }
    };
    const getDOMLocation = (historyState) => {
        historyState = historyState || {};
        const { key, state } = historyState;
        const { pathname, search, hash } = globalLocation;
        let path = pathname + search + hash;
        warning((!basename || hasBasename(path, basename)), 'You are attempting to use a basename on a page whose URL path does not begin ' +
            'with the basename. Expected path "' + path + '" to begin with "' + basename + '".');
        if (basename) {
            path = stripBasename(path, basename);
        }
        return createLocation(path, state, key || createKey(keyLength));
    };
    const transitionManager = createTransitionManager();
    const setState = (nextState) => {
        // Capture location for the view before changing history.
        scrollHistory.capture(history.location.key);
        Object.assign(history, nextState);
        // Set scroll position based on its previous storage value
        history.location.scrollPosition = scrollHistory.get(history.location.key);
        history.length = globalHistory.length;
        transitionManager.notifyListeners(history.location, history.action);
    };
    const handlePopState = (event) => {
        // Ignore extraneous popstate events in WebKit.
        if (!isExtraneousPopstateEvent(globalNavigator, event)) {
            handlePop(getDOMLocation(event.state));
        }
    };
    const handleHashChange = () => {
        handlePop(getDOMLocation(getHistoryState()));
    };
    const handlePop = (location) => {
        if (forceNextPop) {
            forceNextPop = false;
            setState();
        }
        else {
            const action = 'POP';
            transitionManager.confirmTransitionTo(location, action, getUserConfirmation, (ok) => {
                if (ok) {
                    setState({ action, location });
                }
                else {
                    revertPop(location);
                }
            });
        }
    };
    const revertPop = (fromLocation) => {
        const toLocation = history.location;
        // TODO: We could probably make this more reliable by
        // keeping a list of keys we've seen in sessionStorage.
        // Instead, we just default to 0 for keys we don't know.
        let toIndex = allKeys.indexOf(toLocation.key);
        let fromIndex = allKeys.indexOf(fromLocation.key);
        if (toIndex === -1) {
            toIndex = 0;
        }
        if (fromIndex === -1) {
            fromIndex = 0;
        }
        const delta = toIndex - fromIndex;
        if (delta) {
            forceNextPop = true;
            go(delta);
        }
    };
    const initialLocation = getDOMLocation(getHistoryState());
    let allKeys = [initialLocation.key];
    let listenerCount = 0;
    let isBlocked = false;
    // Public interface
    const createHref = (location) => {
        return basename + createPath(location);
    };
    const push = (path, state) => {
        warning(!(typeof path === 'object' && path.state !== undefined && state !== undefined), 'You should avoid providing a 2nd state argument to push when the 1st ' +
            'argument is a location-like object that already has state; it is ignored');
        const action = 'PUSH';
        const location = createLocation(path, state, createKey(keyLength), history.location);
        transitionManager.confirmTransitionTo(location, action, getUserConfirmation, (ok) => {
            if (!ok) {
                return;
            }
            const href = createHref(location);
            const { key, state } = location;
            if (canUseHistory) {
                globalHistory.pushState({ key, state }, '', href);
                if (forceRefresh) {
                    globalLocation.href = href;
                }
                else {
                    const prevIndex = allKeys.indexOf(history.location.key);
                    const nextKeys = allKeys.slice(0, prevIndex === -1 ? 0 : prevIndex + 1);
                    nextKeys.push(location.key);
                    allKeys = nextKeys;
                    setState({ action, location });
                }
            }
            else {
                warning(state === undefined, 'Browser history cannot push state in browsers that do not support HTML5 history');
                globalLocation.href = href;
            }
        });
    };
    const replace = (path, state) => {
        warning(!(typeof path === 'object' && path.state !== undefined && state !== undefined), 'You should avoid providing a 2nd state argument to replace when the 1st ' +
            'argument is a location-like object that already has state; it is ignored');
        const action = 'REPLACE';
        const location = createLocation(path, state, createKey(keyLength), history.location);
        transitionManager.confirmTransitionTo(location, action, getUserConfirmation, (ok) => {
            if (!ok) {
                return;
            }
            const href = createHref(location);
            const { key, state } = location;
            if (canUseHistory) {
                globalHistory.replaceState({ key, state }, '', href);
                if (forceRefresh) {
                    globalLocation.replace(href);
                }
                else {
                    const prevIndex = allKeys.indexOf(history.location.key);
                    if (prevIndex !== -1) {
                        allKeys[prevIndex] = location.key;
                    }
                    setState({ action, location });
                }
            }
            else {
                warning(state === undefined, 'Browser history cannot replace state in browsers that do not support HTML5 history');
                globalLocation.replace(href);
            }
        });
    };
    const go = (n) => {
        globalHistory.go(n);
    };
    const goBack = () => go(-1);
    const goForward = () => go(1);
    const checkDOMListeners = (delta) => {
        listenerCount += delta;
        if (listenerCount === 1) {
            win.addEventListener(PopStateEvent, handlePopState);
            if (needsHashChangeListener) {
                win.addEventListener(HashChangeEvent, handleHashChange);
            }
        }
        else if (listenerCount === 0) {
            win.removeEventListener(PopStateEvent, handlePopState);
            if (needsHashChangeListener) {
                win.removeEventListener(HashChangeEvent, handleHashChange);
            }
        }
    };
    const block = (prompt = '') => {
        const unblock = transitionManager.setPrompt(prompt);
        if (!isBlocked) {
            checkDOMListeners(1);
            isBlocked = true;
        }
        return () => {
            if (isBlocked) {
                isBlocked = false;
                checkDOMListeners(-1);
            }
            return unblock();
        };
    };
    const listen = (listener) => {
        const unlisten = transitionManager.appendListener(listener);
        checkDOMListeners(1);
        return () => {
            checkDOMListeners(-1);
            unlisten();
        };
    };
    const history = {
        length: globalHistory.length,
        action: 'POP',
        location: initialLocation,
        createHref,
        push,
        replace,
        go,
        goBack,
        goForward,
        block,
        listen,
        win: win
    };
    return history;
};

// Adapted from the https://github.com/ReactTraining/history and converted to TypeScript
const HashChangeEvent$1 = 'hashchange';
const HashPathCoders = {
    hashbang: {
        encodePath: (path) => path.charAt(0) === '!' ? path : '!/' + stripLeadingSlash(path),
        decodePath: (path) => path.charAt(0) === '!' ? path.substr(1) : path
    },
    noslash: {
        encodePath: stripLeadingSlash,
        decodePath: addLeadingSlash
    },
    slash: {
        encodePath: addLeadingSlash,
        decodePath: addLeadingSlash
    }
};
const createHashHistory = (win, props = {}) => {
    let forceNextPop = false;
    let ignorePath = null;
    let listenerCount = 0;
    let isBlocked = false;
    const globalLocation = win.location;
    const globalHistory = win.history;
    const canGoWithoutReload = supportsGoWithoutReloadUsingHash(win.navigator);
    const keyLength = (props.keyLength != null) ? props.keyLength : 6;
    const { getUserConfirmation = getConfirmation, hashType = 'slash' } = props;
    const basename = props.basename ? stripTrailingSlash(addLeadingSlash(props.basename)) : '';
    const { encodePath, decodePath } = HashPathCoders[hashType];
    const getHashPath = () => {
        // We can't use window.location.hash here because it's not
        // consistent across browsers - Firefox will pre-decode it!
        const href = globalLocation.href;
        const hashIndex = href.indexOf('#');
        return hashIndex === -1 ? '' : href.substring(hashIndex + 1);
    };
    const pushHashPath = (path) => (globalLocation.hash = path);
    const replaceHashPath = (path) => {
        const hashIndex = globalLocation.href.indexOf('#');
        globalLocation.replace(globalLocation.href.slice(0, hashIndex >= 0 ? hashIndex : 0) + '#' + path);
    };
    const getDOMLocation = () => {
        let path = decodePath(getHashPath());
        warning((!basename || hasBasename(path, basename)), 'You are attempting to use a basename on a page whose URL path does not begin ' +
            'with the basename. Expected path "' + path + '" to begin with "' + basename + '".');
        if (basename) {
            path = stripBasename(path, basename);
        }
        return createLocation(path, undefined, createKey(keyLength));
    };
    const transitionManager = createTransitionManager();
    const setState = (nextState) => {
        Object.assign(history, nextState);
        history.length = globalHistory.length;
        transitionManager.notifyListeners(history.location, history.action);
    };
    const handleHashChange = () => {
        const path = getHashPath();
        const encodedPath = encodePath(path);
        if (path !== encodedPath) {
            // Ensure we always have a properly-encoded hash.
            replaceHashPath(encodedPath);
        }
        else {
            const location = getDOMLocation();
            const prevLocation = history.location;
            if (!forceNextPop && locationsAreEqual(prevLocation, location)) {
                return; // A hashchange doesn't always == location change.
            }
            if (ignorePath === createPath(location)) {
                return; // Ignore this change; we already setState in push/replace.
            }
            ignorePath = null;
            handlePop(location);
        }
    };
    const handlePop = (location) => {
        if (forceNextPop) {
            forceNextPop = false;
            setState();
        }
        else {
            const action = 'POP';
            transitionManager.confirmTransitionTo(location, action, getUserConfirmation, (ok) => {
                if (ok) {
                    setState({ action, location });
                }
                else {
                    revertPop(location);
                }
            });
        }
    };
    const revertPop = (fromLocation) => {
        const toLocation = history.location;
        // TODO: We could probably make this more reliable by
        // keeping a list of paths we've seen in sessionStorage.
        // Instead, we just default to 0 for paths we don't know.
        let toIndex = allPaths.lastIndexOf(createPath(toLocation));
        let fromIndex = allPaths.lastIndexOf(createPath(fromLocation));
        if (toIndex === -1) {
            toIndex = 0;
        }
        if (fromIndex === -1) {
            fromIndex = 0;
        }
        const delta = toIndex - fromIndex;
        if (delta) {
            forceNextPop = true;
            go(delta);
        }
    };
    // Ensure the hash is encoded properly before doing anything else.
    const path = getHashPath();
    const encodedPath = encodePath(path);
    if (path !== encodedPath) {
        replaceHashPath(encodedPath);
    }
    const initialLocation = getDOMLocation();
    let allPaths = [createPath(initialLocation)];
    // Public interface
    const createHref = (location) => ('#' + encodePath(basename + createPath(location)));
    const push = (path, state) => {
        warning(state === undefined, 'Hash history cannot push state; it is ignored');
        const action = 'PUSH';
        const location = createLocation(path, undefined, createKey(keyLength), history.location);
        transitionManager.confirmTransitionTo(location, action, getUserConfirmation, (ok) => {
            if (!ok) {
                return;
            }
            const path = createPath(location);
            const encodedPath = encodePath(basename + path);
            const hashChanged = getHashPath() !== encodedPath;
            if (hashChanged) {
                // We cannot tell if a hashchange was caused by a PUSH, so we'd
                // rather setState here and ignore the hashchange. The caveat here
                // is that other hash histories in the page will consider it a POP.
                ignorePath = path;
                pushHashPath(encodedPath);
                const prevIndex = allPaths.lastIndexOf(createPath(history.location));
                const nextPaths = allPaths.slice(0, prevIndex === -1 ? 0 : prevIndex + 1);
                nextPaths.push(path);
                allPaths = nextPaths;
                setState({ action, location });
            }
            else {
                warning(false, 'Hash history cannot PUSH the same path; a new entry will not be added to the history stack');
                setState();
            }
        });
    };
    const replace = (path, state) => {
        warning(state === undefined, 'Hash history cannot replace state; it is ignored');
        const action = 'REPLACE';
        const location = createLocation(path, undefined, createKey(keyLength), history.location);
        transitionManager.confirmTransitionTo(location, action, getUserConfirmation, (ok) => {
            if (!ok) {
                return;
            }
            const path = createPath(location);
            const encodedPath = encodePath(basename + path);
            const hashChanged = getHashPath() !== encodedPath;
            if (hashChanged) {
                // We cannot tell if a hashchange was caused by a REPLACE, so we'd
                // rather setState here and ignore the hashchange. The caveat here
                // is that other hash histories in the page will consider it a POP.
                ignorePath = path;
                replaceHashPath(encodedPath);
            }
            const prevIndex = allPaths.indexOf(createPath(history.location));
            if (prevIndex !== -1) {
                allPaths[prevIndex] = path;
            }
            setState({ action, location });
        });
    };
    const go = (n) => {
        warning(canGoWithoutReload, 'Hash history go(n) causes a full page reload in this browser');
        globalHistory.go(n);
    };
    const goBack = () => go(-1);
    const goForward = () => go(1);
    const checkDOMListeners = (win, delta) => {
        listenerCount += delta;
        if (listenerCount === 1) {
            win.addEventListener(HashChangeEvent$1, handleHashChange);
        }
        else if (listenerCount === 0) {
            win.removeEventListener(HashChangeEvent$1, handleHashChange);
        }
    };
    const block = (prompt = '') => {
        const unblock = transitionManager.setPrompt(prompt);
        if (!isBlocked) {
            checkDOMListeners(win, 1);
            isBlocked = true;
        }
        return () => {
            if (isBlocked) {
                isBlocked = false;
                checkDOMListeners(win, -1);
            }
            return unblock();
        };
    };
    const listen = (listener) => {
        const unlisten = transitionManager.appendListener(listener);
        checkDOMListeners(win, 1);
        return () => {
            checkDOMListeners(win, -1);
            unlisten();
        };
    };
    const history = {
        length: globalHistory.length,
        action: 'POP',
        location: initialLocation,
        createHref,
        push,
        replace,
        go,
        goBack,
        goForward,
        block,
        listen,
        win: win
    };
    return history;
};

const getLocation = (location, root) => {
    // Remove the root URL if found at beginning of string
    const pathname = location.pathname.indexOf(root) == 0 ?
        '/' + location.pathname.slice(root.length) :
        location.pathname;
    return Object.assign({}, location, { pathname });
};
const HISTORIES = {
    'browser': createBrowserHistory,
    'hash': createHashHistory
};
const Router = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.root = '/';
        this.historyType = 'browser';
        // A suffix to append to the page title whenever
        // it's updated through RouteTitle
        this.titleSuffix = '';
        this.routeViewsUpdated = (options = {}) => {
            if (this.history && options.scrollToId && this.historyType === 'browser') {
                const elm = this.history.win.document.getElementById(options.scrollToId);
                if (elm) {
                    return elm.scrollIntoView();
                }
            }
            this.scrollTo(options.scrollTopOffset || this.scrollTopOffset);
        };
        this.isServer = getContext(this, "isServer");
        this.queue = getContext(this, "queue");
    }
    componentWillLoad() {
        this.history = HISTORIES[this.historyType](this.el.ownerDocument.defaultView);
        this.history.listen((location) => {
            location = getLocation(location, this.root);
            this.location = location;
        });
        this.location = getLocation(this.history.location, this.root);
    }
    scrollTo(scrollToLocation) {
        const history = this.history;
        if (scrollToLocation == null || this.isServer || !history) {
            return;
        }
        if (history.action === 'POP' && Array.isArray(history.location.scrollPosition)) {
            return this.queue.write(() => {
                if (history && history.location && Array.isArray(history.location.scrollPosition)) {
                    history.win.scrollTo(history.location.scrollPosition[0], history.location.scrollPosition[1]);
                }
            });
        }
        // okay, the frame has passed. Go ahead and render now
        return this.queue.write(() => {
            history.win.scrollTo(0, scrollToLocation);
        });
    }
    render() {
        if (!this.location || !this.history) {
            return;
        }
        const state = {
            historyType: this.historyType,
            location: this.location,
            titleSuffix: this.titleSuffix,
            root: this.root,
            history: this.history,
            routeViewsUpdated: this.routeViewsUpdated
        };
        return (h(ActiveRouter.Provider, { state: state }, h("slot", null)));
    }
    get el() { return getElement(this); }
};

export { App as kompendium_app, Navigation as kompendium_navigation, Search as kompendium_search, Route as stencil_route, RouteSwitch as stencil_route_switch, Router as stencil_router };
