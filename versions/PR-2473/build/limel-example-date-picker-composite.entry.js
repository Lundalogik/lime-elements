import{r as e,h as t}from"./index-f1b3d5fb.js";const i=class{constructor(t){e(this,t);this.key=0;this.handleFormChange=e=>{const t=this.props.value;this.props=Object.assign(Object.assign({},e.detail),{value:t});this.key+=1};this.handlePickerChange=e=>{this.handleEvent(e);this.props=Object.assign(Object.assign({},this.props),{value:e.detail})};this.handleEvent=e=>{this.eventPrinter.writeEvent(e)};this.schema=undefined;this.props={helperText:"Please add a date",label:"Date",language:"en",type:"date",value:new Date}}componentWillLoad(){const e=Object.assign({},this.schema.properties);delete e.formatter;this.schema=Object.assign(Object.assign({},this.schema),{properties:e,lime:{layout:{type:"grid"}}})}render(){return[t("limel-date-picker",Object.assign({key:`updateOnFormChange-${this.key}`},this.props,{onChange:this.handlePickerChange})),this.renderForm(),t("limel-example-event-printer",{ref:e=>this.eventPrinter=e})]}renderForm(){return t("limel-example-controls",{style:{"--example-controls-column-layout":"auto-fit"}},t("limel-form",{schema:this.schema,value:this.props,onChange:this.handleFormChange}))}};export{i as limel_example_date_picker_composite};
//# sourceMappingURL=limel-example-date-picker-composite.entry.js.map