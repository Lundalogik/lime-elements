const h = window.LimeElements.h;

import { a as __extends, b as __assign } from './chunk-2005b219.js';
import { a as MDCFoundation, b as MDCComponent } from './chunk-21be808b.js';
import { b as closest } from './chunk-0566d4fa.js';

const SNACKBAR_TIMEOUT = 5000;
class PickerExample {
    constructor() {
        this.triggerSnackbarWithoutAction = this.triggerSnackbar.bind(this, 'limel-snackbar');
        this.triggerSnackbarWithAction = this.triggerSnackbar.bind(this, 'limel-snackbar:last-child');
    }
    render() {
        return [
            h("limel-button", { primary: true, label: "Show snackbar", onClick: this.triggerSnackbarWithoutAction }),
            h("br", null),
            h("br", null),
            h("limel-button", { primary: true, label: "Show snackbar with action", onClick: this.triggerSnackbarWithAction }),
            h("limel-snackbar", { message: "Please do not leave your luggage unattended! It might be taken away!", multiline: true, timeout: SNACKBAR_TIMEOUT, onHide: this.snackbarWithoutActionOnHide }),
            h("limel-snackbar", { message: "Your luggage has been taken away!", actionText: "Reclaim", onAction: this.snackbarOnAction, onHide: this.snackbarWithActionOnHide }),
        ];
    }
    triggerSnackbar(selector) {
        const snackbar = this.host.shadowRoot.querySelector(selector);
        snackbar.show();
    }
    snackbarWithoutActionOnHide() {
        console.log('It will soon be taken away!');
    }
    snackbarOnAction() {
        console.log('You claimed your luggage!');
    }
    snackbarWithActionOnHide() {
        console.log('You were too late. Your luggage has been destroyed!');
    }
    static get is() { return "limel-example-snackbar"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "host": {
            "elementRef": true
        }
    }; }
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
var cssClasses = {
    CLOSING: 'mdc-snackbar--closing',
    OPEN: 'mdc-snackbar--open',
    OPENING: 'mdc-snackbar--opening',
};
var strings = {
    ACTION_SELECTOR: '.mdc-snackbar__action',
    ARIA_LIVE_LABEL_TEXT_ATTR: 'data-mdc-snackbar-label-text',
    CLOSED_EVENT: 'MDCSnackbar:closed',
    CLOSING_EVENT: 'MDCSnackbar:closing',
    DISMISS_SELECTOR: '.mdc-snackbar__dismiss',
    LABEL_SELECTOR: '.mdc-snackbar__label',
    OPENED_EVENT: 'MDCSnackbar:opened',
    OPENING_EVENT: 'MDCSnackbar:opening',
    REASON_ACTION: 'action',
    REASON_DISMISS: 'dismiss',
    SURFACE_SELECTOR: '.mdc-snackbar__surface',
};
var numbers = {
    DEFAULT_AUTO_DISMISS_TIMEOUT_MS: 5000,
    MAX_AUTO_DISMISS_TIMEOUT_MS: 10000,
    MIN_AUTO_DISMISS_TIMEOUT_MS: 4000,
    // These variables need to be kept in sync with the values in _variables.scss.
    SNACKBAR_ANIMATION_CLOSE_TIME_MS: 75,
    SNACKBAR_ANIMATION_OPEN_TIME_MS: 150,
    /**
     * Number of milliseconds to wait between temporarily clearing the label text
     * in the DOM and subsequently restoring it. This is necessary to force IE 11
     * to pick up the `aria-live` content change and announce it to the user.
     */
    ARIA_LIVE_DELAY_MS: 1000,
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
var ARIA_LIVE_DELAY_MS = numbers.ARIA_LIVE_DELAY_MS;
var ARIA_LIVE_LABEL_TEXT_ATTR = strings.ARIA_LIVE_LABEL_TEXT_ATTR;
function announce(ariaEl, labelEl) {
    if (labelEl === void 0) { labelEl = ariaEl; }
    var priority = ariaEl.getAttribute('aria-live');
    // Trim text to ignore `&nbsp;` (see below).
    // textContent is only null if the node is a document, DOCTYPE, or notation.
    var labelText = labelEl.textContent.trim();
    if (!labelText || !priority) {
        return;
    }
    // Temporarily disable `aria-live` to prevent JAWS+Firefox from announcing the message twice.
    ariaEl.setAttribute('aria-live', 'off');
    // Temporarily clear `textContent` to force a DOM mutation event that will be detected by screen readers.
    // `aria-live` elements are only announced when the element's `textContent` *changes*, so snackbars
    // sent to the browser in the initial HTML response won't be read unless we clear the element's `textContent` first.
    // Similarly, displaying the same snackbar message twice in a row doesn't trigger a DOM mutation event,
    // so screen readers won't announce the second message unless we first clear `textContent`.
    //
    // We have to clear the label text two different ways to make it work in all browsers and screen readers:
    //
    //   1. `textContent = ''` is required for IE11 + JAWS
    //   2. `innerHTML = '&nbsp;'` is required for Chrome + JAWS and NVDA
    //
    // All other browser/screen reader combinations support both methods.
    //
    // The wrapper `<span>` visually hides the space character so that it doesn't cause jank when added/removed.
    // N.B.: Setting `position: absolute`, `opacity: 0`, or `height: 0` prevents Chrome from detecting the DOM change.
    //
    // This technique has been tested in:
    //
    //   * JAWS 2019:
    //       - Chrome 70
    //       - Firefox 60 (ESR)
    //       - IE 11
    //   * NVDA 2018:
    //       - Chrome 70
    //       - Firefox 60 (ESR)
    //       - IE 11
    //   * ChromeVox 53
    labelEl.textContent = '';
    labelEl.innerHTML = '<span style="display: inline-block; width: 0; height: 0.0625rem;">&nbsp;</span>';
    // Prevent visual jank by temporarily displaying the label text in the ::before pseudo-element.
    // CSS generated content is normally announced by screen readers
    // (except in IE 11; see https://tink.uk/accessibility-support-for-css-generated-content/);
    // however, `aria-live` is turned off, so this DOM update will be ignored by screen readers.
    labelEl.setAttribute(ARIA_LIVE_LABEL_TEXT_ATTR, labelText);
    setTimeout(function () {
        // Allow screen readers to announce changes to the DOM again.
        ariaEl.setAttribute('aria-live', priority);
        // Remove the message from the ::before pseudo-element.
        labelEl.removeAttribute(ARIA_LIVE_LABEL_TEXT_ATTR);
        // Restore the original label text, which will be announced by screen readers.
        labelEl.textContent = labelText;
    }, ARIA_LIVE_DELAY_MS);
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
var OPENING = cssClasses.OPENING, OPEN = cssClasses.OPEN, CLOSING = cssClasses.CLOSING;
var REASON_ACTION = strings.REASON_ACTION, REASON_DISMISS = strings.REASON_DISMISS;
var MDCSnackbarFoundation = /** @class */ (function (_super) {
    __extends(MDCSnackbarFoundation, _super);
    function MDCSnackbarFoundation(adapter) {
        var _this = _super.call(this, __assign({}, MDCSnackbarFoundation.defaultAdapter, adapter)) || this;
        _this.isOpen_ = false;
        _this.animationFrame_ = 0;
        _this.animationTimer_ = 0;
        _this.autoDismissTimer_ = 0;
        _this.autoDismissTimeoutMs_ = numbers.DEFAULT_AUTO_DISMISS_TIMEOUT_MS;
        _this.closeOnEscape_ = true;
        return _this;
    }
    Object.defineProperty(MDCSnackbarFoundation, "cssClasses", {
        get: function () {
            return cssClasses;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCSnackbarFoundation, "strings", {
        get: function () {
            return strings;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCSnackbarFoundation, "numbers", {
        get: function () {
            return numbers;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCSnackbarFoundation, "defaultAdapter", {
        get: function () {
            return {
                addClass: function () { return undefined; },
                announce: function () { return undefined; },
                notifyClosed: function () { return undefined; },
                notifyClosing: function () { return undefined; },
                notifyOpened: function () { return undefined; },
                notifyOpening: function () { return undefined; },
                removeClass: function () { return undefined; },
            };
        },
        enumerable: true,
        configurable: true
    });
    MDCSnackbarFoundation.prototype.destroy = function () {
        this.clearAutoDismissTimer_();
        cancelAnimationFrame(this.animationFrame_);
        this.animationFrame_ = 0;
        clearTimeout(this.animationTimer_);
        this.animationTimer_ = 0;
        this.adapter_.removeClass(OPENING);
        this.adapter_.removeClass(OPEN);
        this.adapter_.removeClass(CLOSING);
    };
    MDCSnackbarFoundation.prototype.open = function () {
        var _this = this;
        this.clearAutoDismissTimer_();
        this.isOpen_ = true;
        this.adapter_.notifyOpening();
        this.adapter_.removeClass(CLOSING);
        this.adapter_.addClass(OPENING);
        this.adapter_.announce();
        // Wait a frame once display is no longer "none", to establish basis for animation
        this.runNextAnimationFrame_(function () {
            _this.adapter_.addClass(OPEN);
            _this.animationTimer_ = setTimeout(function () {
                _this.handleAnimationTimerEnd_();
                _this.adapter_.notifyOpened();
                _this.autoDismissTimer_ = setTimeout(function () {
                    _this.close(REASON_DISMISS);
                }, _this.getTimeoutMs());
            }, numbers.SNACKBAR_ANIMATION_OPEN_TIME_MS);
        });
    };
    /**
     * @param reason Why the snackbar was closed. Value will be passed to CLOSING_EVENT and CLOSED_EVENT via the
     *     `event.detail.reason` property. Standard values are REASON_ACTION and REASON_DISMISS, but custom
     *     client-specific values may also be used if desired.
     */
    MDCSnackbarFoundation.prototype.close = function (reason) {
        var _this = this;
        if (reason === void 0) { reason = ''; }
        if (!this.isOpen_) {
            // Avoid redundant close calls (and events), e.g. repeated interactions as the snackbar is animating closed
            return;
        }
        cancelAnimationFrame(this.animationFrame_);
        this.animationFrame_ = 0;
        this.clearAutoDismissTimer_();
        this.isOpen_ = false;
        this.adapter_.notifyClosing(reason);
        this.adapter_.addClass(cssClasses.CLOSING);
        this.adapter_.removeClass(cssClasses.OPEN);
        this.adapter_.removeClass(cssClasses.OPENING);
        clearTimeout(this.animationTimer_);
        this.animationTimer_ = setTimeout(function () {
            _this.handleAnimationTimerEnd_();
            _this.adapter_.notifyClosed(reason);
        }, numbers.SNACKBAR_ANIMATION_CLOSE_TIME_MS);
    };
    MDCSnackbarFoundation.prototype.isOpen = function () {
        return this.isOpen_;
    };
    MDCSnackbarFoundation.prototype.getTimeoutMs = function () {
        return this.autoDismissTimeoutMs_;
    };
    MDCSnackbarFoundation.prototype.setTimeoutMs = function (timeoutMs) {
        // Use shorter variable names to make the code more readable
        var minValue = numbers.MIN_AUTO_DISMISS_TIMEOUT_MS;
        var maxValue = numbers.MAX_AUTO_DISMISS_TIMEOUT_MS;
        if (timeoutMs <= maxValue && timeoutMs >= minValue) {
            this.autoDismissTimeoutMs_ = timeoutMs;
        }
        else {
            throw new Error("timeoutMs must be an integer in the range " + minValue + "\u2013" + maxValue + ", but got '" + timeoutMs + "'");
        }
    };
    MDCSnackbarFoundation.prototype.getCloseOnEscape = function () {
        return this.closeOnEscape_;
    };
    MDCSnackbarFoundation.prototype.setCloseOnEscape = function (closeOnEscape) {
        this.closeOnEscape_ = closeOnEscape;
    };
    MDCSnackbarFoundation.prototype.handleKeyDown = function (evt) {
        var isEscapeKey = evt.key === 'Escape' || evt.keyCode === 27;
        if (isEscapeKey && this.getCloseOnEscape()) {
            this.close(REASON_DISMISS);
        }
    };
    MDCSnackbarFoundation.prototype.handleActionButtonClick = function (_evt) {
        this.close(REASON_ACTION);
    };
    MDCSnackbarFoundation.prototype.handleActionIconClick = function (_evt) {
        this.close(REASON_DISMISS);
    };
    MDCSnackbarFoundation.prototype.clearAutoDismissTimer_ = function () {
        clearTimeout(this.autoDismissTimer_);
        this.autoDismissTimer_ = 0;
    };
    MDCSnackbarFoundation.prototype.handleAnimationTimerEnd_ = function () {
        this.animationTimer_ = 0;
        this.adapter_.removeClass(cssClasses.OPENING);
        this.adapter_.removeClass(cssClasses.CLOSING);
    };
    /**
     * Runs the given logic on the next animation frame, using setTimeout to factor in Firefox reflow behavior.
     */
    MDCSnackbarFoundation.prototype.runNextAnimationFrame_ = function (callback) {
        var _this = this;
        cancelAnimationFrame(this.animationFrame_);
        this.animationFrame_ = requestAnimationFrame(function () {
            _this.animationFrame_ = 0;
            clearTimeout(_this.animationTimer_);
            _this.animationTimer_ = setTimeout(callback, 0);
        });
    };
    return MDCSnackbarFoundation;
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
var SURFACE_SELECTOR = strings.SURFACE_SELECTOR, LABEL_SELECTOR = strings.LABEL_SELECTOR, ACTION_SELECTOR = strings.ACTION_SELECTOR, DISMISS_SELECTOR = strings.DISMISS_SELECTOR, OPENING_EVENT = strings.OPENING_EVENT, OPENED_EVENT = strings.OPENED_EVENT, CLOSING_EVENT = strings.CLOSING_EVENT, CLOSED_EVENT = strings.CLOSED_EVENT;
var MDCSnackbar = /** @class */ (function (_super) {
    __extends(MDCSnackbar, _super);
    function MDCSnackbar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MDCSnackbar.attachTo = function (root) {
        return new MDCSnackbar(root);
    };
    MDCSnackbar.prototype.initialize = function (announcerFactory) {
        if (announcerFactory === void 0) { announcerFactory = function () { return announce; }; }
        this.announce_ = announcerFactory();
    };
    MDCSnackbar.prototype.initialSyncWithDOM = function () {
        var _this = this;
        this.surfaceEl_ = this.root_.querySelector(SURFACE_SELECTOR);
        this.labelEl_ = this.root_.querySelector(LABEL_SELECTOR);
        this.actionEl_ = this.root_.querySelector(ACTION_SELECTOR);
        this.handleKeyDown_ = function (evt) { return _this.foundation_.handleKeyDown(evt); };
        this.handleSurfaceClick_ = function (evt) {
            var target = evt.target;
            if (_this.isActionButton_(target)) {
                _this.foundation_.handleActionButtonClick(evt);
            }
            else if (_this.isActionIcon_(target)) {
                _this.foundation_.handleActionIconClick(evt);
            }
        };
        this.registerKeyDownHandler_(this.handleKeyDown_);
        this.registerSurfaceClickHandler_(this.handleSurfaceClick_);
    };
    MDCSnackbar.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        this.deregisterKeyDownHandler_(this.handleKeyDown_);
        this.deregisterSurfaceClickHandler_(this.handleSurfaceClick_);
    };
    MDCSnackbar.prototype.open = function () {
        this.foundation_.open();
    };
    /**
     * @param reason Why the snackbar was closed. Value will be passed to CLOSING_EVENT and CLOSED_EVENT via the
     *     `event.detail.reason` property. Standard values are REASON_ACTION and REASON_DISMISS, but custom
     *     client-specific values may also be used if desired.
     */
    MDCSnackbar.prototype.close = function (reason) {
        if (reason === void 0) { reason = ''; }
        this.foundation_.close(reason);
    };
    MDCSnackbar.prototype.getDefaultFoundation = function () {
        var _this = this;
        // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
        // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
        var adapter = {
            addClass: function (className) { return _this.root_.classList.add(className); },
            announce: function () { return _this.announce_(_this.labelEl_); },
            notifyClosed: function (reason) { return _this.emit(CLOSED_EVENT, reason ? { reason: reason } : {}); },
            notifyClosing: function (reason) { return _this.emit(CLOSING_EVENT, reason ? { reason: reason } : {}); },
            notifyOpened: function () { return _this.emit(OPENED_EVENT, {}); },
            notifyOpening: function () { return _this.emit(OPENING_EVENT, {}); },
            removeClass: function (className) { return _this.root_.classList.remove(className); },
        };
        return new MDCSnackbarFoundation(adapter);
    };
    Object.defineProperty(MDCSnackbar.prototype, "timeoutMs", {
        get: function () {
            return this.foundation_.getTimeoutMs();
        },
        set: function (timeoutMs) {
            this.foundation_.setTimeoutMs(timeoutMs);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCSnackbar.prototype, "closeOnEscape", {
        get: function () {
            return this.foundation_.getCloseOnEscape();
        },
        set: function (closeOnEscape) {
            this.foundation_.setCloseOnEscape(closeOnEscape);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCSnackbar.prototype, "isOpen", {
        get: function () {
            return this.foundation_.isOpen();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCSnackbar.prototype, "labelText", {
        get: function () {
            // This property only returns null if the node is a document, DOCTYPE, or notation.
            // On Element nodes, it always returns a string.
            return this.labelEl_.textContent;
        },
        set: function (labelText) {
            this.labelEl_.textContent = labelText;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCSnackbar.prototype, "actionButtonText", {
        get: function () {
            return this.actionEl_.textContent;
        },
        set: function (actionButtonText) {
            this.actionEl_.textContent = actionButtonText;
        },
        enumerable: true,
        configurable: true
    });
    MDCSnackbar.prototype.registerKeyDownHandler_ = function (handler) {
        this.listen('keydown', handler);
    };
    MDCSnackbar.prototype.deregisterKeyDownHandler_ = function (handler) {
        this.unlisten('keydown', handler);
    };
    MDCSnackbar.prototype.registerSurfaceClickHandler_ = function (handler) {
        this.surfaceEl_.addEventListener('click', handler);
    };
    MDCSnackbar.prototype.deregisterSurfaceClickHandler_ = function (handler) {
        this.surfaceEl_.removeEventListener('click', handler);
    };
    MDCSnackbar.prototype.isActionButton_ = function (target) {
        return Boolean(closest(target, ACTION_SELECTOR));
    };
    MDCSnackbar.prototype.isActionIcon_ = function (target) {
        return Boolean(closest(target, DISMISS_SELECTOR));
    };
    return MDCSnackbar;
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

class Snackbar {
    constructor() {
        this.handleMdcClosing = this.handleMdcClosing.bind(this);
    }
    componentDidLoad() {
        this.mdcSnackbar = new MDCSnackbar(this.host.shadowRoot.querySelector('.mdc-snackbar'));
        this.mdcSnackbar.listen('MDCSnackbar:closing', this.handleMdcClosing);
    }
    componentDidUnload() {
        this.mdcSnackbar.unlisten('MDCSnackbar:closing', this.handleMdcClosing);
        this.mdcSnackbar.destroy();
    }
    /**
     * Show the snackbar
     *
     * @returns {void}
     */
    show() {
        if (this.timeout) {
            this.mdcSnackbar.timeoutMs = this.timeout;
        }
        this.mdcSnackbar.open();
    }
    render() {
        return (h("div", { class: `
                    mdc-snackbar
                    ${this.multiline ? 'mdc-snackbar--stacked' : ''}
                ` },
            h("div", { class: "mdc-snackbar__surface" },
                h("div", { class: "mdc-snackbar__label", role: "status", "aria-live": "polite" }, this.message),
                this.renderAction(this.actionText))));
    }
    handleMdcClosing(event) {
        if (event.detail.reason === 'action') {
            this.action.emit();
        }
        else {
            this.hide.emit();
        }
    }
    renderAction(actionText) {
        if (actionText) {
            return (h("div", { class: "mdc-snackbar__actions" },
                h("button", { type: "button", class: "mdc-button mdc-snackbar__action" },
                    h("span", { class: "mdc-button__label" }, actionText))));
        }
    }
    static get is() { return "limel-snackbar"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "actionText": {
            "type": String,
            "attr": "action-text"
        },
        "host": {
            "elementRef": true
        },
        "message": {
            "type": String,
            "attr": "message"
        },
        "multiline": {
            "type": Boolean,
            "attr": "multiline"
        },
        "show": {
            "method": true
        },
        "timeout": {
            "type": Number,
            "attr": "timeout"
        }
    }; }
    static get events() { return [{
            "name": "action",
            "method": "action",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "hide",
            "method": "hide",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get style() { return ":host {\n  --mdc-theme-primary: var(--lime-primary-color, #26a69a);\n  --mdc-theme-secondary: var(--lime-secondary-color, #575756);\n  --mdc-theme-on-primary: var(--lime-on-primary-color, #fff);\n  --mdc-theme-on-secondary: var(--lime-on-secondary-color, #fff);\n}\n\n:root {\n  --mdc-theme-primary: #26a69a;\n  --mdc-theme-secondary: #575756;\n  --mdc-theme-background: #fff;\n  --mdc-theme-surface: #fff;\n  --mdc-theme-error: #b00020;\n  --mdc-theme-on-primary: #fff;\n  --mdc-theme-on-secondary: #fff;\n  --mdc-theme-on-surface: #000;\n  --mdc-theme-on-error: #fff;\n  --mdc-theme-text-primary-on-background: rgba(0, 0, 0, 0.87);\n  --mdc-theme-text-secondary-on-background: rgba(0, 0, 0, 0.54);\n  --mdc-theme-text-hint-on-background: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-disabled-on-background: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-icon-on-background: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-primary-on-light: rgba(0, 0, 0, 0.87);\n  --mdc-theme-text-secondary-on-light: rgba(0, 0, 0, 0.54);\n  --mdc-theme-text-hint-on-light: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-disabled-on-light: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-icon-on-light: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-primary-on-dark: white;\n  --mdc-theme-text-secondary-on-dark: rgba(255, 255, 255, 0.7);\n  --mdc-theme-text-hint-on-dark: rgba(255, 255, 255, 0.5);\n  --mdc-theme-text-disabled-on-dark: rgba(255, 255, 255, 0.5);\n  --mdc-theme-text-icon-on-dark: rgba(255, 255, 255, 0.5);\n}\n\n.mdc-theme--primary {\n  color: #26a69a !important;\n  /* \@alternate */\n  color: var(--mdc-theme-primary, #26a69a) !important;\n}\n\n.mdc-theme--secondary {\n  color: #575756 !important;\n  /* \@alternate */\n  color: var(--mdc-theme-secondary, #575756) !important;\n}\n\n.mdc-theme--background {\n  background-color: #fff;\n  /* \@alternate */\n  background-color: var(--mdc-theme-background, #fff);\n}\n\n.mdc-theme--surface {\n  background-color: #fff;\n  /* \@alternate */\n  background-color: var(--mdc-theme-surface, #fff);\n}\n\n.mdc-theme--error {\n  color: #b00020 !important;\n  /* \@alternate */\n  color: var(--mdc-theme-error, #b00020) !important;\n}\n\n.mdc-theme--on-primary {\n  color: #fff !important;\n  /* \@alternate */\n  color: var(--mdc-theme-on-primary, #fff) !important;\n}\n\n.mdc-theme--on-secondary {\n  color: #fff !important;\n  /* \@alternate */\n  color: var(--mdc-theme-on-secondary, #fff) !important;\n}\n\n.mdc-theme--on-surface {\n  color: #000 !important;\n  /* \@alternate */\n  color: var(--mdc-theme-on-surface, #000) !important;\n}\n\n.mdc-theme--on-error {\n  color: #fff !important;\n  /* \@alternate */\n  color: var(--mdc-theme-on-error, #fff) !important;\n}\n\n.mdc-theme--text-primary-on-background {\n  color: rgba(0, 0, 0, 0.87) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-primary-on-background, rgba(0, 0, 0, 0.87)) !important;\n}\n\n.mdc-theme--text-secondary-on-background {\n  color: rgba(0, 0, 0, 0.54) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-secondary-on-background, rgba(0, 0, 0, 0.54)) !important;\n}\n\n.mdc-theme--text-hint-on-background {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.38)) !important;\n}\n\n.mdc-theme--text-disabled-on-background {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-disabled-on-background, rgba(0, 0, 0, 0.38)) !important;\n}\n\n.mdc-theme--text-icon-on-background {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-icon-on-background, rgba(0, 0, 0, 0.38)) !important;\n}\n\n.mdc-theme--text-primary-on-light {\n  color: rgba(0, 0, 0, 0.87) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-primary-on-light, rgba(0, 0, 0, 0.87)) !important;\n}\n\n.mdc-theme--text-secondary-on-light {\n  color: rgba(0, 0, 0, 0.54) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-secondary-on-light, rgba(0, 0, 0, 0.54)) !important;\n}\n\n.mdc-theme--text-hint-on-light {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-hint-on-light, rgba(0, 0, 0, 0.38)) !important;\n}\n\n.mdc-theme--text-disabled-on-light {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-disabled-on-light, rgba(0, 0, 0, 0.38)) !important;\n}\n\n.mdc-theme--text-icon-on-light {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-icon-on-light, rgba(0, 0, 0, 0.38)) !important;\n}\n\n.mdc-theme--text-primary-on-dark {\n  color: white !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-primary-on-dark, white) !important;\n}\n\n.mdc-theme--text-secondary-on-dark {\n  color: rgba(255, 255, 255, 0.7) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-secondary-on-dark, rgba(255, 255, 255, 0.7)) !important;\n}\n\n.mdc-theme--text-hint-on-dark {\n  color: rgba(255, 255, 255, 0.5) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-hint-on-dark, rgba(255, 255, 255, 0.5)) !important;\n}\n\n.mdc-theme--text-disabled-on-dark {\n  color: rgba(255, 255, 255, 0.5) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-disabled-on-dark, rgba(255, 255, 255, 0.5)) !important;\n}\n\n.mdc-theme--text-icon-on-dark {\n  color: rgba(255, 255, 255, 0.5) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-icon-on-dark, rgba(255, 255, 255, 0.5)) !important;\n}\n\n.mdc-theme--primary-bg {\n  background-color: #26a69a !important;\n  /* \@alternate */\n  background-color: var(--mdc-theme-primary, #26a69a) !important;\n}\n\n.mdc-theme--secondary-bg {\n  background-color: #575756 !important;\n  /* \@alternate */\n  background-color: var(--mdc-theme-secondary, #575756) !important;\n}\n\n.mdc-typography {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n}\n\n.mdc-typography--headline1 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1rem;\n  line-height: 0.875rem;\n  font-weight: 300;\n  letter-spacing: -0.015625em;\n  text-decoration: inherit;\n  text-transform: inherit;\n}\n\n.mdc-typography--headline2 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1rem;\n  line-height: 0.875rem;\n  font-weight: 300;\n  letter-spacing: -0.0083333333em;\n  text-decoration: inherit;\n  text-transform: inherit;\n}\n\n.mdc-typography--headline3 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1rem;\n  line-height: 0.875rem;\n  font-weight: 400;\n  letter-spacing: normal;\n  text-decoration: inherit;\n  text-transform: inherit;\n}\n\n.mdc-typography--headline4 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1rem;\n  line-height: 0.875rem;\n  font-weight: 400;\n  letter-spacing: 0.0073529412em;\n  text-decoration: inherit;\n  text-transform: inherit;\n}\n\n.mdc-typography--headline5 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.875rem;\n  line-height: 0.875rem;\n  font-weight: 400;\n  letter-spacing: normal;\n  text-decoration: inherit;\n  text-transform: inherit;\n}\n\n.mdc-typography--headline6 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.875rem;\n  line-height: 0.875rem;\n  font-weight: 500;\n  letter-spacing: 0.0125em;\n  text-decoration: inherit;\n  text-transform: inherit;\n}\n\n.mdc-typography--subtitle1 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.875rem;\n  line-height: 1.125rem;\n  font-weight: 400;\n  letter-spacing: 0.009375em;\n  text-decoration: inherit;\n  text-transform: inherit;\n}\n\n.mdc-typography--subtitle2 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.8125rem;\n  line-height: 1.125rem;\n  font-weight: 500;\n  letter-spacing: 0.0071428571em;\n  text-decoration: inherit;\n  text-transform: inherit;\n}\n\n.mdc-typography--body1 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.8125rem;\n  line-height: 1.5rem;\n  font-weight: 400;\n  letter-spacing: 0.03125em;\n  text-decoration: inherit;\n  text-transform: inherit;\n}\n\n.mdc-typography--body2 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.8125rem;\n  line-height: 1.625rem;\n  font-weight: 400;\n  letter-spacing: 0.0178571429em;\n  text-decoration: inherit;\n  text-transform: inherit;\n}\n\n.mdc-typography--caption {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.6875rem;\n  line-height: 0.875rem;\n  font-weight: 400;\n  letter-spacing: 0.0333333333em;\n  text-decoration: inherit;\n  text-transform: inherit;\n}\n\n.mdc-typography--button {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.875rem;\n  line-height: 2.25rem;\n  font-weight: 500;\n  letter-spacing: 0.0892857143em;\n  text-decoration: none;\n  text-transform: none;\n}\n\n.mdc-typography--overline {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.6875rem;\n  line-height: 0.875rem;\n  font-weight: 500;\n  letter-spacing: 0.1666666667em;\n  text-decoration: none;\n  text-transform: uppercase;\n}\n\n.mdc-button {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.875rem;\n  line-height: 2.25rem;\n  font-weight: 500;\n  letter-spacing: 0.0892857143em;\n  text-decoration: none;\n  text-transform: none;\n  padding: 0 0.5rem 0 0.5rem;\n  display: -ms-inline-flexbox;\n  display: inline-flex;\n  position: relative;\n  -ms-flex-align: center;\n  align-items: center;\n  -ms-flex-pack: center;\n  justify-content: center;\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box;\n  min-width: 4rem;\n  height: 2.25rem;\n  border: none;\n  outline: none;\n  /* \@alternate */\n  line-height: inherit;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  -webkit-appearance: none;\n  overflow: hidden;\n  vertical-align: middle;\n  border-radius: 0.25rem;\n}\n.mdc-button::-moz-focus-inner {\n  padding: 0;\n  border: 0;\n}\n.mdc-button:active {\n  outline: none;\n}\n.mdc-button:hover {\n  cursor: pointer;\n}\n.mdc-button:disabled {\n  background-color: transparent;\n  color: rgba(0, 0, 0, 0.37);\n  cursor: default;\n  pointer-events: none;\n}\n.mdc-button.mdc-button--dense {\n  border-radius: 0.25rem;\n}\n.mdc-button:not(:disabled) {\n  background-color: transparent;\n}\n.mdc-button .mdc-button__icon {\n  /* \@noflip */\n  margin-left: 0;\n  /* \@noflip */\n  margin-right: 0.5rem;\n  display: inline-block;\n  width: 1.125rem;\n  height: 1.125rem;\n  font-size: 1.125rem;\n  vertical-align: top;\n}\n[dir=rtl] .mdc-button .mdc-button__icon, .mdc-button .mdc-button__icon[dir=rtl] {\n  /* \@noflip */\n  margin-left: 0.5rem;\n  /* \@noflip */\n  margin-right: 0;\n}\n.mdc-button:not(:disabled) {\n  color: #26a69a;\n  /* \@alternate */\n  color: var(--mdc-theme-primary, #26a69a);\n}\n\n.mdc-button__label + .mdc-button__icon {\n  /* \@noflip */\n  margin-left: 0.5rem;\n  /* \@noflip */\n  margin-right: 0;\n}\n[dir=rtl] .mdc-button__label + .mdc-button__icon, .mdc-button__label + .mdc-button__icon[dir=rtl] {\n  /* \@noflip */\n  margin-left: 0;\n  /* \@noflip */\n  margin-right: 0.5rem;\n}\n\nsvg.mdc-button__icon {\n  fill: currentColor;\n}\n\n.mdc-button--raised .mdc-button__icon,\n.mdc-button--unelevated .mdc-button__icon,\n.mdc-button--outlined .mdc-button__icon {\n  /* \@noflip */\n  margin-left: -0.25rem;\n  /* \@noflip */\n  margin-right: 0.5rem;\n}\n[dir=rtl] .mdc-button--raised .mdc-button__icon, .mdc-button--raised .mdc-button__icon[dir=rtl],\n[dir=rtl] .mdc-button--unelevated .mdc-button__icon,\n.mdc-button--unelevated .mdc-button__icon[dir=rtl],\n[dir=rtl] .mdc-button--outlined .mdc-button__icon,\n.mdc-button--outlined .mdc-button__icon[dir=rtl] {\n  /* \@noflip */\n  margin-left: 0.5rem;\n  /* \@noflip */\n  margin-right: -0.25rem;\n}\n.mdc-button--raised .mdc-button__label + .mdc-button__icon,\n.mdc-button--unelevated .mdc-button__label + .mdc-button__icon,\n.mdc-button--outlined .mdc-button__label + .mdc-button__icon {\n  /* \@noflip */\n  margin-left: 0.5rem;\n  /* \@noflip */\n  margin-right: -0.25rem;\n}\n[dir=rtl] .mdc-button--raised .mdc-button__label + .mdc-button__icon, .mdc-button--raised .mdc-button__label + .mdc-button__icon[dir=rtl],\n[dir=rtl] .mdc-button--unelevated .mdc-button__label + .mdc-button__icon,\n.mdc-button--unelevated .mdc-button__label + .mdc-button__icon[dir=rtl],\n[dir=rtl] .mdc-button--outlined .mdc-button__label + .mdc-button__icon,\n.mdc-button--outlined .mdc-button__label + .mdc-button__icon[dir=rtl] {\n  /* \@noflip */\n  margin-left: -0.25rem;\n  /* \@noflip */\n  margin-right: 0.5rem;\n}\n\n.mdc-button--raised,\n.mdc-button--unelevated {\n  padding: 0 1rem 0 1rem;\n}\n.mdc-button--raised:disabled,\n.mdc-button--unelevated:disabled {\n  background-color: rgba(0, 0, 0, 0.12);\n  color: rgba(0, 0, 0, 0.37);\n}\n.mdc-button--raised:not(:disabled),\n.mdc-button--unelevated:not(:disabled) {\n  background-color: #26a69a;\n}\n\@supports not (-ms-ime-align: auto) {\n  .mdc-button--raised:not(:disabled),\n.mdc-button--unelevated:not(:disabled) {\n    /* \@alternate */\n    background-color: var(--mdc-theme-primary, #26a69a);\n  }\n}\n.mdc-button--raised:not(:disabled),\n.mdc-button--unelevated:not(:disabled) {\n  color: #fff;\n  /* \@alternate */\n  color: var(--mdc-theme-on-primary, #fff);\n}\n\n.mdc-button--raised {\n  -webkit-box-shadow: 0rem 0.1875rem 0.0625rem -0.125rem rgba(0, 0, 0, 0.2), 0rem 0.125rem 0.125rem 0rem rgba(0, 0, 0, 0.14), 0rem 0.0625rem 0.3125rem 0rem rgba(0, 0, 0, 0.12);\n  box-shadow: 0rem 0.1875rem 0.0625rem -0.125rem rgba(0, 0, 0, 0.2), 0rem 0.125rem 0.125rem 0rem rgba(0, 0, 0, 0.14), 0rem 0.0625rem 0.3125rem 0rem rgba(0, 0, 0, 0.12);\n  -webkit-transition: -webkit-box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: -webkit-box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1), -webkit-box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);\n}\n.mdc-button--raised:hover, .mdc-button--raised:focus {\n  -webkit-box-shadow: 0rem 0.125rem 0.25rem -0.0625rem rgba(0, 0, 0, 0.2), 0rem 0.25rem 0.3125rem 0rem rgba(0, 0, 0, 0.14), 0rem 0.0625rem 0.625rem 0rem rgba(0, 0, 0, 0.12);\n  box-shadow: 0rem 0.125rem 0.25rem -0.0625rem rgba(0, 0, 0, 0.2), 0rem 0.25rem 0.3125rem 0rem rgba(0, 0, 0, 0.14), 0rem 0.0625rem 0.625rem 0rem rgba(0, 0, 0, 0.12);\n}\n.mdc-button--raised:active {\n  -webkit-box-shadow: 0rem 0.3125rem 0.3125rem -0.1875rem rgba(0, 0, 0, 0.2), 0rem 0.5rem 0.625rem 0.0625rem rgba(0, 0, 0, 0.14), 0rem 0.1875rem 0.875rem 0.125rem rgba(0, 0, 0, 0.12);\n  box-shadow: 0rem 0.3125rem 0.3125rem -0.1875rem rgba(0, 0, 0, 0.2), 0rem 0.5rem 0.625rem 0.0625rem rgba(0, 0, 0, 0.14), 0rem 0.1875rem 0.875rem 0.125rem rgba(0, 0, 0, 0.12);\n}\n.mdc-button--raised:disabled {\n  -webkit-box-shadow: 0rem 0rem 0rem 0rem rgba(0, 0, 0, 0.2), 0rem 0rem 0rem 0rem rgba(0, 0, 0, 0.14), 0rem 0rem 0rem 0rem rgba(0, 0, 0, 0.12);\n  box-shadow: 0rem 0rem 0rem 0rem rgba(0, 0, 0, 0.2), 0rem 0rem 0rem 0rem rgba(0, 0, 0, 0.14), 0rem 0rem 0rem 0rem rgba(0, 0, 0, 0.12);\n}\n\n.mdc-button--outlined {\n  border-style: solid;\n  padding: 0 0.875rem 0 0.875rem;\n  border-width: 0.125rem;\n}\n.mdc-button--outlined:disabled {\n  border-color: rgba(0, 0, 0, 0.37);\n}\n.mdc-button--outlined:not(:disabled) {\n  border-color: #26a69a;\n  /* \@alternate */\n  border-color: var(--mdc-theme-primary, #26a69a);\n}\n\n.mdc-button--dense {\n  height: 2rem;\n  font-size: 0.8125rem;\n}\n\n\@-webkit-keyframes mdc-ripple-fg-radius-in {\n  from {\n    -webkit-animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n    -webkit-transform: translate(var(--mdc-ripple-fg-translate-start, 0)) scale(1);\n    transform: translate(var(--mdc-ripple-fg-translate-start, 0)) scale(1);\n  }\n  to {\n    -webkit-transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1));\n    transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1));\n  }\n}\n\n\@keyframes mdc-ripple-fg-radius-in {\n  from {\n    -webkit-animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n    -webkit-transform: translate(var(--mdc-ripple-fg-translate-start, 0)) scale(1);\n    transform: translate(var(--mdc-ripple-fg-translate-start, 0)) scale(1);\n  }\n  to {\n    -webkit-transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1));\n    transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1));\n  }\n}\n\@-webkit-keyframes mdc-ripple-fg-opacity-in {\n  from {\n    -webkit-animation-timing-function: linear;\n    animation-timing-function: linear;\n    opacity: 0;\n  }\n  to {\n    opacity: var(--mdc-ripple-fg-opacity, 0);\n  }\n}\n\@keyframes mdc-ripple-fg-opacity-in {\n  from {\n    -webkit-animation-timing-function: linear;\n    animation-timing-function: linear;\n    opacity: 0;\n  }\n  to {\n    opacity: var(--mdc-ripple-fg-opacity, 0);\n  }\n}\n\@-webkit-keyframes mdc-ripple-fg-opacity-out {\n  from {\n    -webkit-animation-timing-function: linear;\n    animation-timing-function: linear;\n    opacity: var(--mdc-ripple-fg-opacity, 0);\n  }\n  to {\n    opacity: 0;\n  }\n}\n\@keyframes mdc-ripple-fg-opacity-out {\n  from {\n    -webkit-animation-timing-function: linear;\n    animation-timing-function: linear;\n    opacity: var(--mdc-ripple-fg-opacity, 0);\n  }\n  to {\n    opacity: 0;\n  }\n}\n.mdc-ripple-surface--test-edge-var-bug {\n  --mdc-ripple-surface-test-edge-var: 0.0625rem solid #000;\n  visibility: hidden;\n}\n.mdc-ripple-surface--test-edge-var-bug::before {\n  border: var(--mdc-ripple-surface-test-edge-var);\n}\n\n.mdc-button {\n  --mdc-ripple-fg-size: 0;\n  --mdc-ripple-left: 0;\n  --mdc-ripple-top: 0;\n  --mdc-ripple-fg-scale: 1;\n  --mdc-ripple-fg-translate-end: 0;\n  --mdc-ripple-fg-translate-start: 0;\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n}\n.mdc-button::before, .mdc-button::after {\n  position: absolute;\n  border-radius: 50%;\n  opacity: 0;\n  pointer-events: none;\n  content: \"\";\n}\n.mdc-button::before {\n  -webkit-transition: opacity 15ms linear, background-color 15ms linear;\n  transition: opacity 15ms linear, background-color 15ms linear;\n  z-index: 1;\n}\n.mdc-button.mdc-ripple-upgraded::before {\n  -webkit-transform: scale(var(--mdc-ripple-fg-scale, 1));\n  transform: scale(var(--mdc-ripple-fg-scale, 1));\n}\n.mdc-button.mdc-ripple-upgraded::after {\n  top: 0;\n  /* \@noflip */\n  left: 0;\n  -webkit-transform: scale(0);\n  transform: scale(0);\n  -webkit-transform-origin: center center;\n  transform-origin: center center;\n}\n.mdc-button.mdc-ripple-upgraded--unbounded::after {\n  top: var(--mdc-ripple-top, 0);\n  /* \@noflip */\n  left: var(--mdc-ripple-left, 0);\n}\n.mdc-button.mdc-ripple-upgraded--foreground-activation::after {\n  -webkit-animation: mdc-ripple-fg-radius-in 225ms forwards, mdc-ripple-fg-opacity-in 75ms forwards;\n  animation: mdc-ripple-fg-radius-in 225ms forwards, mdc-ripple-fg-opacity-in 75ms forwards;\n}\n.mdc-button.mdc-ripple-upgraded--foreground-deactivation::after {\n  -webkit-animation: mdc-ripple-fg-opacity-out 150ms;\n  animation: mdc-ripple-fg-opacity-out 150ms;\n  -webkit-transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1));\n  transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1));\n}\n.mdc-button::before, .mdc-button::after {\n  top: calc(50% - 100%);\n  /* \@noflip */\n  left: calc(50% - 100%);\n  width: 200%;\n  height: 200%;\n}\n.mdc-button.mdc-ripple-upgraded::after {\n  width: var(--mdc-ripple-fg-size, 100%);\n  height: var(--mdc-ripple-fg-size, 100%);\n}\n.mdc-button::before, .mdc-button::after {\n  background-color: #26a69a;\n}\n\@supports not (-ms-ime-align: auto) {\n  .mdc-button::before, .mdc-button::after {\n    /* \@alternate */\n    background-color: var(--mdc-theme-primary, #26a69a);\n  }\n}\n.mdc-button:hover::before {\n  opacity: 0.08;\n}\n.mdc-button:not(.mdc-ripple-upgraded):focus::before, .mdc-button.mdc-ripple-upgraded--background-focused::before {\n  -webkit-transition-duration: 75ms;\n  transition-duration: 75ms;\n  opacity: 0.24;\n}\n.mdc-button:not(.mdc-ripple-upgraded)::after {\n  -webkit-transition: opacity 150ms linear;\n  transition: opacity 150ms linear;\n}\n.mdc-button:not(.mdc-ripple-upgraded):active::after {\n  -webkit-transition-duration: 75ms;\n  transition-duration: 75ms;\n  opacity: 0.24;\n}\n.mdc-button.mdc-ripple-upgraded {\n  --mdc-ripple-fg-opacity: 0.24;\n}\n\n.mdc-button--raised::before, .mdc-button--raised::after,\n.mdc-button--unelevated::before,\n.mdc-button--unelevated::after {\n  background-color: #fff;\n}\n\@supports not (-ms-ime-align: auto) {\n  .mdc-button--raised::before, .mdc-button--raised::after,\n.mdc-button--unelevated::before,\n.mdc-button--unelevated::after {\n    /* \@alternate */\n    background-color: var(--mdc-theme-on-primary, #fff);\n  }\n}\n.mdc-button--raised:hover::before,\n.mdc-button--unelevated:hover::before {\n  opacity: 0.08;\n}\n.mdc-button--raised:not(.mdc-ripple-upgraded):focus::before, .mdc-button--raised.mdc-ripple-upgraded--background-focused::before,\n.mdc-button--unelevated:not(.mdc-ripple-upgraded):focus::before,\n.mdc-button--unelevated.mdc-ripple-upgraded--background-focused::before {\n  -webkit-transition-duration: 75ms;\n  transition-duration: 75ms;\n  opacity: 0.24;\n}\n.mdc-button--raised:not(.mdc-ripple-upgraded)::after,\n.mdc-button--unelevated:not(.mdc-ripple-upgraded)::after {\n  -webkit-transition: opacity 150ms linear;\n  transition: opacity 150ms linear;\n}\n.mdc-button--raised:not(.mdc-ripple-upgraded):active::after,\n.mdc-button--unelevated:not(.mdc-ripple-upgraded):active::after {\n  -webkit-transition-duration: 75ms;\n  transition-duration: 75ms;\n  opacity: 0.24;\n}\n.mdc-button--raised.mdc-ripple-upgraded,\n.mdc-button--unelevated.mdc-ripple-upgraded {\n  --mdc-ripple-fg-opacity: 0.24;\n}\n\n.mdc-snackbar {\n  z-index: 8;\n  margin: 0.5rem;\n  display: none;\n  position: fixed;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  -ms-flex-align: center;\n  align-items: center;\n  -ms-flex-pack: center;\n  justify-content: center;\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box;\n  pointer-events: none;\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n}\n\n.mdc-snackbar__surface {\n  background-color: #333333;\n}\n\n.mdc-snackbar__label {\n  color: rgba(255, 255, 255, 0.87);\n}\n\n.mdc-snackbar__surface {\n  min-width: 21.5rem;\n}\n\@media (max-width: 30rem), (max-width: 21.5rem) {\n  .mdc-snackbar__surface {\n    min-width: 100%;\n  }\n}\n\n.mdc-snackbar__surface {\n  max-width: 42rem;\n}\n\n.mdc-snackbar__surface {\n  -webkit-box-shadow: 0rem 0.1875rem 0.3125rem -0.0625rem rgba(0, 0, 0, 0.2), 0rem 0.375rem 0.625rem 0rem rgba(0, 0, 0, 0.14), 0rem 0.0625rem 1.125rem 0rem rgba(0, 0, 0, 0.12);\n  box-shadow: 0rem 0.1875rem 0.3125rem -0.0625rem rgba(0, 0, 0, 0.2), 0rem 0.375rem 0.625rem 0rem rgba(0, 0, 0, 0.14), 0rem 0.0625rem 1.125rem 0rem rgba(0, 0, 0, 0.12);\n}\n\n.mdc-snackbar__surface {\n  border-radius: 0.25rem;\n}\n\n.mdc-snackbar--opening,\n.mdc-snackbar--open,\n.mdc-snackbar--closing {\n  display: -ms-flexbox;\n  display: flex;\n}\n\n.mdc-snackbar--leading {\n  -ms-flex-pack: start;\n  justify-content: flex-start;\n}\n\n.mdc-snackbar--stacked .mdc-snackbar__surface {\n  -ms-flex-direction: column;\n  flex-direction: column;\n  -ms-flex-align: start;\n  align-items: flex-start;\n}\n.mdc-snackbar--stacked .mdc-snackbar__actions {\n  -ms-flex-item-align: end;\n  align-self: flex-end;\n  margin-bottom: 0.5rem;\n}\n\n.mdc-snackbar__surface {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-align: center;\n  align-items: center;\n  -ms-flex-pack: start;\n  justify-content: flex-start;\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box;\n  -webkit-transform: scale(0.8);\n  transform: scale(0.8);\n  opacity: 0;\n}\n.mdc-snackbar--open .mdc-snackbar__surface {\n  -webkit-transform: scale(1);\n  transform: scale(1);\n  -webkit-transition: opacity 150ms 0ms cubic-bezier(0, 0, 0.2, 1), -webkit-transform 150ms 0ms cubic-bezier(0, 0, 0.2, 1);\n  transition: opacity 150ms 0ms cubic-bezier(0, 0, 0.2, 1), -webkit-transform 150ms 0ms cubic-bezier(0, 0, 0.2, 1);\n  transition: opacity 150ms 0ms cubic-bezier(0, 0, 0.2, 1), transform 150ms 0ms cubic-bezier(0, 0, 0.2, 1);\n  transition: opacity 150ms 0ms cubic-bezier(0, 0, 0.2, 1), transform 150ms 0ms cubic-bezier(0, 0, 0.2, 1), -webkit-transform 150ms 0ms cubic-bezier(0, 0, 0.2, 1);\n  opacity: 1;\n  pointer-events: auto;\n}\n.mdc-snackbar--closing .mdc-snackbar__surface {\n  -webkit-transform: scale(1);\n  transform: scale(1);\n  -webkit-transition: opacity 75ms 0ms cubic-bezier(0.4, 0, 1, 1);\n  transition: opacity 75ms 0ms cubic-bezier(0.4, 0, 1, 1);\n}\n\n.mdc-snackbar__label {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.8125rem;\n  line-height: 1.625rem;\n  font-weight: 400;\n  letter-spacing: 0.0178571429em;\n  text-decoration: inherit;\n  text-transform: inherit;\n  -ms-flex-positive: 1;\n  flex-grow: 1;\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box;\n  margin: 0;\n  padding: 0.875rem 1rem;\n}\n\n.mdc-snackbar__label::before {\n  display: inline;\n  content: attr(data-mdc-snackbar-label-text);\n}\n\n.mdc-snackbar__actions {\n  /* \@noflip */\n  margin-left: 0;\n  /* \@noflip */\n  margin-right: 0.5rem;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-negative: 0;\n  flex-shrink: 0;\n  -ms-flex-align: center;\n  align-items: center;\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box;\n}\n[dir=rtl] .mdc-snackbar__actions, .mdc-snackbar__actions[dir=rtl] {\n  /* \@noflip */\n  margin-left: 0.5rem;\n  /* \@noflip */\n  margin-right: 0;\n}\n\n.mdc-snackbar__action:not(:disabled) {\n  color: #bb86fc;\n}\n.mdc-snackbar__action::before, .mdc-snackbar__action::after {\n  background-color: #bb86fc;\n}\n.mdc-snackbar__action:hover::before {\n  opacity: 0.08;\n}\n.mdc-snackbar__action:not(.mdc-ripple-upgraded):focus::before, .mdc-snackbar__action.mdc-ripple-upgraded--background-focused::before {\n  -webkit-transition-duration: 75ms;\n  transition-duration: 75ms;\n  opacity: 0.24;\n}\n.mdc-snackbar__action:not(.mdc-ripple-upgraded)::after {\n  -webkit-transition: opacity 150ms linear;\n  transition: opacity 150ms linear;\n}\n.mdc-snackbar__action:not(.mdc-ripple-upgraded):active::after {\n  -webkit-transition-duration: 75ms;\n  transition-duration: 75ms;\n  opacity: 0.24;\n}\n.mdc-snackbar__action.mdc-ripple-upgraded {\n  --mdc-ripple-fg-opacity: 0.24;\n}\n\n.mdc-snackbar__dismiss {\n  color: rgba(255, 255, 255, 0.87);\n}\n.mdc-snackbar__dismiss::before, .mdc-snackbar__dismiss::after {\n  background-color: rgba(255, 255, 255, 0.87);\n}\n.mdc-snackbar__dismiss:hover::before {\n  opacity: 0.08;\n}\n.mdc-snackbar__dismiss:not(.mdc-ripple-upgraded):focus::before, .mdc-snackbar__dismiss.mdc-ripple-upgraded--background-focused::before {\n  -webkit-transition-duration: 75ms;\n  transition-duration: 75ms;\n  opacity: 0.24;\n}\n.mdc-snackbar__dismiss:not(.mdc-ripple-upgraded)::after {\n  -webkit-transition: opacity 150ms linear;\n  transition: opacity 150ms linear;\n}\n.mdc-snackbar__dismiss:not(.mdc-ripple-upgraded):active::after {\n  -webkit-transition-duration: 75ms;\n  transition-duration: 75ms;\n  opacity: 0.24;\n}\n.mdc-snackbar__dismiss.mdc-ripple-upgraded {\n  --mdc-ripple-fg-opacity: 0.24;\n}\n\n.mdc-snackbar__dismiss.mdc-snackbar__dismiss {\n  width: 2.25rem;\n  height: 2.25rem;\n  padding: 0.5625rem;\n  font-size: 1.125rem;\n}\n.mdc-snackbar__dismiss.mdc-snackbar__dismiss svg,\n.mdc-snackbar__dismiss.mdc-snackbar__dismiss img {\n  width: 1.125rem;\n  height: 1.125rem;\n}\n\n.mdc-snackbar__action + .mdc-snackbar__dismiss {\n  /* \@noflip */\n  margin-left: 0.5rem;\n  /* \@noflip */\n  margin-right: 0;\n}\n[dir=rtl] .mdc-snackbar__action + .mdc-snackbar__dismiss, .mdc-snackbar__action + .mdc-snackbar__dismiss[dir=rtl] {\n  /* \@noflip */\n  margin-left: 0;\n  /* \@noflip */\n  margin-right: 0.5rem;\n}\n\n.mdc-button:not(:disabled) {\n  color: #29b6f6;\n}"; }
}

export { PickerExample as LimelExampleSnackbar, Snackbar as LimelSnackbar };
