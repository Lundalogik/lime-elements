import{r as e,c as t,h as o,g as r}from"./index-6156b4fd.js";import{t as i}from"./translations-ccf94159.js";function s(e,t){const o=e||t;let r="";let i="";if(!o){r="";i="unknown";return}r=o.split(".").pop().toLowerCase();switch(r){case"pdf":i="pdf";break;case"jpg":case"jpeg":case"heic":case"bmp":case"png":case"gif":case"svg":case"svgz":case"ep":case"eps":i="image";break;case"avi":case"flv":case"h264":case"mov":case"mp4":case"mwv":case"mkv":i="video";break;case"mp3":case"wav":case"wma":case"ogg":i="audio";break;case"txt":case"json":case"html":case"xml":i="text";break;case"doc":case"docx":case"ppt":case"xls":case"xlsx":case"odt":case"ods":case"odp":case"dot":case"dotx":case"docm":case"dotm":case"pages":case"pptx":case"csv":case"numbers":case"pot":case"pps":case"ppsx":case"pptm":case"potx":case"potm":case"ppam":case"ppsm":case"sldx":case"sldm":case"key":i="office";break;default:i="unknown";break}return i}class n{constructor(e){this.enter=e.requestFullscreen||e.msRequestFullscreen||e.mozRequestFullScreen||e.webkitRequestFullscreen;this.enter=this.enter.bind(e);const t=window.document;this.exit=t.exitFullscreen||t.msExitFullscreen||t.mozCancelFullScreen||t.webkitExitFullscreen;this.requestFullscreen=this.requestFullscreen.bind(this);this.exitFullscreen=this.exitFullscreen.bind(this);this.toggle=this.toggle.bind(this)}requestFullscreen(){if(this.enter){this.enter()}}exitFullscreen(){if(this.exit){this.exit.bind(window.document)()}}toggle(){const e=window.document;const t=e.fullscreenElement||e.mozFullScreenElement||e.webkitFullscreenElement||e.msFullscreenElement;if(t){this.exitFullscreen()}else{this.requestFullscreen()}}isSupported(){return!!this.requestFullscreen}}const a=':host{--mdc-theme-primary:var(\n      --lime-primary-color,\n      rgb(var(--color-teal-default))\n  );--mdc-theme-secondary:var(\n      --lime-secondary-color,\n      rgb(var(--contrast-1100))\n  );--mdc-theme-on-primary:var(\n      --lime-on-primary-color,\n      rgb(var(--contrast-100))\n  );--mdc-theme-on-secondary:var(\n      --lime-on-secondary-color,\n      rgb(var(--contrast-100))\n  );--mdc-theme-text-disabled-on-background:var(\n      --lime-text-disabled-on-background-color,\n      rgba(var(--contrast-1700), 0.38)\n  );--mdc-theme-text-primary-on-background:var(\n      --lime-text-primary-on-background-color,\n      rgba(var(--contrast-1700), 0.87)\n  );--mdc-theme-text-secondary-on-background:var(\n      --lime-text-secondary-on-background-color,\n      rgba(var(--contrast-1700), 0.54)\n  );--mdc-theme-error:var(\n      --lime-error-background-color,\n      rgb(var(--color-red-dark))\n  );--lime-error-text-color:rgb(var(--color-red-darker));--mdc-theme-surface:var(\n      --lime-surface-background-color,\n      rgb(var(--contrast-100))\n  );--mdc-theme-on-surface:var(\n      --lime-on-surface-color,\n      rgb(var(--contrast-1500))\n  )}:host{isolation:isolate;position:relative;box-sizing:border-box;display:flex;align-items:center;justify-content:center;width:100%;height:100%}*{box-sizing:border-box}img,video,audio,object,iframe{max-height:100%;max-width:100%;box-sizing:border-box}iframe{border:none;width:100%;height:100%;min-height:20rem}img{min-width:7rem;object-fit:contain}video{width:100%;height:auto}audio{width:100%}object[type="application/pdf"]{width:100%;height:100%;min-height:20rem}object:not([type="application/pdf"]){border-radius:0.25rem;padding:0.75rem 2rem 0.75rem 0.75rem;width:100%;height:100%;overflow-y:auto;color:rgb(var(--contrast-1300));background-color:rgb(var(--contrast-200))}:host(:fullscreen){background-color:rgb(var(--color-gray-darker))}:host(:fullscreen) object[type="text/plain"]{max-width:50rem;max-height:calc(100% - 2rem)}:host(:-webkit-full-screen){background-color:rgb(var(--color-gray-darker))}:host(:-webkit-full-screen) object[type="text/plain"]{max-width:50rem;max-height:calc(100% - 2rem)}.buttons{position:absolute;z-index:1;top:0.25rem;right:0.25rem;display:grid;grid-auto-flow:row;grid-gap:0.5rem}.no-support{display:grid;justify-items:center;grid-gap:0.75rem;border:1px dashed rgb(var(--contrast-600));border-radius:0.5rem;padding:1.25rem}.no-support__info{display:grid;grid-auto-flow:column;grid-gap:0.5rem;align-items:center}[class^=button--]{all:unset;transition:color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease, transform 0.1s ease-out;cursor:pointer;color:var(--mdc-theme-on-surface);background-color:var(--lime-elevated-surface-background-color);box-shadow:var(--button-shadow-normal);display:flex;align-items:center;justify-content:center;border-radius:50%;width:2rem;height:2rem;background-color:rgba(var(--contrast-100), 0.8);backdrop-filter:blur(0.25rem)}[class^=button--]:hover{color:var(--mdc-theme-on-surface);background-color:var(--lime-elevated-surface-background-color);box-shadow:var(--button-shadow-hovered)}[class^=button--]:active{box-shadow:var(--button-shadow-pressed);transform:translate3d(0, 0.08rem, 0)}[class^=button--]:focus{outline:none}[class^=button--]:focus-visible{outline:none;box-shadow:var(--shadow-depth-8-focused)}[class^=button--] limel-icon{transition:color 0.2s ease;width:1.25rem;color:rgb(var(--contrast-1200))}[class^=button--]:hover limel-icon{color:rgb(var(--contrast-1400))}.no-support .button--download{width:2.5rem;height:2.5rem}.icon--warning{color:rgb(var(--color-orange-default))}:host(:fullscreen) .buttons{top:0.75rem;right:0.75rem}:host(:fullscreen) .button--download,:host(:fullscreen) .button--new-tab,:host(:fullscreen) .button--enter-fullscreen{display:none}:host(:-webkit-full-screen) .buttons{top:0.75rem;right:0.75rem}:host(:-webkit-full-screen) .button--download,:host(:-webkit-full-screen) .button--new-tab,:host(:-webkit-full-screen) .button--enter-fullscreen{display:none}:host(:not(:-webkit-full-screen)) .button--exit-fullscreen{display:none}:host(:not(:fullscreen)) .button--exit-fullscreen{display:none}.action-menu-for-office-files{position:absolute;top:0.75rem;right:0.75rem}';const l=class{constructor(r){e(this,r);this.action=t(this,"action",7);this.renderPdf=()=>o("object",{data:this.url,type:"application/pdf"});this.renderImage=()=>[this.renderButtons(),o("img",{src:this.url,alt:this.alt})];this.renderVideo=()=>o("video",{controls:true},o("source",{src:this.url}));this.renderAudio=()=>o("audio",{controls:true},o("source",{src:this.url}));this.renderText=()=>[this.renderButtons(),o("object",{data:this.url,type:"text/plain"})];this.renderOffice=()=>[this.renderSameDomainDownload(),o("div",{class:"action-menu-for-office-files"},this.renderActionMenu()),o("iframe",{src:this.getOfficeViewerUrl()+this.url+"&embedded=true",frameborder:"0"})];this.emitOnAction=e=>{e.stopPropagation();this.action.emit(e.detail)};this.url=undefined;this.filename=undefined;this.alt=undefined;this.language="en";this.officeViewer="microsoft-office";this.actions=undefined;this.webserverDomain=undefined;this.sameDomain=false;this.fullscreen=new n(this.HostElement);this.fileType=s(this.filename,this.url);this.sameDomain=this.url.includes(this.webserverDomain)}render(){if(!this.url){return}if(!this.isOfficeFileOnline){return this.renderNoFileSupportMessage()}return this.renderFileViewer()}renderFileViewer(){const e={pdf:this.renderPdf,image:this.renderImage,video:this.renderVideo,audio:this.renderAudio,text:this.renderText,office:this.renderOffice};const t=e[this.fileType]||this.renderNoFileSupportMessage;return t()}renderSameDomainDownload(){if(!this.sameDomain){return}const e={position:"relative",float:"right",right:"10px",bottom:"35px",transition:"0.5s"};return o("a",{href:this.url,style:e},"download")}isOfficeFileOnline(){return this.fileType==="office"&&!(this.url.startsWith("http://")||this.url.startsWith("https://"))}getOfficeViewerUrl(){if(this.officeViewer==="microsoft-office"){return"https://view.officeapps.live.com/op/embed.aspx?src="}if(this.officeViewer==="google-drive"){return"https://docs.google.com/gview?url="}}renderNoFileSupportMessage(){return o("div",{class:"no-support"},o("div",{class:"no-support__info"},o("limel-icon",{class:"icon--warning",name:"brake_warning",size:"large",role:"presentation"}),o("p",null,this.getTranslation("message.unsupported-filetype"))),o("a",{href:this.url,id:"tooltip-download-unsupported",class:"button--download",role:"button",download:true},o("limel-icon",{name:"download_2",size:"large"}),o("limel-tooltip",{label:this.getTranslation("title.download"),elementId:"tooltip-download-unsupported",openDirection:"left"})))}renderButtons(){return o("div",{class:"buttons"},this.renderActionMenu(),this.renderFullscreenButtons(),this.renderDownloadButton(),this.renderOpenInNewTabButton())}renderFullscreenButtons(){if(this.fullscreen.isSupported()){return[o("button",{class:"button--exit-fullscreen",id:"tooltip-enter-fullscreen",role:"button",onClick:this.fullscreen.toggle},o("limel-icon",{name:"multiply"}),o("limel-tooltip",{label:this.getTranslation("title.exit-fullscreen"),elementId:"tooltip-enter-fullscreen",openDirection:"left"})),o("button",{class:"button--enter-fullscreen",id:"tooltip-exit-fullscreen",role:"button",onClick:this.fullscreen.toggle},o("limel-icon",{name:"fit_to_width"}),o("limel-tooltip",{label:this.getTranslation("title.open-in-fullscreen"),elementId:"tooltip-exit-fullscreen",openDirection:"left"}))]}}renderDownloadButton(){return o("a",{class:"button--download",id:"tooltip-download",role:"button",download:this.filename,href:this.url,target:"_blank"},o("limel-icon",{name:"download_2"}),o("limel-tooltip",{label:this.getTranslation("title.download"),elementId:"tooltip-download",openDirection:"left"}))}renderOpenInNewTabButton(){return o("a",{class:"button--new-tab",id:"tooltip-new-tab",role:"button",href:this.url,target:"_blank",rel:"noopener noreferrer"},o("limel-icon",{name:"external_link"}),o("limel-tooltip",{label:this.getTranslation("title.open-in-new-tab"),elementId:"tooltip-new-tab",openDirection:"left"}))}renderActionMenu(){if(!this.actions){return}return o("limel-menu",{class:"action-menu",items:this.actions,onSelect:this.emitOnAction,"open-direction":"left"},o("button",{class:"button--action",id:"tooltip-more",role:"button",slot:"trigger"},o("limel-icon",{name:"menu_2"}),o("limel-tooltip",{label:"More…",elementId:"tooltip-more",openDirection:"left"})))}getTranslation(e){return i.get(`file-viewer.${e}`,this.language)}get HostElement(){return r(this)}};l.style=a;export{l as limel_file_viewer};
//# sourceMappingURL=limel-file-viewer.entry.js.map