import { r as registerInstance, h } from './index-fb5abbae.js';

const playgroundCss = ":root{--width-nav-panel:16rem}:host{display:block}.tab-panel{height:100%;display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column}.tab-bar{display:-ms-flexbox;display:flex;padding:0.1875rem 1rem 0 1rem;overflow-y:auto}.tab-bar .tab{-webkit-transition:background-color 0.2s ease;transition:background-color 0.2s ease;cursor:pointer;position:relative;display:inline-block;padding:0.5rem 1rem;text-align:center;line-height:0.9375rem;color:rgb(var(--contrast-1000));font-size:1rem;border-radius:0.5rem 0.5rem 0 0;margin:0 0.125rem;min-width:3.75rem}.tab-bar .tab span{overflow:hidden;white-space:nowrap;text-overflow:ellipsis;display:inline-block;width:100%;padding:0.125rem 0}.tab-bar .tab:before,.tab-bar .tab:after{-webkit-transition:background-color 0.2s ease;transition:background-color 0.2s ease;content:\"\";display:block;width:0.625rem;height:0.625rem;position:absolute;bottom:0;-webkit-mask-image:url(\"data:image/svg+xml; utf8, <svg xmlns='http://www.w3.org/2000/svg' fill-rule='evenodd' stroke-linejoin='round' stroke-miterlimit='2' clip-rule='evenodd' viewBox='0 0 50 50'><defs/><path d='M0 0c0 27.594 22.406 50 50 50H0V0z'/></svg>\");mask-image:url(\"data:image/svg+xml; utf8, <svg xmlns='http://www.w3.org/2000/svg' fill-rule='evenodd' stroke-linejoin='round' stroke-miterlimit='2' clip-rule='evenodd' viewBox='0 0 50 50'><defs/><path d='M0 0c0 27.594 22.406 50 50 50H0V0z'/></svg>\");background:transparent}.tab-bar .tab:before{left:-0.625rem;-webkit-transform:rotateY(180deg);transform:rotateY(180deg)}.tab-bar .tab:after{right:-0.625rem}.tab-bar .tab:hover{background-color:rgb(var(--contrast-100))}.tab-bar .tab:hover:before,.tab-bar .tab:hover:after{background-color:rgb(var(--contrast-100))}@media (prefers-color-scheme: dark){.tab-bar .tab:hover:before,.tab-bar .tab:hover:after{background-color:rgb(var(--contrast-100))}}.tab-bar .tab.active{z-index:1;color:rgb(var(--contrast-1100));background:rgb(var(--color-code-background))}.tab-bar .tab.active:before,.tab-bar .tab.active:after{background:rgb(var(--color-code-background))}.tab-items{display:-ms-flexbox;display:flex;max-height:31.25rem}.tab-items .tab-item{width:100%;display:none}.tab-items .tab-item.active{display:-ms-flexbox;display:flex}kompendium-code{display:block}kompendium-code:before,kompendium-code:after{content:\"\";z-index:1;display:block;position:absolute;left:0;right:0;border-radius:0.5625rem;pointer-events:none}kompendium-code:before{top:2.4375rem;height:1.5rem;background-image:-webkit-gradient(linear, left top, left bottom, from(rgb(var(--color-code-background))), to(rgba(var(--color-code-background), 0)));background-image:linear-gradient(rgb(var(--color-code-background)), rgba(var(--color-code-background), 0))}kompendium-code:after{bottom:0;height:2rem;background-image:-webkit-gradient(linear, left top, left bottom, from(rgba(var(--color-code-background), 0)), to(rgb(var(--color-code-background))));background-image:linear-gradient(rgba(var(--color-code-background), 0), rgb(var(--color-code-background)))}section.example{padding-bottom:2.5rem;margin-bottom:2.5rem;border-bottom:1px solid rgb(var(--contrast-500))}section.example .result,section.example .code{-webkit-box-sizing:border-box;box-sizing:border-box;display:inline-block;vertical-align:top;width:50%}section.example .result{padding-right:2.5rem}section.example .result kompendium-markdown{margin-bottom:2rem}section.example .code{position:-webkit-sticky;position:sticky;top:0}@media (max-width: 1400px){section.example .result,section.example .code{width:100%;padding-right:0;margin-bottom:5rem}section.example .code{position:relative;margin-bottom:2.5rem}}.show-case_description{padding:0.75rem}.show-case_component{padding:1.25rem;border-radius:0.875rem;background-color:rgb(var(--color-white));-webkit-box-shadow:var(--shadow-showcase);box-shadow:var(--shadow-showcase);border:1px solid rgb(var(--contrast-300))}";

const Playground = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.activateTab = (id) => () => {
            this.activeTab = id;
        };
        this.renderTab = this.renderTab.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }
    render() {
        if (!this.component) {
            return;
        }
        const sources = this.component['sources'] || [];
        return (h("section", { class: "example" }, h("div", { class: "result" }, this.renderResult()), h("aside", { class: "code" }, h("nav", { class: "tab-bar" }, this.renderTabs(sources)), h("div", { class: "tab-items" }, this.renderItems(sources)))));
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
        return (h("div", { class: "show-case" }, h("div", { class: "show-case_description" }, h("kompendium-markdown", { text: text })), h("div", { class: "show-case_component" }, h(ExampleComponent, null))));
    }
    renderItem(source, index) {
        const classList = {
            'tab-item': true,
            active: this.isTabActive(source, index),
        };
        const code = source.source.replace(/\/\*\*.+?\*\//gms, '');
        return (h("kompendium-code", { random: Math.random(), class: classList, language: source.type }, code));
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
