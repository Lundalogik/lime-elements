const h = window.LimeElements.h;

import { g as TAB, h as TAB_KEY_CODE, i as ARROW_UP, j as ARROW_UP_KEY_CODE, k as ARROW_DOWN, l as ARROW_DOWN_KEY_CODE } from './chunk-41a663e3.js';

'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/* global setTimeout, clearTimeout */

var dist = function debounce(fn) {
  var wait = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var lastCallAt = void 0;
  var deferred = void 0;
  var timer = void 0;
  var pendingArgs = [];
  return function debounced() {
    var currentWait = getWait(wait);
    var currentTime = new Date().getTime();

    var isCold = !lastCallAt || currentTime - lastCallAt > currentWait;

    lastCallAt = currentTime;

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (isCold && options.leading) {
      return options.accumulate ? Promise.resolve(fn.call(this, [args])).then(function (result) {
        return result[0];
      }) : Promise.resolve(fn.call.apply(fn, [this].concat(args)));
    }

    if (deferred) {
      clearTimeout(timer);
    } else {
      deferred = defer();
    }

    pendingArgs.push(args);
    timer = setTimeout(flush.bind(this), currentWait);

    if (options.accumulate) {
      var _ret = function () {
        var argsIndex = pendingArgs.length - 1;
        return {
          v: deferred.promise.then(function (results) {
            return results[argsIndex];
          })
        };
      }();

      if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
    }

    return deferred.promise;
  };

  function flush() {
    var thisDeferred = deferred;
    clearTimeout(timer);

    Promise.resolve(options.accumulate ? fn.call(this, pendingArgs) : fn.apply(this, pendingArgs[pendingArgs.length - 1])).then(thisDeferred.resolve, thisDeferred.reject);

    pendingArgs = [];
    deferred = null;
  }
};

function getWait(wait) {
  return typeof wait === 'function' ? wait() : wait;
}

function defer() {
  var deferred = {};
  deferred.promise = new Promise(function (resolve, reject) {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });
  return deferred;
}

function createImperativePromise(promiseArg) {
    var resolve = null;
    var reject = null;
    var wrappedPromise = new Promise(function (_resolve, _reject) {
        resolve = _resolve;
        reject = _reject;
    });
    promiseArg && promiseArg.then(function (val) {
        resolve && resolve(val);
    }, function (error) {
        reject && reject(error);
    });
    return {
        promise: wrappedPromise,
        resolve: function (value) {
            resolve && resolve(value);
        },
        reject: function (reason) {
            reject && reject(reason);
        },
        cancel: function () {
            resolve = null;
            reject = null;
        }
    };
}

// see https://stackoverflow.com/a/54825370/82609
function onlyResolvesLast(asyncFunction) {
    var cancelPrevious = null;
    var wrappedFunction = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        cancelPrevious && cancelPrevious();
        var initialPromise = asyncFunction.apply(void 0, args);
        var _a = createImperativePromise(initialPromise), promise = _a.promise, cancel = _a.cancel;
        cancelPrevious = cancel;
        return promise;
    };
    return wrappedFunction; // TODO fix TS
}

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

var DefaultOptions = {
    // One distinct debounced function is created per key and added to an internal cache
    // By default, the key is null, which means that all the calls
    // will share the same debounced function
    key: function () {
        var _args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _args[_i] = arguments[_i];
        }
        return null;
    },
    // By default, a debounced function will only resolve
    // the last promise it returned
    // Former calls will stay unresolved, so that you don't have
    // to handle concurrency issues in your code
    // Setting this to false means all returned promises will resolve to the last result
    onlyResolvesLast: true,
};
// We create a debouncing function cache, because when wrapping the original function,
// we may actually want to route the function call to different debounced functions depending function paameters
var DebounceCache = /** @class */ (function () {
    function DebounceCache(config) {
        this.config = config;
        this.debounceSingleton = null;
        this.debounceCache = {}; // when key feature is used
    }
    DebounceCache.prototype._createDebouncedFunction = function () {
        var debouncedFunc = dist(this.config.func, this.config.wait, this.config.options); // TODO TS
        if (this.config.options.onlyResolvesLast) {
            debouncedFunc = onlyResolvesLast(debouncedFunc);
        }
        return {
            func: debouncedFunc,
        };
    };
    DebounceCache.prototype.getDebouncedFunction = function (args) {
        var _a;
        var key = (_a = this.config.options).key.apply(_a, args);
        if (key === null || typeof key === 'undefined') {
            if (!this.debounceSingleton) {
                this.debounceSingleton = this._createDebouncedFunction();
            }
            return this.debounceSingleton;
        }
        else {
            if (!this.debounceCache[key]) {
                this.debounceCache[key] = this._createDebouncedFunction();
            }
            return this.debounceCache[key];
        }
    };
    return DebounceCache;
}());
function AwesomeDebouncePromise(func, wait, options) {
    var finalOptions = __assign({}, DefaultOptions, options);
    var debounceCache = new DebounceCache({
        func: func,
        wait: wait,
        options: finalOptions,
    });
    var AwesomeDebouncePromiseWrapper = (function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var debouncedFn = debounceCache.getDebouncedFunction(args).func;
        return debouncedFn.apply(void 0, args);
    }); // TODO fix TS
    /*
    AwesomeDebouncePromiseWrapper.cancel = (key?: string) => {
  
    };
    */
    return AwesomeDebouncePromiseWrapper;
}

/**
 * Check if an element is a descendant of another, even if it is located within a shadow root
 *
 * @param {Node} element the element to check
 * @param {Node} parent the parent element
 *
 * @returns {boolean} true if the element is a descendant of the parent element, false otherwise
 */
