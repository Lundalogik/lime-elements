import{r as t,h as i}from"./index-a55db97c.js";const e=class{constructor(i){t(this,i),this.handleChange=t=>{const i=t.detail;console.log(i),this.buttons=this.buttons.map((t=>Object.assign(Object.assign({},t),{selected:t.id===i.id})))},this.toggleEnabled=()=>{this.disabled=!this.disabled},this.disabled=!1,this.buttons=[{id:"1",title:"Clear sky",icon:"sun"},{id:"2",title:"Partly cloudy",icon:"partly_cloudy_day"},{id:"3",title:"Rain showers",icon:"rain"},{id:"4",title:"Thunderstorms",icon:"cloudshot"},{id:"5",title:"Snow showers",icon:"snowflake"}]}render(){return[i("limel-button-group",{disabled:this.disabled,onChange:this.handleChange,value:this.buttons}),i("limel-example-controls",null,i("limel-checkbox",{label:"Disabled",onChange:this.toggleEnabled,checked:this.disabled}))]}};export{e as limel_example_button_group_icons}