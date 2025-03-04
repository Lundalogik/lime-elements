'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-4264cbf1.js');
const methods = require('./methods-98f6d427.js');

function Interface({ type, }) {
  return [
    index.h("h1", { id: type.name }, type.name),
    index.h("kompendium-markdown", { text: type.docs }),
    index.h("kompendium-taglist", { tags: type.docsTags }),
    index.h(methods.PropertyList, { props: type.props }),
    index.h(methods.MethodList, { methods: type.methods }),
  ];
}

function Alias({ type }) {
  const alias = '`' + type.alias + '`';
  return [
    index.h("h1", { id: type.name }, type.name),
    index.h("kompendium-markdown", { text: type.docs }),
    index.h("kompendium-taglist", { tags: type.docsTags }),
    index.h("kompendium-markdown", { text: alias }),
  ];
}

function Enum({ type }) {
  return [
    index.h("h1", { id: type.name }, type.name),
    index.h("kompendium-markdown", { text: type.docs }),
    index.h("kompendium-taglist", { tags: type.docsTags }),
    index.h(MemberList, { members: type.members }),
  ];
}
function MemberList({ members }) {
  if (!members.length) {
    return;
  }
  return [index.h("h3", null, "Members"), ...members.map(renderMember)];
}
function renderMember(member) {
  const items = [
    {
      key: 'Value',
      value: member.value,
    },
  ];
  return (index.h("div", null,
    index.h("h4", null, member.name),
    index.h("kompendium-markdown", { text: member.docs }),
    index.h("kompendium-taglist", { tags: member.docsTags }),
    index.h("kompendium-proplist", { items: items })));
}

