const h = window.LimeElements.h;

import { a as MDCFoundation, b as MDCComponent } from './chunk-d211df41.js';
import { a as MDCRipple, c as MDCRippleFoundation } from './chunk-b9077bcc.js';
import './chunk-0c62589f.js';
import { b as MDCFloatingLabel, a as MDCLineRipple, c as MDCNotchedOutline } from './chunk-e4258826.js';
import './chunk-e312ab05.js';
import { a as MDCMenu, b as Corner, c as strings$3, d as strings$4 } from './chunk-32a4a0cc.js';

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

/* eslint no-unused-vars: [2, {"args": "none"}] */

/**
 * Adapter for MDC Select Icon.
 *
 * Defines the shape of the adapter expected by the foundation. Implement this
 * adapter to integrate the select icon into your framework. See
 * https://github.com/material-components/material-components-web/blob/master/docs/authoring-components.md
 * for more information.
 *
 * @record
 */
class MDCSelectIconAdapter {
  /**
   * Gets the value of an attribute on the icon element.
   * @param {string} attr
   * @return {string}
   */
  getAttr(attr) {}

  /**
   * Sets an attribute on the icon element.
   * @param {string} attr
   * @param {string} value
   */
  setAttr(attr, value) {}

  /**
   * Removes an attribute from the icon element.
   * @param {string} attr
   */
  removeAttr(attr) {}

  /**
   * Sets the text content of the icon element.
   * @param {string} content
   */
  setContent(content) {}

  /**
   * Registers an event listener on the icon element for a given event.
   * @param {string} evtType
   * @param {function(!Event): undefined} handler
   */
  registerInteractionHandler(evtType, handler) {}

  /**
   * Deregisters an event listener on the icon element for a given event.
   * @param {string} evtType
   * @param {function(!Event): undefined} handler
   */
  deregisterInteractionHandler(evtType, handler) {}

  /**
   * Emits a custom event "MDCSelect:icon" denoting a user has clicked the icon.
   */
  notifyIconAction() {}
}

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

