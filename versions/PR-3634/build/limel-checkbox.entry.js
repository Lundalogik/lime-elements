import{r as e,c as t,h as i,g as n}from"./index-2714248e.js";import{c as r}from"./random-string-355331d3.js";import{C as c}from"./checkbox.template-4aff7259.js";import{_ as o,a,M as s,m as h,d as l,c as u}from"./ponyfill-d79e8edd.js";import{a as d}from"./util-f1bde91c.js";import{b as f,a as m,M as b}from"./component-e62285bf.js";
/**
 * @license
 * Copyright 2016 Google Inc.
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
 */var v={ANIM_CHECKED_INDETERMINATE:"mdc-checkbox--anim-checked-indeterminate",ANIM_CHECKED_UNCHECKED:"mdc-checkbox--anim-checked-unchecked",ANIM_INDETERMINATE_CHECKED:"mdc-checkbox--anim-indeterminate-checked",ANIM_INDETERMINATE_UNCHECKED:"mdc-checkbox--anim-indeterminate-unchecked",ANIM_UNCHECKED_CHECKED:"mdc-checkbox--anim-unchecked-checked",ANIM_UNCHECKED_INDETERMINATE:"mdc-checkbox--anim-unchecked-indeterminate",BACKGROUND:"mdc-checkbox__background",CHECKED:"mdc-checkbox--checked",CHECKMARK:"mdc-checkbox__checkmark",CHECKMARK_PATH:"mdc-checkbox__checkmark-path",DISABLED:"mdc-checkbox--disabled",INDETERMINATE:"mdc-checkbox--indeterminate",MIXEDMARK:"mdc-checkbox__mixedmark",NATIVE_CONTROL:"mdc-checkbox__native-control",ROOT:"mdc-checkbox",SELECTED:"mdc-checkbox--selected",UPGRADED:"mdc-checkbox--upgraded"};var k={ARIA_CHECKED_ATTR:"aria-checked",ARIA_CHECKED_INDETERMINATE_VALUE:"mixed",DATA_INDETERMINATE_ATTR:"data-indeterminate",NATIVE_CONTROL_SELECTOR:".mdc-checkbox__native-control",TRANSITION_STATE_CHECKED:"checked",TRANSITION_STATE_INDETERMINATE:"indeterminate",TRANSITION_STATE_INIT:"init",TRANSITION_STATE_UNCHECKED:"unchecked"};var g={ANIM_END_LATCH_MS:250};
