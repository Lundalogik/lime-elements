import{r as t,h as e}from"./index-a55db97c.js";const i=class{constructor(e){t(this,e),this.handleEvent=t=>{this.eventPrinter.writeEvent(t)},this.handleChange=t=>{this.props=t.detail},this.schema=void 0,this.props={label:"My button",primary:!0,outlined:!1,icon:"dog",disabled:!1,loading:!1}}componentWillLoad(){this.schema=Object.assign(Object.assign({},this.schema),{lime:{layout:{type:"grid"}}})}render(){return[e("limel-button",Object.assign({},this.props,{onClick:this.handleEvent})),this.renderForm(),e("kompendium-example-event-printer",{ref:t=>this.eventPrinter=t})]}renderForm(){return e("kompendium-example-controls",{style:{"--example-controls-column-layout":"auto-fit"}},e("limel-form",{schema:this.schema,value:this.props,onChange:this.handleChange}))}};export{i as limel_example_button_composite}