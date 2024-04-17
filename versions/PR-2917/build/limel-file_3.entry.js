import{r as t,c as i,h as e,H as s,g as r}from"./index-6156b4fd.js";import{t as n}from"./translations-dea847ae.js";import{b as o,a,g as l}from"./icons-d4830de7.js";import{g as h,a as c,b as f}from"./get-icon-props-0b65f85e.js";import{b as u}from"./_baseForOwn-5c15df9f.js";import{i as d}from"./isArrayLike-84e8e25f.js";import{b as p}from"./_baseIteratee-28da26ef.js";import{i as m}from"./isArray-80298bc7.js";import{c as b}from"./random-string-812b1c35.js";import"./_baseIsEqual-bb328657.js";import"./eq-1533d1d3.js";import"./_baseGetTag-49d0259e.js";import"./isObject-7039fcda.js";import"./_getNative-4698fd71.js";import"./isObjectLike-38996507.js";import"./_nodeUtil-0ed26eea.js";import"./isSymbol-f24bedd7.js";import"./toString-0a9c1851.js";import"./_arrayMap-e86f6dbb.js";import"./identity-5b806255.js";function g(t,i,e,s){var r=-1,n=t==null?0:t.length;while(++r<n){var o=t[r];i(s,o,e(o),t)}return s}function j(t,i){return function(e,s){if(e==null){return e}if(!d(e)){return t(e,s)}var r=e.length,n=i?r:-1,o=Object(e);while(i?n--:++n<r){if(s(o[n],n,o)===false){break}}return e}}var y=j(u);function v(t,i,e,s){y(t,(function(t,r,n){i(s,t,e(t),n)}));return s}function x(t,i){return function(e,s){var r=m(e)?g:v,n=i?i():{};return r(e,t,p(s),n)}}var k=x((function(t,i,e){t[e?0:1].push(i)}),(function(){return[[],[]]}));function _(t){const i=h(t.icon);if(i){return i}const e=D(t);if(!e){return}return o(e)}function w(t){const i=c(t.icon,t.iconColor);if(i){return i}const e=D(t);if(!e){return}return a(e)}function z(t){const i=f(t.icon,t.iconBackgroundColor);if(i){return i}const e=D(t);if(!e){return}return l(e)}function C(t){const i=h(t.icon);if(i){return i}return D(t)}function D(t){if(!t){return}return t.filename.split(".").pop()}const O="";const A={id:null,text:null,removable:true};const S=class{constructor(e){t(this,e);this.change=i(this,"change",7);this.interact=i(this,"interact",7);this.handleNewFiles=t=>{this.preventAndStop(t);this.change.emit(t.detail[0])};this.handleChipSetChange=t=>{t.stopPropagation();const i=!t.detail.length?t.detail[0]:null;if(!i){this.change.emit(i)}};this.handleChipInteract=t=>{this.preventAndStop(t);this.interact.emit(t.detail.id)};this.value=undefined;this.label=undefined;this.required=false;this.disabled=false;this.readonly=false;this.invalid=false;this.accept="*";this.language="en"}render(){return e("limel-file-dropzone",{disabled:this.disabled||this.readonly||!!this.value,accept:this.accept,onFilesSelected:this.handleNewFiles},this.renderChipset())}getChipArray(){if(!this.value){return[]}return[Object.assign(Object.assign({},A),{text:this.value.filename,id:this.value.id,icon:{name:_(this.value),title:C(this.value),color:w(this.value),backgroundColor:z(this.value)},href:this.value.href})]}renderChipset(){const t=e("limel-chip-set",{disabled:this.disabled,readonly:this.readonly,invalid:this.invalid,label:this.label,leadingIcon:"upload_to_cloud",language:this.language,onChange:this.handleChipSetChange,onInteract:this.handleChipInteract,required:this.required,type:"input",value:this.getChipArray(),title:this.getTranslation("drag-and-drop-tips")});if(this.value){return t}return e("limel-file-input",{accept:this.accept,disabled:this.disabled||this.readonly},t)}preventAndStop(t){t.stopPropagation();t.preventDefault()}getTranslation(t){return n.get(`file.${t}`,this.language)}};S.style=O;function I(t){const i={id:crypto.randomUUID(),filename:t.name,contentType:t.type,size:t.size,fileContent:t};i.icon={name:_(i),title:C(i),color:w(i),backgroundColor:z(i)};return i}function L(t,i){if(i===undefined||i==="*"){return true}const e=i.split(",").map((t=>t.trim()));return e.some((i=>{if(i===t.contentType){return true}if(i.endsWith("/*")){const e=i.split("/")[0];return t.contentType.startsWith(`${e}/`)}if(i.startsWith(".")){const e=i.split(".")[1];return t.contentType.endsWith(`/${e}`)}}))}const T=":host(limel-file-dropzone){display:block;position:relative}.has-file-to-drop{animation:display-drop-zone 0.6s ease forwards;box-sizing:border-box;isolation:isolate;z-index:1;position:absolute;inset:0.25rem;overflow:hidden;display:flex;justify-content:center;align-items:center;gap:0.5rem;color:rgb(var(--contrast-700));border:0.125rem dashed rgb(var(--color-cyan-light));border-radius:0.75rem}.text-helpertext{display:flex;flex-direction:column;justify-content:center;align-items:flex-start}.icon{width:clamp(2rem, 5vh, 7rem)}.text{font-size:clamp(1rem, 2vh, 1.75rem)}.helper-text{font-size:clamp(0.75rem, 1.5vh, 1rem)}@keyframes display-drop-zone{0%{background-color:rgb(var(--contrast-1100), 0);backdrop-filter:blur(0);-webkit-backdrop-filter:blur(0);scale:0.9;opacity:0}50%{scale:1;opacity:1}100%{background-color:rgb(var(--contrast-1100), 0.8);backdrop-filter:blur(0.25rem);-webkit-backdrop-filter:blur(0.25rem)}}";const q=class{constructor(s){t(this,s);this.filesSelected=i(this,"filesSelected",7);this.filesRejected=i(this,"filesRejected",7);this.renderOnDragLayout=()=>{if(this.disabled||!this.hasFileToDrop){return}return e("div",{class:"has-file-to-drop"},e("limel-icon",{class:"icon",name:"upload_2"}),e("div",{class:"text-helpertext"},this.renderText(),this.renderHelperText()))};this.renderText=()=>{if(!this.text){return}return e("span",{class:"text"},this.text)};this.renderHelperText=()=>{if(!this.helperText){return}return e("span",{class:"helper-text"},this.helperText)};this.handleDrop=t=>{t.stopPropagation();t.preventDefault();this.hasFileToDrop=false;if(this.disabled){return}const i=Array.from(t.dataTransfer.files);const e=i.map(I);const[s,r]=k(e,(t=>L(t,this.accept)));if(s.length>0){this.filesSelected.emit(s)}if(r.length>0){this.filesRejected.emit(r)}};this.handleDragOver=t=>{this.hasFileToDrop=true;t.preventDefault()};this.handleDragLeave=t=>{this.hasFileToDrop=false;t.preventDefault()};this.accept="*";this.disabled=false;this.text=undefined;this.helperText="";this.hasFileToDrop=false}render(){return e(s,{onDrop:this.handleDrop,onDragOver:this.handleDragOver,onDragLeave:this.handleDragLeave},e("slot",null),this.renderOnDragLayout())}};q.style=T;const E=class{constructor(e){t(this,e);this.filesSelected=i(this,"filesSelected",7);this.fileInputId=b();this.handleClick=t=>{if(this.disabled){t.stopPropagation();t.preventDefault();return}this.triggerFileDialog();t.stopPropagation()};this.handleKeyUp=t=>{t.stopPropagation();t.preventDefault();if(t.code==="Enter"){this.triggerFileDialog()}};this.handleFileChange=t=>{const i=Array.from(this.fileInput.files);if(i.length>0){t.stopPropagation();this.filesSelected.emit(i.map(I));this.fileInput.value=""}};this.accept="*";this.disabled=false;this.multiple=false}componentDidLoad(){this.fileInput=this.element.shadowRoot.getElementById(this.fileInputId)}render(){return e(s,{onClick:this.handleClick,onKeyUp:this.handleKeyUp,onKeyDown:this.handleKeyDown},e("input",{hidden:true,id:this.fileInputId,onChange:this.handleFileChange,type:"file",accept:this.accept,disabled:this.disabled,multiple:this.multiple}),e("slot",null))}handleKeyDown(t){if(t.code==="Tab"||t.code==="Backspace"||t.code==="Enter"){return}t.preventDefault();t.stopPropagation()}triggerFileDialog(){this.fileInput.click()}get element(){return r(this)}};export{S as limel_file,q as limel_file_dropzone,E as limel_file_input};
//# sourceMappingURL=limel-file_3.entry.js.map