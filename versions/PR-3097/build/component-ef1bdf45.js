import{_ as t,a as n,M as e,c as i,d as r}from"./component-a9f33440.js";import{a as u,b as s,M as f}from"./component-9a30a8ad.js";import{m as a}from"./ponyfill-30263d5e.js";import{M as o,a as c}from"./component-913ae2d5.js";
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
 */var h={LINE_RIPPLE_ACTIVE:"mdc-line-ripple--active",LINE_RIPPLE_DEACTIVATING:"mdc-line-ripple--deactivating"};
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
 */var l=function(e){t(i,e);function i(t){var r=e.call(this,n(n({},i.defaultAdapter),t))||this;r.transitionEndHandler=function(t){r.handleTransitionEnd(t)};return r}Object.defineProperty(i,"cssClasses",{get:function(){return h},enumerable:false,configurable:true});Object.defineProperty(i,"defaultAdapter",{get:function(){return{addClass:function(){return undefined},removeClass:function(){return undefined},hasClass:function(){return false},setStyle:function(){return undefined},registerEventHandler:function(){return undefined},deregisterEventHandler:function(){return undefined}}},enumerable:false,configurable:true});i.prototype.init=function(){this.adapter.registerEventHandler("transitionend",this.transitionEndHandler)};i.prototype.destroy=function(){this.adapter.deregisterEventHandler("transitionend",this.transitionEndHandler)};i.prototype.activate=function(){this.adapter.removeClass(h.LINE_RIPPLE_DEACTIVATING);this.adapter.addClass(h.LINE_RIPPLE_ACTIVE)};i.prototype.setRippleCenter=function(t){this.adapter.setStyle("transform-origin",t+"px center")};i.prototype.deactivate=function(){this.adapter.addClass(h.LINE_RIPPLE_DEACTIVATING)};i.prototype.handleTransitionEnd=function(t){var n=this.adapter.hasClass(h.LINE_RIPPLE_DEACTIVATING);if(t.propertyName==="opacity"){if(n){this.adapter.removeClass(h.LINE_RIPPLE_ACTIVE);this.adapter.removeClass(h.LINE_RIPPLE_DEACTIVATING)}}};return i}(e);
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
 */var d=function(n){t(e,n);function e(){return n!==null&&n.apply(this,arguments)||this}e.attachTo=function(t){return new e(t)};e.prototype.activate=function(){this.foundation.activate()};e.prototype.deactivate=function(){this.foundation.deactivate()};e.prototype.setRippleCenter=function(t){this.foundation.setRippleCenter(t)};e.prototype.getDefaultFoundation=function(){var t=this;var n={addClass:function(n){return t.root.classList.add(n)},removeClass:function(n){return t.root.classList.remove(n)},hasClass:function(n){return t.root.classList.contains(n)},setStyle:function(n,e){return t.root.style.setProperty(n,e)},registerEventHandler:function(n,e){return t.listen(n,e)},deregisterEventHandler:function(n,e){return t.unlisten(n,e)}};return new l(n)};return e}(i);
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
 */var b={NOTCH_ELEMENT_SELECTOR:".mdc-notched-outline__notch"};var v={NOTCH_ELEMENT_PADDING:8};var g={NO_LABEL:"mdc-notched-outline--no-label",OUTLINE_NOTCHED:"mdc-notched-outline--notched",OUTLINE_UPGRADED:"mdc-notched-outline--upgraded"};
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
 */var m=function(e){t(i,e);function i(t){return e.call(this,n(n({},i.defaultAdapter),t))||this}Object.defineProperty(i,"strings",{get:function(){return b},enumerable:false,configurable:true});Object.defineProperty(i,"cssClasses",{get:function(){return g},enumerable:false,configurable:true});Object.defineProperty(i,"numbers",{get:function(){return v},enumerable:false,configurable:true});Object.defineProperty(i,"defaultAdapter",{get:function(){return{addClass:function(){return undefined},removeClass:function(){return undefined},setNotchWidthProperty:function(){return undefined},removeNotchWidthProperty:function(){return undefined}}},enumerable:false,configurable:true});i.prototype.notch=function(t){var n=i.cssClasses.OUTLINE_NOTCHED;if(t>0){t+=v.NOTCH_ELEMENT_PADDING}this.adapter.setNotchWidthProperty(t);this.adapter.addClass(n)};i.prototype.closeNotch=function(){var t=i.cssClasses.OUTLINE_NOTCHED;this.adapter.removeClass(t);this.adapter.removeNotchWidthProperty()};return i}(e);
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
 */var O=function(n){t(e,n);function e(){return n!==null&&n.apply(this,arguments)||this}e.attachTo=function(t){return new e(t)};e.prototype.initialSyncWithDOM=function(){this.notchElement=this.root.querySelector(b.NOTCH_ELEMENT_SELECTOR);var t=this.root.querySelector("."+o.cssClasses.ROOT);if(t){t.style.transitionDuration="0s";this.root.classList.add(g.OUTLINE_UPGRADED);requestAnimationFrame((function(){t.style.transitionDuration=""}))}else{this.root.classList.add(g.NO_LABEL)}};e.prototype.notch=function(t){this.foundation.notch(t)};e.prototype.closeNotch=function(){this.foundation.closeNotch()};e.prototype.getDefaultFoundation=function(){var t=this;var n={addClass:function(n){return t.root.classList.add(n)},removeClass:function(n){return t.root.classList.remove(n)},setNotchWidthProperty:function(n){t.notchElement.style.setProperty("width",n+"px")},removeNotchWidthProperty:function(){t.notchElement.style.removeProperty("width")}};return new m(n)};return e}(i);
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
 */var E={ROOT:"mdc-text-field-character-counter"};var I={ROOT_SELECTOR:"."+E.ROOT};
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
 */var p=function(e){t(i,e);function i(t){return e.call(this,n(n({},i.defaultAdapter),t))||this}Object.defineProperty(i,"cssClasses",{get:function(){return E},enumerable:false,configurable:true});Object.defineProperty(i,"strings",{get:function(){return I},enumerable:false,configurable:true});Object.defineProperty(i,"defaultAdapter",{get:function(){return{setContent:function(){return undefined}}},enumerable:false,configurable:true});i.prototype.setCounterValue=function(t,n){t=Math.min(t,n);this.adapter.setContent(t+" / "+n)};return i}(e);
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
 */var L=function(n){t(e,n);function e(){return n!==null&&n.apply(this,arguments)||this}e.attachTo=function(t){return new e(t)};Object.defineProperty(e.prototype,"foundationForTextField",{get:function(){return this.foundation},enumerable:false,configurable:true});e.prototype.getDefaultFoundation=function(){var t=this;var n={setContent:function(n){t.root.textContent=n}};return new p(n)};return e}(i);
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
 */var C={ARIA_CONTROLS:"aria-controls",ARIA_DESCRIBEDBY:"aria-describedby",INPUT_SELECTOR:".mdc-text-field__input",LABEL_SELECTOR:".mdc-floating-label",LEADING_ICON_SELECTOR:".mdc-text-field__icon--leading",LINE_RIPPLE_SELECTOR:".mdc-line-ripple",OUTLINE_SELECTOR:".mdc-notched-outline",PREFIX_SELECTOR:".mdc-text-field__affix--prefix",SUFFIX_SELECTOR:".mdc-text-field__affix--suffix",TRAILING_ICON_SELECTOR:".mdc-text-field__icon--trailing"};var T={DISABLED:"mdc-text-field--disabled",FOCUSED:"mdc-text-field--focused",HELPER_LINE:"mdc-text-field-helper-line",INVALID:"mdc-text-field--invalid",LABEL_FLOATING:"mdc-text-field--label-floating",NO_LABEL:"mdc-text-field--no-label",OUTLINED:"mdc-text-field--outlined",ROOT:"mdc-text-field",TEXTAREA:"mdc-text-field--textarea",WITH_LEADING_ICON:"mdc-text-field--with-leading-icon",WITH_TRAILING_ICON:"mdc-text-field--with-trailing-icon",WITH_INTERNAL_COUNTER:"mdc-text-field--with-internal-counter"};var A={LABEL_SCALE:.75};var x=["pattern","min","max","required","step","minlength","maxlength"];var _=["color","date","datetime-local","month","range","time","week"];
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
 */var j=["mousedown","touchstart"];var R=["click","keydown"];var N=function(e){t(i,e);function i(t,r){if(r===void 0){r={}}var u=e.call(this,n(n({},i.defaultAdapter),t))||this;u.isFocused=false;u.receivedUserInput=false;u.valid=true;u.useNativeValidation=true;u.validateOnValueChange=true;u.helperText=r.helperText;u.characterCounter=r.characterCounter;u.leadingIcon=r.leadingIcon;u.trailingIcon=r.trailingIcon;u.inputFocusHandler=function(){u.activateFocus()};u.inputBlurHandler=function(){u.deactivateFocus()};u.inputInputHandler=function(){u.handleInput()};u.setPointerXOffset=function(t){u.setTransformOrigin(t)};u.textFieldInteractionHandler=function(){u.handleTextFieldInteraction()};u.validationAttributeChangeHandler=function(t){u.handleValidationAttributeChange(t)};return u}Object.defineProperty(i,"cssClasses",{get:function(){return T},enumerable:false,configurable:true});Object.defineProperty(i,"strings",{get:function(){return C},enumerable:false,configurable:true});Object.defineProperty(i,"numbers",{get:function(){return A},enumerable:false,configurable:true});Object.defineProperty(i.prototype,"shouldAlwaysFloat",{get:function(){var t=this.getNativeInput().type;return _.indexOf(t)>=0},enumerable:false,configurable:true});Object.defineProperty(i.prototype,"shouldFloat",{get:function(){return this.shouldAlwaysFloat||this.isFocused||!!this.getValue()||this.isBadInput()},enumerable:false,configurable:true});Object.defineProperty(i.prototype,"shouldShake",{get:function(){return!this.isFocused&&!this.isValid()&&!!this.getValue()},enumerable:false,configurable:true});Object.defineProperty(i,"defaultAdapter",{get:function(){return{addClass:function(){return undefined},removeClass:function(){return undefined},hasClass:function(){return true},setInputAttr:function(){return undefined},removeInputAttr:function(){return undefined},registerTextFieldInteractionHandler:function(){return undefined},deregisterTextFieldInteractionHandler:function(){return undefined},registerInputInteractionHandler:function(){return undefined},deregisterInputInteractionHandler:function(){return undefined},registerValidationAttributeChangeHandler:function(){return new MutationObserver((function(){return undefined}))},deregisterValidationAttributeChangeHandler:function(){return undefined},getNativeInput:function(){return null},isFocused:function(){return false},activateLineRipple:function(){return undefined},deactivateLineRipple:function(){return undefined},setLineRippleTransformOrigin:function(){return undefined},shakeLabel:function(){return undefined},floatLabel:function(){return undefined},setLabelRequired:function(){return undefined},hasLabel:function(){return false},getLabelWidth:function(){return 0},hasOutline:function(){return false},notchOutline:function(){return undefined},closeOutline:function(){return undefined}}},enumerable:false,configurable:true});i.prototype.init=function(){var t,n,e,i;if(this.adapter.hasLabel()&&this.getNativeInput().required){this.adapter.setLabelRequired(true)}if(this.adapter.isFocused()){this.inputFocusHandler()}else if(this.adapter.hasLabel()&&this.shouldFloat){this.notchOutline(true);this.adapter.floatLabel(true);this.styleFloating(true)}this.adapter.registerInputInteractionHandler("focus",this.inputFocusHandler);this.adapter.registerInputInteractionHandler("blur",this.inputBlurHandler);this.adapter.registerInputInteractionHandler("input",this.inputInputHandler);try{for(var u=r(j),s=u.next();!s.done;s=u.next()){var f=s.value;this.adapter.registerInputInteractionHandler(f,this.setPointerXOffset)}}catch(n){t={error:n}}finally{try{if(s&&!s.done&&(n=u.return))n.call(u)}finally{if(t)throw t.error}}try{for(var a=r(R),o=a.next();!o.done;o=a.next()){var f=o.value;this.adapter.registerTextFieldInteractionHandler(f,this.textFieldInteractionHandler)}}catch(t){e={error:t}}finally{try{if(o&&!o.done&&(i=a.return))i.call(a)}finally{if(e)throw e.error}}this.validationObserver=this.adapter.registerValidationAttributeChangeHandler(this.validationAttributeChangeHandler);this.setcharacterCounter(this.getValue().length)};i.prototype.destroy=function(){var t,n,e,i;this.adapter.deregisterInputInteractionHandler("focus",this.inputFocusHandler);this.adapter.deregisterInputInteractionHandler("blur",this.inputBlurHandler);this.adapter.deregisterInputInteractionHandler("input",this.inputInputHandler);try{for(var u=r(j),s=u.next();!s.done;s=u.next()){var f=s.value;this.adapter.deregisterInputInteractionHandler(f,this.setPointerXOffset)}}catch(n){t={error:n}}finally{try{if(s&&!s.done&&(n=u.return))n.call(u)}finally{if(t)throw t.error}}try{for(var a=r(R),o=a.next();!o.done;o=a.next()){var f=o.value;this.adapter.deregisterTextFieldInteractionHandler(f,this.textFieldInteractionHandler)}}catch(t){e={error:t}}finally{try{if(o&&!o.done&&(i=a.return))i.call(a)}finally{if(e)throw e.error}}this.adapter.deregisterValidationAttributeChangeHandler(this.validationObserver)};i.prototype.handleTextFieldInteraction=function(){var t=this.adapter.getNativeInput();if(t&&t.disabled){return}this.receivedUserInput=true};i.prototype.handleValidationAttributeChange=function(t){var n=this;t.some((function(t){if(x.indexOf(t)>-1){n.styleValidity(true);n.adapter.setLabelRequired(n.getNativeInput().required);return true}return false}));if(t.indexOf("maxlength")>-1){this.setcharacterCounter(this.getValue().length)}};i.prototype.notchOutline=function(t){if(!this.adapter.hasOutline()||!this.adapter.hasLabel()){return}if(t){var n=this.adapter.getLabelWidth()*A.LABEL_SCALE;this.adapter.notchOutline(n)}else{this.adapter.closeOutline()}};i.prototype.activateFocus=function(){this.isFocused=true;this.styleFocused(this.isFocused);this.adapter.activateLineRipple();if(this.adapter.hasLabel()){this.notchOutline(this.shouldFloat);this.adapter.floatLabel(this.shouldFloat);this.styleFloating(this.shouldFloat);this.adapter.shakeLabel(this.shouldShake)}if(this.helperText&&(this.helperText.isPersistent()||!this.helperText.isValidation()||!this.valid)){this.helperText.showToScreenReader()}};i.prototype.setTransformOrigin=function(t){if(this.isDisabled()||this.adapter.hasOutline()){return}var n=t.touches;var e=n?n[0]:t;var i=e.target.getBoundingClientRect();var r=e.clientX-i.left;this.adapter.setLineRippleTransformOrigin(r)};i.prototype.handleInput=function(){this.autoCompleteFocus();this.setcharacterCounter(this.getValue().length)};i.prototype.autoCompleteFocus=function(){if(!this.receivedUserInput){this.activateFocus()}};i.prototype.deactivateFocus=function(){this.isFocused=false;this.adapter.deactivateLineRipple();var t=this.isValid();this.styleValidity(t);this.styleFocused(this.isFocused);if(this.adapter.hasLabel()){this.notchOutline(this.shouldFloat);this.adapter.floatLabel(this.shouldFloat);this.styleFloating(this.shouldFloat);this.adapter.shakeLabel(this.shouldShake)}if(!this.shouldFloat){this.receivedUserInput=false}};i.prototype.getValue=function(){return this.getNativeInput().value};i.prototype.setValue=function(t){if(this.getValue()!==t){this.getNativeInput().value=t}this.setcharacterCounter(t.length);if(this.validateOnValueChange){var n=this.isValid();this.styleValidity(n)}if(this.adapter.hasLabel()){this.notchOutline(this.shouldFloat);this.adapter.floatLabel(this.shouldFloat);this.styleFloating(this.shouldFloat);if(this.validateOnValueChange){this.adapter.shakeLabel(this.shouldShake)}}};i.prototype.isValid=function(){return this.useNativeValidation?this.isNativeInputValid():this.valid};i.prototype.setValid=function(t){this.valid=t;this.styleValidity(t);var n=!t&&!this.isFocused&&!!this.getValue();if(this.adapter.hasLabel()){this.adapter.shakeLabel(n)}};i.prototype.setValidateOnValueChange=function(t){this.validateOnValueChange=t};i.prototype.getValidateOnValueChange=function(){return this.validateOnValueChange};i.prototype.setUseNativeValidation=function(t){this.useNativeValidation=t};i.prototype.isDisabled=function(){return this.getNativeInput().disabled};i.prototype.setDisabled=function(t){this.getNativeInput().disabled=t;this.styleDisabled(t)};i.prototype.setHelperTextContent=function(t){if(this.helperText){this.helperText.setContent(t)}};i.prototype.setLeadingIconAriaLabel=function(t){if(this.leadingIcon){this.leadingIcon.setAriaLabel(t)}};i.prototype.setLeadingIconContent=function(t){if(this.leadingIcon){this.leadingIcon.setContent(t)}};i.prototype.setTrailingIconAriaLabel=function(t){if(this.trailingIcon){this.trailingIcon.setAriaLabel(t)}};i.prototype.setTrailingIconContent=function(t){if(this.trailingIcon){this.trailingIcon.setContent(t)}};i.prototype.setcharacterCounter=function(t){if(!this.characterCounter){return}var n=this.getNativeInput().maxLength;if(n===-1){throw new Error("MDCTextFieldFoundation: Expected maxlength html property on text input or textarea.")}this.characterCounter.setCounterValue(t,n)};i.prototype.isBadInput=function(){return this.getNativeInput().validity.badInput||false};i.prototype.isNativeInputValid=function(){return this.getNativeInput().validity.valid};i.prototype.styleValidity=function(t){var n=i.cssClasses.INVALID;if(t){this.adapter.removeClass(n)}else{this.adapter.addClass(n)}if(this.helperText){this.helperText.setValidity(t);var e=this.helperText.isValidation();if(!e){return}var r=this.helperText.isVisible();var u=this.helperText.getId();if(r&&u){this.adapter.setInputAttr(C.ARIA_DESCRIBEDBY,u)}else{this.adapter.removeInputAttr(C.ARIA_DESCRIBEDBY)}}};i.prototype.styleFocused=function(t){var n=i.cssClasses.FOCUSED;if(t){this.adapter.addClass(n)}else{this.adapter.removeClass(n)}};i.prototype.styleDisabled=function(t){var n=i.cssClasses,e=n.DISABLED,r=n.INVALID;if(t){this.adapter.addClass(e);this.adapter.removeClass(r)}else{this.adapter.removeClass(e)}if(this.leadingIcon){this.leadingIcon.setDisabled(t)}if(this.trailingIcon){this.trailingIcon.setDisabled(t)}};i.prototype.styleFloating=function(t){var n=i.cssClasses.LABEL_FLOATING;if(t){this.adapter.addClass(n)}else{this.adapter.removeClass(n)}};i.prototype.getNativeInput=function(){var t=this.adapter?this.adapter.getNativeInput():null;return t||{disabled:false,maxLength:-1,required:false,type:"input",validity:{badInput:false,valid:true},value:""}};return i}(e);
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
 */var y={HELPER_TEXT_PERSISTENT:"mdc-text-field-helper-text--persistent",HELPER_TEXT_VALIDATION_MSG:"mdc-text-field-helper-text--validation-msg",ROOT:"mdc-text-field-helper-text"};var w={ARIA_HIDDEN:"aria-hidden",ROLE:"role",ROOT_SELECTOR:"."+y.ROOT};
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
 */var H=function(e){t(i,e);function i(t){return e.call(this,n(n({},i.defaultAdapter),t))||this}Object.defineProperty(i,"cssClasses",{get:function(){return y},enumerable:false,configurable:true});Object.defineProperty(i,"strings",{get:function(){return w},enumerable:false,configurable:true});Object.defineProperty(i,"defaultAdapter",{get:function(){return{addClass:function(){return undefined},removeClass:function(){return undefined},hasClass:function(){return false},getAttr:function(){return null},setAttr:function(){return undefined},removeAttr:function(){return undefined},setContent:function(){return undefined}}},enumerable:false,configurable:true});i.prototype.getId=function(){return this.adapter.getAttr("id")};i.prototype.isVisible=function(){return this.adapter.getAttr(w.ARIA_HIDDEN)!=="true"};i.prototype.setContent=function(t){this.adapter.setContent(t)};i.prototype.isPersistent=function(){return this.adapter.hasClass(y.HELPER_TEXT_PERSISTENT)};i.prototype.setPersistent=function(t){if(t){this.adapter.addClass(y.HELPER_TEXT_PERSISTENT)}else{this.adapter.removeClass(y.HELPER_TEXT_PERSISTENT)}};i.prototype.isValidation=function(){return this.adapter.hasClass(y.HELPER_TEXT_VALIDATION_MSG)};i.prototype.setValidation=function(t){if(t){this.adapter.addClass(y.HELPER_TEXT_VALIDATION_MSG)}else{this.adapter.removeClass(y.HELPER_TEXT_VALIDATION_MSG)}};i.prototype.showToScreenReader=function(){this.adapter.removeAttr(w.ARIA_HIDDEN)};i.prototype.setValidity=function(t){var n=this.adapter.hasClass(y.HELPER_TEXT_PERSISTENT);var e=this.adapter.hasClass(y.HELPER_TEXT_VALIDATION_MSG);var i=e&&!t;if(i){this.showToScreenReader();if(this.adapter.getAttr(w.ROLE)==="alert"){this.refreshAlertRole()}else{this.adapter.setAttr(w.ROLE,"alert")}}else{this.adapter.removeAttr(w.ROLE)}if(!n&&!i){this.hide()}};i.prototype.hide=function(){this.adapter.setAttr(w.ARIA_HIDDEN,"true")};i.prototype.refreshAlertRole=function(){var t=this;this.adapter.removeAttr(w.ROLE);requestAnimationFrame((function(){t.adapter.setAttr(w.ROLE,"alert")}))};return i}(e);
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
 */var F=function(n){t(e,n);function e(){return n!==null&&n.apply(this,arguments)||this}e.attachTo=function(t){return new e(t)};Object.defineProperty(e.prototype,"foundationForTextField",{get:function(){return this.foundation},enumerable:false,configurable:true});e.prototype.getDefaultFoundation=function(){var t=this;var n={addClass:function(n){return t.root.classList.add(n)},removeClass:function(n){return t.root.classList.remove(n)},hasClass:function(n){return t.root.classList.contains(n)},getAttr:function(n){return t.root.getAttribute(n)},setAttr:function(n,e){return t.root.setAttribute(n,e)},removeAttr:function(n){return t.root.removeAttribute(n)},setContent:function(n){t.root.textContent=n}};return new H(n)};return e}(i);
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
 */var S={ICON_EVENT:"MDCTextField:icon",ICON_ROLE:"button"};var D={ROOT:"mdc-text-field__icon"};
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
 */var P=["click","keydown"];var M=function(e){t(i,e);function i(t){var r=e.call(this,n(n({},i.defaultAdapter),t))||this;r.savedTabIndex=null;r.interactionHandler=function(t){r.handleInteraction(t)};return r}Object.defineProperty(i,"strings",{get:function(){return S},enumerable:false,configurable:true});Object.defineProperty(i,"cssClasses",{get:function(){return D},enumerable:false,configurable:true});Object.defineProperty(i,"defaultAdapter",{get:function(){return{getAttr:function(){return null},setAttr:function(){return undefined},removeAttr:function(){return undefined},setContent:function(){return undefined},registerInteractionHandler:function(){return undefined},deregisterInteractionHandler:function(){return undefined},notifyIconAction:function(){return undefined}}},enumerable:false,configurable:true});i.prototype.init=function(){var t,n;this.savedTabIndex=this.adapter.getAttr("tabindex");try{for(var e=r(P),i=e.next();!i.done;i=e.next()){var u=i.value;this.adapter.registerInteractionHandler(u,this.interactionHandler)}}catch(n){t={error:n}}finally{try{if(i&&!i.done&&(n=e.return))n.call(e)}finally{if(t)throw t.error}}};i.prototype.destroy=function(){var t,n;try{for(var e=r(P),i=e.next();!i.done;i=e.next()){var u=i.value;this.adapter.deregisterInteractionHandler(u,this.interactionHandler)}}catch(n){t={error:n}}finally{try{if(i&&!i.done&&(n=e.return))n.call(e)}finally{if(t)throw t.error}}};i.prototype.setDisabled=function(t){if(!this.savedTabIndex){return}if(t){this.adapter.setAttr("tabindex","-1");this.adapter.removeAttr("role")}else{this.adapter.setAttr("tabindex",this.savedTabIndex);this.adapter.setAttr("role",S.ICON_ROLE)}};i.prototype.setAriaLabel=function(t){this.adapter.setAttr("aria-label",t)};i.prototype.setContent=function(t){this.adapter.setContent(t)};i.prototype.handleInteraction=function(t){var n=t.key==="Enter"||t.keyCode===13;if(t.type==="click"||n){t.preventDefault();this.adapter.notifyIconAction()}};return i}(e);
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
 */var B=function(n){t(e,n);function e(){return n!==null&&n.apply(this,arguments)||this}e.attachTo=function(t){return new e(t)};Object.defineProperty(e.prototype,"foundationForTextField",{get:function(){return this.foundation},enumerable:false,configurable:true});e.prototype.getDefaultFoundation=function(){var t=this;var n={getAttr:function(n){return t.root.getAttribute(n)},setAttr:function(n,e){return t.root.setAttribute(n,e)},removeAttr:function(n){return t.root.removeAttribute(n)},setContent:function(n){t.root.textContent=n},registerInteractionHandler:function(n,e){return t.listen(n,e)},deregisterInteractionHandler:function(n,e){return t.unlisten(n,e)},notifyIconAction:function(){return t.emit(M.strings.ICON_EVENT,{},true)}};return new M(n)};return e}(i);
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
 */var V=function(e){t(i,e);function i(){return e!==null&&e.apply(this,arguments)||this}i.attachTo=function(t){return new i(t)};i.prototype.initialize=function(t,n,e,i,r,u,f){if(t===void 0){t=function(t,n){return new s(t,n)}}if(n===void 0){n=function(t){return new d(t)}}if(e===void 0){e=function(t){return new F(t)}}if(i===void 0){i=function(t){return new L(t)}}if(r===void 0){r=function(t){return new B(t)}}if(u===void 0){u=function(t){return new c(t)}}if(f===void 0){f=function(t){return new O(t)}}this.input=this.root.querySelector(C.INPUT_SELECTOR);var a=this.root.querySelector(C.LABEL_SELECTOR);this.label=a?u(a):null;var o=this.root.querySelector(C.LINE_RIPPLE_SELECTOR);this.lineRipple=o?n(o):null;var h=this.root.querySelector(C.OUTLINE_SELECTOR);this.outline=h?f(h):null;var l=H.strings;var b=this.root.nextElementSibling;var v=b&&b.classList.contains(T.HELPER_LINE);var g=v&&b&&b.querySelector(l.ROOT_SELECTOR);this.helperText=g?e(g):null;var m=p.strings;var E=this.root.querySelector(m.ROOT_SELECTOR);if(!E&&v&&b){E=b.querySelector(m.ROOT_SELECTOR)}this.characterCounter=E?i(E):null;var I=this.root.querySelector(C.LEADING_ICON_SELECTOR);this.leadingIcon=I?r(I):null;var A=this.root.querySelector(C.TRAILING_ICON_SELECTOR);this.trailingIcon=A?r(A):null;this.prefix=this.root.querySelector(C.PREFIX_SELECTOR);this.suffix=this.root.querySelector(C.SUFFIX_SELECTOR);this.ripple=this.createRipple(t)};i.prototype.destroy=function(){if(this.ripple){this.ripple.destroy()}if(this.lineRipple){this.lineRipple.destroy()}if(this.helperText){this.helperText.destroy()}if(this.characterCounter){this.characterCounter.destroy()}if(this.leadingIcon){this.leadingIcon.destroy()}if(this.trailingIcon){this.trailingIcon.destroy()}if(this.label){this.label.destroy()}if(this.outline){this.outline.destroy()}e.prototype.destroy.call(this)};i.prototype.initialSyncWithDOM=function(){this.disabled=this.input.disabled};Object.defineProperty(i.prototype,"value",{get:function(){return this.foundation.getValue()},set:function(t){this.foundation.setValue(t)},enumerable:false,configurable:true});Object.defineProperty(i.prototype,"disabled",{get:function(){return this.foundation.isDisabled()},set:function(t){this.foundation.setDisabled(t)},enumerable:false,configurable:true});Object.defineProperty(i.prototype,"valid",{get:function(){return this.foundation.isValid()},set:function(t){this.foundation.setValid(t)},enumerable:false,configurable:true});Object.defineProperty(i.prototype,"required",{get:function(){return this.input.required},set:function(t){this.input.required=t},enumerable:false,configurable:true});Object.defineProperty(i.prototype,"pattern",{get:function(){return this.input.pattern},set:function(t){this.input.pattern=t},enumerable:false,configurable:true});Object.defineProperty(i.prototype,"minLength",{get:function(){return this.input.minLength},set:function(t){this.input.minLength=t},enumerable:false,configurable:true});Object.defineProperty(i.prototype,"maxLength",{get:function(){return this.input.maxLength},set:function(t){if(t<0){this.input.removeAttribute("maxLength")}else{this.input.maxLength=t}},enumerable:false,configurable:true});Object.defineProperty(i.prototype,"min",{get:function(){return this.input.min},set:function(t){this.input.min=t},enumerable:false,configurable:true});Object.defineProperty(i.prototype,"max",{get:function(){return this.input.max},set:function(t){this.input.max=t},enumerable:false,configurable:true});Object.defineProperty(i.prototype,"step",{get:function(){return this.input.step},set:function(t){this.input.step=t},enumerable:false,configurable:true});Object.defineProperty(i.prototype,"helperTextContent",{set:function(t){this.foundation.setHelperTextContent(t)},enumerable:false,configurable:true});Object.defineProperty(i.prototype,"leadingIconAriaLabel",{set:function(t){this.foundation.setLeadingIconAriaLabel(t)},enumerable:false,configurable:true});Object.defineProperty(i.prototype,"leadingIconContent",{set:function(t){this.foundation.setLeadingIconContent(t)},enumerable:false,configurable:true});Object.defineProperty(i.prototype,"trailingIconAriaLabel",{set:function(t){this.foundation.setTrailingIconAriaLabel(t)},enumerable:false,configurable:true});Object.defineProperty(i.prototype,"trailingIconContent",{set:function(t){this.foundation.setTrailingIconContent(t)},enumerable:false,configurable:true});Object.defineProperty(i.prototype,"useNativeValidation",{set:function(t){this.foundation.setUseNativeValidation(t)},enumerable:false,configurable:true});Object.defineProperty(i.prototype,"prefixText",{get:function(){return this.prefix?this.prefix.textContent:null},set:function(t){if(this.prefix){this.prefix.textContent=t}},enumerable:false,configurable:true});Object.defineProperty(i.prototype,"suffixText",{get:function(){return this.suffix?this.suffix.textContent:null},set:function(t){if(this.suffix){this.suffix.textContent=t}},enumerable:false,configurable:true});i.prototype.focus=function(){this.input.focus()};i.prototype.layout=function(){var t=this.foundation.shouldFloat;this.foundation.notchOutline(t)};i.prototype.getDefaultFoundation=function(){var t=n(n(n(n(n({},this.getRootAdapterMethods()),this.getInputAdapterMethods()),this.getLabelAdapterMethods()),this.getLineRippleAdapterMethods()),this.getOutlineAdapterMethods());return new N(t,this.getFoundationMap())};i.prototype.getRootAdapterMethods=function(){var t=this;return{addClass:function(n){return t.root.classList.add(n)},removeClass:function(n){return t.root.classList.remove(n)},hasClass:function(n){return t.root.classList.contains(n)},registerTextFieldInteractionHandler:function(n,e){t.listen(n,e)},deregisterTextFieldInteractionHandler:function(n,e){t.unlisten(n,e)},registerValidationAttributeChangeHandler:function(n){var e=function(t){return t.map((function(t){return t.attributeName})).filter((function(t){return t}))};var i=new MutationObserver((function(t){return n(e(t))}));var r={attributes:true};i.observe(t.input,r);return i},deregisterValidationAttributeChangeHandler:function(t){t.disconnect()}}};i.prototype.getInputAdapterMethods=function(){var t=this;return{getNativeInput:function(){return t.input},setInputAttr:function(n,e){t.input.setAttribute(n,e)},removeInputAttr:function(n){t.input.removeAttribute(n)},isFocused:function(){return document.activeElement===t.input},registerInputInteractionHandler:function(n,e){t.input.addEventListener(n,e,u())},deregisterInputInteractionHandler:function(n,e){t.input.removeEventListener(n,e,u())}}};i.prototype.getLabelAdapterMethods=function(){var t=this;return{floatLabel:function(n){t.label&&t.label.float(n)},getLabelWidth:function(){return t.label?t.label.getWidth():0},hasLabel:function(){return Boolean(t.label)},shakeLabel:function(n){t.label&&t.label.shake(n)},setLabelRequired:function(n){t.label&&t.label.setRequired(n)}}};i.prototype.getLineRippleAdapterMethods=function(){var t=this;return{activateLineRipple:function(){if(t.lineRipple){t.lineRipple.activate()}},deactivateLineRipple:function(){if(t.lineRipple){t.lineRipple.deactivate()}},setLineRippleTransformOrigin:function(n){if(t.lineRipple){t.lineRipple.setRippleCenter(n)}}}};i.prototype.getOutlineAdapterMethods=function(){var t=this;return{closeOutline:function(){t.outline&&t.outline.closeNotch()},hasOutline:function(){return Boolean(t.outline)},notchOutline:function(n){t.outline&&t.outline.notch(n)}}};i.prototype.getFoundationMap=function(){return{characterCounter:this.characterCounter?this.characterCounter.foundationForTextField:undefined,helperText:this.helperText?this.helperText.foundationForTextField:undefined,leadingIcon:this.leadingIcon?this.leadingIcon.foundationForTextField:undefined,trailingIcon:this.trailingIcon?this.trailingIcon.foundationForTextField:undefined}};i.prototype.createRipple=function(t){var e=this;var i=this.root.classList.contains(T.TEXTAREA);var r=this.root.classList.contains(T.OUTLINED);if(i||r){return null}var o=n(n({},s.createAdapter(this)),{isSurfaceActive:function(){return a(e.input,":active")},registerInteractionHandler:function(t,n){e.input.addEventListener(t,n,u())},deregisterInteractionHandler:function(t,n){e.input.removeEventListener(t,n,u())}});return t(this.root,new f(o))};return i}(i);export{V as M};
//# sourceMappingURL=component-ef1bdf45.js.map