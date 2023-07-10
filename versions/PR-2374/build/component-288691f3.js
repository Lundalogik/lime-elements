import{M as t,a as n}from"./component-410aad5a.js";import{a as e,M as i,b as r}from"./component-5b4ac85a.js";import{m as u}from"./ponyfill-30263d5e.js";import{M as s,a as f}from"./component-19eb6e2b.js";
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
***************************************************************************** */var o=function(t,n){o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,n){t.__proto__=n}||function(t,n){for(var e in n)if(Object.prototype.hasOwnProperty.call(n,e))t[e]=n[e]};return o(t,n)};function c(t,n){if(typeof n!=="function"&&n!==null)throw new TypeError("Class extends value "+String(n)+" is not a constructor or null");o(t,n);function e(){this.constructor=t}t.prototype=n===null?Object.create(n):(e.prototype=n.prototype,new e)}var a=function(){a=Object.assign||function t(n){for(var e,i=1,r=arguments.length;i<r;i++){e=arguments[i];for(var u in e)if(Object.prototype.hasOwnProperty.call(e,u))n[u]=e[u]}return n};return a.apply(this,arguments)};function l(t){var n=typeof Symbol==="function"&&Symbol.iterator,e=n&&t[n],i=0;if(e)return e.call(t);if(t&&typeof t.length==="number")return{next:function(){if(t&&i>=t.length)t=void 0;return{value:t&&t[i++],done:!t}}};throw new TypeError(n?"Object is not iterable.":"Symbol.iterator is not defined.")}
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
***************************************************************************** */var h=function(t,n){h=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,n){t.__proto__=n}||function(t,n){for(var e in n)if(Object.prototype.hasOwnProperty.call(n,e))t[e]=n[e]};return h(t,n)};function d(t,n){if(typeof n!=="function"&&n!==null)throw new TypeError("Class extends value "+String(n)+" is not a constructor or null");h(t,n);function e(){this.constructor=t}t.prototype=n===null?Object.create(n):(e.prototype=n.prototype,new e)}var b=function(){b=Object.assign||function t(n){for(var e,i=1,r=arguments.length;i<r;i++){e=arguments[i];for(var u in e)if(Object.prototype.hasOwnProperty.call(e,u))n[u]=e[u]}return n};return b.apply(this,arguments)};
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
 */var v={LINE_RIPPLE_ACTIVE:"mdc-line-ripple--active",LINE_RIPPLE_DEACTIVATING:"mdc-line-ripple--deactivating"};
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
 */var g=function(t){d(n,t);function n(e){var i=t.call(this,b(b({},n.defaultAdapter),e))||this;i.transitionEndHandler=function(t){i.handleTransitionEnd(t)};return i}Object.defineProperty(n,"cssClasses",{get:function(){return v},enumerable:false,configurable:true});Object.defineProperty(n,"defaultAdapter",{get:function(){return{addClass:function(){return undefined},removeClass:function(){return undefined},hasClass:function(){return false},setStyle:function(){return undefined},registerEventHandler:function(){return undefined},deregisterEventHandler:function(){return undefined}}},enumerable:false,configurable:true});n.prototype.init=function(){this.adapter.registerEventHandler("transitionend",this.transitionEndHandler)};n.prototype.destroy=function(){this.adapter.deregisterEventHandler("transitionend",this.transitionEndHandler)};n.prototype.activate=function(){this.adapter.removeClass(v.LINE_RIPPLE_DEACTIVATING);this.adapter.addClass(v.LINE_RIPPLE_ACTIVE)};n.prototype.setRippleCenter=function(t){this.adapter.setStyle("transform-origin",t+"px center")};n.prototype.deactivate=function(){this.adapter.addClass(v.LINE_RIPPLE_DEACTIVATING)};n.prototype.handleTransitionEnd=function(t){var n=this.adapter.hasClass(v.LINE_RIPPLE_DEACTIVATING);if(t.propertyName==="opacity"){if(n){this.adapter.removeClass(v.LINE_RIPPLE_ACTIVE);this.adapter.removeClass(v.LINE_RIPPLE_DEACTIVATING)}}};return n}(t);
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
 */var m=function(t){d(n,t);function n(){return t!==null&&t.apply(this,arguments)||this}n.attachTo=function(t){return new n(t)};n.prototype.activate=function(){this.foundation.activate()};n.prototype.deactivate=function(){this.foundation.deactivate()};n.prototype.setRippleCenter=function(t){this.foundation.setRippleCenter(t)};n.prototype.getDefaultFoundation=function(){var t=this;var n={addClass:function(n){return t.root.classList.add(n)},removeClass:function(n){return t.root.classList.remove(n)},hasClass:function(n){return t.root.classList.contains(n)},setStyle:function(n,e){return t.root.style.setProperty(n,e)},registerEventHandler:function(n,e){return t.listen(n,e)},deregisterEventHandler:function(n,e){return t.unlisten(n,e)}};return new g(n)};return n}(n);
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
***************************************************************************** */var O=function(t,n){O=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,n){t.__proto__=n}||function(t,n){for(var e in n)if(Object.prototype.hasOwnProperty.call(n,e))t[e]=n[e]};return O(t,n)};function p(t,n){if(typeof n!=="function"&&n!==null)throw new TypeError("Class extends value "+String(n)+" is not a constructor or null");O(t,n);function e(){this.constructor=t}t.prototype=n===null?Object.create(n):(e.prototype=n.prototype,new e)}var E=function(){E=Object.assign||function t(n){for(var e,i=1,r=arguments.length;i<r;i++){e=arguments[i];for(var u in e)if(Object.prototype.hasOwnProperty.call(e,u))n[u]=e[u]}return n};return E.apply(this,arguments)};
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
 */var I={NOTCH_ELEMENT_SELECTOR:".mdc-notched-outline__notch"};var C={NOTCH_ELEMENT_PADDING:8};var L={NO_LABEL:"mdc-notched-outline--no-label",OUTLINE_NOTCHED:"mdc-notched-outline--notched",OUTLINE_UPGRADED:"mdc-notched-outline--upgraded"};