const componentCss = "*,*::before,*::after{box-sizing:border-box}ul[class],ol[class]{padding:0}body,h1,h2,h3,h4,p,ul[class],ol[class],li,figure,figcaption,blockquote,dl,dd{margin:0}ul[class],ol[class]{list-style:none}a:not([class]){text-decoration-skip-ink:auto}img{max-width:100%}input,button,textarea,select{font:inherit}@media (prefers-reduced-motion: reduce){*{animation-duration:0.01ms !important;animation-iteration-count:1 !important;transition-duration:0.01ms !important;scroll-behavior:auto !important}}:root{--width-nav-panel:16rem}p,a,li{font-size:0.9375rem}h1,h2,h3,h4,h5,h6{margin-bottom:0.5rem;font-weight:normal;font-weight:500}h1{font-size:2rem;line-height:2.25rem;margin-top:1.5rem;letter-spacing:-0.0625rem;font-weight:400}h2{font-size:1.625rem;line-height:1.25rem;margin-top:1.25rem;margin-bottom:1rem}h3{font-size:1.375rem;line-height:1.5rem;margin-top:1rem}h4{font-size:1.25rem;line-height:1.25rem;margin-top:1rem}h5{font-size:1.125rem;line-height:1.125rem;margin-top:0.75rem}h6{font-size:1rem;font-variant:all-small-caps;letter-spacing:0.0625rem}p,blockquote{margin-top:0;margin-bottom:0.5rem}p:only-child,blockquote:only-child{margin-bottom:0}a{transition:color 0.2s ease;color:rgb(var(--kompendium-color-blue-default));text-decoration:none;border-radius:0.125rem}a:hover{color:rgb(var(--kompendium-color-blue-light))}a:focus{outline:none}a:focus-visible{outline:none;box-shadow:var(--kompendium-shadow-depth-8-focused)}ul{list-style:none}ul li{position:relative;margin-left:0.75rem}ul li:before{content:\"\";position:absolute;left:-0.5rem;top:0.625rem;width:0.25rem;height:0.25rem;border-radius:50%;background-color:rgb(var(--kompendium-contrast-700));display:block}ol{list-style:decimal inside}ol,ul{padding-left:0;margin-top:0}ul ul,ul ol,ol ol,ol ul{margin:0.9375rem 0 0.9375rem 1.875rem;font-size:90%}li{margin-bottom:0.625rem}th,td{padding:0.75rem 1rem;text-align:left;border-bottom:1px solid rgb(var(--kompendium-contrast-600))}th:first-child,td:first-child{padding-left:0}th:last-child,td:last-child{padding-right:0}hr{margin:1.75rem 0 2rem 0;border-width:0;border-top:1px solid rgb(var(--kompendium-contrast-600))}kbd{font-family:var(--kompendium-font-code);font-size:0.875rem;font-weight:600;color:rgb(var(--kompendium-contrast-1000));background-color:rgb(var(--kompendium-contrast-200));white-space:pre;word-spacing:normal;word-break:normal;word-wrap:normal;line-height:normal;padding:0.125rem 0.5rem;margin:0 0.25rem;box-shadow:var(--kompendium-button-shadow-normal), 0 0.03125rem 0.21875rem 0 rgba(var(--kompendium-contrast-100), 0.5) inset;border-radius:0.25rem;border-style:solid;border-color:rgba(var(--kompendium-contrast-600), 0.8);border-width:0 1px 0.125rem 1px}@media (prefers-color-scheme: dark){kbd:not([data-theme=force-light]){background-color:rgb(var(--kompendium-contrast-200));color:rgb(var(--kompendium-contrast-1100));border-color:rgba(var(--kompendium-contrast-500), 0.8)}}kbd[data-theme=force-dark]{background-color:rgb(var(--kompendium-contrast-200));color:rgb(var(--kompendium-contrast-1100));border-color:rgba(var(--kompendium-contrast-500), 0.8)}@media (prefers-color-scheme: dark){:host(:not([data-theme=force-light])) kbd{background-color:rgb(var(--kompendium-contrast-200));color:rgb(var(--kompendium-contrast-1100));border-color:rgba(var(--kompendium-contrast-500), 0.8)}}:host([data-theme=force-dark]) kbd{background-color:rgb(var(--kompendium-contrast-200));color:rgb(var(--kompendium-contrast-1100));border-color:rgba(var(--kompendium-contrast-500), 0.8)}:root{--width-nav-panel:16rem}kompendium-playground{width:100%}.docs-layout-section-heading{transition:border-color 0.3s ease 0.05s;padding-top:2.5rem;margin:2.5rem 0 1.25rem 0;border-top:1px solid rgb(var(--kompendium-contrast-500))}.docs-layout-section-heading:before{content:\"\";width:0.125rem;height:0.75rem;display:inline-block;background-color:rgba(var(--kompendium-color-code-blue), 0.4);border-radius:0.0625rem;transform:translateX(-0.5rem)}.props-events-layout .markdown-props{display:grid;grid-gap:1.25rem;grid-auto-flow:column;grid-template-columns:1fr 1fr}@media (max-width: 800px){.props-events-layout .markdown-props{grid-gap:0.75rem;grid-auto-flow:row;grid-template-columns:unset}}.methods-layout{border-radius:0.375rem;margin-bottom:2.5rem;background-color:rgb(var(--kompendium-contrast-400))}.methods-title{margin:0;border-radius:0.375rem 0.375rem 0 0;padding:0.75rem 1rem;background-color:rgb(var(--kompendium-contrast-500));font-size:1.0625rem}.methods-content{display:grid;grid-gap:1.25rem;grid-auto-flow:column;grid-template-columns:1fr 1fr;padding:1rem 1.25rem 1.5rem 1.25rem}.methods-returns{padding:1rem 1.25rem 1.5rem 1.25rem;border-radius:0 0 0.375rem 0.375rem;border-top:1px solid rgb(var(--kompendium-contrast-600))}.methods-returns h5{margin-top:0}@media (max-width: 800px){.methods-content{grid-gap:0.75rem;grid-auto-flow:row;grid-template-columns:unset}}.styles-layout{display:grid;grid-auto-flow:column;grid-template-columns:1fr 1fr;grid-gap:0 0.75rem;border:solid rgb(var(--kompendium-contrast-500));border-width:1px 1px 0 1px;padding:0.5rem;background-color:rgb(var(--kompendium-contrast-300))}.styles-layout:first-of-type{border-top-right-radius:0.375rem;border-top-left-radius:0.375rem}.styles-layout:last-of-type{border-bottom-right-radius:0.375rem;border-bottom-left-radius:0.375rem;border-bottom-width:1px}.styles-layout:nth-of-type(odd){background-color:rgb(var(--kompendium-contrast-400))}.styles-title code{font-family:var(--kompendium-font-code);border-radius:0.25rem;border:1px solid rgba(var(--kompendium-contrast-1100), 0.1);font-size:0.6875rem;white-space:pre-wrap;color:rgb(var(--kompendium-contrast-1100));padding:0.125rem 0.3125rem;margin:0 0.125rem;background:rgba(var(--kompendium-contrast-1100), 0.05)}@media (max-width: 800px){.styles-layout{grid-auto-flow:row;grid-template-columns:unset;grid-gap:0.75rem 0}}:host{display:block}.docs kompendium-markdown{display:block;width:100%;max-width:60rem}";

const Type = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
  }
  componentWillRender() {
    this.findType();
  }
  render() {
    if (!this.type) {
      return;
    }
    const type = this.type;
    const componentMap = {
      interface: Interface,
      alias: Alias,
      enum: Enum,
      class: Interface,
    };
    const TypeComponent = componentMap[this.type.type];
    return (index.h("article", { class: "type" }, index.h("section", { class: "docs" }, index.h(TypeComponent, { type: type }))));
  }
  findType() {
    const type = this.types.find((type) => type.name === this.match.params.name);
    if (type) {
      this.type = type;
    }
  }
};
Type.style = componentCss;

exports.kompendium_type = Type;
