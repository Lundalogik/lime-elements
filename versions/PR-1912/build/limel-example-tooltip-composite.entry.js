import{r as e,h as t}from"./index-5f2797d5.js";const l=class{constructor(t){e(this,t),this.props={label:"Search",helperLabel:"alt + F",maxlength:50},this.handleChange=e=>{this.props=e.detail}}componentWillLoad(){this.schema=Object.assign(Object.assign({},this.schema),{lime:{layout:{type:"grid"}}}),delete this.schema.properties.elementId}render(){return[t("limel-button",{icon:"search",id:"tooltip-example"}),t("limel-tooltip",Object.assign({},this.props,{elementId:"tooltip-example"})),this.renderForm()]}renderForm(){return t("limel-collapsible-section",{header:"Settings"},t("limel-form",{schema:this.schema,value:this.props,onChange:this.handleChange}))}};export{l as limel_example_tooltip_composite}