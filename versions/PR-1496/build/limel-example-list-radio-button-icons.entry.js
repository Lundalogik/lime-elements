import{r as e,h as i}from"./index-a7da85d2.js";let l=class{constructor(i){e(this,i),this.items=[{text:"Pikachu",value:1,selected:!1,icon:"pokemon",iconColor:"var(--lime-yellow)",component:{name:"limel-circular-progress",props:{value:5,maxValue:10,suffix:"%"}}},{text:"Charmander",value:2,selected:!1,disabled:!0,icon:"fire_element",iconColor:"var(--lime-red)"},{text:"Super Mario",value:3,selected:!1,icon:"super_mario",iconColor:"var(--lime-deep-red)"},{text:"Yoshi",value:4,selected:!1,disabled:!0,icon:"easter_egg",iconColor:"var(--lime-green)"},{text:"Minion",value:6,selected:!0,icon:"minion_1",iconColor:"var(--lime-blue)"},{text:"Pokéball",value:5,selected:!1,icon:"pokeball",iconColor:"var(--lime-magenta)"}],this.handleChange=e=>{this.selectedItem=e.detail,this.items=this.items.map((i=>i.value===e.detail.value?e.detail:i))},this.selectedItem=this.items.filter((e=>!!e.selected))[0]}render(){return[i("limel-list",{onChange:this.handleChange,items:this.items,type:"radio"}),i("limel-example-value",{value:this.selectedItem})]}};export{l as limel_example_list_radio_button_icons}