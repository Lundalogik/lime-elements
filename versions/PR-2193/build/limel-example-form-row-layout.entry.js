import{h as t,r as e}from"./index-a55db97c.js";const i=(e,i)=>{if(0===i.length)return t("div",{class:"form-group field","data-lime":JSON.stringify(e)});const n=e.layout;let o="form-group field field-custom";(null==n?void 0:n.colSpan)&&(o+=` limel-form-layout-colspan--${n.colSpan}`);const l=function(t){const e=null==t?void 0:t.rowSpan;if(e)return{"grid-row":`span ${e}`,"min-height":`calc(var(--min-height-of-one-row) * ${e})`}}(n);return t("div",{class:o,slot:e.name,style:l,"data-lime":JSON.stringify(e)},i)},n={description:"This form has the row layout",type:"object",properties:{info:{title:"Preferences",description:"These settings will not affect how others see the data. These are only for you.",type:"object",lime:{layout:{type:"row"}},properties:{language:{type:"string",title:"Language",description:"Select the app language",default:"ua",oneOf:[{type:"string",const:"sv",title:"Swedish"},{type:"string",const:"ua",title:"Ukrainian"},{type:"string",const:"en",title:"English"},{type:"string",const:"am",title:"Amharic"},{type:"string",const:"fa",title:"Farsi"}]},date:{type:"string",title:"Date format",default:"yyyy-mm-dd",lime:{layout:{icon:"calendar"}},oneOf:[{type:"string",const:"yyyy-mm-dd",title:"1999-01-31"},{type:"string",const:"yyyy.dd.mm",title:"1999.01.31"},{type:"string",const:"yyyy/dd/mm",title:"1999/01/31"}]},notification:{type:"boolean",title:"Receive email notifications"},frequency:{type:"number",title:"Frequency of notifications",description:"How many times per day can we sent you email notifications at most?",minimum:0,maximum:10,multipleOf:1,lime:{layout:{icon:"notification_center_92458"}}},personalNumber:{type:"integer",title:"Personal identity number",lime:{layout:{icon:"numbers_input_form"}}}}}}},o=class{constructor(t){e(this,t),this.handleFormChange=t=>{this.formData=t.detail},this.formData={}}render(){return[t("limel-form",{onChange:this.handleFormChange,value:this.formData,schema:n},t(i,{name:"info.language",layout:{icon:"globe"}}),t(i,{name:"info.notification",layout:{icon:"filled_message"}},t("limel-switch",null)))]}};export{o as limel_example_form_row_layout}