import{r as e,h as i}from"./index-6156b4fd.js";const t=".picture-dropzone,.video-picture-dropzone{min-height:5rem;background-color:rgb(var(--contrast-600));border-radius:0.5rem;margin-bottom:0.5rem}.video-picture-dropzone{min-height:10rem;border:1px solid rgb(var(--contrast-800))}p{padding-left:0.5rem}";const r=class{constructor(i){e(this,i);this.handleAcceptedFiles=e=>{this.files=[...this.files.concat(e.detail)]};this.handleRejectedFiles=e=>{this.rejectedFiles=[...this.rejectedFiles.concat(e.detail)]};this.files=[];this.rejectedFiles=[]}render(){return[i("limel-file-dropzone",{class:"picture-dropzone",onFilesSelected:this.handleAcceptedFiles,onFilesRejected:this.handleRejectedFiles,accept:"image/*",text:"Drop pictures here"},i("limel-input-field",{label:"Dream pet description",type:"textarea",placeholder:"What is your dream pet? Describe it here and attach a picture of it.",helperText:"This text will be displayed in your profile"})),i("limel-file-dropzone",{class:"video-picture-dropzone",onFilesSelected:this.handleAcceptedFiles,onFilesRejected:this.handleRejectedFiles,text:"Drop video or pictures here",helperText:"Accepted file types: image/*, video/*",accept:"image/*, video/*"},i("p",null,"Upload image and video files")),this.files.map((e=>i("limel-chip",{text:e.filename,icon:e.icon}))),i("limel-example-value",{value:this.files}),i("limel-example-value",{value:this.rejectedFiles})]}};r.style=t;export{r as limel_example_file_dropzone_type_filtering};
//# sourceMappingURL=limel-example-file-dropzone-type-filtering.entry.js.map