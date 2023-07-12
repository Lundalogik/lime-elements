import{r,h as o}from"./index-2626b3b7.js";const t=":host(limel-shortcut){--badge-text-color:var(\n      --shortcut-badge-text-color,\n      rgb(var(--color-white))\n  );--badge-background-color:var(\n      --shortcut-badge-background-color,\n      rgb(var(--color-red-default))\n  );position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;row-gap:0.0625rem}:host(limel-shortcut) *{box-sizing:border-box}:host(limel-shortcut[disabled]) a{opacity:0.5;box-shadow:unset;cursor:not-allowed}a{all:unset;transition:color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease, transform 0.1s ease-out;cursor:pointer;color:var(--mdc-theme-on-surface);background-color:var(--shortcut-background-color, var(--lime-elevated-surface-background-color));box-shadow:var(--button-shadow-normal);text-align:center;height:calc(100% - 1rem);width:calc(100% - 1rem);padding:0.5rem;border-radius:var(--shortcut-border-radius, 1rem)}a:hover{color:var(--mdc-theme-on-surface);background-color:var(--shortcut-background-color, var(--lime-elevated-surface-background-color));box-shadow:var(--button-shadow-hovered)}a:active{box-shadow:var(--button-shadow-pressed);transform:translate3d(0, 0.08rem, 0)}a:focus{outline:none}a:focus-visible{outline:none;box-shadow:var(--shadow-depth-8-focused)}limel-icon{display:flex;height:100%;width:100%;justify-content:center;color:var(--shortcut-icon-color, rgb(var(--contrast-1000)));border-radius:var(--shortcut-border-radius, 1rem)}span{overflow:hidden;white-space:nowrap;text-overflow:ellipsis;width:100%;color:var(--shortcut-label-color, rgb(var(--contrast-1100)));font-size:0.75rem;text-align:center}limel-badge{position:absolute;top:-0.25rem;right:0.125rem}";const e=class{constructor(t){r(this,t);this.renderLabel=()=>{if(this.label){return o("span",{"aria-hidden":"true"},this.label)}};this.getAriaLabel=()=>{var r,o;if(this.label&&((r=this.link)===null||r===void 0?void 0:r.title)){return this.label+". "+this.link.title}if(this.label){return this.label}if((o=this.link)===null||o===void 0?void 0:o.title){return this.link.title}return undefined};this.renderNotification=()=>{if(this.badge){return o("limel-badge",{label:this.badge})}};this.icon=undefined;this.label=null;this.disabled=false;this.badge=undefined;this.link=undefined}render(){var r,t,e;return[o("a",{"aria-disabled":this.disabled,href:(r=this.link)===null||r===void 0?void 0:r.href,target:(t=this.link)===null||t===void 0?void 0:t.target,tabindex:"0","aria-label":this.getAriaLabel(),title:(e=this.link)===null||e===void 0?void 0:e.title},o("limel-icon",{name:this.icon})),this.renderLabel(),this.renderNotification()]}};e.style=t;export{e as limel_shortcut};
//# sourceMappingURL=limel-shortcut.entry.js.map