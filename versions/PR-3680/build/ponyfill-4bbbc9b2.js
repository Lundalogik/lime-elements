var n=function(r,t){n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(n,r){n.__proto__=r}||function(n,r){for(var t in r)if(Object.prototype.hasOwnProperty.call(r,t))n[t]=r[t]};return n(r,t)};function r(r,t){if(typeof t!=="function"&&t!==null)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");n(r,t);function e(){this.constructor=r}r.prototype=t===null?Object.create(t):(e.prototype=t.prototype,new e)}var t=function(){t=Object.assign||function n(r){for(var t,e=1,o=arguments.length;e<o;e++){t=arguments[e];for(var u in t)if(Object.prototype.hasOwnProperty.call(t,u))r[u]=t[u]}return r};return t.apply(this,arguments)};function e(n){var r=typeof Symbol==="function"&&Symbol.iterator,t=r&&n[r],e=0;if(t)return t.call(n);if(n&&typeof n.length==="number")return{next:function(){if(n&&e>=n.length)n=void 0;return{value:n&&n[e++],done:!n}}};throw new TypeError(r?"Object is not iterable.":"Symbol.iterator is not defined.")}function o(n,r){var t=typeof Symbol==="function"&&n[Symbol.iterator];if(!t)return n;var e=t.call(n),o,u=[],i;try{while((r===void 0||r-- >0)&&!(o=e.next()).done)u.push(o.value)}catch(n){i={error:n}}finally{try{if(o&&!o.done&&(t=e["return"]))t.call(e)}finally{if(i)throw i.error}}return u}function u(n,r,t){if(t||arguments.length===2)for(var e=0,o=r.length,u;e<o;e++){if(u||!(e in r)){if(!u)u=Array.prototype.slice.call(r,0,e);u[e]=r[e]}}return n.concat(u||Array.prototype.slice.call(r))}typeof SuppressedError==="function"?SuppressedError:function(n,r,t){var e=new Error(t);return e.name="SuppressedError",e.error=n,e.suppressed=r,e};
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
 */var i=function(){function n(n){if(n===void 0){n={}}this.adapter=n}Object.defineProperty(n,"cssClasses",{get:function(){return{}},enumerable:false,configurable:true});Object.defineProperty(n,"strings",{get:function(){return{}},enumerable:false,configurable:true});Object.defineProperty(n,"numbers",{get:function(){return{}},enumerable:false,configurable:true});Object.defineProperty(n,"defaultAdapter",{get:function(){return{}},enumerable:false,configurable:true});n.prototype.init=function(){};n.prototype.destroy=function(){};return n}();
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
 */var f=function(){function n(n,r){var t=[];for(var e=2;e<arguments.length;e++){t[e-2]=arguments[e]}this.root=n;this.initialize.apply(this,u([],o(t)));this.foundation=r===undefined?this.getDefaultFoundation():r;this.foundation.init();this.initialSyncWithDOM()}n.attachTo=function(r){return new n(r,new i({}))};n.prototype.initialize=function(){var n=[];for(var r=0;r<arguments.length;r++){n[r]=arguments[r]}};n.prototype.getDefaultFoundation=function(){throw new Error("Subclasses must override getDefaultFoundation to return a properly configured "+"foundation class")};n.prototype.initialSyncWithDOM=function(){};n.prototype.destroy=function(){this.foundation.destroy()};n.prototype.listen=function(n,r,t){this.root.addEventListener(n,r,t)};n.prototype.unlisten=function(n,r,t){this.root.removeEventListener(n,r,t)};n.prototype.emit=function(n,r,t){if(t===void 0){t=false}var e;if(typeof CustomEvent==="function"){e=new CustomEvent(n,{bubbles:t,detail:r})}else{e=document.createEvent("CustomEvent");e.initCustomEvent(n,t,false,r)}this.root.dispatchEvent(e)};return n}();
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
 */function a(n,r){if(n.closest){return n.closest(r)}var t=n;while(t){if(s(t,r)){return t}t=t.parentElement}return null}function s(n,r){var t=n.matches||n.webkitMatchesSelector||n.msMatchesSelector;return t.call(n,r)}function c(n){var r=n;if(r.offsetParent!==null){return r.scrollWidth}var t=r.cloneNode(true);t.style.setProperty("position","absolute");t.style.setProperty("transform","translate(-9999px, -9999px)");document.documentElement.appendChild(t);var e=t.scrollWidth;document.documentElement.removeChild(t);return e}export{i as M,r as _,t as a,o as b,f as c,e as d,c as e,u as f,a as g,s as m};
//# sourceMappingURL=ponyfill-4bbbc9b2.js.map