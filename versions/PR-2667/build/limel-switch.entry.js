import{r as c,c as e,h as t,H as i,g as r}from"./index-6156b4fd.js";import{c as s}from"./random-string-812b1c35.js";import{m as d,r as a}from"./make-enter-clickable-a1d99f5e.js";import{a as o,c as n,_ as l,e as h,d as m,M as w,b as p}from"./component-8200fd05.js";import{M as f,b as u}from"./component-c4a88229.js";import"./ponyfill-30263d5e.js";
/**
 * @license
 * Copyright 2021 Google Inc.
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
 */var b;(function(c){c["PROCESSING"]="mdc-switch--processing";c["SELECTED"]="mdc-switch--selected";c["UNSELECTED"]="mdc-switch--unselected"})(b||(b={}));var v;(function(c){c["RIPPLE"]=".mdc-switch__ripple"})(v||(v={}));
/**
 * @license
 * Copyright 2021 Google Inc.
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
 */function _(c,e,t){var i=y(c,e);var r=i.getObservers(e);r.push(t);return function(){r.splice(r.indexOf(t),1)}}var g=new WeakMap;function y(c,e){var t=new Map;if(!g.has(c)){g.set(c,{isEnabled:true,getObservers:function(c){var e=t.get(c)||[];if(!t.has(c)){t.set(c,e)}return e},installedProperties:new Set})}var i=g.get(c);if(i.installedProperties.has(e)){return i}var r=k(c,e)||{configurable:true,enumerable:true,value:c[e],writable:true};var s=o({},r);var d=r.get,a=r.set;if("value"in r){delete s.value;delete s.writable;var l=r.value;d=function(){return l};if(r.writable){a=function(c){l=c}}}if(d){s.get=function(){return d.call(this)}}if(a){s.set=function(c){var t,r;var s=d?d.call(this):c;a.call(this,c);if(i.isEnabled&&(!d||c!==s)){try{for(var o=n(i.getObservers(e)),l=o.next();!l.done;l=o.next()){var h=l.value;h(c,s)}}catch(c){t={error:c}}finally{try{if(l&&!l.done&&(r=o.return))r.call(o)}finally{if(t)throw t.error}}}}}i.installedProperties.add(e);Object.defineProperty(c,e,s);return i}function k(c,e){var t=c;var i;while(t){i=Object.getOwnPropertyDescriptor(t,e);if(i){break}t=Object.getPrototypeOf(t)}return i}function x(c,e){var t=g.get(c);if(t){t.isEnabled=e}}
/**
 * @license
 * Copyright 2021 Google Inc.
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
 */var z=function(c){l(e,c);function e(e){var t=c.call(this,e)||this;t.unobserves=new Set;return t}e.prototype.destroy=function(){c.prototype.destroy.call(this);this.unobserve()};e.prototype.observe=function(c,e){var t,i;var r=this;var s=[];try{for(var d=n(Object.keys(e)),a=d.next();!a.done;a=d.next()){var o=a.value;var l=e[o].bind(this);s.push(this.observeProperty(c,o,l))}}catch(c){t={error:c}}finally{try{if(a&&!a.done&&(i=d.return))i.call(d)}finally{if(t)throw t.error}}var h=function(){var c,e;try{for(var t=n(s),i=t.next();!i.done;i=t.next()){var d=i.value;d()}}catch(e){c={error:e}}finally{try{if(i&&!i.done&&(e=t.return))e.call(t)}finally{if(c)throw c.error}}r.unobserves.delete(h)};this.unobserves.add(h);return h};e.prototype.observeProperty=function(c,e,t){return _(c,e,t)};e.prototype.setObserversEnabled=function(c,e){x(c,e)};e.prototype.unobserve=function(){var c,e;try{for(var t=n(h([],m(this.unobserves))),i=t.next();!i.done;i=t.next()){var r=i.value;r()}}catch(e){c={error:e}}finally{try{if(i&&!i.done&&(e=t.return))e.call(t)}finally{if(c)throw c.error}}};return e}(w);
