import{r as e,c as o,h as t}from"./index-6156b4fd.js";import{d as r}from"./dispatch-resize-event-cd1d230c.js";const n=':host{--mdc-theme-primary:var(\n      --lime-primary-color,\n      rgb(var(--color-teal-default))\n  );--mdc-theme-secondary:var(\n      --lime-secondary-color,\n      rgb(var(--contrast-1100))\n  );--mdc-theme-on-primary:var(\n      --lime-on-primary-color,\n      rgb(var(--contrast-100))\n  );--mdc-theme-on-secondary:var(\n      --lime-on-secondary-color,\n      rgb(var(--contrast-100))\n  );--mdc-theme-text-disabled-on-background:var(\n      --lime-text-disabled-on-background-color,\n      rgba(var(--contrast-1700), 0.38)\n  );--mdc-theme-text-primary-on-background:var(\n      --lime-text-primary-on-background-color,\n      rgba(var(--contrast-1700), 0.87)\n  );--mdc-theme-text-secondary-on-background:var(\n      --lime-text-secondary-on-background-color,\n      rgba(var(--contrast-1700), 0.54)\n  );--mdc-theme-error:var(\n      --lime-error-background-color,\n      rgb(var(--color-red-dark))\n  );--lime-error-text-color:rgb(var(--color-red-darker));--mdc-theme-surface:var(\n      --lime-surface-background-color,\n      rgb(var(--contrast-100))\n  );--mdc-theme-on-surface:var(\n      --lime-on-surface-color,\n      rgb(var(--contrast-1500))\n  )}:host(limel-collapsible-section){--border-radius-of-header:0.75rem;display:block}:host([hidden]){display:none}:host([disabled]){pointer-events:none}.open-close-toggle{all:unset;position:absolute;inset:0;width:100%;transition:background-color 0.4s ease, border-radius 0.1s ease;cursor:pointer;z-index:-1;background-color:var(--closed-header-background-color, rgb(var(--contrast-200)));border-radius:var(--border-radius-of-header)}.open-close-toggle:focus{outline:none}.open-close-toggle:focus-visible{outline:none;box-shadow:var(--shadow-depth-8-focused)}.open-close-toggle:hover{background-color:var(--open-header-background-color, rgb(var(--contrast-300)))}section.open .open-close-toggle{background-color:var(--open-header-background-color, rgb(var(--contrast-100)));border-radius:var(--border-radius-of-header) var(--border-radius-of-header) 0 0}section.open .open-close-toggle:hover{background-color:var(--open-header-background-color, rgb(var(--contrast-300)))}.title,.divider-line,.expand-icon{pointer-events:none}header{isolation:isolate;position:relative;align-items:center;display:flex;justify-content:space-between;padding-left:0.625rem;padding-right:0.625rem;height:3rem}.title{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto, sans-serif;font-family:var(--mdc-typography-headline2-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:1rem;font-size:var(--mdc-typography-headline2-font-size, 1rem);line-height:0.875rem;line-height:var(--mdc-typography-headline2-line-height, 0.875rem);font-weight:300;font-weight:var(--mdc-typography-headline2-font-weight, 300);letter-spacing:-0.0083333333em;letter-spacing:var(--mdc-typography-headline2-letter-spacing, -0.0083333333em);text-decoration:inherit;text-decoration:var(--mdc-typography-headline2-text-decoration, inherit);text-transform:inherit;text-transform:var(--mdc-typography-headline2-text-transform, inherit);color:var(--mdc-theme-on-surface);justify-self:flex-start;padding-right:0.75rem;user-select:none;padding-right:0.5rem;height:auto;max-height:3rem;line-height:1.2rem;white-space:normal;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.divider-line{transition:opacity 0.3s ease 0.3s;flex-grow:1;height:0.125rem;border-radius:0.0625rem;background-color:var(--header-stroke-color, rgb(var(--contrast-900)));margin-right:0.5rem;opacity:0}section.open .divider-line{opacity:0.16}.actions{justify-self:flex-end;flex-shrink:0}@keyframes fade-in-body{0%{opacity:0}100%{opacity:1}}.body{animation:fade-in-body 0.3s ease-in forwards;background-color:var(--body-background-color, var(--contrast-100));padding-left:var(--body-padding, 1.25rem);padding-right:var(--body-padding, 1.25rem);margin-bottom:1.5rem;border-radius:0 0 var(--border-radius-of-header) var(--border-radius-of-header);display:none;opacity:0}section.open .body{display:block}.body:before,.body:after{content:" ";display:table}.body:after{clear:both}.expand-icon{position:relative;height:1.875rem;margin:0 1rem 0 0.5rem;width:0.75rem;flex-shrink:0}.line{position:absolute;top:0;right:0;bottom:0;left:0;margin:auto;width:100%;border-radius:1rem;height:0.125rem;background-color:var(--header-stroke-color, rgb(var(--contrast-900)))}.line:first-of-type,.line:last-of-type{transition:opacity 0.2s ease 0.1s, transform 0.4s ease 0.3s}.line:first-of-type{transform:rotate3d(0, 0, 1, 90deg)}.line:last-of-type{transform:rotate3d(0, 0, 1, -90deg)}.line:nth-of-type(2),.line:nth-of-type(3){transition:opacity 0.2s ease, transform 0.18s ease}section.open .line:first-of-type,section.open .line:last-of-type{transition:opacity 0.2s ease 0.1s, transform 0.4s ease 0.3s}section.open .line:first-of-type{transform:rotate3d(0, 0, 1, 0deg)}section.open .line:last-of-type{transform:rotate3d(0, 0, 1, 0deg)}section.open .line:nth-of-type(2),section.open .line:nth-of-type(3){transition:opacity 1s ease, transform 0.4s ease}section.open .line:nth-of-type(2){transform:translate3d(0, -1rem, 0);opacity:0}section.open .line:nth-of-type(3){transform:translate3d(0, 1rem, 0);opacity:0}.open-close-toggle:hover+.expand-icon .line:first-of-type{transform:rotate3d(0, 0, 1, 0deg)}.open-close-toggle:hover+.expand-icon .line:last-of-type{transform:rotate3d(0, 0, 1, 0deg)}.open-close-toggle:hover+.expand-icon .line:nth-of-type(2),.open-close-toggle:hover+.expand-icon .line:nth-of-type(3){transition:opacity 0.5s ease 0.4s, transform 0.7s cubic-bezier(0.85, 0.11, 0.14, 1.35) 0.2s}.open-close-toggle:hover+.expand-icon .line:nth-of-type(2){transform:translate3d(0, -0.5rem, 0);opacity:0.4}.open-close-toggle:hover+.expand-icon .line:nth-of-type(3){transform:translate3d(0, 0.5rem, 0);opacity:0.4}section.open .open-close-toggle:hover+.expand-icon .line:first-of-type,section.open .open-close-toggle:hover+.expand-icon .line:last-of-type{transition:opacity 0.2s ease 0.4s, transform 0.4s cubic-bezier(0.85, 0.11, 0.14, 1.35) 0.2s}section.open .open-close-toggle:hover+.expand-icon .line:first-of-type{transform:rotate3d(0, 0, 1, 45deg)}section.open .open-close-toggle:hover+.expand-icon .line:last-of-type{transform:rotate3d(0, 0, 1, -45deg)}section.open .open-close-toggle:hover+.expand-icon .line:nth-of-type(2){transform:translate3d(0, -1rem, 0);opacity:0}section.open .open-close-toggle:hover+.expand-icon .line:nth-of-type(3){transform:translate3d(0, 1rem, 0);opacity:0}';const a=class{constructor(n){e(this,n);this.open=o(this,"open",7);this.close=o(this,"close",7);this.action=o(this,"action",7);this.onClick=()=>{this.handleInteraction()};this.handleInteraction=()=>{this.isOpen=!this.isOpen;if(this.isOpen){this.open.emit();const e=100;setTimeout(r,e)}else{this.close.emit()}};this.renderActions=()=>{if(!this.actions){return}return t("div",{class:"actions"},this.actions.map(this.renderActionButton))};this.renderActionButton=e=>t("limel-icon-button",{icon:e.icon,label:e.label,disabled:e.disabled,onClick:this.handleActionClick(e)});this.handleActionClick=e=>o=>{o.stopPropagation();this.action.emit(e)};this.isOpen=false;this.header=undefined;this.actions=undefined}render(){return t("section",{class:`${this.isOpen?"open":""}`},t("header",null,t("button",{class:"open-close-toggle",onClick:this.onClick}),t("div",{class:"expand-icon"},t("div",{class:"line"}),t("div",{class:"line"}),t("div",{class:"line"}),t("div",{class:"line"})),t("h2",{class:"title mdc-typography mdc-typography--headline2"},this.header),t("div",{class:"divider-line"}),this.renderActions()),t("div",{class:"body"},t("slot",null)))}};a.style=n;export{a as limel_collapsible_section};
//# sourceMappingURL=limel-collapsible-section.entry.js.map