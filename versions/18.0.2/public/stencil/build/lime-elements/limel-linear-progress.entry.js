const h = window.LimeElements.h;

import { a as MDCFoundation, b as MDCComponent } from './chunk-d211df41.js';
import { b as transformStyleProperties } from './chunk-134adbd7.js';

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

const cssClasses = {
  CLOSED_CLASS: 'mdc-linear-progress--closed',
  INDETERMINATE_CLASS: 'mdc-linear-progress--indeterminate',
  REVERSED_CLASS: 'mdc-linear-progress--reversed',
};

const strings = {
  PRIMARY_BAR_SELECTOR: '.mdc-linear-progress__primary-bar',
  BUFFER_SELECTOR: '.mdc-linear-progress__buffer',
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

class MDCLinearProgressFoundation extends MDCFoundation {
  static get cssClasses() {
    return cssClasses;
  }

  static get strings() {
    return strings;
  }

  static get defaultAdapter() {
    return {
      addClass: (/* className: string */) => {},
      getPrimaryBar: () => /* el: Element */ {},
      getBuffer: () => /* el: Element */ {},
      hasClass: (/* className: string */) => false,
      removeClass: (/* className: string */) => {},
      setStyle: (/* el: Element, styleProperty: string, value: string */) => {},
    };
  }

  constructor(adapter) {
    super(Object.assign(MDCLinearProgressFoundation.defaultAdapter, adapter));
  }

  init() {
    this.determinate_ = !this.adapter_.hasClass(cssClasses.INDETERMINATE_CLASS);
    this.reverse_ = this.adapter_.hasClass(cssClasses.REVERSED_CLASS);
    this.progress_ = 0;
  }

  setDeterminate(isDeterminate) {
    this.determinate_ = isDeterminate;
    if (this.determinate_) {
      this.adapter_.removeClass(cssClasses.INDETERMINATE_CLASS);
      this.setScale_(this.adapter_.getPrimaryBar(), this.progress_);
    } else {
      this.adapter_.addClass(cssClasses.INDETERMINATE_CLASS);
      this.setScale_(this.adapter_.getPrimaryBar(), 1);
      this.setScale_(this.adapter_.getBuffer(), 1);
    }
  }

  setProgress(value) {
    this.progress_ = value;
    if (this.determinate_) {
      this.setScale_(this.adapter_.getPrimaryBar(), value);
    }
  }

  setBuffer(value) {
    if (this.determinate_) {
      this.setScale_(this.adapter_.getBuffer(), value);
    }
  }

  setReverse(isReversed) {
    this.reverse_ = isReversed;
    if (this.reverse_) {
      this.adapter_.addClass(cssClasses.REVERSED_CLASS);
    } else {
      this.adapter_.removeClass(cssClasses.REVERSED_CLASS);
    }
  }

  open() {
    this.adapter_.removeClass(cssClasses.CLOSED_CLASS);
  }

  close() {
    this.adapter_.addClass(cssClasses.CLOSED_CLASS);
  }

  setScale_(el, scaleValue) {
    const value = 'scaleX(' + scaleValue + ')';
    transformStyleProperties.forEach((transformStyleProperty) => {
      this.adapter_.setStyle(el, transformStyleProperty, value);
    });
  }
}

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

class MDCLinearProgress extends MDCComponent {
  static attachTo(root) {
    return new MDCLinearProgress(root);
  }

  set determinate(value) {
    this.foundation_.setDeterminate(value);
  }

  set progress(value) {
    this.foundation_.setProgress(value);
  }

  set buffer(value) {
    this.foundation_.setBuffer(value);
  }

  set reverse(value) {
    this.foundation_.setReverse(value);
  }

  open() {
    this.foundation_.open();
  }

  close() {
    this.foundation_.close();
  }

  getDefaultFoundation() {
    return new MDCLinearProgressFoundation({
      addClass: (className) => this.root_.classList.add(className),
      getPrimaryBar: () => this.root_.querySelector(MDCLinearProgressFoundation.strings.PRIMARY_BAR_SELECTOR),
      getBuffer: () => this.root_.querySelector(MDCLinearProgressFoundation.strings.BUFFER_SELECTOR),
      hasClass: (className) => this.root_.classList.contains(className),
      removeClass: (className) => this.root_.classList.remove(className),
      setStyle: (el, styleProperty, value) => el.style[styleProperty] = value,
    });
  }
}

class LinearProgress {
    constructor() {
        /**
         * The value of the progress bar. Should be between `0` and `1`.
         */
        this.value = 0;
        /**
         * Puts the progress bar in an indeterminate state
         */
        this.indeterminate = false;
    }
    componentDidLoad() {
        this.mdcLinearProgress = new MDCLinearProgress(this.host.shadowRoot.querySelector('.mdc-linear-progress'));
        this.mdcLinearProgress.progress = this.value;
    }
    componentDidUnload() {
        if (this.mdcLinearProgress) {
            this.mdcLinearProgress.destroy();
        }
    }
    render() {
        return (h("div", { role: "progressbar", class: `mdc-linear-progress ${this.indeterminate
                ? 'mdc-linear-progress--indeterminate'
                : ''}` },
            h("div", { class: "mdc-linear-progress__buffering-dots" }),
            h("div", { class: "mdc-linear-progress__buffer" }),
            h("div", { class: "mdc-linear-progress__bar mdc-linear-progress__primary-bar" },
                h("span", { class: "mdc-linear-progress__bar-inner" })),
            h("div", { class: "mdc-linear-progress__bar mdc-linear-progress__secondary-bar" },
                h("span", { class: "mdc-linear-progress__bar-inner" }))));
    }
    watchValue(newValue) {
        this.mdcLinearProgress.progress = newValue;
    }
    static get is() { return "limel-linear-progress"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "host": {
            "elementRef": true
        },
        "indeterminate": {
            "type": Boolean,
            "attr": "indeterminate"
        },
        "value": {
            "type": Number,
            "attr": "value",
            "watchCallbacks": ["watchValue"]
        }
    }; }
    static get style() { return ":host {\n  --mdc-theme-primary: var(--lime-primary-color, #26a69a);\n  --mdc-theme-secondary: var(--lime-secondary-color, #575756);\n  --mdc-theme-on-primary: var(--lime-on-primary-color, #fff);\n  --mdc-theme-on-secondary: var(--lime-on-secondary-color, #fff); }\n\n:root {\n  --mdc-theme-primary: #26a69a;\n  --mdc-theme-secondary: #575756;\n  --mdc-theme-background: #fff;\n  --mdc-theme-surface: #fff;\n  --mdc-theme-error: #b00020;\n  --mdc-theme-on-primary: #fff;\n  --mdc-theme-on-secondary: #fff;\n  --mdc-theme-on-surface: #000;\n  --mdc-theme-on-error: #fff;\n  --mdc-theme-text-primary-on-background: rgba(0, 0, 0, 0.87);\n  --mdc-theme-text-secondary-on-background: rgba(0, 0, 0, 0.54);\n  --mdc-theme-text-hint-on-background: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-disabled-on-background: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-icon-on-background: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-primary-on-light: rgba(0, 0, 0, 0.87);\n  --mdc-theme-text-secondary-on-light: rgba(0, 0, 0, 0.54);\n  --mdc-theme-text-hint-on-light: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-disabled-on-light: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-icon-on-light: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-primary-on-dark: white;\n  --mdc-theme-text-secondary-on-dark: rgba(255, 255, 255, 0.7);\n  --mdc-theme-text-hint-on-dark: rgba(255, 255, 255, 0.5);\n  --mdc-theme-text-disabled-on-dark: rgba(255, 255, 255, 0.5);\n  --mdc-theme-text-icon-on-dark: rgba(255, 255, 255, 0.5); }\n\n.mdc-theme--primary {\n  color: #26a69a !important;\n  /* \@alternate */\n  color: var(--mdc-theme-primary, #26a69a) !important; }\n\n.mdc-theme--secondary {\n  color: #575756 !important;\n  /* \@alternate */\n  color: var(--mdc-theme-secondary, #575756) !important; }\n\n.mdc-theme--background {\n  background-color: #fff;\n  /* \@alternate */\n  background-color: var(--mdc-theme-background, #fff); }\n\n.mdc-theme--surface {\n  background-color: #fff;\n  /* \@alternate */\n  background-color: var(--mdc-theme-surface, #fff); }\n\n.mdc-theme--error {\n  color: #b00020 !important;\n  /* \@alternate */\n  color: var(--mdc-theme-error, #b00020) !important; }\n\n.mdc-theme--on-primary {\n  color: #fff !important;\n  /* \@alternate */\n  color: var(--mdc-theme-on-primary, #fff) !important; }\n\n.mdc-theme--on-secondary {\n  color: #fff !important;\n  /* \@alternate */\n  color: var(--mdc-theme-on-secondary, #fff) !important; }\n\n.mdc-theme--on-surface {\n  color: #000 !important;\n  /* \@alternate */\n  color: var(--mdc-theme-on-surface, #000) !important; }\n\n.mdc-theme--on-error {\n  color: #fff !important;\n  /* \@alternate */\n  color: var(--mdc-theme-on-error, #fff) !important; }\n\n.mdc-theme--text-primary-on-background {\n  color: rgba(0, 0, 0, 0.87) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-primary-on-background, rgba(0, 0, 0, 0.87)) !important; }\n\n.mdc-theme--text-secondary-on-background {\n  color: rgba(0, 0, 0, 0.54) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-secondary-on-background, rgba(0, 0, 0, 0.54)) !important; }\n\n.mdc-theme--text-hint-on-background {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.38)) !important; }\n\n.mdc-theme--text-disabled-on-background {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-disabled-on-background, rgba(0, 0, 0, 0.38)) !important; }\n\n.mdc-theme--text-icon-on-background {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-icon-on-background, rgba(0, 0, 0, 0.38)) !important; }\n\n.mdc-theme--text-primary-on-light {\n  color: rgba(0, 0, 0, 0.87) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-primary-on-light, rgba(0, 0, 0, 0.87)) !important; }\n\n.mdc-theme--text-secondary-on-light {\n  color: rgba(0, 0, 0, 0.54) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-secondary-on-light, rgba(0, 0, 0, 0.54)) !important; }\n\n.mdc-theme--text-hint-on-light {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-hint-on-light, rgba(0, 0, 0, 0.38)) !important; }\n\n.mdc-theme--text-disabled-on-light {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-disabled-on-light, rgba(0, 0, 0, 0.38)) !important; }\n\n.mdc-theme--text-icon-on-light {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-icon-on-light, rgba(0, 0, 0, 0.38)) !important; }\n\n.mdc-theme--text-primary-on-dark {\n  color: white !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-primary-on-dark, white) !important; }\n\n.mdc-theme--text-secondary-on-dark {\n  color: rgba(255, 255, 255, 0.7) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-secondary-on-dark, rgba(255, 255, 255, 0.7)) !important; }\n\n.mdc-theme--text-hint-on-dark {\n  color: rgba(255, 255, 255, 0.5) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-hint-on-dark, rgba(255, 255, 255, 0.5)) !important; }\n\n.mdc-theme--text-disabled-on-dark {\n  color: rgba(255, 255, 255, 0.5) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-disabled-on-dark, rgba(255, 255, 255, 0.5)) !important; }\n\n.mdc-theme--text-icon-on-dark {\n  color: rgba(255, 255, 255, 0.5) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-icon-on-dark, rgba(255, 255, 255, 0.5)) !important; }\n\n.mdc-theme--primary-bg {\n  background-color: #26a69a !important;\n  /* \@alternate */\n  background-color: var(--mdc-theme-primary, #26a69a) !important; }\n\n.mdc-theme--secondary-bg {\n  background-color: #575756 !important;\n  /* \@alternate */\n  background-color: var(--mdc-theme-secondary, #575756) !important; }\n\n.mdc-typography {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased; }\n\n.mdc-typography--headline1 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1rem;\n  line-height: 0.875rem;\n  font-weight: 300;\n  letter-spacing: -0.01562em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--headline2 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1rem;\n  line-height: 0.875rem;\n  font-weight: 300;\n  letter-spacing: -0.00833em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--headline3 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1rem;\n  line-height: 0.875rem;\n  font-weight: 400;\n  letter-spacing: normal;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--headline4 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1rem;\n  line-height: 0.875rem;\n  font-weight: 400;\n  letter-spacing: 0.00735em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--headline5 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.875rem;\n  line-height: 0.875rem;\n  font-weight: 400;\n  letter-spacing: normal;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--headline6 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.875rem;\n  line-height: 0.875rem;\n  font-weight: 500;\n  letter-spacing: 0.0125em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--subtitle1 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.875rem;\n  line-height: 1.125rem;\n  font-weight: 400;\n  letter-spacing: 0.00937em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--subtitle2 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.8125rem;\n  line-height: 1.125rem;\n  font-weight: 500;\n  letter-spacing: 0.00714em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--body1 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.8125rem;\n  line-height: 1.5rem;\n  font-weight: 400;\n  letter-spacing: 0.03125em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--body2 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.8125rem;\n  line-height: 1.625rem;\n  font-weight: 400;\n  letter-spacing: 0.01786em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--caption {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.6875rem;\n  line-height: 0.875rem;\n  font-weight: 400;\n  letter-spacing: 0.03333em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--button {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.875rem;\n  line-height: 2.25rem;\n  font-weight: 500;\n  letter-spacing: 0.08929em;\n  text-decoration: none;\n  text-transform: none; }\n\n.mdc-typography--overline {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.6875rem;\n  line-height: 0.875rem;\n  font-weight: 500;\n  letter-spacing: 0.16667em;\n  text-decoration: none;\n  text-transform: uppercase; }\n\n\@-webkit-keyframes primary-indeterminate-translate {\n  0% {\n    -webkit-transform: translateX(0);\n    transform: translateX(0); }\n  20% {\n    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    -webkit-transform: translateX(0);\n    transform: translateX(0); }\n  59.15% {\n    -webkit-animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    -webkit-transform: translateX(83.67142%);\n    transform: translateX(83.67142%); }\n  100% {\n    -webkit-transform: translateX(200.61106%);\n    transform: translateX(200.61106%); } }\n\n\@keyframes primary-indeterminate-translate {\n  0% {\n    -webkit-transform: translateX(0);\n    transform: translateX(0); }\n  20% {\n    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    -webkit-transform: translateX(0);\n    transform: translateX(0); }\n  59.15% {\n    -webkit-animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    -webkit-transform: translateX(83.67142%);\n    transform: translateX(83.67142%); }\n  100% {\n    -webkit-transform: translateX(200.61106%);\n    transform: translateX(200.61106%); } }\n\n\@-webkit-keyframes primary-indeterminate-scale {\n  0% {\n    -webkit-transform: scaleX(0.08);\n    transform: scaleX(0.08); }\n  36.65% {\n    -webkit-animation-timing-function: cubic-bezier(0.33473, 0.12482, 0.78584, 1);\n    animation-timing-function: cubic-bezier(0.33473, 0.12482, 0.78584, 1);\n    -webkit-transform: scaleX(0.08);\n    transform: scaleX(0.08); }\n  69.15% {\n    -webkit-animation-timing-function: cubic-bezier(0.06, 0.11, 0.6, 1);\n    animation-timing-function: cubic-bezier(0.06, 0.11, 0.6, 1);\n    -webkit-transform: scaleX(0.66148);\n    transform: scaleX(0.66148); }\n  100% {\n    -webkit-transform: scaleX(0.08);\n    transform: scaleX(0.08); } }\n\n\@keyframes primary-indeterminate-scale {\n  0% {\n    -webkit-transform: scaleX(0.08);\n    transform: scaleX(0.08); }\n  36.65% {\n    -webkit-animation-timing-function: cubic-bezier(0.33473, 0.12482, 0.78584, 1);\n    animation-timing-function: cubic-bezier(0.33473, 0.12482, 0.78584, 1);\n    -webkit-transform: scaleX(0.08);\n    transform: scaleX(0.08); }\n  69.15% {\n    -webkit-animation-timing-function: cubic-bezier(0.06, 0.11, 0.6, 1);\n    animation-timing-function: cubic-bezier(0.06, 0.11, 0.6, 1);\n    -webkit-transform: scaleX(0.66148);\n    transform: scaleX(0.66148); }\n  100% {\n    -webkit-transform: scaleX(0.08);\n    transform: scaleX(0.08); } }\n\n\@-webkit-keyframes secondary-indeterminate-translate {\n  0% {\n    -webkit-animation-timing-function: cubic-bezier(0.15, 0, 0.51506, 0.40969);\n    animation-timing-function: cubic-bezier(0.15, 0, 0.51506, 0.40969);\n    -webkit-transform: translateX(0);\n    transform: translateX(0); }\n  25% {\n    -webkit-animation-timing-function: cubic-bezier(0.31033, 0.28406, 0.8, 0.73371);\n    animation-timing-function: cubic-bezier(0.31033, 0.28406, 0.8, 0.73371);\n    -webkit-transform: translateX(37.65191%);\n    transform: translateX(37.65191%); }\n  48.35% {\n    -webkit-animation-timing-function: cubic-bezier(0.4, 0.62704, 0.6, 0.90203);\n    animation-timing-function: cubic-bezier(0.4, 0.62704, 0.6, 0.90203);\n    -webkit-transform: translateX(84.38617%);\n    transform: translateX(84.38617%); }\n  100% {\n    -webkit-transform: translateX(160.27778%);\n    transform: translateX(160.27778%); } }\n\n\@keyframes secondary-indeterminate-translate {\n  0% {\n    -webkit-animation-timing-function: cubic-bezier(0.15, 0, 0.51506, 0.40969);\n    animation-timing-function: cubic-bezier(0.15, 0, 0.51506, 0.40969);\n    -webkit-transform: translateX(0);\n    transform: translateX(0); }\n  25% {\n    -webkit-animation-timing-function: cubic-bezier(0.31033, 0.28406, 0.8, 0.73371);\n    animation-timing-function: cubic-bezier(0.31033, 0.28406, 0.8, 0.73371);\n    -webkit-transform: translateX(37.65191%);\n    transform: translateX(37.65191%); }\n  48.35% {\n    -webkit-animation-timing-function: cubic-bezier(0.4, 0.62704, 0.6, 0.90203);\n    animation-timing-function: cubic-bezier(0.4, 0.62704, 0.6, 0.90203);\n    -webkit-transform: translateX(84.38617%);\n    transform: translateX(84.38617%); }\n  100% {\n    -webkit-transform: translateX(160.27778%);\n    transform: translateX(160.27778%); } }\n\n\@-webkit-keyframes secondary-indeterminate-scale {\n  0% {\n    -webkit-animation-timing-function: cubic-bezier(0.20503, 0.05705, 0.57661, 0.45397);\n    animation-timing-function: cubic-bezier(0.20503, 0.05705, 0.57661, 0.45397);\n    -webkit-transform: scaleX(0.08);\n    transform: scaleX(0.08); }\n  19.15% {\n    -webkit-animation-timing-function: cubic-bezier(0.15231, 0.19643, 0.64837, 1.00432);\n    animation-timing-function: cubic-bezier(0.15231, 0.19643, 0.64837, 1.00432);\n    -webkit-transform: scaleX(0.4571);\n    transform: scaleX(0.4571); }\n  44.15% {\n    -webkit-animation-timing-function: cubic-bezier(0.25776, -0.00316, 0.21176, 1.38179);\n    animation-timing-function: cubic-bezier(0.25776, -0.00316, 0.21176, 1.38179);\n    -webkit-transform: scaleX(0.72796);\n    transform: scaleX(0.72796); }\n  100% {\n    -webkit-transform: scaleX(0.08);\n    transform: scaleX(0.08); } }\n\n\@keyframes secondary-indeterminate-scale {\n  0% {\n    -webkit-animation-timing-function: cubic-bezier(0.20503, 0.05705, 0.57661, 0.45397);\n    animation-timing-function: cubic-bezier(0.20503, 0.05705, 0.57661, 0.45397);\n    -webkit-transform: scaleX(0.08);\n    transform: scaleX(0.08); }\n  19.15% {\n    -webkit-animation-timing-function: cubic-bezier(0.15231, 0.19643, 0.64837, 1.00432);\n    animation-timing-function: cubic-bezier(0.15231, 0.19643, 0.64837, 1.00432);\n    -webkit-transform: scaleX(0.4571);\n    transform: scaleX(0.4571); }\n  44.15% {\n    -webkit-animation-timing-function: cubic-bezier(0.25776, -0.00316, 0.21176, 1.38179);\n    animation-timing-function: cubic-bezier(0.25776, -0.00316, 0.21176, 1.38179);\n    -webkit-transform: scaleX(0.72796);\n    transform: scaleX(0.72796); }\n  100% {\n    -webkit-transform: scaleX(0.08);\n    transform: scaleX(0.08); } }\n\n\@-webkit-keyframes buffering {\n  to {\n    -webkit-transform: translateX(-0.625rem);\n    transform: translateX(-0.625rem); } }\n\n\@keyframes buffering {\n  to {\n    -webkit-transform: translateX(-0.625rem);\n    transform: translateX(-0.625rem); } }\n\n\@-webkit-keyframes primary-indeterminate-translate-reverse {\n  0% {\n    -webkit-transform: translateX(0);\n    transform: translateX(0); }\n  20% {\n    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    -webkit-transform: translateX(0);\n    transform: translateX(0); }\n  59.15% {\n    -webkit-animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    -webkit-transform: translateX(-83.67142%);\n    transform: translateX(-83.67142%); }\n  100% {\n    -webkit-transform: translateX(-200.61106%);\n    transform: translateX(-200.61106%); } }\n\n\@keyframes primary-indeterminate-translate-reverse {\n  0% {\n    -webkit-transform: translateX(0);\n    transform: translateX(0); }\n  20% {\n    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    -webkit-transform: translateX(0);\n    transform: translateX(0); }\n  59.15% {\n    -webkit-animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    -webkit-transform: translateX(-83.67142%);\n    transform: translateX(-83.67142%); }\n  100% {\n    -webkit-transform: translateX(-200.61106%);\n    transform: translateX(-200.61106%); } }\n\n\@-webkit-keyframes secondary-indeterminate-translate-reverse {\n  0% {\n    -webkit-animation-timing-function: cubic-bezier(0.15, 0, 0.51506, 0.40969);\n    animation-timing-function: cubic-bezier(0.15, 0, 0.51506, 0.40969);\n    -webkit-transform: translateX(0);\n    transform: translateX(0); }\n  25% {\n    -webkit-animation-timing-function: cubic-bezier(0.31033, 0.28406, 0.8, 0.73371);\n    animation-timing-function: cubic-bezier(0.31033, 0.28406, 0.8, 0.73371);\n    -webkit-transform: translateX(-37.65191%);\n    transform: translateX(-37.65191%); }\n  48.35% {\n    -webkit-animation-timing-function: cubic-bezier(0.4, 0.62704, 0.6, 0.90203);\n    animation-timing-function: cubic-bezier(0.4, 0.62704, 0.6, 0.90203);\n    -webkit-transform: translateX(-84.38617%);\n    transform: translateX(-84.38617%); }\n  100% {\n    -webkit-transform: translateX(-160.27778%);\n    transform: translateX(-160.27778%); } }\n\n\@keyframes secondary-indeterminate-translate-reverse {\n  0% {\n    -webkit-animation-timing-function: cubic-bezier(0.15, 0, 0.51506, 0.40969);\n    animation-timing-function: cubic-bezier(0.15, 0, 0.51506, 0.40969);\n    -webkit-transform: translateX(0);\n    transform: translateX(0); }\n  25% {\n    -webkit-animation-timing-function: cubic-bezier(0.31033, 0.28406, 0.8, 0.73371);\n    animation-timing-function: cubic-bezier(0.31033, 0.28406, 0.8, 0.73371);\n    -webkit-transform: translateX(-37.65191%);\n    transform: translateX(-37.65191%); }\n  48.35% {\n    -webkit-animation-timing-function: cubic-bezier(0.4, 0.62704, 0.6, 0.90203);\n    animation-timing-function: cubic-bezier(0.4, 0.62704, 0.6, 0.90203);\n    -webkit-transform: translateX(-84.38617%);\n    transform: translateX(-84.38617%); }\n  100% {\n    -webkit-transform: translateX(-160.27778%);\n    transform: translateX(-160.27778%); } }\n\n\@-webkit-keyframes buffering-reverse {\n  to {\n    -webkit-transform: translateX(0.625rem);\n    transform: translateX(0.625rem); } }\n\n\@keyframes buffering-reverse {\n  to {\n    -webkit-transform: translateX(0.625rem);\n    transform: translateX(0.625rem); } }\n\n.mdc-linear-progress {\n  position: relative;\n  width: 100%;\n  height: 0.25rem;\n  -webkit-transform: translateZ(0);\n  transform: translateZ(0);\n  -webkit-transition: opacity 250ms 0ms cubic-bezier(0.4, 0, 0.6, 1);\n  transition: opacity 250ms 0ms cubic-bezier(0.4, 0, 0.6, 1);\n  overflow: hidden; }\n  .mdc-linear-progress__bar {\n    position: absolute;\n    width: 100%;\n    height: 100%;\n    -webkit-animation: none;\n    animation: none;\n    -webkit-transform-origin: top left;\n    transform-origin: top left;\n    -webkit-transition: -webkit-transform 250ms 0ms cubic-bezier(0.4, 0, 0.6, 1);\n    transition: -webkit-transform 250ms 0ms cubic-bezier(0.4, 0, 0.6, 1);\n    transition: transform 250ms 0ms cubic-bezier(0.4, 0, 0.6, 1);\n    transition: transform 250ms 0ms cubic-bezier(0.4, 0, 0.6, 1), -webkit-transform 250ms 0ms cubic-bezier(0.4, 0, 0.6, 1); }\n  .mdc-linear-progress__bar-inner {\n    display: inline-block;\n    position: absolute;\n    width: 100%;\n    height: 100%;\n    -webkit-animation: none;\n    animation: none; }\n  .mdc-linear-progress__buffering-dots {\n    position: absolute;\n    width: 100%;\n    height: 100%;\n    -webkit-animation: buffering 250ms infinite linear;\n    animation: buffering 250ms infinite linear;\n    background-repeat: repeat-x;\n    background-size: 0.625rem 0.25rem; }\n  .mdc-linear-progress__buffer {\n    position: absolute;\n    width: 100%;\n    height: 100%;\n    -webkit-transform-origin: top left;\n    transform-origin: top left;\n    -webkit-transition: -webkit-transform 250ms 0ms cubic-bezier(0.4, 0, 0.6, 1);\n    transition: -webkit-transform 250ms 0ms cubic-bezier(0.4, 0, 0.6, 1);\n    transition: transform 250ms 0ms cubic-bezier(0.4, 0, 0.6, 1);\n    transition: transform 250ms 0ms cubic-bezier(0.4, 0, 0.6, 1), -webkit-transform 250ms 0ms cubic-bezier(0.4, 0, 0.6, 1); }\n  .mdc-linear-progress__primary-bar {\n    -webkit-transform: scaleX(0);\n    transform: scaleX(0); }\n  .mdc-linear-progress__secondary-bar {\n    visibility: hidden; }\n  .mdc-linear-progress--indeterminate .mdc-linear-progress__bar {\n    -webkit-transition: none;\n    transition: none; }\n  .mdc-linear-progress--indeterminate .mdc-linear-progress__primary-bar {\n    left: -145.166611%;\n    -webkit-animation: primary-indeterminate-translate 2s infinite linear;\n    animation: primary-indeterminate-translate 2s infinite linear; }\n    .mdc-linear-progress--indeterminate .mdc-linear-progress__primary-bar > .mdc-linear-progress__bar-inner {\n      -webkit-animation: primary-indeterminate-scale 2s infinite linear;\n      animation: primary-indeterminate-scale 2s infinite linear; }\n  .mdc-linear-progress--indeterminate .mdc-linear-progress__secondary-bar {\n    left: -54.888891%;\n    -webkit-animation: secondary-indeterminate-translate 2s infinite linear;\n    animation: secondary-indeterminate-translate 2s infinite linear;\n    visibility: visible; }\n    .mdc-linear-progress--indeterminate .mdc-linear-progress__secondary-bar > .mdc-linear-progress__bar-inner {\n      -webkit-animation: secondary-indeterminate-scale 2s infinite linear;\n      animation: secondary-indeterminate-scale 2s infinite linear; }\n  .mdc-linear-progress--reversed .mdc-linear-progress__bar,\n  .mdc-linear-progress--reversed .mdc-linear-progress__buffer {\n    right: 0;\n    -webkit-transform-origin: center right;\n    transform-origin: center right; }\n  .mdc-linear-progress--reversed .mdc-linear-progress__primary-bar {\n    -webkit-animation-name: primary-indeterminate-translate-reverse;\n    animation-name: primary-indeterminate-translate-reverse; }\n  .mdc-linear-progress--reversed .mdc-linear-progress__secondary-bar {\n    -webkit-animation-name: secondary-indeterminate-translate-reverse;\n    animation-name: secondary-indeterminate-translate-reverse; }\n  .mdc-linear-progress--reversed .mdc-linear-progress__buffering-dots {\n    -webkit-animation: buffering-reverse 250ms infinite linear;\n    animation: buffering-reverse 250ms infinite linear; }\n  .mdc-linear-progress--closed {\n    opacity: 0; }\n\n.mdc-linear-progress__bar-inner {\n  background-color: #26a69a;\n  /* \@alternate */\n  background-color: var(--mdc-theme-primary, #26a69a); }\n\n.mdc-linear-progress__buffering-dots {\n  background-image: url(\"data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0rem' y='0rem' enable-background='new 0 0 5 2' xml:space='preserve' viewBox='0 0 5 2' preserveAspectRatio='none slice'%3E%3Ccircle cx='1' cy='1' r='1' fill='%23e6e6e6'/%3E%3C/svg%3E\"); }\n\n.mdc-linear-progress__buffer {\n  background-color: #e6e6e6; }\n\n.mdc-linear-progress--indeterminate.mdc-linear-progress--reversed .mdc-linear-progress__primary-bar {\n  right: -145.166611%;\n  left: auto; }\n\n.mdc-linear-progress--indeterminate.mdc-linear-progress--reversed .mdc-linear-progress__secondary-bar {\n  right: -54.888891%;\n  left: auto; }\n\n/**\n * \@prop --background-color: Color to use for progress-bar track.\n */\n.mdc-linear-progress {\n  text-align: left; }\n\n.mdc-linear-progress__buffer {\n  background-color: var(--background-color, #e6e6e6); }"; }
}

export { LinearProgress as LimelLinearProgress };
