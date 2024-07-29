import{r as t,c as n,h as i,g as e}from"./index-6156b4fd.js";import{t as s}from"./translations-8927471e.js";import{_ as r,a,M as c,b as o}from"./component-908b71cd.js";import{c as u}from"./ponyfill-30263d5e.js";
/**
 * @license
 * Copyright 2018 Google Inc.
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
 */var l={CLOSING:"mdc-snackbar--closing",OPEN:"mdc-snackbar--open",OPENING:"mdc-snackbar--opening"};var f={ACTION_SELECTOR:".mdc-snackbar__action",ARIA_LIVE_LABEL_TEXT_ATTR:"data-mdc-snackbar-label-text",CLOSED_EVENT:"MDCSnackbar:closed",CLOSING_EVENT:"MDCSnackbar:closing",DISMISS_SELECTOR:".mdc-snackbar__dismiss",LABEL_SELECTOR:".mdc-snackbar__label",OPENED_EVENT:"MDCSnackbar:opened",OPENING_EVENT:"MDCSnackbar:opening",REASON_ACTION:"action",REASON_DISMISS:"dismiss",SURFACE_SELECTOR:".mdc-snackbar__surface"};var d={DEFAULT_AUTO_DISMISS_TIMEOUT_MS:5e3,INDETERMINATE:-1,MAX_AUTO_DISMISS_TIMEOUT_MS:1e4,MIN_AUTO_DISMISS_TIMEOUT_MS:4e3,SNACKBAR_ANIMATION_CLOSE_TIME_MS:75,SNACKBAR_ANIMATION_OPEN_TIME_MS:150,ARIA_LIVE_DELAY_MS:1e3};
/**
 * @license
 * Copyright 2018 Google Inc.
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
 */var h=d.ARIA_LIVE_DELAY_MS;var m=f.ARIA_LIVE_LABEL_TEXT_ATTR;function b(t,n){if(n===void 0){n=t}var i=t.getAttribute("aria-live");var e=n.textContent.trim();if(!e||!i){return}t.setAttribute("aria-live","off");n.textContent="";n.innerHTML='<span style="display: inline-block; width: 0; height: 1px;">&nbsp;</span>';n.setAttribute(m,e);setTimeout((function(){t.setAttribute("aria-live",i);n.removeAttribute(m);n.textContent=e}),h)}
