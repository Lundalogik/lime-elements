import{r as e,h as l}from"./index-5f2797d5.js";const i=class{constructor(l){e(this,l),this.handleChange=e=>{this.value=e.detail},this.setDisabled=e=>{e.stopPropagation(),this.disabled=e.detail},this.setReadonly=e=>{e.stopPropagation(),this.readonly=e.detail},this.setRequired=e=>{e.stopPropagation(),this.required=e.detail},this.required=!1,this.disabled=!1,this.readonly=!1,this.value=void 0}render(){return[l("limel-input-field",{label:"Text Field",type:"textarea",helperText:"Please enter a useful message!",maxlength:500,value:this.value,required:this.required,onChange:this.handleChange,disabled:this.disabled,readonly:this.readonly}),l("limel-example-controls",null,l("limel-checkbox",{onChange:this.setDisabled,label:"Disabled"}),l("limel-checkbox",{onChange:this.setReadonly,label:"Readonly"}),l("limel-checkbox",{onChange:this.setRequired,label:"Required"})),l("limel-example-value",{value:this.value})]}};export{i as limel_example_input_field_textarea}