/**
 * @license
 * Copyright 2021 Google Inc.
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
 */var T=function(c){l(e,c);function e(e){var t=c.call(this,e)||this;t.handleClick=t.handleClick.bind(t);return t}e.prototype.init=function(){this.observe(this.adapter.state,{disabled:this.stopProcessingIfDisabled,processing:this.stopProcessingIfDisabled})};e.prototype.handleClick=function(){if(this.adapter.state.disabled){return}this.adapter.state.selected=!this.adapter.state.selected};e.prototype.stopProcessingIfDisabled=function(){if(this.adapter.state.disabled){this.adapter.state.processing=false}};return e}(z);var j=function(c){l(e,c);function e(){return c!==null&&c.apply(this,arguments)||this}e.prototype.init=function(){c.prototype.init.call(this);this.observe(this.adapter.state,{disabled:this.onDisabledChange,processing:this.onProcessingChange,selected:this.onSelectedChange})};e.prototype.initFromDOM=function(){this.setObserversEnabled(this.adapter.state,false);this.adapter.state.selected=this.adapter.hasClass(b.SELECTED);this.onSelectedChange();this.adapter.state.disabled=this.adapter.isDisabled();this.adapter.state.processing=this.adapter.hasClass(b.PROCESSING);this.setObserversEnabled(this.adapter.state,true);this.stopProcessingIfDisabled()};e.prototype.onDisabledChange=function(){this.adapter.setDisabled(this.adapter.state.disabled)};e.prototype.onProcessingChange=function(){this.toggleClass(this.adapter.state.processing,b.PROCESSING)};e.prototype.onSelectedChange=function(){this.adapter.setAriaChecked(String(this.adapter.state.selected));this.toggleClass(this.adapter.state.selected,b.SELECTED);this.toggleClass(!this.adapter.state.selected,b.UNSELECTED)};e.prototype.toggleClass=function(c,e){if(c){this.adapter.addClass(e)}else{this.adapter.removeClass(e)}};return e}(T);
