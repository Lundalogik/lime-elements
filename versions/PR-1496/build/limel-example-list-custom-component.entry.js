import{r as e,h as s}from"./index-a7da85d2.js";let a=class{constructor(s){e(this,s),this.actionItems=[{text:"Go to my fab object",value:10},{text:"Delete object",value:11}],this.items=[{text:"King of Tokyo",secondaryText:"2 players",value:1,actions:this.actionItems,component:{name:"limel-circular-progress",props:{value:5,maxValue:10,suffix:"%",displayPercentageColors:!0}}},{text:"Smash Up!",secondaryText:"2-5 players",value:2,component:{name:"limel-circular-progress",props:{value:1,maxValue:10,suffix:"%",displayPercentageColors:!0}}},{text:"Pandemic",secondaryText:"2-4 players",value:3,component:{name:"limel-circular-progress",props:{value:8,maxValue:10,suffix:"%",displayPercentageColors:!0}}},{text:"Ticket to Ride",secondaryText:"1-3 players",value:5,component:{name:"limel-circular-progress",props:{value:3,maxValue:10,suffix:"%",displayPercentageColors:!0}}}]}render(){return s("limel-list",{items:this.items,onSelect:this.onSelectAction,class:"has-striped-rows"})}onSelectAction(e){console.log("Executing action: ",e.detail)}};export{a as limel_example_list_custom_component}