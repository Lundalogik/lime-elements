import{r as e,h as t}from"./index-6156b4fd.js";import{m as r}from"./markdown-parser-c4c5c63c.js";import"./_commonjsHelpers-5ec8f9b7.js";import"./allowed-css-properties-1a3716d2.js";const o='@charset "UTF-8";code{font-family:ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, Consolas, "DejaVu Sans Mono", monospace;font-size:0.8125rem;letter-spacing:-0.0125rem;color:rgb(var(--contrast-1300));-moz-tab-size:4;-o-tab-size:4;tab-size:4;-webkit-hyphens:none;-moz-hyphens:none;-ms-hyphens:none;hyphens:none;display:inline-block;border-radius:0.25rem;padding:0.03125rem 0.25rem;background-color:rgb(var(--contrast-600))}pre>code{display:block;margin:0.5rem 0;padding:0.5rem 0.75rem;overflow:auto;white-space:pre-wrap}h1{font-size:1.5rem}h2{font-size:1.25rem}h3{font-size:1.125rem}h4{font-size:1rem}h5{font-size:0.875rem}h6{font-size:0.75rem}h1,h2{margin-top:0.5rem;margin-bottom:0.5rem;letter-spacing:-0.03125rem;font-weight:500}h3,h4{margin-top:0.75rem;margin-bottom:0.25rem;font-weight:600}h5,h6{margin-top:0.5rem;margin-bottom:0.125rem;font-weight:600}h1,h2,h3,h4,h5,h6{word-break:break-word;hyphens:auto;-webkit-hyphens:auto}:not([contenteditable=true]) h1,:not([contenteditable=true]) h2,:not([contenteditable=true]) h3,:not([contenteditable=true]) h4,:not([contenteditable=true]) h5,:not([contenteditable=true]) h6{text-wrap:balance}[contenteditable=true] h1,[contenteditable=true] h2,[contenteditable=true] h3,[contenteditable=true] h4,[contenteditable=true] h5,[contenteditable=true] h6{text-wrap:initial}:host(limel-markdown.truncate-paragraphs) p{overflow:hidden;white-space:nowrap;text-overflow:ellipsis}p,li{font-size:0.875rem;word-break:break-word;hyphens:auto;-webkit-hyphens:auto}a{word-break:break-all}p{margin-top:0;margin-bottom:0.5rem}p:only-child{margin-bottom:0}a{transition:color 0.2s ease;color:var(--markdown-hyperlink-color, rgb(var(--color-blue-dark)));text-decoration:none}a:hover{color:var(--markdown-hyperlink-color--hovered, rgb(var(--color-blue-default)))}hr{margin:1.75rem 0 2rem 0;border-width:0;border-top:1px solid rgb(var(--contrast-500))}ul{list-style:none}ul li{position:relative;margin-left:0.75rem}ul li:before{content:"";position:absolute;left:-0.5rem;top:0.5rem;width:0.25rem;height:0.25rem;border-radius:50%;background-color:rgb(var(--contrast-700));display:block}ol{margin-top:0.25rem;padding-left:1rem}ul{margin-top:0.25rem;padding-left:0}ul ul,ul ol,ol ol,ol ul{margin-left:0}li{margin-bottom:0.25rem}:host(limel-markdown:not(.no-table-styles)) table{table-layout:auto;min-width:100%;border-collapse:collapse;border-spacing:0;background:transparent;margin:0.75rem 0;border:1px solid rgb(var(--contrast-400))}:host(limel-markdown:not(.no-table-styles)) th,:host(limel-markdown:not(.no-table-styles)) td{text-align:left;vertical-align:top;transition:background-color 0.2s ease;font-size:0.875rem}:host(limel-markdown:not(.no-table-styles)) td{padding:0.5rem 0.375rem 0.75rem 0.375rem}:host(limel-markdown:not(.no-table-styles)) tr th{background-color:rgb(var(--contrast-400));padding:0.25rem 0.375rem;font-weight:normal}:host(limel-markdown:not(.no-table-styles)) tr th:only-child{text-align:center}:host(limel-markdown:not(.no-table-styles)) tbody tr:nth-child(odd) td{background-color:rgb(var(--contrast-200))}:host(limel-markdown:not(.no-table-styles)) tbody tr:hover td{background-color:rgb(var(--contrast-300))}blockquote{position:relative;font-weight:100;font-size:0.875rem;max-width:100%;line-height:1.4;margin:0;padding:0.5rem 1.25rem;border-radius:0.05rem 0.75rem;background-color:rgb(var(--contrast-300))}blockquote:before,blockquote:after{position:absolute;font-size:2.75rem;opacity:0.4}blockquote:before{content:"“";left:0;top:-0.75rem}blockquote:after{content:"”";right:0;bottom:-2rem}dl{display:grid;grid-template-columns:1fr 2fr;grid-template-rows:1fr;margin-bottom:2rem;border:1px solid rgb(var(--contrast-400));border-radius:0.375rem;background-color:rgb(var(--contrast-200))}dl dt,dl dd{padding:0.375rem 0.5rem;font-size:0.875rem;margin:0}dl dt:nth-of-type(even),dl dd:nth-of-type(even){background-color:rgb(var(--contrast-300))}dl dt:first-child{border-top-left-radius:0.375rem}dl dt:last-child{border-bottom-left-radius:0.375rem}dl dd:first-child{border-top-right-radius:0.375rem}dl dd:last-child{border-bottom-right-radius:0.375rem}hr{border-top:1px solid rgb(var(--contrast-700))}img{max-width:100%}';const n=class{constructor(t){e(this,t);this.value=undefined}async textChanged(){try{const e=await r(this.value,{forceHardLineBreaks:true});this.rootElement.innerHTML=e}catch(e){console.error(e)}}async componentDidLoad(){this.textChanged()}render(){return[t("div",{id:"markdown",ref:e=>this.rootElement=e})]}static get watchers(){return{value:["textChanged"]}}};n.style=o;export{n as limel_markdown};
//# sourceMappingURL=limel-markdown.entry.js.map