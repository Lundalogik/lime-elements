import{r as t,h as e}from"./index-a55db97c.js";const i=class{constructor(e){t(this,e),this.handleChange=t=>{this.value=t.detail},this.value=void 0}render(){return e("limel-input-field",{label:"Personal identity number (YYYYMMDD-XXXX)",value:this.value,pattern:"[0-9]{8}[-][0-9]{4}",onChange:this.handleChange})}};export{i as limel_example_input_field_pattern}