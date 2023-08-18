'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-d017bb3a.js');

const proplistCss = "*,*::before,*::after{box-sizing:border-box}ul[class],ol[class]{padding:0}body,h1,h2,h3,h4,p,ul[class],ol[class],li,figure,figcaption,blockquote,dl,dd{margin:0}ul[class],ol[class]{list-style:none}a:not([class]){text-decoration-skip-ink:auto}img{max-width:100%}input,button,textarea,select{font:inherit}@media (prefers-reduced-motion: reduce){*{animation-duration:0.01ms !important;animation-iteration-count:1 !important;transition-duration:0.01ms !important;scroll-behavior:auto !important}}p,a,li{font-size:0.9375rem}h1,h2,h3,h4,h5,h6{margin-bottom:0.5rem;font-weight:normal;font-weight:500}h1{font-size:2rem;line-height:2.25rem;margin-top:1.5rem;letter-spacing:-0.0625rem;font-weight:400}h2{font-size:1.625rem;line-height:1.25rem;margin-top:1.25rem;margin-bottom:1rem}h3{font-size:1.375rem;line-height:1.5rem;margin-top:1rem}h4{font-size:1.25rem;line-height:1.25rem;margin-top:1rem}h5{font-size:1.125rem;line-height:1.125rem;margin-top:0.75rem}h6{font-size:1rem;font-variant:all-small-caps;letter-spacing:0.0625rem}p,blockquote{margin-top:0;margin-bottom:0.5rem}p:only-child,blockquote:only-child{margin-bottom:0}a{transition:color 0.2s ease;color:rgb(var(--kompendium-color-blue-default));text-decoration:none;border-radius:0.125rem}a:hover{color:rgb(var(--kompendium-color-blue-light))}a:focus{outline:none}a:focus-visible{outline:none;box-shadow:var(--kompendium-shadow-depth-8-focused)}ul{list-style:none}ul li{position:relative;margin-left:0.75rem}ul li:before{content:\"\";position:absolute;left:-0.5rem;top:0.625rem;width:0.25rem;height:0.25rem;border-radius:50%;background-color:rgb(var(--kompendium-contrast-700));display:block}ol{list-style:decimal inside}ol,ul{padding-left:0;margin-top:0}ul ul,ul ol,ol ol,ol ul{margin:0.9375rem 0 0.9375rem 1.875rem;font-size:90%}li{margin-bottom:0.625rem}th,td{padding:0.75rem 1rem;text-align:left;border-bottom:1px solid rgb(var(--kompendium-contrast-600))}th:first-child,td:first-child{padding-left:0}th:last-child,td:last-child{padding-right:0}hr{margin:1.75rem 0 2rem 0;border-width:0;border-top:1px solid rgb(var(--kompendium-contrast-600))}kbd{font-family:var(--kompendium-font-code);font-size:0.875rem;font-weight:600;color:rgb(var(--kompendium-contrast-1000));background-color:rgb(var(--kompendium-contrast-200));white-space:pre;word-spacing:normal;word-break:normal;word-wrap:normal;line-height:normal;padding:0.125rem 0.5rem;margin:0 0.25rem;box-shadow:var(--kompendium-button-shadow-normal), 0 0.03125rem 0.21875rem 0 rgba(var(--kompendium-contrast-100), 0.5) inset;border-radius:0.25rem;border-style:solid;border-color:rgba(var(--kompendium-contrast-600), 0.8);border-width:0 1px 0.125rem 1px}@media (prefers-color-scheme: dark){kbd:not([data-theme=force-light]){background-color:rgb(var(--kompendium-contrast-200));color:rgb(var(--kompendium-contrast-1100));border-color:rgba(var(--kompendium-contrast-500), 0.8)}}kbd[data-theme=force-dark]{background-color:rgb(var(--kompendium-contrast-200));color:rgb(var(--kompendium-contrast-1100));border-color:rgba(var(--kompendium-contrast-500), 0.8)}@media (prefers-color-scheme: dark){:host(:not([data-theme=force-light])) kbd{background-color:rgb(var(--kompendium-contrast-200));color:rgb(var(--kompendium-contrast-1100));border-color:rgba(var(--kompendium-contrast-500), 0.8)}}:host([data-theme=force-dark]) kbd{background-color:rgb(var(--kompendium-contrast-200));color:rgb(var(--kompendium-contrast-1100));border-color:rgba(var(--kompendium-contrast-500), 0.8)}:host{display:block}pre,code{font-family:var(--kompendium-font-code);border-radius:0.25rem;font-size:0.6875rem}pre a,code a{font-size:0.6875rem}code{background:rgba(var(--kompendium-contrast-1100), 0.05);border:1px solid rgba(var(--kompendium-contrast-1100), 0.1);padding:0.125rem 0.3125rem;margin:0 0.125rem;white-space:pre-wrap;color:rgb(var(--kompendium-contrast-1100))}pre>code{display:block;padding:0.625rem 0.6375rem;white-space:pre-wrap}.value--false code{color:rgb(var(--kompendium-color-code-magenta));border-color:rgba(var(--kompendium-color-code-magenta), 0.2);background-color:rgba(var(--kompendium-color-code-magenta), 0.1)}.value--true code{color:rgb(var(--kompendium-color-code-green-dark));border-color:rgba(var(--kompendium-color-code-green-dark), 0.2);background-color:rgba(var(--kompendium-color-code-green-dark), 0.1)}dl{display:grid;grid-template-columns:1fr 2fr;grid-template-rows:1fr;margin-bottom:2rem;border:1px solid rgb(var(--kompendium-contrast-500));border-radius:0.375rem;background-color:rgb(var(--kompendium-contrast-300))}dl dt,dl dd{padding:0.375rem 0.5rem;font-size:0.875rem}dl dt:nth-of-type(even),dl dd:nth-of-type(even){background-color:rgb(var(--kompendium-contrast-400))}dl dt:first-child{border-top-left-radius:0.375rem}dl dt:last-child{border-bottom-left-radius:0.375rem}dl dd:first-child{border-top-right-radius:0.375rem}dl dd:last-child{border-bottom-right-radius:0.375rem}dl,dt,dd{transition:background-color 0.3s ease 0.05s, border-color 0.3s ease 0.05s}";

const Proplist = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
  }
  render() {
    return index.h("dl", null, this.items.map(this.renderProperty));
  }
  renderProperty(property) {
    const { key, value } = property;
    return [
      index.h("dt", null, key),
      index.h("dd", { class: `value--${value}` }, index.h("kompendium-markdown", { text: `\`${value}\`` })),
    ];
  }
};
Proplist.style = proplistCss;

const taglistCss = ":host{display:block}.tag-list{display:grid;grid-auto-flow:column;grid-template-layout:auto auto 1fr;justify-content:left;margin:0.25rem 0}code{font-family:var(--kompendium-font-code);font-size:0.8125rem;margin:0 0.5rem 0 0.25rem}img{width:1rem;filter:invert(0.5) sepia(1) hue-rotate(185deg) saturate(5);vertical-align:middle}.tag--deprecated img{filter:invert(0.35) sepia(1) hue-rotate(-60deg) saturate(5)}";

const Taglist = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
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
    const path = index.getAssetPath('../collection/assets/icons/bookmark-fill.svg');
    classList[`tag--${tag.name}`] = true;
    return (index.h("div", { class: classList }, index.h("img", { src: path }), index.h("code", null, "@", tag.name), index.h("kompendium-markdown", { text: tag.text })));
  }
};
Taglist.style = taglistCss;

exports.kompendium_proplist = Proplist;
exports.kompendium_taglist = Taglist;