/**
 * @license
 * Copyright 2017 Google Inc.
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
 */var _=function(t){p(n,t);function n(e){return t.call(this,E(E({},n.defaultAdapter),e))||this}Object.defineProperty(n,"strings",{get:function(){return I},enumerable:false,configurable:true});Object.defineProperty(n,"cssClasses",{get:function(){return L},enumerable:false,configurable:true});Object.defineProperty(n,"numbers",{get:function(){return C},enumerable:false,configurable:true});Object.defineProperty(n,"defaultAdapter",{get:function(){return{addClass:function(){return undefined},removeClass:function(){return undefined},setNotchWidthProperty:function(){return undefined},removeNotchWidthProperty:function(){return undefined}}},enumerable:false,configurable:true});n.prototype.notch=function(t){var e=n.cssClasses.OUTLINE_NOTCHED;if(t>0){t+=C.NOTCH_ELEMENT_PADDING}this.adapter.setNotchWidthProperty(t);this.adapter.addClass(e)};n.prototype.closeNotch=function(){var t=n.cssClasses.OUTLINE_NOTCHED;this.adapter.removeClass(t);this.adapter.removeNotchWidthProperty()};return n}(t);
/**
 * @license
 * Copyright 2017 Google Inc.
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
 */var T=function(t){p(n,t);function n(){return t!==null&&t.apply(this,arguments)||this}n.attachTo=function(t){return new n(t)};n.prototype.initialSyncWithDOM=function(){this.notchElement=this.root.querySelector(I.NOTCH_ELEMENT_SELECTOR);var t=this.root.querySelector("."+s.cssClasses.ROOT);if(t){t.style.transitionDuration="0s";this.root.classList.add(L.OUTLINE_UPGRADED);requestAnimationFrame((function(){t.style.transitionDuration=""}))}else{this.root.classList.add(L.NO_LABEL)}};n.prototype.notch=function(t){this.foundation.notch(t)};n.prototype.closeNotch=function(){this.foundation.closeNotch()};n.prototype.getDefaultFoundation=function(){var t=this;var n={addClass:function(n){return t.root.classList.add(n)},removeClass:function(n){return t.root.classList.remove(n)},setNotchWidthProperty:function(n){t.notchElement.style.setProperty("width",n+"px")},removeNotchWidthProperty:function(){t.notchElement.style.removeProperty("width")}};return new _(n)};return n}(n);
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
 */var x={ROOT:"mdc-text-field-character-counter"};var A={ROOT_SELECTOR:"."+x.ROOT};
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
 */var j=function(t){c(n,t);function n(e){return t.call(this,a(a({},n.defaultAdapter),e))||this}Object.defineProperty(n,"cssClasses",{get:function(){return x},enumerable:false,configurable:true});Object.defineProperty(n,"strings",{get:function(){return A},enumerable:false,configurable:true});Object.defineProperty(n,"defaultAdapter",{get:function(){return{setContent:function(){return undefined}}},enumerable:false,configurable:true});n.prototype.setCounterValue=function(t,n){t=Math.min(t,n);this.adapter.setContent(t+" / "+n)};return n}(t);
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
 */var y=function(t){c(n,t);function n(){return t!==null&&t.apply(this,arguments)||this}n.attachTo=function(t){return new n(t)};Object.defineProperty(n.prototype,"foundationForTextField",{get:function(){return this.foundation},enumerable:false,configurable:true});n.prototype.getDefaultFoundation=function(){var t=this;var n={setContent:function(n){t.root.textContent=n}};return new j(n)};return n}(n);
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
 */var w={ARIA_CONTROLS:"aria-controls",ARIA_DESCRIBEDBY:"aria-describedby",INPUT_SELECTOR:".mdc-text-field__input",LABEL_SELECTOR:".mdc-floating-label",LEADING_ICON_SELECTOR:".mdc-text-field__icon--leading",LINE_RIPPLE_SELECTOR:".mdc-line-ripple",OUTLINE_SELECTOR:".mdc-notched-outline",PREFIX_SELECTOR:".mdc-text-field__affix--prefix",SUFFIX_SELECTOR:".mdc-text-field__affix--suffix",TRAILING_ICON_SELECTOR:".mdc-text-field__icon--trailing"};var R={DISABLED:"mdc-text-field--disabled",FOCUSED:"mdc-text-field--focused",HELPER_LINE:"mdc-text-field-helper-line",INVALID:"mdc-text-field--invalid",LABEL_FLOATING:"mdc-text-field--label-floating",NO_LABEL:"mdc-text-field--no-label",OUTLINED:"mdc-text-field--outlined",ROOT:"mdc-text-field",TEXTAREA:"mdc-text-field--textarea",WITH_LEADING_ICON:"mdc-text-field--with-leading-icon",WITH_TRAILING_ICON:"mdc-text-field--with-trailing-icon",WITH_INTERNAL_COUNTER:"mdc-text-field--with-internal-counter"};var N={LABEL_SCALE:.75};var H=["pattern","min","max","required","step","minlength","maxlength"];var S=["color","date","datetime-local","month","range","time","week"];
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
 */var F=["mousedown","touchstart"];var D=["click","keydown"];var P=function(t){c(n,t);function n(e,i){if(i===void 0){i={}}var r=t.call(this,a(a({},n.defaultAdapter),e))||this;r.isFocused=false;r.receivedUserInput=false;r.valid=true;r.useNativeValidation=true;r.validateOnValueChange=true;r.helperText=i.helperText;r.characterCounter=i.characterCounter;r.leadingIcon=i.leadingIcon;r.trailingIcon=i.trailingIcon;r.inputFocusHandler=function(){r.activateFocus()};r.inputBlurHandler=function(){r.deactivateFocus()};r.inputInputHandler=function(){r.handleInput()};r.setPointerXOffset=function(t){r.setTransformOrigin(t)};r.textFieldInteractionHandler=function(){r.handleTextFieldInteraction()};r.validationAttributeChangeHandler=function(t){r.handleValidationAttributeChange(t)};return r}Object.defineProperty(n,"cssClasses",{get:function(){return R},enumerable:false,configurable:true});Object.defineProperty(n,"strings",{get:function(){return w},enumerable:false,configurable:true});Object.defineProperty(n,"numbers",{get:function(){return N},enumerable:false,configurable:true});Object.defineProperty(n.prototype,"shouldAlwaysFloat",{get:function(){var t=this.getNativeInput().type;return S.indexOf(t)>=0},enumerable:false,configurable:true});Object.defineProperty(n.prototype,"shouldFloat",{get:function(){return this.shouldAlwaysFloat||this.isFocused||!!this.getValue()||this.isBadInput()},enumerable:false,configurable:true});Object.defineProperty(n.prototype,"shouldShake",{get:function(){return!this.isFocused&&!this.isValid()&&!!this.getValue()},enumerable:false,configurable:true});Object.defineProperty(n,"defaultAdapter",{get:function(){return{addClass:function(){return undefined},removeClass:function(){return undefined},hasClass:function(){return true},setInputAttr:function(){return undefined},removeInputAttr:function(){return undefined},registerTextFieldInteractionHandler:function(){return undefined},deregisterTextFieldInteractionHandler:function(){return undefined},registerInputInteractionHandler:function(){return undefined},deregisterInputInteractionHandler:function(){return undefined},registerValidationAttributeChangeHandler:function(){return new MutationObserver((function(){return undefined}))},deregisterValidationAttributeChangeHandler:function(){return undefined},getNativeInput:function(){return null},isFocused:function(){return false},activateLineRipple:function(){return undefined},deactivateLineRipple:function(){return undefined},setLineRippleTransformOrigin:function(){return undefined},shakeLabel:function(){return undefined},floatLabel:function(){return undefined},setLabelRequired:function(){return undefined},hasLabel:function(){return false},getLabelWidth:function(){return 0},hasOutline:function(){return false},notchOutline:function(){return undefined},closeOutline:function(){return undefined}}},enumerable:false,configurable:true});n.prototype.init=function(){var t,n,e,i;if(this.adapter.hasLabel()&&this.getNativeInput().required){this.adapter.setLabelRequired(true)}if(this.adapter.isFocused()){this.inputFocusHandler()}else if(this.adapter.hasLabel()&&this.shouldFloat){this.notchOutline(true);this.adapter.floatLabel(true);this.styleFloating(true)}this.adapter.registerInputInteractionHandler("focus",this.inputFocusHandler);this.adapter.registerInputInteractionHandler("blur",this.inputBlurHandler);this.adapter.registerInputInteractionHandler("input",this.inputInputHandler);try{for(var r=l(F),u=r.next();!u.done;u=r.next()){var s=u.value;this.adapter.registerInputInteractionHandler(s,this.setPointerXOffset)}}catch(n){t={error:n}}finally{try{if(u&&!u.done&&(n=r.return))n.call(r)}finally{if(t)throw t.error}}try{for(var f=l(D),o=f.next();!o.done;o=f.next()){var s=o.value;this.adapter.registerTextFieldInteractionHandler(s,this.textFieldInteractionHandler)}}catch(t){e={error:t}}finally{try{if(o&&!o.done&&(i=f.return))i.call(f)}finally{if(e)throw e.error}}this.validationObserver=this.adapter.registerValidationAttributeChangeHandler(this.validationAttributeChangeHandler);this.setcharacterCounter(this.getValue().length)};n.prototype.destroy=function(){var t,n,e,i;this.adapter.deregisterInputInteractionHandler("focus",this.inputFocusHandler);this.adapter.deregisterInputInteractionHandler("blur",this.inputBlurHandler);this.adapter.deregisterInputInteractionHandler("input",this.inputInputHandler);try{for(var r=l(F),u=r.next();!u.done;u=r.next()){var s=u.value;this.adapter.deregisterInputInteractionHandler(s,this.setPointerXOffset)}}catch(n){t={error:n}}finally{try{if(u&&!u.done&&(n=r.return))n.call(r)}finally{if(t)throw t.error}}try{for(var f=l(D),o=f.next();!o.done;o=f.next()){var s=o.value;this.adapter.deregisterTextFieldInteractionHandler(s,this.textFieldInteractionHandler)}}catch(t){e={error:t}}finally{try{if(o&&!o.done&&(i=f.return))i.call(f)}finally{if(e)throw e.error}}this.adapter.deregisterValidationAttributeChangeHandler(this.validationObserver)};n.prototype.handleTextFieldInteraction=function(){var t=this.adapter.getNativeInput();if(t&&t.disabled){return}this.receivedUserInput=true};n.prototype.handleValidationAttributeChange=function(t){var n=this;t.some((function(t){if(H.indexOf(t)>-1){n.styleValidity(true);n.adapter.setLabelRequired(n.getNativeInput().required);return true}return false}));if(t.indexOf("maxlength")>-1){this.setcharacterCounter(this.getValue().length)}};n.prototype.notchOutline=function(t){if(!this.adapter.hasOutline()||!this.adapter.hasLabel()){return}if(t){var n=this.adapter.getLabelWidth()*N.LABEL_SCALE;this.adapter.notchOutline(n)}else{this.adapter.closeOutline()}};n.prototype.activateFocus=function(){this.isFocused=true;this.styleFocused(this.isFocused);this.adapter.activateLineRipple();if(this.adapter.hasLabel()){this.notchOutline(this.shouldFloat);this.adapter.floatLabel(this.shouldFloat);this.styleFloating(this.shouldFloat);this.adapter.shakeLabel(this.shouldShake)}if(this.helperText&&(this.helperText.isPersistent()||!this.helperText.isValidation()||!this.valid)){this.helperText.showToScreenReader()}};n.prototype.setTransformOrigin=function(t){if(this.isDisabled()||this.adapter.hasOutline()){return}var n=t.touches;var e=n?n[0]:t;var i=e.target.getBoundingClientRect();var r=e.clientX-i.left;this.adapter.setLineRippleTransformOrigin(r)};n.prototype.handleInput=function(){this.autoCompleteFocus();this.setcharacterCounter(this.getValue().length)};n.prototype.autoCompleteFocus=function(){if(!this.receivedUserInput){this.activateFocus()}};n.prototype.deactivateFocus=function(){this.isFocused=false;this.adapter.deactivateLineRipple();var t=this.isValid();this.styleValidity(t);this.styleFocused(this.isFocused);if(this.adapter.hasLabel()){this.notchOutline(this.shouldFloat);this.adapter.floatLabel(this.shouldFloat);this.styleFloating(this.shouldFloat);this.adapter.shakeLabel(this.shouldShake)}if(!this.shouldFloat){this.receivedUserInput=false}};n.prototype.getValue=function(){return this.getNativeInput().value};n.prototype.setValue=function(t){if(this.getValue()!==t){this.getNativeInput().value=t}this.setcharacterCounter(t.length);if(this.validateOnValueChange){var n=this.isValid();this.styleValidity(n)}if(this.adapter.hasLabel()){this.notchOutline(this.shouldFloat);this.adapter.floatLabel(this.shouldFloat);this.styleFloating(this.shouldFloat);if(this.validateOnValueChange){this.adapter.shakeLabel(this.shouldShake)}}};n.prototype.isValid=function(){return this.useNativeValidation?this.isNativeInputValid():this.valid};n.prototype.setValid=function(t){this.valid=t;this.styleValidity(t);var n=!t&&!this.isFocused&&!!this.getValue();if(this.adapter.hasLabel()){this.adapter.shakeLabel(n)}};n.prototype.setValidateOnValueChange=function(t){this.validateOnValueChange=t};n.prototype.getValidateOnValueChange=function(){return this.validateOnValueChange};n.prototype.setUseNativeValidation=function(t){this.useNativeValidation=t};n.prototype.isDisabled=function(){return this.getNativeInput().disabled};n.prototype.setDisabled=function(t){this.getNativeInput().disabled=t;this.styleDisabled(t)};n.prototype.setHelperTextContent=function(t){if(this.helperText){this.helperText.setContent(t)}};n.prototype.setLeadingIconAriaLabel=function(t){if(this.leadingIcon){this.leadingIcon.setAriaLabel(t)}};n.prototype.setLeadingIconContent=function(t){if(this.leadingIcon){this.leadingIcon.setContent(t)}};n.prototype.setTrailingIconAriaLabel=function(t){if(this.trailingIcon){this.trailingIcon.setAriaLabel(t)}};n.prototype.setTrailingIconContent=function(t){if(this.trailingIcon){this.trailingIcon.setContent(t)}};n.prototype.setcharacterCounter=function(t){if(!this.characterCounter){return}var n=this.getNativeInput().maxLength;if(n===-1){throw new Error("MDCTextFieldFoundation: Expected maxlength html property on text input or textarea.")}this.characterCounter.setCounterValue(t,n)};n.prototype.isBadInput=function(){return this.getNativeInput().validity.badInput||false};n.prototype.isNativeInputValid=function(){return this.getNativeInput().validity.valid};n.prototype.styleValidity=function(t){var e=n.cssClasses.INVALID;if(t){this.adapter.removeClass(e)}else{this.adapter.addClass(e)}if(this.helperText){this.helperText.setValidity(t);var i=this.helperText.isValidation();if(!i){return}var r=this.helperText.isVisible();var u=this.helperText.getId();if(r&&u){this.adapter.setInputAttr(w.ARIA_DESCRIBEDBY,u)}else{this.adapter.removeInputAttr(w.ARIA_DESCRIBEDBY)}}};n.prototype.styleFocused=function(t){var e=n.cssClasses.FOCUSED;if(t){this.adapter.addClass(e)}else{this.adapter.removeClass(e)}};n.prototype.styleDisabled=function(t){var e=n.cssClasses,i=e.DISABLED,r=e.INVALID;if(t){this.adapter.addClass(i);this.adapter.removeClass(r)}else{this.adapter.removeClass(i)}if(this.leadingIcon){this.leadingIcon.setDisabled(t)}if(this.trailingIcon){this.trailingIcon.setDisabled(t)}};n.prototype.styleFloating=function(t){var e=n.cssClasses.LABEL_FLOATING;if(t){this.adapter.addClass(e)}else{this.adapter.removeClass(e)}};n.prototype.getNativeInput=function(){var t=this.adapter?this.adapter.getNativeInput():null;return t||{disabled:false,maxLength:-1,required:false,type:"input",validity:{badInput:false,valid:true},value:""}};return n}(t);
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
 */var M={HELPER_TEXT_PERSISTENT:"mdc-text-field-helper-text--persistent",HELPER_TEXT_VALIDATION_MSG:"mdc-text-field-helper-text--validation-msg",ROOT:"mdc-text-field-helper-text"};var B={ARIA_HIDDEN:"aria-hidden",ROLE:"role",ROOT_SELECTOR:"."+M.ROOT};
