import{M as n,a as t}from"./component-d682c974.js";import{e as r}from"./ponyfill-30263d5e.js";
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
***************************************************************************** */var i=function(n,t){return(i=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(n,t){n.__proto__=t}||function(n,t){for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(n[r]=t[r])})(n,t)};function e(n,t){if("function"!=typeof t&&null!==t)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");function r(){this.constructor=n}i(n,t),n.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)}var o=function(){return(o=Object.assign||function(n){for(var t,r=1,i=arguments.length;r<i;r++)for(var e in t=arguments[r])Object.prototype.hasOwnProperty.call(t,e)&&(n[e]=t[e]);return n}).apply(this,arguments)},u={LABEL_FLOAT_ABOVE:"mdc-floating-label--float-above",LABEL_REQUIRED:"mdc-floating-label--required",LABEL_SHAKE:"mdc-floating-label--shake",ROOT:"mdc-floating-label"},c=function(n){function t(r){var i=n.call(this,o(o({},t.defaultAdapter),r))||this;return i.shakeAnimationEndHandler_=function(){return i.handleShakeAnimationEnd_()},i}return e(t,n),Object.defineProperty(t,"cssClasses",{get:function(){return u},enumerable:!1,configurable:!0}),Object.defineProperty(t,"defaultAdapter",{get:function(){return{addClass:function(){},removeClass:function(){},getWidth:function(){return 0},registerInteractionHandler:function(){},deregisterInteractionHandler:function(){}}},enumerable:!1,configurable:!0}),t.prototype.init=function(){this.adapter.registerInteractionHandler("animationend",this.shakeAnimationEndHandler_)},t.prototype.destroy=function(){this.adapter.deregisterInteractionHandler("animationend",this.shakeAnimationEndHandler_)},t.prototype.getWidth=function(){return this.adapter.getWidth()},t.prototype.shake=function(n){var r=t.cssClasses.LABEL_SHAKE;n?this.adapter.addClass(r):this.adapter.removeClass(r)},t.prototype.float=function(n){var r=t.cssClasses,i=r.LABEL_FLOAT_ABOVE,e=r.LABEL_SHAKE;n?this.adapter.addClass(i):(this.adapter.removeClass(i),this.adapter.removeClass(e))},t.prototype.setRequired=function(n){var r=t.cssClasses.LABEL_REQUIRED;n?this.adapter.addClass(r):this.adapter.removeClass(r)},t.prototype.handleShakeAnimationEnd_=function(){this.adapter.removeClass(t.cssClasses.LABEL_SHAKE)},t}(n),a=function(n){function t(){return null!==n&&n.apply(this,arguments)||this}return e(t,n),t.attachTo=function(n){return new t(n)},t.prototype.shake=function(n){this.foundation.shake(n)},t.prototype.float=function(n){this.foundation.float(n)},t.prototype.setRequired=function(n){this.foundation.setRequired(n)},t.prototype.getWidth=function(){return this.foundation.getWidth()},t.prototype.getDefaultFoundation=function(){var n=this;return new c({addClass:function(t){return n.root.classList.add(t)},removeClass:function(t){return n.root.classList.remove(t)},getWidth:function(){return r(n.root)},registerInteractionHandler:function(t,r){return n.listen(t,r)},deregisterInteractionHandler:function(t,r){return n.unlisten(t,r)}})},t}(t);
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
 */export{c as M,a}