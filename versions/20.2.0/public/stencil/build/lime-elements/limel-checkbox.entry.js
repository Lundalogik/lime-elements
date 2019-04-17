const h = window.LimeElements.h;

import { a as MDCRipple, b as MDCRippleFoundation } from './chunk-b81c6061.js';
import { a as __extends, b as __assign, d as __values } from './chunk-2005b219.js';
import { a as MDCFoundation, b as MDCComponent } from './chunk-21be808b.js';
import { a as matches$1, b as closest } from './chunk-0566d4fa.js';
import './chunk-cb442e7b.js';
import { a as getCorrectEventName } from './chunk-bb8fcad1.js';
import { a as createRandomString } from './chunk-f12b16ef.js';
import { a as CheckboxTemplate } from './chunk-c623a65d.js';
import { a as dispatchResizeEvent } from './chunk-8d9b902c.js';
import { a as MDCFloatingLabel, b as MDCLineRipple, c as MDCNotchedOutline } from './chunk-10e16363.js';
import { a as MDCMenu, b as strings$7, c as strings$8, d as Corner } from './chunk-ff5ca0b3.js';
import { a as isArray, b as isMobileDevice } from './chunk-f4f20226.js';
import { a as ENTER, b as ENTER_KEY_CODE, c as SPACE, d as SPACE_KEY_CODE, e as ESCAPE, f as ESCAPE_KEY_CODE } from './chunk-41a663e3.js';

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
 */
var cssClasses = {
    ANIM_CHECKED_INDETERMINATE: 'mdc-checkbox--anim-checked-indeterminate',
    ANIM_CHECKED_UNCHECKED: 'mdc-checkbox--anim-checked-unchecked',
    ANIM_INDETERMINATE_CHECKED: 'mdc-checkbox--anim-indeterminate-checked',
    ANIM_INDETERMINATE_UNCHECKED: 'mdc-checkbox--anim-indeterminate-unchecked',
    ANIM_UNCHECKED_CHECKED: 'mdc-checkbox--anim-unchecked-checked',
    ANIM_UNCHECKED_INDETERMINATE: 'mdc-checkbox--anim-unchecked-indeterminate',
    CHECKED: 'mdc-checkbox--checked',
    DISABLED: 'mdc-checkbox--disabled',
    INDETERMINATE: 'mdc-checkbox--indeterminate',
    UPGRADED: 'mdc-checkbox--upgraded',
};
var strings = {
    ARIA_CHECKED_ATTR: 'aria-checked',
    ARIA_CHECKED_INDETERMINATE_VALUE: 'mixed',
    NATIVE_CONTROL_SELECTOR: '.mdc-checkbox__native-control',
    TRANSITION_STATE_CHECKED: 'checked',
    TRANSITION_STATE_INDETERMINATE: 'indeterminate',
    TRANSITION_STATE_INIT: 'init',
    TRANSITION_STATE_UNCHECKED: 'unchecked',
};
var numbers = {
    ANIM_END_LATCH_MS: 250,
};

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
 */
