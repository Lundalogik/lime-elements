import{M as n,a as t}from"./component-410aad5a.js";import{e}from"./ponyfill-30263d5e.js";
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */var r=function(n,t){r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(n,t){n.__proto__=t}||function(n,t){for(var e in t)if(Object.prototype.hasOwnProperty.call(t,e))n[e]=t[e]};return r(n,t)};function i(n,t){if(typeof t!=="function"&&t!==null)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");r(n,t);function e(){this.constructor=n}n.prototype=t===null?Object.create(t):(e.prototype=t.prototype,new e)}var u=function(){u=Object.assign||function n(t){for(var e,r=1,i=arguments.length;r<i;r++){e=arguments[r];for(var u in e)if(Object.prototype.hasOwnProperty.call(e,u))t[u]=e[u]}return t};return u.apply(this,arguments)};
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
 */var o={LABEL_FLOAT_ABOVE:"mdc-floating-label--float-above",LABEL_REQUIRED:"mdc-floating-label--required",LABEL_SHAKE:"mdc-floating-label--shake",ROOT:"mdc-floating-label"};
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
 */var a=function(n){i(t,n);function t(e){var r=n.call(this,u(u({},t.defaultAdapter),e))||this;r.shakeAnimationEndHandler=function(){r.handleShakeAnimationEnd()};return r}Object.defineProperty(t,"cssClasses",{get:function(){return o},enumerable:false,configurable:true});Object.defineProperty(t,"defaultAdapter",{get:function(){return{addClass:function(){return undefined},removeClass:function(){return undefined},getWidth:function(){return 0},registerInteractionHandler:function(){return undefined},deregisterInteractionHandler:function(){return undefined}}},enumerable:false,configurable:true});t.prototype.init=function(){this.adapter.registerInteractionHandler("animationend",this.shakeAnimationEndHandler)};t.prototype.destroy=function(){this.adapter.deregisterInteractionHandler("animationend",this.shakeAnimationEndHandler)};t.prototype.getWidth=function(){return this.adapter.getWidth()};t.prototype.shake=function(n){var e=t.cssClasses.LABEL_SHAKE;if(n){this.adapter.addClass(e)}else{this.adapter.removeClass(e)}};t.prototype.float=function(n){var e=t.cssClasses,r=e.LABEL_FLOAT_ABOVE,i=e.LABEL_SHAKE;if(n){this.adapter.addClass(r)}else{this.adapter.removeClass(r);this.adapter.removeClass(i)}};t.prototype.setRequired=function(n){var e=t.cssClasses.LABEL_REQUIRED;if(n){this.adapter.addClass(e)}else{this.adapter.removeClass(e)}};t.prototype.handleShakeAnimationEnd=function(){var n=t.cssClasses.LABEL_SHAKE;this.adapter.removeClass(n)};return t}(n);
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
 */var f=function(n){i(t,n);function t(){return n!==null&&n.apply(this,arguments)||this}t.attachTo=function(n){return new t(n)};t.prototype.shake=function(n){this.foundation.shake(n)};t.prototype.float=function(n){this.foundation.float(n)};t.prototype.setRequired=function(n){this.foundation.setRequired(n)};t.prototype.getWidth=function(){return this.foundation.getWidth()};t.prototype.getDefaultFoundation=function(){var n=this;var t={addClass:function(t){return n.root.classList.add(t)},removeClass:function(t){return n.root.classList.remove(t)},getWidth:function(){return e(n.root)},registerInteractionHandler:function(t,e){return n.listen(t,e)},deregisterInteractionHandler:function(t,e){return n.unlisten(t,e)}};return new a(t)};return t}(t);export{a as M,f as a};
//# sourceMappingURL=component-19eb6e2b.js.map