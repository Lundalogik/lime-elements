/**
 * @license
 * Copyright 2020 Google Inc.
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
 */
var n=function(){function n(){this.rafIDs=new Map}n.prototype.request=function(n,t){var i=this;this.cancel(n);var r=requestAnimationFrame((function(r){i.rafIDs.delete(n);t(r)}));this.rafIDs.set(n,r)};n.prototype.cancel=function(n){var t=this.rafIDs.get(n);if(t){cancelAnimationFrame(t);this.rafIDs.delete(n)}};n.prototype.cancelAll=function(){var n=this;this.rafIDs.forEach((function(t,i){n.cancel(i)}))};n.prototype.getQueue=function(){var n=[];this.rafIDs.forEach((function(t,i){n.push(i)}));return n};return n}();export{n as A};
//# sourceMappingURL=animationframe-b52af02d.js.map