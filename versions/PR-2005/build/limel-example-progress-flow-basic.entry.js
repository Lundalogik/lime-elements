import{r as e,h as t}from"./index-5f2797d5.js";const s=class{constructor(t){e(this,t),this.handleChange=e=>{this.flowItems=this.flowItems.map((t=>{var s;return Object.assign(Object.assign({},t),{selected:t.value===(null===(s=e.detail)||void 0===s?void 0:s.value)})}))},this.setDisabled=e=>{e.stopPropagation(),this.disabled=e.detail},this.setReadonly=e=>{e.stopPropagation(),this.readonly=e.detail},this.disabled=!1,this.readonly=!1,this.flowItems=[{value:"1",text:"Step 1",selected:!0,icon:"add_shopping_cart"},{value:"2",text:"Step 2",icon:"shopping_cart_loaded"},{value:"3",text:"Step 3",icon:"insert_money_euro"}]}render(){return[t("limel-progress-flow",{flowItems:this.flowItems,onChange:this.handleChange,disabled:this.disabled,readonly:this.readonly}),t("limel-example-controls",null,t("limel-checkbox",{checked:this.disabled,label:"Disabled",onChange:this.setDisabled}),t("limel-checkbox",{checked:this.readonly,label:"Readonly",onChange:this.setReadonly})),t("limel-example-value",{value:this.flowItems.find((e=>e.selected))})]}};export{s as limel_example_progress_flow_basic}