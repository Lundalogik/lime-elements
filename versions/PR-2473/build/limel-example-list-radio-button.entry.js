import{r as e,h as t}from"./index-f1b3d5fb.js";const s=class{constructor(t){e(this,t);this.handleChange=e=>{this.selectedItem=e.detail;this.items=this.items.map((t=>{if(t.value===e.detail.value){return e.detail}return t}))};this.items=[{text:"Pikachu",value:1,selected:false},{text:"Charmander",value:2,selected:false,disabled:true},{text:"Super Mario",value:3,selected:false},{separator:true},{text:"Yoshi",value:4,selected:false,disabled:true},{text:"Minion",value:6,selected:true},{text:"Pokéball",value:5,selected:false}];this.selectedItem=undefined;this.selectedItem=this.items.filter((e=>!!e.selected))[0]}render(){return[t("limel-list",{onChange:this.handleChange,items:this.items,type:"radio"}),t("limel-example-value",{value:this.selectedItem})]}};export{s as limel_example_list_radio_button};
//# sourceMappingURL=limel-example-list-radio-button.entry.js.map