import{r as t,h as s}from"./index-2626b3b7.js";const i=class{constructor(s){t(this,s);this.loading=false;this.disabled=false;this.loadingFailed=false}render(){return s("limel-button",{label:"Click me!",primary:true,loading:this.loading,disabled:this.disabled,onClick:this.onClick,loadingFailed:this.loadingFailed})}onClick(){this.disabled=true;this.loading=true;this.loadingFailed=false;const t=2e3;setTimeout((()=>{this.loading=false;this.disabled=false;this.loadingFailed=true}),t)}};export{i as limel_example_button_click_fail};
//# sourceMappingURL=limel-example-button-click-fail.entry.js.map