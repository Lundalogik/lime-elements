import{r as e,h as t}from"./index-6156b4fd.js";const i=".do-dont-container{display:grid;grid-template-columns:1fr 1fr;gap:2.5rem;padding:1.25rem}@media screen and (max-width: 760px){.do-dont-container{grid-template-columns:1fr;grid-auto-flow:row}}.do,.do-not{--example-border-radius:0.5rem;--header-background-color:rgb(var(--contrast-500));--header-top-right-left-border-radius:var(--example-border-radius);border-radius:var(--example-border-radius);background-color:rgb(var(--contrast-100));color:rgb(var(--contrast-1100));height:fit-content}.do{--header-icon-color:rgb(var(--color-green-default))}.do-not{--header-icon-color:rgb(var(--color-red-default))}.do,.do-not{width:30rem;margin:1rem 0 2rem 0;background-color:rgb(var(--contrast-200))}.do limel-button,.do-not limel-button{padding:0 0 1rem 0.5rem}.do .relevant-button,.do-not .relevant-button{margin-top:1rem}.do .assign,.do-not .assign{padding-bottom:0}#tooltip-example{margin-top:1rem;width:5rem}#tooltip{cursor:help}.button-icon{display:flex;align-items:center}.button-icon .disabled-button{padding-right:0.5rem;margin-top:1rem}.split-example,.relevan-buttons-example{display:flex;gap:5rem}.split-example limel-split-button,.relevan-buttons-example limel-split-button{margin-top:1rem;padding:0 0 1rem 0.5rem}";const o=class{constructor(t){e(this,t);this.items=[{text:"Save as",icon:"save_as"}];this.disabledItem=[{text:"Save as",icon:"save_as",disabled:true}];this.handleSelect=e=>{console.log("Menu item chosen",e.detail.text)};this.setChecked=e=>{e.stopPropagation();this.value=e.detail};this.isClicked=()=>{this.clicked=!this.clicked};this.value=false;this.clicked=false;this.required=undefined}render(){return[t("h3",null,"Disabled vs. Hidden"),t("p",null,"Effective use of 'Disabled' and 'Hidden' buttons is crucial in user interface design, and the choice between the two should always be context-dependent. These guidelines provide insights into when to apply each approach to optimize user experiences.",t("br",null),t("br",null),t("b",null," Disabling a Button:")),t("p",null,'Use button disabling when the action the button represents is not currently available but may become available in the future. For example, you can disable a "Submit" button until all required form fields are filled out. Keep in mind that in such cases, users should be able to do something to enable the',t("code",null,"disabled")," element!"),t("div",{class:"do"},t("limel-header",{icon:"ok",heading:"Disabled button in the form"}),t("limel-checkbox",{label:"Accept terms and conditions",required:true,onChange:this.setChecked,checked:this.value}),t("limel-button",{label:"Submit",disabled:this.value?false:true})),t("p",null,"Simply showing a disabled element in the user interface might not be enough for the user to realize what they should do to enable it. Therefore, it's very helpful to communicate to the user why they can't perform that certain action. Disabled buttons for instance, could have a tooltip or message explaining why they are disabled."),t("div",{class:"do"},t("limel-header",{icon:"ok",heading:"Disabled button together with a Tooltip"}),t("div",{id:"tooltip-example"},t("limel-button",{class:"disabled-button",disabled:true,icon:"phone",label:"Call"})),t("limel-tooltip",{label:"Select a recipient to make a call",elementId:"tooltip-example"})),t("p",null,"Another idea could be to display a more noticeable visual element next to the disabled element, which hints about an explanation or further information. For example, indicating to the user that they need to complete a certain step or meet specific conditions before proceeding."),t("div",{class:"do"},t("limel-header",{icon:"ok",heading:"Disabled button together with an info icon"}),t("div",{class:"button-icon"},t("limel-button",{class:"disabled-button",disabled:true,icon:"plus_math",label:"Add recipient"}),t("limel-icon",{name:"info",id:"tooltip",size:"x-small"})),t("limel-tooltip",{label:"To activate this feature, call our support!",elementId:"tooltip"})),t("h3",null,"Hiding a Button:"),t("p",null,'Sometimes, displaying a disabled element does not make sense. This could be of course due to various reasons, but a common scenario is coexistence of another "enabled" element that does the opposite of what the disabled element does. ',t("br",null),' In this example, there is no point to show two buttons, one for "assigning" and one for "un-assigning". The "Assign" button should be hidden if it\'s not relevant to a context. If the user is already assigned there is no sense in having the assign button, it is better to show the ',t("b",null," unassign")," button instead."),t("div",{class:"relevan-buttons-example"},t("div",{class:"do-not"},t("limel-header",{icon:"brake_warning",heading:"Don't"}),t("limel-button",{class:"relevant-button assign",icon:"whole_hand_right",label:"Assign me"}),t("limel-button",{class:"relevant-button",label:"Unassign me"})),t("div",{class:"do"},t("limel-header",{icon:"ok",heading:"Do"}),t("limel-button",{class:"relevant-button",icon:this.clicked?"":"whole_hand_right",label:this.clicked?"Unassign me":"Assign me",onClick:this.isClicked}))),t("p",null,"When an action is permanently unavailable or not allowed for a particular user role (e.g., an admin-only action), it's best to hide the button rather than disabling it."),t("div",{class:"split-example"},t("div",{class:"do-not"},t("limel-header",{icon:"brake_warning",heading:"Don't - User Interface "}),t("limel-split-button",{label:"Save",icon:"save",items:this.disabledItem})),t("div",{class:"do"},t("limel-header",{icon:"ok",heading:"Do - User Interface"}),t("limel-split-button",{label:"Save",icon:"save"})),t("div",{class:"do"},t("limel-header",{icon:"admin_settings",heading:"Admin Interface"}),t("limel-split-button",{label:"Save",icon:"save",items:this.items,onSelect:this.handleSelect})))]}};o.style=i;export{o as limel_example_button_disabled_vs_hidden};
//# sourceMappingURL=limel-example-button-disabled-vs-hidden.entry.js.map