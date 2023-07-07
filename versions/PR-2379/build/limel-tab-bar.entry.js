import{r as t,c as r,h as n,g as e}from"./index-2626b3b7.js";import{S as i,c as a,i as o}from"./isEqual-3f80c036.js";import{M as c,a as s}from"./component-410aad5a.js";import{a as l,b as u,M as f}from"./component-5b4ac85a.js";import{m as d}from"./ponyfill-30263d5e.js";import{a as h,b as m,c as b,i as p,d as v}from"./_arrayIncludesWith-4d4adca1.js";import{a as g}from"./_arrayMap-e86f6dbb.js";import{b as _}from"./_nodeUtil-0ed26eea.js";import"./eq-1533d1d3.js";import"./_baseGetTag-49d0259e.js";import"./isObject-7039fcda.js";import"./_getNative-4698fd71.js";import"./isArray-80298bc7.js";import"./isObjectLike-38996507.js";import"./isArrayLike-13c56347.js";import"./identity-5b806255.js";import"./_defineProperty-6dda4257.js";var y=200;function w(t,r,n,e){var o=-1,c=h,s=true,l=t.length,u=[],f=r.length;if(!l){return u}if(n){r=g(r,_(n))}if(e){c=m;s=false}else if(r.length>=y){c=a;s=false;r=new i(r)}t:while(++o<l){var d=t[o],b=n==null?d:n(d);d=e||d!==0?d:0;if(s&&b===b){var p=f;while(p--){if(r[p]===b){continue t}}u.push(d)}else if(!c(r,b,e)){u.push(d)}}return u}var x=b((function(t,r){return p(t)?w(t,v(r,1,p,true)):[]}));
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
***************************************************************************** */var O=function(t,r){O=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,r){t.__proto__=r}||function(t,r){for(var n in r)if(Object.prototype.hasOwnProperty.call(r,n))t[n]=r[n]};return O(t,r)};function C(t,r){if(typeof r!=="function"&&r!==null)throw new TypeError("Class extends value "+String(r)+" is not a constructor or null");O(t,r);function n(){this.constructor=t}t.prototype=r===null?Object.create(r):(n.prototype=r.prototype,new n)}var T=function(){T=Object.assign||function t(r){for(var n,e=1,i=arguments.length;e<i;e++){n=arguments[e];for(var a in n)if(Object.prototype.hasOwnProperty.call(n,a))r[a]=n[a]}return r};return T.apply(this,arguments)};function S(t){var r=typeof Symbol==="function"&&Symbol.iterator,n=r&&t[r],e=0;if(n)return n.call(t);if(t&&typeof t.length==="number")return{next:function(){if(t&&e>=t.length)t=void 0;return{value:t&&t[e++],done:!t}}};throw new TypeError(r?"Object is not iterable.":"Symbol.iterator is not defined.")}
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
***************************************************************************** */var A=function(t,r){A=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,r){t.__proto__=r}||function(t,r){for(var n in r)if(Object.prototype.hasOwnProperty.call(r,n))t[n]=r[n]};return A(t,r)};function E(t,r){if(typeof r!=="function"&&r!==null)throw new TypeError("Class extends value "+String(r)+" is not a constructor or null");A(t,r);function n(){this.constructor=t}t.prototype=r===null?Object.create(r):(n.prototype=r.prototype,new n)}var k=function(){k=Object.assign||function t(r){for(var n,e=1,i=arguments.length;e<i;e++){n=arguments[e];for(var a in n)if(Object.prototype.hasOwnProperty.call(n,a))r[a]=n[a]}return r};return k.apply(this,arguments)};function j(t,r){var n=typeof Symbol==="function"&&t[Symbol.iterator];if(!n)return t;var e=n.call(t),i,a=[],o;try{while((r===void 0||r-- >0)&&!(i=e.next()).done)a.push(i.value)}catch(t){o={error:t}}finally{try{if(i&&!i.done&&(n=e["return"]))n.call(e)}finally{if(o)throw o.error}}return a}
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
 */var R={ANIMATING:"mdc-tab-scroller--animating",SCROLL_AREA_SCROLL:"mdc-tab-scroller__scroll-area--scroll",SCROLL_TEST:"mdc-tab-scroller__test"};var I={AREA_SELECTOR:".mdc-tab-scroller__scroll-area",CONTENT_SELECTOR:".mdc-tab-scroller__scroll-content"};
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
 */var L=function(){function t(t){this.adapter=t}return t}();
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
 */var z=function(t){E(r,t);function r(){return t!==null&&t.apply(this,arguments)||this}r.prototype.getScrollPositionRTL=function(){var t=this.adapter.getScrollAreaScrollLeft();var r=this.calculateScrollEdges().right;return Math.round(r-t)};r.prototype.scrollToRTL=function(t){var r=this.calculateScrollEdges();var n=this.adapter.getScrollAreaScrollLeft();var e=this.clampScrollValue(r.right-t);return{finalScrollPosition:e,scrollDelta:e-n}};r.prototype.incrementScrollRTL=function(t){var r=this.adapter.getScrollAreaScrollLeft();var n=this.clampScrollValue(r-t);return{finalScrollPosition:n,scrollDelta:n-r}};r.prototype.getAnimatingScrollPosition=function(t){return t};r.prototype.calculateScrollEdges=function(){var t=this.adapter.getScrollContentOffsetWidth();var r=this.adapter.getScrollAreaOffsetWidth();return{left:0,right:t-r}};r.prototype.clampScrollValue=function(t){var r=this.calculateScrollEdges();return Math.min(Math.max(r.left,t),r.right)};return r}(L);
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
 */var M=function(t){E(r,t);function r(){return t!==null&&t.apply(this,arguments)||this}r.prototype.getScrollPositionRTL=function(t){var r=this.adapter.getScrollAreaScrollLeft();return Math.round(t-r)};r.prototype.scrollToRTL=function(t){var r=this.adapter.getScrollAreaScrollLeft();var n=this.clampScrollValue(-t);return{finalScrollPosition:n,scrollDelta:n-r}};r.prototype.incrementScrollRTL=function(t){var r=this.adapter.getScrollAreaScrollLeft();var n=this.clampScrollValue(r-t);return{finalScrollPosition:n,scrollDelta:n-r}};r.prototype.getAnimatingScrollPosition=function(t,r){return t-r};r.prototype.calculateScrollEdges=function(){var t=this.adapter.getScrollContentOffsetWidth();var r=this.adapter.getScrollAreaOffsetWidth();return{left:r-t,right:0}};r.prototype.clampScrollValue=function(t){var r=this.calculateScrollEdges();return Math.max(Math.min(r.right,t),r.left)};return r}(L);
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
 */var D=function(t){E(r,t);function r(){return t!==null&&t.apply(this,arguments)||this}r.prototype.getScrollPositionRTL=function(t){var r=this.adapter.getScrollAreaScrollLeft();return Math.round(r-t)};r.prototype.scrollToRTL=function(t){var r=this.adapter.getScrollAreaScrollLeft();var n=this.clampScrollValue(t);return{finalScrollPosition:n,scrollDelta:r-n}};r.prototype.incrementScrollRTL=function(t){var r=this.adapter.getScrollAreaScrollLeft();var n=this.clampScrollValue(r+t);return{finalScrollPosition:n,scrollDelta:r-n}};r.prototype.getAnimatingScrollPosition=function(t,r){return t+r};r.prototype.calculateScrollEdges=function(){var t=this.adapter.getScrollContentOffsetWidth();var r=this.adapter.getScrollAreaOffsetWidth();return{left:t-r,right:0}};r.prototype.clampScrollValue=function(t){var r=this.calculateScrollEdges();return Math.min(Math.max(r.right,t),r.left)};return r}(L);
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
 */var N=function(t){E(r,t);function r(n){var e=t.call(this,k(k({},r.defaultAdapter),n))||this;e.isAnimating=false;return e}Object.defineProperty(r,"cssClasses",{get:function(){return R},enumerable:false,configurable:true});Object.defineProperty(r,"strings",{get:function(){return I},enumerable:false,configurable:true});Object.defineProperty(r,"defaultAdapter",{get:function(){return{eventTargetMatchesSelector:function(){return false},addClass:function(){return undefined},removeClass:function(){return undefined},addScrollAreaClass:function(){return undefined},setScrollAreaStyleProperty:function(){return undefined},setScrollContentStyleProperty:function(){return undefined},getScrollContentStyleValue:function(){return""},setScrollAreaScrollLeft:function(){return undefined},getScrollAreaScrollLeft:function(){return 0},getScrollContentOffsetWidth:function(){return 0},getScrollAreaOffsetWidth:function(){return 0},computeScrollAreaClientRect:function(){return{top:0,right:0,bottom:0,left:0,width:0,height:0}},computeScrollContentClientRect:function(){return{top:0,right:0,bottom:0,left:0,width:0,height:0}},computeHorizontalScrollbarHeight:function(){return 0}}},enumerable:false,configurable:true});r.prototype.init=function(){var t=this.adapter.computeHorizontalScrollbarHeight();this.adapter.setScrollAreaStyleProperty("margin-bottom",-t+"px");this.adapter.addScrollAreaClass(r.cssClasses.SCROLL_AREA_SCROLL)};r.prototype.getScrollPosition=function(){if(this.isRTL()){return this.computeCurrentScrollPositionRTL()}var t=this.calculateCurrentTranslateX();var r=this.adapter.getScrollAreaScrollLeft();return r-t};r.prototype.handleInteraction=function(){if(!this.isAnimating){return}this.stopScrollAnimation()};r.prototype.handleTransitionEnd=function(t){var n=t.target;if(!this.isAnimating||!this.adapter.eventTargetMatchesSelector(n,r.strings.CONTENT_SELECTOR)){return}this.isAnimating=false;this.adapter.removeClass(r.cssClasses.ANIMATING)};r.prototype.incrementScroll=function(t){if(t===0){return}this.animate(this.getIncrementScrollOperation(t))};r.prototype.incrementScrollImmediate=function(t){if(t===0){return}var r=this.getIncrementScrollOperation(t);if(r.scrollDelta===0){return}this.stopScrollAnimation();this.adapter.setScrollAreaScrollLeft(r.finalScrollPosition)};r.prototype.scrollTo=function(t){if(this.isRTL()){this.scrollToImplRTL(t);return}this.scrollToImpl(t)};r.prototype.getRTLScroller=function(){if(!this.rtlScrollerInstance){this.rtlScrollerInstance=this.rtlScrollerFactory()}return this.rtlScrollerInstance};r.prototype.calculateCurrentTranslateX=function(){var t=this.adapter.getScrollContentStyleValue("transform");if(t==="none"){return 0}var r=/\((.+?)\)/.exec(t);if(!r){return 0}var n=r[1];var e=j(n.split(","),6),i=e[4];return parseFloat(i)};r.prototype.clampScrollValue=function(t){var r=this.calculateScrollEdges();return Math.min(Math.max(r.left,t),r.right)};r.prototype.computeCurrentScrollPositionRTL=function(){var t=this.calculateCurrentTranslateX();return this.getRTLScroller().getScrollPositionRTL(t)};r.prototype.calculateScrollEdges=function(){var t=this.adapter.getScrollContentOffsetWidth();var r=this.adapter.getScrollAreaOffsetWidth();return{left:0,right:t-r}};r.prototype.scrollToImpl=function(t){var r=this.getScrollPosition();var n=this.clampScrollValue(t);var e=n-r;this.animate({finalScrollPosition:n,scrollDelta:e})};r.prototype.scrollToImplRTL=function(t){var r=this.getRTLScroller().scrollToRTL(t);this.animate(r)};r.prototype.getIncrementScrollOperation=function(t){if(this.isRTL()){return this.getRTLScroller().incrementScrollRTL(t)}var r=this.getScrollPosition();var n=t+r;var e=this.clampScrollValue(n);var i=e-r;return{finalScrollPosition:e,scrollDelta:i}};r.prototype.animate=function(t){var n=this;if(t.scrollDelta===0){return}this.stopScrollAnimation();this.adapter.setScrollAreaScrollLeft(t.finalScrollPosition);this.adapter.setScrollContentStyleProperty("transform","translateX("+t.scrollDelta+"px)");this.adapter.computeScrollAreaClientRect();requestAnimationFrame((function(){n.adapter.addClass(r.cssClasses.ANIMATING);n.adapter.setScrollContentStyleProperty("transform","none")}));this.isAnimating=true};r.prototype.stopScrollAnimation=function(){this.isAnimating=false;var t=this.getAnimatingScrollPosition();this.adapter.removeClass(r.cssClasses.ANIMATING);this.adapter.setScrollContentStyleProperty("transform","translateX(0px)");this.adapter.setScrollAreaScrollLeft(t)};r.prototype.getAnimatingScrollPosition=function(){var t=this.calculateCurrentTranslateX();var r=this.adapter.getScrollAreaScrollLeft();if(this.isRTL()){return this.getRTLScroller().getAnimatingScrollPosition(r,t)}return r-t};r.prototype.rtlScrollerFactory=function(){var t=this.adapter.getScrollAreaScrollLeft();this.adapter.setScrollAreaScrollLeft(t-1);var r=this.adapter.getScrollAreaScrollLeft();if(r<0){this.adapter.setScrollAreaScrollLeft(t);return new M(this.adapter)}var n=this.adapter.computeScrollAreaClientRect();var e=this.adapter.computeScrollContentClientRect();var i=Math.round(e.right-n.right);this.adapter.setScrollAreaScrollLeft(t);if(i===r){return new D(this.adapter)}return new z(this.adapter)};r.prototype.isRTL=function(){return this.adapter.getScrollContentStyleValue("direction")==="rtl"};return r}(c);
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
 */var P;function W(t,r){if(r===void 0){r=true}if(r&&typeof P!=="undefined"){return P}var n=t.createElement("div");n.classList.add(R.SCROLL_TEST);t.body.appendChild(n);var e=n.offsetHeight-n.clientHeight;t.body.removeChild(n);if(r){P=e}return e}
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
 */var Y=function(t){E(r,t);function r(){return t!==null&&t.apply(this,arguments)||this}r.attachTo=function(t){return new r(t)};r.prototype.initialize=function(){this.area=this.root.querySelector(N.strings.AREA_SELECTOR);this.content=this.root.querySelector(N.strings.CONTENT_SELECTOR)};r.prototype.initialSyncWithDOM=function(){var t=this;this.handleInteraction=function(){t.foundation.handleInteraction()};this.handleTransitionEnd=function(r){t.foundation.handleTransitionEnd(r)};this.area.addEventListener("wheel",this.handleInteraction,l());this.area.addEventListener("touchstart",this.handleInteraction,l());this.area.addEventListener("pointerdown",this.handleInteraction,l());this.area.addEventListener("mousedown",this.handleInteraction,l());this.area.addEventListener("keydown",this.handleInteraction,l());this.content.addEventListener("transitionend",this.handleTransitionEnd)};r.prototype.destroy=function(){t.prototype.destroy.call(this);this.area.removeEventListener("wheel",this.handleInteraction,l());this.area.removeEventListener("touchstart",this.handleInteraction,l());this.area.removeEventListener("pointerdown",this.handleInteraction,l());this.area.removeEventListener("mousedown",this.handleInteraction,l());this.area.removeEventListener("keydown",this.handleInteraction,l());this.content.removeEventListener("transitionend",this.handleTransitionEnd)};r.prototype.getDefaultFoundation=function(){var t=this;var r={eventTargetMatchesSelector:function(t,r){return d(t,r)},addClass:function(r){t.root.classList.add(r)},removeClass:function(r){t.root.classList.remove(r)},addScrollAreaClass:function(r){t.area.classList.add(r)},setScrollAreaStyleProperty:function(r,n){t.area.style.setProperty(r,n)},setScrollContentStyleProperty:function(r,n){t.content.style.setProperty(r,n)},getScrollContentStyleValue:function(r){return window.getComputedStyle(t.content).getPropertyValue(r)},setScrollAreaScrollLeft:function(r){return t.area.scrollLeft=r},getScrollAreaScrollLeft:function(){return t.area.scrollLeft},getScrollContentOffsetWidth:function(){return t.content.offsetWidth},getScrollAreaOffsetWidth:function(){return t.area.offsetWidth},computeScrollAreaClientRect:function(){return t.area.getBoundingClientRect()},computeScrollContentClientRect:function(){return t.content.getBoundingClientRect()},computeHorizontalScrollbarHeight:function(){return W(document)}};return new N(r)};r.prototype.getScrollPosition=function(){return this.foundation.getScrollPosition()};r.prototype.getScrollContentWidth=function(){return this.content.offsetWidth};r.prototype.incrementScroll=function(t){this.foundation.incrementScroll(t)};r.prototype.scrollTo=function(t){this.foundation.scrollTo(t)};return r}(s);
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
***************************************************************************** */var B=function(t,r){B=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,r){t.__proto__=r}||function(t,r){for(var n in r)if(Object.prototype.hasOwnProperty.call(r,n))t[n]=r[n]};return B(t,r)};function K(t,r){if(typeof r!=="function"&&r!==null)throw new TypeError("Class extends value "+String(r)+" is not a constructor or null");B(t,r);function n(){this.constructor=t}t.prototype=r===null?Object.create(r):(n.prototype=r.prototype,new n)}var H=function(){H=Object.assign||function t(r){for(var n,e=1,i=arguments.length;e<i;e++){n=arguments[e];for(var a in n)if(Object.prototype.hasOwnProperty.call(n,a))r[a]=n[a]}return r};return H.apply(this,arguments)};
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
***************************************************************************** */var V=function(t,r){V=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,r){t.__proto__=r}||function(t,r){for(var n in r)if(Object.prototype.hasOwnProperty.call(r,n))t[n]=r[n]};return V(t,r)};function F(t,r){if(typeof r!=="function"&&r!==null)throw new TypeError("Class extends value "+String(r)+" is not a constructor or null");V(t,r);function n(){this.constructor=t}t.prototype=r===null?Object.create(r):(n.prototype=r.prototype,new n)}var X=function(){X=Object.assign||function t(r){for(var n,e=1,i=arguments.length;e<i;e++){n=arguments[e];for(var a in n)if(Object.prototype.hasOwnProperty.call(n,a))r[a]=n[a]}return r};return X.apply(this,arguments)};
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
 */var q={ACTIVE:"mdc-tab-indicator--active",FADE:"mdc-tab-indicator--fade",NO_TRANSITION:"mdc-tab-indicator--no-transition"};var G={CONTENT_SELECTOR:".mdc-tab-indicator__content"};
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
 */var U=function(t){F(r,t);function r(n){return t.call(this,X(X({},r.defaultAdapter),n))||this}Object.defineProperty(r,"cssClasses",{get:function(){return q},enumerable:false,configurable:true});Object.defineProperty(r,"strings",{get:function(){return G},enumerable:false,configurable:true});Object.defineProperty(r,"defaultAdapter",{get:function(){return{addClass:function(){return undefined},removeClass:function(){return undefined},computeContentClientRect:function(){return{top:0,right:0,bottom:0,left:0,width:0,height:0}},setContentStyleProperty:function(){return undefined}}},enumerable:false,configurable:true});r.prototype.computeContentClientRect=function(){return this.adapter.computeContentClientRect()};return r}(c);
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
 */var J=function(t){F(r,t);function r(){return t!==null&&t.apply(this,arguments)||this}r.prototype.activate=function(){this.adapter.addClass(U.cssClasses.ACTIVE)};r.prototype.deactivate=function(){this.adapter.removeClass(U.cssClasses.ACTIVE)};return r}(U);
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
 */var Q=function(t){F(r,t);function r(){return t!==null&&t.apply(this,arguments)||this}r.prototype.activate=function(t){if(!t){this.adapter.addClass(U.cssClasses.ACTIVE);return}var r=this.computeContentClientRect();var n=t.width/r.width;var e=t.left-r.left;this.adapter.addClass(U.cssClasses.NO_TRANSITION);this.adapter.setContentStyleProperty("transform","translateX("+e+"px) scaleX("+n+")");this.computeContentClientRect();this.adapter.removeClass(U.cssClasses.NO_TRANSITION);this.adapter.addClass(U.cssClasses.ACTIVE);this.adapter.setContentStyleProperty("transform","")};r.prototype.deactivate=function(){this.adapter.removeClass(U.cssClasses.ACTIVE)};return r}(U);
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
 */var Z=function(t){F(r,t);function r(){return t!==null&&t.apply(this,arguments)||this}r.attachTo=function(t){return new r(t)};r.prototype.initialize=function(){this.content=this.root.querySelector(U.strings.CONTENT_SELECTOR)};r.prototype.computeContentClientRect=function(){return this.foundation.computeContentClientRect()};r.prototype.getDefaultFoundation=function(){var t=this;var r={addClass:function(r){return t.root.classList.add(r)},removeClass:function(r){return t.root.classList.remove(r)},computeContentClientRect:function(){return t.content.getBoundingClientRect()},setContentStyleProperty:function(r,n){t.content.style.setProperty(r,n)}};if(this.root.classList.contains(U.cssClasses.FADE)){return new J(r)}return new Q(r)};r.prototype.activate=function(t){this.foundation.activate(t)};r.prototype.deactivate=function(){this.foundation.deactivate()};return r}(s);
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
 */var $={ACTIVE:"mdc-tab--active"};var tt={ARIA_SELECTED:"aria-selected",CONTENT_SELECTOR:".mdc-tab__content",INTERACTED_EVENT:"MDCTab:interacted",RIPPLE_SELECTOR:".mdc-tab__ripple",TABINDEX:"tabIndex",TAB_INDICATOR_SELECTOR:".mdc-tab-indicator"};
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
 */var rt=function(t){K(r,t);function r(n){var e=t.call(this,H(H({},r.defaultAdapter),n))||this;e.focusOnActivate=true;return e}Object.defineProperty(r,"cssClasses",{get:function(){return $},enumerable:false,configurable:true});Object.defineProperty(r,"strings",{get:function(){return tt},enumerable:false,configurable:true});Object.defineProperty(r,"defaultAdapter",{get:function(){return{addClass:function(){return undefined},removeClass:function(){return undefined},hasClass:function(){return false},setAttr:function(){return undefined},activateIndicator:function(){return undefined},deactivateIndicator:function(){return undefined},notifyInteracted:function(){return undefined},getOffsetLeft:function(){return 0},getOffsetWidth:function(){return 0},getContentOffsetLeft:function(){return 0},getContentOffsetWidth:function(){return 0},focus:function(){return undefined}}},enumerable:false,configurable:true});r.prototype.handleClick=function(){this.adapter.notifyInteracted()};r.prototype.isActive=function(){return this.adapter.hasClass($.ACTIVE)};r.prototype.setFocusOnActivate=function(t){this.focusOnActivate=t};r.prototype.activate=function(t){this.adapter.addClass($.ACTIVE);this.adapter.setAttr(tt.ARIA_SELECTED,"true");this.adapter.setAttr(tt.TABINDEX,"0");this.adapter.activateIndicator(t);if(this.focusOnActivate){this.adapter.focus()}};r.prototype.deactivate=function(){if(!this.isActive()){return}this.adapter.removeClass($.ACTIVE);this.adapter.setAttr(tt.ARIA_SELECTED,"false");this.adapter.setAttr(tt.TABINDEX,"-1");this.adapter.deactivateIndicator()};r.prototype.computeDimensions=function(){var t=this.adapter.getOffsetWidth();var r=this.adapter.getOffsetLeft();var n=this.adapter.getContentOffsetWidth();var e=this.adapter.getContentOffsetLeft();return{contentLeft:r+e,contentRight:r+e+n,rootLeft:r,rootRight:r+t}};return r}(c);
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
 */var nt=function(t){K(r,t);function r(){return t!==null&&t.apply(this,arguments)||this}r.attachTo=function(t){return new r(t)};r.prototype.initialize=function(t,r){if(t===void 0){t=function(t,r){return new f(t,r)}}if(r===void 0){r=function(t){return new Z(t)}}this.id=this.root.id;var n=new u(f.createAdapter(this));this.ripple=t(this.root,n);var e=this.root.querySelector(rt.strings.TAB_INDICATOR_SELECTOR);this.tabIndicator=r(e);this.content=this.root.querySelector(rt.strings.CONTENT_SELECTOR)};r.prototype.initialSyncWithDOM=function(){var t=this;this.handleClick=function(){t.foundation.handleClick()};this.listen("click",this.handleClick)};r.prototype.destroy=function(){this.unlisten("click",this.handleClick);this.ripple.destroy();t.prototype.destroy.call(this)};r.prototype.getDefaultFoundation=function(){var t=this;var r={setAttr:function(r,n){return t.root.setAttribute(r,n)},addClass:function(r){return t.root.classList.add(r)},removeClass:function(r){return t.root.classList.remove(r)},hasClass:function(r){return t.root.classList.contains(r)},activateIndicator:function(r){t.tabIndicator.activate(r)},deactivateIndicator:function(){t.tabIndicator.deactivate()},notifyInteracted:function(){return t.emit(rt.strings.INTERACTED_EVENT,{tabId:t.id},true)},getOffsetLeft:function(){return t.root.offsetLeft},getOffsetWidth:function(){return t.root.offsetWidth},getContentOffsetLeft:function(){return t.content.offsetLeft},getContentOffsetWidth:function(){return t.content.offsetWidth},focus:function(){return t.root.focus()}};return new rt(r)};Object.defineProperty(r.prototype,"active",{get:function(){return this.foundation.isActive()},enumerable:false,configurable:true});Object.defineProperty(r.prototype,"focusOnActivate",{set:function(t){this.foundation.setFocusOnActivate(t)},enumerable:false,configurable:true});r.prototype.activate=function(t){this.foundation.activate(t)};r.prototype.deactivate=function(){this.foundation.deactivate()};r.prototype.computeIndicatorClientRect=function(){return this.tabIndicator.computeContentClientRect()};r.prototype.computeDimensions=function(){return this.foundation.computeDimensions()};r.prototype.focus=function(){this.root.focus()};return r}(s);
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
 */var et={ARROW_LEFT_KEY:"ArrowLeft",ARROW_RIGHT_KEY:"ArrowRight",END_KEY:"End",ENTER_KEY:"Enter",HOME_KEY:"Home",SPACE_KEY:"Space",TAB_ACTIVATED_EVENT:"MDCTabBar:activated",TAB_SCROLLER_SELECTOR:".mdc-tab-scroller",TAB_SELECTOR:".mdc-tab"};var it={ARROW_LEFT_KEYCODE:37,ARROW_RIGHT_KEYCODE:39,END_KEYCODE:35,ENTER_KEYCODE:13,EXTRA_SCROLL_AMOUNT:20,HOME_KEYCODE:36,SPACE_KEYCODE:32};
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
 */var at=new Set;at.add(et.ARROW_LEFT_KEY);at.add(et.ARROW_RIGHT_KEY);at.add(et.END_KEY);at.add(et.HOME_KEY);at.add(et.ENTER_KEY);at.add(et.SPACE_KEY);var ot=new Map;ot.set(it.ARROW_LEFT_KEYCODE,et.ARROW_LEFT_KEY);ot.set(it.ARROW_RIGHT_KEYCODE,et.ARROW_RIGHT_KEY);ot.set(it.END_KEYCODE,et.END_KEY);ot.set(it.HOME_KEYCODE,et.HOME_KEY);ot.set(it.ENTER_KEYCODE,et.ENTER_KEY);ot.set(it.SPACE_KEYCODE,et.SPACE_KEY);var ct=function(t){C(r,t);function r(n){var e=t.call(this,T(T({},r.defaultAdapter),n))||this;e.useAutomaticActivation=false;return e}Object.defineProperty(r,"strings",{get:function(){return et},enumerable:false,configurable:true});Object.defineProperty(r,"numbers",{get:function(){return it},enumerable:false,configurable:true});Object.defineProperty(r,"defaultAdapter",{get:function(){return{scrollTo:function(){return undefined},incrementScroll:function(){return undefined},getScrollPosition:function(){return 0},getScrollContentWidth:function(){return 0},getOffsetWidth:function(){return 0},isRTL:function(){return false},setActiveTab:function(){return undefined},activateTabAtIndex:function(){return undefined},deactivateTabAtIndex:function(){return undefined},focusTabAtIndex:function(){return undefined},getTabIndicatorClientRectAtIndex:function(){return{top:0,right:0,bottom:0,left:0,width:0,height:0}},getTabDimensionsAtIndex:function(){return{rootLeft:0,rootRight:0,contentLeft:0,contentRight:0}},getPreviousActiveTabIndex:function(){return-1},getFocusedTabIndex:function(){return-1},getIndexOfTabById:function(){return-1},getTabListLength:function(){return 0},notifyTabActivated:function(){return undefined}}},enumerable:false,configurable:true});r.prototype.setUseAutomaticActivation=function(t){this.useAutomaticActivation=t};r.prototype.activateTab=function(t){var r=this.adapter.getPreviousActiveTabIndex();if(!this.indexIsInRange(t)||t===r){return}var n;if(r!==-1){this.adapter.deactivateTabAtIndex(r);n=this.adapter.getTabIndicatorClientRectAtIndex(r)}this.adapter.activateTabAtIndex(t,n);this.scrollIntoView(t);this.adapter.notifyTabActivated(t)};r.prototype.handleKeyDown=function(t){var r=this.getKeyFromEvent(t);if(r===undefined){return}if(!this.isActivationKey(r)){t.preventDefault()}if(this.useAutomaticActivation){if(this.isActivationKey(r)){return}var n=this.determineTargetFromKey(this.adapter.getPreviousActiveTabIndex(),r);this.adapter.setActiveTab(n);this.scrollIntoView(n)}else{var e=this.adapter.getFocusedTabIndex();if(this.isActivationKey(r)){this.adapter.setActiveTab(e)}else{var n=this.determineTargetFromKey(e,r);this.adapter.focusTabAtIndex(n);this.scrollIntoView(n)}}};r.prototype.handleTabInteraction=function(t){this.adapter.setActiveTab(this.adapter.getIndexOfTabById(t.detail.tabId))};r.prototype.scrollIntoView=function(t){if(!this.indexIsInRange(t)){return}if(t===0){this.adapter.scrollTo(0);return}if(t===this.adapter.getTabListLength()-1){this.adapter.scrollTo(this.adapter.getScrollContentWidth());return}if(this.isRTL()){this.scrollIntoViewImplRTL(t);return}this.scrollIntoViewImpl(t)};r.prototype.determineTargetFromKey=function(t,r){var n=this.isRTL();var e=this.adapter.getTabListLength()-1;var i=r===et.END_KEY;var a=r===et.ARROW_LEFT_KEY&&!n||r===et.ARROW_RIGHT_KEY&&n;var o=r===et.ARROW_RIGHT_KEY&&!n||r===et.ARROW_LEFT_KEY&&n;var c=t;if(i){c=e}else if(a){c-=1}else if(o){c+=1}else{c=0}if(c<0){c=e}else if(c>e){c=0}return c};r.prototype.calculateScrollIncrement=function(t,r,n,e){var i=this.adapter.getTabDimensionsAtIndex(r);var a=i.contentLeft-n-e;var o=i.contentRight-n;var c=o-it.EXTRA_SCROLL_AMOUNT;var s=a+it.EXTRA_SCROLL_AMOUNT;if(r<t){return Math.min(c,0)}return Math.max(s,0)};r.prototype.calculateScrollIncrementRTL=function(t,r,n,e,i){var a=this.adapter.getTabDimensionsAtIndex(r);var o=i-a.contentLeft-n;var c=i-a.contentRight-n-e;var s=c+it.EXTRA_SCROLL_AMOUNT;var l=o-it.EXTRA_SCROLL_AMOUNT;if(r>t){return Math.max(s,0)}return Math.min(l,0)};r.prototype.findAdjacentTabIndexClosestToEdge=function(t,r,n,e){var i=r.rootLeft-n;var a=r.rootRight-n-e;var o=i+a;var c=i<0||o<0;var s=a>0||o>0;if(c){return t-1}if(s){return t+1}return-1};r.prototype.findAdjacentTabIndexClosestToEdgeRTL=function(t,r,n,e,i){var a=i-r.rootLeft-e-n;var o=i-r.rootRight-n;var c=a+o;var s=a>0||c>0;var l=o<0||c<0;if(s){return t+1}if(l){return t-1}return-1};r.prototype.getKeyFromEvent=function(t){if(at.has(t.key)){return t.key}return ot.get(t.keyCode)};r.prototype.isActivationKey=function(t){return t===et.SPACE_KEY||t===et.ENTER_KEY};r.prototype.indexIsInRange=function(t){return t>=0&&t<this.adapter.getTabListLength()};r.prototype.isRTL=function(){return this.adapter.isRTL()};r.prototype.scrollIntoViewImpl=function(t){var r=this.adapter.getScrollPosition();var n=this.adapter.getOffsetWidth();var e=this.adapter.getTabDimensionsAtIndex(t);var i=this.findAdjacentTabIndexClosestToEdge(t,e,r,n);if(!this.indexIsInRange(i)){return}var a=this.calculateScrollIncrement(t,i,r,n);this.adapter.incrementScroll(a)};r.prototype.scrollIntoViewImplRTL=function(t){var r=this.adapter.getScrollPosition();var n=this.adapter.getOffsetWidth();var e=this.adapter.getTabDimensionsAtIndex(t);var i=this.adapter.getScrollContentWidth();var a=this.findAdjacentTabIndexClosestToEdgeRTL(t,e,r,n,i);if(!this.indexIsInRange(a)){return}var o=this.calculateScrollIncrementRTL(t,a,r,n,i);this.adapter.incrementScroll(o)};return r}(c);
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
 */var st=ct.strings;var lt=0;var ut=function(t){C(r,t);function r(){return t!==null&&t.apply(this,arguments)||this}r.attachTo=function(t){return new r(t)};Object.defineProperty(r.prototype,"focusOnActivate",{set:function(t){var r,n;try{for(var e=S(this.tabList),i=e.next();!i.done;i=e.next()){var a=i.value;a.focusOnActivate=t}}catch(t){r={error:t}}finally{try{if(i&&!i.done&&(n=e.return))n.call(e)}finally{if(r)throw r.error}}},enumerable:false,configurable:true});Object.defineProperty(r.prototype,"useAutomaticActivation",{set:function(t){this.foundation.setUseAutomaticActivation(t)},enumerable:false,configurable:true});r.prototype.initialize=function(t,r){if(t===void 0){t=function(t){return new nt(t)}}if(r===void 0){r=function(t){return new Y(t)}}this.tabList=this.instantiateTabs(t);this.tabScroller=this.instantiatetabScroller(r)};r.prototype.initialSyncWithDOM=function(){var t=this;this.handleTabInteraction=function(r){t.foundation.handleTabInteraction(r)};this.handleKeyDown=function(r){t.foundation.handleKeyDown(r)};this.listen(rt.strings.INTERACTED_EVENT,this.handleTabInteraction);this.listen("keydown",this.handleKeyDown);for(var r=0;r<this.tabList.length;r++){if(this.tabList[r].active){this.scrollIntoView(r);break}}};r.prototype.destroy=function(){var r,n;t.prototype.destroy.call(this);this.unlisten(rt.strings.INTERACTED_EVENT,this.handleTabInteraction);this.unlisten("keydown",this.handleKeyDown);try{for(var e=S(this.tabList),i=e.next();!i.done;i=e.next()){var a=i.value;a.destroy()}}catch(t){r={error:t}}finally{try{if(i&&!i.done&&(n=e.return))n.call(e)}finally{if(r)throw r.error}}if(this.tabScroller){this.tabScroller.destroy()}};r.prototype.getDefaultFoundation=function(){var t=this;var r={scrollTo:function(r){t.tabScroller.scrollTo(r)},incrementScroll:function(r){t.tabScroller.incrementScroll(r)},getScrollPosition:function(){return t.tabScroller.getScrollPosition()},getScrollContentWidth:function(){return t.tabScroller.getScrollContentWidth()},getOffsetWidth:function(){return t.root.offsetWidth},isRTL:function(){return window.getComputedStyle(t.root).getPropertyValue("direction")==="rtl"},setActiveTab:function(r){t.foundation.activateTab(r)},activateTabAtIndex:function(r,n){t.tabList[r].activate(n)},deactivateTabAtIndex:function(r){t.tabList[r].deactivate()},focusTabAtIndex:function(r){t.tabList[r].focus()},getTabIndicatorClientRectAtIndex:function(r){return t.tabList[r].computeIndicatorClientRect()},getTabDimensionsAtIndex:function(r){return t.tabList[r].computeDimensions()},getPreviousActiveTabIndex:function(){for(var r=0;r<t.tabList.length;r++){if(t.tabList[r].active){return r}}return-1},getFocusedTabIndex:function(){var r=t.getTabElements();var n=document.activeElement;return r.indexOf(n)},getIndexOfTabById:function(r){for(var n=0;n<t.tabList.length;n++){if(t.tabList[n].id===r){return n}}return-1},getTabListLength:function(){return t.tabList.length},notifyTabActivated:function(r){return t.emit(st.TAB_ACTIVATED_EVENT,{index:r},true)}};return new ct(r)};r.prototype.activateTab=function(t){this.foundation.activateTab(t)};r.prototype.scrollIntoView=function(t){this.foundation.scrollIntoView(t)};r.prototype.getTabElements=function(){return[].slice.call(this.root.querySelectorAll(st.TAB_SELECTOR))};r.prototype.instantiateTabs=function(t){return this.getTabElements().map((function(r){r.id=r.id||"mdc-tab-"+ ++lt;return t(r)}))};r.prototype.instantiatetabScroller=function(t){var r=this.root.querySelector(st.TAB_SCROLLER_SELECTOR);if(r){return t(r)}return null};return r}(s);function ft(t,r){const n=t.findIndex((t=>t.active===true));const e=[...t];if(n!==-1){e[n]=Object.assign(Object.assign({},t[n]),{active:false})}e[r]=Object.assign(Object.assign({},t[r]),{active:true});return e}const dt=":host{--mdc-theme-primary:var(\n      --lime-primary-color,\n      rgb(var(--color-teal-default))\n  );--mdc-theme-secondary:var(\n      --lime-secondary-color,\n      rgb(var(--contrast-1100))\n  );--mdc-theme-on-primary:var(\n      --lime-on-primary-color,\n      rgb(var(--contrast-100))\n  );--mdc-theme-on-secondary:var(\n      --lime-on-secondary-color,\n      rgb(var(--contrast-100))\n  );--mdc-theme-text-disabled-on-background:var(\n      --lime-text-disabled-on-background-color,\n      rgba(var(--contrast-1700), 0.38)\n  );--mdc-theme-text-primary-on-background:var(\n      --lime-text-primary-on-background-color,\n      rgba(var(--contrast-1700), 0.87)\n  );--mdc-theme-text-secondary-on-background:var(\n      --lime-text-secondary-on-background-color,\n      rgba(var(--contrast-1700), 0.54)\n  );--mdc-theme-error:var(\n      --lime-error-background-color,\n      rgb(var(--color-red-dark))\n  );--lime-error-text-color:rgb(var(--color-red-darker));--mdc-theme-surface:var(\n      --lime-surface-background-color,\n      rgb(var(--contrast-100))\n  );--mdc-theme-on-surface:var(\n      --lime-on-surface-color,\n      rgb(var(--contrast-1500))\n  )}.mdc-tab-bar{width:100%}.mdc-tab{height:48px}.mdc-tab--stacked{height:72px}.mdc-tab-scroller{overflow-y:hidden}.mdc-tab-scroller.mdc-tab-scroller--animating .mdc-tab-scroller__scroll-content{transition:250ms transform cubic-bezier(0.4, 0, 0.2, 1)}.mdc-tab-scroller__test{position:absolute;top:-9999px;width:100px;height:100px;overflow-x:scroll}.mdc-tab-scroller__scroll-area{-webkit-overflow-scrolling:touch;display:flex;overflow-x:hidden}.mdc-tab-scroller__scroll-area::-webkit-scrollbar,.mdc-tab-scroller__test::-webkit-scrollbar{display:none}.mdc-tab-scroller__scroll-area--scroll{overflow-x:scroll}.mdc-tab-scroller__scroll-content{position:relative;display:flex;flex:1 0 auto;transform:none;will-change:transform}.mdc-tab-scroller--align-start .mdc-tab-scroller__scroll-content{justify-content:flex-start}.mdc-tab-scroller--align-end .mdc-tab-scroller__scroll-content{justify-content:flex-end}.mdc-tab-scroller--align-center .mdc-tab-scroller__scroll-content{justify-content:center}.mdc-tab-scroller--animating .mdc-tab-scroller__scroll-area{-webkit-overflow-scrolling:auto}.mdc-tab-indicator .mdc-tab-indicator__content--underline{border-color:#26a69a;border-color:var(--mdc-theme-primary, #26a69a)}.mdc-tab-indicator .mdc-tab-indicator__content--icon{color:#575756;color:var(--mdc-theme-secondary, #575756)}.mdc-tab-indicator .mdc-tab-indicator__content--underline{border-top-width:2px}.mdc-tab-indicator .mdc-tab-indicator__content--icon{height:34px;font-size:34px}.mdc-tab-indicator{display:flex;position:absolute;top:0;left:0;justify-content:center;width:100%;height:100%;pointer-events:none;z-index:1}.mdc-tab-indicator__content{transform-origin:left;opacity:0}.mdc-tab-indicator__content--underline{align-self:flex-end;box-sizing:border-box;width:100%;border-top-style:solid}.mdc-tab-indicator__content--icon{align-self:center;margin:0 auto}.mdc-tab-indicator--active .mdc-tab-indicator__content{opacity:1}.mdc-tab-indicator .mdc-tab-indicator__content{transition:250ms transform cubic-bezier(0.4, 0, 0.2, 1)}.mdc-tab-indicator--no-transition .mdc-tab-indicator__content{transition:none}.mdc-tab-indicator--fade .mdc-tab-indicator__content{transition:150ms opacity linear}.mdc-tab-indicator--active.mdc-tab-indicator--fade .mdc-tab-indicator__content{transition-delay:100ms}.mdc-tab{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto, sans-serif;font-family:var(--mdc-typography-button-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:0.875rem;font-size:var(--mdc-typography-button-font-size, 0.875rem);line-height:2.25rem;line-height:var(--mdc-typography-button-line-height, 2.25rem);font-weight:500;font-weight:var(--mdc-typography-button-font-weight, 500);letter-spacing:0.0892857143em;letter-spacing:var(--mdc-typography-button-letter-spacing, 0.0892857143em);text-decoration:none;text-decoration:var(--mdc-typography-button-text-decoration, none);text-transform:none;text-transform:var(--mdc-typography-button-text-transform, none);position:relative}.mdc-tab .mdc-tab__text-label{color:rgba(0, 0, 0, 0.6)}.mdc-tab .mdc-tab__icon{color:rgba(0, 0, 0, 0.54);fill:currentColor}.mdc-tab__content{position:relative}.mdc-tab__icon{width:24px;height:24px;font-size:24px}.mdc-tab--active .mdc-tab__text-label{color:#26a69a;color:var(--mdc-theme-primary, #26a69a)}.mdc-tab--active .mdc-tab__icon{color:#26a69a;color:var(--mdc-theme-primary, #26a69a);fill:currentColor}.mdc-tab{background:none}.mdc-tab{min-width:90px;padding-right:24px;padding-left:24px;display:flex;flex:1 0 auto;justify-content:center;box-sizing:border-box;margin:0;padding-top:0;padding-bottom:0;border:none;outline:none;text-align:center;white-space:nowrap;cursor:pointer;-webkit-appearance:none;z-index:1}.mdc-tab::-moz-focus-inner{padding:0;border:0}.mdc-tab--min-width{flex:0 1 auto}.mdc-tab__content{display:flex;align-items:center;justify-content:center;height:inherit;pointer-events:none}.mdc-tab__text-label{transition:150ms color linear;display:inline-block;line-height:1;z-index:2}.mdc-tab__icon{transition:150ms color linear;z-index:2}.mdc-tab--stacked .mdc-tab__content{flex-direction:column;align-items:center;justify-content:center}.mdc-tab--stacked .mdc-tab__text-label{padding-top:6px;padding-bottom:4px}.mdc-tab--active .mdc-tab__text-label,.mdc-tab--active .mdc-tab__icon{transition-delay:100ms}.mdc-tab:not(.mdc-tab--stacked) .mdc-tab__icon+.mdc-tab__text-label{padding-left:8px;padding-right:0}[dir=rtl] .mdc-tab:not(.mdc-tab--stacked) .mdc-tab__icon+.mdc-tab__text-label,.mdc-tab:not(.mdc-tab--stacked) .mdc-tab__icon+.mdc-tab__text-label[dir=rtl]{padding-left:0;padding-right:8px;}@keyframes mdc-ripple-fg-radius-in{from{animation-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transform:translate(var(--mdc-ripple-fg-translate-start, 0)) scale(1)}to{transform:translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1))}}@keyframes mdc-ripple-fg-opacity-in{from{animation-timing-function:linear;opacity:0}to{opacity:var(--mdc-ripple-fg-opacity, 0)}}@keyframes mdc-ripple-fg-opacity-out{from{animation-timing-function:linear;opacity:var(--mdc-ripple-fg-opacity, 0)}to{opacity:0}}.mdc-tab{--mdc-ripple-fg-size:0;--mdc-ripple-left:0;--mdc-ripple-top:0;--mdc-ripple-fg-scale:1;--mdc-ripple-fg-translate-end:0;--mdc-ripple-fg-translate-start:0;-webkit-tap-highlight-color:rgba(0, 0, 0, 0)}.mdc-tab .mdc-tab__ripple::before,.mdc-tab .mdc-tab__ripple::after{position:absolute;border-radius:50%;opacity:0;pointer-events:none;content:\"\"}.mdc-tab .mdc-tab__ripple::before{transition:opacity 15ms linear, background-color 15ms linear;z-index:1;z-index:var(--mdc-ripple-z-index, 1)}.mdc-tab .mdc-tab__ripple::after{z-index:0;z-index:var(--mdc-ripple-z-index, 0)}.mdc-tab.mdc-ripple-upgraded .mdc-tab__ripple::before{transform:scale(var(--mdc-ripple-fg-scale, 1))}.mdc-tab.mdc-ripple-upgraded .mdc-tab__ripple::after{top:0;left:0;transform:scale(0);transform-origin:center center}.mdc-tab.mdc-ripple-upgraded--unbounded .mdc-tab__ripple::after{top:var(--mdc-ripple-top, 0);left:var(--mdc-ripple-left, 0)}.mdc-tab.mdc-ripple-upgraded--foreground-activation .mdc-tab__ripple::after{animation:mdc-ripple-fg-radius-in 225ms forwards, mdc-ripple-fg-opacity-in 75ms forwards}.mdc-tab.mdc-ripple-upgraded--foreground-deactivation .mdc-tab__ripple::after{animation:mdc-ripple-fg-opacity-out 150ms;transform:translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1))}.mdc-tab .mdc-tab__ripple::before,.mdc-tab .mdc-tab__ripple::after{top:calc(50% - 100%);left:calc(50% - 100%);width:200%;height:200%}.mdc-tab.mdc-ripple-upgraded .mdc-tab__ripple::after{width:var(--mdc-ripple-fg-size, 100%);height:var(--mdc-ripple-fg-size, 100%)}.mdc-tab .mdc-tab__ripple::before,.mdc-tab .mdc-tab__ripple::after{background-color:#26a69a;background-color:var(--mdc-ripple-color, var(--mdc-theme-primary, #26a69a))}.mdc-tab:hover .mdc-tab__ripple::before,.mdc-tab.mdc-ripple-surface--hover .mdc-tab__ripple::before{opacity:0.08;opacity:var(--mdc-ripple-hover-opacity, 0.08)}.mdc-tab.mdc-ripple-upgraded--background-focused .mdc-tab__ripple::before,.mdc-tab:not(.mdc-ripple-upgraded):focus .mdc-tab__ripple::before{transition-duration:75ms;opacity:0.24;opacity:var(--mdc-ripple-focus-opacity, 0.24)}.mdc-tab:not(.mdc-ripple-upgraded) .mdc-tab__ripple::after{transition:opacity 150ms linear}.mdc-tab:not(.mdc-ripple-upgraded):active .mdc-tab__ripple::after{transition-duration:75ms;opacity:0.24;opacity:var(--mdc-ripple-press-opacity, 0.24)}.mdc-tab.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.24)}.mdc-tab__ripple{position:absolute;top:0;left:0;width:100%;height:100%;overflow:hidden;will-change:transform, opacity}.scroll-fade,.scroll-button{position:absolute;transition-property:transform;transition-duration:0.3s;transition-timing-function:ease-out}.scroll-fade{top:0;height:100%;width:4.0625rem;pointer-events:none}.scroll-fade.left{transform:translate3d(-4.0625rem, 0, 0);left:0;background:linear-gradient(270deg, rgba(var(--contrast-300), 0) 0%, rgba(var(--contrast-300), 0.8) 40%, rgba(var(--contrast-300), 0.8) 100%)}.scroll-fade.right{transform:translate3d(4.0625rem, 0, 0);right:0;background:linear-gradient(90deg, rgba(var(--contrast-300), 0) 0%, rgba(var(--contrast-300), 0.8) 40%, rgba(var(--contrast-300), 0.8) 100%)}.scroll-button{--icon-background-color:rgb(var(--contrast-100));display:flex;align-items:center;top:0;bottom:0}.scroll-button.left{transform:translate3d(-4.0625rem, 0, 0);left:0.25rem}.scroll-button.right{transform:translate3d(4.0625rem, 0, 0);right:0.25rem}.scroll-button:hover{transform:translate3d(0, 0, 0)}.mdc-tab-scroller{position:relative;overflow:hidden}.mdc-tab-scroller.can-scroll-left .scroll-fade.left,.mdc-tab-scroller.can-scroll-left .scroll-button.left,.mdc-tab-scroller.can-scroll-right .scroll-fade.right,.mdc-tab-scroller.can-scroll-right .scroll-button.right{transform:translate3d(0, 0, 0)}.mdc-tab-scroller.can-scroll-left:not(.can-scroll-right) .scroll-button.right,.mdc-tab-scroller.can-scroll-right:not(.can-scroll-left) .scroll-button.left{opacity:0.5;transition-delay:0.5s}.lime-hide-scrollbars{scrollbar-width:none;-ms-overflow-style:none}.mdc-tab-scroller__scroll-content{padding:0.25rem 0.75rem 0 0.75rem;background-color:rgb(var(--contrast-300))}:host(limel-tab-bar){--limel-active-tab-background-color:var(\n      --tab-panel-background-color,\n      rgb(var(--contrast-100))\n  );isolation:isolate;display:block;position:relative}:host(.has-tabs-with-equal-width) .mdc-tab{flex:1 0 auto}.mdc-tab-indicator .mdc-tab-indicator__content{border:none}.mdc-tab__ripple{box-sizing:border-box;border-radius:0.625rem;border-style:solid;border-color:transparent;border-width:0.25rem;opacity:0.7}.mdc-tab__ripple:before,.mdc-tab__ripple:after{transition:background-color 0.5s ease}.mdc-tab{border-radius:0;letter-spacing:normal;padding-right:1.25rem;padding-left:1.25rem;min-width:2.5rem;background-color:transparent;flex:0 0 auto}.mdc-tab:not(.mdc-tab--active){--badge-background-color:rgb(var(--contrast-600))}.mdc-tab:not(.mdc-tab--active):after{content:\"\";display:block;background-color:rgb(var(--contrast-600));width:0.125rem;height:1rem;margin:auto;position:absolute;top:0;bottom:0;border-radius:1rem;right:-0.125rem}.mdc-tab:not(.mdc-tab--active):last-of-type:after{display:none}.mdc-tab--active{border-radius:0.625rem 0.625rem 0 0;background-color:var(--limel-active-tab-background-color);z-index:2}.mdc-tab--active:before,.mdc-tab--active:after{content:\"\";display:block;width:0.75rem;height:0.75rem;position:absolute;bottom:0;background-color:var(--limel-active-tab-background-color);-webkit-mask-image:url(\"data:image/svg+xml; utf8, <svg xmlns='http://www.w3.org/2000/svg' fill-rule='evenodd' stroke-linejoin='round' stroke-miterlimit='2' clip-rule='evenodd' viewBox='0 0 50 50'><defs/><path d='M0 0c0 27.594 22.406 50 50 50H0V0z'/></svg>\");mask-image:url(\"data:image/svg+xml; utf8, <svg xmlns='http://www.w3.org/2000/svg' fill-rule='evenodd' stroke-linejoin='round' stroke-miterlimit='2' clip-rule='evenodd' viewBox='0 0 50 50'><defs/><path d='M0 0c0 27.594 22.406 50 50 50H0V0z'/></svg>\")}.mdc-tab--active:before{left:-0.75rem;transform:rotateY(180deg)}.mdc-tab--active:after{right:-0.75rem}.mdc-tab--active .mdc-ripple-upgraded--background-focused:before{background-color:transparent;transition:background-color 1s ease}.mdc-tab__content{gap:0.375rem}.mdc-tab .mdc-tab__text-label{transition:color 0.2s ease;padding-left:0 !important;color:var(--mdc-theme-on-surface)}.mdc-tab:hover .mdc-tab__text-label{color:var(--mdc-theme-text-primary-on-background)}.mdc-tab.mdc-tab--active .mdc-tab__text-label{color:var(--mdc-theme-primary)}";const{TAB_ACTIVATED_EVENT:ht}=et;const mt=150;const bt=40;const pt=class{constructor(n){t(this,n);this.changeTab=r(this,"changeTab",7);this.setupMdc=false;this.tabs=[];this.canScrollLeft=false;this.canScrollRight=false;this.handleTabActivated=this.handleTabActivated.bind(this);this.handleScroll=this.handleScroll.bind(this);this.handleLeftScrollClick=this.handleLeftScrollClick.bind(this);this.handleRightScrollClick=this.handleRightScrollClick.bind(this);this.renderTab=this.renderTab.bind(this)}connectedCallback(){this.setup()}componentDidLoad(){this.setup()}componentDidUpdate(){if(!this.setupMdc){return}this.setup();this.setupMdc=false}disconnectedCallback(){this.tearDown()}render(){return n("div",{class:"mdc-tab-bar",role:"tablist"},n("div",{class:{"mdc-tab-scroller":true,"can-scroll-left":this.canScrollLeft,"can-scroll-right":this.canScrollRight}},n("div",{class:"mdc-tab-scroller__scroll-area lime-hide-scrollbars"},n("div",{class:"mdc-tab-scroller__scroll-content"},this.tabs.map(this.renderTab))),n("div",{class:"scroll-fade left"}),n("div",{class:"scroll-button left"},n("limel-icon-button",{icon:"angle_left",elevated:true,tabindex:"-1","aria-hidden":"true",disabled:!this.canScrollLeft,onClick:this.handleLeftScrollClick})),n("div",{class:"scroll-fade right"}),n("div",{class:"scroll-button right"},n("limel-icon-button",{icon:"angle_right",elevated:true,tabindex:"-1","aria-hidden":"true",disabled:!this.canScrollRight,onClick:this.handleRightScrollClick}))))}tabsChanged(t=[],r=[]){const n=t.map((t=>t.id));const e=r.map((t=>t.id));if(o(n,e)){return}this.setupMdc=true;this.tearDown()}handleWindowResize(){this.handleScroll()}setup(){const t=this.host.shadowRoot.querySelector(".mdc-tab-bar");if(!t){return}this.mdcTabBar=new ut(t);this.mdcTabBar.focusOnActivate=true;this.mdcTabBar.useAutomaticActivation=true;this.scrollArea=t.querySelector(".mdc-tab-scroller__scroll-area");this.scrollContent=t.querySelector(".mdc-tab-scroller__scroll-content");this.setupListeners();setTimeout(this.handleScroll,0)}tearDown(){if(this.scrollArea){this.scrollArea.removeEventListener("scroll",this.handleScroll)}if(this.mdcTabBar){this.mdcTabBar.unlisten(ht,this.handleTabActivated);this.mdcTabBar.destroy()}}setupListeners(){this.mdcTabBar.listen(ht,this.handleTabActivated);this.scrollArea.addEventListener("scroll",this.handleScroll,{passive:true})}handleTabActivated(t){const r=t.detail.index;const n=ft(this.tabs,r);x(n,this.tabs).sort(this.sortByInactive).forEach((t=>{this.changeTab.emit(t)}));this.tabs=n}sortByInactive(t,r){return Number(t.active)-Number(r.active)}handleScroll(){const t=this.scrollArea.scrollLeft;const r=Math.floor(this.scrollContent.getBoundingClientRect().width-this.scrollArea.getBoundingClientRect().width-t);if(t>bt){this.canScrollLeft=true}else{this.canScrollLeft=false}if(r>bt){this.canScrollRight=true}else{this.canScrollRight=false}}handleLeftScrollClick(){this.scrollArea.scroll({left:this.scrollArea.scrollLeft-mt,behavior:"smooth"})}handleRightScrollClick(){this.scrollArea.scroll({left:this.scrollArea.scrollLeft+mt,behavior:"smooth"})}renderIcon(t){if(!t.icon){return}const r={color:""};if(t.iconColor){r.color=t.iconColor}return n("limel-icon",{class:"mdc-tab__icon",name:t.icon,style:r,size:"small","aria-hidden":"true"})}renderTab(t){return n("button",{class:{"mdc-tab":true,"mdc-tab--active":!!t.active},role:"tab","aria-selected":t.active?"true":"false",tabindex:t.active?0:-1},n("span",{class:"mdc-tab__content"},this.renderIcon(t),n("span",{class:"mdc-tab__text-label"},t.text),t.badge?n("limel-badge",{label:t.badge}):""),n("span",{class:{"mdc-tab-indicator":true,"mdc-tab-indicator--active":!!t.active}},n("span",{class:"mdc-tab-indicator__content mdc-tab-indicator__content--underline"})),n("span",{class:"mdc-tab__ripple"}))}get host(){return e(this)}static get watchers(){return{tabs:["tabsChanged"]}}};pt.style=dt;export{pt as limel_tab_bar};
//# sourceMappingURL=limel-tab-bar.entry.js.map