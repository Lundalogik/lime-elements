import{r as e,h as t,g as n}from"./index-2626b3b7.js";const s=class{constructor(t){e(this,t);this.triggerSnackbarWithAction=this.triggerSnackbar.bind(this,"limel-snackbar")}render(){const e=7e3;return[t("limel-button",{label:"Send",onClick:this.triggerSnackbarWithAction}),t("limel-snackbar",{message:"Your email has been sent.",actionText:"Undo",timeout:e,onAction:this.snackbarOnAction,onHide:this.snackbarWithActionOnHide})]}triggerSnackbar(e){const t=this.host.shadowRoot.querySelector(e);t.show()}snackbarOnAction(){console.log("All good. We did not send the email.")}snackbarWithActionOnHide(){console.log("Now the email has really been sent! There is no way to undo this.")}get host(){return n(this)}};export{s as limel_example_snackbar_with_action};
//# sourceMappingURL=limel-example-snackbar-with-action.entry.js.map