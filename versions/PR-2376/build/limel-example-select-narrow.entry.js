import{r as e,h as a}from"./index-a55db97c.js";const t=class{constructor(a){e(this,a),this.options=[{text:"Luke Skywalker",value:"luke",icon:"businessman"},{text:"Han Solo",value:"han",icon:"human_head"},{text:"Leia Organo",value:"leia",icon:"businesswoman"},{text:"R2",value:"r2",icon:"robot"}],this.handleChange=e=>{this.value=e.detail},this.value={text:"select a colleague",value:"colleague",disabled:!0}}render(){return a("limel-header",{icon:"combo_chart",heading:"Sale performance",subheading:"Choose a colleague to see their statistics"},a("limel-select",{class:"is-narrow",value:this.value,options:this.options,onLimelChange:this.handleChange}))}};t.style="limel-header{max-width:35rem;margin:0 auto}limel-select{margin-right:0.25rem}";export{t as limel_example_select_narrow}