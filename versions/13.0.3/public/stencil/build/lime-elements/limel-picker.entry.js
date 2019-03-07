const h = window.LimeElements.h;

import { a as createCommonjsModule, c as unwrapExports } from './chunk-84ac4f31.js';
import { e as TAB, f as TAB_KEY_CODE, g as ARROW_UP, h as ARROW_UP_KEY_CODE, i as ARROW_DOWN, j as ARROW_DOWN_KEY_CODE } from './chunk-1943009e.js';

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

var awesomeDebouncePromise = createCommonjsModule(function (module, exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DebounceCache = exports.onlyResolvesLast = exports.debounce = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };



var _debouncePromise2 = _interopRequireDefault(dist);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// We use DebouncePromise as a dependency as it does a great low-level job
// The behavior of the lib is to return the same promise for all function calls
var debounce = exports.debounce = function debounce(func, wait, options) {
  return (0, _debouncePromise2.default)(func, wait, options);
};

// Given a function returning promises, wrap it so that only the promise returned from last call will actually resolve
// This is useful to ignore former async results and handle concurrency issues
var onlyResolvesLast = exports.onlyResolvesLast = function onlyResolvesLast(asyncFunction) {
  // Inspired from https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
  var makeCancelable = function makeCancelable(promise) {
    var hasCanceled_ = false;
    var wrappedPromise = new Promise(function (resolve, reject) {
      promise.then(function (val) {
        return hasCanceled_ ? undefined : resolve(val);
      }, function (error) {
        return hasCanceled_ ? undefined : reject(error);
      });
    });
    return {
      promise: wrappedPromise,
      cancel: function cancel() {
        hasCanceled_ = true;
      }
    };
  };

  var cancelPrevious = void 0;
  return function () {
    cancelPrevious && cancelPrevious();

    var _makeCancelable = makeCancelable(asyncFunction.apply(undefined, arguments)),
        promise = _makeCancelable.promise,
        cancel = _makeCancelable.cancel;

    cancelPrevious = cancel;
    return promise;
  };
};

// We create a debouncing function cache, because when wrapping the original function,
// we may actually want to route the function call to different debounced functions depending function paameters

var DebounceCache = exports.DebounceCache = function DebounceCache() {
  var _this = this;

  _classCallCheck(this, DebounceCache);

  this.getDebouncedFunction = function (func, wait, options, args) {
    var keyOptions = options.key,
        onlyResolvesLastOption = options.onlyResolvesLast,
        otherOptions = _objectWithoutProperties(options, ['key', 'onlyResolvesLast']);

    var key = keyOptions.apply(undefined, _toConsumableArray(args));
    // If the debounced function does not exist for this key, we create one on the fly and return it
    if (!_this.debounceCache[key]) {
      var debouncedFunc = debounce(func, wait, otherOptions);
      if (onlyResolvesLastOption) {
        debouncedFunc = onlyResolvesLast(debouncedFunc);
      }
      _this.debounceCache[key] = debouncedFunc;
    }
    return _this.debounceCache[key];
  };

  this.debounceCache = {};
};

var DefaultOptions = {
  // By default, the key is null, which means that all the function calls
  // will share the same debounced function
  // Providing a key function permit to use the call arguments
  // and route to a distinct debounced function
  key: function key() {
    return null;
  },

  // By default, a debounced function will only resolve
  // the last promise it returned
  // Former calls will stay unresolved, so that you don't have
  // to handle concurrency issues in your code
  onlyResolvesLast: true
};

function AwesomeDebouncePromise(func, wait, options) {
  var finalOptions = _extends({}, DefaultOptions, options);
  var debounceCache = new DebounceCache();
  return function AwesomeDebouncePromiseWrapper() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var debouncedFn = debounceCache.getDebouncedFunction(func, wait, finalOptions, args);
    return debouncedFn.apply(undefined, args);
  };
}

exports.default = AwesomeDebouncePromise;
});

