import{r as e,h as s}from"./index-a55db97c.js";const r=class{constructor(s){e(this,s),this.handleChange=e=>{this.value=+e.detail},this.value=5}render(){return[s("limel-input-field",{label:"Value",type:"number",value:`${this.value}`,onLimelChange:this.handleChange}),s("limel-circular-progress",{value:this.value,displayPercentageColors:!0})]}};r.style=":host{display:flex;gap:2rem;align-items:center;justify-content:space-between}";export{r as limel_example_circular_progress_percentage_colors}