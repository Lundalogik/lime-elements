import{r as t,h as i,g as e}from"./index-6156b4fd.js";import{c as s}from"./random-string-812b1c35.js";const o=":host(limel-tooltip){position:absolute;pointer-events:none}";const l=50;const n=class{constructor(i){t(this,i);this.showTooltip=()=>{const t=500;this.showTooltipTimeoutHandle=window.setTimeout((()=>{this.open=true}),t)};this.hideTooltip=()=>{clearTimeout(this.showTooltipTimeoutHandle);this.open=false};this.elementId=undefined;this.label=undefined;this.helperLabel=undefined;this.maxlength=l;this.openDirection="top";this.open=undefined;this.portalId=s();this.tooltipId=s()}connectedCallback(){this.ownerElement=this.getOwnerElement();this.setOwnerAriaLabel();this.addListeners()}disconnectedCallback(){this.removeListeners()}render(){const t=getComputedStyle(this.host).getPropertyValue("--tooltip-z-index");return i("div",{class:"trigger-anchor"},i("limel-portal",{openDirection:this.openDirection,visible:this.open,containerId:this.portalId,containerStyle:{"z-index":t,"pointer-events":"none"},anchor:this.ownerElement},i("limel-tooltip-content",{label:this.label,helperLabel:this.helperLabel,maxlength:this.maxlength,role:"tooltip","aria-hidden":!this.open,id:this.tooltipId})))}setOwnerAriaLabel(){var t;(t=this.ownerElement)===null||t===void 0?void 0:t.setAttribute("aria-describedby",this.tooltipId)}addListeners(){var t,i,e;(t=this.ownerElement)===null||t===void 0?void 0:t.addEventListener("mouseover",this.showTooltip);(i=this.ownerElement)===null||i===void 0?void 0:i.addEventListener("mouseout",this.hideTooltip);(e=this.ownerElement)===null||e===void 0?void 0:e.addEventListener("click",this.hideTooltip)}removeListeners(){var t,i,e;(t=this.ownerElement)===null||t===void 0?void 0:t.removeEventListener("mouseover",this.showTooltip);(i=this.ownerElement)===null||i===void 0?void 0:i.removeEventListener("mouseout",this.hideTooltip);(e=this.ownerElement)===null||e===void 0?void 0:e.removeEventListener("click",this.hideTooltip)}getOwnerElement(){let t=this.host;do{t=t.parentNode}while(t&&t.nodeType!==Node.DOCUMENT_FRAGMENT_NODE&&t.nodeType!==Node.DOCUMENT_NODE);return t===null||t===void 0?void 0:t.getElementById(this.elementId)}get host(){return e(this)}};n.style=o;const a=":host(limel-tooltip-content){animation:display-tooltip 0.2s ease;display:flex;border-radius:0.25rem;padding:0.25rem 0.5rem;background-color:rgb(var(--contrast-1300));box-shadow:var(--shadow-depth-16);font-family:var(--kompendium-example-font-family, inherit)}text{font-size:0.875rem;line-height:1.25;display:flex;column-gap:1rem}text.has-column-layout{display:table-cell;width:fit-content;max-width:min(var(--tooltip-max-width-of-text), 80vw)}text.has-column-layout .label{padding-bottom:0.5rem}text.has-column-layout .helper-label{padding-bottom:0.25rem}.label{color:rgb(var(--contrast-200))}.helper-label{color:rgb(var(--contrast-800))}.helper-label:empty{display:none}@keyframes display-tooltip{0%{opacity:0;transform:translate3d(0, 0, 0) scale(0.94)}100%{opacity:1;transform:translate3d(0, 0, 0) scale(1)}}";const r=class{constructor(i){t(this,i);this.label=undefined;this.helperLabel=undefined;this.maxlength=undefined}render(){let t=false;if(this.helperLabel&&this.maxlength){t=this.label.length+this.helperLabel.length>this.maxlength}const e={};if(this.maxlength){e.style={"--tooltip-max-width-of-text":`${this.maxlength}`+"ch"}}return[i("text",Object.assign({class:{"has-column-layout":t}},e),i("div",{class:"label"},this.label),i("div",{class:"helper-label"},this.helperLabel))]}};r.style=a;export{n as limel_tooltip,r as limel_tooltip_content};
//# sourceMappingURL=limel-tooltip_2.entry.js.map