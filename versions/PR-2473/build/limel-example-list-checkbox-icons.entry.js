import{r as e,h as l}from"./index-f1b3d5fb.js";const t=class{constructor(l){e(this,l);this.handleChange=e=>{this.selectedItems=e.detail;this.items=this.items.map((l=>{const t=!!e.detail.find((e=>e.value===l.value));return Object.assign(Object.assign({},l),{selected:t})}))};this.items=[{text:"Pikachu",value:1,selected:true,icon:"pokemon",iconColor:"var(--lime-yellow)"},{text:"Charmander",value:2,selected:false,disabled:true,icon:"fire_element",iconColor:"var(--lime-red)"},{text:"Super Mario",value:3,selected:false,icon:"super_mario",iconColor:"var(--lime-deep-red)"},{text:"Yoshi",value:4,selected:false,disabled:true,icon:"easter_egg",iconColor:"var(--lime-green)"},{text:"Minion",value:6,selected:true,icon:"minion_1",iconColor:"var(--lime-blue)"},{text:"Pokéball",value:5,selected:false,icon:"pokeball",iconColor:"var(--lime-magenta)"}];this.selectedItems=[];this.selectedItems=this.items.filter((e=>!!e.selected))}render(){return[l("limel-list",{onChange:this.handleChange,items:this.items,type:"checkbox"}),l("limel-example-value",{value:this.selectedItems})]}};export{t as limel_example_list_checkbox_icons};
//# sourceMappingURL=limel-example-list-checkbox-icons.entry.js.map