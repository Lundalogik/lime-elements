import{r as t,h as e,g as i}from"./index-7dccb886.js";import{c as s}from"./random-string-2246b81e.js";const l=class{constructor(e){t(this,e),this.maxlength=50,this.showTooltip=()=>{this.showTooltipTimeoutHandle=window.setTimeout((()=>{this.open=!0}),500)},this.hideTooltip=()=>{clearTimeout(this.showTooltipTimeoutHandle),this.open=!1},this.portalId=s(),this.tooltipId=s()}connectedCallback(){this.setOwnerAriaLabel(),this.addListeners()}disconnectedCallback(){this.removeListeners()}render(){const t=getComputedStyle(this.host).getPropertyValue("--tooltip-z-index");return e("div",{class:"trigger-anchor"},e("limel-portal",{visible:this.open,containerId:this.portalId,containerStyle:{"z-index":t,"pointer-events":"none"}},e("limel-tooltip-content",{label:this.label,helperLabel:this.helperLabel,maxlength:this.maxlength,role:"tooltip","aria-hidden":!this.open,id:this.tooltipId})))}setOwnerAriaLabel(){const t=this.getOwnerElement();null==t||t.setAttribute("aria-describedby",this.tooltipId)}addListeners(){const t=this.getOwnerElement();null==t||t.addEventListener("mouseover",this.showTooltip),null==t||t.addEventListener("mouseout",this.hideTooltip),null==t||t.addEventListener("click",this.hideTooltip)}removeListeners(){const t=this.getOwnerElement();null==t||t.removeEventListener("mouseover",this.showTooltip),null==t||t.removeEventListener("mouseout",this.hideTooltip),null==t||t.removeEventListener("click",this.hideTooltip)}getOwnerElement(){var t;let e=this.host;do{e=e.parentNode}while(e&&e.nodeType!==Node.DOCUMENT_FRAGMENT_NODE&&e.nodeType!==Node.DOCUMENT_NODE);return null===(t=e)||void 0===t?void 0:t.getElementById(this.elementId)}get host(){return i(this)}};l.style=".trigger-anchor{position:relative}";const o=class{constructor(e){t(this,e)}render(){let t=!1;this.helperLabel&&this.maxlength&&(t=this.label.length+this.helperLabel.length>this.maxlength);const i={};return this.maxlength&&(i.style={"--tooltip-max-width-of-text":`${this.maxlength}ch`}),[e("text",Object.assign({class:{"has-column-layout":t}},i),e("div",{class:"label"},this.label),e("div",{class:"helper-label"},this.helperLabel))]}};o.style=":host{animation:display-tooltip 0.2s ease;display:flex;border-radius:0.25rem;padding:0.25rem 0.5rem;background-color:rgb(var(--contrast-1300));box-shadow:var(--shadow-depth-16)}text{font-size:0.875rem;line-height:1.25;display:flex;column-gap:1rem}text.has-column-layout{display:table-cell;width:fit-content;max-width:min(var(--tooltip-max-width-of-text), 80vw)}text.has-column-layout .label{padding-bottom:0.5rem}text.has-column-layout .helper-label{padding-bottom:0.25rem}.label{color:rgb(var(--contrast-200))}.helper-label{color:rgb(var(--contrast-800))}.helper-label:empty{display:none}@keyframes display-tooltip{0%{opacity:0;transform:translate3d(0, 0, 0) scale(0.94)}100%{opacity:1;transform:translate3d(0, 0, 0) scale(1)}}";export{l as limel_tooltip,o as limel_tooltip_content}