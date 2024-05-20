import{r as o,h as t}from"./index-6156b4fd.js";import{t as r}from"./translations-d21f985d.js";const l={note:"info",important:"exclamation_mark",tip:"idea",caution:"high_priority",warning:"error"};function n(o,t="note"){var r;if(o){return o}return(r=l[t])!==null&&r!==void 0?r:l.note}function i(o,t="note",l="en"){if(o){return o}const n=`callout.${t}`;try{return r.get(n,l)}catch(o){return r.get(n,"en")}}const a=':host(limel-callout){display:flex;border-radius:0.5rem;overflow:hidden;--limel-callout-tint-color:var(\n      --callout-color,\n      rgb(var(--color-contrast-100))\n  );color:var(--callout-text-color, rgb(var(--contrast-1100)))}:host([type=note]){--limel-callout-tint-color:var(\n      --callout-color,\n      rgb(var(--color-gray-default))\n  )}:host([type=important]){--limel-callout-tint-color:var(\n      --callout-color,\n      rgb(var(--color-sky-default))\n  )}:host([type=tip]){--limel-callout-tint-color:var(\n      --callout-color,\n      rgb(var(--color-green-default))\n  )}:host([type=caution]){--limel-callout-tint-color:var(\n      --callout-color,\n      rgb(var(--color-orange-light))\n  )}:host([type=warning]){--limel-callout-tint-color:var(\n      --callout-color,\n      rgb(var(--color-red-dark))\n  )}.side{padding:0.25rem;position:relative}.side:before{content:"";position:absolute;inset:0;opacity:0.2;background-color:var(--limel-callout-tint-color)}.side limel-icon{width:1.5rem;color:var(--limel-callout-tint-color);margin-top:0.0625rem}.main{display:flex;flex:1;flex-direction:column;gap:0.5rem;padding:0.25rem 0.5rem 0.5rem 0.5rem;background-color:var(--callout-background-color, rgb(var(--contrast-300)))}.heading{margin:0;font-size:1rem;font-weight:600}';const e=class{constructor(t){o(this,t);this.heading=undefined;this.icon=undefined;this.type="note";this.language="en"}render(){return[t("div",{class:"side",role:"presentation"},t("limel-icon",{name:n(this.icon,this.type)})),t("div",{class:"main"},t("h1",{class:"heading"},i(this.heading,this.type,this.language)),t("slot",null))]}};e.style=a;export{e as limel_callout};
//# sourceMappingURL=limel-callout.entry.js.map