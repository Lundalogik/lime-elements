import{r as e,h as t}from"./index-7dccb886.js";const i=class{constructor(t){e(this,t),this.dockItems=[{id:"1",label:"Home",selected:!0,icon:"home"},{id:"2",label:"Search",icon:"search"},{id:"3",label:"Calls",icon:"phone"},{id:"4",label:"Chats",icon:"chat"}],this.footerItems=[{id:"5",label:"Settings",icon:"settings"}],this.handleSelected=e=>{const t=t=>Object.assign(Object.assign({},t),{selected:t.id===e.detail.id});this.dockItems=this.dockItems.map(t),this.footerItems=this.footerItems.map(t)}}render(){return t("div",{class:"application"},t("limel-dock",{dockItems:this.dockItems,footerItems:this.footerItems,onSelected:this.handleSelected,expanded:!0}))}};i.style=":host{--popover-surface-width:min(100vw, 40rem)}.application{background-color:rgb(var(--contrast-400));border:1px solid rgb(var(--contrast-700));overflow:hidden;border-radius:0.5rem;height:30rem}";export{i as limel_example_dock_colors}