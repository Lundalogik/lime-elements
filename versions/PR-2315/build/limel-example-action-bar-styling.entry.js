import{r as a,h as o}from"./index-a55db97c.js";const r=class{constructor(o){a(this,o),this.actionBarItems=[{id:"edit",text:"Edit",icon:"pencil_tip"},{id:"download",text:"Download",icon:"download"},{id:"read",text:"Mark as read",icon:"double_tick"},{separator:!0},{id:"delete",text:"Delete",icon:"trash",iconColor:"rgb(var(--color-red-default))"}]}render(){return o("div",{class:"application has-floating-action-bar"},o("limel-action-bar",{accessibleLabel:"Contextual Action Bar",actionBarItems:this.actionBarItems,openDirection:"top"}))}};r.style='@charset "UTF-8";.application{position:relative;overflow:hidden;height:20rem;border:1px solid rgb(var(--contrast-500));border-radius:0.5rem;background-color:rgb(var(--contrast-400))}.application.is-resizable{resize:horizontal}.application.is-resizable::after{content:"Resize me ⤵";font-size:0.75rem;position:absolute;right:0.5rem;bottom:0.5rem}.application.has-floating-action-bar{display:grid;background-color:rgb(var(--contrast-700))}.application.has-floating-action-bar limel-action-bar{position:absolute;bottom:0.75rem;justify-self:center}.application{background-color:rgb(var(--contrast-800))}limel-action-bar{--action-bar-border-radius:100vw;--action-bar-background-color:rgb(var(--contrast-1300));--action-bar-item-text-color:rgb(var(--contrast-100))}limel-action-bar{--action-bar-border-radius:100vw;padding-right:0.125rem;padding-left:0.125rem;max-width:calc(100% - 2rem);box-shadow:var(--shadow-depth-8), var(--shadow-depth-16)}';export{r as limel_example_action_bar_styling}