import{r as e,h as i}from"./index-ab490ba1.js";const t=class{constructor(i){e(this,i),this.handleClick=e=>{e.altKey||e.ctrlKey||e.metaKey||e.shiftKey||(e.preventDefault(),alert("No modifier key pressed. Link should open in current window, but we might want to handle the navigation with our application's router, to avoid reloading the whole application (if we're in a single page app, like Lime CRM Web Client).\n\nTry holding down a modifier key, like Shift, while clicking."))}}render(){return i("limel-shortcut",{icon:"pivot_table",label:"limel-table",linkTitle:"Open the documentation for limel-table",href:"#/component/limel-table",onClick:this.handleClick})}};t.style="limel-shortcut{width:20%}";export{t as limel_example_shortcut_with_click_handler}