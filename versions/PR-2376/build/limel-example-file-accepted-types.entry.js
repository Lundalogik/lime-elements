import{r as e,h as i}from"./index-a55db97c.js";const t=class{constructor(i){e(this,i),this.handleChange=e=>{this.value=e.detail,console.log("onChange",this.value)},this.value={filename:"picture.jpg",id:123},this.required=!1}render(){return[i("limel-file",{label:"Attach only images (png, jpeg)",onLimelChange:this.handleChange,required:this.required,value:this.value,accept:"image/jpeg,image/png"})]}};export{t as limel_example_file_accepted_types}