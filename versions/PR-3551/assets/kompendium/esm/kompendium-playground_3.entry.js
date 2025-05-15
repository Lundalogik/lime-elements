import { r as registerInstance, h, g as getAssetPath } from './index-2f7cd895.js';

const playgroundCss = ":host{display:block}.tab-panel{height:100%;display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column}.tab-bar{display:-ms-flexbox;display:flex;padding:0.5rem 1rem 0 1rem}.tab-bar .tab{-webkit-transition:background-color 0.2s ease;transition:background-color 0.2s ease;cursor:pointer;position:relative;display:inline-block;padding:0.5rem 1rem;text-align:center;line-height:0.9375rem;color:rgb(var(--contrast-1000));font-size:1rem;border-radius:0.5rem 0.5rem 0 0;margin:0 0.125rem}.tab-bar .tab:before,.tab-bar .tab:after{-webkit-transition:background-color 0.2s ease;transition:background-color 0.2s ease;content:\"\";display:block;width:0.625rem;height:0.625rem;position:absolute;bottom:0;-webkit-mask-image:url(\"data:image/svg+xml; utf8, <svg xmlns='http://www.w3.org/2000/svg' fill-rule='evenodd' stroke-linejoin='round' stroke-miterlimit='2' clip-rule='evenodd' viewBox='0 0 50 50'><defs/><path d='M0 0c0 27.594 22.406 50 50 50H0V0z'/></svg>\");mask-image:url(\"data:image/svg+xml; utf8, <svg xmlns='http://www.w3.org/2000/svg' fill-rule='evenodd' stroke-linejoin='round' stroke-miterlimit='2' clip-rule='evenodd' viewBox='0 0 50 50'><defs/><path d='M0 0c0 27.594 22.406 50 50 50H0V0z'/></svg>\");background:transparent}.tab-bar .tab:before{left:-0.625rem;-webkit-transform:rotateY(180deg);transform:rotateY(180deg)}.tab-bar .tab:after{right:-0.625rem}.tab-bar .tab:hover{background-color:rgb(var(--contrast-100))}.tab-bar .tab:hover:before,.tab-bar .tab:hover:after{background-color:rgb(var(--contrast-100))}@media (prefers-color-scheme: dark){.tab-bar .tab:hover:before,.tab-bar .tab:hover:after{background-color:rgb(var(--contrast-100))}}.tab-bar .tab.active{z-index:1;color:rgb(var(--contrast-700));background:rgb(var(--color-code-background))}.tab-bar .tab.active:before,.tab-bar .tab.active:after{background:rgb(var(--color-code-background))}.tab-items{display:-ms-flexbox;display:flex;max-height:31.25rem}.tab-items .tab-item{width:100%;display:none}.tab-items .tab-item.active{display:-ms-flexbox;display:flex}kompendium-code{display:block}kompendium-code:before,kompendium-code:after{content:\"\";z-index:1;display:block;position:absolute;left:0;right:0;border-radius:0.5625rem;pointer-events:none}kompendium-code:before{top:2.4375rem;height:1.5rem;background-image:-webkit-gradient(linear, left top, left bottom, from(rgb(var(--color-code-background))), to(rgba(var(--color-code-background), 0)));background-image:linear-gradient(rgb(var(--color-code-background)), rgba(var(--color-code-background), 0))}kompendium-code:after{bottom:0;height:2rem;background-image:-webkit-gradient(linear, left top, left bottom, from(rgba(var(--color-code-background), 0)), to(rgb(var(--color-code-background))));background-image:linear-gradient(rgba(var(--color-code-background), 0), rgb(var(--color-code-background)))}section.example .result,section.example .code{-webkit-box-sizing:border-box;box-sizing:border-box;display:inline-block;vertical-align:top;width:50%}section.example .result{padding-right:2.5rem}section.example .code{position:-webkit-sticky;position:sticky;top:0}@media (max-width: 1000px){section.example .result,section.example .code{width:100%}section.example .code{position:relative;margin-bottom:2.5rem}}";

