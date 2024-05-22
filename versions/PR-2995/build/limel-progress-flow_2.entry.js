import{r as e,c as t,h as s,g as r}from"./index-6156b4fd.js";import{a as o,g as i}from"./get-icon-props-0b65f85e.js";const a=":host{--step-height:2rem;--selected-indicator-right:-0.5rem;--max-text-width:10rem;isolation:isolate;box-sizing:border-box;width:100%;display:flex;flex-direction:row;align-items:flex-start;overflow-x:auto;scrollbar-width:none;-ms-overflow-style:none;padding:0.25rem}:host::-webkit-scrollbar{display:none}:host(.is-narrow){--step-height:1.5rem;--selected-indicator-right:0}";const n=class{constructor(r){e(this,r);this.change=t(this,"change",7);this.renderRegularFlowItem=(e,t,r)=>s("limel-progress-flow-item",{class:{"flow-item":true,first:t===0,last:t===r.length-1,passed:t<this.selectedItemIndex,selected:e.selected},style:this.getItemStyle(e),disabled:this.disabled||this.readonly,readonly:this.readonly,item:e,onInteract:this.handleFlowItemClick(e),"data-tracking-value":e.value,currentStep:t===this.selectedItemIndex});this.renderEndPhaseItem=(e,t,r)=>s("limel-progress-flow-item",{class:{"flow-item":true,"off-progress-item":true,selected:e.selected,"first-off-progress-item":t===0,"last-off-progress-item":t===r.length-1},style:this.getItemStyle(e),disabled:this.disabled||this.readonly,readonly:this.readonly,item:e,onInteract:this.handleFlowItemClick(e),"data-tracking-value":e.value});this.handleFlowItemClick=e=>()=>{if(!e.selected&&!e.disabled&&!this.disabled){this.change.emit(e)}};this.flowItems=[];this.disabled=false;this.readonly=false}componentDidRender(){this.scrollToSelectedItem()}componentDidLoad(){this.triggerIconColorWarning()}render(){const e=this.flowItems.filter((e=>!e.isOffProgress));const t=this.flowItems.filter((e=>e.isOffProgress));this.selectedItemIndex=e.findIndex((e=>e.selected));return[e.map(this.renderRegularFlowItem),t.map(this.renderEndPhaseItem)]}getItemStyle(e){const t=o(e.icon,e.iconColor);const s={};if(e===null||e===void 0?void 0:e.selectedColor){s["--progress-flow-step-background-color--selected"]=e.selectedColor}if(e===null||e===void 0?void 0:e.passedColor){s["--progress-flow-step-background-color--passed"]=e.passedColor}if(t){s["--progress-flow-icon-color--inactive"]=t}return s}scrollToSelectedItem(){const e=this.getElementForSelectedItem();if(e){const t=e.offsetLeft-this.element.offsetLeft;const s=t-this.element.offsetWidth/2;const r=s+e.offsetWidth/2;this.element.scrollTo({behavior:"smooth",left:r})}}getElementForSelectedItem(){return this.element.shadowRoot.querySelector(".flow-item.selected")}triggerIconColorWarning(){for(const e of this.flowItems){if(e.iconColor){console.warn("The `iconColor` prop is deprecated now! Use the new `Icon` interface and instead of `iconColor: 'color-name'` write `icon {name: 'icon-name', color: 'color-name'}`.")}}}get element(){return r(this)}};n.style=a;const l="@charset \"UTF-8\";.flow-item{--step-background:var(\n      --progress-flow-step-background-color,\n      rgb(var(--contrast-600))\n  );--step-background--selected:var(\n      --progress-flow-step-background-color--selected,\n      var(--mdc-theme-primary)\n  );--step-background--passed:var(\n      --progress-flow-step-background-color--passed,\n      var(--step-background--selected)\n  );--step-text:var(\n      --progress-flow-step-text-color,\n      rgb(var(--contrast-1200))\n  );--step-text--selected:var(\n      --progress-flow-step-text-color--selected,\n      var(--mdc-theme-on-primary)\n  );--step-text--passed:var(\n      --progress-flow-step-text-color--passed,\n      var(--step-text--selected)\n  );--step-divider-color:var(\n      --progress-flow-step-divider-color,\n      rgb(var(--contrast-100))\n  );position:relative;width:100%;display:flex;flex-direction:column;align-items:stretch}.flow-item:not(.off-progress-item,.last) .divider:after{content:\"\"}.flow-item.off-progress-item{padding-left:0.5rem}.flow-item.first-off-progress-item{padding-left:1rem}.step{transition:background-color 0.2s ease, box-shadow 0.2s ease;display:flex;justify-content:center;align-items:center;position:relative;width:100%;height:var(--step-height);border:none;font-size:0.875rem}.step.disabled{cursor:not-allowed}.step.disabled.readonly{opacity:1;cursor:default}.step:focus{outline:none}.step:focus-visible{box-shadow:var(--shadow-depth-8-focused)}.flow-item:not(.off-progress-item,.first) .step{padding-left:calc(var(--step-height) / 2)}.flow-item:not(.selected) .step:not(.disabled){cursor:pointer}.flow-item:not(.selected) .step:not(.disabled):hover{box-shadow:var(--button-shadow-normal)}.flow-item:not(.selected) .step:not(.disabled):active{box-shadow:var(--button-shadow-pressed)}.off-progress-item .step{border-radius:0.25rem;padding:0 0.75rem}.off-progress-item .step .icon{margin-left:0}.flow-item.first .step{border-top-left-radius:var(--step-height);border-bottom-left-radius:var(--step-height);padding-left:1.25rem}.flow-item.last .step{border-top-right-radius:var(--step-height);border-bottom-right-radius:var(--step-height);padding-right:1.25rem}.divider{display:flex;align-items:center;justify-content:center;width:var(--step-height);height:var(--step-height);position:absolute;z-index:1;right:calc(var(--step-height) / 2 * -1);overflow:hidden}.divider:after{position:absolute;display:block;box-sizing:border-box;transition:background-color 0.2s ease;width:100%;height:100%;right:calc(var(--step-height) / 5);transform:rotate(45deg);border-style:solid;border-width:0.125rem 0.125rem 0 0;border-radius:0 0.5rem 0 0;border-color:var(--step-divider-color)}.flow-item.last .divider{width:0}.text,.secondary-text{overflow:hidden;white-space:nowrap;text-overflow:ellipsis;max-width:var(--max-text-width);z-index:2}.secondary-text{font-size:0.75rem;margin:auto;padding-left:calc(var(--step-height) / 2)}.icon{margin:0 0.5rem 0 0.25rem;z-index:2}.step:before,.step:after{pointer-events:none;box-sizing:border-box;z-index:2;position:absolute;right:var(--selected-indicator-right);border-radius:50%}.last .step:before,.last .step:after{right:0.5rem}.flow-item:not(.off-progress-item) .step.selected:before,.flow-item:not(.off-progress-item) .step.selected:after{content:\"\";width:0.375rem;height:0.375rem}.flow-item:not(.off-progress-item) .step.selected:before{background-color:var(--step-divider-color);opacity:0.7}.flow-item:not(.off-progress-item) .step.disabled:before,.flow-item:not(.off-progress-item) .step.disabled:after{width:0.75rem;height:0.75rem}.flow-item:not(.off-progress-item) .step.disabled:after{content:\"\";background-image:url(\"data:image/svg+xml;charset=utf-8, <svg viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg' xml:space='preserve' fill-rule='evenodd' clip-rule='evenodd' stroke-linejoin='round' stroke-miterlimit='2'><path fill='rgb(127,127,127)' d='M32.18 13.711c0-2.207-1.793-4-4.002-4H11.821c-2.208 0-4 1.793-4 4V28.29a4 4 0 0 0 4 4h16.357a4.002 4.002 0 0 0 4.001-4V13.711Z'/><path fill='rgb(127,127,127)' d='M11.211 9.758V7.673A7.489 7.489 0 0 1 18.696.188h2.608a7.489 7.489 0 0 1 7.485 7.485v2.085h-3V7.673a4.488 4.488 0 0 0-4.485-4.485h-2.608a4.488 4.488 0 0 0-4.485 4.485v2.085h-3Z'/></svg>\");background-size:90%;background-repeat:no-repeat;background-position:center;mix-blend-mode:multiply}.step{color:var(--step-text);background-color:var(--step-background)}.step .icon{color:var(--progress-flow-icon-color--inactive, var(--step-text))}.flow-item.selected .step{color:var(--step-text--selected);background-color:var(--step-background--selected)}.flow-item.selected .step .divider:after{background-color:var(--step-background--selected)}.flow-item.selected .step .icon{color:var(--step-text--selected)}.flow-item.passed .step{color:var(--step-text--passed);background-color:var(--step-background--passed)}.flow-item.passed .step .divider:after{background-color:var(--step-background--passed)}.flow-item.passed .step .icon{color:var(--step-text--passed)}.divider:after{border-color:var(--step-divider-color);background-color:var(--step-background)}";const d=class{constructor(s){e(this,s);this.interact=t(this,"interact",7);this.handleClick=()=>{this.interact.emit()};this.item=null;this.disabled=false;this.readonly=false;this.currentStep=false}render(){var e;if(!this.item){return}return[s("button",{tabindex:"0",title:this.getToolTipText(),type:"button",class:{step:true,selected:(e=this.item)===null||e===void 0?void 0:e.selected,disabled:this.isDisabled(),readonly:this.readonly},onClick:this.handleClick,disabled:this.isDisabled(),"aria-current":this.currentStep?"step":null},this.renderIcon(),s("span",{class:"text"},this.item.text),this.renderDivider()),this.renderSecondaryText()]}isDisabled(){var e;return((e=this.item)===null||e===void 0?void 0:e.disabled)||this.readonly||this.disabled}getToolTipText(){if(!this.item.secondaryText){return this.item.text}return[this.item.text,this.item.secondaryText].join(" · ")}renderSecondaryText(){var e;if(!((e=this.item)===null||e===void 0?void 0:e.secondaryText)){return}return s("div",{class:"secondary-text"},this.item.secondaryText)}renderIcon(){if(!this.item.icon){return}const e=i(this.item.icon);return s("limel-icon",{name:e,size:"small",class:"icon"})}renderDivider(){if(this.item.isOffProgress){return}return s("div",{class:"divider"})}get element(){return r(this)}};d.style=l;export{n as limel_progress_flow,d as limel_progress_flow_item};
//# sourceMappingURL=limel-progress-flow_2.entry.js.map