function isDescendant(element, parent) {
    if (parent.contains(element)) {
        return true;
    }
    let currentNode = element;
    let i = 0; // Just in case something weird happens, let's not crash the browser…
    const DEPTH = 1000; // Max depth to search.
    while (i < DEPTH &&
        currentNode &&
        currentNode.getRootNode().nodeName === '#document-fragment') {
        currentNode = currentNode.getRootNode().host;
        if (parent.contains(currentNode)) {
            return true;
        }
        i += 1;
    }
    return parent.contains(currentNode);
}

const SEARCH_DEBOUNCE = 500;
const CHIP_SET_TAG_NAME = 'limel-chip-set';
class Picker {
    constructor() {
        /**
         * True if the picker should be disabled
         */
        this.disabled = false;
        /**
         * True if the control requires a value
         */
        this.required = false;
        /**
         * True if multiple values are allowed
         */
        this.multiple = false;
        this.loading = false;
        this.chips = [];
        // Should NOT be decorated with State(), since this
        // should not trigger a re-render by itself.
        this.chipSetEditMode = false;
        this.handleElementBlur = this.handleElementBlur.bind(this);
        this.handleElementFocus = this.handleElementFocus.bind(this);
        this.handleTextInput = this.handleTextInput.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleInputFieldFocus = this.handleInputFieldFocus.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleInteract = this.handleInteract.bind(this);
        this.handleListChange = this.handleListChange.bind(this);
        this.handleStopEdit = this.handleStopEdit.bind(this);
    }
    onChangeValue(newValue, oldValue) {
        this.chips = this.createChips(this.value);
        if (!this.multiple) {
            return;
        }
        if (newValue.length <= oldValue.length) {
            return;
        }
        this.chipSet.setFocus();
    }
    componentDidLoad() {
        this.debouncedSearch = AwesomeDebouncePromise(this.searcher, SEARCH_DEBOUNCE);
        this.element.addEventListener('blur', this.handleElementBlur);
        this.element.addEventListener('focus', this.handleElementFocus);
        this.chipSet = this.element.shadowRoot.querySelector(CHIP_SET_TAG_NAME);
        this.chips = this.createChips(this.value);
    }
    componentDidUnload() {
        this.element.removeEventListener('blur', this.handleElementBlur);
        this.element.removeEventListener('focus', this.handleElementFocus);
    }
    async componentWillUpdate() {
        this.chipSetEditMode = !this.chipSet
            ? false
            : await this.chipSet.getEditMode();
    }
    render() {
        const iconColors = this.chips.some((chip) => {
            return 'iconColor' in chip && !!chip.iconColor;
        });
        const style = {};
        if (iconColors) {
            style['--icon-color'] = 'white';
        }
        return [
            h("limel-chip-set", { style: style, tabindex: "0", type: "input", label: this.label, value: this.chips, disabled: this.disabled, required: this.required, onInput: this.handleTextInput, onKeyDown: this.handleKeyDown, onFocus: this.handleInputFieldFocus, onChange: this.handleChange, onInteract: this.handleInteract, onStartEdit: this.handleInputFieldFocus, onStopEdit: this.handleStopEdit }),
            h("div", { class: "mdc-menu-surface--anchor" }, this.renderDropdown()),
        ];
    }
    createChips(value) {
        if (!value) {
            return [];
        }
        if (this.multiple) {
            const listItems = value;
            return listItems.map(this.createChip);
        }
        const listItem = value;
        return [this.createChip(listItem)];
    }
    createChip(listItem) {
        return {
            id: `${listItem.value}`,
            text: listItem.text,
            removable: true,
            icon: listItem.icon,
            iconColor: listItem.iconColor,
        };
    }
    /**
     * Renders the dropdown with the items to pick from, or a spinner if the picker
     * is waiting for items to be received
     *
     * @returns {HTMLElement} picker dropdown
     */
    renderDropdown() {
        if (!this.multiple && this.value) {
            // Don't render the dropdown if the picker is already "full".
            return;
        }
        if (!this.chipSetEditMode) {
            // Don't render the dropdown if the picker is not in edit mode.
            return;
        }
        const boundingRect = this.element.getBoundingClientRect();
        if (this.loading) {
            return (h("div", { style: {
                    width: `${boundingRect.width}px`,
                }, class: "dropdown--spinner mdc-elevation-transition mdc-elevation--z4 mdc-menu-surface mdc-menu-surface--open", tabindex: "-1" },
                h("limel-spinner", null)));
        }
        if (!this.items || !this.items.length) {
            return;
        }
        const hasIcons = this.items.some(item => {
            return 'icon' in item && !!item.icon;
        });
        return (h("div", { style: {
                width: `${boundingRect.width}px`,
            }, class: "dropdown--list mdc-elevation-transition mdc-elevation--z4 mdc-menu-surface mdc-menu-surface--open", tabindex: "-1" },
            h("limel-list", { badgeIcons: hasIcons, onChange: this.handleListChange, type: "selectable", items: this.items })));
    }
    /**
     * Check if a descendant still has focus, if not reset text value and search result
     *
     * @returns {void}
     */
    handleStopEdit() {
        // In browsers where shadow DOM is not supported activeElement on shadowRoot will return null
        // However, document.activeElement will return the actual focused element instead of the outermost shadow host
        const element = this.element.shadowRoot.activeElement || document.activeElement;
        if (isDescendant(element, this.element)) {
            return;
        }
        this.handleElementBlur();
    }
    /**
     * Reset the value of the input field when the control loses focus
     *
     * @returns {void}
     */
    handleElementBlur() {
        this.textValue = '';
        this.handleSearchResult('', []);
    }
    /**
     * Set focus to the input field when this control receives focus
     *
     * @returns {void}
     */
    handleElementFocus() {
        this.chipSet.setFocus();
    }
    /**
     * Input handler for the input field
     *
     * @param {InputEvent} event event
     *
     * @returns {void}
     */
    async handleTextInput(event) {
        event.stopPropagation();
        const query = event.detail;
        this.textValue = query;
        this.loading = true;
        // If the search-query is an empty string, bypass debouncing.
        const searchFn = query === '' ? this.searcher : this.debouncedSearch;
        const result = await searchFn(query);
        this.handleSearchResult(query, result);
    }
    /**
     * Change handler for the list
     *
     * @param {CustomEvent} event event
     *
     * @returns {void}
     */
    handleListChange(event) {
        event.stopPropagation();
        if (!this.value || this.value !== event.detail) {
            let newValue = event.detail;
            if (this.multiple) {
                newValue = [...this.value, event.detail];
            }
            this.change.emit(newValue);
            this.items = [];
        }
    }
    /**
     * Focus handler for the chip set
     * Prevent focus if the picker has a value and does not support multiple values
     * @param {CustomEvent} event event
     * @returns {void}
     */
    async handleInputFieldFocus(event) {
        if (this.value && !this.multiple) {
            event.stopPropagation();
            this.chipSet.blur();
            return;
        }
        this.textValue = '';
        this.loading = true;
        const result = await this.searcher('');
        this.handleSearchResult('', result);
    }
    handleChange(event) {
        event.stopPropagation();
        let newValue = null;
        if (this.multiple) {
            const chips = event.detail;
            newValue = chips.map(chip => {
                return this.value.find(item => {
                    return `${item.value}` === chip.id;
                });
            });
        }
        this.change.emit(newValue);
    }
    handleInteract(event) {
        event.stopPropagation();
        this.interact.emit(event.detail);
    }
    /**
     * Key handler for the input field
     * Will change focus to the first/last item in the dropdown list to enable selection with the keyboard
     *
     * @param {KeyboardEvent} event event
     *
     * @returns {void}
     */
    handleKeyDown(event) {
        const isTab = event.key === TAB || event.keyCode === TAB_KEY_CODE;
        const isUp = event.key === ARROW_UP || event.keyCode === ARROW_UP_KEY_CODE;
        const isDown = event.key === ARROW_DOWN || event.keyCode === ARROW_DOWN_KEY_CODE;
        if (!isTab && !isUp && !isDown) {
            return;
        }
        const list = this.element.shadowRoot.querySelector('limel-list');
        if (!list) {
            return;
        }
        event.preventDefault();
        if (isTab || isDown) {
            const listElement = list.shadowRoot.querySelector('.mdc-list-item:first-child');
            listElement.focus();
            return;
        }
        if (isUp) {
            const listElement = list.shadowRoot.querySelector('.mdc-list-item:last-child');
            listElement.focus();
            return;
        }
    }
    handleSearchResult(query, result) {
        if (query === this.textValue) {
            this.items = result;
            if (this.multiple) {
                const values = this.value;
                this.items = result.filter(item => {
                    return !values.includes(item);
                });
            }
            this.loading = false;
        }
    }
    static get is() { return "limel-picker"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "chips": {
            "state": true
        },
        "disabled": {
            "type": Boolean,
            "attr": "disabled"
        },
        "element": {
            "elementRef": true
        },
        "items": {
            "state": true
        },
        "label": {
            "type": String,
            "attr": "label"
        },
        "loading": {
            "state": true
        },
        "multiple": {
            "type": Boolean,
            "attr": "multiple"
        },
        "required": {
            "type": Boolean,
            "attr": "required"
        },
        "searcher": {
            "type": "Any",
            "attr": "searcher"
        },
        "textValue": {
            "state": true
        },
        "value": {
            "type": "Any",
            "attr": "value",
            "watchCallbacks": ["onChangeValue"]
        }
    }; }
    static get events() { return [{
            "name": "change",
            "method": "change",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "interact",
            "method": "interact",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get style() { return ":host {\n  --mdc-theme-primary: var(--lime-primary-color, #26a69a);\n  --mdc-theme-secondary: var(--lime-secondary-color, #575756);\n  --mdc-theme-on-primary: var(--lime-on-primary-color, #fff);\n  --mdc-theme-on-secondary: var(--lime-on-secondary-color, #fff);\n}\n\n:root {\n  --mdc-theme-primary: #26a69a;\n  --mdc-theme-secondary: #575756;\n  --mdc-theme-background: #fff;\n  --mdc-theme-surface: #fff;\n  --mdc-theme-error: #b00020;\n  --mdc-theme-on-primary: #fff;\n  --mdc-theme-on-secondary: #fff;\n  --mdc-theme-on-surface: #000;\n  --mdc-theme-on-error: #fff;\n  --mdc-theme-text-primary-on-background: rgba(0, 0, 0, 0.87);\n  --mdc-theme-text-secondary-on-background: rgba(0, 0, 0, 0.54);\n  --mdc-theme-text-hint-on-background: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-disabled-on-background: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-icon-on-background: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-primary-on-light: rgba(0, 0, 0, 0.87);\n  --mdc-theme-text-secondary-on-light: rgba(0, 0, 0, 0.54);\n  --mdc-theme-text-hint-on-light: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-disabled-on-light: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-icon-on-light: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-primary-on-dark: white;\n  --mdc-theme-text-secondary-on-dark: rgba(255, 255, 255, 0.7);\n  --mdc-theme-text-hint-on-dark: rgba(255, 255, 255, 0.5);\n  --mdc-theme-text-disabled-on-dark: rgba(255, 255, 255, 0.5);\n  --mdc-theme-text-icon-on-dark: rgba(255, 255, 255, 0.5);\n}\n\n.mdc-theme--primary {\n  color: #26a69a !important;\n  /* \@alternate */\n  color: var(--mdc-theme-primary, #26a69a) !important;\n}\n\n.mdc-theme--secondary {\n  color: #575756 !important;\n  /* \@alternate */\n  color: var(--mdc-theme-secondary, #575756) !important;\n}\n\n.mdc-theme--background {\n  background-color: #fff;\n  /* \@alternate */\n  background-color: var(--mdc-theme-background, #fff);\n}\n\n.mdc-theme--surface {\n  background-color: #fff;\n  /* \@alternate */\n  background-color: var(--mdc-theme-surface, #fff);\n}\n\n.mdc-theme--error {\n  color: #b00020 !important;\n  /* \@alternate */\n  color: var(--mdc-theme-error, #b00020) !important;\n}\n\n.mdc-theme--on-primary {\n  color: #fff !important;\n  /* \@alternate */\n  color: var(--mdc-theme-on-primary, #fff) !important;\n}\n\n.mdc-theme--on-secondary {\n  color: #fff !important;\n  /* \@alternate */\n  color: var(--mdc-theme-on-secondary, #fff) !important;\n}\n\n.mdc-theme--on-surface {\n  color: #000 !important;\n  /* \@alternate */\n  color: var(--mdc-theme-on-surface, #000) !important;\n}\n\n.mdc-theme--on-error {\n  color: #fff !important;\n  /* \@alternate */\n  color: var(--mdc-theme-on-error, #fff) !important;\n}\n\n.mdc-theme--text-primary-on-background {\n  color: rgba(0, 0, 0, 0.87) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-primary-on-background, rgba(0, 0, 0, 0.87)) !important;\n}\n\n.mdc-theme--text-secondary-on-background {\n  color: rgba(0, 0, 0, 0.54) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-secondary-on-background, rgba(0, 0, 0, 0.54)) !important;\n}\n\n.mdc-theme--text-hint-on-background {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.38)) !important;\n}\n\n.mdc-theme--text-disabled-on-background {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-disabled-on-background, rgba(0, 0, 0, 0.38)) !important;\n}\n\n.mdc-theme--text-icon-on-background {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-icon-on-background, rgba(0, 0, 0, 0.38)) !important;\n}\n\n.mdc-theme--text-primary-on-light {\n  color: rgba(0, 0, 0, 0.87) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-primary-on-light, rgba(0, 0, 0, 0.87)) !important;\n}\n\n.mdc-theme--text-secondary-on-light {\n  color: rgba(0, 0, 0, 0.54) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-secondary-on-light, rgba(0, 0, 0, 0.54)) !important;\n}\n\n.mdc-theme--text-hint-on-light {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-hint-on-light, rgba(0, 0, 0, 0.38)) !important;\n}\n\n.mdc-theme--text-disabled-on-light {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-disabled-on-light, rgba(0, 0, 0, 0.38)) !important;\n}\n\n.mdc-theme--text-icon-on-light {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-icon-on-light, rgba(0, 0, 0, 0.38)) !important;\n}\n\n.mdc-theme--text-primary-on-dark {\n  color: white !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-primary-on-dark, white) !important;\n}\n\n.mdc-theme--text-secondary-on-dark {\n  color: rgba(255, 255, 255, 0.7) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-secondary-on-dark, rgba(255, 255, 255, 0.7)) !important;\n}\n\n.mdc-theme--text-hint-on-dark {\n  color: rgba(255, 255, 255, 0.5) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-hint-on-dark, rgba(255, 255, 255, 0.5)) !important;\n}\n\n.mdc-theme--text-disabled-on-dark {\n  color: rgba(255, 255, 255, 0.5) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-disabled-on-dark, rgba(255, 255, 255, 0.5)) !important;\n}\n\n.mdc-theme--text-icon-on-dark {\n  color: rgba(255, 255, 255, 0.5) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-icon-on-dark, rgba(255, 255, 255, 0.5)) !important;\n}\n\n.mdc-theme--primary-bg {\n  background-color: #26a69a !important;\n  /* \@alternate */\n  background-color: var(--mdc-theme-primary, #26a69a) !important;\n}\n\n.mdc-theme--secondary-bg {\n  background-color: #575756 !important;\n  /* \@alternate */\n  background-color: var(--mdc-theme-secondary, #575756) !important;\n}\n\n.mdc-typography {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n}\n\n.mdc-typography--headline1 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1rem;\n  line-height: 0.875rem;\n  font-weight: 300;\n  letter-spacing: -0.015625em;\n  text-decoration: inherit;\n  text-transform: inherit;\n}\n\n.mdc-typography--headline2 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1rem;\n  line-height: 0.875rem;\n  font-weight: 300;\n  letter-spacing: -0.0083333333em;\n  text-decoration: inherit;\n  text-transform: inherit;\n}\n\n.mdc-typography--headline3 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1rem;\n  line-height: 0.875rem;\n  font-weight: 400;\n  letter-spacing: normal;\n  text-decoration: inherit;\n  text-transform: inherit;\n}\n\n.mdc-typography--headline4 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1rem;\n  line-height: 0.875rem;\n  font-weight: 400;\n  letter-spacing: 0.0073529412em;\n  text-decoration: inherit;\n  text-transform: inherit;\n}\n\n.mdc-typography--headline5 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.875rem;\n  line-height: 0.875rem;\n  font-weight: 400;\n  letter-spacing: normal;\n  text-decoration: inherit;\n  text-transform: inherit;\n}\n\n.mdc-typography--headline6 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.875rem;\n  line-height: 0.875rem;\n  font-weight: 500;\n  letter-spacing: 0.0125em;\n  text-decoration: inherit;\n  text-transform: inherit;\n}\n\n.mdc-typography--subtitle1 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.875rem;\n  line-height: 1.125rem;\n  font-weight: 400;\n  letter-spacing: 0.009375em;\n  text-decoration: inherit;\n  text-transform: inherit;\n}\n\n.mdc-typography--subtitle2 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.8125rem;\n  line-height: 1.125rem;\n  font-weight: 500;\n  letter-spacing: 0.0071428571em;\n  text-decoration: inherit;\n  text-transform: inherit;\n}\n\n.mdc-typography--body1 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.8125rem;\n  line-height: 1.5rem;\n  font-weight: 400;\n  letter-spacing: 0.03125em;\n  text-decoration: inherit;\n  text-transform: inherit;\n}\n\n.mdc-typography--body2 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.8125rem;\n  line-height: 1.625rem;\n  font-weight: 400;\n  letter-spacing: 0.0178571429em;\n  text-decoration: inherit;\n  text-transform: inherit;\n}\n\n.mdc-typography--caption {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.6875rem;\n  line-height: 0.875rem;\n  font-weight: 400;\n  letter-spacing: 0.0333333333em;\n  text-decoration: inherit;\n  text-transform: inherit;\n}\n\n.mdc-typography--button {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.875rem;\n  line-height: 2.25rem;\n  font-weight: 500;\n  letter-spacing: 0.0892857143em;\n  text-decoration: none;\n  text-transform: none;\n}\n\n.mdc-typography--overline {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.6875rem;\n  line-height: 0.875rem;\n  font-weight: 500;\n  letter-spacing: 0.1666666667em;\n  text-decoration: none;\n  text-transform: uppercase;\n}\n\n.mdc-elevation--z0 {\n  -webkit-box-shadow: 0rem 0rem 0rem 0rem rgba(0, 0, 0, 0.2), 0rem 0rem 0rem 0rem rgba(0, 0, 0, 0.14), 0rem 0rem 0rem 0rem rgba(0, 0, 0, 0.12);\n  box-shadow: 0rem 0rem 0rem 0rem rgba(0, 0, 0, 0.2), 0rem 0rem 0rem 0rem rgba(0, 0, 0, 0.14), 0rem 0rem 0rem 0rem rgba(0, 0, 0, 0.12);\n}\n\n.mdc-elevation--z1 {\n  -webkit-box-shadow: 0rem 0.125rem 0.0625rem -0.0625rem rgba(0, 0, 0, 0.2), 0rem 0.0625rem 0.0625rem 0rem rgba(0, 0, 0, 0.14), 0rem 0.0625rem 0.1875rem 0rem rgba(0, 0, 0, 0.12);\n  box-shadow: 0rem 0.125rem 0.0625rem -0.0625rem rgba(0, 0, 0, 0.2), 0rem 0.0625rem 0.0625rem 0rem rgba(0, 0, 0, 0.14), 0rem 0.0625rem 0.1875rem 0rem rgba(0, 0, 0, 0.12);\n}\n\n.mdc-elevation--z2 {\n  -webkit-box-shadow: 0rem 0.1875rem 0.0625rem -0.125rem rgba(0, 0, 0, 0.2), 0rem 0.125rem 0.125rem 0rem rgba(0, 0, 0, 0.14), 0rem 0.0625rem 0.3125rem 0rem rgba(0, 0, 0, 0.12);\n  box-shadow: 0rem 0.1875rem 0.0625rem -0.125rem rgba(0, 0, 0, 0.2), 0rem 0.125rem 0.125rem 0rem rgba(0, 0, 0, 0.14), 0rem 0.0625rem 0.3125rem 0rem rgba(0, 0, 0, 0.12);\n}\n\n.mdc-elevation--z3 {\n  -webkit-box-shadow: 0rem 0.1875rem 0.1875rem -0.125rem rgba(0, 0, 0, 0.2), 0rem 0.1875rem 0.25rem 0rem rgba(0, 0, 0, 0.14), 0rem 0.0625rem 0.5rem 0rem rgba(0, 0, 0, 0.12);\n  box-shadow: 0rem 0.1875rem 0.1875rem -0.125rem rgba(0, 0, 0, 0.2), 0rem 0.1875rem 0.25rem 0rem rgba(0, 0, 0, 0.14), 0rem 0.0625rem 0.5rem 0rem rgba(0, 0, 0, 0.12);\n}\n\n.mdc-elevation--z4 {\n  -webkit-box-shadow: 0rem 0.125rem 0.25rem -0.0625rem rgba(0, 0, 0, 0.2), 0rem 0.25rem 0.3125rem 0rem rgba(0, 0, 0, 0.14), 0rem 0.0625rem 0.625rem 0rem rgba(0, 0, 0, 0.12);\n  box-shadow: 0rem 0.125rem 0.25rem -0.0625rem rgba(0, 0, 0, 0.2), 0rem 0.25rem 0.3125rem 0rem rgba(0, 0, 0, 0.14), 0rem 0.0625rem 0.625rem 0rem rgba(0, 0, 0, 0.12);\n}\n\n.mdc-elevation--z5 {\n  -webkit-box-shadow: 0rem 0.1875rem 0.3125rem -0.0625rem rgba(0, 0, 0, 0.2), 0rem 0.3125rem 0.5rem 0rem rgba(0, 0, 0, 0.14), 0rem 0.0625rem 0.875rem 0rem rgba(0, 0, 0, 0.12);\n  box-shadow: 0rem 0.1875rem 0.3125rem -0.0625rem rgba(0, 0, 0, 0.2), 0rem 0.3125rem 0.5rem 0rem rgba(0, 0, 0, 0.14), 0rem 0.0625rem 0.875rem 0rem rgba(0, 0, 0, 0.12);\n}\n\n.mdc-elevation--z6 {\n  -webkit-box-shadow: 0rem 0.1875rem 0.3125rem -0.0625rem rgba(0, 0, 0, 0.2), 0rem 0.375rem 0.625rem 0rem rgba(0, 0, 0, 0.14), 0rem 0.0625rem 1.125rem 0rem rgba(0, 0, 0, 0.12);\n  box-shadow: 0rem 0.1875rem 0.3125rem -0.0625rem rgba(0, 0, 0, 0.2), 0rem 0.375rem 0.625rem 0rem rgba(0, 0, 0, 0.14), 0rem 0.0625rem 1.125rem 0rem rgba(0, 0, 0, 0.12);\n}\n\n.mdc-elevation--z7 {\n  -webkit-box-shadow: 0rem 0.25rem 0.3125rem -0.125rem rgba(0, 0, 0, 0.2), 0rem 0.4375rem 0.625rem 0.0625rem rgba(0, 0, 0, 0.14), 0rem 0.125rem 1rem 0.0625rem rgba(0, 0, 0, 0.12);\n  box-shadow: 0rem 0.25rem 0.3125rem -0.125rem rgba(0, 0, 0, 0.2), 0rem 0.4375rem 0.625rem 0.0625rem rgba(0, 0, 0, 0.14), 0rem 0.125rem 1rem 0.0625rem rgba(0, 0, 0, 0.12);\n}\n\n.mdc-elevation--z8 {\n  -webkit-box-shadow: 0rem 0.3125rem 0.3125rem -0.1875rem rgba(0, 0, 0, 0.2), 0rem 0.5rem 0.625rem 0.0625rem rgba(0, 0, 0, 0.14), 0rem 0.1875rem 0.875rem 0.125rem rgba(0, 0, 0, 0.12);\n  box-shadow: 0rem 0.3125rem 0.3125rem -0.1875rem rgba(0, 0, 0, 0.2), 0rem 0.5rem 0.625rem 0.0625rem rgba(0, 0, 0, 0.14), 0rem 0.1875rem 0.875rem 0.125rem rgba(0, 0, 0, 0.12);\n}\n\n.mdc-elevation--z9 {\n  -webkit-box-shadow: 0rem 0.3125rem 0.375rem -0.1875rem rgba(0, 0, 0, 0.2), 0rem 0.5625rem 0.75rem 0.0625rem rgba(0, 0, 0, 0.14), 0rem 0.1875rem 1rem 0.125rem rgba(0, 0, 0, 0.12);\n  box-shadow: 0rem 0.3125rem 0.375rem -0.1875rem rgba(0, 0, 0, 0.2), 0rem 0.5625rem 0.75rem 0.0625rem rgba(0, 0, 0, 0.14), 0rem 0.1875rem 1rem 0.125rem rgba(0, 0, 0, 0.12);\n}\n\n.mdc-elevation--z10 {\n  -webkit-box-shadow: 0rem 0.375rem 0.375rem -0.1875rem rgba(0, 0, 0, 0.2), 0rem 0.625rem 0.875rem 0.0625rem rgba(0, 0, 0, 0.14), 0rem 0.25rem 1.125rem 0.1875rem rgba(0, 0, 0, 0.12);\n  box-shadow: 0rem 0.375rem 0.375rem -0.1875rem rgba(0, 0, 0, 0.2), 0rem 0.625rem 0.875rem 0.0625rem rgba(0, 0, 0, 0.14), 0rem 0.25rem 1.125rem 0.1875rem rgba(0, 0, 0, 0.12);\n}\n\n.mdc-elevation--z11 {\n  -webkit-box-shadow: 0rem 0.375rem 0.4375rem -0.25rem rgba(0, 0, 0, 0.2), 0rem 0.6875rem 0.9375rem 0.0625rem rgba(0, 0, 0, 0.14), 0rem 0.25rem 1.25rem 0.1875rem rgba(0, 0, 0, 0.12);\n  box-shadow: 0rem 0.375rem 0.4375rem -0.25rem rgba(0, 0, 0, 0.2), 0rem 0.6875rem 0.9375rem 0.0625rem rgba(0, 0, 0, 0.14), 0rem 0.25rem 1.25rem 0.1875rem rgba(0, 0, 0, 0.12);\n}\n\n.mdc-elevation--z12 {\n  -webkit-box-shadow: 0rem 0.4375rem 0.5rem -0.25rem rgba(0, 0, 0, 0.2), 0rem 0.75rem 1.0625rem 0.125rem rgba(0, 0, 0, 0.14), 0rem 0.3125rem 1.375rem 0.25rem rgba(0, 0, 0, 0.12);\n  box-shadow: 0rem 0.4375rem 0.5rem -0.25rem rgba(0, 0, 0, 0.2), 0rem 0.75rem 1.0625rem 0.125rem rgba(0, 0, 0, 0.14), 0rem 0.3125rem 1.375rem 0.25rem rgba(0, 0, 0, 0.12);\n}\n\n.mdc-elevation--z13 {\n  -webkit-box-shadow: 0rem 0.4375rem 0.5rem -0.25rem rgba(0, 0, 0, 0.2), 0rem 0.8125rem 1.1875rem 0.125rem rgba(0, 0, 0, 0.14), 0rem 0.3125rem 1.5rem 0.25rem rgba(0, 0, 0, 0.12);\n  box-shadow: 0rem 0.4375rem 0.5rem -0.25rem rgba(0, 0, 0, 0.2), 0rem 0.8125rem 1.1875rem 0.125rem rgba(0, 0, 0, 0.14), 0rem 0.3125rem 1.5rem 0.25rem rgba(0, 0, 0, 0.12);\n}\n\n.mdc-elevation--z14 {\n  -webkit-box-shadow: 0rem 0.4375rem 0.5625rem -0.25rem rgba(0, 0, 0, 0.2), 0rem 0.875rem 1.3125rem 0.125rem rgba(0, 0, 0, 0.14), 0rem 0.3125rem 1.625rem 0.25rem rgba(0, 0, 0, 0.12);\n  box-shadow: 0rem 0.4375rem 0.5625rem -0.25rem rgba(0, 0, 0, 0.2), 0rem 0.875rem 1.3125rem 0.125rem rgba(0, 0, 0, 0.14), 0rem 0.3125rem 1.625rem 0.25rem rgba(0, 0, 0, 0.12);\n}\n\n.mdc-elevation--z15 {\n  -webkit-box-shadow: 0rem 0.5rem 0.5625rem -0.3125rem rgba(0, 0, 0, 0.2), 0rem 0.9375rem 1.375rem 0.125rem rgba(0, 0, 0, 0.14), 0rem 0.375rem 1.75rem 0.3125rem rgba(0, 0, 0, 0.12);\n  box-shadow: 0rem 0.5rem 0.5625rem -0.3125rem rgba(0, 0, 0, 0.2), 0rem 0.9375rem 1.375rem 0.125rem rgba(0, 0, 0, 0.14), 0rem 0.375rem 1.75rem 0.3125rem rgba(0, 0, 0, 0.12);\n}\n\n.mdc-elevation--z16 {\n  -webkit-box-shadow: 0rem 0.5rem 0.625rem -0.3125rem rgba(0, 0, 0, 0.2), 0rem 1rem 1.5rem 0.125rem rgba(0, 0, 0, 0.14), 0rem 0.375rem 1.875rem 0.3125rem rgba(0, 0, 0, 0.12);\n  box-shadow: 0rem 0.5rem 0.625rem -0.3125rem rgba(0, 0, 0, 0.2), 0rem 1rem 1.5rem 0.125rem rgba(0, 0, 0, 0.14), 0rem 0.375rem 1.875rem 0.3125rem rgba(0, 0, 0, 0.12);\n}\n\n.mdc-elevation--z17 {\n  -webkit-box-shadow: 0rem 0.5rem 0.6875rem -0.3125rem rgba(0, 0, 0, 0.2), 0rem 1.0625rem 1.625rem 0.125rem rgba(0, 0, 0, 0.14), 0rem 0.375rem 2rem 0.3125rem rgba(0, 0, 0, 0.12);\n  box-shadow: 0rem 0.5rem 0.6875rem -0.3125rem rgba(0, 0, 0, 0.2), 0rem 1.0625rem 1.625rem 0.125rem rgba(0, 0, 0, 0.14), 0rem 0.375rem 2rem 0.3125rem rgba(0, 0, 0, 0.12);\n}\n\n.mdc-elevation--z18 {\n  -webkit-box-shadow: 0rem 0.5625rem 0.6875rem -0.3125rem rgba(0, 0, 0, 0.2), 0rem 1.125rem 1.75rem 0.125rem rgba(0, 0, 0, 0.14), 0rem 0.4375rem 2.125rem 0.375rem rgba(0, 0, 0, 0.12);\n  box-shadow: 0rem 0.5625rem 0.6875rem -0.3125rem rgba(0, 0, 0, 0.2), 0rem 1.125rem 1.75rem 0.125rem rgba(0, 0, 0, 0.14), 0rem 0.4375rem 2.125rem 0.375rem rgba(0, 0, 0, 0.12);\n}\n\n.mdc-elevation--z19 {\n  -webkit-box-shadow: 0rem 0.5625rem 0.75rem -0.375rem rgba(0, 0, 0, 0.2), 0rem 1.1875rem 1.8125rem 0.125rem rgba(0, 0, 0, 0.14), 0rem 0.4375rem 2.25rem 0.375rem rgba(0, 0, 0, 0.12);\n  box-shadow: 0rem 0.5625rem 0.75rem -0.375rem rgba(0, 0, 0, 0.2), 0rem 1.1875rem 1.8125rem 0.125rem rgba(0, 0, 0, 0.14), 0rem 0.4375rem 2.25rem 0.375rem rgba(0, 0, 0, 0.12);\n}\n\n.mdc-elevation--z20 {\n  -webkit-box-shadow: 0rem 0.625rem 0.8125rem -0.375rem rgba(0, 0, 0, 0.2), 0rem 1.25rem 1.9375rem 0.1875rem rgba(0, 0, 0, 0.14), 0rem 0.5rem 2.375rem 0.4375rem rgba(0, 0, 0, 0.12);\n  box-shadow: 0rem 0.625rem 0.8125rem -0.375rem rgba(0, 0, 0, 0.2), 0rem 1.25rem 1.9375rem 0.1875rem rgba(0, 0, 0, 0.14), 0rem 0.5rem 2.375rem 0.4375rem rgba(0, 0, 0, 0.12);\n}\n\n.mdc-elevation--z21 {\n  -webkit-box-shadow: 0rem 0.625rem 0.8125rem -0.375rem rgba(0, 0, 0, 0.2), 0rem 1.3125rem 2.0625rem 0.1875rem rgba(0, 0, 0, 0.14), 0rem 0.5rem 2.5rem 0.4375rem rgba(0, 0, 0, 0.12);\n  box-shadow: 0rem 0.625rem 0.8125rem -0.375rem rgba(0, 0, 0, 0.2), 0rem 1.3125rem 2.0625rem 0.1875rem rgba(0, 0, 0, 0.14), 0rem 0.5rem 2.5rem 0.4375rem rgba(0, 0, 0, 0.12);\n}\n\n.mdc-elevation--z22 {\n  -webkit-box-shadow: 0rem 0.625rem 0.875rem -0.375rem rgba(0, 0, 0, 0.2), 0rem 1.375rem 2.1875rem 0.1875rem rgba(0, 0, 0, 0.14), 0rem 0.5rem 2.625rem 0.4375rem rgba(0, 0, 0, 0.12);\n  box-shadow: 0rem 0.625rem 0.875rem -0.375rem rgba(0, 0, 0, 0.2), 0rem 1.375rem 2.1875rem 0.1875rem rgba(0, 0, 0, 0.14), 0rem 0.5rem 2.625rem 0.4375rem rgba(0, 0, 0, 0.12);\n}\n\n.mdc-elevation--z23 {\n  -webkit-box-shadow: 0rem 0.6875rem 0.875rem -0.4375rem rgba(0, 0, 0, 0.2), 0rem 1.4375rem 2.25rem 0.1875rem rgba(0, 0, 0, 0.14), 0rem 0.5625rem 2.75rem 0.5rem rgba(0, 0, 0, 0.12);\n  box-shadow: 0rem 0.6875rem 0.875rem -0.4375rem rgba(0, 0, 0, 0.2), 0rem 1.4375rem 2.25rem 0.1875rem rgba(0, 0, 0, 0.14), 0rem 0.5625rem 2.75rem 0.5rem rgba(0, 0, 0, 0.12);\n}\n\n.mdc-elevation--z24 {\n  -webkit-box-shadow: 0rem 0.6875rem 0.9375rem -0.4375rem rgba(0, 0, 0, 0.2), 0rem 1.5rem 2.375rem 0.1875rem rgba(0, 0, 0, 0.14), 0rem 0.5625rem 2.875rem 0.5rem rgba(0, 0, 0, 0.12);\n  box-shadow: 0rem 0.6875rem 0.9375rem -0.4375rem rgba(0, 0, 0, 0.2), 0rem 1.5rem 2.375rem 0.1875rem rgba(0, 0, 0, 0.14), 0rem 0.5625rem 2.875rem 0.5rem rgba(0, 0, 0, 0.12);\n}\n\n.mdc-elevation-transition {\n  -webkit-transition: -webkit-box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: -webkit-box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1), -webkit-box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);\n  will-change: box-shadow;\n}\n\n.mdc-menu-surface {\n  display: none;\n  position: absolute;\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box;\n  max-width: calc(100vw - 2rem);\n  max-height: calc(100vh - 2rem);\n  margin: 0;\n  padding: 0;\n  -webkit-transform: scale(1);\n  transform: scale(1);\n  -webkit-transform-origin: top left;\n  transform-origin: top left;\n  opacity: 0;\n  overflow: auto;\n  will-change: transform, opacity;\n  z-index: 8;\n  -webkit-transition: opacity 0.03s linear, -webkit-transform 0.12s cubic-bezier(0, 0, 0.2, 1);\n  transition: opacity 0.03s linear, -webkit-transform 0.12s cubic-bezier(0, 0, 0.2, 1);\n  transition: opacity 0.03s linear, transform 0.12s cubic-bezier(0, 0, 0.2, 1);\n  transition: opacity 0.03s linear, transform 0.12s cubic-bezier(0, 0, 0.2, 1), -webkit-transform 0.12s cubic-bezier(0, 0, 0.2, 1);\n  -webkit-box-shadow: 0rem 0.3125rem 0.3125rem -0.1875rem rgba(0, 0, 0, 0.2), 0rem 0.5rem 0.625rem 0.0625rem rgba(0, 0, 0, 0.14), 0rem 0.1875rem 0.875rem 0.125rem rgba(0, 0, 0, 0.12);\n  box-shadow: 0rem 0.3125rem 0.3125rem -0.1875rem rgba(0, 0, 0, 0.2), 0rem 0.5rem 0.625rem 0.0625rem rgba(0, 0, 0, 0.14), 0rem 0.1875rem 0.875rem 0.125rem rgba(0, 0, 0, 0.12);\n  background-color: #fff;\n  /* \@alternate */\n  background-color: var(--mdc-theme-surface, #fff);\n  color: #000;\n  /* \@alternate */\n  color: var(--mdc-theme-on-surface, #000);\n  border-radius: 0.25rem;\n  /* \@noflip */\n  transform-origin-left: top left;\n  /* \@noflip */\n  transform-origin-right: top right;\n}\n.mdc-menu-surface:focus {\n  outline: none;\n}\n.mdc-menu-surface--open {\n  display: inline-block;\n  -webkit-transform: scale(1);\n  transform: scale(1);\n  opacity: 1;\n}\n.mdc-menu-surface--animating-open {\n  display: inline-block;\n  -webkit-transform: scale(0.8);\n  transform: scale(0.8);\n  opacity: 0;\n}\n.mdc-menu-surface--animating-closed {\n  display: inline-block;\n  opacity: 0;\n  -webkit-transition: opacity 0.075s linear;\n  transition: opacity 0.075s linear;\n}\n[dir=rtl] .mdc-menu-surface, .mdc-menu-surface[dir=rtl] {\n  /* \@noflip */\n  transform-origin-left: top right;\n  /* \@noflip */\n  transform-origin-right: top left;\n}\n\n.mdc-menu-surface--anchor {\n  position: relative;\n  overflow: visible;\n}\n\n.mdc-menu-surface--fixed {\n  position: fixed;\n}\n\n:host {\n  position: relative;\n}\n\n.dropdown--spinner {\n  text-align: center;\n}\n.dropdown--spinner limel-spinner {\n  margin: 0.625rem 0;\n  color: var(--lime-primary-color, #26a69a);\n}\n\n.dropdown--spinner,\n.dropdown--list {\n  background-color: white;\n  position: absolute;\n  margin-top: -0.5rem;\n  max-height: 15.625rem;\n  overflow-y: auto;\n}"; }
}

export { Picker as LimelPicker };
