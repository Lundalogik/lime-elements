import{r as t,h as e}from"./index-6156b4fd.js";const i='@charset "UTF-8";.application{position:relative;overflow:hidden;height:20rem;border:1px solid rgb(var(--contrast-500));border-radius:0.5rem;background-color:rgb(var(--contrast-400))}.application.is-resizable{resize:horizontal;max-width:100%;min-width:10rem}.application.is-resizable::after{content:"Resize me ⤵";font-size:0.75rem;position:absolute;right:0.5rem;bottom:0.5rem}.application.has-floating-action-bar{display:grid;background-color:rgb(var(--contrast-700))}.application.has-floating-action-bar limel-action-bar{position:absolute;bottom:0.75rem;justify-self:center}';const o=class{constructor(e){t(this,e);this.actionBarItems=[{text:"Justify left",icon:"align_left",iconOnly:true},{text:"Justify full",icon:"align_justify",iconOnly:true},{text:"Justify center",icon:"align_center",iconOnly:true},{text:"Justify right",icon:"align_right",iconOnly:true},{separator:true},{text:"Bold",commandText:"⌘ B",icon:"bold",iconOnly:true},{text:"Italic",commandText:"⌘ I",icon:"italic",iconOnly:true},{text:"Underline",commandText:"⌘ U",icon:"underline",iconOnly:true},{separator:true},{text:"List",icon:"list",iconOnly:true},{text:"Numbered list",icon:"numbered_list",iconOnly:true},{text:"Blockquote",icon:"quote_right",iconOnly:true},{text:"Emoji",icon:"happy",iconOnly:true},{separator:true},{text:"Picture",icon:"picture",iconOnly:true},{text:"Link",icon:"link",iconOnly:true},{text:"Table",icon:"insert_table",iconOnly:true},{separator:true},{text:"Copy",commandText:"⌘ C",icon:"copy",iconOnly:true},{text:"Cut",commandText:"⌘ X",icon:"cut",iconOnly:true},{text:"Paste",commandText:"⌘ V",icon:"paste",iconOnly:true},{text:"Delete",commandText:"⌘ ⌫",icon:"trash",iconOnly:true},{text:"Find & Replace",commandText:"⌘ ⇧ F",icon:"search",iconOnly:true},{separator:true},{text:"Code",icon:"source_code",iconOnly:true}]}render(){return e("div",{class:"application is-resizable"},e("limel-action-bar",{accessibleLabel:"Toolbar",actions:this.actionBarItems,layout:"fullWidth"}))}};o.style=i;export{o as limel_example_action_bar_overflow_menu};
//# sourceMappingURL=limel-example-action-bar-overflow-menu.entry.js.map