/**
 * @license
 * Copyright 2018 Google Inc.
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
 */var _=l.OPENING,g=l.OPEN,k=l.CLOSING;var v=f.REASON_ACTION,p=f.REASON_DISMISS;var E=function(t){r(n,t);function n(i){var e=t.call(this,a(a({},n.defaultAdapter),i))||this;e.opened=false;e.animationFrame=0;e.animationTimer=0;e.autoDismissTimer=0;e.autoDismissTimeoutMs=d.DEFAULT_AUTO_DISMISS_TIMEOUT_MS;e.closeOnEscape=true;return e}Object.defineProperty(n,"cssClasses",{get:function(){return l},enumerable:false,configurable:true});Object.defineProperty(n,"strings",{get:function(){return f},enumerable:false,configurable:true});Object.defineProperty(n,"numbers",{get:function(){return d},enumerable:false,configurable:true});Object.defineProperty(n,"defaultAdapter",{get:function(){return{addClass:function(){return undefined},announce:function(){return undefined},notifyClosed:function(){return undefined},notifyClosing:function(){return undefined},notifyOpened:function(){return undefined},notifyOpening:function(){return undefined},removeClass:function(){return undefined}}},enumerable:false,configurable:true});n.prototype.destroy=function(){this.clearAutoDismissTimer();cancelAnimationFrame(this.animationFrame);this.animationFrame=0;clearTimeout(this.animationTimer);this.animationTimer=0;this.adapter.removeClass(_);this.adapter.removeClass(g);this.adapter.removeClass(k)};n.prototype.open=function(){var t=this;this.clearAutoDismissTimer();this.opened=true;this.adapter.notifyOpening();this.adapter.removeClass(k);this.adapter.addClass(_);this.adapter.announce();this.runNextAnimationFrame((function(){t.adapter.addClass(g);t.animationTimer=setTimeout((function(){var n=t.getTimeoutMs();t.handleAnimationTimerEnd();t.adapter.notifyOpened();if(n!==d.INDETERMINATE){t.autoDismissTimer=setTimeout((function(){t.close(p)}),n)}}),d.SNACKBAR_ANIMATION_OPEN_TIME_MS)}))};n.prototype.close=function(t){var n=this;if(t===void 0){t=""}if(!this.opened){return}cancelAnimationFrame(this.animationFrame);this.animationFrame=0;this.clearAutoDismissTimer();this.opened=false;this.adapter.notifyClosing(t);this.adapter.addClass(l.CLOSING);this.adapter.removeClass(l.OPEN);this.adapter.removeClass(l.OPENING);clearTimeout(this.animationTimer);this.animationTimer=setTimeout((function(){n.handleAnimationTimerEnd();n.adapter.notifyClosed(t)}),d.SNACKBAR_ANIMATION_CLOSE_TIME_MS)};n.prototype.isOpen=function(){return this.opened};n.prototype.getTimeoutMs=function(){return this.autoDismissTimeoutMs};n.prototype.setTimeoutMs=function(t){var n=d.MIN_AUTO_DISMISS_TIMEOUT_MS;var i=d.MAX_AUTO_DISMISS_TIMEOUT_MS;var e=d.INDETERMINATE;if(t===d.INDETERMINATE||t<=i&&t>=n){this.autoDismissTimeoutMs=t}else{throw new Error("\n        timeoutMs must be an integer in the range "+n+"–"+i+"\n        (or "+e+" to disable), but got '"+t+"'")}};n.prototype.getCloseOnEscape=function(){return this.closeOnEscape};n.prototype.setCloseOnEscape=function(t){this.closeOnEscape=t};n.prototype.handleKeyDown=function(t){var n=t.key==="Escape"||t.keyCode===27;if(n&&this.getCloseOnEscape()){this.close(p)}};n.prototype.handleActionButtonClick=function(t){this.close(v)};n.prototype.handleActionIconClick=function(t){this.close(p)};n.prototype.clearAutoDismissTimer=function(){clearTimeout(this.autoDismissTimer);this.autoDismissTimer=0};n.prototype.handleAnimationTimerEnd=function(){this.animationTimer=0;this.adapter.removeClass(l.OPENING);this.adapter.removeClass(l.CLOSING)};n.prototype.runNextAnimationFrame=function(t){var n=this;cancelAnimationFrame(this.animationFrame);this.animationFrame=requestAnimationFrame((function(){n.animationFrame=0;clearTimeout(n.animationTimer);n.animationTimer=setTimeout(t,0)}))};return n}(c);
