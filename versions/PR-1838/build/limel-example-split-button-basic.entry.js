import{r as t,h as e}from"./index-ab490ba1.js";const o=class{constructor(e){t(this,e),this.items=[{text:"Later today",secondaryText:"at 16:45"},{text:"Tomorrow",secondaryText:"at 08:00"},{separator:!0},{text:"Custom time",icon:"calendar"}],this.onClick=()=>{console.log("Button clicked.")},this.handleSelect=t=>{console.log("Menu item chosen",t.detail.text)}}render(){return e("limel-split-button",{label:"Send",icon:"send",items:this.items,onClick:this.onClick,onSelect:this.handleSelect})}};export{o as limel_example_split_button_basic}