import{r as e,h as t}from"./index-6156b4fd.js";const s=class{constructor(t){e(this,t);this.items=[{text:"Item 1"},{text:"Item 2"},{text:"Item 3"},{text:"Item 4"},{text:"Item 5"}];this.handleLoadSubItems=async e=>new Promise((t=>{setTimeout((()=>{const s=[];for(let t=1;t<6;t++){s.push({text:`${e.text}.${t}`})}t(s)}),1e3)}));this.handleSelect=e=>{this.lastSelectedItem=e.detail.text};this.lastSelectedItem=undefined}render(){return[t("limel-menu",{lazyLoadItems:true,loadSubItems:this.handleLoadSubItems,items:this.items,onSelect:this.handleSelect},t("limel-button",{label:"Menu",slot:"trigger"})),t("limel-example-value",{label:"Last selected item",value:this.lastSelectedItem})]}};export{s as limel_example_menu_subitems_lazy_loading};
//# sourceMappingURL=limel-example-menu-subitems-lazy-loading.entry.js.map