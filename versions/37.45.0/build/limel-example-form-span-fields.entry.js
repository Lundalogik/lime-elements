import{r as t,h as e}from"./index-6156b4fd.js";const l={title:"A form with fields that span columns and rows",description:'This main form has a grid layout with 5 columns. Notice how fields reorder to fill holes when the "Dense layout" is enabled. You may need to resize your browser window to see this responsive layout in effect.',type:"object",lime:{layout:{type:"grid",columns:5,dense:true}},properties:{field1:{type:"string",title:"Nr. 1: spans 1 column"},field2:{type:"integer",title:"Nr. 2: spans 2 columns",lime:{layout:{colSpan:2}}},field3:{type:"string",title:"Nr. 3: spans 2 columns",lime:{layout:{colSpan:2}}},field4:{type:"string",title:"Nr. 4: spans 1 columns"},field5:{type:"number",title:"Nr. 6: spans 2 columns & 3 rows",lime:{component:{name:"limel-example-form-map-component"},layout:{colSpan:2,rowSpan:3}}},field6:{type:"string",title:"Nr. 5: spans 2 columns & 2 rows",lime:{component:{props:{type:"textarea"}},layout:{colSpan:2,rowSpan:2}}},field7:{type:"number",title:"Nr. 7: spans all columns",minimum:0,maximum:100,multipleOf:10,lime:{layout:{colSpan:"all"}}}}};const i=class{constructor(e){t(this,e);this.handleFormChange=t=>{this.formData=t.detail};this.handleFormValidate=t=>{this.valid=t.detail.valid;console.log(t.detail)};this.handleSubmit=()=>{const t=JSON.stringify(this.formData,null,"    ");alert(`Sending information to villains...\n\n${t}`)};this.handleCheckboxChange=t=>{this.dense=t.detail;this.schema=Object.assign({},this.schema);this.schema.lime.layout.dense=this.dense};this.formData={};this.valid=true;this.dense=true;this.schema=l}render(){return[e("limel-example-controls",{style:{"--example-controls-column-layout":"auto-fit"}},e("limel-switch",{label:"Dense layout",value:this.dense,onChange:this.handleCheckboxChange})),e("limel-form",{onChange:this.handleFormChange,onValidate:this.handleFormValidate,value:this.formData,schema:this.schema}),e("limel-button",{label:"Submit",primary:true,disabled:!this.valid,onClick:this.handleSubmit})]}};export{i as limel_example_form_span_fields};
//# sourceMappingURL=limel-example-form-span-fields.entry.js.map