import{r,h as n}from"./index-a55db97c.js";const e=class{constructor(n){r(this,n),this.message=void 0,this.icon=void 0,this.isOpen=!1}async open(){this.isOpen=!0}async close(){this.isOpen=!1}render(){return n("div",{class:"lime-banner "+(this.isOpen?"lime-banner--open":"")},n("div",{class:"lime-banner__surface"},n("div",{class:"lime-banner__content"},this.renderIcon(),n("div",{class:"mdc-typography--body2"},this.message),n("div",{class:"lime-banner__actions"},n("slot",{name:"buttons"})))))}renderIcon(){if(this.icon)return n("div",{class:"lime-banner__icon"},n("limel-icon",{name:this.icon,badge:!0,size:"large"}))}};e.style=":host{--mdc-theme-primary:var(\n      --lime-primary-color,\n      rgb(var(--color-teal-default))\n  );--mdc-theme-secondary:var(\n      --lime-secondary-color,\n      rgb(var(--contrast-1100))\n  );--mdc-theme-on-primary:var(\n      --lime-on-primary-color,\n      rgb(var(--contrast-100))\n  );--mdc-theme-on-secondary:var(\n      --lime-on-secondary-color,\n      rgb(var(--contrast-100))\n  );--mdc-theme-text-disabled-on-background:var(\n      --lime-text-disabled-on-background-color,\n      rgba(var(--contrast-1700), 0.38)\n  );--mdc-theme-text-primary-on-background:var(\n      --lime-text-primary-on-background-color,\n      rgba(var(--contrast-1700), 0.87)\n  );--mdc-theme-text-secondary-on-background:var(\n      --lime-text-secondary-on-background-color,\n      rgba(var(--contrast-1700), 0.54)\n  );--lime-error-text-color:rgb(var(--color-red-darker));--mdc-theme-surface:var(\n      --lime-surface-background-color,\n      rgb(var(--contrast-100))\n  );--mdc-theme-on-surface:var(\n      --lime-on-surface-color,\n      var(--lime-text-primary-on-background-color)\n  )}.lime-banner{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto, sans-serif;font-family:var(--mdc-typography-body2-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:0.8125rem;font-size:var(--mdc-typography-body2-font-size, 0.8125rem);line-height:1.625rem;line-height:var(--mdc-typography-body2-line-height, 1.625rem);font-weight:400;font-weight:var(--mdc-typography-body2-font-weight, 400);letter-spacing:0.0178571429em;letter-spacing:var(--mdc-typography-body2-letter-spacing, 0.0178571429em);text-decoration:inherit;text-decoration:var(--mdc-typography-body2-text-decoration, inherit);text-transform:inherit;text-transform:var(--mdc-typography-body2-text-transform, inherit);min-height:3.25rem;display:none;background-color:rgba(var(--contrast-100), 0.7);backdrop-filter:blur(0.3125rem);box-shadow:var(--shadow-depth-16)}.lime-banner.lime-banner--open{display:block}.lime-banner.lime-banner--open .lime-banner__surface{opacity:1}.lime-banner .lime-banner__surface{display:flex;justify-content:center;box-sizing:border-box;opacity:0}.lime-banner .lime-banner__content{display:flex;align-items:center;align-content:stretch;padding:1rem;flex-wrap:wrap}.lime-banner div[class^=mdc-typography]{color:rgb(var(--contrast-1200))}.lime-banner .lime-banner__icon{margin:0 0.625rem;align-self:flex-start}.lime-banner .lime-banner__actions{margin-left:3.125rem;display:flex;justify-content:flex-end}.lime-banner limel-icon{color:var(--banner-icon-fill-color, rgb(var(--contrast-100)));background-color:var(--banner-icon-background-color, rgb(var(--contrast-800)))}";export{e as limel_banner}