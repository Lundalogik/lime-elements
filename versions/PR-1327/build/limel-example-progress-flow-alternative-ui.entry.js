import{r as e,h as r}from"./index-5f2797d5.js";const o=class{constructor(r){e(this,r),this.handleChange=e=>{this.flowItems=this.flowItems.map((r=>{var o;return Object.assign(Object.assign({},r),{selected:r.value===(null===(o=e.detail)||void 0===o?void 0:o.value)})}))},this.flowItems=[{value:"placemend",text:"Order placed",secondaryText:"Yesterday, 19:37",icon:"add_shopping_cart",selectedColor:"rgb(var(--color-orange-default))"},{value:"payment",text:"Payment successful",secondaryText:"Credit card",icon:"money",selectedColor:"rgb(var(--color-green-default))"},{value:"confirmation",text:"Order confirmed",secondaryText:"Today, 07:15",selected:!0,icon:"ok",selectedColor:"rgb(var(--color-sky-default))"},{value:"process",text:"Order processed",selectedColor:"rgb(var(--color-teal-default))",icon:"packaging"},{value:"shipment",text:"Ready to pickup",selectedColor:"rgb(var(--color-teal-default))",icon:"agreement"},{value:"cancel",text:"Order cancelled",isOffProgress:!0,icon:"return_purchase",iconColor:"rgb(var(--color-red-dark))",selectedColor:"rgb(var(--color-red-dark))"},{value:"returned",text:"Package retuned",isOffProgress:!0,icon:"return",iconColor:"rgb(var(--color-coral-default))",selectedColor:"rgb(var(--color-coral-default))"}]}render(){return r("limel-progress-flow",{flowItems:this.flowItems,onChange:this.handleChange,class:"has-detached-steps",readonly:!0})}};export{o as limel_example_progress_flow_alternative_ui}