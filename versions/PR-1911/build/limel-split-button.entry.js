import{r as e,c as t,h as o,H as i}from"./index-5f2797d5.js";const r=class{constructor(o){e(this,o),this.select=t(this,"select",7),this.label=void 0,this.primary=!1,this.icon=void 0,this.disabled=!1,this.items=[]}render(){return o(i,null,o("limel-button",{label:this.label,primary:this.primary,icon:this.icon,disabled:this.disabled}),o("limel-menu",{class:{primary:this.primary},disabled:this.disabled,items:this.items,openDirection:"bottom"},o("button",{class:"menu-trigger",slot:"trigger",disabled:this.disabled},"⋮")))}};r.style=':host(limel-split-button){--button-padding-right:2rem;display:inline-flex;isolation:isolate}:host(limel-split-button) *{box-sizing:border-box}limel-menu{display:flex;justify-content:flex-end;position:relative;z-index:1;padding:0.125rem;margin-left:calc(var(--button-padding-right) * -1);width:var(--button-padding-right)}limel-menu:before{transition:background-color 0.5s ease;content:"";position:absolute;inset:0.375rem auto 0.375rem 0.6875rem;width:1px;background-color:currentColor;opacity:0.2}limel-menu:not([disabled]){color:var(--mdc-theme-primary, rgb(var(--color-teal-default)))}limel-menu:not([disabled]).primary{color:var(--mdc-theme-on-primary, rgb(var(--color-white)))}limel-menu[disabled]{color:rgba(var(--contrast-1600), 0.37)}limel-menu:hover:before,limel-menu:focus-within:before{background-color:transparent}.menu-trigger{all:unset;text-align:center;font-weight:bold;border-radius:0.125rem;height:100%;width:1rem}.menu-trigger:not(:disabled){transition:background-color 0.2s ease, box-shadow 0.2s ease, transform 0.1s ease-out;cursor:pointer}.menu-trigger:not(:disabled):hover{box-shadow:var(--button-shadow-hovered)}.menu-trigger:not(:disabled):active{box-shadow:var(--button-shadow-pressed);transform:translate3d(0, 0.08rem, 0)}.menu-trigger:not(:disabled):focus{outline:none}.menu-trigger:not(:disabled):focus-visible{outline:none;box-shadow:var(--shadow-depth-8-focused)}.menu-trigger:not(:disabled):focus-visible,.menu-trigger:not(:disabled):hover{background-color:rgb(var(--color-white), 0.1)}';export{r as limel_split_button}