/**
 * @license
 * Copyright 2017 Google Inc.
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
 */var V=function(t){c(n,t);function n(e){return t.call(this,a(a({},n.defaultAdapter),e))||this}Object.defineProperty(n,"cssClasses",{get:function(){return M},enumerable:false,configurable:true});Object.defineProperty(n,"strings",{get:function(){return B},enumerable:false,configurable:true});Object.defineProperty(n,"defaultAdapter",{get:function(){return{addClass:function(){return undefined},removeClass:function(){return undefined},hasClass:function(){return false},getAttr:function(){return null},setAttr:function(){return undefined},removeAttr:function(){return undefined},setContent:function(){return undefined}}},enumerable:false,configurable:true});n.prototype.getId=function(){return this.adapter.getAttr("id")};n.prototype.isVisible=function(){return this.adapter.getAttr(B.ARIA_HIDDEN)!=="true"};n.prototype.setContent=function(t){this.adapter.setContent(t)};n.prototype.isPersistent=function(){return this.adapter.hasClass(M.HELPER_TEXT_PERSISTENT)};n.prototype.setPersistent=function(t){if(t){this.adapter.addClass(M.HELPER_TEXT_PERSISTENT)}else{this.adapter.removeClass(M.HELPER_TEXT_PERSISTENT)}};n.prototype.isValidation=function(){return this.adapter.hasClass(M.HELPER_TEXT_VALIDATION_MSG)};n.prototype.setValidation=function(t){if(t){this.adapter.addClass(M.HELPER_TEXT_VALIDATION_MSG)}else{this.adapter.removeClass(M.HELPER_TEXT_VALIDATION_MSG)}};n.prototype.showToScreenReader=function(){this.adapter.removeAttr(B.ARIA_HIDDEN)};n.prototype.setValidity=function(t){var n=this.adapter.hasClass(M.HELPER_TEXT_PERSISTENT);var e=this.adapter.hasClass(M.HELPER_TEXT_VALIDATION_MSG);var i=e&&!t;if(i){this.showToScreenReader();if(this.adapter.getAttr(B.ROLE)==="alert"){this.refreshAlertRole()}else{this.adapter.setAttr(B.ROLE,"alert")}}else{this.adapter.removeAttr(B.ROLE)}if(!n&&!i){this.hide()}};n.prototype.hide=function(){this.adapter.setAttr(B.ARIA_HIDDEN,"true")};n.prototype.refreshAlertRole=function(){var t=this;this.adapter.removeAttr(B.ROLE);requestAnimationFrame((function(){t.adapter.setAttr(B.ROLE,"alert")}))};return n}(t);
