import{r as e,h as t}from"./index-5f2797d5.js";const n=class{constructor(t){e(this,t),this.direction="horizontal",this.justify="space-between",this.align="center",this.reverse=!1}componentWillLoad(){console.warn("limel-flex-container is deprecated, please use CSS instead: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Basic_Concepts_of_Flexbox")}render(){return t("slot",null)}};n.style=":host(limel-flex-container){display:flex}:host(limel-flex-container[hidden]){display:none}:host(limel-flex-container[direction=horizontal]){flex-direction:row}:host(limel-flex-container[direction=horizontal][reverse]){flex-direction:row-reverse}:host(limel-flex-container[direction=vertical]){flex-direction:column}:host(limel-flex-container[direction=vertical][reverse]){flex-direction:column-reverse}:host(limel-flex-container[align=start]){align-items:flex-start}:host(limel-flex-container[align=end]){align-items:flex-end}:host(limel-flex-container[align=center]){align-items:center}:host(limel-flex-container[align=stretch]){align-items:stretch}:host(limel-flex-container[justify=start]){justify-content:flex-start}:host(limel-flex-container[justify=end]){justify-content:flex-end}:host(limel-flex-container[justify=center]){justify-content:center}:host(limel-flex-container[justify=space-between]){justify-content:space-between}:host(limel-flex-container[justify=space-around]){justify-content:space-around}:host(limel-flex-container[justify=space-evenly]){justify-content:space-evenly}:host(limel-flex-container[slot=button]){gap:0.5rem;width:100%;justify-content:flex-end}:host(limel-flex-container[slot=button][direction=horizontal][reverse]){justify-content:flex-start}";export{n as limel_flex_container}