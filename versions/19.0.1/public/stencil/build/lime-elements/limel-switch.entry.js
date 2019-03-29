const h = window.LimeElements.h;

import { a as MDCFoundation, b as MDCComponent } from './chunk-d211df41.js';
import { b as getMatchesProperty, a as MDCRipple, c as MDCRippleFoundation } from './chunk-b9077bcc.js';
import { a as createRandomString } from './chunk-f12b16ef.js';
import './chunk-1a10b3cb.js';

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
 * Adapter for MDC Switch. Provides an interface for managing
 * - classes
 * - dom
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
class MDCSwitchAdapter {
  /** @param {string} className */
  addClass(className) {}

  /** @param {string} className */
  removeClass(className) {}

  /** @param {boolean} checked */
  setNativeControlChecked(checked) {}

  /** @param {boolean} disabled */
  setNativeControlDisabled(disabled) {}
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
const cssClasses = {
  CHECKED: 'mdc-switch--checked',
  DISABLED: 'mdc-switch--disabled',
};

/** @enum {string} */
const strings = {
  NATIVE_CONTROL_SELECTOR: '.mdc-switch__native-control',
  RIPPLE_SURFACE_SELECTOR: '.mdc-switch__thumb-underlay',
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
 * @extends {MDCFoundation<!MDCSwitchAdapter>}
 */
class MDCSwitchFoundation extends MDCFoundation {
  /** @return enum {string} */
  static get strings() {
    return strings;
  }

  /** @return enum {string} */
  static get cssClasses() {
    return cssClasses;
  }

  /** @return {!MDCSwitchAdapter} */
  static get defaultAdapter() {
    return /** @type {!MDCSwitchAdapter} */ ({
      addClass: (/* className: string */) => {},
      removeClass: (/* className: string */) => {},
      setNativeControlChecked: (/* checked: boolean */) => {},
      setNativeControlDisabled: (/* disabled: boolean */) => {},
    });
  }

  constructor(adapter) {
    super(Object.assign(MDCSwitchFoundation.defaultAdapter, adapter));
  }

  /** @param {boolean} checked */
  setChecked(checked) {
    this.adapter_.setNativeControlChecked(checked);
    this.updateCheckedStyling_(checked);
  }

  /** @param {boolean} disabled */
  setDisabled(disabled) {
    this.adapter_.setNativeControlDisabled(disabled);
    if (disabled) {
      this.adapter_.addClass(cssClasses.DISABLED);
    } else {
      this.adapter_.removeClass(cssClasses.DISABLED);
    }
  }

  /**
   * Handles the change event for the switch native control.
   * @param {!Event} evt
   */
  handleChange(evt) {
    this.updateCheckedStyling_(evt.target.checked);
  }

  /**
   * Updates the styling of the switch based on its checked state.
   * @param {boolean} checked
   * @private
   */
  updateCheckedStyling_(checked) {
    if (checked) {
      this.adapter_.addClass(cssClasses.CHECKED);
    } else {
      this.adapter_.removeClass(cssClasses.CHECKED);
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
 * @extends MDCComponent<!MDCSwitchFoundation>
 * @implements {MDCSelectionControl}
 */
class MDCSwitch extends MDCComponent {
  static attachTo(root) {
    return new MDCSwitch(root);
  }

  constructor(...args) {
    super(...args);

    /** @private {!MDCRipple} */
    this.ripple_ = this.initRipple_();

    /** @private {!Function} */
    this.changeHandler_;
  }

  destroy() {
    super.destroy();
    this.ripple_.destroy();
    this.nativeControl_.removeEventListener('change', this.changeHandler_);
  }

  initialSyncWithDOM() {
    this.changeHandler_ = this.foundation_.handleChange.bind(this.foundation_);
    this.nativeControl_.addEventListener('change', this.changeHandler_);

    // Sometimes the checked state of the input element is saved in the history.
    // The switch styling should match the checked state of the input element.
    // Do an initial sync between the native control and the foundation.
    this.checked = this.checked;
  }

  /**
   * Returns the state of the native control element, or null if the native control element is not present.
   * @return {?MDCSelectionControlState}
   * @private
   */
  get nativeControl_() {
    const {NATIVE_CONTROL_SELECTOR} = MDCSwitchFoundation.strings;
    const el = /** @type {?MDCSelectionControlState} */ (
      this.root_.querySelector(NATIVE_CONTROL_SELECTOR));
    return el;
  }

  /**
   * @return {!MDCRipple}
   * @private
   */
  initRipple_() {
    const {RIPPLE_SURFACE_SELECTOR} = MDCSwitchFoundation.strings;
    const rippleSurface = /** @type {!Element} */ (this.root_.querySelector(RIPPLE_SURFACE_SELECTOR));

    const MATCHES = getMatchesProperty(HTMLElement.prototype);
    const adapter = Object.assign(MDCRipple.createAdapter(this), {
      isUnbounded: () => true,
      isSurfaceActive: () => this.nativeControl_[MATCHES](':active'),
      addClass: (className) => rippleSurface.classList.add(className),
      removeClass: (className) => rippleSurface.classList.remove(className),
      registerInteractionHandler: (type, handler) => this.nativeControl_.addEventListener(type, handler),
      deregisterInteractionHandler: (type, handler) => this.nativeControl_.removeEventListener(type, handler),
      updateCssVariable: (varName, value) => rippleSurface.style.setProperty(varName, value),
      computeBoundingRect: () => rippleSurface.getBoundingClientRect(),
    });
    const foundation = new MDCRippleFoundation(adapter);
    return new MDCRipple(this.root_, foundation);
  }

  /** @return {!MDCSwitchFoundation} */
  getDefaultFoundation() {
    return new MDCSwitchFoundation({
      addClass: (className) => this.root_.classList.add(className),
      removeClass: (className) => this.root_.classList.remove(className),
      setNativeControlChecked: (checked) => this.nativeControl_.checked = checked,
      setNativeControlDisabled: (disabled) => this.nativeControl_.disabled = disabled,
    });
  }

  /** @return {!MDCRipple} */
  get ripple() {
    return this.ripple_;
  }

  /** @return {boolean} */
  get checked() {
    return this.nativeControl_.checked;
  }

  /** @param {boolean} checked */
  set checked(checked) {
    this.foundation_.setChecked(checked);
  }

  /** @return {boolean} */
  get disabled() {
    return this.nativeControl_.disabled;
  }

  /** @param {boolean} disabled */
  set disabled(disabled) {
    this.foundation_.setDisabled(disabled);
  }
}

class Switch {
    constructor() {
        this.disabled = false;
        this.value = false;
        this.fieldId = createRandomString();
        this.onChange = event => {
            event.stopPropagation();
            this.change.emit(event.target.checked);
        };
    }
    /**
     * @returns {void}
     */
    componentDidLoad() {
        this.mdcSwitch = new MDCSwitch(this.host.shadowRoot.querySelector('.mdc-switch'));
    }
    /**
     * @returns {void}
     */
    componentDidUnload() {
        this.mdcSwitch.destroy();
    }
    render() {
        return [
            h("div", { class: `
                    mdc-switch
                    ${this.disabled ? 'mdc-switch--disabled' : ''}
                ` },
                h("div", { class: "mdc-switch__track" }),
                h("div", { class: "mdc-switch__thumb-underlay" },
                    h("div", { class: "mdc-switch__thumb" },
                        h("input", { type: "checkbox", class: "mdc-switch__native-control", id: this.fieldId, role: "switch", onChange: this.onChange, disabled: this.disabled, checked: this.value })))),
            h("label", { class: `${this.disabled ? 'disabled' : ''}`, htmlFor: this.fieldId },
                h("span", { class: "label" }, this.label)),
        ];
    }
    valueWatcher(newValue, oldValue) {
        if (newValue !== oldValue) {
            this.mdcSwitch.checked = newValue;
        }
    }
    static get is() { return "limel-switch"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "disabled": {
            "type": Boolean,
            "attr": "disabled",
            "reflectToAttr": true
        },
        "fieldId": {
            "state": true
        },
        "host": {
            "elementRef": true
        },
        "label": {
            "type": String,
            "attr": "label",
            "reflectToAttr": true
        },
        "mdcSwitch": {
            "state": true
        },
        "value": {
            "type": Boolean,
            "attr": "value",
            "reflectToAttr": true,
            "watchCallbacks": ["valueWatcher"]
        }
    }; }
    static get events() { return [{
            "name": "change",
            "method": "change",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get style() { return ":host {\n  --mdc-theme-primary: var(--lime-primary-color, #26a69a);\n  --mdc-theme-secondary: var(--lime-secondary-color, #575756);\n  --mdc-theme-on-primary: var(--lime-on-primary-color, #fff);\n  --mdc-theme-on-secondary: var(--lime-on-secondary-color, #fff); }\n\n:root {\n  --mdc-theme-primary: #26a69a;\n  --mdc-theme-secondary: #575756;\n  --mdc-theme-background: #fff;\n  --mdc-theme-surface: #fff;\n  --mdc-theme-error: #b00020;\n  --mdc-theme-on-primary: #fff;\n  --mdc-theme-on-secondary: #fff;\n  --mdc-theme-on-surface: #000;\n  --mdc-theme-on-error: #fff;\n  --mdc-theme-text-primary-on-background: rgba(0, 0, 0, 0.87);\n  --mdc-theme-text-secondary-on-background: rgba(0, 0, 0, 0.54);\n  --mdc-theme-text-hint-on-background: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-disabled-on-background: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-icon-on-background: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-primary-on-light: rgba(0, 0, 0, 0.87);\n  --mdc-theme-text-secondary-on-light: rgba(0, 0, 0, 0.54);\n  --mdc-theme-text-hint-on-light: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-disabled-on-light: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-icon-on-light: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-primary-on-dark: white;\n  --mdc-theme-text-secondary-on-dark: rgba(255, 255, 255, 0.7);\n  --mdc-theme-text-hint-on-dark: rgba(255, 255, 255, 0.5);\n  --mdc-theme-text-disabled-on-dark: rgba(255, 255, 255, 0.5);\n  --mdc-theme-text-icon-on-dark: rgba(255, 255, 255, 0.5); }\n\n.mdc-theme--primary {\n  color: #26a69a !important;\n  /* \@alternate */\n  color: var(--mdc-theme-primary, #26a69a) !important; }\n\n.mdc-theme--secondary {\n  color: #575756 !important;\n  /* \@alternate */\n  color: var(--mdc-theme-secondary, #575756) !important; }\n\n.mdc-theme--background {\n  background-color: #fff;\n  /* \@alternate */\n  background-color: var(--mdc-theme-background, #fff); }\n\n.mdc-theme--surface {\n  background-color: #fff;\n  /* \@alternate */\n  background-color: var(--mdc-theme-surface, #fff); }\n\n.mdc-theme--error {\n  color: #b00020 !important;\n  /* \@alternate */\n  color: var(--mdc-theme-error, #b00020) !important; }\n\n.mdc-theme--on-primary {\n  color: #fff !important;\n  /* \@alternate */\n  color: var(--mdc-theme-on-primary, #fff) !important; }\n\n.mdc-theme--on-secondary {\n  color: #fff !important;\n  /* \@alternate */\n  color: var(--mdc-theme-on-secondary, #fff) !important; }\n\n.mdc-theme--on-surface {\n  color: #000 !important;\n  /* \@alternate */\n  color: var(--mdc-theme-on-surface, #000) !important; }\n\n.mdc-theme--on-error {\n  color: #fff !important;\n  /* \@alternate */\n  color: var(--mdc-theme-on-error, #fff) !important; }\n\n.mdc-theme--text-primary-on-background {\n  color: rgba(0, 0, 0, 0.87) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-primary-on-background, rgba(0, 0, 0, 0.87)) !important; }\n\n.mdc-theme--text-secondary-on-background {\n  color: rgba(0, 0, 0, 0.54) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-secondary-on-background, rgba(0, 0, 0, 0.54)) !important; }\n\n.mdc-theme--text-hint-on-background {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.38)) !important; }\n\n.mdc-theme--text-disabled-on-background {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-disabled-on-background, rgba(0, 0, 0, 0.38)) !important; }\n\n.mdc-theme--text-icon-on-background {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-icon-on-background, rgba(0, 0, 0, 0.38)) !important; }\n\n.mdc-theme--text-primary-on-light {\n  color: rgba(0, 0, 0, 0.87) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-primary-on-light, rgba(0, 0, 0, 0.87)) !important; }\n\n.mdc-theme--text-secondary-on-light {\n  color: rgba(0, 0, 0, 0.54) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-secondary-on-light, rgba(0, 0, 0, 0.54)) !important; }\n\n.mdc-theme--text-hint-on-light {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-hint-on-light, rgba(0, 0, 0, 0.38)) !important; }\n\n.mdc-theme--text-disabled-on-light {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-disabled-on-light, rgba(0, 0, 0, 0.38)) !important; }\n\n.mdc-theme--text-icon-on-light {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-icon-on-light, rgba(0, 0, 0, 0.38)) !important; }\n\n.mdc-theme--text-primary-on-dark {\n  color: white !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-primary-on-dark, white) !important; }\n\n.mdc-theme--text-secondary-on-dark {\n  color: rgba(255, 255, 255, 0.7) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-secondary-on-dark, rgba(255, 255, 255, 0.7)) !important; }\n\n.mdc-theme--text-hint-on-dark {\n  color: rgba(255, 255, 255, 0.5) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-hint-on-dark, rgba(255, 255, 255, 0.5)) !important; }\n\n.mdc-theme--text-disabled-on-dark {\n  color: rgba(255, 255, 255, 0.5) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-disabled-on-dark, rgba(255, 255, 255, 0.5)) !important; }\n\n.mdc-theme--text-icon-on-dark {\n  color: rgba(255, 255, 255, 0.5) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-icon-on-dark, rgba(255, 255, 255, 0.5)) !important; }\n\n.mdc-theme--primary-bg {\n  background-color: #26a69a !important;\n  /* \@alternate */\n  background-color: var(--mdc-theme-primary, #26a69a) !important; }\n\n.mdc-theme--secondary-bg {\n  background-color: #575756 !important;\n  /* \@alternate */\n  background-color: var(--mdc-theme-secondary, #575756) !important; }\n\n.mdc-typography {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased; }\n\n.mdc-typography--headline1 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1rem;\n  line-height: 0.875rem;\n  font-weight: 300;\n  letter-spacing: -0.01562em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--headline2 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1rem;\n  line-height: 0.875rem;\n  font-weight: 300;\n  letter-spacing: -0.00833em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--headline3 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1rem;\n  line-height: 0.875rem;\n  font-weight: 400;\n  letter-spacing: normal;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--headline4 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1rem;\n  line-height: 0.875rem;\n  font-weight: 400;\n  letter-spacing: 0.00735em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--headline5 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.875rem;\n  line-height: 0.875rem;\n  font-weight: 400;\n  letter-spacing: normal;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--headline6 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.875rem;\n  line-height: 0.875rem;\n  font-weight: 500;\n  letter-spacing: 0.0125em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--subtitle1 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.875rem;\n  line-height: 1.125rem;\n  font-weight: 400;\n  letter-spacing: 0.00937em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--subtitle2 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.8125rem;\n  line-height: 1.125rem;\n  font-weight: 500;\n  letter-spacing: 0.00714em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--body1 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.8125rem;\n  line-height: 1.5rem;\n  font-weight: 400;\n  letter-spacing: 0.03125em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--body2 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.8125rem;\n  line-height: 1.625rem;\n  font-weight: 400;\n  letter-spacing: 0.01786em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--caption {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.6875rem;\n  line-height: 0.875rem;\n  font-weight: 400;\n  letter-spacing: 0.03333em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--button {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.875rem;\n  line-height: 2.25rem;\n  font-weight: 500;\n  letter-spacing: 0.08929em;\n  text-decoration: none;\n  text-transform: none; }\n\n.mdc-typography--overline {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.6875rem;\n  line-height: 0.875rem;\n  font-weight: 500;\n  letter-spacing: 0.16667em;\n  text-decoration: none;\n  text-transform: uppercase; }\n\n\@-webkit-keyframes mdc-ripple-fg-radius-in {\n  from {\n    -webkit-animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n    -webkit-transform: translate(var(--mdc-ripple-fg-translate-start, 0)) scale(1);\n    transform: translate(var(--mdc-ripple-fg-translate-start, 0)) scale(1); }\n  to {\n    -webkit-transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1));\n    transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1)); } }\n\n\@keyframes mdc-ripple-fg-radius-in {\n  from {\n    -webkit-animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n    -webkit-transform: translate(var(--mdc-ripple-fg-translate-start, 0)) scale(1);\n    transform: translate(var(--mdc-ripple-fg-translate-start, 0)) scale(1); }\n  to {\n    -webkit-transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1));\n    transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1)); } }\n\n\@-webkit-keyframes mdc-ripple-fg-opacity-in {\n  from {\n    -webkit-animation-timing-function: linear;\n    animation-timing-function: linear;\n    opacity: 0; }\n  to {\n    opacity: var(--mdc-ripple-fg-opacity, 0); } }\n\n\@keyframes mdc-ripple-fg-opacity-in {\n  from {\n    -webkit-animation-timing-function: linear;\n    animation-timing-function: linear;\n    opacity: 0; }\n  to {\n    opacity: var(--mdc-ripple-fg-opacity, 0); } }\n\n\@-webkit-keyframes mdc-ripple-fg-opacity-out {\n  from {\n    -webkit-animation-timing-function: linear;\n    animation-timing-function: linear;\n    opacity: var(--mdc-ripple-fg-opacity, 0); }\n  to {\n    opacity: 0; } }\n\n\@keyframes mdc-ripple-fg-opacity-out {\n  from {\n    -webkit-animation-timing-function: linear;\n    animation-timing-function: linear;\n    opacity: var(--mdc-ripple-fg-opacity, 0); }\n  to {\n    opacity: 0; } }\n\n.mdc-ripple-surface--test-edge-var-bug {\n  --mdc-ripple-surface-test-edge-var: 0.0625rem solid #000;\n  visibility: hidden; }\n  .mdc-ripple-surface--test-edge-var-bug::before {\n    border: var(--mdc-ripple-surface-test-edge-var); }\n\n.mdc-switch {\n  display: inline-block;\n  position: relative;\n  outline: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n  .mdc-switch.mdc-switch--checked .mdc-switch__track {\n    background-color: #575756;\n    /* \@alternate */\n    background-color: var(--mdc-theme-secondary, #575756);\n    border-color: #575756;\n    /* \@alternate */\n    border-color: var(--mdc-theme-secondary, #575756); }\n  .mdc-switch.mdc-switch--checked .mdc-switch__thumb {\n    background-color: #575756;\n    /* \@alternate */\n    background-color: var(--mdc-theme-secondary, #575756);\n    border-color: #575756;\n    /* \@alternate */\n    border-color: var(--mdc-theme-secondary, #575756); }\n  .mdc-switch:not(.mdc-switch--checked) .mdc-switch__track {\n    background-color: #000;\n    border-color: #000; }\n  .mdc-switch:not(.mdc-switch--checked) .mdc-switch__thumb {\n    background-color: #fff;\n    border-color: #fff; }\n  .mdc-switch:not(.mdc-switch--checked) .mdc-switch__thumb-underlay::before, .mdc-switch:not(.mdc-switch--checked) .mdc-switch__thumb-underlay::after {\n    background-color: #9e9e9e; }\n  .mdc-switch:not(.mdc-switch--checked) .mdc-switch__thumb-underlay:hover::before {\n    opacity: 0.08; }\n  .mdc-switch:not(.mdc-switch--checked) .mdc-switch__thumb-underlay:not(.mdc-ripple-upgraded):focus::before, .mdc-switch:not(.mdc-switch--checked) .mdc-switch__thumb-underlay.mdc-ripple-upgraded--background-focused::before {\n    -webkit-transition-duration: 75ms;\n    transition-duration: 75ms;\n    opacity: 0.24; }\n  .mdc-switch:not(.mdc-switch--checked) .mdc-switch__thumb-underlay:not(.mdc-ripple-upgraded)::after {\n    -webkit-transition: opacity 150ms linear;\n    transition: opacity 150ms linear; }\n  .mdc-switch:not(.mdc-switch--checked) .mdc-switch__thumb-underlay:not(.mdc-ripple-upgraded):active::after {\n    -webkit-transition-duration: 75ms;\n    transition-duration: 75ms;\n    opacity: 0.32; }\n  .mdc-switch:not(.mdc-switch--checked) .mdc-switch__thumb-underlay.mdc-ripple-upgraded {\n    --mdc-ripple-fg-opacity: 0.32; }\n\n.mdc-switch__native-control {\n  /* \@noflip */\n  left: 0;\n  /* \@noflip */\n  right: initial;\n  position: absolute;\n  top: 0;\n  width: 4.25rem;\n  height: 3rem;\n  margin: 0;\n  opacity: 0;\n  cursor: pointer;\n  pointer-events: auto; }\n  [dir=\"rtl\"] .mdc-switch__native-control, .mdc-switch__native-control[dir=\"rtl\"] {\n    /* \@noflip */\n    left: initial;\n    /* \@noflip */\n    right: 0; }\n\n.mdc-switch__track {\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box;\n  width: 2rem;\n  height: 0.875rem;\n  -webkit-transition: opacity 90ms cubic-bezier(0.4, 0, 0.2, 1), background-color 90ms cubic-bezier(0.4, 0, 0.2, 1), border-color 90ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: opacity 90ms cubic-bezier(0.4, 0, 0.2, 1), background-color 90ms cubic-bezier(0.4, 0, 0.2, 1), border-color 90ms cubic-bezier(0.4, 0, 0.2, 1);\n  border: 0.0625rem solid;\n  border-radius: 0.4375rem;\n  opacity: .38; }\n\n.mdc-switch__thumb-underlay {\n  /* \@noflip */\n  left: -1.125rem;\n  /* \@noflip */\n  right: initial;\n  --mdc-ripple-fg-size: 0;\n  --mdc-ripple-left: 0;\n  --mdc-ripple-top: 0;\n  --mdc-ripple-fg-scale: 1;\n  --mdc-ripple-fg-translate-end: 0;\n  --mdc-ripple-fg-translate-start: 0;\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n  will-change: transform, opacity;\n  display: -ms-flexbox;\n  display: flex;\n  position: absolute;\n  top: -1.0625rem;\n  -ms-flex-align: center;\n  align-items: center;\n  -ms-flex-pack: center;\n  justify-content: center;\n  width: 3rem;\n  height: 3rem;\n  -webkit-transform: translateX(0);\n  transform: translateX(0);\n  -webkit-transition: background-color 90ms cubic-bezier(0.4, 0, 0.2, 1), border-color 90ms cubic-bezier(0.4, 0, 0.2, 1), -webkit-transform 90ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: background-color 90ms cubic-bezier(0.4, 0, 0.2, 1), border-color 90ms cubic-bezier(0.4, 0, 0.2, 1), -webkit-transform 90ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: transform 90ms cubic-bezier(0.4, 0, 0.2, 1), background-color 90ms cubic-bezier(0.4, 0, 0.2, 1), border-color 90ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: transform 90ms cubic-bezier(0.4, 0, 0.2, 1), background-color 90ms cubic-bezier(0.4, 0, 0.2, 1), border-color 90ms cubic-bezier(0.4, 0, 0.2, 1), -webkit-transform 90ms cubic-bezier(0.4, 0, 0.2, 1); }\n  [dir=\"rtl\"] .mdc-switch__thumb-underlay, .mdc-switch__thumb-underlay[dir=\"rtl\"] {\n    /* \@noflip */\n    left: initial;\n    /* \@noflip */\n    right: -1.125rem; }\n  .mdc-switch__thumb-underlay::before, .mdc-switch__thumb-underlay::after {\n    position: absolute;\n    border-radius: 50%;\n    opacity: 0;\n    pointer-events: none;\n    content: \"\"; }\n  .mdc-switch__thumb-underlay::before {\n    -webkit-transition: opacity 15ms linear, background-color 15ms linear;\n    transition: opacity 15ms linear, background-color 15ms linear;\n    z-index: 1; }\n  .mdc-switch__thumb-underlay.mdc-ripple-upgraded::before {\n    -webkit-transform: scale(var(--mdc-ripple-fg-scale, 1));\n    transform: scale(var(--mdc-ripple-fg-scale, 1)); }\n  .mdc-switch__thumb-underlay.mdc-ripple-upgraded::after {\n    top: 0;\n    /* \@noflip */\n    left: 0;\n    -webkit-transform: scale(0);\n    transform: scale(0);\n    -webkit-transform-origin: center center;\n    transform-origin: center center; }\n  .mdc-switch__thumb-underlay.mdc-ripple-upgraded--unbounded::after {\n    top: var(--mdc-ripple-top, 0);\n    /* \@noflip */\n    left: var(--mdc-ripple-left, 0); }\n  .mdc-switch__thumb-underlay.mdc-ripple-upgraded--foreground-activation::after {\n    -webkit-animation: 225ms mdc-ripple-fg-radius-in forwards, 75ms mdc-ripple-fg-opacity-in forwards;\n    animation: 225ms mdc-ripple-fg-radius-in forwards, 75ms mdc-ripple-fg-opacity-in forwards; }\n  .mdc-switch__thumb-underlay.mdc-ripple-upgraded--foreground-deactivation::after {\n    -webkit-animation: 150ms mdc-ripple-fg-opacity-out;\n    animation: 150ms mdc-ripple-fg-opacity-out;\n    -webkit-transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1));\n    transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1)); }\n  .mdc-switch__thumb-underlay::before, .mdc-switch__thumb-underlay::after {\n    top: calc(50% - 50%);\n    /* \@noflip */\n    left: calc(50% - 50%);\n    width: 100%;\n    height: 100%; }\n  .mdc-switch__thumb-underlay.mdc-ripple-upgraded::before, .mdc-switch__thumb-underlay.mdc-ripple-upgraded::after {\n    top: var(--mdc-ripple-top, calc(50% - 50%));\n    /* \@noflip */\n    left: var(--mdc-ripple-left, calc(50% - 50%));\n    width: var(--mdc-ripple-fg-size, 100%);\n    height: var(--mdc-ripple-fg-size, 100%); }\n  .mdc-switch__thumb-underlay.mdc-ripple-upgraded::after {\n    width: var(--mdc-ripple-fg-size, 100%);\n    height: var(--mdc-ripple-fg-size, 100%); }\n  .mdc-switch__thumb-underlay::before, .mdc-switch__thumb-underlay::after {\n    background-color: #575756; }\n    \@supports not (-ms-ime-align: auto) {\n      .mdc-switch__thumb-underlay::before, .mdc-switch__thumb-underlay::after {\n        /* \@alternate */\n        background-color: var(--mdc-theme-secondary, #575756); } }\n  .mdc-switch__thumb-underlay:hover::before {\n    opacity: 0.04; }\n  .mdc-switch__thumb-underlay:not(.mdc-ripple-upgraded):focus::before, .mdc-switch__thumb-underlay.mdc-ripple-upgraded--background-focused::before {\n    -webkit-transition-duration: 75ms;\n    transition-duration: 75ms;\n    opacity: 0.12; }\n  .mdc-switch__thumb-underlay:not(.mdc-ripple-upgraded)::after {\n    -webkit-transition: opacity 150ms linear;\n    transition: opacity 150ms linear; }\n  .mdc-switch__thumb-underlay:not(.mdc-ripple-upgraded):active::after {\n    -webkit-transition-duration: 75ms;\n    transition-duration: 75ms;\n    opacity: 0.16; }\n  .mdc-switch__thumb-underlay.mdc-ripple-upgraded {\n    --mdc-ripple-fg-opacity: 0.16; }\n\n.mdc-switch__thumb {\n  -webkit-box-shadow: 0rem 0.1875rem 0.0625rem -0.125rem rgba(0, 0, 0, 0.2), 0rem 0.125rem 0.125rem 0rem rgba(0, 0, 0, 0.14), 0rem 0.0625rem 0.3125rem 0rem rgba(0, 0, 0, 0.12);\n  box-shadow: 0rem 0.1875rem 0.0625rem -0.125rem rgba(0, 0, 0, 0.2), 0rem 0.125rem 0.125rem 0rem rgba(0, 0, 0, 0.14), 0rem 0.0625rem 0.3125rem 0rem rgba(0, 0, 0, 0.12);\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box;\n  width: 1.25rem;\n  height: 1.25rem;\n  border: 0.625rem solid;\n  border-radius: 50%;\n  pointer-events: none;\n  z-index: 1; }\n\n.mdc-switch--checked .mdc-switch__track {\n  opacity: .54; }\n\n.mdc-switch--checked .mdc-switch__thumb-underlay {\n  -webkit-transform: translateX(1.25rem);\n  transform: translateX(1.25rem); }\n  [dir=\"rtl\"] .mdc-switch--checked .mdc-switch__thumb-underlay, .mdc-switch--checked .mdc-switch__thumb-underlay[dir=\"rtl\"] {\n    -webkit-transform: translateX(-1.25rem);\n    transform: translateX(-1.25rem); }\n\n.mdc-switch--checked .mdc-switch__native-control {\n  -webkit-transform: translateX(-1.25rem);\n  transform: translateX(-1.25rem); }\n  [dir=\"rtl\"] .mdc-switch--checked .mdc-switch__native-control, .mdc-switch--checked .mdc-switch__native-control[dir=\"rtl\"] {\n    -webkit-transform: translateX(1.25rem);\n    transform: translateX(1.25rem); }\n\n.mdc-switch--disabled {\n  opacity: .38;\n  pointer-events: none; }\n  .mdc-switch--disabled .mdc-switch__thumb {\n    border-width: 0.0625rem; }\n  .mdc-switch--disabled .mdc-switch__native-control {\n    cursor: default;\n    pointer-events: none; }\n\n.mdc-switch {\n  margin-right: 0.5rem; }\n  .mdc-switch.mdc-switch--checked .mdc-switch__track {\n    background-color: #26a69a;\n    /* \@alternate */\n    background-color: var(--mdc-theme-primary, #26a69a);\n    border-color: #26a69a;\n    /* \@alternate */\n    border-color: var(--mdc-theme-primary, #26a69a); }\n  .mdc-switch.mdc-switch--checked .mdc-switch__thumb {\n    background-color: #26a69a;\n    /* \@alternate */\n    background-color: var(--mdc-theme-primary, #26a69a);\n    border-color: #26a69a;\n    /* \@alternate */\n    border-color: var(--mdc-theme-primary, #26a69a); }\n  .mdc-switch.mdc-switch--checked .mdc-switch__thumb-underlay::before, .mdc-switch.mdc-switch--checked .mdc-switch__thumb-underlay::after {\n    background-color: #26a69a; }\n    \@supports not (-ms-ime-align: auto) {\n      .mdc-switch.mdc-switch--checked .mdc-switch__thumb-underlay::before, .mdc-switch.mdc-switch--checked .mdc-switch__thumb-underlay::after {\n        /* \@alternate */\n        background-color: var(--mdc-theme-primary, #26a69a); } }\n  .mdc-switch.mdc-switch--checked .mdc-switch__thumb-underlay:hover::before {\n    opacity: 0.08; }\n  .mdc-switch.mdc-switch--checked .mdc-switch__thumb-underlay:not(.mdc-ripple-upgraded):focus::before, .mdc-switch.mdc-switch--checked .mdc-switch__thumb-underlay.mdc-ripple-upgraded--background-focused::before {\n    -webkit-transition-duration: 75ms;\n    transition-duration: 75ms;\n    opacity: 0.24; }\n  .mdc-switch.mdc-switch--checked .mdc-switch__thumb-underlay:not(.mdc-ripple-upgraded)::after {\n    -webkit-transition: opacity 150ms linear;\n    transition: opacity 150ms linear; }\n  .mdc-switch.mdc-switch--checked .mdc-switch__thumb-underlay:not(.mdc-ripple-upgraded):active::after {\n    -webkit-transition-duration: 75ms;\n    transition-duration: 75ms;\n    opacity: 0.32; }\n  .mdc-switch.mdc-switch--checked .mdc-switch__thumb-underlay.mdc-ripple-upgraded {\n    --mdc-ripple-fg-opacity: 0.32; }\n\nlabel {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.8125rem;\n  line-height: 1.625rem;\n  font-weight: 400;\n  letter-spacing: 0.01786em;\n  text-decoration: inherit;\n  text-transform: inherit;\n  cursor: pointer; }\n  label.disabled {\n    cursor: default; }"; }
}

export { Switch as LimelSwitch };
