import{r as e,h as t}from"./index-a55db97c.js";const i=class{constructor(t){e(this,t),this.handleChange=e=>{this.value=e.detail},this.value=void 0}render(){return t("limel-input-field",{label:"Personal identity number (YYYYMMDD-XXXX)",value:this.value,pattern:"[0-9]{8}[-][0-9]{4}",onLimelChange:this.handleChange})}};export{i as limel_example_input_field_pattern}