/**
 * @license
 * Copyright 2016 Google Inc.
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
 */var p=function(e){o(t,e);function t(i){var n=e.call(this,a(a({},t.defaultAdapter),i))||this;n.currentCheckState=k.TRANSITION_STATE_INIT;n.currentAnimationClass="";n.animEndLatchTimer=0;n.enableAnimationEndHandler=false;return n}Object.defineProperty(t,"cssClasses",{get:function(){return v},enumerable:false,configurable:true});Object.defineProperty(t,"strings",{get:function(){return k},enumerable:false,configurable:true});Object.defineProperty(t,"numbers",{get:function(){return g},enumerable:false,configurable:true});Object.defineProperty(t,"defaultAdapter",{get:function(){return{addClass:function(){return undefined},forceLayout:function(){return undefined},hasNativeControl:function(){return false},isAttachedToDOM:function(){return false},isChecked:function(){return false},isIndeterminate:function(){return false},removeClass:function(){return undefined},removeNativeControlAttr:function(){return undefined},setNativeControlAttr:function(){return undefined},setNativeControlDisabled:function(){return undefined}}},enumerable:false,configurable:true});t.prototype.init=function(){this.currentCheckState=this.determineCheckState();this.updateAriaChecked();this.adapter.addClass(v.UPGRADED)};t.prototype.destroy=function(){clearTimeout(this.animEndLatchTimer)};t.prototype.setDisabled=function(e){this.adapter.setNativeControlDisabled(e);if(e){this.adapter.addClass(v.DISABLED)}else{this.adapter.removeClass(v.DISABLED)}};t.prototype.handleAnimationEnd=function(){var e=this;if(!this.enableAnimationEndHandler){return}clearTimeout(this.animEndLatchTimer);this.animEndLatchTimer=setTimeout((function(){e.adapter.removeClass(e.currentAnimationClass);e.enableAnimationEndHandler=false}),g.ANIM_END_LATCH_MS)};t.prototype.handleChange=function(){this.transitionCheckState()};t.prototype.transitionCheckState=function(){if(!this.adapter.hasNativeControl()){return}var e=this.currentCheckState;var t=this.determineCheckState();if(e===t){return}this.updateAriaChecked();var i=k.TRANSITION_STATE_UNCHECKED;var n=v.SELECTED;if(t===i){this.adapter.removeClass(n)}else{this.adapter.addClass(n)}if(this.currentAnimationClass.length>0){clearTimeout(this.animEndLatchTimer);this.adapter.forceLayout();this.adapter.removeClass(this.currentAnimationClass)}this.currentAnimationClass=this.getTransitionAnimationClass(e,t);this.currentCheckState=t;if(this.adapter.isAttachedToDOM()&&this.currentAnimationClass.length>0){this.adapter.addClass(this.currentAnimationClass);this.enableAnimationEndHandler=true}};t.prototype.determineCheckState=function(){var e=k.TRANSITION_STATE_INDETERMINATE,t=k.TRANSITION_STATE_CHECKED,i=k.TRANSITION_STATE_UNCHECKED;if(this.adapter.isIndeterminate()){return e}return this.adapter.isChecked()?t:i};t.prototype.getTransitionAnimationClass=function(e,i){var n=k.TRANSITION_STATE_INIT,r=k.TRANSITION_STATE_CHECKED,c=k.TRANSITION_STATE_UNCHECKED;var o=t.cssClasses,a=o.ANIM_UNCHECKED_CHECKED,s=o.ANIM_UNCHECKED_INDETERMINATE,h=o.ANIM_CHECKED_UNCHECKED,l=o.ANIM_CHECKED_INDETERMINATE,u=o.ANIM_INDETERMINATE_CHECKED,d=o.ANIM_INDETERMINATE_UNCHECKED;switch(e){case n:if(i===c){return""}return i===r?u:d;case c:return i===r?a:s;case r:return i===c?h:l;default:return i===r?u:d}};t.prototype.updateAriaChecked=function(){if(this.adapter.isIndeterminate()){this.adapter.setNativeControlAttr(k.ARIA_CHECKED_ATTR,k.ARIA_CHECKED_INDETERMINATE_VALUE)}else{this.adapter.removeNativeControlAttr(k.ARIA_CHECKED_ATTR)}};return t}(s);
