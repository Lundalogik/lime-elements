import{r as t,h as e}from"./index-5f2797d5.js";const l=class{constructor(e){t(this,e),this.items=[{text:"Copy",commandText:"alt + C"},{text:"Cut",commandText:"alt + X"},{separator:!0},{text:"Paste",commandText:"alt + V"}],this.handleSelect=t=>{this.lastSelectedItem=t.detail.text}}render(){return console.log(this.items),[e("limel-menu",{items:this.items,onSelect:this.handleSelect},e("limel-button",{label:"Menu",slot:"trigger"})),e("limel-example-value",{label:"Last selected item",value:this.lastSelectedItem})]}};export{l as limel_example_menu_hotkeys}