/**
 * @license
 * Copyright 2018 Google Inc.
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
 */var T=f.SURFACE_SELECTOR,O=f.LABEL_SELECTOR,S=f.ACTION_SELECTOR,y=f.DISMISS_SELECTOR,A=f.OPENING_EVENT,I=f.OPENED_EVENT,M=f.CLOSING_EVENT,C=f.CLOSED_EVENT;var N=function(t){r(n,t);function n(){return t!==null&&t.apply(this,arguments)||this}n.attachTo=function(t){return new n(t)};n.prototype.initialize=function(t){if(t===void 0){t=function(){return b}}this.announce=t()};n.prototype.initialSyncWithDOM=function(){var t=this;this.surfaceEl=this.root.querySelector(T);this.labelEl=this.root.querySelector(O);this.actionEl=this.root.querySelector(S);this.handleKeyDown=function(n){t.foundation.handleKeyDown(n)};this.handleSurfaceClick=function(n){var i=n.target;if(t.isActionButton(i)){t.foundation.handleActionButtonClick(n)}else if(t.isActionIcon(i)){t.foundation.handleActionIconClick(n)}};this.registerKeyDownHandler(this.handleKeyDown);this.registerSurfaceClickHandler(this.handleSurfaceClick)};n.prototype.destroy=function(){t.prototype.destroy.call(this);this.deregisterKeyDownHandler(this.handleKeyDown);this.deregisterSurfaceClickHandler(this.handleSurfaceClick)};n.prototype.open=function(){this.foundation.open()};n.prototype.close=function(t){if(t===void 0){t=""}this.foundation.close(t)};n.prototype.getDefaultFoundation=function(){var t=this;var n={addClass:function(n){t.root.classList.add(n)},announce:function(){t.announce(t.labelEl)},notifyClosed:function(n){return t.emit(C,n?{reason:n}:{})},notifyClosing:function(n){return t.emit(M,n?{reason:n}:{})},notifyOpened:function(){return t.emit(I,{})},notifyOpening:function(){return t.emit(A,{})},removeClass:function(n){return t.root.classList.remove(n)}};return new E(n)};Object.defineProperty(n.prototype,"timeoutMs",{get:function(){return this.foundation.getTimeoutMs()},set:function(t){this.foundation.setTimeoutMs(t)},enumerable:false,configurable:true});Object.defineProperty(n.prototype,"closeOnEscape",{get:function(){return this.foundation.getCloseOnEscape()},set:function(t){this.foundation.setCloseOnEscape(t)},enumerable:false,configurable:true});Object.defineProperty(n.prototype,"isOpen",{get:function(){return this.foundation.isOpen()},enumerable:false,configurable:true});Object.defineProperty(n.prototype,"labelText",{get:function(){return this.labelEl.textContent},set:function(t){this.labelEl.textContent=t},enumerable:false,configurable:true});Object.defineProperty(n.prototype,"actionButtonText",{get:function(){return this.actionEl.textContent},set:function(t){this.actionEl.textContent=t},enumerable:false,configurable:true});n.prototype.registerKeyDownHandler=function(t){this.listen("keydown",t)};n.prototype.deregisterKeyDownHandler=function(t){this.unlisten("keydown",t)};n.prototype.registerSurfaceClickHandler=function(t){this.surfaceEl.addEventListener("click",t)};n.prototype.deregisterSurfaceClickHandler=function(t){this.surfaceEl.removeEventListener("click",t)};n.prototype.isActionButton=function(t){return Boolean(u(t,S))};n.prototype.isActionIcon=function(t){return Boolean(u(t,y))};return n}(o);const w="*{box-sizing:border-box}.mdc-snackbar{top:var(--snackbar-top, auto);right:var(--snackbar-right, 0);bottom:var(--snackbar-bottom, 0);left:var(--snackbar-left, 0);display:none;position:fixed;z-index:8;padding:0.75rem;align-items:center;justify-content:center}.mdc-snackbar--opening,.mdc-snackbar--open,.mdc-snackbar--closing{display:flex}.mdc-snackbar--open .mdc-snackbar__label,.mdc-snackbar--open .mdc-snackbar__actions{visibility:visible}.mdc-snackbar--open .mdc-snackbar__surface{transform:scale(1);opacity:1}.mdc-snackbar__surface{transition:opacity 0.2s cubic-bezier(0, 0, 0.2, 1), transform 0.2s cubic-bezier(0, 0, 0.2, 1);padding:0.5rem;display:flex;align-items:center;justify-content:flex-start;gap:0.25rem;min-height:3.25rem;min-width:unset;max-width:42rem;transform:scale(0.8);opacity:0;border-radius:0.75rem;background-color:rgb(var(--contrast-1400));box-shadow:var(--shadow-depth-8), var(--shadow-depth-16)}.mdc-snackbar__label{visibility:hidden;color:rgb(var(--contrast-100));-webkit-font-smoothing:antialiased;font-size:0.8125rem;font-weight:400;padding:0 0.25rem;width:100%;flex-grow:1}.mdc-snackbar__actions{visibility:hidden;display:flex;flex-shrink:0;align-items:center;box-sizing:border-box;gap:0.5rem}.dismiss,.mdc-snackbar__actions{--lime-elevated-surface-background-color:rgb(\n      var(--contrast-1300)\n  )}.dismiss{--mdc-theme-on-surface:rgb(var(--contrast-100));--icon-background-color:var(--lime-elevated-surface-background-color);--fill-color:var(--mdc-theme-primary);--track-color:rgb(var(--contrast-800), 0.2);position:absolute;top:-0.9rem;left:-0.9rem;transform:scale(0.8);display:flex;align-items:center;justify-content:center}.dismiss limel-icon-button.mdc-snackbar__dismiss{transform:scale(0.8);margin:0;padding:0}.dismiss svg{position:absolute;transform:rotate(90deg);fill:transparent;stroke-dasharray:100;stroke-linecap:round}.mdc-snackbar--open .dismiss svg{animation:timeout var(--snackbar-timeout) linear forwards}@keyframes timeout{0%{stroke-width:4;stroke-dashoffset:0;opacity:1}100%{stroke-width:1;stroke-dashoffset:-100;opacity:0.7}}";const x=class{constructor(i){t(this,i);this.action=n(this,"action",7);this.hide=n(this,"hide",7);this.message=undefined;this.timeout=5e3;this.actionText=undefined;this.dismissible=true;this.multiline=undefined;this.language="en";this.handleMdcClosing=this.handleMdcClosing.bind(this)}connectedCallback(){this.initialize()}componentDidLoad(){this.initialize()}initialize(){const t=this.host.shadowRoot.querySelector(".mdc-snackbar");if(!t){return}this.mdcSnackbar=new N(t);this.mdcSnackbar.listen("MDCSnackbar:closing",this.handleMdcClosing)}disconnectedCallback(){this.mdcSnackbar.unlisten("MDCSnackbar:closing",this.handleMdcClosing);this.mdcSnackbar.destroy()}async show(){if(this.timeout){this.mdcSnackbar.timeoutMs=this.timeout}this.mdcSnackbar.labelText=this.message;this.mdcSnackbar.open()}render(){return i("aside",{class:`\n                    mdc-snackbar\n                    ${this.multiline?"mdc-snackbar--stacked":""}\n                `,style:{"--snackbar-timeout":`${this.timeout}ms`}},i("div",{class:"mdc-snackbar__surface",role:"status","aria-relevant":"additions"},i("div",{class:"mdc-snackbar__label","aria-atomic":"false"}),this.renderActions(this.actionText),this.renderDismissButton(this.dismissible)))}handleMdcClosing(t){if(t.detail.reason==="action"){this.action.emit()}else{this.hide.emit()}}renderActions(t){if(!t){return}return i("div",{class:"mdc-snackbar__actions","aria-atomic":"true"},this.renderActionButton(t))}renderActionButton(t){if(!t){return}return i("limel-button",{class:"mdc-button mdc-snackbar__action",label:t})}renderDismissButton(t){if(!t){return}const n=s.get("snackbar.dismiss",this.language);return i("div",{class:"dismiss"},this.renderTimeoutVisualization(),i("limel-icon-button",{class:"mdc-icon-button mdc-snackbar__dismiss",icon:"multiply",label:n}))}renderTimeoutVisualization(){return i("svg",{width:"36",height:"36",viewBox:"0 0 36 36"},i("circle",{r:"18",cx:"18",cy:"18",fill:"var(--track-color)"}),i("path",{class:"track",d:"M 18,18 m -16,0 a 16,16 0 1,0 32,0 a 16,16 0 1,0 -32,0",stroke:"var(--fill-color)"}))}get host(){return e(this)}};x.style=w;export{x as limel_snackbar};
//# sourceMappingURL=limel-snackbar.entry.js.map