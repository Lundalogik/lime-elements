import{r as e,h as t}from"./index-5f2797d5.js";import{m as i}from"./moment-faa8a4a8.js";import"./_commonjsHelpers-5ec8f9b7.js";const a=class{constructor(t){e(this,t),this.handleChange=e=>{this.value=e.detail},this.addOneHour=()=>{this.value=i(this.value).add(1,"hour").toDate()},this.value=new Date}render(){return[t("limel-button",{onClick:this.addOneHour,label:"Add one hour",style:{"margin-bottom":"1rem"}}),t("limel-date-picker",{type:"datetime",label:"datetime",value:this.value,onChange:this.handleChange}),t("limel-example-value",{value:this.value})]}};export{a as limel_example_date_picker_programmatic_change}