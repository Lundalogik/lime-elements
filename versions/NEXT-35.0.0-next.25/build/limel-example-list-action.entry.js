import{r as e,h as t}from"./index-11aed7da.js";let i=class{constructor(t){e(this,t),this.actionItems=[{text:"Go to my fab object",value:10},{text:"Delete object",value:11}],this.items=[{text:"King of Tokyo",value:1,icon:"gorilla",actions:this.actionItems},{text:"Smash Up!",value:2,icon:"alien"},{text:"Pandemic",value:3,icon:"virus"},{text:"Catan",value:4,icon:"wheat"},{text:"Ticket to Ride",value:5,icon:"steam_engine"}]}render(){return t("limel-list",{items:this.items,onSelect:this.onSelectAction})}onSelectAction(e){console.log("Executing action: ",e.detail)}};export{i as limel_example_list_action}