/**
 * @license
 * Copyright 2016 Google Inc.
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
 */var E=["checked","indeterminate"];var C=function(e){o(t,e);function t(){var t=e!==null&&e.apply(this,arguments)||this;t.rippleSurface=t.createRipple();return t}t.attachTo=function(e){return new t(e)};Object.defineProperty(t.prototype,"ripple",{get:function(){return this.rippleSurface},enumerable:false,configurable:true});Object.defineProperty(t.prototype,"checked",{get:function(){return this.getNativeControl().checked},set:function(e){this.getNativeControl().checked=e},enumerable:false,configurable:true});Object.defineProperty(t.prototype,"indeterminate",{get:function(){return this.getNativeControl().indeterminate},set:function(e){this.getNativeControl().indeterminate=e},enumerable:false,configurable:true});Object.defineProperty(t.prototype,"disabled",{get:function(){return this.getNativeControl().disabled},set:function(e){this.foundation.setDisabled(e)},enumerable:false,configurable:true});Object.defineProperty(t.prototype,"value",{get:function(){return this.getNativeControl().value},set:function(e){this.getNativeControl().value=e},enumerable:false,configurable:true});t.prototype.initialize=function(){var e=k.DATA_INDETERMINATE_ATTR;this.getNativeControl().indeterminate=this.getNativeControl().getAttribute(e)==="true";this.getNativeControl().removeAttribute(e)};t.prototype.initialSyncWithDOM=function(){var e=this;this.handleChange=function(){e.foundation.handleChange()};this.handleAnimationEnd=function(){e.foundation.handleAnimationEnd()};this.getNativeControl().addEventListener("change",this.handleChange);this.listen(d(window,"animationend"),this.handleAnimationEnd);this.installPropertyChangeHooks()};t.prototype.destroy=function(){this.rippleSurface.destroy();this.getNativeControl().removeEventListener("change",this.handleChange);this.unlisten(d(window,"animationend"),this.handleAnimationEnd);this.uninstallPropertyChangeHooks();e.prototype.destroy.call(this)};t.prototype.getDefaultFoundation=function(){var e=this;var t={addClass:function(t){return e.root.classList.add(t)},forceLayout:function(){return e.root.offsetWidth},hasNativeControl:function(){return!!e.getNativeControl()},isAttachedToDOM:function(){return Boolean(e.root.parentNode)},isChecked:function(){return e.checked},isIndeterminate:function(){return e.indeterminate},removeClass:function(t){e.root.classList.remove(t)},removeNativeControlAttr:function(t){e.getNativeControl().removeAttribute(t)},setNativeControlAttr:function(t,i){e.getNativeControl().setAttribute(t,i)},setNativeControlDisabled:function(t){e.getNativeControl().disabled=t}};return new p(t)};t.prototype.createRipple=function(){var e=this;var t=a(a({},f.createAdapter(this)),{deregisterInteractionHandler:function(t,i){e.getNativeControl().removeEventListener(t,i,m())},isSurfaceActive:function(){return h(e.getNativeControl(),":active")},isUnbounded:function(){return true},registerInteractionHandler:function(t,i){e.getNativeControl().addEventListener(t,i,m())}});return new f(this.root,new b(t))};t.prototype.installPropertyChangeHooks=function(){var e,t;var i=this;var n=this.getNativeControl();var r=Object.getPrototypeOf(n);var c=function(e){var t=Object.getOwnPropertyDescriptor(r,e);if(!T(t)){return{value:void 0}}var c=t.get;var o={configurable:t.configurable,enumerable:t.enumerable,get:c,set:function(e){t.set.call(n,e);i.foundation.handleChange()}};Object.defineProperty(n,e,o)};try{for(var o=l(E),a=o.next();!a.done;a=o.next()){var s=a.value;var h=c(s);if(typeof h==="object")return h.value}}catch(t){e={error:t}}finally{try{if(a&&!a.done&&(t=o.return))t.call(o)}finally{if(e)throw e.error}}};t.prototype.uninstallPropertyChangeHooks=function(){var e,t;var i=this.getNativeControl();var n=Object.getPrototypeOf(i);try{for(var r=l(E),c=r.next();!c.done;c=r.next()){var o=c.value;var a=Object.getOwnPropertyDescriptor(n,o);if(!T(a)){return}Object.defineProperty(i,o,a)}}catch(t){e={error:t}}finally{try{if(c&&!c.done&&(t=r.return))t.call(r)}finally{if(e)throw e.error}}};t.prototype.getNativeControl=function(){var e=k.NATIVE_CONTROL_SELECTOR;var t=this.root.querySelector(e);if(!t){throw new Error("Checkbox component requires a "+e+" element")}return t};return t}(u);function T(e){return!!e&&typeof e.set==="function"}
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
 */var x={ROOT:"mdc-form-field"};var I={LABEL_SELECTOR:".mdc-form-field > label"};
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
 */var A=function(e){o(t,e);function t(i){var n=e.call(this,a(a({},t.defaultAdapter),i))||this;n.click=function(){n.handleClick()};return n}Object.defineProperty(t,"cssClasses",{get:function(){return x},enumerable:false,configurable:true});Object.defineProperty(t,"strings",{get:function(){return I},enumerable:false,configurable:true});Object.defineProperty(t,"defaultAdapter",{get:function(){return{activateInputRipple:function(){return undefined},deactivateInputRipple:function(){return undefined},deregisterInteractionHandler:function(){return undefined},registerInteractionHandler:function(){return undefined}}},enumerable:false,configurable:true});t.prototype.init=function(){this.adapter.registerInteractionHandler("click",this.click)};t.prototype.destroy=function(){this.adapter.deregisterInteractionHandler("click",this.click)};t.prototype.handleClick=function(){var e=this;this.adapter.activateInputRipple();requestAnimationFrame((function(){e.adapter.deactivateInputRipple()}))};return t}(s);
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
 */var N=function(e){o(t,e);function t(){return e!==null&&e.apply(this,arguments)||this}t.attachTo=function(e){return new t(e)};t.prototype.labelEl=function(){var e=A.strings.LABEL_SELECTOR;return this.root.querySelector(e)};t.prototype.getDefaultFoundation=function(){var e=this;var t={activateInputRipple:function(){if(e.input&&e.input.ripple){e.input.ripple.activate()}},deactivateInputRipple:function(){if(e.input&&e.input.ripple){e.input.ripple.deactivate()}},deregisterInteractionHandler:function(t,i){var n=e.labelEl();if(n){n.removeEventListener(t,i)}},registerInteractionHandler:function(t,i){var n=e.labelEl();if(n){n.addEventListener(t,i)}}};return new A(t)};return t}(u);const _='@charset "UTF-8";*,*:before,*:after{box-sizing:border-box}.mdc-form-field{--limel-checkbox-checked-color:var(\n      --lime-primary-color,\n      var(--limel-theme-primary-color)\n  );--checkbox-unchecked-color:var(\n      --checkbox-unchecked-border-color,\n      rgb(var(--contrast-900))\n  );--lime-checkbox-unchecked-color:rgb(var(--contrast-300));position:relative;isolation:isolate;min-height:2.5rem;width:100%}input[type=checkbox]{position:absolute;width:0;height:0;margin:-1px;padding:0;border:0;overflow:hidden;clip:rect(0, 0, 0, 0);clip-path:inset(50%);white-space:nowrap;-webkit-appearance:none;-moz-appearance:none;appearance:none}label{cursor:pointer;position:relative;width:100%;font-size:0.8125rem;color:var(--limel-theme-text-primary-on-background-color);padding-left:1.75rem}.disabled label{cursor:not-allowed;color:var(--limel-theme-text-disabled-color)}.required label:after{margin-left:0.0625rem;content:"*"}.invalid label{color:var(--limel-theme-error-text-color)}.box{position:absolute;pointer-events:none;transition:border-color 0.2s ease, background-color 0.2s ease;transform:translate3d(0, -0.125rem, 0);display:inline-block;vertical-align:middle;width:1.25rem;height:1.25rem;margin-right:0.5rem;border-radius:0.25rem;border:0.125rem solid;border-color:var(--checkbox-unchecked-border-color, rgb(var(--contrast-900)));background-color:var(--limel-checkbox-background-color, var(--lime-checkbox-unchecked-color))}.checked .box{background-color:var(--limel-checkbox-checked-color);border-color:var(--limel-checkbox-checked-color)}.disabled .box{opacity:0.4}svg{position:absolute;z-index:1;pointer-events:none;inset:0;transform:translate3d(-0.125rem, -0.125rem, 0);width:1.25rem;height:1.25rem;padding:0.25rem;color:rgb(var(--color-white));opacity:0;stroke-width:0.1875rem;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round}svg path{stroke-dashoffset:29.7833;stroke-dasharray:29.7833;transition:stroke-dashoffset 180ms cubic-bezier(0.4, 0, 0.6, 1)}.checked:not([indeterminate]):not([indeterminate=true]) svg{opacity:1}.checked:not([indeterminate]):not([indeterminate=true]) svg path{stroke-dashoffset:0}limel-dynamic-label{margin-top:0.375rem;margin-left:0.375rem;gap:0.375rem}:host(limel-checkbox:focus),:host(limel-checkbox:focus-visible),:host(limel-checkbox:focus-within){--limel-h-l-grid-template-rows-transition-speed:0.46s;--limel-h-l-grid-template-rows:1fr}:host(limel-checkbox){--limel-h-l-grid-template-rows-transition-speed:0.3s;--limel-h-l-grid-template-rows:0fr}:host(limel-checkbox:focus) limel-helper-line,:host(limel-checkbox:focus-visible) limel-helper-line,:host(limel-checkbox:focus-within) limel-helper-line,:host(limel-checkbox:hover) limel-helper-line{will-change:grid-template-rows}';const w=class{constructor(i){e(this,i);this.change=t(this,"change",7);this.shouldReinitialize=false;this.id=r();this.helperTextId=r();this.destroyMDCInstances=()=>{var e,t;(e=this.mdcCheckbox)===null||e===void 0?void 0:e.destroy();(t=this.formField)===null||t===void 0?void 0:t.destroy();const i=this.getCheckboxElement();if(i){i.classList.remove(v.ANIM_CHECKED_INDETERMINATE,v.ANIM_CHECKED_UNCHECKED,v.ANIM_INDETERMINATE_CHECKED,v.ANIM_INDETERMINATE_UNCHECKED,v.ANIM_UNCHECKED_CHECKED,v.ANIM_UNCHECKED_INDETERMINATE)}};this.isInvalid=()=>{if(this.invalid){return true}if(this.required&&this.modified&&!this.checked){return true}};this.initialize=()=>{const e=this.limelCheckbox.shadowRoot.querySelector(".mdc-form-field");if(!e){return}this.formField=new N(e);this.mdcCheckbox=new C(this.getCheckboxElement());this.formField.input=this.mdcCheckbox};this.getCheckboxElement=()=>this.limelCheckbox.shadowRoot.querySelector(".mdc-checkbox");this.onChange=e=>{e.stopPropagation();this.change.emit(this.mdcCheckbox.checked);this.modified=true};this.disabled=false;this.readonly=false;this.invalid=undefined;this.label=undefined;this.helperText=undefined;this.checked=false;this.indeterminate=false;this.required=false;this.readonlyLabels=[];this.modified=false}handleCheckedChange(e){if(!this.mdcCheckbox){return}this.mdcCheckbox.checked=e}handleIndeterminateChange(e){this.mdcCheckbox.checked=this.checked;this.mdcCheckbox.indeterminate=e}handleReadonlyChange(){this.destroyMDCInstances();this.shouldReinitialize=true}componentDidRender(){if(this.shouldReinitialize){this.initialize();this.shouldReinitialize=false}}connectedCallback(){this.initialize()}componentDidLoad(){this.initialize()}disconnectedCallback(){this.destroyMDCInstances()}render(){return i(c,{disabled:this.disabled||this.readonly,label:this.label,readonlyLabels:this.readonlyLabels,helperText:this.helperText,helperTextId:this.helperTextId,checked:this.checked||this.indeterminate,indeterminate:this.indeterminate,required:this.required,readonly:this.readonly,invalid:this.isInvalid(),onChange:this.onChange,id:this.id})}get limelCheckbox(){return n(this)}static get watchers(){return{checked:["handleCheckedChange"],indeterminate:["handleIndeterminateChange"],readonly:["handleReadonlyChange"]}}};w.style=_;export{w as limel_checkbox};
//# sourceMappingURL=limel-checkbox.entry.js.map