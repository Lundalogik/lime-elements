import{r as e,h as i}from"./index-6156b4fd.js";const l=class{constructor(i){e(this,i);this.setReadonly=e=>{e.stopPropagation();this.readonly=e.detail};this.setInvalid=e=>{e.stopPropagation();this.invalid=e.detail};this.handleLabelChange=e=>{e.stopPropagation();this.label=e.detail};this.handleHelperTextChange=e=>{e.stopPropagation();this.helperText=e.detail};this.handlePlaceholderChange=e=>{e.stopPropagation();this.placeholder=e.detail};this.handleChange=e=>{this.value=e.detail};this.value="Hello, world!";this.readonly=false;this.invalid=false;this.label=undefined;this.placeholder=undefined;this.helperText=undefined}render(){return[i("limel-text-editor",{label:this.label,helperText:this.helperText,value:this.value,onChange:this.handleChange,readonly:this.readonly,invalid:this.invalid,placeholder:this.placeholder}),i("limel-example-controls",null,i("limel-checkbox",{checked:this.readonly,label:"Readonly",onChange:this.setReadonly}),i("limel-checkbox",{checked:this.invalid,label:"Invalid",onChange:this.setInvalid}),i("limel-input-field",{label:"label",value:this.label,onChange:this.handleLabelChange}),i("limel-input-field",{label:"helperText",value:this.helperText,onChange:this.handleHelperTextChange}),i("limel-input-field",{label:"placeholder",value:this.placeholder,onChange:this.handlePlaceholderChange})),i("limel-example-value",{value:this.value})]}};export{l as limel_example_text_editor_composite};
//# sourceMappingURL=limel-example-text-editor-composite.entry.js.map