var AwesomeDebouncePromise = unwrapExports(awesomeDebouncePromise);
var awesomeDebouncePromise_1 = awesomeDebouncePromise.DebounceCache;
var awesomeDebouncePromise_2 = awesomeDebouncePromise.onlyResolvesLast;
var awesomeDebouncePromise_3 = awesomeDebouncePromise.debounce;

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
        this.handleListChange = this.handleListChange.bind(this);
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
            h("limel-chip-set", { style: style, tabindex: "0", type: "input", label: this.label, value: this.chips, disabled: this.disabled, required: this.required, onInput: this.handleTextInput, onKeyDown: this.handleKeyDown, onFocus: this.handleInputFieldFocus, onChange: this.handleChange }),
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
        return [this.createChip(listItem, 0)];
    }
    createChip(listItem, id) {
        // TODO: Add icon when supported by list component
        return {
            id: `${id}`,
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
            h("limel-list", { badgeIcons: hasIcons, onChange: this.handleListChange, selectable: true, items: this.items })));
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
     *
     * @returns {void}
     */
    async handleInputFieldFocus() {
        if (this.value && !this.multiple) {
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
            newValue = event.detail.map(chip => {
                return this.value.find((_, index) => {
                    return index === parseInt(chip.id, 10);
                });
            });
        }
        this.change.emit(newValue);
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
        }]; }
    static get style() { return ":host {\n  --mdc-theme-primary: var(--lime-primary-color, #26a69a);\n  --mdc-theme-secondary: var(--lime-secondary-color, #29b6f6);\n  --mdc-theme-on-primary: var(--lime-on-primary-color, #fff);\n  --mdc-theme-on-secondary: var(--lime-on-secondary-color, #fff); }\n\n:root {\n  --mdc-theme-primary: #26a69a;\n  --mdc-theme-secondary: #29b6f6;\n  --mdc-theme-background: #fff;\n  --mdc-theme-surface: #fff;\n  --mdc-theme-error: #b00020;\n  --mdc-theme-on-primary: #fff;\n  --mdc-theme-on-secondary: #fff;\n  --mdc-theme-on-surface: #000;\n  --mdc-theme-on-error: #fff;\n  --mdc-theme-text-primary-on-background: rgba(0, 0, 0, 0.87);\n  --mdc-theme-text-secondary-on-background: rgba(0, 0, 0, 0.54);\n  --mdc-theme-text-hint-on-background: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-disabled-on-background: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-icon-on-background: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-primary-on-light: rgba(0, 0, 0, 0.87);\n  --mdc-theme-text-secondary-on-light: rgba(0, 0, 0, 0.54);\n  --mdc-theme-text-hint-on-light: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-disabled-on-light: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-icon-on-light: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-primary-on-dark: white;\n  --mdc-theme-text-secondary-on-dark: rgba(255, 255, 255, 0.7);\n  --mdc-theme-text-hint-on-dark: rgba(255, 255, 255, 0.5);\n  --mdc-theme-text-disabled-on-dark: rgba(255, 255, 255, 0.5);\n  --mdc-theme-text-icon-on-dark: rgba(255, 255, 255, 0.5); }\n\n.mdc-theme--primary {\n  color: #26a69a !important;\n  /* \@alternate */\n  color: var(--mdc-theme-primary, #26a69a) !important; }\n\n.mdc-theme--secondary {\n  color: #29b6f6 !important;\n  /* \@alternate */\n  color: var(--mdc-theme-secondary, #29b6f6) !important; }\n\n.mdc-theme--background {\n  background-color: #fff;\n  /* \@alternate */\n  background-color: var(--mdc-theme-background, #fff); }\n\n.mdc-theme--surface {\n  background-color: #fff;\n  /* \@alternate */\n  background-color: var(--mdc-theme-surface, #fff); }\n\n.mdc-theme--error {\n  color: #b00020 !important;\n  /* \@alternate */\n  color: var(--mdc-theme-error, #b00020) !important; }\n\n.mdc-theme--on-primary {\n  color: #fff !important;\n  /* \@alternate */\n  color: var(--mdc-theme-on-primary, #fff) !important; }\n\n.mdc-theme--on-secondary {\n  color: #fff !important;\n  /* \@alternate */\n  color: var(--mdc-theme-on-secondary, #fff) !important; }\n\n.mdc-theme--on-surface {\n  color: #000 !important;\n  /* \@alternate */\n  color: var(--mdc-theme-on-surface, #000) !important; }\n\n.mdc-theme--on-error {\n  color: #fff !important;\n  /* \@alternate */\n  color: var(--mdc-theme-on-error, #fff) !important; }\n\n.mdc-theme--text-primary-on-background {\n  color: rgba(0, 0, 0, 0.87) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-primary-on-background, rgba(0, 0, 0, 0.87)) !important; }\n\n.mdc-theme--text-secondary-on-background {\n  color: rgba(0, 0, 0, 0.54) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-secondary-on-background, rgba(0, 0, 0, 0.54)) !important; }\n\n.mdc-theme--text-hint-on-background {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.38)) !important; }\n\n.mdc-theme--text-disabled-on-background {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-disabled-on-background, rgba(0, 0, 0, 0.38)) !important; }\n\n.mdc-theme--text-icon-on-background {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-icon-on-background, rgba(0, 0, 0, 0.38)) !important; }\n\n.mdc-theme--text-primary-on-light {\n  color: rgba(0, 0, 0, 0.87) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-primary-on-light, rgba(0, 0, 0, 0.87)) !important; }\n\n.mdc-theme--text-secondary-on-light {\n  color: rgba(0, 0, 0, 0.54) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-secondary-on-light, rgba(0, 0, 0, 0.54)) !important; }\n\n.mdc-theme--text-hint-on-light {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-hint-on-light, rgba(0, 0, 0, 0.38)) !important; }\n\n.mdc-theme--text-disabled-on-light {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-disabled-on-light, rgba(0, 0, 0, 0.38)) !important; }\n\n.mdc-theme--text-icon-on-light {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-icon-on-light, rgba(0, 0, 0, 0.38)) !important; }\n\n.mdc-theme--text-primary-on-dark {\n  color: white !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-primary-on-dark, white) !important; }\n\n.mdc-theme--text-secondary-on-dark {\n  color: rgba(255, 255, 255, 0.7) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-secondary-on-dark, rgba(255, 255, 255, 0.7)) !important; }\n\n.mdc-theme--text-hint-on-dark {\n  color: rgba(255, 255, 255, 0.5) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-hint-on-dark, rgba(255, 255, 255, 0.5)) !important; }\n\n.mdc-theme--text-disabled-on-dark {\n  color: rgba(255, 255, 255, 0.5) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-disabled-on-dark, rgba(255, 255, 255, 0.5)) !important; }\n\n.mdc-theme--text-icon-on-dark {\n  color: rgba(255, 255, 255, 0.5) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-icon-on-dark, rgba(255, 255, 255, 0.5)) !important; }\n\n.mdc-theme--primary-bg {\n  background-color: #26a69a !important;\n  /* \@alternate */\n  background-color: var(--mdc-theme-primary, #26a69a) !important; }\n\n.mdc-theme--secondary-bg {\n  background-color: #29b6f6 !important;\n  /* \@alternate */\n  background-color: var(--mdc-theme-secondary, #29b6f6) !important; }\n\n.mdc-typography {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased; }\n\n.mdc-typography--headline1 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1.6rem;\n  line-height: 1.4rem;\n  font-weight: 300;\n  letter-spacing: -0.01562em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--headline2 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1.6rem;\n  line-height: 1.4rem;\n  font-weight: 300;\n  letter-spacing: -0.00833em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--headline3 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1.6rem;\n  line-height: 1.4rem;\n  font-weight: 400;\n  letter-spacing: normal;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--headline4 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1.6rem;\n  line-height: 1.4rem;\n  font-weight: 400;\n  letter-spacing: 0.00735em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--headline5 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1.4rem;\n  line-height: 1.4rem;\n  font-weight: 400;\n  letter-spacing: normal;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--headline6 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1.4rem;\n  line-height: 1.4rem;\n  font-weight: 500;\n  letter-spacing: 0.0125em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--subtitle1 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1.4rem;\n  line-height: 1.8rem;\n  font-weight: 400;\n  letter-spacing: 0.00937em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--subtitle2 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1.3rem;\n  line-height: 1.8rem;\n  font-weight: 500;\n  letter-spacing: 0.00714em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--body1 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1.3rem;\n  line-height: 2.4rem;\n  font-weight: 400;\n  letter-spacing: 0.03125em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--body2 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1.3rem;\n  line-height: 2.6rem;\n  font-weight: 400;\n  letter-spacing: 0.01786em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--caption {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1.1rem;\n  line-height: 1.4rem;\n  font-weight: 400;\n  letter-spacing: 0.03333em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--button {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1.4rem;\n  line-height: 3.6rem;\n  font-weight: 500;\n  letter-spacing: 0.08929em;\n  text-decoration: none;\n  text-transform: none; }\n\n.mdc-typography--overline {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1.1rem;\n  line-height: 1.4rem;\n  font-weight: 500;\n  letter-spacing: 0.16667em;\n  text-decoration: none;\n  text-transform: uppercase; }\n\n.mdc-elevation--z0 {\n  -webkit-box-shadow: .0rem .0rem .0rem .0rem rgba(0, 0, 0, 0.2), .0rem .0rem .0rem .0rem rgba(0, 0, 0, 0.14), .0rem .0rem .0rem .0rem rgba(0, 0, 0, 0.12);\n  box-shadow: .0rem .0rem .0rem .0rem rgba(0, 0, 0, 0.2), .0rem .0rem .0rem .0rem rgba(0, 0, 0, 0.14), .0rem .0rem .0rem .0rem rgba(0, 0, 0, 0.12); }\n\n.mdc-elevation--z1 {\n  -webkit-box-shadow: .0rem .2rem .1rem -.1rem rgba(0, 0, 0, 0.2), .0rem .1rem .1rem .0rem rgba(0, 0, 0, 0.14), .0rem .1rem .3rem .0rem rgba(0, 0, 0, 0.12);\n  box-shadow: .0rem .2rem .1rem -.1rem rgba(0, 0, 0, 0.2), .0rem .1rem .1rem .0rem rgba(0, 0, 0, 0.14), .0rem .1rem .3rem .0rem rgba(0, 0, 0, 0.12); }\n\n.mdc-elevation--z2 {\n  -webkit-box-shadow: .0rem .3rem .1rem -.2rem rgba(0, 0, 0, 0.2), .0rem .2rem .2rem .0rem rgba(0, 0, 0, 0.14), .0rem .1rem .5rem .0rem rgba(0, 0, 0, 0.12);\n  box-shadow: .0rem .3rem .1rem -.2rem rgba(0, 0, 0, 0.2), .0rem .2rem .2rem .0rem rgba(0, 0, 0, 0.14), .0rem .1rem .5rem .0rem rgba(0, 0, 0, 0.12); }\n\n.mdc-elevation--z3 {\n  -webkit-box-shadow: .0rem .3rem .3rem -.2rem rgba(0, 0, 0, 0.2), .0rem .3rem .4rem .0rem rgba(0, 0, 0, 0.14), .0rem .1rem .8rem .0rem rgba(0, 0, 0, 0.12);\n  box-shadow: .0rem .3rem .3rem -.2rem rgba(0, 0, 0, 0.2), .0rem .3rem .4rem .0rem rgba(0, 0, 0, 0.14), .0rem .1rem .8rem .0rem rgba(0, 0, 0, 0.12); }\n\n.mdc-elevation--z4 {\n  -webkit-box-shadow: .0rem .2rem .4rem -.1rem rgba(0, 0, 0, 0.2), .0rem .4rem .5rem .0rem rgba(0, 0, 0, 0.14), .0rem .1rem 1.0rem .0rem rgba(0, 0, 0, 0.12);\n  box-shadow: .0rem .2rem .4rem -.1rem rgba(0, 0, 0, 0.2), .0rem .4rem .5rem .0rem rgba(0, 0, 0, 0.14), .0rem .1rem 1.0rem .0rem rgba(0, 0, 0, 0.12); }\n\n.mdc-elevation--z5 {\n  -webkit-box-shadow: .0rem .3rem .5rem -.1rem rgba(0, 0, 0, 0.2), .0rem .5rem .8rem .0rem rgba(0, 0, 0, 0.14), .0rem .1rem 1.4rem .0rem rgba(0, 0, 0, 0.12);\n  box-shadow: .0rem .3rem .5rem -.1rem rgba(0, 0, 0, 0.2), .0rem .5rem .8rem .0rem rgba(0, 0, 0, 0.14), .0rem .1rem 1.4rem .0rem rgba(0, 0, 0, 0.12); }\n\n.mdc-elevation--z6 {\n  -webkit-box-shadow: .0rem .3rem .5rem -.1rem rgba(0, 0, 0, 0.2), .0rem .6rem 1.0rem .0rem rgba(0, 0, 0, 0.14), .0rem .1rem 1.8rem .0rem rgba(0, 0, 0, 0.12);\n  box-shadow: .0rem .3rem .5rem -.1rem rgba(0, 0, 0, 0.2), .0rem .6rem 1.0rem .0rem rgba(0, 0, 0, 0.14), .0rem .1rem 1.8rem .0rem rgba(0, 0, 0, 0.12); }\n\n.mdc-elevation--z7 {\n  -webkit-box-shadow: .0rem .4rem .5rem -.2rem rgba(0, 0, 0, 0.2), .0rem .7rem 1.0rem .1rem rgba(0, 0, 0, 0.14), .0rem .2rem 1.6rem .1rem rgba(0, 0, 0, 0.12);\n  box-shadow: .0rem .4rem .5rem -.2rem rgba(0, 0, 0, 0.2), .0rem .7rem 1.0rem .1rem rgba(0, 0, 0, 0.14), .0rem .2rem 1.6rem .1rem rgba(0, 0, 0, 0.12); }\n\n.mdc-elevation--z8 {\n  -webkit-box-shadow: .0rem .5rem .5rem -.3rem rgba(0, 0, 0, 0.2), .0rem .8rem 1.0rem .1rem rgba(0, 0, 0, 0.14), .0rem .3rem 1.4rem .2rem rgba(0, 0, 0, 0.12);\n  box-shadow: .0rem .5rem .5rem -.3rem rgba(0, 0, 0, 0.2), .0rem .8rem 1.0rem .1rem rgba(0, 0, 0, 0.14), .0rem .3rem 1.4rem .2rem rgba(0, 0, 0, 0.12); }\n\n.mdc-elevation--z9 {\n  -webkit-box-shadow: .0rem .5rem .6rem -.3rem rgba(0, 0, 0, 0.2), .0rem .9rem 1.2rem .1rem rgba(0, 0, 0, 0.14), .0rem .3rem 1.6rem .2rem rgba(0, 0, 0, 0.12);\n  box-shadow: .0rem .5rem .6rem -.3rem rgba(0, 0, 0, 0.2), .0rem .9rem 1.2rem .1rem rgba(0, 0, 0, 0.14), .0rem .3rem 1.6rem .2rem rgba(0, 0, 0, 0.12); }\n\n.mdc-elevation--z10 {\n  -webkit-box-shadow: .0rem .6rem .6rem -.3rem rgba(0, 0, 0, 0.2), .0rem 1.0rem 1.4rem .1rem rgba(0, 0, 0, 0.14), .0rem .4rem 1.8rem .3rem rgba(0, 0, 0, 0.12);\n  box-shadow: .0rem .6rem .6rem -.3rem rgba(0, 0, 0, 0.2), .0rem 1.0rem 1.4rem .1rem rgba(0, 0, 0, 0.14), .0rem .4rem 1.8rem .3rem rgba(0, 0, 0, 0.12); }\n\n.mdc-elevation--z11 {\n  -webkit-box-shadow: .0rem .6rem .7rem -.4rem rgba(0, 0, 0, 0.2), .0rem 1.1rem 1.5rem .1rem rgba(0, 0, 0, 0.14), .0rem .4rem 2.0rem .3rem rgba(0, 0, 0, 0.12);\n  box-shadow: .0rem .6rem .7rem -.4rem rgba(0, 0, 0, 0.2), .0rem 1.1rem 1.5rem .1rem rgba(0, 0, 0, 0.14), .0rem .4rem 2.0rem .3rem rgba(0, 0, 0, 0.12); }\n\n.mdc-elevation--z12 {\n  -webkit-box-shadow: .0rem .7rem .8rem -.4rem rgba(0, 0, 0, 0.2), .0rem 1.2rem 1.7rem .2rem rgba(0, 0, 0, 0.14), .0rem .5rem 2.2rem .4rem rgba(0, 0, 0, 0.12);\n  box-shadow: .0rem .7rem .8rem -.4rem rgba(0, 0, 0, 0.2), .0rem 1.2rem 1.7rem .2rem rgba(0, 0, 0, 0.14), .0rem .5rem 2.2rem .4rem rgba(0, 0, 0, 0.12); }\n\n.mdc-elevation--z13 {\n  -webkit-box-shadow: .0rem .7rem .8rem -.4rem rgba(0, 0, 0, 0.2), .0rem 1.3rem 1.9rem .2rem rgba(0, 0, 0, 0.14), .0rem .5rem 2.4rem .4rem rgba(0, 0, 0, 0.12);\n  box-shadow: .0rem .7rem .8rem -.4rem rgba(0, 0, 0, 0.2), .0rem 1.3rem 1.9rem .2rem rgba(0, 0, 0, 0.14), .0rem .5rem 2.4rem .4rem rgba(0, 0, 0, 0.12); }\n\n.mdc-elevation--z14 {\n  -webkit-box-shadow: .0rem .7rem .9rem -.4rem rgba(0, 0, 0, 0.2), .0rem 1.4rem 2.1rem .2rem rgba(0, 0, 0, 0.14), .0rem .5rem 2.6rem .4rem rgba(0, 0, 0, 0.12);\n  box-shadow: .0rem .7rem .9rem -.4rem rgba(0, 0, 0, 0.2), .0rem 1.4rem 2.1rem .2rem rgba(0, 0, 0, 0.14), .0rem .5rem 2.6rem .4rem rgba(0, 0, 0, 0.12); }\n\n.mdc-elevation--z15 {\n  -webkit-box-shadow: .0rem .8rem .9rem -.5rem rgba(0, 0, 0, 0.2), .0rem 1.5rem 2.2rem .2rem rgba(0, 0, 0, 0.14), .0rem .6rem 2.8rem .5rem rgba(0, 0, 0, 0.12);\n  box-shadow: .0rem .8rem .9rem -.5rem rgba(0, 0, 0, 0.2), .0rem 1.5rem 2.2rem .2rem rgba(0, 0, 0, 0.14), .0rem .6rem 2.8rem .5rem rgba(0, 0, 0, 0.12); }\n\n.mdc-elevation--z16 {\n  -webkit-box-shadow: .0rem .8rem 1.0rem -.5rem rgba(0, 0, 0, 0.2), .0rem 1.6rem 2.4rem .2rem rgba(0, 0, 0, 0.14), .0rem .6rem 3.0rem .5rem rgba(0, 0, 0, 0.12);\n  box-shadow: .0rem .8rem 1.0rem -.5rem rgba(0, 0, 0, 0.2), .0rem 1.6rem 2.4rem .2rem rgba(0, 0, 0, 0.14), .0rem .6rem 3.0rem .5rem rgba(0, 0, 0, 0.12); }\n\n.mdc-elevation--z17 {\n  -webkit-box-shadow: .0rem .8rem 1.1rem -.5rem rgba(0, 0, 0, 0.2), .0rem 1.7rem 2.6rem .2rem rgba(0, 0, 0, 0.14), .0rem .6rem 3.2rem .5rem rgba(0, 0, 0, 0.12);\n  box-shadow: .0rem .8rem 1.1rem -.5rem rgba(0, 0, 0, 0.2), .0rem 1.7rem 2.6rem .2rem rgba(0, 0, 0, 0.14), .0rem .6rem 3.2rem .5rem rgba(0, 0, 0, 0.12); }\n\n.mdc-elevation--z18 {\n  -webkit-box-shadow: .0rem .9rem 1.1rem -.5rem rgba(0, 0, 0, 0.2), .0rem 1.8rem 2.8rem .2rem rgba(0, 0, 0, 0.14), .0rem .7rem 3.4rem .6rem rgba(0, 0, 0, 0.12);\n  box-shadow: .0rem .9rem 1.1rem -.5rem rgba(0, 0, 0, 0.2), .0rem 1.8rem 2.8rem .2rem rgba(0, 0, 0, 0.14), .0rem .7rem 3.4rem .6rem rgba(0, 0, 0, 0.12); }\n\n.mdc-elevation--z19 {\n  -webkit-box-shadow: .0rem .9rem 1.2rem -.6rem rgba(0, 0, 0, 0.2), .0rem 1.9rem 2.9rem .2rem rgba(0, 0, 0, 0.14), .0rem .7rem 3.6rem .6rem rgba(0, 0, 0, 0.12);\n  box-shadow: .0rem .9rem 1.2rem -.6rem rgba(0, 0, 0, 0.2), .0rem 1.9rem 2.9rem .2rem rgba(0, 0, 0, 0.14), .0rem .7rem 3.6rem .6rem rgba(0, 0, 0, 0.12); }\n\n.mdc-elevation--z20 {\n  -webkit-box-shadow: .0rem 1.0rem 1.3rem -.6rem rgba(0, 0, 0, 0.2), .0rem 2.0rem 3.1rem .3rem rgba(0, 0, 0, 0.14), .0rem .8rem 3.8rem .7rem rgba(0, 0, 0, 0.12);\n  box-shadow: .0rem 1.0rem 1.3rem -.6rem rgba(0, 0, 0, 0.2), .0rem 2.0rem 3.1rem .3rem rgba(0, 0, 0, 0.14), .0rem .8rem 3.8rem .7rem rgba(0, 0, 0, 0.12); }\n\n.mdc-elevation--z21 {\n  -webkit-box-shadow: .0rem 1.0rem 1.3rem -.6rem rgba(0, 0, 0, 0.2), .0rem 2.1rem 3.3rem .3rem rgba(0, 0, 0, 0.14), .0rem .8rem 4.0rem .7rem rgba(0, 0, 0, 0.12);\n  box-shadow: .0rem 1.0rem 1.3rem -.6rem rgba(0, 0, 0, 0.2), .0rem 2.1rem 3.3rem .3rem rgba(0, 0, 0, 0.14), .0rem .8rem 4.0rem .7rem rgba(0, 0, 0, 0.12); }\n\n.mdc-elevation--z22 {\n  -webkit-box-shadow: .0rem 1.0rem 1.4rem -.6rem rgba(0, 0, 0, 0.2), .0rem 2.2rem 3.5rem .3rem rgba(0, 0, 0, 0.14), .0rem .8rem 4.2rem .7rem rgba(0, 0, 0, 0.12);\n  box-shadow: .0rem 1.0rem 1.4rem -.6rem rgba(0, 0, 0, 0.2), .0rem 2.2rem 3.5rem .3rem rgba(0, 0, 0, 0.14), .0rem .8rem 4.2rem .7rem rgba(0, 0, 0, 0.12); }\n\n.mdc-elevation--z23 {\n  -webkit-box-shadow: .0rem 1.1rem 1.4rem -.7rem rgba(0, 0, 0, 0.2), .0rem 2.3rem 3.6rem .3rem rgba(0, 0, 0, 0.14), .0rem .9rem 4.4rem .8rem rgba(0, 0, 0, 0.12);\n  box-shadow: .0rem 1.1rem 1.4rem -.7rem rgba(0, 0, 0, 0.2), .0rem 2.3rem 3.6rem .3rem rgba(0, 0, 0, 0.14), .0rem .9rem 4.4rem .8rem rgba(0, 0, 0, 0.12); }\n\n.mdc-elevation--z24 {\n  -webkit-box-shadow: .0rem 1.1rem 1.5rem -.7rem rgba(0, 0, 0, 0.2), .0rem 2.4rem 3.8rem .3rem rgba(0, 0, 0, 0.14), .0rem .9rem 4.6rem .8rem rgba(0, 0, 0, 0.12);\n  box-shadow: .0rem 1.1rem 1.5rem -.7rem rgba(0, 0, 0, 0.2), .0rem 2.4rem 3.8rem .3rem rgba(0, 0, 0, 0.14), .0rem .9rem 4.6rem .8rem rgba(0, 0, 0, 0.12); }\n\n.mdc-elevation-transition {\n  -webkit-transition: -webkit-box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: -webkit-box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1), -webkit-box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);\n  will-change: box-shadow; }\n\n.mdc-menu-surface {\n  -webkit-box-shadow: .0rem .5rem .5rem -.3rem rgba(0, 0, 0, 0.2), .0rem .8rem 1.0rem .1rem rgba(0, 0, 0, 0.14), .0rem .3rem 1.4rem .2rem rgba(0, 0, 0, 0.12);\n  box-shadow: .0rem .5rem .5rem -.3rem rgba(0, 0, 0, 0.2), .0rem .8rem 1.0rem .1rem rgba(0, 0, 0, 0.14), .0rem .3rem 1.4rem .2rem rgba(0, 0, 0, 0.12);\n  background-color: #fff;\n  /* \@alternate */\n  background-color: var(--mdc-theme-surface, #fff);\n  color: #000;\n  /* \@alternate */\n  color: var(--mdc-theme-on-surface, #000);\n  /* \@noflip */\n  transform-origin-left: top left;\n  /* \@noflip */\n  transform-origin-right: top right;\n  border-radius: 0.4rem;\n  display: none;\n  position: absolute;\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box;\n  max-width: calc(100vw - 3.2rem);\n  max-height: calc(100vh - 3.2rem);\n  margin: 0;\n  padding: 0;\n  -webkit-transform: scale(1);\n  transform: scale(1);\n  -webkit-transform-origin: top left;\n  transform-origin: top left;\n  opacity: 0;\n  overflow: auto;\n  will-change: transform, opacity;\n  z-index: 8; }\n  [dir=\"rtl\"] .mdc-menu-surface, .mdc-menu-surface[dir=\"rtl\"] {\n    /* \@noflip */\n    transform-origin-left: top right;\n    /* \@noflip */\n    transform-origin-right: top left; }\n  .mdc-menu-surface:focus {\n    outline: none; }\n  .mdc-menu-surface--animating-open {\n    display: inline-block;\n    -webkit-transform: scale(0.8);\n    transform: scale(0.8);\n    -webkit-transition: opacity 0.03s linear, -webkit-transform 0.12s cubic-bezier(0, 0, 0.2, 1);\n    transition: opacity 0.03s linear, -webkit-transform 0.12s cubic-bezier(0, 0, 0.2, 1);\n    transition: opacity 0.03s linear, transform 0.12s cubic-bezier(0, 0, 0.2, 1);\n    transition: opacity 0.03s linear, transform 0.12s cubic-bezier(0, 0, 0.2, 1), -webkit-transform 0.12s cubic-bezier(0, 0, 0.2, 1);\n    opacity: 0; }\n  .mdc-menu-surface--open {\n    display: inline-block;\n    -webkit-transform: scale(1);\n    transform: scale(1);\n    opacity: 1; }\n  .mdc-menu-surface--animating-closed {\n    display: inline-block;\n    -webkit-transition: opacity 0.075s linear;\n    transition: opacity 0.075s linear;\n    opacity: 0; }\n\n.mdc-menu-surface--anchor {\n  position: relative;\n  overflow: visible; }\n\n.mdc-menu-surface--fixed {\n  position: fixed; }\n\n:host {\n  position: relative; }\n\n.dropdown--spinner {\n  text-align: center; }\n  .dropdown--spinner limel-spinner {\n    margin: 1rem 0;\n    color: var(--lime-primary-color, #26a69a); }\n\n.dropdown--spinner,\n.dropdown--list {\n  background-color: white;\n  position: absolute;\n  margin-top: -.8rem;\n  max-height: 25rem;\n  overflow-y: auto; }"; }
}

export { Picker as LimelPicker };