/**
 * @license
 * Copyright 2017 Google Inc.
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
 */var k=function(t){c(n,t);function n(){return t!==null&&t.apply(this,arguments)||this}n.attachTo=function(t){return new n(t)};Object.defineProperty(n.prototype,"foundationForTextField",{get:function(){return this.foundation},enumerable:false,configurable:true});n.prototype.getDefaultFoundation=function(){var t=this;var n={addClass:function(n){return t.root.classList.add(n)},removeClass:function(n){return t.root.classList.remove(n)},hasClass:function(n){return t.root.classList.contains(n)},getAttr:function(n){return t.root.getAttribute(n)},setAttr:function(n,e){return t.root.setAttribute(n,e)},removeAttr:function(n){return t.root.removeAttribute(n)},setContent:function(n){t.root.textContent=n}};return new V(n)};return n}(n);
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
 */var G={ICON_EVENT:"MDCTextField:icon",ICON_ROLE:"button"};var U={ROOT:"mdc-text-field__icon"};
/**
 * @license
 * Copyright 2017 Google Inc.
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
 */var W=["click","keydown"];var q=function(t){c(n,t);function n(e){var i=t.call(this,a(a({},n.defaultAdapter),e))||this;i.savedTabIndex=null;i.interactionHandler=function(t){i.handleInteraction(t)};return i}Object.defineProperty(n,"strings",{get:function(){return G},enumerable:false,configurable:true});Object.defineProperty(n,"cssClasses",{get:function(){return U},enumerable:false,configurable:true});Object.defineProperty(n,"defaultAdapter",{get:function(){return{getAttr:function(){return null},setAttr:function(){return undefined},removeAttr:function(){return undefined},setContent:function(){return undefined},registerInteractionHandler:function(){return undefined},deregisterInteractionHandler:function(){return undefined},notifyIconAction:function(){return undefined}}},enumerable:false,configurable:true});n.prototype.init=function(){var t,n;this.savedTabIndex=this.adapter.getAttr("tabindex");try{for(var e=l(W),i=e.next();!i.done;i=e.next()){var r=i.value;this.adapter.registerInteractionHandler(r,this.interactionHandler)}}catch(n){t={error:n}}finally{try{if(i&&!i.done&&(n=e.return))n.call(e)}finally{if(t)throw t.error}}};n.prototype.destroy=function(){var t,n;try{for(var e=l(W),i=e.next();!i.done;i=e.next()){var r=i.value;this.adapter.deregisterInteractionHandler(r,this.interactionHandler)}}catch(n){t={error:n}}finally{try{if(i&&!i.done&&(n=e.return))n.call(e)}finally{if(t)throw t.error}}};n.prototype.setDisabled=function(t){if(!this.savedTabIndex){return}if(t){this.adapter.setAttr("tabindex","-1");this.adapter.removeAttr("role")}else{this.adapter.setAttr("tabindex",this.savedTabIndex);this.adapter.setAttr("role",G.ICON_ROLE)}};n.prototype.setAriaLabel=function(t){this.adapter.setAttr("aria-label",t)};n.prototype.setContent=function(t){this.adapter.setContent(t)};n.prototype.handleInteraction=function(t){var n=t.key==="Enter"||t.keyCode===13;if(t.type==="click"||n){t.preventDefault();this.adapter.notifyIconAction()}};return n}(t);
