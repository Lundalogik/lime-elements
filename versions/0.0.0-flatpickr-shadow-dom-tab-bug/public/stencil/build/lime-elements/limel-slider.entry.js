const h = window.LimeElements.h;

import { a as __extends, b as __assign } from './chunk-2005b219.js';
import { a as MDCFoundation, b as MDCComponent } from './chunk-21be808b.js';
import { b as getCorrectPropertyName, a as getCorrectEventName } from './chunk-bb8fcad1.js';

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
var cssClasses = {
    ACTIVE: 'mdc-slider--active',
    DISABLED: 'mdc-slider--disabled',
    DISCRETE: 'mdc-slider--discrete',
    FOCUS: 'mdc-slider--focus',
    HAS_TRACK_MARKER: 'mdc-slider--display-markers',
    IN_TRANSIT: 'mdc-slider--in-transit',
    IS_DISCRETE: 'mdc-slider--discrete',
};
var strings = {
    ARIA_DISABLED: 'aria-disabled',
    ARIA_VALUEMAX: 'aria-valuemax',
    ARIA_VALUEMIN: 'aria-valuemin',
    ARIA_VALUENOW: 'aria-valuenow',
    CHANGE_EVENT: 'MDCSlider:change',
    INPUT_EVENT: 'MDCSlider:input',
    LAST_TRACK_MARKER_SELECTOR: '.mdc-slider__track-marker:last-child',
    PIN_VALUE_MARKER_SELECTOR: '.mdc-slider__pin-value-marker',
    STEP_DATA_ATTR: 'data-step',
    THUMB_CONTAINER_SELECTOR: '.mdc-slider__thumb-container',
    TRACK_MARKER_CONTAINER_SELECTOR: '.mdc-slider__track-marker-container',
    TRACK_SELECTOR: '.mdc-slider__track',
};
var numbers = {
    PAGE_FACTOR: 4,
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
var DOWN_EVENTS = ['mousedown', 'pointerdown', 'touchstart'];
var UP_EVENTS = ['mouseup', 'pointerup', 'touchend'];
var MOVE_EVENT_MAP = {
    mousedown: 'mousemove',
    pointerdown: 'pointermove',
    touchstart: 'touchmove',
};
var KEY_IDS = {
    ARROW_DOWN: 'ArrowDown',
    ARROW_LEFT: 'ArrowLeft',
    ARROW_RIGHT: 'ArrowRight',
    ARROW_UP: 'ArrowUp',
    END: 'End',
    HOME: 'Home',
    PAGE_DOWN: 'PageDown',
    PAGE_UP: 'PageUp',
};
var MDCSliderFoundation = /** @class */ (function (_super) {
    __extends(MDCSliderFoundation, _super);
    function MDCSliderFoundation(adapter) {
        var _this = _super.call(this, __assign({}, MDCSliderFoundation.defaultAdapter, adapter)) || this;
        /**
         * We set this to NaN since we want it to be a number, but we can't use '0' or '-1'
         * because those could be valid tabindices set by the client code.
         */
        _this.savedTabIndex_ = NaN;
        _this.active_ = false;
        _this.inTransit_ = false;
        _this.isDiscrete_ = false;
        _this.hasTrackMarker_ = false;
        _this.handlingThumbTargetEvt_ = false;
        _this.min_ = 0;
        _this.max_ = 100;
        _this.step_ = 0;
        _this.value_ = 0;
        _this.disabled_ = false;
        _this.preventFocusState_ = false;
        _this.thumbContainerPointerHandler_ = function () { return _this.handlingThumbTargetEvt_ = true; };
        _this.interactionStartHandler_ = function (evt) { return _this.handleDown_(evt); };
        _this.keydownHandler_ = function (evt) { return _this.handleKeydown_(evt); };
        _this.focusHandler_ = function () { return _this.handleFocus_(); };
        _this.blurHandler_ = function () { return _this.handleBlur_(); };
        _this.resizeHandler_ = function () { return _this.layout(); };
        return _this;
    }
    Object.defineProperty(MDCSliderFoundation, "cssClasses", {
        get: function () {
            return cssClasses;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCSliderFoundation, "strings", {
        get: function () {
            return strings;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCSliderFoundation, "numbers", {
        get: function () {
            return numbers;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCSliderFoundation, "defaultAdapter", {
        get: function () {
            // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
            return {
                hasClass: function () { return false; },
                addClass: function () { return undefined; },
                removeClass: function () { return undefined; },
                getAttribute: function () { return null; },
                setAttribute: function () { return undefined; },
                removeAttribute: function () { return undefined; },
                computeBoundingRect: function () { return ({ top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 }); },
                getTabIndex: function () { return 0; },
                registerInteractionHandler: function () { return undefined; },
                deregisterInteractionHandler: function () { return undefined; },
                registerThumbContainerInteractionHandler: function () { return undefined; },
                deregisterThumbContainerInteractionHandler: function () { return undefined; },
                registerBodyInteractionHandler: function () { return undefined; },
                deregisterBodyInteractionHandler: function () { return undefined; },
                registerResizeHandler: function () { return undefined; },
                deregisterResizeHandler: function () { return undefined; },
                notifyInput: function () { return undefined; },
                notifyChange: function () { return undefined; },
                setThumbContainerStyleProperty: function () { return undefined; },
                setTrackStyleProperty: function () { return undefined; },
                setMarkerValue: function () { return undefined; },
                appendTrackMarkers: function () { return undefined; },
                removeTrackMarkers: function () { return undefined; },
                setLastTrackMarkersStyleProperty: function () { return undefined; },
                isRTL: function () { return false; },
            };
            // tslint:enable:object-literal-sort-keys
        },
        enumerable: true,
        configurable: true
    });
    MDCSliderFoundation.prototype.init = function () {
        var _this = this;
        this.isDiscrete_ = this.adapter_.hasClass(cssClasses.IS_DISCRETE);
        this.hasTrackMarker_ = this.adapter_.hasClass(cssClasses.HAS_TRACK_MARKER);
        DOWN_EVENTS.forEach(function (evtName) {
            _this.adapter_.registerInteractionHandler(evtName, _this.interactionStartHandler_);
            _this.adapter_.registerThumbContainerInteractionHandler(evtName, _this.thumbContainerPointerHandler_);
        });
        this.adapter_.registerInteractionHandler('keydown', this.keydownHandler_);
        this.adapter_.registerInteractionHandler('focus', this.focusHandler_);
        this.adapter_.registerInteractionHandler('blur', this.blurHandler_);
        this.adapter_.registerResizeHandler(this.resizeHandler_);
        this.layout();
        // At last step, provide a reasonable default value to discrete slider
        if (this.isDiscrete_ && this.getStep() === 0) {
            this.step_ = 1;
        }
    };
    MDCSliderFoundation.prototype.destroy = function () {
        var _this = this;
        DOWN_EVENTS.forEach(function (evtName) {
            _this.adapter_.deregisterInteractionHandler(evtName, _this.interactionStartHandler_);
            _this.adapter_.deregisterThumbContainerInteractionHandler(evtName, _this.thumbContainerPointerHandler_);
        });
        this.adapter_.deregisterInteractionHandler('keydown', this.keydownHandler_);
        this.adapter_.deregisterInteractionHandler('focus', this.focusHandler_);
        this.adapter_.deregisterInteractionHandler('blur', this.blurHandler_);
        this.adapter_.deregisterResizeHandler(this.resizeHandler_);
    };
    MDCSliderFoundation.prototype.setupTrackMarker = function () {
        if (this.isDiscrete_ && this.hasTrackMarker_ && this.getStep() !== 0) {
            var min = this.getMin();
            var max = this.getMax();
            var step = this.getStep();
            var numMarkers = (max - min) / step;
            // In case distance between max & min is indivisible to step,
            // we place the secondary to last marker proportionally at where thumb
            // could reach and place the last marker at max value
            var indivisible = Math.ceil(numMarkers) !== numMarkers;
            if (indivisible) {
                numMarkers = Math.ceil(numMarkers);
            }
            this.adapter_.removeTrackMarkers();
            this.adapter_.appendTrackMarkers(numMarkers);
            if (indivisible) {
                var lastStepRatio = (max - numMarkers * step) / step + 1;
                this.adapter_.setLastTrackMarkersStyleProperty('flex-grow', String(lastStepRatio));
            }
        }
    };
    MDCSliderFoundation.prototype.layout = function () {
        this.rect_ = this.adapter_.computeBoundingRect();
        this.updateUIForCurrentValue_();
    };
    MDCSliderFoundation.prototype.getValue = function () {
        return this.value_;
    };
    MDCSliderFoundation.prototype.setValue = function (value) {
        this.setValue_(value, false);
    };
    MDCSliderFoundation.prototype.getMax = function () {
        return this.max_;
    };
    MDCSliderFoundation.prototype.setMax = function (max) {
        if (max < this.min_) {
            throw new Error('Cannot set max to be less than the slider\'s minimum value');
        }
        this.max_ = max;
        this.setValue_(this.value_, false, true);
        this.adapter_.setAttribute(strings.ARIA_VALUEMAX, String(this.max_));
        this.setupTrackMarker();
    };
    MDCSliderFoundation.prototype.getMin = function () {
        return this.min_;
    };
    MDCSliderFoundation.prototype.setMin = function (min) {
        if (min > this.max_) {
            throw new Error('Cannot set min to be greater than the slider\'s maximum value');
        }
        this.min_ = min;
        this.setValue_(this.value_, false, true);
        this.adapter_.setAttribute(strings.ARIA_VALUEMIN, String(this.min_));
        this.setupTrackMarker();
    };
    MDCSliderFoundation.prototype.getStep = function () {
        return this.step_;
    };
    MDCSliderFoundation.prototype.setStep = function (step) {
        if (step < 0) {
            throw new Error('Step cannot be set to a negative number');
        }
        if (this.isDiscrete_ && (typeof (step) !== 'number' || step < 1)) {
            step = 1;
        }
        this.step_ = step;
        this.setValue_(this.value_, false, true);
        this.setupTrackMarker();
    };
    MDCSliderFoundation.prototype.isDisabled = function () {
        return this.disabled_;
    };
    MDCSliderFoundation.prototype.setDisabled = function (disabled) {
        this.disabled_ = disabled;
        this.toggleClass_(cssClasses.DISABLED, this.disabled_);
        if (this.disabled_) {
            this.savedTabIndex_ = this.adapter_.getTabIndex();
            this.adapter_.setAttribute(strings.ARIA_DISABLED, 'true');
            this.adapter_.removeAttribute('tabindex');
        }
        else {
            this.adapter_.removeAttribute(strings.ARIA_DISABLED);
            if (!isNaN(this.savedTabIndex_)) {
                this.adapter_.setAttribute('tabindex', String(this.savedTabIndex_));
            }
        }
    };
    /**
     * Called when the user starts interacting with the slider
     */
    MDCSliderFoundation.prototype.handleDown_ = function (downEvent) {
        var _this = this;
        if (this.disabled_) {
            return;
        }
        this.preventFocusState_ = true;
        this.setInTransit_(!this.handlingThumbTargetEvt_);
        this.handlingThumbTargetEvt_ = false;
        this.setActive_(true);
        var moveHandler = function (moveEvent) {
            _this.handleMove_(moveEvent);
        };
        var moveEventType = MOVE_EVENT_MAP[downEvent.type];
        // Note: upHandler is [de]registered on ALL potential pointer-related release event types, since some browsers
        // do not always fire these consistently in pairs.
        // (See https://github.com/material-components/material-components-web/issues/1192)
        var upHandler = function () {
            _this.handleUp_();
            _this.adapter_.deregisterBodyInteractionHandler(moveEventType, moveHandler);
            UP_EVENTS.forEach(function (evtName) { return _this.adapter_.deregisterBodyInteractionHandler(evtName, upHandler); });
        };
        this.adapter_.registerBodyInteractionHandler(moveEventType, moveHandler);
        UP_EVENTS.forEach(function (evtName) { return _this.adapter_.registerBodyInteractionHandler(evtName, upHandler); });
        this.setValueFromEvt_(downEvent);
    };
    /**
     * Called when the user moves the slider
     */
    MDCSliderFoundation.prototype.handleMove_ = function (evt) {
        evt.preventDefault();
        this.setValueFromEvt_(evt);
    };
    /**
     * Called when the user's interaction with the slider ends
     */
    MDCSliderFoundation.prototype.handleUp_ = function () {
        this.setActive_(false);
        this.adapter_.notifyChange();
    };
    /**
     * Returns the pageX of the event
     */
    MDCSliderFoundation.prototype.getPageX_ = function (evt) {
        if (evt.targetTouches && evt.targetTouches.length > 0) {
            return evt.targetTouches[0].pageX;
        }
        return evt.pageX;
    };
    /**
     * Sets the slider value from an event
     */
    MDCSliderFoundation.prototype.setValueFromEvt_ = function (evt) {
        var pageX = this.getPageX_(evt);
        var value = this.computeValueFromPageX_(pageX);
        this.setValue_(value, true);
    };
    /**
     * Computes the new value from the pageX position
     */
    MDCSliderFoundation.prototype.computeValueFromPageX_ = function (pageX) {
        var _a = this, max = _a.max_, min = _a.min_;
        var xPos = pageX - this.rect_.left;
        var pctComplete = xPos / this.rect_.width;
        if (this.adapter_.isRTL()) {
            pctComplete = 1 - pctComplete;
        }
        // Fit the percentage complete between the range [min,max]
        // by remapping from [0, 1] to [min, min+(max-min)].
        return min + pctComplete * (max - min);
    };
    /**
     * Handles keydown events
     */
    MDCSliderFoundation.prototype.handleKeydown_ = function (evt) {
        var keyId = this.getKeyId_(evt);
        var value = this.getValueForKeyId_(keyId);
        if (isNaN(value)) {
            return;
        }
        // Prevent page from scrolling due to key presses that would normally scroll the page
        evt.preventDefault();
        this.adapter_.addClass(cssClasses.FOCUS);
        this.setValue_(value, true);
        this.adapter_.notifyChange();
    };
    /**
     * Returns the computed name of the event
     */
    MDCSliderFoundation.prototype.getKeyId_ = function (kbdEvt) {
        if (kbdEvt.key === KEY_IDS.ARROW_LEFT || kbdEvt.keyCode === 37) {
            return KEY_IDS.ARROW_LEFT;
        }
        if (kbdEvt.key === KEY_IDS.ARROW_RIGHT || kbdEvt.keyCode === 39) {
            return KEY_IDS.ARROW_RIGHT;
        }
        if (kbdEvt.key === KEY_IDS.ARROW_UP || kbdEvt.keyCode === 38) {
            return KEY_IDS.ARROW_UP;
        }
        if (kbdEvt.key === KEY_IDS.ARROW_DOWN || kbdEvt.keyCode === 40) {
            return KEY_IDS.ARROW_DOWN;
        }
        if (kbdEvt.key === KEY_IDS.HOME || kbdEvt.keyCode === 36) {
            return KEY_IDS.HOME;
        }
        if (kbdEvt.key === KEY_IDS.END || kbdEvt.keyCode === 35) {
            return KEY_IDS.END;
        }
        if (kbdEvt.key === KEY_IDS.PAGE_UP || kbdEvt.keyCode === 33) {
            return KEY_IDS.PAGE_UP;
        }
        if (kbdEvt.key === KEY_IDS.PAGE_DOWN || kbdEvt.keyCode === 34) {
            return KEY_IDS.PAGE_DOWN;
        }
        return '';
    };
    /**
     * Computes the value given a keyboard key ID
     */
    MDCSliderFoundation.prototype.getValueForKeyId_ = function (keyId) {
        var _a = this, max = _a.max_, min = _a.min_, step = _a.step_;
        var delta = step || (max - min) / 100;
        var valueNeedsToBeFlipped = this.adapter_.isRTL() && (keyId === KEY_IDS.ARROW_LEFT || keyId === KEY_IDS.ARROW_RIGHT);
        if (valueNeedsToBeFlipped) {
            delta = -delta;
        }
        switch (keyId) {
            case KEY_IDS.ARROW_LEFT:
            case KEY_IDS.ARROW_DOWN:
                return this.value_ - delta;
            case KEY_IDS.ARROW_RIGHT:
            case KEY_IDS.ARROW_UP:
                return this.value_ + delta;
            case KEY_IDS.HOME:
                return this.min_;
            case KEY_IDS.END:
                return this.max_;
            case KEY_IDS.PAGE_UP:
                return this.value_ + delta * numbers.PAGE_FACTOR;
            case KEY_IDS.PAGE_DOWN:
                return this.value_ - delta * numbers.PAGE_FACTOR;
            default:
                return NaN;
        }
    };
    MDCSliderFoundation.prototype.handleFocus_ = function () {
        if (this.preventFocusState_) {
            return;
        }
        this.adapter_.addClass(cssClasses.FOCUS);
    };
    MDCSliderFoundation.prototype.handleBlur_ = function () {
        this.preventFocusState_ = false;
        this.adapter_.removeClass(cssClasses.FOCUS);
    };
    /**
     * Sets the value of the slider
     */
    MDCSliderFoundation.prototype.setValue_ = function (value, shouldFireInput, force) {
        if (force === void 0) { force = false; }
        if (value === this.value_ && !force) {
            return;
        }
        var _a = this, min = _a.min_, max = _a.max_;
        var valueSetToBoundary = value === min || value === max;
        if (this.step_ && !valueSetToBoundary) {
            value = this.quantize_(value);
        }
        if (value < min) {
            value = min;
        }
        else if (value > max) {
            value = max;
        }
        this.value_ = value;
        this.adapter_.setAttribute(strings.ARIA_VALUENOW, String(this.value_));
        this.updateUIForCurrentValue_();
        if (shouldFireInput) {
            this.adapter_.notifyInput();
            if (this.isDiscrete_) {
                this.adapter_.setMarkerValue(value);
            }
        }
    };
    /**
     * Calculates the quantized value
     */
    MDCSliderFoundation.prototype.quantize_ = function (value) {
        var numSteps = Math.round(value / this.step_);
        return numSteps * this.step_;
    };
    MDCSliderFoundation.prototype.updateUIForCurrentValue_ = function () {
        var _this = this;
        var _a = this, max = _a.max_, min = _a.min_, value = _a.value_;
        var pctComplete = (value - min) / (max - min);
        var translatePx = pctComplete * this.rect_.width;
        if (this.adapter_.isRTL()) {
            translatePx = this.rect_.width - translatePx;
        }
        var transformProp = getCorrectPropertyName(window, 'transform');
        var transitionendEvtName = getCorrectEventName(window, 'transitionend');
        if (this.inTransit_) {
            var onTransitionEnd_1 = function () {
                _this.setInTransit_(false);
                _this.adapter_.deregisterThumbContainerInteractionHandler(transitionendEvtName, onTransitionEnd_1);
            };
            this.adapter_.registerThumbContainerInteractionHandler(transitionendEvtName, onTransitionEnd_1);
        }
        requestAnimationFrame(function () {
            // NOTE(traviskaufman): It would be nice to use calc() here,
            // but IE cannot handle calcs in transforms correctly.
            // See: https://goo.gl/NC2itk
            // Also note that the -50% offset is used to center the slider thumb.
            _this.adapter_.setThumbContainerStyleProperty(transformProp, "translateX(" + translatePx + "px) translateX(-50%)");
            _this.adapter_.setTrackStyleProperty(transformProp, "scaleX(" + pctComplete + ")");
        });
    };
    /**
     * Toggles the active state of the slider
     */
    MDCSliderFoundation.prototype.setActive_ = function (active) {
        this.active_ = active;
        this.toggleClass_(cssClasses.ACTIVE, this.active_);
    };
    /**
     * Toggles the inTransit state of the slider
     */
    MDCSliderFoundation.prototype.setInTransit_ = function (inTransit) {
        this.inTransit_ = inTransit;
        this.toggleClass_(cssClasses.IN_TRANSIT, this.inTransit_);
    };
    /**
     * Conditionally adds or removes a class based on shouldBePresent
     */
    MDCSliderFoundation.prototype.toggleClass_ = function (className, shouldBePresent) {
        if (shouldBePresent) {
            this.adapter_.addClass(className);
        }
        else {
            this.adapter_.removeClass(className);
        }
    };
    return MDCSliderFoundation;
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
var MDCSlider = /** @class */ (function (_super) {
    __extends(MDCSlider, _super);
    function MDCSlider() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MDCSlider.attachTo = function (root) {
        return new MDCSlider(root);
    };
    Object.defineProperty(MDCSlider.prototype, "value", {
        get: function () {
            return this.foundation_.getValue();
        },
        set: function (value) {
            this.foundation_.setValue(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCSlider.prototype, "min", {
        get: function () {
            return this.foundation_.getMin();
        },
        set: function (min) {
            this.foundation_.setMin(min);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCSlider.prototype, "max", {
        get: function () {
            return this.foundation_.getMax();
        },
        set: function (max) {
            this.foundation_.setMax(max);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCSlider.prototype, "step", {
        get: function () {
            return this.foundation_.getStep();
        },
        set: function (step) {
            this.foundation_.setStep(step);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCSlider.prototype, "disabled", {
        get: function () {
            return this.foundation_.isDisabled();
        },
        set: function (disabled) {
            this.foundation_.setDisabled(disabled);
        },
        enumerable: true,
        configurable: true
    });
    MDCSlider.prototype.initialize = function () {
        this.thumbContainer_ = this.root_.querySelector(strings.THUMB_CONTAINER_SELECTOR);
        this.track_ = this.root_.querySelector(strings.TRACK_SELECTOR);
        this.pinValueMarker_ = this.root_.querySelector(strings.PIN_VALUE_MARKER_SELECTOR);
        this.trackMarkerContainer_ = this.root_.querySelector(strings.TRACK_MARKER_CONTAINER_SELECTOR);
    };
    MDCSlider.prototype.getDefaultFoundation = function () {
        var _this = this;
        // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
        // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
        // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
        var adapter = {
            hasClass: function (className) { return _this.root_.classList.contains(className); },
            addClass: function (className) { return _this.root_.classList.add(className); },
            removeClass: function (className) { return _this.root_.classList.remove(className); },
            getAttribute: function (name) { return _this.root_.getAttribute(name); },
            setAttribute: function (name, value) { return _this.root_.setAttribute(name, value); },
            removeAttribute: function (name) { return _this.root_.removeAttribute(name); },
            computeBoundingRect: function () { return _this.root_.getBoundingClientRect(); },
            getTabIndex: function () { return _this.root_.tabIndex; },
            registerInteractionHandler: function (evtType, handler) { return _this.listen(evtType, handler); },
            deregisterInteractionHandler: function (evtType, handler) { return _this.unlisten(evtType, handler); },
            registerThumbContainerInteractionHandler: function (evtType, handler) {
                _this.thumbContainer_.addEventListener(evtType, handler);
            },
            deregisterThumbContainerInteractionHandler: function (evtType, handler) {
                _this.thumbContainer_.removeEventListener(evtType, handler);
            },
            registerBodyInteractionHandler: function (evtType, handler) { return document.body.addEventListener(evtType, handler); },
            deregisterBodyInteractionHandler: function (evtType, handler) { return document.body.removeEventListener(evtType, handler); },
            registerResizeHandler: function (handler) { return window.addEventListener('resize', handler); },
            deregisterResizeHandler: function (handler) { return window.removeEventListener('resize', handler); },
            notifyInput: function () { return _this.emit(strings.INPUT_EVENT, _this); },
            notifyChange: function () { return _this.emit(strings.CHANGE_EVENT, _this); },
            setThumbContainerStyleProperty: function (propertyName, value) {
                _this.thumbContainer_.style.setProperty(propertyName, value);
            },
            setTrackStyleProperty: function (propertyName, value) { return _this.track_.style.setProperty(propertyName, value); },
            setMarkerValue: function (value) { return _this.pinValueMarker_.innerText = value.toLocaleString(); },
            appendTrackMarkers: function (numMarkers) {
                var frag = document.createDocumentFragment();
                for (var i = 0; i < numMarkers; i++) {
                    var marker = document.createElement('div');
                    marker.classList.add('mdc-slider__track-marker');
                    frag.appendChild(marker);
                }
                _this.trackMarkerContainer_.appendChild(frag);
            },
            removeTrackMarkers: function () {
                while (_this.trackMarkerContainer_.firstChild) {
                    _this.trackMarkerContainer_.removeChild(_this.trackMarkerContainer_.firstChild);
                }
            },
            setLastTrackMarkersStyleProperty: function (propertyName, value) {
                // We remove and append new nodes, thus, the last track marker must be dynamically found.
                var lastTrackMarker = _this.root_.querySelector(strings.LAST_TRACK_MARKER_SELECTOR);
                lastTrackMarker.style.setProperty(propertyName, value);
            },
            isRTL: function () { return getComputedStyle(_this.root_).direction === 'rtl'; },
        };
        // tslint:enable:object-literal-sort-keys
        return new MDCSliderFoundation(adapter);
    };
    MDCSlider.prototype.initialSyncWithDOM = function () {
        var origValueNow = this.parseFloat_(this.root_.getAttribute(strings.ARIA_VALUENOW), this.value);
        var min = this.parseFloat_(this.root_.getAttribute(strings.ARIA_VALUEMIN), this.min);
        var max = this.parseFloat_(this.root_.getAttribute(strings.ARIA_VALUEMAX), this.max);
        // min and max need to be set in the right order to avoid throwing an error
        // when the new min is greater than the default max.
        if (min >= this.max) {
            this.max = max;
            this.min = min;
        }
        else {
            this.min = min;
            this.max = max;
        }
        this.step = this.parseFloat_(this.root_.getAttribute(strings.STEP_DATA_ATTR), this.step);
        this.value = origValueNow;
        this.disabled = (this.root_.hasAttribute(strings.ARIA_DISABLED) &&
            this.root_.getAttribute(strings.ARIA_DISABLED) !== 'false');
        this.foundation_.setupTrackMarker();
    };
    MDCSlider.prototype.layout = function () {
        this.foundation_.layout();
    };
    MDCSlider.prototype.stepUp = function (amount) {
        if (amount === void 0) { amount = (this.step || 1); }
        this.value += amount;
    };
    MDCSlider.prototype.stepDown = function (amount) {
        if (amount === void 0) { amount = (this.step || 1); }
        this.value -= amount;
    };
    MDCSlider.prototype.parseFloat_ = function (str, defaultValue) {
        var num = parseFloat(str); // tslint:disable-line:ban
        var isNumeric = typeof num === 'number' && isFinite(num);
        return isNumeric ? num : defaultValue;
    };
    return MDCSlider;
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

class Slider {
    constructor() {
        this.disabled = false;
        /**
         * Default value: 1.
         * The factor that the properties `value`, `valuemax` and `valuemin` are multiplied by.
         * On `change` divides the value by the factor, so the original format stays the same
         */
        this.factor = 1;
        this.unit = '';
        this.valuemax = 100;
        this.valuemin = 0;
        this.changeHandler = event => {
            this.change.emit(event.detail.value / this.factor);
        };
    }
    componentDidLoad() {
        this.mdcSlider = new MDCSlider(this.rootElement.shadowRoot.querySelector('.mdc-slider'));
        this.mdcSlider.listen('MDCSlider:change', this.changeHandler);
    }
    componentWillUpdate() {
        this.mdcSlider.disabled = this.disabled;
    }
    componentDidUnload() {
        this.mdcSlider.unlisten('MDCSlider:change', this.changeHandler);
        this.mdcSlider.destroy();
    }
    render() {
        return (h("div", { class: "slider" },
            h("label", { class: "slider__label mdc-floating-label mdc-floating-label--float-above" }, this.label),
            h("div", { class: "slider__content" },
                h("div", { class: "slider__content-range-container" },
                    h("span", { class: "slider__content-min-label" },
                        this.multiplyByFactor(this.valuemin),
                        this.unit),
                    h("span", { class: "slider__content-max-label" },
                        this.multiplyByFactor(this.valuemax),
                        this.unit)),
                h("div", { class: "mdc-slider mdc-slider--discrete", role: "slider", "aria-valuemin": this.multiplyByFactor(this.valuemin), "aria-valuemax": this.multiplyByFactor(this.valuemax), "aria-valuenow": this.multiplyByFactor(this.value), "aria-label": this.label, "aria-disabled": this.disabled },
                    h("div", { class: "mdc-slider__track-container" },
                        h("div", { class: "mdc-slider__track" })),
                    h("div", { class: "mdc-slider__thumb-container" },
                        h("div", { class: "mdc-slider__pin" },
                            h("span", { class: "mdc-slider__pin-value-marker" }, this.multiplyByFactor(this.value))),
                        h("svg", { class: "mdc-slider__thumb", width: "21", height: "21" },
                            h("circle", { cx: "10.5", cy: "10.5", r: "7.875" })),
                        h("div", { class: "mdc-slider__focus-ring" }))))));
    }
    watchValue() {
        this.mdcSlider.value = this.multiplyByFactor(this.value);
    }
    multiplyByFactor(value) {
        return Math.round(value * this.factor);
    }
    static get is() { return "limel-slider"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "disabled": {
            "type": Boolean,
            "attr": "disabled",
            "reflectToAttr": true
        },
        "factor": {
            "type": Number,
            "attr": "factor",
            "reflectToAttr": true
        },
        "label": {
            "type": String,
            "attr": "label",
            "reflectToAttr": true
        },
        "rootElement": {
            "elementRef": true
        },
        "unit": {
            "type": String,
            "attr": "unit",
            "reflectToAttr": true
        },
        "value": {
            "type": Number,
            "attr": "value",
            "reflectToAttr": true,
            "watchCallbacks": ["watchValue"]
        },
        "valuemax": {
            "type": Number,
            "attr": "valuemax",
            "reflectToAttr": true
        },
        "valuemin": {
            "type": Number,
            "attr": "valuemin",
            "reflectToAttr": true
        }
    }; }
    static get events() { return [{
            "name": "change",
            "method": "change",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get style() { return ":host {\n  --mdc-theme-primary: var(--lime-primary-color, #26a69a);\n  --mdc-theme-secondary: var(--lime-secondary-color, #575756);\n  --mdc-theme-on-primary: var(--lime-on-primary-color, #fff);\n  --mdc-theme-on-secondary: var(--lime-on-secondary-color, #fff);\n}\n\n:root {\n  --mdc-theme-primary: #26a69a;\n  --mdc-theme-secondary: #575756;\n  --mdc-theme-background: #fff;\n  --mdc-theme-surface: #fff;\n  --mdc-theme-error: #b00020;\n  --mdc-theme-on-primary: #fff;\n  --mdc-theme-on-secondary: #fff;\n  --mdc-theme-on-surface: #000;\n  --mdc-theme-on-error: #fff;\n  --mdc-theme-text-primary-on-background: rgba(0, 0, 0, 0.87);\n  --mdc-theme-text-secondary-on-background: rgba(0, 0, 0, 0.54);\n  --mdc-theme-text-hint-on-background: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-disabled-on-background: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-icon-on-background: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-primary-on-light: rgba(0, 0, 0, 0.87);\n  --mdc-theme-text-secondary-on-light: rgba(0, 0, 0, 0.54);\n  --mdc-theme-text-hint-on-light: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-disabled-on-light: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-icon-on-light: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-primary-on-dark: white;\n  --mdc-theme-text-secondary-on-dark: rgba(255, 255, 255, 0.7);\n  --mdc-theme-text-hint-on-dark: rgba(255, 255, 255, 0.5);\n  --mdc-theme-text-disabled-on-dark: rgba(255, 255, 255, 0.5);\n  --mdc-theme-text-icon-on-dark: rgba(255, 255, 255, 0.5);\n}\n\n.mdc-theme--primary {\n  color: #26a69a !important;\n  /* \@alternate */\n  color: var(--mdc-theme-primary, #26a69a) !important;\n}\n\n.mdc-theme--secondary {\n  color: #575756 !important;\n  /* \@alternate */\n  color: var(--mdc-theme-secondary, #575756) !important;\n}\n\n.mdc-theme--background {\n  background-color: #fff;\n  /* \@alternate */\n  background-color: var(--mdc-theme-background, #fff);\n}\n\n.mdc-theme--surface {\n  background-color: #fff;\n  /* \@alternate */\n  background-color: var(--mdc-theme-surface, #fff);\n}\n\n.mdc-theme--error {\n  color: #b00020 !important;\n  /* \@alternate */\n  color: var(--mdc-theme-error, #b00020) !important;\n}\n\n.mdc-theme--on-primary {\n  color: #fff !important;\n  /* \@alternate */\n  color: var(--mdc-theme-on-primary, #fff) !important;\n}\n\n.mdc-theme--on-secondary {\n  color: #fff !important;\n  /* \@alternate */\n  color: var(--mdc-theme-on-secondary, #fff) !important;\n}\n\n.mdc-theme--on-surface {\n  color: #000 !important;\n  /* \@alternate */\n  color: var(--mdc-theme-on-surface, #000) !important;\n}\n\n.mdc-theme--on-error {\n  color: #fff !important;\n  /* \@alternate */\n  color: var(--mdc-theme-on-error, #fff) !important;\n}\n\n.mdc-theme--text-primary-on-background {\n  color: rgba(0, 0, 0, 0.87) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-primary-on-background, rgba(0, 0, 0, 0.87)) !important;\n}\n\n.mdc-theme--text-secondary-on-background {\n  color: rgba(0, 0, 0, 0.54) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-secondary-on-background, rgba(0, 0, 0, 0.54)) !important;\n}\n\n.mdc-theme--text-hint-on-background {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.38)) !important;\n}\n\n.mdc-theme--text-disabled-on-background {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-disabled-on-background, rgba(0, 0, 0, 0.38)) !important;\n}\n\n.mdc-theme--text-icon-on-background {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-icon-on-background, rgba(0, 0, 0, 0.38)) !important;\n}\n\n.mdc-theme--text-primary-on-light {\n  color: rgba(0, 0, 0, 0.87) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-primary-on-light, rgba(0, 0, 0, 0.87)) !important;\n}\n\n.mdc-theme--text-secondary-on-light {\n  color: rgba(0, 0, 0, 0.54) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-secondary-on-light, rgba(0, 0, 0, 0.54)) !important;\n}\n\n.mdc-theme--text-hint-on-light {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-hint-on-light, rgba(0, 0, 0, 0.38)) !important;\n}\n\n.mdc-theme--text-disabled-on-light {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-disabled-on-light, rgba(0, 0, 0, 0.38)) !important;\n}\n\n.mdc-theme--text-icon-on-light {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-icon-on-light, rgba(0, 0, 0, 0.38)) !important;\n}\n\n.mdc-theme--text-primary-on-dark {\n  color: white !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-primary-on-dark, white) !important;\n}\n\n.mdc-theme--text-secondary-on-dark {\n  color: rgba(255, 255, 255, 0.7) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-secondary-on-dark, rgba(255, 255, 255, 0.7)) !important;\n}\n\n.mdc-theme--text-hint-on-dark {\n  color: rgba(255, 255, 255, 0.5) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-hint-on-dark, rgba(255, 255, 255, 0.5)) !important;\n}\n\n.mdc-theme--text-disabled-on-dark {\n  color: rgba(255, 255, 255, 0.5) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-disabled-on-dark, rgba(255, 255, 255, 0.5)) !important;\n}\n\n.mdc-theme--text-icon-on-dark {\n  color: rgba(255, 255, 255, 0.5) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-icon-on-dark, rgba(255, 255, 255, 0.5)) !important;\n}\n\n.mdc-theme--primary-bg {\n  background-color: #26a69a !important;\n  /* \@alternate */\n  background-color: var(--mdc-theme-primary, #26a69a) !important;\n}\n\n.mdc-theme--secondary-bg {\n  background-color: #575756 !important;\n  /* \@alternate */\n  background-color: var(--mdc-theme-secondary, #575756) !important;\n}\n\n.mdc-typography {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n}\n\n.mdc-typography--headline1 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1rem;\n  line-height: 0.875rem;\n  font-weight: 300;\n  letter-spacing: -0.015625em;\n  text-decoration: inherit;\n  text-transform: inherit;\n}\n\n.mdc-typography--headline2 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1rem;\n  line-height: 0.875rem;\n  font-weight: 300;\n  letter-spacing: -0.0083333333em;\n  text-decoration: inherit;\n  text-transform: inherit;\n}\n\n.mdc-typography--headline3 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1rem;\n  line-height: 0.875rem;\n  font-weight: 400;\n  letter-spacing: normal;\n  text-decoration: inherit;\n  text-transform: inherit;\n}\n\n.mdc-typography--headline4 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1rem;\n  line-height: 0.875rem;\n  font-weight: 400;\n  letter-spacing: 0.0073529412em;\n  text-decoration: inherit;\n  text-transform: inherit;\n}\n\n.mdc-typography--headline5 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.875rem;\n  line-height: 0.875rem;\n  font-weight: 400;\n  letter-spacing: normal;\n  text-decoration: inherit;\n  text-transform: inherit;\n}\n\n.mdc-typography--headline6 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.875rem;\n  line-height: 0.875rem;\n  font-weight: 500;\n  letter-spacing: 0.0125em;\n  text-decoration: inherit;\n  text-transform: inherit;\n}\n\n.mdc-typography--subtitle1 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.875rem;\n  line-height: 1.125rem;\n  font-weight: 400;\n  letter-spacing: 0.009375em;\n  text-decoration: inherit;\n  text-transform: inherit;\n}\n\n.mdc-typography--subtitle2 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.8125rem;\n  line-height: 1.125rem;\n  font-weight: 500;\n  letter-spacing: 0.0071428571em;\n  text-decoration: inherit;\n  text-transform: inherit;\n}\n\n.mdc-typography--body1 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.8125rem;\n  line-height: 1.5rem;\n  font-weight: 400;\n  letter-spacing: 0.03125em;\n  text-decoration: inherit;\n  text-transform: inherit;\n}\n\n.mdc-typography--body2 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.8125rem;\n  line-height: 1.625rem;\n  font-weight: 400;\n  letter-spacing: 0.0178571429em;\n  text-decoration: inherit;\n  text-transform: inherit;\n}\n\n.mdc-typography--caption {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.6875rem;\n  line-height: 0.875rem;\n  font-weight: 400;\n  letter-spacing: 0.0333333333em;\n  text-decoration: inherit;\n  text-transform: inherit;\n}\n\n.mdc-typography--button {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.875rem;\n  line-height: 2.25rem;\n  font-weight: 500;\n  letter-spacing: 0.0892857143em;\n  text-decoration: none;\n  text-transform: none;\n}\n\n.mdc-typography--overline {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.6875rem;\n  line-height: 0.875rem;\n  font-weight: 500;\n  letter-spacing: 0.1666666667em;\n  text-decoration: none;\n  text-transform: uppercase;\n}\n\n\@-webkit-keyframes mdc-slider-emphasize {\n  0% {\n    -webkit-animation-timing-function: ease-out;\n    animation-timing-function: ease-out;\n  }\n  50% {\n    -webkit-animation-timing-function: ease-in;\n    animation-timing-function: ease-in;\n    -webkit-transform: scale(0.85);\n    transform: scale(0.85);\n  }\n  100% {\n    -webkit-transform: scale(0.571);\n    transform: scale(0.571);\n  }\n}\n\n\@keyframes mdc-slider-emphasize {\n  0% {\n    -webkit-animation-timing-function: ease-out;\n    animation-timing-function: ease-out;\n  }\n  50% {\n    -webkit-animation-timing-function: ease-in;\n    animation-timing-function: ease-in;\n    -webkit-transform: scale(0.85);\n    transform: scale(0.85);\n  }\n  100% {\n    -webkit-transform: scale(0.571);\n    transform: scale(0.571);\n  }\n}\n.mdc-slider {\n  position: relative;\n  width: 100%;\n  height: 3rem;\n  cursor: pointer;\n  -ms-touch-action: pan-x;\n  touch-action: pan-x;\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n}\n.mdc-slider:not(.mdc-slider--disabled) .mdc-slider__track {\n  background-color: #575756;\n  /* \@alternate */\n  background-color: var(--mdc-theme-secondary, #575756);\n}\n.mdc-slider:not(.mdc-slider--disabled) .mdc-slider__track-container {\n  background-color: rgba(87, 87, 86, 0.26);\n}\n.mdc-slider:not(.mdc-slider--disabled) .mdc-slider__track-marker::after,\n.mdc-slider:not(.mdc-slider--disabled) .mdc-slider__track-marker-container::after {\n  background-color: #575756;\n  /* \@alternate */\n  background-color: var(--mdc-theme-secondary, #575756);\n}\n.mdc-slider:not(.mdc-slider--disabled) .mdc-slider__thumb {\n  fill: #575756;\n  /* \@alternate */\n  fill: var(--mdc-theme-secondary, #575756);\n  stroke: #575756;\n  /* \@alternate */\n  stroke: var(--mdc-theme-secondary, #575756);\n}\n.mdc-slider:not(.mdc-slider--disabled) .mdc-slider__focus-ring {\n  background-color: #575756;\n  /* \@alternate */\n  background-color: var(--mdc-theme-secondary, #575756);\n}\n.mdc-slider:not(.mdc-slider--disabled) .mdc-slider__pin {\n  background-color: #575756;\n  /* \@alternate */\n  background-color: var(--mdc-theme-secondary, #575756);\n}\n.mdc-slider:not(.mdc-slider--disabled) .mdc-slider__pin {\n  color: white;\n  /* \@alternate */\n  color: var(--mdc-theme-text-primary-on-dark, white);\n}\n.mdc-slider--disabled {\n  cursor: auto;\n}\n.mdc-slider--disabled .mdc-slider__track {\n  background-color: #9a9a9a;\n}\n.mdc-slider--disabled .mdc-slider__track-container {\n  background-color: rgba(154, 154, 154, 0.26);\n}\n.mdc-slider--disabled .mdc-slider__track-marker::after,\n.mdc-slider--disabled .mdc-slider__track-marker-container::after {\n  background-color: #9a9a9a;\n}\n.mdc-slider--disabled .mdc-slider__thumb {\n  fill: #9a9a9a;\n  stroke: #9a9a9a;\n}\n.mdc-slider--disabled .mdc-slider__thumb {\n  /* \@alternate */\n  stroke: white;\n  stroke: var(--mdc-slider-bg-color-behind-component, white);\n}\n.mdc-slider:focus {\n  outline: none;\n}\n.mdc-slider__track-container {\n  position: absolute;\n  top: 50%;\n  width: 100%;\n  height: 0.125rem;\n  overflow: hidden;\n}\n.mdc-slider__track {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  -webkit-transform-origin: left top;\n  transform-origin: left top;\n  will-change: transform;\n}\n.mdc-slider[dir=rtl] .mdc-slider__track, [dir=rtl] .mdc-slider .mdc-slider__track {\n  -webkit-transform-origin: right top;\n  transform-origin: right top;\n}\n\n.mdc-slider__track-marker-container {\n  display: -ms-flexbox;\n  display: flex;\n  margin-right: 0;\n  margin-left: -0.0625rem;\n  visibility: hidden;\n}\n.mdc-slider[dir=rtl] .mdc-slider__track-marker-container, [dir=rtl] .mdc-slider .mdc-slider__track-marker-container {\n  margin-right: -0.0625rem;\n  margin-left: 0;\n}\n\n.mdc-slider__track-marker-container::after {\n  display: block;\n  width: 0.125rem;\n  height: 0.125rem;\n  content: \"\";\n}\n.mdc-slider__track-marker {\n  -ms-flex: 1;\n  flex: 1;\n}\n.mdc-slider__track-marker::after {\n  display: block;\n  width: 0.125rem;\n  height: 0.125rem;\n  content: \"\";\n}\n.mdc-slider__track-marker:first-child::after {\n  width: 0.1875rem;\n}\n.mdc-slider__thumb-container {\n  position: absolute;\n  top: 0.9375rem;\n  left: 0;\n  width: 1.3125rem;\n  height: 100%;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  will-change: transform;\n}\n.mdc-slider__thumb {\n  position: absolute;\n  top: 0;\n  left: 0;\n  -webkit-transform: scale(0.571);\n  transform: scale(0.571);\n  -webkit-transition: fill 100ms ease-out, stroke 100ms ease-out, -webkit-transform 100ms ease-out;\n  transition: fill 100ms ease-out, stroke 100ms ease-out, -webkit-transform 100ms ease-out;\n  transition: transform 100ms ease-out, fill 100ms ease-out, stroke 100ms ease-out;\n  transition: transform 100ms ease-out, fill 100ms ease-out, stroke 100ms ease-out, -webkit-transform 100ms ease-out;\n  stroke-width: 3.5;\n}\n.mdc-slider__focus-ring {\n  width: 1.3125rem;\n  height: 1.3125rem;\n  -webkit-transition: opacity 266.67ms ease-out, background-color 266.67ms ease-out, -webkit-transform 266.67ms ease-out;\n  transition: opacity 266.67ms ease-out, background-color 266.67ms ease-out, -webkit-transform 266.67ms ease-out;\n  transition: transform 266.67ms ease-out, opacity 266.67ms ease-out, background-color 266.67ms ease-out;\n  transition: transform 266.67ms ease-out, opacity 266.67ms ease-out, background-color 266.67ms ease-out, -webkit-transform 266.67ms ease-out;\n  border-radius: 50%;\n  opacity: 0;\n}\n.mdc-slider__pin {\n  display: -ms-flexbox;\n  display: flex;\n  position: absolute;\n  top: 0;\n  left: 0;\n  -ms-flex-align: center;\n  align-items: center;\n  -ms-flex-pack: center;\n  justify-content: center;\n  width: 1.625rem;\n  height: 1.625rem;\n  margin-top: -0.125rem;\n  margin-left: -0.125rem;\n  -webkit-transform: rotate(-45deg) scale(0) translate(0, 0);\n  transform: rotate(-45deg) scale(0) translate(0, 0);\n  -webkit-transition: -webkit-transform 100ms ease-out;\n  transition: -webkit-transform 100ms ease-out;\n  transition: transform 100ms ease-out;\n  transition: transform 100ms ease-out, -webkit-transform 100ms ease-out;\n  border-radius: 50% 50% 50% 0%;\n  z-index: 1;\n}\n.mdc-slider__pin-value-marker {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.8125rem;\n  line-height: 1.625rem;\n  font-weight: 400;\n  letter-spacing: 0.0178571429em;\n  text-decoration: inherit;\n  text-transform: inherit;\n  -webkit-transform: rotate(45deg);\n  transform: rotate(45deg);\n}\n\n.mdc-slider--active .mdc-slider__thumb {\n  -webkit-transform: scale3d(1, 1, 1);\n  transform: scale3d(1, 1, 1);\n}\n\n.mdc-slider--focus .mdc-slider__thumb {\n  -webkit-animation: mdc-slider-emphasize 266.67ms linear;\n  animation: mdc-slider-emphasize 266.67ms linear;\n}\n.mdc-slider--focus .mdc-slider__focus-ring {\n  -webkit-transform: scale3d(1.55, 1.55, 1.55);\n  transform: scale3d(1.55, 1.55, 1.55);\n  opacity: 0.25;\n}\n\n.mdc-slider--in-transit .mdc-slider__thumb {\n  -webkit-transition-delay: 140ms;\n  transition-delay: 140ms;\n}\n\n.mdc-slider--in-transit .mdc-slider__thumb-container,\n.mdc-slider--in-transit .mdc-slider__track,\n.mdc-slider:focus:not(.mdc-slider--active) .mdc-slider__thumb-container,\n.mdc-slider:focus:not(.mdc-slider--active) .mdc-slider__track {\n  -webkit-transition: -webkit-transform 80ms ease;\n  transition: -webkit-transform 80ms ease;\n  transition: transform 80ms ease;\n  transition: transform 80ms ease, -webkit-transform 80ms ease;\n}\n\n.mdc-slider--discrete.mdc-slider--active .mdc-slider__thumb {\n  -webkit-transform: scale(calc(12 / 21));\n  transform: scale(calc(12 / 21));\n}\n.mdc-slider--discrete.mdc-slider--active .mdc-slider__pin {\n  -webkit-transform: rotate(-45deg) scale(1) translate(1.1875rem, -1.25rem);\n  transform: rotate(-45deg) scale(1) translate(1.1875rem, -1.25rem);\n}\n.mdc-slider--discrete.mdc-slider--focus .mdc-slider__thumb {\n  -webkit-animation: none;\n  animation: none;\n}\n.mdc-slider--discrete.mdc-slider--display-markers .mdc-slider__track-marker-container {\n  visibility: visible;\n}\n\n.mdc-floating-label {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.875rem;\n  line-height: 1.125rem;\n  font-weight: 400;\n  letter-spacing: 0.009375em;\n  text-decoration: inherit;\n  text-transform: inherit;\n  position: absolute;\n  /* \@noflip */\n  left: 0;\n  /* \@noflip */\n  -webkit-transform-origin: left top;\n  transform-origin: left top;\n  -webkit-transition: color 150ms cubic-bezier(0.4, 0, 0.2, 1), -webkit-transform 150ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: color 150ms cubic-bezier(0.4, 0, 0.2, 1), -webkit-transform 150ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1), color 150ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1), color 150ms cubic-bezier(0.4, 0, 0.2, 1), -webkit-transform 150ms cubic-bezier(0.4, 0, 0.2, 1);\n  /* \@alternate */\n  line-height: 1.15rem;\n  text-align: left;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  cursor: text;\n  overflow: hidden;\n  will-change: transform;\n}\n[dir=rtl] .mdc-floating-label, .mdc-floating-label[dir=rtl] {\n  /* \@noflip */\n  right: 0;\n  /* \@noflip */\n  left: auto;\n  /* \@noflip */\n  -webkit-transform-origin: right top;\n  transform-origin: right top;\n  /* \@noflip */\n  text-align: right;\n}\n\n.mdc-floating-label--float-above {\n  cursor: auto;\n}\n\n.mdc-floating-label--float-above {\n  -webkit-transform: translateY(-50%) scale(0.75);\n  transform: translateY(-50%) scale(0.75);\n}\n\n.mdc-floating-label--shake {\n  -webkit-animation: mdc-floating-label-shake-float-above-standard 250ms 1;\n  animation: mdc-floating-label-shake-float-above-standard 250ms 1;\n}\n\n\@-webkit-keyframes mdc-floating-label-shake-float-above-standard {\n  0% {\n    -webkit-transform: translateX(calc(0 - 0%)) translateY(-50%) scale(0.75);\n    transform: translateX(calc(0 - 0%)) translateY(-50%) scale(0.75);\n  }\n  33% {\n    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.701732, 0.495819);\n    animation-timing-function: cubic-bezier(0.5, 0, 0.701732, 0.495819);\n    -webkit-transform: translateX(calc(4% - 0%)) translateY(-50%) scale(0.75);\n    transform: translateX(calc(4% - 0%)) translateY(-50%) scale(0.75);\n  }\n  66% {\n    -webkit-animation-timing-function: cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);\n    animation-timing-function: cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);\n    -webkit-transform: translateX(calc(-4% - 0%)) translateY(-50%) scale(0.75);\n    transform: translateX(calc(-4% - 0%)) translateY(-50%) scale(0.75);\n  }\n  100% {\n    -webkit-transform: translateX(calc(0 - 0%)) translateY(-50%) scale(0.75);\n    transform: translateX(calc(0 - 0%)) translateY(-50%) scale(0.75);\n  }\n}\n\n\@keyframes mdc-floating-label-shake-float-above-standard {\n  0% {\n    -webkit-transform: translateX(calc(0 - 0%)) translateY(-50%) scale(0.75);\n    transform: translateX(calc(0 - 0%)) translateY(-50%) scale(0.75);\n  }\n  33% {\n    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.701732, 0.495819);\n    animation-timing-function: cubic-bezier(0.5, 0, 0.701732, 0.495819);\n    -webkit-transform: translateX(calc(4% - 0%)) translateY(-50%) scale(0.75);\n    transform: translateX(calc(4% - 0%)) translateY(-50%) scale(0.75);\n  }\n  66% {\n    -webkit-animation-timing-function: cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);\n    animation-timing-function: cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);\n    -webkit-transform: translateX(calc(-4% - 0%)) translateY(-50%) scale(0.75);\n    transform: translateX(calc(-4% - 0%)) translateY(-50%) scale(0.75);\n  }\n  100% {\n    -webkit-transform: translateX(calc(0 - 0%)) translateY(-50%) scale(0.75);\n    transform: translateX(calc(0 - 0%)) translateY(-50%) scale(0.75);\n  }\n}\n.mdc-slider:not(.mdc-slider--disabled) .mdc-slider__track {\n  background-color: var(--lime-primary-color, #26a69a);\n}\n.mdc-slider:not(.mdc-slider--disabled) .mdc-slider__thumb {\n  fill: var(--lime-primary-color, #26a69a);\n  stroke: var(--lime-primary-color, #26a69a);\n}\n.mdc-slider:not(.mdc-slider--disabled) .mdc-slider__pin {\n  background-color: var(--lime-primary-color, #26a69a);\n}\n.mdc-slider:not(.mdc-slider--disabled) .mdc-slider__pin {\n  color: #fff;\n  /* \@alternate */\n  color: var(--mdc-theme-on-primary, #fff);\n}\n\n.mdc-slider__pin-value-marker {\n  margin-bottom: 0.125rem;\n}\n\n.slider {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-direction: column;\n  flex-direction: column;\n  -ms-flex-pack: justify;\n  justify-content: space-between;\n  position: relative;\n}\n\n.slider__label {\n  padding-left: 1.25rem;\n}\n\n.slider__content {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-direction: column;\n  flex-direction: column;\n  -ms-flex-pack: justify;\n  justify-content: space-between;\n  margin-left: 1rem;\n  margin-right: 1rem;\n}\n\n.slider__content-range-container {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-pack: justify;\n  justify-content: space-between;\n  padding-top: 0.375rem;\n  width: 100%;\n}\n\n.slider__content-min-label {\n  color: #999999;\n  font-size: 0.75rem;\n  left: 0;\n  top: 1.25rem;\n}\n\n.slider__content-max-label {\n  color: #999999;\n  font-size: 0.75rem;\n  right: 0;\n  top: 1.25rem;\n}\n\n.mdc-slider {\n  height: 1.75rem;\n}\n\n.mdc-slider__track-container {\n  top: 0.5625rem;\n}\n\n.mdc-slider__thumb-container {\n  top: 0;\n}\n\n.mdc-slider__pin {\n  border-radius: 0.25rem;\n  height: 1.25rem;\n  left: -0.5rem;\n  top: -1rem;\n  -webkit-transform: none;\n  transform: none;\n  width: 2.5rem;\n}\n\n.mdc-slider__pin-value-marker {\n  font-size: 0.75rem;\n  -webkit-transform: rotate(0deg);\n  transform: rotate(0deg);\n}\n\n.mdc-slider--discrete.mdc-slider--active .mdc-slider__pin {\n  -webkit-transform: none;\n  transform: none;\n}"; }
}

export { Slider as LimelSlider };
