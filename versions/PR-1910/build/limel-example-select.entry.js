import{r as e,h as i}from"./index-5f2797d5.js";const l=class{constructor(i){e(this,i),this.disabled=!1,this.readonly=!1,this.required=!1,this.invalid=!1,this.options=[{text:"Luke Skywalker",value:"luke"},{text:"Han Solo",value:"han",disabled:!0},{text:"Leia Organo",value:"leia"}],this.changeHandler=e=>{this.value=e.detail},this.setDisabled=e=>{e.stopPropagation(),this.disabled=e.detail},this.setReadonly=e=>{e.stopPropagation(),this.readonly=e.detail},this.setRequired=e=>{e.stopPropagation(),this.required=e.detail},this.setInvalid=e=>{e.stopPropagation(),this.invalid=e.detail}}render(){return i("section",null,i("limel-select",{label:"Favorite hero",helperText:"May the force be with him or her",value:this.value,options:this.options,disabled:this.disabled,readonly:this.readonly,required:this.required,invalid:this.invalid,onChange:this.changeHandler}),i("p",null,i("limel-flex-container",{justify:"end"},i("limel-checkbox",{checked:this.disabled,label:"Disabled",onChange:this.setDisabled}),i("limel-checkbox",{checked:this.readonly,label:"Readonly",onChange:this.setReadonly}),i("limel-checkbox",{checked:this.required,label:"Required",onChange:this.setRequired}),i("limel-checkbox",{checked:this.invalid,label:"Invalid",onChange:this.setInvalid}))),i("limel-example-value",{value:this.value}))}};export{l as limel_example_select}