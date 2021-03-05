import{_ as t,a as n,e as i,M as s,b as e}from"./component-385aa964.js";
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
 */var o,r,u,h={ANCHOR:"mdc-menu-surface--anchor",ANIMATING_CLOSED:"mdc-menu-surface--animating-closed",ANIMATING_OPEN:"mdc-menu-surface--animating-open",FIXED:"mdc-menu-surface--fixed",OPEN:"mdc-menu-surface--open",ROOT:"mdc-menu-surface"},c={CLOSED_EVENT:"MDCMenuSurface:closed",OPENED_EVENT:"MDCMenuSurface:opened",FOCUSABLE_ELEMENTS:["button:not(:disabled)",'[href]:not([aria-disabled="true"])',"input:not(:disabled)","select:not(:disabled)","textarea:not(:disabled)",'[tabindex]:not([tabindex="-1"]):not([aria-disabled="true"])'].join(", ")},f={TRANSITION_OPEN_DURATION:120,TRANSITION_CLOSE_DURATION:75,MARGIN_TO_EDGE:32,ANCHOR_TO_MENU_SURFACE_WIDTH_RATIO:.67};!function(t){t[t.BOTTOM=1]="BOTTOM",t[t.CENTER=2]="CENTER",t[t.RIGHT=4]="RIGHT",t[t.FLIP_RTL=8]="FLIP_RTL"}(r||(r={})),function(t){t[t.TOP_LEFT=0]="TOP_LEFT",t[t.TOP_RIGHT=4]="TOP_RIGHT",t[t.BOTTOM_LEFT=1]="BOTTOM_LEFT",t[t.BOTTOM_RIGHT=5]="BOTTOM_RIGHT",t[t.TOP_START=8]="TOP_START",t[t.TOP_END=12]="TOP_END",t[t.BOTTOM_START=9]="BOTTOM_START",t[t.BOTTOM_END=13]="BOTTOM_END"}(u||(u={}));
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
var a=function(s){function e(t){var i=s.call(this,n({},e.defaultAdapter,t))||this;return i.isOpen_=!1,i.isQuickOpen_=!1,i.isHoistedElement_=!1,i.isFixedPosition_=!1,i.openAnimationEndTimerId_=0,i.closeAnimationEndTimerId_=0,i.animationRequestId_=0,i.anchorCorner_=u.TOP_START,i.anchorMargin_={top:0,right:0,bottom:0,left:0},i.position_={x:0,y:0},i}return t(e,s),Object.defineProperty(e,"cssClasses",{get:function(){return h},enumerable:!0,configurable:!0}),Object.defineProperty(e,"strings",{get:function(){return c},enumerable:!0,configurable:!0}),Object.defineProperty(e,"numbers",{get:function(){return f},enumerable:!0,configurable:!0}),Object.defineProperty(e,"Corner",{get:function(){return u},enumerable:!0,configurable:!0}),Object.defineProperty(e,"defaultAdapter",{get:function(){return{addClass:function(){},removeClass:function(){},hasClass:function(){return!1},hasAnchor:function(){return!1},isElementInContainer:function(){return!1},isFocused:function(){return!1},isRtl:function(){return!1},getInnerDimensions:function(){return{height:0,width:0}},getAnchorDimensions:function(){return null},getWindowDimensions:function(){return{height:0,width:0}},getBodyDimensions:function(){return{height:0,width:0}},getWindowScroll:function(){return{x:0,y:0}},setPosition:function(){},setMaxHeight:function(){},setTransformOrigin:function(){},saveFocus:function(){},restoreFocus:function(){},notifyClose:function(){},notifyOpen:function(){}}},enumerable:!0,configurable:!0}),e.prototype.init=function(){var t=e.cssClasses,n=t.ROOT,i=t.OPEN;if(!this.adapter_.hasClass(n))throw new Error(n+" class required in root element.");this.adapter_.hasClass(i)&&(this.isOpen_=!0)},e.prototype.destroy=function(){clearTimeout(this.openAnimationEndTimerId_),clearTimeout(this.closeAnimationEndTimerId_),cancelAnimationFrame(this.animationRequestId_)},e.prototype.setAnchorCorner=function(t){this.anchorCorner_=t},e.prototype.setAnchorMargin=function(t){this.anchorMargin_.top=t.top||0,this.anchorMargin_.right=t.right||0,this.anchorMargin_.bottom=t.bottom||0,this.anchorMargin_.left=t.left||0},e.prototype.setIsHoisted=function(t){this.isHoistedElement_=t},e.prototype.setFixedPosition=function(t){this.isFixedPosition_=t},e.prototype.setAbsolutePosition=function(t,n){this.position_.x=this.isFinite_(t)?t:0,this.position_.y=this.isFinite_(n)?n:0},e.prototype.setQuickOpen=function(t){this.isQuickOpen_=t},e.prototype.isOpen=function(){return this.isOpen_},e.prototype.open=function(){var t=this;this.adapter_.saveFocus(),this.isQuickOpen_||this.adapter_.addClass(e.cssClasses.ANIMATING_OPEN),this.animationRequestId_=requestAnimationFrame((function(){t.adapter_.addClass(e.cssClasses.OPEN),t.dimensions_=t.adapter_.getInnerDimensions(),t.autoPosition_(),t.isQuickOpen_?t.adapter_.notifyOpen():t.openAnimationEndTimerId_=setTimeout((function(){t.openAnimationEndTimerId_=0,t.adapter_.removeClass(e.cssClasses.ANIMATING_OPEN),t.adapter_.notifyOpen()}),f.TRANSITION_OPEN_DURATION)})),this.isOpen_=!0},e.prototype.close=function(t){var n=this;void 0===t&&(t=!1),this.isQuickOpen_||this.adapter_.addClass(e.cssClasses.ANIMATING_CLOSED),requestAnimationFrame((function(){n.adapter_.removeClass(e.cssClasses.OPEN),n.isQuickOpen_?n.adapter_.notifyClose():n.closeAnimationEndTimerId_=setTimeout((function(){n.closeAnimationEndTimerId_=0,n.adapter_.removeClass(e.cssClasses.ANIMATING_CLOSED),n.adapter_.notifyClose()}),f.TRANSITION_CLOSE_DURATION)})),this.isOpen_=!1,t||this.maybeRestoreFocus_()},e.prototype.handleBodyClick=function(t){this.adapter_.isElementInContainer(t.target)||this.close()},e.prototype.handleKeydown=function(t){("Escape"===t.key||27===t.keyCode)&&this.close()},e.prototype.autoPosition_=function(){var t;this.measurements_=this.getAutoLayoutMeasurements_();var n=this.getOriginCorner_(),i=this.getMenuSurfaceMaxHeight_(n),s=this.hasBit_(n,r.BOTTOM)?"bottom":"top",e=this.hasBit_(n,r.RIGHT)?"right":"left",o=this.getHorizontalOriginOffset_(n),u=this.getVerticalOriginOffset_(n),h=this.measurements_,c=h.anchorSize,a=h.surfaceSize,d=((t={})[e]=o,t[s]=u,t);c.width/a.width>f.ANCHOR_TO_MENU_SURFACE_WIDTH_RATIO&&(e="center"),(this.isHoistedElement_||this.isFixedPosition_)&&this.adjustPositionForHoistedElement_(d),this.adapter_.setTransformOrigin(e+" "+s),this.adapter_.setPosition(d),this.adapter_.setMaxHeight(i?i+"px":"")},e.prototype.getAutoLayoutMeasurements_=function(){var t=this.adapter_.getAnchorDimensions(),n=this.adapter_.getBodyDimensions(),i=this.adapter_.getWindowDimensions(),s=this.adapter_.getWindowScroll();return t||(t={top:this.position_.y,right:this.position_.x,bottom:this.position_.y,left:this.position_.x,width:0,height:0}),{anchorSize:t,bodySize:n,surfaceSize:this.dimensions_,viewportDistance:{top:t.top,right:i.width-t.right,bottom:i.height-t.bottom,left:t.left},viewportSize:i,windowScroll:s}},e.prototype.getOriginCorner_=function(){var t=u.TOP_LEFT,n=this.measurements_,i=n.viewportDistance,s=n.anchorSize,e=n.surfaceSize,o=this.hasBit_(this.anchorCorner_,r.BOTTOM),h=e.height-(o?i.bottom-this.anchorMargin_.bottom:i.bottom+s.height-this.anchorMargin_.top);h>0&&e.height-(o?i.top+s.height+this.anchorMargin_.bottom:i.top+this.anchorMargin_.top)<h&&(t=this.setBit_(t,r.BOTTOM));var c=this.adapter_.isRtl(),f=this.hasBit_(this.anchorCorner_,r.FLIP_RTL),a=this.hasBit_(this.anchorCorner_,r.RIGHT),d=a&&!c||!a&&f&&c,l=e.width-(d?i.left+s.width+this.anchorMargin_.right:i.left+this.anchorMargin_.left),m=e.width-(d?i.right-this.anchorMargin_.right:i.right+s.width-this.anchorMargin_.left);return(l<0&&d&&c||a&&!d&&l<0||m>0&&l<m)&&(t=this.setBit_(t,r.RIGHT)),t},e.prototype.getMenuSurfaceMaxHeight_=function(t){var n=this.measurements_.viewportDistance,i=0,s=this.hasBit_(t,r.BOTTOM),o=this.hasBit_(this.anchorCorner_,r.BOTTOM),u=e.numbers.MARGIN_TO_EDGE;return s?(i=n.top+this.anchorMargin_.top-u,o||(i+=this.measurements_.anchorSize.height)):(i=n.bottom-this.anchorMargin_.bottom+this.measurements_.anchorSize.height-u,o&&(i-=this.measurements_.anchorSize.height)),i},e.prototype.getHorizontalOriginOffset_=function(t){var n=this.measurements_.anchorSize,i=this.hasBit_(t,r.RIGHT),s=this.hasBit_(this.anchorCorner_,r.RIGHT);if(i){var e=s?n.width-this.anchorMargin_.left:this.anchorMargin_.right;return this.isHoistedElement_||this.isFixedPosition_?e-(this.measurements_.viewportSize.width-this.measurements_.bodySize.width):e}return s?n.width-this.anchorMargin_.right:this.anchorMargin_.left},e.prototype.getVerticalOriginOffset_=function(t){var n=this.measurements_.anchorSize,i=this.hasBit_(t,r.BOTTOM),s=this.hasBit_(this.anchorCorner_,r.BOTTOM);return i?s?n.height-this.anchorMargin_.top:-this.anchorMargin_.bottom:s?n.height+this.anchorMargin_.bottom:this.anchorMargin_.top},e.prototype.adjustPositionForHoistedElement_=function(t){var n,s,e=this.measurements_,o=e.windowScroll,r=e.viewportDistance,u=Object.keys(t);try{for(var h=i(u),c=h.next();!c.done;c=h.next()){var f=c.value,a=t[f]||0;a+=r[f],this.isFixedPosition_||("top"===f?a+=o.y:"bottom"===f?a-=o.y:"left"===f?a+=o.x:a-=o.x),t[f]=a}}catch(t){n={error:t}}finally{try{c&&!c.done&&(s=h.return)&&s.call(h)}finally{if(n)throw n.error}}},e.prototype.maybeRestoreFocus_=function(){var t=this.adapter_.isFocused(),n=document.activeElement&&this.adapter_.isElementInContainer(document.activeElement);(t||n)&&this.adapter_.restoreFocus()},e.prototype.hasBit_=function(t,n){return Boolean(t&n)},e.prototype.setBit_=function(t,n){return t|n},e.prototype.isFinite_=function(t){return"number"==typeof t&&isFinite(t)},e}(s),d=function(n){function i(){return null!==n&&n.apply(this,arguments)||this}return t(i,n),i.attachTo=function(t){return new i(t)},i.prototype.initialSyncWithDOM=function(){var t=this,n=this.root_.parentElement;this.anchorElement=n&&n.classList.contains(h.ANCHOR)?n:null,this.root_.classList.contains(h.FIXED)&&this.setFixedPosition(!0),this.handleKeydown_=function(n){return t.foundation_.handleKeydown(n)},this.handleBodyClick_=function(n){return t.foundation_.handleBodyClick(n)},this.registerBodyClickListener_=function(){return document.body.addEventListener("click",t.handleBodyClick_)},this.deregisterBodyClickListener_=function(){return document.body.removeEventListener("click",t.handleBodyClick_)},this.listen("keydown",this.handleKeydown_),this.listen(c.OPENED_EVENT,this.registerBodyClickListener_),this.listen(c.CLOSED_EVENT,this.deregisterBodyClickListener_)},i.prototype.destroy=function(){this.unlisten("keydown",this.handleKeydown_),this.unlisten(c.OPENED_EVENT,this.registerBodyClickListener_),this.unlisten(c.CLOSED_EVENT,this.deregisterBodyClickListener_),n.prototype.destroy.call(this)},i.prototype.isOpen=function(){return this.foundation_.isOpen()},i.prototype.open=function(){this.foundation_.open()},i.prototype.close=function(t){void 0===t&&(t=!1),this.foundation_.close(t)},Object.defineProperty(i.prototype,"quickOpen",{set:function(t){this.foundation_.setQuickOpen(t)},enumerable:!0,configurable:!0}),i.prototype.setIsHoisted=function(t){this.foundation_.setIsHoisted(t)},i.prototype.setMenuSurfaceAnchorElement=function(t){this.anchorElement=t},i.prototype.setFixedPosition=function(t){t?this.root_.classList.add(h.FIXED):this.root_.classList.remove(h.FIXED),this.foundation_.setFixedPosition(t)},i.prototype.setAbsolutePosition=function(t,n){this.foundation_.setAbsolutePosition(t,n),this.setIsHoisted(!0)},i.prototype.setAnchorCorner=function(t){this.foundation_.setAnchorCorner(t)},i.prototype.setAnchorMargin=function(t){this.foundation_.setAnchorMargin(t)},i.prototype.getDefaultFoundation=function(){var t=this;return new a({addClass:function(n){return t.root_.classList.add(n)},removeClass:function(n){return t.root_.classList.remove(n)},hasClass:function(n){return t.root_.classList.contains(n)},hasAnchor:function(){return!!t.anchorElement},notifyClose:function(){return t.emit(a.strings.CLOSED_EVENT,{})},notifyOpen:function(){return t.emit(a.strings.OPENED_EVENT,{})},isElementInContainer:function(n){return t.root_.contains(n)},isRtl:function(){return"rtl"===getComputedStyle(t.root_).getPropertyValue("direction")},setTransformOrigin:function(n){var i=function(t,n){if(void 0===n&&(n=!1),void 0===o||n){var i=t.document.createElement("div");o="transform"in i.style?"transform":"webkitTransform"}return o}
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
 */(window)+"-origin";t.root_.style.setProperty(i,n)},isFocused:function(){return document.activeElement===t.root_},saveFocus:function(){t.previousFocus_=document.activeElement},restoreFocus:function(){t.root_.contains(document.activeElement)&&t.previousFocus_&&t.previousFocus_.focus&&t.previousFocus_.focus()},getInnerDimensions:function(){return{width:t.root_.offsetWidth,height:t.root_.offsetHeight}},getAnchorDimensions:function(){return t.anchorElement?t.anchorElement.getBoundingClientRect():null},getWindowDimensions:function(){return{width:window.innerWidth,height:window.innerHeight}},getBodyDimensions:function(){return{width:document.body.clientWidth,height:document.body.clientHeight}},getWindowScroll:function(){return{x:window.pageXOffset,y:window.pageYOffset}},setPosition:function(n){t.root_.style.left="left"in n?n.left+"px":"",t.root_.style.right="right"in n?n.right+"px":"",t.root_.style.top="top"in n?n.top+"px":"",t.root_.style.bottom="bottom"in n?n.bottom+"px":""},setMaxHeight:function(n){t.root_.style.maxHeight=n}})},i}(e);
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
 */export{u as C,d as M,a}