import{r as e,h as i}from"./index-6156b4fd.js";const t=class{constructor(i){e(this,i);this.handleChange=e=>{this.value=e.detail};this.setDisabled=e=>{e.stopPropagation();this.disabled=e.detail};this.setReadonly=e=>{e.stopPropagation();this.readonly=e.detail};this.setRequired=e=>{e.stopPropagation();this.required=e.detail};this.setInvalid=e=>{e.stopPropagation();this.invalid=e.detail};this.required=false;this.disabled=false;this.readonly=false;this.invalid=false;this.value=undefined}render(){const e=15;return[i("limel-input-field",{label:"Text Field",helperText:"Please enter a useful message!",maxlength:e,value:this.value,required:this.required,invalid:this.invalid,disabled:this.disabled,readonly:this.readonly,onChange:this.handleChange}),i("limel-example-controls",null,i("limel-checkbox",{checked:this.disabled,label:"Disabled",onChange:this.setDisabled}),i("limel-checkbox",{checked:this.readonly,label:"Readonly",onChange:this.setReadonly}),i("limel-checkbox",{checked:this.required,label:"Required",onChange:this.setRequired}),i("limel-checkbox",{checked:this.invalid,label:"Invalid",onChange:this.setInvalid})),i("limel-example-value",{value:this.value})]}checkValidity(){this.invalid=this.required&&!this.value}static get watchers(){return{required:["checkValidity"],value:["checkValidity"]}}};export{t as limel_example_input_field_text};
//# sourceMappingURL=limel-example-input-field-text.entry.js.map