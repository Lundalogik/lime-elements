import{_ as n,a as t,M as i,b as e,e as r}from"./ponyfill-DKzV8gaY.js";
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
 */var u={LABEL_FLOAT_ABOVE:"mdc-floating-label--float-above",LABEL_REQUIRED:"mdc-floating-label--required",LABEL_SHAKE:"mdc-floating-label--shake",ROOT:"mdc-floating-label"},a=function(i){function e(n){var r=i.call(this,t(t({},e.defaultAdapter),n))||this;return r.shakeAnimationEndHandler=function(){r.handleShakeAnimationEnd()},r}return n(e,i),Object.defineProperty(e,"cssClasses",{get:function(){return u},enumerable:!1,configurable:!0}),Object.defineProperty(e,"defaultAdapter",{get:function(){return{addClass:function(){},removeClass:function(){},getWidth:function(){return 0},registerInteractionHandler:function(){},deregisterInteractionHandler:function(){}}},enumerable:!1,configurable:!0}),e.prototype.init=function(){this.adapter.registerInteractionHandler("animationend",this.shakeAnimationEndHandler)},e.prototype.destroy=function(){this.adapter.deregisterInteractionHandler("animationend",this.shakeAnimationEndHandler)},e.prototype.getWidth=function(){return this.adapter.getWidth()},e.prototype.shake=function(n){var t=e.cssClasses.LABEL_SHAKE;n?this.adapter.addClass(t):this.adapter.removeClass(t)},e.prototype.float=function(n){var t=e.cssClasses,i=t.LABEL_FLOAT_ABOVE,r=t.LABEL_SHAKE;n?this.adapter.addClass(i):(this.adapter.removeClass(i),this.adapter.removeClass(r))},e.prototype.setRequired=function(n){var t=e.cssClasses.LABEL_REQUIRED;n?this.adapter.addClass(t):this.adapter.removeClass(t)},e.prototype.handleShakeAnimationEnd=function(){this.adapter.removeClass(e.cssClasses.LABEL_SHAKE)},e}(i),o=function(t){function i(){return null!==t&&t.apply(this,arguments)||this}return n(i,t),i.attachTo=function(n){return new i(n)},i.prototype.shake=function(n){this.foundation.shake(n)},i.prototype.float=function(n){this.foundation.float(n)},i.prototype.setRequired=function(n){this.foundation.setRequired(n)},i.prototype.getWidth=function(){return this.foundation.getWidth()},i.prototype.getDefaultFoundation=function(){var n=this;return new a({addClass:function(t){return n.root.classList.add(t)},removeClass:function(t){return n.root.classList.remove(t)},getWidth:function(){return r(n.root)},registerInteractionHandler:function(t,i){return n.listen(t,i)},deregisterInteractionHandler:function(t,i){return n.unlisten(t,i)}})},i}(e);
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
 */export{o as M,a}