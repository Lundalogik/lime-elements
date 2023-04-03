import{r as o,h as r}from"./index-a55db97c.js";import{t}from"./translations-f88bb584.js";const l={note:"info",important:"exclamation_mark",tip:"idea",caution:"high_priority",warning:"error"};function n(o="info"){var r;return null!==(r=l[o])&&void 0!==r?r:l.note}function a(o="note",r="en"){const l=`callout.${o}`;try{return t.get(l,r)}catch(o){return t.get(l,"en")}}const i=class{constructor(r){o(this,r),this.type="note",this.language="en"}render(){return[r("div",{class:"side",role:"presentation"},r("limel-icon",{name:n(this.type)})),r("div",{class:"main"},r("h1",{class:"heading"},a(this.type,this.language)),r("slot",null))]}};i.style=':host(limel-callout){display:flex;border-radius:0.5rem;overflow:hidden;color:var(--callout-text-color, rgb(var(--contrast-1100)))}:host([type=note]){--limel-callout-tint-color:var(\n      --callout-color,\n      rgb(var(--color-gray-default))\n  )}:host([type=important]){--limel-callout-tint-color:var(\n      --callout-color,\n      rgb(var(--color-sky-default))\n  )}:host([type=tip]){--limel-callout-tint-color:var(\n      --callout-color,\n      rgb(var(--color-green-default))\n  )}:host([type=caution]){--limel-callout-tint-color:var(\n      --callout-color,\n      rgb(var(--color-orange-light))\n  )}:host([type=warning]){--limel-callout-tint-color:var(\n      --callout-color,\n      rgb(var(--color-red-dark))\n  )}.side{padding:0.25rem;position:relative}.side:before{content:"";position:absolute;inset:0;opacity:0.2;background-color:var(--limel-callout-tint-color)}.side limel-icon{width:1.5rem;color:var(--limel-callout-tint-color);margin-top:0.0625rem}.main{display:flex;flex:1;flex-direction:column;gap:0.5rem;padding:0.25rem 0.5rem 0.5rem 0.5rem;background-color:var(--callout-background-color, rgb(var(--contrast-300)))}.heading{margin:0;font-size:1rem}';export{i as limel_callout}