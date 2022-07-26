import{M as t,a as n}from"./component-e7f7d2a4.js";import{m as i}from"./ponyfill-30263d5e.js";
/**
 * @license
 * Copyright 2019 Google Inc.
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
 */function r(t){return void 0===t&&(t=window),!!function(t){void 0===t&&(t=window);var n=!1;try{var i={get passive(){return n=!0,!1}},r=function(){};t.document.addEventListener("test",r,i),t.document.removeEventListener("test",r,i)}catch(t){n=!1}return n}(t)&&{passive:!0}}var e=function(t,n){return(e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,n){t.__proto__=n}||function(t,n){for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(t[i]=n[i])})(t,n)};function o(t,n){if("function"!=typeof n&&null!==n)throw new TypeError("Class extends value "+String(n)+" is not a constructor or null");function i(){this.constructor=t}e(t,n),t.prototype=null===n?Object.create(n):(i.prototype=n.prototype,new i)}var s=function(){return(s=Object.assign||function(t){for(var n,i=1,r=arguments.length;i<r;i++)for(var e in n=arguments[i])Object.prototype.hasOwnProperty.call(n,e)&&(t[e]=n[e]);return t}).apply(this,arguments)};function u(t){var n="function"==typeof Symbol&&Symbol.iterator,i=n&&t[n],r=0;if(i)return i.call(t);if(t&&"number"==typeof t.length)return{next:function(){return t&&r>=t.length&&(t=void 0),{value:t&&t[r++],done:!t}}};throw new TypeError(n?"Object is not iterable.":"Symbol.iterator is not defined.")}
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
 */var c,a={BG_FOCUSED:"mdc-ripple-upgraded--background-focused",FG_ACTIVATION:"mdc-ripple-upgraded--foreground-activation",FG_DEACTIVATION:"mdc-ripple-upgraded--foreground-deactivation",ROOT:"mdc-ripple-upgraded",UNBOUNDED:"mdc-ripple-upgraded--unbounded"},f={VAR_FG_SCALE:"--mdc-ripple-fg-scale",VAR_FG_SIZE:"--mdc-ripple-fg-size",VAR_FG_TRANSLATE_END:"--mdc-ripple-fg-translate-end",VAR_FG_TRANSLATE_START:"--mdc-ripple-fg-translate-start",VAR_LEFT:"--mdc-ripple-left",VAR_TOP:"--mdc-ripple-top"},h={DEACTIVATION_TIMEOUT_MS:225,FG_DEACTIVATION_MS:150,INITIAL_ORIGIN_SCALE:.6,PADDING:10,TAP_DELAY_MS:300},d=["touchstart","pointerdown","mousedown","keydown"],l=["touchend","pointerup","mouseup","contextmenu"],v=[],m=function(t){function n(i){var r=t.call(this,s(s({},n.defaultAdapter),i))||this;return r.activationAnimationHasEnded=!1,r.activationTimer=0,r.fgDeactivationRemovalTimer=0,r.fgScale="0",r.frame={width:0,height:0},r.initialSize=0,r.layoutFrame=0,r.maxRadius=0,r.unboundedCoords={left:0,top:0},r.activationState=r.defaultActivationState(),r.activationTimerCallback=function(){r.activationAnimationHasEnded=!0,r.runDeactivationUXLogicIfReady()},r.activateHandler=function(t){r.activateImpl(t)},r.deactivateHandler=function(){r.deactivateImpl()},r.focusHandler=function(){r.handleFocus()},r.blurHandler=function(){r.handleBlur()},r.resizeHandler=function(){r.layout()},r}return o(n,t),Object.defineProperty(n,"cssClasses",{get:function(){return a},enumerable:!1,configurable:!0}),Object.defineProperty(n,"strings",{get:function(){return f},enumerable:!1,configurable:!0}),Object.defineProperty(n,"numbers",{get:function(){return h},enumerable:!1,configurable:!0}),Object.defineProperty(n,"defaultAdapter",{get:function(){return{addClass:function(){},browserSupportsCssVars:function(){return!0},computeBoundingRect:function(){return{top:0,right:0,bottom:0,left:0,width:0,height:0}},containsEventTarget:function(){return!0},deregisterDocumentInteractionHandler:function(){},deregisterInteractionHandler:function(){},deregisterResizeHandler:function(){},getWindowPageOffset:function(){return{x:0,y:0}},isSurfaceActive:function(){return!0},isSurfaceDisabled:function(){return!0},isUnbounded:function(){return!0},registerDocumentInteractionHandler:function(){},registerInteractionHandler:function(){},registerResizeHandler:function(){},removeClass:function(){},updateCssVariable:function(){}}},enumerable:!1,configurable:!0}),n.prototype.init=function(){var t=this,i=this.supportsPressRipple();if(this.registerRootHandlers(i),i){var r=n.cssClasses,e=r.ROOT,o=r.UNBOUNDED;requestAnimationFrame((function(){t.adapter.addClass(e),t.adapter.isUnbounded()&&(t.adapter.addClass(o),t.layoutInternal())}))}},n.prototype.destroy=function(){var t=this;if(this.supportsPressRipple()){this.activationTimer&&(clearTimeout(this.activationTimer),this.activationTimer=0,this.adapter.removeClass(n.cssClasses.FG_ACTIVATION)),this.fgDeactivationRemovalTimer&&(clearTimeout(this.fgDeactivationRemovalTimer),this.fgDeactivationRemovalTimer=0,this.adapter.removeClass(n.cssClasses.FG_DEACTIVATION));var i=n.cssClasses,r=i.ROOT,e=i.UNBOUNDED;requestAnimationFrame((function(){t.adapter.removeClass(r),t.adapter.removeClass(e),t.removeCssVars()}))}this.deregisterRootHandlers(),this.deregisterDeactivationHandlers()},n.prototype.activate=function(t){this.activateImpl(t)},n.prototype.deactivate=function(){this.deactivateImpl()},n.prototype.layout=function(){var t=this;this.layoutFrame&&cancelAnimationFrame(this.layoutFrame),this.layoutFrame=requestAnimationFrame((function(){t.layoutInternal(),t.layoutFrame=0}))},n.prototype.setUnbounded=function(t){var i=n.cssClasses.UNBOUNDED;t?this.adapter.addClass(i):this.adapter.removeClass(i)},n.prototype.handleFocus=function(){var t=this;requestAnimationFrame((function(){return t.adapter.addClass(n.cssClasses.BG_FOCUSED)}))},n.prototype.handleBlur=function(){var t=this;requestAnimationFrame((function(){return t.adapter.removeClass(n.cssClasses.BG_FOCUSED)}))},n.prototype.supportsPressRipple=function(){return this.adapter.browserSupportsCssVars()},n.prototype.defaultActivationState=function(){return{activationEvent:void 0,hasDeactivationUXRun:!1,isActivated:!1,isProgrammatic:!1,wasActivatedByPointer:!1,wasElementMadeActive:!1}},n.prototype.registerRootHandlers=function(t){var n,i;if(t){try{for(var r=u(d),e=r.next();!e.done;e=r.next())this.adapter.registerInteractionHandler(e.value,this.activateHandler)}catch(t){n={error:t}}finally{try{e&&!e.done&&(i=r.return)&&i.call(r)}finally{if(n)throw n.error}}this.adapter.isUnbounded()&&this.adapter.registerResizeHandler(this.resizeHandler)}this.adapter.registerInteractionHandler("focus",this.focusHandler),this.adapter.registerInteractionHandler("blur",this.blurHandler)},n.prototype.registerDeactivationHandlers=function(t){var n,i;if("keydown"===t.type)this.adapter.registerInteractionHandler("keyup",this.deactivateHandler);else try{for(var r=u(l),e=r.next();!e.done;e=r.next())this.adapter.registerDocumentInteractionHandler(e.value,this.deactivateHandler)}catch(t){n={error:t}}finally{try{e&&!e.done&&(i=r.return)&&i.call(r)}finally{if(n)throw n.error}}},n.prototype.deregisterRootHandlers=function(){var t,n;try{for(var i=u(d),r=i.next();!r.done;r=i.next())this.adapter.deregisterInteractionHandler(r.value,this.activateHandler)}catch(n){t={error:n}}finally{try{r&&!r.done&&(n=i.return)&&n.call(i)}finally{if(t)throw t.error}}this.adapter.deregisterInteractionHandler("focus",this.focusHandler),this.adapter.deregisterInteractionHandler("blur",this.blurHandler),this.adapter.isUnbounded()&&this.adapter.deregisterResizeHandler(this.resizeHandler)},n.prototype.deregisterDeactivationHandlers=function(){var t,n;this.adapter.deregisterInteractionHandler("keyup",this.deactivateHandler);try{for(var i=u(l),r=i.next();!r.done;r=i.next())this.adapter.deregisterDocumentInteractionHandler(r.value,this.deactivateHandler)}catch(n){t={error:n}}finally{try{r&&!r.done&&(n=i.return)&&n.call(i)}finally{if(t)throw t.error}}},n.prototype.removeCssVars=function(){var t=this,i=n.strings;Object.keys(i).forEach((function(n){0===n.indexOf("VAR_")&&t.adapter.updateCssVariable(i[n],null)}))},n.prototype.activateImpl=function(t){var n=this;if(!this.adapter.isSurfaceDisabled()){var i=this.activationState;if(!i.isActivated){var r=this.previousActivationEvent;r&&void 0!==t&&r.type!==t.type||(i.isActivated=!0,i.isProgrammatic=void 0===t,i.activationEvent=t,i.wasActivatedByPointer=!i.isProgrammatic&&void 0!==t&&("mousedown"===t.type||"touchstart"===t.type||"pointerdown"===t.type),void 0!==t&&v.length>0&&v.some((function(t){return n.adapter.containsEventTarget(t)}))?this.resetActivationState():(void 0!==t&&(v.push(t.target),this.registerDeactivationHandlers(t)),i.wasElementMadeActive=this.checkElementMadeActive(t),i.wasElementMadeActive&&this.animateActivation(),requestAnimationFrame((function(){v=[],i.wasElementMadeActive||void 0===t||" "!==t.key&&32!==t.keyCode||(i.wasElementMadeActive=n.checkElementMadeActive(t),i.wasElementMadeActive&&n.animateActivation()),i.wasElementMadeActive||(n.activationState=n.defaultActivationState())}))))}}},n.prototype.checkElementMadeActive=function(t){return void 0===t||"keydown"!==t.type||this.adapter.isSurfaceActive()},n.prototype.animateActivation=function(){var t=this,i=n.strings,r=i.VAR_FG_TRANSLATE_START,e=i.VAR_FG_TRANSLATE_END,o=n.cssClasses,s=o.FG_DEACTIVATION,u=o.FG_ACTIVATION,c=n.numbers.DEACTIVATION_TIMEOUT_MS;this.layoutInternal();var a="",f="";if(!this.adapter.isUnbounded()){var h=this.getFgTranslationCoordinates(),d=h.startPoint,l=h.endPoint;a=d.x+"px, "+d.y+"px",f=l.x+"px, "+l.y+"px"}this.adapter.updateCssVariable(r,a),this.adapter.updateCssVariable(e,f),clearTimeout(this.activationTimer),clearTimeout(this.fgDeactivationRemovalTimer),this.rmBoundedActivationClasses(),this.adapter.removeClass(s),this.adapter.computeBoundingRect(),this.adapter.addClass(u),this.activationTimer=setTimeout((function(){t.activationTimerCallback()}),c)},n.prototype.getFgTranslationCoordinates=function(){var t,n=this.activationState;return{startPoint:t={x:(t=n.wasActivatedByPointer?function(t,n,i){if(!t)return{x:0,y:0};var r,e,o=n.x+i.left,s=n.y+i.top;return"touchstart"===t.type?(r=t.changedTouches[0].pageX-o,e=t.changedTouches[0].pageY-s):(r=t.pageX-o,e=t.pageY-s),{x:r,y:e}}
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
 */(n.activationEvent,this.adapter.getWindowPageOffset(),this.adapter.computeBoundingRect()):{x:this.frame.width/2,y:this.frame.height/2}).x-this.initialSize/2,y:t.y-this.initialSize/2},endPoint:{x:this.frame.width/2-this.initialSize/2,y:this.frame.height/2-this.initialSize/2}}},n.prototype.runDeactivationUXLogicIfReady=function(){var t=this,i=n.cssClasses.FG_DEACTIVATION,r=this.activationState;(r.hasDeactivationUXRun||!r.isActivated)&&this.activationAnimationHasEnded&&(this.rmBoundedActivationClasses(),this.adapter.addClass(i),this.fgDeactivationRemovalTimer=setTimeout((function(){t.adapter.removeClass(i)}),h.FG_DEACTIVATION_MS))},n.prototype.rmBoundedActivationClasses=function(){this.adapter.removeClass(n.cssClasses.FG_ACTIVATION),this.activationAnimationHasEnded=!1,this.adapter.computeBoundingRect()},n.prototype.resetActivationState=function(){var t=this;this.previousActivationEvent=this.activationState.activationEvent,this.activationState=this.defaultActivationState(),setTimeout((function(){return t.previousActivationEvent=void 0}),n.numbers.TAP_DELAY_MS)},n.prototype.deactivateImpl=function(){var t=this,n=this.activationState;if(n.isActivated){var i=s({},n);n.isProgrammatic?(requestAnimationFrame((function(){t.animateDeactivation(i)})),this.resetActivationState()):(this.deregisterDeactivationHandlers(),requestAnimationFrame((function(){t.activationState.hasDeactivationUXRun=!0,t.animateDeactivation(i),t.resetActivationState()})))}},n.prototype.animateDeactivation=function(t){(t.wasActivatedByPointer||t.wasElementMadeActive)&&this.runDeactivationUXLogicIfReady()},n.prototype.layoutInternal=function(){this.frame=this.adapter.computeBoundingRect();var t=Math.max(this.frame.height,this.frame.width);this.maxRadius=this.adapter.isUnbounded()?t:Math.sqrt(Math.pow(this.frame.width,2)+Math.pow(this.frame.height,2))+n.numbers.PADDING;var i=Math.floor(t*n.numbers.INITIAL_ORIGIN_SCALE);this.initialSize=this.adapter.isUnbounded()&&i%2!=0?i-1:i,this.fgScale=""+this.maxRadius/this.initialSize,this.updateLayoutCssVars()},n.prototype.updateLayoutCssVars=function(){var t=n.strings,i=t.VAR_LEFT,r=t.VAR_TOP,e=t.VAR_FG_SCALE;this.adapter.updateCssVariable(t.VAR_FG_SIZE,this.initialSize+"px"),this.adapter.updateCssVariable(e,this.fgScale),this.adapter.isUnbounded()&&(this.unboundedCoords={left:Math.round(this.frame.width/2-this.initialSize/2),top:Math.round(this.frame.height/2-this.initialSize/2)},this.adapter.updateCssVariable(i,this.unboundedCoords.left+"px"),this.adapter.updateCssVariable(r,this.unboundedCoords.top+"px"))},n}(t),p=function(t){function n(){var n=null!==t&&t.apply(this,arguments)||this;return n.disabled=!1,n}return o(n,t),n.attachTo=function(t,i){void 0===i&&(i={isUnbounded:void 0});var r=new n(t);return void 0!==i.isUnbounded&&(r.unbounded=i.isUnbounded),r},n.createAdapter=function(t){return{addClass:function(n){return t.root.classList.add(n)},browserSupportsCssVars:function(){return function(t,n){void 0===n&&(n=!1);var i,r=window.CSS;if("boolean"==typeof c&&!n)return c;if(!r||"function"!=typeof r.supports)return!1;var e=r.supports("--css-vars","yes"),o=r.supports("(--css-vars: yes)")&&r.supports("color","#00000000");return i=e||o,n||(c=i),i}()},computeBoundingRect:function(){return t.root.getBoundingClientRect()},containsEventTarget:function(n){return t.root.contains(n)},deregisterDocumentInteractionHandler:function(t,n){return document.documentElement.removeEventListener(t,n,r())},deregisterInteractionHandler:function(n,i){return t.root.removeEventListener(n,i,r())},deregisterResizeHandler:function(t){return window.removeEventListener("resize",t)},getWindowPageOffset:function(){return{x:window.pageXOffset,y:window.pageYOffset}},isSurfaceActive:function(){return i(t.root,":active")},isSurfaceDisabled:function(){return Boolean(t.disabled)},isUnbounded:function(){return Boolean(t.unbounded)},registerDocumentInteractionHandler:function(t,n){return document.documentElement.addEventListener(t,n,r())},registerInteractionHandler:function(n,i){return t.root.addEventListener(n,i,r())},registerResizeHandler:function(t){return window.addEventListener("resize",t)},removeClass:function(n){return t.root.classList.remove(n)},updateCssVariable:function(n,i){return t.root.style.setProperty(n,i)}}},Object.defineProperty(n.prototype,"unbounded",{get:function(){return Boolean(this.isUnbounded)},set:function(t){this.isUnbounded=Boolean(t),this.setUnbounded()},enumerable:!1,configurable:!0}),n.prototype.activate=function(){this.foundation.activate()},n.prototype.deactivate=function(){this.foundation.deactivate()},n.prototype.layout=function(){this.foundation.layout()},n.prototype.getDefaultFoundation=function(){return new m(n.createAdapter(this))},n.prototype.initialSyncWithDOM=function(){this.isUnbounded="mdcRippleIsUnbounded"in this.root.dataset},n.prototype.setUnbounded=function(){this.foundation.setUnbounded(Boolean(this.isUnbounded))},n}(n);export{p as M,r as a,m as b}