import{r as e,h as t}from"./index-7dccb886.js";const o=class{constructor(t){e(this,t),this.dockItems=[{value:"home",label:"Lime",selected:!0,icon:"-lime-logo-outlined-colored"},{value:"tables",label:"Tables",icon:"insert_table",component:{name:"my-custom-menu"}},{value:"search",label:"Search",icon:"search"},{value:"create",label:"Create object",icon:"plus_math",isFooterStart:!0},{value:"setting",label:"Settings",icon:"settings"}],this.handleChange=e=>{this.dockItems=this.dockItems.map((t=>{var o;return Object.assign(Object.assign({},t),{selected:t.value===(null===(o=e.detail)||void 0===o?void 0:o.value)})}))}}render(){return[t("div",{class:"application"},t("limel-dock",{dockItems:this.dockItems,onChange:this.handleChange,mobileBreakPoint:5e3})),t("limel-example-value",{value:this.dockItems.find((e=>e.selected))})]}};o.style=":host(limel-example-dock-basic){--popover-surface-width:min(100vw, 40rem)}.application{position:relative;background-color:rgb(var(--contrast-400));border:1px solid rgb(var(--contrast-700));overflow:hidden;border-radius:0.5rem;height:30rem;width:20rem;margin:0 auto}limel-dock{position:absolute;inset:auto 0 0 0}";export{o as limel_example_dock_mobile}