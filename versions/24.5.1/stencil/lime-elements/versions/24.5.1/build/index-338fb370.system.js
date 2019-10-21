System.register(["./tslib.es6-7ed43ca5.system.js","./component-3c9a5fc6.system.js","./index-9e4ad403.system.js","./index-db0617d9.system.js","./component-58a5bd7e.system.js"],(function(t){"use strict";var e,n,i,r,o,a,u,s,l,d;return{setters:[function(t){e=t._;n=t.a},function(t){i=t.M;r=t.a},function(t){o=t.m},function(t){a=t.M;u=t.a;s=t.b},function(t){l=t.M;d=t.a}],execute:function(){
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
             */
var c={ROOT:"mdc-text-field-character-counter"};var f={ROOT_SELECTOR:"."+c.ROOT};
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
             */var p=function(t){e(i,t);function i(e){return t.call(this,n({},i.defaultAdapter,e))||this}Object.defineProperty(i,"cssClasses",{get:function(){return c},enumerable:true,configurable:true});Object.defineProperty(i,"strings",{get:function(){return f},enumerable:true,configurable:true});Object.defineProperty(i,"defaultAdapter",{get:function(){return{setContent:function(){return undefined}}},enumerable:true,configurable:true});i.prototype.setCounterValue=function(t,e){t=Math.min(t,e);this.adapter_.setContent(t+" / "+e)};return i}(i);
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
             */var h=function(t){e(n,t);function n(){return t!==null&&t.apply(this,arguments)||this}n.attachTo=function(t){return new n(t)};Object.defineProperty(n.prototype,"foundation",{get:function(){return this.foundation_},enumerable:true,configurable:true});n.prototype.getDefaultFoundation=function(){var t=this;var e={setContent:function(e){t.root_.textContent=e}};return new p(e)};return n}(r);
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
             */var _={ARIA_CONTROLS:"aria-controls",ICON_SELECTOR:".mdc-text-field__icon",INPUT_SELECTOR:".mdc-text-field__input",LABEL_SELECTOR:".mdc-floating-label",LINE_RIPPLE_SELECTOR:".mdc-line-ripple",OUTLINE_SELECTOR:".mdc-notched-outline"};var g={DENSE:"mdc-text-field--dense",DISABLED:"mdc-text-field--disabled",FOCUSED:"mdc-text-field--focused",HELPER_LINE:"mdc-text-field-helper-line",INVALID:"mdc-text-field--invalid",OUTLINED:"mdc-text-field--outlined",ROOT:"mdc-text-field",TEXTAREA:"mdc-text-field--textarea",WITH_LEADING_ICON:"mdc-text-field--with-leading-icon"};var b={DENSE_LABEL_SCALE:.923,LABEL_SCALE:.75};var v=["pattern","min","max","required","step","minlength","maxlength"];var y=["color","date","datetime-local","month","range","time","week"];
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
             */var I=["mousedown","touchstart"];var L=["click","keydown"];var E=function(t){e(i,t);function i(e,r){if(r===void 0){r={}}var o=t.call(this,n({},i.defaultAdapter,e))||this;o.isFocused_=false;o.receivedUserInput_=false;o.isValid_=true;o.useNativeValidation_=true;o.helperText_=r.helperText;o.characterCounter_=r.characterCounter;o.leadingIcon_=r.leadingIcon;o.trailingIcon_=r.trailingIcon;o.inputFocusHandler_=function(){return o.activateFocus()};o.inputBlurHandler_=function(){return o.deactivateFocus()};o.inputInputHandler_=function(){return o.handleInput()};o.setPointerXOffset_=function(t){return o.setTransformOrigin(t)};o.textFieldInteractionHandler_=function(){return o.handleTextFieldInteraction()};o.validationAttributeChangeHandler_=function(t){return o.handleValidationAttributeChange(t)};return o}Object.defineProperty(i,"cssClasses",{get:function(){return g},enumerable:true,configurable:true});Object.defineProperty(i,"strings",{get:function(){return _},enumerable:true,configurable:true});Object.defineProperty(i,"numbers",{get:function(){return b},enumerable:true,configurable:true});Object.defineProperty(i.prototype,"shouldAlwaysFloat_",{get:function(){var t=this.getNativeInput_().type;return y.indexOf(t)>=0},enumerable:true,configurable:true});Object.defineProperty(i.prototype,"shouldFloat",{get:function(){return this.shouldAlwaysFloat_||this.isFocused_||Boolean(this.getValue())||this.isBadInput_()},enumerable:true,configurable:true});Object.defineProperty(i.prototype,"shouldShake",{get:function(){return!this.isFocused_&&!this.isValid()&&Boolean(this.getValue())},enumerable:true,configurable:true});Object.defineProperty(i,"defaultAdapter",{get:function(){return{addClass:function(){return undefined},removeClass:function(){return undefined},hasClass:function(){return true},registerTextFieldInteractionHandler:function(){return undefined},deregisterTextFieldInteractionHandler:function(){return undefined},registerInputInteractionHandler:function(){return undefined},deregisterInputInteractionHandler:function(){return undefined},registerValidationAttributeChangeHandler:function(){return new MutationObserver((function(){return undefined}))},deregisterValidationAttributeChangeHandler:function(){return undefined},getNativeInput:function(){return null},isFocused:function(){return false},activateLineRipple:function(){return undefined},deactivateLineRipple:function(){return undefined},setLineRippleTransformOrigin:function(){return undefined},shakeLabel:function(){return undefined},floatLabel:function(){return undefined},hasLabel:function(){return false},getLabelWidth:function(){return 0},hasOutline:function(){return false},notchOutline:function(){return undefined},closeOutline:function(){return undefined}}},enumerable:true,configurable:true});i.prototype.init=function(){var t=this;if(this.adapter_.isFocused()){this.inputFocusHandler_()}else if(this.adapter_.hasLabel()&&this.shouldFloat){this.notchOutline(true);this.adapter_.floatLabel(true)}this.adapter_.registerInputInteractionHandler("focus",this.inputFocusHandler_);this.adapter_.registerInputInteractionHandler("blur",this.inputBlurHandler_);this.adapter_.registerInputInteractionHandler("input",this.inputInputHandler_);I.forEach((function(e){t.adapter_.registerInputInteractionHandler(e,t.setPointerXOffset_)}));L.forEach((function(e){t.adapter_.registerTextFieldInteractionHandler(e,t.textFieldInteractionHandler_)}));this.validationObserver_=this.adapter_.registerValidationAttributeChangeHandler(this.validationAttributeChangeHandler_);this.setCharacterCounter_(this.getValue().length)};i.prototype.destroy=function(){var t=this;this.adapter_.deregisterInputInteractionHandler("focus",this.inputFocusHandler_);this.adapter_.deregisterInputInteractionHandler("blur",this.inputBlurHandler_);this.adapter_.deregisterInputInteractionHandler("input",this.inputInputHandler_);I.forEach((function(e){t.adapter_.deregisterInputInteractionHandler(e,t.setPointerXOffset_)}));L.forEach((function(e){t.adapter_.deregisterTextFieldInteractionHandler(e,t.textFieldInteractionHandler_)}));this.adapter_.deregisterValidationAttributeChangeHandler(this.validationObserver_)};i.prototype.handleTextFieldInteraction=function(){var t=this.adapter_.getNativeInput();if(t&&t.disabled){return}this.receivedUserInput_=true};i.prototype.handleValidationAttributeChange=function(t){var e=this;t.some((function(t){if(v.indexOf(t)>-1){e.styleValidity_(true);return true}return false}));if(t.indexOf("maxlength")>-1){this.setCharacterCounter_(this.getValue().length)}};i.prototype.notchOutline=function(t){if(!this.adapter_.hasOutline()){return}if(t){var e=this.adapter_.hasClass(g.DENSE);var n=e?b.DENSE_LABEL_SCALE:b.LABEL_SCALE;var i=this.adapter_.getLabelWidth()*n;this.adapter_.notchOutline(i)}else{this.adapter_.closeOutline()}};i.prototype.activateFocus=function(){this.isFocused_=true;this.styleFocused_(this.isFocused_);this.adapter_.activateLineRipple();if(this.adapter_.hasLabel()){this.notchOutline(this.shouldFloat);this.adapter_.floatLabel(this.shouldFloat);this.adapter_.shakeLabel(this.shouldShake)}if(this.helperText_){this.helperText_.showToScreenReader()}};i.prototype.setTransformOrigin=function(t){var e=t.touches;var n=e?e[0]:t;var i=n.target.getBoundingClientRect();var r=n.clientX-i.left;this.adapter_.setLineRippleTransformOrigin(r)};i.prototype.handleInput=function(){this.autoCompleteFocus();this.setCharacterCounter_(this.getValue().length)};i.prototype.autoCompleteFocus=function(){if(!this.receivedUserInput_){this.activateFocus()}};i.prototype.deactivateFocus=function(){this.isFocused_=false;this.adapter_.deactivateLineRipple();var t=this.isValid();this.styleValidity_(t);this.styleFocused_(this.isFocused_);if(this.adapter_.hasLabel()){this.notchOutline(this.shouldFloat);this.adapter_.floatLabel(this.shouldFloat);this.adapter_.shakeLabel(this.shouldShake)}if(!this.shouldFloat){this.receivedUserInput_=false}};i.prototype.getValue=function(){return this.getNativeInput_().value};i.prototype.setValue=function(t){if(this.getValue()!==t){this.getNativeInput_().value=t;this.setCharacterCounter_(t.length)}var e=this.isValid();this.styleValidity_(e);if(this.adapter_.hasLabel()){this.notchOutline(this.shouldFloat);this.adapter_.floatLabel(this.shouldFloat);this.adapter_.shakeLabel(this.shouldShake)}};i.prototype.isValid=function(){return this.useNativeValidation_?this.isNativeInputValid_():this.isValid_};i.prototype.setValid=function(t){this.isValid_=t;this.styleValidity_(t);var e=!t&&!this.isFocused_;if(this.adapter_.hasLabel()){this.adapter_.shakeLabel(e)}};i.prototype.setUseNativeValidation=function(t){this.useNativeValidation_=t};i.prototype.isDisabled=function(){return this.getNativeInput_().disabled};i.prototype.setDisabled=function(t){this.getNativeInput_().disabled=t;this.styleDisabled_(t)};i.prototype.setHelperTextContent=function(t){if(this.helperText_){this.helperText_.setContent(t)}};i.prototype.setLeadingIconAriaLabel=function(t){if(this.leadingIcon_){this.leadingIcon_.setAriaLabel(t)}};i.prototype.setLeadingIconContent=function(t){if(this.leadingIcon_){this.leadingIcon_.setContent(t)}};i.prototype.setTrailingIconAriaLabel=function(t){if(this.trailingIcon_){this.trailingIcon_.setAriaLabel(t)}};i.prototype.setTrailingIconContent=function(t){if(this.trailingIcon_){this.trailingIcon_.setContent(t)}};i.prototype.setCharacterCounter_=function(t){if(!this.characterCounter_){return}var e=this.getNativeInput_().maxLength;if(e===-1){throw new Error("MDCTextFieldFoundation: Expected maxlength html property on text input or textarea.")}this.characterCounter_.setCounterValue(t,e)};i.prototype.isBadInput_=function(){return this.getNativeInput_().validity.badInput||false};i.prototype.isNativeInputValid_=function(){return this.getNativeInput_().validity.valid};i.prototype.styleValidity_=function(t){var e=i.cssClasses.INVALID;if(t){this.adapter_.removeClass(e)}else{this.adapter_.addClass(e)}if(this.helperText_){this.helperText_.setValidity(t)}};i.prototype.styleFocused_=function(t){var e=i.cssClasses.FOCUSED;if(t){this.adapter_.addClass(e)}else{this.adapter_.removeClass(e)}};i.prototype.styleDisabled_=function(t){var e=i.cssClasses,n=e.DISABLED,r=e.INVALID;if(t){this.adapter_.addClass(n);this.adapter_.removeClass(r)}else{this.adapter_.removeClass(n)}if(this.leadingIcon_){this.leadingIcon_.setDisabled(t)}if(this.trailingIcon_){this.trailingIcon_.setDisabled(t)}};i.prototype.getNativeInput_=function(){var t=this.adapter_?this.adapter_.getNativeInput():null;return t||{disabled:false,maxLength:-1,type:"input",validity:{badInput:false,valid:true},value:""}};return i}(i);
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
             */var m={HELPER_TEXT_PERSISTENT:"mdc-text-field-helper-text--persistent",HELPER_TEXT_VALIDATION_MSG:"mdc-text-field-helper-text--validation-msg",ROOT:"mdc-text-field-helper-text"};var C={ARIA_HIDDEN:"aria-hidden",ROLE:"role",ROOT_SELECTOR:"."+m.ROOT};
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
             */var O=function(t){e(i,t);function i(e){return t.call(this,n({},i.defaultAdapter,e))||this}Object.defineProperty(i,"cssClasses",{get:function(){return m},enumerable:true,configurable:true});Object.defineProperty(i,"strings",{get:function(){return C},enumerable:true,configurable:true});Object.defineProperty(i,"defaultAdapter",{get:function(){return{addClass:function(){return undefined},removeClass:function(){return undefined},hasClass:function(){return false},setAttr:function(){return undefined},removeAttr:function(){return undefined},setContent:function(){return undefined}}},enumerable:true,configurable:true});i.prototype.setContent=function(t){this.adapter_.setContent(t)};i.prototype.setPersistent=function(t){if(t){this.adapter_.addClass(m.HELPER_TEXT_PERSISTENT)}else{this.adapter_.removeClass(m.HELPER_TEXT_PERSISTENT)}};i.prototype.setValidation=function(t){if(t){this.adapter_.addClass(m.HELPER_TEXT_VALIDATION_MSG)}else{this.adapter_.removeClass(m.HELPER_TEXT_VALIDATION_MSG)}};i.prototype.showToScreenReader=function(){this.adapter_.removeAttr(C.ARIA_HIDDEN)};i.prototype.setValidity=function(t){var e=this.adapter_.hasClass(m.HELPER_TEXT_PERSISTENT);var n=this.adapter_.hasClass(m.HELPER_TEXT_VALIDATION_MSG);var i=n&&!t;if(i){this.adapter_.setAttr(C.ROLE,"alert")}else{this.adapter_.removeAttr(C.ROLE)}if(!e&&!i){this.hide_()}};i.prototype.hide_=function(){this.adapter_.setAttr(C.ARIA_HIDDEN,"true")};return i}(i);
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
             */var T=function(t){e(n,t);function n(){return t!==null&&t.apply(this,arguments)||this}n.attachTo=function(t){return new n(t)};Object.defineProperty(n.prototype,"foundation",{get:function(){return this.foundation_},enumerable:true,configurable:true});n.prototype.getDefaultFoundation=function(){var t=this;var e={addClass:function(e){return t.root_.classList.add(e)},removeClass:function(e){return t.root_.classList.remove(e)},hasClass:function(e){return t.root_.classList.contains(e)},setAttr:function(e,n){return t.root_.setAttribute(e,n)},removeAttr:function(e){return t.root_.removeAttribute(e)},setContent:function(e){t.root_.textContent=e}};return new O(e)};return n}(r);
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
             */var A={ICON_EVENT:"MDCTextField:icon",ICON_ROLE:"button"};
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
             */var x=["click","keydown"];var R=function(t){e(i,t);function i(e){var r=t.call(this,n({},i.defaultAdapter,e))||this;r.savedTabIndex_=null;r.interactionHandler_=function(t){return r.handleInteraction(t)};return r}Object.defineProperty(i,"strings",{get:function(){return A},enumerable:true,configurable:true});Object.defineProperty(i,"defaultAdapter",{get:function(){return{getAttr:function(){return null},setAttr:function(){return undefined},removeAttr:function(){return undefined},setContent:function(){return undefined},registerInteractionHandler:function(){return undefined},deregisterInteractionHandler:function(){return undefined},notifyIconAction:function(){return undefined}}},enumerable:true,configurable:true});i.prototype.init=function(){var t=this;this.savedTabIndex_=this.adapter_.getAttr("tabindex");x.forEach((function(e){t.adapter_.registerInteractionHandler(e,t.interactionHandler_)}))};i.prototype.destroy=function(){var t=this;x.forEach((function(e){t.adapter_.deregisterInteractionHandler(e,t.interactionHandler_)}))};i.prototype.setDisabled=function(t){if(!this.savedTabIndex_){return}if(t){this.adapter_.setAttr("tabindex","-1");this.adapter_.removeAttr("role")}else{this.adapter_.setAttr("tabindex",this.savedTabIndex_);this.adapter_.setAttr("role",A.ICON_ROLE)}};i.prototype.setAriaLabel=function(t){this.adapter_.setAttr("aria-label",t)};i.prototype.setContent=function(t){this.adapter_.setContent(t)};i.prototype.handleInteraction=function(t){var e=t.key==="Enter"||t.keyCode===13;if(t.type==="click"||e){this.adapter_.notifyIconAction()}};return i}(i);
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
             */var H=function(t){e(n,t);function n(){return t!==null&&t.apply(this,arguments)||this}n.attachTo=function(t){return new n(t)};Object.defineProperty(n.prototype,"foundation",{get:function(){return this.foundation_},enumerable:true,configurable:true});n.prototype.getDefaultFoundation=function(){var t=this;var e={getAttr:function(e){return t.root_.getAttribute(e)},setAttr:function(e,n){return t.root_.setAttribute(e,n)},removeAttr:function(e){return t.root_.removeAttribute(e)},setContent:function(e){t.root_.textContent=e},registerInteractionHandler:function(e,n){return t.listen(e,n)},deregisterInteractionHandler:function(e,n){return t.unlisten(e,n)},notifyIconAction:function(){return t.emit(R.strings.ICON_EVENT,{},true)}};return new R(e)};return n}(r);
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
             */var N=t("M",function(t){e(i,t);function i(){return t!==null&&t.apply(this,arguments)||this}i.attachTo=function(t){return new i(t)};i.prototype.initialize=function(t,e,n,i,r,o,d){if(t===void 0){t=function(t,e){return new l(t,e)}}if(e===void 0){e=function(t){return new a(t)}}if(n===void 0){n=function(t){return new T(t)}}if(i===void 0){i=function(t){return new h(t)}}if(r===void 0){r=function(t){return new H(t)}}if(o===void 0){o=function(t){return new u(t)}}if(d===void 0){d=function(t){return new s(t)}}this.input_=this.root_.querySelector(_.INPUT_SELECTOR);var c=this.root_.querySelector(_.LABEL_SELECTOR);this.label_=c?o(c):null;var f=this.root_.querySelector(_.LINE_RIPPLE_SELECTOR);this.lineRipple_=f?e(f):null;var b=this.root_.querySelector(_.OUTLINE_SELECTOR);this.outline_=b?d(b):null;var v=O.strings;var y=this.root_.nextElementSibling;var I=y&&y.classList.contains(g.HELPER_LINE);var L=I&&y&&y.querySelector(v.ROOT_SELECTOR);this.helperText_=L?n(L):null;var E=p.strings;var m=this.root_.querySelector(E.ROOT_SELECTOR);if(!m&&I&&y){m=y.querySelector(E.ROOT_SELECTOR)}this.characterCounter_=m?i(m):null;this.leadingIcon_=null;this.trailingIcon_=null;var C=this.root_.querySelectorAll(_.ICON_SELECTOR);if(C.length>0){if(C.length>1){this.leadingIcon_=r(C[0]);this.trailingIcon_=r(C[1])}else{if(this.root_.classList.contains(g.WITH_LEADING_ICON)){this.leadingIcon_=r(C[0])}else{this.trailingIcon_=r(C[0])}}}this.ripple=this.createRipple_(t)};i.prototype.destroy=function(){if(this.ripple){this.ripple.destroy()}if(this.lineRipple_){this.lineRipple_.destroy()}if(this.helperText_){this.helperText_.destroy()}if(this.characterCounter_){this.characterCounter_.destroy()}if(this.leadingIcon_){this.leadingIcon_.destroy()}if(this.trailingIcon_){this.trailingIcon_.destroy()}if(this.label_){this.label_.destroy()}if(this.outline_){this.outline_.destroy()}t.prototype.destroy.call(this)};i.prototype.initialSyncWithDOM=function(){this.disabled=this.input_.disabled};Object.defineProperty(i.prototype,"value",{get:function(){return this.foundation_.getValue()},set:function(t){this.foundation_.setValue(t)},enumerable:true,configurable:true});Object.defineProperty(i.prototype,"disabled",{get:function(){return this.foundation_.isDisabled()},set:function(t){this.foundation_.setDisabled(t)},enumerable:true,configurable:true});Object.defineProperty(i.prototype,"valid",{get:function(){return this.foundation_.isValid()},set:function(t){this.foundation_.setValid(t)},enumerable:true,configurable:true});Object.defineProperty(i.prototype,"required",{get:function(){return this.input_.required},set:function(t){this.input_.required=t},enumerable:true,configurable:true});Object.defineProperty(i.prototype,"pattern",{get:function(){return this.input_.pattern},set:function(t){this.input_.pattern=t},enumerable:true,configurable:true});Object.defineProperty(i.prototype,"minLength",{get:function(){return this.input_.minLength},set:function(t){this.input_.minLength=t},enumerable:true,configurable:true});Object.defineProperty(i.prototype,"maxLength",{get:function(){return this.input_.maxLength},set:function(t){if(t<0){this.input_.removeAttribute("maxLength")}else{this.input_.maxLength=t}},enumerable:true,configurable:true});Object.defineProperty(i.prototype,"min",{get:function(){return this.input_.min},set:function(t){this.input_.min=t},enumerable:true,configurable:true});Object.defineProperty(i.prototype,"max",{get:function(){return this.input_.max},set:function(t){this.input_.max=t},enumerable:true,configurable:true});Object.defineProperty(i.prototype,"step",{get:function(){return this.input_.step},set:function(t){this.input_.step=t},enumerable:true,configurable:true});Object.defineProperty(i.prototype,"helperTextContent",{set:function(t){this.foundation_.setHelperTextContent(t)},enumerable:true,configurable:true});Object.defineProperty(i.prototype,"leadingIconAriaLabel",{set:function(t){this.foundation_.setLeadingIconAriaLabel(t)},enumerable:true,configurable:true});Object.defineProperty(i.prototype,"leadingIconContent",{set:function(t){this.foundation_.setLeadingIconContent(t)},enumerable:true,configurable:true});Object.defineProperty(i.prototype,"trailingIconAriaLabel",{set:function(t){this.foundation_.setTrailingIconAriaLabel(t)},enumerable:true,configurable:true});Object.defineProperty(i.prototype,"trailingIconContent",{set:function(t){this.foundation_.setTrailingIconContent(t)},enumerable:true,configurable:true});Object.defineProperty(i.prototype,"useNativeValidation",{set:function(t){this.foundation_.setUseNativeValidation(t)},enumerable:true,configurable:true});i.prototype.focus=function(){this.input_.focus()};i.prototype.layout=function(){var t=this.foundation_.shouldFloat;this.foundation_.notchOutline(t)};i.prototype.getDefaultFoundation=function(){var t=n({},this.getRootAdapterMethods_(),this.getInputAdapterMethods_(),this.getLabelAdapterMethods_(),this.getLineRippleAdapterMethods_(),this.getOutlineAdapterMethods_());return new E(t,this.getFoundationMap_())};i.prototype.getRootAdapterMethods_=function(){var t=this;return{addClass:function(e){return t.root_.classList.add(e)},removeClass:function(e){return t.root_.classList.remove(e)},hasClass:function(e){return t.root_.classList.contains(e)},registerTextFieldInteractionHandler:function(e,n){return t.listen(e,n)},deregisterTextFieldInteractionHandler:function(e,n){return t.unlisten(e,n)},registerValidationAttributeChangeHandler:function(e){var n=function(t){return t.map((function(t){return t.attributeName})).filter((function(t){return t}))};var i=new MutationObserver((function(t){return e(n(t))}));var r={attributes:true};i.observe(t.input_,r);return i},deregisterValidationAttributeChangeHandler:function(t){return t.disconnect()}}};i.prototype.getInputAdapterMethods_=function(){var t=this;return{getNativeInput:function(){return t.input_},isFocused:function(){return document.activeElement===t.input_},registerInputInteractionHandler:function(e,n){return t.input_.addEventListener(e,n)},deregisterInputInteractionHandler:function(e,n){return t.input_.removeEventListener(e,n)}}};i.prototype.getLabelAdapterMethods_=function(){var t=this;return{floatLabel:function(e){return t.label_&&t.label_.float(e)},getLabelWidth:function(){return t.label_?t.label_.getWidth():0},hasLabel:function(){return Boolean(t.label_)},shakeLabel:function(e){return t.label_&&t.label_.shake(e)}}};i.prototype.getLineRippleAdapterMethods_=function(){var t=this;return{activateLineRipple:function(){if(t.lineRipple_){t.lineRipple_.activate()}},deactivateLineRipple:function(){if(t.lineRipple_){t.lineRipple_.deactivate()}},setLineRippleTransformOrigin:function(e){if(t.lineRipple_){t.lineRipple_.setRippleCenter(e)}}}};i.prototype.getOutlineAdapterMethods_=function(){var t=this;return{closeOutline:function(){return t.outline_&&t.outline_.closeNotch()},hasOutline:function(){return Boolean(t.outline_)},notchOutline:function(e){return t.outline_&&t.outline_.notch(e)}}};i.prototype.getFoundationMap_=function(){return{characterCounter:this.characterCounter_?this.characterCounter_.foundation:undefined,helperText:this.helperText_?this.helperText_.foundation:undefined,leadingIcon:this.leadingIcon_?this.leadingIcon_.foundation:undefined,trailingIcon:this.trailingIcon_?this.trailingIcon_.foundation:undefined}};i.prototype.createRipple_=function(t){var e=this;var i=this.root_.classList.contains(g.TEXTAREA);var r=this.root_.classList.contains(g.OUTLINED);if(i||r){return null}var a=n({},l.createAdapter(this),{isSurfaceActive:function(){return o(e.input_,":active")},registerInteractionHandler:function(t,n){return e.input_.addEventListener(t,n)},deregisterInteractionHandler:function(t,n){return e.input_.removeEventListener(t,n)}});return t(this.root_,new d(a))};return i}(r))}}}));