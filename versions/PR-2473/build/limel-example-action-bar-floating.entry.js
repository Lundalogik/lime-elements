import{r as o,h as t}from"./index-f1b3d5fb.js";const i='@charset "UTF-8";.application{position:relative;overflow:hidden;height:20rem;border:1px solid rgb(var(--contrast-500));border-radius:0.5rem;background-color:rgb(var(--contrast-400))}.application.is-resizable{resize:horizontal;max-width:100%;min-width:10rem}.application.is-resizable::after{content:"Resize me ⤵";font-size:0.75rem;position:absolute;right:0.25rem;bottom:0.25rem}.application.has-floating-action-bar{display:grid;background-color:rgb(var(--contrast-700))}.application.has-floating-action-bar limel-action-bar{position:absolute;bottom:1.5rem;justify-self:center}';const r=class{constructor(t){o(this,t);this.actionBarItems=[{text:"Add",icon:"plus_math",iconOnly:true},{text:"Refresh",icon:"refresh",iconOnly:true},{separator:true},{text:"Assign me",commandText:"Cmd + H",icon:"whole_hand"},{text:"Park",icon:"circled_pause",iconColor:"rgb(var(--color-orange-default))"},{text:"Close",icon:"do_not_disturb",iconColor:"rgb(var(--color-red-default))"}]}render(){return t("div",{class:"application has-floating-action-bar is-resizable"},t("limel-action-bar",{accessibleLabel:"Contextual Action Bar",actions:this.actionBarItems,openDirection:"top",layout:"floating"}))}};r.style=i;export{r as limel_example_action_bar_floating};
//# sourceMappingURL=limel-example-action-bar-floating.entry.js.map