/** @enum {string} */
const strings = {
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


/**
 * @extends {MDCFoundation<!MDCSelectIconAdapter>}
 * @final
 */
class MDCSelectIconFoundation extends MDCFoundation {
  /** @return enum {string} */
  static get strings() {
    return strings;
  }

  /**
   * {@see MDCSelectIconAdapter} for typing information on parameters and return
   * types.
   * @return {!MDCSelectIconAdapter}
   */
  static get defaultAdapter() {
    return /** @type {!MDCSelectIconAdapter} */ ({
      getAttr: () => {},
      setAttr: () => {},
      removeAttr: () => {},
      setContent: () => {},
      registerInteractionHandler: () => {},
      deregisterInteractionHandler: () => {},
      notifyIconAction: () => {},
    });
  }

  /**
   * @param {!MDCSelectIconAdapter} adapter
   */
  constructor(adapter) {
    super(Object.assign(MDCSelectIconFoundation.defaultAdapter, adapter));

    /** @private {string?} */
    this.savedTabIndex_ = null;

    /** @private {function(!Event): undefined} */
    this.interactionHandler_ = (evt) => this.handleInteraction(evt);
  }

  init() {
    this.savedTabIndex_ = this.adapter_.getAttr('tabindex');

    ['click', 'keydown'].forEach((evtType) => {
      this.adapter_.registerInteractionHandler(evtType, this.interactionHandler_);
    });
  }

  destroy() {
    ['click', 'keydown'].forEach((evtType) => {
      this.adapter_.deregisterInteractionHandler(evtType, this.interactionHandler_);
    });
  }

  /** @param {boolean} disabled */
  setDisabled(disabled) {
    if (!this.savedTabIndex_) {
      return;
    }

    if (disabled) {
      this.adapter_.setAttr('tabindex', '-1');
      this.adapter_.removeAttr('role');
    } else {
      this.adapter_.setAttr('tabindex', this.savedTabIndex_);
      this.adapter_.setAttr('role', strings.ICON_ROLE);
    }
  }

  /** @param {string} label */
  setAriaLabel(label) {
    this.adapter_.setAttr('aria-label', label);
  }

  /** @param {string} content */
  setContent(content) {
    this.adapter_.setContent(content);
  }

  /**
   * Handles an interaction event
   * @param {!Event} evt
   */
  handleInteraction(evt) {
    if (evt.type === 'click' || evt.key === 'Enter' || evt.keyCode === 13) {
      this.adapter_.notifyIconAction();
    }
  }
}

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

/**
 * @extends {MDCComponent<!MDCSelectIconFoundation>}
 * @final
 */
class MDCSelectIcon extends MDCComponent {
  /**
   * @param {!Element} root
   * @return {!MDCSelectIcon}
   */
  static attachTo(root) {
    return new MDCSelectIcon(root);
  }

  /**
   * @return {!MDCSelectIconFoundation}
   */
  get foundation() {
    return this.foundation_;
  }

  /**
   * @return {!MDCSelectIconFoundation}
   */
  getDefaultFoundation() {
    return new MDCSelectIconFoundation(/** @type {!MDCSelectIconAdapter} */ (Object.assign({
      getAttr: (attr) => this.root_.getAttribute(attr),
      setAttr: (attr, value) => this.root_.setAttribute(attr, value),
      removeAttr: (attr) => this.root_.removeAttribute(attr),
      setContent: (content) => {
        this.root_.textContent = content;
      },
      registerInteractionHandler: (evtType, handler) => this.root_.addEventListener(evtType, handler),
      deregisterInteractionHandler: (evtType, handler) => this.root_.removeEventListener(evtType, handler),
      notifyIconAction: () => this.emit(
        MDCSelectIconFoundation.strings.ICON_EVENT, {} /* evtData */, true /* shouldBubble */),
    })));
  }
}

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

/* eslint no-unused-vars: [2, {"args": "none"}] */

/**
 * Adapter for MDC Select Helper Text.
 *
 * Defines the shape of the adapter expected by the foundation. Implement this
 * adapter to integrate the Select helper text into your framework. See
 * https://github.com/material-components/material-components-web/blob/master/docs/authoring-components.md
 * for more information.
 *
 * @record
 */
class MDCSelectHelperTextAdapter {
  /**
   * Adds a class to the helper text element.
   * @param {string} className
   */
  addClass(className) {}

  /**
   * Removes a class from the helper text element.
   * @param {string} className
   */
  removeClass(className) {}

  /**
   * Returns whether or not the helper text element contains the given class.
   * @param {string} className
   * @return {boolean}
   */
  hasClass(className) {}

  /**
   * Sets an attribute with a given value on the helper text element.
   * @param {string} attr
   * @param {string} value
   */
  setAttr(attr, value) {}

  /**
   * Removes an attribute from the helper text element.
   * @param {string} attr
   */
  removeAttr(attr) {}

  /**
   * Sets the text content for the helper text element.
   * @param {string} content
   */
  setContent(content) {}
}

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

/** @enum {string} */
const strings$1 = {
  ARIA_HIDDEN: 'aria-hidden',
  ROLE: 'role',
};

/** @enum {string} */
const cssClasses = {
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


/**
 * @extends {MDCFoundation<!MDCSelectHelperTextAdapter>}
 * @final
 */
class MDCSelectHelperTextFoundation extends MDCFoundation {
  /** @return enum {string} */
  static get cssClasses() {
    return cssClasses;
  }

  /** @return enum {string} */
  static get strings() {
    return strings$1;
  }

  /**
   * {@see MDCSelectHelperTextAdapter} for typing information on parameters and return
   * types.
   * @return {!MDCSelectHelperTextAdapter}
   */
  static get defaultAdapter() {
    return /** @type {!MDCSelectHelperTextAdapter} */ ({
      addClass: () => {},
      removeClass: () => {},
      hasClass: () => {},
      setAttr: () => {},
      removeAttr: () => {},
      setContent: () => {},
    });
  }

  /**
   * @param {!MDCSelectHelperTextAdapter} adapter
   */
  constructor(adapter) {
    super(Object.assign(MDCSelectHelperTextFoundation.defaultAdapter, adapter));
  }

  /**
   * Sets the content of the helper text field.
   * @param {string} content
   */
  setContent(content) {
    this.adapter_.setContent(content);
  }

  /** @param {boolean} isPersistent Sets the persistency of the helper text. */
  setPersistent(isPersistent) {
    if (isPersistent) {
      this.adapter_.addClass(cssClasses.HELPER_TEXT_PERSISTENT);
    } else {
      this.adapter_.removeClass(cssClasses.HELPER_TEXT_PERSISTENT);
    }
  }

  /**
   * @param {boolean} isValidation True to make the helper text act as an
   *   error validation message.
   */
  setValidation(isValidation) {
    if (isValidation) {
      this.adapter_.addClass(cssClasses.HELPER_TEXT_VALIDATION_MSG);
    } else {
      this.adapter_.removeClass(cssClasses.HELPER_TEXT_VALIDATION_MSG);
    }
  }

  /** Makes the helper text visible to the screen reader. */
  showToScreenReader() {
    this.adapter_.removeAttr(strings$1.ARIA_HIDDEN);
  }

  /**
   * Sets the validity of the helper text based on the select validity.
   * @param {boolean} selectIsValid
   */
  setValidity(selectIsValid) {
    const helperTextIsPersistent = this.adapter_.hasClass(cssClasses.HELPER_TEXT_PERSISTENT);
    const helperTextIsValidationMsg = this.adapter_.hasClass(cssClasses.HELPER_TEXT_VALIDATION_MSG);
    const validationMsgNeedsDisplay = helperTextIsValidationMsg && !selectIsValid;

    if (validationMsgNeedsDisplay) {
      this.adapter_.setAttr(strings$1.ROLE, 'alert');
    } else {
      this.adapter_.removeAttr(strings$1.ROLE);
    }

    if (!helperTextIsPersistent && !validationMsgNeedsDisplay) {
      this.hide_();
    }
  }

  /**
   * Hides the help text from screen readers.
   * @private
   */
  hide_() {
    this.adapter_.setAttr(strings$1.ARIA_HIDDEN, 'true');
  }
}

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

/**
 * @extends {MDCComponent<!MDCSelectHelperTextFoundation>}
 * @final
 */
class MDCSelectHelperText extends MDCComponent {
  /**
   * @param {!Element} root
   * @return {!MDCSelectHelperText}
   */
  static attachTo(root) {
    return new MDCSelectHelperText(root);
  }

  /**
   * @return {!MDCSelectHelperTextFoundation}
   */
  get foundation() {
    return this.foundation_;
  }

  /**
   * @return {!MDCSelectHelperTextFoundation}
   */
  getDefaultFoundation() {
    return new MDCSelectHelperTextFoundation(/** @type {!MDCSelectHelperTextAdapter} */ (Object.assign({
      addClass: (className) => this.root_.classList.add(className),
      removeClass: (className) => this.root_.classList.remove(className),
      hasClass: (className) => this.root_.classList.contains(className),
      setAttr: (attr, value) => this.root_.setAttribute(attr, value),
      removeAttr: (attr) => this.root_.removeAttribute(attr),
      setContent: (content) => {
        this.root_.textContent = content;
      },
    })));
  }
}

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
/* eslint-enable no-unused-vars */

/**
 * @typedef {{
 *   leadingIcon: (!MDCSelectIconFoundation|undefined),
 *   helperText: (!MDCSelectHelperTextFoundation|undefined),
 * }}
 */
let FoundationMapType;

/**
 * Adapter for MDC Select. Provides an interface for managing
 * - classes
 * - dom
 * - event handlers
 *
 * Additionally, provides type information for the adapter to the Closure
 * compiler.
 *
 * Implement this adapter for your framework of choice to delegate updates to
 * the component in your framework of choice. See architecture documentation
 * for more details.
 * https://github.com/material-components/material-components-web/blob/master/docs/code/architecture.md
 *
 * @record
 */

class MDCSelectAdapter {
  /**
   * Adds class to root element.
   * @param {string} className
   */
  addClass(className) {}

  /**
   * Removes a class from the root element.
   * @param {string} className
   */
  removeClass(className) {}

  /**
   * Returns true if the root element contains the given class name.
   * @param {string} className
   * @return {boolean}
   */
  hasClass(className) {}

  /**
   * Activates the bottom line, showing a focused state.
   */
  activateBottomLine() {}

  /**
   * Deactivates the bottom line.
   */
  deactivateBottomLine() {}

  /**
   * Sets the value of the select.
   * @param {string} value
   */
  setValue(value) {}

  /**
   * Returns the selected value of the select element.
   * @return {string}
   */
  getValue() {}

  /**
   * Floats label determined based off of the shouldFloat argument.
   * @param {boolean} shouldFloat
   */
  floatLabel(shouldFloat) {}

  /**
   * Returns width of label in pixels, if the label exists.
   * @return {number}
   */
  getLabelWidth() {}

  /**
   * Returns true if outline element exists, false if it doesn't.
   * @return {boolean}
   */
  hasOutline() {}

  /**
   * Only implement if outline element exists.
   * @param {number} labelWidth
   */
  notchOutline(labelWidth) {}

  /**
   * Closes notch in outline element, if the outline exists.
   */
  closeOutline() {}

  /**
   * Opens the menu.
   */
  openMenu() {}

  /**
   * Closes the menu.
   */
  closeMenu() {}

  /**
   * Returns true if the menu is currently open.
   * @return {boolean}
   */
  isMenuOpen() {}

  /**
   * Sets the selected index of the select to the index provided.
   * @param {number} index
   */
  setSelectedIndex(index) {}

  /**
   * Sets the select to disabled.
   * @param {boolean} isDisabled
   */
  setDisabled(isDisabled) {}

  /**
   * Sets the line ripple transform origin center.
   * @param {number} normalizedX
   */
  setRippleCenter(normalizedX) {}

  /**
   * Emits a change event when an element is selected.
   * @param {string} value
   */
  notifyChange(value) {}

  /**
   * Checks if the select is currently valid.
   * @return {boolean} isValid
   */
  checkValidity() {}

  /**
   * Adds/Removes the invalid class.
   * @param {boolean} isValid
   */
  setValid(isValid) {}
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

/** @enum {string} */
const cssClasses$1 = {
  DISABLED: 'mdc-select--disabled',
  ROOT: 'mdc-select',
  OUTLINED: 'mdc-select--outlined',
  FOCUSED: 'mdc-select--focused',
  SELECTED_ITEM_CLASS: 'mdc-list-item--selected',
  WITH_LEADING_ICON: 'mdc-select--with-leading-icon',
  INVALID: 'mdc-select--invalid',
  REQUIRED: 'mdc-select--required',
};

/** @enum {string} */
const strings$2 = {
  ARIA_CONTROLS: 'aria-controls',
  CHANGE_EVENT: 'MDCSelect:change',
  SELECTED_ITEM_SELECTOR: `.${cssClasses$1.SELECTED_ITEM_CLASS}`,
  LEADING_ICON_SELECTOR: '.mdc-select__icon',
  SELECTED_TEXT_SELECTOR: '.mdc-select__selected-text',
  HIDDEN_INPUT_SELECTOR: 'input[type="hidden"]',
  MENU_SELECTOR: '.mdc-select__menu',
  LINE_RIPPLE_SELECTOR: '.mdc-line-ripple',
  LABEL_SELECTOR: '.mdc-floating-label',
  NATIVE_CONTROL_SELECTOR: '.mdc-select__native-control',
  OUTLINE_SELECTOR: '.mdc-notched-outline',
  ENHANCED_VALUE_ATTR: 'data-value',
  ARIA_SELECTED_ATTR: 'aria-selected',
};

/** @enum {number} */
const numbers = {
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

/**
 * @extends {MDCFoundation<!MDCSelectAdapter>}
 * @final
 */
class MDCSelectFoundation extends MDCFoundation {
  /** @return enum {string} */
  static get cssClasses() {
    return cssClasses$1;
  }

  /** @return enum {number} */
  static get numbers() {
    return numbers;
  }

  /** @return enum {string} */
  static get strings() {
    return strings$2;
  }

  /**
   * {@see MDCSelectAdapter} for typing information on parameters and return
   * types.
   * @return {!MDCSelectAdapter}
   */
  static get defaultAdapter() {
    return /** @type {!MDCSelectAdapter} */ ({
      addClass: (/* className: string */) => {},
      removeClass: (/* className: string */) => {},
      hasClass: (/* className: string */) => false,
      activateBottomLine: () => {},
      deactivateBottomLine: () => {},
      setValue: () => {},
      getValue: () => {},
      floatLabel: (/* value: boolean */) => {},
      getLabelWidth: () => {},
      hasOutline: () => false,
      notchOutline: (/* labelWidth: number, */) => {},
      closeOutline: () => {},
      openMenu: () => {},
      closeMenu: () => {},
      isMenuOpen: () => {},
      setSelectedIndex: () => {},
      setDisabled: () => {},
      setRippleCenter: () => {},
      notifyChange: () => {},
      checkValidity: () => {},
      setValid: () => {},
    });
  }

  /**
   * @param {!MDCSelectAdapter} adapter
   * @param {!FoundationMapType=} foundationMap Map from subcomponent names to their subfoundations.
   */
  constructor(adapter, foundationMap = /** @type {!FoundationMapType} */ ({})) {
    super(Object.assign(MDCSelectFoundation.defaultAdapter, adapter));

    /** @type {!MDCSelectIconFoundation|undefined} */
    this.leadingIcon_ = foundationMap.leadingIcon;
    /** @type {!MDCSelectHelperTextFoundation|undefined} */
    this.helperText_ = foundationMap.helperText;
  }

  setSelectedIndex(index) {
    this.adapter_.setSelectedIndex(index);
    this.adapter_.closeMenu();
    const didChange = true;
    this.handleChange(didChange);
  }

  setValue(value) {
    this.adapter_.setValue(value);
    const didChange = true;
    this.handleChange(didChange);
  }

  getValue() {
    return this.adapter_.getValue();
  }

  setDisabled(isDisabled) {
    isDisabled ? this.adapter_.addClass(cssClasses$1.DISABLED) : this.adapter_.removeClass(cssClasses$1.DISABLED);
    this.adapter_.setDisabled(isDisabled);
    this.adapter_.closeMenu();

    if (this.leadingIcon_) {
      this.leadingIcon_.setDisabled(isDisabled);
    }
  }

  /**
   * @param {string} content Sets the content of the helper text.
   */
  setHelperTextContent(content) {
    if (this.helperText_) {
      this.helperText_.setContent(content);
    }
  }

  layout() {
    const openNotch = this.getValue().length > 0;
    this.notchOutline(openNotch);
  }

  /**
   * Handles value changes, via change event or programmatic updates.
   */
  handleChange(didChange = true) {
    const value = this.getValue();
    const optionHasValue = value.length > 0;
    const isRequired = this.adapter_.hasClass(cssClasses$1.REQUIRED);

    this.notchOutline(optionHasValue);

    if (!this.adapter_.hasClass(cssClasses$1.FOCUSED)) {
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
  }

  /**
   * Handles focus events from select element.
   */
  handleFocus() {
    this.adapter_.addClass(cssClasses$1.FOCUSED);
    this.adapter_.floatLabel(true);
    this.notchOutline(true);
    this.adapter_.activateBottomLine();
    if (this.helperText_) {
      this.helperText_.showToScreenReader();
    }
  }

  /**
   * Handles blur events from select element.
   */
  handleBlur() {
    if (this.adapter_.isMenuOpen()) return;
    this.adapter_.removeClass(cssClasses$1.FOCUSED);
    this.handleChange(false);
    this.adapter_.deactivateBottomLine();

    const isRequired = this.adapter_.hasClass(cssClasses$1.REQUIRED);

    if (isRequired) {
      this.setValid(this.isValid());
      if (this.helperText_) {
        this.helperText_.setValidity(this.isValid());
      }
    }
  }

  handleClick(normalizedX) {
    if (this.adapter_.isMenuOpen()) return;
    this.adapter_.setRippleCenter(normalizedX);

    this.adapter_.openMenu();
  }

  handleKeydown(event) {
    if (this.adapter_.isMenuOpen()) return;

    const isEnter = event.key === 'Enter' || event.keyCode === 13;
    const isSpace = event.key === 'Space' || event.keyCode === 32;
    const arrowUp = event.key === 'ArrowUp' || event.keyCode === 38;
    const arrowDown = event.key === 'ArrowDown' || event.keyCode === 40;

    if (this.adapter_.hasClass(cssClasses$1.FOCUSED) && (isEnter || isSpace || arrowUp || arrowDown)) {
      this.adapter_.openMenu();
      event.preventDefault();
    }
  }

  /**
   * Opens/closes the notched outline.
   * @param {boolean} openNotch
   */
  notchOutline(openNotch) {
    if (!this.adapter_.hasOutline()) {
      return;
    }
    const isFocused = this.adapter_.hasClass(cssClasses$1.FOCUSED);

    if (openNotch) {
      const labelScale = numbers.LABEL_SCALE;
      const labelWidth = this.adapter_.getLabelWidth() * labelScale;
      this.adapter_.notchOutline(labelWidth);
    } else if (!isFocused) {
      this.adapter_.closeOutline();
    }
  }

  /**
   * Sets the aria label of the leading icon.
   * @param {string} label
   */
  setLeadingIconAriaLabel(label) {
    if (this.leadingIcon_) {
      this.leadingIcon_.setAriaLabel(label);
    }
  }

  /**
   * Sets the text content of the leading icon.
   * @param {string} content
   */
  setLeadingIconContent(content) {
    if (this.leadingIcon_) {
      this.leadingIcon_.setContent(content);
    }
  }

  setValid(isValid) {
    this.adapter_.setValid(isValid);
  }

  isValid() {
    return this.adapter_.checkValidity();
  }
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

const VALIDATION_ATTR_WHITELIST = ['required', 'aria-required'];

/**
 * @extends MDCComponent<!MDCSelectFoundation>
 */
class MDCSelect extends MDCComponent {
  /**
   * @param {...?} args
   */
  constructor(...args) {
    super(...args);
    /** @private {?Element} */
    this.nativeControl_;
    /** @private {?Element} */
    this.selectedText_;
    /** @private {?Element} */
    this.hiddenInput_;
    /** @private {?MDCSelectIcon} */
    this.leadingIcon_;
    /** @private {?MDCSelectHelperText} */
    this.helperText_;
    /** @private {?Element} */
    this.menuElement_;
    /** @type {?MDCMenu} */
    this.menu_;
    /** @type {?MDCRipple} */
    this.ripple;
    /** @private {?MDCLineRipple} */
    this.lineRipple_;
    /** @private {?MDCFloatingLabel} */
    this.label_;
    /** @private {?MDCNotchedOutline} */
    this.outline_;
    /** @private {!Function} */
    this.handleChange_;
    /** @private {!Function} */
    this.handleFocus_;
    /** @private {!Function} */
    this.handleBlur_;
    /** @private {!Function} */
    this.handleClick_;
    /** @private {!Function} */
    this.handleKeydown_;
    /** @private {!Function} */
    this.handleMenuOpened_;
    /** @private {!Function} */
    this.handleMenuClosed_;
    /** @private {!Function} */
    this.handleMenuSelected_;
    /** @private {boolean} */
    this.menuOpened_ = false;
    /** @private {!MutationObserver} */
    this.validationObserver_;
  }

  /**
   * @param {!Element} root
   * @return {!MDCSelect}
   */
  static attachTo(root) {
    return new MDCSelect(root);
  }

  /**
   * @return {string} The value of the select.
   */
  get value() {
    return this.foundation_.getValue();
  }

  /**
   * @param {string} value The value to set on the select.
   */
  set value(value) {
    this.foundation_.setValue(value);
  }

  /**
   * @return {number} The selected index of the select.
   */
  get selectedIndex() {
    let selectedIndex;
    if (this.menuElement_) {
      const selectedEl = /** @type {!HTMLElement} */ (this.menuElement_.querySelector(strings$2.SELECTED_ITEM_SELECTOR));
      selectedIndex = this.menu_.items.indexOf(selectedEl);
    } else {
      selectedIndex = this.nativeControl_.selectedIndex;
    }
    return selectedIndex;
  }

  /**
   * @param {number} selectedIndex The index of the option to be set on the select.
   */
  set selectedIndex(selectedIndex) {
    this.foundation_.setSelectedIndex(selectedIndex);
  }

  /**
   * @return {boolean} True if the select is disabled.
   */
  get disabled() {
    return this.root_.classList.contains(cssClasses$1.DISABLED) ||
      (this.nativeControl_ ? this.nativeControl_.disabled : false);
  }

  /**
   * @param {boolean} disabled Sets the select disabled or enabled.
   */
  set disabled(disabled) {
    this.foundation_.setDisabled(disabled);
  }

  /**
   * Sets the aria label of the leading icon.
   * @param {string} label
   */
  set leadingIconAriaLabel(label) {
    this.foundation_.setLeadingIconAriaLabel(label);
  }

  /**
   * Sets the text content of the leading icon.
   * @param {string} content
   */
  set leadingIconContent(content) {
    this.foundation_.setLeadingIconContent(content);
  }

  /**
   * Sets the text content of the helper text.
   * @param {string} content
   */
  set helperTextContent(content) {
    this.foundation_.setHelperTextContent(content);
  }

  /**
   * Sets the current invalid state of the select.
   * @param {boolean} isValid
   */
  set valid(isValid) {
    this.foundation_.setValid(isValid);
  }

  /**
   * Checks if the select is in a valid state.
   * @return {boolean}
   */
  get valid() {
    return this.foundation_.isValid();
  }

  /**
   * Sets the control to the required state.
   * @param {boolean} isRequired
   */
  set required(isRequired) {
    if (this.nativeControl_) {
      this.nativeControl_.required = isRequired;
    } else {
      if (isRequired) {
        this.selectedText_.setAttribute('aria-required', isRequired.toString());
      } else {
        this.selectedText_.removeAttribute('aria-required');
      }
    }
  }

  /**
   * Returns whether the select is required.
   * @return {boolean}
   */
  get required() {
    if (this.nativeControl_) {
      return this.nativeControl_.required;
    } else {
      return this.selectedText_.getAttribute('aria-required') === 'true';
    }
  }

  /**
   * Recomputes the outline SVG path for the outline element.
   */
  layout() {
    this.foundation_.layout();
  }


  /**
   * @param {(function(!Element): !MDCLineRipple)=} lineRippleFactory A function which creates a new MDCLineRipple.
   * @param {(function(!Element): !MDCFloatingLabel)=} labelFactory A function which creates a new MDCFloatingLabel.
   * @param {(function(!Element): !MDCNotchedOutline)=} outlineFactory A function which creates a new MDCNotchedOutline.
   * @param {(function(!Element): !MDCMenu)=} menuFactory A function which creates a new MDCMenu.
   * @param {(function(!Element): !MDCSelectIcon)=} iconFactory A function which creates a new MDCSelectIcon.
   * @param {(function(!Element): !MDCSelectHelperText)=} helperTextFactory A function which creates a new
   * MDCSelectHelperText.
   */
  initialize(
    labelFactory = (el) => new MDCFloatingLabel(el),
    lineRippleFactory = (el) => new MDCLineRipple(el),
    outlineFactory = (el) => new MDCNotchedOutline(el),
    menuFactory = (el) => new MDCMenu(el),
    iconFactory = (el) => new MDCSelectIcon(el),
    helperTextFactory = (el) => new MDCSelectHelperText(el)) {
    this.nativeControl_ = /** @type {HTMLElement} */ (this.root_.querySelector(strings$2.NATIVE_CONTROL_SELECTOR));
    this.selectedText_ = /** @type {HTMLElement} */ (this.root_.querySelector(strings$2.SELECTED_TEXT_SELECTOR));

    if (this.selectedText_) {
      this.enhancedSelectSetup_(menuFactory);
    }

    const labelElement = this.root_.querySelector(strings$2.LABEL_SELECTOR);
    if (labelElement) {
      this.label_ = labelFactory(labelElement);
    }
    const lineRippleElement = this.root_.querySelector(strings$2.LINE_RIPPLE_SELECTOR);
    if (lineRippleElement) {
      this.lineRipple_ = lineRippleFactory(lineRippleElement);
    }
    const outlineElement = this.root_.querySelector(strings$2.OUTLINE_SELECTOR);
    if (outlineElement) {
      this.outline_ = outlineFactory(outlineElement);
    }

    const leadingIcon = this.root_.querySelector(strings$2.LEADING_ICON_SELECTOR);
    if (leadingIcon) {
      this.root_.classList.add(cssClasses$1.WITH_LEADING_ICON);
      this.leadingIcon_ = iconFactory(leadingIcon);

      if (this.menuElement_) {
        this.menuElement_.classList.add(cssClasses$1.WITH_LEADING_ICON);
      }
    }
    const element = this.nativeControl_ ? this.nativeControl_ : this.selectedText_;
    if (element.hasAttribute(strings$2.ARIA_CONTROLS)) {
      const helperTextElement = document.getElementById(element.getAttribute(strings$2.ARIA_CONTROLS));
      if (helperTextElement) {
        this.helperText_ = helperTextFactory(helperTextElement);
      }
    }

    if (!this.root_.classList.contains(cssClasses$1.OUTLINED)) {
      this.ripple = this.initRipple_();
    }

    // The required state needs to be sync'd before the mutation observer is added.
    this.initialSyncRequiredState_();
    this.addMutationObserverForRequired_();
  }

  /**
   * Handles setup for the enhanced menu.
   * @private
   */
  enhancedSelectSetup_(menuFactory) {
    const isDisabled = this.root_.classList.contains(cssClasses$1.DISABLED);
    this.selectedText_.setAttribute('tabindex', isDisabled ? '-1' : '0');
    this.hiddenInput_ = this.root_.querySelector(strings$2.HIDDEN_INPUT_SELECTOR);
    this.menuElement_ = /** @type {HTMLElement} */ (this.root_.querySelector(strings$2.MENU_SELECTOR));
    this.menu_ = menuFactory(this.menuElement_);
    this.menu_.hoistMenuToBody();
    this.menu_.setAnchorElement(/** @type {!HTMLElement} */ (this.root_));
    this.menu_.setAnchorCorner(Corner.BOTTOM_START);
    this.menu_.wrapFocus = false;
  }

  /**
   * @private
   * @return {!MDCRipple}
   */
  initRipple_() {
    const element = this.nativeControl_ ? this.nativeControl_ : this.selectedText_;
    const adapter = Object.assign(MDCRipple.createAdapter(this), {
      registerInteractionHandler: (type, handler) => element.addEventListener(type, handler),
      deregisterInteractionHandler: (type, handler) => element.removeEventListener(type, handler),
    });
    const foundation = new MDCRippleFoundation(adapter);
    return new MDCRipple(this.root_, foundation);
  }

  /**
   * Initializes the select's event listeners and internal state based
   * on the environment's state.
   */
  initialSyncWithDOM() {
    this.handleChange_ = () => this.foundation_.handleChange(/* didChange */ true);
    this.handleFocus_ = () => this.foundation_.handleFocus();
    this.handleBlur_ = () => this.foundation_.handleBlur();
    this.handleClick_ = (evt) => {
      if (this.selectedText_) this.selectedText_.focus();
      this.foundation_.handleClick(this.getNormalizedXCoordinate_(evt));
    };
    this.handleKeydown_ = (evt) => this.foundation_.handleKeydown(evt);
    this.handleMenuSelected_ = (evtData) => this.selectedIndex = evtData.detail.index;
    this.handleMenuOpened_ = () => {
      // Menu should open to the last selected element.
      if (this.selectedIndex >= 0) {
        this.menu_.items[this.selectedIndex].focus();
      }
    };
    this.handleMenuClosed_ = () => {
      // menuOpened_ is used to track the state of the menu opening or closing since the menu.open function
      // will return false if the menu is still closing and this method listens to the closed event which
      // occurs after the menu is already closed.
      this.menuOpened_ = false;
      this.selectedText_.removeAttribute('aria-expanded');
      if (document.activeElement !== this.selectedText_) {
        this.foundation_.handleBlur();
      }
    };

    const element = this.nativeControl_ ? this.nativeControl_ : this.selectedText_;

    element.addEventListener('change', this.handleChange_);
    element.addEventListener('focus', this.handleFocus_);
    element.addEventListener('blur', this.handleBlur_);

    ['mousedown', 'touchstart'].forEach((evtType) => {
      element.addEventListener(evtType, this.handleClick_);
    });

    if (this.menuElement_) {
      this.selectedText_.addEventListener('keydown', this.handleKeydown_);
      this.menu_.listen(strings$3.CLOSED_EVENT, this.handleMenuClosed_);
      this.menu_.listen(strings$3.OPENED_EVENT, this.handleMenuOpened_);
      this.menu_.listen(strings$4.SELECTED_EVENT, this.handleMenuSelected_);

      if (this.hiddenInput_ && this.hiddenInput_.value) {
        // If the hidden input already has a value, use it to restore the select's value.
        // This can happen e.g. if the user goes back or (in some browsers) refreshes the page.
        const enhancedAdapterMethods = this.getEnhancedSelectAdapterMethods_();
        enhancedAdapterMethods.setValue(this.hiddenInput_.value);
      } else if (this.menuElement_.querySelector(strings$2.SELECTED_ITEM_SELECTOR)) {
        // If an element is selected, the select should set the initial selected text.
        const enhancedAdapterMethods = this.getEnhancedSelectAdapterMethods_();
        enhancedAdapterMethods.setValue(enhancedAdapterMethods.getValue());
      }
    }

    // Initially sync floating label
    this.foundation_.handleChange(/* didChange */ false);

    if (this.root_.classList.contains(cssClasses$1.DISABLED)
      || (this.nativeControl_ && this.nativeControl_.disabled)) {
      this.disabled = true;
    }
  }

  destroy() {
    const element = this.nativeControl_ ? this.nativeControl_ : this.selectedText_;

    element.removeEventListener('change', this.handleChange_);
    element.removeEventListener('focus', this.handleFocus_);
    element.removeEventListener('blur', this.handleBlur_);
    element.removeEventListener('keydown', this.handleKeydown_);
    ['mousedown', 'touchstart'].forEach((evtType) => {
      element.removeEventListener(evtType, this.handleClick_);
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

    super.destroy();
  }

  /**
   * @return {!MDCSelectFoundation}
   */
  getDefaultFoundation() {
    return new MDCSelectFoundation(
      /** @type {!MDCSelectAdapter} */ (Object.assign(
        this.nativeControl_ ? this.getNativeSelectAdapterMethods_() : this.getEnhancedSelectAdapterMethods_(),
        this.getCommonAdapterMethods_(),
        this.getOutlineAdapterMethods_(),
        this.getLabelAdapterMethods_())
      ),
      this.getFoundationMap_()
    );
  }

  /**
   * @return {!{
   *   getValue: function(): string,
   *   setValue: function(string): string,
   *   openMenu: function(): void,
   *   closeMenu: function(): void,
   *   isMenuOpen: function(): boolean,
   *   setSelectedIndex: function(number): void,
   *   setDisabled: function(boolean): void
   * }}
   * @private
   */
  getNativeSelectAdapterMethods_() {
    return {
      getValue: () => this.nativeControl_.value,
      setValue: (value) => this.nativeControl_.value = value,
      openMenu: () => {},
      closeMenu: () => {},
      isMenuOpen: () => false,
      setSelectedIndex: (index) => {
        this.nativeControl_.selectedIndex = index;
      },
      setDisabled: (isDisabled) => this.nativeControl_.disabled = isDisabled,
      setValid: (isValid) => {
        isValid ? this.root_.classList.remove(cssClasses$1.INVALID) : this.root_.classList.add(cssClasses$1.INVALID);
      },
      checkValidity: () => this.nativeControl_.checkValidity(),
    };
  }

  /**
   * @return {!{
   *   getValue: function(): string,
   *   setValue: function(string): string,
   *   openMenu: function(): void,
   *   closeMenu: function(): void,
   *   isMenuOpen: function(): boolean,
   *   setSelectedIndex: function(number): void,
   *   setDisabled: function(boolean): void
   * }}
   * @private
   */
  getEnhancedSelectAdapterMethods_() {
    return {
      getValue: () => {
        const listItem = this.menuElement_.querySelector(strings$2.SELECTED_ITEM_SELECTOR);
        if (listItem && listItem.hasAttribute(strings$2.ENHANCED_VALUE_ATTR)) {
          return listItem.getAttribute(strings$2.ENHANCED_VALUE_ATTR);
        }
        return '';
      },
      setValue: (value) => {
        const element =
          /** @type {HTMLElement} */ (this.menuElement_.querySelector(`[${strings$2.ENHANCED_VALUE_ATTR}="${value}"]`));
        this.setEnhancedSelectedIndex_(element ? this.menu_.items.indexOf(element) : -1);
      },
      openMenu: () => {
        if (this.menu_ && !this.menu_.open) {
          this.menu_.open = true;
          this.menuOpened_ = true;
          this.selectedText_.setAttribute('aria-expanded', 'true');
        }
      },
      closeMenu: () => {
        if (this.menu_ && this.menu_.open) {
          this.menu_.open = false;
        }
      },
      isMenuOpen: () => this.menu_ && this.menuOpened_,
      setSelectedIndex: (index) => {
        this.setEnhancedSelectedIndex_(index);
      },
      setDisabled: (isDisabled) => {
        this.selectedText_.setAttribute('tabindex', isDisabled ? '-1' : '0');
        this.selectedText_.setAttribute('aria-disabled', isDisabled.toString());
        if (this.hiddenInput_) {
          this.hiddenInput_.disabled = isDisabled;
        }
      },
      checkValidity: () => {
        const classList = this.root_.classList;
        if (classList.contains(cssClasses$1.REQUIRED) && !classList.contains(cssClasses$1.DISABLED)) {
          // See notes for required attribute under https://www.w3.org/TR/html52/sec-forms.html#the-select-element
          // TL;DR: Invalid if no index is selected, or if the first index is selected and has an empty value.
          return this.selectedIndex !== -1 && (this.selectedIndex !== 0 || this.value);
        } else {
          return true;
        }
      },
      setValid: (isValid) => {
        this.selectedText_.setAttribute('aria-invalid', (!isValid).toString());
        isValid ? this.root_.classList.remove(cssClasses$1.INVALID) : this.root_.classList.add(cssClasses$1.INVALID);
      },
    };
  }

  /**
   * @return {!{
   *   addClass: function(string): void,
   *   removeClass: function(string): void,
   *   hasClass: function(string): void,
   *   setRippleCenter: function(number): void,
   *   activateBottomLine: function(): void,
   *   deactivateBottomLine: function(): void,
   *   notifyChange: function(string): void
   * }}
   * @private
   */
  getCommonAdapterMethods_() {
    return {
      addClass: (className) => this.root_.classList.add(className),
      removeClass: (className) => this.root_.classList.remove(className),
      hasClass: (className) => this.root_.classList.contains(className),
      setRippleCenter: (normalizedX) => this.lineRipple_ && this.lineRipple_.setRippleCenter(normalizedX),
      activateBottomLine: () => this.lineRipple_ && this.lineRipple_.activate(),
      deactivateBottomLine: () => this.lineRipple_ && this.lineRipple_.deactivate(),
      notifyChange: (value) => {
        const index = this.selectedIndex;
        this.emit(strings$2.CHANGE_EVENT, {value, index}, true /* shouldBubble  */);
      },
    };
  }

  /**
   * @return {!{
   *   hasOutline: function(): boolean,
   *   notchOutline: function(number, boolean): undefined,
   *   closeOutline: function(): undefined,
   * }}
   */
  getOutlineAdapterMethods_() {
    return {
      hasOutline: () => !!this.outline_,
      notchOutline: (labelWidth) => {
        if (this.outline_) {
          this.outline_.notch(labelWidth);
        }
      },
      closeOutline: () => {
        if (this.outline_) {
          this.outline_.closeNotch();
        }
      },
    };
  }

  /**
   * @return {!{
   *   floatLabel: function(boolean): undefined,
   *   getLabelWidth: function(): number,
   * }}
   */
  getLabelAdapterMethods_() {
    return {
      floatLabel: (shouldFloat) => {
        if (this.label_) {
          this.label_.float(shouldFloat);
        }
      },
      getLabelWidth: () => {
        return this.label_ ? this.label_.getWidth() : 0;
      },
    };
  }

  /**
   * Calculates where the line ripple should start based on the x coordinate within the component.
   * @param {!(MouseEvent|TouchEvent)} evt
   * @return {number} normalizedX
   */
  getNormalizedXCoordinate_(evt) {
    const targetClientRect = evt.target.getBoundingClientRect();
    const xCoordinate = evt.clientX;
    return xCoordinate - targetClientRect.left;
  }

  /**
   * Returns a map of all subcomponents to subfoundations.
   * @return {!FoundationMapType}
   */
  getFoundationMap_() {
    return {
      leadingIcon: this.leadingIcon_ ? this.leadingIcon_.foundation : undefined,
      helperText: this.helperText_ ? this.helperText_.foundation : undefined,
    };
  }

  /**
   * Sets the selected index of the enhanced menu.
   * @param {number} index
   * @private
   */
  setEnhancedSelectedIndex_(index) {
    const selectedItem = this.menu_.items[index];
    this.selectedText_.textContent = selectedItem ? selectedItem.textContent.trim() : '';
    const previouslySelected = this.menuElement_.querySelector(strings$2.SELECTED_ITEM_SELECTOR);

    if (previouslySelected) {
      previouslySelected.classList.remove(cssClasses$1.SELECTED_ITEM_CLASS);
      previouslySelected.removeAttribute(strings$2.ARIA_SELECTED_ATTR);
    }

    if (selectedItem) {
      selectedItem.classList.add(cssClasses$1.SELECTED_ITEM_CLASS);
      selectedItem.setAttribute(strings$2.ARIA_SELECTED_ATTR, 'true');
    }

    // Synchronize hidden input's value with data-value attribute of selected item.
    // This code path is also followed when setting value directly, so this covers all cases.
    if (this.hiddenInput_) {
      this.hiddenInput_.value = selectedItem ? selectedItem.getAttribute(strings$2.ENHANCED_VALUE_ATTR) || '' : '';
    }

    this.layout();
  }

  initialSyncRequiredState_() {
    const element = this.nativeControl_ ? this.nativeControl_ : this.selectedText_;
    const isRequired = element.required || element.getAttribute('aria-required') === 'true'
      || this.root_.classList.contains(cssClasses$1.REQUIRED);
    if (isRequired) {
      if (this.nativeControl_) {
        this.nativeControl_.required = true;
      } else {
        this.selectedText_.setAttribute('aria-required', 'true');
      }
      this.root_.classList.add(cssClasses$1.REQUIRED);
    }
  }

  addMutationObserverForRequired_() {
    const observerHandler = (attributesList) => {
      attributesList.some((attributeName) => {
        if (VALIDATION_ATTR_WHITELIST.indexOf(attributeName) > -1) {
          if (this.selectedText_) {
            if (this.selectedText_.getAttribute('aria-required') === 'true') {
              this.root_.classList.add(cssClasses$1.REQUIRED);
            } else {
              this.root_.classList.remove(cssClasses$1.REQUIRED);
            }
          } else {
            if (this.nativeControl_.required) {
              this.root_.classList.add(cssClasses$1.REQUIRED);
            } else {
              this.root_.classList.remove(cssClasses$1.REQUIRED);
            }
          }
          return true;
        }
      });
    };

    const getAttributesList = (mutationsList) => mutationsList.map((mutation) => mutation.attributeName);
    const observer = new MutationObserver((mutationsList) => observerHandler(getAttributesList(mutationsList)));
    const element = this.nativeControl_ ? this.nativeControl_ : this.selectedText_;
    observer.observe(element, {attributes: true});
    this.validationObserver_ = observer;
  };
}

class Select {
    constructor() {
        this.disabled = false;
        this.options = [];
        this.onChange = () => {
            const mdcValue = this.mdcSelect.value;
            let value;
            if (mdcValue === '') {
                value = null;
            }
            else {
                value = this.options.find(option => {
                    return mdcValue === option.value;
                });
            }
            this.change.emit(value);
        };
    }
    componentDidLoad() {
        const element = this.limelSelect.shadowRoot.querySelector('.mdc-select');
        this.mdcSelect = new MDCSelect(element);
        this.onChange();
    }
    componentDidUnload() {
        this.mdcSelect.destroy();
    }
    render() {
        return (h("div", { class: `
                    mdc-select
                    ${this.disabled ? 'mdc-select--disabled' : ''}
                ` },
            h("i", { class: "mdc-select__dropdown-icon" }),
            h("select", { onChange: this.onChange, class: "mdc-select__native-control", disabled: this.disabled }, this.options.map(option => {
                return (h("option", { key: option.value, value: option.value, selected: this.value
                        ? option.value === this.value.value
                        : option.value === '', disabled: option.disabled }, option.text));
            })),
            h("label", { class: `
                        mdc-floating-label
                        ${this.value ? 'mdc-floating-label--float-above' : ''}
                    ` }, this.label),
            h("div", { class: "mdc-line-ripple" })));
    }
    optionsWatcher(newOptions) {
        if (newOptions && newOptions.length) {
            setTimeout(() => {
                this.mdcSelect.selectedIndex = 0;
                this.onChange();
            }, 0);
        }
        else {
            this.mdcSelect.value = null;
            this.mdcSelect.selectedIndex = -1;
            this.onChange();
        }
    }
    static get is() { return "limel-select"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
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
        "limelSelect": {
            "elementRef": true
        },
        "mdcSelect": {
            "state": true
        },
        "options": {
            "type": "Any",
            "attr": "options",
            "watchCallbacks": ["optionsWatcher"]
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
    static get style() { return ":host {\n  --mdc-theme-primary: var(--lime-primary-color, #26a69a);\n  --mdc-theme-secondary: var(--lime-secondary-color, #575756);\n  --mdc-theme-on-primary: var(--lime-on-primary-color, #fff);\n  --mdc-theme-on-secondary: var(--lime-on-secondary-color, #fff); }\n\n:root {\n  --mdc-theme-primary: #26a69a;\n  --mdc-theme-secondary: #575756;\n  --mdc-theme-background: #fff;\n  --mdc-theme-surface: #fff;\n  --mdc-theme-error: #b00020;\n  --mdc-theme-on-primary: #fff;\n  --mdc-theme-on-secondary: #fff;\n  --mdc-theme-on-surface: #000;\n  --mdc-theme-on-error: #fff;\n  --mdc-theme-text-primary-on-background: rgba(0, 0, 0, 0.87);\n  --mdc-theme-text-secondary-on-background: rgba(0, 0, 0, 0.54);\n  --mdc-theme-text-hint-on-background: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-disabled-on-background: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-icon-on-background: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-primary-on-light: rgba(0, 0, 0, 0.87);\n  --mdc-theme-text-secondary-on-light: rgba(0, 0, 0, 0.54);\n  --mdc-theme-text-hint-on-light: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-disabled-on-light: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-icon-on-light: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-primary-on-dark: white;\n  --mdc-theme-text-secondary-on-dark: rgba(255, 255, 255, 0.7);\n  --mdc-theme-text-hint-on-dark: rgba(255, 255, 255, 0.5);\n  --mdc-theme-text-disabled-on-dark: rgba(255, 255, 255, 0.5);\n  --mdc-theme-text-icon-on-dark: rgba(255, 255, 255, 0.5); }\n\n.mdc-theme--primary {\n  color: #26a69a !important;\n  /* \@alternate */\n  color: var(--mdc-theme-primary, #26a69a) !important; }\n\n.mdc-theme--secondary {\n  color: #575756 !important;\n  /* \@alternate */\n  color: var(--mdc-theme-secondary, #575756) !important; }\n\n.mdc-theme--background {\n  background-color: #fff;\n  /* \@alternate */\n  background-color: var(--mdc-theme-background, #fff); }\n\n.mdc-theme--surface {\n  background-color: #fff;\n  /* \@alternate */\n  background-color: var(--mdc-theme-surface, #fff); }\n\n.mdc-theme--error {\n  color: #b00020 !important;\n  /* \@alternate */\n  color: var(--mdc-theme-error, #b00020) !important; }\n\n.mdc-theme--on-primary {\n  color: #fff !important;\n  /* \@alternate */\n  color: var(--mdc-theme-on-primary, #fff) !important; }\n\n.mdc-theme--on-secondary {\n  color: #fff !important;\n  /* \@alternate */\n  color: var(--mdc-theme-on-secondary, #fff) !important; }\n\n.mdc-theme--on-surface {\n  color: #000 !important;\n  /* \@alternate */\n  color: var(--mdc-theme-on-surface, #000) !important; }\n\n.mdc-theme--on-error {\n  color: #fff !important;\n  /* \@alternate */\n  color: var(--mdc-theme-on-error, #fff) !important; }\n\n.mdc-theme--text-primary-on-background {\n  color: rgba(0, 0, 0, 0.87) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-primary-on-background, rgba(0, 0, 0, 0.87)) !important; }\n\n.mdc-theme--text-secondary-on-background {\n  color: rgba(0, 0, 0, 0.54) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-secondary-on-background, rgba(0, 0, 0, 0.54)) !important; }\n\n.mdc-theme--text-hint-on-background {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.38)) !important; }\n\n.mdc-theme--text-disabled-on-background {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-disabled-on-background, rgba(0, 0, 0, 0.38)) !important; }\n\n.mdc-theme--text-icon-on-background {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-icon-on-background, rgba(0, 0, 0, 0.38)) !important; }\n\n.mdc-theme--text-primary-on-light {\n  color: rgba(0, 0, 0, 0.87) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-primary-on-light, rgba(0, 0, 0, 0.87)) !important; }\n\n.mdc-theme--text-secondary-on-light {\n  color: rgba(0, 0, 0, 0.54) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-secondary-on-light, rgba(0, 0, 0, 0.54)) !important; }\n\n.mdc-theme--text-hint-on-light {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-hint-on-light, rgba(0, 0, 0, 0.38)) !important; }\n\n.mdc-theme--text-disabled-on-light {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-disabled-on-light, rgba(0, 0, 0, 0.38)) !important; }\n\n.mdc-theme--text-icon-on-light {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-icon-on-light, rgba(0, 0, 0, 0.38)) !important; }\n\n.mdc-theme--text-primary-on-dark {\n  color: white !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-primary-on-dark, white) !important; }\n\n.mdc-theme--text-secondary-on-dark {\n  color: rgba(255, 255, 255, 0.7) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-secondary-on-dark, rgba(255, 255, 255, 0.7)) !important; }\n\n.mdc-theme--text-hint-on-dark {\n  color: rgba(255, 255, 255, 0.5) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-hint-on-dark, rgba(255, 255, 255, 0.5)) !important; }\n\n.mdc-theme--text-disabled-on-dark {\n  color: rgba(255, 255, 255, 0.5) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-disabled-on-dark, rgba(255, 255, 255, 0.5)) !important; }\n\n.mdc-theme--text-icon-on-dark {\n  color: rgba(255, 255, 255, 0.5) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-icon-on-dark, rgba(255, 255, 255, 0.5)) !important; }\n\n.mdc-theme--primary-bg {\n  background-color: #26a69a !important;\n  /* \@alternate */\n  background-color: var(--mdc-theme-primary, #26a69a) !important; }\n\n.mdc-theme--secondary-bg {\n  background-color: #575756 !important;\n  /* \@alternate */\n  background-color: var(--mdc-theme-secondary, #575756) !important; }\n\n.mdc-typography {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased; }\n\n.mdc-typography--headline1 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1rem;\n  line-height: 0.875rem;\n  font-weight: 300;\n  letter-spacing: -0.01562em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--headline2 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1rem;\n  line-height: 0.875rem;\n  font-weight: 300;\n  letter-spacing: -0.00833em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--headline3 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1rem;\n  line-height: 0.875rem;\n  font-weight: 400;\n  letter-spacing: normal;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--headline4 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1rem;\n  line-height: 0.875rem;\n  font-weight: 400;\n  letter-spacing: 0.00735em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--headline5 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.875rem;\n  line-height: 0.875rem;\n  font-weight: 400;\n  letter-spacing: normal;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--headline6 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.875rem;\n  line-height: 0.875rem;\n  font-weight: 500;\n  letter-spacing: 0.0125em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--subtitle1 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.875rem;\n  line-height: 1.125rem;\n  font-weight: 400;\n  letter-spacing: 0.00937em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--subtitle2 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.8125rem;\n  line-height: 1.125rem;\n  font-weight: 500;\n  letter-spacing: 0.00714em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--body1 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.8125rem;\n  line-height: 1.5rem;\n  font-weight: 400;\n  letter-spacing: 0.03125em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--body2 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.8125rem;\n  line-height: 1.625rem;\n  font-weight: 400;\n  letter-spacing: 0.01786em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--caption {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.6875rem;\n  line-height: 0.875rem;\n  font-weight: 400;\n  letter-spacing: 0.03333em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--button {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.875rem;\n  line-height: 2.25rem;\n  font-weight: 500;\n  letter-spacing: 0.08929em;\n  text-decoration: none;\n  text-transform: none; }\n\n.mdc-typography--overline {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.6875rem;\n  line-height: 0.875rem;\n  font-weight: 500;\n  letter-spacing: 0.16667em;\n  text-decoration: none;\n  text-transform: uppercase; }\n\n\@-webkit-keyframes mdc-select-float-native-control {\n  0% {\n    -webkit-transform: translateY(8px);\n    transform: translateY(8px);\n    opacity: 0; }\n  100% {\n    -webkit-transform: translateY(0);\n    transform: translateY(0);\n    opacity: 1; } }\n\n\@keyframes mdc-select-float-native-control {\n  0% {\n    -webkit-transform: translateY(8px);\n    transform: translateY(8px);\n    opacity: 0; }\n  100% {\n    -webkit-transform: translateY(0);\n    transform: translateY(0);\n    opacity: 1; } }\n\n.mdc-line-ripple {\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  height: 2px;\n  -webkit-transform: scaleX(0);\n  transform: scaleX(0);\n  -webkit-transition: opacity 180ms cubic-bezier(0.4, 0, 0.2, 1), -webkit-transform 180ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: opacity 180ms cubic-bezier(0.4, 0, 0.2, 1), -webkit-transform 180ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: transform 180ms cubic-bezier(0.4, 0, 0.2, 1), opacity 180ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: transform 180ms cubic-bezier(0.4, 0, 0.2, 1), opacity 180ms cubic-bezier(0.4, 0, 0.2, 1), -webkit-transform 180ms cubic-bezier(0.4, 0, 0.2, 1);\n  opacity: 0;\n  z-index: 2; }\n\n.mdc-line-ripple--active {\n  -webkit-transform: scaleX(1);\n  transform: scaleX(1);\n  opacity: 1; }\n\n.mdc-line-ripple--deactivating {\n  opacity: 0; }\n\n.mdc-notched-outline {\n  display: -ms-flexbox;\n  display: flex;\n  position: absolute;\n  right: 0;\n  left: 0;\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box;\n  width: 100%;\n  max-width: 100%;\n  height: 100%;\n  /* \@noflip */\n  text-align: left;\n  pointer-events: none; }\n  [dir=\"rtl\"] .mdc-notched-outline, .mdc-notched-outline[dir=\"rtl\"] {\n    /* \@noflip */\n    text-align: right; }\n  .mdc-notched-outline__leading, .mdc-notched-outline__notch, .mdc-notched-outline__trailing {\n    -webkit-box-sizing: border-box;\n    box-sizing: border-box;\n    height: 100%;\n    border-top: 1px solid;\n    border-bottom: 1px solid;\n    pointer-events: none; }\n  .mdc-notched-outline__leading {\n    /* \@noflip */\n    border-left: 1px solid;\n    /* \@noflip */\n    border-right: none;\n    width: 12px; }\n    [dir=\"rtl\"] .mdc-notched-outline__leading, .mdc-notched-outline__leading[dir=\"rtl\"] {\n      /* \@noflip */\n      border-left: none;\n      /* \@noflip */\n      border-right: 1px solid; }\n  .mdc-notched-outline__trailing {\n    /* \@noflip */\n    border-left: none;\n    /* \@noflip */\n    border-right: 1px solid;\n    -ms-flex-positive: 1;\n    flex-grow: 1; }\n    [dir=\"rtl\"] .mdc-notched-outline__trailing, .mdc-notched-outline__trailing[dir=\"rtl\"] {\n      /* \@noflip */\n      border-left: 1px solid;\n      /* \@noflip */\n      border-right: none; }\n  .mdc-notched-outline__notch {\n    -ms-flex: 0 0 auto;\n    flex: 0 0 auto;\n    width: auto;\n    max-width: calc(100% - 12px * 2); }\n  .mdc-notched-outline .mdc-floating-label {\n    display: inline-block;\n    position: relative;\n    top: 17px;\n    bottom: auto;\n    max-width: 100%; }\n  .mdc-notched-outline .mdc-floating-label--float-above {\n    text-overflow: clip; }\n  .mdc-notched-outline--upgraded .mdc-floating-label--float-above {\n    max-width: calc(100% / .75); }\n\n.mdc-notched-outline--notched .mdc-notched-outline__notch {\n  /* \@noflip */\n  padding-left: 0;\n  /* \@noflip */\n  padding-right: 8px;\n  border-top: none; }\n  [dir=\"rtl\"] .mdc-notched-outline--notched .mdc-notched-outline__notch, .mdc-notched-outline--notched .mdc-notched-outline__notch[dir=\"rtl\"] {\n    /* \@noflip */\n    padding-left: 8px;\n    /* \@noflip */\n    padding-right: 0; }\n\n.mdc-notched-outline--no-label .mdc-notched-outline__notch {\n  padding: 0; }\n\n.mdc-floating-label {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.875rem;\n  line-height: 1.125rem;\n  font-weight: 400;\n  letter-spacing: 0.00937em;\n  text-decoration: inherit;\n  text-transform: inherit;\n  position: absolute;\n  /* \@noflip */\n  left: 0;\n  /* \@noflip */\n  -webkit-transform-origin: left top;\n  transform-origin: left top;\n  -webkit-transition: color 150ms cubic-bezier(0.4, 0, 0.2, 1), -webkit-transform 150ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: color 150ms cubic-bezier(0.4, 0, 0.2, 1), -webkit-transform 150ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1), color 150ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1), color 150ms cubic-bezier(0.4, 0, 0.2, 1), -webkit-transform 150ms cubic-bezier(0.4, 0, 0.2, 1);\n  /* \@alternate */\n  line-height: 1.15rem;\n  text-align: left;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  cursor: text;\n  overflow: hidden;\n  will-change: transform; }\n  [dir=\"rtl\"] .mdc-floating-label, .mdc-floating-label[dir=\"rtl\"] {\n    /* \@noflip */\n    right: 0;\n    /* \@noflip */\n    left: auto;\n    /* \@noflip */\n    -webkit-transform-origin: right top;\n    transform-origin: right top;\n    /* \@noflip */\n    text-align: right; }\n\n.mdc-floating-label--float-above {\n  cursor: auto; }\n\n.mdc-floating-label--float-above {\n  -webkit-transform: translateY(-50%) scale(0.75);\n  transform: translateY(-50%) scale(0.75); }\n\n.mdc-floating-label--shake {\n  -webkit-animation: mdc-floating-label-shake-float-above-standard 250ms 1;\n  animation: mdc-floating-label-shake-float-above-standard 250ms 1; }\n\n\@-webkit-keyframes mdc-floating-label-shake-float-above-standard {\n  0% {\n    -webkit-transform: translateX(calc(0 - 0%)) translateY(-50%) scale(0.75);\n    transform: translateX(calc(0 - 0%)) translateY(-50%) scale(0.75); }\n  33% {\n    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    -webkit-transform: translateX(calc(4% - 0%)) translateY(-50%) scale(0.75);\n    transform: translateX(calc(4% - 0%)) translateY(-50%) scale(0.75); }\n  66% {\n    -webkit-animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    -webkit-transform: translateX(calc(-4% - 0%)) translateY(-50%) scale(0.75);\n    transform: translateX(calc(-4% - 0%)) translateY(-50%) scale(0.75); }\n  100% {\n    -webkit-transform: translateX(calc(0 - 0%)) translateY(-50%) scale(0.75);\n    transform: translateX(calc(0 - 0%)) translateY(-50%) scale(0.75); } }\n\n\@keyframes mdc-floating-label-shake-float-above-standard {\n  0% {\n    -webkit-transform: translateX(calc(0 - 0%)) translateY(-50%) scale(0.75);\n    transform: translateX(calc(0 - 0%)) translateY(-50%) scale(0.75); }\n  33% {\n    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    -webkit-transform: translateX(calc(4% - 0%)) translateY(-50%) scale(0.75);\n    transform: translateX(calc(4% - 0%)) translateY(-50%) scale(0.75); }\n  66% {\n    -webkit-animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    -webkit-transform: translateX(calc(-4% - 0%)) translateY(-50%) scale(0.75);\n    transform: translateX(calc(-4% - 0%)) translateY(-50%) scale(0.75); }\n  100% {\n    -webkit-transform: translateX(calc(0 - 0%)) translateY(-50%) scale(0.75);\n    transform: translateX(calc(0 - 0%)) translateY(-50%) scale(0.75); } }\n\n\@-webkit-keyframes mdc-ripple-fg-radius-in {\n  from {\n    -webkit-animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n    -webkit-transform: translate(var(--mdc-ripple-fg-translate-start, 0)) scale(1);\n    transform: translate(var(--mdc-ripple-fg-translate-start, 0)) scale(1); }\n  to {\n    -webkit-transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1));\n    transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1)); } }\n\n\@keyframes mdc-ripple-fg-radius-in {\n  from {\n    -webkit-animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n    -webkit-transform: translate(var(--mdc-ripple-fg-translate-start, 0)) scale(1);\n    transform: translate(var(--mdc-ripple-fg-translate-start, 0)) scale(1); }\n  to {\n    -webkit-transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1));\n    transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1)); } }\n\n\@-webkit-keyframes mdc-ripple-fg-opacity-in {\n  from {\n    -webkit-animation-timing-function: linear;\n    animation-timing-function: linear;\n    opacity: 0; }\n  to {\n    opacity: var(--mdc-ripple-fg-opacity, 0); } }\n\n\@keyframes mdc-ripple-fg-opacity-in {\n  from {\n    -webkit-animation-timing-function: linear;\n    animation-timing-function: linear;\n    opacity: 0; }\n  to {\n    opacity: var(--mdc-ripple-fg-opacity, 0); } }\n\n\@-webkit-keyframes mdc-ripple-fg-opacity-out {\n  from {\n    -webkit-animation-timing-function: linear;\n    animation-timing-function: linear;\n    opacity: var(--mdc-ripple-fg-opacity, 0); }\n  to {\n    opacity: 0; } }\n\n\@keyframes mdc-ripple-fg-opacity-out {\n  from {\n    -webkit-animation-timing-function: linear;\n    animation-timing-function: linear;\n    opacity: var(--mdc-ripple-fg-opacity, 0); }\n  to {\n    opacity: 0; } }\n\n.mdc-ripple-surface--test-edge-var-bug {\n  --mdc-ripple-surface-test-edge-var: 1px solid #000;\n  visibility: hidden; }\n  .mdc-ripple-surface--test-edge-var-bug::before {\n    border: var(--mdc-ripple-surface-test-edge-var); }\n\n.mdc-select--with-leading-icon:not(.mdc-select--disabled) .mdc-select__icon {\n  color: #000;\n  /* \@alternate */\n  color: var(--mdc-theme-on-surface, #000); }\n\n.mdc-select--with-leading-icon .mdc-select__icon {\n  display: inline-block;\n  position: absolute;\n  bottom: 16px;\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box;\n  width: 24px;\n  height: 24px;\n  border: none;\n  background-color: transparent;\n  fill: currentColor;\n  opacity: 0.54;\n  text-decoration: none;\n  cursor: pointer;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n\n.mdc-select__icon:not([tabindex]),\n.mdc-select__icon[tabindex=\"-1\"] {\n  cursor: default;\n  pointer-events: none; }\n\n.mdc-select-helper-text {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.6875rem;\n  line-height: 0.875rem;\n  font-weight: 400;\n  letter-spacing: 0.03333em;\n  text-decoration: inherit;\n  text-transform: inherit;\n  display: block;\n  margin-top: 0;\n  /* \@alternate */\n  line-height: normal;\n  margin: 0;\n  -webkit-transition: opacity 180ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: opacity 180ms cubic-bezier(0.4, 0, 0.2, 1);\n  opacity: 0;\n  will-change: opacity; }\n  .mdc-select-helper-text::before {\n    display: inline-block;\n    width: 0;\n    height: 16px;\n    content: \"\";\n    vertical-align: 0; }\n\n.mdc-select-helper-text--persistent {\n  -webkit-transition: none;\n  transition: none;\n  opacity: 1;\n  will-change: initial; }\n\n.mdc-select {\n  --mdc-ripple-fg-size: 0;\n  --mdc-ripple-left: 0;\n  --mdc-ripple-top: 0;\n  --mdc-ripple-fg-scale: 1;\n  --mdc-ripple-fg-translate-end: 0;\n  --mdc-ripple-fg-translate-start: 0;\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n  will-change: transform, opacity;\n  display: -ms-inline-flexbox;\n  display: inline-flex;\n  position: relative;\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box;\n  height: 56px;\n  overflow: hidden;\n  will-change: opacity, transform, color; }\n  .mdc-select:not(.mdc-select--disabled) {\n    background-color: #fff; }\n  .mdc-select::before, .mdc-select::after {\n    position: absolute;\n    border-radius: 50%;\n    opacity: 0;\n    pointer-events: none;\n    content: \"\"; }\n  .mdc-select::before {\n    -webkit-transition: opacity 15ms linear, background-color 15ms linear;\n    transition: opacity 15ms linear, background-color 15ms linear;\n    z-index: 1; }\n  .mdc-select.mdc-ripple-upgraded::before {\n    -webkit-transform: scale(var(--mdc-ripple-fg-scale, 1));\n    transform: scale(var(--mdc-ripple-fg-scale, 1)); }\n  .mdc-select.mdc-ripple-upgraded::after {\n    top: 0;\n    /* \@noflip */\n    left: 0;\n    -webkit-transform: scale(0);\n    transform: scale(0);\n    -webkit-transform-origin: center center;\n    transform-origin: center center; }\n  .mdc-select.mdc-ripple-upgraded--unbounded::after {\n    top: var(--mdc-ripple-top, 0);\n    /* \@noflip */\n    left: var(--mdc-ripple-left, 0); }\n  .mdc-select.mdc-ripple-upgraded--foreground-activation::after {\n    -webkit-animation: 225ms mdc-ripple-fg-radius-in forwards, 75ms mdc-ripple-fg-opacity-in forwards;\n    animation: 225ms mdc-ripple-fg-radius-in forwards, 75ms mdc-ripple-fg-opacity-in forwards; }\n  .mdc-select.mdc-ripple-upgraded--foreground-deactivation::after {\n    -webkit-animation: 150ms mdc-ripple-fg-opacity-out;\n    animation: 150ms mdc-ripple-fg-opacity-out;\n    -webkit-transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1));\n    transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1)); }\n  .mdc-select::before, .mdc-select::after {\n    top: calc(50% - 100%);\n    /* \@noflip */\n    left: calc(50% - 100%);\n    width: 200%;\n    height: 200%; }\n  .mdc-select.mdc-ripple-upgraded::after {\n    width: var(--mdc-ripple-fg-size, 100%);\n    height: var(--mdc-ripple-fg-size, 100%); }\n  .mdc-select::before, .mdc-select::after {\n    background-color: rgba(0, 0, 0, 0.87); }\n  .mdc-select:hover::before {\n    opacity: 0.04; }\n  .mdc-select:not(.mdc-ripple-upgraded):focus::before, .mdc-select.mdc-ripple-upgraded--background-focused::before {\n    -webkit-transition-duration: 75ms;\n    transition-duration: 75ms;\n    opacity: 0.12; }\n  .mdc-select:not(.mdc-select--disabled) .mdc-select__native-control,\n  .mdc-select:not(.mdc-select--disabled) .mdc-select__selected-text {\n    color: rgba(0, 0, 0, 0.87); }\n  .mdc-select:not(.mdc-select--disabled) .mdc-floating-label {\n    color: rgba(0, 0, 0, 0.6); }\n  .mdc-select:not(.mdc-select--disabled) .mdc-select__native-control,\n  .mdc-select:not(.mdc-select--disabled) .mdc-select__selected-text {\n    border-bottom-color: rgba(0, 0, 0, 0.12); }\n  .mdc-select:not(.mdc-select--disabled) + .mdc-select-helper-text {\n    color: rgba(0, 0, 0, 0.6); }\n  .mdc-select, .mdc-select__native-control {\n    border-radius: 4px 4px 0 0; }\n  .mdc-select:not(.mdc-select--disabled).mdc-select--focused .mdc-line-ripple {\n    background-color: #26a69a;\n    /* \@alternate */\n    background-color: var(--mdc-theme-primary, #26a69a); }\n  .mdc-select:not(.mdc-select--disabled).mdc-select--focused .mdc-floating-label {\n    color: rgba(38, 166, 154, 0.87); }\n  .mdc-select:not(.mdc-select--disabled) .mdc-select__native-control:hover {\n    border-bottom-color: rgba(0, 0, 0, 0.12); }\n  .mdc-select .mdc-floating-label--float-above {\n    -webkit-transform: translateY(-70%) scale(0.75);\n    transform: translateY(-70%) scale(0.75); }\n  .mdc-select .mdc-floating-label {\n    /* \@noflip */\n    left: 16px;\n    /* \@noflip */\n    right: initial;\n    top: 21px;\n    pointer-events: none; }\n    [dir=\"rtl\"] .mdc-select .mdc-floating-label, .mdc-select .mdc-floating-label[dir=\"rtl\"] {\n      /* \@noflip */\n      left: initial;\n      /* \@noflip */\n      right: 16px; }\n  .mdc-select.mdc-select--with-leading-icon .mdc-floating-label {\n    /* \@noflip */\n    left: 48px;\n    /* \@noflip */\n    right: initial; }\n    [dir=\"rtl\"] .mdc-select.mdc-select--with-leading-icon .mdc-floating-label, .mdc-select.mdc-select--with-leading-icon .mdc-floating-label[dir=\"rtl\"] {\n      /* \@noflip */\n      left: initial;\n      /* \@noflip */\n      right: 48px; }\n  .mdc-select.mdc-select--outlined .mdc-floating-label {\n    /* \@noflip */\n    left: 4px;\n    /* \@noflip */\n    right: initial;\n    top: 17px; }\n    [dir=\"rtl\"] .mdc-select.mdc-select--outlined .mdc-floating-label, .mdc-select.mdc-select--outlined .mdc-floating-label[dir=\"rtl\"] {\n      /* \@noflip */\n      left: initial;\n      /* \@noflip */\n      right: 4px; }\n  .mdc-select.mdc-select--outlined.mdc-select--with-leading-icon .mdc-floating-label {\n    /* \@noflip */\n    left: 36px;\n    /* \@noflip */\n    right: initial; }\n    [dir=\"rtl\"] .mdc-select.mdc-select--outlined.mdc-select--with-leading-icon .mdc-floating-label, .mdc-select.mdc-select--outlined.mdc-select--with-leading-icon .mdc-floating-label[dir=\"rtl\"] {\n      /* \@noflip */\n      left: initial;\n      /* \@noflip */\n      right: 36px; }\n    .mdc-select.mdc-select--outlined.mdc-select--with-leading-icon .mdc-floating-label--float-above {\n      /* \@noflip */\n      left: 36px;\n      /* \@noflip */\n      right: initial; }\n      [dir=\"rtl\"] .mdc-select.mdc-select--outlined.mdc-select--with-leading-icon .mdc-floating-label--float-above, .mdc-select.mdc-select--outlined.mdc-select--with-leading-icon .mdc-floating-label--float-above[dir=\"rtl\"] {\n        /* \@noflip */\n        left: initial;\n        /* \@noflip */\n        right: 36px; }\n  .mdc-select__dropdown-icon {\n    background: url(\"data:image/svg+xml,%3Csvg%20width%3D%2210px%22%20height%3D%225px%22%20viewBox%3D%227%2010%2010%205%22%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%3E%0A%20%20%20%20%3Cpolygon%20id%3D%22Shape%22%20stroke%3D%22none%22%20fill%3D%22%23000%22%20fill-rule%3D%22evenodd%22%20opacity%3D%220.54%22%20points%3D%227%2010%2012%2015%2017%2010%22%3E%3C%2Fpolygon%3E%0A%3C%2Fsvg%3E\") no-repeat center;\n    /* \@noflip */\n    left: auto;\n    /* \@noflip */\n    right: 8px;\n    position: absolute;\n    bottom: 16px;\n    width: 24px;\n    height: 24px;\n    -webkit-transition: -webkit-transform 150ms cubic-bezier(0.4, 0, 0.2, 1);\n    transition: -webkit-transform 150ms cubic-bezier(0.4, 0, 0.2, 1);\n    transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1);\n    transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1), -webkit-transform 150ms cubic-bezier(0.4, 0, 0.2, 1);\n    pointer-events: none; }\n    [dir=\"rtl\"] .mdc-select__dropdown-icon, .mdc-select__dropdown-icon[dir=\"rtl\"] {\n      /* \@noflip */\n      left: 8px;\n      /* \@noflip */\n      right: auto; }\n    .mdc-select--focused .mdc-select__dropdown-icon {\n      background: url(\"data:image/svg+xml,%3Csvg%20width%3D%2210px%22%20height%3D%225px%22%20viewBox%3D%227%2010%2010%205%22%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%3E%0A%20%20%20%20%3Cpolygon%20id%3D%22Shape%22%20stroke%3D%22none%22%20fill%3D%22%2326a69a%22%20fill-rule%3D%22evenodd%22%20opacity%3D%221%22%20points%3D%227%2010%2012%2015%2017%2010%22%3E%3C%2Fpolygon%3E%0A%3C%2Fsvg%3E\") no-repeat center;\n      -webkit-transform: rotate(180deg) translateY(-5px);\n      transform: rotate(180deg) translateY(-5px);\n      -webkit-transition: -webkit-transform 150ms cubic-bezier(0.4, 0, 0.2, 1);\n      transition: -webkit-transform 150ms cubic-bezier(0.4, 0, 0.2, 1);\n      transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1);\n      transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1), -webkit-transform 150ms cubic-bezier(0.4, 0, 0.2, 1); }\n  .mdc-select__native-control {\n    padding-top: 20px; }\n  .mdc-select.mdc-select--focused .mdc-line-ripple::after {\n    -webkit-transform: scale(1, 2);\n    transform: scale(1, 2);\n    opacity: 1; }\n\n.mdc-select + .mdc-select-helper-text {\n  margin-right: 12px;\n  margin-left: 12px; }\n\n.mdc-select--outlined + .mdc-select-helper-text {\n  margin-right: 16px;\n  margin-left: 16px; }\n\n.mdc-select--focused + .mdc-select-helper-text:not(.mdc-select-helper-text--validation-msg) {\n  opacity: 1; }\n\n.mdc-select__selected-text {\n  min-width: 200px;\n  padding-top: 22px; }\n\n.mdc-select__native-control,\n.mdc-select__selected-text {\n  /* \@noflip */\n  padding-left: 16px;\n  /* \@noflip */\n  padding-right: 52px;\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.875rem;\n  line-height: 1.125rem;\n  font-weight: 400;\n  letter-spacing: 0.00937em;\n  text-decoration: inherit;\n  text-transform: inherit;\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box;\n  width: 100%;\n  height: 56px;\n  padding-top: 20px;\n  padding-bottom: 4px;\n  border: none;\n  border-bottom: 1px solid;\n  outline: none;\n  background-color: transparent;\n  color: inherit;\n  white-space: nowrap;\n  cursor: pointer;\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  appearance: none; }\n  [dir=\"rtl\"] .mdc-select__native-control, .mdc-select__native-control[dir=\"rtl\"], [dir=\"rtl\"]\n  .mdc-select__selected-text,\n  .mdc-select__selected-text[dir=\"rtl\"] {\n    /* \@noflip */\n    padding-left: 52px;\n    /* \@noflip */\n    padding-right: 16px; }\n  .mdc-select__native-control::-ms-expand,\n  .mdc-select__selected-text::-ms-expand {\n    display: none; }\n  .mdc-select__native-control::-ms-value,\n  .mdc-select__selected-text::-ms-value {\n    background-color: transparent;\n    color: inherit; }\n\n\@-moz-document url-prefix(\"\") {\n  .mdc-select__native-control,\n  .mdc-select__selected-text {\n    text-indent: -2px; } }\n\n.mdc-select--outlined {\n  border: none;\n  overflow: visible; }\n  .mdc-select--outlined:not(.mdc-select--disabled) {\n    background-color: transparent; }\n  .mdc-select--outlined:not(.mdc-select--disabled) .mdc-notched-outline__leading,\n  .mdc-select--outlined:not(.mdc-select--disabled) .mdc-notched-outline__notch,\n  .mdc-select--outlined:not(.mdc-select--disabled) .mdc-notched-outline__trailing {\n    border-color: rgba(0, 0, 0, 0.24); }\n  .mdc-select--outlined:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__native-control:hover ~ .mdc-notched-outline .mdc-notched-outline__leading,\n  .mdc-select--outlined:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__native-control:hover ~ .mdc-notched-outline .mdc-notched-outline__notch,\n  .mdc-select--outlined:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__native-control:hover ~ .mdc-notched-outline .mdc-notched-outline__trailing,\n  .mdc-select--outlined:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__selected-text:hover ~ .mdc-notched-outline .mdc-notched-outline__leading,\n  .mdc-select--outlined:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__selected-text:hover ~ .mdc-notched-outline .mdc-notched-outline__notch,\n  .mdc-select--outlined:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__selected-text:hover ~ .mdc-notched-outline .mdc-notched-outline__trailing {\n    border-color: rgba(0, 0, 0, 0.87); }\n  .mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__leading,\n  .mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__notch,\n  .mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__trailing {\n    border-width: 2px; }\n  .mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__leading,\n  .mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__notch,\n  .mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__trailing {\n    border-color: #26a69a;\n    /* \@alternate */\n    border-color: var(--mdc-theme-primary, #26a69a); }\n  .mdc-select--outlined .mdc-floating-label--shake {\n    -webkit-animation: mdc-floating-label-shake-float-above-text-field-outlined 250ms 1;\n    animation: mdc-floating-label-shake-float-above-text-field-outlined 250ms 1; }\n  .mdc-select--outlined .mdc-notched-outline .mdc-notched-outline__leading {\n    /* \@noflip */\n    border-radius: 4px 0 0 4px; }\n    [dir=\"rtl\"] .mdc-select--outlined .mdc-notched-outline .mdc-notched-outline__leading, .mdc-select--outlined .mdc-notched-outline .mdc-notched-outline__leading[dir=\"rtl\"] {\n      /* \@noflip */\n      border-radius: 0 4px 4px 0; }\n  .mdc-select--outlined .mdc-notched-outline .mdc-notched-outline__trailing {\n    /* \@noflip */\n    border-radius: 0 4px 4px 0; }\n    [dir=\"rtl\"] .mdc-select--outlined .mdc-notched-outline .mdc-notched-outline__trailing, .mdc-select--outlined .mdc-notched-outline .mdc-notched-outline__trailing[dir=\"rtl\"] {\n      /* \@noflip */\n      border-radius: 4px 0 0 4px; }\n  .mdc-select--outlined .mdc-select__native-control {\n    border-radius: 4px; }\n  .mdc-select--outlined::before, .mdc-select--outlined::after {\n    content: none; }\n  .mdc-select--outlined:not(.mdc-select--disabled) {\n    background-color: transparent; }\n  .mdc-select--outlined .mdc-floating-label--float-above {\n    -webkit-transform: translateY(-144%) scale(1);\n    transform: translateY(-144%) scale(1); }\n  .mdc-select--outlined .mdc-floating-label--float-above {\n    font-size: 0.75rem; }\n  .mdc-select--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,\n  .mdc-select--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above {\n    -webkit-transform: translateY(-130%) scale(0.75);\n    transform: translateY(-130%) scale(0.75); }\n  .mdc-select--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,\n  .mdc-select--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above {\n    font-size: 1rem; }\n  .mdc-select--outlined .mdc-select__native-control,\n  .mdc-select--outlined .mdc-select__selected-text {\n    /* \@noflip */\n    padding-left: 16px;\n    /* \@noflip */\n    padding-right: 52px;\n    display: -ms-flexbox;\n    display: flex;\n    padding-top: 12px;\n    padding-bottom: 12px;\n    border: none;\n    background-color: transparent;\n    z-index: 1; }\n    [dir=\"rtl\"] .mdc-select--outlined .mdc-select__native-control, .mdc-select--outlined .mdc-select__native-control[dir=\"rtl\"], [dir=\"rtl\"]\n    .mdc-select--outlined .mdc-select__selected-text,\n    .mdc-select--outlined .mdc-select__selected-text[dir=\"rtl\"] {\n      /* \@noflip */\n      padding-left: 52px;\n      /* \@noflip */\n      padding-right: 16px; }\n  .mdc-select--outlined .mdc-select__selected-text {\n    padding-top: 14px; }\n  .mdc-select--outlined .mdc-select__icon {\n    z-index: 2; }\n  .mdc-select--outlined .mdc-floating-label {\n    line-height: 1.15rem;\n    pointer-events: auto; }\n\n.mdc-select--invalid:not(.mdc-select--disabled) .mdc-floating-label {\n  color: #b00020;\n  /* \@alternate */\n  color: var(--mdc-theme-error, #b00020); }\n\n.mdc-select--invalid:not(.mdc-select--disabled) .mdc-select__native-control,\n.mdc-select--invalid:not(.mdc-select--disabled) .mdc-select__selected-text {\n  border-bottom-color: #b00020;\n  /* \@alternate */\n  border-bottom-color: var(--mdc-theme-error, #b00020); }\n\n.mdc-select--invalid:not(.mdc-select--disabled).mdc-select--focused .mdc-line-ripple {\n  background-color: #b00020;\n  /* \@alternate */\n  background-color: var(--mdc-theme-error, #b00020); }\n\n.mdc-select--invalid:not(.mdc-select--disabled).mdc-select--focused .mdc-floating-label {\n  color: #b00020; }\n\n.mdc-select--invalid:not(.mdc-select--disabled).mdc-select--invalid + .mdc-select-helper-text--validation-msg {\n  color: #b00020;\n  /* \@alternate */\n  color: var(--mdc-theme-error, #b00020); }\n\n.mdc-select--invalid:not(.mdc-select--disabled) .mdc-select__native-control:hover {\n  border-bottom-color: #b00020;\n  /* \@alternate */\n  border-bottom-color: var(--mdc-theme-error, #b00020); }\n\n.mdc-select--invalid.mdc-select--outlined:not(.mdc-select--disabled) .mdc-notched-outline__leading,\n.mdc-select--invalid.mdc-select--outlined:not(.mdc-select--disabled) .mdc-notched-outline__notch,\n.mdc-select--invalid.mdc-select--outlined:not(.mdc-select--disabled) .mdc-notched-outline__trailing {\n  border-color: #b00020;\n  /* \@alternate */\n  border-color: var(--mdc-theme-error, #b00020); }\n\n.mdc-select--invalid.mdc-select--outlined:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__native-control:hover ~ .mdc-notched-outline .mdc-notched-outline__leading,\n.mdc-select--invalid.mdc-select--outlined:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__native-control:hover ~ .mdc-notched-outline .mdc-notched-outline__notch,\n.mdc-select--invalid.mdc-select--outlined:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__native-control:hover ~ .mdc-notched-outline .mdc-notched-outline__trailing,\n.mdc-select--invalid.mdc-select--outlined:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__selected-text:hover ~ .mdc-notched-outline .mdc-notched-outline__leading,\n.mdc-select--invalid.mdc-select--outlined:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__selected-text:hover ~ .mdc-notched-outline .mdc-notched-outline__notch,\n.mdc-select--invalid.mdc-select--outlined:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__selected-text:hover ~ .mdc-notched-outline .mdc-notched-outline__trailing {\n  border-color: #b00020;\n  /* \@alternate */\n  border-color: var(--mdc-theme-error, #b00020); }\n\n.mdc-select--invalid.mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__leading,\n.mdc-select--invalid.mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__notch,\n.mdc-select--invalid.mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__trailing {\n  border-width: 2px; }\n\n.mdc-select--invalid.mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__leading,\n.mdc-select--invalid.mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__notch,\n.mdc-select--invalid.mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__trailing {\n  border-color: #b00020;\n  /* \@alternate */\n  border-color: var(--mdc-theme-error, #b00020); }\n\n.mdc-select--invalid .mdc-select__dropdown-icon {\n  background: url(\"data:image/svg+xml,%3Csvg%20width%3D%2210px%22%20height%3D%225px%22%20viewBox%3D%227%2010%2010%205%22%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%3E%0A%20%20%20%20%3Cpolygon%20id%3D%22Shape%22%20stroke%3D%22none%22%20fill%3D%22%23b00020%22%20fill-rule%3D%22evenodd%22%20opacity%3D%221%22%20points%3D%227%2010%2012%2015%2017%2010%22%3E%3C%2Fpolygon%3E%0A%3C%2Fsvg%3E\") no-repeat center; }\n\n.mdc-select--invalid + .mdc-select-helper-text--validation-msg {\n  opacity: 1; }\n\n.mdc-select--required .mdc-floating-label::after {\n  content: \"*\"; }\n\n.mdc-select--disabled {\n  background-color: #fafafa;\n  cursor: default;\n  pointer-events: none; }\n  .mdc-select--disabled .mdc-floating-label {\n    color: rgba(0, 0, 0, 0.37); }\n  .mdc-select--disabled .mdc-select__dropdown-icon {\n    background: url(\"data:image/svg+xml,%3Csvg%20width%3D%2210px%22%20height%3D%225px%22%20viewBox%3D%227%2010%2010%205%22%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%3E%0A%20%20%20%20%3Cpolygon%20id%3D%22Shape%22%20stroke%3D%22none%22%20fill%3D%22%23000%22%20fill-rule%3D%22evenodd%22%20opacity%3D%220.37%22%20points%3D%227%2010%2012%2015%2017%2010%22%3E%3C%2Fpolygon%3E%0A%3C%2Fsvg%3E\") no-repeat center; }\n  .mdc-select--disabled .mdc-line-ripple {\n    display: none; }\n  .mdc-select--disabled .mdc-select__icon {\n    color: rgba(0, 0, 0, 0.37); }\n  .mdc-select--disabled .mdc-select__native-control,\n  .mdc-select--disabled .mdc-select__selected-text {\n    color: rgba(0, 0, 0, 0.37);\n    border-bottom-style: dotted; }\n  .mdc-select--disabled .mdc-select__selected-text {\n    pointer-events: none; }\n  .mdc-select--disabled.mdc-select--outlined {\n    background-color: transparent; }\n    .mdc-select--disabled.mdc-select--outlined .mdc-select__native-control,\n    .mdc-select--disabled.mdc-select--outlined .mdc-select__selected-text {\n      border-bottom-style: none; }\n    .mdc-select--disabled.mdc-select--outlined .mdc-notched-outline__leading,\n    .mdc-select--disabled.mdc-select--outlined .mdc-notched-outline__notch,\n    .mdc-select--disabled.mdc-select--outlined .mdc-notched-outline__trailing {\n      border-color: rgba(0, 0, 0, 0.16); }\n\n.mdc-select--with-leading-icon .mdc-select__icon {\n  /* \@noflip */\n  left: 16px;\n  /* \@noflip */\n  right: initial; }\n  [dir=\"rtl\"] .mdc-select--with-leading-icon .mdc-select__icon, .mdc-select--with-leading-icon .mdc-select__icon[dir=\"rtl\"] {\n    /* \@noflip */\n    left: initial;\n    /* \@noflip */\n    right: 16px; }\n\n.mdc-select--with-leading-icon .mdc-select__native-control,\n.mdc-select--with-leading-icon .mdc-select__selected-text {\n  /* \@noflip */\n  padding-left: 48px;\n  /* \@noflip */\n  padding-right: 32px; }\n  [dir=\"rtl\"] .mdc-select--with-leading-icon .mdc-select__native-control, .mdc-select--with-leading-icon .mdc-select__native-control[dir=\"rtl\"], [dir=\"rtl\"]\n  .mdc-select--with-leading-icon .mdc-select__selected-text,\n  .mdc-select--with-leading-icon .mdc-select__selected-text[dir=\"rtl\"] {\n    /* \@noflip */\n    padding-left: 32px;\n    /* \@noflip */\n    padding-right: 48px; }\n\n.mdc-select--with-leading-icon.mdc-select--outlined .mdc-floating-label--float-above {\n  -webkit-transform: translateY(-144%) translateX(-32px) scale(1);\n  transform: translateY(-144%) translateX(-32px) scale(1); }\n  [dir=\"rtl\"] .mdc-select--with-leading-icon.mdc-select--outlined .mdc-floating-label--float-above, .mdc-select--with-leading-icon.mdc-select--outlined .mdc-floating-label--float-above[dir=\"rtl\"] {\n    -webkit-transform: translateY(-144%) translateX(32px) scale(1);\n    transform: translateY(-144%) translateX(32px) scale(1); }\n\n.mdc-select--with-leading-icon.mdc-select--outlined .mdc-floating-label--float-above {\n  font-size: 0.75rem; }\n\n.mdc-select--with-leading-icon.mdc-select--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,\n.mdc-select--with-leading-icon.mdc-select--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above {\n  -webkit-transform: translateY(-130%) translateX(-32px) scale(0.75);\n  transform: translateY(-130%) translateX(-32px) scale(0.75); }\n  [dir=\"rtl\"] .mdc-select--with-leading-icon.mdc-select--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above, .mdc-select--with-leading-icon.mdc-select--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above[dir=\"rtl\"], [dir=\"rtl\"]\n  .mdc-select--with-leading-icon.mdc-select--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above,\n  .mdc-select--with-leading-icon.mdc-select--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above[dir=\"rtl\"] {\n    -webkit-transform: translateY(-130%) translateX(32px) scale(0.75);\n    transform: translateY(-130%) translateX(32px) scale(0.75); }\n\n.mdc-select--with-leading-icon.mdc-select--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,\n.mdc-select--with-leading-icon.mdc-select--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above {\n  font-size: 1rem; }\n\n.mdc-select--with-leading-icon.mdc-select--outlined .mdc-floating-label--shake {\n  -webkit-animation: mdc-floating-label-shake-float-above-select-outlined-leading-icon 250ms 1;\n  animation: mdc-floating-label-shake-float-above-select-outlined-leading-icon 250ms 1; }\n\n[dir=\"rtl\"] .mdc-select--with-leading-icon.mdc-select--outlined .mdc-floating-label--shake, .mdc-select--with-leading-icon.mdc-select--outlined[dir=\"rtl\"] .mdc-floating-label--shake {\n  -webkit-animation: mdc-floating-label-shake-float-above-select-outlined-leading-icon-rtl 250ms 1;\n  animation: mdc-floating-label-shake-float-above-select-outlined-leading-icon-rtl 250ms 1; }\n\n.mdc-select--with-leading-icon.mdc-select__menu .mdc-list-item__text {\n  /* \@noflip */\n  padding-left: 32px;\n  /* \@noflip */\n  padding-right: 32px; }\n  [dir=\"rtl\"] .mdc-select--with-leading-icon.mdc-select__menu .mdc-list-item__text, .mdc-select--with-leading-icon.mdc-select__menu .mdc-list-item__text[dir=\"rtl\"] {\n    /* \@noflip */\n    padding-left: 32px;\n    /* \@noflip */\n    padding-right: 32px; }\n\n.mdc-select__menu .mdc-list .mdc-list-item--selected {\n  color: #000;\n  /* \@alternate */\n  color: var(--mdc-theme-on-surface, #000); }\n  .mdc-select__menu .mdc-list .mdc-list-item--selected::before, .mdc-select__menu .mdc-list .mdc-list-item--selected::after {\n    background-color: #000; }\n    \@supports not (-ms-ime-align: auto) {\n      .mdc-select__menu .mdc-list .mdc-list-item--selected::before, .mdc-select__menu .mdc-list .mdc-list-item--selected::after {\n        /* \@alternate */\n        background-color: var(--mdc-theme-on-surface, #000); } }\n  .mdc-select__menu .mdc-list .mdc-list-item--selected:hover::before {\n    opacity: 0.04; }\n  .mdc-select__menu .mdc-list .mdc-list-item--selected:not(.mdc-ripple-upgraded):focus::before, .mdc-select__menu .mdc-list .mdc-list-item--selected.mdc-ripple-upgraded--background-focused::before {\n    -webkit-transition-duration: 75ms;\n    transition-duration: 75ms;\n    opacity: 0.12; }\n  .mdc-select__menu .mdc-list .mdc-list-item--selected:not(.mdc-ripple-upgraded)::after {\n    -webkit-transition: opacity 150ms linear;\n    transition: opacity 150ms linear; }\n  .mdc-select__menu .mdc-list .mdc-list-item--selected:not(.mdc-ripple-upgraded):active::after {\n    -webkit-transition-duration: 75ms;\n    transition-duration: 75ms;\n    opacity: 0.16; }\n  .mdc-select__menu .mdc-list .mdc-list-item--selected.mdc-ripple-upgraded {\n    --mdc-ripple-fg-opacity: 0.16; }\n\n\@-webkit-keyframes mdc-floating-label-shake-float-above-select-outlined-leading-icon {\n  0% {\n    -webkit-transform: translateX(calc(0 - 32px)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(0 - 32px)) translateY(-130%) scale(0.75); }\n  33% {\n    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    -webkit-transform: translateX(calc(4% - 32px)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(4% - 32px)) translateY(-130%) scale(0.75); }\n  66% {\n    -webkit-animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    -webkit-transform: translateX(calc(-4% - 32px)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(-4% - 32px)) translateY(-130%) scale(0.75); }\n  100% {\n    -webkit-transform: translateX(calc(0 - 32px)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(0 - 32px)) translateY(-130%) scale(0.75); } }\n\n\@keyframes mdc-floating-label-shake-float-above-select-outlined-leading-icon {\n  0% {\n    -webkit-transform: translateX(calc(0 - 32px)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(0 - 32px)) translateY(-130%) scale(0.75); }\n  33% {\n    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    -webkit-transform: translateX(calc(4% - 32px)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(4% - 32px)) translateY(-130%) scale(0.75); }\n  66% {\n    -webkit-animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    -webkit-transform: translateX(calc(-4% - 32px)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(-4% - 32px)) translateY(-130%) scale(0.75); }\n  100% {\n    -webkit-transform: translateX(calc(0 - 32px)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(0 - 32px)) translateY(-130%) scale(0.75); } }\n\n\@-webkit-keyframes mdc-floating-label-shake-float-above-select-outlined-leading-icon-rtl {\n  0% {\n    -webkit-transform: translateX(calc(0 - -32px)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(0 - -32px)) translateY(-130%) scale(0.75); }\n  33% {\n    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    -webkit-transform: translateX(calc(4% - -32px)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(4% - -32px)) translateY(-130%) scale(0.75); }\n  66% {\n    -webkit-animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    -webkit-transform: translateX(calc(-4% - -32px)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(-4% - -32px)) translateY(-130%) scale(0.75); }\n  100% {\n    -webkit-transform: translateX(calc(0 - -32px)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(0 - -32px)) translateY(-130%) scale(0.75); } }\n\n\@keyframes mdc-floating-label-shake-float-above-select-outlined-leading-icon-rtl {\n  0% {\n    -webkit-transform: translateX(calc(0 - -32px)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(0 - -32px)) translateY(-130%) scale(0.75); }\n  33% {\n    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    -webkit-transform: translateX(calc(4% - -32px)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(4% - -32px)) translateY(-130%) scale(0.75); }\n  66% {\n    -webkit-animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    -webkit-transform: translateX(calc(-4% - -32px)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(-4% - -32px)) translateY(-130%) scale(0.75); }\n  100% {\n    -webkit-transform: translateX(calc(0 - -32px)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(0 - -32px)) translateY(-130%) scale(0.75); } }\n\n.mdc-ripple-surface {\n  --mdc-ripple-fg-size: 0;\n  --mdc-ripple-left: 0;\n  --mdc-ripple-top: 0;\n  --mdc-ripple-fg-scale: 1;\n  --mdc-ripple-fg-translate-end: 0;\n  --mdc-ripple-fg-translate-start: 0;\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n  will-change: transform, opacity;\n  position: relative;\n  outline: none;\n  overflow: hidden; }\n  .mdc-ripple-surface::before, .mdc-ripple-surface::after {\n    position: absolute;\n    border-radius: 50%;\n    opacity: 0;\n    pointer-events: none;\n    content: \"\"; }\n  .mdc-ripple-surface::before {\n    -webkit-transition: opacity 15ms linear, background-color 15ms linear;\n    transition: opacity 15ms linear, background-color 15ms linear;\n    z-index: 1; }\n  .mdc-ripple-surface.mdc-ripple-upgraded::before {\n    -webkit-transform: scale(var(--mdc-ripple-fg-scale, 1));\n    transform: scale(var(--mdc-ripple-fg-scale, 1)); }\n  .mdc-ripple-surface.mdc-ripple-upgraded::after {\n    top: 0;\n    /* \@noflip */\n    left: 0;\n    -webkit-transform: scale(0);\n    transform: scale(0);\n    -webkit-transform-origin: center center;\n    transform-origin: center center; }\n  .mdc-ripple-surface.mdc-ripple-upgraded--unbounded::after {\n    top: var(--mdc-ripple-top, 0);\n    /* \@noflip */\n    left: var(--mdc-ripple-left, 0); }\n  .mdc-ripple-surface.mdc-ripple-upgraded--foreground-activation::after {\n    -webkit-animation: 225ms mdc-ripple-fg-radius-in forwards, 75ms mdc-ripple-fg-opacity-in forwards;\n    animation: 225ms mdc-ripple-fg-radius-in forwards, 75ms mdc-ripple-fg-opacity-in forwards; }\n  .mdc-ripple-surface.mdc-ripple-upgraded--foreground-deactivation::after {\n    -webkit-animation: 150ms mdc-ripple-fg-opacity-out;\n    animation: 150ms mdc-ripple-fg-opacity-out;\n    -webkit-transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1));\n    transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1)); }\n  .mdc-ripple-surface::before, .mdc-ripple-surface::after {\n    background-color: #000; }\n  .mdc-ripple-surface:hover::before {\n    opacity: 0.04; }\n  .mdc-ripple-surface:not(.mdc-ripple-upgraded):focus::before, .mdc-ripple-surface.mdc-ripple-upgraded--background-focused::before {\n    -webkit-transition-duration: 75ms;\n    transition-duration: 75ms;\n    opacity: 0.12; }\n  .mdc-ripple-surface:not(.mdc-ripple-upgraded)::after {\n    -webkit-transition: opacity 150ms linear;\n    transition: opacity 150ms linear; }\n  .mdc-ripple-surface:not(.mdc-ripple-upgraded):active::after {\n    -webkit-transition-duration: 75ms;\n    transition-duration: 75ms;\n    opacity: 0.16; }\n  .mdc-ripple-surface.mdc-ripple-upgraded {\n    --mdc-ripple-fg-opacity: 0.16; }\n  .mdc-ripple-surface::before, .mdc-ripple-surface::after {\n    top: calc(50% - 100%);\n    /* \@noflip */\n    left: calc(50% - 100%);\n    width: 200%;\n    height: 200%; }\n  .mdc-ripple-surface.mdc-ripple-upgraded::after {\n    width: var(--mdc-ripple-fg-size, 100%);\n    height: var(--mdc-ripple-fg-size, 100%); }\n  .mdc-ripple-surface[data-mdc-ripple-is-unbounded] {\n    overflow: visible; }\n    .mdc-ripple-surface[data-mdc-ripple-is-unbounded]::before, .mdc-ripple-surface[data-mdc-ripple-is-unbounded]::after {\n      top: calc(50% - 50%);\n      /* \@noflip */\n      left: calc(50% - 50%);\n      width: 100%;\n      height: 100%; }\n    .mdc-ripple-surface[data-mdc-ripple-is-unbounded].mdc-ripple-upgraded::before, .mdc-ripple-surface[data-mdc-ripple-is-unbounded].mdc-ripple-upgraded::after {\n      top: var(--mdc-ripple-top, calc(50% - 50%));\n      /* \@noflip */\n      left: var(--mdc-ripple-left, calc(50% - 50%));\n      width: var(--mdc-ripple-fg-size, 100%);\n      height: var(--mdc-ripple-fg-size, 100%); }\n    .mdc-ripple-surface[data-mdc-ripple-is-unbounded].mdc-ripple-upgraded::after {\n      width: var(--mdc-ripple-fg-size, 100%);\n      height: var(--mdc-ripple-fg-size, 100%); }\n  .mdc-ripple-surface--primary::before, .mdc-ripple-surface--primary::after {\n    background-color: #26a69a; }\n    \@supports not (-ms-ime-align: auto) {\n      .mdc-ripple-surface--primary::before, .mdc-ripple-surface--primary::after {\n        /* \@alternate */\n        background-color: var(--mdc-theme-primary, #26a69a); } }\n  .mdc-ripple-surface--primary:hover::before {\n    opacity: 0.08; }\n  .mdc-ripple-surface--primary:not(.mdc-ripple-upgraded):focus::before, .mdc-ripple-surface--primary.mdc-ripple-upgraded--background-focused::before {\n    -webkit-transition-duration: 75ms;\n    transition-duration: 75ms;\n    opacity: 0.24; }\n  .mdc-ripple-surface--primary:not(.mdc-ripple-upgraded)::after {\n    -webkit-transition: opacity 150ms linear;\n    transition: opacity 150ms linear; }\n  .mdc-ripple-surface--primary:not(.mdc-ripple-upgraded):active::after {\n    -webkit-transition-duration: 75ms;\n    transition-duration: 75ms;\n    opacity: 0.32; }\n  .mdc-ripple-surface--primary.mdc-ripple-upgraded {\n    --mdc-ripple-fg-opacity: 0.32; }\n  .mdc-ripple-surface--accent::before, .mdc-ripple-surface--accent::after {\n    background-color: #575756; }\n    \@supports not (-ms-ime-align: auto) {\n      .mdc-ripple-surface--accent::before, .mdc-ripple-surface--accent::after {\n        /* \@alternate */\n        background-color: var(--mdc-theme-secondary, #575756); } }\n  .mdc-ripple-surface--accent:hover::before {\n    opacity: 0.04; }\n  .mdc-ripple-surface--accent:not(.mdc-ripple-upgraded):focus::before, .mdc-ripple-surface--accent.mdc-ripple-upgraded--background-focused::before {\n    -webkit-transition-duration: 75ms;\n    transition-duration: 75ms;\n    opacity: 0.12; }\n  .mdc-ripple-surface--accent:not(.mdc-ripple-upgraded)::after {\n    -webkit-transition: opacity 150ms linear;\n    transition: opacity 150ms linear; }\n  .mdc-ripple-surface--accent:not(.mdc-ripple-upgraded):active::after {\n    -webkit-transition-duration: 75ms;\n    transition-duration: 75ms;\n    opacity: 0.16; }\n  .mdc-ripple-surface--accent.mdc-ripple-upgraded {\n    --mdc-ripple-fg-opacity: 0.16; }\n\n/**\n * \@prop --background-color: Background color of the field.\n */\n:host([hidden]) {\n  display: none; }\n\n.mdc-select {\n  width: 100%; }\n  .mdc-select:hover::before {\n    opacity: 0; }\n  .mdc-select:not(.mdc-ripple-upgraded):focus::before, .mdc-select:not(.mdc-ripple-upgraded):focus-within::before, .mdc-select.mdc-ripple-upgraded--background-focused::before {\n    -webkit-transition-duration: 75ms;\n    transition-duration: 75ms;\n    opacity: 0; }\n  .mdc-select__native-control {\n    padding-top: 1.5625rem;\n    padding-bottom: 0.125rem; }"; }
}

export { Select as LimelSelect };
