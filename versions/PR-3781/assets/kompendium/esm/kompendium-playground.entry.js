import { r as registerInstance, h, H as Host } from './index-9UrzenzW.js';
import { T as THEME_EVENT_NAME } from './types-BIPLEi1G.js';

const playgroundCss = ":root{--width-nav-panel:16rem}:host{display:block}.tab-panel{height:100%;display:flex;flex-direction:column}.tab-bar{display:flex;padding:0.1875rem 1rem 0 1rem;overflow-y:auto}.tab-bar .tab span{overflow:hidden;white-space:nowrap;text-overflow:ellipsis;display:inline-block;width:100%;padding:0.125rem 0}.tab-bar .tab{transition:background-color 0.2s ease;cursor:pointer;position:relative;display:inline-block;padding:0.5rem 1rem;text-align:center;line-height:0.9375rem;color:rgb(var(--kompendium-contrast-1000));font-size:1rem;border-radius:0.5rem 0.5rem 0 0;margin:0 0.125rem;min-width:3.75rem}.tab-bar .tab:before,.tab-bar .tab:after{transition:background-color 0.2s ease;content:\"\";display:block;width:0.625rem;height:0.625rem;position:absolute;bottom:0;-webkit-mask-image:url(\"data:image/svg+xml; utf8, <svg xmlns='http://www.w3.org/2000/svg' fill-rule='evenodd' stroke-linejoin='round' stroke-miterlimit='2' clip-rule='evenodd' viewBox='0 0 50 50'><defs/><path d='M0 0c0 27.594 22.406 50 50 50H0V0z'/></svg>\");mask-image:url(\"data:image/svg+xml; utf8, <svg xmlns='http://www.w3.org/2000/svg' fill-rule='evenodd' stroke-linejoin='round' stroke-miterlimit='2' clip-rule='evenodd' viewBox='0 0 50 50'><defs/><path d='M0 0c0 27.594 22.406 50 50 50H0V0z'/></svg>\");background:transparent}.tab-bar .tab:before{left:-0.625rem;transform:rotateY(180deg)}.tab-bar .tab:after{right:-0.625rem}.tab-bar .tab:hover{background-color:rgb(var(--kompendium-contrast-100))}.tab-bar .tab:hover:before,.tab-bar .tab:hover:after{background-color:rgb(var(--kompendium-contrast-100))}.tab-bar .tab.active{z-index:1;color:rgb(var(--kompendium-contrast-1100));background:rgb(var(--kompendium-color-code-background))}.tab-bar .tab.active:before,.tab-bar .tab.active:after{background:rgb(var(--kompendium-color-code-background))}.tab-items{display:flex;max-height:31.25rem}.tab-items .tab-item{width:100%;display:none}.tab-items .tab-item.active{display:flex}kompendium-code{display:block}kompendium-code:before,kompendium-code:after{content:\"\";z-index:1;display:block;position:absolute;left:0;right:0;border-radius:0.5625rem;pointer-events:none}kompendium-code:before{top:2.4375rem;height:1.5rem;background-image:linear-gradient(rgb(var(--kompendium-color-code-background)), rgba(var(--kompendium-color-code-background), 0))}kompendium-code:after{bottom:0;height:2rem;background-image:linear-gradient(rgba(var(--kompendium-color-code-background), 0), rgb(var(--kompendium-color-code-background)))}section.example{transition:border-color 0.3s ease 0.05s;padding-bottom:2.5rem;margin-bottom:2.5rem;border-bottom:1px solid rgb(var(--kompendium-contrast-500))}section.example .result,section.example .code{box-sizing:border-box;display:inline-block;vertical-align:top;width:50%}section.example .result{padding-right:2.5rem}section.example .result kompendium-markdown{margin-bottom:2rem}section.example .code{position:sticky;top:0}@media (max-width: 1000px){section.example .result,section.example .code{width:100%;padding-right:0;margin-bottom:5rem}section.example .code{position:relative;margin-bottom:2.5rem}}.show-case_description{padding:0.75rem}.show-case_component{font-family:var(--kompendium-example-font-family, inherit);font-size:var(--kompendium-example-font-size, inherit);line-height:var(--kompendium-example-line-height, inherit);color:var(--kompendium-example-color, inherit);padding:1.25rem;border-radius:0.875rem;background-color:rgb(var(--kompendium-contrast-100));border:1px solid rgb(var(--kompendium-contrast-300));box-shadow:var(--shadow-showcase)}.debug{display:flex;justify-content:flex-end}.debug a.debug-link{transition:background-color 0.2s ease, box-shadow 0.2s ease, transform 0.1s ease-out}.debug a.debug-link:hover{box-shadow:var(--kompendium-button-shadow-hovered)}.debug a.debug-link:active{box-shadow:var(--kompendium-button-shadow-pressed);transform:translate3d(0, 0.08rem, 0)}.debug a.debug-link:focus{outline:none}.debug a.debug-link:focus-visible{outline:none;box-shadow:var(--kompendium-shadow-depth-8-focused)}.debug a.debug-link{transition:background-color 0.2s ease, box-shadow 0.2s ease, transform 0.1s ease-out, opacity 0.2s ease;width:1.75rem;height:1.75rem;font-size:0;margin:-3.25rem -1rem 0 0;border-radius:50%;color:rgb(var(--kompendium-contrast-1200));opacity:0.6}.debug a.debug-link:hover{opacity:1;background-color:rgb(var(--kompendium-contrast-100))}";

