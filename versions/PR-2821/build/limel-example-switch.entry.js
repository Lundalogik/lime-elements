import{r as e,h as i}from"./index-6156b4fd.js";const l=class{constructor(i){e(this,i);this.changeHandler=e=>{this.value=e.detail};this.setDisabled=e=>{e.stopPropagation();this.disabled=e.detail};this.setChecked=e=>{e.stopPropagation();this.value=e.detail};this.setReadonly=e=>{e.stopPropagation();this.readonly=e.detail};this.setInvalid=e=>{e.stopPropagation();this.invalid=e.detail};this.value=true;this.disabled=false;this.readonly=false;this.invalid=false}render(){return[i("limel-switch",{label:`Current value: ${this.value.toString()}`,value:this.value,disabled:this.disabled,readonly:this.readonly,onChange:this.changeHandler,invalid:this.invalid}),i("limel-example-controls",null,i("limel-checkbox",{checked:this.disabled,label:"Disabled",onChange:this.setDisabled}),i("limel-checkbox",{checked:this.readonly,label:"Readonly",onChange:this.setReadonly}),i("limel-checkbox",{checked:this.invalid,label:"Invalid",onChange:this.setInvalid}),i("limel-checkbox",{checked:this.value,label:"Selected",onChange:this.setChecked})),i("limel-example-value",{value:this.value})]}};export{l as limel_example_switch};
//# sourceMappingURL=limel-example-switch.entry.js.map