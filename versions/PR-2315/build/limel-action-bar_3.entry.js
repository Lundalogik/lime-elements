import{r as t,c as i,h as e,H as o}from"./index-a55db97c.js";import{c as r}from"./random-string-2246b81e.js";const a=class{constructor(o){t(this,o),this.itemSelected=i(this,"itemSelected",7),this.renderActionBarItem=t=>e("limel-action-bar-item",{item:t}),this.handleResize=()=>{this.useMobileLayout=window.innerWidth<=this.mobileBreakPoint},this.renderOverflowMenu=t=>e("limel-action-bar-overflow-menu",{openDirection:this.openDirection,items:t}),this.actionBarItems=[],this.accessibleLabel=void 0,this.mobileBreakPoint=700,this.useMobileLayout=!1,this.openDirection=void 0}componentDidLoad(){this.resizeObserver=new ResizeObserver(this.handleResize),this.resizeObserver.observe(document.body)}disconnectedCallback(){this.resizeObserver.disconnect()}render(){const t=this.actionBarItems.slice(0,4),i=this.actionBarItems.slice(4);return e(o,{"aria-label":this.accessibleLabel,class:{"has-mobile-layout":this.useMobileLayout}},t.map(this.renderActionBarItem),this.renderOverflowMenu(i))}};a.style=":host(limel-action-bar){--action-bar-item-height:2rem;--limel-action-bar-item-text-color:var(\n      --action-bar-item-text-color,\n      rgb(var(--contrast-1100))\n  );display:inline-flex;align-items:center;padding:0.125rem;max-width:100%;border-radius:var(--action-bar-border-radius);background-color:var(--action-bar-background-color, rgb(var(--contrast-100)));gap:0.25rem}@media (pointer: coarse){:host(limel-action-bar){gap:0.5rem}}limel-action-bar-button{min-width:0}";const s=class{constructor(e){t(this,e),this.select=i(this,"select",7),this.handleClick=t=>{t.stopPropagation(),this.select.emit(this.item)},this.item=void 0,this.tooltipId=r()}render(){return this.renderButton(this.handleClick)}renderButton(t){return!this.isItem(this.item)&&this.item.separator?e("div",{role:"separator"}):e("button",{id:this.tooltipId,type:"button",onClick:t},this.renderIcon(),this.renderLabel(),this.renderTooltip())}isItem(t){return!("separator"in t)}renderIcon(){if(!this.isItem(this.item)||this.item.icon)return"icon"in this.item?e("limel-icon",{name:this.item.icon,style:{"--action-bar-item-icon-color":`${this.item.iconColor}`}}):void 0}renderLabel(){if(this.isItem(this.item)&&!this.item.iconOnly)return e("span",{class:"text"},this.item.text)}renderTooltip(){if(this.isItem(this.item))return this.item.text?e("limel-tooltip",{elementId:this.tooltipId,label:this.item.text,helperLabel:this.item.commandText}):this.item.commandText?e("limel-tooltip",{elementId:this.tooltipId,label:this.item.commandText}):void 0}};s.style="button{all:unset;position:relative;transition:color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease, transform 0.1s ease-out;cursor:pointer;color:var(--limel-action-bar-item-text-color);background-color:var(--action-bar-background-color);box-sizing:border-box;display:flex;align-items:center;justify-content:center;width:100%;height:var(--action-bar-item-height);border-radius:var(--action-bar-item-height);font-size:0.875rem;padding:0 0.25rem;min-width:var(--action-bar-item-height)}button:hover{color:var(--mdc-theme-on-surface);background-color:var(--lime-elevated-surface-background-color);box-shadow:var(--button-shadow-hovered)}button:active{background-color:var(--mdc-theme-surface);box-shadow:var(--button-shadow-inset-pressed);transform:translate3d(0, 0.05rem, 0)}button:focus{outline:none}button:focus-visible{outline:none;box-shadow:var(--shadow-depth-8-focused)}button:has(.text){padding:0 0.5rem}.text{overflow:hidden;white-space:nowrap;text-overflow:ellipsis;padding:0 0.25rem 0 0.5rem}limel-icon{flex-shrink:0;width:calc(var(--action-bar-item-height) - 0.75rem);height:calc(var(--action-bar-item-height) - 0.75rem);color:var(--action-bar-item-icon-color, var(--limel-action-bar-item-text-color))}limel-tooltip{position:absolute}div[role=separator]{width:1px;height:1.5rem;border-radius:var(--action-bar-item-height);background-color:var(--limel-action-bar-item-text-color);opacity:0.2}@media (pointer: fine){div[role=separator]{margin:0 0.5rem}}limel-menu{--notification-badge-background-color:rgb(var(--contrast-600));--notification-badge-text-color:rgb(var(--contrast-1200))}limel-badge{pointer-events:none}";const n=class{constructor(i){t(this,i),this.countOverflowedItems=()=>`+ ${this.items.length}`,this.renderNotification=()=>e("limel-badge",{label:this.countOverflowedItems()}),this.handleSelect=t=>{console.log(t.detail.text)},this.items=void 0,this.openDirection=void 0}render(){return[e("limel-menu",{openDirection:this.openDirection,items:this.items,onSelect:this.handleSelect},e("button",{slot:"trigger"},this.renderNotification()))]}};export{a as limel_action_bar,s as limel_action_bar_item,n as limel_action_bar_overflow_menu}