const Playground = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        /**
         * Factory for creating props for example components
         * @returns {Record<string, unknown>} props
         */
        this.propsFactory = () => ({});
        this.activateTab = (id) => () => {
            this.activeTab = id;
        };
        this.themeListener = (event) => {
            this.theme = event.detail;
        };
        this.renderTab = this.renderTab.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }
    connectedCallback() {
        this.theme = document.querySelector('html').dataset.theme;
        document.addEventListener(THEME_EVENT_NAME, this.themeListener);
    }
    disconnectedCallback() {
        document.removeEventListener(THEME_EVENT_NAME, this.themeListener);
    }
    render() {
        if (!this.component) {
            return;
        }
        const sources = this.component.sources || [];
        return (h(Host, { "data-theme": this.theme }, h("section", { class: "example" }, h("div", { class: "result" }, this.renderResult()), h("aside", { class: "code" }, h("nav", { class: "tab-bar" }, this.renderTabs(sources)), h("div", { class: "tab-items" }, this.renderItems(sources))))));
    }
    renderTabs(sources) {
        return sources.map(this.renderTab);
    }
    renderTab(source, index) {
        const classList = {
            tab: true,
            active: this.isTabActive(source, index),
        };
        return (h("a", { class: classList, onClick: this.activateTab(source.filename) }, h("span", null, source.filename)));
    }
    renderItems(sources) {
        return sources.map(this.renderItem);
    }
    renderResult() {
        const ExampleComponent = this.component.tag;
        const text = '##### ' + this.component.docs;
        const factory = this.propsFactory;
        const props = {
            schema: this.schema,
            ...factory(ExampleComponent),
        };
        return (h("div", { class: "show-case" }, h("div", { class: "show-case_description" }, h("kompendium-markdown", { text: text })), h("div", { class: "show-case_component" }, this.renderDebugButton(this.component.tag), h(ExampleComponent, { ...props }))));
    }
    renderItem(source, index) {
        const classList = {
            'tab-item': true,
            active: this.isTabActive(source, index),
        };
        const code = source.source.replace(/\/\*\*.+?\*\//gms, '');
        const key = [this.component.tag, source.filename].join('/');
        return (h("kompendium-code", { class: classList, language: source.type, key: key }, code));
    }
    renderDebugButton(tag) {
        if (!['localhost', '127.0.0.1'].includes(location.hostname)) {
            return;
        }
        const href = `#/debug/${tag}`;
        return (h("div", { class: "debug" }, h("a", { class: "debug-link", href: href, title: "Debug" }, h("svg", { viewBox: "0 0 400 400", xmlns: "http://www.w3.org/2000/svg", "fill-rule": "evenodd", "clip-rule": "evenodd", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-miterlimit": "1.5" }, h("path", { fill: "none", d: "M0 0h400v400H0z" }), h("path", { d: "M194.97 254.84h77.555", fill: "none", stroke: "currentColor", "stroke-opacity": ".6", "stroke-width": "20" }), h("path", { d: "M127.474 145.16l54.84 54.84M182.315 200l-54.84 54.84", fill: "none", stroke: "currentColor", "stroke-width": "20" })))));
    }
    isTabActive(source, index) {
        let isActive = this.activeTab === source.filename;
        if (!isActive) {
            isActive = index === 0 && !this.activeTab;
        }
        return isActive;
    }
};
Playground.style = playgroundCss;

export { Playground as kompendium_playground };
//# sourceMappingURL=kompendium-playground.entry.js.map
