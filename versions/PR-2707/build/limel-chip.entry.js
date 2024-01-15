import{r as e,h as i,g as t}from"./index-6156b4fd.js";import{g as s}from"./get-icon-props-02ab4784.js";import{m as o,r as a}from"./make-enter-clickable-a1d99f5e.js";const r='@charset "UTF-8";:host(limel-chip){--limel-chip-item-height:1.75rem;--limel-chip-gap:0.5rem;display:inline-flex}:host(limel-chip[disabled]){pointer-events:none}*{box-sizing:border-box}.chip{all:unset;position:relative;display:inline-flex;align-items:center;justify-content:center;gap:0.25rem;max-width:var(--chip-max-width, 10rem);height:var(--limel-chip-item-height);border-radius:100vw;font-size:0.875rem;padding:0 0.125rem}.chip:has(limel-icon) .text{padding-left:0.25rem}.chip:not([disabled]){transition:color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease, transform 0.1s ease-out;cursor:pointer;color:var(--mdc-theme-on-surface);background-color:var(--lime-elevated-surface-background-color);box-shadow:var(--button-shadow-normal)}.chip:not([disabled]):focus{outline:none}.chip:not([disabled]):focus-visible{outline:none;box-shadow:var(--shadow-depth-8-focused)}.chip:not([disabled]):hover{color:var(--mdc-theme-on-surface);background-color:var(--lime-elevated-surface-background-color);box-shadow:var(--button-shadow-hovered)}.chip:not([disabled]):active{background-color:var(--mdc-theme-surface);box-shadow:var(--button-shadow-inset-pressed);transform:translate3d(0, 0.05rem, 0)}.chip:has(limel-badge){padding-right:0.375rem}.chip:has(limel-badge) .text{padding-right:0}:host(limel-chip[disabled]) .chip{color:rgba(var(--contrast-1600), 0.37);background-color:rgba(var(--contrast-1600), 0.1);box-shadow:none}:host(limel-chip[readonly]) .chip{box-shadow:0 0 0 1px rgba(var(--contrast-800), 0.5)}:host(limel-chip[selected]) .chip{box-shadow:var(--button-shadow-inset)}:host(limel-chip[selected]) .chip:focus-visible{box-shadow:var(--button-shadow-inset), var(--shadow-depth-8-focused)}:host(limel-chip[selected]) .chip:active{box-shadow:var(--button-shadow-inset-pressed)}:host(limel-chip[selected]) .text{color:var(--mdc-theme-primary)}limel-icon{flex-shrink:0;width:calc(var(--limel-chip-item-height) - 0.25rem);height:calc(var(--limel-chip-item-height) - 0.25rem);padding:0.0625rem}.text{overflow:hidden;white-space:nowrap;text-overflow:ellipsis;line-height:1;padding:0 0.5rem}';const h=class{constructor(t){e(this,t);this.renderAsButton=()=>[i("button",{class:"chip",role:"button",disabled:this.disabled||this.readonly},this.renderIcon(),this.renderLabel(),this.renderBadge())];this.renderAsLink=()=>[i("a",{class:"chip",href:this.link.href,title:this.link.title,"aria-disabled":this.disabled||this.readonly,tabindex:this.disabled?-1:0,onClick:e=>{if(this.disabled){e.preventDefault()}}},this.renderIcon(),this.renderLabel(),this.renderBadge())];this.renderLabel=()=>i("span",{class:"text"},this.text);this.id=undefined;this.text=undefined;this.icon=undefined;this.link=undefined;this.badge=undefined;this.disabled=false;this.readonly=false;this.selected=false}componentWillLoad(){o(this.host)}disconnectedCallback(){this.removeEnterClickable()}render(){if(this.link){return this.renderAsLink()}return this.renderAsButton()}renderIcon(){var e,t;const o=s(this.icon);if(!o){return}return i("limel-icon",{badge:true,name:o,style:{color:`${(e=this.icon)===null||e===void 0?void 0:e.color}`,"background-color":`${(t=this.icon)===null||t===void 0?void 0:t.backgroundColor}`}})}renderBadge(){if(!this.badge){return}return i("limel-badge",{label:this.badge})}removeEnterClickable(){var e;const i=(e=this.button)!==null&&e!==void 0?e:this.anchor;a(i)}get host(){return t(this)}};h.style=r;export{h as limel_chip};
//# sourceMappingURL=limel-chip.entry.js.map