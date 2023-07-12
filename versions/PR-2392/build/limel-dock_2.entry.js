import{r as e,c as t,h as o,H as i}from"./index-2626b3b7.js";import{c as r}from"./random-string-812b1c35.js";const s=":host(limel-dock){--badge-background-color:rgb(var(--color-red-default));--badge-text-color:rgb(var(--color-white));--dock-item-height:2.75rem;--dock-padding:0.25rem;--dock-expand-shrink-button-height:1rem;--limel-dock-item-text-color:var(\n      --dock-item-text-color,\n      rgb(var(--contrast-1100))\n  );--limel-dock-item-text-color--selected:var(\n      --dock-item-text-color--selected,\n      rgb(var(--contrast-1300))\n  );isolation:isolate;position:relative;display:inline-flex;flex-direction:column;background-color:var(--dock-background-color, rgb(var(--contrast-100)));box-shadow:var(--shadow-depth-8);padding-top:var(--dock-padding-top);padding-right:var(--dock-padding-right);padding-bottom:var(--dock-padding-bottom);padding-left:var(--dock-padding-left)}:host(limel-dock:not(.has-mobile-layout)){height:100%;width:calc(var(--dock-padding) * 2 + var(--dock-item-height))}:host(limel-dock.expanded){width:var(--dock-expanded-max-width, max-content)}.footer-separator{margin-top:auto;justify-self:flex-end}nav{box-sizing:border-box;display:inline-flex;flex-direction:column;gap:0.375rem;flex-grow:1;padding:var(--dock-padding);overflow-y:auto;scrollbar-width:none;-ms-overflow-style:none}nav::-webkit-scrollbar{display:none}:host(limel-dock.has-mobile-layout) nav{justify-content:space-between;flex-direction:row}limel-dock-button:first-of-type{--limel-custom-home-icon-enabler:var(--crm-custom-home-icon-enabler);--limel-custom-home-icon:var(--crm-custom-home-icon)}.expand-shrink{all:unset;box-sizing:border-box;transition:color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease, transform 0.1s ease-out;cursor:pointer;color:var(--mdc-theme-on-surface);background-color:transparent;display:flex;justify-content:center;align-items:center;height:var(--dock-expand-shrink-button-height);padding:0 0.5rem;margin:var(--dock-padding);border-radius:0.375rem}.expand-shrink:hover{color:var(--mdc-theme-on-surface);background-color:var(--lime-elevated-surface-background-color);box-shadow:var(--button-shadow-hovered)}.expand-shrink:active{box-shadow:var(--button-shadow-pressed);transform:translate3d(0, 0.08rem, 0)}.expand-shrink:focus{outline:none}.expand-shrink:focus-visible{outline:none;box-shadow:var(--shadow-depth-8-focused)}.expand-shrink.expanded{justify-content:flex-end}.expand-shrink.expanded limel-icon{transform:rotateY(180deg)}.expand-shrink limel-icon{width:calc(var(--dock-expand-shrink-button-height) - 0.25rem);color:var(--dock-item-icon-color, var(--limel-dock-item-text-color))}";const n=700;const a=class{constructor(i){e(this,i);this.itemSelected=t(this,"itemSelected",7);this.menuOpen=t(this,"menuOpen",7);this.close=t(this,"close",7);this.dockExpanded=t(this,"dockExpanded",7);this.renderSeparator=()=>this.useMobileLayout?null:o("span",{class:"footer-separator"});this.renderDockItem=e=>o("limel-dock-button",{class:{"dock-item":true,selected:e.selected},item:e,expanded:this.expanded&&!this.useMobileLayout,useMobileLayout:this.useMobileLayout});this.handleResize=()=>{if(window.innerWidth<=this.mobileBreakPoint){this.useMobileLayout=true}else{this.useMobileLayout=false}};this.toggleDockWidth=()=>{this.expanded=!this.expanded;this.dockExpanded.emit(this.expanded)};this.dockItems=[];this.dockFooterItems=[];this.accessibleLabel=undefined;this.expanded=false;this.allowResize=true;this.mobileBreakPoint=n;this.useMobileLayout=false}componentDidLoad(){this.resizeObserver=new ResizeObserver(this.handleResize);this.resizeObserver.observe(document.body)}disconnectedCallback(){this.resizeObserver.disconnect()}render(){return o(i,{class:{dock:true,expanded:this.expanded,"has-mobile-layout":this.useMobileLayout}},o("nav",{"aria-label":this.accessibleLabel},this.dockItems.map(this.renderDockItem),this.renderSeparator(),this.dockFooterItems.map(this.renderDockItem)),this.renderExpandShrinkToggle())}renderExpandShrinkToggle(){if(this.useMobileLayout||!this.allowResize){return}return o("button",{class:{"expand-shrink":true,expanded:this.expanded},onClick:this.toggleDockWidth},o("limel-icon",{name:"angle_right"}))}};a.style=s;const d=".button{all:unset;isolation:isolate;position:relative;transition:color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease, transform 0.1s ease-out;cursor:pointer;color:var(--limel-dock-item-text-color);background-color:var(--dock-background-color);box-sizing:border-box;display:flex;align-items:center;width:100%;height:var(--dock-item-height);border-radius:0.375rem;font-size:0.875rem;padding:0 0.5rem;min-width:var(--dock-item-height)}.button:hover{color:var(--mdc-theme-on-surface);background-color:var(--lime-elevated-surface-background-color);box-shadow:var(--button-shadow-hovered)}.button:active{background-color:var(--mdc-theme-surface);box-shadow:var(--button-shadow-inset-pressed);transform:translate3d(0, 0.05rem, 0)}.button:focus{outline:none}.button:focus-visible{outline:none;box-shadow:var(--shadow-depth-8-focused)}.button:hover{z-index:1}.button.selected{color:var(--limel-dock-item-text-color--selected);background-color:var(--dock-item-background-color--selected, rgb(var(--contrast-200)));box-shadow:var(--button-shadow-inset)}.button.selected:focus-visible{box-shadow:var(--button-shadow-inset), var(--shadow-depth-8-focused)}.button.selected .icon{color:var(--limel-dock-item-text--selected)}limel-popover{display:grid;grid-template-columns:100%}.text{overflow:hidden;white-space:nowrap;text-overflow:ellipsis;padding-left:0.5rem;padding-right:0.75rem}.icon{flex-shrink:0;width:calc(var(--dock-item-height) - 1rem);height:calc(var(--dock-item-height) - 1rem);color:var(--dock-item-icon-color, var(--limel-dock-item-text-color))}limel-badge{position:absolute;top:-0.125rem;right:-0.125rem}.icon{position:relative}.icon:before{text-align:center;pointer-events:none;position:absolute;inset:0;background-color:var(--dock-background-color, rgb(var(--contrast-100)));background-position:center;background-repeat:no-repeat;background-size:contain;background-image:var(--limel-custom-home-icon);content:var(--limel-custom-home-icon-enabler)}.button.selected .icon:before{background-color:var(--dock-item-background-color--selected, rgb(var(--contrast-200)))}";const l=class{constructor(i){e(this,i);this.itemSelected=t(this,"itemSelected",7);this.menuOpen=t(this,"menuOpen",7);this.close=t(this,"close",7);this.renderNotification=()=>{if(this.item.badge!==undefined){return o("limel-badge",{label:this.item.badge})}};this.openPopover=e=>{e.stopPropagation();this.isOpen=true;this.menuOpen.emit(this.item)};this.setCustomComponentElement=e=>{this.customComponentElement=e};this.onPopoverClose=()=>{this.isOpen=false;this.close.emit()};this.handleClick=e=>{e.stopPropagation();this.itemSelected.emit(this.item)};this.focusCustomComponentElement=()=>{var e,t,o;if((t=(e=this.customComponentElement)===null||e===void 0?void 0:e.shadowRoot)===null||t===void 0?void 0:t.delegatesFocus){(o=this.customComponentElement)===null||o===void 0?void 0:o.focus()}};this.item=undefined;this.expanded=false;this.useMobileLayout=false;this.isOpen=false;this.tooltipId=r()}render(){var e,t;if((t=(e=this.item)===null||e===void 0?void 0:e.dockMenu)===null||t===void 0?void 0:t.componentName){return this.renderPopover()}return this.renderButton(this.handleClick)}openWatcher(){if(!this.isOpen){return}const e=new IntersectionObserver(this.focusCustomComponentElement);e.observe(this.customComponentElement)}renderPopover(){var e;const t=(e=this.item)===null||e===void 0?void 0:e.dockMenu.componentName;return o("limel-popover",{openDirection:this.useMobileLayout?"top":"right",open:this.isOpen||this.item.dockMenu.menuOpen,onClose:this.onPopoverClose},this.renderButton(this.openPopover,"trigger"),o(t,Object.assign({ref:this.setCustomComponentElement},this.item.dockMenu.props||{},{onClose:this.onPopoverClose})))}renderButton(e,t){var i;return o("button",{slot:t,tabindex:"0",id:this.tooltipId,type:"button",class:{button:true,selected:(i=this.item)===null||i===void 0?void 0:i.selected},onClick:e,"aria-live":"polite"},this.renderIcon(),this.renderLabel(),this.renderTooltip(),this.renderNotification())}renderIcon(){if(!this.item.icon){return}return o("limel-icon",{name:this.item.icon,class:"icon"})}renderLabel(){if(this.expanded){return o("span",{class:"text"},this.item.label)}}renderTooltip(){if(!this.expanded&&this.item.label){return o("limel-tooltip",{elementId:this.tooltipId,label:this.item.label,helperLabel:this.item.helperLabel})}if(this.expanded&&this.item.helperLabel){return o("limel-tooltip",{elementId:this.tooltipId,label:this.item.helperLabel})}}static get watchers(){return{isOpen:["openWatcher"]}}};l.style=d;export{a as limel_dock,l as limel_dock_button};
//# sourceMappingURL=limel-dock_2.entry.js.map