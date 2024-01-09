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
var E={UNKNOWN:"Unknown",BACKSPACE:"Backspace",ENTER:"Enter",SPACEBAR:"Spacebar",PAGE_UP:"PageUp",PAGE_DOWN:"PageDown",END:"End",HOME:"Home",ARROW_LEFT:"ArrowLeft",ARROW_UP:"ArrowUp",ARROW_RIGHT:"ArrowRight",ARROW_DOWN:"ArrowDown",DELETE:"Delete",ESCAPE:"Escape",TAB:"Tab"};var A=new Set;A.add(E.BACKSPACE);A.add(E.ENTER);A.add(E.SPACEBAR);A.add(E.PAGE_UP);A.add(E.PAGE_DOWN);A.add(E.END);A.add(E.HOME);A.add(E.ARROW_LEFT);A.add(E.ARROW_UP);A.add(E.ARROW_RIGHT);A.add(E.ARROW_DOWN);A.add(E.DELETE);A.add(E.ESCAPE);A.add(E.TAB);var r={BACKSPACE:8,ENTER:13,SPACEBAR:32,PAGE_UP:33,PAGE_DOWN:34,END:35,HOME:36,ARROW_LEFT:37,ARROW_UP:38,ARROW_RIGHT:39,ARROW_DOWN:40,DELETE:46,ESCAPE:27,TAB:9};var R=new Map;R.set(r.BACKSPACE,E.BACKSPACE);R.set(r.ENTER,E.ENTER);R.set(r.SPACEBAR,E.SPACEBAR);R.set(r.PAGE_UP,E.PAGE_UP);R.set(r.PAGE_DOWN,E.PAGE_DOWN);R.set(r.END,E.END);R.set(r.HOME,E.HOME);R.set(r.ARROW_LEFT,E.ARROW_LEFT);R.set(r.ARROW_UP,E.ARROW_UP);R.set(r.ARROW_RIGHT,E.ARROW_RIGHT);R.set(r.ARROW_DOWN,E.ARROW_DOWN);R.set(r.DELETE,E.DELETE);R.set(r.ESCAPE,E.ESCAPE);R.set(r.TAB,E.TAB);var e=new Set;e.add(E.PAGE_UP);e.add(E.PAGE_DOWN);e.add(E.END);e.add(E.HOME);e.add(E.ARROW_LEFT);e.add(E.ARROW_UP);e.add(E.ARROW_RIGHT);e.add(E.ARROW_DOWN);function a(r){var e=r.key;if(A.has(e)){return e}var a=R.get(r.keyCode);if(a){return a}return E.UNKNOWN}function n(E){return e.has(a(E))}export{E as K,n as i,a as n};
//# sourceMappingURL=keyboard-4b9e12e3.js.map