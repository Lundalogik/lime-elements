import{r as e,h as i}from"./index-5f2797d5.js";const t=class{constructor(i){e(this,i),this.addDistance=!1,this.firstOnChange=e=>{this.firstValue=e.detail},this.secondOnChange=e=>{this.secondValue=e.detail},this.toggleMode=e=>{e.stopPropagation(),this.addDistance=e.detail}}render(){return i("div",{class:{"add-distance":this.addDistance}},i("section",null,i("limel-input-field",{label:"Fields shouldn't be too close!",value:this.firstValue,onChange:this.firstOnChange}),i("limel-input-field",{label:"Type something here now to see why…",helperText:"See how the label covers the previous field? Now add some distance 👇",value:this.secondValue,onChange:this.secondOnChange})),i("limel-checkbox",{label:"Then click this to add distance between fields",onChange:this.toggleMode,checked:this.addDistance}))}};t.style="section{display:grid}.add-distance section{gap:1rem}";export{t as limel_example_input_field_text_multiple}