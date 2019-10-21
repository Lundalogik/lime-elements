import{_ as n,a as t}from"./tslib.es6-1f0f644b.js";import{M as e,a as i}from"./component-d4db6478.js";
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
 */var r={LABEL_FLOAT_ABOVE:"mdc-floating-label--float-above",LABEL_SHAKE:"mdc-floating-label--shake",ROOT:"mdc-floating-label"},u=function(e){function i(n){var r=e.call(this,t({},i.defaultAdapter,n))||this;return r.shakeAnimationEndHandler_=function(){return r.handleShakeAnimationEnd_()},r}return n(i,e),Object.defineProperty(i,"cssClasses",{get:function(){return r},enumerable:!0,configurable:!0}),Object.defineProperty(i,"defaultAdapter",{get:function(){return{addClass:function(){},removeClass:function(){},getWidth:function(){return 0},registerInteractionHandler:function(){},deregisterInteractionHandler:function(){}}},enumerable:!0,configurable:!0}),i.prototype.init=function(){this.adapter_.registerInteractionHandler("animationend",this.shakeAnimationEndHandler_)},i.prototype.destroy=function(){this.adapter_.deregisterInteractionHandler("animationend",this.shakeAnimationEndHandler_)},i.prototype.getWidth=function(){return this.adapter_.getWidth()},i.prototype.shake=function(n){var t=i.cssClasses.LABEL_SHAKE;n?this.adapter_.addClass(t):this.adapter_.removeClass(t)},i.prototype.float=function(n){var t=i.cssClasses,e=t.LABEL_FLOAT_ABOVE,r=t.LABEL_SHAKE;n?this.adapter_.addClass(e):(this.adapter_.removeClass(e),this.adapter_.removeClass(r))},i.prototype.handleShakeAnimationEnd_=function(){this.adapter_.removeClass(i.cssClasses.LABEL_SHAKE)},i}(e),o=function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return n(e,t),e.attachTo=function(n){return new e(n)},e.prototype.shake=function(n){this.foundation_.shake(n)},e.prototype.float=function(n){this.foundation_.float(n)},e.prototype.getWidth=function(){return this.foundation_.getWidth()},e.prototype.getDefaultFoundation=function(){var n=this;return new u({addClass:function(t){return n.root_.classList.add(t)},removeClass:function(t){return n.root_.classList.remove(t)},getWidth:function(){return n.root_.scrollWidth},registerInteractionHandler:function(t,e){return n.listen(t,e)},deregisterInteractionHandler:function(t,e){return n.unlisten(t,e)}})},e}(i),s={LINE_RIPPLE_ACTIVE:"mdc-line-ripple--active",LINE_RIPPLE_DEACTIVATING:"mdc-line-ripple--deactivating"},c=function(e){function i(n){var r=e.call(this,t({},i.defaultAdapter,n))||this;return r.transitionEndHandler_=function(n){return r.handleTransitionEnd(n)},r}return n(i,e),Object.defineProperty(i,"cssClasses",{get:function(){return s},enumerable:!0,configurable:!0}),Object.defineProperty(i,"defaultAdapter",{get:function(){return{addClass:function(){},removeClass:function(){},hasClass:function(){return!1},setStyle:function(){},registerEventHandler:function(){},deregisterEventHandler:function(){}}},enumerable:!0,configurable:!0}),i.prototype.init=function(){this.adapter_.registerEventHandler("transitionend",this.transitionEndHandler_)},i.prototype.destroy=function(){this.adapter_.deregisterEventHandler("transitionend",this.transitionEndHandler_)},i.prototype.activate=function(){this.adapter_.removeClass(s.LINE_RIPPLE_DEACTIVATING),this.adapter_.addClass(s.LINE_RIPPLE_ACTIVE)},i.prototype.setRippleCenter=function(n){this.adapter_.setStyle("transform-origin",n+"px center")},i.prototype.deactivate=function(){this.adapter_.addClass(s.LINE_RIPPLE_DEACTIVATING)},i.prototype.handleTransitionEnd=function(n){var t=this.adapter_.hasClass(s.LINE_RIPPLE_DEACTIVATING);"opacity"===n.propertyName&&t&&(this.adapter_.removeClass(s.LINE_RIPPLE_ACTIVE),this.adapter_.removeClass(s.LINE_RIPPLE_DEACTIVATING))},i}(e),a=function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return n(e,t),e.attachTo=function(n){return new e(n)},e.prototype.activate=function(){this.foundation_.activate()},e.prototype.deactivate=function(){this.foundation_.deactivate()},e.prototype.setRippleCenter=function(n){this.foundation_.setRippleCenter(n)},e.prototype.getDefaultFoundation=function(){var n=this;return new c({addClass:function(t){return n.root_.classList.add(t)},removeClass:function(t){return n.root_.classList.remove(t)},hasClass:function(t){return n.root_.classList.contains(t)},setStyle:function(t,e){return n.root_.style.setProperty(t,e)},registerEventHandler:function(t,e){return n.listen(t,e)},deregisterEventHandler:function(t,e){return n.unlisten(t,e)}})},e}(i),f={NOTCH_ELEMENT_SELECTOR:".mdc-notched-outline__notch"},h={NOTCH_ELEMENT_PADDING:8},l={NO_LABEL:"mdc-notched-outline--no-label",OUTLINE_NOTCHED:"mdc-notched-outline--notched",OUTLINE_UPGRADED:"mdc-notched-outline--upgraded"},d=function(e){function i(n){return e.call(this,t({},i.defaultAdapter,n))||this}return n(i,e),Object.defineProperty(i,"strings",{get:function(){return f},enumerable:!0,configurable:!0}),Object.defineProperty(i,"cssClasses",{get:function(){return l},enumerable:!0,configurable:!0}),Object.defineProperty(i,"numbers",{get:function(){return h},enumerable:!0,configurable:!0}),Object.defineProperty(i,"defaultAdapter",{get:function(){return{addClass:function(){},removeClass:function(){},setNotchWidthProperty:function(){},removeNotchWidthProperty:function(){}}},enumerable:!0,configurable:!0}),i.prototype.notch=function(n){var t=i.cssClasses.OUTLINE_NOTCHED;n>0&&(n+=h.NOTCH_ELEMENT_PADDING),this.adapter_.setNotchWidthProperty(n),this.adapter_.addClass(t)},i.prototype.closeNotch=function(){this.adapter_.removeClass(i.cssClasses.OUTLINE_NOTCHED),this.adapter_.removeNotchWidthProperty()},i}(e),m=function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return n(e,t),e.attachTo=function(n){return new e(n)},e.prototype.initialSyncWithDOM=function(){this.notchElement_=this.root_.querySelector(f.NOTCH_ELEMENT_SELECTOR);var n=this.root_.querySelector("."+u.cssClasses.ROOT);n?(n.style.transitionDuration="0s",this.root_.classList.add(l.OUTLINE_UPGRADED),requestAnimationFrame((function(){n.style.transitionDuration=""}))):this.root_.classList.add(l.NO_LABEL)},e.prototype.notch=function(n){this.foundation_.notch(n)},e.prototype.closeNotch=function(){this.foundation_.closeNotch()},e.prototype.getDefaultFoundation=function(){var n=this;return new d({addClass:function(t){return n.root_.classList.add(t)},removeClass:function(t){return n.root_.classList.remove(t)},setNotchWidthProperty:function(t){return n.notchElement_.style.setProperty("width",t+"px")},removeNotchWidthProperty:function(){return n.notchElement_.style.removeProperty("width")}})},e}(i);
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
 */export{a as M,o as a,m as b};