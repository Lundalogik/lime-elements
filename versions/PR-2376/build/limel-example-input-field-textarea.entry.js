import{r as e,h as i}from"./index-a55db97c.js";const l=class{constructor(i){e(this,i),this.handleChange=e=>{this.value=e.detail},this.setDisabled=e=>{e.stopPropagation(),this.disabled=e.detail},this.setReadonly=e=>{e.stopPropagation(),this.readonly=e.detail},this.setRequired=e=>{e.stopPropagation(),this.required=e.detail},this.required=!1,this.disabled=!1,this.readonly=!1,this.value=void 0}render(){return[i("limel-input-field",{label:"Job description",type:"textarea",placeholder:"What is your dream job? Describe it here...",helperText:"This text will be displayed in your profile",maxlength:500,value:this.value,required:this.required,onLimelChange:this.handleChange,disabled:this.disabled,readonly:this.readonly}),i("limel-example-controls",null,i("limel-checkbox",{onLimelChange:this.setDisabled,label:"Disabled"}),i("limel-checkbox",{onLimelChange:this.setReadonly,label:"Readonly"}),i("limel-checkbox",{onLimelChange:this.setRequired,label:"Required"})),i("limel-example-value",{value:this.value})]}};export{l as limel_example_input_field_textarea}