import{r as t,h as i}from"./index-6156b4fd.js";import{E as s,a as e}from"./keycodes-9382910b.js";const n=class{constructor(n){t(this,n);this.indexedIcons=[];this.loadIconIndex=async()=>{var t;const i=await fetch("https://lundalogik.github.io/lime-icons8/assets/icon-index.json");const s=await((t=i===null||i===void 0?void 0:i.json)===null||t===void 0?void 0:t.call(i));this.indexedIcons=s};this.renderIconButton=t=>{const s=t.id.replace(".svg","");const e=`Copy ${s}`;return i("limel-icon-button",{label:e,icon:s,onClick:this.copyIconName})};this.onInput=t=>{if(t instanceof CustomEvent){this.textValue=t.detail}};this.onKeyUp=t=>{if((t.key===s||t.keyCode===e)&&this.textValue.trim()){this.value=[...this.value,this.createChip(this.textValue.trim())];this.searchIcons();this.textValue=""}};this.searchIcons=()=>{this.icons=[];this.indexedIcons.forEach((t=>{this.value.forEach((i=>{const s=t.tags.filter((t=>t.includes(i.text)));if(s.length||t.id.includes(i.text)){this.icons.push(t)}}))}));this.icons=[...new Set(this.icons)]};this.chipSetOnChange=t=>{this.value=t.detail;this.searchIcons()};this.value=[];this.textValue="";this.icons=[]}componentWillLoad(){this.loadIconIndex()}render(){return[i("limel-chip-set",{label:"Icon finder",type:"input",value:this.value,onChange:this.chipSetOnChange,onInput:this.onInput,onKeyUp:this.onKeyUp,searchLabel:"Type and press enter to search",emptyInputOnBlur:true,leadingIcon:"search"}),i("div",null," ",this.icons.map(this.renderIconButton))]}copyIconName(t){const i=t.target.icon;const s=document.createElement("textarea");s.value=i;document.body.appendChild(s);s.select();document.execCommand("copy");document.body.removeChild(s);console.log(`copied icon name '${i}' to clipboard`)}createChip(t){return{id:t,text:t,removable:true}}};export{n as limel_example_icon_finder};
//# sourceMappingURL=limel-example-icon-finder.entry.js.map