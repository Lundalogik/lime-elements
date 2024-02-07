import{r as e,h as r}from"./index-6156b4fd.js";import{g as i}from"./get-icon-props-f581151a.js";const t='@charset "UTF-8";:host(limel-header){display:flex;align-items:center;box-sizing:border-box;width:100%;background-color:var(--header-background-color, rgb(var(--contrast-300)));border-top-left-radius:var(--header-top-right-left-border-radius, 0.75rem);border-top-right-radius:var(--header-top-right-left-border-radius, 0.75rem);padding:0.25rem}.information{display:flex;flex-grow:1;align-items:center;min-width:0}.icon{--limel-icon-svg-margin:0.25rem;flex-shrink:0;color:var(--header-icon-color, rgb(var(--contrast-1100)));background-color:var(--header-icon-background-color, transparent);width:2.25rem;border-radius:0.56rem}.headings{min-width:0;margin-left:0.25rem}.heading,.subheading{overflow:hidden;white-space:nowrap;text-overflow:ellipsis;margin:0;padding:0}.heading{color:var(--header-heading-color, rgb(var(--contrast-1100)));font-size:1rem;font-weight:500}.subheading{color:var(--header-subheading-color, rgb(var(--contrast-900)));font-size:0.8125rem;font-weight:400}.subheading__supporting-text{color:var(--header-supporting-text-color, var(--header-subheading-color))}.subheading__supporting-text span{margin:0 0.125rem}slot[name=actions]{flex-shrink:0}:host(limel-header.is-narrow){padding:0.125rem 0.25rem}:host(limel-header.is-narrow) .icon{--limel-icon-svg-margin:0;width:1.25rem}:host(limel-header.is-narrow) .heading{font-size:0.9375rem}:host(limel-header.has-responsive-layout){display:grid;grid-template-columns:repeat(auto-fit, minmax(clamp(50%, var(--header-responsive-breakpoint, 22rem), 100%), 1fr))}:host(limel-header.has-responsive-layout) .headings{padding-right:0.5rem}:host(limel-header.has-responsive-layout) slot[name=actions]{display:flex;justify-content:flex-end}';const a=class{constructor(r){e(this,r);this.icon=undefined;this.heading=undefined;this.subheading=undefined;this.supportingText=undefined;this.subheadingDivider="·"}render(){return[r("div",{class:"information"},this.renderIcon(),r("div",{class:"headings"},r("h1",{class:"heading",title:this.heading},this.heading),r("h2",{class:"subheading",title:this.subheading},this.subheading,this.renderSupportingText()))),r("slot",{name:"actions"},r("slot",null))]}renderIcon(){const e=i(this.icon);if(!e){return}return r("limel-icon",{class:"icon",name:e})}renderSupportingText(){if(!this.supportingText){return}return r("span",{class:"subheading__supporting-text"},this.renderSubheadingDivider(),this.supportingText)}renderSubheadingDivider(){if(!this.subheadingDivider){return}return r("span",null,this.subheadingDivider)}};a.style=t;export{a as limel_header};
//# sourceMappingURL=limel-header.entry.js.map