import{r as e,h as i}from"./index-2626b3b7.js";const l=class{constructor(i){e(this,i);this.handleChange=e=>{this.value=e.detail};this.setDisabled=e=>{e.stopPropagation();this.disabled=e.detail};this.setReadonly=e=>{e.stopPropagation();this.readonly=e.detail};this.setRequired=e=>{e.stopPropagation();this.required=e.detail};this.required=false;this.disabled=false;this.readonly=false;this.value=undefined}render(){const e=500;return[i("limel-input-field",{label:"Job description",type:"textarea",placeholder:"What is your dream job? Describe it here...",helperText:"This text will be displayed in your profile",maxlength:e,value:this.value,required:this.required,onChange:this.handleChange,disabled:this.disabled,readonly:this.readonly}),i("limel-example-controls",null,i("limel-checkbox",{onChange:this.setDisabled,label:"Disabled"}),i("limel-checkbox",{onChange:this.setReadonly,label:"Readonly"}),i("limel-checkbox",{onChange:this.setRequired,label:"Required"})),i("limel-example-value",{value:this.value})]}};export{l as limel_example_input_field_textarea};
//# sourceMappingURL=limel-example-input-field-textarea.entry.js.map