/**
 * @license
 * Copyright 2017 Google Inc.
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
 */var X=function(t){c(n,t);function n(){return t!==null&&t.apply(this,arguments)||this}n.attachTo=function(t){return new n(t)};Object.defineProperty(n.prototype,"foundationForTextField",{get:function(){return this.foundation},enumerable:false,configurable:true});n.prototype.getDefaultFoundation=function(){var t=this;var n={getAttr:function(n){return t.root.getAttribute(n)},setAttr:function(n,e){return t.root.setAttribute(n,e)},removeAttr:function(n){return t.root.removeAttribute(n)},setContent:function(n){t.root.textContent=n},registerInteractionHandler:function(n,e){return t.listen(n,e)},deregisterInteractionHandler:function(n,e){return t.unlisten(n,e)},notifyIconAction:function(){return t.emit(q.strings.ICON_EVENT,{},true)}};return new q(n)};return n}(n);
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
 */var Y=function(t){c(n,t);function n(){return t!==null&&t.apply(this,arguments)||this}n.attachTo=function(t){return new n(t)};n.prototype.initialize=function(t,n,e,r,u,s,o){if(t===void 0){t=function(t,n){return new i(t,n)}}if(n===void 0){n=function(t){return new m(t)}}if(e===void 0){e=function(t){return new k(t)}}if(r===void 0){r=function(t){return new y(t)}}if(u===void 0){u=function(t){return new X(t)}}if(s===void 0){s=function(t){return new f(t)}}if(o===void 0){o=function(t){return new T(t)}}this.input=this.root.querySelector(w.INPUT_SELECTOR);var c=this.root.querySelector(w.LABEL_SELECTOR);this.label=c?s(c):null;var a=this.root.querySelector(w.LINE_RIPPLE_SELECTOR);this.lineRipple=a?n(a):null;var l=this.root.querySelector(w.OUTLINE_SELECTOR);this.outline=l?o(l):null;var h=V.strings;var d=this.root.nextElementSibling;var b=d&&d.classList.contains(R.HELPER_LINE);var v=b&&d&&d.querySelector(h.ROOT_SELECTOR);this.helperText=v?e(v):null;var g=j.strings;var O=this.root.querySelector(g.ROOT_SELECTOR);if(!O&&b&&d){O=d.querySelector(g.ROOT_SELECTOR)}this.characterCounter=O?r(O):null;var p=this.root.querySelector(w.LEADING_ICON_SELECTOR);this.leadingIcon=p?u(p):null;var E=this.root.querySelector(w.TRAILING_ICON_SELECTOR);this.trailingIcon=E?u(E):null;this.prefix=this.root.querySelector(w.PREFIX_SELECTOR);this.suffix=this.root.querySelector(w.SUFFIX_SELECTOR);this.ripple=this.createRipple(t)};n.prototype.destroy=function(){if(this.ripple){this.ripple.destroy()}if(this.lineRipple){this.lineRipple.destroy()}if(this.helperText){this.helperText.destroy()}if(this.characterCounter){this.characterCounter.destroy()}if(this.leadingIcon){this.leadingIcon.destroy()}if(this.trailingIcon){this.trailingIcon.destroy()}if(this.label){this.label.destroy()}if(this.outline){this.outline.destroy()}t.prototype.destroy.call(this)};n.prototype.initialSyncWithDOM=function(){this.disabled=this.input.disabled};Object.defineProperty(n.prototype,"value",{get:function(){return this.foundation.getValue()},set:function(t){this.foundation.setValue(t)},enumerable:false,configurable:true});Object.defineProperty(n.prototype,"disabled",{get:function(){return this.foundation.isDisabled()},set:function(t){this.foundation.setDisabled(t)},enumerable:false,configurable:true});Object.defineProperty(n.prototype,"valid",{get:function(){return this.foundation.isValid()},set:function(t){this.foundation.setValid(t)},enumerable:false,configurable:true});Object.defineProperty(n.prototype,"required",{get:function(){return this.input.required},set:function(t){this.input.required=t},enumerable:false,configurable:true});Object.defineProperty(n.prototype,"pattern",{get:function(){return this.input.pattern},set:function(t){this.input.pattern=t},enumerable:false,configurable:true});Object.defineProperty(n.prototype,"minLength",{get:function(){return this.input.minLength},set:function(t){this.input.minLength=t},enumerable:false,configurable:true});Object.defineProperty(n.prototype,"maxLength",{get:function(){return this.input.maxLength},set:function(t){if(t<0){this.input.removeAttribute("maxLength")}else{this.input.maxLength=t}},enumerable:false,configurable:true});Object.defineProperty(n.prototype,"min",{get:function(){return this.input.min},set:function(t){this.input.min=t},enumerable:false,configurable:true});Object.defineProperty(n.prototype,"max",{get:function(){return this.input.max},set:function(t){this.input.max=t},enumerable:false,configurable:true});Object.defineProperty(n.prototype,"step",{get:function(){return this.input.step},set:function(t){this.input.step=t},enumerable:false,configurable:true});Object.defineProperty(n.prototype,"helperTextContent",{set:function(t){this.foundation.setHelperTextContent(t)},enumerable:false,configurable:true});Object.defineProperty(n.prototype,"leadingIconAriaLabel",{set:function(t){this.foundation.setLeadingIconAriaLabel(t)},enumerable:false,configurable:true});Object.defineProperty(n.prototype,"leadingIconContent",{set:function(t){this.foundation.setLeadingIconContent(t)},enumerable:false,configurable:true});Object.defineProperty(n.prototype,"trailingIconAriaLabel",{set:function(t){this.foundation.setTrailingIconAriaLabel(t)},enumerable:false,configurable:true});Object.defineProperty(n.prototype,"trailingIconContent",{set:function(t){this.foundation.setTrailingIconContent(t)},enumerable:false,configurable:true});Object.defineProperty(n.prototype,"useNativeValidation",{set:function(t){this.foundation.setUseNativeValidation(t)},enumerable:false,configurable:true});Object.defineProperty(n.prototype,"prefixText",{get:function(){return this.prefix?this.prefix.textContent:null},set:function(t){if(this.prefix){this.prefix.textContent=t}},enumerable:false,configurable:true});Object.defineProperty(n.prototype,"suffixText",{get:function(){return this.suffix?this.suffix.textContent:null},set:function(t){if(this.suffix){this.suffix.textContent=t}},enumerable:false,configurable:true});n.prototype.focus=function(){this.input.focus()};n.prototype.layout=function(){var t=this.foundation.shouldFloat;this.foundation.notchOutline(t)};n.prototype.getDefaultFoundation=function(){var t=a(a(a(a(a({},this.getRootAdapterMethods()),this.getInputAdapterMethods()),this.getLabelAdapterMethods()),this.getLineRippleAdapterMethods()),this.getOutlineAdapterMethods());return new P(t,this.getFoundationMap())};n.prototype.getRootAdapterMethods=function(){var t=this;return{addClass:function(n){return t.root.classList.add(n)},removeClass:function(n){return t.root.classList.remove(n)},hasClass:function(n){return t.root.classList.contains(n)},registerTextFieldInteractionHandler:function(n,e){t.listen(n,e)},deregisterTextFieldInteractionHandler:function(n,e){t.unlisten(n,e)},registerValidationAttributeChangeHandler:function(n){var e=function(t){return t.map((function(t){return t.attributeName})).filter((function(t){return t}))};var i=new MutationObserver((function(t){return n(e(t))}));var r={attributes:true};i.observe(t.input,r);return i},deregisterValidationAttributeChangeHandler:function(t){t.disconnect()}}};n.prototype.getInputAdapterMethods=function(){var t=this;return{getNativeInput:function(){return t.input},setInputAttr:function(n,e){t.input.setAttribute(n,e)},removeInputAttr:function(n){t.input.removeAttribute(n)},isFocused:function(){return document.activeElement===t.input},registerInputInteractionHandler:function(n,i){t.input.addEventListener(n,i,e())},deregisterInputInteractionHandler:function(n,i){t.input.removeEventListener(n,i,e())}}};n.prototype.getLabelAdapterMethods=function(){var t=this;return{floatLabel:function(n){t.label&&t.label.float(n)},getLabelWidth:function(){return t.label?t.label.getWidth():0},hasLabel:function(){return Boolean(t.label)},shakeLabel:function(n){t.label&&t.label.shake(n)},setLabelRequired:function(n){t.label&&t.label.setRequired(n)}}};n.prototype.getLineRippleAdapterMethods=function(){var t=this;return{activateLineRipple:function(){if(t.lineRipple){t.lineRipple.activate()}},deactivateLineRipple:function(){if(t.lineRipple){t.lineRipple.deactivate()}},setLineRippleTransformOrigin:function(n){if(t.lineRipple){t.lineRipple.setRippleCenter(n)}}}};n.prototype.getOutlineAdapterMethods=function(){var t=this;return{closeOutline:function(){t.outline&&t.outline.closeNotch()},hasOutline:function(){return Boolean(t.outline)},notchOutline:function(n){t.outline&&t.outline.notch(n)}}};n.prototype.getFoundationMap=function(){return{characterCounter:this.characterCounter?this.characterCounter.foundationForTextField:undefined,helperText:this.helperText?this.helperText.foundationForTextField:undefined,leadingIcon:this.leadingIcon?this.leadingIcon.foundationForTextField:undefined,trailingIcon:this.trailingIcon?this.trailingIcon.foundationForTextField:undefined}};n.prototype.createRipple=function(t){var n=this;var s=this.root.classList.contains(R.TEXTAREA);var f=this.root.classList.contains(R.OUTLINED);if(s||f){return null}var o=a(a({},i.createAdapter(this)),{isSurfaceActive:function(){return u(n.input,":active")},registerInteractionHandler:function(t,i){n.input.addEventListener(t,i,e())},deregisterInteractionHandler:function(t,i){n.input.removeEventListener(t,i,e())}});return t(this.root,new r(o))};return n}(n);export{Y as M};
//# sourceMappingURL=component-288691f3.js.map