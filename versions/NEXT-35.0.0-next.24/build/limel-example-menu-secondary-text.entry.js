import{r as e,h as t}from"./index-11aed7da.js";let s=class{constructor(t){e(this,t),this.items=[{text:"This item only has one line of primary text"},{separator:!0},{text:"Very long primary texts like this one can truncate based on what you specify for `--menu-surface-width`.",secondaryText:"This is a short secondary text."},{text:"This item only has one line of primary text",secondaryText:"The length of secondary text exceeds maximum allowed number of lines, which is two. This happens because `--menu-surface-width` specified here is not so large. Thus the lines will truncate."}],this.handleSelect=e=>{this.lastSelectedItem=e.detail.text}}render(){return[t("limel-menu",{items:this.items,onSelect:this.handleSelect},t("limel-button",{label:"Menu",slot:"trigger"})),t("limel-example-value",{label:"Last selected item",value:this.lastSelectedItem})]}};s.style=":host{--menu-surface-width:min(\n      calc(100vw - 4rem),\n      20rem\n  )}";export{s as limel_example_menu_secondary_text}