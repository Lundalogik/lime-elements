import{r as i,h as t}from"./index-7dccb886.js";const a=class{constructor(t){i(this,t),this.text="cats",this.tabs=[{id:1,text:"Cats",icon:"black_cat",active:!0,iconColor:"var(--lime-dark-grey)"},{id:2,text:"Dogs",icon:"dog",iconColor:"var(--lime-blue)"},{id:3,text:"Birds",icon:"bird",iconColor:"var(--lime-red)"}],this.handleChange=i=>{this.text=i.detail.text,this.tabs=this.tabs.map((t=>t.id===i.detail.id?i.detail:t))}}render(){return[t("limel-tab-bar",{tabs:this.tabs,onChangeTab:this.handleChange}),t("limel-example-value",{label:"Tab",value:this.text})]}};export{a as limel_example_tab_bar_with_dynamic_tab_width}