import{r as t,h as i}from"./index-7dccb886.js";const s=class{constructor(i){t(this,i),this.loading=!1,this.disabled=!1}render(){return i("limel-button",{label:"Click me!",primary:!0,loading:this.loading,disabled:this.disabled,onClick:this.onClick})}onClick(){this.disabled=!0,this.loading=!0,setTimeout((()=>{this.loading=!1,setTimeout((()=>{this.disabled=!1}),5e3)}),1e3)}};export{s as limel_example_button_click_success}