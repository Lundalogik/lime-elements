import{r as e,h as t}from"./index-ab490ba1.js";const s=class{constructor(t){e(this,t),this.flowItems=[{value:"first",text:"First step",selected:!0},{value:"second",text:"Second step"},{value:"third",text:"Third step"},{value:"fourth",text:"Fourth step",icon:"finish_flag"}],this.handleChange=e=>{this.flowItems=this.flowItems.map((t=>{var s;return Object.assign(Object.assign({},t),{selected:t.value===(null===(s=e.detail)||void 0===s?void 0:s.value)})}))}}render(){return t("limel-progress-flow",{flowItems:this.flowItems,onChange:this.handleChange,class:"is-narrow"})}};export{s as limel_example_progress_flow_narrow}