import{r as e,h as i}from"./index-7dccb886.js";const o=class{constructor(i){e(this,i),this.text="Joker",this.tabs=[{id:1,text:"Joker",icon:"joker",active:!0,iconColor:"var(--lime-green)"},{id:2,text:"Parasite",icon:"insect",iconColor:"var(--lime-magenta)",badge:999},{id:3,text:"Harriet",icon:"administrator_female",iconColor:"var(--lime-orange)",badge:99940},{id:4,text:"Bombshell",icon:"surprised",iconColor:"var(--lime-blue)",badge:999990},{id:5,text:"Judy",icon:"female",iconColor:"var(--lime-deep-red)",badge:94e4},{id:6,text:"Friends",icon:"friends",iconColor:"var(--lime-yellow)",badge:129e4},{id:7,text:"Little Women",icon:"female",iconColor:"var(--lime-deep-red)",badge:4}],this.handleChange=e=>{this.text=e.detail.text,this.tabs=this.tabs.map((i=>i.id===e.detail.id?e.detail:i))}}render(){return[i("limel-tab-bar",{tabs:this.tabs,onChangeTab:this.handleChange}),i("limel-example-value",{label:"Tab",value:this.text})]}};export{o as limel_example_tab_bar}