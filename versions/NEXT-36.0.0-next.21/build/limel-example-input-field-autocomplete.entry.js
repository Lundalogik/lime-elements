import{r as e,h as i}from"./index-7dccb886.js";const t=class{constructor(i){e(this,i),this.required=!1,this.disabled=!1,this.readonly=!1,this.invalid=!1,this.completions=["Lundalogik AB","Lundalogik AS","SAAB AB","Lundalogistik & Spedition AB","Aftonbladet AB","Expressen AB","Swedbank","Handelsbanken","Väderstad"],this.handleChange=e=>{this.value=e.detail},this.setDisabled=e=>{e.stopPropagation(),this.disabled=e.detail},this.setReadonly=e=>{e.stopPropagation(),this.readonly=e.detail},this.setRequired=e=>{e.stopPropagation(),this.required=e.detail}}render(){return[i("limel-input-field",{label:"Autocomplete",value:this.value,completions:this.completions,required:this.required,invalid:this.invalid,disabled:this.disabled,readonly:this.readonly,onChange:this.handleChange}),i("p",null,i("limel-flex-container",{justify:"end"},i("limel-checkbox",{checked:this.disabled,label:"Disabled",onChange:this.setDisabled}),i("limel-checkbox",{checked:this.readonly,label:"Readonly",onChange:this.setReadonly}),i("limel-checkbox",{checked:this.required,label:"Required",onChange:this.setRequired}))),i("limel-example-value",{value:this.value})]}checkValidity(){this.invalid=this.required&&!this.value}static get watchers(){return{required:["checkValidity"]}}};export{t as limel_example_input_field_autocomplete}