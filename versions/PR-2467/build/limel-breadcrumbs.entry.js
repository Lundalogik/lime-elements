import{r as t,c as s,h as e,g as o}from"./index-6156b4fd.js";import{m as i,r as a}from"./make-enter-clickable-a1d99f5e.js";const r='@charset "UTF-8";ol,li,.step{all:unset;display:flex;align-items:center}ol{max-width:100%;overflow-x:auto;scrollbar-width:none;-ms-overflow-style:none}.step{gap:0.5rem;padding:0.125rem 1rem}.step:not(.last){transition:color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease, transform 0.1s ease-out;cursor:pointer;color:var(--mdc-theme-on-surface);background-color:transparent}.step:not(.last):focus{outline:none}.step:not(.last):focus-visible{outline:none;box-shadow:var(--shadow-depth-8-focused)}.step:not(.last):hover{color:var(--mdc-theme-on-surface);background-color:var(--lime-elevated-surface-background-color);box-shadow:var(--button-shadow-hovered)}.step:not(.last):active{box-shadow:var(--button-shadow-pressed);transform:translate3d(0, 0.08rem, 0)}.step:not(.last):after{content:"›";line-height:1;scale:1.5}limel-icon{width:1.5rem;flex-shrink:0}.text{flex-grow:1;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;max-width:10rem}';const n=class{constructor(o){t(this,o);this.interact=s(this,"interact",7);this.renderSteps=t=>{const s=t.slice(0,-1);if(this.areItemsLinks(t)){return s.map(this.renderAsLinks)}return s.map(this.renderAsButtons)};this.renderAsButtons=t=>e("li",null,e("button",{class:"step",onClick:this.handleClick},this.renderIcon(t),e("span",{class:"text"},t.text)));this.renderAsLinks=t=>e("li",null,e("a",{class:"step",href:t.link.href,title:t.link.title},this.renderIcon(t),e("span",{class:"text"},t.text)));this.renderIcon=t=>{if(!t.icon){return}return e("limel-icon",{name:t.icon})};this.renderLastStep=t=>{const s=t.slice(-1);return e("li",{class:"last step","aria-current":this.areItemsLinks(t)?"page":"step"},e("limel-icon",{name:s[0].icon}),e("span",{class:"text"},s[0].text))};this.areItemsLinks=t=>t.some((t=>"link"in t));this.handleClick=()=>{this.interact.emit()};this.items=undefined}render(){return e("nav",{"aria-label":"Breadcrumb"},e("ol",null,this.renderSteps(this.items),this.renderLastStep(this.items)))}componentDidRender(){this.button=this.host.shadowRoot.querySelector("button");this.anchor=this.host.shadowRoot.querySelector("a");if(this.button){i(this.button)}if(this.anchor){i(this.anchor)}}disconnectedCallback(){if(this.button){a(this.button)}if(this.anchor){a(this.anchor)}}get host(){return o(this)}};n.style=r;export{n as limel_breadcrumbs};
//# sourceMappingURL=limel-breadcrumbs.entry.js.map