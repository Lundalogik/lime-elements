import{r as e,h as t}from"./index-5f2797d5.js";const o=class{constructor(t){e(this,t),this.flowItems=[{value:"1",text:"Todo",icon:"add_ticket",secondaryText:"Added: 2021-May-26"},{value:"2",text:"Working on it",icon:"outgoing_data",selected:!0,secondaryText:"Started: 2021-May-27"},{value:"3",text:"Done",icon:"ok"}],this.handleChange=e=>{this.flowItems=this.flowItems.map((t=>{var o;return Object.assign(Object.assign({},t),{selected:t.value===(null===(o=e.detail)||void 0===o?void 0:o.value)})}))}}render(){return t("limel-progress-flow",{flowItems:this.flowItems,onChange:this.handleChange})}};export{o as limel_example_progress_flow_secondary_text}