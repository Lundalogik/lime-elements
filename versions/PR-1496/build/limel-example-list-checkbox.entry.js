import{r as e,h as t}from"./index-a7da85d2.js";let s=class{constructor(t){e(this,t),this.items=[{text:"Pikachu",value:1,selected:!0,primaryComponent:{name:"limel-circular-progress",props:{value:5,maxValue:10,suffix:"%"}}},{text:"Charmander",value:2,selected:!1,disabled:!0},{text:"Super Mario",value:3,selected:!1},{separator:!0},{text:"Yoshi",value:4,selected:!1,disabled:!0},{text:"Minion",value:6,selected:!0},{text:"Pokéball",value:5,selected:!1}],this.selectedItems=[],this.handleChange=e=>{this.selectedItems=e.detail,this.items=this.items.map((t=>{const s=!!e.detail.find((e=>e.value===t.value));return Object.assign(Object.assign({},t),{selected:s})}))},this.selectedItems=this.items.filter((e=>!!e.selected))}render(){return[t("limel-list",{onChange:this.handleChange,items:this.items,type:"checkbox"}),t("limel-example-value",{value:this.selectedItems})]}};export{s as limel_example_list_checkbox}