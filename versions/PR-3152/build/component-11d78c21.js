import{_ as n,a as t,M as e,g as i,c as r}from"./ponyfill-d79e8edd.js";
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
 */var u={LABEL_FLOAT_ABOVE:"mdc-floating-label--float-above",LABEL_REQUIRED:"mdc-floating-label--required",LABEL_SHAKE:"mdc-floating-label--shake",ROOT:"mdc-floating-label"};
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
 */var a=function(e){n(i,e);function i(n){var r=e.call(this,t(t({},i.defaultAdapter),n))||this;r.shakeAnimationEndHandler=function(){r.handleShakeAnimationEnd()};return r}Object.defineProperty(i,"cssClasses",{get:function(){return u},enumerable:false,configurable:true});Object.defineProperty(i,"defaultAdapter",{get:function(){return{addClass:function(){return undefined},removeClass:function(){return undefined},getWidth:function(){return 0},registerInteractionHandler:function(){return undefined},deregisterInteractionHandler:function(){return undefined}}},enumerable:false,configurable:true});i.prototype.init=function(){this.adapter.registerInteractionHandler("animationend",this.shakeAnimationEndHandler)};i.prototype.destroy=function(){this.adapter.deregisterInteractionHandler("animationend",this.shakeAnimationEndHandler)};i.prototype.getWidth=function(){return this.adapter.getWidth()};i.prototype.shake=function(n){var t=i.cssClasses.LABEL_SHAKE;if(n){this.adapter.addClass(t)}else{this.adapter.removeClass(t)}};i.prototype.float=function(n){var t=i.cssClasses,e=t.LABEL_FLOAT_ABOVE,r=t.LABEL_SHAKE;if(n){this.adapter.addClass(e)}else{this.adapter.removeClass(e);this.adapter.removeClass(r)}};i.prototype.setRequired=function(n){var t=i.cssClasses.LABEL_REQUIRED;if(n){this.adapter.addClass(t)}else{this.adapter.removeClass(t)}};i.prototype.handleShakeAnimationEnd=function(){var n=i.cssClasses.LABEL_SHAKE;this.adapter.removeClass(n)};return i}(e);
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
 */var s=function(t){n(e,t);function e(){return t!==null&&t.apply(this,arguments)||this}e.attachTo=function(n){return new e(n)};e.prototype.shake=function(n){this.foundation.shake(n)};e.prototype.float=function(n){this.foundation.float(n)};e.prototype.setRequired=function(n){this.foundation.setRequired(n)};e.prototype.getWidth=function(){return this.foundation.getWidth()};e.prototype.getDefaultFoundation=function(){var n=this;var t={addClass:function(t){return n.root.classList.add(t)},removeClass:function(t){return n.root.classList.remove(t)},getWidth:function(){return i(n.root)},registerInteractionHandler:function(t,e){return n.listen(t,e)},deregisterInteractionHandler:function(t,e){return n.unlisten(t,e)}};return new a(t)};return e}(r);export{a as M,s as a};
//# sourceMappingURL=component-11d78c21.js.map