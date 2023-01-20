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
var e={UNKNOWN:"Unknown",BACKSPACE:"Backspace",ENTER:"Enter",SPACEBAR:"Spacebar",PAGE_UP:"PageUp",PAGE_DOWN:"PageDown",END:"End",HOME:"Home",ARROW_LEFT:"ArrowLeft",ARROW_UP:"ArrowUp",ARROW_RIGHT:"ArrowRight",ARROW_DOWN:"ArrowDown",DELETE:"Delete",ESCAPE:"Escape",TAB:"Tab"},r=new Set;r.add(e.BACKSPACE),r.add(e.ENTER),r.add(e.SPACEBAR),r.add(e.PAGE_UP),r.add(e.PAGE_DOWN),r.add(e.END),r.add(e.HOME),r.add(e.ARROW_LEFT),r.add(e.ARROW_UP),r.add(e.ARROW_RIGHT),r.add(e.ARROW_DOWN),r.add(e.DELETE),r.add(e.ESCAPE),r.add(e.TAB);var n=new Map;n.set(8,e.BACKSPACE),n.set(13,e.ENTER),n.set(32,e.SPACEBAR),n.set(33,e.PAGE_UP),n.set(34,e.PAGE_DOWN),n.set(35,e.END),n.set(36,e.HOME),n.set(37,e.ARROW_LEFT),n.set(38,e.ARROW_UP),n.set(39,e.ARROW_RIGHT),n.set(40,e.ARROW_DOWN),n.set(46,e.DELETE),n.set(27,e.ESCAPE),n.set(9,e.TAB);var E=new Set;function a(E){var a=E.key;return r.has(a)?a:n.get(E.keyCode)||e.UNKNOWN}function A(e){return E.has(a(e))}E.add(e.PAGE_UP),E.add(e.PAGE_DOWN),E.add(e.END),E.add(e.HOME),E.add(e.ARROW_LEFT),E.add(e.ARROW_UP),E.add(e.ARROW_RIGHT),E.add(e.ARROW_DOWN);export{e as K,A as i,a as n}