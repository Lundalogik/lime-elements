System.register(["./tslib.es6-7ed43ca5.system.js","./component-3c9a5fc6.system.js","./index-7c41ffd3.system.js"],(function(t){"use strict";var e,n,i,o,r,s,a;return{setters:[function(t){e=t._;n=t.a;i=t.c},function(t){o=t.M;r=t.a},function(t){s=t.M;a=t.a}],execute:function(){t("C",void 0);
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
             */var u={ANCHOR:"mdc-menu-surface--anchor",ANIMATING_CLOSED:"mdc-menu-surface--animating-closed",ANIMATING_OPEN:"mdc-menu-surface--animating-open",FIXED:"mdc-menu-surface--fixed",OPEN:"mdc-menu-surface--open",ROOT:"mdc-menu-surface"};var c=t("s",{CLOSED_EVENT:"MDCMenuSurface:closed",OPENED_EVENT:"MDCMenuSurface:opened",FOCUSABLE_ELEMENTS:["button:not(:disabled)",'[href]:not([aria-disabled="true"])',"input:not(:disabled)","select:not(:disabled)","textarea:not(:disabled)",'[tabindex]:not([tabindex="-1"]):not([aria-disabled="true"])'].join(", ")});var l={TRANSITION_OPEN_DURATION:120,TRANSITION_CLOSE_DURATION:75,MARGIN_TO_EDGE:32,ANCHOR_TO_MENU_SURFACE_WIDTH_RATIO:.67};var h;(function(t){t[t["BOTTOM"]=1]="BOTTOM";t[t["CENTER"]=2]="CENTER";t[t["RIGHT"]=4]="RIGHT";t[t["FLIP_RTL"]=8]="FLIP_RTL"})(h||(h={}));var f;(function(t){t[t["TOP_LEFT"]=0]="TOP_LEFT";t[t["TOP_RIGHT"]=4]="TOP_RIGHT";t[t["BOTTOM_LEFT"]=1]="BOTTOM_LEFT";t[t["BOTTOM_RIGHT"]=5]="BOTTOM_RIGHT";t[t["TOP_START"]=8]="TOP_START";t[t["TOP_END"]=12]="TOP_END";t[t["BOTTOM_START"]=9]="BOTTOM_START";t[t["BOTTOM_END"]=13]="BOTTOM_END"})(f||(f=t("C",{})));
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
             */var d=function(t){e(o,t);function o(e){var i=t.call(this,n({},o.defaultAdapter,e))||this;i.isOpen_=false;i.isQuickOpen_=false;i.isHoistedElement_=false;i.isFixedPosition_=false;i.openAnimationEndTimerId_=0;i.closeAnimationEndTimerId_=0;i.animationRequestId_=0;i.anchorCorner_=f.TOP_START;i.anchorMargin_={top:0,right:0,bottom:0,left:0};i.position_={x:0,y:0};return i}Object.defineProperty(o,"cssClasses",{get:function(){return u},enumerable:true,configurable:true});Object.defineProperty(o,"strings",{get:function(){return c},enumerable:true,configurable:true});Object.defineProperty(o,"numbers",{get:function(){return l},enumerable:true,configurable:true});Object.defineProperty(o,"Corner",{get:function(){return f},enumerable:true,configurable:true});Object.defineProperty(o,"defaultAdapter",{get:function(){return{addClass:function(){return undefined},removeClass:function(){return undefined},hasClass:function(){return false},hasAnchor:function(){return false},isElementInContainer:function(){return false},isFocused:function(){return false},isFirstElementFocused:function(){return false},isLastElementFocused:function(){return false},isRtl:function(){return false},getInnerDimensions:function(){return{height:0,width:0}},getAnchorDimensions:function(){return null},getWindowDimensions:function(){return{height:0,width:0}},getBodyDimensions:function(){return{height:0,width:0}},getWindowScroll:function(){return{x:0,y:0}},setPosition:function(){return undefined},setMaxHeight:function(){return undefined},setTransformOrigin:function(){return undefined},saveFocus:function(){return undefined},restoreFocus:function(){return undefined},focusFirstElement:function(){return undefined},focusLastElement:function(){return undefined},notifyClose:function(){return undefined},notifyOpen:function(){return undefined}}},enumerable:true,configurable:true});o.prototype.init=function(){var t=o.cssClasses,e=t.ROOT,n=t.OPEN;if(!this.adapter_.hasClass(e)){throw new Error(e+" class required in root element.")}if(this.adapter_.hasClass(n)){this.isOpen_=true}};o.prototype.destroy=function(){clearTimeout(this.openAnimationEndTimerId_);clearTimeout(this.closeAnimationEndTimerId_);cancelAnimationFrame(this.animationRequestId_)};o.prototype.setAnchorCorner=function(t){this.anchorCorner_=t};o.prototype.setAnchorMargin=function(t){this.anchorMargin_.top=t.top||0;this.anchorMargin_.right=t.right||0;this.anchorMargin_.bottom=t.bottom||0;this.anchorMargin_.left=t.left||0};o.prototype.setIsHoisted=function(t){this.isHoistedElement_=t};o.prototype.setFixedPosition=function(t){this.isFixedPosition_=t};o.prototype.setAbsolutePosition=function(t,e){this.position_.x=this.isFinite_(t)?t:0;this.position_.y=this.isFinite_(e)?e:0};o.prototype.setQuickOpen=function(t){this.isQuickOpen_=t};o.prototype.isOpen=function(){return this.isOpen_};o.prototype.open=function(){var t=this;this.adapter_.saveFocus();if(!this.isQuickOpen_){this.adapter_.addClass(o.cssClasses.ANIMATING_OPEN)}this.animationRequestId_=requestAnimationFrame((function(){t.adapter_.addClass(o.cssClasses.OPEN);t.dimensions_=t.adapter_.getInnerDimensions();t.autoPosition_();if(t.isQuickOpen_){t.adapter_.notifyOpen()}else{t.openAnimationEndTimerId_=setTimeout((function(){t.openAnimationEndTimerId_=0;t.adapter_.removeClass(o.cssClasses.ANIMATING_OPEN);t.adapter_.notifyOpen()}),l.TRANSITION_OPEN_DURATION)}}));this.isOpen_=true};o.prototype.close=function(){var t=this;if(!this.isQuickOpen_){this.adapter_.addClass(o.cssClasses.ANIMATING_CLOSED)}requestAnimationFrame((function(){t.adapter_.removeClass(o.cssClasses.OPEN);if(t.isQuickOpen_){t.adapter_.notifyClose()}else{t.closeAnimationEndTimerId_=setTimeout((function(){t.closeAnimationEndTimerId_=0;t.adapter_.removeClass(o.cssClasses.ANIMATING_CLOSED);t.adapter_.notifyClose()}),l.TRANSITION_CLOSE_DURATION)}}));this.isOpen_=false;this.maybeRestoreFocus_()};o.prototype.handleBodyClick=function(t){var e=t.target;if(this.adapter_.isElementInContainer(e)){return}this.close()};o.prototype.handleKeydown=function(t){var e=t.keyCode,n=t.key,i=t.shiftKey;var o=n==="Escape"||e===27;var r=n==="Tab"||e===9;if(o){this.close()}else if(r){if(this.adapter_.isLastElementFocused()&&!i){this.adapter_.focusFirstElement();t.preventDefault()}else if(this.adapter_.isFirstElementFocused()&&i){this.adapter_.focusLastElement();t.preventDefault()}}};o.prototype.autoPosition_=function(){var t;this.measurements_=this.getAutoLayoutMeasurements_();var e=this.getOriginCorner_();var n=this.getMenuSurfaceMaxHeight_(e);var i=this.hasBit_(e,h.BOTTOM)?"bottom":"top";var o=this.hasBit_(e,h.RIGHT)?"right":"left";var r=this.getHorizontalOriginOffset_(e);var s=this.getVerticalOriginOffset_(e);var a=this.measurements_,u=a.anchorSize,c=a.surfaceSize;var f=(t={},t[o]=r,t[i]=s,t);if(u.width/c.width>l.ANCHOR_TO_MENU_SURFACE_WIDTH_RATIO){o="center"}if(this.isHoistedElement_||this.isFixedPosition_){this.adjustPositionForHoistedElement_(f)}this.adapter_.setTransformOrigin(o+" "+i);this.adapter_.setPosition(f);this.adapter_.setMaxHeight(n?n+"px":"")};o.prototype.getAutoLayoutMeasurements_=function(){var t=this.adapter_.getAnchorDimensions();var e=this.adapter_.getBodyDimensions();var n=this.adapter_.getWindowDimensions();var i=this.adapter_.getWindowScroll();if(!t){t={top:this.position_.y,right:this.position_.x,bottom:this.position_.y,left:this.position_.x,width:0,height:0}}return{anchorSize:t,bodySize:e,surfaceSize:this.dimensions_,viewportDistance:{top:t.top,right:n.width-t.right,bottom:n.height-t.bottom,left:t.left},viewportSize:n,windowScroll:i}};o.prototype.getOriginCorner_=function(){var t=f.TOP_LEFT;var e=this.measurements_,n=e.viewportDistance,i=e.anchorSize,o=e.surfaceSize;var r=this.hasBit_(this.anchorCorner_,h.BOTTOM);var s=r?n.top+i.height+this.anchorMargin_.bottom:n.top+this.anchorMargin_.top;var a=r?n.bottom-this.anchorMargin_.bottom:n.bottom+i.height-this.anchorMargin_.top;var u=o.height-s;var c=o.height-a;if(c>0&&u<c){t=this.setBit_(t,h.BOTTOM)}var l=this.adapter_.isRtl();var d=this.hasBit_(this.anchorCorner_,h.FLIP_RTL);var _=this.hasBit_(this.anchorCorner_,h.RIGHT);var m=_&&!l||!_&&d&&l;var p=m?n.left+i.width+this.anchorMargin_.right:n.left+this.anchorMargin_.left;var E=m?n.right-this.anchorMargin_.right:n.right+i.width-this.anchorMargin_.left;var T=o.width-p;var y=o.width-E;if(T<0&&m&&l||_&&!m&&T<0||y>0&&T<y){t=this.setBit_(t,h.RIGHT)}return t};o.prototype.getMenuSurfaceMaxHeight_=function(t){var e=this.measurements_.viewportDistance;var n=0;var i=this.hasBit_(t,h.BOTTOM);var r=this.hasBit_(this.anchorCorner_,h.BOTTOM);var s=o.numbers.MARGIN_TO_EDGE;if(i){n=e.top+this.anchorMargin_.top-s;if(!r){n+=this.measurements_.anchorSize.height}}else{n=e.bottom-this.anchorMargin_.bottom+this.measurements_.anchorSize.height-s;if(r){n-=this.measurements_.anchorSize.height}}return n};o.prototype.getHorizontalOriginOffset_=function(t){var e=this.measurements_.anchorSize;var n=this.hasBit_(t,h.RIGHT);var i=this.hasBit_(this.anchorCorner_,h.RIGHT);if(n){var o=i?e.width-this.anchorMargin_.left:this.anchorMargin_.right;if(this.isHoistedElement_||this.isFixedPosition_){return o-(this.measurements_.viewportSize.width-this.measurements_.bodySize.width)}return o}return i?e.width-this.anchorMargin_.right:this.anchorMargin_.left};o.prototype.getVerticalOriginOffset_=function(t){var e=this.measurements_.anchorSize;var n=this.hasBit_(t,h.BOTTOM);var i=this.hasBit_(this.anchorCorner_,h.BOTTOM);var o=0;if(n){o=i?e.height-this.anchorMargin_.top:-this.anchorMargin_.bottom}else{o=i?e.height+this.anchorMargin_.bottom:this.anchorMargin_.top}return o};o.prototype.adjustPositionForHoistedElement_=function(t){var e,n;var o=this.measurements_,r=o.windowScroll,s=o.viewportDistance;var a=Object.keys(t);try{for(var u=i(a),c=u.next();!c.done;c=u.next()){var l=c.value;var h=t[l]||0;h+=s[l];if(!this.isFixedPosition_){if(l==="top"){h+=r.y}else if(l==="bottom"){h-=r.y}else if(l==="left"){h+=r.x}else{h-=r.x}}t[l]=h}}catch(f){e={error:f}}finally{try{if(c&&!c.done&&(n=u.return))n.call(u)}finally{if(e)throw e.error}}};o.prototype.maybeRestoreFocus_=function(){var t=this.adapter_.isFocused();var e=document.activeElement&&this.adapter_.isElementInContainer(document.activeElement);if(t||e){this.adapter_.restoreFocus()}};o.prototype.hasBit_=function(t,e){return Boolean(t&e)};o.prototype.setBit_=function(t,e){return t|e};o.prototype.isFinite_=function(t){return typeof t==="number"&&isFinite(t)};return o}(o);
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
             */var _;function m(t,e){if(e===void 0){e=false}if(_===undefined||e){var n=t.document.createElement("div");_="transform"in n.style?"transform":"webkitTransform"}return _}
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
             */var p=t("a",function(t){e(n,t);function n(){return t!==null&&t.apply(this,arguments)||this}n.attachTo=function(t){return new n(t)};n.prototype.initialSyncWithDOM=function(){var t=this;var e=this.root_.parentElement;this.anchorElement=e&&e.classList.contains(u.ANCHOR)?e:null;if(this.root_.classList.contains(u.FIXED)){this.setFixedPosition(true)}this.handleKeydown_=function(e){return t.foundation_.handleKeydown(e)};this.handleBodyClick_=function(e){return t.foundation_.handleBodyClick(e)};this.registerBodyClickListener_=function(){return document.body.addEventListener("click",t.handleBodyClick_)};this.deregisterBodyClickListener_=function(){return document.body.removeEventListener("click",t.handleBodyClick_)};this.listen("keydown",this.handleKeydown_);this.listen(c.OPENED_EVENT,this.registerBodyClickListener_);this.listen(c.CLOSED_EVENT,this.deregisterBodyClickListener_)};n.prototype.destroy=function(){this.unlisten("keydown",this.handleKeydown_);this.unlisten(c.OPENED_EVENT,this.registerBodyClickListener_);this.unlisten(c.CLOSED_EVENT,this.deregisterBodyClickListener_);t.prototype.destroy.call(this)};Object.defineProperty(n.prototype,"open",{get:function(){return this.foundation_.isOpen()},set:function(t){if(t){var e=this.root_.querySelectorAll(c.FOCUSABLE_ELEMENTS);this.firstFocusableElement_=e[0];this.lastFocusableElement_=e[e.length-1];this.foundation_.open()}else{this.foundation_.close()}},enumerable:true,configurable:true});Object.defineProperty(n.prototype,"quickOpen",{set:function(t){this.foundation_.setQuickOpen(t)},enumerable:true,configurable:true});n.prototype.hoistMenuToBody=function(){document.body.appendChild(this.root_);this.setIsHoisted(true)};n.prototype.setIsHoisted=function(t){this.foundation_.setIsHoisted(t)};n.prototype.setMenuSurfaceAnchorElement=function(t){this.anchorElement=t};n.prototype.setFixedPosition=function(t){if(t){this.root_.classList.add(u.FIXED)}else{this.root_.classList.remove(u.FIXED)}this.foundation_.setFixedPosition(t)};n.prototype.setAbsolutePosition=function(t,e){this.foundation_.setAbsolutePosition(t,e);this.setIsHoisted(true)};n.prototype.setAnchorCorner=function(t){this.foundation_.setAnchorCorner(t)};n.prototype.setAnchorMargin=function(t){this.foundation_.setAnchorMargin(t)};n.prototype.getDefaultFoundation=function(){var t=this;var e={addClass:function(e){return t.root_.classList.add(e)},removeClass:function(e){return t.root_.classList.remove(e)},hasClass:function(e){return t.root_.classList.contains(e)},hasAnchor:function(){return!!t.anchorElement},notifyClose:function(){return t.emit(d.strings.CLOSED_EVENT,{})},notifyOpen:function(){return t.emit(d.strings.OPENED_EVENT,{})},isElementInContainer:function(e){return t.root_.contains(e)},isRtl:function(){return getComputedStyle(t.root_).getPropertyValue("direction")==="rtl"},setTransformOrigin:function(e){var n=m(window)+"-origin";t.root_.style.setProperty(n,e)},isFocused:function(){return document.activeElement===t.root_},saveFocus:function(){t.previousFocus_=document.activeElement},restoreFocus:function(){if(t.root_.contains(document.activeElement)){if(t.previousFocus_&&t.previousFocus_.focus){t.previousFocus_.focus()}}},isFirstElementFocused:function(){return t.firstFocusableElement_?t.firstFocusableElement_===document.activeElement:false},isLastElementFocused:function(){return t.lastFocusableElement_?t.lastFocusableElement_===document.activeElement:false},focusFirstElement:function(){return t.firstFocusableElement_&&t.firstFocusableElement_.focus&&t.firstFocusableElement_.focus()},focusLastElement:function(){return t.lastFocusableElement_&&t.lastFocusableElement_.focus&&t.lastFocusableElement_.focus()},getInnerDimensions:function(){return{width:t.root_.offsetWidth,height:t.root_.offsetHeight}},getAnchorDimensions:function(){return t.anchorElement?t.anchorElement.getBoundingClientRect():null},getWindowDimensions:function(){return{width:window.innerWidth,height:window.innerHeight}},getBodyDimensions:function(){return{width:document.body.clientWidth,height:document.body.clientHeight}},getWindowScroll:function(){return{x:window.pageXOffset,y:window.pageYOffset}},setPosition:function(e){t.root_.style.left="left"in e?e.left+"px":"";t.root_.style.right="right"in e?e.right+"px":"";t.root_.style.top="top"in e?e.top+"px":"";t.root_.style.bottom="bottom"in e?e.bottom+"px":""},setMaxHeight:function(e){t.root_.style.maxHeight=e}};return new d(e)};return n}(r));
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
             */var E={MENU_SELECTED_LIST_ITEM:"mdc-menu-item--selected",MENU_SELECTION_GROUP:"mdc-menu__selection-group",ROOT:"mdc-menu"};var T=t("b",{ARIA_SELECTED_ATTR:"aria-selected",CHECKBOX_SELECTOR:'input[type="checkbox"]',LIST_SELECTOR:".mdc-list",SELECTED_EVENT:"MDCMenu:selected"});
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
             */var y=function(t){e(i,t);function i(e){var o=t.call(this,n({},i.defaultAdapter,e))||this;o.closeAnimationEndTimerId_=0;return o}Object.defineProperty(i,"cssClasses",{get:function(){return E},enumerable:true,configurable:true});Object.defineProperty(i,"strings",{get:function(){return T},enumerable:true,configurable:true});Object.defineProperty(i,"defaultAdapter",{get:function(){return{addClassToElementAtIndex:function(){return undefined},removeClassFromElementAtIndex:function(){return undefined},addAttributeToElementAtIndex:function(){return undefined},removeAttributeFromElementAtIndex:function(){return undefined},elementContainsClass:function(){return false},closeSurface:function(){return undefined},getElementIndex:function(){return-1},getParentElement:function(){return null},getSelectedElementIndex:function(){return-1},notifySelected:function(){return undefined}}},enumerable:true,configurable:true});i.prototype.destroy=function(){if(this.closeAnimationEndTimerId_){clearTimeout(this.closeAnimationEndTimerId_)}this.adapter_.closeSurface()};i.prototype.handleKeydown=function(t){var e=t.key,n=t.keyCode;var i=e==="Tab"||n===9;if(i){this.adapter_.closeSurface()}};i.prototype.handleItemAction=function(t){var e=this;var n=this.adapter_.getElementIndex(t);if(n<0){return}this.adapter_.notifySelected({index:n});this.adapter_.closeSurface();this.closeAnimationEndTimerId_=setTimeout((function(){var i=e.getSelectionGroup_(t);if(i){e.handleSelectionGroup_(i,n)}}),d.numbers.TRANSITION_CLOSE_DURATION)};i.prototype.handleSelectionGroup_=function(t,e){var n=this.adapter_.getSelectedElementIndex(t);if(n>=0){this.adapter_.removeAttributeFromElementAtIndex(n,T.ARIA_SELECTED_ATTR);this.adapter_.removeClassFromElementAtIndex(n,E.MENU_SELECTED_LIST_ITEM)}this.adapter_.addClassToElementAtIndex(e,E.MENU_SELECTED_LIST_ITEM);this.adapter_.addAttributeToElementAtIndex(e,T.ARIA_SELECTED_ATTR,"true")};i.prototype.getSelectionGroup_=function(t){var e=this.adapter_.getParentElement(t);if(!e){return null}var n=this.adapter_.elementContainsClass(e,E.MENU_SELECTION_GROUP);while(!n&&e&&!this.adapter_.elementContainsClass(e,s.cssClasses.ROOT)){e=this.adapter_.getParentElement(e);n=e?this.adapter_.elementContainsClass(e,E.MENU_SELECTION_GROUP):false}if(n){return e}else{return null}};return i}(o);
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
             */var g=t("M",function(t){e(n,t);function n(){return t!==null&&t.apply(this,arguments)||this}n.attachTo=function(t){return new n(t)};n.prototype.initialize=function(t,e){if(t===void 0){t=function(t){return new p(t)}}if(e===void 0){e=function(t){return new a(t)}}this.menuSurfaceFactory_=t;this.listFactory_=e};n.prototype.initialSyncWithDOM=function(){var t=this;this.menuSurface_=this.menuSurfaceFactory_(this.root_);var e=this.root_.querySelector(T.LIST_SELECTOR);if(e){this.list_=this.listFactory_(e);this.list_.wrapFocus=true}else{this.list_=null}this.handleKeydown_=function(e){return t.foundation_.handleKeydown(e)};this.handleItemAction_=function(e){return t.foundation_.handleItemAction(t.items[e.detail.index])};this.afterOpenedCallback_=function(){return t.handleAfterOpened_()};this.menuSurface_.listen(d.strings.OPENED_EVENT,this.afterOpenedCallback_);this.listen("keydown",this.handleKeydown_);this.listen(s.strings.ACTION_EVENT,this.handleItemAction_)};n.prototype.destroy=function(){if(this.list_){this.list_.destroy()}this.menuSurface_.destroy();this.menuSurface_.unlisten(d.strings.OPENED_EVENT,this.afterOpenedCallback_);this.unlisten("keydown",this.handleKeydown_);this.unlisten(s.strings.ACTION_EVENT,this.handleItemAction_);t.prototype.destroy.call(this)};Object.defineProperty(n.prototype,"open",{get:function(){return this.menuSurface_.open},set:function(t){this.menuSurface_.open=t},enumerable:true,configurable:true});Object.defineProperty(n.prototype,"wrapFocus",{get:function(){return this.list_?this.list_.wrapFocus:false},set:function(t){if(this.list_){this.list_.wrapFocus=t}},enumerable:true,configurable:true});Object.defineProperty(n.prototype,"items",{get:function(){return this.list_?this.list_.listElements:[]},enumerable:true,configurable:true});Object.defineProperty(n.prototype,"quickOpen",{set:function(t){this.menuSurface_.quickOpen=t},enumerable:true,configurable:true});n.prototype.setAnchorCorner=function(t){this.menuSurface_.setAnchorCorner(t)};n.prototype.setAnchorMargin=function(t){this.menuSurface_.setAnchorMargin(t)};n.prototype.getOptionByIndex=function(t){var e=this.items;if(t<e.length){return this.items[t]}else{return null}};n.prototype.setFixedPosition=function(t){this.menuSurface_.setFixedPosition(t)};n.prototype.hoistMenuToBody=function(){this.menuSurface_.hoistMenuToBody()};n.prototype.setIsHoisted=function(t){this.menuSurface_.setIsHoisted(t)};n.prototype.setAbsolutePosition=function(t,e){this.menuSurface_.setAbsolutePosition(t,e)};n.prototype.setAnchorElement=function(t){this.menuSurface_.anchorElement=t};n.prototype.getDefaultFoundation=function(){var t=this;var e={addClassToElementAtIndex:function(e,n){var i=t.items;i[e].classList.add(n)},removeClassFromElementAtIndex:function(e,n){var i=t.items;i[e].classList.remove(n)},addAttributeToElementAtIndex:function(e,n,i){var o=t.items;o[e].setAttribute(n,i)},removeAttributeFromElementAtIndex:function(e,n){var i=t.items;i[e].removeAttribute(n)},elementContainsClass:function(t,e){return t.classList.contains(e)},closeSurface:function(){return t.open=false},getElementIndex:function(e){return t.items.indexOf(e)},getParentElement:function(t){return t.parentElement},getSelectedElementIndex:function(e){var n=e.querySelector("."+E.MENU_SELECTED_LIST_ITEM);return n?t.items.indexOf(n):-1},notifySelected:function(e){return t.emit(T.SELECTED_EVENT,{index:e.index,item:t.items[e.index]})}};return new y(e)};n.prototype.handleAfterOpened_=function(){var t=this.items;if(t.length>0){t[0].focus()}};return n}(r))}}}));