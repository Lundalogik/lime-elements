import { r as registerInstance, d as createEvent, h, c as getElement } from './core-804afdbc.js';
import { i as ARROW_LEFT, j as ARROW_LEFT_KEY_CODE, k as ARROW_RIGHT, l as ARROW_RIGHT_KEY_CODE, E as ENTER, a as ENTER_KEY_CODE, D as DELETE, m as DELETE_KEY_CODE, B as BACKSPACE, n as BACKSPACE_KEY_CODE, f as ESCAPE, g as ESCAPE_KEY_CODE } from './keycodes-ab559a88.js';
import { _ as __extends, a as __assign } from './tslib.es6-f504def8.js';
import { M as MDCFoundation, a as MDCComponent } from './component-67e7368b.js';
import './index-0dd051fb.js';
import './index-353004cc.js';
import { M as MDCRipple, a as MDCRippleFoundation } from './component-d9fd1f66.js';
import { M as MDCTextField } from './index-103021da.js';
import './index-0304a92a.js';

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
var strings = {
    CHECKMARK_SELECTOR: '.mdc-chip__checkmark',
    ENTRY_ANIMATION_NAME: 'mdc-chip-entry',
    INTERACTION_EVENT: 'MDCChip:interaction',
    LEADING_ICON_SELECTOR: '.mdc-chip__icon--leading',
    REMOVAL_EVENT: 'MDCChip:removal',
    SELECTION_EVENT: 'MDCChip:selection',
    TRAILING_ICON_INTERACTION_EVENT: 'MDCChip:trailingIconInteraction',
    TRAILING_ICON_SELECTOR: '.mdc-chip__icon--trailing',
};
var cssClasses = {
    CHECKMARK: 'mdc-chip__checkmark',
    CHIP_EXIT: 'mdc-chip--exit',
    HIDDEN_LEADING_ICON: 'mdc-chip__icon--leading-hidden',
    LEADING_ICON: 'mdc-chip__icon--leading',
    SELECTED: 'mdc-chip--selected',
    TRAILING_ICON: 'mdc-chip__icon--trailing',
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
var emptyClientRect = {
    bottom: 0,
    height: 0,
    left: 0,
    right: 0,
    top: 0,
    width: 0,
};
var MDCChipFoundation = /** @class */ (function (_super) {
    __extends(MDCChipFoundation, _super);
    function MDCChipFoundation(adapter) {
        var _this = _super.call(this, __assign({}, MDCChipFoundation.defaultAdapter, adapter)) || this;
        /**
         * Whether a trailing icon click should immediately trigger exit/removal of the chip.
         */
        _this.shouldRemoveOnTrailingIconClick_ = true;
        return _this;
    }
    Object.defineProperty(MDCChipFoundation, "strings", {
        get: function () {
            return strings;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCChipFoundation, "cssClasses", {
        get: function () {
            return cssClasses;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCChipFoundation, "defaultAdapter", {
        get: function () {
            return {
                addClass: function () { return undefined; },
                addClassToLeadingIcon: function () { return undefined; },
                eventTargetHasClass: function () { return false; },
                getCheckmarkBoundingClientRect: function () { return emptyClientRect; },
                getComputedStyleValue: function () { return ''; },
                getRootBoundingClientRect: function () { return emptyClientRect; },
                hasClass: function () { return false; },
                hasLeadingIcon: function () { return false; },
                notifyInteraction: function () { return undefined; },
                notifyRemoval: function () { return undefined; },
                notifySelection: function () { return undefined; },
                notifyTrailingIconInteraction: function () { return undefined; },
                removeClass: function () { return undefined; },
                removeClassFromLeadingIcon: function () { return undefined; },
                setStyleProperty: function () { return undefined; },
            };
        },
        enumerable: true,
        configurable: true
    });
    MDCChipFoundation.prototype.isSelected = function () {
        return this.adapter_.hasClass(cssClasses.SELECTED);
    };
    MDCChipFoundation.prototype.setSelected = function (selected) {
        if (selected) {
            this.adapter_.addClass(cssClasses.SELECTED);
        }
        else {
            this.adapter_.removeClass(cssClasses.SELECTED);
        }
        this.adapter_.notifySelection(selected);
    };
    MDCChipFoundation.prototype.getShouldRemoveOnTrailingIconClick = function () {
        return this.shouldRemoveOnTrailingIconClick_;
    };
    MDCChipFoundation.prototype.setShouldRemoveOnTrailingIconClick = function (shouldRemove) {
        this.shouldRemoveOnTrailingIconClick_ = shouldRemove;
    };
    MDCChipFoundation.prototype.getDimensions = function () {
        var _this = this;
        var getRootRect = function () { return _this.adapter_.getRootBoundingClientRect(); };
        var getCheckmarkRect = function () { return _this.adapter_.getCheckmarkBoundingClientRect(); };
        // When a chip has a checkmark and not a leading icon, the bounding rect changes in size depending on the current
        // size of the checkmark.
        if (!this.adapter_.hasLeadingIcon()) {
            var checkmarkRect = getCheckmarkRect();
            if (checkmarkRect) {
                var rootRect = getRootRect();
                // Checkmark is a square, meaning the client rect's width and height are identical once the animation completes.
                // However, the checkbox is initially hidden by setting the width to 0.
                // To account for an initial width of 0, we use the checkbox's height instead (which equals the end-state width)
                // when adding it to the root client rect's width.
                return {
                    bottom: rootRect.bottom,
                    height: rootRect.height,
                    left: rootRect.left,
                    right: rootRect.right,
                    top: rootRect.top,
                    width: rootRect.width + checkmarkRect.height,
                };
            }
        }
        return getRootRect();
    };
    /**
     * Begins the exit animation which leads to removal of the chip.
     */
    MDCChipFoundation.prototype.beginExit = function () {
        this.adapter_.addClass(cssClasses.CHIP_EXIT);
    };
    /**
     * Handles an interaction event on the root element.
     */
    MDCChipFoundation.prototype.handleInteraction = function (evt) {
        var isEnter = evt.key === 'Enter' || evt.keyCode === 13;
        if (evt.type === 'click' || isEnter) {
            this.adapter_.notifyInteraction();
        }
    };
    /**
     * Handles a transition end event on the root element.
     */
    MDCChipFoundation.prototype.handleTransitionEnd = function (evt) {
        var _this = this;
        // Handle transition end event on the chip when it is about to be removed.
        if (this.adapter_.eventTargetHasClass(evt.target, cssClasses.CHIP_EXIT)) {
            if (evt.propertyName === 'width') {
                this.adapter_.notifyRemoval();
            }
            else if (evt.propertyName === 'opacity') {
                // See: https://css-tricks.com/using-css-transitions-auto-dimensions/#article-header-id-5
                var chipWidth_1 = this.adapter_.getComputedStyleValue('width');
                // On the next frame (once we get the computed width), explicitly set the chip's width
                // to its current pixel width, so we aren't transitioning out of 'auto'.
                requestAnimationFrame(function () {
                    _this.adapter_.setStyleProperty('width', chipWidth_1);
                    // To mitigate jitter, start transitioning padding and margin before width.
                    _this.adapter_.setStyleProperty('padding', '0');
                    _this.adapter_.setStyleProperty('margin', '0');
                    // On the next frame (once width is explicitly set), transition width to 0.
                    requestAnimationFrame(function () {
                        _this.adapter_.setStyleProperty('width', '0');
                    });
                });
            }
            return;
        }
        // Handle a transition end event on the leading icon or checkmark, since the transition end event bubbles.
        if (evt.propertyName !== 'opacity') {
            return;
        }
        if (this.adapter_.eventTargetHasClass(evt.target, cssClasses.LEADING_ICON) &&
            this.adapter_.hasClass(cssClasses.SELECTED)) {
            this.adapter_.addClassToLeadingIcon(cssClasses.HIDDEN_LEADING_ICON);
        }
        else if (this.adapter_.eventTargetHasClass(evt.target, cssClasses.CHECKMARK) &&
            !this.adapter_.hasClass(cssClasses.SELECTED)) {
            this.adapter_.removeClassFromLeadingIcon(cssClasses.HIDDEN_LEADING_ICON);
        }
    };
    /**
     * Handles an interaction event on the trailing icon element. This is used to
     * prevent the ripple from activating on interaction with the trailing icon.
     */
    MDCChipFoundation.prototype.handleTrailingIconInteraction = function (evt) {
        var isEnter = evt.key === 'Enter' || evt.keyCode === 13;
        evt.stopPropagation();
        if (evt.type === 'click' || isEnter) {
            this.adapter_.notifyTrailingIconInteraction();
            if (this.shouldRemoveOnTrailingIconClick_) {
                this.beginExit();
            }
        }
    };
    return MDCChipFoundation;
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
var INTERACTION_EVENTS = ['click', 'keydown'];
var MDCChip = /** @class */ (function (_super) {
    __extends(MDCChip, _super);
    function MDCChip() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(MDCChip.prototype, "selected", {
        /**
         * @return Whether the chip is selected.
         */
        get: function () {
            return this.foundation_.isSelected();
        },
        /**
         * Sets selected state on the chip.
         */
        set: function (selected) {
            this.foundation_.setSelected(selected);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCChip.prototype, "shouldRemoveOnTrailingIconClick", {
        /**
         * @return Whether a trailing icon click should trigger exit/removal of the chip.
         */
        get: function () {
            return this.foundation_.getShouldRemoveOnTrailingIconClick();
        },
        /**
         * Sets whether a trailing icon click should trigger exit/removal of the chip.
         */
        set: function (shouldRemove) {
            this.foundation_.setShouldRemoveOnTrailingIconClick(shouldRemove);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCChip.prototype, "ripple", {
        get: function () {
            return this.ripple_;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCChip.prototype, "id", {
        get: function () {
            return this.root_.id;
        },
        enumerable: true,
        configurable: true
    });
    MDCChip.attachTo = function (root) {
        return new MDCChip(root);
    };
    MDCChip.prototype.initialize = function (rippleFactory) {
        var _this = this;
        if (rippleFactory === void 0) { rippleFactory = function (el, foundation) { return new MDCRipple(el, foundation); }; }
        this.leadingIcon_ = this.root_.querySelector(strings.LEADING_ICON_SELECTOR);
        this.trailingIcon_ = this.root_.querySelector(strings.TRAILING_ICON_SELECTOR);
        this.checkmark_ = this.root_.querySelector(strings.CHECKMARK_SELECTOR);
        // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
        // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
        var rippleAdapter = __assign({}, MDCRipple.createAdapter(this), { computeBoundingRect: function () { return _this.foundation_.getDimensions(); } });
        this.ripple_ = rippleFactory(this.root_, new MDCRippleFoundation(rippleAdapter));
    };
    MDCChip.prototype.initialSyncWithDOM = function () {
        var _this = this;
        this.handleInteraction_ = function (evt) { return _this.foundation_.handleInteraction(evt); };
        this.handleTransitionEnd_ = function (evt) { return _this.foundation_.handleTransitionEnd(evt); };
        this.handleTrailingIconInteraction_ = function (evt) {
            return _this.foundation_.handleTrailingIconInteraction(evt);
        };
        INTERACTION_EVENTS.forEach(function (evtType) {
            _this.listen(evtType, _this.handleInteraction_);
        });
        this.listen('transitionend', this.handleTransitionEnd_);
        if (this.trailingIcon_) {
            INTERACTION_EVENTS.forEach(function (evtType) {
                _this.trailingIcon_.addEventListener(evtType, _this.handleTrailingIconInteraction_);
            });
        }
    };
    MDCChip.prototype.destroy = function () {
        var _this = this;
        this.ripple_.destroy();
        INTERACTION_EVENTS.forEach(function (evtType) {
            _this.unlisten(evtType, _this.handleInteraction_);
        });
        this.unlisten('transitionend', this.handleTransitionEnd_);
        if (this.trailingIcon_) {
            INTERACTION_EVENTS.forEach(function (evtType) {
                _this.trailingIcon_.removeEventListener(evtType, _this.handleTrailingIconInteraction_);
            });
        }
        _super.prototype.destroy.call(this);
    };
    /**
     * Begins the exit animation which leads to removal of the chip.
     */
    MDCChip.prototype.beginExit = function () {
        this.foundation_.beginExit();
    };
    MDCChip.prototype.getDefaultFoundation = function () {
        var _this = this;
        // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
        // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
        var adapter = {
            addClass: function (className) { return _this.root_.classList.add(className); },
            addClassToLeadingIcon: function (className) {
                if (_this.leadingIcon_) {
                    _this.leadingIcon_.classList.add(className);
                }
            },
            eventTargetHasClass: function (target, className) { return target ? target.classList.contains(className) : false; },
            getCheckmarkBoundingClientRect: function () { return _this.checkmark_ ? _this.checkmark_.getBoundingClientRect() : null; },
            getComputedStyleValue: function (propertyName) { return window.getComputedStyle(_this.root_).getPropertyValue(propertyName); },
            getRootBoundingClientRect: function () { return _this.root_.getBoundingClientRect(); },
            hasClass: function (className) { return _this.root_.classList.contains(className); },
            hasLeadingIcon: function () { return !!_this.leadingIcon_; },
            notifyInteraction: function () { return _this.emit(strings.INTERACTION_EVENT, { chipId: _this.id }, true /* shouldBubble */); },
            notifyRemoval: function () { return _this.emit(strings.REMOVAL_EVENT, { chipId: _this.id, root: _this.root_ }, true /* shouldBubble */); },
            notifySelection: function (selected) { return _this.emit(strings.SELECTION_EVENT, { chipId: _this.id, selected: selected }, true /* shouldBubble */); },
            notifyTrailingIconInteraction: function () { return _this.emit(strings.TRAILING_ICON_INTERACTION_EVENT, { chipId: _this.id }, true /* shouldBubble */); },
            removeClass: function (className) { return _this.root_.classList.remove(className); },
            removeClassFromLeadingIcon: function (className) {
                if (_this.leadingIcon_) {
                    _this.leadingIcon_.classList.remove(className);
                }
            },
            setStyleProperty: function (propertyName, value) { return _this.root_.style.setProperty(propertyName, value); },
        };
        return new MDCChipFoundation(adapter);
    };
    return MDCChip;
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
var strings$1 = {
    CHIP_SELECTOR: '.mdc-chip',
};
var cssClasses$1 = {
    CHOICE: 'mdc-chip-set--choice',
    FILTER: 'mdc-chip-set--filter',
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
var MDCChipSetFoundation = /** @class */ (function (_super) {
    __extends(MDCChipSetFoundation, _super);
    function MDCChipSetFoundation(adapter) {
        var _this = _super.call(this, __assign({}, MDCChipSetFoundation.defaultAdapter, adapter)) || this;
        /**
         * The ids of the selected chips in the set. Only used for choice chip set or filter chip set.
         */
        _this.selectedChipIds_ = [];
        return _this;
    }
    Object.defineProperty(MDCChipSetFoundation, "strings", {
        get: function () {
            return strings$1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCChipSetFoundation, "cssClasses", {
        get: function () {
            return cssClasses$1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCChipSetFoundation, "defaultAdapter", {
        get: function () {
            return {
                hasClass: function () { return false; },
                removeChip: function () { return undefined; },
                setSelected: function () { return undefined; },
            };
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns an array of the IDs of all selected chips.
     */
    MDCChipSetFoundation.prototype.getSelectedChipIds = function () {
        return this.selectedChipIds_.slice();
    };
    /**
     * Selects the chip with the given id. Deselects all other chips if the chip set is of the choice variant.
     */
    MDCChipSetFoundation.prototype.select = function (chipId) {
        if (this.selectedChipIds_.indexOf(chipId) >= 0) {
            return;
        }
        if (this.adapter_.hasClass(cssClasses$1.CHOICE) && this.selectedChipIds_.length > 0) {
            var previouslySelectedChip = this.selectedChipIds_[0];
            this.selectedChipIds_.length = 0;
            this.adapter_.setSelected(previouslySelectedChip, false);
        }
        this.selectedChipIds_.push(chipId);
        this.adapter_.setSelected(chipId, true);
    };
    /**
     * Handles a chip interaction event
     */
    MDCChipSetFoundation.prototype.handleChipInteraction = function (chipId) {
        if (this.adapter_.hasClass(cssClasses$1.CHOICE) || this.adapter_.hasClass(cssClasses$1.FILTER)) {
            this.toggleSelect_(chipId);
        }
    };
    /**
     * Handles a chip selection event, used to handle discrepancy when selection state is set directly on the Chip.
     */
    MDCChipSetFoundation.prototype.handleChipSelection = function (chipId, selected) {
        var chipIsSelected = this.selectedChipIds_.indexOf(chipId) >= 0;
        if (selected && !chipIsSelected) {
            this.select(chipId);
        }
        else if (!selected && chipIsSelected) {
            this.deselect_(chipId);
        }
    };
    /**
     * Handles the event when a chip is removed.
     */
    MDCChipSetFoundation.prototype.handleChipRemoval = function (chipId) {
        this.deselect_(chipId);
        this.adapter_.removeChip(chipId);
    };
    /**
     * Deselects the chip with the given id.
     */
    MDCChipSetFoundation.prototype.deselect_ = function (chipId) {
        var index = this.selectedChipIds_.indexOf(chipId);
        if (index >= 0) {
            this.selectedChipIds_.splice(index, 1);
            this.adapter_.setSelected(chipId, false);
        }
    };
    /**
     * Toggles selection of the chip with the given id.
     */
    MDCChipSetFoundation.prototype.toggleSelect_ = function (chipId) {
        if (this.selectedChipIds_.indexOf(chipId) >= 0) {
            this.deselect_(chipId);
        }
        else {
            this.select(chipId);
        }
    };
    return MDCChipSetFoundation;
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
var _a = MDCChipFoundation.strings, INTERACTION_EVENT = _a.INTERACTION_EVENT, SELECTION_EVENT = _a.SELECTION_EVENT, REMOVAL_EVENT = _a.REMOVAL_EVENT;
var CHIP_SELECTOR = MDCChipSetFoundation.strings.CHIP_SELECTOR;
var idCounter = 0;
var MDCChipSet = /** @class */ (function (_super) {
    __extends(MDCChipSet, _super);
    function MDCChipSet() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MDCChipSet.attachTo = function (root) {
        return new MDCChipSet(root);
    };
    Object.defineProperty(MDCChipSet.prototype, "chips", {
        get: function () {
            return this.chips_.slice();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCChipSet.prototype, "selectedChipIds", {
        /**
         * @return An array of the IDs of all selected chips.
         */
        get: function () {
            return this.foundation_.getSelectedChipIds();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param chipFactory A function which creates a new MDCChip.
     */
    MDCChipSet.prototype.initialize = function (chipFactory) {
        if (chipFactory === void 0) { chipFactory = function (el) { return new MDCChip(el); }; }
        this.chipFactory_ = chipFactory;
        this.chips_ = this.instantiateChips_(this.chipFactory_);
    };
    MDCChipSet.prototype.initialSyncWithDOM = function () {
        var _this = this;
        this.chips_.forEach(function (chip) {
            if (chip.id && chip.selected) {
                _this.foundation_.select(chip.id);
            }
        });
        this.handleChipInteraction_ = function (evt) { return _this.foundation_.handleChipInteraction(evt.detail.chipId); };
        this.handleChipSelection_ = function (evt) { return _this.foundation_.handleChipSelection(evt.detail.chipId, evt.detail.selected); };
        this.handleChipRemoval_ = function (evt) { return _this.foundation_.handleChipRemoval(evt.detail.chipId); };
        this.listen(INTERACTION_EVENT, this.handleChipInteraction_);
        this.listen(SELECTION_EVENT, this.handleChipSelection_);
        this.listen(REMOVAL_EVENT, this.handleChipRemoval_);
    };
    MDCChipSet.prototype.destroy = function () {
        this.chips_.forEach(function (chip) {
            chip.destroy();
        });
        this.unlisten(INTERACTION_EVENT, this.handleChipInteraction_);
        this.unlisten(SELECTION_EVENT, this.handleChipSelection_);
        this.unlisten(REMOVAL_EVENT, this.handleChipRemoval_);
        _super.prototype.destroy.call(this);
    };
    /**
     * Adds a new chip object to the chip set from the given chip element.
     */
    MDCChipSet.prototype.addChip = function (chipEl) {
        chipEl.id = chipEl.id || "mdc-chip-" + ++idCounter;
        this.chips_.push(this.chipFactory_(chipEl));
    };
    MDCChipSet.prototype.getDefaultFoundation = function () {
        var _this = this;
        // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
        // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
        var adapter = {
            hasClass: function (className) { return _this.root_.classList.contains(className); },
            removeChip: function (chipId) {
                var index = _this.findChipIndex_(chipId);
                if (index >= 0) {
                    _this.chips_[index].destroy();
                    _this.chips_.splice(index, 1);
                }
            },
            setSelected: function (chipId, selected) {
                var index = _this.findChipIndex_(chipId);
                if (index >= 0) {
                    _this.chips_[index].selected = selected;
                }
            },
        };
        return new MDCChipSetFoundation(adapter);
    };
    /**
     * Instantiates chip components on all of the chip set's child chip elements.
     */
    MDCChipSet.prototype.instantiateChips_ = function (chipFactory) {
        var chipElements = [].slice.call(this.root_.querySelectorAll(CHIP_SELECTOR));
        return chipElements.map(function (el) {
            el.id = el.id || "mdc-chip-" + ++idCounter;
            return chipFactory(el);
        });
    };
    /**
     * Returns the index of the chip with the given id, or -1 if the chip does not exist.
     */
    MDCChipSet.prototype.findChipIndex_ = function (chipId) {
        for (var i = 0; i < this.chips_.length; i++) {
            if (this.chips_[i].id === chipId) {
                return i;
            }
        }
        return -1;
    };
    return MDCChipSet;
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

// tslint:disable no-invalid-this
/**
 * Key handler for the input field.
 * Lets the user select, activate, and remove chips with the keyboard.
 *
 * @param {KeyboardEvent} event event
 *
 * @returns {void}
 */
function handleKeyboardEvent(event) {
    if (this.textValue.length) {
        // If there is any text in the input field, keyboard input should
        // navigate the text, not the chips.
        return;
    }
    if (!this.value || !this.value.length) {
        // If there are no chips, there is nothing to select.
        return;
    }
    const isLeft = event.key === ARROW_LEFT || event.keyCode === ARROW_LEFT_KEY_CODE;
    const isRight = event.key === ARROW_RIGHT || event.keyCode === ARROW_RIGHT_KEY_CODE;
    const isEnter = event.key === ENTER || event.keyCode === ENTER_KEY_CODE;
    const isDelete = event.key === DELETE || event.keyCode === DELETE_KEY_CODE;
    const isBackspace = event.key === BACKSPACE || event.keyCode === BACKSPACE_KEY_CODE;
    const isEscape = event.key === ESCAPE || event.keyCode === ESCAPE_KEY_CODE;
    if (isLeft) {
        return handleLeft(this, event);
    }
    if (isRight) {
        return handleRight(this, event);
    }
    if (isEnter) {
        return handleEnter(this, event);
    }
    if (isDelete) {
        return handleDelete(this, event);
    }
    if (isBackspace) {
        return handleBackspace(this, event);
    }
    if (isEscape) {
        return handleEscape(this, event);
    }
}
function handleLeft(host, event) {
    event.preventDefault();
    if (host.inputChipIndexSelected === null) {
        host.inputChipIndexSelected = host.value.length - 1;
        return;
    }
    if (host.inputChipIndexSelected <= 0) {
        return;
    }
    host.inputChipIndexSelected -= 1;
}
function handleRight(host, event) {
    event.preventDefault();
    if (host.inputChipIndexSelected === null) {
        host.inputChipIndexSelected = 0;
        return;
    }
    if (host.inputChipIndexSelected >= host.value.length - 1) {
        return;
    }
    host.inputChipIndexSelected += 1;
}
function handleEnter(host, event) {
    if (host.inputChipIndexSelected !== null) {
        event.preventDefault();
        host.emitInteraction(host.value[host.inputChipIndexSelected]);
    }
}
function handleEscape(host, event) {
    if (host.inputChipIndexSelected !== null) {
        event.preventDefault();
        host.inputChipIndexSelected = null;
    }
}
function handleDelete(host, event) {
    if (host.inputChipIndexSelected !== null) {
        event.preventDefault();
        removeChip(host);
    }
}
function handleBackspace(host, event) {
    if (host.inputChipIndexSelected !== null) {
        event.preventDefault();
        removeChip(host);
    }
    else if (!event.repeat) {
        host.inputChipIndexSelected = host.value.length - 1;
    }
}
function removeChip(host) {
    if (host.inputChipIndexSelected !== null) {
        host.removeChip(host.value[host.inputChipIndexSelected].id);
        host.inputChipIndexSelected = null;
    }
}

const SELECTED_CHIP_CLASS = 'mdc-chip--selected';
const ChipSet = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        /**
         * List of chips for the set
         */
        this.value = [];
        /**
         * True if the chip set should be disabled
         */
        this.disabled = false;
        /**
         * For chip-sets of type `input`. Set to `true` to disable adding and removing chips,
         * but allow interaction with existing chips in the set.
         */
        this.readonly = false;
        /**
         * True if the control requires a value
         */
        this.required = false;
        /**
         * Whether the input field should be emptied when the chip-set loses focus.
         */
        this.emptyInputOnBlur = true;
        this.editMode = false;
        this.textValue = '';
        this.blurred = false;
        this.inputChipIndexSelected = null;
        this.handleKeyDown = handleKeyboardEvent;
        this.renderChip = this.renderChip.bind(this);
        this.renderInputChip = this.renderInputChip.bind(this);
        this.isFull = this.isFull.bind(this);
        this.handleInteractionEvent = this.handleInteractionEvent.bind(this);
        this.handleSelection = this.handleSelection.bind(this);
        this.handleRemoveEvent = this.handleRemoveEvent.bind(this);
        this.handleTextFieldFocus = this.handleTextFieldFocus.bind(this);
        this.handleInputBlur = this.handleInputBlur.bind(this);
        this.handleTextInput = this.handleTextInput.bind(this);
        this.inputFieldOnChange = this.inputFieldOnChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.inputHidden = this.inputHidden.bind(this);
        this.interact = createEvent(this, "interact", 7);
        this.change = createEvent(this, "change", 7);
        this.startEdit = createEvent(this, "startEdit", 7);
        this.stopEdit = createEvent(this, "stopEdit", 7);
        this.input = createEvent(this, "input", 7);
    }
    /**
     * Used to find out whether the chip-set is in edit mode.
     *
     * @returns {Promise<boolean>} `true` if the chip-set is in edit mode, `false` otherwise.
     */
    async getEditMode() {
        return this.editMode;
    }
    /**
     * Used to set focus to the chip-set input field.
     *
     * @param {Boolean} emptyInput if `true`, any text in the input is discarded
     *
     * @returns {Promise<void>} does not return anything, but methods have to be async
     */
    async setFocus(emptyInput = false) {
        this.editMode = true;
        if (emptyInput) {
            this.textValue = '';
        }
        this.host.shadowRoot.querySelector('input').focus();
    }
    /**
     * Used to empty the input field. Used in conjunction with `emptyInputOnBlur` to let the
     * consumer control when the input is emptied.
     *
     * @returns {Promise<void>} does not return anything, but methods have to be async
     */
    async emptyInput() {
        this.syncEmptyInput();
    }
    componentDidLoad() {
        if (this.type === 'input') {
            this.mdcTextField = new MDCTextField(this.host.shadowRoot.querySelector('.mdc-text-field'));
        }
        this.createMDCChipSet();
    }
    componentWillUpdate() {
        this.destroyMDCChipSet();
    }
    componentDidUpdate() {
        this.createMDCChipSet();
        const input = this.host.shadowRoot.querySelector('input');
        if (input && this.editMode) {
            input.focus();
        }
    }
    componentDidUnload() {
        this.destroyMDCChipSet();
        if (this.mdcTextField) {
            this.mdcTextField.destroy();
        }
    }
    render() {
        if (this.type === 'input') {
            return this.renderInputChips();
        }
        const classes = {
            'mdc-chip-set': true,
            disabled: this.disabled,
        };
        if (this.type) {
            classes[`mdc-chip-set--${this.type}`] = true;
        }
        return h("div", { class: classes }, this.value.map(this.renderChip));
    }
    handleChangeChips() {
        this.syncEmptyInput();
    }
    createMDCChipSet() {
        this.mdcChipSet = new MDCChipSet(this.host.shadowRoot.querySelector('.mdc-chip-set'));
        this.mdcChipSet.chips.forEach(chip => {
            chip.shouldRemoveOnTrailingIconClick = false;
        });
        if (!this.type || this.type === 'input') {
            this.mdcChipSet.listen('MDCChip:interaction', this.handleInteractionEvent);
        }
        if (this.type === 'choice' || this.type === 'filter') {
            this.mdcChipSet.listen('MDCChip:selection', this.handleSelection);
        }
        this.mdcChipSet.listen('MDCChip:trailingIconInteraction', this.handleRemoveEvent);
    }
    destroyMDCChipSet() {
        if (this.mdcChipSet) {
            this.mdcChipSet.unlisten('MDCChip:interaction', this.handleInteractionEvent);
            this.mdcChipSet.unlisten('MDCChip:selection', this.handleSelection);
            this.mdcChipSet.unlisten('MDCChip:trailingIconInteraction', this.handleRemoveEvent);
            this.mdcChipSet.destroy();
        }
    }
    renderInputChips() {
        return (h("div", { class: {
                'mdc-text-field': true,
                'mdc-text-field--disabled': this.readonly || this.disabled,
                'force-invalid': this.isInvalid(),
            }, onClick: this.handleTextFieldFocus }, h("div", { class: "mdc-chip-set mdc-chip-set--input" }, this.value.map(this.renderInputChip), h("input", { type: "text", id: "my-text-field", disabled: this.readonly || this.disabled, class: {
                'mdc-text-field__input': true,
                hidden: this.inputHidden(),
            }, value: this.textValue, onBlur: this.handleInputBlur, onFocus: this.handleTextFieldFocus, onKeyDown: this.handleKeyDown, onInput: this.handleTextInput,
            // Some browsers emit a change event on input elements, we need to stop
            // that event from propagating since we are emitting our own change event
            onChange: this.inputFieldOnChange, placeholder: this.isFull() ? '' : this.searchLabel, readonly: this.isFull() })), h("label", { class: {
                'mdc-floating-label': true,
                'mdc-text-field--disabled': this.readonly || this.disabled,
                'mdc-text-field--required': this.required,
                'force-float': !!(this.value.length || this.editMode),
            }, htmlFor: "my-text-field" }, this.label), h("div", { class: "mdc-line-ripple" })));
    }
    isFull() {
        return !!this.maxItems && this.value.length >= this.maxItems;
    }
    isInvalid() {
        if (!this.required) {
            return false;
        }
        if (!this.blurred) {
            return false;
        }
        return !this.value || !this.value.length;
    }
    inputFieldOnChange(event) {
        event.stopPropagation();
    }
    /**
     * Enter edit mode when the text field receives focus. When editMode is true, the input element will be visible
     * @returns {void}
     */
    handleTextFieldFocus() {
        this.editMode = true;
        this.startEdit.emit();
    }
    /**
     * Exit edit mode when the input element loses focus. This makes sure the input element does not take up any
     * additional space when the user it not typing anything
     * @returns {void}
     */
    handleInputBlur() {
        if (this.emptyInputOnBlur) {
            this.syncEmptyInput();
        }
        this.editMode = false;
        this.blurred = true;
        this.inputChipIndexSelected = null;
        // This timeout is needed in order to let a new element receive focus
        setTimeout(() => {
            this.stopEdit.emit();
        }, 0);
    }
    syncEmptyInput() {
        this.textValue = '';
    }
    inputHidden() {
        if (this.editMode) {
            return this.isFull();
        }
        // If there are chips in the picker, hide the input to avoid the input
        // being placed on a new line and adding ugly space beneath the chips.
        // If there are no chips, show the input, or the picker will look weird.
        return !!(this.value && this.value.length);
    }
    handleTextInput(event) {
        event.stopPropagation();
        this.inputChipIndexSelected = null;
        this.textValue = event.target.value;
        this.input.emit(event.target.value && event.target.value.trim());
    }
    handleInteractionEvent(event) {
        const chip = this.value.find(item => {
            return `${item.id}` === event.detail.chipId;
        });
        this.emitInteraction(chip);
    }
    emitInteraction(chip) {
        this.interact.emit(chip);
    }
    handleSelection(event) {
        let chip = this.value.find(item => {
            return `${item.id}` === event.detail.chipId;
        });
        chip = Object.assign(Object.assign({}, chip), { selected: event.detail.selected });
        this.change.emit(chip);
    }
    handleRemoveEvent(event) {
        this.removeChip(event.detail.chipId);
    }
    removeChip(id) {
        const newValue = this.value.filter(chip => {
            return `${chip.id}` !== `${id}`;
        });
        this.change.emit(newValue);
    }
    renderChip(chip) {
        switch (this.type) {
            case 'choice':
                return this.renderChoiceChip(chip);
            case 'filter':
                return this.renderFilterChip(chip);
            default:
                return this.renderDefaultChip(chip);
        }
    }
    renderChoiceChip(chip) {
        return (h("div", { class: `mdc-chip ${chip.selected ? SELECTED_CHIP_CLASS : ''}`, tabindex: "0", id: `${chip.id}` }, chip.icon ? this.renderIcon(chip) : null, h("div", { class: "mdc-chip__text" }, chip.text)));
    }
    renderFilterChip(chip) {
        return (h("div", { class: `mdc-chip ${chip.selected ? SELECTED_CHIP_CLASS : ''}`, tabindex: "0", id: `${chip.id}` }, h("div", { class: "mdc-chip__checkmark" }, h("svg", { class: "mdc-chip__checkmark-svg", viewBox: "-2 -3 30 30" }, h("path", { class: "mdc-chip__checkmark-path", fill: "none", stroke: "black", d: "M1.73,12.91 8.1,19.28 22.79,4.59" }))), h("div", { class: "mdc-chip__text" }, chip.text)));
    }
    renderDefaultChip(chip) {
        return (h("div", { class: "mdc-chip", tabindex: "0", id: `${chip.id}` }, chip.icon ? this.renderIcon(chip) : null, h("div", { class: "mdc-chip__text" }, chip.text)));
    }
    renderInputChip(chip, index) {
        const attributes = {};
        if (this.readonly && !this.disabled) {
            attributes.tabindex = 0;
        }
        return (h("div", Object.assign({ class: {
                'mdc-chip': true,
                'mdc-chip--selected': this.inputChipIndexSelected === index,
                disabled: this.disabled,
            }, id: `${chip.id}`, onClick: this.catchInputChipClicks }, attributes), chip.icon ? this.renderIcon(chip) : null, h("div", { class: "mdc-chip__text" }, chip.text), chip.removable && !this.readonly && !this.disabled
            ? this.renderTrailingIcon()
            : null));
    }
    catchInputChipClicks(event) {
        event.stopPropagation();
    }
    renderIcon(chip) {
        const style = {};
        if (chip.iconColor) {
            style['--icon-background-color'] = chip.iconColor;
        }
        return (h("limel-icon", { class: "mdc-chip__icon mdc-chip__icon--leading", name: chip.icon, style: style, size: "small", badge: true }));
    }
    renderTrailingIcon() {
        const svgData = `<svg width="32" height="32" x="0px" y="0px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg">
    <line fill="none" id="svg_1" stroke="currentColor" stroke-width="2" x1="8" x2="24" y1="8" y2="24"/>
    <line fill="none" id="svg_2" stroke="currentColor" stroke-width="2" x1="24" x2="8" y1="8" y2="24"/>
</svg>`;
        return (h("div", { class: "mdc-chip__icon mdc-chip__icon--trailing", role: "button", innerHTML: svgData }));
    }
    get host() { return getElement(this); }
    static get watchers() { return {
        "value": ["handleChangeChips"]
    }; }
    static get style() { return ":host {\n  --mdc-theme-primary: var(--lime-primary-color, #26a69a);\n  --mdc-theme-secondary: var(--lime-secondary-color, #575756);\n  --mdc-theme-on-primary: var(--lime-on-primary-color, #fff);\n  --mdc-theme-on-secondary: var(--lime-on-secondary-color, #fff);\n}\n\n:root {\n  --mdc-theme-primary: #26a69a;\n  --mdc-theme-secondary: #575756;\n  --mdc-theme-background: #fff;\n  --mdc-theme-surface: #fff;\n  --mdc-theme-error: #b00020;\n  --mdc-theme-on-primary: #fff;\n  --mdc-theme-on-secondary: #fff;\n  --mdc-theme-on-surface: #000;\n  --mdc-theme-on-error: #fff;\n  --mdc-theme-text-primary-on-background: rgba(0, 0, 0, 0.87);\n  --mdc-theme-text-secondary-on-background: rgba(0, 0, 0, 0.54);\n  --mdc-theme-text-hint-on-background: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-disabled-on-background: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-icon-on-background: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-primary-on-light: rgba(0, 0, 0, 0.87);\n  --mdc-theme-text-secondary-on-light: rgba(0, 0, 0, 0.54);\n  --mdc-theme-text-hint-on-light: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-disabled-on-light: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-icon-on-light: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-primary-on-dark: white;\n  --mdc-theme-text-secondary-on-dark: rgba(255, 255, 255, 0.7);\n  --mdc-theme-text-hint-on-dark: rgba(255, 255, 255, 0.5);\n  --mdc-theme-text-disabled-on-dark: rgba(255, 255, 255, 0.5);\n  --mdc-theme-text-icon-on-dark: rgba(255, 255, 255, 0.5);\n}\n\n.mdc-theme--primary {\n  color: #26a69a !important;\n  /* \@alternate */\n  color: var(--mdc-theme-primary, #26a69a) !important;\n}\n\n.mdc-theme--secondary {\n  color: #575756 !important;\n  /* \@alternate */\n  color: var(--mdc-theme-secondary, #575756) !important;\n}\n\n.mdc-theme--background {\n  background-color: #fff;\n  /* \@alternate */\n  background-color: var(--mdc-theme-background, #fff);\n}\n\n.mdc-theme--surface {\n  background-color: #fff;\n  /* \@alternate */\n  background-color: var(--mdc-theme-surface, #fff);\n}\n\n.mdc-theme--error {\n  color: #b00020 !important;\n  /* \@alternate */\n  color: var(--mdc-theme-error, #b00020) !important;\n}\n\n.mdc-theme--on-primary {\n  color: #fff !important;\n  /* \@alternate */\n  color: var(--mdc-theme-on-primary, #fff) !important;\n}\n\n.mdc-theme--on-secondary {\n  color: #fff !important;\n  /* \@alternate */\n  color: var(--mdc-theme-on-secondary, #fff) !important;\n}\n\n.mdc-theme--on-surface {\n  color: #000 !important;\n  /* \@alternate */\n  color: var(--mdc-theme-on-surface, #000) !important;\n}\n\n.mdc-theme--on-error {\n  color: #fff !important;\n  /* \@alternate */\n  color: var(--mdc-theme-on-error, #fff) !important;\n}\n\n.mdc-theme--text-primary-on-background {\n  color: rgba(0, 0, 0, 0.87) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-primary-on-background, rgba(0, 0, 0, 0.87)) !important;\n}\n\n.mdc-theme--text-secondary-on-background {\n  color: rgba(0, 0, 0, 0.54) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-secondary-on-background, rgba(0, 0, 0, 0.54)) !important;\n}\n\n.mdc-theme--text-hint-on-background {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.38)) !important;\n}\n\n.mdc-theme--text-disabled-on-background {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-disabled-on-background, rgba(0, 0, 0, 0.38)) !important;\n}\n\n.mdc-theme--text-icon-on-background {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-icon-on-background, rgba(0, 0, 0, 0.38)) !important;\n}\n\n.mdc-theme--text-primary-on-light {\n  color: rgba(0, 0, 0, 0.87) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-primary-on-light, rgba(0, 0, 0, 0.87)) !important;\n}\n\n.mdc-theme--text-secondary-on-light {\n  color: rgba(0, 0, 0, 0.54) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-secondary-on-light, rgba(0, 0, 0, 0.54)) !important;\n}\n\n.mdc-theme--text-hint-on-light {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-hint-on-light, rgba(0, 0, 0, 0.38)) !important;\n}\n\n.mdc-theme--text-disabled-on-light {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-disabled-on-light, rgba(0, 0, 0, 0.38)) !important;\n}\n\n.mdc-theme--text-icon-on-light {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-icon-on-light, rgba(0, 0, 0, 0.38)) !important;\n}\n\n.mdc-theme--text-primary-on-dark {\n  color: white !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-primary-on-dark, white) !important;\n}\n\n.mdc-theme--text-secondary-on-dark {\n  color: rgba(255, 255, 255, 0.7) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-secondary-on-dark, rgba(255, 255, 255, 0.7)) !important;\n}\n\n.mdc-theme--text-hint-on-dark {\n  color: rgba(255, 255, 255, 0.5) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-hint-on-dark, rgba(255, 255, 255, 0.5)) !important;\n}\n\n.mdc-theme--text-disabled-on-dark {\n  color: rgba(255, 255, 255, 0.5) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-disabled-on-dark, rgba(255, 255, 255, 0.5)) !important;\n}\n\n.mdc-theme--text-icon-on-dark {\n  color: rgba(255, 255, 255, 0.5) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-icon-on-dark, rgba(255, 255, 255, 0.5)) !important;\n}\n\n.mdc-theme--primary-bg {\n  background-color: #26a69a !important;\n  /* \@alternate */\n  background-color: var(--mdc-theme-primary, #26a69a) !important;\n}\n\n.mdc-theme--secondary-bg {\n  background-color: #575756 !important;\n  /* \@alternate */\n  background-color: var(--mdc-theme-secondary, #575756) !important;\n}\n\n.mdc-typography {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n}\n\n.mdc-typography--headline1 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1rem;\n  line-height: 0.875rem;\n  font-weight: 300;\n  letter-spacing: -0.015625em;\n  text-decoration: inherit;\n  text-transform: inherit;\n}\n\n.mdc-typography--headline2 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1rem;\n  line-height: 0.875rem;\n  font-weight: 300;\n  letter-spacing: -0.0083333333em;\n  text-decoration: inherit;\n  text-transform: inherit;\n}\n\n.mdc-typography--headline3 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1rem;\n  line-height: 0.875rem;\n  font-weight: 400;\n  letter-spacing: normal;\n  text-decoration: inherit;\n  text-transform: inherit;\n}\n\n.mdc-typography--headline4 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1rem;\n  line-height: 0.875rem;\n  font-weight: 400;\n  letter-spacing: 0.0073529412em;\n  text-decoration: inherit;\n  text-transform: inherit;\n}\n\n.mdc-typography--headline5 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.875rem;\n  line-height: 0.875rem;\n  font-weight: 400;\n  letter-spacing: normal;\n  text-decoration: inherit;\n  text-transform: inherit;\n}\n\n.mdc-typography--headline6 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.875rem;\n  line-height: 0.875rem;\n  font-weight: 500;\n  letter-spacing: 0.0125em;\n  text-decoration: inherit;\n  text-transform: inherit;\n}\n\n.mdc-typography--subtitle1 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.875rem;\n  line-height: 1.125rem;\n  font-weight: 400;\n  letter-spacing: 0.009375em;\n  text-decoration: inherit;\n  text-transform: inherit;\n}\n\n.mdc-typography--subtitle2 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.8125rem;\n  line-height: 1.125rem;\n  font-weight: 500;\n  letter-spacing: 0.0071428571em;\n  text-decoration: inherit;\n  text-transform: inherit;\n}\n\n.mdc-typography--body1 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.8125rem;\n  line-height: 1.5rem;\n  font-weight: 400;\n  letter-spacing: 0.03125em;\n  text-decoration: inherit;\n  text-transform: inherit;\n}\n\n.mdc-typography--body2 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.8125rem;\n  line-height: 1.625rem;\n  font-weight: 400;\n  letter-spacing: 0.0178571429em;\n  text-decoration: inherit;\n  text-transform: inherit;\n}\n\n.mdc-typography--caption {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.6875rem;\n  line-height: 0.875rem;\n  font-weight: 400;\n  letter-spacing: 0.0333333333em;\n  text-decoration: inherit;\n  text-transform: inherit;\n}\n\n.mdc-typography--button {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.875rem;\n  line-height: 2.25rem;\n  font-weight: 500;\n  letter-spacing: 0.0892857143em;\n  text-decoration: none;\n  text-transform: none;\n}\n\n.mdc-typography--overline {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.6875rem;\n  line-height: 0.875rem;\n  font-weight: 500;\n  letter-spacing: 0.1666666667em;\n  text-decoration: none;\n  text-transform: uppercase;\n}\n\n\@-webkit-keyframes mdc-ripple-fg-radius-in {\n  from {\n    -webkit-animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n    -webkit-transform: translate(var(--mdc-ripple-fg-translate-start, 0)) scale(1);\n    transform: translate(var(--mdc-ripple-fg-translate-start, 0)) scale(1);\n  }\n  to {\n    -webkit-transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1));\n    transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1));\n  }\n}\n\n\@keyframes mdc-ripple-fg-radius-in {\n  from {\n    -webkit-animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n    -webkit-transform: translate(var(--mdc-ripple-fg-translate-start, 0)) scale(1);\n    transform: translate(var(--mdc-ripple-fg-translate-start, 0)) scale(1);\n  }\n  to {\n    -webkit-transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1));\n    transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1));\n  }\n}\n\@-webkit-keyframes mdc-ripple-fg-opacity-in {\n  from {\n    -webkit-animation-timing-function: linear;\n    animation-timing-function: linear;\n    opacity: 0;\n  }\n  to {\n    opacity: var(--mdc-ripple-fg-opacity, 0);\n  }\n}\n\@keyframes mdc-ripple-fg-opacity-in {\n  from {\n    -webkit-animation-timing-function: linear;\n    animation-timing-function: linear;\n    opacity: 0;\n  }\n  to {\n    opacity: var(--mdc-ripple-fg-opacity, 0);\n  }\n}\n\@-webkit-keyframes mdc-ripple-fg-opacity-out {\n  from {\n    -webkit-animation-timing-function: linear;\n    animation-timing-function: linear;\n    opacity: var(--mdc-ripple-fg-opacity, 0);\n  }\n  to {\n    opacity: 0;\n  }\n}\n\@keyframes mdc-ripple-fg-opacity-out {\n  from {\n    -webkit-animation-timing-function: linear;\n    animation-timing-function: linear;\n    opacity: var(--mdc-ripple-fg-opacity, 0);\n  }\n  to {\n    opacity: 0;\n  }\n}\n.mdc-ripple-surface--test-edge-var-bug {\n  --mdc-ripple-surface-test-edge-var: 0.0625rem solid #000;\n  visibility: hidden;\n}\n.mdc-ripple-surface--test-edge-var-bug::before {\n  border: var(--mdc-ripple-surface-test-edge-var);\n}\n\n.mdc-chip {\n  --mdc-ripple-fg-size: 0;\n  --mdc-ripple-left: 0;\n  --mdc-ripple-top: 0;\n  --mdc-ripple-fg-scale: 1;\n  --mdc-ripple-fg-translate-end: 0;\n  --mdc-ripple-fg-translate-start: 0;\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n  border-radius: 1rem;\n  background-color: #e0e0e0;\n  color: rgba(0, 0, 0, 0.87);\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.8125rem;\n  line-height: 1.625rem;\n  font-weight: 400;\n  letter-spacing: 0.0178571429em;\n  text-decoration: inherit;\n  text-transform: inherit;\n  height: 2rem;\n  display: -ms-inline-flexbox;\n  display: inline-flex;\n  position: relative;\n  -ms-flex-align: center;\n  align-items: center;\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box;\n  padding: 0.4375rem 0.75rem;\n  outline: none;\n  cursor: pointer;\n  overflow: hidden;\n}\n.mdc-chip::before, .mdc-chip::after {\n  position: absolute;\n  border-radius: 50%;\n  opacity: 0;\n  pointer-events: none;\n  content: \"\";\n}\n.mdc-chip::before {\n  -webkit-transition: opacity 15ms linear, background-color 15ms linear;\n  transition: opacity 15ms linear, background-color 15ms linear;\n  z-index: 1;\n}\n.mdc-chip.mdc-ripple-upgraded::before {\n  -webkit-transform: scale(var(--mdc-ripple-fg-scale, 1));\n  transform: scale(var(--mdc-ripple-fg-scale, 1));\n}\n.mdc-chip.mdc-ripple-upgraded::after {\n  top: 0;\n  /* \@noflip */\n  left: 0;\n  -webkit-transform: scale(0);\n  transform: scale(0);\n  -webkit-transform-origin: center center;\n  transform-origin: center center;\n}\n.mdc-chip.mdc-ripple-upgraded--unbounded::after {\n  top: var(--mdc-ripple-top, 0);\n  /* \@noflip */\n  left: var(--mdc-ripple-left, 0);\n}\n.mdc-chip.mdc-ripple-upgraded--foreground-activation::after {\n  -webkit-animation: mdc-ripple-fg-radius-in 225ms forwards, mdc-ripple-fg-opacity-in 75ms forwards;\n  animation: mdc-ripple-fg-radius-in 225ms forwards, mdc-ripple-fg-opacity-in 75ms forwards;\n}\n.mdc-chip.mdc-ripple-upgraded--foreground-deactivation::after {\n  -webkit-animation: mdc-ripple-fg-opacity-out 150ms;\n  animation: mdc-ripple-fg-opacity-out 150ms;\n  -webkit-transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1));\n  transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1));\n}\n.mdc-chip::before, .mdc-chip::after {\n  top: calc(50% - 100%);\n  /* \@noflip */\n  left: calc(50% - 100%);\n  width: 200%;\n  height: 200%;\n}\n.mdc-chip.mdc-ripple-upgraded::after {\n  width: var(--mdc-ripple-fg-size, 100%);\n  height: var(--mdc-ripple-fg-size, 100%);\n}\n.mdc-chip::before, .mdc-chip::after {\n  background-color: rgba(0, 0, 0, 0.87);\n}\n.mdc-chip:hover::before {\n  opacity: 0.04;\n}\n.mdc-chip:not(.mdc-ripple-upgraded):focus::before, .mdc-chip.mdc-ripple-upgraded--background-focused::before {\n  -webkit-transition-duration: 75ms;\n  transition-duration: 75ms;\n  opacity: 0.12;\n}\n.mdc-chip:not(.mdc-ripple-upgraded)::after {\n  -webkit-transition: opacity 150ms linear;\n  transition: opacity 150ms linear;\n}\n.mdc-chip:not(.mdc-ripple-upgraded):active::after {\n  -webkit-transition-duration: 75ms;\n  transition-duration: 75ms;\n  opacity: 0.12;\n}\n.mdc-chip.mdc-ripple-upgraded {\n  --mdc-ripple-fg-opacity: 0.12;\n}\n.mdc-chip:hover {\n  color: rgba(0, 0, 0, 0.87);\n}\n.mdc-chip.mdc-chip--selected .mdc-chip__checkmark,\n.mdc-chip .mdc-chip__icon--leading:not(.mdc-chip__icon--leading-hidden) {\n  /* \@noflip */\n  margin-left: -0.25rem;\n  /* \@noflip */\n  margin-right: 0.25rem;\n  margin-top: -0.25rem;\n  margin-bottom: -0.25rem;\n}\n[dir=rtl] .mdc-chip.mdc-chip--selected .mdc-chip__checkmark, .mdc-chip.mdc-chip--selected .mdc-chip__checkmark[dir=rtl],\n[dir=rtl] .mdc-chip .mdc-chip__icon--leading:not(.mdc-chip__icon--leading-hidden),\n.mdc-chip .mdc-chip__icon--leading:not(.mdc-chip__icon--leading-hidden)[dir=rtl] {\n  /* \@noflip */\n  margin-left: 0.25rem;\n  /* \@noflip */\n  margin-right: -0.25rem;\n}\n.mdc-chip:hover {\n  color: #000;\n  /* \@alternate */\n  color: var(--mdc-theme-on-surface, #000);\n}\n\n.mdc-chip__icon--leading {\n  color: rgba(0, 0, 0, 0.54);\n}\n\n.mdc-chip__icon--trailing {\n  color: rgba(0, 0, 0, 0.54);\n}\n.mdc-chip__icon--trailing:hover {\n  color: rgba(0, 0, 0, 0.62);\n}\n.mdc-chip__icon--trailing:focus {\n  color: rgba(0, 0, 0, 0.87);\n}\n\n.mdc-chip__icon.mdc-chip__icon--leading:not(.mdc-chip__icon--leading-hidden) {\n  width: 1.25rem;\n  height: 1.25rem;\n  font-size: 1.25rem;\n}\n\n.mdc-chip__icon.mdc-chip__icon--trailing {\n  width: 1.125rem;\n  height: 1.125rem;\n  font-size: 1.125rem;\n}\n\n.mdc-chip__icon--trailing {\n  margin: 0 -0.25rem 0 0.25rem;\n}\n\n.mdc-chip--exit {\n  -webkit-transition: opacity 75ms cubic-bezier(0.4, 0, 0.2, 1), width 150ms cubic-bezier(0, 0, 0.2, 1), padding 100ms linear, margin 100ms linear;\n  transition: opacity 75ms cubic-bezier(0.4, 0, 0.2, 1), width 150ms cubic-bezier(0, 0, 0.2, 1), padding 100ms linear, margin 100ms linear;\n  opacity: 0;\n}\n\n.mdc-chip__text {\n  white-space: nowrap;\n}\n\n.mdc-chip__icon {\n  border-radius: 50%;\n  outline: none;\n  vertical-align: middle;\n}\n\n.mdc-chip__checkmark {\n  height: 1.25rem;\n}\n\n.mdc-chip__checkmark-path {\n  -webkit-transition: stroke-dashoffset 150ms 50ms cubic-bezier(0.4, 0, 0.6, 1);\n  transition: stroke-dashoffset 150ms 50ms cubic-bezier(0.4, 0, 0.6, 1);\n  stroke-width: 0.125rem;\n  stroke-dashoffset: 29.7833385;\n  stroke-dasharray: 29.7833385;\n}\n\n.mdc-chip--selected .mdc-chip__checkmark-path {\n  stroke-dashoffset: 0;\n}\n\n.mdc-chip-set--choice .mdc-chip.mdc-chip--selected::before {\n  opacity: 0.16;\n}\n.mdc-chip-set--choice .mdc-chip.mdc-chip--selected::before, .mdc-chip-set--choice .mdc-chip.mdc-chip--selected::after {\n  background-color: #26a69a;\n}\n\@supports not (-ms-ime-align: auto) {\n  .mdc-chip-set--choice .mdc-chip.mdc-chip--selected::before, .mdc-chip-set--choice .mdc-chip.mdc-chip--selected::after {\n    /* \@alternate */\n    background-color: var(--mdc-theme-primary, #26a69a);\n  }\n}\n.mdc-chip-set--choice .mdc-chip.mdc-chip--selected:hover::before {\n  opacity: 0.24;\n}\n.mdc-chip-set--choice .mdc-chip.mdc-chip--selected:not(.mdc-ripple-upgraded):focus::before, .mdc-chip-set--choice .mdc-chip.mdc-chip--selected.mdc-ripple-upgraded--background-focused::before {\n  -webkit-transition-duration: 75ms;\n  transition-duration: 75ms;\n  opacity: 0.4;\n}\n.mdc-chip-set--choice .mdc-chip.mdc-chip--selected:not(.mdc-ripple-upgraded)::after {\n  -webkit-transition: opacity 150ms linear;\n  transition: opacity 150ms linear;\n}\n.mdc-chip-set--choice .mdc-chip.mdc-chip--selected:not(.mdc-ripple-upgraded):active::after {\n  -webkit-transition-duration: 75ms;\n  transition-duration: 75ms;\n  opacity: 0.4;\n}\n.mdc-chip-set--choice .mdc-chip.mdc-chip--selected.mdc-ripple-upgraded {\n  --mdc-ripple-fg-opacity: 0.4;\n}\n.mdc-chip-set--choice .mdc-chip.mdc-chip--selected {\n  color: #26a69a;\n  /* \@alternate */\n  color: var(--mdc-theme-primary, #26a69a);\n}\n.mdc-chip-set--choice .mdc-chip.mdc-chip--selected .mdc-chip__icon--leading {\n  color: rgba(38, 166, 154, 0.54);\n}\n.mdc-chip-set--choice .mdc-chip.mdc-chip--selected:hover {\n  color: #26a69a;\n  /* \@alternate */\n  color: var(--mdc-theme-primary, #26a69a);\n}\n.mdc-chip-set--choice .mdc-chip .mdc-chip__checkmark-path {\n  stroke: #26a69a;\n  /* \@alternate */\n  stroke: var(--mdc-theme-primary, #26a69a);\n}\n.mdc-chip-set--choice .mdc-chip--selected {\n  background-color: #fff;\n  /* \@alternate */\n  background-color: var(--mdc-theme-surface, #fff);\n}\n\n.mdc-chip__checkmark-svg {\n  width: 0;\n  height: 1.25rem;\n  -webkit-transition: width 150ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: width 150ms cubic-bezier(0.4, 0, 0.2, 1);\n}\n\n.mdc-chip--selected .mdc-chip__checkmark-svg {\n  width: 1.25rem;\n}\n\n.mdc-chip-set--filter .mdc-chip__icon--leading {\n  -webkit-transition: opacity 75ms linear;\n  transition: opacity 75ms linear;\n  -webkit-transition-delay: -50ms;\n  transition-delay: -50ms;\n  opacity: 1;\n}\n.mdc-chip-set--filter .mdc-chip__icon--leading + .mdc-chip__checkmark {\n  -webkit-transition: opacity 75ms linear;\n  transition: opacity 75ms linear;\n  -webkit-transition-delay: 80ms;\n  transition-delay: 80ms;\n  opacity: 0;\n}\n.mdc-chip-set--filter .mdc-chip__icon--leading + .mdc-chip__checkmark .mdc-chip__checkmark-svg {\n  -webkit-transition: width 0ms;\n  transition: width 0ms;\n}\n.mdc-chip-set--filter .mdc-chip--selected .mdc-chip__icon--leading {\n  opacity: 0;\n}\n.mdc-chip-set--filter .mdc-chip--selected .mdc-chip__icon--leading + .mdc-chip__checkmark {\n  width: 0;\n  opacity: 1;\n}\n.mdc-chip-set--filter .mdc-chip__icon--leading-hidden.mdc-chip__icon--leading {\n  width: 0;\n  opacity: 0;\n}\n.mdc-chip-set--filter .mdc-chip__icon--leading-hidden.mdc-chip__icon--leading + .mdc-chip__checkmark {\n  width: 1.25rem;\n}\n\n\@-webkit-keyframes mdc-chip-entry {\n  from {\n    -webkit-transform: scale(0.8);\n    transform: scale(0.8);\n    opacity: 0.4;\n  }\n  to {\n    -webkit-transform: scale(1);\n    transform: scale(1);\n    opacity: 1;\n  }\n}\n\n\@keyframes mdc-chip-entry {\n  from {\n    -webkit-transform: scale(0.8);\n    transform: scale(0.8);\n    opacity: 0.4;\n  }\n  to {\n    -webkit-transform: scale(1);\n    transform: scale(1);\n    opacity: 1;\n  }\n}\n.mdc-chip-set {\n  padding: 0.25rem;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-wrap: wrap;\n  flex-wrap: wrap;\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box;\n}\n.mdc-chip-set .mdc-chip {\n  margin: 0.25rem;\n}\n\n.mdc-chip-set--input .mdc-chip {\n  -webkit-animation: mdc-chip-entry 100ms cubic-bezier(0, 0, 0.2, 1);\n  animation: mdc-chip-entry 100ms cubic-bezier(0, 0, 0.2, 1);\n}\n\n.mdc-floating-label {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.875rem;\n  line-height: 1.125rem;\n  font-weight: 400;\n  letter-spacing: 0.009375em;\n  text-decoration: inherit;\n  text-transform: inherit;\n  position: absolute;\n  /* \@noflip */\n  left: 0;\n  /* \@noflip */\n  -webkit-transform-origin: left top;\n  transform-origin: left top;\n  -webkit-transition: color 150ms cubic-bezier(0.4, 0, 0.2, 1), -webkit-transform 150ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: color 150ms cubic-bezier(0.4, 0, 0.2, 1), -webkit-transform 150ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1), color 150ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1), color 150ms cubic-bezier(0.4, 0, 0.2, 1), -webkit-transform 150ms cubic-bezier(0.4, 0, 0.2, 1);\n  /* \@alternate */\n  line-height: 1.15rem;\n  text-align: left;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  cursor: text;\n  overflow: hidden;\n  will-change: transform;\n}\n[dir=rtl] .mdc-floating-label, .mdc-floating-label[dir=rtl] {\n  /* \@noflip */\n  right: 0;\n  /* \@noflip */\n  left: auto;\n  /* \@noflip */\n  -webkit-transform-origin: right top;\n  transform-origin: right top;\n  /* \@noflip */\n  text-align: right;\n}\n\n.mdc-floating-label--float-above, .force-float {\n  cursor: auto;\n}\n\n.mdc-floating-label--float-above, .force-float {\n  -webkit-transform: translateY(-50%) scale(0.75);\n  transform: translateY(-50%) scale(0.75);\n}\n\n.mdc-floating-label--shake {\n  -webkit-animation: mdc-floating-label-shake-float-above-standard 250ms 1;\n  animation: mdc-floating-label-shake-float-above-standard 250ms 1;\n}\n\n\@-webkit-keyframes mdc-floating-label-shake-float-above-standard {\n  0% {\n    -webkit-transform: translateX(calc(0 - 0%)) translateY(-50%) scale(0.75);\n    transform: translateX(calc(0 - 0%)) translateY(-50%) scale(0.75);\n  }\n  33% {\n    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.701732, 0.495819);\n    animation-timing-function: cubic-bezier(0.5, 0, 0.701732, 0.495819);\n    -webkit-transform: translateX(calc(4% - 0%)) translateY(-50%) scale(0.75);\n    transform: translateX(calc(4% - 0%)) translateY(-50%) scale(0.75);\n  }\n  66% {\n    -webkit-animation-timing-function: cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);\n    animation-timing-function: cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);\n    -webkit-transform: translateX(calc(-4% - 0%)) translateY(-50%) scale(0.75);\n    transform: translateX(calc(-4% - 0%)) translateY(-50%) scale(0.75);\n  }\n  100% {\n    -webkit-transform: translateX(calc(0 - 0%)) translateY(-50%) scale(0.75);\n    transform: translateX(calc(0 - 0%)) translateY(-50%) scale(0.75);\n  }\n}\n\n\@keyframes mdc-floating-label-shake-float-above-standard {\n  0% {\n    -webkit-transform: translateX(calc(0 - 0%)) translateY(-50%) scale(0.75);\n    transform: translateX(calc(0 - 0%)) translateY(-50%) scale(0.75);\n  }\n  33% {\n    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.701732, 0.495819);\n    animation-timing-function: cubic-bezier(0.5, 0, 0.701732, 0.495819);\n    -webkit-transform: translateX(calc(4% - 0%)) translateY(-50%) scale(0.75);\n    transform: translateX(calc(4% - 0%)) translateY(-50%) scale(0.75);\n  }\n  66% {\n    -webkit-animation-timing-function: cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);\n    animation-timing-function: cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);\n    -webkit-transform: translateX(calc(-4% - 0%)) translateY(-50%) scale(0.75);\n    transform: translateX(calc(-4% - 0%)) translateY(-50%) scale(0.75);\n  }\n  100% {\n    -webkit-transform: translateX(calc(0 - 0%)) translateY(-50%) scale(0.75);\n    transform: translateX(calc(0 - 0%)) translateY(-50%) scale(0.75);\n  }\n}\n.mdc-line-ripple {\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  height: 0.125rem;\n  -webkit-transform: scaleX(0);\n  transform: scaleX(0);\n  -webkit-transition: opacity 180ms cubic-bezier(0.4, 0, 0.2, 1), -webkit-transform 180ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: opacity 180ms cubic-bezier(0.4, 0, 0.2, 1), -webkit-transform 180ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: transform 180ms cubic-bezier(0.4, 0, 0.2, 1), opacity 180ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: transform 180ms cubic-bezier(0.4, 0, 0.2, 1), opacity 180ms cubic-bezier(0.4, 0, 0.2, 1), -webkit-transform 180ms cubic-bezier(0.4, 0, 0.2, 1);\n  opacity: 0;\n  z-index: 2;\n}\n\n.mdc-line-ripple--active {\n  -webkit-transform: scaleX(1);\n  transform: scaleX(1);\n  opacity: 1;\n}\n\n.mdc-line-ripple--deactivating {\n  opacity: 0;\n}\n\n.mdc-notched-outline {\n  display: -ms-flexbox;\n  display: flex;\n  position: absolute;\n  right: 0;\n  left: 0;\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box;\n  width: 100%;\n  max-width: 100%;\n  height: 100%;\n  /* \@noflip */\n  text-align: left;\n  pointer-events: none;\n}\n[dir=rtl] .mdc-notched-outline, .mdc-notched-outline[dir=rtl] {\n  /* \@noflip */\n  text-align: right;\n}\n.mdc-notched-outline__leading, .mdc-notched-outline__notch, .mdc-notched-outline__trailing {\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box;\n  height: 100%;\n  -webkit-transition: border 150ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: border 150ms cubic-bezier(0.4, 0, 0.2, 1);\n  border-top: 0.0625rem solid;\n  border-bottom: 0.0625rem solid;\n  pointer-events: none;\n}\n.mdc-notched-outline__leading {\n  /* \@noflip */\n  border-left: 0.0625rem solid;\n  /* \@noflip */\n  border-right: none;\n  width: 0.75rem;\n}\n[dir=rtl] .mdc-notched-outline__leading, .mdc-notched-outline__leading[dir=rtl] {\n  /* \@noflip */\n  border-left: none;\n  /* \@noflip */\n  border-right: 0.0625rem solid;\n}\n.mdc-notched-outline__trailing {\n  /* \@noflip */\n  border-left: none;\n  /* \@noflip */\n  border-right: 0.0625rem solid;\n  -ms-flex-positive: 1;\n  flex-grow: 1;\n}\n[dir=rtl] .mdc-notched-outline__trailing, .mdc-notched-outline__trailing[dir=rtl] {\n  /* \@noflip */\n  border-left: 0.0625rem solid;\n  /* \@noflip */\n  border-right: none;\n}\n.mdc-notched-outline__notch {\n  -ms-flex: 0 0 auto;\n  flex: 0 0 auto;\n  width: auto;\n  max-width: calc(100% - 0.75rem * 2);\n}\n.mdc-notched-outline .mdc-floating-label {\n  display: inline-block;\n  position: relative;\n  top: 1.0625rem;\n  bottom: auto;\n  max-width: 100%;\n}\n.mdc-notched-outline .mdc-floating-label--float-above, .mdc-notched-outline .force-float {\n  text-overflow: clip;\n}\n.mdc-notched-outline--upgraded .mdc-floating-label--float-above, .mdc-notched-outline--upgraded .force-float {\n  max-width: calc(100% / .75);\n}\n\n.mdc-notched-outline--notched .mdc-notched-outline__notch {\n  /* \@noflip */\n  padding-left: 0;\n  /* \@noflip */\n  padding-right: 0.5rem;\n  border-top: none;\n}\n[dir=rtl] .mdc-notched-outline--notched .mdc-notched-outline__notch, .mdc-notched-outline--notched .mdc-notched-outline__notch[dir=rtl] {\n  /* \@noflip */\n  padding-left: 0.5rem;\n  /* \@noflip */\n  padding-right: 0;\n}\n\n.mdc-notched-outline--no-label .mdc-notched-outline__notch {\n  padding: 0;\n}\n\n.mdc-text-field-helper-text {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.6875rem;\n  line-height: 0.875rem;\n  font-weight: 400;\n  letter-spacing: 0.0333333333em;\n  text-decoration: inherit;\n  text-transform: inherit;\n  display: block;\n  margin-top: 0;\n  /* \@alternate */\n  line-height: normal;\n  margin: 0;\n  -webkit-transition: opacity 150ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: opacity 150ms cubic-bezier(0.4, 0, 0.2, 1);\n  opacity: 0;\n  will-change: opacity;\n}\n.mdc-text-field-helper-text::before {\n  display: inline-block;\n  width: 0;\n  height: 1rem;\n  content: \"\";\n  vertical-align: 0;\n}\n\n.mdc-text-field-helper-text--persistent {\n  -webkit-transition: none;\n  transition: none;\n  opacity: 1;\n  will-change: initial;\n}\n\n.mdc-text-field-character-counter {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.6875rem;\n  line-height: 0.875rem;\n  font-weight: 400;\n  letter-spacing: 0.0333333333em;\n  text-decoration: inherit;\n  text-transform: inherit;\n  display: block;\n  margin-top: 0;\n  /* \@alternate */\n  line-height: normal;\n  /* \@noflip */\n  margin-left: auto;\n  /* \@noflip */\n  margin-right: 0;\n  /* \@noflip */\n  padding-left: 1rem;\n  /* \@noflip */\n  padding-right: 0;\n  white-space: nowrap;\n}\n.mdc-text-field-character-counter::before {\n  display: inline-block;\n  width: 0;\n  height: 1rem;\n  content: \"\";\n  vertical-align: 0;\n}\n[dir=rtl] .mdc-text-field-character-counter, .mdc-text-field-character-counter[dir=rtl] {\n  /* \@noflip */\n  margin-left: 0;\n  /* \@noflip */\n  margin-right: auto;\n}\n[dir=rtl] .mdc-text-field-character-counter, .mdc-text-field-character-counter[dir=rtl] {\n  /* \@noflip */\n  padding-left: 0;\n  /* \@noflip */\n  padding-right: 1rem;\n}\n\n.mdc-text-field--with-leading-icon .mdc-text-field__icon,\n.mdc-text-field--with-trailing-icon .mdc-text-field__icon {\n  position: absolute;\n  bottom: 1rem;\n  cursor: pointer;\n}\n\n.mdc-text-field__icon:not([tabindex]),\n.mdc-text-field__icon[tabindex=\"-1\"] {\n  cursor: default;\n  pointer-events: none;\n}\n\n.mdc-text-field {\n  --mdc-ripple-fg-size: 0;\n  --mdc-ripple-left: 0;\n  --mdc-ripple-top: 0;\n  --mdc-ripple-fg-scale: 1;\n  --mdc-ripple-fg-translate-end: 0;\n  --mdc-ripple-fg-translate-start: 0;\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n  border-radius: 0.25rem 0.25rem 0 0;\n  display: -ms-inline-flexbox;\n  display: inline-flex;\n  position: relative;\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box;\n  height: 3.5rem;\n  overflow: hidden;\n  /* \@alternate */\n  will-change: opacity, transform, color;\n}\n.mdc-text-field::before, .mdc-text-field::after {\n  position: absolute;\n  border-radius: 50%;\n  opacity: 0;\n  pointer-events: none;\n  content: \"\";\n}\n.mdc-text-field::before {\n  -webkit-transition: opacity 15ms linear, background-color 15ms linear;\n  transition: opacity 15ms linear, background-color 15ms linear;\n  z-index: 1;\n}\n.mdc-text-field.mdc-ripple-upgraded::before {\n  -webkit-transform: scale(var(--mdc-ripple-fg-scale, 1));\n  transform: scale(var(--mdc-ripple-fg-scale, 1));\n}\n.mdc-text-field.mdc-ripple-upgraded::after {\n  top: 0;\n  /* \@noflip */\n  left: 0;\n  -webkit-transform: scale(0);\n  transform: scale(0);\n  -webkit-transform-origin: center center;\n  transform-origin: center center;\n}\n.mdc-text-field.mdc-ripple-upgraded--unbounded::after {\n  top: var(--mdc-ripple-top, 0);\n  /* \@noflip */\n  left: var(--mdc-ripple-left, 0);\n}\n.mdc-text-field.mdc-ripple-upgraded--foreground-activation::after {\n  -webkit-animation: mdc-ripple-fg-radius-in 225ms forwards, mdc-ripple-fg-opacity-in 75ms forwards;\n  animation: mdc-ripple-fg-radius-in 225ms forwards, mdc-ripple-fg-opacity-in 75ms forwards;\n}\n.mdc-text-field.mdc-ripple-upgraded--foreground-deactivation::after {\n  -webkit-animation: mdc-ripple-fg-opacity-out 150ms;\n  animation: mdc-ripple-fg-opacity-out 150ms;\n  -webkit-transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1));\n  transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1));\n}\n.mdc-text-field::before, .mdc-text-field::after {\n  background-color: rgba(0, 0, 0, 0.87);\n}\n.mdc-text-field:hover::before {\n  opacity: 0.04;\n}\n.mdc-text-field:not(.mdc-ripple-upgraded):focus::before, .mdc-text-field.mdc-ripple-upgraded--background-focused::before {\n  -webkit-transition-duration: 75ms;\n  transition-duration: 75ms;\n  opacity: 0.12;\n}\n.mdc-text-field::before, .mdc-text-field::after {\n  top: calc(50% - 100%);\n  /* \@noflip */\n  left: calc(50% - 100%);\n  width: 200%;\n  height: 200%;\n}\n.mdc-text-field.mdc-ripple-upgraded::after {\n  width: var(--mdc-ripple-fg-size, 100%);\n  height: var(--mdc-ripple-fg-size, 100%);\n}\n.mdc-text-field:not(.mdc-text-field--disabled) .mdc-floating-label {\n  color: rgba(0, 0, 0, 0.6);\n}\n.mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__input {\n  color: rgba(0, 0, 0, 0.87);\n}\n.mdc-text-field .mdc-text-field__input {\n  caret-color: #26a69a;\n  /* \@alternate */\n  caret-color: var(--mdc-theme-primary, #26a69a);\n}\n.mdc-text-field:not(.mdc-text-field--disabled):not(.mdc-text-field--outlined):not(.mdc-text-field--textarea) .mdc-text-field__input {\n  border-bottom-color: rgba(0, 0, 0, 0.12);\n}\n.mdc-text-field:not(.mdc-text-field--disabled):not(.mdc-text-field--outlined):not(.mdc-text-field--textarea) .mdc-text-field__input:hover {\n  border-bottom-color: rgba(0, 0, 0, 0.12);\n}\n.mdc-text-field .mdc-line-ripple {\n  background-color: #26a69a;\n  /* \@alternate */\n  background-color: var(--mdc-theme-primary, #26a69a);\n}\n.mdc-text-field:not(.mdc-text-field--disabled):not(.mdc-text-field--textarea) {\n  border-bottom-color: rgba(0, 0, 0, 0.12);\n}\n.mdc-text-field:not(.mdc-text-field--disabled) + .mdc-text-field-helper-line .mdc-text-field-helper-text {\n  color: rgba(0, 0, 0, 0.6);\n}\n.mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field-character-counter,\n.mdc-text-field:not(.mdc-text-field--disabled) + .mdc-text-field-helper-line .mdc-text-field-character-counter {\n  color: rgba(0, 0, 0, 0.6);\n}\n.mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__icon {\n  color: rgba(0, 0, 0, 0.54);\n}\n.mdc-text-field:not(.mdc-text-field--disabled) {\n  background-color: #fff;\n}\n.mdc-text-field .mdc-floating-label {\n  /* \@noflip */\n  left: 1rem;\n  /* \@noflip */\n  right: initial;\n  top: 1.125rem;\n  pointer-events: none;\n}\n[dir=rtl] .mdc-text-field .mdc-floating-label, .mdc-text-field .mdc-floating-label[dir=rtl] {\n  /* \@noflip */\n  left: initial;\n  /* \@noflip */\n  right: 1rem;\n}\n.mdc-text-field--textarea .mdc-floating-label {\n  /* \@noflip */\n  left: 0.25rem;\n  /* \@noflip */\n  right: initial;\n}\n[dir=rtl] .mdc-text-field--textarea .mdc-floating-label, .mdc-text-field--textarea .mdc-floating-label[dir=rtl] {\n  /* \@noflip */\n  left: initial;\n  /* \@noflip */\n  right: 0.25rem;\n}\n.mdc-text-field--outlined .mdc-floating-label {\n  /* \@noflip */\n  left: 0.25rem;\n  /* \@noflip */\n  right: initial;\n  top: 1.0625rem;\n}\n[dir=rtl] .mdc-text-field--outlined .mdc-floating-label, .mdc-text-field--outlined .mdc-floating-label[dir=rtl] {\n  /* \@noflip */\n  left: initial;\n  /* \@noflip */\n  right: 0.25rem;\n}\n.mdc-text-field--outlined--with-leading-icon .mdc-floating-label {\n  /* \@noflip */\n  left: 2.25rem;\n  /* \@noflip */\n  right: initial;\n}\n[dir=rtl] .mdc-text-field--outlined--with-leading-icon .mdc-floating-label, .mdc-text-field--outlined--with-leading-icon .mdc-floating-label[dir=rtl] {\n  /* \@noflip */\n  left: initial;\n  /* \@noflip */\n  right: 2.25rem;\n}\n.mdc-text-field--outlined--with-leading-icon .mdc-floating-label--float-above, .mdc-text-field--outlined--with-leading-icon .force-float {\n  /* \@noflip */\n  left: 2.5rem;\n  /* \@noflip */\n  right: initial;\n}\n[dir=rtl] .mdc-text-field--outlined--with-leading-icon .mdc-floating-label--float-above, [dir=rtl] .mdc-text-field--outlined--with-leading-icon .force-float, .mdc-text-field--outlined--with-leading-icon .mdc-floating-label--float-above[dir=rtl], .mdc-text-field--outlined--with-leading-icon [dir=rtl].force-float {\n  /* \@noflip */\n  left: initial;\n  /* \@noflip */\n  right: 2.5rem;\n}\n\n.mdc-text-field__input {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.875rem;\n  line-height: 1.125rem;\n  font-weight: 400;\n  letter-spacing: 0.009375em;\n  text-decoration: inherit;\n  text-transform: inherit;\n  -ms-flex-item-align: end;\n  align-self: flex-end;\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box;\n  width: 100%;\n  height: 100%;\n  padding: 1.25rem 1rem 0.375rem;\n  -webkit-transition: opacity 150ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: opacity 150ms cubic-bezier(0.4, 0, 0.2, 1);\n  border: none;\n  border-bottom: 0.0625rem solid;\n  border-radius: 0;\n  background: none;\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  appearance: none;\n}\n.mdc-text-field__input::-webkit-input-placeholder {\n  -webkit-transition: opacity 67ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: opacity 67ms cubic-bezier(0.4, 0, 0.2, 1);\n  opacity: 0;\n  color: rgba(0, 0, 0, 0.54);\n}\n.mdc-text-field__input::-moz-placeholder {\n  -webkit-transition: opacity 67ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: opacity 67ms cubic-bezier(0.4, 0, 0.2, 1);\n  opacity: 0;\n  color: rgba(0, 0, 0, 0.54);\n}\n.mdc-text-field__input:-ms-input-placeholder {\n  -webkit-transition: opacity 67ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: opacity 67ms cubic-bezier(0.4, 0, 0.2, 1);\n  opacity: 0;\n  color: rgba(0, 0, 0, 0.54);\n}\n.mdc-text-field__input::-ms-input-placeholder {\n  -webkit-transition: opacity 67ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: opacity 67ms cubic-bezier(0.4, 0, 0.2, 1);\n  opacity: 0;\n  color: rgba(0, 0, 0, 0.54);\n}\n.mdc-text-field__input::placeholder {\n  -webkit-transition: opacity 67ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: opacity 67ms cubic-bezier(0.4, 0, 0.2, 1);\n  opacity: 0;\n  color: rgba(0, 0, 0, 0.54);\n}\n.mdc-text-field__input:-ms-input-placeholder {\n  color: rgba(0, 0, 0, 0.54) !important;\n}\n.mdc-text-field--fullwidth .mdc-text-field__input::-webkit-input-placeholder, .mdc-text-field--no-label .mdc-text-field__input::-webkit-input-placeholder, .mdc-text-field--focused .mdc-text-field__input::-webkit-input-placeholder {\n  -webkit-transition-delay: 40ms;\n  transition-delay: 40ms;\n  -webkit-transition-duration: 110ms;\n  transition-duration: 110ms;\n  opacity: 1;\n}\n.mdc-text-field--fullwidth .mdc-text-field__input::-moz-placeholder, .mdc-text-field--no-label .mdc-text-field__input::-moz-placeholder, .mdc-text-field--focused .mdc-text-field__input::-moz-placeholder {\n  transition-delay: 40ms;\n  transition-duration: 110ms;\n  opacity: 1;\n}\n.mdc-text-field--fullwidth .mdc-text-field__input:-ms-input-placeholder, .mdc-text-field--no-label .mdc-text-field__input:-ms-input-placeholder, .mdc-text-field--focused .mdc-text-field__input:-ms-input-placeholder {\n  transition-delay: 40ms;\n  transition-duration: 110ms;\n  opacity: 1;\n}\n.mdc-text-field--fullwidth .mdc-text-field__input::-ms-input-placeholder, .mdc-text-field--no-label .mdc-text-field__input::-ms-input-placeholder, .mdc-text-field--focused .mdc-text-field__input::-ms-input-placeholder {\n  transition-delay: 40ms;\n  transition-duration: 110ms;\n  opacity: 1;\n}\n.mdc-text-field--fullwidth .mdc-text-field__input::placeholder, .mdc-text-field--no-label .mdc-text-field__input::placeholder, .mdc-text-field--focused .mdc-text-field__input::placeholder {\n  -webkit-transition-delay: 40ms;\n  transition-delay: 40ms;\n  -webkit-transition-duration: 110ms;\n  transition-duration: 110ms;\n  opacity: 1;\n}\n.mdc-text-field__input:focus {\n  outline: none;\n}\n.mdc-text-field__input:invalid {\n  -webkit-box-shadow: none;\n  box-shadow: none;\n}\n.mdc-text-field__input:-webkit-autofill {\n  z-index: auto !important;\n}\n.mdc-text-field--no-label:not(.mdc-text-field--outlined):not(.mdc-text-field--textarea) .mdc-text-field__input {\n  padding: 1rem;\n}\n\n.mdc-text-field__input:-webkit-autofill + .mdc-floating-label {\n  -webkit-transform: translateY(-50%) scale(0.75);\n  transform: translateY(-50%) scale(0.75);\n  cursor: auto;\n}\n\n.mdc-text-field--outlined {\n  border: none;\n  overflow: visible;\n}\n.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-notched-outline__leading,\n.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-notched-outline__notch,\n.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-notched-outline__trailing {\n  border-color: rgba(0, 0, 0, 0.24);\n}\n.mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__input:hover ~ .mdc-notched-outline .mdc-notched-outline__leading,\n.mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__input:hover ~ .mdc-notched-outline .mdc-notched-outline__notch,\n.mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__input:hover ~ .mdc-notched-outline .mdc-notched-outline__trailing,\n.mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__icon:hover ~ .mdc-notched-outline .mdc-notched-outline__leading,\n.mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__icon:hover ~ .mdc-notched-outline .mdc-notched-outline__notch,\n.mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__icon:hover ~ .mdc-notched-outline .mdc-notched-outline__trailing {\n  border-color: rgba(0, 0, 0, 0.87);\n}\n.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__leading,\n.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__notch,\n.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__trailing {\n  border-color: #26a69a;\n  /* \@alternate */\n  border-color: var(--mdc-theme-primary, #26a69a);\n}\n.mdc-text-field--outlined .mdc-floating-label--shake {\n  -webkit-animation: mdc-floating-label-shake-float-above-text-field-outlined 250ms 1;\n  animation: mdc-floating-label-shake-float-above-text-field-outlined 250ms 1;\n}\n.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__leading {\n  /* \@noflip */\n  border-radius: 0.25rem 0 0 0.25rem;\n}\n[dir=rtl] .mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__leading, .mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__leading[dir=rtl] {\n  /* \@noflip */\n  border-radius: 0 0.25rem 0.25rem 0;\n}\n.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__trailing {\n  /* \@noflip */\n  border-radius: 0 0.25rem 0.25rem 0;\n}\n[dir=rtl] .mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__trailing, .mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__trailing[dir=rtl] {\n  /* \@noflip */\n  border-radius: 0.25rem 0 0 0.25rem;\n}\n.mdc-text-field--outlined .mdc-floating-label--float-above, .mdc-text-field--outlined .force-float {\n  -webkit-transform: translateY(-144%) scale(1);\n  transform: translateY(-144%) scale(1);\n}\n.mdc-text-field--outlined .mdc-floating-label--float-above, .mdc-text-field--outlined .force-float {\n  font-size: 0.75rem;\n}\n.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above, .mdc-text-field--outlined.mdc-notched-outline--upgraded .force-float,\n.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above,\n.mdc-text-field--outlined .mdc-notched-outline--upgraded .force-float {\n  -webkit-transform: translateY(-130%) scale(0.75);\n  transform: translateY(-130%) scale(0.75);\n}\n.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above, .mdc-text-field--outlined.mdc-notched-outline--upgraded .force-float,\n.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above,\n.mdc-text-field--outlined .mdc-notched-outline--upgraded .force-float {\n  font-size: 1rem;\n}\n.mdc-text-field--outlined::before, .mdc-text-field--outlined::after {\n  content: none;\n}\n.mdc-text-field--outlined:not(.mdc-text-field--disabled) {\n  background-color: transparent;\n}\n.mdc-text-field--outlined .mdc-text-field__input {\n  display: -ms-flexbox;\n  display: flex;\n  padding: 0.75rem 1rem 0.875rem;\n  border: none !important;\n  background-color: transparent;\n  z-index: 1;\n}\n.mdc-text-field--outlined .mdc-text-field__icon {\n  z-index: 2;\n}\n\n.mdc-text-field--outlined.mdc-text-field--focused .mdc-notched-outline__leading,\n.mdc-text-field--outlined.mdc-text-field--focused .mdc-notched-outline__notch,\n.mdc-text-field--outlined.mdc-text-field--focused .mdc-notched-outline__trailing {\n  border-width: 0.125rem;\n}\n\n.mdc-text-field--outlined.mdc-text-field--disabled {\n  background-color: transparent;\n}\n.mdc-text-field--outlined.mdc-text-field--disabled .mdc-notched-outline__leading,\n.mdc-text-field--outlined.mdc-text-field--disabled .mdc-notched-outline__notch,\n.mdc-text-field--outlined.mdc-text-field--disabled .mdc-notched-outline__trailing {\n  border-color: rgba(0, 0, 0, 0.06);\n}\n.mdc-text-field--outlined.mdc-text-field--disabled .mdc-text-field__input {\n  border-bottom: none;\n}\n\n.mdc-text-field--outlined.mdc-text-field--dense {\n  height: 3rem;\n}\n.mdc-text-field--outlined.mdc-text-field--dense .mdc-floating-label--float-above, .mdc-text-field--outlined.mdc-text-field--dense .force-float {\n  -webkit-transform: translateY(-134%) scale(1);\n  transform: translateY(-134%) scale(1);\n}\n.mdc-text-field--outlined.mdc-text-field--dense .mdc-floating-label--float-above, .mdc-text-field--outlined.mdc-text-field--dense .force-float {\n  font-size: 0.8rem;\n}\n.mdc-text-field--outlined.mdc-text-field--dense.mdc-notched-outline--upgraded .mdc-floating-label--float-above, .mdc-text-field--outlined.mdc-text-field--dense.mdc-notched-outline--upgraded .force-float,\n.mdc-text-field--outlined.mdc-text-field--dense .mdc-notched-outline--upgraded .mdc-floating-label--float-above,\n.mdc-text-field--outlined.mdc-text-field--dense .mdc-notched-outline--upgraded .force-float {\n  -webkit-transform: translateY(-120%) scale(0.8);\n  transform: translateY(-120%) scale(0.8);\n}\n.mdc-text-field--outlined.mdc-text-field--dense.mdc-notched-outline--upgraded .mdc-floating-label--float-above, .mdc-text-field--outlined.mdc-text-field--dense.mdc-notched-outline--upgraded .force-float,\n.mdc-text-field--outlined.mdc-text-field--dense .mdc-notched-outline--upgraded .mdc-floating-label--float-above,\n.mdc-text-field--outlined.mdc-text-field--dense .mdc-notched-outline--upgraded .force-float {\n  font-size: 1rem;\n}\n.mdc-text-field--outlined.mdc-text-field--dense .mdc-floating-label--shake {\n  -webkit-animation: mdc-floating-label-shake-float-above-text-field-outlined-dense 250ms 1;\n  animation: mdc-floating-label-shake-float-above-text-field-outlined-dense 250ms 1;\n}\n.mdc-text-field--outlined.mdc-text-field--dense .mdc-text-field__input {\n  padding: 0.75rem 0.75rem 0.4375rem;\n}\n.mdc-text-field--outlined.mdc-text-field--dense .mdc-floating-label {\n  top: 0.875rem;\n}\n.mdc-text-field--outlined.mdc-text-field--dense .mdc-text-field__icon {\n  top: 0.75rem;\n}\n\n.mdc-text-field--with-leading-icon .mdc-text-field__icon {\n  /* \@noflip */\n  left: 1rem;\n  /* \@noflip */\n  right: initial;\n}\n[dir=rtl] .mdc-text-field--with-leading-icon .mdc-text-field__icon, .mdc-text-field--with-leading-icon .mdc-text-field__icon[dir=rtl] {\n  /* \@noflip */\n  left: initial;\n  /* \@noflip */\n  right: 1rem;\n}\n.mdc-text-field--with-leading-icon .mdc-text-field__input {\n  /* \@noflip */\n  padding-left: 3rem;\n  /* \@noflip */\n  padding-right: 1rem;\n}\n[dir=rtl] .mdc-text-field--with-leading-icon .mdc-text-field__input, .mdc-text-field--with-leading-icon .mdc-text-field__input[dir=rtl] {\n  /* \@noflip */\n  padding-left: 1rem;\n  /* \@noflip */\n  padding-right: 3rem;\n}\n.mdc-text-field--with-leading-icon .mdc-floating-label {\n  /* \@noflip */\n  left: 3rem;\n  /* \@noflip */\n  right: initial;\n}\n[dir=rtl] .mdc-text-field--with-leading-icon .mdc-floating-label, .mdc-text-field--with-leading-icon .mdc-floating-label[dir=rtl] {\n  /* \@noflip */\n  left: initial;\n  /* \@noflip */\n  right: 3rem;\n}\n\n.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-text-field__icon {\n  /* \@noflip */\n  left: 1rem;\n  /* \@noflip */\n  right: initial;\n}\n[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-text-field__icon, .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-text-field__icon[dir=rtl] {\n  /* \@noflip */\n  left: initial;\n  /* \@noflip */\n  right: 1rem;\n}\n.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-text-field__input {\n  /* \@noflip */\n  padding-left: 3rem;\n  /* \@noflip */\n  padding-right: 1rem;\n}\n[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-text-field__input, .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-text-field__input[dir=rtl] {\n  /* \@noflip */\n  padding-left: 1rem;\n  /* \@noflip */\n  padding-right: 3rem;\n}\n.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label--float-above, .mdc-text-field--with-leading-icon.mdc-text-field--outlined .force-float {\n  -webkit-transform: translateY(-144%) translateX(-2rem) scale(1);\n  transform: translateY(-144%) translateX(-2rem) scale(1);\n}\n[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label--float-above, [dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--outlined .force-float, .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label--float-above[dir=rtl], .mdc-text-field--with-leading-icon.mdc-text-field--outlined [dir=rtl].force-float {\n  -webkit-transform: translateY(-144%) translateX(2rem) scale(1);\n  transform: translateY(-144%) translateX(2rem) scale(1);\n}\n.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label--float-above, .mdc-text-field--with-leading-icon.mdc-text-field--outlined .force-float {\n  font-size: 0.75rem;\n}\n.mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above, .mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-notched-outline--upgraded .force-float,\n.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above,\n.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-notched-outline--upgraded .force-float {\n  -webkit-transform: translateY(-130%) translateX(-2rem) scale(0.75);\n  transform: translateY(-130%) translateX(-2rem) scale(0.75);\n}\n[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above, [dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-notched-outline--upgraded .force-float, .mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above[dir=rtl], .mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-notched-outline--upgraded [dir=rtl].force-float,\n[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above,\n[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-notched-outline--upgraded .force-float,\n.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above[dir=rtl],\n.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-notched-outline--upgraded [dir=rtl].force-float {\n  -webkit-transform: translateY(-130%) translateX(2rem) scale(0.75);\n  transform: translateY(-130%) translateX(2rem) scale(0.75);\n}\n.mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above, .mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-notched-outline--upgraded .force-float,\n.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above,\n.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-notched-outline--upgraded .force-float {\n  font-size: 1rem;\n}\n.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label--shake {\n  -webkit-animation: mdc-floating-label-shake-float-above-text-field-outlined-leading-icon 250ms 1;\n  animation: mdc-floating-label-shake-float-above-text-field-outlined-leading-icon 250ms 1;\n}\n[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label--shake, .mdc-text-field--with-leading-icon.mdc-text-field--outlined[dir=rtl] .mdc-floating-label--shake {\n  -webkit-animation: mdc-floating-label-shake-float-above-text-field-outlined-leading-icon-rtl 250ms 1;\n  animation: mdc-floating-label-shake-float-above-text-field-outlined-leading-icon-rtl 250ms 1;\n}\n.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label {\n  /* \@noflip */\n  left: 2.25rem;\n  /* \@noflip */\n  right: initial;\n}\n[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label, .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label[dir=rtl] {\n  /* \@noflip */\n  left: initial;\n  /* \@noflip */\n  right: 2.25rem;\n}\n\n.mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense .mdc-floating-label--float-above, .mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense .force-float {\n  -webkit-transform: translateY(-134%) translateX(-1.3125rem) scale(1);\n  transform: translateY(-134%) translateX(-1.3125rem) scale(1);\n}\n[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense .mdc-floating-label--float-above, [dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense .force-float, .mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense .mdc-floating-label--float-above[dir=rtl], .mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense [dir=rtl].force-float {\n  -webkit-transform: translateY(-134%) translateX(1.3125rem) scale(1);\n  transform: translateY(-134%) translateX(1.3125rem) scale(1);\n}\n.mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense .mdc-floating-label--float-above, .mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense .force-float {\n  font-size: 0.8rem;\n}\n.mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense.mdc-notched-outline--upgraded .mdc-floating-label--float-above, .mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense.mdc-notched-outline--upgraded .force-float,\n.mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense .mdc-notched-outline--upgraded .mdc-floating-label--float-above,\n.mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense .mdc-notched-outline--upgraded .force-float {\n  -webkit-transform: translateY(-120%) translateX(-1.3125rem) scale(0.8);\n  transform: translateY(-120%) translateX(-1.3125rem) scale(0.8);\n}\n[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense.mdc-notched-outline--upgraded .mdc-floating-label--float-above, [dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense.mdc-notched-outline--upgraded .force-float, .mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense.mdc-notched-outline--upgraded .mdc-floating-label--float-above[dir=rtl], .mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense.mdc-notched-outline--upgraded [dir=rtl].force-float,\n[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense .mdc-notched-outline--upgraded .mdc-floating-label--float-above,\n[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense .mdc-notched-outline--upgraded .force-float,\n.mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense .mdc-notched-outline--upgraded .mdc-floating-label--float-above[dir=rtl],\n.mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense .mdc-notched-outline--upgraded [dir=rtl].force-float {\n  -webkit-transform: translateY(-120%) translateX(1.3125rem) scale(0.8);\n  transform: translateY(-120%) translateX(1.3125rem) scale(0.8);\n}\n.mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense.mdc-notched-outline--upgraded .mdc-floating-label--float-above, .mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense.mdc-notched-outline--upgraded .force-float,\n.mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense .mdc-notched-outline--upgraded .mdc-floating-label--float-above,\n.mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense .mdc-notched-outline--upgraded .force-float {\n  font-size: 1rem;\n}\n.mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense .mdc-floating-label--shake {\n  -webkit-animation: mdc-floating-label-shake-float-above-text-field-outlined-leading-icon-dense 250ms 1;\n  animation: mdc-floating-label-shake-float-above-text-field-outlined-leading-icon-dense 250ms 1;\n}\n[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense .mdc-floating-label--shake, .mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense[dir=rtl] .mdc-floating-label--shake {\n  -webkit-animation: mdc-floating-label-shake-float-above-text-field-outlined-leading-icon-dense-rtl 250ms 1;\n  animation: mdc-floating-label-shake-float-above-text-field-outlined-leading-icon-dense-rtl 250ms 1;\n}\n.mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense .mdc-floating-label {\n  /* \@noflip */\n  left: 2rem;\n  /* \@noflip */\n  right: initial;\n}\n[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense .mdc-floating-label, .mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense .mdc-floating-label[dir=rtl] {\n  /* \@noflip */\n  left: initial;\n  /* \@noflip */\n  right: 2rem;\n}\n\n.mdc-text-field--with-trailing-icon .mdc-text-field__icon {\n  /* \@noflip */\n  left: initial;\n  /* \@noflip */\n  right: 0.75rem;\n}\n[dir=rtl] .mdc-text-field--with-trailing-icon .mdc-text-field__icon, .mdc-text-field--with-trailing-icon .mdc-text-field__icon[dir=rtl] {\n  /* \@noflip */\n  left: 0.75rem;\n  /* \@noflip */\n  right: initial;\n}\n.mdc-text-field--with-trailing-icon .mdc-text-field__input {\n  /* \@noflip */\n  padding-left: 1rem;\n  /* \@noflip */\n  padding-right: 3rem;\n}\n[dir=rtl] .mdc-text-field--with-trailing-icon .mdc-text-field__input, .mdc-text-field--with-trailing-icon .mdc-text-field__input[dir=rtl] {\n  /* \@noflip */\n  padding-left: 3rem;\n  /* \@noflip */\n  padding-right: 1rem;\n}\n.mdc-text-field--with-trailing-icon.mdc-text-field--outlined .mdc-text-field__icon {\n  /* \@noflip */\n  left: initial;\n  /* \@noflip */\n  right: 1rem;\n}\n[dir=rtl] .mdc-text-field--with-trailing-icon.mdc-text-field--outlined .mdc-text-field__icon, .mdc-text-field--with-trailing-icon.mdc-text-field--outlined .mdc-text-field__icon[dir=rtl] {\n  /* \@noflip */\n  left: 1rem;\n  /* \@noflip */\n  right: initial;\n}\n.mdc-text-field--with-trailing-icon.mdc-text-field--outlined .mdc-text-field__input {\n  /* \@noflip */\n  padding-left: 1rem;\n  /* \@noflip */\n  padding-right: 3rem;\n}\n[dir=rtl] .mdc-text-field--with-trailing-icon.mdc-text-field--outlined .mdc-text-field__input, .mdc-text-field--with-trailing-icon.mdc-text-field--outlined .mdc-text-field__input[dir=rtl] {\n  /* \@noflip */\n  padding-left: 3rem;\n  /* \@noflip */\n  padding-right: 1rem;\n}\n\n.mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon .mdc-text-field__icon {\n  /* \@noflip */\n  left: 1rem;\n  /* \@noflip */\n  right: auto;\n}\n[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon .mdc-text-field__icon, .mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon .mdc-text-field__icon[dir=rtl] {\n  /* \@noflip */\n  left: auto;\n  /* \@noflip */\n  right: 1rem;\n}\n.mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon .mdc-text-field__icon ~ .mdc-text-field__icon {\n  /* \@noflip */\n  right: 0.75rem;\n  /* \@noflip */\n  left: auto;\n}\n[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon .mdc-text-field__icon ~ .mdc-text-field__icon, .mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon .mdc-text-field__icon ~ .mdc-text-field__icon[dir=rtl] {\n  /* \@noflip */\n  right: auto;\n  /* \@noflip */\n  left: 0.75rem;\n}\n.mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon .mdc-text-field__input {\n  /* \@noflip */\n  padding-left: 3rem;\n  /* \@noflip */\n  padding-right: 3rem;\n}\n[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon .mdc-text-field__input, .mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon .mdc-text-field__input[dir=rtl] {\n  /* \@noflip */\n  padding-left: 3rem;\n  /* \@noflip */\n  padding-right: 3rem;\n}\n\n.mdc-text-field--with-leading-icon.mdc-text-field--dense .mdc-text-field__icon,\n.mdc-text-field--with-trailing-icon.mdc-text-field--dense .mdc-text-field__icon {\n  bottom: 1rem;\n  -webkit-transform: scale(0.8);\n  transform: scale(0.8);\n}\n\n.mdc-text-field--with-leading-icon.mdc-text-field--dense .mdc-text-field__icon {\n  /* \@noflip */\n  left: 0.75rem;\n  /* \@noflip */\n  right: initial;\n}\n[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--dense .mdc-text-field__icon, .mdc-text-field--with-leading-icon.mdc-text-field--dense .mdc-text-field__icon[dir=rtl] {\n  /* \@noflip */\n  left: initial;\n  /* \@noflip */\n  right: 0.75rem;\n}\n.mdc-text-field--with-leading-icon.mdc-text-field--dense .mdc-text-field__input {\n  /* \@noflip */\n  padding-left: 2.75rem;\n  /* \@noflip */\n  padding-right: 1rem;\n}\n[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--dense .mdc-text-field__input, .mdc-text-field--with-leading-icon.mdc-text-field--dense .mdc-text-field__input[dir=rtl] {\n  /* \@noflip */\n  padding-left: 1rem;\n  /* \@noflip */\n  padding-right: 2.75rem;\n}\n.mdc-text-field--with-leading-icon.mdc-text-field--dense .mdc-floating-label {\n  /* \@noflip */\n  left: 2.75rem;\n  /* \@noflip */\n  right: initial;\n}\n[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--dense .mdc-floating-label, .mdc-text-field--with-leading-icon.mdc-text-field--dense .mdc-floating-label[dir=rtl] {\n  /* \@noflip */\n  left: initial;\n  /* \@noflip */\n  right: 2.75rem;\n}\n\n.mdc-text-field--with-trailing-icon.mdc-text-field--dense .mdc-text-field__icon {\n  /* \@noflip */\n  left: initial;\n  /* \@noflip */\n  right: 0.75rem;\n}\n[dir=rtl] .mdc-text-field--with-trailing-icon.mdc-text-field--dense .mdc-text-field__icon, .mdc-text-field--with-trailing-icon.mdc-text-field--dense .mdc-text-field__icon[dir=rtl] {\n  /* \@noflip */\n  left: 0.75rem;\n  /* \@noflip */\n  right: initial;\n}\n.mdc-text-field--with-trailing-icon.mdc-text-field--dense .mdc-text-field__input {\n  /* \@noflip */\n  padding-left: 1rem;\n  /* \@noflip */\n  padding-right: 2.75rem;\n}\n[dir=rtl] .mdc-text-field--with-trailing-icon.mdc-text-field--dense .mdc-text-field__input, .mdc-text-field--with-trailing-icon.mdc-text-field--dense .mdc-text-field__input[dir=rtl] {\n  /* \@noflip */\n  padding-left: 2.75rem;\n  /* \@noflip */\n  padding-right: 1rem;\n}\n\n.mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon.mdc-text-field--dense .mdc-text-field__icon {\n  /* \@noflip */\n  left: 0.75rem;\n  /* \@noflip */\n  right: auto;\n}\n[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon.mdc-text-field--dense .mdc-text-field__icon, .mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon.mdc-text-field--dense .mdc-text-field__icon[dir=rtl] {\n  /* \@noflip */\n  left: auto;\n  /* \@noflip */\n  right: 0.75rem;\n}\n.mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon.mdc-text-field--dense .mdc-text-field__icon ~ .mdc-text-field__icon {\n  /* \@noflip */\n  right: 0.75rem;\n  /* \@noflip */\n  left: auto;\n}\n[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon.mdc-text-field--dense .mdc-text-field__icon ~ .mdc-text-field__icon, .mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon.mdc-text-field--dense .mdc-text-field__icon ~ .mdc-text-field__icon[dir=rtl] {\n  /* \@noflip */\n  right: auto;\n  /* \@noflip */\n  left: 0.75rem;\n}\n.mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon.mdc-text-field--dense .mdc-text-field__input {\n  /* \@noflip */\n  padding-left: 2.75rem;\n  /* \@noflip */\n  padding-right: 2.75rem;\n}\n[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon.mdc-text-field--dense .mdc-text-field__input, .mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon.mdc-text-field--dense .mdc-text-field__input[dir=rtl] {\n  /* \@noflip */\n  padding-left: 2.75rem;\n  /* \@noflip */\n  padding-right: 2.75rem;\n}\n\n.mdc-text-field--dense .mdc-floating-label--float-above, .mdc-text-field--dense .force-float {\n  -webkit-transform: translateY(-70%) scale(0.8);\n  transform: translateY(-70%) scale(0.8);\n}\n.mdc-text-field--dense .mdc-floating-label--shake {\n  -webkit-animation: mdc-floating-label-shake-float-above-text-field-dense 250ms 1;\n  animation: mdc-floating-label-shake-float-above-text-field-dense 250ms 1;\n}\n.mdc-text-field--dense .mdc-text-field__input {\n  padding: 0.75rem 0.75rem 0;\n}\n.mdc-text-field--dense .mdc-floating-label {\n  font-size: 0.813rem;\n}\n.mdc-text-field--dense .mdc-floating-label--float-above, .mdc-text-field--dense .force-float {\n  font-size: 0.813rem;\n}\n\n.mdc-text-field__input:required ~ .mdc-floating-label::after,\n.mdc-text-field__input:required ~ .mdc-notched-outline .mdc-floating-label::after {\n  margin-left: 0.0625rem;\n  content: \"*\";\n}\n\n.mdc-text-field--textarea {\n  display: -ms-inline-flexbox;\n  display: inline-flex;\n  width: auto;\n  height: auto;\n  -webkit-transition: none;\n  transition: none;\n  overflow: visible;\n}\n.mdc-text-field--textarea:not(.mdc-text-field--disabled) .mdc-notched-outline__leading,\n.mdc-text-field--textarea:not(.mdc-text-field--disabled) .mdc-notched-outline__notch,\n.mdc-text-field--textarea:not(.mdc-text-field--disabled) .mdc-notched-outline__trailing {\n  border-color: rgba(0, 0, 0, 0.24);\n}\n.mdc-text-field--textarea:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__input:hover ~ .mdc-notched-outline .mdc-notched-outline__leading,\n.mdc-text-field--textarea:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__input:hover ~ .mdc-notched-outline .mdc-notched-outline__notch,\n.mdc-text-field--textarea:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__input:hover ~ .mdc-notched-outline .mdc-notched-outline__trailing,\n.mdc-text-field--textarea:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__icon:hover ~ .mdc-notched-outline .mdc-notched-outline__leading,\n.mdc-text-field--textarea:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__icon:hover ~ .mdc-notched-outline .mdc-notched-outline__notch,\n.mdc-text-field--textarea:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__icon:hover ~ .mdc-notched-outline .mdc-notched-outline__trailing {\n  border-color: rgba(0, 0, 0, 0.87);\n}\n.mdc-text-field--textarea:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__leading,\n.mdc-text-field--textarea:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__notch,\n.mdc-text-field--textarea:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__trailing {\n  border-color: #26a69a;\n  /* \@alternate */\n  border-color: var(--mdc-theme-primary, #26a69a);\n}\n.mdc-text-field--textarea .mdc-floating-label--shake {\n  -webkit-animation: mdc-floating-label-shake-float-above-text-field-outlined 250ms 1;\n  animation: mdc-floating-label-shake-float-above-text-field-outlined 250ms 1;\n}\n.mdc-text-field--textarea .mdc-notched-outline .mdc-notched-outline__leading {\n  /* \@noflip */\n  border-radius: 0.25rem 0 0 0.25rem;\n}\n[dir=rtl] .mdc-text-field--textarea .mdc-notched-outline .mdc-notched-outline__leading, .mdc-text-field--textarea .mdc-notched-outline .mdc-notched-outline__leading[dir=rtl] {\n  /* \@noflip */\n  border-radius: 0 0.25rem 0.25rem 0;\n}\n.mdc-text-field--textarea .mdc-notched-outline .mdc-notched-outline__trailing {\n  /* \@noflip */\n  border-radius: 0 0.25rem 0.25rem 0;\n}\n[dir=rtl] .mdc-text-field--textarea .mdc-notched-outline .mdc-notched-outline__trailing, .mdc-text-field--textarea .mdc-notched-outline .mdc-notched-outline__trailing[dir=rtl] {\n  /* \@noflip */\n  border-radius: 0.25rem 0 0 0.25rem;\n}\n.mdc-text-field--textarea::before, .mdc-text-field--textarea::after {\n  content: none;\n}\n.mdc-text-field--textarea:not(.mdc-text-field--disabled) {\n  background-color: transparent;\n}\n.mdc-text-field--textarea .mdc-floating-label--float-above, .mdc-text-field--textarea .force-float {\n  -webkit-transform: translateY(-144%) scale(1);\n  transform: translateY(-144%) scale(1);\n}\n.mdc-text-field--textarea .mdc-floating-label--float-above, .mdc-text-field--textarea .force-float {\n  font-size: 0.75rem;\n}\n.mdc-text-field--textarea.mdc-notched-outline--upgraded .mdc-floating-label--float-above, .mdc-text-field--textarea.mdc-notched-outline--upgraded .force-float,\n.mdc-text-field--textarea .mdc-notched-outline--upgraded .mdc-floating-label--float-above,\n.mdc-text-field--textarea .mdc-notched-outline--upgraded .force-float {\n  -webkit-transform: translateY(-130%) scale(0.75);\n  transform: translateY(-130%) scale(0.75);\n}\n.mdc-text-field--textarea.mdc-notched-outline--upgraded .mdc-floating-label--float-above, .mdc-text-field--textarea.mdc-notched-outline--upgraded .force-float,\n.mdc-text-field--textarea .mdc-notched-outline--upgraded .mdc-floating-label--float-above,\n.mdc-text-field--textarea .mdc-notched-outline--upgraded .force-float {\n  font-size: 1rem;\n}\n.mdc-text-field--textarea .mdc-text-field-character-counter {\n  /* \@noflip */\n  left: initial;\n  /* \@noflip */\n  right: 1rem;\n  position: absolute;\n  bottom: 0.8125rem;\n}\n[dir=rtl] .mdc-text-field--textarea .mdc-text-field-character-counter, .mdc-text-field--textarea .mdc-text-field-character-counter[dir=rtl] {\n  /* \@noflip */\n  left: 1rem;\n  /* \@noflip */\n  right: initial;\n}\n.mdc-text-field--textarea .mdc-text-field__input {\n  -ms-flex-item-align: auto;\n  align-self: auto;\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box;\n  height: auto;\n  margin: 0.5rem 0.0625rem 0.0625rem 0;\n  padding: 0 1rem 1rem;\n  border: none;\n}\n.mdc-text-field--textarea .mdc-text-field-character-counter + .mdc-text-field__input {\n  margin-bottom: 1.75rem;\n  padding-bottom: 0;\n}\n.mdc-text-field--textarea .mdc-floating-label {\n  top: 1.0625rem;\n  bottom: auto;\n  width: auto;\n  pointer-events: none;\n}\n.mdc-text-field--textarea.mdc-text-field--focused .mdc-notched-outline__leading,\n.mdc-text-field--textarea.mdc-text-field--focused .mdc-notched-outline__notch,\n.mdc-text-field--textarea.mdc-text-field--focused .mdc-notched-outline__trailing {\n  border-width: 0.125rem;\n}\n\n.mdc-text-field--fullwidth {\n  width: 100%;\n}\n.mdc-text-field--fullwidth:not(.mdc-text-field--textarea) {\n  display: block;\n}\n.mdc-text-field--fullwidth:not(.mdc-text-field--textarea)::before, .mdc-text-field--fullwidth:not(.mdc-text-field--textarea)::after {\n  content: none;\n}\n.mdc-text-field--fullwidth:not(.mdc-text-field--textarea):not(.mdc-text-field--disabled) {\n  background-color: transparent;\n}\n.mdc-text-field--fullwidth:not(.mdc-text-field--textarea) .mdc-text-field__input {\n  padding: 0;\n}\n.mdc-text-field--fullwidth.mdc-text-field--textarea .mdc-text-field__input {\n  resize: vertical;\n}\n\n.mdc-text-field--fullwidth.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--textarea), .mdc-text-field--fullwidth.force-invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--textarea) {\n  border-bottom-color: #b00020;\n  /* \@alternate */\n  border-bottom-color: var(--mdc-theme-error, #b00020);\n}\n\n.mdc-text-field-helper-line {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-pack: justify;\n  justify-content: space-between;\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box;\n}\n.mdc-text-field--dense + .mdc-text-field-helper-line {\n  margin-bottom: 0.25rem;\n}\n.mdc-text-field + .mdc-text-field-helper-line {\n  padding-right: 1rem;\n  padding-left: 1rem;\n}\n\n.mdc-form-field > .mdc-text-field + label {\n  -ms-flex-item-align: start;\n  align-self: flex-start;\n}\n\n.mdc-text-field--focused:not(.mdc-text-field--disabled) .mdc-floating-label {\n  color: rgba(38, 166, 154, 0.87);\n}\n.mdc-text-field--focused .mdc-text-field__input:required ~ .mdc-floating-label::after,\n.mdc-text-field--focused .mdc-text-field__input:required ~ .mdc-notched-outline .mdc-floating-label::after {\n  color: #b00020;\n  /* \@alternate */\n  color: var(--mdc-theme-error, #b00020);\n}\n.mdc-text-field--focused + .mdc-text-field-helper-line .mdc-text-field-helper-text:not(.mdc-text-field-helper-text--validation-msg) {\n  opacity: 1;\n}\n\n.mdc-text-field--textarea.mdc-text-field--focused:not(.mdc-text-field--disabled) .mdc-notched-outline__leading,\n.mdc-text-field--textarea.mdc-text-field--focused:not(.mdc-text-field--disabled) .mdc-notched-outline__notch,\n.mdc-text-field--textarea.mdc-text-field--focused:not(.mdc-text-field--disabled) .mdc-notched-outline__trailing {\n  border-color: #26a69a;\n  /* \@alternate */\n  border-color: var(--mdc-theme-primary, #26a69a);\n}\n\n.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--outlined):not(.mdc-text-field--textarea) .mdc-text-field__input, .force-invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--outlined):not(.mdc-text-field--textarea) .mdc-text-field__input {\n  border-bottom-color: #b00020;\n  /* \@alternate */\n  border-bottom-color: var(--mdc-theme-error, #b00020);\n}\n.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--outlined):not(.mdc-text-field--textarea) .mdc-text-field__input:hover, .force-invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--outlined):not(.mdc-text-field--textarea) .mdc-text-field__input:hover {\n  border-bottom-color: #b00020;\n  /* \@alternate */\n  border-bottom-color: var(--mdc-theme-error, #b00020);\n}\n.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-line-ripple, .force-invalid:not(.mdc-text-field--disabled) .mdc-line-ripple {\n  background-color: #b00020;\n  /* \@alternate */\n  background-color: var(--mdc-theme-error, #b00020);\n}\n.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-floating-label, .force-invalid:not(.mdc-text-field--disabled) .mdc-floating-label {\n  color: #b00020;\n  /* \@alternate */\n  color: var(--mdc-theme-error, #b00020);\n}\n.mdc-text-field--invalid:not(.mdc-text-field--disabled).mdc-text-field--invalid + .mdc-text-field-helper-line .mdc-text-field-helper-text--validation-msg, .force-invalid:not(.mdc-text-field--disabled) + .mdc-text-field-helper-line .mdc-text-field-helper-text--validation-msg {\n  color: #b00020;\n  /* \@alternate */\n  color: var(--mdc-theme-error, #b00020);\n}\n.mdc-text-field--invalid .mdc-text-field__input, .force-invalid .mdc-text-field__input {\n  caret-color: #b00020;\n  /* \@alternate */\n  caret-color: var(--mdc-theme-error, #b00020);\n}\n.mdc-text-field--invalid.mdc-text-field--with-trailing-icon:not(.mdc-text-field--with-leading-icon):not(.mdc-text-field--disabled) .mdc-text-field__icon, .mdc-text-field--with-trailing-icon.force-invalid:not(.mdc-text-field--with-leading-icon):not(.mdc-text-field--disabled) .mdc-text-field__icon {\n  color: #b00020;\n  /* \@alternate */\n  color: var(--mdc-theme-error, #b00020);\n}\n.mdc-text-field--invalid.mdc-text-field--with-trailing-icon.mdc-text-field--with-leading-icon:not(.mdc-text-field--disabled) .mdc-text-field__icon ~ .mdc-text-field__icon, .mdc-text-field--with-trailing-icon.mdc-text-field--with-leading-icon.force-invalid:not(.mdc-text-field--disabled) .mdc-text-field__icon ~ .mdc-text-field__icon {\n  color: #b00020;\n  /* \@alternate */\n  color: var(--mdc-theme-error, #b00020);\n}\n.mdc-text-field--invalid + .mdc-text-field-helper-line .mdc-text-field-helper-text--validation-msg, .force-invalid + .mdc-text-field-helper-line .mdc-text-field-helper-text--validation-msg {\n  opacity: 1;\n}\n\n.mdc-text-field--textarea.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-notched-outline__leading, .mdc-text-field--textarea.force-invalid:not(.mdc-text-field--disabled) .mdc-notched-outline__leading,\n.mdc-text-field--textarea.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-notched-outline__notch,\n.mdc-text-field--textarea.force-invalid:not(.mdc-text-field--disabled) .mdc-notched-outline__notch,\n.mdc-text-field--textarea.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-notched-outline__trailing,\n.mdc-text-field--textarea.force-invalid:not(.mdc-text-field--disabled) .mdc-notched-outline__trailing {\n  border-color: #b00020;\n  /* \@alternate */\n  border-color: var(--mdc-theme-error, #b00020);\n}\n.mdc-text-field--textarea.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__input:hover ~ .mdc-notched-outline .mdc-notched-outline__leading, .mdc-text-field--textarea.force-invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__input:hover ~ .mdc-notched-outline .mdc-notched-outline__leading,\n.mdc-text-field--textarea.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__input:hover ~ .mdc-notched-outline .mdc-notched-outline__notch,\n.mdc-text-field--textarea.force-invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__input:hover ~ .mdc-notched-outline .mdc-notched-outline__notch,\n.mdc-text-field--textarea.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__input:hover ~ .mdc-notched-outline .mdc-notched-outline__trailing,\n.mdc-text-field--textarea.force-invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__input:hover ~ .mdc-notched-outline .mdc-notched-outline__trailing,\n.mdc-text-field--textarea.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__icon:hover ~ .mdc-notched-outline .mdc-notched-outline__leading,\n.mdc-text-field--textarea.force-invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__icon:hover ~ .mdc-notched-outline .mdc-notched-outline__leading,\n.mdc-text-field--textarea.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__icon:hover ~ .mdc-notched-outline .mdc-notched-outline__notch,\n.mdc-text-field--textarea.force-invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__icon:hover ~ .mdc-notched-outline .mdc-notched-outline__notch,\n.mdc-text-field--textarea.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__icon:hover ~ .mdc-notched-outline .mdc-notched-outline__trailing,\n.mdc-text-field--textarea.force-invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__icon:hover ~ .mdc-notched-outline .mdc-notched-outline__trailing {\n  border-color: #b00020;\n  /* \@alternate */\n  border-color: var(--mdc-theme-error, #b00020);\n}\n.mdc-text-field--textarea.mdc-text-field--invalid:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__leading, .mdc-text-field--textarea.force-invalid:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__leading,\n.mdc-text-field--textarea.mdc-text-field--invalid:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__notch,\n.mdc-text-field--textarea.force-invalid:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__notch,\n.mdc-text-field--textarea.mdc-text-field--invalid:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__trailing,\n.mdc-text-field--textarea.force-invalid:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__trailing {\n  border-color: #b00020;\n  /* \@alternate */\n  border-color: var(--mdc-theme-error, #b00020);\n}\n\n.mdc-text-field--outlined.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-notched-outline__leading, .mdc-text-field--outlined.force-invalid:not(.mdc-text-field--disabled) .mdc-notched-outline__leading,\n.mdc-text-field--outlined.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-notched-outline__notch,\n.mdc-text-field--outlined.force-invalid:not(.mdc-text-field--disabled) .mdc-notched-outline__notch,\n.mdc-text-field--outlined.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-notched-outline__trailing,\n.mdc-text-field--outlined.force-invalid:not(.mdc-text-field--disabled) .mdc-notched-outline__trailing {\n  border-color: #b00020;\n  /* \@alternate */\n  border-color: var(--mdc-theme-error, #b00020);\n}\n.mdc-text-field--outlined.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__input:hover ~ .mdc-notched-outline .mdc-notched-outline__leading, .mdc-text-field--outlined.force-invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__input:hover ~ .mdc-notched-outline .mdc-notched-outline__leading,\n.mdc-text-field--outlined.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__input:hover ~ .mdc-notched-outline .mdc-notched-outline__notch,\n.mdc-text-field--outlined.force-invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__input:hover ~ .mdc-notched-outline .mdc-notched-outline__notch,\n.mdc-text-field--outlined.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__input:hover ~ .mdc-notched-outline .mdc-notched-outline__trailing,\n.mdc-text-field--outlined.force-invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__input:hover ~ .mdc-notched-outline .mdc-notched-outline__trailing,\n.mdc-text-field--outlined.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__icon:hover ~ .mdc-notched-outline .mdc-notched-outline__leading,\n.mdc-text-field--outlined.force-invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__icon:hover ~ .mdc-notched-outline .mdc-notched-outline__leading,\n.mdc-text-field--outlined.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__icon:hover ~ .mdc-notched-outline .mdc-notched-outline__notch,\n.mdc-text-field--outlined.force-invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__icon:hover ~ .mdc-notched-outline .mdc-notched-outline__notch,\n.mdc-text-field--outlined.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__icon:hover ~ .mdc-notched-outline .mdc-notched-outline__trailing,\n.mdc-text-field--outlined.force-invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__icon:hover ~ .mdc-notched-outline .mdc-notched-outline__trailing {\n  border-color: #b00020;\n  /* \@alternate */\n  border-color: var(--mdc-theme-error, #b00020);\n}\n.mdc-text-field--outlined.mdc-text-field--invalid:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__leading, .mdc-text-field--outlined.force-invalid:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__leading,\n.mdc-text-field--outlined.mdc-text-field--invalid:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__notch,\n.mdc-text-field--outlined.force-invalid:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__notch,\n.mdc-text-field--outlined.mdc-text-field--invalid:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__trailing,\n.mdc-text-field--outlined.force-invalid:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__trailing {\n  border-color: #b00020;\n  /* \@alternate */\n  border-color: var(--mdc-theme-error, #b00020);\n}\n\n.mdc-text-field--disabled {\n  background-color: #fafafa;\n  border-bottom: none;\n  pointer-events: none;\n}\n.mdc-text-field--disabled .mdc-text-field__input {\n  border-bottom-color: rgba(0, 0, 0, 0.06);\n}\n.mdc-text-field--disabled .mdc-text-field__input {\n  color: rgba(0, 0, 0, 0.37);\n}\n.mdc-text-field--disabled .mdc-floating-label {\n  color: rgba(0, 0, 0, 0.37);\n}\n.mdc-text-field--disabled + .mdc-text-field-helper-line .mdc-text-field-helper-text {\n  color: rgba(0, 0, 0, 0.37);\n}\n.mdc-text-field--disabled .mdc-text-field-character-counter,\n.mdc-text-field--disabled + .mdc-text-field-helper-line .mdc-text-field-character-counter {\n  color: rgba(0, 0, 0, 0.37);\n}\n.mdc-text-field--disabled .mdc-text-field__icon {\n  color: rgba(0, 0, 0, 0.3);\n}\n.mdc-text-field--disabled:not(.mdc-text-field--textarea) {\n  border-bottom-color: rgba(0, 0, 0, 0.12);\n}\n.mdc-text-field--disabled .mdc-floating-label {\n  cursor: default;\n}\n\n.mdc-text-field--textarea.mdc-text-field--disabled {\n  background-color: transparent;\n  /* \@alternate */\n  background-color: #f9f9f9;\n}\n.mdc-text-field--textarea.mdc-text-field--disabled .mdc-notched-outline__leading,\n.mdc-text-field--textarea.mdc-text-field--disabled .mdc-notched-outline__notch,\n.mdc-text-field--textarea.mdc-text-field--disabled .mdc-notched-outline__trailing {\n  border-color: rgba(0, 0, 0, 0.06);\n}\n.mdc-text-field--textarea.mdc-text-field--disabled .mdc-text-field__input {\n  border-bottom: none;\n}\n\n\@-webkit-keyframes mdc-floating-label-shake-float-above-text-field-dense {\n  0% {\n    -webkit-transform: translateX(calc(0 - 0%)) translateY(-70%) scale(0.8);\n    transform: translateX(calc(0 - 0%)) translateY(-70%) scale(0.8);\n  }\n  33% {\n    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.701732, 0.495819);\n    animation-timing-function: cubic-bezier(0.5, 0, 0.701732, 0.495819);\n    -webkit-transform: translateX(calc(4% - 0%)) translateY(-70%) scale(0.8);\n    transform: translateX(calc(4% - 0%)) translateY(-70%) scale(0.8);\n  }\n  66% {\n    -webkit-animation-timing-function: cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);\n    animation-timing-function: cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);\n    -webkit-transform: translateX(calc(-4% - 0%)) translateY(-70%) scale(0.8);\n    transform: translateX(calc(-4% - 0%)) translateY(-70%) scale(0.8);\n  }\n  100% {\n    -webkit-transform: translateX(calc(0 - 0%)) translateY(-70%) scale(0.8);\n    transform: translateX(calc(0 - 0%)) translateY(-70%) scale(0.8);\n  }\n}\n\n\@keyframes mdc-floating-label-shake-float-above-text-field-dense {\n  0% {\n    -webkit-transform: translateX(calc(0 - 0%)) translateY(-70%) scale(0.8);\n    transform: translateX(calc(0 - 0%)) translateY(-70%) scale(0.8);\n  }\n  33% {\n    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.701732, 0.495819);\n    animation-timing-function: cubic-bezier(0.5, 0, 0.701732, 0.495819);\n    -webkit-transform: translateX(calc(4% - 0%)) translateY(-70%) scale(0.8);\n    transform: translateX(calc(4% - 0%)) translateY(-70%) scale(0.8);\n  }\n  66% {\n    -webkit-animation-timing-function: cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);\n    animation-timing-function: cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);\n    -webkit-transform: translateX(calc(-4% - 0%)) translateY(-70%) scale(0.8);\n    transform: translateX(calc(-4% - 0%)) translateY(-70%) scale(0.8);\n  }\n  100% {\n    -webkit-transform: translateX(calc(0 - 0%)) translateY(-70%) scale(0.8);\n    transform: translateX(calc(0 - 0%)) translateY(-70%) scale(0.8);\n  }\n}\n\@-webkit-keyframes mdc-floating-label-shake-float-above-text-field-outlined {\n  0% {\n    -webkit-transform: translateX(calc(0 - 0%)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(0 - 0%)) translateY(-130%) scale(0.75);\n  }\n  33% {\n    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.701732, 0.495819);\n    animation-timing-function: cubic-bezier(0.5, 0, 0.701732, 0.495819);\n    -webkit-transform: translateX(calc(4% - 0%)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(4% - 0%)) translateY(-130%) scale(0.75);\n  }\n  66% {\n    -webkit-animation-timing-function: cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);\n    animation-timing-function: cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);\n    -webkit-transform: translateX(calc(-4% - 0%)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(-4% - 0%)) translateY(-130%) scale(0.75);\n  }\n  100% {\n    -webkit-transform: translateX(calc(0 - 0%)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(0 - 0%)) translateY(-130%) scale(0.75);\n  }\n}\n\@keyframes mdc-floating-label-shake-float-above-text-field-outlined {\n  0% {\n    -webkit-transform: translateX(calc(0 - 0%)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(0 - 0%)) translateY(-130%) scale(0.75);\n  }\n  33% {\n    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.701732, 0.495819);\n    animation-timing-function: cubic-bezier(0.5, 0, 0.701732, 0.495819);\n    -webkit-transform: translateX(calc(4% - 0%)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(4% - 0%)) translateY(-130%) scale(0.75);\n  }\n  66% {\n    -webkit-animation-timing-function: cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);\n    animation-timing-function: cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);\n    -webkit-transform: translateX(calc(-4% - 0%)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(-4% - 0%)) translateY(-130%) scale(0.75);\n  }\n  100% {\n    -webkit-transform: translateX(calc(0 - 0%)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(0 - 0%)) translateY(-130%) scale(0.75);\n  }\n}\n\@-webkit-keyframes mdc-floating-label-shake-float-above-text-field-outlined-dense {\n  0% {\n    -webkit-transform: translateX(calc(0 - 0%)) translateY(-120%) scale(0.8);\n    transform: translateX(calc(0 - 0%)) translateY(-120%) scale(0.8);\n  }\n  33% {\n    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.701732, 0.495819);\n    animation-timing-function: cubic-bezier(0.5, 0, 0.701732, 0.495819);\n    -webkit-transform: translateX(calc(4% - 0%)) translateY(-120%) scale(0.8);\n    transform: translateX(calc(4% - 0%)) translateY(-120%) scale(0.8);\n  }\n  66% {\n    -webkit-animation-timing-function: cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);\n    animation-timing-function: cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);\n    -webkit-transform: translateX(calc(-4% - 0%)) translateY(-120%) scale(0.8);\n    transform: translateX(calc(-4% - 0%)) translateY(-120%) scale(0.8);\n  }\n  100% {\n    -webkit-transform: translateX(calc(0 - 0%)) translateY(-120%) scale(0.8);\n    transform: translateX(calc(0 - 0%)) translateY(-120%) scale(0.8);\n  }\n}\n\@keyframes mdc-floating-label-shake-float-above-text-field-outlined-dense {\n  0% {\n    -webkit-transform: translateX(calc(0 - 0%)) translateY(-120%) scale(0.8);\n    transform: translateX(calc(0 - 0%)) translateY(-120%) scale(0.8);\n  }\n  33% {\n    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.701732, 0.495819);\n    animation-timing-function: cubic-bezier(0.5, 0, 0.701732, 0.495819);\n    -webkit-transform: translateX(calc(4% - 0%)) translateY(-120%) scale(0.8);\n    transform: translateX(calc(4% - 0%)) translateY(-120%) scale(0.8);\n  }\n  66% {\n    -webkit-animation-timing-function: cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);\n    animation-timing-function: cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);\n    -webkit-transform: translateX(calc(-4% - 0%)) translateY(-120%) scale(0.8);\n    transform: translateX(calc(-4% - 0%)) translateY(-120%) scale(0.8);\n  }\n  100% {\n    -webkit-transform: translateX(calc(0 - 0%)) translateY(-120%) scale(0.8);\n    transform: translateX(calc(0 - 0%)) translateY(-120%) scale(0.8);\n  }\n}\n\@-webkit-keyframes mdc-floating-label-shake-float-above-text-field-outlined-leading-icon {\n  0% {\n    -webkit-transform: translateX(calc(0 - 0)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(0 - 0)) translateY(-130%) scale(0.75);\n  }\n  33% {\n    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.701732, 0.495819);\n    animation-timing-function: cubic-bezier(0.5, 0, 0.701732, 0.495819);\n    -webkit-transform: translateX(calc(4% - 0)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(4% - 0)) translateY(-130%) scale(0.75);\n  }\n  66% {\n    -webkit-animation-timing-function: cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);\n    animation-timing-function: cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);\n    -webkit-transform: translateX(calc(-4% - 0)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(-4% - 0)) translateY(-130%) scale(0.75);\n  }\n  100% {\n    -webkit-transform: translateX(calc(0 - 0)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(0 - 0)) translateY(-130%) scale(0.75);\n  }\n}\n\@keyframes mdc-floating-label-shake-float-above-text-field-outlined-leading-icon {\n  0% {\n    -webkit-transform: translateX(calc(0 - 0)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(0 - 0)) translateY(-130%) scale(0.75);\n  }\n  33% {\n    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.701732, 0.495819);\n    animation-timing-function: cubic-bezier(0.5, 0, 0.701732, 0.495819);\n    -webkit-transform: translateX(calc(4% - 0)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(4% - 0)) translateY(-130%) scale(0.75);\n  }\n  66% {\n    -webkit-animation-timing-function: cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);\n    animation-timing-function: cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);\n    -webkit-transform: translateX(calc(-4% - 0)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(-4% - 0)) translateY(-130%) scale(0.75);\n  }\n  100% {\n    -webkit-transform: translateX(calc(0 - 0)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(0 - 0)) translateY(-130%) scale(0.75);\n  }\n}\n\@-webkit-keyframes mdc-floating-label-shake-float-above-text-field-outlined-leading-icon-dense {\n  0% {\n    -webkit-transform: translateX(calc(0 - 1.3125rem)) translateY(-120%) scale(0.8);\n    transform: translateX(calc(0 - 1.3125rem)) translateY(-120%) scale(0.8);\n  }\n  33% {\n    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.701732, 0.495819);\n    animation-timing-function: cubic-bezier(0.5, 0, 0.701732, 0.495819);\n    -webkit-transform: translateX(calc(4% - 1.3125rem)) translateY(-120%) scale(0.8);\n    transform: translateX(calc(4% - 1.3125rem)) translateY(-120%) scale(0.8);\n  }\n  66% {\n    -webkit-animation-timing-function: cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);\n    animation-timing-function: cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);\n    -webkit-transform: translateX(calc(-4% - 1.3125rem)) translateY(-120%) scale(0.8);\n    transform: translateX(calc(-4% - 1.3125rem)) translateY(-120%) scale(0.8);\n  }\n  100% {\n    -webkit-transform: translateX(calc(0 - 1.3125rem)) translateY(-120%) scale(0.8);\n    transform: translateX(calc(0 - 1.3125rem)) translateY(-120%) scale(0.8);\n  }\n}\n\@keyframes mdc-floating-label-shake-float-above-text-field-outlined-leading-icon-dense {\n  0% {\n    -webkit-transform: translateX(calc(0 - 1.3125rem)) translateY(-120%) scale(0.8);\n    transform: translateX(calc(0 - 1.3125rem)) translateY(-120%) scale(0.8);\n  }\n  33% {\n    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.701732, 0.495819);\n    animation-timing-function: cubic-bezier(0.5, 0, 0.701732, 0.495819);\n    -webkit-transform: translateX(calc(4% - 1.3125rem)) translateY(-120%) scale(0.8);\n    transform: translateX(calc(4% - 1.3125rem)) translateY(-120%) scale(0.8);\n  }\n  66% {\n    -webkit-animation-timing-function: cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);\n    animation-timing-function: cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);\n    -webkit-transform: translateX(calc(-4% - 1.3125rem)) translateY(-120%) scale(0.8);\n    transform: translateX(calc(-4% - 1.3125rem)) translateY(-120%) scale(0.8);\n  }\n  100% {\n    -webkit-transform: translateX(calc(0 - 1.3125rem)) translateY(-120%) scale(0.8);\n    transform: translateX(calc(0 - 1.3125rem)) translateY(-120%) scale(0.8);\n  }\n}\n\@-webkit-keyframes mdc-floating-label-shake-float-above-text-field-outlined-leading-icon-rtl {\n  0% {\n    -webkit-transform: translateX(calc(0 - 0)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(0 - 0)) translateY(-130%) scale(0.75);\n  }\n  33% {\n    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.701732, 0.495819);\n    animation-timing-function: cubic-bezier(0.5, 0, 0.701732, 0.495819);\n    -webkit-transform: translateX(calc(4% - 0)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(4% - 0)) translateY(-130%) scale(0.75);\n  }\n  66% {\n    -webkit-animation-timing-function: cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);\n    animation-timing-function: cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);\n    -webkit-transform: translateX(calc(-4% - 0)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(-4% - 0)) translateY(-130%) scale(0.75);\n  }\n  100% {\n    -webkit-transform: translateX(calc(0 - 0)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(0 - 0)) translateY(-130%) scale(0.75);\n  }\n}\n\@keyframes mdc-floating-label-shake-float-above-text-field-outlined-leading-icon-rtl {\n  0% {\n    -webkit-transform: translateX(calc(0 - 0)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(0 - 0)) translateY(-130%) scale(0.75);\n  }\n  33% {\n    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.701732, 0.495819);\n    animation-timing-function: cubic-bezier(0.5, 0, 0.701732, 0.495819);\n    -webkit-transform: translateX(calc(4% - 0)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(4% - 0)) translateY(-130%) scale(0.75);\n  }\n  66% {\n    -webkit-animation-timing-function: cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);\n    animation-timing-function: cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);\n    -webkit-transform: translateX(calc(-4% - 0)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(-4% - 0)) translateY(-130%) scale(0.75);\n  }\n  100% {\n    -webkit-transform: translateX(calc(0 - 0)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(0 - 0)) translateY(-130%) scale(0.75);\n  }\n}\n\@-webkit-keyframes mdc-floating-label-shake-float-above-text-field-outlined-leading-icon-dense-rtl {\n  0% {\n    -webkit-transform: translateX(calc(0 - -1.3125rem)) translateY(-120%) scale(0.8);\n    transform: translateX(calc(0 - -1.3125rem)) translateY(-120%) scale(0.8);\n  }\n  33% {\n    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.701732, 0.495819);\n    animation-timing-function: cubic-bezier(0.5, 0, 0.701732, 0.495819);\n    -webkit-transform: translateX(calc(4% - -1.3125rem)) translateY(-120%) scale(0.8);\n    transform: translateX(calc(4% - -1.3125rem)) translateY(-120%) scale(0.8);\n  }\n  66% {\n    -webkit-animation-timing-function: cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);\n    animation-timing-function: cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);\n    -webkit-transform: translateX(calc(-4% - -1.3125rem)) translateY(-120%) scale(0.8);\n    transform: translateX(calc(-4% - -1.3125rem)) translateY(-120%) scale(0.8);\n  }\n  100% {\n    -webkit-transform: translateX(calc(0 - -1.3125rem)) translateY(-120%) scale(0.8);\n    transform: translateX(calc(0 - -1.3125rem)) translateY(-120%) scale(0.8);\n  }\n}\n\@keyframes mdc-floating-label-shake-float-above-text-field-outlined-leading-icon-dense-rtl {\n  0% {\n    -webkit-transform: translateX(calc(0 - -1.3125rem)) translateY(-120%) scale(0.8);\n    transform: translateX(calc(0 - -1.3125rem)) translateY(-120%) scale(0.8);\n  }\n  33% {\n    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.701732, 0.495819);\n    animation-timing-function: cubic-bezier(0.5, 0, 0.701732, 0.495819);\n    -webkit-transform: translateX(calc(4% - -1.3125rem)) translateY(-120%) scale(0.8);\n    transform: translateX(calc(4% - -1.3125rem)) translateY(-120%) scale(0.8);\n  }\n  66% {\n    -webkit-animation-timing-function: cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);\n    animation-timing-function: cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);\n    -webkit-transform: translateX(calc(-4% - -1.3125rem)) translateY(-120%) scale(0.8);\n    transform: translateX(calc(-4% - -1.3125rem)) translateY(-120%) scale(0.8);\n  }\n  100% {\n    -webkit-transform: translateX(calc(0 - -1.3125rem)) translateY(-120%) scale(0.8);\n    transform: translateX(calc(0 - -1.3125rem)) translateY(-120%) scale(0.8);\n  }\n}\n\@-webkit-keyframes mdc-floating-label-shake-float-above-textarea {\n  0% {\n    -webkit-transform: translateX(calc(0 - 0%)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(0 - 0%)) translateY(-130%) scale(0.75);\n  }\n  33% {\n    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.701732, 0.495819);\n    animation-timing-function: cubic-bezier(0.5, 0, 0.701732, 0.495819);\n    -webkit-transform: translateX(calc(4% - 0%)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(4% - 0%)) translateY(-130%) scale(0.75);\n  }\n  66% {\n    -webkit-animation-timing-function: cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);\n    animation-timing-function: cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);\n    -webkit-transform: translateX(calc(-4% - 0%)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(-4% - 0%)) translateY(-130%) scale(0.75);\n  }\n  100% {\n    -webkit-transform: translateX(calc(0 - 0%)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(0 - 0%)) translateY(-130%) scale(0.75);\n  }\n}\n\@keyframes mdc-floating-label-shake-float-above-textarea {\n  0% {\n    -webkit-transform: translateX(calc(0 - 0%)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(0 - 0%)) translateY(-130%) scale(0.75);\n  }\n  33% {\n    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.701732, 0.495819);\n    animation-timing-function: cubic-bezier(0.5, 0, 0.701732, 0.495819);\n    -webkit-transform: translateX(calc(4% - 0%)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(4% - 0%)) translateY(-130%) scale(0.75);\n  }\n  66% {\n    -webkit-animation-timing-function: cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);\n    animation-timing-function: cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);\n    -webkit-transform: translateX(calc(-4% - 0%)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(-4% - 0%)) translateY(-130%) scale(0.75);\n  }\n  100% {\n    -webkit-transform: translateX(calc(0 - 0%)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(0 - 0%)) translateY(-130%) scale(0.75);\n  }\n}\n.mdc-ripple-surface {\n  --mdc-ripple-fg-size: 0;\n  --mdc-ripple-left: 0;\n  --mdc-ripple-top: 0;\n  --mdc-ripple-fg-scale: 1;\n  --mdc-ripple-fg-translate-end: 0;\n  --mdc-ripple-fg-translate-start: 0;\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n  position: relative;\n  outline: none;\n  overflow: hidden;\n}\n.mdc-ripple-surface::before, .mdc-ripple-surface::after {\n  position: absolute;\n  border-radius: 50%;\n  opacity: 0;\n  pointer-events: none;\n  content: \"\";\n}\n.mdc-ripple-surface::before {\n  -webkit-transition: opacity 15ms linear, background-color 15ms linear;\n  transition: opacity 15ms linear, background-color 15ms linear;\n  z-index: 1;\n}\n.mdc-ripple-surface.mdc-ripple-upgraded::before {\n  -webkit-transform: scale(var(--mdc-ripple-fg-scale, 1));\n  transform: scale(var(--mdc-ripple-fg-scale, 1));\n}\n.mdc-ripple-surface.mdc-ripple-upgraded::after {\n  top: 0;\n  /* \@noflip */\n  left: 0;\n  -webkit-transform: scale(0);\n  transform: scale(0);\n  -webkit-transform-origin: center center;\n  transform-origin: center center;\n}\n.mdc-ripple-surface.mdc-ripple-upgraded--unbounded::after {\n  top: var(--mdc-ripple-top, 0);\n  /* \@noflip */\n  left: var(--mdc-ripple-left, 0);\n}\n.mdc-ripple-surface.mdc-ripple-upgraded--foreground-activation::after {\n  -webkit-animation: mdc-ripple-fg-radius-in 225ms forwards, mdc-ripple-fg-opacity-in 75ms forwards;\n  animation: mdc-ripple-fg-radius-in 225ms forwards, mdc-ripple-fg-opacity-in 75ms forwards;\n}\n.mdc-ripple-surface.mdc-ripple-upgraded--foreground-deactivation::after {\n  -webkit-animation: mdc-ripple-fg-opacity-out 150ms;\n  animation: mdc-ripple-fg-opacity-out 150ms;\n  -webkit-transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1));\n  transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1));\n}\n.mdc-ripple-surface::before, .mdc-ripple-surface::after {\n  background-color: #000;\n}\n.mdc-ripple-surface:hover::before {\n  opacity: 0.04;\n}\n.mdc-ripple-surface:not(.mdc-ripple-upgraded):focus::before, .mdc-ripple-surface.mdc-ripple-upgraded--background-focused::before {\n  -webkit-transition-duration: 75ms;\n  transition-duration: 75ms;\n  opacity: 0.12;\n}\n.mdc-ripple-surface:not(.mdc-ripple-upgraded)::after {\n  -webkit-transition: opacity 150ms linear;\n  transition: opacity 150ms linear;\n}\n.mdc-ripple-surface:not(.mdc-ripple-upgraded):active::after {\n  -webkit-transition-duration: 75ms;\n  transition-duration: 75ms;\n  opacity: 0.12;\n}\n.mdc-ripple-surface.mdc-ripple-upgraded {\n  --mdc-ripple-fg-opacity: 0.12;\n}\n.mdc-ripple-surface::before, .mdc-ripple-surface::after {\n  top: calc(50% - 100%);\n  /* \@noflip */\n  left: calc(50% - 100%);\n  width: 200%;\n  height: 200%;\n}\n.mdc-ripple-surface.mdc-ripple-upgraded::after {\n  width: var(--mdc-ripple-fg-size, 100%);\n  height: var(--mdc-ripple-fg-size, 100%);\n}\n.mdc-ripple-surface[data-mdc-ripple-is-unbounded] {\n  overflow: visible;\n}\n.mdc-ripple-surface[data-mdc-ripple-is-unbounded]::before, .mdc-ripple-surface[data-mdc-ripple-is-unbounded]::after {\n  top: calc(50% - 50%);\n  /* \@noflip */\n  left: calc(50% - 50%);\n  width: 100%;\n  height: 100%;\n}\n.mdc-ripple-surface[data-mdc-ripple-is-unbounded].mdc-ripple-upgraded::before, .mdc-ripple-surface[data-mdc-ripple-is-unbounded].mdc-ripple-upgraded::after {\n  top: var(--mdc-ripple-top, calc(50% - 50%));\n  /* \@noflip */\n  left: var(--mdc-ripple-left, calc(50% - 50%));\n  width: var(--mdc-ripple-fg-size, 100%);\n  height: var(--mdc-ripple-fg-size, 100%);\n}\n.mdc-ripple-surface[data-mdc-ripple-is-unbounded].mdc-ripple-upgraded::after {\n  width: var(--mdc-ripple-fg-size, 100%);\n  height: var(--mdc-ripple-fg-size, 100%);\n}\n.mdc-ripple-surface--primary::before, .mdc-ripple-surface--primary::after {\n  background-color: #26a69a;\n}\n\@supports not (-ms-ime-align: auto) {\n  .mdc-ripple-surface--primary::before, .mdc-ripple-surface--primary::after {\n    /* \@alternate */\n    background-color: var(--mdc-theme-primary, #26a69a);\n  }\n}\n.mdc-ripple-surface--primary:hover::before {\n  opacity: 0.08;\n}\n.mdc-ripple-surface--primary:not(.mdc-ripple-upgraded):focus::before, .mdc-ripple-surface--primary.mdc-ripple-upgraded--background-focused::before {\n  -webkit-transition-duration: 75ms;\n  transition-duration: 75ms;\n  opacity: 0.24;\n}\n.mdc-ripple-surface--primary:not(.mdc-ripple-upgraded)::after {\n  -webkit-transition: opacity 150ms linear;\n  transition: opacity 150ms linear;\n}\n.mdc-ripple-surface--primary:not(.mdc-ripple-upgraded):active::after {\n  -webkit-transition-duration: 75ms;\n  transition-duration: 75ms;\n  opacity: 0.24;\n}\n.mdc-ripple-surface--primary.mdc-ripple-upgraded {\n  --mdc-ripple-fg-opacity: 0.24;\n}\n.mdc-ripple-surface--accent::before, .mdc-ripple-surface--accent::after {\n  background-color: #575756;\n}\n\@supports not (-ms-ime-align: auto) {\n  .mdc-ripple-surface--accent::before, .mdc-ripple-surface--accent::after {\n    /* \@alternate */\n    background-color: var(--mdc-theme-secondary, #575756);\n  }\n}\n.mdc-ripple-surface--accent:hover::before {\n  opacity: 0.04;\n}\n.mdc-ripple-surface--accent:not(.mdc-ripple-upgraded):focus::before, .mdc-ripple-surface--accent.mdc-ripple-upgraded--background-focused::before {\n  -webkit-transition-duration: 75ms;\n  transition-duration: 75ms;\n  opacity: 0.12;\n}\n.mdc-ripple-surface--accent:not(.mdc-ripple-upgraded)::after {\n  -webkit-transition: opacity 150ms linear;\n  transition: opacity 150ms linear;\n}\n.mdc-ripple-surface--accent:not(.mdc-ripple-upgraded):active::after {\n  -webkit-transition-duration: 75ms;\n  transition-duration: 75ms;\n  opacity: 0.12;\n}\n.mdc-ripple-surface--accent.mdc-ripple-upgraded {\n  --mdc-ripple-fg-opacity: 0.12;\n}\n\n/**\n * \@prop --icon-background-color: Background color of the icon. Defaults to transparent.\n * \@prop --icon-color: Color of the icon. Defaults to 54% black.\n * \@prop --background-color: Background color of the field when type is set to input.\n * \@prop --background-color-disabled: Background color of the field when type is set to input and the component is disabled or readonly.\n * \@prop --input-chip-set-selected-chip-color: Color of the highlight around selected chips in input chip-sets.\n */\nlimel-icon.mdc-chip__icon.mdc-chip__icon--leading {\n  background-color: var(--icon-background-color, transparent);\n  margin-left: -0.75rem !important;\n  color: var(--icon-color, rgba(0, 0, 0, 0.54));\n}\n\n.mdc-chip-set.disabled:not(.mdc-chip-set--input) {\n  opacity: 0.5;\n  pointer-events: none;\n}\n.mdc-chip-set.mdc-chip-set--input {\n  margin-top: 1.25rem;\n  width: 100%;\n}\n.mdc-chip-set.mdc-chip-set--input .mdc-chip--selected {\n  -webkit-box-shadow: 0 0 0 0.25rem var(--input-chip-set-selected-chip-color, var(--lime-turquoise, orange));\n  box-shadow: 0 0 0 0.25rem var(--input-chip-set-selected-chip-color, var(--lime-turquoise, orange));\n}\n\n.mdc-chip__icon--trailing svg {\n  display: block;\n  height: 100%;\n  width: 100%;\n}\n\n.mdc-text-field {\n  width: 100%;\n  height: auto;\n  cursor: text;\n}\n.mdc-text-field:hover::before {\n  opacity: 0;\n}\n.mdc-text-field:not(.mdc-ripple-upgraded):focus::before, .mdc-text-field:not(.mdc-ripple-upgraded):focus-within::before, .mdc-text-field.mdc-ripple-upgraded--background-focused::before {\n  -webkit-transition-duration: 75ms;\n  transition-duration: 75ms;\n  opacity: 0;\n}\n.mdc-text-field input {\n  width: auto;\n  border-bottom: none;\n  height: auto;\n  padding-top: 0;\n  -ms-flex-positive: 1;\n  flex-grow: 1;\n  -ms-flex-negative: 0;\n  flex-shrink: 0;\n  max-height: 2.1875rem;\n}\n.mdc-text-field input.hidden {\n  max-height: 0 !important;\n  -webkit-transition: max-height 250ms cubic-bezier(0.5, 0, 1, 0);\n  transition: max-height 250ms cubic-bezier(0.5, 0, 1, 0);\n}\n.mdc-text-field .mdc-floating-label--float-above, .mdc-text-field .force-float {\n  top: 0.625rem;\n  bottom: auto;\n}\n.mdc-text-field:not(.mdc-text-field--focused) {\n  border-bottom-style: solid;\n  border-bottom-width: 0.0625rem;\n}\n.mdc-text-field:not(.mdc-text-field--disabled).mdc-text-field--focused {\n  border-bottom-style: solid;\n  border-bottom-width: 0.0625rem;\n}\n\n.mdc-text-field:not(.mdc-text-field--disabled) {\n  background-color: var(--background-color, #ffffff);\n}\n\n.mdc-text-field--disabled:not(.mdc-text-field--textarea) {\n  background-color: var(--background-color-disabled, #fafafa);\n}\n\n.mdc-text-field--disabled .mdc-chip {\n  pointer-events: all;\n}\n.mdc-text-field--disabled .mdc-chip.disabled {\n  opacity: 0.5;\n  pointer-events: none;\n}\n\n.mdc-floating-label.mdc-text-field--required::after {\n  content: \"*\";\n}"; }
};

export { ChipSet as limel_chip_set };