/**
 * @license
 * Copyright 2021 Google Inc.
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
 */var X=function(c){l(e,c);function e(e,t){var i=c.call(this,e,t)||this;i.root=e;return i}e.attachTo=function(c){return new e(c)};e.prototype.initialize=function(){this.ripple=new f(this.root,this.createRippleFoundation())};e.prototype.initialSyncWithDOM=function(){var c=this.root.querySelector(v.RIPPLE);if(!c){throw new Error("Switch "+v.RIPPLE+" element is required.")}this.rippleElement=c;this.root.addEventListener("click",this.foundation.handleClick);this.foundation.initFromDOM()};e.prototype.destroy=function(){c.prototype.destroy.call(this);this.ripple.destroy();this.root.removeEventListener("click",this.foundation.handleClick)};e.prototype.getDefaultFoundation=function(){return new j(this.createAdapter())};e.prototype.createAdapter=function(){var c=this;return{addClass:function(e){c.root.classList.add(e)},hasClass:function(e){return c.root.classList.contains(e)},isDisabled:function(){return c.root.disabled},removeClass:function(e){c.root.classList.remove(e)},setAriaChecked:function(e){return c.root.setAttribute("aria-checked",e)},setDisabled:function(e){c.root.disabled=e},state:this}};e.prototype.createRippleFoundation=function(){return new u(this.createRippleAdapter())};e.prototype.createRippleAdapter=function(){var c=this;return o(o({},f.createAdapter(this)),{computeBoundingRect:function(){return c.rippleElement.getBoundingClientRect()},isUnbounded:function(){return true}})};return e}(p);const B='@charset "UTF-8";:host{--mdc-theme-primary:var(\n      --lime-primary-color,\n      rgb(var(--color-teal-default))\n  );--mdc-theme-secondary:var(\n      --lime-secondary-color,\n      rgb(var(--contrast-1100))\n  );--mdc-theme-on-primary:var(\n      --lime-on-primary-color,\n      rgb(var(--contrast-100))\n  );--mdc-theme-on-secondary:var(\n      --lime-on-secondary-color,\n      rgb(var(--contrast-100))\n  );--mdc-theme-text-disabled-on-background:var(\n      --lime-text-disabled-on-background-color,\n      rgba(var(--contrast-1700), 0.38)\n  );--mdc-theme-text-primary-on-background:var(\n      --lime-text-primary-on-background-color,\n      rgba(var(--contrast-1700), 0.87)\n  );--mdc-theme-text-secondary-on-background:var(\n      --lime-text-secondary-on-background-color,\n      rgba(var(--contrast-1700), 0.54)\n  );--mdc-theme-error:var(\n      --lime-error-background-color,\n      rgb(var(--color-red-dark))\n  );--lime-error-text-color:rgb(var(--color-red-darker));--mdc-theme-surface:var(\n      --lime-surface-background-color,\n      rgb(var(--contrast-100))\n  );--mdc-theme-on-surface:var(\n      --lime-on-surface-color,\n      rgb(var(--contrast-1500))\n  )}.mdc-elevation-overlay{position:absolute;border-radius:inherit;pointer-events:none;opacity:0;opacity:var(--mdc-elevation-overlay-opacity, 0);transition:opacity 280ms cubic-bezier(0.4, 0, 0.2, 1);background-color:#fff;background-color:var(--mdc-elevation-overlay-color, #fff)}.mdc-switch{align-items:center;background:none;border:none;cursor:pointer;display:inline-flex;flex-shrink:0;margin:0;outline:none;overflow:visible;padding:0;position:relative}.mdc-switch:disabled{cursor:default;pointer-events:none}.mdc-switch__track{overflow:hidden;position:relative;width:100%}.mdc-switch__track::before,.mdc-switch__track::after{border:1px solid transparent;border-radius:inherit;box-sizing:border-box;content:"";height:100%;left:0;position:absolute;width:100%}.mdc-switch__track::before{transition:transform 75ms 0ms cubic-bezier(0, 0, 0.2, 1);transform:translateX(0)}.mdc-switch__track::after{transition:transform 75ms 0ms cubic-bezier(0.4, 0, 0.6, 1);transform:translateX(-100%)}[dir=rtl] .mdc-switch__track::after,.mdc-switch__track[dir=rtl]::after{transform:translateX(100%);}.mdc-switch--selected .mdc-switch__track::before{transition:transform 75ms 0ms cubic-bezier(0.4, 0, 0.6, 1);transform:translateX(100%)}[dir=rtl] .mdc-switch--selected .mdc-switch__track::before,.mdc-switch--selected .mdc-switch__track[dir=rtl]::before{transform:translateX(-100%);}.mdc-switch--selected .mdc-switch__track::after{transition:transform 75ms 0ms cubic-bezier(0, 0, 0.2, 1);transform:translateX(0)}.mdc-switch__handle-track{height:100%;pointer-events:none;position:absolute;top:0;transition:transform 75ms 0ms cubic-bezier(0.4, 0, 0.2, 1);left:0;right:auto;transform:translateX(0)}[dir=rtl] .mdc-switch__handle-track,.mdc-switch__handle-track[dir=rtl]{left:auto;right:0;}.mdc-switch--selected .mdc-switch__handle-track{transform:translateX(100%)}[dir=rtl] .mdc-switch--selected .mdc-switch__handle-track,.mdc-switch--selected .mdc-switch__handle-track[dir=rtl]{transform:translateX(-100%);}.mdc-switch__handle{display:flex;pointer-events:auto;position:absolute;top:50%;transform:translateY(-50%);left:0;right:auto}[dir=rtl] .mdc-switch__handle,.mdc-switch__handle[dir=rtl]{left:auto;right:0;}.mdc-switch__handle::before,.mdc-switch__handle::after{border:1px solid transparent;border-radius:inherit;box-sizing:border-box;content:"";width:100%;height:100%;left:0;position:absolute;top:0;transition:background-color 75ms 0ms cubic-bezier(0.4, 0, 0.2, 1), border-color 75ms 0ms cubic-bezier(0.4, 0, 0.2, 1);z-index:-1}.mdc-switch__shadow{border-radius:inherit;bottom:0;left:0;position:absolute;right:0;top:0}.mdc-elevation-overlay{bottom:0;left:0;right:0;top:0}.mdc-switch__ripple{left:50%;position:absolute;top:50%;transform:translate(-50%, -50%);z-index:-1}.mdc-switch:disabled .mdc-switch__ripple{display:none}.mdc-switch__icons{height:100%;position:relative;width:100%;z-index:1}.mdc-switch__icon{bottom:0;left:0;margin:auto;position:absolute;right:0;top:0;opacity:0;transition:opacity 30ms 0ms cubic-bezier(0.4, 0, 1, 1)}.mdc-switch--selected .mdc-switch__icon--on,.mdc-switch--unselected .mdc-switch__icon--off{opacity:1;transition:opacity 45ms 30ms cubic-bezier(0, 0, 0.2, 1)}.mdc-switch{--mdc-ripple-fg-size:0;--mdc-ripple-left:0;--mdc-ripple-top:0;--mdc-ripple-fg-scale:1;--mdc-ripple-fg-translate-end:0;--mdc-ripple-fg-translate-start:0;-webkit-tap-highlight-color:rgba(0, 0, 0, 0);will-change:transform, opacity}@keyframes mdc-ripple-fg-radius-in{from{animation-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transform:translate(var(--mdc-ripple-fg-translate-start, 0)) scale(1)}to{transform:translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1))}}@keyframes mdc-ripple-fg-opacity-in{from{animation-timing-function:linear;opacity:0}to{opacity:var(--mdc-ripple-fg-opacity, 0)}}@keyframes mdc-ripple-fg-opacity-out{from{animation-timing-function:linear;opacity:var(--mdc-ripple-fg-opacity, 0)}to{opacity:0}}.mdc-switch .mdc-switch__ripple::before,.mdc-switch .mdc-switch__ripple::after{position:absolute;border-radius:50%;opacity:0;pointer-events:none;content:""}.mdc-switch .mdc-switch__ripple::before{transition:opacity 15ms linear, background-color 15ms linear;z-index:1;z-index:var(--mdc-ripple-z-index, 1)}.mdc-switch .mdc-switch__ripple::after{z-index:0;z-index:var(--mdc-ripple-z-index, 0)}.mdc-switch.mdc-ripple-upgraded .mdc-switch__ripple::before{transform:scale(var(--mdc-ripple-fg-scale, 1))}.mdc-switch.mdc-ripple-upgraded .mdc-switch__ripple::after{top:0;left:0;transform:scale(0);transform-origin:center center}.mdc-switch.mdc-ripple-upgraded--unbounded .mdc-switch__ripple::after{top:var(--mdc-ripple-top, 0);left:var(--mdc-ripple-left, 0)}.mdc-switch.mdc-ripple-upgraded--foreground-activation .mdc-switch__ripple::after{animation:mdc-ripple-fg-radius-in 225ms forwards, mdc-ripple-fg-opacity-in 75ms forwards}.mdc-switch.mdc-ripple-upgraded--foreground-deactivation .mdc-switch__ripple::after{animation:mdc-ripple-fg-opacity-out 150ms;transform:translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1))}.mdc-switch .mdc-switch__ripple::before,.mdc-switch .mdc-switch__ripple::after{top:calc(50% - 50%);left:calc(50% - 50%);width:100%;height:100%}.mdc-switch.mdc-ripple-upgraded .mdc-switch__ripple::before,.mdc-switch.mdc-ripple-upgraded .mdc-switch__ripple::after{top:var(--mdc-ripple-top, calc(50% - 50%));left:var(--mdc-ripple-left, calc(50% - 50%));width:var(--mdc-ripple-fg-size, 100%);height:var(--mdc-ripple-fg-size, 100%)}.mdc-switch.mdc-ripple-upgraded .mdc-switch__ripple::after{width:var(--mdc-ripple-fg-size, 100%);height:var(--mdc-ripple-fg-size, 100%)}.mdc-switch{width:36px;width:var(--mdc-switch-track-width, 36px)}.mdc-switch.mdc-switch--selected:enabled .mdc-switch__handle::after{background:#26a69a;background:var(--mdc-switch-selected-handle-color, var(--mdc-theme-primary, #26a69a))}.mdc-switch.mdc-switch--selected:enabled:hover:not(:focus):not(:active) .mdc-switch__handle::after{background:#26534f;background:var(--mdc-switch-selected-hover-handle-color, #26534f)}.mdc-switch.mdc-switch--selected:enabled:focus:not(:active) .mdc-switch__handle::after{background:#26534f;background:var(--mdc-switch-selected-focus-handle-color, #26534f)}.mdc-switch.mdc-switch--selected:enabled:active .mdc-switch__handle::after{background:#26534f;background:var(--mdc-switch-selected-pressed-handle-color, #26534f)}.mdc-switch.mdc-switch--selected:disabled .mdc-switch__handle::after{background:#424242;background:var(--mdc-switch-disabled-selected-handle-color, #424242)}.mdc-switch.mdc-switch--unselected:enabled .mdc-switch__handle::after{background:#616161;background:var(--mdc-switch-unselected-handle-color, #616161)}.mdc-switch.mdc-switch--unselected:enabled:hover:not(:focus):not(:active) .mdc-switch__handle::after{background:#212121;background:var(--mdc-switch-unselected-hover-handle-color, #212121)}.mdc-switch.mdc-switch--unselected:enabled:focus:not(:active) .mdc-switch__handle::after{background:#212121;background:var(--mdc-switch-unselected-focus-handle-color, #212121)}.mdc-switch.mdc-switch--unselected:enabled:active .mdc-switch__handle::after{background:#212121;background:var(--mdc-switch-unselected-pressed-handle-color, #212121)}.mdc-switch.mdc-switch--unselected:disabled .mdc-switch__handle::after{background:#424242;background:var(--mdc-switch-disabled-unselected-handle-color, #424242)}.mdc-switch .mdc-switch__handle::before{background:#fff;background:var(--mdc-switch-handle-surface-color, var(--mdc-theme-surface, #fff))}.mdc-switch:enabled .mdc-switch__shadow{box-shadow:0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12);box-shadow:var(--mdc-switch-handle-elevation, var(--mdc-elevation-box-shadow-for-gss));--mdc-elevation-box-shadow-for-gss:0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)}.mdc-switch:disabled .mdc-switch__shadow{box-shadow:0px 0px 0px 0px rgba(0, 0, 0, 0.2), 0px 0px 0px 0px rgba(0, 0, 0, 0.14), 0px 0px 0px 0px rgba(0, 0, 0, 0.12);box-shadow:var(--mdc-switch-disabled-handle-elevation, var(--mdc-elevation-box-shadow-for-gss));--mdc-elevation-box-shadow-for-gss:0px 0px 0px 0px rgba(0, 0, 0, 0.2), 0px 0px 0px 0px rgba(0, 0, 0, 0.14), 0px 0px 0px 0px rgba(0, 0, 0, 0.12)}.mdc-switch .mdc-switch__handle{height:20px;height:var(--mdc-switch-handle-height, 20px)}.mdc-switch:disabled .mdc-switch__handle::after{opacity:0.38;opacity:var(--mdc-switch-disabled-handle-opacity, 0.38)}.mdc-switch .mdc-switch__handle{border-radius:10px;border-radius:var(--mdc-switch-handle-shape, 10px)}.mdc-switch .mdc-switch__handle{width:20px;width:var(--mdc-switch-handle-width, 20px)}.mdc-switch .mdc-switch__handle-track{width:calc(100% - 20px);width:calc(100% - var(--mdc-switch-handle-width, 20px))}.mdc-switch.mdc-switch--selected:enabled .mdc-switch__icon{fill:#fff;fill:var(--mdc-switch-selected-icon-color, var(--mdc-theme-on-primary, #fff))}.mdc-switch.mdc-switch--selected:disabled .mdc-switch__icon{fill:#fff;fill:var(--mdc-switch-disabled-selected-icon-color, var(--mdc-theme-on-primary, #fff))}.mdc-switch.mdc-switch--unselected:enabled .mdc-switch__icon{fill:#fff;fill:var(--mdc-switch-unselected-icon-color, var(--mdc-theme-on-primary, #fff))}.mdc-switch.mdc-switch--unselected:disabled .mdc-switch__icon{fill:#fff;fill:var(--mdc-switch-disabled-unselected-icon-color, var(--mdc-theme-on-primary, #fff))}.mdc-switch.mdc-switch--selected:disabled .mdc-switch__icons{opacity:0.38;opacity:var(--mdc-switch-disabled-selected-icon-opacity, 0.38)}.mdc-switch.mdc-switch--unselected:disabled .mdc-switch__icons{opacity:0.38;opacity:var(--mdc-switch-disabled-unselected-icon-opacity, 0.38)}.mdc-switch.mdc-switch--selected .mdc-switch__icon{width:18px;width:var(--mdc-switch-selected-icon-size, 18px);height:18px;height:var(--mdc-switch-selected-icon-size, 18px)}.mdc-switch.mdc-switch--unselected .mdc-switch__icon{width:18px;width:var(--mdc-switch-unselected-icon-size, 18px);height:18px;height:var(--mdc-switch-unselected-icon-size, 18px)}.mdc-switch.mdc-switch--selected:enabled:hover:not(:focus) .mdc-switch__ripple::before,.mdc-switch.mdc-switch--selected:enabled:hover:not(:focus) .mdc-switch__ripple::after{background-color:#26a69a;background-color:var(--mdc-switch-selected-hover-state-layer-color, var(--mdc-theme-primary, #26a69a))}.mdc-switch.mdc-switch--selected:enabled:focus .mdc-switch__ripple::before,.mdc-switch.mdc-switch--selected:enabled:focus .mdc-switch__ripple::after{background-color:#26a69a;background-color:var(--mdc-switch-selected-focus-state-layer-color, var(--mdc-theme-primary, #26a69a))}.mdc-switch.mdc-switch--selected:enabled:active .mdc-switch__ripple::before,.mdc-switch.mdc-switch--selected:enabled:active .mdc-switch__ripple::after{background-color:#26a69a;background-color:var(--mdc-switch-selected-pressed-state-layer-color, var(--mdc-theme-primary, #26a69a))}.mdc-switch.mdc-switch--unselected:enabled:hover:not(:focus) .mdc-switch__ripple::before,.mdc-switch.mdc-switch--unselected:enabled:hover:not(:focus) .mdc-switch__ripple::after{background-color:#424242;background-color:var(--mdc-switch-unselected-hover-state-layer-color, #424242)}.mdc-switch.mdc-switch--unselected:enabled:focus .mdc-switch__ripple::before,.mdc-switch.mdc-switch--unselected:enabled:focus .mdc-switch__ripple::after{background-color:#424242;background-color:var(--mdc-switch-unselected-focus-state-layer-color, #424242)}.mdc-switch.mdc-switch--unselected:enabled:active .mdc-switch__ripple::before,.mdc-switch.mdc-switch--unselected:enabled:active .mdc-switch__ripple::after{background-color:#424242;background-color:var(--mdc-switch-unselected-pressed-state-layer-color, #424242)}.mdc-switch.mdc-switch--selected:enabled:hover:not(:focus):hover .mdc-switch__ripple::before,.mdc-switch.mdc-switch--selected:enabled:hover:not(:focus).mdc-ripple-surface--hover .mdc-switch__ripple::before{opacity:0.04;opacity:var(--mdc-switch-selected-hover-state-layer-opacity, 0.04)}.mdc-switch.mdc-switch--selected:enabled:focus.mdc-ripple-upgraded--background-focused .mdc-switch__ripple::before,.mdc-switch.mdc-switch--selected:enabled:focus:not(.mdc-ripple-upgraded):focus .mdc-switch__ripple::before{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-switch-selected-focus-state-layer-opacity, 0.12)}.mdc-switch.mdc-switch--selected:enabled:active:not(.mdc-ripple-upgraded) .mdc-switch__ripple::after{transition:opacity 150ms linear}.mdc-switch.mdc-switch--selected:enabled:active:not(.mdc-ripple-upgraded):active .mdc-switch__ripple::after{transition-duration:75ms;opacity:0.1;opacity:var(--mdc-switch-selected-pressed-state-layer-opacity, 0.1)}.mdc-switch.mdc-switch--selected:enabled:active.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-switch-selected-pressed-state-layer-opacity, 0.1)}.mdc-switch.mdc-switch--unselected:enabled:hover:not(:focus):hover .mdc-switch__ripple::before,.mdc-switch.mdc-switch--unselected:enabled:hover:not(:focus).mdc-ripple-surface--hover .mdc-switch__ripple::before{opacity:0.04;opacity:var(--mdc-switch-unselected-hover-state-layer-opacity, 0.04)}.mdc-switch.mdc-switch--unselected:enabled:focus.mdc-ripple-upgraded--background-focused .mdc-switch__ripple::before,.mdc-switch.mdc-switch--unselected:enabled:focus:not(.mdc-ripple-upgraded):focus .mdc-switch__ripple::before{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-switch-unselected-focus-state-layer-opacity, 0.12)}.mdc-switch.mdc-switch--unselected:enabled:active:not(.mdc-ripple-upgraded) .mdc-switch__ripple::after{transition:opacity 150ms linear}.mdc-switch.mdc-switch--unselected:enabled:active:not(.mdc-ripple-upgraded):active .mdc-switch__ripple::after{transition-duration:75ms;opacity:0.1;opacity:var(--mdc-switch-unselected-pressed-state-layer-opacity, 0.1)}.mdc-switch.mdc-switch--unselected:enabled:active.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-switch-unselected-pressed-state-layer-opacity, 0.1)}.mdc-switch .mdc-switch__ripple{height:48px;height:var(--mdc-switch-state-layer-size, 48px);width:48px;width:var(--mdc-switch-state-layer-size, 48px)}.mdc-switch .mdc-switch__track{height:14px;height:var(--mdc-switch-track-height, 14px)}.mdc-switch:disabled .mdc-switch__track{opacity:0.12;opacity:var(--mdc-switch-disabled-track-opacity, 0.12)}.mdc-switch:enabled .mdc-switch__track::after{background:#c1f1ec;background:var(--mdc-switch-selected-track-color, #c1f1ec)}.mdc-switch:enabled:hover:not(:focus):not(:active) .mdc-switch__track::after{background:#c1f1ec;background:var(--mdc-switch-selected-hover-track-color, #c1f1ec)}.mdc-switch:enabled:focus:not(:active) .mdc-switch__track::after{background:#c1f1ec;background:var(--mdc-switch-selected-focus-track-color, #c1f1ec)}.mdc-switch:enabled:active .mdc-switch__track::after{background:#c1f1ec;background:var(--mdc-switch-selected-pressed-track-color, #c1f1ec)}.mdc-switch:disabled .mdc-switch__track::after{background:#424242;background:var(--mdc-switch-disabled-selected-track-color, #424242)}.mdc-switch:enabled .mdc-switch__track::before{background:#e0e0e0;background:var(--mdc-switch-unselected-track-color, #e0e0e0)}.mdc-switch:enabled:hover:not(:focus):not(:active) .mdc-switch__track::before{background:#e0e0e0;background:var(--mdc-switch-unselected-hover-track-color, #e0e0e0)}.mdc-switch:enabled:focus:not(:active) .mdc-switch__track::before{background:#e0e0e0;background:var(--mdc-switch-unselected-focus-track-color, #e0e0e0)}.mdc-switch:enabled:active .mdc-switch__track::before{background:#e0e0e0;background:var(--mdc-switch-unselected-pressed-track-color, #e0e0e0)}.mdc-switch:disabled .mdc-switch__track::before{background:#424242;background:var(--mdc-switch-disabled-unselected-track-color, #424242)}.mdc-switch .mdc-switch__track{border-radius:7px;border-radius:var(--mdc-switch-track-shape, 7px)}@media screen and (forced-colors: active), (-ms-high-contrast: active){.mdc-switch:enabled .mdc-switch__shadow{}.mdc-switch:disabled .mdc-switch__shadow{}.mdc-switch:disabled .mdc-switch__handle::after{opacity:1;opacity:var(--mdc-switch-disabled-handle-opacity, 1)}.mdc-switch.mdc-switch--selected:enabled .mdc-switch__icon{fill:ButtonText;fill:var(--mdc-switch-selected-icon-color, ButtonText)}.mdc-switch.mdc-switch--selected:disabled .mdc-switch__icon{fill:GrayText;fill:var(--mdc-switch-disabled-selected-icon-color, GrayText)}.mdc-switch.mdc-switch--unselected:enabled .mdc-switch__icon{fill:ButtonText;fill:var(--mdc-switch-unselected-icon-color, ButtonText)}.mdc-switch.mdc-switch--unselected:disabled .mdc-switch__icon{fill:GrayText;fill:var(--mdc-switch-disabled-unselected-icon-color, GrayText)}.mdc-switch.mdc-switch--selected:disabled .mdc-switch__icons{opacity:1;opacity:var(--mdc-switch-disabled-selected-icon-opacity, 1)}.mdc-switch.mdc-switch--unselected:disabled .mdc-switch__icons{opacity:1;opacity:var(--mdc-switch-disabled-unselected-icon-opacity, 1)}.mdc-switch:disabled .mdc-switch__track{opacity:1;opacity:var(--mdc-switch-disabled-track-opacity, 1)}}:host(limel-switch){isolation:isolate;display:flex;align-items:center;flex-wrap:wrap;--mdc-switch-selected-icon-color:transparent;--mdc-switch-unselected-icon-color:transparent;--mdc-switch-disabled-selected-icon-opacity:1;--mdc-switch-disabled-unselected-icon-opacity:1;--mdc-switch-selected-icon-size:0.75rem;--mdc-switch-unselected-icon-size:0.75rem;--mdc-switch-track-height:1.25rem;--mdc-switch-track-shape:var(--mdc-switch-track-height);--mdc-switch-unselected-focus-handle-color:var(\n      --lime-elevated-surface-background-color\n  );--mdc-switch-selected-focus-handle-color:var(\n      --lime-elevated-surface-background-color\n  );--mdc-switch-unselected-pressed-handle-color:var(\n      --lime-elevated-surface-background-color\n  );--mdc-switch-selected-pressed-handle-color:var(\n      --lime-elevated-surface-background-color\n  );--mdc-switch-unselected-handle-color:var(\n      --lime-elevated-surface-background-color\n  );--mdc-switch-unselected-hover-handle-color:var(\n      --lime-elevated-surface-background-color\n  );--mdc-switch-selected-handle-color:var(\n      --lime-elevated-surface-background-color\n  );--mdc-switch-selected-hover-handle-color:var(\n      --lime-elevated-surface-background-color\n  );--mdc-switch-unselected-track-color:rgb(var(--contrast-700));--mdc-switch-unselected-focus-track-color:rgb(var(--contrast-800));--mdc-switch-unselected-pressed-track-color:rgb(var(--contrast-800));--mdc-switch-unselected-hover-track-color:rgb(var(--contrast-800));--mdc-switch-selected-focus-track-color:var(--mdc-theme-primary);--mdc-switch-selected-pressed-track-color:var(--mdc-theme-primary);--mdc-switch-selected-track-color:var(--mdc-theme-primary);--mdc-switch-selected-hover-track-color:var(--mdc-theme-primary);--mdc-switch-handle-elevation:var(--button-shadow-normal);--mdc-switch-disabled-track-opacity:0.4;--mdc-switch-disabled-selected-handle-color:rgb(var(--contrast-1000));--mdc-switch-disabled-unselected-handle-color:rgb(var(--contrast-1000))}.mdc-switch{margin-right:0.5rem}.mdc-switch:hover{--mdc-switch-handle-elevation:var(--button-shadow-hovered)}label{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto, sans-serif;font-family:var(--mdc-typography-body2-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:0.8125rem;font-size:var(--mdc-typography-body2-font-size, 0.8125rem);line-height:1.625rem;line-height:var(--mdc-typography-body2-line-height, 1.625rem);font-weight:400;font-weight:var(--mdc-typography-body2-font-weight, 400);letter-spacing:0.0178571429em;letter-spacing:var(--mdc-typography-body2-letter-spacing, 0.0178571429em);text-decoration:inherit;text-decoration:var(--mdc-typography-body2-text-decoration, inherit);text-transform:inherit;text-transform:var(--mdc-typography-body2-text-transform, inherit);color:var(--mdc-theme-on-surface);cursor:pointer}label.disabled{cursor:not-allowed;pointer-events:none;opacity:0.4}.mdc-switch.mdc-switch--selected .mdc-switch__handle:after,.mdc-switch.mdc-switch--selected .mdc-switch__handle:before,.mdc-switch.mdc-switch.mdc-switch--unselected .mdc-switch__handle:after,.mdc-switch.mdc-switch.mdc-switch--unselected .mdc-switch__handle:before{transform:scale(0.8)}.mdc-switch .mdc-switch__shadow{transform:scale(0.8)}.mdc-switch.lime-switch--readonly{--mdc-switch-disabled-selected-track-color:rgb(var(--contrast-1000));--mdc-switch-disabled-unselected-track-color:rgb(var(--contrast-900));--mdc-switch-handle-surface-color:transparent;--mdc-switch-disabled-selected-handle-color:transparent;--mdc-switch-disabled-unselected-handle-color:transparent;--mdc-switch-disabled-track-opacity:1;--mdc-switch-track-width:1.25rem}.mdc-switch.lime-switch--readonly+label.disabled{cursor:default;opacity:1}:host(limel-switch:focus),:host(limel-switch:focus-visible),:host(limel-switch:focus-within),:host(limel-switch[invalid]:not([invalid=false])),:host(limel-switch[invalid=true]){--limel-h-l-grid-template-rows-transition-speed:0.46s;--limel-h-l-grid-template-rows:1fr}:host(limel-switch){--limel-h-l-grid-template-rows-transition-speed:0.3s;--limel-h-l-grid-template-rows:0fr}:host(limel-switch:focus) limel-helper-line,:host(limel-switch:focus-visible) limel-helper-line,:host(limel-switch:focus-within) limel-helper-line,:host(limel-switch:hover) limel-helper-line{will-change:grid-template-rows}';const C=class{constructor(i){c(this,i);this.change=e(this,"change",7);this.helperTextId=s();this.renderHelperLine=()=>{if(!this.hasHelperText()){return}return t("limel-helper-line",{helperTextId:this.helperTextId,helperText:this.helperText})};this.hasHelperText=()=>this.helperText!==null&&this.helperText!==undefined;this.handleClick=c=>{c.stopPropagation();this.change.emit(!this.value)};this.label=undefined;this.disabled=false;this.readonly=false;this.invalid=undefined;this.value=false;this.helperText=undefined;this.fieldId=s()}connectedCallback(){this.initialize()}componentWillLoad(){d(this.host)}componentDidLoad(){this.initialize()}initialize(){const c=this.host.shadowRoot.querySelector(".mdc-switch");if(!c){return}this.mdcSwitch=new X(c)}disconnectedCallback(){var c;a(this.host);(c=this.mdcSwitch)===null||c===void 0?void 0:c.destroy()}render(){return t(i,null,t("button",{id:this.fieldId,class:{"mdc-switch":true,"lime-switch--readonly":this.readonly,"mdc-switch--unselected":!this.value,"mdc-switch--selected":this.value},type:"button",role:"switch","aria-checked":this.value,disabled:this.disabled||this.readonly,onClick:this.handleClick,"aria-controls":this.helperTextId},t("div",{class:"mdc-switch__track"}),t("div",{class:"mdc-switch__handle-track"},t("div",{class:"mdc-switch__handle"},t("div",{class:"mdc-switch__shadow"},t("div",{class:"mdc-elevation-overlay"})),t("div",{class:"mdc-switch__ripple"}),t("div",{class:"mdc-switch__icons"},t("svg",{class:"mdc-switch__icon mdc-switch__icon--on",viewBox:"0 0 24 24"},t("path",{d:"M19.69,5.23L8.96,15.96l-4.23-4.23L2.96,13.5l6,6L21.46,7L19.69,5.23z"})),t("svg",{class:"mdc-switch__icon mdc-switch__icon--off",viewBox:"0 0 24 24"},t("path",{d:"M20 13H4v-2h16v2z"})))))),t("label",{class:`${this.disabled||this.readonly?"disabled":""}`,htmlFor:this.fieldId},this.label),this.renderHelperLine())}valueWatcher(c){if(!this.mdcSwitch){return}this.mdcSwitch.selected=c}get host(){return r(this)}static get watchers(){return{value:["valueWatcher"]}}};C.style=B;export{C as limel_switch};
//# sourceMappingURL=limel-switch.entry.js.map