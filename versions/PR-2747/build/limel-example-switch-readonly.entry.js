import{r as e,h as l}from"./index-6156b4fd.js";const s=class{constructor(l){e(this,l);this.setReadonly=e=>{e.stopPropagation();this.readonly=e.detail};this.setSelected=e=>{e.stopPropagation();this.value=e.detail};this.setDisabled=e=>{e.stopPropagation();this.disabled=e.detail};this.setInvalid=e=>{e.stopPropagation();this.invalid=e.detail};this.readonly=true;this.value=true;this.disabled=false;this.invalid=false}render(){return[l("limel-switch",{label:"Subscribe to email newsletters",readonlyTrueIcon:"news",readonlyFalseIcon:{name:"cancel_subscription",color:"rgb(var(--color-orange-default))"},readonlyTrueLabel:"Is subscribed to receive newsletters",readonlyFalseLabel:"Is unsubscribed from newsletters",helperText:this.invalid?"Something is wrong":"",value:this.value,disabled:this.disabled,readonly:this.readonly,invalid:this.invalid}),l("limel-example-controls",null,l("limel-checkbox",{checked:this.readonly,label:"Readonly",onChange:this.setReadonly}),l("limel-checkbox",{checked:this.disabled,label:"Disabled",onChange:this.setDisabled}),l("limel-checkbox",{checked:this.invalid,label:"Invalid",onChange:this.setInvalid}),l("limel-checkbox",{checked:this.value,label:"Selected",onChange:this.setSelected})),l("limel-example-value",{value:this.value})]}};export{s as limel_example_switch_readonly};
//# sourceMappingURL=limel-example-switch-readonly.entry.js.map