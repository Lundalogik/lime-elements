import{r as t,c as r,h as e,g as n}from"./index-0c4503aa.js";import{g as i,a as o}from"./get-icon-props-5a77e17e.js";import{i as a}from"./isEqual-41269c4f.js";import{_ as c,a as s,b as l,M as u,c as d,m as f,d as h}from"./ponyfill-228a9cce.js";import{a as m,M as b,b as p}from"./component-a292e03c.js";import{S as v,c as g}from"./_baseIsEqual-e1e0bf60.js";import{a as _,b as y,c as w,i as x,d as C}from"./_arrayIncludesWith-adab4647.js";import{a as T}from"./_arrayMap-e86f6dbb.js";import{b as k}from"./_nodeUtil-0ed26eea.js";import"./_Uint8Array-78ae8236.js";import"./eq-8014c26f.js";import"./_getTag-9e3dfa07.js";import"./_baseGetTag-49d0259e.js";import"./isObjectLike-38996507.js";import"./isArrayLike-0d6b018a.js";import"./isFunction-db579861.js";import"./isObject-7039fcda.js";import"./_getNative-6c8f1442.js";import"./isArray-80298bc7.js";import"./_isIndex-6de44c7b.js";import"./identity-5b806255.js";import"./_defineProperty-72aa0f12.js";var A=200;function E(t,r,e,n){var i=-1,o=_,a=true,c=t.length,s=[],l=r.length;if(!c){return s}if(e){r=T(r,k(e))}if(n){o=y;a=false}else if(r.length>=A){o=g;a=false;r=new v(r)}t:while(++i<c){var u=t[i],d=e==null?u:e(u);u=n||u!==0?u:0;if(a&&d===d){var f=l;while(f--){if(r[f]===d){continue t}}s.push(u)}else if(!o(r,d,n)){s.push(u)}}return s}var S=w((function(t,r){return x(t)?E(t,C(r,1,x,true)):[]}));
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
 */var O={ANIMATING:"mdc-tab-scroller--animating",SCROLL_AREA_SCROLL:"mdc-tab-scroller__scroll-area--scroll",SCROLL_TEST:"mdc-tab-scroller__test"};var j={AREA_SELECTOR:".mdc-tab-scroller__scroll-area",CONTENT_SELECTOR:".mdc-tab-scroller__scroll-content"};
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
 */var R=function(){function t(t){this.adapter=t}return t}();
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
 */var I=function(t){c(r,t);function r(){return t!==null&&t.apply(this,arguments)||this}r.prototype.getScrollPositionRTL=function(){var t=this.adapter.getScrollAreaScrollLeft();var r=this.calculateScrollEdges().right;return Math.round(r-t)};r.prototype.scrollToRTL=function(t){var r=this.calculateScrollEdges();var e=this.adapter.getScrollAreaScrollLeft();var n=this.clampScrollValue(r.right-t);return{finalScrollPosition:n,scrollDelta:n-e}};r.prototype.incrementScrollRTL=function(t){var r=this.adapter.getScrollAreaScrollLeft();var e=this.clampScrollValue(r-t);return{finalScrollPosition:e,scrollDelta:e-r}};r.prototype.getAnimatingScrollPosition=function(t){return t};r.prototype.calculateScrollEdges=function(){var t=this.adapter.getScrollContentOffsetWidth();var r=this.adapter.getScrollAreaOffsetWidth();return{left:0,right:t-r}};r.prototype.clampScrollValue=function(t){var r=this.calculateScrollEdges();return Math.min(Math.max(r.left,t),r.right)};return r}(R);
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
 */var L=function(t){c(r,t);function r(){return t!==null&&t.apply(this,arguments)||this}r.prototype.getScrollPositionRTL=function(t){var r=this.adapter.getScrollAreaScrollLeft();return Math.round(t-r)};r.prototype.scrollToRTL=function(t){var r=this.adapter.getScrollAreaScrollLeft();var e=this.clampScrollValue(-t);return{finalScrollPosition:e,scrollDelta:e-r}};r.prototype.incrementScrollRTL=function(t){var r=this.adapter.getScrollAreaScrollLeft();var e=this.clampScrollValue(r-t);return{finalScrollPosition:e,scrollDelta:e-r}};r.prototype.getAnimatingScrollPosition=function(t,r){return t-r};r.prototype.calculateScrollEdges=function(){var t=this.adapter.getScrollContentOffsetWidth();var r=this.adapter.getScrollAreaOffsetWidth();return{left:r-t,right:0}};r.prototype.clampScrollValue=function(t){var r=this.calculateScrollEdges();return Math.max(Math.min(r.right,t),r.left)};return r}(R);
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
 */var z=function(t){c(r,t);function r(){return t!==null&&t.apply(this,arguments)||this}r.prototype.getScrollPositionRTL=function(t){var r=this.adapter.getScrollAreaScrollLeft();return Math.round(r-t)};r.prototype.scrollToRTL=function(t){var r=this.adapter.getScrollAreaScrollLeft();var e=this.clampScrollValue(t);return{finalScrollPosition:e,scrollDelta:r-e}};r.prototype.incrementScrollRTL=function(t){var r=this.adapter.getScrollAreaScrollLeft();var e=this.clampScrollValue(r+t);return{finalScrollPosition:e,scrollDelta:r-e}};r.prototype.getAnimatingScrollPosition=function(t,r){return t+r};r.prototype.calculateScrollEdges=function(){var t=this.adapter.getScrollContentOffsetWidth();var r=this.adapter.getScrollAreaOffsetWidth();return{left:t-r,right:0}};r.prototype.clampScrollValue=function(t){var r=this.calculateScrollEdges();return Math.min(Math.max(r.right,t),r.left)};return r}(R);
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
 */var M=function(t){c(r,t);function r(e){var n=t.call(this,s(s({},r.defaultAdapter),e))||this;n.isAnimating=false;return n}Object.defineProperty(r,"cssClasses",{get:function(){return O},enumerable:false,configurable:true});Object.defineProperty(r,"strings",{get:function(){return j},enumerable:false,configurable:true});Object.defineProperty(r,"defaultAdapter",{get:function(){return{eventTargetMatchesSelector:function(){return false},addClass:function(){return undefined},removeClass:function(){return undefined},addScrollAreaClass:function(){return undefined},setScrollAreaStyleProperty:function(){return undefined},setScrollContentStyleProperty:function(){return undefined},getScrollContentStyleValue:function(){return""},setScrollAreaScrollLeft:function(){return undefined},getScrollAreaScrollLeft:function(){return 0},getScrollContentOffsetWidth:function(){return 0},getScrollAreaOffsetWidth:function(){return 0},computeScrollAreaClientRect:function(){return{top:0,right:0,bottom:0,left:0,width:0,height:0}},computeScrollContentClientRect:function(){return{top:0,right:0,bottom:0,left:0,width:0,height:0}},computeHorizontalScrollbarHeight:function(){return 0}}},enumerable:false,configurable:true});r.prototype.init=function(){var t=this.adapter.computeHorizontalScrollbarHeight();this.adapter.setScrollAreaStyleProperty("margin-bottom",-t+"px");this.adapter.addScrollAreaClass(r.cssClasses.SCROLL_AREA_SCROLL)};r.prototype.getScrollPosition=function(){if(this.isRTL()){return this.computeCurrentScrollPositionRTL()}var t=this.calculateCurrentTranslateX();var r=this.adapter.getScrollAreaScrollLeft();return r-t};r.prototype.handleInteraction=function(){if(!this.isAnimating){return}this.stopScrollAnimation()};r.prototype.handleTransitionEnd=function(t){var e=t.target;if(!this.isAnimating||!this.adapter.eventTargetMatchesSelector(e,r.strings.CONTENT_SELECTOR)){return}this.isAnimating=false;this.adapter.removeClass(r.cssClasses.ANIMATING)};r.prototype.incrementScroll=function(t){if(t===0){return}this.animate(this.getIncrementScrollOperation(t))};r.prototype.incrementScrollImmediate=function(t){if(t===0){return}var r=this.getIncrementScrollOperation(t);if(r.scrollDelta===0){return}this.stopScrollAnimation();this.adapter.setScrollAreaScrollLeft(r.finalScrollPosition)};r.prototype.scrollTo=function(t){if(this.isRTL()){this.scrollToImplRTL(t);return}this.scrollToImpl(t)};r.prototype.getRTLScroller=function(){if(!this.rtlScrollerInstance){this.rtlScrollerInstance=this.rtlScrollerFactory()}return this.rtlScrollerInstance};r.prototype.calculateCurrentTranslateX=function(){var t=this.adapter.getScrollContentStyleValue("transform");if(t==="none"){return 0}var r=/\((.+?)\)/.exec(t);if(!r){return 0}var e=r[1];var n=l(e.split(","),6),i=n[4];return parseFloat(i)};r.prototype.clampScrollValue=function(t){var r=this.calculateScrollEdges();return Math.min(Math.max(r.left,t),r.right)};r.prototype.computeCurrentScrollPositionRTL=function(){var t=this.calculateCurrentTranslateX();return this.getRTLScroller().getScrollPositionRTL(t)};r.prototype.calculateScrollEdges=function(){var t=this.adapter.getScrollContentOffsetWidth();var r=this.adapter.getScrollAreaOffsetWidth();return{left:0,right:t-r}};r.prototype.scrollToImpl=function(t){var r=this.getScrollPosition();var e=this.clampScrollValue(t);var n=e-r;this.animate({finalScrollPosition:e,scrollDelta:n})};r.prototype.scrollToImplRTL=function(t){var r=this.getRTLScroller().scrollToRTL(t);this.animate(r)};r.prototype.getIncrementScrollOperation=function(t){if(this.isRTL()){return this.getRTLScroller().incrementScrollRTL(t)}var r=this.getScrollPosition();var e=t+r;var n=this.clampScrollValue(e);var i=n-r;return{finalScrollPosition:n,scrollDelta:i}};r.prototype.animate=function(t){var e=this;if(t.scrollDelta===0){return}this.stopScrollAnimation();this.adapter.setScrollAreaScrollLeft(t.finalScrollPosition);this.adapter.setScrollContentStyleProperty("transform","translateX("+t.scrollDelta+"px)");this.adapter.computeScrollAreaClientRect();requestAnimationFrame((function(){e.adapter.addClass(r.cssClasses.ANIMATING);e.adapter.setScrollContentStyleProperty("transform","none")}));this.isAnimating=true};r.prototype.stopScrollAnimation=function(){this.isAnimating=false;var t=this.getAnimatingScrollPosition();this.adapter.removeClass(r.cssClasses.ANIMATING);this.adapter.setScrollContentStyleProperty("transform","translateX(0px)");this.adapter.setScrollAreaScrollLeft(t)};r.prototype.getAnimatingScrollPosition=function(){var t=this.calculateCurrentTranslateX();var r=this.adapter.getScrollAreaScrollLeft();if(this.isRTL()){return this.getRTLScroller().getAnimatingScrollPosition(r,t)}return r-t};r.prototype.rtlScrollerFactory=function(){var t=this.adapter.getScrollAreaScrollLeft();this.adapter.setScrollAreaScrollLeft(t-1);var r=this.adapter.getScrollAreaScrollLeft();if(r<0){this.adapter.setScrollAreaScrollLeft(t);return new L(this.adapter)}var e=this.adapter.computeScrollAreaClientRect();var n=this.adapter.computeScrollContentClientRect();var i=Math.round(n.right-e.right);this.adapter.setScrollAreaScrollLeft(t);if(i===r){return new z(this.adapter)}return new I(this.adapter)};r.prototype.isRTL=function(){return this.adapter.getScrollContentStyleValue("direction")==="rtl"};return r}(u);
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
 */var D;function N(t,r){if(r===void 0){r=true}if(r&&typeof D!=="undefined"){return D}var e=t.createElement("div");e.classList.add(O.SCROLL_TEST);t.body.appendChild(e);var n=e.offsetHeight-e.clientHeight;t.body.removeChild(e);if(r){D=n}return n}
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
 */var P=function(t){c(r,t);function r(){return t!==null&&t.apply(this,arguments)||this}r.attachTo=function(t){return new r(t)};r.prototype.initialize=function(){this.area=this.root.querySelector(M.strings.AREA_SELECTOR);this.content=this.root.querySelector(M.strings.CONTENT_SELECTOR)};r.prototype.initialSyncWithDOM=function(){var t=this;this.handleInteraction=function(){t.foundation.handleInteraction()};this.handleTransitionEnd=function(r){t.foundation.handleTransitionEnd(r)};this.area.addEventListener("wheel",this.handleInteraction,m());this.area.addEventListener("touchstart",this.handleInteraction,m());this.area.addEventListener("pointerdown",this.handleInteraction,m());this.area.addEventListener("mousedown",this.handleInteraction,m());this.area.addEventListener("keydown",this.handleInteraction,m());this.content.addEventListener("transitionend",this.handleTransitionEnd)};r.prototype.destroy=function(){t.prototype.destroy.call(this);this.area.removeEventListener("wheel",this.handleInteraction,m());this.area.removeEventListener("touchstart",this.handleInteraction,m());this.area.removeEventListener("pointerdown",this.handleInteraction,m());this.area.removeEventListener("mousedown",this.handleInteraction,m());this.area.removeEventListener("keydown",this.handleInteraction,m());this.content.removeEventListener("transitionend",this.handleTransitionEnd)};r.prototype.getDefaultFoundation=function(){var t=this;var r={eventTargetMatchesSelector:function(t,r){return f(t,r)},addClass:function(r){t.root.classList.add(r)},removeClass:function(r){t.root.classList.remove(r)},addScrollAreaClass:function(r){t.area.classList.add(r)},setScrollAreaStyleProperty:function(r,e){t.area.style.setProperty(r,e)},setScrollContentStyleProperty:function(r,e){t.content.style.setProperty(r,e)},getScrollContentStyleValue:function(r){return window.getComputedStyle(t.content).getPropertyValue(r)},setScrollAreaScrollLeft:function(r){return t.area.scrollLeft=r},getScrollAreaScrollLeft:function(){return t.area.scrollLeft},getScrollContentOffsetWidth:function(){return t.content.offsetWidth},getScrollAreaOffsetWidth:function(){return t.area.offsetWidth},computeScrollAreaClientRect:function(){return t.area.getBoundingClientRect()},computeScrollContentClientRect:function(){return t.content.getBoundingClientRect()},computeHorizontalScrollbarHeight:function(){return N(document)}};return new M(r)};r.prototype.getScrollPosition=function(){return this.foundation.getScrollPosition()};r.prototype.getScrollContentWidth=function(){return this.content.offsetWidth};r.prototype.incrementScroll=function(t){this.foundation.incrementScroll(t)};r.prototype.scrollTo=function(t){this.foundation.scrollTo(t)};return r}(d);
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
 */var W={ACTIVE:"mdc-tab-indicator--active",FADE:"mdc-tab-indicator--fade",NO_TRANSITION:"mdc-tab-indicator--no-transition"};var Y={CONTENT_SELECTOR:".mdc-tab-indicator__content"};
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
 */var B=function(t){c(r,t);function r(e){return t.call(this,s(s({},r.defaultAdapter),e))||this}Object.defineProperty(r,"cssClasses",{get:function(){return W},enumerable:false,configurable:true});Object.defineProperty(r,"strings",{get:function(){return Y},enumerable:false,configurable:true});Object.defineProperty(r,"defaultAdapter",{get:function(){return{addClass:function(){return undefined},removeClass:function(){return undefined},computeContentClientRect:function(){return{top:0,right:0,bottom:0,left:0,width:0,height:0}},setContentStyleProperty:function(){return undefined}}},enumerable:false,configurable:true});r.prototype.computeContentClientRect=function(){return this.adapter.computeContentClientRect()};return r}(u);
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
 */var K=function(t){c(r,t);function r(){return t!==null&&t.apply(this,arguments)||this}r.prototype.activate=function(){this.adapter.addClass(B.cssClasses.ACTIVE)};r.prototype.deactivate=function(){this.adapter.removeClass(B.cssClasses.ACTIVE)};return r}(B);
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
 */var H=function(t){c(r,t);function r(){return t!==null&&t.apply(this,arguments)||this}r.prototype.activate=function(t){if(!t){this.adapter.addClass(B.cssClasses.ACTIVE);return}var r=this.computeContentClientRect();var e=t.width/r.width;var n=t.left-r.left;this.adapter.addClass(B.cssClasses.NO_TRANSITION);this.adapter.setContentStyleProperty("transform","translateX("+n+"px) scaleX("+e+")");this.computeContentClientRect();this.adapter.removeClass(B.cssClasses.NO_TRANSITION);this.adapter.addClass(B.cssClasses.ACTIVE);this.adapter.setContentStyleProperty("transform","")};r.prototype.deactivate=function(){this.adapter.removeClass(B.cssClasses.ACTIVE)};return r}(B);
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
 */var V=function(t){c(r,t);function r(){return t!==null&&t.apply(this,arguments)||this}r.attachTo=function(t){return new r(t)};r.prototype.initialize=function(){this.content=this.root.querySelector(B.strings.CONTENT_SELECTOR)};r.prototype.computeContentClientRect=function(){return this.foundation.computeContentClientRect()};r.prototype.getDefaultFoundation=function(){var t=this;var r={addClass:function(r){return t.root.classList.add(r)},removeClass:function(r){return t.root.classList.remove(r)},computeContentClientRect:function(){return t.content.getBoundingClientRect()},setContentStyleProperty:function(r,e){t.content.style.setProperty(r,e)}};if(this.root.classList.contains(B.cssClasses.FADE)){return new K(r)}return new H(r)};r.prototype.activate=function(t){this.foundation.activate(t)};r.prototype.deactivate=function(){this.foundation.deactivate()};return r}(d);
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
 */var F={ACTIVE:"mdc-tab--active"};var U={ARIA_SELECTED:"aria-selected",CONTENT_SELECTOR:".mdc-tab__content",INTERACTED_EVENT:"MDCTab:interacted",RIPPLE_SELECTOR:".mdc-tab__ripple",TABINDEX:"tabIndex",TAB_INDICATOR_SELECTOR:".mdc-tab-indicator"};
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
 */var X=function(t){c(r,t);function r(e){var n=t.call(this,s(s({},r.defaultAdapter),e))||this;n.focusOnActivate=true;return n}Object.defineProperty(r,"cssClasses",{get:function(){return F},enumerable:false,configurable:true});Object.defineProperty(r,"strings",{get:function(){return U},enumerable:false,configurable:true});Object.defineProperty(r,"defaultAdapter",{get:function(){return{addClass:function(){return undefined},removeClass:function(){return undefined},hasClass:function(){return false},setAttr:function(){return undefined},activateIndicator:function(){return undefined},deactivateIndicator:function(){return undefined},notifyInteracted:function(){return undefined},getOffsetLeft:function(){return 0},getOffsetWidth:function(){return 0},getContentOffsetLeft:function(){return 0},getContentOffsetWidth:function(){return 0},focus:function(){return undefined}}},enumerable:false,configurable:true});r.prototype.handleClick=function(){this.adapter.notifyInteracted()};r.prototype.isActive=function(){return this.adapter.hasClass(F.ACTIVE)};r.prototype.setFocusOnActivate=function(t){this.focusOnActivate=t};r.prototype.activate=function(t){this.adapter.addClass(F.ACTIVE);this.adapter.setAttr(U.ARIA_SELECTED,"true");this.adapter.setAttr(U.TABINDEX,"0");this.adapter.activateIndicator(t);if(this.focusOnActivate){this.adapter.focus()}};r.prototype.deactivate=function(){if(!this.isActive()){return}this.adapter.removeClass(F.ACTIVE);this.adapter.setAttr(U.ARIA_SELECTED,"false");this.adapter.setAttr(U.TABINDEX,"-1");this.adapter.deactivateIndicator()};r.prototype.computeDimensions=function(){var t=this.adapter.getOffsetWidth();var r=this.adapter.getOffsetLeft();var e=this.adapter.getContentOffsetWidth();var n=this.adapter.getContentOffsetLeft();return{contentLeft:r+n,contentRight:r+n+e,rootLeft:r,rootRight:r+t}};return r}(u);
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
 */var q=function(t){c(r,t);function r(){return t!==null&&t.apply(this,arguments)||this}r.attachTo=function(t){return new r(t)};r.prototype.initialize=function(t,r){if(t===void 0){t=function(t,r){return new p(t,r)}}if(r===void 0){r=function(t){return new V(t)}}this.id=this.root.id;var e=new b(p.createAdapter(this));this.ripple=t(this.root,e);var n=this.root.querySelector(X.strings.TAB_INDICATOR_SELECTOR);this.tabIndicator=r(n);this.content=this.root.querySelector(X.strings.CONTENT_SELECTOR)};r.prototype.initialSyncWithDOM=function(){var t=this;this.handleClick=function(){t.foundation.handleClick()};this.listen("click",this.handleClick)};r.prototype.destroy=function(){this.unlisten("click",this.handleClick);this.ripple.destroy();t.prototype.destroy.call(this)};r.prototype.getDefaultFoundation=function(){var t=this;var r={setAttr:function(r,e){return t.root.setAttribute(r,e)},addClass:function(r){return t.root.classList.add(r)},removeClass:function(r){return t.root.classList.remove(r)},hasClass:function(r){return t.root.classList.contains(r)},activateIndicator:function(r){t.tabIndicator.activate(r)},deactivateIndicator:function(){t.tabIndicator.deactivate()},notifyInteracted:function(){return t.emit(X.strings.INTERACTED_EVENT,{tabId:t.id},true)},getOffsetLeft:function(){return t.root.offsetLeft},getOffsetWidth:function(){return t.root.offsetWidth},getContentOffsetLeft:function(){return t.content.offsetLeft},getContentOffsetWidth:function(){return t.content.offsetWidth},focus:function(){return t.root.focus()}};return new X(r)};Object.defineProperty(r.prototype,"active",{get:function(){return this.foundation.isActive()},enumerable:false,configurable:true});Object.defineProperty(r.prototype,"focusOnActivate",{set:function(t){this.foundation.setFocusOnActivate(t)},enumerable:false,configurable:true});r.prototype.activate=function(t){this.foundation.activate(t)};r.prototype.deactivate=function(){this.foundation.deactivate()};r.prototype.computeIndicatorClientRect=function(){return this.tabIndicator.computeContentClientRect()};r.prototype.computeDimensions=function(){return this.foundation.computeDimensions()};r.prototype.focus=function(){this.root.focus()};return r}(d);
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
 */var G={ARROW_LEFT_KEY:"ArrowLeft",ARROW_RIGHT_KEY:"ArrowRight",END_KEY:"End",ENTER_KEY:"Enter",HOME_KEY:"Home",SPACE_KEY:"Space",TAB_ACTIVATED_EVENT:"MDCTabBar:activated",TAB_SCROLLER_SELECTOR:".mdc-tab-scroller",TAB_SELECTOR:".mdc-tab"};var J={ARROW_LEFT_KEYCODE:37,ARROW_RIGHT_KEYCODE:39,END_KEYCODE:35,ENTER_KEYCODE:13,EXTRA_SCROLL_AMOUNT:20,HOME_KEYCODE:36,SPACE_KEYCODE:32};
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
 */var Q=new Set;Q.add(G.ARROW_LEFT_KEY);Q.add(G.ARROW_RIGHT_KEY);Q.add(G.END_KEY);Q.add(G.HOME_KEY);Q.add(G.ENTER_KEY);Q.add(G.SPACE_KEY);var Z=new Map;Z.set(J.ARROW_LEFT_KEYCODE,G.ARROW_LEFT_KEY);Z.set(J.ARROW_RIGHT_KEYCODE,G.ARROW_RIGHT_KEY);Z.set(J.END_KEYCODE,G.END_KEY);Z.set(J.HOME_KEYCODE,G.HOME_KEY);Z.set(J.ENTER_KEYCODE,G.ENTER_KEY);Z.set(J.SPACE_KEYCODE,G.SPACE_KEY);var $=function(t){c(r,t);function r(e){var n=t.call(this,s(s({},r.defaultAdapter),e))||this;n.useAutomaticActivation=false;return n}Object.defineProperty(r,"strings",{get:function(){return G},enumerable:false,configurable:true});Object.defineProperty(r,"numbers",{get:function(){return J},enumerable:false,configurable:true});Object.defineProperty(r,"defaultAdapter",{get:function(){return{scrollTo:function(){return undefined},incrementScroll:function(){return undefined},getScrollPosition:function(){return 0},getScrollContentWidth:function(){return 0},getOffsetWidth:function(){return 0},isRTL:function(){return false},setActiveTab:function(){return undefined},activateTabAtIndex:function(){return undefined},deactivateTabAtIndex:function(){return undefined},focusTabAtIndex:function(){return undefined},getTabIndicatorClientRectAtIndex:function(){return{top:0,right:0,bottom:0,left:0,width:0,height:0}},getTabDimensionsAtIndex:function(){return{rootLeft:0,rootRight:0,contentLeft:0,contentRight:0}},getPreviousActiveTabIndex:function(){return-1},getFocusedTabIndex:function(){return-1},getIndexOfTabById:function(){return-1},getTabListLength:function(){return 0},notifyTabActivated:function(){return undefined}}},enumerable:false,configurable:true});r.prototype.setUseAutomaticActivation=function(t){this.useAutomaticActivation=t};r.prototype.activateTab=function(t){var r=this.adapter.getPreviousActiveTabIndex();if(!this.indexIsInRange(t)||t===r){return}var e;if(r!==-1){this.adapter.deactivateTabAtIndex(r);e=this.adapter.getTabIndicatorClientRectAtIndex(r)}this.adapter.activateTabAtIndex(t,e);this.scrollIntoView(t);this.adapter.notifyTabActivated(t)};r.prototype.handleKeyDown=function(t){var r=this.getKeyFromEvent(t);if(r===undefined){return}if(!this.isActivationKey(r)){t.preventDefault()}if(this.useAutomaticActivation){if(this.isActivationKey(r)){return}var e=this.determineTargetFromKey(this.adapter.getPreviousActiveTabIndex(),r);this.adapter.setActiveTab(e);this.scrollIntoView(e)}else{var n=this.adapter.getFocusedTabIndex();if(this.isActivationKey(r)){this.adapter.setActiveTab(n)}else{var e=this.determineTargetFromKey(n,r);this.adapter.focusTabAtIndex(e);this.scrollIntoView(e)}}};r.prototype.handleTabInteraction=function(t){this.adapter.setActiveTab(this.adapter.getIndexOfTabById(t.detail.tabId))};r.prototype.scrollIntoView=function(t){if(!this.indexIsInRange(t)){return}if(t===0){this.adapter.scrollTo(0);return}if(t===this.adapter.getTabListLength()-1){this.adapter.scrollTo(this.adapter.getScrollContentWidth());return}if(this.isRTL()){this.scrollIntoViewImplRTL(t);return}this.scrollIntoViewImpl(t)};r.prototype.determineTargetFromKey=function(t,r){var e=this.isRTL();var n=this.adapter.getTabListLength()-1;var i=r===G.END_KEY;var o=r===G.ARROW_LEFT_KEY&&!e||r===G.ARROW_RIGHT_KEY&&e;var a=r===G.ARROW_RIGHT_KEY&&!e||r===G.ARROW_LEFT_KEY&&e;var c=t;if(i){c=n}else if(o){c-=1}else if(a){c+=1}else{c=0}if(c<0){c=n}else if(c>n){c=0}return c};r.prototype.calculateScrollIncrement=function(t,r,e,n){var i=this.adapter.getTabDimensionsAtIndex(r);var o=i.contentLeft-e-n;var a=i.contentRight-e;var c=a-J.EXTRA_SCROLL_AMOUNT;var s=o+J.EXTRA_SCROLL_AMOUNT;if(r<t){return Math.min(c,0)}return Math.max(s,0)};r.prototype.calculateScrollIncrementRTL=function(t,r,e,n,i){var o=this.adapter.getTabDimensionsAtIndex(r);var a=i-o.contentLeft-e;var c=i-o.contentRight-e-n;var s=c+J.EXTRA_SCROLL_AMOUNT;var l=a-J.EXTRA_SCROLL_AMOUNT;if(r>t){return Math.max(s,0)}return Math.min(l,0)};r.prototype.findAdjacentTabIndexClosestToEdge=function(t,r,e,n){var i=r.rootLeft-e;var o=r.rootRight-e-n;var a=i+o;var c=i<0||a<0;var s=o>0||a>0;if(c){return t-1}if(s){return t+1}return-1};r.prototype.findAdjacentTabIndexClosestToEdgeRTL=function(t,r,e,n,i){var o=i-r.rootLeft-n-e;var a=i-r.rootRight-e;var c=o+a;var s=o>0||c>0;var l=a<0||c<0;if(s){return t+1}if(l){return t-1}return-1};r.prototype.getKeyFromEvent=function(t){if(Q.has(t.key)){return t.key}return Z.get(t.keyCode)};r.prototype.isActivationKey=function(t){return t===G.SPACE_KEY||t===G.ENTER_KEY};r.prototype.indexIsInRange=function(t){return t>=0&&t<this.adapter.getTabListLength()};r.prototype.isRTL=function(){return this.adapter.isRTL()};r.prototype.scrollIntoViewImpl=function(t){var r=this.adapter.getScrollPosition();var e=this.adapter.getOffsetWidth();var n=this.adapter.getTabDimensionsAtIndex(t);var i=this.findAdjacentTabIndexClosestToEdge(t,n,r,e);if(!this.indexIsInRange(i)){return}var o=this.calculateScrollIncrement(t,i,r,e);this.adapter.incrementScroll(o)};r.prototype.scrollIntoViewImplRTL=function(t){var r=this.adapter.getScrollPosition();var e=this.adapter.getOffsetWidth();var n=this.adapter.getTabDimensionsAtIndex(t);var i=this.adapter.getScrollContentWidth();var o=this.findAdjacentTabIndexClosestToEdgeRTL(t,n,r,e,i);if(!this.indexIsInRange(o)){return}var a=this.calculateScrollIncrementRTL(t,o,r,e,i);this.adapter.incrementScroll(a)};return r}(u);
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
 */var tt=$.strings;var rt=0;var et=function(t){c(r,t);function r(){return t!==null&&t.apply(this,arguments)||this}r.attachTo=function(t){return new r(t)};Object.defineProperty(r.prototype,"focusOnActivate",{set:function(t){var r,e;try{for(var n=h(this.tabList),i=n.next();!i.done;i=n.next()){var o=i.value;o.focusOnActivate=t}}catch(t){r={error:t}}finally{try{if(i&&!i.done&&(e=n.return))e.call(n)}finally{if(r)throw r.error}}},enumerable:false,configurable:true});Object.defineProperty(r.prototype,"useAutomaticActivation",{set:function(t){this.foundation.setUseAutomaticActivation(t)},enumerable:false,configurable:true});r.prototype.initialize=function(t,r){if(t===void 0){t=function(t){return new q(t)}}if(r===void 0){r=function(t){return new P(t)}}this.tabList=this.instantiateTabs(t);this.tabScroller=this.instantiatetabScroller(r)};r.prototype.initialSyncWithDOM=function(){var t=this;this.handleTabInteraction=function(r){t.foundation.handleTabInteraction(r)};this.handleKeyDown=function(r){t.foundation.handleKeyDown(r)};this.listen(X.strings.INTERACTED_EVENT,this.handleTabInteraction);this.listen("keydown",this.handleKeyDown);for(var r=0;r<this.tabList.length;r++){if(this.tabList[r].active){this.scrollIntoView(r);break}}};r.prototype.destroy=function(){var r,e;t.prototype.destroy.call(this);this.unlisten(X.strings.INTERACTED_EVENT,this.handleTabInteraction);this.unlisten("keydown",this.handleKeyDown);try{for(var n=h(this.tabList),i=n.next();!i.done;i=n.next()){var o=i.value;o.destroy()}}catch(t){r={error:t}}finally{try{if(i&&!i.done&&(e=n.return))e.call(n)}finally{if(r)throw r.error}}if(this.tabScroller){this.tabScroller.destroy()}};r.prototype.getDefaultFoundation=function(){var t=this;var r={scrollTo:function(r){t.tabScroller.scrollTo(r)},incrementScroll:function(r){t.tabScroller.incrementScroll(r)},getScrollPosition:function(){return t.tabScroller.getScrollPosition()},getScrollContentWidth:function(){return t.tabScroller.getScrollContentWidth()},getOffsetWidth:function(){return t.root.offsetWidth},isRTL:function(){return window.getComputedStyle(t.root).getPropertyValue("direction")==="rtl"},setActiveTab:function(r){t.foundation.activateTab(r)},activateTabAtIndex:function(r,e){t.tabList[r].activate(e)},deactivateTabAtIndex:function(r){t.tabList[r].deactivate()},focusTabAtIndex:function(r){t.tabList[r].focus()},getTabIndicatorClientRectAtIndex:function(r){return t.tabList[r].computeIndicatorClientRect()},getTabDimensionsAtIndex:function(r){return t.tabList[r].computeDimensions()},getPreviousActiveTabIndex:function(){for(var r=0;r<t.tabList.length;r++){if(t.tabList[r].active){return r}}return-1},getFocusedTabIndex:function(){var r=t.getTabElements();var e=document.activeElement;return r.indexOf(e)},getIndexOfTabById:function(r){for(var e=0;e<t.tabList.length;e++){if(t.tabList[e].id===r){return e}}return-1},getTabListLength:function(){return t.tabList.length},notifyTabActivated:function(r){return t.emit(tt.TAB_ACTIVATED_EVENT,{index:r},true)}};return new $(r)};r.prototype.activateTab=function(t){this.foundation.activateTab(t)};r.prototype.scrollIntoView=function(t){this.foundation.scrollIntoView(t)};r.prototype.getTabElements=function(){return[].slice.call(this.root.querySelectorAll(tt.TAB_SELECTOR))};r.prototype.instantiateTabs=function(t){return this.getTabElements().map((function(r){r.id=r.id||"mdc-tab-"+ ++rt;return t(r)}))};r.prototype.instantiatetabScroller=function(t){var r=this.root.querySelector(tt.TAB_SCROLLER_SELECTOR);if(r){return t(r)}return null};return r}(d);function nt(t,r){const e=t.findIndex((t=>t.active===true));const n=[...t];if(e!==-1){n[e]=Object.assign(Object.assign({},t[e]),{active:false})}n[r]=Object.assign(Object.assign({},t[r]),{active:true});return n}const it="@charset \"UTF-8\";.mdc-tab-bar{width:100%}.mdc-tab{height:48px}.mdc-tab--stacked{height:72px}.mdc-tab-scroller{overflow-y:hidden}.mdc-tab-scroller.mdc-tab-scroller--animating .mdc-tab-scroller__scroll-content{transition:250ms transform cubic-bezier(0.4, 0, 0.2, 1)}.mdc-tab-scroller__test{position:absolute;top:-9999px;width:100px;height:100px;overflow-x:scroll}.mdc-tab-scroller__scroll-area{-webkit-overflow-scrolling:touch;display:flex;overflow-x:hidden}.mdc-tab-scroller__scroll-area::-webkit-scrollbar,.mdc-tab-scroller__test::-webkit-scrollbar{display:none}.mdc-tab-scroller__scroll-area--scroll{overflow-x:scroll}.mdc-tab-scroller__scroll-content{position:relative;display:flex;flex:1 0 auto;transform:none;will-change:transform}.mdc-tab-scroller--align-start .mdc-tab-scroller__scroll-content{justify-content:flex-start}.mdc-tab-scroller--align-end .mdc-tab-scroller__scroll-content{justify-content:flex-end}.mdc-tab-scroller--align-center .mdc-tab-scroller__scroll-content{justify-content:center}.mdc-tab-scroller--animating .mdc-tab-scroller__scroll-area{-webkit-overflow-scrolling:auto}.mdc-tab-indicator .mdc-tab-indicator__content--underline{border-color:#6200ee;border-color:var(--mdc-theme-primary, #6200ee)}.mdc-tab-indicator .mdc-tab-indicator__content--icon{color:#018786;color:var(--mdc-theme-secondary, #018786)}.mdc-tab-indicator .mdc-tab-indicator__content--underline{border-top-width:2px}.mdc-tab-indicator .mdc-tab-indicator__content--icon{height:34px;font-size:34px}.mdc-tab-indicator{display:flex;position:absolute;top:0;left:0;justify-content:center;width:100%;height:100%;pointer-events:none;z-index:1}.mdc-tab-indicator__content{transform-origin:left;opacity:0}.mdc-tab-indicator__content--underline{align-self:flex-end;box-sizing:border-box;width:100%;border-top-style:solid}.mdc-tab-indicator__content--icon{align-self:center;margin:0 auto}.mdc-tab-indicator--active .mdc-tab-indicator__content{opacity:1}.mdc-tab-indicator .mdc-tab-indicator__content{transition:250ms transform cubic-bezier(0.4, 0, 0.2, 1)}.mdc-tab-indicator--no-transition .mdc-tab-indicator__content{transition:none}.mdc-tab-indicator--fade .mdc-tab-indicator__content{transition:150ms opacity linear}.mdc-tab-indicator--active.mdc-tab-indicator--fade .mdc-tab-indicator__content{transition-delay:100ms}.mdc-tab{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto, sans-serif;font-family:var(--mdc-typography-button-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:0.875rem;font-size:var(--mdc-typography-button-font-size, 0.875rem);line-height:2.25rem;line-height:var(--mdc-typography-button-line-height, 2.25rem);font-weight:500;font-weight:var(--mdc-typography-button-font-weight, 500);letter-spacing:0.0892857143em;letter-spacing:var(--mdc-typography-button-letter-spacing, 0.0892857143em);text-decoration:none;text-decoration:var(--mdc-typography-button-text-decoration, none);text-transform:uppercase;text-transform:var(--mdc-typography-button-text-transform, uppercase);position:relative}.mdc-tab .mdc-tab__text-label{color:rgba(0, 0, 0, 0.6)}.mdc-tab .mdc-tab__icon{color:rgba(0, 0, 0, 0.54);fill:currentColor}.mdc-tab__content{position:relative}.mdc-tab__icon{width:24px;height:24px;font-size:24px}.mdc-tab--active .mdc-tab__text-label{color:#6200ee;color:var(--mdc-theme-primary, #6200ee)}.mdc-tab--active .mdc-tab__icon{color:#6200ee;color:var(--mdc-theme-primary, #6200ee);fill:currentColor}.mdc-tab{background:none}.mdc-tab{min-width:90px;padding-right:24px;padding-left:24px;display:flex;flex:1 0 auto;justify-content:center;box-sizing:border-box;margin:0;padding-top:0;padding-bottom:0;border:none;outline:none;text-align:center;white-space:nowrap;cursor:pointer;-webkit-appearance:none;z-index:1}.mdc-tab::-moz-focus-inner{padding:0;border:0}.mdc-tab--min-width{flex:0 1 auto}.mdc-tab__content{display:flex;align-items:center;justify-content:center;height:inherit;pointer-events:none}.mdc-tab__text-label{transition:150ms color linear;display:inline-block;line-height:1;z-index:2}.mdc-tab__icon{transition:150ms color linear;z-index:2}.mdc-tab--stacked .mdc-tab__content{flex-direction:column;align-items:center;justify-content:center}.mdc-tab--stacked .mdc-tab__text-label{padding-top:6px;padding-bottom:4px}.mdc-tab--active .mdc-tab__text-label,.mdc-tab--active .mdc-tab__icon{transition-delay:100ms}.mdc-tab:not(.mdc-tab--stacked) .mdc-tab__icon+.mdc-tab__text-label{padding-left:8px;padding-right:0}[dir=rtl] .mdc-tab:not(.mdc-tab--stacked) .mdc-tab__icon+.mdc-tab__text-label,.mdc-tab:not(.mdc-tab--stacked) .mdc-tab__icon+.mdc-tab__text-label[dir=rtl]{padding-left:0;padding-right:8px;}@keyframes mdc-ripple-fg-radius-in{from{animation-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transform:translate(var(--mdc-ripple-fg-translate-start, 0)) scale(1)}to{transform:translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1))}}@keyframes mdc-ripple-fg-opacity-in{from{animation-timing-function:linear;opacity:0}to{opacity:var(--mdc-ripple-fg-opacity, 0)}}@keyframes mdc-ripple-fg-opacity-out{from{animation-timing-function:linear;opacity:var(--mdc-ripple-fg-opacity, 0)}to{opacity:0}}.mdc-tab{--mdc-ripple-fg-size:0;--mdc-ripple-left:0;--mdc-ripple-top:0;--mdc-ripple-fg-scale:1;--mdc-ripple-fg-translate-end:0;--mdc-ripple-fg-translate-start:0;-webkit-tap-highlight-color:rgba(0, 0, 0, 0)}.mdc-tab .mdc-tab__ripple::before,.mdc-tab .mdc-tab__ripple::after{position:absolute;border-radius:50%;opacity:0;pointer-events:none;content:\"\"}.mdc-tab .mdc-tab__ripple::before{transition:opacity 15ms linear, background-color 15ms linear;z-index:1;z-index:var(--mdc-ripple-z-index, 1)}.mdc-tab .mdc-tab__ripple::after{z-index:0;z-index:var(--mdc-ripple-z-index, 0)}.mdc-tab.mdc-ripple-upgraded .mdc-tab__ripple::before{transform:scale(var(--mdc-ripple-fg-scale, 1))}.mdc-tab.mdc-ripple-upgraded .mdc-tab__ripple::after{top:0;left:0;transform:scale(0);transform-origin:center center}.mdc-tab.mdc-ripple-upgraded--unbounded .mdc-tab__ripple::after{top:var(--mdc-ripple-top, 0);left:var(--mdc-ripple-left, 0)}.mdc-tab.mdc-ripple-upgraded--foreground-activation .mdc-tab__ripple::after{animation:mdc-ripple-fg-radius-in 225ms forwards, mdc-ripple-fg-opacity-in 75ms forwards}.mdc-tab.mdc-ripple-upgraded--foreground-deactivation .mdc-tab__ripple::after{animation:mdc-ripple-fg-opacity-out 150ms;transform:translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1))}.mdc-tab .mdc-tab__ripple::before,.mdc-tab .mdc-tab__ripple::after{top:calc(50% - 100%);left:calc(50% - 100%);width:200%;height:200%}.mdc-tab.mdc-ripple-upgraded .mdc-tab__ripple::after{width:var(--mdc-ripple-fg-size, 100%);height:var(--mdc-ripple-fg-size, 100%)}.mdc-tab .mdc-tab__ripple::before,.mdc-tab .mdc-tab__ripple::after{background-color:#6200ee;background-color:var(--mdc-ripple-color, var(--mdc-theme-primary, #6200ee))}.mdc-tab:hover .mdc-tab__ripple::before,.mdc-tab.mdc-ripple-surface--hover .mdc-tab__ripple::before{opacity:0.04;opacity:var(--mdc-ripple-hover-opacity, 0.04)}.mdc-tab.mdc-ripple-upgraded--background-focused .mdc-tab__ripple::before,.mdc-tab:not(.mdc-ripple-upgraded):focus .mdc-tab__ripple::before{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-focus-opacity, 0.12)}.mdc-tab:not(.mdc-ripple-upgraded) .mdc-tab__ripple::after{transition:opacity 150ms linear}.mdc-tab:not(.mdc-ripple-upgraded):active .mdc-tab__ripple::after{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-tab.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-tab__ripple{position:absolute;top:0;left:0;width:100%;height:100%;overflow:hidden;will-change:transform, opacity}.scroll-fade,.scroll-button{position:absolute;transition-property:transform;transition-duration:0.3s;transition-timing-function:ease-out}.scroll-fade{top:0;height:100%;width:4rem;pointer-events:none}.scroll-fade.left{transform:translate3d(-4rem, 0, 0);left:0;background:linear-gradient(270deg, rgba(var(--contrast-300), 0) 0%, rgba(var(--contrast-300), 0.8) 40%, rgba(var(--contrast-300), 0.8) 100%)}.scroll-fade.right{transform:translate3d(4rem, 0, 0);right:0;background:linear-gradient(90deg, rgba(var(--contrast-300), 0) 0%, rgba(var(--contrast-300), 0.8) 40%, rgba(var(--contrast-300), 0.8) 100%)}.scroll-button{display:flex;align-items:center;top:0;bottom:0}.scroll-button.left{transform:translate3d(-4rem, 0, 0);left:0.25rem}.scroll-button.right{transform:translate3d(4rem, 0, 0);right:0.25rem}.scroll-button:hover{transform:translate3d(0, 0, 0)}.scroll-button button{all:unset;display:flex;align-items:center;justify-content:center;width:1.25rem;height:calc(100% - (0.25rem * 2));border-radius:0.25rem}.scroll-button button:not(:disabled){transition:color var(--limel-clickable-transition-speed, 0.4s) ease, background-color var(--limel-clickable-transition-speed, 0.4s) ease, box-shadow var(--limel-clickable-transform-speed, 0.4s) ease, transform var(--limel-clickable-transform-speed, 0.4s) var(--limel-clickable-transform-timing-function, ease);cursor:pointer;color:var(--limel-theme-on-surface-color);background-color:var(--lime-elevated-surface-background-color);box-shadow:var(--button-shadow-normal)}.scroll-button button:not(:disabled):hover,.scroll-button button:not(:disabled):focus,.scroll-button button:not(:disabled):focus-visible{will-change:color, background-color, box-shadow, transform}.scroll-button button:not(:disabled):hover,.scroll-button button:not(:disabled):focus-visible{transform:translate3d(0, -0.04rem, 0);color:var(--limel-theme-on-surface-color);background-color:var(--lime-elevated-surface-background-color);box-shadow:var(--button-shadow-hovered)}.scroll-button button:not(:disabled):active{--limel-clickable-transform-timing-function:cubic-bezier(\n      0.83,\n      -0.15,\n      0.49,\n      1.16\n  );transform:translate3d(0, 0.05rem, 0);box-shadow:var(--button-shadow-pressed)}.scroll-button button:not(:disabled):hover,.scroll-button button:not(:disabled):active{--limel-clickable-transition-speed:0.2s;--limel-clickable-transform-speed:0.16s}.scroll-button limel-icon{width:1rem}.mdc-tab-scroller{position:relative;overflow:hidden}.mdc-tab-scroller.can-scroll-left .scroll-fade.left,.mdc-tab-scroller.can-scroll-left .scroll-button.left,.mdc-tab-scroller.can-scroll-right .scroll-fade.right,.mdc-tab-scroller.can-scroll-right .scroll-button.right{transform:translate3d(0, 0, 0)}.mdc-tab-scroller.can-scroll-left:not(.can-scroll-right) .scroll-button.right,.mdc-tab-scroller.can-scroll-right:not(.can-scroll-left) .scroll-button.left{opacity:0.5;transition-delay:0.5s}.lime-hide-scrollbars{scrollbar-width:none;-ms-overflow-style:none}.mdc-tab-scroller__scroll-content{padding:0.25rem 0.75rem 0 0.75rem;background-color:rgb(var(--contrast-300))}:host(limel-tab-bar){--limel-active-tab-background-color:var(\n      --tab-panel-background-color,\n      rgb(var(--contrast-100))\n  );isolation:isolate;display:block;position:relative}:host(.has-tabs-with-equal-width) .mdc-tab{flex:1 0 auto}.mdc-tab{font-family:inherit;font-weight:400;letter-spacing:normal;font-size:var(--limel-theme-default-font-size);text-transform:none}.mdc-tab-indicator .mdc-tab-indicator__content{border:none}.mdc-tab__ripple{box-sizing:border-box;border-radius:0.625rem;border-style:solid;border-color:transparent;border-width:0.25rem;opacity:0.7}.mdc-tab__ripple:before,.mdc-tab__ripple:after{transition:background-color 0.5s ease}.mdc-tab{border-radius:0;padding-right:1rem;padding-left:1rem;min-width:2.5rem;background-color:transparent;flex:0 0 auto;height:2.5rem}.mdc-tab:not(.mdc-tab--active):after{content:\"\";display:block;background-color:rgb(var(--contrast-600));width:0.125rem;height:1rem;margin:auto;position:absolute;top:0;bottom:0;border-radius:1rem;right:-0.125rem}.mdc-tab:not(.mdc-tab--active):last-of-type:after{display:none}.mdc-tab .mdc-tab__icon{color:rgb(var(--contrast-800));margin-left:-0.25rem}.mdc-tab limel-badge{margin-right:-0.25rem;box-shadow:0 0 0 1px rgb(var(--contrast-600))}.mdc-tab--active{border-radius:0.625rem 0.625rem 0 0;background-color:var(--limel-active-tab-background-color);z-index:2}.mdc-tab--active:before,.mdc-tab--active:after{content:\"\";display:block;width:0.75rem;height:0.75rem;position:absolute;bottom:0;background-color:var(--limel-active-tab-background-color);-webkit-mask-image:url(\"data:image/svg+xml; utf8, <svg xmlns='http://www.w3.org/2000/svg' fill-rule='evenodd' stroke-linejoin='round' stroke-miterlimit='2' clip-rule='evenodd' viewBox='0 0 50 50'><defs/><path d='M0 0c0 27.594 22.406 50 50 50H0V0z'/></svg>\");mask-image:url(\"data:image/svg+xml; utf8, <svg xmlns='http://www.w3.org/2000/svg' fill-rule='evenodd' stroke-linejoin='round' stroke-miterlimit='2' clip-rule='evenodd' viewBox='0 0 50 50'><defs/><path d='M0 0c0 27.594 22.406 50 50 50H0V0z'/></svg>\")}.mdc-tab--active:before{left:-0.75rem;transform:rotateY(180deg)}.mdc-tab--active:after{right:-0.75rem}.mdc-tab--active .mdc-ripple-upgraded--background-focused:before{background-color:transparent;transition:background-color 1s ease}.mdc-tab--active .mdc-tab__icon{color:var(--mdc-theme-primary)}.mdc-tab__content{gap:0.375rem}.mdc-tab .mdc-tab__text-label{transition:color 0.2s ease;padding-left:0 !important;color:var(--limel-theme-on-surface-color)}.mdc-tab:hover .mdc-tab__text-label{color:var(--limel-theme-text-primary-on-background-color)}.mdc-tab.mdc-tab--active .mdc-tab__text-label{color:var(--lime-primary-color, var(--limel-theme-primary-color))}";const{TAB_ACTIVATED_EVENT:ot}=G;const at=150;const ct=40;const st=100;const lt=20;const ut=class{constructor(e){t(this,e);this.changeTab=r(this,"changeTab",7);this.setupMdc=false;this.tabs=[];this.canScrollLeft=false;this.canScrollRight=false;this.handleTabActivated=this.handleTabActivated.bind(this);this.handleScroll=this.handleScroll.bind(this);this.handleLeftScrollClick=this.handleLeftScrollClick.bind(this);this.handleRightScrollClick=this.handleRightScrollClick.bind(this);this.renderTab=this.renderTab.bind(this)}connectedCallback(){this.setup()}componentDidLoad(){this.setup();this.triggerIconColorWarning()}componentDidUpdate(){if(!this.setupMdc){return}this.setup();this.setupMdc=false}disconnectedCallback(){this.tearDown()}render(){return e("div",{class:"mdc-tab-bar",role:"tablist"},e("div",{class:{"mdc-tab-scroller":true,"can-scroll-left":this.canScrollLeft,"can-scroll-right":this.canScrollRight}},e("div",{class:"mdc-tab-scroller__scroll-area lime-hide-scrollbars"},e("div",{class:"mdc-tab-scroller__scroll-content"},this.tabs.map(this.renderTab))),e("div",{class:"scroll-fade left"}),e("div",{class:"scroll-button left"},e("button",{type:"button",tabindex:"-1","aria-hidden":"true",disabled:!this.canScrollLeft,onClick:this.handleLeftScrollClick},e("limel-icon",{name:"angle_left"}))),e("div",{class:"scroll-fade right"}),e("div",{class:"scroll-button right"},e("button",{type:"button",tabindex:"-1","aria-hidden":"true",disabled:!this.canScrollRight,onClick:this.handleRightScrollClick},e("limel-icon",{name:"angle_right"})))))}tabsChanged(t=[],r=[]){const e=t.map((t=>t.id));const n=r.map((t=>t.id));if(a(e,n)){return}this.setupMdc=true;this.tearDown()}handleWindowResize(){if(!this.scrollArea){return}this.handleScroll()}setup(){const t=this.host.shadowRoot.querySelector(".mdc-tab-bar");if(!t){return}this.mdcTabBar=new et(t);this.mdcTabBar.focusOnActivate=true;this.mdcTabBar.useAutomaticActivation=true;this.scrollArea=t.querySelector(".mdc-tab-scroller__scroll-area");this.scrollContent=t.querySelector(".mdc-tab-scroller__scroll-content");this.setupListeners();setTimeout(this.handleScroll,0)}tearDown(){if(this.scrollArea){this.scrollArea.removeEventListener("scroll",this.handleScroll)}if(this.mdcTabBar){this.mdcTabBar.unlisten(ot,this.handleTabActivated);this.mdcTabBar.destroy()}}setupListeners(){this.mdcTabBar.listen(ot,this.handleTabActivated);this.scrollArea.addEventListener("scroll",this.handleScroll,{passive:true})}handleTabActivated(t){const r=t.detail.index;const e=nt(this.tabs,r);S(e,this.tabs).sort(this.sortByInactive).forEach((t=>{this.changeTab.emit(t)}));this.tabs=e}sortByInactive(t,r){return Number(t.active)-Number(r.active)}handleScroll(){const t=this.scrollArea.scrollLeft;const r=Math.floor(this.scrollContent.getBoundingClientRect().width-this.scrollArea.getBoundingClientRect().width-t);if(t>ct){this.canScrollLeft=true}else{this.canScrollLeft=false}if(r>ct){this.canScrollRight=true}else{this.canScrollRight=false}}handleLeftScrollClick(){const t=this.getScrollDistance();this.scrollArea.scroll({left:this.scrollArea.scrollLeft-t,behavior:"smooth"})}handleRightScrollClick(){const t=this.getScrollDistance();this.scrollArea.scroll({left:this.scrollArea.scrollLeft+t,behavior:"smooth"})}getScrollDistance(){if(!this.scrollArea){return at}const t=this.scrollArea.getBoundingClientRect().width;const r=t*(1-lt/st);return Math.max(r,at)}renderIcon(t){if(!t.icon){return}const r=i(t.icon);const n=o(t.icon,t.iconColor);const a={color:""};if(n){a.color=n}return e("limel-icon",{class:"mdc-tab__icon",name:r,style:a,size:"small","aria-hidden":"true"})}renderTab(t){return e("button",{class:{"mdc-tab":true,"mdc-tab--active":!!t.active},role:"tab","aria-selected":t.active?"true":"false",tabindex:t.active?0:-1},e("span",{class:"mdc-tab__content"},this.renderIcon(t),e("span",{class:"mdc-tab__text-label"},t.text),t.badge?e("limel-badge",{label:t.badge}):""),e("span",{class:{"mdc-tab-indicator":true,"mdc-tab-indicator--active":!!t.active}},e("span",{class:"mdc-tab-indicator__content mdc-tab-indicator__content--underline"})),e("span",{class:"mdc-tab__ripple"}))}triggerIconColorWarning(){if(this.tabs.some((t=>t.iconColor))){console.warn("The `iconColor` prop is deprecated now! Use the new `Icon` interface and instead of `iconColor: 'color-name'` write `icon {name: 'icon-name', color: 'color-name'}`.")}}get host(){return n(this)}static get watchers(){return{tabs:["tabsChanged"]}}};ut.style=it;export{ut as limel_tab_bar};
//# sourceMappingURL=limel-tab-bar.entry.js.map