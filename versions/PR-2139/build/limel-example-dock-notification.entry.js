import{r as e,h as o}from"./index-a55db97c.js";const t=class{constructor(o){e(this,o),this.handleSelected=e=>{const o=o=>Object.assign(Object.assign({},o),{selected:o.id===e.detail.id});this.dockItems=this.dockItems.map(o),this.dockFooterItems=this.dockFooterItems.map(o)},this.dockItems=[{id:"home",label:"Home",selected:!0,icon:"-lime-logo-go-filled"},{id:"tables",label:"Tables",icon:"insert_table"},{id:"search",label:"Search",icon:"search"}],this.dockFooterItems=[{id:"user",label:"Account",icon:"user",badge:"5",dockMenu:{componentName:"my-custom-menu-with-notifications"}}]}render(){return o("div",{class:"application"},o("limel-dock",{accessibleLabel:"Dock Example: dock with notification badges",dockItems:this.dockItems,dockFooterItems:this.dockFooterItems,onItemSelected:this.handleSelected}))}};t.style=":host{--popover-surface-width:min(100vw, 15rem)}.application{background-color:rgb(var(--contrast-400));border:1px solid rgb(var(--contrast-500));overflow:hidden;border-radius:0.5rem;height:30rem}";export{t as limel_example_dock_notification}