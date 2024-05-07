import{r,h as e,g as n}from"./index-6156b4fd.js";import{_ as a,a as i,d as t,M as s,b as o}from"./component-908b71cd.js";import{g as c}from"./util-f1bde91c.js";
/**
 * @license
 * Copyright 2017 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */var l={CLOSED_CLASS:"mdc-linear-progress--closed",CLOSED_ANIMATION_OFF_CLASS:"mdc-linear-progress--closed-animation-off",INDETERMINATE_CLASS:"mdc-linear-progress--indeterminate",REVERSED_CLASS:"mdc-linear-progress--reversed",ANIMATION_READY_CLASS:"mdc-linear-progress--animation-ready"};var m={ARIA_HIDDEN:"aria-hidden",ARIA_VALUEMAX:"aria-valuemax",ARIA_VALUEMIN:"aria-valuemin",ARIA_VALUENOW:"aria-valuenow",BUFFER_BAR_SELECTOR:".mdc-linear-progress__buffer-bar",FLEX_BASIS:"flex-basis",PRIMARY_BAR_SELECTOR:".mdc-linear-progress__primary-bar"};var d={PRIMARY_HALF:.8367142,PRIMARY_FULL:2.00611057,SECONDARY_QUARTER:.37651913,SECONDARY_HALF:.84386165,SECONDARY_FULL:1.60277782};
/**
 * @license
 * Copyright 2017 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */var f=function(r){a(e,r);function e(n){var a=r.call(this,i(i({},e.defaultAdapter),n))||this;a.observer=null;return a}Object.defineProperty(e,"cssClasses",{get:function(){return l},enumerable:false,configurable:true});Object.defineProperty(e,"strings",{get:function(){return m},enumerable:false,configurable:true});Object.defineProperty(e,"defaultAdapter",{get:function(){return{addClass:function(){return undefined},attachResizeObserver:function(){return null},forceLayout:function(){return undefined},getWidth:function(){return 0},hasClass:function(){return false},setBufferBarStyle:function(){return null},setPrimaryBarStyle:function(){return null},setStyle:function(){return undefined},removeAttribute:function(){return undefined},removeClass:function(){return undefined},setAttribute:function(){return undefined}}},enumerable:false,configurable:true});e.prototype.init=function(){var r=this;this.determinate=!this.adapter.hasClass(l.INDETERMINATE_CLASS);this.adapter.addClass(l.ANIMATION_READY_CLASS);this.progress=0;this.buffer=1;this.observer=this.adapter.attachResizeObserver((function(e){var n,a;if(r.determinate){return}try{for(var i=t(e),s=i.next();!s.done;s=i.next()){var o=s.value;if(o.contentRect){r.calculateAndSetDimensions(o.contentRect.width)}}}catch(r){n={error:r}}finally{try{if(s&&!s.done&&(a=i.return))a.call(i)}finally{if(n)throw n.error}}}));if(!this.determinate&&this.observer){this.calculateAndSetDimensions(this.adapter.getWidth())}};e.prototype.setDeterminate=function(r){this.determinate=r;if(this.determinate){this.adapter.removeClass(l.INDETERMINATE_CLASS);this.adapter.setAttribute(m.ARIA_VALUENOW,this.progress.toString());this.adapter.setAttribute(m.ARIA_VALUEMAX,"1");this.adapter.setAttribute(m.ARIA_VALUEMIN,"0");this.setPrimaryBarProgress(this.progress);this.setBufferBarProgress(this.buffer);return}if(this.observer){this.calculateAndSetDimensions(this.adapter.getWidth())}this.adapter.addClass(l.INDETERMINATE_CLASS);this.adapter.removeAttribute(m.ARIA_VALUENOW);this.adapter.removeAttribute(m.ARIA_VALUEMAX);this.adapter.removeAttribute(m.ARIA_VALUEMIN);this.setPrimaryBarProgress(1);this.setBufferBarProgress(1)};e.prototype.isDeterminate=function(){return this.determinate};e.prototype.setProgress=function(r){this.progress=r;if(this.determinate){this.setPrimaryBarProgress(r);this.adapter.setAttribute(m.ARIA_VALUENOW,r.toString())}};e.prototype.getProgress=function(){return this.progress};e.prototype.setBuffer=function(r){this.buffer=r;if(this.determinate){this.setBufferBarProgress(r)}};e.prototype.getBuffer=function(){return this.buffer};e.prototype.open=function(){this.adapter.removeClass(l.CLOSED_CLASS);this.adapter.removeClass(l.CLOSED_ANIMATION_OFF_CLASS);this.adapter.removeAttribute(m.ARIA_HIDDEN)};e.prototype.close=function(){this.adapter.addClass(l.CLOSED_CLASS);this.adapter.setAttribute(m.ARIA_HIDDEN,"true")};e.prototype.isClosed=function(){return this.adapter.hasClass(l.CLOSED_CLASS)};e.prototype.handleTransitionEnd=function(){if(this.adapter.hasClass(l.CLOSED_CLASS)){this.adapter.addClass(l.CLOSED_ANIMATION_OFF_CLASS)}};e.prototype.destroy=function(){r.prototype.destroy.call(this);if(this.observer){this.observer.disconnect()}};e.prototype.restartAnimation=function(){this.adapter.removeClass(l.ANIMATION_READY_CLASS);this.adapter.forceLayout();this.adapter.addClass(l.ANIMATION_READY_CLASS)};e.prototype.setPrimaryBarProgress=function(r){var e="scaleX("+r+")";var n=typeof window!=="undefined"?c(window,"transform"):"transform";this.adapter.setPrimaryBarStyle(n,e)};e.prototype.setBufferBarProgress=function(r){var e=r*100+"%";this.adapter.setBufferBarStyle(m.FLEX_BASIS,e)};e.prototype.calculateAndSetDimensions=function(r){var e=r*d.PRIMARY_HALF;var n=r*d.PRIMARY_FULL;var a=r*d.SECONDARY_QUARTER;var i=r*d.SECONDARY_HALF;var t=r*d.SECONDARY_FULL;this.adapter.setStyle("--mdc-linear-progress-primary-half",e+"px");this.adapter.setStyle("--mdc-linear-progress-primary-half-neg",-e+"px");this.adapter.setStyle("--mdc-linear-progress-primary-full",n+"px");this.adapter.setStyle("--mdc-linear-progress-primary-full-neg",-n+"px");this.adapter.setStyle("--mdc-linear-progress-secondary-quarter",a+"px");this.adapter.setStyle("--mdc-linear-progress-secondary-quarter-neg",-a+"px");this.adapter.setStyle("--mdc-linear-progress-secondary-half",i+"px");this.adapter.setStyle("--mdc-linear-progress-secondary-half-neg",-i+"px");this.adapter.setStyle("--mdc-linear-progress-secondary-full",t+"px");this.adapter.setStyle("--mdc-linear-progress-secondary-full-neg",-t+"px");this.restartAnimation()};return e}(s);
