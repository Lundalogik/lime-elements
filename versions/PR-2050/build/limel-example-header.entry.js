import{r as i,h as e}from"./index-a55db97c.js";const t=class{constructor(t){i(this,t),this.actions=[{id:"1",icon:"multiply",label:"Close"}],this.renderActionButton=i=>e("limel-icon-button",{icon:i.icon,label:i.label,onClick:this.handleActionClick(i)}),this.handleActionClick=i=>e=>{e.stopPropagation(),console.log(i)}}render(){return e("limel-header",{icon:"brake_warning",heading:"Useful information",subheading:"Note",supportingText:"Data couldn't be loaded!"},this.renderActions())}renderActions(){if(this.actions)return e("div",{class:"actions"},this.actions.map(this.renderActionButton))}};export{t as limel_example_header}