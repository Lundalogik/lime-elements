import{r as e,h as i}from"./index-a55db97c.js";const l=class{constructor(i){e(this,i),this.renderBranded=e=>{e.stopPropagation(),this.limeBranded=e.detail},this.limeBranded=!0}render(){return[i("limel-spinner",{size:"medium",limeBranded:this.limeBranded}),i("limel-example-controls",{style:{"--example-controls-column-layout":"auto-fit"}},i("limel-checkbox",{checked:this.limeBranded,label:"Lime branded (default design)",onLimelChange:this.renderBranded}))]}};export{l as limel_example_spinner}