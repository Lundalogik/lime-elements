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
 */
function r(r,t){if(r.closest){return r.closest(t)}var u=r;while(u){if(n(u,t)){return u}u=u.parentElement}return null}function n(r,n){var t=r.matches||r.webkitMatchesSelector||r.msMatchesSelector;return t.call(r,n)}function t(r){var n=r;if(n.offsetParent!==null){return n.scrollWidth}var t=n.cloneNode(true);t.style.setProperty("position","absolute");t.style.setProperty("transform","translate(-9999px, -9999px)");document.documentElement.appendChild(t);var u=t.scrollWidth;document.documentElement.removeChild(t);return u}export{r as c,t as e,n as m};
//# sourceMappingURL=ponyfill-30263d5e.js.map