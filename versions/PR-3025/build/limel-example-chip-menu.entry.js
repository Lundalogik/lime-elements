import{r as e,h as t}from"./index-6156b4fd.js";const i=class{constructor(t){e(this,t);this.handleRemove=()=>{this.removeButtonClicked=true};this.handleMenuItemSelected=e=>{this.menuItemSelected=e.detail};this.removeButtonClicked=false;this.menuItemSelected=null;this.menuItems=[{text:"Email",secondaryText:"beffie@lime.tech",icon:"email_sign",value:1},{text:"Direct phone",secondaryText:"+46 987 654 321",icon:"phone",value:2},{text:"Mobile",secondaryText:"+46 123 456 789",icon:"touchscreen_smartphone",value:3}]}render(){return[t("limel-chip",{text:"Beffie Kiaskompis",removable:true,onRemove:this.handleRemove,menuItems:this.menuItems,onMenuItemSelected:this.handleMenuItemSelected}),t("limel-example-value",{label:"Menu item clicked",value:this.menuItemSelected}),t("limel-example-value",{label:"Remove",value:this.removeButtonClicked})]}};export{i as limel_example_chip_menu};
//# sourceMappingURL=limel-example-chip-menu.entry.js.map