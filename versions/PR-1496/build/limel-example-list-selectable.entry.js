import{r as e,h as t}from"./index-a7da85d2.js";let a=class{constructor(t){e(this,t),this.items=[{text:"King of Tokyo",value:1,component:{name:"limel-circular-progress",props:{value:5,maxValue:10,suffix:"%"}}},{text:"Smash Up!",value:2},{text:"Pandemic",value:3,selected:!0},{separator:!0},{text:"Catan",value:4},{text:"Ticket to Ride",value:5}],this.handleChange=e=>{this.items=this.items.map((t=>t.value===e.detail.value?e.detail:t))}}render(){return t("limel-list",{onChange:this.handleChange,type:"selectable",items:this.items})}};export{a as limel_example_list_selectable}