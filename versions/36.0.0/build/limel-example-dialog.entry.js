import{r as i,h as l}from"./index-ab490ba1.js";const t=class{constructor(l){i(this,l),this.isOpen=!1,this.openDialog=()=>{this.isOpen=!0},this.closeDialog=()=>{this.isOpen=!1}}render(){return[l("limel-button",{primary:!0,label:"Open",onClick:this.openDialog}),l("limel-dialog",{open:this.isOpen,onClose:this.closeDialog},l("p",null,"This is a simple alert-dialog."),l("limel-button",{label:"Ok",onClick:this.closeDialog,slot:"button"}))]}};export{t as limel_example_dialog}