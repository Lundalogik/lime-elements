import{r as e,h as t}from"./index-a55db97c.js";const i=class{constructor(t){e(this,t),this.handleChange=e=>{this.eventPrinter.writeEvent(e)},this.handleFormChange=e=>{this.props=Object.assign({},e.detail)},this.schema=void 0,this.props={label:"Attach a file",value:{id:"123",filename:"document.pdf"},language:"en"}}componentWillLoad(){this.schema.lime={layout:{type:"grid"}},this.schema.properties.value.lime={layout:{type:"grid"}}}render(){return[t("limel-file",Object.assign({},this.props,{onChange:this.handleChange})),this.renderForm(),t("kompendium-example-event-printer",{ref:e=>this.eventPrinter=e})]}renderForm(){return t("kompendium-example-controls",{style:{"--example-controls-column-layout":"auto-fit"}},t("limel-form",{schema:this.schema,value:this.props,onChange:this.handleFormChange}))}};export{i as limel_example_file_composite}