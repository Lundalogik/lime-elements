import{r as e,h as l}from"./index-11aed7da.js";let r=class{constructor(l){e(this,l),this.value=.7,this.handleChange=e=>{this.value=+e.detail/100}}render(){return[l("limel-input-field",{label:"Value",type:"number",value:(100*this.value).toFixed(0),onChange:this.handleChange}),l("p",null,l("limel-linear-progress",{value:this.value}))]}};export{r as limel_example_linear_progress}