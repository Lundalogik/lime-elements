import{r as e,h as t}from"./index-5f2797d5.js";const i=class{constructor(t){e(this,t),this.directionOptions=[{text:"Horizontal",value:"horizontal"},{text:"Vertical",value:"vertical"}],this.alignOptions=[{value:"start",text:"Start"},{value:"center",text:"Center"},{value:"end",text:"End"},{value:"stretch",text:"Stretch"}],this.justifyOptions=[{value:"start",text:"Start"},{value:"center",text:"Center"},{value:"end",text:"End"},{value:"space-around",text:"Space around"},{value:"space-between",text:"Space between"},{value:"space-evenly",text:"Space evenly"}],this.directionOnChange=e=>{this.direction=e.detail},this.alignOnChange=e=>{this.align=e.detail},this.justifyOnChange=e=>{this.justify=e.detail},this.reverseOnChange=e=>{this.reverse=e.detail},this.direction=void 0,this.align=void 0,this.justify=void 0,this.reverse=!1}componentWillLoad(){this.direction=this.directionOptions[0],this.align=this.alignOptions[0],this.justify=this.justifyOptions[0]}render(){return[t("limel-flex-container",{justify:"space-between"},t("limel-select",{label:"Direction",options:this.directionOptions,value:this.direction,onChange:this.directionOnChange}),t("limel-select",{label:"Align",options:this.alignOptions,value:this.align,onChange:this.alignOnChange}),t("limel-select",{label:"Justify",options:this.justifyOptions,value:this.justify,onChange:this.justifyOnChange}),t("limel-checkbox",{label:"Reverse",checked:this.reverse,onChange:this.reverseOnChange})),t("limel-flex-container",{class:"container",direction:this.direction.value,align:this.align.value,justify:this.justify.value,reverse:this.reverse},t("div",null,"1"),t("div",null,"2"),t("div",null,"3"),t("div",null,"4"),t("div",null,"5"))]}};i.style="limel-flex-container{margin-bottom:1.25rem}limel-flex-container.container{height:37.5rem;border:0.0625rem solid var(--lime-dark-grey);border-radius:0.1875rem}limel-flex-container div{display:block;padding:1.5625rem 3.125rem;text-align:center;color:white;font-size:1.25rem;line-height:0}limel-flex-container div:nth-child(1){background-color:rgb(var(--color-coral-light));padding:0.78125rem 3.125rem}limel-flex-container div:nth-child(2){background-color:rgb(var(--color-amber-default));padding:3.125rem}limel-flex-container div:nth-child(3){background-color:rgb(var(--color-green-light))}limel-flex-container div:nth-child(4){background-color:rgb(var(--color-sky-light));padding:1.5625rem 6.25rem}limel-flex-container div:nth-child(5){background-color:rgb(var(--color-magenta-default));padding:1.5625rem}";export{i as limel_example_flex_container}