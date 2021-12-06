import{r as i,h as t,g as e}from"./index-a7da85d2.js";let l=class{constructor(t){i(this,t),this.disabled=!1,this.message="This is a non-blocking but also non-transient message",this.openBanner=()=>{this.banner.open(),this.disabled=!0},this.closeBanner=()=>{this.banner.close(),this.disabled=!1},this.someCustomAction=()=>{alert("Triggered an action of some sort"),this.closeBanner()}}componentDidLoad(){this.banner=this.host.shadowRoot.querySelector("limel-banner")}render(){return[t("limel-button",{primary:!0,disabled:this.disabled,label:"Show Banner",onClick:this.openBanner}),t("limel-banner",{message:this.message,icon:"exclamation_mark"},t("limel-flex-container",{justify:"end",align:"stretch",slot:"buttons"},t("limel-button",{label:"Some Action",onClick:this.someCustomAction}),t("limel-button",{label:"Close",onClick:this.closeBanner})))]}get host(){return e(this)}};l.style="limel-banner{--banner-icon-fill-color:rgb(var(--color-yellow-lighter));--banner-icon-background-color:rgb(var(--color-red-default));position:fixed;right:0;top:0;left:0;z-index:112}@media (max-width: 720px){limel-banner{position:absolute}}limel-banner limel-button:not(last-child){margin-right:0.625rem}";export{l as limel_example_banner}