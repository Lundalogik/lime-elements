import{r as e,h as t,H as l}from"./index-6156b4fd.js";import{c as i}from"./random-string-812b1c35.js";const s=class{constructor(t){e(this,t);this.optionGroups=[[{text:"",value:"",disabled:true},{text:"Bart Simpson",value:"bart"},{text:"Ned Flanders",value:"ned"}],[{text:"",value:""},{text:"Homer Simpson",value:"homer"},{text:"Moe Szyslak",value:"moe"},{text:"Ned Flanders",value:"ned"}],[],[{text:"Luke Skywalker",value:"luke"},{text:"Han Solo",value:"han"},{text:"Leia Organo",value:"leia"}],[{text:"David Tennant",value:"10"},{text:"Matt Smith",value:"11"},{text:"Peter Capaldi",value:"12"},{text:"Jodie Witthaker",value:"13"}]];this.optionGroupSelectOptions=[{text:"1 - with empty disabled first option",value:"0"},{text:"2 - with empty non-disabled first option",value:"1"},{text:"3 - empty set",value:"2"},{text:"4 - 3 options",value:"3"},{text:"5 - 4 options",value:"4"}];this.handleChange=e=>{this.value=e.detail};this.toggleEnabled=()=>{this.disabled=!this.disabled};this.handleOptionsGroupChange=e=>{e.stopPropagation();this.currentOptionGroup=+e.detail.value};this.unsetValue=()=>{this.value=undefined};this.selectFirstValue=()=>{this.value=this.optionGroups[this.currentOptionGroup][0]};this.reinitialize=()=>{this.key=i()};this.value=undefined;this.disabled=false;this.currentOptionGroup=0;this.key=i()}componentWillLoad(){this.selectFirstValue()}render(){return t(l,null,t("limel-select",{label:"Favorite hero",value:this.value,options:this.optionGroups[this.currentOptionGroup],disabled:this.disabled,onChange:this.handleChange,key:this.key}),t("limel-example-controls",{style:{"--example-controls-max-columns-width":"9rem"}},t("limel-select",{label:"Select Options Group",options:this.optionGroupSelectOptions,value:this.optionGroupSelectOptions[this.currentOptionGroup],onChange:this.handleOptionsGroupChange}),t("limel-button",{label:this.disabled?"Enable":"Disable",onClick:this.toggleEnabled}),t("limel-button",{label:"Unset value",onClick:this.unsetValue}),t("limel-button",{label:"Select first value in group",onClick:this.selectFirstValue}),t("limel-button",{label:"Reinitialize",onClick:this.reinitialize})),t("limel-example-value",{value:this.value}),t("limel-example-value",{label:"Currently showing option group",value:`${this.currentOptionGroup+1} / ${this.optionGroups.length}`}))}};export{s as limel_example_select_change_options};
//# sourceMappingURL=limel-example-select-change-options.entry.js.map