const Playground = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        /**
         * The component to display
         */
        this.component = {};
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
        return (h("a", { class: classList, onClick: this.activateTab(source.filename) }, source.filename));
    }
    renderItems(sources) {
        return sources.map(this.renderItem);
    }
    renderResult() {
        const ExampleComponent = this.component.tag;
        const text = '##### ' + this.component.docs;
        return (h("div", null, h("kompendium-markdown", { text: text }), h(ExampleComponent, null)));
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

const proplistCss = "*,*::before,*::after{-webkit-box-sizing:border-box;box-sizing:border-box}ul[class],ol[class]{padding:0}body,h1,h2,h3,h4,p,ul[class],ol[class],li,figure,figcaption,blockquote,dl,dd{margin:0}ul[class],ol[class]{list-style:none}a:not([class]){-webkit-text-decoration-skip:ink;text-decoration-skip-ink:auto}img{max-width:100%;display:block}input,button,textarea,select{font:inherit}@media (prefers-reduced-motion: reduce){*{-webkit-animation-duration:0.01ms !important;animation-duration:0.01ms !important;-webkit-animation-iteration-count:1 !important;animation-iteration-count:1 !important;-webkit-transition-duration:0.01ms !important;transition-duration:0.01ms !important;scroll-behavior:auto !important}}p,a,li{font-size:0.875rem}h1,h2,h3,h4,h5,h6{margin-top:0;margin-bottom:1.25rem;font-weight:300}h1{font-size:2.5rem;line-height:1.2;letter-spacing:-0.0625rem}h2{font-size:2.25rem;line-height:1.25;letter-spacing:-0.0625rem}h3{font-size:1.875rem;line-height:1.3;letter-spacing:-0.0625rem}h4{font-size:1.5rem;line-height:1.35;letter-spacing:-0.05rem}h5{font-size:1.125rem;line-height:1.5;letter-spacing:-0.03125rem}h6{font-size:0, 9375rem;line-height:1.6;letter-spacing:0}@media (min-width: 550px){h1{font-size:3.125rem}h2{font-size:2.625rem}h3{font-size:2.5rem}h4{font-size:1.875rem}h5{font-size:1.5rem}h6{font-size:0.9375rem}}p{margin-top:0;margin-bottom:1rem}a{color:var(--kompendium-primary-color)}a:hover{color:var(--kompendium-primary-color)}ul{list-style:circle inside}ol{list-style:decimal inside}ol,ul{padding-left:0;margin-top:0}ul ul,ul ol,ol ol,ol ul{margin:0.9375rem 0 0.9375rem 1.875rem;font-size:90%}li{margin-bottom:0.625rem}th,td{padding:12px 15px;text-align:left;border-bottom:1px solid #e1e1e1}th:first-child,td:first-child{padding-left:0}th:last-child,td:last-child{padding-right:0}hr{margin-top:1.875rem;margin-bottom:2.1875rem;border-width:0;border-top:1px solid #e1e1e1}dt{font-weight:500}:host{display:block}pre,code{font-family:var(--kompendium-font-code);border-radius:0.25rem;font-size:0.6875rem}code{background:rgba(var(--contrast-1100), 0.05);border:1px solid rgba(var(--contrast-1100), 0.1);padding:0.125rem 0.3125rem;margin:0 0.125rem;white-space:nowrap;color:rgb(var(--contrast-1100))}pre>code{display:block;padding:0.625rem 0.6375rem;white-space:pre}.value--false code{color:rgb(var(--color-code-magenta));border-color:rgba(var(--color-code-magenta), 0.2);background-color:rgba(var(--color-code-magenta), 0.1)}.value--true code{color:rgb(var(--color-code-green-dark));border-color:rgba(var(--color-code-green-dark), 0.2);background-color:rgba(var(--color-code-green-dark), 0.1)}dl{display:grid;grid-template-columns:1fr 2fr;grid-template-rows:1fr;grid-column-gap:0px;grid-row-gap:0.5rem;margin-bottom:2rem}dl dt,dl dd{padding-bottom:0.2rem}";

const Proplist = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        return h("dl", null, this.items.map(this.renderProperty));
    }
    renderProperty(property) {
        const { key, value } = property;
        return [
            h("dt", null, key),
            h("dd", { class: `value--${value}` }, h("code", null, value)),
        ];
    }
};
Proplist.style = proplistCss;

const taglistCss = ":host{display:block}code{margin-bottom:0.5rem;margin-left:0.5rem}img{width:1rem;-webkit-filter:invert(0.5) sepia(1) hue-rotate(185deg) saturate(5);filter:invert(0.5) sepia(1) hue-rotate(185deg) saturate(5);vertical-align:middle}.tag--deprecated img{-webkit-filter:invert(0.35) sepia(1) hue-rotate(-60deg) saturate(5);filter:invert(0.35) sepia(1) hue-rotate(-60deg) saturate(5)}";

const Taglist = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        /**
         * Set to `true` if the list should be rendered in compact mode
         */
        this.compact = false;
    }
    render() {
        return this.tags.map(this.renderTag);
    }
    renderTag(tag) {
        const classList = {
            'tag-list': true,
        };
        const path = getAssetPath('../collection/assets/icons/bookmark-fill.svg');
        classList[`tag--${tag.name}`] = true;
        return (h("div", { class: classList }, h("img", { src: path }), h("code", null, "@", tag.name), h("kompendium-markdown", { text: tag.text })));
    }
};
Taglist.style = taglistCss;

export { Playground as kompendium_playground, Proplist as kompendium_proplist, Taglist as kompendium_taglist };