/**
 * @license
 * Copyright 2017 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */var g=function(r){a(e,r);function e(){return r!==null&&r.apply(this,arguments)||this}e.attachTo=function(r){return new e(r)};Object.defineProperty(e.prototype,"determinate",{set:function(r){this.foundation.setDeterminate(r)},enumerable:false,configurable:true});Object.defineProperty(e.prototype,"progress",{set:function(r){this.foundation.setProgress(r)},enumerable:false,configurable:true});Object.defineProperty(e.prototype,"buffer",{set:function(r){this.foundation.setBuffer(r)},enumerable:false,configurable:true});e.prototype.open=function(){this.foundation.open()};e.prototype.close=function(){this.foundation.close()};e.prototype.initialSyncWithDOM=function(){var r=this;this.root.addEventListener("transitionend",(function(){r.foundation.handleTransitionEnd()}))};e.prototype.getDefaultFoundation=function(){var r=this;var e={addClass:function(e){r.root.classList.add(e)},forceLayout:function(){r.root.getBoundingClientRect()},setBufferBarStyle:function(e,n){var a=r.root.querySelector(f.strings.BUFFER_BAR_SELECTOR);if(a){a.style.setProperty(e,n)}},setPrimaryBarStyle:function(e,n){var a=r.root.querySelector(f.strings.PRIMARY_BAR_SELECTOR);if(a){a.style.setProperty(e,n)}},hasClass:function(e){return r.root.classList.contains(e)},removeAttribute:function(e){r.root.removeAttribute(e)},removeClass:function(e){r.root.classList.remove(e)},setAttribute:function(e,n){r.root.setAttribute(e,n)},setStyle:function(e,n){r.root.style.setProperty(e,n)},attachResizeObserver:function(e){var n=window.ResizeObserver;if(n){var a=new n(e);a.observe(r.root);return a}return null},getWidth:function(){return r.root.offsetWidth}};return new f(e)};return e}(o);const u=":host{--mdc-theme-primary:var(\n      --lime-primary-color,\n      rgb(var(--color-teal-default))\n  );--mdc-theme-secondary:var(\n      --lime-secondary-color,\n      rgb(var(--contrast-1100))\n  );--mdc-theme-on-primary:var(\n      --lime-on-primary-color,\n      rgb(var(--contrast-100))\n  );--mdc-theme-on-secondary:var(\n      --lime-on-secondary-color,\n      rgb(var(--contrast-100))\n  );--mdc-theme-text-disabled-on-background:var(\n      --lime-text-disabled-on-background-color,\n      rgba(var(--contrast-1700), 0.38)\n  );--mdc-theme-text-primary-on-background:var(\n      --lime-text-primary-on-background-color,\n      rgba(var(--contrast-1700), 0.87)\n  );--mdc-theme-text-secondary-on-background:var(\n      --lime-text-secondary-on-background-color,\n      rgba(var(--contrast-1700), 0.54)\n  );--mdc-theme-error:var(\n      --lime-error-background-color,\n      rgb(var(--color-red-dark))\n  );--lime-error-text-color:rgb(var(--color-red-darker));--mdc-theme-surface:var(\n      --lime-surface-background-color,\n      rgb(var(--contrast-100))\n  );--mdc-theme-on-surface:var(\n      --lime-on-surface-color,\n      rgb(var(--contrast-1500))\n  )}@keyframes mdc-linear-progress-primary-indeterminate-translate{0%{transform:translateX(0)}20%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(0)}59.15%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(83.67142%);transform:translateX(var(--mdc-linear-progress-primary-half, 83.67142%))}100%{transform:translateX(200.611057%);transform:translateX(var(--mdc-linear-progress-primary-full, 200.611057%))}}@keyframes mdc-linear-progress-primary-indeterminate-scale{0%{transform:scaleX(0.08)}36.65%{animation-timing-function:cubic-bezier(0.334731, 0.12482, 0.785844, 1);transform:scaleX(0.08)}69.15%{animation-timing-function:cubic-bezier(0.06, 0.11, 0.6, 1);transform:scaleX(0.661479)}100%{transform:scaleX(0.08)}}@keyframes mdc-linear-progress-secondary-indeterminate-translate{0%{animation-timing-function:cubic-bezier(0.15, 0, 0.515058, 0.409685);transform:translateX(0)}25%{animation-timing-function:cubic-bezier(0.31033, 0.284058, 0.8, 0.733712);transform:translateX(37.651913%);transform:translateX(var(--mdc-linear-progress-secondary-quarter, 37.651913%))}48.35%{animation-timing-function:cubic-bezier(0.4, 0.627035, 0.6, 0.902026);transform:translateX(84.386165%);transform:translateX(var(--mdc-linear-progress-secondary-half, 84.386165%))}100%{transform:translateX(160.277782%);transform:translateX(var(--mdc-linear-progress-secondary-full, 160.277782%))}}@keyframes mdc-linear-progress-secondary-indeterminate-scale{0%{animation-timing-function:cubic-bezier(0.205028, 0.057051, 0.57661, 0.453971);transform:scaleX(0.08)}19.15%{animation-timing-function:cubic-bezier(0.152313, 0.196432, 0.648374, 1.004315);transform:scaleX(0.457104)}44.15%{animation-timing-function:cubic-bezier(0.257759, -0.003163, 0.211762, 1.38179);transform:scaleX(0.72796)}100%{transform:scaleX(0.08)}}@keyframes mdc-linear-progress-buffering{from{transform:rotate(180deg) translateX(-10px)}}@keyframes mdc-linear-progress-primary-indeterminate-translate-reverse{0%{transform:translateX(0)}20%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(0)}59.15%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(-83.67142%);transform:translateX(var(--mdc-linear-progress-primary-half-neg, -83.67142%))}100%{transform:translateX(-200.611057%);transform:translateX(var(--mdc-linear-progress-primary-full-neg, -200.611057%))}}@keyframes mdc-linear-progress-secondary-indeterminate-translate-reverse{0%{animation-timing-function:cubic-bezier(0.15, 0, 0.515058, 0.409685);transform:translateX(0)}25%{animation-timing-function:cubic-bezier(0.31033, 0.284058, 0.8, 0.733712);transform:translateX(-37.651913%);transform:translateX(var(--mdc-linear-progress-secondary-quarter-neg, -37.651913%))}48.35%{animation-timing-function:cubic-bezier(0.4, 0.627035, 0.6, 0.902026);transform:translateX(-84.386165%);transform:translateX(var(--mdc-linear-progress-secondary-half-neg, -84.386165%))}100%{transform:translateX(-160.277782%);transform:translateX(var(--mdc-linear-progress-secondary-full-neg, -160.277782%))}}@keyframes mdc-linear-progress-buffering-reverse{from{transform:translateX(-10px)}}.mdc-linear-progress{position:relative;width:100%;height:4px;transform:translateZ(0);outline:1px solid transparent;overflow:hidden;transition:opacity 250ms 0ms cubic-bezier(0.4, 0, 0.6, 1)}.mdc-linear-progress__bar{position:absolute;width:100%;height:100%;animation:none;transform-origin:top left;transition:transform 250ms 0ms cubic-bezier(0.4, 0, 0.6, 1)}.mdc-linear-progress__bar-inner{display:inline-block;position:absolute;width:100%;animation:none;border-top:4px solid}.mdc-linear-progress__buffer{display:flex;position:absolute;width:100%;height:100%}.mdc-linear-progress__buffer-dots{background-repeat:repeat-x;background-size:10px 4px;flex:auto;transform:rotate(180deg);animation:mdc-linear-progress-buffering 250ms infinite linear}.mdc-linear-progress__buffer-bar{flex:0 1 100%;transition:flex-basis 250ms 0ms cubic-bezier(0.4, 0, 0.6, 1)}.mdc-linear-progress__primary-bar{transform:scaleX(0)}.mdc-linear-progress__secondary-bar{display:none}.mdc-linear-progress--indeterminate .mdc-linear-progress__bar{transition:none}.mdc-linear-progress--indeterminate .mdc-linear-progress__primary-bar{left:-145.166611%}.mdc-linear-progress--indeterminate .mdc-linear-progress__secondary-bar{left:-54.888891%;display:block}.mdc-linear-progress--indeterminate.mdc-linear-progress--animation-ready .mdc-linear-progress__primary-bar{animation:mdc-linear-progress-primary-indeterminate-translate 2s infinite linear}.mdc-linear-progress--indeterminate.mdc-linear-progress--animation-ready .mdc-linear-progress__primary-bar>.mdc-linear-progress__bar-inner{animation:mdc-linear-progress-primary-indeterminate-scale 2s infinite linear}.mdc-linear-progress--indeterminate.mdc-linear-progress--animation-ready .mdc-linear-progress__secondary-bar{animation:mdc-linear-progress-secondary-indeterminate-translate 2s infinite linear}.mdc-linear-progress--indeterminate.mdc-linear-progress--animation-ready .mdc-linear-progress__secondary-bar>.mdc-linear-progress__bar-inner{animation:mdc-linear-progress-secondary-indeterminate-scale 2s infinite linear}[dir=rtl] .mdc-linear-progress,.mdc-linear-progress[dir=rtl]{}[dir=rtl] .mdc-linear-progress:not([dir=ltr]) .mdc-linear-progress__bar,.mdc-linear-progress[dir=rtl]:not([dir=ltr]) .mdc-linear-progress__bar{right:0;-webkit-transform-origin:center right;transform-origin:center right}[dir=rtl] .mdc-linear-progress:not([dir=ltr]).mdc-linear-progress--animation-ready .mdc-linear-progress__primary-bar,.mdc-linear-progress[dir=rtl]:not([dir=ltr]).mdc-linear-progress--animation-ready .mdc-linear-progress__primary-bar{animation-name:mdc-linear-progress-primary-indeterminate-translate-reverse}[dir=rtl] .mdc-linear-progress:not([dir=ltr]).mdc-linear-progress--animation-ready .mdc-linear-progress__secondary-bar,.mdc-linear-progress[dir=rtl]:not([dir=ltr]).mdc-linear-progress--animation-ready .mdc-linear-progress__secondary-bar{animation-name:mdc-linear-progress-secondary-indeterminate-translate-reverse}[dir=rtl] .mdc-linear-progress:not([dir=ltr]) .mdc-linear-progress__buffer-dots,.mdc-linear-progress[dir=rtl]:not([dir=ltr]) .mdc-linear-progress__buffer-dots{animation:mdc-linear-progress-buffering-reverse 250ms infinite linear;transform:rotate(0)}[dir=rtl] .mdc-linear-progress:not([dir=ltr]).mdc-linear-progress--indeterminate .mdc-linear-progress__primary-bar,.mdc-linear-progress[dir=rtl]:not([dir=ltr]).mdc-linear-progress--indeterminate .mdc-linear-progress__primary-bar{right:-145.166611%;left:auto}[dir=rtl] .mdc-linear-progress:not([dir=ltr]).mdc-linear-progress--indeterminate .mdc-linear-progress__secondary-bar,.mdc-linear-progress[dir=rtl]:not([dir=ltr]).mdc-linear-progress--indeterminate .mdc-linear-progress__secondary-bar{right:-54.888891%;left:auto}.mdc-linear-progress--closed{opacity:0}.mdc-linear-progress--closed-animation-off .mdc-linear-progress__buffer-dots{animation:none}.mdc-linear-progress--closed-animation-off.mdc-linear-progress--indeterminate .mdc-linear-progress__bar,.mdc-linear-progress--closed-animation-off.mdc-linear-progress--indeterminate .mdc-linear-progress__bar .mdc-linear-progress__bar-inner{animation:none}.mdc-linear-progress__bar-inner{border-color:#26a69a;border-color:var(--mdc-theme-primary, #26a69a)}.mdc-linear-progress__buffer-dots{background-image:url(\"data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' enable-background='new 0 0 5 2' xml:space='preserve' viewBox='0 0 5 2' preserveAspectRatio='none slice'%3E%3Ccircle cx='1' cy='1' r='1' fill='%23e6e6e6'/%3E%3C/svg%3E\")}.mdc-linear-progress__buffer-bar{background-color:#e6e6e6}.mdc-linear-progress{text-align:left}.mdc-linear-progress__buffer-dots{background-image:url(\"data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' enable-background='new 0 0 5 2' xml:space='preserve' viewBox='0 0 5 2' preserveAspectRatio='none slice'%3E%3Ccircle cx='1' cy='1' r='1' fill='var(--background-color, rgba(var(--contrast-800), 0.5))'/%3E%3C/svg%3E\")}.mdc-linear-progress__buffer-bar{background-color:var(--background-color, rgba(var(--contrast-800), 0.5))}";const p=class{constructor(e){r(this,e);this.value=0;this.indeterminate=false}connectedCallback(){this.initialize()}componentDidLoad(){this.initialize()}initialize(){const r=this.host.shadowRoot.querySelector(".mdc-linear-progress");if(!r){return}this.mdcLinearProgress=new g(r);this.mdcLinearProgress.progress=this.value}disconnectedCallback(){if(this.mdcLinearProgress){this.mdcLinearProgress.destroy()}}render(){if(!this.isFinite(this.value)){return}const r={"mdc-linear-progress":true,"mdc-linear-progress--indeterminate":this.indeterminate};return e("div",{role:"progressbar",class:r,"aria-label":"Progress Bar","aria-valuemin":"0","aria-valuemax":"1","aria-valuenow":this.value},e("div",{class:"mdc-linear-progress__buffer"},e("div",{class:"mdc-linear-progress__buffer-bar"})),e("div",{class:"mdc-linear-progress__bar mdc-linear-progress__primary-bar"},e("span",{class:"mdc-linear-progress__bar-inner"})),e("div",{class:"mdc-linear-progress__bar mdc-linear-progress__secondary-bar"},e("span",{class:"mdc-linear-progress__bar-inner"})))}watchValue(r){if(!this.mdcLinearProgress||!this.isFinite(r)){return}this.mdcLinearProgress.progress=r}isFinite(r){return Number.isFinite(r)}get host(){return n(this)}static get watchers(){return{value:["watchValue"]}}};p.style=u;export{p as limel_linear_progress};
//# sourceMappingURL=limel-linear-progress.entry.js.map