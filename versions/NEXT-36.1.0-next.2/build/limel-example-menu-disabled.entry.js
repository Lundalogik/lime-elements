import{r as e,h as t}from"./index-ab490ba1.js";const s=class{constructor(t){e(this,t),this.items=[{text:"Copy"},{text:"Cut"},{separator:!0},{text:"Paste"}],this.handleSelect=e=>{console.error("This should never happen, since the menu is disabled.",e)}}render(){return t("limel-menu",{items:this.items,disabled:!0,onSelect:this.handleSelect},t("limel-button",{label:"Menu",slot:"trigger"}))}};export{s as limel_example_menu_disabled}