var MDCCheckboxFoundation = /** @class */ (function (_super) {
    __extends(MDCCheckboxFoundation, _super);
    function MDCCheckboxFoundation(adapter) {
        var _this = _super.call(this, __assign({}, MDCCheckboxFoundation.defaultAdapter, adapter)) || this;
        _this.currentCheckState_ = strings.TRANSITION_STATE_INIT;
        _this.currentAnimationClass_ = '';
        _this.animEndLatchTimer_ = 0;
        _this.enableAnimationEndHandler_ = false;
        return _this;
    }
    Object.defineProperty(MDCCheckboxFoundation, "cssClasses", {
        get: function () {
            return cssClasses;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCCheckboxFoundation, "strings", {
        get: function () {
            return strings;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCCheckboxFoundation, "numbers", {
        get: function () {
            return numbers;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCCheckboxFoundation, "defaultAdapter", {
        get: function () {
            return {
                addClass: function () { return undefined; },
                forceLayout: function () { return undefined; },
                hasNativeControl: function () { return false; },
                isAttachedToDOM: function () { return false; },
                isChecked: function () { return false; },
                isIndeterminate: function () { return false; },
                removeClass: function () { return undefined; },
                removeNativeControlAttr: function () { return undefined; },
                setNativeControlAttr: function () { return undefined; },
                setNativeControlDisabled: function () { return undefined; },
            };
        },
        enumerable: true,
        configurable: true
    });
    MDCCheckboxFoundation.prototype.init = function () {
        this.currentCheckState_ = this.determineCheckState_();
        this.updateAriaChecked_();
        this.adapter_.addClass(cssClasses.UPGRADED);
    };
    MDCCheckboxFoundation.prototype.destroy = function () {
        clearTimeout(this.animEndLatchTimer_);
    };
    MDCCheckboxFoundation.prototype.setDisabled = function (disabled) {
        this.adapter_.setNativeControlDisabled(disabled);
        if (disabled) {
            this.adapter_.addClass(cssClasses.DISABLED);
        }
        else {
            this.adapter_.removeClass(cssClasses.DISABLED);
        }
    };
    /**
     * Handles the animationend event for the checkbox
     */
    MDCCheckboxFoundation.prototype.handleAnimationEnd = function () {
        var _this = this;
        if (!this.enableAnimationEndHandler_) {
            return;
        }
        clearTimeout(this.animEndLatchTimer_);
        this.animEndLatchTimer_ = setTimeout(function () {
            _this.adapter_.removeClass(_this.currentAnimationClass_);
            _this.enableAnimationEndHandler_ = false;
        }, numbers.ANIM_END_LATCH_MS);
    };
    /**
     * Handles the change event for the checkbox
     */
    MDCCheckboxFoundation.prototype.handleChange = function () {
        this.transitionCheckState_();
    };
    MDCCheckboxFoundation.prototype.transitionCheckState_ = function () {
        if (!this.adapter_.hasNativeControl()) {
            return;
        }
        var oldState = this.currentCheckState_;
        var newState = this.determineCheckState_();
        if (oldState === newState) {
            return;
        }
        this.updateAriaChecked_();
        // Check to ensure that there isn't a previously existing animation class, in case for example
        // the user interacted with the checkbox before the animation was finished.
        if (this.currentAnimationClass_.length > 0) {
            clearTimeout(this.animEndLatchTimer_);
            this.adapter_.forceLayout();
            this.adapter_.removeClass(this.currentAnimationClass_);
        }
        this.currentAnimationClass_ = this.getTransitionAnimationClass_(oldState, newState);
        this.currentCheckState_ = newState;
        // Check for parentNode so that animations are only run when the element is attached
        // to the DOM.
        if (this.adapter_.isAttachedToDOM() && this.currentAnimationClass_.length > 0) {
            this.adapter_.addClass(this.currentAnimationClass_);
            this.enableAnimationEndHandler_ = true;
        }
    };
    MDCCheckboxFoundation.prototype.determineCheckState_ = function () {
        var TRANSITION_STATE_INDETERMINATE = strings.TRANSITION_STATE_INDETERMINATE, TRANSITION_STATE_CHECKED = strings.TRANSITION_STATE_CHECKED, TRANSITION_STATE_UNCHECKED = strings.TRANSITION_STATE_UNCHECKED;
        if (this.adapter_.isIndeterminate()) {
            return TRANSITION_STATE_INDETERMINATE;
        }
        return this.adapter_.isChecked() ? TRANSITION_STATE_CHECKED : TRANSITION_STATE_UNCHECKED;
    };
    MDCCheckboxFoundation.prototype.getTransitionAnimationClass_ = function (oldState, newState) {
        var TRANSITION_STATE_INIT = strings.TRANSITION_STATE_INIT, TRANSITION_STATE_CHECKED = strings.TRANSITION_STATE_CHECKED, TRANSITION_STATE_UNCHECKED = strings.TRANSITION_STATE_UNCHECKED;
        var _a = MDCCheckboxFoundation.cssClasses, ANIM_UNCHECKED_CHECKED = _a.ANIM_UNCHECKED_CHECKED, ANIM_UNCHECKED_INDETERMINATE = _a.ANIM_UNCHECKED_INDETERMINATE, ANIM_CHECKED_UNCHECKED = _a.ANIM_CHECKED_UNCHECKED, ANIM_CHECKED_INDETERMINATE = _a.ANIM_CHECKED_INDETERMINATE, ANIM_INDETERMINATE_CHECKED = _a.ANIM_INDETERMINATE_CHECKED, ANIM_INDETERMINATE_UNCHECKED = _a.ANIM_INDETERMINATE_UNCHECKED;
        switch (oldState) {
            case TRANSITION_STATE_INIT:
                if (newState === TRANSITION_STATE_UNCHECKED) {
                    return '';
                }
                return newState === TRANSITION_STATE_CHECKED ? ANIM_INDETERMINATE_CHECKED : ANIM_INDETERMINATE_UNCHECKED;
            case TRANSITION_STATE_UNCHECKED:
                return newState === TRANSITION_STATE_CHECKED ? ANIM_UNCHECKED_CHECKED : ANIM_UNCHECKED_INDETERMINATE;
            case TRANSITION_STATE_CHECKED:
                return newState === TRANSITION_STATE_UNCHECKED ? ANIM_CHECKED_UNCHECKED : ANIM_CHECKED_INDETERMINATE;
            default: // TRANSITION_STATE_INDETERMINATE
                return newState === TRANSITION_STATE_CHECKED ? ANIM_INDETERMINATE_CHECKED : ANIM_INDETERMINATE_UNCHECKED;
        }
    };
    MDCCheckboxFoundation.prototype.updateAriaChecked_ = function () {
        // Ensure aria-checked is set to mixed if checkbox is in indeterminate state.
        if (this.adapter_.isIndeterminate()) {
            this.adapter_.setNativeControlAttr(strings.ARIA_CHECKED_ATTR, strings.ARIA_CHECKED_INDETERMINATE_VALUE);
        }
        else {
            // The on/off state does not need to keep track of aria-checked, since
            // the screenreader uses the checked property on the checkbox element.
            this.adapter_.removeNativeControlAttr(strings.ARIA_CHECKED_ATTR);
        }
    };
    return MDCCheckboxFoundation;
}(MDCFoundation));

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
 */
var CB_PROTO_PROPS = ['checked', 'indeterminate'];
var MDCCheckbox = /** @class */ (function (_super) {
    __extends(MDCCheckbox, _super);
    function MDCCheckbox() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.ripple_ = _this.createRipple_();
        return _this;
    }
    MDCCheckbox.attachTo = function (root) {
        return new MDCCheckbox(root);
    };
    Object.defineProperty(MDCCheckbox.prototype, "ripple", {
        get: function () {
            return this.ripple_;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCCheckbox.prototype, "checked", {
        get: function () {
            return this.nativeControl_.checked;
        },
        set: function (checked) {
            this.nativeControl_.checked = checked;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCCheckbox.prototype, "indeterminate", {
        get: function () {
            return this.nativeControl_.indeterminate;
        },
        set: function (indeterminate) {
            this.nativeControl_.indeterminate = indeterminate;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCCheckbox.prototype, "disabled", {
        get: function () {
            return this.nativeControl_.disabled;
        },
        set: function (disabled) {
            this.foundation_.setDisabled(disabled);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCCheckbox.prototype, "value", {
        get: function () {
            return this.nativeControl_.value;
        },
        set: function (value) {
            this.nativeControl_.value = value;
        },
        enumerable: true,
        configurable: true
    });
    MDCCheckbox.prototype.initialSyncWithDOM = function () {
        var _this = this;
        this.handleChange_ = function () { return _this.foundation_.handleChange(); };
        this.handleAnimationEnd_ = function () { return _this.foundation_.handleAnimationEnd(); };
        this.nativeControl_.addEventListener('change', this.handleChange_);
        this.listen(getCorrectEventName(window, 'animationend'), this.handleAnimationEnd_);
        this.installPropertyChangeHooks_();
    };
    MDCCheckbox.prototype.destroy = function () {
        this.ripple_.destroy();
        this.nativeControl_.removeEventListener('change', this.handleChange_);
        this.unlisten(getCorrectEventName(window, 'animationend'), this.handleAnimationEnd_);
        this.uninstallPropertyChangeHooks_();
        _super.prototype.destroy.call(this);
    };
    MDCCheckbox.prototype.getDefaultFoundation = function () {
        var _this = this;
        // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
        // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
        var adapter = {
            addClass: function (className) { return _this.root_.classList.add(className); },
            forceLayout: function () { return _this.root_.offsetWidth; },
            hasNativeControl: function () { return !!_this.nativeControl_; },
            isAttachedToDOM: function () { return Boolean(_this.root_.parentNode); },
            isChecked: function () { return _this.checked; },
            isIndeterminate: function () { return _this.indeterminate; },
            removeClass: function (className) { return _this.root_.classList.remove(className); },
            removeNativeControlAttr: function (attr) { return _this.nativeControl_.removeAttribute(attr); },
            setNativeControlAttr: function (attr, value) { return _this.nativeControl_.setAttribute(attr, value); },
            setNativeControlDisabled: function (disabled) { return _this.nativeControl_.disabled = disabled; },
        };
        return new MDCCheckboxFoundation(adapter);
    };
    MDCCheckbox.prototype.createRipple_ = function () {
        var _this = this;
        // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
        // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
        var adapter = __assign({}, MDCRipple.createAdapter(this), { deregisterInteractionHandler: function (evtType, handler) { return _this.nativeControl_.removeEventListener(evtType, handler); }, isSurfaceActive: function () { return matches$1(_this.nativeControl_, ':active'); }, isUnbounded: function () { return true; }, registerInteractionHandler: function (evtType, handler) { return _this.nativeControl_.addEventListener(evtType, handler); } });
        return new MDCRipple(this.root_, new MDCRippleFoundation(adapter));
    };
    MDCCheckbox.prototype.installPropertyChangeHooks_ = function () {
        var _this = this;
        var nativeCb = this.nativeControl_;
        var cbProto = Object.getPrototypeOf(nativeCb);
        CB_PROTO_PROPS.forEach(function (controlState) {
            var desc = Object.getOwnPropertyDescriptor(cbProto, controlState);
            // We have to check for this descriptor, since some browsers (Safari) don't support its return.
            // See: https://bugs.webkit.org/show_bug.cgi?id=49739
            if (!validDescriptor(desc)) {
                return;
            }
            // Type cast is needed for compatibility with Closure Compiler.
            var nativeGetter = desc.get;
            var nativeCbDesc = {
                configurable: desc.configurable,
                enumerable: desc.enumerable,
                get: nativeGetter,
                set: function (state) {
                    desc.set.call(nativeCb, state);
                    _this.foundation_.handleChange();
                },
            };
            Object.defineProperty(nativeCb, controlState, nativeCbDesc);
        });
    };
    MDCCheckbox.prototype.uninstallPropertyChangeHooks_ = function () {
        var nativeCb = this.nativeControl_;
        var cbProto = Object.getPrototypeOf(nativeCb);
        CB_PROTO_PROPS.forEach(function (controlState) {
            var desc = Object.getOwnPropertyDescriptor(cbProto, controlState);
            if (!validDescriptor(desc)) {
                return;
            }
            Object.defineProperty(nativeCb, controlState, desc);
        });
    };
    Object.defineProperty(MDCCheckbox.prototype, "nativeControl_", {
        get: function () {
            var NATIVE_CONTROL_SELECTOR = MDCCheckboxFoundation.strings.NATIVE_CONTROL_SELECTOR;
            var el = this.root_.querySelector(NATIVE_CONTROL_SELECTOR);
            if (!el) {
                throw new Error("Checkbox component requires a " + NATIVE_CONTROL_SELECTOR + " element");
            }
            return el;
        },
        enumerable: true,
        configurable: true
    });
    return MDCCheckbox;
}(MDCComponent));
function validDescriptor(inputPropDesc) {
    return !!inputPropDesc && typeof inputPropDesc.set === 'function';
}

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
 */
var cssClasses$1 = {
    ROOT: 'mdc-form-field',
};
var strings$1 = {
    LABEL_SELECTOR: '.mdc-form-field > label',
};

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
 */
var MDCFormFieldFoundation = /** @class */ (function (_super) {
    __extends(MDCFormFieldFoundation, _super);
    function MDCFormFieldFoundation(adapter) {
        var _this = _super.call(this, __assign({}, MDCFormFieldFoundation.defaultAdapter, adapter)) || this;
        _this.clickHandler_ = function () { return _this.handleClick_(); };
        return _this;
    }
    Object.defineProperty(MDCFormFieldFoundation, "cssClasses", {
        get: function () {
            return cssClasses$1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCFormFieldFoundation, "strings", {
        get: function () {
            return strings$1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCFormFieldFoundation, "defaultAdapter", {
        get: function () {
            return {
                activateInputRipple: function () { return undefined; },
                deactivateInputRipple: function () { return undefined; },
                deregisterInteractionHandler: function () { return undefined; },
                registerInteractionHandler: function () { return undefined; },
            };
        },
        enumerable: true,
        configurable: true
    });
    MDCFormFieldFoundation.prototype.init = function () {
        this.adapter_.registerInteractionHandler('click', this.clickHandler_);
    };
    MDCFormFieldFoundation.prototype.destroy = function () {
        this.adapter_.deregisterInteractionHandler('click', this.clickHandler_);
    };
    MDCFormFieldFoundation.prototype.handleClick_ = function () {
        var _this = this;
        this.adapter_.activateInputRipple();
        requestAnimationFrame(function () { return _this.adapter_.deactivateInputRipple(); });
    };
    return MDCFormFieldFoundation;
}(MDCFoundation));

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
 */
var MDCFormField = /** @class */ (function (_super) {
    __extends(MDCFormField, _super);
    function MDCFormField() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MDCFormField.attachTo = function (root) {
        return new MDCFormField(root);
    };
    Object.defineProperty(MDCFormField.prototype, "input", {
        get: function () {
            return this.input_;
        },
        set: function (input) {
            this.input_ = input;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCFormField.prototype, "label_", {
        get: function () {
            var LABEL_SELECTOR = MDCFormFieldFoundation.strings.LABEL_SELECTOR;
            return this.root_.querySelector(LABEL_SELECTOR);
        },
        enumerable: true,
        configurable: true
    });
    MDCFormField.prototype.getDefaultFoundation = function () {
        var _this = this;
        // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
        // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
        var adapter = {
            activateInputRipple: function () {
                if (_this.input_ && _this.input_.ripple) {
                    _this.input_.ripple.activate();
                }
            },
            deactivateInputRipple: function () {
                if (_this.input_ && _this.input_.ripple) {
                    _this.input_.ripple.deactivate();
                }
            },
            deregisterInteractionHandler: function (evtType, handler) {
                if (_this.label_) {
                    _this.label_.removeEventListener(evtType, handler);
                }
            },
            registerInteractionHandler: function (evtType, handler) {
                if (_this.label_) {
                    _this.label_.addEventListener(evtType, handler);
                }
            },
        };
        return new MDCFormFieldFoundation(adapter);
    };
    return MDCFormField;
}(MDCComponent));

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

class Checkbox {
    constructor() {
        /**
         * Disables the input field when `true`.
         */
        this.disabled = false;
        /**
         * The value of the checkbox. Set to `true` to make the checkbox checked.
         */
        this.checked = false;
        this.id = createRandomString();
        this.onChange = this.onChange.bind(this);
    }
    componentDidLoad() {
        this.formField = new MDCFormField(this.limelCheckbox.shadowRoot.querySelector('.mdc-form-field'));
        this.mdcCheckbox = new MDCCheckbox(this.limelCheckbox.shadowRoot.querySelector('.mdc-checkbox'));
        this.formField.input = this.mdcCheckbox;
    }
    componentDidUnload() {
        this.mdcCheckbox.destroy();
        this.formField.destroy();
    }
    render() {
        return (h(CheckboxTemplate, { disabled: this.disabled, label: this.label, checked: this.checked, onChange: this.onChange, id: this.id }));
    }
    onChange(event) {
        event.stopPropagation();
        this.change.emit(this.mdcCheckbox.checked);
    }
    static get is() { return "limel-checkbox"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "checked": {
            "type": Boolean,
            "attr": "checked",
            "reflectToAttr": true
        },
        "disabled": {
            "type": Boolean,
            "attr": "disabled",
            "reflectToAttr": true
        },
        "label": {
            "type": String,
            "attr": "label",
            "reflectToAttr": true
        },
        "limelCheckbox": {
            "elementRef": true
        }
    }; }
    static get events() { return [{
            "name": "change",
            "method": "change",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get style() { return ":host {\n  --mdc-theme-primary: var(--lime-primary-color, #26a69a);\n  --mdc-theme-secondary: var(--lime-secondary-color, #575756);\n  --mdc-theme-on-primary: var(--lime-on-primary-color, #fff);\n  --mdc-theme-on-secondary: var(--lime-on-secondary-color, #fff); }\n\n:root {\n  --mdc-theme-primary: #26a69a;\n  --mdc-theme-secondary: #575756;\n  --mdc-theme-background: #fff;\n  --mdc-theme-surface: #fff;\n  --mdc-theme-error: #b00020;\n  --mdc-theme-on-primary: #fff;\n  --mdc-theme-on-secondary: #fff;\n  --mdc-theme-on-surface: #000;\n  --mdc-theme-on-error: #fff;\n  --mdc-theme-text-primary-on-background: rgba(0, 0, 0, 0.87);\n  --mdc-theme-text-secondary-on-background: rgba(0, 0, 0, 0.54);\n  --mdc-theme-text-hint-on-background: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-disabled-on-background: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-icon-on-background: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-primary-on-light: rgba(0, 0, 0, 0.87);\n  --mdc-theme-text-secondary-on-light: rgba(0, 0, 0, 0.54);\n  --mdc-theme-text-hint-on-light: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-disabled-on-light: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-icon-on-light: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-primary-on-dark: white;\n  --mdc-theme-text-secondary-on-dark: rgba(255, 255, 255, 0.7);\n  --mdc-theme-text-hint-on-dark: rgba(255, 255, 255, 0.5);\n  --mdc-theme-text-disabled-on-dark: rgba(255, 255, 255, 0.5);\n  --mdc-theme-text-icon-on-dark: rgba(255, 255, 255, 0.5); }\n\n.mdc-theme--primary {\n  color: #26a69a !important;\n  /* \@alternate */\n  color: var(--mdc-theme-primary, #26a69a) !important; }\n\n.mdc-theme--secondary {\n  color: #575756 !important;\n  /* \@alternate */\n  color: var(--mdc-theme-secondary, #575756) !important; }\n\n.mdc-theme--background {\n  background-color: #fff;\n  /* \@alternate */\n  background-color: var(--mdc-theme-background, #fff); }\n\n.mdc-theme--surface {\n  background-color: #fff;\n  /* \@alternate */\n  background-color: var(--mdc-theme-surface, #fff); }\n\n.mdc-theme--error {\n  color: #b00020 !important;\n  /* \@alternate */\n  color: var(--mdc-theme-error, #b00020) !important; }\n\n.mdc-theme--on-primary {\n  color: #fff !important;\n  /* \@alternate */\n  color: var(--mdc-theme-on-primary, #fff) !important; }\n\n.mdc-theme--on-secondary {\n  color: #fff !important;\n  /* \@alternate */\n  color: var(--mdc-theme-on-secondary, #fff) !important; }\n\n.mdc-theme--on-surface {\n  color: #000 !important;\n  /* \@alternate */\n  color: var(--mdc-theme-on-surface, #000) !important; }\n\n.mdc-theme--on-error {\n  color: #fff !important;\n  /* \@alternate */\n  color: var(--mdc-theme-on-error, #fff) !important; }\n\n.mdc-theme--text-primary-on-background {\n  color: rgba(0, 0, 0, 0.87) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-primary-on-background, rgba(0, 0, 0, 0.87)) !important; }\n\n.mdc-theme--text-secondary-on-background {\n  color: rgba(0, 0, 0, 0.54) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-secondary-on-background, rgba(0, 0, 0, 0.54)) !important; }\n\n.mdc-theme--text-hint-on-background {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.38)) !important; }\n\n.mdc-theme--text-disabled-on-background {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-disabled-on-background, rgba(0, 0, 0, 0.38)) !important; }\n\n.mdc-theme--text-icon-on-background {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-icon-on-background, rgba(0, 0, 0, 0.38)) !important; }\n\n.mdc-theme--text-primary-on-light {\n  color: rgba(0, 0, 0, 0.87) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-primary-on-light, rgba(0, 0, 0, 0.87)) !important; }\n\n.mdc-theme--text-secondary-on-light {\n  color: rgba(0, 0, 0, 0.54) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-secondary-on-light, rgba(0, 0, 0, 0.54)) !important; }\n\n.mdc-theme--text-hint-on-light {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-hint-on-light, rgba(0, 0, 0, 0.38)) !important; }\n\n.mdc-theme--text-disabled-on-light {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-disabled-on-light, rgba(0, 0, 0, 0.38)) !important; }\n\n.mdc-theme--text-icon-on-light {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-icon-on-light, rgba(0, 0, 0, 0.38)) !important; }\n\n.mdc-theme--text-primary-on-dark {\n  color: white !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-primary-on-dark, white) !important; }\n\n.mdc-theme--text-secondary-on-dark {\n  color: rgba(255, 255, 255, 0.7) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-secondary-on-dark, rgba(255, 255, 255, 0.7)) !important; }\n\n.mdc-theme--text-hint-on-dark {\n  color: rgba(255, 255, 255, 0.5) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-hint-on-dark, rgba(255, 255, 255, 0.5)) !important; }\n\n.mdc-theme--text-disabled-on-dark {\n  color: rgba(255, 255, 255, 0.5) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-disabled-on-dark, rgba(255, 255, 255, 0.5)) !important; }\n\n.mdc-theme--text-icon-on-dark {\n  color: rgba(255, 255, 255, 0.5) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-icon-on-dark, rgba(255, 255, 255, 0.5)) !important; }\n\n.mdc-theme--primary-bg {\n  background-color: #26a69a !important;\n  /* \@alternate */\n  background-color: var(--mdc-theme-primary, #26a69a) !important; }\n\n.mdc-theme--secondary-bg {\n  background-color: #575756 !important;\n  /* \@alternate */\n  background-color: var(--mdc-theme-secondary, #575756) !important; }\n\n.mdc-typography {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased; }\n\n.mdc-typography--headline1 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1rem;\n  line-height: 0.875rem;\n  font-weight: 300;\n  letter-spacing: -0.01562em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--headline2 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1rem;\n  line-height: 0.875rem;\n  font-weight: 300;\n  letter-spacing: -0.00833em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--headline3 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1rem;\n  line-height: 0.875rem;\n  font-weight: 400;\n  letter-spacing: normal;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--headline4 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1rem;\n  line-height: 0.875rem;\n  font-weight: 400;\n  letter-spacing: 0.00735em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--headline5 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.875rem;\n  line-height: 0.875rem;\n  font-weight: 400;\n  letter-spacing: normal;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--headline6 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.875rem;\n  line-height: 0.875rem;\n  font-weight: 500;\n  letter-spacing: 0.0125em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--subtitle1 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.875rem;\n  line-height: 1.125rem;\n  font-weight: 400;\n  letter-spacing: 0.00937em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--subtitle2 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.8125rem;\n  line-height: 1.125rem;\n  font-weight: 500;\n  letter-spacing: 0.00714em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--body1 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.8125rem;\n  line-height: 1.5rem;\n  font-weight: 400;\n  letter-spacing: 0.03125em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--body2 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.8125rem;\n  line-height: 1.625rem;\n  font-weight: 400;\n  letter-spacing: 0.01786em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--caption {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.6875rem;\n  line-height: 0.875rem;\n  font-weight: 400;\n  letter-spacing: 0.03333em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--button {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.875rem;\n  line-height: 2.25rem;\n  font-weight: 500;\n  letter-spacing: 0.08929em;\n  text-decoration: none;\n  text-transform: none; }\n\n.mdc-typography--overline {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.6875rem;\n  line-height: 0.875rem;\n  font-weight: 500;\n  letter-spacing: 0.16667em;\n  text-decoration: none;\n  text-transform: uppercase; }\n\n.mdc-form-field {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.8125rem;\n  line-height: 1.625rem;\n  font-weight: 400;\n  letter-spacing: 0.01786em;\n  text-decoration: inherit;\n  text-transform: inherit;\n  color: rgba(0, 0, 0, 0.87);\n  /* \@alternate */\n  color: var(--mdc-theme-text-primary-on-background, rgba(0, 0, 0, 0.87));\n  display: -ms-inline-flexbox;\n  display: inline-flex;\n  -ms-flex-align: center;\n  align-items: center;\n  vertical-align: middle; }\n  .mdc-form-field > label {\n    -ms-flex-order: 0;\n    order: 0;\n    /* \@noflip */\n    margin-right: auto;\n    /* \@noflip */\n    padding-left: 0.25rem; }\n  [dir=\"rtl\"] .mdc-form-field > label, .mdc-form-field[dir=\"rtl\"] > label {\n    /* \@noflip */\n    margin-left: auto;\n    /* \@noflip */\n    padding-right: 0.25rem; }\n\n.mdc-form-field--align-end > label {\n  -ms-flex-order: -1;\n  order: -1;\n  /* \@noflip */\n  margin-left: auto;\n  /* \@noflip */\n  padding-right: 0.25rem; }\n\n[dir=\"rtl\"] .mdc-form-field--align-end > label, .mdc-form-field--align-end[dir=\"rtl\"] > label {\n  /* \@noflip */\n  margin-right: auto;\n  /* \@noflip */\n  padding-left: 0.25rem; }\n\n\@-webkit-keyframes mdc-checkbox-unchecked-checked-checkmark-path {\n  0%,\n  50% {\n    stroke-dashoffset: 29.78334; }\n  50% {\n    -webkit-animation-timing-function: cubic-bezier(0, 0, 0.2, 1);\n    animation-timing-function: cubic-bezier(0, 0, 0.2, 1); }\n  100% {\n    stroke-dashoffset: 0; } }\n\n\@keyframes mdc-checkbox-unchecked-checked-checkmark-path {\n  0%,\n  50% {\n    stroke-dashoffset: 29.78334; }\n  50% {\n    -webkit-animation-timing-function: cubic-bezier(0, 0, 0.2, 1);\n    animation-timing-function: cubic-bezier(0, 0, 0.2, 1); }\n  100% {\n    stroke-dashoffset: 0; } }\n\n\@-webkit-keyframes mdc-checkbox-unchecked-indeterminate-mixedmark {\n  0%,\n  68.2% {\n    -webkit-transform: scaleX(0);\n    transform: scaleX(0); }\n  68.2% {\n    -webkit-animation-timing-function: cubic-bezier(0, 0, 0, 1);\n    animation-timing-function: cubic-bezier(0, 0, 0, 1); }\n  100% {\n    -webkit-transform: scaleX(1);\n    transform: scaleX(1); } }\n\n\@keyframes mdc-checkbox-unchecked-indeterminate-mixedmark {\n  0%,\n  68.2% {\n    -webkit-transform: scaleX(0);\n    transform: scaleX(0); }\n  68.2% {\n    -webkit-animation-timing-function: cubic-bezier(0, 0, 0, 1);\n    animation-timing-function: cubic-bezier(0, 0, 0, 1); }\n  100% {\n    -webkit-transform: scaleX(1);\n    transform: scaleX(1); } }\n\n\@-webkit-keyframes mdc-checkbox-checked-unchecked-checkmark-path {\n  from {\n    -webkit-animation-timing-function: cubic-bezier(0.4, 0, 1, 1);\n    animation-timing-function: cubic-bezier(0.4, 0, 1, 1);\n    opacity: 1;\n    stroke-dashoffset: 0; }\n  to {\n    opacity: 0;\n    stroke-dashoffset: -29.78334; } }\n\n\@keyframes mdc-checkbox-checked-unchecked-checkmark-path {\n  from {\n    -webkit-animation-timing-function: cubic-bezier(0.4, 0, 1, 1);\n    animation-timing-function: cubic-bezier(0.4, 0, 1, 1);\n    opacity: 1;\n    stroke-dashoffset: 0; }\n  to {\n    opacity: 0;\n    stroke-dashoffset: -29.78334; } }\n\n\@-webkit-keyframes mdc-checkbox-checked-indeterminate-checkmark {\n  from {\n    -webkit-animation-timing-function: cubic-bezier(0, 0, 0.2, 1);\n    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);\n    -webkit-transform: rotate(0deg);\n    transform: rotate(0deg);\n    opacity: 1; }\n  to {\n    -webkit-transform: rotate(45deg);\n    transform: rotate(45deg);\n    opacity: 0; } }\n\n\@keyframes mdc-checkbox-checked-indeterminate-checkmark {\n  from {\n    -webkit-animation-timing-function: cubic-bezier(0, 0, 0.2, 1);\n    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);\n    -webkit-transform: rotate(0deg);\n    transform: rotate(0deg);\n    opacity: 1; }\n  to {\n    -webkit-transform: rotate(45deg);\n    transform: rotate(45deg);\n    opacity: 0; } }\n\n\@-webkit-keyframes mdc-checkbox-indeterminate-checked-checkmark {\n  from {\n    -webkit-animation-timing-function: cubic-bezier(0.14, 0, 0, 1);\n    animation-timing-function: cubic-bezier(0.14, 0, 0, 1);\n    -webkit-transform: rotate(45deg);\n    transform: rotate(45deg);\n    opacity: 0; }\n  to {\n    -webkit-transform: rotate(360deg);\n    transform: rotate(360deg);\n    opacity: 1; } }\n\n\@keyframes mdc-checkbox-indeterminate-checked-checkmark {\n  from {\n    -webkit-animation-timing-function: cubic-bezier(0.14, 0, 0, 1);\n    animation-timing-function: cubic-bezier(0.14, 0, 0, 1);\n    -webkit-transform: rotate(45deg);\n    transform: rotate(45deg);\n    opacity: 0; }\n  to {\n    -webkit-transform: rotate(360deg);\n    transform: rotate(360deg);\n    opacity: 1; } }\n\n\@-webkit-keyframes mdc-checkbox-checked-indeterminate-mixedmark {\n  from {\n    -webkit-animation-timing-function: mdc-animation-deceleration-curve-timing-function;\n    animation-timing-function: mdc-animation-deceleration-curve-timing-function;\n    -webkit-transform: rotate(-45deg);\n    transform: rotate(-45deg);\n    opacity: 0; }\n  to {\n    -webkit-transform: rotate(0deg);\n    transform: rotate(0deg);\n    opacity: 1; } }\n\n\@keyframes mdc-checkbox-checked-indeterminate-mixedmark {\n  from {\n    -webkit-animation-timing-function: mdc-animation-deceleration-curve-timing-function;\n    animation-timing-function: mdc-animation-deceleration-curve-timing-function;\n    -webkit-transform: rotate(-45deg);\n    transform: rotate(-45deg);\n    opacity: 0; }\n  to {\n    -webkit-transform: rotate(0deg);\n    transform: rotate(0deg);\n    opacity: 1; } }\n\n\@-webkit-keyframes mdc-checkbox-indeterminate-checked-mixedmark {\n  from {\n    -webkit-animation-timing-function: cubic-bezier(0.14, 0, 0, 1);\n    animation-timing-function: cubic-bezier(0.14, 0, 0, 1);\n    -webkit-transform: rotate(0deg);\n    transform: rotate(0deg);\n    opacity: 1; }\n  to {\n    -webkit-transform: rotate(315deg);\n    transform: rotate(315deg);\n    opacity: 0; } }\n\n\@keyframes mdc-checkbox-indeterminate-checked-mixedmark {\n  from {\n    -webkit-animation-timing-function: cubic-bezier(0.14, 0, 0, 1);\n    animation-timing-function: cubic-bezier(0.14, 0, 0, 1);\n    -webkit-transform: rotate(0deg);\n    transform: rotate(0deg);\n    opacity: 1; }\n  to {\n    -webkit-transform: rotate(315deg);\n    transform: rotate(315deg);\n    opacity: 0; } }\n\n\@-webkit-keyframes mdc-checkbox-indeterminate-unchecked-mixedmark {\n  0% {\n    -webkit-animation-timing-function: linear;\n    animation-timing-function: linear;\n    -webkit-transform: scaleX(1);\n    transform: scaleX(1);\n    opacity: 1; }\n  32.8%,\n  100% {\n    -webkit-transform: scaleX(0);\n    transform: scaleX(0);\n    opacity: 0; } }\n\n\@keyframes mdc-checkbox-indeterminate-unchecked-mixedmark {\n  0% {\n    -webkit-animation-timing-function: linear;\n    animation-timing-function: linear;\n    -webkit-transform: scaleX(1);\n    transform: scaleX(1);\n    opacity: 1; }\n  32.8%,\n  100% {\n    -webkit-transform: scaleX(0);\n    transform: scaleX(0);\n    opacity: 0; } }\n\n.mdc-checkbox {\n  display: inline-block;\n  position: relative;\n  -ms-flex: 0 0 1.125rem;\n  flex: 0 0 1.125rem;\n  -webkit-box-sizing: content-box;\n  box-sizing: content-box;\n  width: 1.125rem;\n  height: 1.125rem;\n  padding: 0.6875rem;\n  line-height: 0;\n  white-space: nowrap;\n  cursor: pointer;\n  vertical-align: bottom; }\n\n.mdc-checkbox__native-control:enabled:not(:checked):not(:indeterminate) ~ .mdc-checkbox__background {\n  border-color: rgba(0, 0, 0, 0.54);\n  background-color: transparent; }\n\n.mdc-checkbox__native-control:enabled:checked ~ .mdc-checkbox__background,\n.mdc-checkbox__native-control:enabled:indeterminate ~ .mdc-checkbox__background {\n  border-color: #575756;\n  /* \@alternate */\n  border-color: var(--mdc-theme-secondary, #575756);\n  background-color: #575756;\n  /* \@alternate */\n  background-color: var(--mdc-theme-secondary, #575756); }\n\n\@-webkit-keyframes mdc-checkbox-fade-in-background-0 {\n  0% {\n    border-color: rgba(0, 0, 0, 0.54);\n    background-color: transparent; }\n  50% {\n    border-color: #575756;\n    /* \@alternate */\n    border-color: var(--mdc-theme-secondary, #575756);\n    background-color: #575756;\n    /* \@alternate */\n    background-color: var(--mdc-theme-secondary, #575756); } }\n\n\@keyframes mdc-checkbox-fade-in-background-0 {\n  0% {\n    border-color: rgba(0, 0, 0, 0.54);\n    background-color: transparent; }\n  50% {\n    border-color: #575756;\n    /* \@alternate */\n    border-color: var(--mdc-theme-secondary, #575756);\n    background-color: #575756;\n    /* \@alternate */\n    background-color: var(--mdc-theme-secondary, #575756); } }\n\n\@-webkit-keyframes mdc-checkbox-fade-out-background-0 {\n  0%,\n  80% {\n    border-color: #575756;\n    /* \@alternate */\n    border-color: var(--mdc-theme-secondary, #575756);\n    background-color: #575756;\n    /* \@alternate */\n    background-color: var(--mdc-theme-secondary, #575756); }\n  100% {\n    border-color: rgba(0, 0, 0, 0.54);\n    background-color: transparent; } }\n\n\@keyframes mdc-checkbox-fade-out-background-0 {\n  0%,\n  80% {\n    border-color: #575756;\n    /* \@alternate */\n    border-color: var(--mdc-theme-secondary, #575756);\n    background-color: #575756;\n    /* \@alternate */\n    background-color: var(--mdc-theme-secondary, #575756); }\n  100% {\n    border-color: rgba(0, 0, 0, 0.54);\n    background-color: transparent; } }\n\n.mdc-checkbox--anim-unchecked-checked .mdc-checkbox__native-control:enabled ~ .mdc-checkbox__background, .mdc-checkbox--anim-unchecked-indeterminate .mdc-checkbox__native-control:enabled ~ .mdc-checkbox__background {\n  -webkit-animation-name: mdc-checkbox-fade-in-background-0;\n  animation-name: mdc-checkbox-fade-in-background-0; }\n\n.mdc-checkbox--anim-checked-unchecked .mdc-checkbox__native-control:enabled ~ .mdc-checkbox__background, .mdc-checkbox--anim-indeterminate-unchecked .mdc-checkbox__native-control:enabled ~ .mdc-checkbox__background {\n  -webkit-animation-name: mdc-checkbox-fade-out-background-0;\n  animation-name: mdc-checkbox-fade-out-background-0; }\n\n.mdc-checkbox__checkmark {\n  color: #fff; }\n\n.mdc-checkbox__mixedmark {\n  border-color: #fff; }\n\n.mdc-checkbox__background::before {\n  background-color: #575756; }\n  \@supports not (-ms-ime-align: auto) {\n    .mdc-checkbox__background::before {\n      /* \@alternate */\n      background-color: var(--mdc-theme-secondary, #575756); } }\n\n.mdc-checkbox__native-control:disabled:not(:checked):not(:indeterminate) ~ .mdc-checkbox__background {\n  border-color: rgba(0, 0, 0, 0.26); }\n\n.mdc-checkbox__native-control:disabled:checked ~ .mdc-checkbox__background,\n.mdc-checkbox__native-control:disabled:indeterminate ~ .mdc-checkbox__background {\n  border-color: transparent;\n  background-color: rgba(0, 0, 0, 0.26); }\n\n\@media screen and (-ms-high-contrast: active) {\n  .mdc-checkbox__mixedmark {\n    margin: 0 0.0625rem; } }\n\n.mdc-checkbox--disabled {\n  cursor: default;\n  pointer-events: none; }\n\n.mdc-checkbox__background {\n  /* \@noflip */\n  left: 0.6875rem;\n  /* \@noflip */\n  right: initial;\n  display: -ms-inline-flexbox;\n  display: inline-flex;\n  position: absolute;\n  top: 0.6875rem;\n  bottom: 0;\n  -ms-flex-align: center;\n  align-items: center;\n  -ms-flex-pack: center;\n  justify-content: center;\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box;\n  width: 45%;\n  height: 45%;\n  border: 0.125rem solid currentColor;\n  border-radius: 0.125rem;\n  background-color: transparent;\n  pointer-events: none;\n  will-change: background-color, border-color;\n  -webkit-transition: background-color 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1), border-color 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1);\n  transition: background-color 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1), border-color 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1); }\n  .mdc-checkbox[dir=\"rtl\"] .mdc-checkbox__background,\n  [dir=\"rtl\"] .mdc-checkbox .mdc-checkbox__background {\n    /* \@noflip */\n    left: initial;\n    /* \@noflip */\n    right: 0.6875rem; }\n\n.mdc-checkbox__checkmark {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  opacity: 0;\n  -webkit-transition: opacity 180ms 0ms cubic-bezier(0.4, 0, 0.6, 1);\n  transition: opacity 180ms 0ms cubic-bezier(0.4, 0, 0.6, 1); }\n  .mdc-checkbox--upgraded .mdc-checkbox__checkmark {\n    opacity: 1; }\n\n.mdc-checkbox__checkmark-path {\n  -webkit-transition: stroke-dashoffset 180ms 0ms cubic-bezier(0.4, 0, 0.6, 1);\n  transition: stroke-dashoffset 180ms 0ms cubic-bezier(0.4, 0, 0.6, 1);\n  stroke: currentColor;\n  stroke-width: 0.195rem;\n  stroke-dashoffset: 29.78334;\n  stroke-dasharray: 29.78334; }\n\n.mdc-checkbox__mixedmark {\n  width: 100%;\n  height: 0;\n  -webkit-transform: scaleX(0) rotate(0deg);\n  transform: scaleX(0) rotate(0deg);\n  border-width: 0rem;\n  border-style: solid;\n  opacity: 0;\n  -webkit-transition: opacity 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1), -webkit-transform 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1);\n  transition: opacity 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1), -webkit-transform 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1);\n  transition: opacity 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1), transform 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1);\n  transition: opacity 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1), transform 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1), -webkit-transform 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1); }\n\n.mdc-checkbox--upgraded .mdc-checkbox__background,\n.mdc-checkbox--upgraded .mdc-checkbox__checkmark,\n.mdc-checkbox--upgraded .mdc-checkbox__checkmark-path,\n.mdc-checkbox--upgraded .mdc-checkbox__mixedmark {\n  -webkit-transition: none !important;\n  transition: none !important; }\n\n.mdc-checkbox--anim-unchecked-checked .mdc-checkbox__background, .mdc-checkbox--anim-unchecked-indeterminate .mdc-checkbox__background, .mdc-checkbox--anim-checked-unchecked .mdc-checkbox__background, .mdc-checkbox--anim-indeterminate-unchecked .mdc-checkbox__background {\n  -webkit-animation-duration: 180ms;\n  animation-duration: 180ms;\n  -webkit-animation-timing-function: linear;\n  animation-timing-function: linear; }\n\n.mdc-checkbox--anim-unchecked-checked .mdc-checkbox__checkmark-path {\n  -webkit-animation: mdc-checkbox-unchecked-checked-checkmark-path 180ms linear 0s;\n  animation: mdc-checkbox-unchecked-checked-checkmark-path 180ms linear 0s;\n  -webkit-transition: none;\n  transition: none; }\n\n.mdc-checkbox--anim-unchecked-indeterminate .mdc-checkbox__mixedmark {\n  -webkit-animation: mdc-checkbox-unchecked-indeterminate-mixedmark 90ms linear 0s;\n  animation: mdc-checkbox-unchecked-indeterminate-mixedmark 90ms linear 0s;\n  -webkit-transition: none;\n  transition: none; }\n\n.mdc-checkbox--anim-checked-unchecked .mdc-checkbox__checkmark-path {\n  -webkit-animation: mdc-checkbox-checked-unchecked-checkmark-path 90ms linear 0s;\n  animation: mdc-checkbox-checked-unchecked-checkmark-path 90ms linear 0s;\n  -webkit-transition: none;\n  transition: none; }\n\n.mdc-checkbox--anim-checked-indeterminate .mdc-checkbox__checkmark {\n  -webkit-animation: mdc-checkbox-checked-indeterminate-checkmark 90ms linear 0s;\n  animation: mdc-checkbox-checked-indeterminate-checkmark 90ms linear 0s;\n  -webkit-transition: none;\n  transition: none; }\n\n.mdc-checkbox--anim-checked-indeterminate .mdc-checkbox__mixedmark {\n  -webkit-animation: mdc-checkbox-checked-indeterminate-mixedmark 90ms linear 0s;\n  animation: mdc-checkbox-checked-indeterminate-mixedmark 90ms linear 0s;\n  -webkit-transition: none;\n  transition: none; }\n\n.mdc-checkbox--anim-indeterminate-checked .mdc-checkbox__checkmark {\n  -webkit-animation: mdc-checkbox-indeterminate-checked-checkmark 500ms linear 0s;\n  animation: mdc-checkbox-indeterminate-checked-checkmark 500ms linear 0s;\n  -webkit-transition: none;\n  transition: none; }\n\n.mdc-checkbox--anim-indeterminate-checked .mdc-checkbox__mixedmark {\n  -webkit-animation: mdc-checkbox-indeterminate-checked-mixedmark 500ms linear 0s;\n  animation: mdc-checkbox-indeterminate-checked-mixedmark 500ms linear 0s;\n  -webkit-transition: none;\n  transition: none; }\n\n.mdc-checkbox--anim-indeterminate-unchecked .mdc-checkbox__mixedmark {\n  -webkit-animation: mdc-checkbox-indeterminate-unchecked-mixedmark 300ms linear 0s;\n  animation: mdc-checkbox-indeterminate-unchecked-mixedmark 300ms linear 0s;\n  -webkit-transition: none;\n  transition: none; }\n\n.mdc-checkbox__native-control:checked ~ .mdc-checkbox__background,\n.mdc-checkbox__native-control:indeterminate ~ .mdc-checkbox__background {\n  -webkit-transition: border-color 90ms 0ms cubic-bezier(0, 0, 0.2, 1), background-color 90ms 0ms cubic-bezier(0, 0, 0.2, 1);\n  transition: border-color 90ms 0ms cubic-bezier(0, 0, 0.2, 1), background-color 90ms 0ms cubic-bezier(0, 0, 0.2, 1); }\n  .mdc-checkbox__native-control:checked ~ .mdc-checkbox__background .mdc-checkbox__checkmark-path,\n  .mdc-checkbox__native-control:indeterminate ~ .mdc-checkbox__background .mdc-checkbox__checkmark-path {\n    stroke-dashoffset: 0; }\n\n.mdc-checkbox__background::before {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  -webkit-transform: scale(0, 0);\n  transform: scale(0, 0);\n  border-radius: 50%;\n  opacity: 0;\n  pointer-events: none;\n  content: \"\";\n  will-change: opacity, transform;\n  -webkit-transition: opacity 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1), -webkit-transform 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1);\n  transition: opacity 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1), -webkit-transform 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1);\n  transition: opacity 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1), transform 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1);\n  transition: opacity 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1), transform 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1), -webkit-transform 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1); }\n\n.mdc-checkbox__native-control:focus ~ .mdc-checkbox__background::before {\n  -webkit-transform: scale(2.75, 2.75);\n  transform: scale(2.75, 2.75);\n  opacity: 0.12;\n  -webkit-transition: opacity 80ms 0ms cubic-bezier(0, 0, 0.2, 1), -webkit-transform 80ms 0ms cubic-bezier(0, 0, 0.2, 1);\n  transition: opacity 80ms 0ms cubic-bezier(0, 0, 0.2, 1), -webkit-transform 80ms 0ms cubic-bezier(0, 0, 0.2, 1);\n  transition: opacity 80ms 0ms cubic-bezier(0, 0, 0.2, 1), transform 80ms 0ms cubic-bezier(0, 0, 0.2, 1);\n  transition: opacity 80ms 0ms cubic-bezier(0, 0, 0.2, 1), transform 80ms 0ms cubic-bezier(0, 0, 0.2, 1), -webkit-transform 80ms 0ms cubic-bezier(0, 0, 0.2, 1); }\n\n.mdc-checkbox__native-control {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  margin: 0;\n  padding: 0;\n  opacity: 0;\n  cursor: inherit; }\n  .mdc-checkbox__native-control:disabled {\n    cursor: default;\n    pointer-events: none; }\n\n.mdc-checkbox__native-control:checked ~ .mdc-checkbox__background .mdc-checkbox__checkmark {\n  -webkit-transition: opacity 180ms 0ms cubic-bezier(0, 0, 0.2, 1), -webkit-transform 180ms 0ms cubic-bezier(0, 0, 0.2, 1);\n  transition: opacity 180ms 0ms cubic-bezier(0, 0, 0.2, 1), -webkit-transform 180ms 0ms cubic-bezier(0, 0, 0.2, 1);\n  transition: opacity 180ms 0ms cubic-bezier(0, 0, 0.2, 1), transform 180ms 0ms cubic-bezier(0, 0, 0.2, 1);\n  transition: opacity 180ms 0ms cubic-bezier(0, 0, 0.2, 1), transform 180ms 0ms cubic-bezier(0, 0, 0.2, 1), -webkit-transform 180ms 0ms cubic-bezier(0, 0, 0.2, 1);\n  opacity: 1; }\n\n.mdc-checkbox__native-control:checked ~ .mdc-checkbox__background .mdc-checkbox__mixedmark {\n  -webkit-transform: scaleX(1) rotate(-45deg);\n  transform: scaleX(1) rotate(-45deg); }\n\n.mdc-checkbox__native-control:indeterminate ~ .mdc-checkbox__background .mdc-checkbox__checkmark {\n  -webkit-transform: rotate(45deg);\n  transform: rotate(45deg);\n  opacity: 0;\n  -webkit-transition: opacity 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1), -webkit-transform 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1);\n  transition: opacity 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1), -webkit-transform 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1);\n  transition: opacity 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1), transform 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1);\n  transition: opacity 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1), transform 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1), -webkit-transform 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1); }\n\n.mdc-checkbox__native-control:indeterminate ~ .mdc-checkbox__background .mdc-checkbox__mixedmark {\n  -webkit-transform: scaleX(1) rotate(0deg);\n  transform: scaleX(1) rotate(0deg);\n  opacity: 1; }\n\n\@-webkit-keyframes mdc-ripple-fg-radius-in {\n  from {\n    -webkit-animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n    -webkit-transform: translate(var(--mdc-ripple-fg-translate-start, 0)) scale(1);\n    transform: translate(var(--mdc-ripple-fg-translate-start, 0)) scale(1); }\n  to {\n    -webkit-transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1));\n    transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1)); } }\n\n\@keyframes mdc-ripple-fg-radius-in {\n  from {\n    -webkit-animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n    -webkit-transform: translate(var(--mdc-ripple-fg-translate-start, 0)) scale(1);\n    transform: translate(var(--mdc-ripple-fg-translate-start, 0)) scale(1); }\n  to {\n    -webkit-transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1));\n    transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1)); } }\n\n\@-webkit-keyframes mdc-ripple-fg-opacity-in {\n  from {\n    -webkit-animation-timing-function: linear;\n    animation-timing-function: linear;\n    opacity: 0; }\n  to {\n    opacity: var(--mdc-ripple-fg-opacity, 0); } }\n\n\@keyframes mdc-ripple-fg-opacity-in {\n  from {\n    -webkit-animation-timing-function: linear;\n    animation-timing-function: linear;\n    opacity: 0; }\n  to {\n    opacity: var(--mdc-ripple-fg-opacity, 0); } }\n\n\@-webkit-keyframes mdc-ripple-fg-opacity-out {\n  from {\n    -webkit-animation-timing-function: linear;\n    animation-timing-function: linear;\n    opacity: var(--mdc-ripple-fg-opacity, 0); }\n  to {\n    opacity: 0; } }\n\n\@keyframes mdc-ripple-fg-opacity-out {\n  from {\n    -webkit-animation-timing-function: linear;\n    animation-timing-function: linear;\n    opacity: var(--mdc-ripple-fg-opacity, 0); }\n  to {\n    opacity: 0; } }\n\n.mdc-ripple-surface--test-edge-var-bug {\n  --mdc-ripple-surface-test-edge-var: 0.0625rem solid #000;\n  visibility: hidden; }\n  .mdc-ripple-surface--test-edge-var-bug::before {\n    border: var(--mdc-ripple-surface-test-edge-var); }\n\n.mdc-checkbox {\n  --mdc-ripple-fg-size: 0;\n  --mdc-ripple-left: 0;\n  --mdc-ripple-top: 0;\n  --mdc-ripple-fg-scale: 1;\n  --mdc-ripple-fg-translate-end: 0;\n  --mdc-ripple-fg-translate-start: 0;\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n  will-change: transform, opacity; }\n  .mdc-checkbox::before, .mdc-checkbox::after {\n    position: absolute;\n    border-radius: 50%;\n    opacity: 0;\n    pointer-events: none;\n    content: \"\"; }\n  .mdc-checkbox::before {\n    -webkit-transition: opacity 15ms linear, background-color 15ms linear;\n    transition: opacity 15ms linear, background-color 15ms linear;\n    z-index: 1; }\n  .mdc-checkbox.mdc-ripple-upgraded::before {\n    -webkit-transform: scale(var(--mdc-ripple-fg-scale, 1));\n    transform: scale(var(--mdc-ripple-fg-scale, 1)); }\n  .mdc-checkbox.mdc-ripple-upgraded::after {\n    top: 0;\n    /* \@noflip */\n    left: 0;\n    -webkit-transform: scale(0);\n    transform: scale(0);\n    -webkit-transform-origin: center center;\n    transform-origin: center center; }\n  .mdc-checkbox.mdc-ripple-upgraded--unbounded::after {\n    top: var(--mdc-ripple-top, 0);\n    /* \@noflip */\n    left: var(--mdc-ripple-left, 0); }\n  .mdc-checkbox.mdc-ripple-upgraded--foreground-activation::after {\n    -webkit-animation: mdc-ripple-fg-radius-in 225ms forwards, mdc-ripple-fg-opacity-in 75ms forwards;\n    animation: mdc-ripple-fg-radius-in 225ms forwards, mdc-ripple-fg-opacity-in 75ms forwards; }\n  .mdc-checkbox.mdc-ripple-upgraded--foreground-deactivation::after {\n    -webkit-animation: mdc-ripple-fg-opacity-out 150ms;\n    animation: mdc-ripple-fg-opacity-out 150ms;\n    -webkit-transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1));\n    transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1)); }\n  .mdc-checkbox::before, .mdc-checkbox::after {\n    background-color: #575756; }\n    \@supports not (-ms-ime-align: auto) {\n      .mdc-checkbox::before, .mdc-checkbox::after {\n        /* \@alternate */\n        background-color: var(--mdc-theme-secondary, #575756); } }\n  .mdc-checkbox:hover::before {\n    opacity: 0.04; }\n  .mdc-checkbox:not(.mdc-ripple-upgraded):focus::before, .mdc-checkbox.mdc-ripple-upgraded--background-focused::before {\n    -webkit-transition-duration: 75ms;\n    transition-duration: 75ms;\n    opacity: 0.12; }\n  .mdc-checkbox:not(.mdc-ripple-upgraded)::after {\n    -webkit-transition: opacity 150ms linear;\n    transition: opacity 150ms linear; }\n  .mdc-checkbox:not(.mdc-ripple-upgraded):active::after {\n    -webkit-transition-duration: 75ms;\n    transition-duration: 75ms;\n    opacity: 0.12; }\n  .mdc-checkbox.mdc-ripple-upgraded {\n    --mdc-ripple-fg-opacity: 0.12; }\n  .mdc-checkbox::before, .mdc-checkbox::after {\n    top: calc(50% - 50%);\n    /* \@noflip */\n    left: calc(50% - 50%);\n    width: 100%;\n    height: 100%; }\n  .mdc-checkbox.mdc-ripple-upgraded::before, .mdc-checkbox.mdc-ripple-upgraded::after {\n    top: var(--mdc-ripple-top, calc(50% - 50%));\n    /* \@noflip */\n    left: var(--mdc-ripple-left, calc(50% - 50%));\n    width: var(--mdc-ripple-fg-size, 100%);\n    height: var(--mdc-ripple-fg-size, 100%); }\n  .mdc-checkbox.mdc-ripple-upgraded::after {\n    width: var(--mdc-ripple-fg-size, 100%);\n    height: var(--mdc-ripple-fg-size, 100%); }\n\n.mdc-ripple-upgraded--background-focused .mdc-checkbox__background::before {\n  content: none; }\n\n.mdc-form-field {\n  display: -ms-flexbox;\n  display: flex; }\n  .mdc-form-field .mdc-checkbox .mdc-checkbox__checkmark {\n    color: #26a69a;\n    /* \@alternate */\n    color: var(--mdc-theme-primary, #26a69a); }\n  .mdc-form-field .mdc-checkbox .mdc-checkbox__mixedmark {\n    border-color: #26a69a;\n    /* \@alternate */\n    border-color: var(--mdc-theme-primary, #26a69a); }\n  .mdc-form-field .mdc-checkbox .mdc-checkbox__native-control:enabled:not(:checked):not(:indeterminate) ~ .mdc-checkbox__background {\n    border-color: #575756;\n    /* \@alternate */\n    border-color: var(--mdc-theme-secondary, #575756);\n    background-color: #fff;\n    /* \@alternate */\n    background-color: var(--mdc-theme-on-primary, #fff); }\n  .mdc-form-field .mdc-checkbox .mdc-checkbox__native-control:enabled:checked ~ .mdc-checkbox__background,\n  .mdc-form-field .mdc-checkbox .mdc-checkbox__native-control:enabled:indeterminate ~ .mdc-checkbox__background {\n    border-color: #575756;\n    /* \@alternate */\n    border-color: var(--mdc-theme-secondary, #575756);\n    background-color: #fff;\n    /* \@alternate */\n    background-color: var(--mdc-theme-on-primary, #fff); }\n\n\@-webkit-keyframes mdc-checkbox-fade-in-background-1 {\n  0% {\n    border-color: #575756;\n    /* \@alternate */\n    border-color: var(--mdc-theme-secondary, #575756);\n    background-color: #fff;\n    /* \@alternate */\n    background-color: var(--mdc-theme-on-primary, #fff); }\n  50% {\n    border-color: #575756;\n    /* \@alternate */\n    border-color: var(--mdc-theme-secondary, #575756);\n    background-color: #fff;\n    /* \@alternate */\n    background-color: var(--mdc-theme-on-primary, #fff); } }\n\n\@keyframes mdc-checkbox-fade-in-background-1 {\n  0% {\n    border-color: #575756;\n    /* \@alternate */\n    border-color: var(--mdc-theme-secondary, #575756);\n    background-color: #fff;\n    /* \@alternate */\n    background-color: var(--mdc-theme-on-primary, #fff); }\n  50% {\n    border-color: #575756;\n    /* \@alternate */\n    border-color: var(--mdc-theme-secondary, #575756);\n    background-color: #fff;\n    /* \@alternate */\n    background-color: var(--mdc-theme-on-primary, #fff); } }\n\n\@-webkit-keyframes mdc-checkbox-fade-out-background-1 {\n  0%,\n  80% {\n    border-color: #575756;\n    /* \@alternate */\n    border-color: var(--mdc-theme-secondary, #575756);\n    background-color: #fff;\n    /* \@alternate */\n    background-color: var(--mdc-theme-on-primary, #fff); }\n  100% {\n    border-color: #575756;\n    /* \@alternate */\n    border-color: var(--mdc-theme-secondary, #575756);\n    background-color: #fff;\n    /* \@alternate */\n    background-color: var(--mdc-theme-on-primary, #fff); } }\n\n\@keyframes mdc-checkbox-fade-out-background-1 {\n  0%,\n  80% {\n    border-color: #575756;\n    /* \@alternate */\n    border-color: var(--mdc-theme-secondary, #575756);\n    background-color: #fff;\n    /* \@alternate */\n    background-color: var(--mdc-theme-on-primary, #fff); }\n  100% {\n    border-color: #575756;\n    /* \@alternate */\n    border-color: var(--mdc-theme-secondary, #575756);\n    background-color: #fff;\n    /* \@alternate */\n    background-color: var(--mdc-theme-on-primary, #fff); } }\n  .mdc-form-field .mdc-checkbox.mdc-checkbox--anim-unchecked-checked .mdc-checkbox__native-control:enabled ~ .mdc-checkbox__background, .mdc-form-field .mdc-checkbox.mdc-checkbox--anim-unchecked-indeterminate .mdc-checkbox__native-control:enabled ~ .mdc-checkbox__background {\n    -webkit-animation-name: mdc-checkbox-fade-in-background-1;\n    animation-name: mdc-checkbox-fade-in-background-1; }\n  .mdc-form-field .mdc-checkbox.mdc-checkbox--anim-checked-unchecked .mdc-checkbox__native-control:enabled ~ .mdc-checkbox__background, .mdc-form-field .mdc-checkbox.mdc-checkbox--anim-indeterminate-unchecked .mdc-checkbox__native-control:enabled ~ .mdc-checkbox__background {\n    -webkit-animation-name: mdc-checkbox-fade-out-background-1;\n    animation-name: mdc-checkbox-fade-out-background-1; }"; }
}

var candidateSelectors = [
  'input',
  'select',
  'textarea',
  'a[href]',
  'button',
  '[tabindex]',
  'audio[controls]',
  'video[controls]',
  '[contenteditable]:not([contenteditable="false"])',
];
var candidateSelector = candidateSelectors.join(',');

var matches = typeof Element === 'undefined'
  ? function () {}
  : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;

function tabbable(el, options) {
  options = options || {};

  var elementDocument = el.ownerDocument || el;
  var regularTabbables = [];
  var orderedTabbables = [];

  var untouchabilityChecker = new UntouchabilityChecker(elementDocument);
  var candidates = el.querySelectorAll(candidateSelector);

  if (options.includeContainer) {
    if (matches.call(el, candidateSelector)) {
      candidates = Array.prototype.slice.apply(candidates);
      candidates.unshift(el);
    }
  }

  var i, candidate, candidateTabindex;
  for (i = 0; i < candidates.length; i++) {
    candidate = candidates[i];

    if (!isNodeMatchingSelectorTabbable(candidate, untouchabilityChecker)) continue;

    candidateTabindex = getTabindex(candidate);
    if (candidateTabindex === 0) {
      regularTabbables.push(candidate);
    } else {
      orderedTabbables.push({
        documentOrder: i,
        tabIndex: candidateTabindex,
        node: candidate,
      });
    }
  }

  var tabbableNodes = orderedTabbables
    .sort(sortOrderedTabbables)
    .map(function(a) { return a.node })
    .concat(regularTabbables);

  return tabbableNodes;
}

tabbable.isTabbable = isTabbable;
tabbable.isFocusable = isFocusable;

function isNodeMatchingSelectorTabbable(node, untouchabilityChecker) {
  if (
    !isNodeMatchingSelectorFocusable(node, untouchabilityChecker)
    || isNonTabbableRadio(node)
    || getTabindex(node) < 0
  ) {
    return false;
  }
  return true;
}

function isTabbable(node, untouchabilityChecker) {
  if (!node) throw new Error('No node provided');
  if (matches.call(node, candidateSelector) === false) return false;
  return isNodeMatchingSelectorTabbable(node, untouchabilityChecker);
}

function isNodeMatchingSelectorFocusable(node, untouchabilityChecker) {
  untouchabilityChecker = untouchabilityChecker || new UntouchabilityChecker(node.ownerDocument || node);
  if (
    node.disabled
    || isHiddenInput(node)
    || untouchabilityChecker.isUntouchable(node)
  ) {
    return false;
  }
  return true;
}

var focusableCandidateSelector = candidateSelectors.concat('iframe').join(',');
function isFocusable(node, untouchabilityChecker) {
  if (!node) throw new Error('No node provided');
  if (matches.call(node, focusableCandidateSelector) === false) return false;
  return isNodeMatchingSelectorFocusable(node, untouchabilityChecker);
}

function getTabindex(node) {
  var tabindexAttr = parseInt(node.getAttribute('tabindex'), 10);
  if (!isNaN(tabindexAttr)) return tabindexAttr;
  // Browsers do not return `tabIndex` correctly for contentEditable nodes;
  // so if they don't have a tabindex attribute specifically set, assume it's 0.
  if (isContentEditable(node)) return 0;
  return node.tabIndex;
}

function sortOrderedTabbables(a, b) {
  return a.tabIndex === b.tabIndex ? a.documentOrder - b.documentOrder : a.tabIndex - b.tabIndex;
}

// Array.prototype.find not available in IE.
function find(list, predicate) {
  for (var i = 0, length = list.length; i < length; i++) {
    if (predicate(list[i])) return list[i];
  }
}

function isContentEditable(node) {
  return node.contentEditable === 'true';
}

function isInput(node) {
  return node.tagName === 'INPUT';
}

function isHiddenInput(node) {
  return isInput(node) && node.type === 'hidden';
}

function isRadio(node) {
  return isInput(node) && node.type === 'radio';
}

function isNonTabbableRadio(node) {
  return isRadio(node) && !isTabbableRadio(node);
}

function getCheckedRadio(nodes) {
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].checked) {
      return nodes[i];
    }
  }
}

function isTabbableRadio(node) {
  if (!node.name) return true;
  // This won't account for the edge case where you have radio groups with the same
  // in separate forms on the same page.
  var radioSet = node.ownerDocument.querySelectorAll('input[type="radio"][name="' + node.name + '"]');
  var checked = getCheckedRadio(radioSet);
  return !checked || checked === node;
}

// An element is "untouchable" if *it or one of its ancestors* has
// `visibility: hidden` or `display: none`.
function UntouchabilityChecker(elementDocument) {
  this.doc = elementDocument;
  // Node cache must be refreshed on every check, in case
  // the content of the element has changed. The cache contains tuples
  // mapping nodes to their boolean result.
  this.cache = [];
}

// getComputedStyle accurately reflects `visibility: hidden` of ancestors
// but not `display: none`, so we need to recursively check parents.
UntouchabilityChecker.prototype.hasDisplayNone = function hasDisplayNone(node, nodeComputedStyle) {
  if (node.nodeType !== Node.ELEMENT_NODE) return false;

    // Search for a cached result.
    var cached = find(this.cache, function(item) {
      return item === node;
    });
    if (cached) return cached[1];

    nodeComputedStyle = nodeComputedStyle || this.doc.defaultView.getComputedStyle(node);

    var result = false;

    if (nodeComputedStyle.display === 'none') {
      result = true;
    } else if (node.parentNode) {
      result = this.hasDisplayNone(node.parentNode);
    }

    this.cache.push([node, result]);

    return result;
};

UntouchabilityChecker.prototype.isUntouchable = function isUntouchable(node) {
  if (node === this.doc.documentElement) return false;
  var computedStyle = this.doc.defaultView.getComputedStyle(node);
  if (this.hasDisplayNone(node, computedStyle)) return true;
  return computedStyle.visibility === 'hidden';
};

var tabbable_1 = tabbable;

var immutable = extend;

var hasOwnProperty = Object.prototype.hasOwnProperty;

function extend() {
    var target = {};

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
                target[key] = source[key];
            }
        }
    }

    return target
}

var activeFocusTraps = (function() {
  var trapQueue = [];
  return {
    activateTrap: function(trap) {
      if (trapQueue.length > 0) {
        var activeTrap = trapQueue[trapQueue.length - 1];
        if (activeTrap !== trap) {
          activeTrap.pause();
        }
      }

      var trapIndex = trapQueue.indexOf(trap);
      if (trapIndex === -1) {
        trapQueue.push(trap);
      } else {
        // move this existing trap to the front of the queue
        trapQueue.splice(trapIndex, 1);
        trapQueue.push(trap);
      }
    },

    deactivateTrap: function(trap) {
      var trapIndex = trapQueue.indexOf(trap);
      if (trapIndex !== -1) {
        trapQueue.splice(trapIndex, 1);
      }

      if (trapQueue.length > 0) {
        trapQueue[trapQueue.length - 1].unpause();
      }
    }
  };
})();

function focusTrap(element, userOptions) {
  var doc = document;
  var container =
    typeof element === 'string' ? doc.querySelector(element) : element;

  var config = immutable(
    {
      returnFocusOnDeactivate: true,
      escapeDeactivates: true
    },
    userOptions
  );

  var state = {
    firstTabbableNode: null,
    lastTabbableNode: null,
    nodeFocusedBeforeActivation: null,
    mostRecentlyFocusedNode: null,
    active: false,
    paused: false
  };

  var trap = {
    activate: activate,
    deactivate: deactivate,
    pause: pause,
    unpause: unpause
  };

  return trap;

  function activate(activateOptions) {
    if (state.active) return;

    updateTabbableNodes();

    state.active = true;
    state.paused = false;
    state.nodeFocusedBeforeActivation = doc.activeElement;

    var onActivate =
      activateOptions && activateOptions.onActivate
        ? activateOptions.onActivate
        : config.onActivate;
    if (onActivate) {
      onActivate();
    }

    addListeners();
    return trap;
  }

  function deactivate(deactivateOptions) {
    if (!state.active) return;

    removeListeners();
    state.active = false;
    state.paused = false;

    activeFocusTraps.deactivateTrap(trap);

    var onDeactivate =
      deactivateOptions && deactivateOptions.onDeactivate !== undefined
        ? deactivateOptions.onDeactivate
        : config.onDeactivate;
    if (onDeactivate) {
      onDeactivate();
    }

    var returnFocus =
      deactivateOptions && deactivateOptions.returnFocus !== undefined
        ? deactivateOptions.returnFocus
        : config.returnFocusOnDeactivate;
    if (returnFocus) {
      delay(function() {
        tryFocus(state.nodeFocusedBeforeActivation);
      });
    }

    return trap;
  }

  function pause() {
    if (state.paused || !state.active) return;
    state.paused = true;
    removeListeners();
  }

  function unpause() {
    if (!state.paused || !state.active) return;
    state.paused = false;
    addListeners();
  }

  function addListeners() {
    if (!state.active) return;

    // There can be only one listening focus trap at a time
    activeFocusTraps.activateTrap(trap);

    updateTabbableNodes();

    // Delay ensures that the focused element doesn't capture the event
    // that caused the focus trap activation.
    delay(function() {
      tryFocus(getInitialFocusNode());
    });
    doc.addEventListener('focusin', checkFocusIn, true);
    doc.addEventListener('mousedown', checkPointerDown, true);
    doc.addEventListener('touchstart', checkPointerDown, true);
    doc.addEventListener('click', checkClick, true);
    doc.addEventListener('keydown', checkKey, true);

    return trap;
  }

  function removeListeners() {
    if (!state.active) return;

    doc.removeEventListener('focusin', checkFocusIn, true);
    doc.removeEventListener('mousedown', checkPointerDown, true);
    doc.removeEventListener('touchstart', checkPointerDown, true);
    doc.removeEventListener('click', checkClick, true);
    doc.removeEventListener('keydown', checkKey, true);

    return trap;
  }

  function getNodeForOption(optionName) {
    var optionValue = config[optionName];
    var node = optionValue;
    if (!optionValue) {
      return null;
    }
    if (typeof optionValue === 'string') {
      node = doc.querySelector(optionValue);
      if (!node) {
        throw new Error('`' + optionName + '` refers to no known node');
      }
    }
    if (typeof optionValue === 'function') {
      node = optionValue();
      if (!node) {
        throw new Error('`' + optionName + '` did not return a node');
      }
    }
    return node;
  }

  function getInitialFocusNode() {
    var node;
    if (getNodeForOption('initialFocus') !== null) {
      node = getNodeForOption('initialFocus');
    } else if (container.contains(doc.activeElement)) {
      node = doc.activeElement;
    } else {
      node = state.firstTabbableNode || getNodeForOption('fallbackFocus');
    }

    if (!node) {
      throw new Error(
        "You can't have a focus-trap without at least one focusable element"
      );
    }

    return node;
  }

  // This needs to be done on mousedown and touchstart instead of click
  // so that it precedes the focus event.
  function checkPointerDown(e) {
    if (container.contains(e.target)) return;
    if (config.clickOutsideDeactivates) {
      deactivate({
        returnFocus: !tabbable_1.isFocusable(e.target)
      });
    } else {
      e.preventDefault();
    }
  }

  // In case focus escapes the trap for some strange reason, pull it back in.
  function checkFocusIn(e) {
    // In Firefox when you Tab out of an iframe the Document is briefly focused.
    if (container.contains(e.target) || e.target instanceof Document) {
      return;
    }
    e.stopImmediatePropagation();
    tryFocus(state.mostRecentlyFocusedNode || getInitialFocusNode());
  }

  function checkKey(e) {
    if (config.escapeDeactivates !== false && isEscapeEvent(e)) {
      e.preventDefault();
      deactivate();
      return;
    }
    if (isTabEvent(e)) {
      checkTab(e);
      return;
    }
  }

  // Hijack Tab events on the first and last focusable nodes of the trap,
  // in order to prevent focus from escaping. If it escapes for even a
  // moment it can end up scrolling the page and causing confusion so we
  // kind of need to capture the action at the keydown phase.
  function checkTab(e) {
    updateTabbableNodes();
    if (e.shiftKey && e.target === state.firstTabbableNode) {
      e.preventDefault();
      tryFocus(state.lastTabbableNode);
      return;
    }
    if (!e.shiftKey && e.target === state.lastTabbableNode) {
      e.preventDefault();
      tryFocus(state.firstTabbableNode);
      return;
    }
  }

  function checkClick(e) {
    if (config.clickOutsideDeactivates) return;
    if (container.contains(e.target)) return;
    e.preventDefault();
    e.stopImmediatePropagation();
  }

  function updateTabbableNodes() {
    var tabbableNodes = tabbable_1(container);
    state.firstTabbableNode = tabbableNodes[0] || getInitialFocusNode();
    state.lastTabbableNode =
      tabbableNodes[tabbableNodes.length - 1] || getInitialFocusNode();
  }

  function tryFocus(node) {
    if (node === doc.activeElement) return;
    if (!node || !node.focus) {
      tryFocus(getInitialFocusNode());
      return;
    }

    node.focus();
    state.mostRecentlyFocusedNode = node;
    if (isSelectableInput(node)) {
      node.select();
    }
  }
}

function isSelectableInput(node) {
  return (
    node.tagName &&
    node.tagName.toLowerCase() === 'input' &&
    typeof node.select === 'function'
  );
}

function isEscapeEvent(e) {
  return e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27;
}

function isTabEvent(e) {
  return e.key === 'Tab' || e.keyCode === 9;
}

function delay(fn) {
  return setTimeout(fn, 0);
}

var focusTrap_1 = focusTrap;

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
 */
function createFocusTrapInstance(surfaceEl, focusTrapFactory, initialFocusEl) {
    if (focusTrapFactory === void 0) { focusTrapFactory = focusTrap_1; }
    return focusTrapFactory(surfaceEl, {
        clickOutsideDeactivates: true,
        escapeDeactivates: false,
        initialFocus: initialFocusEl,
    });
}
function isScrollable(el) {
    return el ? el.scrollHeight > el.offsetHeight : false;
}
function areTopsMisaligned(els) {
    var tops = new Set();
    [].forEach.call(els, function (el) { return tops.add(el.offsetTop); });
    return tops.size > 1;
}

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
 */
var cssClasses$2 = {
    CLOSING: 'mdc-dialog--closing',
    OPEN: 'mdc-dialog--open',
    OPENING: 'mdc-dialog--opening',
    SCROLLABLE: 'mdc-dialog--scrollable',
    SCROLL_LOCK: 'mdc-dialog-scroll-lock',
    STACKED: 'mdc-dialog--stacked',
};
var strings$2 = {
    ACTION_ATTRIBUTE: 'data-mdc-dialog-action',
    BUTTON_SELECTOR: '.mdc-dialog__button',
    CLOSED_EVENT: 'MDCDialog:closed',
    CLOSE_ACTION: 'close',
    CLOSING_EVENT: 'MDCDialog:closing',
    CONTAINER_SELECTOR: '.mdc-dialog__container',
    CONTENT_SELECTOR: '.mdc-dialog__content',
    DEFAULT_BUTTON_SELECTOR: '.mdc-dialog__button--default',
    DESTROY_ACTION: 'destroy',
    OPENED_EVENT: 'MDCDialog:opened',
    OPENING_EVENT: 'MDCDialog:opening',
    SCRIM_SELECTOR: '.mdc-dialog__scrim',
    SUPPRESS_DEFAULT_PRESS_SELECTOR: [
        'textarea',
        '.mdc-menu .mdc-list-item',
    ].join(', '),
    SURFACE_SELECTOR: '.mdc-dialog__surface',
};
var numbers$1 = {
    DIALOG_ANIMATION_CLOSE_TIME_MS: 75,
    DIALOG_ANIMATION_OPEN_TIME_MS: 150,
};

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
 */
var MDCDialogFoundation = /** @class */ (function (_super) {
    __extends(MDCDialogFoundation, _super);
    function MDCDialogFoundation(adapter) {
        var _this = _super.call(this, __assign({}, MDCDialogFoundation.defaultAdapter, adapter)) || this;
        _this.isOpen_ = false;
        _this.animationFrame_ = 0;
        _this.animationTimer_ = 0;
        _this.layoutFrame_ = 0;
        _this.escapeKeyAction_ = strings$2.CLOSE_ACTION;
        _this.scrimClickAction_ = strings$2.CLOSE_ACTION;
        _this.autoStackButtons_ = true;
        _this.areButtonsStacked_ = false;
        return _this;
    }
    Object.defineProperty(MDCDialogFoundation, "cssClasses", {
        get: function () {
            return cssClasses$2;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCDialogFoundation, "strings", {
        get: function () {
            return strings$2;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCDialogFoundation, "numbers", {
        get: function () {
            return numbers$1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCDialogFoundation, "defaultAdapter", {
        get: function () {
            return {
                addBodyClass: function () { return undefined; },
                addClass: function () { return undefined; },
                areButtonsStacked: function () { return false; },
                clickDefaultButton: function () { return undefined; },
                eventTargetMatches: function () { return false; },
                getActionFromEvent: function () { return ''; },
                hasClass: function () { return false; },
                isContentScrollable: function () { return false; },
                notifyClosed: function () { return undefined; },
                notifyClosing: function () { return undefined; },
                notifyOpened: function () { return undefined; },
                notifyOpening: function () { return undefined; },
                releaseFocus: function () { return undefined; },
                removeBodyClass: function () { return undefined; },
                removeClass: function () { return undefined; },
                reverseButtons: function () { return undefined; },
                trapFocus: function () { return undefined; },
            };
        },
        enumerable: true,
        configurable: true
    });
    MDCDialogFoundation.prototype.init = function () {
        if (this.adapter_.hasClass(cssClasses$2.STACKED)) {
            this.setAutoStackButtons(false);
        }
    };
    MDCDialogFoundation.prototype.destroy = function () {
        if (this.isOpen_) {
            this.close(strings$2.DESTROY_ACTION);
        }
        if (this.animationTimer_) {
            clearTimeout(this.animationTimer_);
            this.handleAnimationTimerEnd_();
        }
        if (this.layoutFrame_) {
            cancelAnimationFrame(this.layoutFrame_);
            this.layoutFrame_ = 0;
        }
    };
    MDCDialogFoundation.prototype.open = function () {
        var _this = this;
        this.isOpen_ = true;
        this.adapter_.notifyOpening();
        this.adapter_.addClass(cssClasses$2.OPENING);
        // Wait a frame once display is no longer "none", to establish basis for animation
        this.runNextAnimationFrame_(function () {
            _this.adapter_.addClass(cssClasses$2.OPEN);
            _this.adapter_.addBodyClass(cssClasses$2.SCROLL_LOCK);
            _this.layout();
            _this.animationTimer_ = setTimeout(function () {
                _this.handleAnimationTimerEnd_();
                _this.adapter_.trapFocus();
                _this.adapter_.notifyOpened();
            }, numbers$1.DIALOG_ANIMATION_OPEN_TIME_MS);
        });
    };
    MDCDialogFoundation.prototype.close = function (action) {
        var _this = this;
        if (action === void 0) { action = ''; }
        if (!this.isOpen_) {
            // Avoid redundant close calls (and events), e.g. from keydown on elements that inherently emit click
            return;
        }
        this.isOpen_ = false;
        this.adapter_.notifyClosing(action);
        this.adapter_.addClass(cssClasses$2.CLOSING);
        this.adapter_.removeClass(cssClasses$2.OPEN);
        this.adapter_.removeBodyClass(cssClasses$2.SCROLL_LOCK);
        cancelAnimationFrame(this.animationFrame_);
        this.animationFrame_ = 0;
        clearTimeout(this.animationTimer_);
        this.animationTimer_ = setTimeout(function () {
            _this.adapter_.releaseFocus();
            _this.handleAnimationTimerEnd_();
            _this.adapter_.notifyClosed(action);
        }, numbers$1.DIALOG_ANIMATION_CLOSE_TIME_MS);
    };
    MDCDialogFoundation.prototype.isOpen = function () {
        return this.isOpen_;
    };
    MDCDialogFoundation.prototype.getEscapeKeyAction = function () {
        return this.escapeKeyAction_;
    };
    MDCDialogFoundation.prototype.setEscapeKeyAction = function (action) {
        this.escapeKeyAction_ = action;
    };
    MDCDialogFoundation.prototype.getScrimClickAction = function () {
        return this.scrimClickAction_;
    };
    MDCDialogFoundation.prototype.setScrimClickAction = function (action) {
        this.scrimClickAction_ = action;
    };
    MDCDialogFoundation.prototype.getAutoStackButtons = function () {
        return this.autoStackButtons_;
    };
    MDCDialogFoundation.prototype.setAutoStackButtons = function (autoStack) {
        this.autoStackButtons_ = autoStack;
    };
    MDCDialogFoundation.prototype.layout = function () {
        var _this = this;
        if (this.layoutFrame_) {
            cancelAnimationFrame(this.layoutFrame_);
        }
        this.layoutFrame_ = requestAnimationFrame(function () {
            _this.layoutInternal_();
            _this.layoutFrame_ = 0;
        });
    };
    MDCDialogFoundation.prototype.handleInteraction = function (evt) {
        var isClick = evt.type === 'click';
        var isEnter = evt.key === 'Enter' || evt.keyCode === 13;
        var isSpace = evt.key === 'Space' || evt.keyCode === 32;
        var isScrim = this.adapter_.eventTargetMatches(evt.target, strings$2.SCRIM_SELECTOR);
        var isDefault = !this.adapter_.eventTargetMatches(evt.target, strings$2.SUPPRESS_DEFAULT_PRESS_SELECTOR);
        // Check for scrim click first since it doesn't require querying ancestors
        if (isClick && isScrim && this.scrimClickAction_ !== '') {
            this.close(this.scrimClickAction_);
        }
        else if (isClick || isSpace || isEnter) {
            var action = this.adapter_.getActionFromEvent(evt);
            if (action) {
                this.close(action);
            }
            else if (isEnter && isDefault) {
                this.adapter_.clickDefaultButton();
            }
        }
    };
    MDCDialogFoundation.prototype.handleDocumentKeydown = function (evt) {
        var isEscape = evt.key === 'Escape' || evt.keyCode === 27;
        if (isEscape && this.escapeKeyAction_ !== '') {
            this.close(this.escapeKeyAction_);
        }
    };
    MDCDialogFoundation.prototype.layoutInternal_ = function () {
        if (this.autoStackButtons_) {
            this.detectStackedButtons_();
        }
        this.detectScrollableContent_();
    };
    MDCDialogFoundation.prototype.handleAnimationTimerEnd_ = function () {
        this.animationTimer_ = 0;
        this.adapter_.removeClass(cssClasses$2.OPENING);
        this.adapter_.removeClass(cssClasses$2.CLOSING);
    };
    /**
     * Runs the given logic on the next animation frame, using setTimeout to factor in Firefox reflow behavior.
     */
    MDCDialogFoundation.prototype.runNextAnimationFrame_ = function (callback) {
        var _this = this;
        cancelAnimationFrame(this.animationFrame_);
        this.animationFrame_ = requestAnimationFrame(function () {
            _this.animationFrame_ = 0;
            clearTimeout(_this.animationTimer_);
            _this.animationTimer_ = setTimeout(callback, 0);
        });
    };
    MDCDialogFoundation.prototype.detectStackedButtons_ = function () {
        // Remove the class first to let us measure the buttons' natural positions.
        this.adapter_.removeClass(cssClasses$2.STACKED);
        var areButtonsStacked = this.adapter_.areButtonsStacked();
        if (areButtonsStacked) {
            this.adapter_.addClass(cssClasses$2.STACKED);
        }
        if (areButtonsStacked !== this.areButtonsStacked_) {
            this.adapter_.reverseButtons();
            this.areButtonsStacked_ = areButtonsStacked;
        }
    };
    MDCDialogFoundation.prototype.detectScrollableContent_ = function () {
        // Remove the class first to let us measure the natural height of the content.
        this.adapter_.removeClass(cssClasses$2.SCROLLABLE);
        if (this.adapter_.isContentScrollable()) {
            this.adapter_.addClass(cssClasses$2.SCROLLABLE);
        }
    };
    return MDCDialogFoundation;
}(MDCFoundation));

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
 */
var strings$3 = MDCDialogFoundation.strings;
var MDCDialog = /** @class */ (function (_super) {
    __extends(MDCDialog, _super);
    function MDCDialog() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(MDCDialog.prototype, "isOpen", {
        get: function () {
            return this.foundation_.isOpen();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCDialog.prototype, "escapeKeyAction", {
        get: function () {
            return this.foundation_.getEscapeKeyAction();
        },
        set: function (action) {
            this.foundation_.setEscapeKeyAction(action);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCDialog.prototype, "scrimClickAction", {
        get: function () {
            return this.foundation_.getScrimClickAction();
        },
        set: function (action) {
            this.foundation_.setScrimClickAction(action);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCDialog.prototype, "autoStackButtons", {
        get: function () {
            return this.foundation_.getAutoStackButtons();
        },
        set: function (autoStack) {
            this.foundation_.setAutoStackButtons(autoStack);
        },
        enumerable: true,
        configurable: true
    });
    MDCDialog.attachTo = function (root) {
        return new MDCDialog(root);
    };
    MDCDialog.prototype.initialize = function (focusTrapFactory, initialFocusEl) {
        var e_1, _a;
        var container = this.root_.querySelector(strings$3.CONTAINER_SELECTOR);
        if (!container) {
            throw new Error("Dialog component requires a " + strings$3.CONTAINER_SELECTOR + " container element");
        }
        this.container_ = container;
        this.content_ = this.root_.querySelector(strings$3.CONTENT_SELECTOR);
        this.buttons_ = [].slice.call(this.root_.querySelectorAll(strings$3.BUTTON_SELECTOR));
        this.defaultButton_ = this.root_.querySelector(strings$3.DEFAULT_BUTTON_SELECTOR);
        this.focusTrapFactory_ = focusTrapFactory;
        this.initialFocusEl_ = initialFocusEl;
        this.buttonRipples_ = [];
        try {
            for (var _b = __values(this.buttons_), _c = _b.next(); !_c.done; _c = _b.next()) {
                var buttonEl = _c.value;
                this.buttonRipples_.push(new MDCRipple(buttonEl));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    MDCDialog.prototype.initialSyncWithDOM = function () {
        var _this = this;
        this.focusTrap_ = createFocusTrapInstance(this.container_, this.focusTrapFactory_, this.initialFocusEl_);
        this.handleInteraction_ = this.foundation_.handleInteraction.bind(this.foundation_);
        this.handleDocumentKeydown_ = this.foundation_.handleDocumentKeydown.bind(this.foundation_);
        this.handleLayout_ = this.layout.bind(this);
        var LAYOUT_EVENTS = ['resize', 'orientationchange'];
        this.handleOpening_ = function () {
            LAYOUT_EVENTS.forEach(function (evtType) { return window.addEventListener(evtType, _this.handleLayout_); });
            document.addEventListener('keydown', _this.handleDocumentKeydown_);
        };
        this.handleClosing_ = function () {
            LAYOUT_EVENTS.forEach(function (evtType) { return window.removeEventListener(evtType, _this.handleLayout_); });
            document.removeEventListener('keydown', _this.handleDocumentKeydown_);
        };
        this.listen('click', this.handleInteraction_);
        this.listen('keydown', this.handleInteraction_);
        this.listen(strings$3.OPENING_EVENT, this.handleOpening_);
        this.listen(strings$3.CLOSING_EVENT, this.handleClosing_);
    };
    MDCDialog.prototype.destroy = function () {
        this.unlisten('click', this.handleInteraction_);
        this.unlisten('keydown', this.handleInteraction_);
        this.unlisten(strings$3.OPENING_EVENT, this.handleOpening_);
        this.unlisten(strings$3.CLOSING_EVENT, this.handleClosing_);
        this.handleClosing_();
        this.buttonRipples_.forEach(function (ripple) { return ripple.destroy(); });
        _super.prototype.destroy.call(this);
    };
    MDCDialog.prototype.layout = function () {
        this.foundation_.layout();
    };
    MDCDialog.prototype.open = function () {
        this.foundation_.open();
    };
    MDCDialog.prototype.close = function (action) {
        if (action === void 0) { action = ''; }
        this.foundation_.close(action);
    };
    MDCDialog.prototype.getDefaultFoundation = function () {
        var _this = this;
        // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
        // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
        var adapter = {
            addBodyClass: function (className) { return document.body.classList.add(className); },
            addClass: function (className) { return _this.root_.classList.add(className); },
            areButtonsStacked: function () { return areTopsMisaligned(_this.buttons_); },
            clickDefaultButton: function () { return _this.defaultButton_ && _this.defaultButton_.click(); },
            eventTargetMatches: function (target, selector) { return target ? matches$1(target, selector) : false; },
            getActionFromEvent: function (evt) {
                if (!evt.target) {
                    return '';
                }
                var element = closest(evt.target, "[" + strings$3.ACTION_ATTRIBUTE + "]");
                return element && element.getAttribute(strings$3.ACTION_ATTRIBUTE);
            },
            hasClass: function (className) { return _this.root_.classList.contains(className); },
            isContentScrollable: function () { return isScrollable(_this.content_); },
            notifyClosed: function (action) { return _this.emit(strings$3.CLOSED_EVENT, action ? { action: action } : {}); },
            notifyClosing: function (action) { return _this.emit(strings$3.CLOSING_EVENT, action ? { action: action } : {}); },
            notifyOpened: function () { return _this.emit(strings$3.OPENED_EVENT, {}); },
            notifyOpening: function () { return _this.emit(strings$3.OPENING_EVENT, {}); },
            releaseFocus: function () { return _this.focusTrap_.deactivate(); },
            removeBodyClass: function (className) { return document.body.classList.remove(className); },
            removeClass: function (className) { return _this.root_.classList.remove(className); },
            reverseButtons: function () {
                _this.buttons_.reverse();
                _this.buttons_.forEach(function (button) {
                    button.parentElement.appendChild(button);
                });
            },
            trapFocus: function () { return _this.focusTrap_.activate(); },
        };
        return new MDCDialogFoundation(adapter);
    };
    return MDCDialog;
}(MDCComponent));

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

class Dialog {
    constructor() {
        /**
         * Set to `true` to make the dialog "fullscreen".
         */
        this.fullscreen = false;
        /**
         * `true` if the dialog is open, `false` otherwise.
         * Defaults to `false`.
         */
        this.open = false;
        /**
         * Defines which action triggers a close-event.
         */
        this.closingActions = {
            escapeKey: true,
            scrimClick: true,
        };
        this.handleMdcOpened = this.handleMdcOpened.bind(this);
        this.handleMdcClosed = this.handleMdcClosed.bind(this);
        this.handleMdcClosing = this.handleMdcClosing.bind(this);
    }
    componentWillLoad() {
        this.id = createRandomString();
    }
    componentDidLoad() {
        this.mdcDialog = new MDCDialog(this.host.shadowRoot.querySelector('.mdc-dialog'));
        if (this.open) {
            this.mdcDialog.open();
        }
        const { activate, deactivate } = createFocusTrapInstance(this.host.shadowRoot.querySelector('.mdc-dialog__surface'), focusTrap_1, this.host.shadowRoot.querySelector('#initialFocusEl') // tslint:disable-line:no-useless-cast
        );
        this.mdcDialog.foundation_.adapter_.trapFocus = () => {
            activate();
        };
        this.mdcDialog.foundation_.adapter_.releaseFocus = () => {
            deactivate();
        };
        this.mdcDialog.listen('MDCDialog:opened', this.handleMdcOpened);
        this.mdcDialog.listen('MDCDialog:closed', this.handleMdcClosed);
        this.mdcDialog.listen('MDCDialog:closing', this.handleMdcClosing);
        this.mdcDialog.scrimClickAction = this.closingActions.scrimClick
            ? 'close'
            : '';
        this.mdcDialog.escapeKeyAction = this.closingActions.escapeKey
            ? 'close'
            : '';
    }
    componentDidUnload() {
        this.mdcDialog.unlisten('MDCDialog:opened', this.handleMdcOpened);
        this.mdcDialog.unlisten('MDCDialog:closed', this.handleMdcClosed);
        this.mdcDialog.unlisten('MDCDialog:closing', this.handleMdcClosing);
        this.mdcDialog.destroy();
    }
    render() {
        return (h("div", { class: "mdc-dialog", role: "alertdialog", "aria-modal": "true", "aria-labelledby": 'limel-dialog-title-' + this.id, "aria-describedby": 'limel-dialog-content-' + this.id },
            h("input", { hidden: true, id: "initialFocusEl" }),
            h("div", { class: `mdc-dialog__container ${this.fullscreen ? 'full-screen' : ''}` },
                h("div", { class: "mdc-dialog__surface" },
                    this.renderHeading(),
                    h("div", { class: "mdc-dialog__content", id: 'limel-dialog-content-' + this.id },
                        h("slot", null)),
                    h("footer", { class: "mdc-dialog__actions" },
                        h("slot", { name: "button" })))),
            h("div", { class: "mdc-dialog__scrim" })));
    }
    watchHandler(newValue, oldValue) {
        if (oldValue === newValue) {
            return;
        }
        if (newValue) {
            this.mdcDialog.open();
        }
        else {
            this.mdcDialog.close();
        }
    }
    handleMdcOpened() {
        // When the opening-animation has completed, dispatch a
        // resize-event so that any content that depends on
        // javascript for layout has a chance to update to the
        // final layout of the dialog. /Ads
        dispatchResizeEvent();
    }
    handleMdcClosed() {
        if (this.open) {
            this.close.emit();
        }
        this.open = false;
    }
    handleMdcClosing() {
        this.closing.emit();
    }
    isBadgeHeading(heading) {
        return typeof heading === 'object' && !!heading.title && !!heading.icon;
    }
    renderHeading() {
        if (this.isBadgeHeading(this.heading)) {
            const { title, subtitle, supportingText, icon, badgeIcon, } = this.heading;
            return (h("div", { class: "dialog__heading" },
                h("limel-icon", { size: "large", name: icon, badge: badgeIcon !== false }),
                h("div", null,
                    h("h2", { class: "mdc-typography--headline2 dialog__title" }, title),
                    subtitle ? (h("h3", { class: "mdc-typography--subtitle1 dialog__subtitle" }, subtitle)) : null,
                    supportingText ? (h("h3", { class: "mdc-typography--subtitle1 dialog__supporting-text" }, supportingText)) : null)));
        }
        else if (this.heading) {
            return h("h2", { class: "mdc-dialog__title" }, this.heading.trim());
        }
        return null;
    }
    static get is() { return "limel-dialog"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "closingActions": {
            "type": "Any",
            "attr": "closing-actions",
            "reflectToAttr": true
        },
        "fullscreen": {
            "type": Boolean,
            "attr": "fullscreen",
            "reflectToAttr": true
        },
        "heading": {
            "type": String,
            "attr": "heading"
        },
        "host": {
            "elementRef": true
        },
        "open": {
            "type": Boolean,
            "attr": "open",
            "reflectToAttr": true,
            "mutable": true,
            "watchCallbacks": ["watchHandler"]
        }
    }; }
    static get events() { return [{
            "name": "close",
            "method": "close",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "closing",
            "method": "closing",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get style() { return ":host {\n  --mdc-theme-primary: var(--lime-primary-color, #26a69a);\n  --mdc-theme-secondary: var(--lime-secondary-color, #575756);\n  --mdc-theme-on-primary: var(--lime-on-primary-color, #fff);\n  --mdc-theme-on-secondary: var(--lime-on-secondary-color, #fff); }\n\n:root {\n  --mdc-theme-primary: #26a69a;\n  --mdc-theme-secondary: #575756;\n  --mdc-theme-background: #fff;\n  --mdc-theme-surface: #fff;\n  --mdc-theme-error: #b00020;\n  --mdc-theme-on-primary: #fff;\n  --mdc-theme-on-secondary: #fff;\n  --mdc-theme-on-surface: #000;\n  --mdc-theme-on-error: #fff;\n  --mdc-theme-text-primary-on-background: rgba(0, 0, 0, 0.87);\n  --mdc-theme-text-secondary-on-background: rgba(0, 0, 0, 0.54);\n  --mdc-theme-text-hint-on-background: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-disabled-on-background: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-icon-on-background: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-primary-on-light: rgba(0, 0, 0, 0.87);\n  --mdc-theme-text-secondary-on-light: rgba(0, 0, 0, 0.54);\n  --mdc-theme-text-hint-on-light: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-disabled-on-light: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-icon-on-light: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-primary-on-dark: white;\n  --mdc-theme-text-secondary-on-dark: rgba(255, 255, 255, 0.7);\n  --mdc-theme-text-hint-on-dark: rgba(255, 255, 255, 0.5);\n  --mdc-theme-text-disabled-on-dark: rgba(255, 255, 255, 0.5);\n  --mdc-theme-text-icon-on-dark: rgba(255, 255, 255, 0.5); }\n\n.mdc-theme--primary {\n  color: #26a69a !important;\n  /* \@alternate */\n  color: var(--mdc-theme-primary, #26a69a) !important; }\n\n.mdc-theme--secondary {\n  color: #575756 !important;\n  /* \@alternate */\n  color: var(--mdc-theme-secondary, #575756) !important; }\n\n.mdc-theme--background {\n  background-color: #fff;\n  /* \@alternate */\n  background-color: var(--mdc-theme-background, #fff); }\n\n.mdc-theme--surface {\n  background-color: #fff;\n  /* \@alternate */\n  background-color: var(--mdc-theme-surface, #fff); }\n\n.mdc-theme--error {\n  color: #b00020 !important;\n  /* \@alternate */\n  color: var(--mdc-theme-error, #b00020) !important; }\n\n.mdc-theme--on-primary {\n  color: #fff !important;\n  /* \@alternate */\n  color: var(--mdc-theme-on-primary, #fff) !important; }\n\n.mdc-theme--on-secondary {\n  color: #fff !important;\n  /* \@alternate */\n  color: var(--mdc-theme-on-secondary, #fff) !important; }\n\n.mdc-theme--on-surface {\n  color: #000 !important;\n  /* \@alternate */\n  color: var(--mdc-theme-on-surface, #000) !important; }\n\n.mdc-theme--on-error {\n  color: #fff !important;\n  /* \@alternate */\n  color: var(--mdc-theme-on-error, #fff) !important; }\n\n.mdc-theme--text-primary-on-background {\n  color: rgba(0, 0, 0, 0.87) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-primary-on-background, rgba(0, 0, 0, 0.87)) !important; }\n\n.mdc-theme--text-secondary-on-background {\n  color: rgba(0, 0, 0, 0.54) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-secondary-on-background, rgba(0, 0, 0, 0.54)) !important; }\n\n.mdc-theme--text-hint-on-background {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.38)) !important; }\n\n.mdc-theme--text-disabled-on-background {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-disabled-on-background, rgba(0, 0, 0, 0.38)) !important; }\n\n.mdc-theme--text-icon-on-background {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-icon-on-background, rgba(0, 0, 0, 0.38)) !important; }\n\n.mdc-theme--text-primary-on-light {\n  color: rgba(0, 0, 0, 0.87) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-primary-on-light, rgba(0, 0, 0, 0.87)) !important; }\n\n.mdc-theme--text-secondary-on-light {\n  color: rgba(0, 0, 0, 0.54) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-secondary-on-light, rgba(0, 0, 0, 0.54)) !important; }\n\n.mdc-theme--text-hint-on-light {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-hint-on-light, rgba(0, 0, 0, 0.38)) !important; }\n\n.mdc-theme--text-disabled-on-light {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-disabled-on-light, rgba(0, 0, 0, 0.38)) !important; }\n\n.mdc-theme--text-icon-on-light {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-icon-on-light, rgba(0, 0, 0, 0.38)) !important; }\n\n.mdc-theme--text-primary-on-dark {\n  color: white !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-primary-on-dark, white) !important; }\n\n.mdc-theme--text-secondary-on-dark {\n  color: rgba(255, 255, 255, 0.7) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-secondary-on-dark, rgba(255, 255, 255, 0.7)) !important; }\n\n.mdc-theme--text-hint-on-dark {\n  color: rgba(255, 255, 255, 0.5) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-hint-on-dark, rgba(255, 255, 255, 0.5)) !important; }\n\n.mdc-theme--text-disabled-on-dark {\n  color: rgba(255, 255, 255, 0.5) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-disabled-on-dark, rgba(255, 255, 255, 0.5)) !important; }\n\n.mdc-theme--text-icon-on-dark {\n  color: rgba(255, 255, 255, 0.5) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-icon-on-dark, rgba(255, 255, 255, 0.5)) !important; }\n\n.mdc-theme--primary-bg {\n  background-color: #26a69a !important;\n  /* \@alternate */\n  background-color: var(--mdc-theme-primary, #26a69a) !important; }\n\n.mdc-theme--secondary-bg {\n  background-color: #575756 !important;\n  /* \@alternate */\n  background-color: var(--mdc-theme-secondary, #575756) !important; }\n\n.mdc-typography {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased; }\n\n.mdc-typography--headline1 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1rem;\n  line-height: 0.875rem;\n  font-weight: 300;\n  letter-spacing: -0.01562em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--headline2 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1rem;\n  line-height: 0.875rem;\n  font-weight: 300;\n  letter-spacing: -0.00833em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--headline3 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1rem;\n  line-height: 0.875rem;\n  font-weight: 400;\n  letter-spacing: normal;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--headline4 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1rem;\n  line-height: 0.875rem;\n  font-weight: 400;\n  letter-spacing: 0.00735em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--headline5 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.875rem;\n  line-height: 0.875rem;\n  font-weight: 400;\n  letter-spacing: normal;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--headline6 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.875rem;\n  line-height: 0.875rem;\n  font-weight: 500;\n  letter-spacing: 0.0125em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--subtitle1 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.875rem;\n  line-height: 1.125rem;\n  font-weight: 400;\n  letter-spacing: 0.00937em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--subtitle2 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.8125rem;\n  line-height: 1.125rem;\n  font-weight: 500;\n  letter-spacing: 0.00714em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--body1 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.8125rem;\n  line-height: 1.5rem;\n  font-weight: 400;\n  letter-spacing: 0.03125em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--body2 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.8125rem;\n  line-height: 1.625rem;\n  font-weight: 400;\n  letter-spacing: 0.01786em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--caption {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.6875rem;\n  line-height: 0.875rem;\n  font-weight: 400;\n  letter-spacing: 0.03333em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--button {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.875rem;\n  line-height: 2.25rem;\n  font-weight: 500;\n  letter-spacing: 0.08929em;\n  text-decoration: none;\n  text-transform: none; }\n\n.mdc-typography--overline {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.6875rem;\n  line-height: 0.875rem;\n  font-weight: 500;\n  letter-spacing: 0.16667em;\n  text-decoration: none;\n  text-transform: uppercase; }\n\n.mdc-dialog,\n.mdc-dialog__scrim {\n  position: fixed;\n  top: 0;\n  left: 0;\n  -ms-flex-align: center;\n  align-items: center;\n  -ms-flex-pack: center;\n  justify-content: center;\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box;\n  width: 100%;\n  height: 100%; }\n\n.mdc-dialog {\n  display: none;\n  z-index: 7; }\n  .mdc-dialog .mdc-dialog__surface {\n    background-color: #fff;\n    /* \@alternate */\n    background-color: var(--mdc-theme-surface, #fff); }\n  .mdc-dialog .mdc-dialog__scrim {\n    background-color: rgba(0, 0, 0, 0.32); }\n  .mdc-dialog .mdc-dialog__title {\n    color: rgba(0, 0, 0, 0.87); }\n  .mdc-dialog .mdc-dialog__content {\n    color: rgba(0, 0, 0, 0.6); }\n  .mdc-dialog.mdc-dialog--scrollable .mdc-dialog__title,\n  .mdc-dialog.mdc-dialog--scrollable .mdc-dialog__actions {\n    border-color: rgba(0, 0, 0, 0.12); }\n  .mdc-dialog .mdc-dialog__surface {\n    min-width: 17.5rem; }\n  .mdc-dialog .mdc-dialog__surface {\n    max-width: calc(100vw - 2rem); }\n  .mdc-dialog .mdc-dialog__surface {\n    max-height: calc(100vh - 2rem); }\n  .mdc-dialog .mdc-dialog__surface {\n    border-radius: 0.25rem; }\n\n.mdc-dialog__scrim {\n  opacity: 0;\n  z-index: -1; }\n\n.mdc-dialog__container {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-direction: row;\n  flex-direction: row;\n  -ms-flex-pack: distribute;\n  justify-content: space-around;\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box;\n  -webkit-transform: scale(0.8);\n  transform: scale(0.8);\n  opacity: 0; }\n\n.mdc-dialog__surface {\n  -webkit-box-shadow: 0rem 0.6875rem 0.9375rem -0.4375rem rgba(0, 0, 0, 0.2), 0rem 1.5rem 2.375rem 0.1875rem rgba(0, 0, 0, 0.14), 0rem 0.5625rem 2.875rem 0.5rem rgba(0, 0, 0, 0.12);\n  box-shadow: 0rem 0.6875rem 0.9375rem -0.4375rem rgba(0, 0, 0, 0.2), 0rem 1.5rem 2.375rem 0.1875rem rgba(0, 0, 0, 0.14), 0rem 0.5625rem 2.875rem 0.5rem rgba(0, 0, 0, 0.12);\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-direction: column;\n  flex-direction: column;\n  -ms-flex-positive: 0;\n  flex-grow: 0;\n  -ms-flex-negative: 0;\n  flex-shrink: 0;\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box;\n  max-width: 100%;\n  max-height: 100%; }\n  .mdc-dialog[dir=\"rtl\"] .mdc-dialog__surface,\n  [dir=\"rtl\"] .mdc-dialog .mdc-dialog__surface {\n    text-align: right; }\n\n.mdc-dialog__title {\n  display: block;\n  margin-top: 0;\n  /* \@alternate */\n  line-height: normal;\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.875rem;\n  line-height: 0.875rem;\n  font-weight: 500;\n  letter-spacing: 0.0125em;\n  text-decoration: inherit;\n  text-transform: inherit;\n  display: block;\n  position: relative;\n  -ms-flex-negative: 0;\n  flex-shrink: 0;\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box;\n  margin: 0;\n  padding: 0 1.5rem 0.5625rem;\n  border-bottom: 0.0625rem solid transparent; }\n  .mdc-dialog__title::before {\n    display: inline-block;\n    width: 0;\n    height: 2.5rem;\n    content: \"\";\n    vertical-align: 0; }\n  .mdc-dialog[dir=\"rtl\"] .mdc-dialog__title,\n  [dir=\"rtl\"] .mdc-dialog .mdc-dialog__title {\n    text-align: right; }\n\n.mdc-dialog--scrollable .mdc-dialog__title {\n  padding-bottom: 0.9375rem; }\n\n.mdc-dialog__content {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.8125rem;\n  line-height: 1.5rem;\n  font-weight: 400;\n  letter-spacing: 0.03125em;\n  text-decoration: inherit;\n  text-transform: inherit;\n  -ms-flex-positive: 1;\n  flex-grow: 1;\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box;\n  margin: 0;\n  padding: 1.25rem 1.5rem;\n  overflow: auto;\n  -webkit-overflow-scrolling: touch; }\n  .mdc-dialog__content > :first-child {\n    margin-top: 0; }\n  .mdc-dialog__content > :last-child {\n    margin-bottom: 0; }\n\n.mdc-dialog__title + .mdc-dialog__content {\n  padding-top: 0; }\n\n.mdc-dialog--scrollable .mdc-dialog__content {\n  padding-top: 0.5rem;\n  padding-bottom: 0.5rem; }\n\n.mdc-dialog__content .mdc-list:first-child:last-child {\n  padding: 0.375rem 0 0; }\n\n.mdc-dialog--scrollable .mdc-dialog__content .mdc-list:first-child:last-child {\n  padding: 0; }\n\n.mdc-dialog__actions {\n  display: -ms-flexbox;\n  display: flex;\n  position: relative;\n  -ms-flex-negative: 0;\n  flex-shrink: 0;\n  -ms-flex-wrap: wrap;\n  flex-wrap: wrap;\n  -ms-flex-align: center;\n  align-items: center;\n  -ms-flex-pack: end;\n  justify-content: flex-end;\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box;\n  min-height: 3.25rem;\n  margin: 0;\n  padding: 0.5rem;\n  border-top: 0.0625rem solid transparent; }\n  .mdc-dialog--stacked .mdc-dialog__actions {\n    -ms-flex-direction: column;\n    flex-direction: column;\n    -ms-flex-align: end;\n    align-items: flex-end; }\n\n.mdc-dialog__button {\n  /* \@noflip */\n  margin-left: 0.5rem;\n  /* \@noflip */\n  margin-right: 0;\n  max-width: 100%;\n  text-align: right; }\n  [dir=\"rtl\"] .mdc-dialog__button, .mdc-dialog__button[dir=\"rtl\"] {\n    /* \@noflip */\n    margin-left: 0;\n    /* \@noflip */\n    margin-right: 0.5rem; }\n  .mdc-dialog__button:first-child {\n    /* \@noflip */\n    margin-left: 0;\n    /* \@noflip */\n    margin-right: 0; }\n    [dir=\"rtl\"] .mdc-dialog__button:first-child, .mdc-dialog__button:first-child[dir=\"rtl\"] {\n      /* \@noflip */\n      margin-left: 0;\n      /* \@noflip */\n      margin-right: 0; }\n  .mdc-dialog[dir=\"rtl\"] .mdc-dialog__button,\n  [dir=\"rtl\"] .mdc-dialog .mdc-dialog__button {\n    text-align: left; }\n  .mdc-dialog--stacked .mdc-dialog__button:not(:first-child) {\n    margin-top: 0.75rem; }\n\n.mdc-dialog--open,\n.mdc-dialog--opening,\n.mdc-dialog--closing {\n  display: -ms-flexbox;\n  display: flex; }\n\n.mdc-dialog--opening .mdc-dialog__scrim {\n  -webkit-transition: opacity 150ms linear;\n  transition: opacity 150ms linear; }\n\n.mdc-dialog--opening .mdc-dialog__container {\n  -webkit-transition: opacity 75ms linear, -webkit-transform 150ms 0ms cubic-bezier(0, 0, 0.2, 1);\n  transition: opacity 75ms linear, -webkit-transform 150ms 0ms cubic-bezier(0, 0, 0.2, 1);\n  transition: opacity 75ms linear, transform 150ms 0ms cubic-bezier(0, 0, 0.2, 1);\n  transition: opacity 75ms linear, transform 150ms 0ms cubic-bezier(0, 0, 0.2, 1), -webkit-transform 150ms 0ms cubic-bezier(0, 0, 0.2, 1); }\n\n.mdc-dialog--closing .mdc-dialog__scrim,\n.mdc-dialog--closing .mdc-dialog__container {\n  -webkit-transition: opacity 75ms linear;\n  transition: opacity 75ms linear; }\n\n.mdc-dialog--closing .mdc-dialog__container {\n  -webkit-transform: scale(1);\n  transform: scale(1); }\n\n.mdc-dialog--open .mdc-dialog__scrim {\n  opacity: 1; }\n\n.mdc-dialog--open .mdc-dialog__container {\n  -webkit-transform: scale(1);\n  transform: scale(1);\n  opacity: 1; }\n\n.mdc-dialog-scroll-lock {\n  overflow: hidden; }\n\n/**\n * \@prop --dialog-width: Width of the dialog.\n * \@prop --dialog-height: Height of the dialog.\n * \@prop --dialog-heading-title-color: Color of the title.\n * \@prop --dialog-heading-subtitle-color: Color of the subtitle.\n * \@prop --dialog-heading-supporting-text-color: Color of the supporting text.\n * \@prop --dialog-heading-icon-color: Color of the icon.\n * \@prop --dialog-heading-icon-background-color: Background color of the icon when displayed as a badge.\n */\nslot[name=\"header\"] {\n  display: none; }\n\n.mdc-dialog .mdc-dialog__container {\n  width: var(--dialog-width, auto);\n  height: var(--dialog-height, auto); }\n  .mdc-dialog .mdc-dialog__container.full-screen {\n    width: 100%;\n    height: 100%; }\n\n.mdc-dialog .mdc-dialog__surface {\n  width: 100%; }\n  .mdc-dialog .mdc-dialog__surface .mdc-dialog__body--scrollable {\n    max-height: inherit;\n    border: 0;\n    overflow: auto; }\n\n.mdc-dialog .mdc-dialog__title {\n  font-size: 1rem;\n  line-height: 1.4;\n  margin: 0;\n  font-weight: 500;\n  font-style: normal;\n  color: var(--dialog-heading-title-color, rgba(0, 0, 0, 0.87)); }\n\n.mdc-dialog .dialog__heading {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-align: center;\n  align-items: center;\n  margin: 1.875rem 1.5rem 0.3125rem; }\n  .mdc-dialog .dialog__heading limel-icon {\n    margin-right: 0.9375rem;\n    color: var(--dialog-heading-icon-color, #575756); }\n    .mdc-dialog .dialog__heading limel-icon[badge] {\n      background-color: var(--dialog-heading-icon-background-color, #575756);\n      color: var(--dialog-heading-icon-color, #fff); }\n  .mdc-dialog .dialog__heading .dialog__title {\n    font-weight: 500;\n    margin: 0;\n    color: var(--dialog-heading-title-color, rgba(0, 0, 0, 0.87)); }\n  .mdc-dialog .dialog__heading .dialog__subtitle {\n    margin: 0;\n    color: var(--dialog-heading-subtitle-color, rgba(0, 0, 0, 0.54)); }\n  .mdc-dialog .dialog__heading .dialog__supporting-text {\n    margin: 0;\n    color: var(--dialog-heading-supporting-text-color, rgba(0, 0, 0, 0.54)); }"; }
}

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
 */
var cssClasses$3 = {
    DISABLED: 'mdc-select--disabled',
    FOCUSED: 'mdc-select--focused',
    INVALID: 'mdc-select--invalid',
    OUTLINED: 'mdc-select--outlined',
    REQUIRED: 'mdc-select--required',
    ROOT: 'mdc-select',
    SELECTED_ITEM_CLASS: 'mdc-list-item--selected',
    WITH_LEADING_ICON: 'mdc-select--with-leading-icon',
};
var strings$4 = {
    ARIA_CONTROLS: 'aria-controls',
    ARIA_SELECTED_ATTR: 'aria-selected',
    CHANGE_EVENT: 'MDCSelect:change',
    ENHANCED_VALUE_ATTR: 'data-value',
    HIDDEN_INPUT_SELECTOR: 'input[type="hidden"]',
    LABEL_SELECTOR: '.mdc-floating-label',
    LEADING_ICON_SELECTOR: '.mdc-select__icon',
    LINE_RIPPLE_SELECTOR: '.mdc-line-ripple',
    MENU_SELECTOR: '.mdc-select__menu',
    NATIVE_CONTROL_SELECTOR: '.mdc-select__native-control',
    OUTLINE_SELECTOR: '.mdc-notched-outline',
    SELECTED_ITEM_SELECTOR: "." + cssClasses$3.SELECTED_ITEM_CLASS,
    SELECTED_TEXT_SELECTOR: '.mdc-select__selected-text',
};
var numbers$2 = {
    LABEL_SCALE: 0.75,
};

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
 */
var MDCSelectFoundation = /** @class */ (function (_super) {
    __extends(MDCSelectFoundation, _super);
    /* istanbul ignore next: optional argument is not a branch statement */
    /**
     * @param adapter
     * @param foundationMap Map from subcomponent names to their subfoundations.
     */
    function MDCSelectFoundation(adapter, foundationMap) {
        if (foundationMap === void 0) { foundationMap = {}; }
        var _this = _super.call(this, __assign({}, MDCSelectFoundation.defaultAdapter, adapter)) || this;
        _this.leadingIcon_ = foundationMap.leadingIcon;
        _this.helperText_ = foundationMap.helperText;
        return _this;
    }
    Object.defineProperty(MDCSelectFoundation, "cssClasses", {
        get: function () {
            return cssClasses$3;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCSelectFoundation, "numbers", {
        get: function () {
            return numbers$2;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCSelectFoundation, "strings", {
        get: function () {
            return strings$4;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCSelectFoundation, "defaultAdapter", {
        /**
         * See {@link MDCSelectAdapter} for typing information on parameters and return types.
         */
        get: function () {
            // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
            return {
                addClass: function () { return undefined; },
                removeClass: function () { return undefined; },
                hasClass: function () { return false; },
                activateBottomLine: function () { return undefined; },
                deactivateBottomLine: function () { return undefined; },
                setValue: function () { return undefined; },
                getValue: function () { return ''; },
                floatLabel: function () { return undefined; },
                getLabelWidth: function () { return 0; },
                hasOutline: function () { return false; },
                notchOutline: function () { return undefined; },
                closeOutline: function () { return undefined; },
                openMenu: function () { return undefined; },
                closeMenu: function () { return undefined; },
                isMenuOpen: function () { return false; },
                setSelectedIndex: function () { return undefined; },
                setDisabled: function () { return undefined; },
                setRippleCenter: function () { return undefined; },
                notifyChange: function () { return undefined; },
                checkValidity: function () { return false; },
                setValid: function () { return undefined; },
            };
            // tslint:enable:object-literal-sort-keys
        },
        enumerable: true,
        configurable: true
    });
    MDCSelectFoundation.prototype.setSelectedIndex = function (index) {
        this.adapter_.setSelectedIndex(index);
        this.adapter_.closeMenu();
        var didChange = true;
        this.handleChange(didChange);
    };
    MDCSelectFoundation.prototype.setValue = function (value) {
        this.adapter_.setValue(value);
        var didChange = true;
        this.handleChange(didChange);
    };
    MDCSelectFoundation.prototype.getValue = function () {
        return this.adapter_.getValue();
    };
    MDCSelectFoundation.prototype.setDisabled = function (isDisabled) {
        if (isDisabled) {
            this.adapter_.addClass(cssClasses$3.DISABLED);
        }
        else {
            this.adapter_.removeClass(cssClasses$3.DISABLED);
        }
        this.adapter_.setDisabled(isDisabled);
        this.adapter_.closeMenu();
        if (this.leadingIcon_) {
            this.leadingIcon_.setDisabled(isDisabled);
        }
    };
    /**
     * @param content Sets the content of the helper text.
     */
    MDCSelectFoundation.prototype.setHelperTextContent = function (content) {
        if (this.helperText_) {
            this.helperText_.setContent(content);
        }
    };
    MDCSelectFoundation.prototype.layout = function () {
        var openNotch = this.getValue().length > 0;
        this.notchOutline(openNotch);
    };
    /**
     * Handles value changes, via change event or programmatic updates.
     */
    MDCSelectFoundation.prototype.handleChange = function (didChange) {
        if (didChange === void 0) { didChange = true; }
        var value = this.getValue();
        var optionHasValue = value.length > 0;
        var isRequired = this.adapter_.hasClass(cssClasses$3.REQUIRED);
        this.notchOutline(optionHasValue);
        if (!this.adapter_.hasClass(cssClasses$3.FOCUSED)) {
            this.adapter_.floatLabel(optionHasValue);
        }
        if (didChange) {
            this.adapter_.notifyChange(value);
            if (isRequired) {
                this.setValid(this.isValid());
                if (this.helperText_) {
                    this.helperText_.setValidity(this.isValid());
                }
            }
        }
    };
    /**
     * Handles focus events from select element.
     */
    MDCSelectFoundation.prototype.handleFocus = function () {
        this.adapter_.addClass(cssClasses$3.FOCUSED);
        this.adapter_.floatLabel(true);
        this.notchOutline(true);
        this.adapter_.activateBottomLine();
        if (this.helperText_) {
            this.helperText_.showToScreenReader();
        }
    };
    /**
     * Handles blur events from select element.
     */
    MDCSelectFoundation.prototype.handleBlur = function () {
        if (this.adapter_.isMenuOpen()) {
            return;
        }
        this.adapter_.removeClass(cssClasses$3.FOCUSED);
        this.handleChange(false);
        this.adapter_.deactivateBottomLine();
        var isRequired = this.adapter_.hasClass(cssClasses$3.REQUIRED);
        if (isRequired) {
            this.setValid(this.isValid());
            if (this.helperText_) {
                this.helperText_.setValidity(this.isValid());
            }
        }
    };
    MDCSelectFoundation.prototype.handleClick = function (normalizedX) {
        if (this.adapter_.isMenuOpen()) {
            return;
        }
        this.adapter_.setRippleCenter(normalizedX);
        this.adapter_.openMenu();
    };
    MDCSelectFoundation.prototype.handleKeydown = function (event) {
        if (this.adapter_.isMenuOpen()) {
            return;
        }
        var isEnter = event.key === 'Enter' || event.keyCode === 13;
        var isSpace = event.key === 'Space' || event.keyCode === 32;
        var arrowUp = event.key === 'ArrowUp' || event.keyCode === 38;
        var arrowDown = event.key === 'ArrowDown' || event.keyCode === 40;
        if (this.adapter_.hasClass(cssClasses$3.FOCUSED) && (isEnter || isSpace || arrowUp || arrowDown)) {
            this.adapter_.openMenu();
            event.preventDefault();
        }
    };
    /**
     * Opens/closes the notched outline.
     */
    MDCSelectFoundation.prototype.notchOutline = function (openNotch) {
        if (!this.adapter_.hasOutline()) {
            return;
        }
        var isFocused = this.adapter_.hasClass(cssClasses$3.FOCUSED);
        if (openNotch) {
            var labelScale = numbers$2.LABEL_SCALE;
            var labelWidth = this.adapter_.getLabelWidth() * labelScale;
            this.adapter_.notchOutline(labelWidth);
        }
        else if (!isFocused) {
            this.adapter_.closeOutline();
        }
    };
    /**
     * Sets the aria label of the leading icon.
     */
    MDCSelectFoundation.prototype.setLeadingIconAriaLabel = function (label) {
        if (this.leadingIcon_) {
            this.leadingIcon_.setAriaLabel(label);
        }
    };
    /**
     * Sets the text content of the leading icon.
     */
    MDCSelectFoundation.prototype.setLeadingIconContent = function (content) {
        if (this.leadingIcon_) {
            this.leadingIcon_.setContent(content);
        }
    };
    MDCSelectFoundation.prototype.setValid = function (isValid) {
        this.adapter_.setValid(isValid);
    };
    MDCSelectFoundation.prototype.isValid = function () {
        return this.adapter_.checkValidity();
    };
    return MDCSelectFoundation;
}(MDCFoundation));

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
var strings$5 = {
    ARIA_HIDDEN: 'aria-hidden',
    ROLE: 'role',
};
var cssClasses$4 = {
    HELPER_TEXT_PERSISTENT: 'mdc-select-helper-text--persistent',
    HELPER_TEXT_VALIDATION_MSG: 'mdc-select-helper-text--validation-msg',
};

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
var MDCSelectHelperTextFoundation = /** @class */ (function (_super) {
    __extends(MDCSelectHelperTextFoundation, _super);
    function MDCSelectHelperTextFoundation(adapter) {
        return _super.call(this, __assign({}, MDCSelectHelperTextFoundation.defaultAdapter, adapter)) || this;
    }
    Object.defineProperty(MDCSelectHelperTextFoundation, "cssClasses", {
        get: function () {
            return cssClasses$4;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCSelectHelperTextFoundation, "strings", {
        get: function () {
            return strings$5;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCSelectHelperTextFoundation, "defaultAdapter", {
        /**
         * See {@link MDCSelectHelperTextAdapter} for typing information on parameters and return types.
         */
        get: function () {
            // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
            return {
                addClass: function () { return undefined; },
                removeClass: function () { return undefined; },
                hasClass: function () { return false; },
                setAttr: function () { return undefined; },
                removeAttr: function () { return undefined; },
                setContent: function () { return undefined; },
            };
            // tslint:enable:object-literal-sort-keys
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Sets the content of the helper text field.
     */
    MDCSelectHelperTextFoundation.prototype.setContent = function (content) {
        this.adapter_.setContent(content);
    };
    /**
     *  Sets the persistency of the helper text.
     */
    MDCSelectHelperTextFoundation.prototype.setPersistent = function (isPersistent) {
        if (isPersistent) {
            this.adapter_.addClass(cssClasses$4.HELPER_TEXT_PERSISTENT);
        }
        else {
            this.adapter_.removeClass(cssClasses$4.HELPER_TEXT_PERSISTENT);
        }
    };
    /**
     * @param isValidation True to make the helper text act as an error validation message.
     */
    MDCSelectHelperTextFoundation.prototype.setValidation = function (isValidation) {
        if (isValidation) {
            this.adapter_.addClass(cssClasses$4.HELPER_TEXT_VALIDATION_MSG);
        }
        else {
            this.adapter_.removeClass(cssClasses$4.HELPER_TEXT_VALIDATION_MSG);
        }
    };
    /**
     * Makes the helper text visible to screen readers.
     */
    MDCSelectHelperTextFoundation.prototype.showToScreenReader = function () {
        this.adapter_.removeAttr(strings$5.ARIA_HIDDEN);
    };
    /**
     * Sets the validity of the helper text based on the select validity.
     */
    MDCSelectHelperTextFoundation.prototype.setValidity = function (selectIsValid) {
        var helperTextIsPersistent = this.adapter_.hasClass(cssClasses$4.HELPER_TEXT_PERSISTENT);
        var helperTextIsValidationMsg = this.adapter_.hasClass(cssClasses$4.HELPER_TEXT_VALIDATION_MSG);
        var validationMsgNeedsDisplay = helperTextIsValidationMsg && !selectIsValid;
        if (validationMsgNeedsDisplay) {
            this.adapter_.setAttr(strings$5.ROLE, 'alert');
        }
        else {
            this.adapter_.removeAttr(strings$5.ROLE);
        }
        if (!helperTextIsPersistent && !validationMsgNeedsDisplay) {
            this.hide_();
        }
    };
    /**
     * Hides the help text from screen readers.
     */
    MDCSelectHelperTextFoundation.prototype.hide_ = function () {
        this.adapter_.setAttr(strings$5.ARIA_HIDDEN, 'true');
    };
    return MDCSelectHelperTextFoundation;
}(MDCFoundation));

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
var MDCSelectHelperText = /** @class */ (function (_super) {
    __extends(MDCSelectHelperText, _super);
    function MDCSelectHelperText() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MDCSelectHelperText.attachTo = function (root) {
        return new MDCSelectHelperText(root);
    };
    Object.defineProperty(MDCSelectHelperText.prototype, "foundation", {
        get: function () {
            return this.foundation_;
        },
        enumerable: true,
        configurable: true
    });
    MDCSelectHelperText.prototype.getDefaultFoundation = function () {
        var _this = this;
        // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
        // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
        // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
        var adapter = {
            addClass: function (className) { return _this.root_.classList.add(className); },
            removeClass: function (className) { return _this.root_.classList.remove(className); },
            hasClass: function (className) { return _this.root_.classList.contains(className); },
            setAttr: function (attr, value) { return _this.root_.setAttribute(attr, value); },
            removeAttr: function (attr) { return _this.root_.removeAttribute(attr); },
            setContent: function (content) {
                _this.root_.textContent = content;
            },
        };
        // tslint:enable:object-literal-sort-keys
        return new MDCSelectHelperTextFoundation(adapter);
    };
    return MDCSelectHelperText;
}(MDCComponent));

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
var strings$6 = {
    ICON_EVENT: 'MDCSelect:icon',
    ICON_ROLE: 'button',
};

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
var INTERACTION_EVENTS = ['click', 'keydown'];
var MDCSelectIconFoundation = /** @class */ (function (_super) {
    __extends(MDCSelectIconFoundation, _super);
    function MDCSelectIconFoundation(adapter) {
        var _this = _super.call(this, __assign({}, MDCSelectIconFoundation.defaultAdapter, adapter)) || this;
        _this.savedTabIndex_ = null;
        _this.interactionHandler_ = function (evt) { return _this.handleInteraction(evt); };
        return _this;
    }
    Object.defineProperty(MDCSelectIconFoundation, "strings", {
        get: function () {
            return strings$6;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCSelectIconFoundation, "defaultAdapter", {
        /**
         * See {@link MDCSelectIconAdapter} for typing information on parameters and return types.
         */
        get: function () {
            // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
            return {
                getAttr: function () { return null; },
                setAttr: function () { return undefined; },
                removeAttr: function () { return undefined; },
                setContent: function () { return undefined; },
                registerInteractionHandler: function () { return undefined; },
                deregisterInteractionHandler: function () { return undefined; },
                notifyIconAction: function () { return undefined; },
            };
            // tslint:enable:object-literal-sort-keys
        },
        enumerable: true,
        configurable: true
    });
    MDCSelectIconFoundation.prototype.init = function () {
        var _this = this;
        this.savedTabIndex_ = this.adapter_.getAttr('tabindex');
        INTERACTION_EVENTS.forEach(function (evtType) {
            _this.adapter_.registerInteractionHandler(evtType, _this.interactionHandler_);
        });
    };
    MDCSelectIconFoundation.prototype.destroy = function () {
        var _this = this;
        INTERACTION_EVENTS.forEach(function (evtType) {
            _this.adapter_.deregisterInteractionHandler(evtType, _this.interactionHandler_);
        });
    };
    MDCSelectIconFoundation.prototype.setDisabled = function (disabled) {
        if (!this.savedTabIndex_) {
            return;
        }
        if (disabled) {
            this.adapter_.setAttr('tabindex', '-1');
            this.adapter_.removeAttr('role');
        }
        else {
            this.adapter_.setAttr('tabindex', this.savedTabIndex_);
            this.adapter_.setAttr('role', strings$6.ICON_ROLE);
        }
    };
    MDCSelectIconFoundation.prototype.setAriaLabel = function (label) {
        this.adapter_.setAttr('aria-label', label);
    };
    MDCSelectIconFoundation.prototype.setContent = function (content) {
        this.adapter_.setContent(content);
    };
    MDCSelectIconFoundation.prototype.handleInteraction = function (evt) {
        var isEnterKey = evt.key === 'Enter' || evt.keyCode === 13;
        if (evt.type === 'click' || isEnterKey) {
            this.adapter_.notifyIconAction();
        }
    };
    return MDCSelectIconFoundation;
}(MDCFoundation));

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
var MDCSelectIcon = /** @class */ (function (_super) {
    __extends(MDCSelectIcon, _super);
    function MDCSelectIcon() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MDCSelectIcon.attachTo = function (root) {
        return new MDCSelectIcon(root);
    };
    Object.defineProperty(MDCSelectIcon.prototype, "foundation", {
        get: function () {
            return this.foundation_;
        },
        enumerable: true,
        configurable: true
    });
    MDCSelectIcon.prototype.getDefaultFoundation = function () {
        var _this = this;
        // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
        // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
        // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
        var adapter = {
            getAttr: function (attr) { return _this.root_.getAttribute(attr); },
            setAttr: function (attr, value) { return _this.root_.setAttribute(attr, value); },
            removeAttr: function (attr) { return _this.root_.removeAttribute(attr); },
            setContent: function (content) {
                _this.root_.textContent = content;
            },
            registerInteractionHandler: function (evtType, handler) { return _this.listen(evtType, handler); },
            deregisterInteractionHandler: function (evtType, handler) { return _this.unlisten(evtType, handler); },
            notifyIconAction: function () { return _this.emit(MDCSelectIconFoundation.strings.ICON_EVENT, {} /* evtData */, true /* shouldBubble */); },
        };
        // tslint:enable:object-literal-sort-keys
        return new MDCSelectIconFoundation(adapter);
    };
    return MDCSelectIcon;
}(MDCComponent));

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
 */
var POINTER_EVENTS = ['mousedown', 'touchstart'];
var VALIDATION_ATTR_WHITELIST = ['required', 'aria-required'];
var MDCSelect = /** @class */ (function (_super) {
    __extends(MDCSelect, _super);
    function MDCSelect() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MDCSelect.attachTo = function (root) {
        return new MDCSelect(root);
    };
    MDCSelect.prototype.initialize = function (labelFactory, lineRippleFactory, outlineFactory, menuFactory, iconFactory, helperTextFactory) {
        if (labelFactory === void 0) { labelFactory = function (el) { return new MDCFloatingLabel(el); }; }
        if (lineRippleFactory === void 0) { lineRippleFactory = function (el) { return new MDCLineRipple(el); }; }
        if (outlineFactory === void 0) { outlineFactory = function (el) { return new MDCNotchedOutline(el); }; }
        if (menuFactory === void 0) { menuFactory = function (el) { return new MDCMenu(el); }; }
        if (iconFactory === void 0) { iconFactory = function (el) { return new MDCSelectIcon(el); }; }
        if (helperTextFactory === void 0) { helperTextFactory = function (el) { return new MDCSelectHelperText(el); }; }
        this.isMenuOpen_ = false;
        this.nativeControl_ = this.root_.querySelector(strings$4.NATIVE_CONTROL_SELECTOR);
        this.selectedText_ = this.root_.querySelector(strings$4.SELECTED_TEXT_SELECTOR);
        var targetElement = this.nativeControl_ || this.selectedText_;
        if (!targetElement) {
            throw new Error('MDCSelect: Missing required element: Exactly one of the following selectors must be present: ' +
                ("'" + strings$4.NATIVE_CONTROL_SELECTOR + "' or '" + strings$4.SELECTED_TEXT_SELECTOR + "'"));
        }
        this.targetElement_ = targetElement;
        if (this.targetElement_.hasAttribute(strings$4.ARIA_CONTROLS)) {
            var helperTextElement = document.getElementById(this.targetElement_.getAttribute(strings$4.ARIA_CONTROLS));
            if (helperTextElement) {
                this.helperText_ = helperTextFactory(helperTextElement);
            }
        }
        if (this.selectedText_) {
            this.enhancedSelectSetup_(menuFactory);
        }
        var labelElement = this.root_.querySelector(strings$4.LABEL_SELECTOR);
        this.label_ = labelElement ? labelFactory(labelElement) : null;
        var lineRippleElement = this.root_.querySelector(strings$4.LINE_RIPPLE_SELECTOR);
        this.lineRipple_ = lineRippleElement ? lineRippleFactory(lineRippleElement) : null;
        var outlineElement = this.root_.querySelector(strings$4.OUTLINE_SELECTOR);
        this.outline_ = outlineElement ? outlineFactory(outlineElement) : null;
        var leadingIcon = this.root_.querySelector(strings$4.LEADING_ICON_SELECTOR);
        if (leadingIcon) {
            this.root_.classList.add(cssClasses$3.WITH_LEADING_ICON);
            this.leadingIcon_ = iconFactory(leadingIcon);
            if (this.menuElement_) {
                this.menuElement_.classList.add(cssClasses$3.WITH_LEADING_ICON);
            }
        }
        if (!this.root_.classList.contains(cssClasses$3.OUTLINED)) {
            this.ripple = this.createRipple_();
        }
        // The required state needs to be sync'd before the mutation observer is added.
        this.initialSyncRequiredState_();
        this.addMutationObserverForRequired_();
    };
    /**
     * Initializes the select's event listeners and internal state based
     * on the environment's state.
     */
    MDCSelect.prototype.initialSyncWithDOM = function () {
        var _this = this;
        this.handleChange_ = function () { return _this.foundation_.handleChange(/* didChange */ true); };
        this.handleFocus_ = function () { return _this.foundation_.handleFocus(); };
        this.handleBlur_ = function () { return _this.foundation_.handleBlur(); };
        this.handleClick_ = function (evt) {
            if (_this.selectedText_) {
                _this.selectedText_.focus();
            }
            _this.foundation_.handleClick(_this.getNormalizedXCoordinate_(evt));
        };
        this.handleKeydown_ = function (evt) { return _this.foundation_.handleKeydown(evt); };
        this.handleMenuSelected_ = function (evtData) { return _this.selectedIndex = evtData.detail.index; };
        this.handleMenuOpened_ = function () {
            // Menu should open to the last selected element.
            if (_this.selectedIndex >= 0) {
                var selectedItemEl = _this.menu_.items[_this.selectedIndex];
                selectedItemEl.focus();
            }
        };
        this.handleMenuClosed_ = function () {
            // isMenuOpen_ is used to track the state of the menu opening or closing since the menu.open function
            // will return false if the menu is still closing and this method listens to the closed event which
            // occurs after the menu is already closed.
            _this.isMenuOpen_ = false;
            _this.selectedText_.removeAttribute('aria-expanded');
            if (document.activeElement !== _this.selectedText_) {
                _this.foundation_.handleBlur();
            }
        };
        this.targetElement_.addEventListener('change', this.handleChange_);
        this.targetElement_.addEventListener('focus', this.handleFocus_);
        this.targetElement_.addEventListener('blur', this.handleBlur_);
        POINTER_EVENTS.forEach(function (evtType) {
            _this.targetElement_.addEventListener(evtType, _this.handleClick_);
        });
        if (this.menuElement_) {
            this.selectedText_.addEventListener('keydown', this.handleKeydown_);
            this.menu_.listen(strings$7.CLOSED_EVENT, this.handleMenuClosed_);
            this.menu_.listen(strings$7.OPENED_EVENT, this.handleMenuOpened_);
            this.menu_.listen(strings$8.SELECTED_EVENT, this.handleMenuSelected_);
            if (this.hiddenInput_ && this.hiddenInput_.value) {
                // If the hidden input already has a value, use it to restore the select's value.
                // This can happen e.g. if the user goes back or (in some browsers) refreshes the page.
                var enhancedAdapterMethods = this.getEnhancedSelectAdapterMethods_();
                enhancedAdapterMethods.setValue(this.hiddenInput_.value);
            }
            else if (this.menuElement_.querySelector(strings$4.SELECTED_ITEM_SELECTOR)) {
                // If an element is selected, the select should set the initial selected text.
                var enhancedAdapterMethods = this.getEnhancedSelectAdapterMethods_();
                enhancedAdapterMethods.setValue(enhancedAdapterMethods.getValue());
            }
        }
        // Initially sync floating label
        this.foundation_.handleChange(/* didChange */ false);
        if (this.root_.classList.contains(cssClasses$3.DISABLED)
            || (this.nativeControl_ && this.nativeControl_.disabled)) {
            this.disabled = true;
        }
    };
    MDCSelect.prototype.destroy = function () {
        var _this = this;
        this.targetElement_.removeEventListener('change', this.handleChange_);
        this.targetElement_.removeEventListener('focus', this.handleFocus_);
        this.targetElement_.removeEventListener('blur', this.handleBlur_);
        this.targetElement_.removeEventListener('keydown', this.handleKeydown_);
        POINTER_EVENTS.forEach(function (evtType) {
            _this.targetElement_.removeEventListener(evtType, _this.handleClick_);
        });
        if (this.menu_) {
            this.menu_.unlisten(strings$7.CLOSED_EVENT, this.handleMenuClosed_);
            this.menu_.unlisten(strings$7.OPENED_EVENT, this.handleMenuOpened_);
            this.menu_.unlisten(strings$8.SELECTED_EVENT, this.handleMenuSelected_);
            this.menu_.destroy();
        }
        if (this.ripple) {
            this.ripple.destroy();
        }
        if (this.outline_) {
            this.outline_.destroy();
        }
        if (this.leadingIcon_) {
            this.leadingIcon_.destroy();
        }
        if (this.helperText_) {
            this.helperText_.destroy();
        }
        if (this.validationObserver_) {
            this.validationObserver_.disconnect();
        }
        _super.prototype.destroy.call(this);
    };
    Object.defineProperty(MDCSelect.prototype, "value", {
        get: function () {
            return this.foundation_.getValue();
        },
        set: function (value) {
            this.foundation_.setValue(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCSelect.prototype, "selectedIndex", {
        get: function () {
            var selectedIndex = -1;
            if (this.menuElement_ && this.menu_) {
                var selectedEl = this.menuElement_.querySelector(strings$4.SELECTED_ITEM_SELECTOR);
                selectedIndex = this.menu_.items.indexOf(selectedEl);
            }
            else if (this.nativeControl_) {
                selectedIndex = this.nativeControl_.selectedIndex;
            }
            return selectedIndex;
        },
        set: function (selectedIndex) {
            this.foundation_.setSelectedIndex(selectedIndex);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCSelect.prototype, "disabled", {
        get: function () {
            return this.root_.classList.contains(cssClasses$3.DISABLED) ||
                (this.nativeControl_ ? this.nativeControl_.disabled : false);
        },
        set: function (disabled) {
            this.foundation_.setDisabled(disabled);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCSelect.prototype, "leadingIconAriaLabel", {
        set: function (label) {
            this.foundation_.setLeadingIconAriaLabel(label);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCSelect.prototype, "leadingIconContent", {
        /**
         * Sets the text content of the leading icon.
         */
        set: function (content) {
            this.foundation_.setLeadingIconContent(content);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCSelect.prototype, "helperTextContent", {
        /**
         * Sets the text content of the helper text.
         */
        set: function (content) {
            this.foundation_.setHelperTextContent(content);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCSelect.prototype, "valid", {
        /**
         * Checks if the select is in a valid state.
         */
        get: function () {
            return this.foundation_.isValid();
        },
        /**
         * Sets the current invalid state of the select.
         */
        set: function (isValid) {
            this.foundation_.setValid(isValid);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCSelect.prototype, "required", {
        /**
         * Returns whether the select is required.
         */
        get: function () {
            if (this.nativeControl_) {
                return this.nativeControl_.required;
            }
            else {
                return this.selectedText_.getAttribute('aria-required') === 'true';
            }
        },
        /**
         * Sets the control to the required state.
         */
        set: function (isRequired) {
            if (this.nativeControl_) {
                this.nativeControl_.required = isRequired;
            }
            else {
                if (isRequired) {
                    this.selectedText_.setAttribute('aria-required', isRequired.toString());
                }
                else {
                    this.selectedText_.removeAttribute('aria-required');
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Recomputes the outline SVG path for the outline element.
     */
    MDCSelect.prototype.layout = function () {
        this.foundation_.layout();
    };
    MDCSelect.prototype.getDefaultFoundation = function () {
        // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
        // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
        var adapter = __assign({}, (this.nativeControl_ ? this.getNativeSelectAdapterMethods_() : this.getEnhancedSelectAdapterMethods_()), this.getCommonAdapterMethods_(), this.getOutlineAdapterMethods_(), this.getLabelAdapterMethods_());
        return new MDCSelectFoundation(adapter, this.getFoundationMap_());
    };
    /**
     * Handles setup for the enhanced menu.
     */
    MDCSelect.prototype.enhancedSelectSetup_ = function (menuFactory) {
        var isDisabled = this.root_.classList.contains(cssClasses$3.DISABLED);
        this.selectedText_.setAttribute('tabindex', isDisabled ? '-1' : '0');
        this.hiddenInput_ = this.root_.querySelector(strings$4.HIDDEN_INPUT_SELECTOR);
        this.menuElement_ = this.root_.querySelector(strings$4.MENU_SELECTOR);
        this.menu_ = menuFactory(this.menuElement_);
        this.menu_.hoistMenuToBody();
        this.menu_.setAnchorElement(this.root_);
        this.menu_.setAnchorCorner(Corner.BOTTOM_START);
        this.menu_.wrapFocus = false;
    };
    MDCSelect.prototype.createRipple_ = function () {
        var _this = this;
        // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
        // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
        // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
        var adapter = __assign({}, MDCRipple.createAdapter(this), { registerInteractionHandler: function (evtType, handler) { return _this.targetElement_.addEventListener(evtType, handler); }, deregisterInteractionHandler: function (evtType, handler) { return _this.targetElement_.removeEventListener(evtType, handler); } });
        // tslint:enable:object-literal-sort-keys
        return new MDCRipple(this.root_, new MDCRippleFoundation(adapter));
    };
    MDCSelect.prototype.getNativeSelectAdapterMethods_ = function () {
        var _this = this;
        // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
        return {
            getValue: function () { return _this.nativeControl_.value; },
            setValue: function (value) {
                _this.nativeControl_.value = value;
            },
            openMenu: function () { return undefined; },
            closeMenu: function () { return undefined; },
            isMenuOpen: function () { return false; },
            setSelectedIndex: function (index) {
                _this.nativeControl_.selectedIndex = index;
            },
            setDisabled: function (isDisabled) {
                _this.nativeControl_.disabled = isDisabled;
            },
            setValid: function (isValid) {
                if (isValid) {
                    _this.root_.classList.remove(cssClasses$3.INVALID);
                }
                else {
                    _this.root_.classList.add(cssClasses$3.INVALID);
                }
            },
            checkValidity: function () { return _this.nativeControl_.checkValidity(); },
        };
        // tslint:enable:object-literal-sort-keys
    };
    MDCSelect.prototype.getEnhancedSelectAdapterMethods_ = function () {
        var _this = this;
        // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
        return {
            getValue: function () {
                var listItem = _this.menuElement_.querySelector(strings$4.SELECTED_ITEM_SELECTOR);
                if (listItem && listItem.hasAttribute(strings$4.ENHANCED_VALUE_ATTR)) {
                    return listItem.getAttribute(strings$4.ENHANCED_VALUE_ATTR) || '';
                }
                return '';
            },
            setValue: function (value) {
                var element = _this.menuElement_.querySelector("[" + strings$4.ENHANCED_VALUE_ATTR + "=\"" + value + "\"]");
                _this.setEnhancedSelectedIndex_(element ? _this.menu_.items.indexOf(element) : -1);
            },
            openMenu: function () {
                if (_this.menu_ && !_this.menu_.open) {
                    _this.menu_.open = true;
                    _this.isMenuOpen_ = true;
                    _this.selectedText_.setAttribute('aria-expanded', 'true');
                }
            },
            closeMenu: function () {
                if (_this.menu_ && _this.menu_.open) {
                    _this.menu_.open = false;
                }
            },
            isMenuOpen: function () { return Boolean(_this.menu_) && _this.isMenuOpen_; },
            setSelectedIndex: function (index) { return _this.setEnhancedSelectedIndex_(index); },
            setDisabled: function (isDisabled) {
                _this.selectedText_.setAttribute('tabindex', isDisabled ? '-1' : '0');
                _this.selectedText_.setAttribute('aria-disabled', isDisabled.toString());
                if (_this.hiddenInput_) {
                    _this.hiddenInput_.disabled = isDisabled;
                }
            },
            checkValidity: function () {
                var classList = _this.root_.classList;
                if (classList.contains(cssClasses$3.REQUIRED) && !classList.contains(cssClasses$3.DISABLED)) {
                    // See notes for required attribute under https://www.w3.org/TR/html52/sec-forms.html#the-select-element
                    // TL;DR: Invalid if no index is selected, or if the first index is selected and has an empty value.
                    return _this.selectedIndex !== -1 && (_this.selectedIndex !== 0 || Boolean(_this.value));
                }
                else {
                    return true;
                }
            },
            setValid: function (isValid) {
                _this.selectedText_.setAttribute('aria-invalid', (!isValid).toString());
                if (isValid) {
                    _this.root_.classList.remove(cssClasses$3.INVALID);
                }
                else {
                    _this.root_.classList.add(cssClasses$3.INVALID);
                }
            },
        };
        // tslint:enable:object-literal-sort-keys
    };
    MDCSelect.prototype.getCommonAdapterMethods_ = function () {
        var _this = this;
        // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
        return {
            addClass: function (className) { return _this.root_.classList.add(className); },
            removeClass: function (className) { return _this.root_.classList.remove(className); },
            hasClass: function (className) { return _this.root_.classList.contains(className); },
            setRippleCenter: function (normalizedX) { return _this.lineRipple_ && _this.lineRipple_.setRippleCenter(normalizedX); },
            activateBottomLine: function () { return _this.lineRipple_ && _this.lineRipple_.activate(); },
            deactivateBottomLine: function () { return _this.lineRipple_ && _this.lineRipple_.deactivate(); },
            notifyChange: function (value) {
                var index = _this.selectedIndex;
                _this.emit(strings$4.CHANGE_EVENT, { value: value, index: index }, true /* shouldBubble  */);
            },
        };
        // tslint:enable:object-literal-sort-keys
    };
    MDCSelect.prototype.getOutlineAdapterMethods_ = function () {
        var _this = this;
        // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
        return {
            hasOutline: function () { return Boolean(_this.outline_); },
            notchOutline: function (labelWidth) { return _this.outline_ && _this.outline_.notch(labelWidth); },
            closeOutline: function () { return _this.outline_ && _this.outline_.closeNotch(); },
        };
        // tslint:enable:object-literal-sort-keys
    };
    MDCSelect.prototype.getLabelAdapterMethods_ = function () {
        var _this = this;
        return {
            floatLabel: function (shouldFloat) { return _this.label_ && _this.label_.float(shouldFloat); },
            getLabelWidth: function () { return _this.label_ ? _this.label_.getWidth() : 0; },
        };
    };
    /**
     * Calculates where the line ripple should start based on the x coordinate within the component.
     */
    MDCSelect.prototype.getNormalizedXCoordinate_ = function (evt) {
        var targetClientRect = evt.target.getBoundingClientRect();
        var xCoordinate = this.isTouchEvent_(evt) ? evt.touches[0].clientX : evt.clientX;
        return xCoordinate - targetClientRect.left;
    };
    MDCSelect.prototype.isTouchEvent_ = function (evt) {
        return Boolean(evt.touches);
    };
    /**
     * Returns a map of all subcomponents to subfoundations.
     */
    MDCSelect.prototype.getFoundationMap_ = function () {
        return {
            helperText: this.helperText_ ? this.helperText_.foundation : undefined,
            leadingIcon: this.leadingIcon_ ? this.leadingIcon_.foundation : undefined,
        };
    };
    MDCSelect.prototype.setEnhancedSelectedIndex_ = function (index) {
        var selectedItem = this.menu_.items[index];
        this.selectedText_.textContent = selectedItem ? selectedItem.textContent.trim() : '';
        var previouslySelected = this.menuElement_.querySelector(strings$4.SELECTED_ITEM_SELECTOR);
        if (previouslySelected) {
            previouslySelected.classList.remove(cssClasses$3.SELECTED_ITEM_CLASS);
            previouslySelected.removeAttribute(strings$4.ARIA_SELECTED_ATTR);
        }
        if (selectedItem) {
            selectedItem.classList.add(cssClasses$3.SELECTED_ITEM_CLASS);
            selectedItem.setAttribute(strings$4.ARIA_SELECTED_ATTR, 'true');
        }
        // Synchronize hidden input's value with data-value attribute of selected item.
        // This code path is also followed when setting value directly, so this covers all cases.
        if (this.hiddenInput_) {
            this.hiddenInput_.value = selectedItem ? selectedItem.getAttribute(strings$4.ENHANCED_VALUE_ATTR) || '' : '';
        }
        this.layout();
    };
    MDCSelect.prototype.initialSyncRequiredState_ = function () {
        var isRequired = this.targetElement_.required
            || this.targetElement_.getAttribute('aria-required') === 'true'
            || this.root_.classList.contains(cssClasses$3.REQUIRED);
        if (isRequired) {
            if (this.nativeControl_) {
                this.nativeControl_.required = true;
            }
            else {
                this.selectedText_.setAttribute('aria-required', 'true');
            }
            this.root_.classList.add(cssClasses$3.REQUIRED);
        }
    };
    MDCSelect.prototype.addMutationObserverForRequired_ = function () {
        var _this = this;
        var observerHandler = function (attributesList) {
            attributesList.some(function (attributeName) {
                if (VALIDATION_ATTR_WHITELIST.indexOf(attributeName) === -1) {
                    return false;
                }
                if (_this.selectedText_) {
                    if (_this.selectedText_.getAttribute('aria-required') === 'true') {
                        _this.root_.classList.add(cssClasses$3.REQUIRED);
                    }
                    else {
                        _this.root_.classList.remove(cssClasses$3.REQUIRED);
                    }
                }
                else {
                    if (_this.nativeControl_.required) {
                        _this.root_.classList.add(cssClasses$3.REQUIRED);
                    }
                    else {
                        _this.root_.classList.remove(cssClasses$3.REQUIRED);
                    }
                }
                return true;
            });
        };
        var getAttributesList = function (mutationsList) {
            return mutationsList
                .map(function (mutation) { return mutation.attributeName; })
                .filter(function (attributeName) { return attributeName; });
        };
        var observer = new MutationObserver(function (mutationsList) { return observerHandler(getAttributesList(mutationsList)); });
        observer.observe(this.targetElement_, { attributes: true });
        this.validationObserver_ = observer;
    };
    return MDCSelect;
}(MDCComponent));

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

/**
 * Type guard for checking if a value is multiple items or not
 *
 * @param {T | T[]} value the value to check
 *
 * @returns {boolean} true if value is multiple items, false otherwise
 */
function isMultiple(value) {
    return isArray(value);
}

const NativeSelectTemplate = props => {
    let hasValue = !!props.value;
    if (isMultiple(props.value)) {
        hasValue = props.value.length > 0;
    }
    else if (hasValue) {
        hasValue = !!props.value.value;
    }
    return (h("div", { class: `
                mdc-select
                ${props.disabled ? 'mdc-select--disabled' : ''}
            ` },
        h("i", { class: "mdc-select__dropdown-icon" }),
        h("div", { class: "limel-select__selected-text" }, getSelectedText(props.value)),
        h("select", { required: props.required, "aria-required": props.required, onChange: props.onChange, class: "mdc-select__native-control", disabled: props.disabled, multiple: props.multiple }, props.options.map(option => {
            return (h("option", { key: option.value, value: option.value, selected: isSelected(option, props.value), disabled: option.disabled }, option.text));
        })),
        h("label", { class: `
                    mdc-floating-label
                    ${hasValue ? 'mdc-floating-label--float-above' : ''}
                ` }, props.label),
        h("div", { class: "mdc-line-ripple" })));
};
const MenuSelectTemplate = props => {
    const items = createMenuItems(props.options, props.value);
    let hasValue = !!props.value;
    if (isMultiple(props.value)) {
        hasValue = props.value.length > 0;
    }
    else if (hasValue) {
        hasValue = !!props.value.value;
    }
    let isValid = true;
    if (props.checkValid && props.required && !hasValue) {
        isValid = false;
    }
    return (h("div", { class: `
            limel-select
            mdc-menu-surface--anchor
            ${props.disabled ? 'mdc-select--disabled' : ''}
            ${props.required ? 'limel-select--required' : ''}
            ${!isValid ? 'limel-select--invalid' : ''}
        ` },
        h("div", { tabindex: "0", onClick: props.open, class: `
                    limel-select-trigger
                    ${props.isOpen ? 'mdc-select--focused' : ''}
                `, slot: "trigger" },
            h("i", { class: "mdc-select__dropdown-icon" }),
            h("div", { class: "limel-select__selected-text" }, getSelectedText(props.value)),
            h("span", { class: `
                    mdc-floating-label
                    ${hasValue || props.isOpen
                    ? 'mdc-floating-label--float-above'
                    : ''}
                    ${props.isOpen ? 'mdc-floating-label--active' : ''}
                ` }, props.label),
            h("div", { class: `
                    mdc-line-ripple
                    ${props.isOpen ? 'mdc-line-ripple--active' : ''}
                ` })),
        props.isOpen ? (h("div", { class: "mdc-menu-surface--scrim", onClick: props.close })) : null,
        h("div", { class: `
                mdc-menu-surface
                ${props.isOpen ? 'mdc-menu-surface--open' : ''}
            `, tabindex: "-1" },
            h("limel-list", { items: items, selectable: true, multiple: props.multiple, onKeyDown: handleListKeys, onKeyUp: handleListKeys, onChange: props.onChange }))));
};
function handleListKeys(event) {
    const isEnter = event.key === ENTER || event.keyCode === ENTER_KEY_CODE;
    const isSpace = event.key === SPACE || event.keyCode === SPACE_KEY_CODE;
    if (isSpace || isEnter) {
        event.stopPropagation();
        event.preventDefault();
    }
}
function isSelected(option, value) {
    if (!value) {
        return false;
    }
    if (isMultiple(value)) {
        return value.some(o => option.value === o.value);
    }
    return option.value === value.value;
}
function createMenuItems(options, value) {
    return options.map(option => {
        const selected = isSelected(option, value);
        const { text, disabled } = option;
        return {
            text: text,
            selected: selected,
            disabled: disabled,
            value: option,
        };
    });
}
function getSelectedText(value) {
    if (!value) {
        return '';
    }
    if (isMultiple(value)) {
        return value.map(option => option.text).join(', ');
    }
    return value.text;
}

class Select {
    constructor() {
        /**
         * Disables the input field when `true`. Defaults to `false`.
         */
        this.disabled = false;
        /**
         * True if the control requires a value
         */
        this.required = false;
        /**
         * List of options
         */
        this.options = [];
        /**
         * Set to `true` to allow multiple values to be selected. Defaults to `false`
         */
        this.multiple = false;
        this.menuOpen = false;
        this.checkValid = false;
        this.handleMenuChange = this.handleMenuChange.bind(this);
        this.handleNativeChange = this.handleNativeChange.bind(this);
        this.handleMenuKeyDown = this.handleMenuKeyDown.bind(this);
        this.handleMenuKeyUp = this.handleMenuKeyUp.bind(this);
        this.openMenu = this.openMenu.bind(this);
        this.closeMenu = this.closeMenu.bind(this);
    }
    componentWillLoad() {
        this.isMobileDevice = isMobileDevice();
        // It should not be possible to render the native select for consumers, but we still want to make it testable.
        // We can set this attribute in tests to force rendering of the native select
        if (this.host.hasAttribute('native')) {
            this.isMobileDevice = true;
        }
    }
    componentDidLoad() {
        let element;
        if (!this.isMobileDevice) {
            element = this.host.shadowRoot.querySelector('.mdc-floating-label');
            this.mdcFloatingLabel = new MDCFloatingLabel(element);
            element = this.host.shadowRoot.querySelector('.mdc-line-ripple');
            this.mdcLineRipple = new MDCLineRipple(element);
            this.host.addEventListener('keydown', this.handleMenuKeyDown);
            this.host.addEventListener('keyup', this.handleMenuKeyUp);
            return;
        }
        element = this.host.shadowRoot.querySelector('.mdc-select');
        this.mdcSelect = new MDCSelect(element);
        if (!this.value) {
            element
                .querySelector('.mdc-floating-label')
                .classList.remove('mdc-floating-label--float-above');
        }
    }
    componentDidUnload() {
        if (this.mdcSelect) {
            this.mdcSelect.destroy();
        }
        if (this.mdcFloatingLabel) {
            this.mdcFloatingLabel.destroy();
        }
        if (this.mdcLineRipple) {
            this.mdcLineRipple.destroy();
        }
        if (this.mdcMenuSurface) {
            this.mdcMenuSurface.destroy();
        }
        this.host.removeEventListener('keydown', this.handleMenuKeyDown);
        this.host.removeEventListener('keyup', this.handleMenuKeyUp);
    }
    render() {
        if (!this.isMobileDevice) {
            return (h(MenuSelectTemplate, { disabled: this.disabled, required: this.required, label: this.label, value: this.value, options: this.options, onChange: this.handleMenuChange, multiple: this.multiple, isOpen: this.menuOpen, open: this.openMenu, close: this.closeMenu, checkValid: this.checkValid }));
        }
        return (h(NativeSelectTemplate, { disabled: this.disabled, required: this.required, label: this.label, value: this.value, options: this.options, onChange: this.handleNativeChange, multiple: this.multiple }));
    }
    watchOpen(newValue, oldValue) {
        if (this.checkValid) {
            return;
        }
        // Menu was closed for the first time
        if (!newValue && oldValue) {
            this.checkValid = true;
        }
    }
    handleMenuChange(event) {
        event.stopPropagation();
        if (isMultiple(event.detail)) {
            const listItems = event.detail;
            const options = listItems.map(item => item.value);
            this.change.emit(options);
            return;
        }
        const listItem = event.detail;
        const option = listItem.value;
        this.change.emit(option);
        this.menuOpen = false;
    }
    openMenu() {
        this.menuOpen = true;
    }
    closeMenu() {
        this.menuOpen = false;
    }
    handleMenuKeyDown(event) {
        const isEnter = event.key === ENTER || event.keyCode === ENTER_KEY_CODE;
        const isSpace = event.key === SPACE || event.keyCode === SPACE_KEY_CODE;
        if (isSpace || isEnter) {
            event.stopPropagation();
            event.preventDefault();
        }
    }
    handleMenuKeyUp(event) {
        const isEnter = event.key === ENTER || event.keyCode === ENTER_KEY_CODE;
        const isSpace = event.key === SPACE || event.keyCode === SPACE_KEY_CODE;
        const isEscape = event.key === ESCAPE || event.keyCode === ESCAPE_KEY_CODE;
        if (isSpace || isEnter) {
            event.stopPropagation();
            this.menuOpen = !this.menuOpen;
        }
        if (isEscape) {
            event.stopPropagation();
            this.menuOpen = false;
        }
    }
    handleNativeChange(event) {
        event.stopPropagation();
        const element = this.host.shadowRoot.querySelector('.mdc-select select');
        const options = Array.apply(null, element.options)
            .filter((optionElement) => {
            return !!optionElement.selected;
        })
            .map((optionElement) => {
            return this.options.find(o => o.value === optionElement.value);
        });
        if (this.multiple) {
            this.change.emit(options);
            return;
        }
        this.change.emit(options[0]);
    }
    static get is() { return "limel-select"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "disabled": {
            "type": Boolean,
            "attr": "disabled",
            "reflectToAttr": true
        },
        "host": {
            "elementRef": true
        },
        "label": {
            "type": String,
            "attr": "label",
            "reflectToAttr": true
        },
        "menuOpen": {
            "state": true,
            "watchCallbacks": ["watchOpen"]
        },
        "multiple": {
            "type": Boolean,
            "attr": "multiple"
        },
        "options": {
            "type": "Any",
            "attr": "options"
        },
        "required": {
            "type": Boolean,
            "attr": "required",
            "reflectToAttr": true
        },
        "value": {
            "type": "Any",
            "attr": "value"
        }
    }; }
    static get events() { return [{
            "name": "change",
            "method": "change",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get style() { return ":host {\n  --mdc-theme-primary: var(--lime-primary-color, #26a69a);\n  --mdc-theme-secondary: var(--lime-secondary-color, #575756);\n  --mdc-theme-on-primary: var(--lime-on-primary-color, #fff);\n  --mdc-theme-on-secondary: var(--lime-on-secondary-color, #fff); }\n\n:root {\n  --mdc-theme-primary: #26a69a;\n  --mdc-theme-secondary: #575756;\n  --mdc-theme-background: #fff;\n  --mdc-theme-surface: #fff;\n  --mdc-theme-error: #b00020;\n  --mdc-theme-on-primary: #fff;\n  --mdc-theme-on-secondary: #fff;\n  --mdc-theme-on-surface: #000;\n  --mdc-theme-on-error: #fff;\n  --mdc-theme-text-primary-on-background: rgba(0, 0, 0, 0.87);\n  --mdc-theme-text-secondary-on-background: rgba(0, 0, 0, 0.54);\n  --mdc-theme-text-hint-on-background: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-disabled-on-background: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-icon-on-background: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-primary-on-light: rgba(0, 0, 0, 0.87);\n  --mdc-theme-text-secondary-on-light: rgba(0, 0, 0, 0.54);\n  --mdc-theme-text-hint-on-light: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-disabled-on-light: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-icon-on-light: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-primary-on-dark: white;\n  --mdc-theme-text-secondary-on-dark: rgba(255, 255, 255, 0.7);\n  --mdc-theme-text-hint-on-dark: rgba(255, 255, 255, 0.5);\n  --mdc-theme-text-disabled-on-dark: rgba(255, 255, 255, 0.5);\n  --mdc-theme-text-icon-on-dark: rgba(255, 255, 255, 0.5); }\n\n.mdc-theme--primary {\n  color: #26a69a !important;\n  /* \@alternate */\n  color: var(--mdc-theme-primary, #26a69a) !important; }\n\n.mdc-theme--secondary {\n  color: #575756 !important;\n  /* \@alternate */\n  color: var(--mdc-theme-secondary, #575756) !important; }\n\n.mdc-theme--background {\n  background-color: #fff;\n  /* \@alternate */\n  background-color: var(--mdc-theme-background, #fff); }\n\n.mdc-theme--surface {\n  background-color: #fff;\n  /* \@alternate */\n  background-color: var(--mdc-theme-surface, #fff); }\n\n.mdc-theme--error {\n  color: #b00020 !important;\n  /* \@alternate */\n  color: var(--mdc-theme-error, #b00020) !important; }\n\n.mdc-theme--on-primary {\n  color: #fff !important;\n  /* \@alternate */\n  color: var(--mdc-theme-on-primary, #fff) !important; }\n\n.mdc-theme--on-secondary {\n  color: #fff !important;\n  /* \@alternate */\n  color: var(--mdc-theme-on-secondary, #fff) !important; }\n\n.mdc-theme--on-surface {\n  color: #000 !important;\n  /* \@alternate */\n  color: var(--mdc-theme-on-surface, #000) !important; }\n\n.mdc-theme--on-error {\n  color: #fff !important;\n  /* \@alternate */\n  color: var(--mdc-theme-on-error, #fff) !important; }\n\n.mdc-theme--text-primary-on-background {\n  color: rgba(0, 0, 0, 0.87) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-primary-on-background, rgba(0, 0, 0, 0.87)) !important; }\n\n.mdc-theme--text-secondary-on-background {\n  color: rgba(0, 0, 0, 0.54) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-secondary-on-background, rgba(0, 0, 0, 0.54)) !important; }\n\n.mdc-theme--text-hint-on-background {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.38)) !important; }\n\n.mdc-theme--text-disabled-on-background {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-disabled-on-background, rgba(0, 0, 0, 0.38)) !important; }\n\n.mdc-theme--text-icon-on-background {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-icon-on-background, rgba(0, 0, 0, 0.38)) !important; }\n\n.mdc-theme--text-primary-on-light {\n  color: rgba(0, 0, 0, 0.87) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-primary-on-light, rgba(0, 0, 0, 0.87)) !important; }\n\n.mdc-theme--text-secondary-on-light {\n  color: rgba(0, 0, 0, 0.54) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-secondary-on-light, rgba(0, 0, 0, 0.54)) !important; }\n\n.mdc-theme--text-hint-on-light {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-hint-on-light, rgba(0, 0, 0, 0.38)) !important; }\n\n.mdc-theme--text-disabled-on-light {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-disabled-on-light, rgba(0, 0, 0, 0.38)) !important; }\n\n.mdc-theme--text-icon-on-light {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-icon-on-light, rgba(0, 0, 0, 0.38)) !important; }\n\n.mdc-theme--text-primary-on-dark {\n  color: white !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-primary-on-dark, white) !important; }\n\n.mdc-theme--text-secondary-on-dark {\n  color: rgba(255, 255, 255, 0.7) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-secondary-on-dark, rgba(255, 255, 255, 0.7)) !important; }\n\n.mdc-theme--text-hint-on-dark {\n  color: rgba(255, 255, 255, 0.5) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-hint-on-dark, rgba(255, 255, 255, 0.5)) !important; }\n\n.mdc-theme--text-disabled-on-dark {\n  color: rgba(255, 255, 255, 0.5) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-disabled-on-dark, rgba(255, 255, 255, 0.5)) !important; }\n\n.mdc-theme--text-icon-on-dark {\n  color: rgba(255, 255, 255, 0.5) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-icon-on-dark, rgba(255, 255, 255, 0.5)) !important; }\n\n.mdc-theme--primary-bg {\n  background-color: #26a69a !important;\n  /* \@alternate */\n  background-color: var(--mdc-theme-primary, #26a69a) !important; }\n\n.mdc-theme--secondary-bg {\n  background-color: #575756 !important;\n  /* \@alternate */\n  background-color: var(--mdc-theme-secondary, #575756) !important; }\n\n.mdc-typography {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased; }\n\n.mdc-typography--headline1 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1rem;\n  line-height: 0.875rem;\n  font-weight: 300;\n  letter-spacing: -0.01562em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--headline2 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1rem;\n  line-height: 0.875rem;\n  font-weight: 300;\n  letter-spacing: -0.00833em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--headline3 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1rem;\n  line-height: 0.875rem;\n  font-weight: 400;\n  letter-spacing: normal;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--headline4 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1rem;\n  line-height: 0.875rem;\n  font-weight: 400;\n  letter-spacing: 0.00735em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--headline5 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.875rem;\n  line-height: 0.875rem;\n  font-weight: 400;\n  letter-spacing: normal;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--headline6 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.875rem;\n  line-height: 0.875rem;\n  font-weight: 500;\n  letter-spacing: 0.0125em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--subtitle1 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.875rem;\n  line-height: 1.125rem;\n  font-weight: 400;\n  letter-spacing: 0.00937em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--subtitle2 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.8125rem;\n  line-height: 1.125rem;\n  font-weight: 500;\n  letter-spacing: 0.00714em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--body1 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.8125rem;\n  line-height: 1.5rem;\n  font-weight: 400;\n  letter-spacing: 0.03125em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--body2 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.8125rem;\n  line-height: 1.625rem;\n  font-weight: 400;\n  letter-spacing: 0.01786em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--caption {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.6875rem;\n  line-height: 0.875rem;\n  font-weight: 400;\n  letter-spacing: 0.03333em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--button {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.875rem;\n  line-height: 2.25rem;\n  font-weight: 500;\n  letter-spacing: 0.08929em;\n  text-decoration: none;\n  text-transform: none; }\n\n.mdc-typography--overline {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.6875rem;\n  line-height: 0.875rem;\n  font-weight: 500;\n  letter-spacing: 0.16667em;\n  text-decoration: none;\n  text-transform: uppercase; }\n\n\@-webkit-keyframes mdc-select-float-native-control {\n  0% {\n    -webkit-transform: translateY(0.5rem);\n    transform: translateY(0.5rem);\n    opacity: 0; }\n  100% {\n    -webkit-transform: translateY(0);\n    transform: translateY(0);\n    opacity: 1; } }\n\n\@keyframes mdc-select-float-native-control {\n  0% {\n    -webkit-transform: translateY(0.5rem);\n    transform: translateY(0.5rem);\n    opacity: 0; }\n  100% {\n    -webkit-transform: translateY(0);\n    transform: translateY(0);\n    opacity: 1; } }\n\n.mdc-line-ripple {\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  height: 0.125rem;\n  -webkit-transform: scaleX(0);\n  transform: scaleX(0);\n  -webkit-transition: opacity 180ms cubic-bezier(0.4, 0, 0.2, 1), -webkit-transform 180ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: opacity 180ms cubic-bezier(0.4, 0, 0.2, 1), -webkit-transform 180ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: transform 180ms cubic-bezier(0.4, 0, 0.2, 1), opacity 180ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: transform 180ms cubic-bezier(0.4, 0, 0.2, 1), opacity 180ms cubic-bezier(0.4, 0, 0.2, 1), -webkit-transform 180ms cubic-bezier(0.4, 0, 0.2, 1);\n  opacity: 0;\n  z-index: 2; }\n\n.mdc-line-ripple--active {\n  -webkit-transform: scaleX(1);\n  transform: scaleX(1);\n  opacity: 1; }\n\n.mdc-line-ripple--deactivating {\n  opacity: 0; }\n\n.mdc-notched-outline {\n  display: -ms-flexbox;\n  display: flex;\n  position: absolute;\n  right: 0;\n  left: 0;\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box;\n  width: 100%;\n  max-width: 100%;\n  height: 100%;\n  /* \@noflip */\n  text-align: left;\n  pointer-events: none; }\n  [dir=\"rtl\"] .mdc-notched-outline, .mdc-notched-outline[dir=\"rtl\"] {\n    /* \@noflip */\n    text-align: right; }\n  .mdc-notched-outline__leading, .mdc-notched-outline__notch, .mdc-notched-outline__trailing {\n    -webkit-box-sizing: border-box;\n    box-sizing: border-box;\n    height: 100%;\n    -webkit-transition: border 150ms cubic-bezier(0.4, 0, 0.2, 1);\n    transition: border 150ms cubic-bezier(0.4, 0, 0.2, 1);\n    border-top: 0.0625rem solid;\n    border-bottom: 0.0625rem solid;\n    pointer-events: none; }\n  .mdc-notched-outline__leading {\n    /* \@noflip */\n    border-left: 0.0625rem solid;\n    /* \@noflip */\n    border-right: none;\n    width: 0.75rem; }\n    [dir=\"rtl\"] .mdc-notched-outline__leading, .mdc-notched-outline__leading[dir=\"rtl\"] {\n      /* \@noflip */\n      border-left: none;\n      /* \@noflip */\n      border-right: 0.0625rem solid; }\n  .mdc-notched-outline__trailing {\n    /* \@noflip */\n    border-left: none;\n    /* \@noflip */\n    border-right: 0.0625rem solid;\n    -ms-flex-positive: 1;\n    flex-grow: 1; }\n    [dir=\"rtl\"] .mdc-notched-outline__trailing, .mdc-notched-outline__trailing[dir=\"rtl\"] {\n      /* \@noflip */\n      border-left: 0.0625rem solid;\n      /* \@noflip */\n      border-right: none; }\n  .mdc-notched-outline__notch {\n    -ms-flex: 0 0 auto;\n    flex: 0 0 auto;\n    width: auto;\n    max-width: calc(100% - 0.75rem * 2); }\n  .mdc-notched-outline .mdc-floating-label {\n    display: inline-block;\n    position: relative;\n    top: 1.0625rem;\n    bottom: auto;\n    max-width: 100%; }\n  .mdc-notched-outline .mdc-floating-label--float-above {\n    text-overflow: clip; }\n  .mdc-notched-outline--upgraded .mdc-floating-label--float-above {\n    max-width: calc(100% / .75); }\n\n.mdc-notched-outline--notched .mdc-notched-outline__notch {\n  /* \@noflip */\n  padding-left: 0;\n  /* \@noflip */\n  padding-right: 0.5rem;\n  border-top: none; }\n  [dir=\"rtl\"] .mdc-notched-outline--notched .mdc-notched-outline__notch, .mdc-notched-outline--notched .mdc-notched-outline__notch[dir=\"rtl\"] {\n    /* \@noflip */\n    padding-left: 0.5rem;\n    /* \@noflip */\n    padding-right: 0; }\n\n.mdc-notched-outline--no-label .mdc-notched-outline__notch {\n  padding: 0; }\n\n.mdc-floating-label {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.875rem;\n  line-height: 1.125rem;\n  font-weight: 400;\n  letter-spacing: 0.00937em;\n  text-decoration: inherit;\n  text-transform: inherit;\n  position: absolute;\n  /* \@noflip */\n  left: 0;\n  /* \@noflip */\n  -webkit-transform-origin: left top;\n  transform-origin: left top;\n  -webkit-transition: color 150ms cubic-bezier(0.4, 0, 0.2, 1), -webkit-transform 150ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: color 150ms cubic-bezier(0.4, 0, 0.2, 1), -webkit-transform 150ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1), color 150ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1), color 150ms cubic-bezier(0.4, 0, 0.2, 1), -webkit-transform 150ms cubic-bezier(0.4, 0, 0.2, 1);\n  /* \@alternate */\n  line-height: 1.15rem;\n  text-align: left;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  cursor: text;\n  overflow: hidden;\n  will-change: transform; }\n  [dir=\"rtl\"] .mdc-floating-label, .mdc-floating-label[dir=\"rtl\"] {\n    /* \@noflip */\n    right: 0;\n    /* \@noflip */\n    left: auto;\n    /* \@noflip */\n    -webkit-transform-origin: right top;\n    transform-origin: right top;\n    /* \@noflip */\n    text-align: right; }\n\n.mdc-floating-label--float-above {\n  cursor: auto; }\n\n.mdc-floating-label--float-above {\n  -webkit-transform: translateY(-50%) scale(0.75);\n  transform: translateY(-50%) scale(0.75); }\n\n.mdc-floating-label--shake {\n  -webkit-animation: mdc-floating-label-shake-float-above-standard 250ms 1;\n  animation: mdc-floating-label-shake-float-above-standard 250ms 1; }\n\n\@-webkit-keyframes mdc-floating-label-shake-float-above-standard {\n  0% {\n    -webkit-transform: translateX(calc(0 - 0%)) translateY(-50%) scale(0.75);\n    transform: translateX(calc(0 - 0%)) translateY(-50%) scale(0.75); }\n  33% {\n    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    -webkit-transform: translateX(calc(4% - 0%)) translateY(-50%) scale(0.75);\n    transform: translateX(calc(4% - 0%)) translateY(-50%) scale(0.75); }\n  66% {\n    -webkit-animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    -webkit-transform: translateX(calc(-4% - 0%)) translateY(-50%) scale(0.75);\n    transform: translateX(calc(-4% - 0%)) translateY(-50%) scale(0.75); }\n  100% {\n    -webkit-transform: translateX(calc(0 - 0%)) translateY(-50%) scale(0.75);\n    transform: translateX(calc(0 - 0%)) translateY(-50%) scale(0.75); } }\n\n\@keyframes mdc-floating-label-shake-float-above-standard {\n  0% {\n    -webkit-transform: translateX(calc(0 - 0%)) translateY(-50%) scale(0.75);\n    transform: translateX(calc(0 - 0%)) translateY(-50%) scale(0.75); }\n  33% {\n    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    -webkit-transform: translateX(calc(4% - 0%)) translateY(-50%) scale(0.75);\n    transform: translateX(calc(4% - 0%)) translateY(-50%) scale(0.75); }\n  66% {\n    -webkit-animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    -webkit-transform: translateX(calc(-4% - 0%)) translateY(-50%) scale(0.75);\n    transform: translateX(calc(-4% - 0%)) translateY(-50%) scale(0.75); }\n  100% {\n    -webkit-transform: translateX(calc(0 - 0%)) translateY(-50%) scale(0.75);\n    transform: translateX(calc(0 - 0%)) translateY(-50%) scale(0.75); } }\n\n\@-webkit-keyframes mdc-ripple-fg-radius-in {\n  from {\n    -webkit-animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n    -webkit-transform: translate(var(--mdc-ripple-fg-translate-start, 0)) scale(1);\n    transform: translate(var(--mdc-ripple-fg-translate-start, 0)) scale(1); }\n  to {\n    -webkit-transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1));\n    transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1)); } }\n\n\@keyframes mdc-ripple-fg-radius-in {\n  from {\n    -webkit-animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n    -webkit-transform: translate(var(--mdc-ripple-fg-translate-start, 0)) scale(1);\n    transform: translate(var(--mdc-ripple-fg-translate-start, 0)) scale(1); }\n  to {\n    -webkit-transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1));\n    transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1)); } }\n\n\@-webkit-keyframes mdc-ripple-fg-opacity-in {\n  from {\n    -webkit-animation-timing-function: linear;\n    animation-timing-function: linear;\n    opacity: 0; }\n  to {\n    opacity: var(--mdc-ripple-fg-opacity, 0); } }\n\n\@keyframes mdc-ripple-fg-opacity-in {\n  from {\n    -webkit-animation-timing-function: linear;\n    animation-timing-function: linear;\n    opacity: 0; }\n  to {\n    opacity: var(--mdc-ripple-fg-opacity, 0); } }\n\n\@-webkit-keyframes mdc-ripple-fg-opacity-out {\n  from {\n    -webkit-animation-timing-function: linear;\n    animation-timing-function: linear;\n    opacity: var(--mdc-ripple-fg-opacity, 0); }\n  to {\n    opacity: 0; } }\n\n\@keyframes mdc-ripple-fg-opacity-out {\n  from {\n    -webkit-animation-timing-function: linear;\n    animation-timing-function: linear;\n    opacity: var(--mdc-ripple-fg-opacity, 0); }\n  to {\n    opacity: 0; } }\n\n.mdc-ripple-surface--test-edge-var-bug {\n  --mdc-ripple-surface-test-edge-var: 0.0625rem solid #000;\n  visibility: hidden; }\n  .mdc-ripple-surface--test-edge-var-bug::before {\n    border: var(--mdc-ripple-surface-test-edge-var); }\n\n.mdc-select--with-leading-icon:not(.mdc-select--disabled) .mdc-select__icon {\n  color: #000;\n  /* \@alternate */\n  color: var(--mdc-theme-on-surface, #000); }\n\n.mdc-select--with-leading-icon .mdc-select__icon {\n  display: inline-block;\n  position: absolute;\n  bottom: 1rem;\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box;\n  width: 1.5rem;\n  height: 1.5rem;\n  border: none;\n  background-color: transparent;\n  fill: currentColor;\n  opacity: 0.54;\n  text-decoration: none;\n  cursor: pointer;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n\n.mdc-select__icon:not([tabindex]),\n.mdc-select__icon[tabindex=\"-1\"] {\n  cursor: default;\n  pointer-events: none; }\n\n.mdc-select-helper-text {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.6875rem;\n  line-height: 0.875rem;\n  font-weight: 400;\n  letter-spacing: 0.03333em;\n  text-decoration: inherit;\n  text-transform: inherit;\n  display: block;\n  margin-top: 0;\n  /* \@alternate */\n  line-height: normal;\n  margin: 0;\n  -webkit-transition: opacity 180ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: opacity 180ms cubic-bezier(0.4, 0, 0.2, 1);\n  opacity: 0;\n  will-change: opacity; }\n  .mdc-select-helper-text::before {\n    display: inline-block;\n    width: 0;\n    height: 1rem;\n    content: \"\";\n    vertical-align: 0; }\n\n.mdc-select-helper-text--persistent {\n  -webkit-transition: none;\n  transition: none;\n  opacity: 1;\n  will-change: initial; }\n\n.mdc-select {\n  --mdc-ripple-fg-size: 0;\n  --mdc-ripple-left: 0;\n  --mdc-ripple-top: 0;\n  --mdc-ripple-fg-scale: 1;\n  --mdc-ripple-fg-translate-end: 0;\n  --mdc-ripple-fg-translate-start: 0;\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n  will-change: transform, opacity;\n  display: -ms-inline-flexbox;\n  display: inline-flex;\n  position: relative;\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box;\n  height: 3.5rem;\n  overflow: hidden;\n  /* \@alternate */\n  will-change: opacity, transform, color; }\n  .mdc-select:not(.mdc-select--disabled) {\n    background-color: #fff; }\n  .mdc-select::before, .mdc-select::after {\n    position: absolute;\n    border-radius: 50%;\n    opacity: 0;\n    pointer-events: none;\n    content: \"\"; }\n  .mdc-select::before {\n    -webkit-transition: opacity 15ms linear, background-color 15ms linear;\n    transition: opacity 15ms linear, background-color 15ms linear;\n    z-index: 1; }\n  .mdc-select.mdc-ripple-upgraded::before {\n    -webkit-transform: scale(var(--mdc-ripple-fg-scale, 1));\n    transform: scale(var(--mdc-ripple-fg-scale, 1)); }\n  .mdc-select.mdc-ripple-upgraded::after {\n    top: 0;\n    /* \@noflip */\n    left: 0;\n    -webkit-transform: scale(0);\n    transform: scale(0);\n    -webkit-transform-origin: center center;\n    transform-origin: center center; }\n  .mdc-select.mdc-ripple-upgraded--unbounded::after {\n    top: var(--mdc-ripple-top, 0);\n    /* \@noflip */\n    left: var(--mdc-ripple-left, 0); }\n  .mdc-select.mdc-ripple-upgraded--foreground-activation::after {\n    -webkit-animation: mdc-ripple-fg-radius-in 225ms forwards, mdc-ripple-fg-opacity-in 75ms forwards;\n    animation: mdc-ripple-fg-radius-in 225ms forwards, mdc-ripple-fg-opacity-in 75ms forwards; }\n  .mdc-select.mdc-ripple-upgraded--foreground-deactivation::after {\n    -webkit-animation: mdc-ripple-fg-opacity-out 150ms;\n    animation: mdc-ripple-fg-opacity-out 150ms;\n    -webkit-transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1));\n    transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1)); }\n  .mdc-select::before, .mdc-select::after {\n    top: calc(50% - 100%);\n    /* \@noflip */\n    left: calc(50% - 100%);\n    width: 200%;\n    height: 200%; }\n  .mdc-select.mdc-ripple-upgraded::after {\n    width: var(--mdc-ripple-fg-size, 100%);\n    height: var(--mdc-ripple-fg-size, 100%); }\n  .mdc-select::before, .mdc-select::after {\n    background-color: rgba(0, 0, 0, 0.87); }\n  .mdc-select:hover::before {\n    opacity: 0.04; }\n  .mdc-select:not(.mdc-ripple-upgraded):focus::before, .mdc-select.mdc-ripple-upgraded--background-focused::before {\n    -webkit-transition-duration: 75ms;\n    transition-duration: 75ms;\n    opacity: 0.12; }\n  .mdc-select:not(.mdc-select--disabled) .mdc-select__native-control,\n  .mdc-select:not(.mdc-select--disabled) .mdc-select__selected-text {\n    color: rgba(0, 0, 0, 0.87); }\n  .mdc-select:not(.mdc-select--disabled) .mdc-floating-label {\n    color: rgba(0, 0, 0, 0.6); }\n  .mdc-select:not(.mdc-select--disabled) .mdc-select__native-control,\n  .mdc-select:not(.mdc-select--disabled) .mdc-select__selected-text {\n    border-bottom-color: rgba(0, 0, 0, 0.12); }\n  .mdc-select:not(.mdc-select--disabled) + .mdc-select-helper-text {\n    color: rgba(0, 0, 0, 0.6); }\n  .mdc-select, .mdc-select__native-control {\n    border-radius: 0.25rem 0.25rem 0 0; }\n  .mdc-select:not(.mdc-select--disabled).mdc-select--focused .mdc-line-ripple {\n    background-color: #26a69a;\n    /* \@alternate */\n    background-color: var(--mdc-theme-primary, #26a69a); }\n  .mdc-select:not(.mdc-select--disabled).mdc-select--focused .mdc-floating-label {\n    color: rgba(38, 166, 154, 0.87); }\n  .mdc-select:not(.mdc-select--disabled) .mdc-select__native-control:hover {\n    border-bottom-color: rgba(0, 0, 0, 0.12); }\n  .mdc-select .mdc-floating-label--float-above {\n    -webkit-transform: translateY(-70%) scale(0.75);\n    transform: translateY(-70%) scale(0.75); }\n  .mdc-select .mdc-floating-label {\n    /* \@noflip */\n    left: 1rem;\n    /* \@noflip */\n    right: initial;\n    top: 1.3125rem;\n    pointer-events: none; }\n    [dir=\"rtl\"] .mdc-select .mdc-floating-label, .mdc-select .mdc-floating-label[dir=\"rtl\"] {\n      /* \@noflip */\n      left: initial;\n      /* \@noflip */\n      right: 1rem; }\n  .mdc-select.mdc-select--with-leading-icon .mdc-floating-label {\n    /* \@noflip */\n    left: 3rem;\n    /* \@noflip */\n    right: initial; }\n    [dir=\"rtl\"] .mdc-select.mdc-select--with-leading-icon .mdc-floating-label, .mdc-select.mdc-select--with-leading-icon .mdc-floating-label[dir=\"rtl\"] {\n      /* \@noflip */\n      left: initial;\n      /* \@noflip */\n      right: 3rem; }\n  .mdc-select.mdc-select--outlined .mdc-floating-label {\n    /* \@noflip */\n    left: 0.25rem;\n    /* \@noflip */\n    right: initial;\n    top: 1.0625rem; }\n    [dir=\"rtl\"] .mdc-select.mdc-select--outlined .mdc-floating-label, .mdc-select.mdc-select--outlined .mdc-floating-label[dir=\"rtl\"] {\n      /* \@noflip */\n      left: initial;\n      /* \@noflip */\n      right: 0.25rem; }\n  .mdc-select.mdc-select--outlined.mdc-select--with-leading-icon .mdc-floating-label {\n    /* \@noflip */\n    left: 2.25rem;\n    /* \@noflip */\n    right: initial; }\n    [dir=\"rtl\"] .mdc-select.mdc-select--outlined.mdc-select--with-leading-icon .mdc-floating-label, .mdc-select.mdc-select--outlined.mdc-select--with-leading-icon .mdc-floating-label[dir=\"rtl\"] {\n      /* \@noflip */\n      left: initial;\n      /* \@noflip */\n      right: 2.25rem; }\n    .mdc-select.mdc-select--outlined.mdc-select--with-leading-icon .mdc-floating-label--float-above {\n      /* \@noflip */\n      left: 2.25rem;\n      /* \@noflip */\n      right: initial; }\n      [dir=\"rtl\"] .mdc-select.mdc-select--outlined.mdc-select--with-leading-icon .mdc-floating-label--float-above, .mdc-select.mdc-select--outlined.mdc-select--with-leading-icon .mdc-floating-label--float-above[dir=\"rtl\"] {\n        /* \@noflip */\n        left: initial;\n        /* \@noflip */\n        right: 2.25rem; }\n  .mdc-select__dropdown-icon {\n    background: url(\"data:image/svg+xml,%3Csvg%20width%3D%138.125rem%22%20height%3D%14.0625rem%22%20viewBox%3D%227%2010%2010%205%22%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%3E%0A%20%20%20%20%3Cpolygon%20id%3D%22Shape%22%20stroke%3D%22none%22%20fill%3D%22%23000%22%20fill-rule%3D%22evenodd%22%20opacity%3D%220.54%22%20points%3D%227%2010%2012%2015%2017%2010%22%3E%3C%2Fpolygon%3E%0A%3C%2Fsvg%3E\") no-repeat center;\n    /* \@noflip */\n    left: auto;\n    /* \@noflip */\n    right: 0.5rem;\n    position: absolute;\n    bottom: 1rem;\n    width: 1.5rem;\n    height: 1.5rem;\n    -webkit-transition: -webkit-transform 150ms cubic-bezier(0.4, 0, 0.2, 1);\n    transition: -webkit-transform 150ms cubic-bezier(0.4, 0, 0.2, 1);\n    transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1);\n    transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1), -webkit-transform 150ms cubic-bezier(0.4, 0, 0.2, 1);\n    pointer-events: none; }\n    [dir=\"rtl\"] .mdc-select__dropdown-icon, .mdc-select__dropdown-icon[dir=\"rtl\"] {\n      /* \@noflip */\n      left: 0.5rem;\n      /* \@noflip */\n      right: auto; }\n    .mdc-select--focused .mdc-select__dropdown-icon {\n      background: url(\"data:image/svg+xml,%3Csvg%20width%3D%138.125rem%22%20height%3D%14.0625rem%22%20viewBox%3D%227%2010%2010%205%22%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%3E%0A%20%20%20%20%3Cpolygon%20id%3D%22Shape%22%20stroke%3D%22none%22%20fill%3D%22%2326a69a%22%20fill-rule%3D%22evenodd%22%20opacity%3D%221%22%20points%3D%227%2010%2012%2015%2017%2010%22%3E%3C%2Fpolygon%3E%0A%3C%2Fsvg%3E\") no-repeat center;\n      -webkit-transform: rotate(180deg) translateY(-0.3125rem);\n      transform: rotate(180deg) translateY(-0.3125rem);\n      -webkit-transition: -webkit-transform 150ms cubic-bezier(0.4, 0, 0.2, 1);\n      transition: -webkit-transform 150ms cubic-bezier(0.4, 0, 0.2, 1);\n      transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1);\n      transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1), -webkit-transform 150ms cubic-bezier(0.4, 0, 0.2, 1); }\n  .mdc-select__native-control {\n    padding-top: 1.25rem; }\n  .mdc-select.mdc-select--focused .mdc-line-ripple::after {\n    -webkit-transform: scale(1, 2);\n    transform: scale(1, 2);\n    opacity: 1; }\n\n.mdc-select + .mdc-select-helper-text {\n  margin-right: 0.75rem;\n  margin-left: 0.75rem; }\n\n.mdc-select--outlined + .mdc-select-helper-text {\n  margin-right: 1rem;\n  margin-left: 1rem; }\n\n.mdc-select--focused + .mdc-select-helper-text:not(.mdc-select-helper-text--validation-msg) {\n  opacity: 1; }\n\n.mdc-select__selected-text {\n  min-width: 12.5rem;\n  padding-top: 1.375rem; }\n\n.mdc-select__native-control,\n.mdc-select__selected-text {\n  /* \@noflip */\n  padding-left: 1rem;\n  /* \@noflip */\n  padding-right: 3.25rem;\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.875rem;\n  line-height: 1.125rem;\n  font-weight: 400;\n  letter-spacing: 0.00937em;\n  text-decoration: inherit;\n  text-transform: inherit;\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box;\n  width: 100%;\n  height: 3.5rem;\n  padding-top: 1.25rem;\n  padding-bottom: 0.25rem;\n  border: none;\n  border-bottom: 0.0625rem solid;\n  outline: none;\n  background-color: transparent;\n  color: inherit;\n  white-space: nowrap;\n  cursor: pointer;\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  appearance: none; }\n  [dir=\"rtl\"] .mdc-select__native-control, .mdc-select__native-control[dir=\"rtl\"], [dir=\"rtl\"]\n  .mdc-select__selected-text,\n  .mdc-select__selected-text[dir=\"rtl\"] {\n    /* \@noflip */\n    padding-left: 3.25rem;\n    /* \@noflip */\n    padding-right: 1rem; }\n  .mdc-select__native-control::-ms-expand,\n  .mdc-select__selected-text::-ms-expand {\n    display: none; }\n  .mdc-select__native-control::-ms-value,\n  .mdc-select__selected-text::-ms-value {\n    background-color: transparent;\n    color: inherit; }\n\n\@-moz-document url-prefix(\"\") {\n  .mdc-select__native-control,\n  .mdc-select__selected-text {\n    text-indent: -0.125rem; } }\n\n.mdc-select--outlined {\n  border: none;\n  overflow: visible; }\n  .mdc-select--outlined:not(.mdc-select--disabled) {\n    background-color: transparent; }\n  .mdc-select--outlined:not(.mdc-select--disabled) .mdc-notched-outline__leading,\n  .mdc-select--outlined:not(.mdc-select--disabled) .mdc-notched-outline__notch,\n  .mdc-select--outlined:not(.mdc-select--disabled) .mdc-notched-outline__trailing {\n    border-color: rgba(0, 0, 0, 0.24); }\n  .mdc-select--outlined:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__native-control:hover ~ .mdc-notched-outline .mdc-notched-outline__leading,\n  .mdc-select--outlined:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__native-control:hover ~ .mdc-notched-outline .mdc-notched-outline__notch,\n  .mdc-select--outlined:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__native-control:hover ~ .mdc-notched-outline .mdc-notched-outline__trailing,\n  .mdc-select--outlined:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__selected-text:hover ~ .mdc-notched-outline .mdc-notched-outline__leading,\n  .mdc-select--outlined:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__selected-text:hover ~ .mdc-notched-outline .mdc-notched-outline__notch,\n  .mdc-select--outlined:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__selected-text:hover ~ .mdc-notched-outline .mdc-notched-outline__trailing {\n    border-color: rgba(0, 0, 0, 0.87); }\n  .mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__leading,\n  .mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__notch,\n  .mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__trailing {\n    border-width: 0.125rem; }\n  .mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__leading,\n  .mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__notch,\n  .mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__trailing {\n    border-color: #26a69a;\n    /* \@alternate */\n    border-color: var(--mdc-theme-primary, #26a69a); }\n  .mdc-select--outlined .mdc-floating-label--shake {\n    -webkit-animation: mdc-floating-label-shake-float-above-text-field-outlined 250ms 1;\n    animation: mdc-floating-label-shake-float-above-text-field-outlined 250ms 1; }\n  .mdc-select--outlined .mdc-notched-outline .mdc-notched-outline__leading {\n    /* \@noflip */\n    border-radius: 0.25rem 0 0 0.25rem; }\n    [dir=\"rtl\"] .mdc-select--outlined .mdc-notched-outline .mdc-notched-outline__leading, .mdc-select--outlined .mdc-notched-outline .mdc-notched-outline__leading[dir=\"rtl\"] {\n      /* \@noflip */\n      border-radius: 0 0.25rem 0.25rem 0; }\n  .mdc-select--outlined .mdc-notched-outline .mdc-notched-outline__trailing {\n    /* \@noflip */\n    border-radius: 0 0.25rem 0.25rem 0; }\n    [dir=\"rtl\"] .mdc-select--outlined .mdc-notched-outline .mdc-notched-outline__trailing, .mdc-select--outlined .mdc-notched-outline .mdc-notched-outline__trailing[dir=\"rtl\"] {\n      /* \@noflip */\n      border-radius: 0.25rem 0 0 0.25rem; }\n  .mdc-select--outlined .mdc-select__native-control {\n    border-radius: 0.25rem; }\n  .mdc-select--outlined::before, .mdc-select--outlined::after {\n    content: none; }\n  .mdc-select--outlined:not(.mdc-select--disabled) {\n    background-color: transparent; }\n  .mdc-select--outlined .mdc-floating-label--float-above {\n    -webkit-transform: translateY(-144%) scale(1);\n    transform: translateY(-144%) scale(1); }\n  .mdc-select--outlined .mdc-floating-label--float-above {\n    font-size: 0.75rem; }\n  .mdc-select--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,\n  .mdc-select--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above {\n    -webkit-transform: translateY(-130%) scale(0.75);\n    transform: translateY(-130%) scale(0.75); }\n  .mdc-select--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,\n  .mdc-select--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above {\n    font-size: 1rem; }\n  .mdc-select--outlined .mdc-select__native-control,\n  .mdc-select--outlined .mdc-select__selected-text {\n    /* \@noflip */\n    padding-left: 1rem;\n    /* \@noflip */\n    padding-right: 3.25rem;\n    display: -ms-flexbox;\n    display: flex;\n    padding-top: 0.75rem;\n    padding-bottom: 0.75rem;\n    border: none;\n    background-color: transparent;\n    z-index: 1; }\n    [dir=\"rtl\"] .mdc-select--outlined .mdc-select__native-control, .mdc-select--outlined .mdc-select__native-control[dir=\"rtl\"], [dir=\"rtl\"]\n    .mdc-select--outlined .mdc-select__selected-text,\n    .mdc-select--outlined .mdc-select__selected-text[dir=\"rtl\"] {\n      /* \@noflip */\n      padding-left: 3.25rem;\n      /* \@noflip */\n      padding-right: 1rem; }\n  .mdc-select--outlined .mdc-select__selected-text {\n    padding-top: 0.875rem; }\n  .mdc-select--outlined .mdc-select__icon {\n    z-index: 2; }\n  .mdc-select--outlined .mdc-floating-label {\n    line-height: 1.15rem;\n    pointer-events: auto; }\n\n.mdc-select--invalid:not(.mdc-select--disabled) .mdc-floating-label {\n  color: #b00020;\n  /* \@alternate */\n  color: var(--mdc-theme-error, #b00020); }\n\n.mdc-select--invalid:not(.mdc-select--disabled) .mdc-select__native-control,\n.mdc-select--invalid:not(.mdc-select--disabled) .mdc-select__selected-text {\n  border-bottom-color: #b00020;\n  /* \@alternate */\n  border-bottom-color: var(--mdc-theme-error, #b00020); }\n\n.mdc-select--invalid:not(.mdc-select--disabled).mdc-select--focused .mdc-line-ripple {\n  background-color: #b00020;\n  /* \@alternate */\n  background-color: var(--mdc-theme-error, #b00020); }\n\n.mdc-select--invalid:not(.mdc-select--disabled).mdc-select--focused .mdc-floating-label {\n  color: #b00020; }\n\n.mdc-select--invalid:not(.mdc-select--disabled).mdc-select--invalid + .mdc-select-helper-text--validation-msg {\n  color: #b00020;\n  /* \@alternate */\n  color: var(--mdc-theme-error, #b00020); }\n\n.mdc-select--invalid:not(.mdc-select--disabled) .mdc-select__native-control:hover {\n  border-bottom-color: #b00020;\n  /* \@alternate */\n  border-bottom-color: var(--mdc-theme-error, #b00020); }\n\n.mdc-select--invalid.mdc-select--outlined:not(.mdc-select--disabled) .mdc-notched-outline__leading,\n.mdc-select--invalid.mdc-select--outlined:not(.mdc-select--disabled) .mdc-notched-outline__notch,\n.mdc-select--invalid.mdc-select--outlined:not(.mdc-select--disabled) .mdc-notched-outline__trailing {\n  border-color: #b00020;\n  /* \@alternate */\n  border-color: var(--mdc-theme-error, #b00020); }\n\n.mdc-select--invalid.mdc-select--outlined:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__native-control:hover ~ .mdc-notched-outline .mdc-notched-outline__leading,\n.mdc-select--invalid.mdc-select--outlined:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__native-control:hover ~ .mdc-notched-outline .mdc-notched-outline__notch,\n.mdc-select--invalid.mdc-select--outlined:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__native-control:hover ~ .mdc-notched-outline .mdc-notched-outline__trailing,\n.mdc-select--invalid.mdc-select--outlined:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__selected-text:hover ~ .mdc-notched-outline .mdc-notched-outline__leading,\n.mdc-select--invalid.mdc-select--outlined:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__selected-text:hover ~ .mdc-notched-outline .mdc-notched-outline__notch,\n.mdc-select--invalid.mdc-select--outlined:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__selected-text:hover ~ .mdc-notched-outline .mdc-notched-outline__trailing {\n  border-color: #b00020;\n  /* \@alternate */\n  border-color: var(--mdc-theme-error, #b00020); }\n\n.mdc-select--invalid.mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__leading,\n.mdc-select--invalid.mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__notch,\n.mdc-select--invalid.mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__trailing {\n  border-width: 0.125rem; }\n\n.mdc-select--invalid.mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__leading,\n.mdc-select--invalid.mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__notch,\n.mdc-select--invalid.mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__trailing {\n  border-color: #b00020;\n  /* \@alternate */\n  border-color: var(--mdc-theme-error, #b00020); }\n\n.mdc-select--invalid .mdc-select__dropdown-icon {\n  background: url(\"data:image/svg+xml,%3Csvg%20width%3D%138.125rem%22%20height%3D%14.0625rem%22%20viewBox%3D%227%2010%2010%205%22%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%3E%0A%20%20%20%20%3Cpolygon%20id%3D%22Shape%22%20stroke%3D%22none%22%20fill%3D%22%23b00020%22%20fill-rule%3D%22evenodd%22%20opacity%3D%221%22%20points%3D%227%2010%2012%2015%2017%2010%22%3E%3C%2Fpolygon%3E%0A%3C%2Fsvg%3E\") no-repeat center; }\n\n.mdc-select--invalid + .mdc-select-helper-text--validation-msg {\n  opacity: 1; }\n\n.mdc-select--required .mdc-floating-label::after {\n  content: \"*\"; }\n\n.mdc-select--disabled {\n  background-color: #fafafa;\n  cursor: default;\n  pointer-events: none; }\n  .mdc-select--disabled .mdc-floating-label {\n    color: rgba(0, 0, 0, 0.37); }\n  .mdc-select--disabled .mdc-select__dropdown-icon {\n    background: url(\"data:image/svg+xml,%3Csvg%20width%3D%138.125rem%22%20height%3D%14.0625rem%22%20viewBox%3D%227%2010%2010%205%22%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%3E%0A%20%20%20%20%3Cpolygon%20id%3D%22Shape%22%20stroke%3D%22none%22%20fill%3D%22%23000%22%20fill-rule%3D%22evenodd%22%20opacity%3D%220.37%22%20points%3D%227%2010%2012%2015%2017%2010%22%3E%3C%2Fpolygon%3E%0A%3C%2Fsvg%3E\") no-repeat center; }\n  .mdc-select--disabled .mdc-line-ripple {\n    display: none; }\n  .mdc-select--disabled .mdc-select__icon {\n    color: rgba(0, 0, 0, 0.37); }\n  .mdc-select--disabled .mdc-select__native-control,\n  .mdc-select--disabled .mdc-select__selected-text {\n    color: rgba(0, 0, 0, 0.37);\n    border-bottom-style: dotted; }\n  .mdc-select--disabled .mdc-select__selected-text {\n    pointer-events: none; }\n  .mdc-select--disabled.mdc-select--outlined {\n    background-color: transparent; }\n    .mdc-select--disabled.mdc-select--outlined .mdc-select__native-control,\n    .mdc-select--disabled.mdc-select--outlined .mdc-select__selected-text {\n      border-bottom-style: none; }\n    .mdc-select--disabled.mdc-select--outlined .mdc-notched-outline__leading,\n    .mdc-select--disabled.mdc-select--outlined .mdc-notched-outline__notch,\n    .mdc-select--disabled.mdc-select--outlined .mdc-notched-outline__trailing {\n      border-color: rgba(0, 0, 0, 0.16); }\n\n.mdc-select--with-leading-icon .mdc-select__icon {\n  /* \@noflip */\n  left: 1rem;\n  /* \@noflip */\n  right: initial; }\n  [dir=\"rtl\"] .mdc-select--with-leading-icon .mdc-select__icon, .mdc-select--with-leading-icon .mdc-select__icon[dir=\"rtl\"] {\n    /* \@noflip */\n    left: initial;\n    /* \@noflip */\n    right: 1rem; }\n\n.mdc-select--with-leading-icon .mdc-select__native-control,\n.mdc-select--with-leading-icon .mdc-select__selected-text {\n  /* \@noflip */\n  padding-left: 3rem;\n  /* \@noflip */\n  padding-right: 2rem; }\n  [dir=\"rtl\"] .mdc-select--with-leading-icon .mdc-select__native-control, .mdc-select--with-leading-icon .mdc-select__native-control[dir=\"rtl\"], [dir=\"rtl\"]\n  .mdc-select--with-leading-icon .mdc-select__selected-text,\n  .mdc-select--with-leading-icon .mdc-select__selected-text[dir=\"rtl\"] {\n    /* \@noflip */\n    padding-left: 2rem;\n    /* \@noflip */\n    padding-right: 3rem; }\n\n.mdc-select--with-leading-icon.mdc-select--outlined .mdc-floating-label--float-above {\n  -webkit-transform: translateY(-144%) translateX(-2rem) scale(1);\n  transform: translateY(-144%) translateX(-2rem) scale(1); }\n  [dir=\"rtl\"] .mdc-select--with-leading-icon.mdc-select--outlined .mdc-floating-label--float-above, .mdc-select--with-leading-icon.mdc-select--outlined .mdc-floating-label--float-above[dir=\"rtl\"] {\n    -webkit-transform: translateY(-144%) translateX(2rem) scale(1);\n    transform: translateY(-144%) translateX(2rem) scale(1); }\n\n.mdc-select--with-leading-icon.mdc-select--outlined .mdc-floating-label--float-above {\n  font-size: 0.75rem; }\n\n.mdc-select--with-leading-icon.mdc-select--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,\n.mdc-select--with-leading-icon.mdc-select--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above {\n  -webkit-transform: translateY(-130%) translateX(-2rem) scale(0.75);\n  transform: translateY(-130%) translateX(-2rem) scale(0.75); }\n  [dir=\"rtl\"] .mdc-select--with-leading-icon.mdc-select--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above, .mdc-select--with-leading-icon.mdc-select--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above[dir=\"rtl\"], [dir=\"rtl\"]\n  .mdc-select--with-leading-icon.mdc-select--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above,\n  .mdc-select--with-leading-icon.mdc-select--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above[dir=\"rtl\"] {\n    -webkit-transform: translateY(-130%) translateX(2rem) scale(0.75);\n    transform: translateY(-130%) translateX(2rem) scale(0.75); }\n\n.mdc-select--with-leading-icon.mdc-select--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,\n.mdc-select--with-leading-icon.mdc-select--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above {\n  font-size: 1rem; }\n\n.mdc-select--with-leading-icon.mdc-select--outlined .mdc-floating-label--shake {\n  -webkit-animation: mdc-floating-label-shake-float-above-select-outlined-leading-icon 250ms 1;\n  animation: mdc-floating-label-shake-float-above-select-outlined-leading-icon 250ms 1; }\n\n[dir=\"rtl\"] .mdc-select--with-leading-icon.mdc-select--outlined .mdc-floating-label--shake, .mdc-select--with-leading-icon.mdc-select--outlined[dir=\"rtl\"] .mdc-floating-label--shake {\n  -webkit-animation: mdc-floating-label-shake-float-above-select-outlined-leading-icon-rtl 250ms 1;\n  animation: mdc-floating-label-shake-float-above-select-outlined-leading-icon-rtl 250ms 1; }\n\n.mdc-select--with-leading-icon.mdc-select__menu .mdc-list-item__text {\n  /* \@noflip */\n  padding-left: 2rem;\n  /* \@noflip */\n  padding-right: 2rem; }\n  [dir=\"rtl\"] .mdc-select--with-leading-icon.mdc-select__menu .mdc-list-item__text, .mdc-select--with-leading-icon.mdc-select__menu .mdc-list-item__text[dir=\"rtl\"] {\n    /* \@noflip */\n    padding-left: 2rem;\n    /* \@noflip */\n    padding-right: 2rem; }\n\n.mdc-select__menu .mdc-list .mdc-list-item--selected {\n  color: #000;\n  /* \@alternate */\n  color: var(--mdc-theme-on-surface, #000); }\n  .mdc-select__menu .mdc-list .mdc-list-item--selected::before, .mdc-select__menu .mdc-list .mdc-list-item--selected::after {\n    background-color: #000; }\n    \@supports not (-ms-ime-align: auto) {\n      .mdc-select__menu .mdc-list .mdc-list-item--selected::before, .mdc-select__menu .mdc-list .mdc-list-item--selected::after {\n        /* \@alternate */\n        background-color: var(--mdc-theme-on-surface, #000); } }\n  .mdc-select__menu .mdc-list .mdc-list-item--selected:hover::before {\n    opacity: 0.04; }\n  .mdc-select__menu .mdc-list .mdc-list-item--selected:not(.mdc-ripple-upgraded):focus::before, .mdc-select__menu .mdc-list .mdc-list-item--selected.mdc-ripple-upgraded--background-focused::before {\n    -webkit-transition-duration: 75ms;\n    transition-duration: 75ms;\n    opacity: 0.12; }\n  .mdc-select__menu .mdc-list .mdc-list-item--selected:not(.mdc-ripple-upgraded)::after {\n    -webkit-transition: opacity 150ms linear;\n    transition: opacity 150ms linear; }\n  .mdc-select__menu .mdc-list .mdc-list-item--selected:not(.mdc-ripple-upgraded):active::after {\n    -webkit-transition-duration: 75ms;\n    transition-duration: 75ms;\n    opacity: 0.12; }\n  .mdc-select__menu .mdc-list .mdc-list-item--selected.mdc-ripple-upgraded {\n    --mdc-ripple-fg-opacity: 0.12; }\n\n\@-webkit-keyframes mdc-floating-label-shake-float-above-select-outlined-leading-icon {\n  0% {\n    -webkit-transform: translateX(calc(0 - 2rem)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(0 - 2rem)) translateY(-130%) scale(0.75); }\n  33% {\n    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    -webkit-transform: translateX(calc(4% - 2rem)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(4% - 2rem)) translateY(-130%) scale(0.75); }\n  66% {\n    -webkit-animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    -webkit-transform: translateX(calc(-4% - 2rem)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(-4% - 2rem)) translateY(-130%) scale(0.75); }\n  100% {\n    -webkit-transform: translateX(calc(0 - 2rem)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(0 - 2rem)) translateY(-130%) scale(0.75); } }\n\n\@keyframes mdc-floating-label-shake-float-above-select-outlined-leading-icon {\n  0% {\n    -webkit-transform: translateX(calc(0 - 2rem)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(0 - 2rem)) translateY(-130%) scale(0.75); }\n  33% {\n    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    -webkit-transform: translateX(calc(4% - 2rem)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(4% - 2rem)) translateY(-130%) scale(0.75); }\n  66% {\n    -webkit-animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    -webkit-transform: translateX(calc(-4% - 2rem)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(-4% - 2rem)) translateY(-130%) scale(0.75); }\n  100% {\n    -webkit-transform: translateX(calc(0 - 2rem)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(0 - 2rem)) translateY(-130%) scale(0.75); } }\n\n\@-webkit-keyframes mdc-floating-label-shake-float-above-select-outlined-leading-icon-rtl {\n  0% {\n    -webkit-transform: translateX(calc(0 - -2rem)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(0 - -2rem)) translateY(-130%) scale(0.75); }\n  33% {\n    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    -webkit-transform: translateX(calc(4% - -2rem)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(4% - -2rem)) translateY(-130%) scale(0.75); }\n  66% {\n    -webkit-animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    -webkit-transform: translateX(calc(-4% - -2rem)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(-4% - -2rem)) translateY(-130%) scale(0.75); }\n  100% {\n    -webkit-transform: translateX(calc(0 - -2rem)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(0 - -2rem)) translateY(-130%) scale(0.75); } }\n\n\@keyframes mdc-floating-label-shake-float-above-select-outlined-leading-icon-rtl {\n  0% {\n    -webkit-transform: translateX(calc(0 - -2rem)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(0 - -2rem)) translateY(-130%) scale(0.75); }\n  33% {\n    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    -webkit-transform: translateX(calc(4% - -2rem)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(4% - -2rem)) translateY(-130%) scale(0.75); }\n  66% {\n    -webkit-animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    -webkit-transform: translateX(calc(-4% - -2rem)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(-4% - -2rem)) translateY(-130%) scale(0.75); }\n  100% {\n    -webkit-transform: translateX(calc(0 - -2rem)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(0 - -2rem)) translateY(-130%) scale(0.75); } }\n\n.mdc-ripple-surface {\n  --mdc-ripple-fg-size: 0;\n  --mdc-ripple-left: 0;\n  --mdc-ripple-top: 0;\n  --mdc-ripple-fg-scale: 1;\n  --mdc-ripple-fg-translate-end: 0;\n  --mdc-ripple-fg-translate-start: 0;\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n  will-change: transform, opacity;\n  position: relative;\n  outline: none;\n  overflow: hidden; }\n  .mdc-ripple-surface::before, .mdc-ripple-surface::after {\n    position: absolute;\n    border-radius: 50%;\n    opacity: 0;\n    pointer-events: none;\n    content: \"\"; }\n  .mdc-ripple-surface::before {\n    -webkit-transition: opacity 15ms linear, background-color 15ms linear;\n    transition: opacity 15ms linear, background-color 15ms linear;\n    z-index: 1; }\n  .mdc-ripple-surface.mdc-ripple-upgraded::before {\n    -webkit-transform: scale(var(--mdc-ripple-fg-scale, 1));\n    transform: scale(var(--mdc-ripple-fg-scale, 1)); }\n  .mdc-ripple-surface.mdc-ripple-upgraded::after {\n    top: 0;\n    /* \@noflip */\n    left: 0;\n    -webkit-transform: scale(0);\n    transform: scale(0);\n    -webkit-transform-origin: center center;\n    transform-origin: center center; }\n  .mdc-ripple-surface.mdc-ripple-upgraded--unbounded::after {\n    top: var(--mdc-ripple-top, 0);\n    /* \@noflip */\n    left: var(--mdc-ripple-left, 0); }\n  .mdc-ripple-surface.mdc-ripple-upgraded--foreground-activation::after {\n    -webkit-animation: mdc-ripple-fg-radius-in 225ms forwards, mdc-ripple-fg-opacity-in 75ms forwards;\n    animation: mdc-ripple-fg-radius-in 225ms forwards, mdc-ripple-fg-opacity-in 75ms forwards; }\n  .mdc-ripple-surface.mdc-ripple-upgraded--foreground-deactivation::after {\n    -webkit-animation: mdc-ripple-fg-opacity-out 150ms;\n    animation: mdc-ripple-fg-opacity-out 150ms;\n    -webkit-transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1));\n    transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1)); }\n  .mdc-ripple-surface::before, .mdc-ripple-surface::after {\n    background-color: #000; }\n  .mdc-ripple-surface:hover::before {\n    opacity: 0.04; }\n  .mdc-ripple-surface:not(.mdc-ripple-upgraded):focus::before, .mdc-ripple-surface.mdc-ripple-upgraded--background-focused::before {\n    -webkit-transition-duration: 75ms;\n    transition-duration: 75ms;\n    opacity: 0.12; }\n  .mdc-ripple-surface:not(.mdc-ripple-upgraded)::after {\n    -webkit-transition: opacity 150ms linear;\n    transition: opacity 150ms linear; }\n  .mdc-ripple-surface:not(.mdc-ripple-upgraded):active::after {\n    -webkit-transition-duration: 75ms;\n    transition-duration: 75ms;\n    opacity: 0.12; }\n  .mdc-ripple-surface.mdc-ripple-upgraded {\n    --mdc-ripple-fg-opacity: 0.12; }\n  .mdc-ripple-surface::before, .mdc-ripple-surface::after {\n    top: calc(50% - 100%);\n    /* \@noflip */\n    left: calc(50% - 100%);\n    width: 200%;\n    height: 200%; }\n  .mdc-ripple-surface.mdc-ripple-upgraded::after {\n    width: var(--mdc-ripple-fg-size, 100%);\n    height: var(--mdc-ripple-fg-size, 100%); }\n  .mdc-ripple-surface[data-mdc-ripple-is-unbounded] {\n    overflow: visible; }\n    .mdc-ripple-surface[data-mdc-ripple-is-unbounded]::before, .mdc-ripple-surface[data-mdc-ripple-is-unbounded]::after {\n      top: calc(50% - 50%);\n      /* \@noflip */\n      left: calc(50% - 50%);\n      width: 100%;\n      height: 100%; }\n    .mdc-ripple-surface[data-mdc-ripple-is-unbounded].mdc-ripple-upgraded::before, .mdc-ripple-surface[data-mdc-ripple-is-unbounded].mdc-ripple-upgraded::after {\n      top: var(--mdc-ripple-top, calc(50% - 50%));\n      /* \@noflip */\n      left: var(--mdc-ripple-left, calc(50% - 50%));\n      width: var(--mdc-ripple-fg-size, 100%);\n      height: var(--mdc-ripple-fg-size, 100%); }\n    .mdc-ripple-surface[data-mdc-ripple-is-unbounded].mdc-ripple-upgraded::after {\n      width: var(--mdc-ripple-fg-size, 100%);\n      height: var(--mdc-ripple-fg-size, 100%); }\n  .mdc-ripple-surface--primary::before, .mdc-ripple-surface--primary::after {\n    background-color: #26a69a; }\n    \@supports not (-ms-ime-align: auto) {\n      .mdc-ripple-surface--primary::before, .mdc-ripple-surface--primary::after {\n        /* \@alternate */\n        background-color: var(--mdc-theme-primary, #26a69a); } }\n  .mdc-ripple-surface--primary:hover::before {\n    opacity: 0.08; }\n  .mdc-ripple-surface--primary:not(.mdc-ripple-upgraded):focus::before, .mdc-ripple-surface--primary.mdc-ripple-upgraded--background-focused::before {\n    -webkit-transition-duration: 75ms;\n    transition-duration: 75ms;\n    opacity: 0.24; }\n  .mdc-ripple-surface--primary:not(.mdc-ripple-upgraded)::after {\n    -webkit-transition: opacity 150ms linear;\n    transition: opacity 150ms linear; }\n  .mdc-ripple-surface--primary:not(.mdc-ripple-upgraded):active::after {\n    -webkit-transition-duration: 75ms;\n    transition-duration: 75ms;\n    opacity: 0.24; }\n  .mdc-ripple-surface--primary.mdc-ripple-upgraded {\n    --mdc-ripple-fg-opacity: 0.24; }\n  .mdc-ripple-surface--accent::before, .mdc-ripple-surface--accent::after {\n    background-color: #575756; }\n    \@supports not (-ms-ime-align: auto) {\n      .mdc-ripple-surface--accent::before, .mdc-ripple-surface--accent::after {\n        /* \@alternate */\n        background-color: var(--mdc-theme-secondary, #575756); } }\n  .mdc-ripple-surface--accent:hover::before {\n    opacity: 0.04; }\n  .mdc-ripple-surface--accent:not(.mdc-ripple-upgraded):focus::before, .mdc-ripple-surface--accent.mdc-ripple-upgraded--background-focused::before {\n    -webkit-transition-duration: 75ms;\n    transition-duration: 75ms;\n    opacity: 0.12; }\n  .mdc-ripple-surface--accent:not(.mdc-ripple-upgraded)::after {\n    -webkit-transition: opacity 150ms linear;\n    transition: opacity 150ms linear; }\n  .mdc-ripple-surface--accent:not(.mdc-ripple-upgraded):active::after {\n    -webkit-transition-duration: 75ms;\n    transition-duration: 75ms;\n    opacity: 0.12; }\n  .mdc-ripple-surface--accent.mdc-ripple-upgraded {\n    --mdc-ripple-fg-opacity: 0.12; }\n\n.mdc-menu-surface {\n  display: none;\n  position: absolute;\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box;\n  max-width: calc(100vw - 2rem);\n  max-height: calc(100vh - 2rem);\n  margin: 0;\n  padding: 0;\n  -webkit-transform: scale(1);\n  transform: scale(1);\n  -webkit-transform-origin: top left;\n  transform-origin: top left;\n  opacity: 0;\n  overflow: auto;\n  will-change: transform, opacity;\n  z-index: 8;\n  -webkit-transition: opacity 0.03s linear, -webkit-transform 0.12s cubic-bezier(0, 0, 0.2, 1);\n  transition: opacity 0.03s linear, -webkit-transform 0.12s cubic-bezier(0, 0, 0.2, 1);\n  transition: opacity 0.03s linear, transform 0.12s cubic-bezier(0, 0, 0.2, 1);\n  transition: opacity 0.03s linear, transform 0.12s cubic-bezier(0, 0, 0.2, 1), -webkit-transform 0.12s cubic-bezier(0, 0, 0.2, 1);\n  -webkit-box-shadow: 0rem 0.3125rem 0.3125rem -0.1875rem rgba(0, 0, 0, 0.2), 0rem 0.5rem 0.625rem 0.0625rem rgba(0, 0, 0, 0.14), 0rem 0.1875rem 0.875rem 0.125rem rgba(0, 0, 0, 0.12);\n  box-shadow: 0rem 0.3125rem 0.3125rem -0.1875rem rgba(0, 0, 0, 0.2), 0rem 0.5rem 0.625rem 0.0625rem rgba(0, 0, 0, 0.14), 0rem 0.1875rem 0.875rem 0.125rem rgba(0, 0, 0, 0.12);\n  background-color: #fff;\n  /* \@alternate */\n  background-color: var(--mdc-theme-surface, #fff);\n  color: #000;\n  /* \@alternate */\n  color: var(--mdc-theme-on-surface, #000);\n  border-radius: 0.25rem;\n  /* \@noflip */\n  transform-origin-left: top left;\n  /* \@noflip */\n  transform-origin-right: top right; }\n  .mdc-menu-surface:focus {\n    outline: none; }\n  .mdc-menu-surface--open {\n    display: inline-block;\n    -webkit-transform: scale(1);\n    transform: scale(1);\n    opacity: 1; }\n  .mdc-menu-surface--animating-open {\n    display: inline-block;\n    -webkit-transform: scale(0.8);\n    transform: scale(0.8);\n    opacity: 0; }\n  .mdc-menu-surface--animating-closed {\n    display: inline-block;\n    opacity: 0;\n    -webkit-transition: opacity 0.075s linear;\n    transition: opacity 0.075s linear; }\n  [dir=\"rtl\"] .mdc-menu-surface, .mdc-menu-surface[dir=\"rtl\"] {\n    /* \@noflip */\n    transform-origin-left: top right;\n    /* \@noflip */\n    transform-origin-right: top left; }\n\n.mdc-menu-surface--anchor {\n  position: relative;\n  overflow: visible; }\n\n.mdc-menu-surface--fixed {\n  position: fixed; }\n\n:host([hidden]) {\n  display: none; }\n\n.limel-select__selected-text {\n  padding: 1.25rem 3.25rem 0.25rem 1rem;\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box;\n  border: none;\n  border-bottom: 0.0625rem solid;\n  outline: none;\n  background-color: transparent;\n  white-space: nowrap;\n  border-bottom-color: rgba(0, 0, 0, 0.42); }\n\n.mdc-select {\n  width: 100%; }\n  .mdc-select:hover::before {\n    opacity: 0; }\n  .mdc-select:not(.mdc-ripple-upgraded):focus::before, .mdc-select:not(.mdc-ripple-upgraded):focus-within::before, .mdc-select.mdc-ripple-upgraded--background-focused::before {\n    -webkit-transition-duration: 75ms;\n    transition-duration: 75ms;\n    opacity: 0; }\n  .mdc-select__native-control {\n    padding-top: 1.5625rem;\n    padding-bottom: 0.125rem;\n    color: transparent !important; }\n  .mdc-select .limel-select__selected-text {\n    width: 100%;\n    height: 3.5rem;\n    position: absolute;\n    z-index: -1; }\n\n.limel-select,\n.limel-select .limel-select-trigger,\n.limel-select .limel-select__selected-text {\n  width: 100%;\n  height: 3.5rem;\n  position: relative; }\n\n.limel-select .limel-select__selected-text {\n  line-height: 1.75rem; }\n\n.limel-select .limel-select-trigger {\n  display: -ms-inline-flexbox;\n  display: inline-flex;\n  cursor: pointer; }\n  .limel-select .limel-select-trigger:focus {\n    outline: none; }\n    .limel-select .limel-select-trigger:focus .mdc-floating-label {\n      color: var(--mdc-theme-primary); }\n    .limel-select .limel-select-trigger:focus .mdc-line-ripple {\n      -webkit-transform: scaleX(1);\n      transform: scaleX(1);\n      opacity: 1;\n      background-color: var(--mdc-theme-primary); }\n    .limel-select .limel-select-trigger:focus .mdc-select__dropdown-icon {\n      -webkit-transform: rotate(180deg) translateY(-0.3125rem);\n      transform: rotate(180deg) translateY(-0.3125rem);\n      color: var(--mdc-theme-primary); }\n  .limel-select .limel-select-trigger .mdc-floating-label {\n    left: 1rem;\n    right: auto;\n    top: 1.3125rem;\n    pointer-events: none; }\n    .limel-select .limel-select-trigger .mdc-floating-label.mdc-floating-label--float-above {\n      top: 1.0625rem; }\n    .limel-select .limel-select-trigger .mdc-floating-label.mdc-floating-label--active {\n      color: var(--mdc-theme-primary); }\n  .limel-select .limel-select-trigger .mdc-line-ripple {\n    background-color: var(--mdc-theme-primary); }\n  .limel-select .limel-select-trigger .mdc-select__dropdown-icon {\n    background: url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='10' height='5' viewBox='7 10 10 5' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' opacity='.54' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E\") no-repeat 50%; }\n\n.limel-select.limel-select--required .mdc-floating-label::after {\n  content: \"*\"; }\n\n.limel-select.limel-select--invalid .limel-select-trigger .mdc-floating-label {\n  color: #b00020; }\n\n.limel-select.limel-select--invalid .limel-select-trigger .mdc-line-ripple {\n  background-color: #b00020;\n  -webkit-transform: scaleX(1);\n  transform: scaleX(1);\n  opacity: 1; }\n\n.limel-select .mdc-menu-surface {\n  left: 0;\n  top: 3.5rem;\n  width: 100%; }\n\n.limel-select .mdc-menu-surface--scrim {\n  position: fixed;\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0; }"; }
}

export { Checkbox as LimelCheckbox, Dialog as LimelDialog, Select as LimelSelect };
