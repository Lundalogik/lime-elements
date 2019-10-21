import { h, r as registerInstance, d as createEvent, c as getElement } from './core-804afdbc.js';
import { E as ENTER, a as ENTER_KEY_CODE, S as SPACE, h as SPACE_KEY_CODE } from './keycodes-ab559a88.js';
import { _ as __extends, a as __assign } from './tslib.es6-f504def8.js';
import { M as MDCFoundation, a as MDCComponent } from './component-67e7368b.js';
import './index-0dd051fb.js';
import { s as strings$3, C as Corner } from './index-15e9b129.js';
import './index-b74dba6c.js';
import { M as MDCMenu, s as strings$4 } from './index-22473e65.js';
import { a as MDCFloatingLabel, M as MDCLineRipple, b as MDCNotchedOutline } from './index-353004cc.js';
import { M as MDCRipple, a as MDCRippleFoundation } from './component-d9fd1f66.js';
import { c as createRandomString } from './random-string-60cd3186.js';
import './index-0304a92a.js';
import { b as isArray, c as isMobileDevice } from './lodash-7ee849da.js';

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
    DISABLED: 'mdc-select--disabled',
    FOCUSED: 'mdc-select--focused',
    INVALID: 'mdc-select--invalid',
    OUTLINED: 'mdc-select--outlined',
    REQUIRED: 'mdc-select--required',
    ROOT: 'mdc-select',
    SELECTED_ITEM_CLASS: 'mdc-list-item--selected',
    WITH_LEADING_ICON: 'mdc-select--with-leading-icon',
};
var strings = {
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
    SELECTED_ITEM_SELECTOR: "." + cssClasses.SELECTED_ITEM_CLASS,
    SELECTED_TEXT_SELECTOR: '.mdc-select__selected-text',
};
var numbers = {
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
            return cssClasses;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCSelectFoundation, "numbers", {
        get: function () {
            return numbers;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCSelectFoundation, "strings", {
        get: function () {
            return strings;
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
            this.adapter_.addClass(cssClasses.DISABLED);
        }
        else {
            this.adapter_.removeClass(cssClasses.DISABLED);
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
        var isRequired = this.adapter_.hasClass(cssClasses.REQUIRED);
        this.notchOutline(optionHasValue);
        if (!this.adapter_.hasClass(cssClasses.FOCUSED)) {
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
        this.adapter_.addClass(cssClasses.FOCUSED);
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
        this.adapter_.removeClass(cssClasses.FOCUSED);
        this.handleChange(false);
        this.adapter_.deactivateBottomLine();
        var isRequired = this.adapter_.hasClass(cssClasses.REQUIRED);
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
        if (this.adapter_.hasClass(cssClasses.FOCUSED) && (isEnter || isSpace || arrowUp || arrowDown)) {
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
        var isFocused = this.adapter_.hasClass(cssClasses.FOCUSED);
        if (openNotch) {
            var labelScale = numbers.LABEL_SCALE;
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
var strings$1 = {
    ARIA_HIDDEN: 'aria-hidden',
    ROLE: 'role',
};
var cssClasses$1 = {
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
            return cssClasses$1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCSelectHelperTextFoundation, "strings", {
        get: function () {
            return strings$1;
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
            this.adapter_.addClass(cssClasses$1.HELPER_TEXT_PERSISTENT);
        }
        else {
            this.adapter_.removeClass(cssClasses$1.HELPER_TEXT_PERSISTENT);
        }
    };
    /**
     * @param isValidation True to make the helper text act as an error validation message.
     */
    MDCSelectHelperTextFoundation.prototype.setValidation = function (isValidation) {
        if (isValidation) {
            this.adapter_.addClass(cssClasses$1.HELPER_TEXT_VALIDATION_MSG);
        }
        else {
            this.adapter_.removeClass(cssClasses$1.HELPER_TEXT_VALIDATION_MSG);
        }
    };
    /**
     * Makes the helper text visible to screen readers.
     */
    MDCSelectHelperTextFoundation.prototype.showToScreenReader = function () {
        this.adapter_.removeAttr(strings$1.ARIA_HIDDEN);
    };
    /**
     * Sets the validity of the helper text based on the select validity.
     */
    MDCSelectHelperTextFoundation.prototype.setValidity = function (selectIsValid) {
        var helperTextIsPersistent = this.adapter_.hasClass(cssClasses$1.HELPER_TEXT_PERSISTENT);
        var helperTextIsValidationMsg = this.adapter_.hasClass(cssClasses$1.HELPER_TEXT_VALIDATION_MSG);
        var validationMsgNeedsDisplay = helperTextIsValidationMsg && !selectIsValid;
        if (validationMsgNeedsDisplay) {
            this.adapter_.setAttr(strings$1.ROLE, 'alert');
        }
        else {
            this.adapter_.removeAttr(strings$1.ROLE);
        }
        if (!helperTextIsPersistent && !validationMsgNeedsDisplay) {
            this.hide_();
        }
    };
    /**
     * Hides the help text from screen readers.
     */
    MDCSelectHelperTextFoundation.prototype.hide_ = function () {
        this.adapter_.setAttr(strings$1.ARIA_HIDDEN, 'true');
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
var strings$2 = {
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
            return strings$2;
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
            this.adapter_.setAttr('role', strings$2.ICON_ROLE);
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
        this.nativeControl_ = this.root_.querySelector(strings.NATIVE_CONTROL_SELECTOR);
        this.selectedText_ = this.root_.querySelector(strings.SELECTED_TEXT_SELECTOR);
        var targetElement = this.nativeControl_ || this.selectedText_;
        if (!targetElement) {
            throw new Error('MDCSelect: Missing required element: Exactly one of the following selectors must be present: ' +
                ("'" + strings.NATIVE_CONTROL_SELECTOR + "' or '" + strings.SELECTED_TEXT_SELECTOR + "'"));
        }
        this.targetElement_ = targetElement;
        if (this.targetElement_.hasAttribute(strings.ARIA_CONTROLS)) {
            var helperTextElement = document.getElementById(this.targetElement_.getAttribute(strings.ARIA_CONTROLS));
            if (helperTextElement) {
                this.helperText_ = helperTextFactory(helperTextElement);
            }
        }
        if (this.selectedText_) {
            this.enhancedSelectSetup_(menuFactory);
        }
        var labelElement = this.root_.querySelector(strings.LABEL_SELECTOR);
        this.label_ = labelElement ? labelFactory(labelElement) : null;
        var lineRippleElement = this.root_.querySelector(strings.LINE_RIPPLE_SELECTOR);
        this.lineRipple_ = lineRippleElement ? lineRippleFactory(lineRippleElement) : null;
        var outlineElement = this.root_.querySelector(strings.OUTLINE_SELECTOR);
        this.outline_ = outlineElement ? outlineFactory(outlineElement) : null;
        var leadingIcon = this.root_.querySelector(strings.LEADING_ICON_SELECTOR);
        if (leadingIcon) {
            this.root_.classList.add(cssClasses.WITH_LEADING_ICON);
            this.leadingIcon_ = iconFactory(leadingIcon);
            if (this.menuElement_) {
                this.menuElement_.classList.add(cssClasses.WITH_LEADING_ICON);
            }
        }
        if (!this.root_.classList.contains(cssClasses.OUTLINED)) {
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
            this.menu_.listen(strings$3.CLOSED_EVENT, this.handleMenuClosed_);
            this.menu_.listen(strings$3.OPENED_EVENT, this.handleMenuOpened_);
            this.menu_.listen(strings$4.SELECTED_EVENT, this.handleMenuSelected_);
            if (this.hiddenInput_ && this.hiddenInput_.value) {
                // If the hidden input already has a value, use it to restore the select's value.
                // This can happen e.g. if the user goes back or (in some browsers) refreshes the page.
                var enhancedAdapterMethods = this.getEnhancedSelectAdapterMethods_();
                enhancedAdapterMethods.setValue(this.hiddenInput_.value);
            }
            else if (this.menuElement_.querySelector(strings.SELECTED_ITEM_SELECTOR)) {
                // If an element is selected, the select should set the initial selected text.
                var enhancedAdapterMethods = this.getEnhancedSelectAdapterMethods_();
                enhancedAdapterMethods.setValue(enhancedAdapterMethods.getValue());
            }
        }
        // Initially sync floating label
        this.foundation_.handleChange(/* didChange */ false);
        if (this.root_.classList.contains(cssClasses.DISABLED)
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
            this.menu_.unlisten(strings$3.CLOSED_EVENT, this.handleMenuClosed_);
            this.menu_.unlisten(strings$3.OPENED_EVENT, this.handleMenuOpened_);
            this.menu_.unlisten(strings$4.SELECTED_EVENT, this.handleMenuSelected_);
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
                var selectedEl = this.menuElement_.querySelector(strings.SELECTED_ITEM_SELECTOR);
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
            return this.root_.classList.contains(cssClasses.DISABLED) ||
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
        var isDisabled = this.root_.classList.contains(cssClasses.DISABLED);
        this.selectedText_.setAttribute('tabindex', isDisabled ? '-1' : '0');
        this.hiddenInput_ = this.root_.querySelector(strings.HIDDEN_INPUT_SELECTOR);
        this.menuElement_ = this.root_.querySelector(strings.MENU_SELECTOR);
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
                    _this.root_.classList.remove(cssClasses.INVALID);
                }
                else {
                    _this.root_.classList.add(cssClasses.INVALID);
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
                var listItem = _this.menuElement_.querySelector(strings.SELECTED_ITEM_SELECTOR);
                if (listItem && listItem.hasAttribute(strings.ENHANCED_VALUE_ATTR)) {
                    return listItem.getAttribute(strings.ENHANCED_VALUE_ATTR) || '';
                }
                return '';
            },
            setValue: function (value) {
                var element = _this.menuElement_.querySelector("[" + strings.ENHANCED_VALUE_ATTR + "=\"" + value + "\"]");
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
                if (classList.contains(cssClasses.REQUIRED) && !classList.contains(cssClasses.DISABLED)) {
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
                    _this.root_.classList.remove(cssClasses.INVALID);
                }
                else {
                    _this.root_.classList.add(cssClasses.INVALID);
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
                _this.emit(strings.CHANGE_EVENT, { value: value, index: index }, true /* shouldBubble  */);
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
        var previouslySelected = this.menuElement_.querySelector(strings.SELECTED_ITEM_SELECTOR);
        if (previouslySelected) {
            previouslySelected.classList.remove(cssClasses.SELECTED_ITEM_CLASS);
            previouslySelected.removeAttribute(strings.ARIA_SELECTED_ATTR);
        }
        if (selectedItem) {
            selectedItem.classList.add(cssClasses.SELECTED_ITEM_CLASS);
            selectedItem.setAttribute(strings.ARIA_SELECTED_ATTR, 'true');
        }
        // Synchronize hidden input's value with data-value attribute of selected item.
        // This code path is also followed when setting value directly, so this covers all cases.
        if (this.hiddenInput_) {
            this.hiddenInput_.value = selectedItem ? selectedItem.getAttribute(strings.ENHANCED_VALUE_ATTR) || '' : '';
        }
        this.layout();
    };
    MDCSelect.prototype.initialSyncRequiredState_ = function () {
        var isRequired = this.targetElement_.required
            || this.targetElement_.getAttribute('aria-required') === 'true'
            || this.root_.classList.contains(cssClasses.REQUIRED);
        if (isRequired) {
            if (this.nativeControl_) {
                this.nativeControl_.required = true;
            }
            else {
                this.selectedText_.setAttribute('aria-required', 'true');
            }
            this.root_.classList.add(cssClasses.REQUIRED);
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
                        _this.root_.classList.add(cssClasses.REQUIRED);
                    }
                    else {
                        _this.root_.classList.remove(cssClasses.REQUIRED);
                    }
                }
                else {
                    if (_this.nativeControl_.required) {
                        _this.root_.classList.add(cssClasses.REQUIRED);
                    }
                    else {
                        _this.root_.classList.remove(cssClasses.REQUIRED);
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
            ${!hasValue ? 'limel-select--empty' : ''}
        ` },
        h("div", { tabindex: "0", onClick: props.open, class: `
                    limel-select-trigger
                    ${props.isOpen ? 'mdc-select--focused' : ''}
                `, onKeyPress: props.onTriggerPress },
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
        h("limel-portal", { containerId: props.id, visible: props.isOpen },
            h("limel-menu-surface", { open: props.isOpen, onDismiss: props.close },
                h("limel-list", { items: items, type: props.multiple ? 'checkbox' : 'selectable', onChange: props.onChange })))));
};
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

const Select = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
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
        this.handleMenuTriggerKeyPress = this.handleMenuTriggerKeyPress.bind(this);
        this.openMenu = this.openMenu.bind(this);
        this.closeMenu = this.closeMenu.bind(this);
        this.portalId = createRandomString();
        this.change = createEvent(this, "change", 7);
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
    }
    componentDidUpdate() {
        if (this.menuOpen) {
            this.setMenuFocus();
        }
        else {
            this.setTriggerFocus();
        }
    }
    render() {
        if (!this.isMobileDevice) {
            return (h(MenuSelectTemplate, { id: this.portalId, disabled: this.disabled, required: this.required, label: this.label, value: this.value, options: this.options, onChange: this.handleMenuChange, onTriggerPress: this.handleMenuTriggerKeyPress, multiple: this.multiple, isOpen: this.menuOpen, open: this.openMenu, close: this.closeMenu, checkValid: this.checkValid }));
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
    setMenuFocus() {
        setTimeout(() => {
            const list = document.querySelector(`#${this.portalId} limel-menu-surface limel-list`);
            const firstItem = list.shadowRoot.querySelector('[tabindex]');
            firstItem.focus();
        });
    }
    setTriggerFocus() {
        const trigger = this.host.shadowRoot.querySelector('.limel-select-trigger');
        trigger.focus();
    }
    handleMenuChange(event) {
        event.stopPropagation();
        if (isMultiple(event.detail)) {
            const listItems = event.detail;
            const options = listItems.map(item => item.value);
            this.change.emit(options);
            return;
        }
        if (!event.detail.selected) {
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
    handleMenuTriggerKeyPress(event) {
        const isEnter = event.key === ENTER || event.keyCode === ENTER_KEY_CODE;
        const isSpace = event.key === SPACE || event.keyCode === SPACE_KEY_CODE;
        if (!this.menuOpen && (isSpace || isEnter)) {
            event.stopPropagation();
            event.preventDefault();
            this.menuOpen = true;
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
    get host() { return getElement(this); }
    static get watchers() { return {
        "menuOpen": ["watchOpen"]
    }; }
    static get style() { return ":host {\n  --mdc-theme-primary: var(--lime-primary-color, #26a69a);\n  --mdc-theme-secondary: var(--lime-secondary-color, #575756);\n  --mdc-theme-on-primary: var(--lime-on-primary-color, #fff);\n  --mdc-theme-on-secondary: var(--lime-on-secondary-color, #fff);\n}\n\n:root {\n  --mdc-theme-primary: #26a69a;\n  --mdc-theme-secondary: #575756;\n  --mdc-theme-background: #fff;\n  --mdc-theme-surface: #fff;\n  --mdc-theme-error: #b00020;\n  --mdc-theme-on-primary: #fff;\n  --mdc-theme-on-secondary: #fff;\n  --mdc-theme-on-surface: #000;\n  --mdc-theme-on-error: #fff;\n  --mdc-theme-text-primary-on-background: rgba(0, 0, 0, 0.87);\n  --mdc-theme-text-secondary-on-background: rgba(0, 0, 0, 0.54);\n  --mdc-theme-text-hint-on-background: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-disabled-on-background: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-icon-on-background: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-primary-on-light: rgba(0, 0, 0, 0.87);\n  --mdc-theme-text-secondary-on-light: rgba(0, 0, 0, 0.54);\n  --mdc-theme-text-hint-on-light: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-disabled-on-light: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-icon-on-light: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-primary-on-dark: white;\n  --mdc-theme-text-secondary-on-dark: rgba(255, 255, 255, 0.7);\n  --mdc-theme-text-hint-on-dark: rgba(255, 255, 255, 0.5);\n  --mdc-theme-text-disabled-on-dark: rgba(255, 255, 255, 0.5);\n  --mdc-theme-text-icon-on-dark: rgba(255, 255, 255, 0.5);\n}\n\n.mdc-theme--primary {\n  color: #26a69a !important;\n  /* \@alternate */\n  color: var(--mdc-theme-primary, #26a69a) !important;\n}\n\n.mdc-theme--secondary {\n  color: #575756 !important;\n  /* \@alternate */\n  color: var(--mdc-theme-secondary, #575756) !important;\n}\n\n.mdc-theme--background {\n  background-color: #fff;\n  /* \@alternate */\n  background-color: var(--mdc-theme-background, #fff);\n}\n\n.mdc-theme--surface {\n  background-color: #fff;\n  /* \@alternate */\n  background-color: var(--mdc-theme-surface, #fff);\n}\n\n.mdc-theme--error {\n  color: #b00020 !important;\n  /* \@alternate */\n  color: var(--mdc-theme-error, #b00020) !important;\n}\n\n.mdc-theme--on-primary {\n  color: #fff !important;\n  /* \@alternate */\n  color: var(--mdc-theme-on-primary, #fff) !important;\n}\n\n.mdc-theme--on-secondary {\n  color: #fff !important;\n  /* \@alternate */\n  color: var(--mdc-theme-on-secondary, #fff) !important;\n}\n\n.mdc-theme--on-surface {\n  color: #000 !important;\n  /* \@alternate */\n  color: var(--mdc-theme-on-surface, #000) !important;\n}\n\n.mdc-theme--on-error {\n  color: #fff !important;\n  /* \@alternate */\n  color: var(--mdc-theme-on-error, #fff) !important;\n}\n\n.mdc-theme--text-primary-on-background {\n  color: rgba(0, 0, 0, 0.87) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-primary-on-background, rgba(0, 0, 0, 0.87)) !important;\n}\n\n.mdc-theme--text-secondary-on-background {\n  color: rgba(0, 0, 0, 0.54) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-secondary-on-background, rgba(0, 0, 0, 0.54)) !important;\n}\n\n.mdc-theme--text-hint-on-background {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.38)) !important;\n}\n\n.mdc-theme--text-disabled-on-background {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-disabled-on-background, rgba(0, 0, 0, 0.38)) !important;\n}\n\n.mdc-theme--text-icon-on-background {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-icon-on-background, rgba(0, 0, 0, 0.38)) !important;\n}\n\n.mdc-theme--text-primary-on-light {\n  color: rgba(0, 0, 0, 0.87) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-primary-on-light, rgba(0, 0, 0, 0.87)) !important;\n}\n\n.mdc-theme--text-secondary-on-light {\n  color: rgba(0, 0, 0, 0.54) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-secondary-on-light, rgba(0, 0, 0, 0.54)) !important;\n}\n\n.mdc-theme--text-hint-on-light {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-hint-on-light, rgba(0, 0, 0, 0.38)) !important;\n}\n\n.mdc-theme--text-disabled-on-light {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-disabled-on-light, rgba(0, 0, 0, 0.38)) !important;\n}\n\n.mdc-theme--text-icon-on-light {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-icon-on-light, rgba(0, 0, 0, 0.38)) !important;\n}\n\n.mdc-theme--text-primary-on-dark {\n  color: white !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-primary-on-dark, white) !important;\n}\n\n.mdc-theme--text-secondary-on-dark {\n  color: rgba(255, 255, 255, 0.7) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-secondary-on-dark, rgba(255, 255, 255, 0.7)) !important;\n}\n\n.mdc-theme--text-hint-on-dark {\n  color: rgba(255, 255, 255, 0.5) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-hint-on-dark, rgba(255, 255, 255, 0.5)) !important;\n}\n\n.mdc-theme--text-disabled-on-dark {\n  color: rgba(255, 255, 255, 0.5) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-disabled-on-dark, rgba(255, 255, 255, 0.5)) !important;\n}\n\n.mdc-theme--text-icon-on-dark {\n  color: rgba(255, 255, 255, 0.5) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-icon-on-dark, rgba(255, 255, 255, 0.5)) !important;\n}\n\n.mdc-theme--primary-bg {\n  background-color: #26a69a !important;\n  /* \@alternate */\n  background-color: var(--mdc-theme-primary, #26a69a) !important;\n}\n\n.mdc-theme--secondary-bg {\n  background-color: #575756 !important;\n  /* \@alternate */\n  background-color: var(--mdc-theme-secondary, #575756) !important;\n}\n\n.mdc-typography {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n}\n\n.mdc-typography--headline1 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1rem;\n  line-height: 0.875rem;\n  font-weight: 300;\n  letter-spacing: -0.015625em;\n  text-decoration: inherit;\n  text-transform: inherit;\n}\n\n.mdc-typography--headline2 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1rem;\n  line-height: 0.875rem;\n  font-weight: 300;\n  letter-spacing: -0.0083333333em;\n  text-decoration: inherit;\n  text-transform: inherit;\n}\n\n.mdc-typography--headline3 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1rem;\n  line-height: 0.875rem;\n  font-weight: 400;\n  letter-spacing: normal;\n  text-decoration: inherit;\n  text-transform: inherit;\n}\n\n.mdc-typography--headline4 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1rem;\n  line-height: 0.875rem;\n  font-weight: 400;\n  letter-spacing: 0.0073529412em;\n  text-decoration: inherit;\n  text-transform: inherit;\n}\n\n.mdc-typography--headline5 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.875rem;\n  line-height: 0.875rem;\n  font-weight: 400;\n  letter-spacing: normal;\n  text-decoration: inherit;\n  text-transform: inherit;\n}\n\n.mdc-typography--headline6 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.875rem;\n  line-height: 0.875rem;\n  font-weight: 500;\n  letter-spacing: 0.0125em;\n  text-decoration: inherit;\n  text-transform: inherit;\n}\n\n.mdc-typography--subtitle1 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.875rem;\n  line-height: 1.125rem;\n  font-weight: 400;\n  letter-spacing: 0.009375em;\n  text-decoration: inherit;\n  text-transform: inherit;\n}\n\n.mdc-typography--subtitle2 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.8125rem;\n  line-height: 1.125rem;\n  font-weight: 500;\n  letter-spacing: 0.0071428571em;\n  text-decoration: inherit;\n  text-transform: inherit;\n}\n\n.mdc-typography--body1 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.8125rem;\n  line-height: 1.5rem;\n  font-weight: 400;\n  letter-spacing: 0.03125em;\n  text-decoration: inherit;\n  text-transform: inherit;\n}\n\n.mdc-typography--body2 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.8125rem;\n  line-height: 1.625rem;\n  font-weight: 400;\n  letter-spacing: 0.0178571429em;\n  text-decoration: inherit;\n  text-transform: inherit;\n}\n\n.mdc-typography--caption {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.6875rem;\n  line-height: 0.875rem;\n  font-weight: 400;\n  letter-spacing: 0.0333333333em;\n  text-decoration: inherit;\n  text-transform: inherit;\n}\n\n.mdc-typography--button {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.875rem;\n  line-height: 2.25rem;\n  font-weight: 500;\n  letter-spacing: 0.0892857143em;\n  text-decoration: none;\n  text-transform: none;\n}\n\n.mdc-typography--overline {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.6875rem;\n  line-height: 0.875rem;\n  font-weight: 500;\n  letter-spacing: 0.1666666667em;\n  text-decoration: none;\n  text-transform: uppercase;\n}\n\n\@-webkit-keyframes mdc-select-float-native-control {\n  0% {\n    -webkit-transform: translateY(0.5rem);\n    transform: translateY(0.5rem);\n    opacity: 0;\n  }\n  100% {\n    -webkit-transform: translateY(0);\n    transform: translateY(0);\n    opacity: 1;\n  }\n}\n\n\@keyframes mdc-select-float-native-control {\n  0% {\n    -webkit-transform: translateY(0.5rem);\n    transform: translateY(0.5rem);\n    opacity: 0;\n  }\n  100% {\n    -webkit-transform: translateY(0);\n    transform: translateY(0);\n    opacity: 1;\n  }\n}\n.mdc-line-ripple {\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  height: 0.125rem;\n  -webkit-transform: scaleX(0);\n  transform: scaleX(0);\n  -webkit-transition: opacity 180ms cubic-bezier(0.4, 0, 0.2, 1), -webkit-transform 180ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: opacity 180ms cubic-bezier(0.4, 0, 0.2, 1), -webkit-transform 180ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: transform 180ms cubic-bezier(0.4, 0, 0.2, 1), opacity 180ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: transform 180ms cubic-bezier(0.4, 0, 0.2, 1), opacity 180ms cubic-bezier(0.4, 0, 0.2, 1), -webkit-transform 180ms cubic-bezier(0.4, 0, 0.2, 1);\n  opacity: 0;\n  z-index: 2;\n}\n\n.mdc-line-ripple--active {\n  -webkit-transform: scaleX(1);\n  transform: scaleX(1);\n  opacity: 1;\n}\n\n.mdc-line-ripple--deactivating {\n  opacity: 0;\n}\n\n.mdc-notched-outline {\n  display: -ms-flexbox;\n  display: flex;\n  position: absolute;\n  right: 0;\n  left: 0;\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box;\n  width: 100%;\n  max-width: 100%;\n  height: 100%;\n  /* \@noflip */\n  text-align: left;\n  pointer-events: none;\n}\n[dir=rtl] .mdc-notched-outline, .mdc-notched-outline[dir=rtl] {\n  /* \@noflip */\n  text-align: right;\n}\n.mdc-notched-outline__leading, .mdc-notched-outline__notch, .mdc-notched-outline__trailing {\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box;\n  height: 100%;\n  -webkit-transition: border 150ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: border 150ms cubic-bezier(0.4, 0, 0.2, 1);\n  border-top: 0.0625rem solid;\n  border-bottom: 0.0625rem solid;\n  pointer-events: none;\n}\n.mdc-notched-outline__leading {\n  /* \@noflip */\n  border-left: 0.0625rem solid;\n  /* \@noflip */\n  border-right: none;\n  width: 0.75rem;\n}\n[dir=rtl] .mdc-notched-outline__leading, .mdc-notched-outline__leading[dir=rtl] {\n  /* \@noflip */\n  border-left: none;\n  /* \@noflip */\n  border-right: 0.0625rem solid;\n}\n.mdc-notched-outline__trailing {\n  /* \@noflip */\n  border-left: none;\n  /* \@noflip */\n  border-right: 0.0625rem solid;\n  -ms-flex-positive: 1;\n  flex-grow: 1;\n}\n[dir=rtl] .mdc-notched-outline__trailing, .mdc-notched-outline__trailing[dir=rtl] {\n  /* \@noflip */\n  border-left: 0.0625rem solid;\n  /* \@noflip */\n  border-right: none;\n}\n.mdc-notched-outline__notch {\n  -ms-flex: 0 0 auto;\n  flex: 0 0 auto;\n  width: auto;\n  max-width: calc(100% - 0.75rem * 2);\n}\n.mdc-notched-outline .mdc-floating-label {\n  display: inline-block;\n  position: relative;\n  top: 1.0625rem;\n  bottom: auto;\n  max-width: 100%;\n}\n.mdc-notched-outline .mdc-floating-label--float-above {\n  text-overflow: clip;\n}\n.mdc-notched-outline--upgraded .mdc-floating-label--float-above {\n  max-width: calc(100% / .75);\n}\n\n.mdc-notched-outline--notched .mdc-notched-outline__notch {\n  /* \@noflip */\n  padding-left: 0;\n  /* \@noflip */\n  padding-right: 0.5rem;\n  border-top: none;\n}\n[dir=rtl] .mdc-notched-outline--notched .mdc-notched-outline__notch, .mdc-notched-outline--notched .mdc-notched-outline__notch[dir=rtl] {\n  /* \@noflip */\n  padding-left: 0.5rem;\n  /* \@noflip */\n  padding-right: 0;\n}\n\n.mdc-notched-outline--no-label .mdc-notched-outline__notch {\n  padding: 0;\n}\n\n.mdc-floating-label {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.875rem;\n  line-height: 1.125rem;\n  font-weight: 400;\n  letter-spacing: 0.009375em;\n  text-decoration: inherit;\n  text-transform: inherit;\n  position: absolute;\n  /* \@noflip */\n  left: 0;\n  /* \@noflip */\n  -webkit-transform-origin: left top;\n  transform-origin: left top;\n  -webkit-transition: color 150ms cubic-bezier(0.4, 0, 0.2, 1), -webkit-transform 150ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: color 150ms cubic-bezier(0.4, 0, 0.2, 1), -webkit-transform 150ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1), color 150ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1), color 150ms cubic-bezier(0.4, 0, 0.2, 1), -webkit-transform 150ms cubic-bezier(0.4, 0, 0.2, 1);\n  /* \@alternate */\n  line-height: 1.15rem;\n  text-align: left;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  cursor: text;\n  overflow: hidden;\n  will-change: transform;\n}\n[dir=rtl] .mdc-floating-label, .mdc-floating-label[dir=rtl] {\n  /* \@noflip */\n  right: 0;\n  /* \@noflip */\n  left: auto;\n  /* \@noflip */\n  -webkit-transform-origin: right top;\n  transform-origin: right top;\n  /* \@noflip */\n  text-align: right;\n}\n\n.mdc-floating-label--float-above {\n  cursor: auto;\n}\n\n.mdc-floating-label--float-above {\n  -webkit-transform: translateY(-50%) scale(0.75);\n  transform: translateY(-50%) scale(0.75);\n}\n\n.mdc-floating-label--shake {\n  -webkit-animation: mdc-floating-label-shake-float-above-standard 250ms 1;\n  animation: mdc-floating-label-shake-float-above-standard 250ms 1;\n}\n\n\@-webkit-keyframes mdc-floating-label-shake-float-above-standard {\n  0% {\n    -webkit-transform: translateX(calc(0 - 0%)) translateY(-50%) scale(0.75);\n    transform: translateX(calc(0 - 0%)) translateY(-50%) scale(0.75);\n  }\n  33% {\n    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.701732, 0.495819);\n    animation-timing-function: cubic-bezier(0.5, 0, 0.701732, 0.495819);\n    -webkit-transform: translateX(calc(4% - 0%)) translateY(-50%) scale(0.75);\n    transform: translateX(calc(4% - 0%)) translateY(-50%) scale(0.75);\n  }\n  66% {\n    -webkit-animation-timing-function: cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);\n    animation-timing-function: cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);\n    -webkit-transform: translateX(calc(-4% - 0%)) translateY(-50%) scale(0.75);\n    transform: translateX(calc(-4% - 0%)) translateY(-50%) scale(0.75);\n  }\n  100% {\n    -webkit-transform: translateX(calc(0 - 0%)) translateY(-50%) scale(0.75);\n    transform: translateX(calc(0 - 0%)) translateY(-50%) scale(0.75);\n  }\n}\n\n\@keyframes mdc-floating-label-shake-float-above-standard {\n  0% {\n    -webkit-transform: translateX(calc(0 - 0%)) translateY(-50%) scale(0.75);\n    transform: translateX(calc(0 - 0%)) translateY(-50%) scale(0.75);\n  }\n  33% {\n    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.701732, 0.495819);\n    animation-timing-function: cubic-bezier(0.5, 0, 0.701732, 0.495819);\n    -webkit-transform: translateX(calc(4% - 0%)) translateY(-50%) scale(0.75);\n    transform: translateX(calc(4% - 0%)) translateY(-50%) scale(0.75);\n  }\n  66% {\n    -webkit-animation-timing-function: cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);\n    animation-timing-function: cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);\n    -webkit-transform: translateX(calc(-4% - 0%)) translateY(-50%) scale(0.75);\n    transform: translateX(calc(-4% - 0%)) translateY(-50%) scale(0.75);\n  }\n  100% {\n    -webkit-transform: translateX(calc(0 - 0%)) translateY(-50%) scale(0.75);\n    transform: translateX(calc(0 - 0%)) translateY(-50%) scale(0.75);\n  }\n}\n\@-webkit-keyframes mdc-ripple-fg-radius-in {\n  from {\n    -webkit-animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n    -webkit-transform: translate(var(--mdc-ripple-fg-translate-start, 0)) scale(1);\n    transform: translate(var(--mdc-ripple-fg-translate-start, 0)) scale(1);\n  }\n  to {\n    -webkit-transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1));\n    transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1));\n  }\n}\n\@keyframes mdc-ripple-fg-radius-in {\n  from {\n    -webkit-animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n    -webkit-transform: translate(var(--mdc-ripple-fg-translate-start, 0)) scale(1);\n    transform: translate(var(--mdc-ripple-fg-translate-start, 0)) scale(1);\n  }\n  to {\n    -webkit-transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1));\n    transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1));\n  }\n}\n\@-webkit-keyframes mdc-ripple-fg-opacity-in {\n  from {\n    -webkit-animation-timing-function: linear;\n    animation-timing-function: linear;\n    opacity: 0;\n  }\n  to {\n    opacity: var(--mdc-ripple-fg-opacity, 0);\n  }\n}\n\@keyframes mdc-ripple-fg-opacity-in {\n  from {\n    -webkit-animation-timing-function: linear;\n    animation-timing-function: linear;\n    opacity: 0;\n  }\n  to {\n    opacity: var(--mdc-ripple-fg-opacity, 0);\n  }\n}\n\@-webkit-keyframes mdc-ripple-fg-opacity-out {\n  from {\n    -webkit-animation-timing-function: linear;\n    animation-timing-function: linear;\n    opacity: var(--mdc-ripple-fg-opacity, 0);\n  }\n  to {\n    opacity: 0;\n  }\n}\n\@keyframes mdc-ripple-fg-opacity-out {\n  from {\n    -webkit-animation-timing-function: linear;\n    animation-timing-function: linear;\n    opacity: var(--mdc-ripple-fg-opacity, 0);\n  }\n  to {\n    opacity: 0;\n  }\n}\n.mdc-ripple-surface--test-edge-var-bug {\n  --mdc-ripple-surface-test-edge-var: 0.0625rem solid #000;\n  visibility: hidden;\n}\n.mdc-ripple-surface--test-edge-var-bug::before {\n  border: var(--mdc-ripple-surface-test-edge-var);\n}\n\n.mdc-select--with-leading-icon:not(.mdc-select--disabled) .mdc-select__icon {\n  color: #000;\n  /* \@alternate */\n  color: var(--mdc-theme-on-surface, #000);\n}\n.mdc-select--with-leading-icon .mdc-select__icon {\n  display: inline-block;\n  position: absolute;\n  bottom: 1rem;\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box;\n  width: 1.5rem;\n  height: 1.5rem;\n  border: none;\n  background-color: transparent;\n  fill: currentColor;\n  opacity: 0.54;\n  text-decoration: none;\n  cursor: pointer;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n\n.mdc-select__icon:not([tabindex]),\n.mdc-select__icon[tabindex=\"-1\"] {\n  cursor: default;\n  pointer-events: none;\n}\n\n.mdc-select-helper-text {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.6875rem;\n  line-height: 0.875rem;\n  font-weight: 400;\n  letter-spacing: 0.0333333333em;\n  text-decoration: inherit;\n  text-transform: inherit;\n  display: block;\n  margin-top: 0;\n  /* \@alternate */\n  line-height: normal;\n  margin: 0;\n  -webkit-transition: opacity 180ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: opacity 180ms cubic-bezier(0.4, 0, 0.2, 1);\n  opacity: 0;\n  will-change: opacity;\n}\n.mdc-select-helper-text::before {\n  display: inline-block;\n  width: 0;\n  height: 1rem;\n  content: \"\";\n  vertical-align: 0;\n}\n\n.mdc-select-helper-text--persistent {\n  -webkit-transition: none;\n  transition: none;\n  opacity: 1;\n  will-change: initial;\n}\n\n.mdc-select {\n  --mdc-ripple-fg-size: 0;\n  --mdc-ripple-left: 0;\n  --mdc-ripple-top: 0;\n  --mdc-ripple-fg-scale: 1;\n  --mdc-ripple-fg-translate-end: 0;\n  --mdc-ripple-fg-translate-start: 0;\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n  display: -ms-inline-flexbox;\n  display: inline-flex;\n  position: relative;\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box;\n  height: 3.5rem;\n  overflow: hidden;\n  /* \@alternate */\n  will-change: opacity, transform, color;\n}\n.mdc-select:not(.mdc-select--disabled) {\n  background-color: #fff;\n}\n.mdc-select::before, .mdc-select::after {\n  position: absolute;\n  border-radius: 50%;\n  opacity: 0;\n  pointer-events: none;\n  content: \"\";\n}\n.mdc-select::before {\n  -webkit-transition: opacity 15ms linear, background-color 15ms linear;\n  transition: opacity 15ms linear, background-color 15ms linear;\n  z-index: 1;\n}\n.mdc-select.mdc-ripple-upgraded::before {\n  -webkit-transform: scale(var(--mdc-ripple-fg-scale, 1));\n  transform: scale(var(--mdc-ripple-fg-scale, 1));\n}\n.mdc-select.mdc-ripple-upgraded::after {\n  top: 0;\n  /* \@noflip */\n  left: 0;\n  -webkit-transform: scale(0);\n  transform: scale(0);\n  -webkit-transform-origin: center center;\n  transform-origin: center center;\n}\n.mdc-select.mdc-ripple-upgraded--unbounded::after {\n  top: var(--mdc-ripple-top, 0);\n  /* \@noflip */\n  left: var(--mdc-ripple-left, 0);\n}\n.mdc-select.mdc-ripple-upgraded--foreground-activation::after {\n  -webkit-animation: mdc-ripple-fg-radius-in 225ms forwards, mdc-ripple-fg-opacity-in 75ms forwards;\n  animation: mdc-ripple-fg-radius-in 225ms forwards, mdc-ripple-fg-opacity-in 75ms forwards;\n}\n.mdc-select.mdc-ripple-upgraded--foreground-deactivation::after {\n  -webkit-animation: mdc-ripple-fg-opacity-out 150ms;\n  animation: mdc-ripple-fg-opacity-out 150ms;\n  -webkit-transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1));\n  transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1));\n}\n.mdc-select::before, .mdc-select::after {\n  top: calc(50% - 100%);\n  /* \@noflip */\n  left: calc(50% - 100%);\n  width: 200%;\n  height: 200%;\n}\n.mdc-select.mdc-ripple-upgraded::after {\n  width: var(--mdc-ripple-fg-size, 100%);\n  height: var(--mdc-ripple-fg-size, 100%);\n}\n.mdc-select::before, .mdc-select::after {\n  background-color: rgba(0, 0, 0, 0.87);\n}\n.mdc-select:hover::before {\n  opacity: 0.04;\n}\n.mdc-select:not(.mdc-ripple-upgraded):focus::before, .mdc-select.mdc-ripple-upgraded--background-focused::before {\n  -webkit-transition-duration: 75ms;\n  transition-duration: 75ms;\n  opacity: 0.12;\n}\n.mdc-select:not(.mdc-select--disabled) .mdc-select__native-control,\n.mdc-select:not(.mdc-select--disabled) .mdc-select__selected-text {\n  color: rgba(0, 0, 0, 0.87);\n}\n.mdc-select:not(.mdc-select--disabled) .mdc-floating-label {\n  color: rgba(0, 0, 0, 0.6);\n}\n.mdc-select:not(.mdc-select--disabled) .mdc-select__native-control,\n.mdc-select:not(.mdc-select--disabled) .mdc-select__selected-text {\n  border-bottom-color: rgba(0, 0, 0, 0.12);\n}\n.mdc-select:not(.mdc-select--disabled) + .mdc-select-helper-text {\n  color: rgba(0, 0, 0, 0.6);\n}\n.mdc-select, .mdc-select__native-control {\n  border-radius: 0.25rem 0.25rem 0 0;\n}\n.mdc-select:not(.mdc-select--disabled).mdc-select--focused .mdc-line-ripple {\n  background-color: #26a69a;\n  /* \@alternate */\n  background-color: var(--mdc-theme-primary, #26a69a);\n}\n.mdc-select:not(.mdc-select--disabled).mdc-select--focused .mdc-floating-label {\n  color: rgba(38, 166, 154, 0.87);\n}\n.mdc-select:not(.mdc-select--disabled) .mdc-select__native-control:hover {\n  border-bottom-color: rgba(0, 0, 0, 0.12);\n}\n.mdc-select .mdc-floating-label--float-above {\n  -webkit-transform: translateY(-70%) scale(0.75);\n  transform: translateY(-70%) scale(0.75);\n}\n.mdc-select .mdc-floating-label {\n  /* \@noflip */\n  left: 1rem;\n  /* \@noflip */\n  right: initial;\n  top: 1.3125rem;\n  pointer-events: none;\n}\n[dir=rtl] .mdc-select .mdc-floating-label, .mdc-select .mdc-floating-label[dir=rtl] {\n  /* \@noflip */\n  left: initial;\n  /* \@noflip */\n  right: 1rem;\n}\n.mdc-select.mdc-select--with-leading-icon .mdc-floating-label {\n  /* \@noflip */\n  left: 3rem;\n  /* \@noflip */\n  right: initial;\n}\n[dir=rtl] .mdc-select.mdc-select--with-leading-icon .mdc-floating-label, .mdc-select.mdc-select--with-leading-icon .mdc-floating-label[dir=rtl] {\n  /* \@noflip */\n  left: initial;\n  /* \@noflip */\n  right: 3rem;\n}\n.mdc-select.mdc-select--outlined .mdc-floating-label {\n  /* \@noflip */\n  left: 0.25rem;\n  /* \@noflip */\n  right: initial;\n  top: 1.0625rem;\n}\n[dir=rtl] .mdc-select.mdc-select--outlined .mdc-floating-label, .mdc-select.mdc-select--outlined .mdc-floating-label[dir=rtl] {\n  /* \@noflip */\n  left: initial;\n  /* \@noflip */\n  right: 0.25rem;\n}\n.mdc-select.mdc-select--outlined.mdc-select--with-leading-icon .mdc-floating-label {\n  /* \@noflip */\n  left: 2.25rem;\n  /* \@noflip */\n  right: initial;\n}\n[dir=rtl] .mdc-select.mdc-select--outlined.mdc-select--with-leading-icon .mdc-floating-label, .mdc-select.mdc-select--outlined.mdc-select--with-leading-icon .mdc-floating-label[dir=rtl] {\n  /* \@noflip */\n  left: initial;\n  /* \@noflip */\n  right: 2.25rem;\n}\n.mdc-select.mdc-select--outlined.mdc-select--with-leading-icon .mdc-floating-label--float-above {\n  /* \@noflip */\n  left: 2.25rem;\n  /* \@noflip */\n  right: initial;\n}\n[dir=rtl] .mdc-select.mdc-select--outlined.mdc-select--with-leading-icon .mdc-floating-label--float-above, .mdc-select.mdc-select--outlined.mdc-select--with-leading-icon .mdc-floating-label--float-above[dir=rtl] {\n  /* \@noflip */\n  left: initial;\n  /* \@noflip */\n  right: 2.25rem;\n}\n.mdc-select__dropdown-icon {\n  background: url(\"data:image/svg+xml,%3Csvg%20width%3D%138.125rem%22%20height%3D%14.0625rem%22%20viewBox%3D%227%2010%2010%205%22%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%3E%0A%20%20%20%20%3Cpolygon%20id%3D%22Shape%22%20stroke%3D%22none%22%20fill%3D%22%23000%22%20fill-rule%3D%22evenodd%22%20opacity%3D%220.54%22%20points%3D%227%2010%2012%2015%2017%2010%22%3E%3C%2Fpolygon%3E%0A%3C%2Fsvg%3E\") no-repeat center;\n  /* \@noflip */\n  left: auto;\n  /* \@noflip */\n  right: 0.5rem;\n  position: absolute;\n  bottom: 1rem;\n  width: 1.5rem;\n  height: 1.5rem;\n  -webkit-transition: -webkit-transform 150ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: -webkit-transform 150ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1), -webkit-transform 150ms cubic-bezier(0.4, 0, 0.2, 1);\n  pointer-events: none;\n}\n[dir=rtl] .mdc-select__dropdown-icon, .mdc-select__dropdown-icon[dir=rtl] {\n  /* \@noflip */\n  left: 0.5rem;\n  /* \@noflip */\n  right: auto;\n}\n.mdc-select--focused .mdc-select__dropdown-icon {\n  background: url(\"data:image/svg+xml,%3Csvg%20width%3D%138.125rem%22%20height%3D%14.0625rem%22%20viewBox%3D%227%2010%2010%205%22%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%3E%0A%20%20%20%20%3Cpolygon%20id%3D%22Shape%22%20stroke%3D%22none%22%20fill%3D%22%2326a69a%22%20fill-rule%3D%22evenodd%22%20opacity%3D%221%22%20points%3D%227%2010%2012%2015%2017%2010%22%3E%3C%2Fpolygon%3E%0A%3C%2Fsvg%3E\") no-repeat center;\n  -webkit-transform: rotate(180deg) translateY(-0.3125rem);\n  transform: rotate(180deg) translateY(-0.3125rem);\n  -webkit-transition: -webkit-transform 150ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: -webkit-transform 150ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1), -webkit-transform 150ms cubic-bezier(0.4, 0, 0.2, 1);\n}\n.mdc-select__native-control {\n  padding-top: 1.25rem;\n}\n.mdc-select.mdc-select--focused .mdc-line-ripple::after {\n  -webkit-transform: scale(1, 2);\n  transform: scale(1, 2);\n  opacity: 1;\n}\n\n.mdc-select + .mdc-select-helper-text {\n  margin-right: 0.75rem;\n  margin-left: 0.75rem;\n}\n.mdc-select--outlined + .mdc-select-helper-text {\n  margin-right: 1rem;\n  margin-left: 1rem;\n}\n\n.mdc-select--focused + .mdc-select-helper-text:not(.mdc-select-helper-text--validation-msg) {\n  opacity: 1;\n}\n\n.mdc-select__selected-text {\n  min-width: 12.5rem;\n  padding-top: 1.375rem;\n}\n\n.mdc-select__native-control,\n.mdc-select__selected-text {\n  /* \@noflip */\n  padding-left: 1rem;\n  /* \@noflip */\n  padding-right: 3.25rem;\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.875rem;\n  line-height: 1.125rem;\n  font-weight: 400;\n  letter-spacing: 0.009375em;\n  text-decoration: inherit;\n  text-transform: inherit;\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box;\n  width: 100%;\n  height: 3.5rem;\n  padding-top: 1.25rem;\n  padding-bottom: 0.25rem;\n  border: none;\n  border-bottom: 0.0625rem solid;\n  outline: none;\n  background-color: transparent;\n  color: inherit;\n  white-space: nowrap;\n  cursor: pointer;\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  appearance: none;\n}\n[dir=rtl] .mdc-select__native-control, .mdc-select__native-control[dir=rtl],\n[dir=rtl] .mdc-select__selected-text,\n.mdc-select__selected-text[dir=rtl] {\n  /* \@noflip */\n  padding-left: 3.25rem;\n  /* \@noflip */\n  padding-right: 1rem;\n}\n.mdc-select__native-control::-ms-expand,\n.mdc-select__selected-text::-ms-expand {\n  display: none;\n}\n.mdc-select__native-control::-ms-value,\n.mdc-select__selected-text::-ms-value {\n  background-color: transparent;\n  color: inherit;\n}\n\@-moz-document url-prefix(\"\") {\n  .mdc-select__native-control,\n.mdc-select__selected-text {\n    text-indent: -0.125rem;\n  }\n}\n\n.mdc-select--outlined {\n  border: none;\n  overflow: visible;\n}\n.mdc-select--outlined:not(.mdc-select--disabled) {\n  background-color: transparent;\n}\n.mdc-select--outlined:not(.mdc-select--disabled) .mdc-notched-outline__leading,\n.mdc-select--outlined:not(.mdc-select--disabled) .mdc-notched-outline__notch,\n.mdc-select--outlined:not(.mdc-select--disabled) .mdc-notched-outline__trailing {\n  border-color: rgba(0, 0, 0, 0.24);\n}\n.mdc-select--outlined:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__native-control:hover ~ .mdc-notched-outline .mdc-notched-outline__leading,\n.mdc-select--outlined:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__native-control:hover ~ .mdc-notched-outline .mdc-notched-outline__notch,\n.mdc-select--outlined:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__native-control:hover ~ .mdc-notched-outline .mdc-notched-outline__trailing, .mdc-select--outlined:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__selected-text:hover ~ .mdc-notched-outline .mdc-notched-outline__leading,\n.mdc-select--outlined:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__selected-text:hover ~ .mdc-notched-outline .mdc-notched-outline__notch,\n.mdc-select--outlined:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__selected-text:hover ~ .mdc-notched-outline .mdc-notched-outline__trailing {\n  border-color: rgba(0, 0, 0, 0.87);\n}\n.mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__leading,\n.mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__notch,\n.mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__trailing {\n  border-width: 0.125rem;\n}\n.mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__leading,\n.mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__notch,\n.mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__trailing {\n  border-color: #26a69a;\n  /* \@alternate */\n  border-color: var(--mdc-theme-primary, #26a69a);\n}\n.mdc-select--outlined .mdc-floating-label--shake {\n  -webkit-animation: mdc-floating-label-shake-float-above-text-field-outlined 250ms 1;\n  animation: mdc-floating-label-shake-float-above-text-field-outlined 250ms 1;\n}\n.mdc-select--outlined .mdc-notched-outline .mdc-notched-outline__leading {\n  /* \@noflip */\n  border-radius: 0.25rem 0 0 0.25rem;\n}\n[dir=rtl] .mdc-select--outlined .mdc-notched-outline .mdc-notched-outline__leading, .mdc-select--outlined .mdc-notched-outline .mdc-notched-outline__leading[dir=rtl] {\n  /* \@noflip */\n  border-radius: 0 0.25rem 0.25rem 0;\n}\n.mdc-select--outlined .mdc-notched-outline .mdc-notched-outline__trailing {\n  /* \@noflip */\n  border-radius: 0 0.25rem 0.25rem 0;\n}\n[dir=rtl] .mdc-select--outlined .mdc-notched-outline .mdc-notched-outline__trailing, .mdc-select--outlined .mdc-notched-outline .mdc-notched-outline__trailing[dir=rtl] {\n  /* \@noflip */\n  border-radius: 0.25rem 0 0 0.25rem;\n}\n.mdc-select--outlined .mdc-select__native-control {\n  border-radius: 0.25rem;\n}\n.mdc-select--outlined::before, .mdc-select--outlined::after {\n  content: none;\n}\n.mdc-select--outlined:not(.mdc-select--disabled) {\n  background-color: transparent;\n}\n.mdc-select--outlined .mdc-floating-label--float-above {\n  -webkit-transform: translateY(-144%) scale(1);\n  transform: translateY(-144%) scale(1);\n}\n.mdc-select--outlined .mdc-floating-label--float-above {\n  font-size: 0.75rem;\n}\n.mdc-select--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,\n.mdc-select--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above {\n  -webkit-transform: translateY(-130%) scale(0.75);\n  transform: translateY(-130%) scale(0.75);\n}\n.mdc-select--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,\n.mdc-select--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above {\n  font-size: 1rem;\n}\n.mdc-select--outlined .mdc-select__native-control,\n.mdc-select--outlined .mdc-select__selected-text {\n  /* \@noflip */\n  padding-left: 1rem;\n  /* \@noflip */\n  padding-right: 3.25rem;\n  display: -ms-flexbox;\n  display: flex;\n  padding-top: 0.75rem;\n  padding-bottom: 0.75rem;\n  border: none;\n  background-color: transparent;\n  z-index: 1;\n}\n[dir=rtl] .mdc-select--outlined .mdc-select__native-control, .mdc-select--outlined .mdc-select__native-control[dir=rtl],\n[dir=rtl] .mdc-select--outlined .mdc-select__selected-text,\n.mdc-select--outlined .mdc-select__selected-text[dir=rtl] {\n  /* \@noflip */\n  padding-left: 3.25rem;\n  /* \@noflip */\n  padding-right: 1rem;\n}\n.mdc-select--outlined .mdc-select__selected-text {\n  padding-top: 0.875rem;\n}\n.mdc-select--outlined .mdc-select__icon {\n  z-index: 2;\n}\n.mdc-select--outlined .mdc-floating-label {\n  line-height: 1.15rem;\n  pointer-events: auto;\n}\n\n.mdc-select--invalid:not(.mdc-select--disabled) .mdc-floating-label {\n  color: #b00020;\n  /* \@alternate */\n  color: var(--mdc-theme-error, #b00020);\n}\n.mdc-select--invalid:not(.mdc-select--disabled) .mdc-select__native-control,\n.mdc-select--invalid:not(.mdc-select--disabled) .mdc-select__selected-text {\n  border-bottom-color: #b00020;\n  /* \@alternate */\n  border-bottom-color: var(--mdc-theme-error, #b00020);\n}\n.mdc-select--invalid:not(.mdc-select--disabled).mdc-select--focused .mdc-line-ripple {\n  background-color: #b00020;\n  /* \@alternate */\n  background-color: var(--mdc-theme-error, #b00020);\n}\n.mdc-select--invalid:not(.mdc-select--disabled).mdc-select--focused .mdc-floating-label {\n  color: #b00020;\n}\n.mdc-select--invalid:not(.mdc-select--disabled).mdc-select--invalid + .mdc-select-helper-text--validation-msg {\n  color: #b00020;\n  /* \@alternate */\n  color: var(--mdc-theme-error, #b00020);\n}\n.mdc-select--invalid:not(.mdc-select--disabled) .mdc-select__native-control:hover {\n  border-bottom-color: #b00020;\n  /* \@alternate */\n  border-bottom-color: var(--mdc-theme-error, #b00020);\n}\n.mdc-select--invalid.mdc-select--outlined:not(.mdc-select--disabled) .mdc-notched-outline__leading,\n.mdc-select--invalid.mdc-select--outlined:not(.mdc-select--disabled) .mdc-notched-outline__notch,\n.mdc-select--invalid.mdc-select--outlined:not(.mdc-select--disabled) .mdc-notched-outline__trailing {\n  border-color: #b00020;\n  /* \@alternate */\n  border-color: var(--mdc-theme-error, #b00020);\n}\n.mdc-select--invalid.mdc-select--outlined:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__native-control:hover ~ .mdc-notched-outline .mdc-notched-outline__leading,\n.mdc-select--invalid.mdc-select--outlined:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__native-control:hover ~ .mdc-notched-outline .mdc-notched-outline__notch,\n.mdc-select--invalid.mdc-select--outlined:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__native-control:hover ~ .mdc-notched-outline .mdc-notched-outline__trailing, .mdc-select--invalid.mdc-select--outlined:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__selected-text:hover ~ .mdc-notched-outline .mdc-notched-outline__leading,\n.mdc-select--invalid.mdc-select--outlined:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__selected-text:hover ~ .mdc-notched-outline .mdc-notched-outline__notch,\n.mdc-select--invalid.mdc-select--outlined:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__selected-text:hover ~ .mdc-notched-outline .mdc-notched-outline__trailing {\n  border-color: #b00020;\n  /* \@alternate */\n  border-color: var(--mdc-theme-error, #b00020);\n}\n.mdc-select--invalid.mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__leading,\n.mdc-select--invalid.mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__notch,\n.mdc-select--invalid.mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__trailing {\n  border-width: 0.125rem;\n}\n.mdc-select--invalid.mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__leading,\n.mdc-select--invalid.mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__notch,\n.mdc-select--invalid.mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__trailing {\n  border-color: #b00020;\n  /* \@alternate */\n  border-color: var(--mdc-theme-error, #b00020);\n}\n.mdc-select--invalid .mdc-select__dropdown-icon {\n  background: url(\"data:image/svg+xml,%3Csvg%20width%3D%138.125rem%22%20height%3D%14.0625rem%22%20viewBox%3D%227%2010%2010%205%22%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%3E%0A%20%20%20%20%3Cpolygon%20id%3D%22Shape%22%20stroke%3D%22none%22%20fill%3D%22%23b00020%22%20fill-rule%3D%22evenodd%22%20opacity%3D%221%22%20points%3D%227%2010%2012%2015%2017%2010%22%3E%3C%2Fpolygon%3E%0A%3C%2Fsvg%3E\") no-repeat center;\n}\n.mdc-select--invalid + .mdc-select-helper-text--validation-msg {\n  opacity: 1;\n}\n\n.mdc-select--required .mdc-floating-label::after {\n  content: \"*\";\n}\n\n.mdc-select--disabled {\n  background-color: #fafafa;\n  cursor: default;\n  pointer-events: none;\n}\n.mdc-select--disabled .mdc-floating-label {\n  color: rgba(0, 0, 0, 0.37);\n}\n.mdc-select--disabled .mdc-select__dropdown-icon {\n  background: url(\"data:image/svg+xml,%3Csvg%20width%3D%138.125rem%22%20height%3D%14.0625rem%22%20viewBox%3D%227%2010%2010%205%22%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%3E%0A%20%20%20%20%3Cpolygon%20id%3D%22Shape%22%20stroke%3D%22none%22%20fill%3D%22%23000%22%20fill-rule%3D%22evenodd%22%20opacity%3D%220.37%22%20points%3D%227%2010%2012%2015%2017%2010%22%3E%3C%2Fpolygon%3E%0A%3C%2Fsvg%3E\") no-repeat center;\n}\n.mdc-select--disabled .mdc-line-ripple {\n  display: none;\n}\n.mdc-select--disabled .mdc-select__icon {\n  color: rgba(0, 0, 0, 0.37);\n}\n.mdc-select--disabled .mdc-select__native-control,\n.mdc-select--disabled .mdc-select__selected-text {\n  color: rgba(0, 0, 0, 0.37);\n  border-bottom-style: dotted;\n}\n.mdc-select--disabled .mdc-select__selected-text {\n  pointer-events: none;\n}\n.mdc-select--disabled.mdc-select--outlined {\n  background-color: transparent;\n}\n.mdc-select--disabled.mdc-select--outlined .mdc-select__native-control,\n.mdc-select--disabled.mdc-select--outlined .mdc-select__selected-text {\n  border-bottom-style: none;\n}\n.mdc-select--disabled.mdc-select--outlined .mdc-notched-outline__leading,\n.mdc-select--disabled.mdc-select--outlined .mdc-notched-outline__notch,\n.mdc-select--disabled.mdc-select--outlined .mdc-notched-outline__trailing {\n  border-color: rgba(0, 0, 0, 0.16);\n}\n\n.mdc-select--with-leading-icon .mdc-select__icon {\n  /* \@noflip */\n  left: 1rem;\n  /* \@noflip */\n  right: initial;\n}\n[dir=rtl] .mdc-select--with-leading-icon .mdc-select__icon, .mdc-select--with-leading-icon .mdc-select__icon[dir=rtl] {\n  /* \@noflip */\n  left: initial;\n  /* \@noflip */\n  right: 1rem;\n}\n.mdc-select--with-leading-icon .mdc-select__native-control,\n.mdc-select--with-leading-icon .mdc-select__selected-text {\n  /* \@noflip */\n  padding-left: 3rem;\n  /* \@noflip */\n  padding-right: 2rem;\n}\n[dir=rtl] .mdc-select--with-leading-icon .mdc-select__native-control, .mdc-select--with-leading-icon .mdc-select__native-control[dir=rtl],\n[dir=rtl] .mdc-select--with-leading-icon .mdc-select__selected-text,\n.mdc-select--with-leading-icon .mdc-select__selected-text[dir=rtl] {\n  /* \@noflip */\n  padding-left: 2rem;\n  /* \@noflip */\n  padding-right: 3rem;\n}\n.mdc-select--with-leading-icon.mdc-select--outlined .mdc-floating-label--float-above {\n  -webkit-transform: translateY(-144%) translateX(-2rem) scale(1);\n  transform: translateY(-144%) translateX(-2rem) scale(1);\n}\n[dir=rtl] .mdc-select--with-leading-icon.mdc-select--outlined .mdc-floating-label--float-above, .mdc-select--with-leading-icon.mdc-select--outlined .mdc-floating-label--float-above[dir=rtl] {\n  -webkit-transform: translateY(-144%) translateX(2rem) scale(1);\n  transform: translateY(-144%) translateX(2rem) scale(1);\n}\n.mdc-select--with-leading-icon.mdc-select--outlined .mdc-floating-label--float-above {\n  font-size: 0.75rem;\n}\n.mdc-select--with-leading-icon.mdc-select--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,\n.mdc-select--with-leading-icon.mdc-select--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above {\n  -webkit-transform: translateY(-130%) translateX(-2rem) scale(0.75);\n  transform: translateY(-130%) translateX(-2rem) scale(0.75);\n}\n[dir=rtl] .mdc-select--with-leading-icon.mdc-select--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above, .mdc-select--with-leading-icon.mdc-select--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above[dir=rtl],\n[dir=rtl] .mdc-select--with-leading-icon.mdc-select--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above,\n.mdc-select--with-leading-icon.mdc-select--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above[dir=rtl] {\n  -webkit-transform: translateY(-130%) translateX(2rem) scale(0.75);\n  transform: translateY(-130%) translateX(2rem) scale(0.75);\n}\n.mdc-select--with-leading-icon.mdc-select--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,\n.mdc-select--with-leading-icon.mdc-select--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above {\n  font-size: 1rem;\n}\n.mdc-select--with-leading-icon.mdc-select--outlined .mdc-floating-label--shake {\n  -webkit-animation: mdc-floating-label-shake-float-above-select-outlined-leading-icon 250ms 1;\n  animation: mdc-floating-label-shake-float-above-select-outlined-leading-icon 250ms 1;\n}\n[dir=rtl] .mdc-select--with-leading-icon.mdc-select--outlined .mdc-floating-label--shake, .mdc-select--with-leading-icon.mdc-select--outlined[dir=rtl] .mdc-floating-label--shake {\n  -webkit-animation: mdc-floating-label-shake-float-above-select-outlined-leading-icon-rtl 250ms 1;\n  animation: mdc-floating-label-shake-float-above-select-outlined-leading-icon-rtl 250ms 1;\n}\n.mdc-select--with-leading-icon.mdc-select__menu .mdc-list-item__text {\n  /* \@noflip */\n  padding-left: 2rem;\n  /* \@noflip */\n  padding-right: 2rem;\n}\n[dir=rtl] .mdc-select--with-leading-icon.mdc-select__menu .mdc-list-item__text, .mdc-select--with-leading-icon.mdc-select__menu .mdc-list-item__text[dir=rtl] {\n  /* \@noflip */\n  padding-left: 2rem;\n  /* \@noflip */\n  padding-right: 2rem;\n}\n\n.mdc-select__menu .mdc-list .mdc-list-item--selected {\n  color: #000;\n  /* \@alternate */\n  color: var(--mdc-theme-on-surface, #000);\n}\n.mdc-select__menu .mdc-list .mdc-list-item--selected::before, .mdc-select__menu .mdc-list .mdc-list-item--selected::after {\n  background-color: #000;\n}\n\@supports not (-ms-ime-align: auto) {\n  .mdc-select__menu .mdc-list .mdc-list-item--selected::before, .mdc-select__menu .mdc-list .mdc-list-item--selected::after {\n    /* \@alternate */\n    background-color: var(--mdc-theme-on-surface, #000);\n  }\n}\n.mdc-select__menu .mdc-list .mdc-list-item--selected:hover::before {\n  opacity: 0.04;\n}\n.mdc-select__menu .mdc-list .mdc-list-item--selected:not(.mdc-ripple-upgraded):focus::before, .mdc-select__menu .mdc-list .mdc-list-item--selected.mdc-ripple-upgraded--background-focused::before {\n  -webkit-transition-duration: 75ms;\n  transition-duration: 75ms;\n  opacity: 0.12;\n}\n.mdc-select__menu .mdc-list .mdc-list-item--selected:not(.mdc-ripple-upgraded)::after {\n  -webkit-transition: opacity 150ms linear;\n  transition: opacity 150ms linear;\n}\n.mdc-select__menu .mdc-list .mdc-list-item--selected:not(.mdc-ripple-upgraded):active::after {\n  -webkit-transition-duration: 75ms;\n  transition-duration: 75ms;\n  opacity: 0.12;\n}\n.mdc-select__menu .mdc-list .mdc-list-item--selected.mdc-ripple-upgraded {\n  --mdc-ripple-fg-opacity: 0.12;\n}\n\n\@-webkit-keyframes mdc-floating-label-shake-float-above-select-outlined-leading-icon {\n  0% {\n    -webkit-transform: translateX(calc(0 - 2rem)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(0 - 2rem)) translateY(-130%) scale(0.75);\n  }\n  33% {\n    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.701732, 0.495819);\n    animation-timing-function: cubic-bezier(0.5, 0, 0.701732, 0.495819);\n    -webkit-transform: translateX(calc(4% - 2rem)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(4% - 2rem)) translateY(-130%) scale(0.75);\n  }\n  66% {\n    -webkit-animation-timing-function: cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);\n    animation-timing-function: cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);\n    -webkit-transform: translateX(calc(-4% - 2rem)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(-4% - 2rem)) translateY(-130%) scale(0.75);\n  }\n  100% {\n    -webkit-transform: translateX(calc(0 - 2rem)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(0 - 2rem)) translateY(-130%) scale(0.75);\n  }\n}\n\n\@keyframes mdc-floating-label-shake-float-above-select-outlined-leading-icon {\n  0% {\n    -webkit-transform: translateX(calc(0 - 2rem)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(0 - 2rem)) translateY(-130%) scale(0.75);\n  }\n  33% {\n    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.701732, 0.495819);\n    animation-timing-function: cubic-bezier(0.5, 0, 0.701732, 0.495819);\n    -webkit-transform: translateX(calc(4% - 2rem)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(4% - 2rem)) translateY(-130%) scale(0.75);\n  }\n  66% {\n    -webkit-animation-timing-function: cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);\n    animation-timing-function: cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);\n    -webkit-transform: translateX(calc(-4% - 2rem)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(-4% - 2rem)) translateY(-130%) scale(0.75);\n  }\n  100% {\n    -webkit-transform: translateX(calc(0 - 2rem)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(0 - 2rem)) translateY(-130%) scale(0.75);\n  }\n}\n\@-webkit-keyframes mdc-floating-label-shake-float-above-select-outlined-leading-icon-rtl {\n  0% {\n    -webkit-transform: translateX(calc(0 - -2rem)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(0 - -2rem)) translateY(-130%) scale(0.75);\n  }\n  33% {\n    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.701732, 0.495819);\n    animation-timing-function: cubic-bezier(0.5, 0, 0.701732, 0.495819);\n    -webkit-transform: translateX(calc(4% - -2rem)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(4% - -2rem)) translateY(-130%) scale(0.75);\n  }\n  66% {\n    -webkit-animation-timing-function: cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);\n    animation-timing-function: cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);\n    -webkit-transform: translateX(calc(-4% - -2rem)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(-4% - -2rem)) translateY(-130%) scale(0.75);\n  }\n  100% {\n    -webkit-transform: translateX(calc(0 - -2rem)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(0 - -2rem)) translateY(-130%) scale(0.75);\n  }\n}\n\@keyframes mdc-floating-label-shake-float-above-select-outlined-leading-icon-rtl {\n  0% {\n    -webkit-transform: translateX(calc(0 - -2rem)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(0 - -2rem)) translateY(-130%) scale(0.75);\n  }\n  33% {\n    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.701732, 0.495819);\n    animation-timing-function: cubic-bezier(0.5, 0, 0.701732, 0.495819);\n    -webkit-transform: translateX(calc(4% - -2rem)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(4% - -2rem)) translateY(-130%) scale(0.75);\n  }\n  66% {\n    -webkit-animation-timing-function: cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);\n    animation-timing-function: cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);\n    -webkit-transform: translateX(calc(-4% - -2rem)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(-4% - -2rem)) translateY(-130%) scale(0.75);\n  }\n  100% {\n    -webkit-transform: translateX(calc(0 - -2rem)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(0 - -2rem)) translateY(-130%) scale(0.75);\n  }\n}\n.mdc-ripple-surface {\n  --mdc-ripple-fg-size: 0;\n  --mdc-ripple-left: 0;\n  --mdc-ripple-top: 0;\n  --mdc-ripple-fg-scale: 1;\n  --mdc-ripple-fg-translate-end: 0;\n  --mdc-ripple-fg-translate-start: 0;\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n  position: relative;\n  outline: none;\n  overflow: hidden;\n}\n.mdc-ripple-surface::before, .mdc-ripple-surface::after {\n  position: absolute;\n  border-radius: 50%;\n  opacity: 0;\n  pointer-events: none;\n  content: \"\";\n}\n.mdc-ripple-surface::before {\n  -webkit-transition: opacity 15ms linear, background-color 15ms linear;\n  transition: opacity 15ms linear, background-color 15ms linear;\n  z-index: 1;\n}\n.mdc-ripple-surface.mdc-ripple-upgraded::before {\n  -webkit-transform: scale(var(--mdc-ripple-fg-scale, 1));\n  transform: scale(var(--mdc-ripple-fg-scale, 1));\n}\n.mdc-ripple-surface.mdc-ripple-upgraded::after {\n  top: 0;\n  /* \@noflip */\n  left: 0;\n  -webkit-transform: scale(0);\n  transform: scale(0);\n  -webkit-transform-origin: center center;\n  transform-origin: center center;\n}\n.mdc-ripple-surface.mdc-ripple-upgraded--unbounded::after {\n  top: var(--mdc-ripple-top, 0);\n  /* \@noflip */\n  left: var(--mdc-ripple-left, 0);\n}\n.mdc-ripple-surface.mdc-ripple-upgraded--foreground-activation::after {\n  -webkit-animation: mdc-ripple-fg-radius-in 225ms forwards, mdc-ripple-fg-opacity-in 75ms forwards;\n  animation: mdc-ripple-fg-radius-in 225ms forwards, mdc-ripple-fg-opacity-in 75ms forwards;\n}\n.mdc-ripple-surface.mdc-ripple-upgraded--foreground-deactivation::after {\n  -webkit-animation: mdc-ripple-fg-opacity-out 150ms;\n  animation: mdc-ripple-fg-opacity-out 150ms;\n  -webkit-transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1));\n  transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1));\n}\n.mdc-ripple-surface::before, .mdc-ripple-surface::after {\n  background-color: #000;\n}\n.mdc-ripple-surface:hover::before {\n  opacity: 0.04;\n}\n.mdc-ripple-surface:not(.mdc-ripple-upgraded):focus::before, .mdc-ripple-surface.mdc-ripple-upgraded--background-focused::before {\n  -webkit-transition-duration: 75ms;\n  transition-duration: 75ms;\n  opacity: 0.12;\n}\n.mdc-ripple-surface:not(.mdc-ripple-upgraded)::after {\n  -webkit-transition: opacity 150ms linear;\n  transition: opacity 150ms linear;\n}\n.mdc-ripple-surface:not(.mdc-ripple-upgraded):active::after {\n  -webkit-transition-duration: 75ms;\n  transition-duration: 75ms;\n  opacity: 0.12;\n}\n.mdc-ripple-surface.mdc-ripple-upgraded {\n  --mdc-ripple-fg-opacity: 0.12;\n}\n.mdc-ripple-surface::before, .mdc-ripple-surface::after {\n  top: calc(50% - 100%);\n  /* \@noflip */\n  left: calc(50% - 100%);\n  width: 200%;\n  height: 200%;\n}\n.mdc-ripple-surface.mdc-ripple-upgraded::after {\n  width: var(--mdc-ripple-fg-size, 100%);\n  height: var(--mdc-ripple-fg-size, 100%);\n}\n.mdc-ripple-surface[data-mdc-ripple-is-unbounded] {\n  overflow: visible;\n}\n.mdc-ripple-surface[data-mdc-ripple-is-unbounded]::before, .mdc-ripple-surface[data-mdc-ripple-is-unbounded]::after {\n  top: calc(50% - 50%);\n  /* \@noflip */\n  left: calc(50% - 50%);\n  width: 100%;\n  height: 100%;\n}\n.mdc-ripple-surface[data-mdc-ripple-is-unbounded].mdc-ripple-upgraded::before, .mdc-ripple-surface[data-mdc-ripple-is-unbounded].mdc-ripple-upgraded::after {\n  top: var(--mdc-ripple-top, calc(50% - 50%));\n  /* \@noflip */\n  left: var(--mdc-ripple-left, calc(50% - 50%));\n  width: var(--mdc-ripple-fg-size, 100%);\n  height: var(--mdc-ripple-fg-size, 100%);\n}\n.mdc-ripple-surface[data-mdc-ripple-is-unbounded].mdc-ripple-upgraded::after {\n  width: var(--mdc-ripple-fg-size, 100%);\n  height: var(--mdc-ripple-fg-size, 100%);\n}\n.mdc-ripple-surface--primary::before, .mdc-ripple-surface--primary::after {\n  background-color: #26a69a;\n}\n\@supports not (-ms-ime-align: auto) {\n  .mdc-ripple-surface--primary::before, .mdc-ripple-surface--primary::after {\n    /* \@alternate */\n    background-color: var(--mdc-theme-primary, #26a69a);\n  }\n}\n.mdc-ripple-surface--primary:hover::before {\n  opacity: 0.08;\n}\n.mdc-ripple-surface--primary:not(.mdc-ripple-upgraded):focus::before, .mdc-ripple-surface--primary.mdc-ripple-upgraded--background-focused::before {\n  -webkit-transition-duration: 75ms;\n  transition-duration: 75ms;\n  opacity: 0.24;\n}\n.mdc-ripple-surface--primary:not(.mdc-ripple-upgraded)::after {\n  -webkit-transition: opacity 150ms linear;\n  transition: opacity 150ms linear;\n}\n.mdc-ripple-surface--primary:not(.mdc-ripple-upgraded):active::after {\n  -webkit-transition-duration: 75ms;\n  transition-duration: 75ms;\n  opacity: 0.24;\n}\n.mdc-ripple-surface--primary.mdc-ripple-upgraded {\n  --mdc-ripple-fg-opacity: 0.24;\n}\n.mdc-ripple-surface--accent::before, .mdc-ripple-surface--accent::after {\n  background-color: #575756;\n}\n\@supports not (-ms-ime-align: auto) {\n  .mdc-ripple-surface--accent::before, .mdc-ripple-surface--accent::after {\n    /* \@alternate */\n    background-color: var(--mdc-theme-secondary, #575756);\n  }\n}\n.mdc-ripple-surface--accent:hover::before {\n  opacity: 0.04;\n}\n.mdc-ripple-surface--accent:not(.mdc-ripple-upgraded):focus::before, .mdc-ripple-surface--accent.mdc-ripple-upgraded--background-focused::before {\n  -webkit-transition-duration: 75ms;\n  transition-duration: 75ms;\n  opacity: 0.12;\n}\n.mdc-ripple-surface--accent:not(.mdc-ripple-upgraded)::after {\n  -webkit-transition: opacity 150ms linear;\n  transition: opacity 150ms linear;\n}\n.mdc-ripple-surface--accent:not(.mdc-ripple-upgraded):active::after {\n  -webkit-transition-duration: 75ms;\n  transition-duration: 75ms;\n  opacity: 0.12;\n}\n.mdc-ripple-surface--accent.mdc-ripple-upgraded {\n  --mdc-ripple-fg-opacity: 0.12;\n}\n\n.mdc-menu-surface {\n  display: none;\n  position: absolute;\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box;\n  max-width: calc(100vw - 2rem);\n  max-height: calc(100vh - 2rem);\n  margin: 0;\n  padding: 0;\n  -webkit-transform: scale(1);\n  transform: scale(1);\n  -webkit-transform-origin: top left;\n  transform-origin: top left;\n  opacity: 0;\n  overflow: auto;\n  will-change: transform, opacity;\n  z-index: 8;\n  -webkit-transition: opacity 0.03s linear, -webkit-transform 0.12s cubic-bezier(0, 0, 0.2, 1);\n  transition: opacity 0.03s linear, -webkit-transform 0.12s cubic-bezier(0, 0, 0.2, 1);\n  transition: opacity 0.03s linear, transform 0.12s cubic-bezier(0, 0, 0.2, 1);\n  transition: opacity 0.03s linear, transform 0.12s cubic-bezier(0, 0, 0.2, 1), -webkit-transform 0.12s cubic-bezier(0, 0, 0.2, 1);\n  -webkit-box-shadow: 0rem 0.3125rem 0.3125rem -0.1875rem rgba(0, 0, 0, 0.2), 0rem 0.5rem 0.625rem 0.0625rem rgba(0, 0, 0, 0.14), 0rem 0.1875rem 0.875rem 0.125rem rgba(0, 0, 0, 0.12);\n  box-shadow: 0rem 0.3125rem 0.3125rem -0.1875rem rgba(0, 0, 0, 0.2), 0rem 0.5rem 0.625rem 0.0625rem rgba(0, 0, 0, 0.14), 0rem 0.1875rem 0.875rem 0.125rem rgba(0, 0, 0, 0.12);\n  background-color: #fff;\n  /* \@alternate */\n  background-color: var(--mdc-theme-surface, #fff);\n  color: #000;\n  /* \@alternate */\n  color: var(--mdc-theme-on-surface, #000);\n  border-radius: 0.25rem;\n  /* \@noflip */\n  transform-origin-left: top left;\n  /* \@noflip */\n  transform-origin-right: top right;\n}\n.mdc-menu-surface:focus {\n  outline: none;\n}\n.mdc-menu-surface--open {\n  display: inline-block;\n  -webkit-transform: scale(1);\n  transform: scale(1);\n  opacity: 1;\n}\n.mdc-menu-surface--animating-open {\n  display: inline-block;\n  -webkit-transform: scale(0.8);\n  transform: scale(0.8);\n  opacity: 0;\n}\n.mdc-menu-surface--animating-closed {\n  display: inline-block;\n  opacity: 0;\n  -webkit-transition: opacity 0.075s linear;\n  transition: opacity 0.075s linear;\n}\n[dir=rtl] .mdc-menu-surface, .mdc-menu-surface[dir=rtl] {\n  /* \@noflip */\n  transform-origin-left: top right;\n  /* \@noflip */\n  transform-origin-right: top left;\n}\n\n.mdc-menu-surface--anchor {\n  position: relative;\n  overflow: visible;\n}\n\n.mdc-menu-surface--fixed {\n  position: fixed;\n}\n\n:host([hidden]) {\n  display: none;\n}\n\n.limel-select__selected-text {\n  padding: 1.25rem 3.25rem 0.25rem 1rem;\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box;\n  border: none;\n  border-bottom: 0.0625rem solid;\n  outline: none;\n  background-color: transparent;\n  white-space: nowrap;\n  border-bottom-color: rgba(0, 0, 0, 0.12);\n}\n\n.mdc-select {\n  width: 100%;\n}\n.mdc-select:hover::before {\n  opacity: 0;\n}\n.mdc-select:not(.mdc-ripple-upgraded):focus::before, .mdc-select:not(.mdc-ripple-upgraded):focus-within::before, .mdc-select.mdc-ripple-upgraded--background-focused::before {\n  -webkit-transition-duration: 75ms;\n  transition-duration: 75ms;\n  opacity: 0;\n}\n.mdc-select__native-control {\n  padding-top: 1.5625rem;\n  padding-bottom: 0.125rem;\n  color: transparent !important;\n}\n.mdc-select .limel-select__selected-text {\n  width: 100%;\n  height: 3.5rem;\n  position: absolute;\n  z-index: -1;\n}\n\n.limel-select,\n.limel-select .limel-select-trigger,\n.limel-select .limel-select__selected-text {\n  width: 100%;\n  height: 3.5rem;\n  position: relative;\n}\n.limel-select .limel-select__selected-text {\n  line-height: 1.75rem;\n  overflow: hidden;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}\n.limel-select .limel-select-trigger {\n  display: -ms-inline-flexbox;\n  display: inline-flex;\n  cursor: pointer;\n}\n.limel-select .limel-select-trigger:focus {\n  outline: none;\n}\n.limel-select .limel-select-trigger:focus .mdc-floating-label {\n  color: var(--mdc-theme-primary);\n}\n.limel-select .limel-select-trigger:focus .mdc-line-ripple {\n  -webkit-transform: scaleX(1);\n  transform: scaleX(1);\n  opacity: 1;\n  background-color: var(--mdc-theme-primary);\n}\n.limel-select .limel-select-trigger:focus .mdc-select__dropdown-icon {\n  -webkit-transform: rotate(180deg) translateY(-0.3125rem);\n  transform: rotate(180deg) translateY(-0.3125rem);\n  color: var(--mdc-theme-primary);\n}\n.limel-select .limel-select-trigger .mdc-floating-label {\n  left: 1rem;\n  right: auto;\n  top: 1.3125rem;\n  pointer-events: none;\n}\n.limel-select .limel-select-trigger .mdc-floating-label.mdc-floating-label--float-above {\n  top: 1.0625rem;\n}\n.limel-select .limel-select-trigger .mdc-floating-label.mdc-floating-label--active {\n  color: var(--mdc-theme-primary);\n}\n.limel-select .limel-select-trigger .mdc-line-ripple {\n  background-color: var(--mdc-theme-primary);\n}\n.limel-select .limel-select-trigger .mdc-select__dropdown-icon {\n  background: url(\"data:image/svg+xml;charset=utf-8,%3Csvg width=\'10\' height=\'5\' viewBox=\'7 10 10 5\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath fill-rule=\'evenodd\' opacity=\'.54\' d=\'M7 10l5 5 5-5z\'/%3E%3C/svg%3E\") no-repeat 50%;\n}\n.limel-select.limel-select--required .mdc-floating-label::after {\n  content: \"*\";\n}\n.limel-select.limel-select--invalid .limel-select-trigger .mdc-floating-label {\n  color: #b00020;\n}\n.limel-select.limel-select--invalid .limel-select-trigger .mdc-line-ripple {\n  background-color: #b00020;\n  -webkit-transform: scaleX(1);\n  transform: scaleX(1);\n  opacity: 1;\n}\n.limel-select.limel-select--empty limel-portal {\n  margin-top: -0.5rem;\n}"; }
};

export { Select as limel_select };
