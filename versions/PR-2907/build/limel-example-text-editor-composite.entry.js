import{r as e,h as l}from"./index-6156b4fd.js";const t=":host(limel-example-text-editor-composite){display:grid;gap:1rem}";const i=class{constructor(l){e(this,l);this.handleChange=e=>{e.stopPropagation();this.text=e.detail};this.handlePlaceholderChange=e=>{e.stopPropagation();this.placeholder=e.detail};this.text={html:""};this.placeholder=undefined}render(){return[l("limel-text-editor",{placeholder:this.placeholder,onChange:this.handleChange}),l("limel-example-controls",null,l("limel-input-field",{label:"Placeholder",value:this.placeholder,onChange:this.handlePlaceholderChange})),l("hr",null),l("limel-example-value",{value:this.text})]}};i.style=t;export{i as limel_example_text_editor_composite};
//# sourceMappingURL=limel-example-text-editor-composite.entry.js.map