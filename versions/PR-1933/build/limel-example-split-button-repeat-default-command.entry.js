import{r as e,h as t}from"./index-ab490ba1.js";const s=class{constructor(t){e(this,t),this.items=[{text:"Save",secondaryText:"and update this file",commandText:"⌘ + S"},{text:"Save as a new file",commandText:"⌘ + ⌥ + S"}],this.onClick=()=>{console.log("Button clicked.")},this.handleSelect=e=>{console.log("Menu item chosen",e.detail.text)}}render(){return t("limel-split-button",{label:"Save",icon:"save",primary:!0,items:this.items,onClick:this.onClick,onSelect:this.handleSelect})}};export{s as limel_example_split_button_repeat_default_command}