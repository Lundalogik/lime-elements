import{r as e,h as t}from"./index-5f2797d5.js";const a=class{constructor(t){e(this,t),this.tabs=[{id:"joker",text:"Joker",icon:"joker",active:!0,iconColor:"var(--lime-green)"},{id:"parasite",text:"Parasite",icon:"insect",iconColor:"var(--lime-magenta)"},{id:"harriet",text:"Harriet",icon:"administrator_female",iconColor:"var(--lime-orange)"}],this.handleChangeTab=e=>{this.tabs=this.tabs.map((t=>t.id===e.detail.id?e.detail:t))}}render(){return[t("limel-tab-panel",{tabs:this.tabs,onChangeTab:this.handleChangeTab},t("limel-example-tab-panel-content",{id:"joker"}),t("limel-example-tab-panel-content",{id:"parasite"}),t("limel-example-tab-panel-content",{id:"harriet"}))]}};a.style="limel-tab-panel{height:20rem}limel-example-tab-panel-content{display:flex;height:100%;background-color:rgb(var(--contrast-100));justify-content:center;align-items:center}";export{a as limel_example_tab_panel}