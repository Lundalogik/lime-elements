const h = window.LimeElements.h;

import { a as MDCFoundation, b as MDCComponent } from './chunk-6a33c04e.js';
import { a as MDCRipple, b as MDCRippleFoundation } from './chunk-63e5c4e1.js';
import { a as MDCTextField } from './chunk-76c23893.js';
import './chunk-b252682b.js';

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

/* eslint no-unused-vars: [2, {"args": "none"}] */

/**
 * Adapter for MDC Chip.
 *
 * Defines the shape of the adapter expected by the foundation. Implement this
 * adapter to integrate the Chip into your framework. See
 * https://github.com/material-components/material-components-web/blob/master/docs/authoring-components.md
 * for more information.
 *
 * @record
 */
class MDCChipAdapter {
  /**
   * Adds a class to the root element.
   * @param {string} className
   */
  addClass(className) {}

  /**
   * Removes a class from the root element.
   * @param {string} className
   */
  removeClass(className) {}

  /**
   * Returns true if the root element contains the given class.
   * @param {string} className
   * @return {boolean}
   */
  hasClass(className) {}

  /**
   * Adds a class to the leading icon element.
   * @param {string} className
   */
  addClassToLeadingIcon(className) {}

  /**
   * Removes a class from the leading icon element.
   * @param {string} className
   */
  removeClassFromLeadingIcon(className) {}

  /**
   * Returns true if target has className, false otherwise.
   * @param {!EventTarget} target
   * @param {string} className
   * @return {boolean}
   */
  eventTargetHasClass(target, className) {}

  /**
   * Emits a custom "MDCChip:interaction" event denoting the chip has been
   * interacted with (typically on click or keydown).
   */
  notifyInteraction() {}

  /**
   * Emits a custom "MDCChip:selection" event denoting the chip has been selected or deselected.
   * @param {boolean} selected
   */
  notifySelection(selected) {}

  /**
   * Emits a custom "MDCChip:trailingIconInteraction" event denoting the trailing icon has been
   * interacted with (typically on click or keydown).
   */
  notifyTrailingIconInteraction() {}

  /**
   * Emits a custom event "MDCChip:removal" denoting the chip will be removed.
   */
  notifyRemoval() {}

  /**
   * Returns the computed property value of the given style property on the root element.
   * @param {string} propertyName
   * @return {string}
   */
  getComputedStyleValue(propertyName) {}

  /**
   * Sets the property value of the given style property on the root element.
   * @param {string} propertyName
   * @param {string} value
   */
  setStyleProperty(propertyName, value) {}
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
const strings = {
  ENTRY_ANIMATION_NAME: 'mdc-chip-entry',
  INTERACTION_EVENT: 'MDCChip:interaction',
  SELECTION_EVENT: 'MDCChip:selection',
  TRAILING_ICON_INTERACTION_EVENT: 'MDCChip:trailingIconInteraction',
  REMOVAL_EVENT: 'MDCChip:removal',
  CHECKMARK_SELECTOR: '.mdc-chip__checkmark',
  LEADING_ICON_SELECTOR: '.mdc-chip__icon--leading',
  TRAILING_ICON_SELECTOR: '.mdc-chip__icon--trailing',
};

/** @enum {string} */
const cssClasses = {
  CHECKMARK: 'mdc-chip__checkmark',
  CHIP_EXIT: 'mdc-chip--exit',
  HIDDEN_LEADING_ICON: 'mdc-chip__icon--leading-hidden',
  LEADING_ICON: 'mdc-chip__icon--leading',
  TRAILING_ICON: 'mdc-chip__icon--trailing',
  SELECTED: 'mdc-chip--selected',
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
 * @extends {MDCFoundation<!MDCChipAdapter>}
 * @final
 */
class MDCChipFoundation extends MDCFoundation {
  /** @return enum {string} */
  static get strings() {
    return strings;
  }

  /** @return enum {string} */
  static get cssClasses() {
    return cssClasses;
  }

  /**
   * {@see MDCChipAdapter} for typing information on parameters and return
   * types.
   * @return {!MDCChipAdapter}
   */
  static get defaultAdapter() {
    return /** @type {!MDCChipAdapter} */ ({
      addClass: () => {},
      removeClass: () => {},
      hasClass: () => {},
      addClassToLeadingIcon: () => {},
      removeClassFromLeadingIcon: () => {},
      eventTargetHasClass: () => {},
      notifyInteraction: () => {},
      notifySelection: () => {},
      notifyTrailingIconInteraction: () => {},
      notifyRemoval: () => {},
      getComputedStyleValue: () => {},
      setStyleProperty: () => {},
    });
  }

  /**
   * @param {!MDCChipAdapter} adapter
   */
  constructor(adapter) {
    super(Object.assign(MDCChipFoundation.defaultAdapter, adapter));

    /**
     * Whether a trailing icon click should immediately trigger exit/removal of the chip.
     * @private {boolean}
     * */
    this.shouldRemoveOnTrailingIconClick_ = true;
  }

  /**
   * @return {boolean}
   */
  isSelected() {
    return this.adapter_.hasClass(cssClasses.SELECTED);
  }

  /**
   * @param {boolean} selected
   */
  setSelected(selected) {
    if (selected) {
      this.adapter_.addClass(cssClasses.SELECTED);
    } else {
      this.adapter_.removeClass(cssClasses.SELECTED);
    }
    this.adapter_.notifySelection(selected);
  }

  /**
   * @return {boolean}
   */
  getShouldRemoveOnTrailingIconClick() {
    return this.shouldRemoveOnTrailingIconClick_;
  }

  /**
   * @param {boolean} shouldRemove
   */
  setShouldRemoveOnTrailingIconClick(shouldRemove) {
    this.shouldRemoveOnTrailingIconClick_ = shouldRemove;
  }

  /**
   * Begins the exit animation which leads to removal of the chip.
   */
  beginExit() {
    this.adapter_.addClass(cssClasses.CHIP_EXIT);
  }

  /**
   * Handles an interaction event on the root element.
   * @param {!Event} evt
   */
  handleInteraction(evt) {
    if (evt.type === 'click' || evt.key === 'Enter' || evt.keyCode === 13) {
      this.adapter_.notifyInteraction();
    }
  }

  /**
   * Handles a transition end event on the root element.
   * @param {!Event} evt
   */
  handleTransitionEnd(evt) {
    // Handle transition end event on the chip when it is about to be removed.
    if (this.adapter_.eventTargetHasClass(/** @type {!EventTarget} */ (evt.target), cssClasses.CHIP_EXIT)) {
      if (evt.propertyName === 'width') {
        this.adapter_.notifyRemoval();
      } else if (evt.propertyName === 'opacity') {
        // See: https://css-tricks.com/using-css-transitions-auto-dimensions/#article-header-id-5
        const chipWidth = this.adapter_.getComputedStyleValue('width');

        // On the next frame (once we get the computed width), explicitly set the chip's width
        // to its current pixel width, so we aren't transitioning out of 'auto'.
        requestAnimationFrame(() => {
          this.adapter_.setStyleProperty('width', chipWidth);

          // To mitigate jitter, start transitioning padding and margin before width.
          this.adapter_.setStyleProperty('padding', '0');
          this.adapter_.setStyleProperty('margin', '0');

          // On the next frame (once width is explicitly set), transition width to 0.
          requestAnimationFrame(() => {
            this.adapter_.setStyleProperty('width', '0');
          });
        });
      }
      return;
    }

    // Handle a transition end event on the leading icon or checkmark, since the transition end event bubbles.
    if (evt.propertyName !== 'opacity') {
      return;
    }
    if (this.adapter_.eventTargetHasClass(/** @type {!EventTarget} */ (evt.target), cssClasses.LEADING_ICON) &&
        this.adapter_.hasClass(cssClasses.SELECTED)) {
      this.adapter_.addClassToLeadingIcon(cssClasses.HIDDEN_LEADING_ICON);
    } else if (this.adapter_.eventTargetHasClass(/** @type {!EventTarget} */ (evt.target), cssClasses.CHECKMARK) &&
               !this.adapter_.hasClass(cssClasses.SELECTED)) {
      this.adapter_.removeClassFromLeadingIcon(cssClasses.HIDDEN_LEADING_ICON);
    }
  }

  /**
   * Handles an interaction event on the trailing icon element. This is used to
   * prevent the ripple from activating on interaction with the trailing icon.
   * @param {!Event} evt
   */
  handleTrailingIconInteraction(evt) {
    evt.stopPropagation();
    if (evt.type === 'click' || evt.key === 'Enter' || evt.keyCode === 13) {
      this.adapter_.notifyTrailingIconInteraction();
      if (this.shouldRemoveOnTrailingIconClick_) {
        this.beginExit();
      }
    }
  }
}

/**
 * @typedef {{
 *   detail: {
 *     chipId: string,
 *   },
 *   bubbles: boolean,
 * }}
 */
let MDCChipInteractionEventType;

/**
 * @typedef {{
 *   detail: {
 *     chipId: string,
 *     selected: boolean,
 *   },
 *   bubbles: boolean,
 * }}
 */
let MDCChipSelectionEventType;

/**
 * @typedef {{
 *   detail: {
 *     chipId: string,
 *     root: Element,
 *   },
 *   bubbles: boolean,
 * }}
 */
let MDCChipRemovalEventType;

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

const INTERACTION_EVENTS = ['click', 'keydown'];

/**
 * @extends {MDCComponent<!MDCChipFoundation>}
 * @final
 */
class MDCChip extends MDCComponent {
  /**
   * @param {...?} args
   */
  constructor(...args) {
    super(...args);

    /** @type {string} */
    this.id;
    /** @private {?Element} */
    this.leadingIcon_;
    /** @private {?Element} */
    this.trailingIcon_;
    /** @private {!MDCRipple} */
    this.ripple_;

    /** @private {?function(?Event): undefined} */
    this.handleInteraction_;
    /** @private {?function(!Event): undefined} */
    this.handleTransitionEnd_;
    /** @private {function(!Event): undefined} */
    this.handleTrailingIconInteraction_;
  }

  /**
   * @param {!Element} root
   * @return {!MDCChip}
   */
  static attachTo(root) {
    return new MDCChip(root);
  }

  initialize(
    rippleFactory = (el, foundation) => new MDCRipple(el, foundation)) {
    this.id = this.root_.id;
    this.leadingIcon_ = this.root_.querySelector(strings.LEADING_ICON_SELECTOR);
    this.trailingIcon_ = this.root_.querySelector(strings.TRAILING_ICON_SELECTOR);

    // Adjust ripple size for chips with animated growing width. This applies when filter chips without
    // a leading icon are selected, and a leading checkmark will cause the chip width to expand.
    const checkmarkEl = this.root_.querySelector(strings.CHECKMARK_SELECTOR);
    if (checkmarkEl && !this.leadingIcon_) {
      const adapter = Object.assign(MDCRipple.createAdapter(this), {
        computeBoundingRect: () => {
          const height = this.root_.getBoundingClientRect().height;
          // The checkmark's width is initially set to 0, so use the checkmark's height as a proxy since the
          // checkmark should always be square.
          const width = this.root_.getBoundingClientRect().width + checkmarkEl.getBoundingClientRect().height;
          return {height, width};
        },
      });
      this.ripple_ = rippleFactory(this.root_, new MDCRippleFoundation(adapter));
    } else {
      this.ripple_ = rippleFactory(this.root_);
    }
  }

  initialSyncWithDOM() {
    this.handleInteraction_ = (evt) => this.foundation_.handleInteraction(evt);
    this.handleTransitionEnd_ = (evt) => this.foundation_.handleTransitionEnd(evt);
    this.handleTrailingIconInteraction_ = (evt) => this.foundation_.handleTrailingIconInteraction(evt);

    INTERACTION_EVENTS.forEach((evtType) => {
      this.root_.addEventListener(evtType, this.handleInteraction_);
    });
    this.root_.addEventListener('transitionend', this.handleTransitionEnd_);

    if (this.trailingIcon_) {
      INTERACTION_EVENTS.forEach((evtType) => {
        this.trailingIcon_.addEventListener(evtType, this.handleTrailingIconInteraction_);
      });
    }
  }

  destroy() {
    this.ripple_.destroy();

    INTERACTION_EVENTS.forEach((evtType) => {
      this.root_.removeEventListener(evtType, this.handleInteraction_);
    });
    this.root_.removeEventListener('transitionend', this.handleTransitionEnd_);

    if (this.trailingIcon_) {
      INTERACTION_EVENTS.forEach((evtType) => {
        this.trailingIcon_.removeEventListener(evtType, this.handleTrailingIconInteraction_);
      });
    }

    super.destroy();
  }

  /**
   * Returns whether the chip is selected.
   * @return {boolean}
   */
  get selected() {
    return this.foundation_.isSelected();
  }

  /**
   * Sets selected state on the chip.
   * @param {boolean} selected
   */
  set selected(selected) {
    this.foundation_.setSelected(selected);
  }

  /**
   * Returns whether a trailing icon click should trigger exit/removal of the chip.
   * @return {boolean}
   */
  get shouldRemoveOnTrailingIconClick() {
    return this.foundation_.getShouldRemoveOnTrailingIconClick();
  }

  /**
   * Sets whether a trailing icon click should trigger exit/removal of the chip.
   * @param {boolean} shouldRemove
   */
  set shouldRemoveOnTrailingIconClick(shouldRemove) {
    this.foundation_.setShouldRemoveOnTrailingIconClick(shouldRemove);
  }

  /**
   * Begins the exit animation which leads to removal of the chip.
   */
  beginExit() {
    this.foundation_.beginExit();
  }

  /**
   * @return {!MDCChipFoundation}
   */
  getDefaultFoundation() {
    return new MDCChipFoundation(/** @type {!MDCChipAdapter} */ (Object.assign({
      addClass: (className) => this.root_.classList.add(className),
      removeClass: (className) => this.root_.classList.remove(className),
      hasClass: (className) => this.root_.classList.contains(className),
      addClassToLeadingIcon: (className) => {
        if (this.leadingIcon_) {
          this.leadingIcon_.classList.add(className);
        }
      },
      removeClassFromLeadingIcon: (className) => {
        if (this.leadingIcon_) {
          this.leadingIcon_.classList.remove(className);
        }
      },
      eventTargetHasClass: (target, className) => target.classList.contains(className),
      notifyInteraction: () => this.emit(strings.INTERACTION_EVENT, {chipId: this.id}, true /* shouldBubble */),
      notifySelection: (selected) => this.emit(
        strings.SELECTION_EVENT, {chipId: this.id, selected: selected}, true /* shouldBubble */),
      notifyTrailingIconInteraction: () => this.emit(
        strings.TRAILING_ICON_INTERACTION_EVENT, {chipId: this.id}, true /* shouldBubble */),
      notifyRemoval: () =>
        this.emit(strings.REMOVAL_EVENT, {chipId: this.id, root: this.root_}, true /* shouldBubble */),
      getComputedStyleValue: (propertyName) => window.getComputedStyle(this.root_).getPropertyValue(propertyName),
      setStyleProperty: (propertyName, value) => this.root_.style.setProperty(propertyName, value),
    })));
  }

  /** @return {!MDCRipple} */
  get ripple() {
    return this.ripple_;
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

/* eslint no-unused-vars: [2, {"args": "none"}] */

/**
 * Adapter for MDC Chip Set.
 *
 * Defines the shape of the adapter expected by the foundation. Implement this
 * adapter to integrate the Chip Set into your framework. See
 * https://github.com/material-components/material-components-web/blob/master/docs/authoring-components.md
 * for more information.
 *
 * @record
 */
class MDCChipSetAdapter {
  /**
   * Returns true if the root element contains the given class name.
   * @param {string} className
   * @return {boolean}
   */
  hasClass(className) {}

  /**
   * Removes the chip with the given id from the chip set.
   * @param {string} chipId
   */
  removeChip(chipId) {}

  /**
   * Sets the selected state of the chip with the given id.
   * @param {string} chipId
   * @param {boolean} selected
   */
  setSelected(chipId, selected) {}
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
const strings$1 = {
  CHIP_SELECTOR: '.mdc-chip',
};

/** @enum {string} */
const cssClasses$1 = {
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

/**
 * @extends {MDCFoundation<!MDCChipSetAdapter>}
 * @final
 */
class MDCChipSetFoundation extends MDCFoundation {
  /** @return enum {string} */
  static get strings() {
    return strings$1;
  }

  /** @return enum {string} */
  static get cssClasses() {
    return cssClasses$1;
  }

  /**
   * {@see MDCChipSetAdapter} for typing information on parameters and return
   * types.
   * @return {!MDCChipSetAdapter}
   */
  static get defaultAdapter() {
    return /** @type {!MDCChipSetAdapter} */ ({
      hasClass: () => {},
      removeChip: () => {},
      setSelected: () => {},
    });
  }

  /**
   * @param {!MDCChipSetAdapter} adapter
   */
  constructor(adapter) {
    super(Object.assign(MDCChipSetFoundation.defaultAdapter, adapter));

    /**
     * The ids of the selected chips in the set. Only used for choice chip set or filter chip set.
     * @private {!Array<string>}
     */
    this.selectedChipIds_ = [];
  }

  /**
   * Returns an array of the IDs of all selected chips.
   * @return {!Array<string>}
   */
  getSelectedChipIds() {
    return this.selectedChipIds_;
  }

  /**
   * Toggles selection of the chip with the given id.
   * @private
   * @param {string} chipId
   */
  toggleSelect_(chipId) {
    if (this.selectedChipIds_.indexOf(chipId) >= 0) {
      this.deselect_(chipId);
    } else {
      this.select(chipId);
    }
  }

  /**
   * Selects the chip with the given id. Deselects all other chips if the chip set is of the choice variant.
   * @param {string} chipId
   */
  select(chipId) {
    if (this.selectedChipIds_.indexOf(chipId) >= 0) {
      return;
    }

    if (this.adapter_.hasClass(cssClasses$1.CHOICE) && this.selectedChipIds_.length > 0) {
      const previouslySelectedChip = this.selectedChipIds_[0];
      this.selectedChipIds_.length = 0;
      this.adapter_.setSelected(previouslySelectedChip, false);
    }
    this.selectedChipIds_.push(chipId);
    this.adapter_.setSelected(chipId, true);
  }

  /**
   * Deselects the chip with the given id.
   * @private
   * @param {string} chipId
   */
  deselect_(chipId) {
    const index = this.selectedChipIds_.indexOf(chipId);
    if (index >= 0) {
      this.selectedChipIds_.splice(index, 1);
      this.adapter_.setSelected(chipId, false);
    }
  }

  /**
   * Handles a chip interaction event
   * @param {string} chipId
   */
  handleChipInteraction(chipId) {
    if (this.adapter_.hasClass(cssClasses$1.CHOICE) || this.adapter_.hasClass(cssClasses$1.FILTER)) {
      this.toggleSelect_(chipId);
    }
  }

  /**
   * Handles a chip selection event, used to handle discrepancy when selection state is set directly on the Chip.
   * @param {string} chipId
   * @param {boolean} selected
   */
  handleChipSelection(chipId, selected) {
    const chipIsSelected = this.selectedChipIds_.indexOf(chipId) >= 0;
    if (selected && !chipIsSelected) {
      this.select(chipId);
    } else if (!selected && chipIsSelected) {
      this.deselect_(chipId);
    }
  }

  /**
   * Handles the event when a chip is removed.
   * @param {string} chipId
   */
  handleChipRemoval(chipId) {
    this.deselect_(chipId);
    this.adapter_.removeChip(chipId);
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

let idCounter = 0;

/**
 * @extends {MDCComponent<!MDCChipSetFoundation>}
 * @final
 */
class MDCChipSet extends MDCComponent {
  /**
   * @param {...?} args
   */
  constructor(...args) {
    super(...args);

    /** @type {!Array<!MDCChip>} */
    this.chips;
    /** @private {(function(!Element): !MDCChip)} */
    this.chipFactory_;

    /** @private {?function(?Event): undefined} */
    this.handleChipInteraction_;
    /** @private {?function(?Event): undefined} */
    this.handleChipSelection_;
    /** @private {?function(?Event): undefined} */
    this.handleChipRemoval_;
  }

  /**
   * @param {!Element} root
   * @return {!MDCChipSet}
   */
  static attachTo(root) {
    return new MDCChipSet(root);
  }

  /**
   * @param {(function(!Element): !MDCChip)=} chipFactory A function which
   * creates a new MDCChip.
   */
  initialize(chipFactory = (el) => new MDCChip(el)) {
    this.chipFactory_ = chipFactory;
    this.chips = this.instantiateChips_(this.chipFactory_);
  }

  initialSyncWithDOM() {
    this.chips.forEach((chip) => {
      if (chip.selected) {
        this.foundation_.select(chip.id);
      }
    });

    this.handleChipInteraction_ = (evt) => this.foundation_.handleChipInteraction(evt.detail.chipId);
    this.handleChipSelection_ = (evt) => this.foundation_.handleChipSelection(evt.detail.chipId, evt.detail.selected);
    this.handleChipRemoval_ = (evt) => this.foundation_.handleChipRemoval(evt.detail.chipId);
    this.root_.addEventListener(
      MDCChipFoundation.strings.INTERACTION_EVENT, this.handleChipInteraction_);
    this.root_.addEventListener(
      MDCChipFoundation.strings.SELECTION_EVENT, this.handleChipSelection_);
    this.root_.addEventListener(
      MDCChipFoundation.strings.REMOVAL_EVENT, this.handleChipRemoval_);
  }

  destroy() {
    this.chips.forEach((chip) => {
      chip.destroy();
    });

    this.root_.removeEventListener(
      MDCChipFoundation.strings.INTERACTION_EVENT, this.handleChipInteraction_);
    this.root_.removeEventListener(
      MDCChipFoundation.strings.SELECTION_EVENT, this.handleChipSelection_);
    this.root_.removeEventListener(
      MDCChipFoundation.strings.REMOVAL_EVENT, this.handleChipRemoval_);

    super.destroy();
  }

  /**
   * Adds a new chip object to the chip set from the given chip element.
   * @param {!Element} chipEl
   */
  addChip(chipEl) {
    chipEl.id = chipEl.id || `mdc-chip-${++idCounter}`;
    this.chips.push(this.chipFactory_(chipEl));
  }

  /**
   * Returns an array of the IDs of all selected chips.
   * @return {!Array<string>}
   */
  get selectedChipIds() {
    return this.foundation_.getSelectedChipIds();
  }

  /**
   * @return {!MDCChipSetFoundation}
   */
  getDefaultFoundation() {
    return new MDCChipSetFoundation(/** @type {!MDCChipSetAdapter} */ (Object.assign({
      hasClass: (className) => this.root_.classList.contains(className),
      removeChip: (chipId) => {
        const index = this.findChipIndex_(chipId);
        if (index >= 0) {
          this.chips[index].destroy();
          this.chips.splice(index, 1);
        }
      },
      setSelected: (chipId, selected) => {
        const index = this.findChipIndex_(chipId);
        if (index >= 0) {
          this.chips[index].selected = selected;
        }
      },
    })));
  }

  /**
   * Instantiates chip components on all of the chip set's child chip elements.
   * @param {(function(!Element): !MDCChip)} chipFactory
   * @return {!Array<!MDCChip>}
   */
  instantiateChips_(chipFactory) {
    const chipElements = [].slice.call(this.root_.querySelectorAll(MDCChipSetFoundation.strings.CHIP_SELECTOR));
    return chipElements.map((el) => {
      el.id = el.id || `mdc-chip-${++idCounter}`;
      return chipFactory(el);
    });
  }

  /**
   * Returns the index of the chip with the given id, or -1 if the chip does not exist.
   * @param {string} chipId
   * @return {number}
   */
  findChipIndex_(chipId) {
    for (let i = 0; i < this.chips.length; i++) {
      if (this.chips[i].id === chipId) {
        return i;
      }
    }
    return -1;
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

class ChipSet {
    constructor() {
        /**
         * List of chips for the set
         */
        this.value = [];
        /**
         * True if the chip set should be disabled
         */
        this.disabled = false;
        /**
         * True if the control requires a value
         */
        this.required = false;
        this.editMode = false;
        this.textValue = '';
        this.renderChip = this.renderChip.bind(this);
        this.handleInteraction = this.handleInteraction.bind(this);
        this.handleSelection = this.handleSelection.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
        this.handleTextFieldFocus = this.handleTextFieldFocus.bind(this);
        this.handleInputBlur = this.handleInputBlur.bind(this);
        this.handleTextInput = this.handleTextInput.bind(this);
    }
    /**
     * Used to find out whether the chip-set is in edit mode.
     *
     * @returns {boolean} `true` if the chip-set is in edit mode, `false` otherwise.
     */
    async getEditMode() {
        return this.editMode;
    }
    /**
     * Used to set focus to the chip-set input field.
     *
     * @returns {void}
     */
    setFocus() {
        this.editMode = true;
        this.host.shadowRoot.querySelector('input').focus();
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
        let typeClass = '';
        if (this.type) {
            typeClass = `mdc-chip-set--${this.type}`;
        }
        return (h("div", { class: `mdc-chip-set ${typeClass}` }, this.value.map(this.renderChip)));
    }
    handleChangeChips() {
        this.textValue = ' ';
    }
    createMDCChipSet() {
        this.mdcChipSet = new MDCChipSet(this.host.shadowRoot.querySelector('.mdc-chip-set'));
        this.mdcChipSet.chips.forEach(chip => {
            chip.shouldRemoveOnTrailingIconClick = false;
        });
        if (!this.type || this.type === 'input') {
            this.mdcChipSet.listen('MDCChip:interaction', this.handleInteraction);
        }
        if (this.type === 'choice' || this.type === 'filter') {
            this.mdcChipSet.listen('MDCChip:selection', this.handleSelection);
        }
        this.mdcChipSet.listen('MDCChip:trailingIconInteraction', this.handleRemove);
    }
    destroyMDCChipSet() {
        if (this.mdcChipSet) {
            this.mdcChipSet.unlisten('MDCChip:interaction', this.handleInteraction);
            this.mdcChipSet.unlisten('MDCChip:selection', this.handleSelection);
            this.mdcChipSet.unlisten('MDCChip:trailingIconInteraction', this.handleRemove);
            this.mdcChipSet.destroy();
        }
    }
    renderInputChips() {
        // Hide the input field while we are not editing and there are chips in the set
        let hiddenInput = true;
        if (this.editMode || !this.value.length) {
            hiddenInput = false;
        }
        // Make sure the floating label is displayed correctly by setting the value of
        // the input to an empty/not empty value
        let textValue = this.textValue;
        if (!textValue && this.value.length > 0) {
            textValue = ' ';
        }
        else if (!this.value.length && !textValue.trim()) {
            textValue = '';
        }
        return (h("div", { class: "mdc-text-field", onFocus: this.handleTextFieldFocus, tabindex: "0" },
            h("div", { class: "mdc-chip-set mdc-chip-set--input" },
                this.value.map(this.renderChip),
                h("input", { type: "text", id: "my-text-field", required: this.required, disabled: this.disabled, class: `mdc-text-field__input ${hiddenInput ? 'hidden' : ''}`, value: textValue, onBlur: this.handleInputBlur, onFocus: () => {
                        this.editMode = true;
                    }, onInput: this.handleTextInput })),
            h("label", { class: `mdc-floating-label
                        ${textValue ? 'mdc-floating-label--float-above' : ''}
                        ${this.disabled ? 'mdc-text-field--disabled' : ''}
                        ${this.required ? 'mdc-text-field--required' : ''}
                        `, htmlFor: "my-text-field" }, this.label),
            h("div", { class: "mdc-line-ripple" })));
    }
    /**
     * Enter edit mode when the text field receives focus. When editMode is true, the input element will be visible
     * @returns {void}
     */
    handleTextFieldFocus() {
        this.editMode = true;
    }
    /**
     * Exit edit mode when the input element loses focus. This makes sure the input element does not take up any
     * additional space when the user it not typing anything
     * @returns {void}
     */
    handleInputBlur() {
        this.editMode = false;
        this.textValue = ' ';
    }
    handleTextInput(event) {
        event.stopPropagation();
        this.textValue = event.target.value;
        this.input.emit(event.target.value && event.target.value.trim());
    }
    handleInteraction(event) {
        const chip = this.value.find(item => {
            return item.id === event.detail.chipId;
        });
        this.interact.emit(chip);
    }
    handleSelection(event) {
        let chip = this.value.find(item => {
            return item.id === event.detail.chipId;
        });
        chip = Object.assign({}, chip, { selected: event.detail.selected });
        this.change.emit(chip);
    }
    handleRemove(event) {
        const newValue = this.value.filter(chip => {
            return chip.id !== event.detail.chipId;
        });
        this.change.emit(newValue);
    }
    renderChip(chip) {
        switch (this.type) {
            case 'choice':
                return this.renderChoiceChip(chip);
            case 'filter':
                return this.renderFilterChip(chip);
            case 'input':
            default:
                return this.renderDefaultChip(chip);
        }
    }
    renderChoiceChip(chip) {
        return (h("div", { class: `mdc-chip ${chip.selected ? 'mdc-chip--selected' : ''}`, tabindex: "0", id: chip.id },
            chip.icon ? this.renderIcon(chip) : null,
            h("div", { class: "mdc-chip__text" }, chip.text)));
    }
    renderFilterChip(chip) {
        return (h("div", { class: `mdc-chip ${chip.selected ? 'mdc-chip--selected' : ''}`, tabindex: "0", id: chip.id },
            h("div", { class: "mdc-chip__checkmark" },
                h("svg", { class: "mdc-chip__checkmark-svg", viewBox: "-2 -3 30 30" },
                    h("path", { class: "mdc-chip__checkmark-path", fill: "none", stroke: "black", d: "M1.73,12.91 8.1,19.28 22.79,4.59" }))),
            h("div", { class: "mdc-chip__text" }, chip.text)));
    }
    renderDefaultChip(chip) {
        return (h("div", { class: "mdc-chip", tabindex: "0", id: chip.id },
            chip.icon ? this.renderIcon(chip) : null,
            h("div", { class: "mdc-chip__text" }, chip.text),
            chip.removable ? this.renderTrailingIcon() : null));
    }
    renderIcon(chip) {
        const style = {};
        if (chip.iconColor) {
            style['--icon-background-color'] = chip.iconColor;
        }
        return (h("limel-icon", { class: "mdc-chip__icon mdc-chip__icon--leading", name: chip.icon, style: style }));
    }
    renderTrailingIcon() {
        return (h("limel-icon", { class: "mdc-chip__icon mdc-chip__icon--trailing", tabindex: "0", role: "button", name: "multiply" }));
    }
    static get is() { return "limel-chip-set"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "disabled": {
            "type": Boolean,
            "attr": "disabled",
            "reflectToAttr": true
        },
        "editMode": {
            "state": true
        },
        "getEditMode": {
            "method": true
        },
        "host": {
            "elementRef": true
        },
        "label": {
            "type": String,
            "attr": "label"
        },
        "required": {
            "type": Boolean,
            "attr": "required"
        },
        "setFocus": {
            "method": true
        },
        "textValue": {
            "state": true
        },
        "type": {
            "type": String,
            "attr": "type"
        },
        "value": {
            "type": "Any",
            "attr": "value",
            "watchCallbacks": ["handleChangeChips"]
        }
    }; }
    static get events() { return [{
            "name": "interact",
            "method": "interact",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "change",
            "method": "change",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "input",
            "method": "input",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get style() { return ":host {\n  --mdc-theme-primary: var(--lime-primary-color, #26a69a);\n  --mdc-theme-secondary: var(--lime-secondary-color, #29b6f6);\n  --mdc-theme-on-primary: var(--lime-on-primary-color, #fff);\n  --mdc-theme-on-secondary: var(--lime-on-secondary-color, #fff); }\n\n:root {\n  --mdc-theme-primary: #26a69a;\n  --mdc-theme-secondary: #29b6f6;\n  --mdc-theme-background: #fff;\n  --mdc-theme-surface: #fff;\n  --mdc-theme-error: #b00020;\n  --mdc-theme-on-primary: #fff;\n  --mdc-theme-on-secondary: #fff;\n  --mdc-theme-on-surface: #000;\n  --mdc-theme-on-error: #fff;\n  --mdc-theme-text-primary-on-background: rgba(0, 0, 0, 0.87);\n  --mdc-theme-text-secondary-on-background: rgba(0, 0, 0, 0.54);\n  --mdc-theme-text-hint-on-background: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-disabled-on-background: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-icon-on-background: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-primary-on-light: rgba(0, 0, 0, 0.87);\n  --mdc-theme-text-secondary-on-light: rgba(0, 0, 0, 0.54);\n  --mdc-theme-text-hint-on-light: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-disabled-on-light: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-icon-on-light: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-primary-on-dark: white;\n  --mdc-theme-text-secondary-on-dark: rgba(255, 255, 255, 0.7);\n  --mdc-theme-text-hint-on-dark: rgba(255, 255, 255, 0.5);\n  --mdc-theme-text-disabled-on-dark: rgba(255, 255, 255, 0.5);\n  --mdc-theme-text-icon-on-dark: rgba(255, 255, 255, 0.5); }\n\n.mdc-theme--primary {\n  color: #26a69a !important;\n  /* \@alternate */\n  color: var(--mdc-theme-primary, #26a69a) !important; }\n\n.mdc-theme--secondary {\n  color: #29b6f6 !important;\n  /* \@alternate */\n  color: var(--mdc-theme-secondary, #29b6f6) !important; }\n\n.mdc-theme--background {\n  background-color: #fff;\n  /* \@alternate */\n  background-color: var(--mdc-theme-background, #fff); }\n\n.mdc-theme--surface {\n  background-color: #fff;\n  /* \@alternate */\n  background-color: var(--mdc-theme-surface, #fff); }\n\n.mdc-theme--error {\n  color: #b00020 !important;\n  /* \@alternate */\n  color: var(--mdc-theme-error, #b00020) !important; }\n\n.mdc-theme--on-primary {\n  color: #fff !important;\n  /* \@alternate */\n  color: var(--mdc-theme-on-primary, #fff) !important; }\n\n.mdc-theme--on-secondary {\n  color: #fff !important;\n  /* \@alternate */\n  color: var(--mdc-theme-on-secondary, #fff) !important; }\n\n.mdc-theme--on-surface {\n  color: #000 !important;\n  /* \@alternate */\n  color: var(--mdc-theme-on-surface, #000) !important; }\n\n.mdc-theme--on-error {\n  color: #fff !important;\n  /* \@alternate */\n  color: var(--mdc-theme-on-error, #fff) !important; }\n\n.mdc-theme--text-primary-on-background {\n  color: rgba(0, 0, 0, 0.87) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-primary-on-background, rgba(0, 0, 0, 0.87)) !important; }\n\n.mdc-theme--text-secondary-on-background {\n  color: rgba(0, 0, 0, 0.54) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-secondary-on-background, rgba(0, 0, 0, 0.54)) !important; }\n\n.mdc-theme--text-hint-on-background {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.38)) !important; }\n\n.mdc-theme--text-disabled-on-background {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-disabled-on-background, rgba(0, 0, 0, 0.38)) !important; }\n\n.mdc-theme--text-icon-on-background {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-icon-on-background, rgba(0, 0, 0, 0.38)) !important; }\n\n.mdc-theme--text-primary-on-light {\n  color: rgba(0, 0, 0, 0.87) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-primary-on-light, rgba(0, 0, 0, 0.87)) !important; }\n\n.mdc-theme--text-secondary-on-light {\n  color: rgba(0, 0, 0, 0.54) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-secondary-on-light, rgba(0, 0, 0, 0.54)) !important; }\n\n.mdc-theme--text-hint-on-light {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-hint-on-light, rgba(0, 0, 0, 0.38)) !important; }\n\n.mdc-theme--text-disabled-on-light {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-disabled-on-light, rgba(0, 0, 0, 0.38)) !important; }\n\n.mdc-theme--text-icon-on-light {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-icon-on-light, rgba(0, 0, 0, 0.38)) !important; }\n\n.mdc-theme--text-primary-on-dark {\n  color: white !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-primary-on-dark, white) !important; }\n\n.mdc-theme--text-secondary-on-dark {\n  color: rgba(255, 255, 255, 0.7) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-secondary-on-dark, rgba(255, 255, 255, 0.7)) !important; }\n\n.mdc-theme--text-hint-on-dark {\n  color: rgba(255, 255, 255, 0.5) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-hint-on-dark, rgba(255, 255, 255, 0.5)) !important; }\n\n.mdc-theme--text-disabled-on-dark {\n  color: rgba(255, 255, 255, 0.5) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-disabled-on-dark, rgba(255, 255, 255, 0.5)) !important; }\n\n.mdc-theme--text-icon-on-dark {\n  color: rgba(255, 255, 255, 0.5) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-icon-on-dark, rgba(255, 255, 255, 0.5)) !important; }\n\n.mdc-theme--primary-bg {\n  background-color: #26a69a !important;\n  /* \@alternate */\n  background-color: var(--mdc-theme-primary, #26a69a) !important; }\n\n.mdc-theme--secondary-bg {\n  background-color: #29b6f6 !important;\n  /* \@alternate */\n  background-color: var(--mdc-theme-secondary, #29b6f6) !important; }\n\n.mdc-typography {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased; }\n\n.mdc-typography--headline1 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1.6rem;\n  line-height: 1.4rem;\n  font-weight: 300;\n  letter-spacing: -0.01562em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--headline2 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1.6rem;\n  line-height: 1.4rem;\n  font-weight: 300;\n  letter-spacing: -0.00833em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--headline3 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1.6rem;\n  line-height: 1.4rem;\n  font-weight: 400;\n  letter-spacing: normal;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--headline4 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1.6rem;\n  line-height: 1.4rem;\n  font-weight: 400;\n  letter-spacing: 0.00735em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--headline5 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1.4rem;\n  line-height: 1.4rem;\n  font-weight: 400;\n  letter-spacing: normal;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--headline6 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1.4rem;\n  line-height: 1.4rem;\n  font-weight: 500;\n  letter-spacing: 0.0125em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--subtitle1 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1.4rem;\n  line-height: 1.8rem;\n  font-weight: 400;\n  letter-spacing: 0.00937em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--subtitle2 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1.3rem;\n  line-height: 1.8rem;\n  font-weight: 500;\n  letter-spacing: 0.00714em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--body1 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1.3rem;\n  line-height: 2.4rem;\n  font-weight: 400;\n  letter-spacing: 0.03125em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--body2 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1.3rem;\n  line-height: 2.6rem;\n  font-weight: 400;\n  letter-spacing: 0.01786em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--caption {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1.1rem;\n  line-height: 1.4rem;\n  font-weight: 400;\n  letter-spacing: 0.03333em;\n  text-decoration: inherit;\n  text-transform: inherit; }\n\n.mdc-typography--button {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1.4rem;\n  line-height: 3.6rem;\n  font-weight: 500;\n  letter-spacing: 0.08929em;\n  text-decoration: none;\n  text-transform: none; }\n\n.mdc-typography--overline {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1.1rem;\n  line-height: 1.4rem;\n  font-weight: 500;\n  letter-spacing: 0.16667em;\n  text-decoration: none;\n  text-transform: uppercase; }\n\n\@-webkit-keyframes mdc-ripple-fg-radius-in {\n  from {\n    -webkit-animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n    -webkit-transform: translate(var(--mdc-ripple-fg-translate-start, 0)) scale(1);\n    transform: translate(var(--mdc-ripple-fg-translate-start, 0)) scale(1); }\n  to {\n    -webkit-transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1));\n    transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1)); } }\n\n\@keyframes mdc-ripple-fg-radius-in {\n  from {\n    -webkit-animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n    -webkit-transform: translate(var(--mdc-ripple-fg-translate-start, 0)) scale(1);\n    transform: translate(var(--mdc-ripple-fg-translate-start, 0)) scale(1); }\n  to {\n    -webkit-transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1));\n    transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1)); } }\n\n\@-webkit-keyframes mdc-ripple-fg-opacity-in {\n  from {\n    -webkit-animation-timing-function: linear;\n    animation-timing-function: linear;\n    opacity: 0; }\n  to {\n    opacity: var(--mdc-ripple-fg-opacity, 0); } }\n\n\@keyframes mdc-ripple-fg-opacity-in {\n  from {\n    -webkit-animation-timing-function: linear;\n    animation-timing-function: linear;\n    opacity: 0; }\n  to {\n    opacity: var(--mdc-ripple-fg-opacity, 0); } }\n\n\@-webkit-keyframes mdc-ripple-fg-opacity-out {\n  from {\n    -webkit-animation-timing-function: linear;\n    animation-timing-function: linear;\n    opacity: var(--mdc-ripple-fg-opacity, 0); }\n  to {\n    opacity: 0; } }\n\n\@keyframes mdc-ripple-fg-opacity-out {\n  from {\n    -webkit-animation-timing-function: linear;\n    animation-timing-function: linear;\n    opacity: var(--mdc-ripple-fg-opacity, 0); }\n  to {\n    opacity: 0; } }\n\n.mdc-ripple-surface--test-edge-var-bug {\n  --mdc-ripple-surface-test-edge-var: .1rem solid #000;\n  visibility: hidden; }\n  .mdc-ripple-surface--test-edge-var-bug::before {\n    border: var(--mdc-ripple-surface-test-edge-var); }\n\n.mdc-chip {\n  --mdc-ripple-fg-size: 0;\n  --mdc-ripple-left: 0;\n  --mdc-ripple-top: 0;\n  --mdc-ripple-fg-scale: 1;\n  --mdc-ripple-fg-translate-end: 0;\n  --mdc-ripple-fg-translate-start: 0;\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n  will-change: transform, opacity;\n  border-radius: 1.6rem;\n  background-color: #e0e0e0;\n  color: rgba(0, 0, 0, 0.87);\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1.3rem;\n  line-height: 2.6rem;\n  font-weight: 400;\n  letter-spacing: 0.01786em;\n  text-decoration: inherit;\n  text-transform: inherit;\n  height: 3.2rem;\n  display: -ms-inline-flexbox;\n  display: inline-flex;\n  position: relative;\n  -ms-flex-align: center;\n  align-items: center;\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box;\n  padding: 0.7rem 1.2rem;\n  outline: none;\n  cursor: pointer;\n  overflow: hidden; }\n  .mdc-chip::before, .mdc-chip::after {\n    position: absolute;\n    border-radius: 50%;\n    opacity: 0;\n    pointer-events: none;\n    content: \"\"; }\n  .mdc-chip::before {\n    -webkit-transition: opacity 15ms linear, background-color 15ms linear;\n    transition: opacity 15ms linear, background-color 15ms linear;\n    z-index: 1; }\n  .mdc-chip.mdc-ripple-upgraded::before {\n    -webkit-transform: scale(var(--mdc-ripple-fg-scale, 1));\n    transform: scale(var(--mdc-ripple-fg-scale, 1)); }\n  .mdc-chip.mdc-ripple-upgraded::after {\n    top: 0;\n    /* \@noflip */\n    left: 0;\n    -webkit-transform: scale(0);\n    transform: scale(0);\n    -webkit-transform-origin: center center;\n    transform-origin: center center; }\n  .mdc-chip.mdc-ripple-upgraded--unbounded::after {\n    top: var(--mdc-ripple-top, 0);\n    /* \@noflip */\n    left: var(--mdc-ripple-left, 0); }\n  .mdc-chip.mdc-ripple-upgraded--foreground-activation::after {\n    -webkit-animation: 225ms mdc-ripple-fg-radius-in forwards, 75ms mdc-ripple-fg-opacity-in forwards;\n    animation: 225ms mdc-ripple-fg-radius-in forwards, 75ms mdc-ripple-fg-opacity-in forwards; }\n  .mdc-chip.mdc-ripple-upgraded--foreground-deactivation::after {\n    -webkit-animation: 150ms mdc-ripple-fg-opacity-out;\n    animation: 150ms mdc-ripple-fg-opacity-out;\n    -webkit-transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1));\n    transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1)); }\n  .mdc-chip::before, .mdc-chip::after {\n    top: calc(50% - 100%);\n    /* \@noflip */\n    left: calc(50% - 100%);\n    width: 200%;\n    height: 200%; }\n  .mdc-chip.mdc-ripple-upgraded::after {\n    width: var(--mdc-ripple-fg-size, 100%);\n    height: var(--mdc-ripple-fg-size, 100%); }\n  .mdc-chip::before, .mdc-chip::after {\n    background-color: rgba(0, 0, 0, 0.87); }\n  .mdc-chip:hover::before {\n    opacity: 0.04; }\n  .mdc-chip:not(.mdc-ripple-upgraded):focus::before, .mdc-chip.mdc-ripple-upgraded--background-focused::before {\n    -webkit-transition-duration: 75ms;\n    transition-duration: 75ms;\n    opacity: 0.12; }\n  .mdc-chip:not(.mdc-ripple-upgraded)::after {\n    -webkit-transition: opacity 150ms linear;\n    transition: opacity 150ms linear; }\n  .mdc-chip:not(.mdc-ripple-upgraded):active::after {\n    -webkit-transition-duration: 75ms;\n    transition-duration: 75ms;\n    opacity: 0.16; }\n  .mdc-chip.mdc-ripple-upgraded {\n    --mdc-ripple-fg-opacity: 0.16; }\n  .mdc-chip:hover {\n    color: rgba(0, 0, 0, 0.87); }\n  .mdc-chip.mdc-chip--selected .mdc-chip__checkmark,\n  .mdc-chip .mdc-chip__icon--leading:not(.mdc-chip__icon--leading-hidden) {\n    margin: -0.4rem 0.4rem -0.4rem -0.4rem; }\n  .mdc-chip:hover {\n    color: #000;\n    /* \@alternate */\n    color: var(--mdc-theme-on-surface, #000); }\n\n.mdc-chip__icon--leading {\n  color: rgba(0, 0, 0, 0.54); }\n\n.mdc-chip__icon--trailing {\n  color: rgba(0, 0, 0, 0.54); }\n  .mdc-chip__icon--trailing:hover {\n    color: rgba(0, 0, 0, 0.62); }\n  .mdc-chip__icon--trailing:focus {\n    color: rgba(0, 0, 0, 0.87); }\n\n.mdc-chip__icon.mdc-chip__icon--leading:not(.mdc-chip__icon--leading-hidden) {\n  width: 2rem;\n  height: 2rem;\n  font-size: 2rem; }\n\n.mdc-chip__icon.mdc-chip__icon--trailing {\n  width: 1.8rem;\n  height: 1.8rem;\n  font-size: 1.8rem; }\n\n.mdc-chip__icon--trailing {\n  margin: 0 -0.4rem 0 0.4rem; }\n\n.mdc-chip--exit {\n  -webkit-transition: opacity 75ms cubic-bezier(0.4, 0, 0.2, 1), width 150ms cubic-bezier(0, 0, 0.2, 1), padding 100ms linear, margin 100ms linear;\n  transition: opacity 75ms cubic-bezier(0.4, 0, 0.2, 1), width 150ms cubic-bezier(0, 0, 0.2, 1), padding 100ms linear, margin 100ms linear;\n  opacity: 0; }\n\n.mdc-chip__text {\n  white-space: nowrap; }\n\n.mdc-chip__icon {\n  border-radius: 50%;\n  outline: none;\n  vertical-align: middle; }\n\n.mdc-chip__checkmark {\n  height: 2rem; }\n\n.mdc-chip__checkmark-path {\n  -webkit-transition: stroke-dashoffset 150ms 50ms cubic-bezier(0.4, 0, 0.6, 1);\n  transition: stroke-dashoffset 150ms 50ms cubic-bezier(0.4, 0, 0.6, 1);\n  stroke-width: .2rem;\n  stroke-dashoffset: 29.78334;\n  stroke-dasharray: 29.78334; }\n\n.mdc-chip--selected .mdc-chip__checkmark-path {\n  stroke-dashoffset: 0; }\n\n.mdc-chip-set--choice .mdc-chip.mdc-chip--selected::before {\n  opacity: 0.16; }\n\n.mdc-chip-set--choice .mdc-chip.mdc-chip--selected::before, .mdc-chip-set--choice .mdc-chip.mdc-chip--selected::after {\n  background-color: #26a69a; }\n  \@supports not (-ms-ime-align: auto) {\n    .mdc-chip-set--choice .mdc-chip.mdc-chip--selected::before, .mdc-chip-set--choice .mdc-chip.mdc-chip--selected::after {\n      /* \@alternate */\n      background-color: var(--mdc-theme-primary, #26a69a); } }\n\n.mdc-chip-set--choice .mdc-chip.mdc-chip--selected:hover::before {\n  opacity: 0.24; }\n\n.mdc-chip-set--choice .mdc-chip.mdc-chip--selected:not(.mdc-ripple-upgraded):focus::before, .mdc-chip-set--choice .mdc-chip.mdc-chip--selected.mdc-ripple-upgraded--background-focused::before {\n  -webkit-transition-duration: 75ms;\n  transition-duration: 75ms;\n  opacity: 0.4; }\n\n.mdc-chip-set--choice .mdc-chip.mdc-chip--selected:not(.mdc-ripple-upgraded)::after {\n  -webkit-transition: opacity 150ms linear;\n  transition: opacity 150ms linear; }\n\n.mdc-chip-set--choice .mdc-chip.mdc-chip--selected:not(.mdc-ripple-upgraded):active::after {\n  -webkit-transition-duration: 75ms;\n  transition-duration: 75ms;\n  opacity: 0.48; }\n\n.mdc-chip-set--choice .mdc-chip.mdc-chip--selected.mdc-ripple-upgraded {\n  --mdc-ripple-fg-opacity: 0.48; }\n\n.mdc-chip-set--choice .mdc-chip.mdc-chip--selected {\n  color: #26a69a;\n  /* \@alternate */\n  color: var(--mdc-theme-primary, #26a69a); }\n  .mdc-chip-set--choice .mdc-chip.mdc-chip--selected .mdc-chip__icon--leading {\n    color: rgba(38, 166, 154, 0.54); }\n  .mdc-chip-set--choice .mdc-chip.mdc-chip--selected:hover {\n    color: #26a69a;\n    /* \@alternate */\n    color: var(--mdc-theme-primary, #26a69a); }\n\n.mdc-chip-set--choice .mdc-chip .mdc-chip__checkmark-path {\n  stroke: #26a69a;\n  /* \@alternate */\n  stroke: var(--mdc-theme-primary, #26a69a); }\n\n.mdc-chip-set--choice .mdc-chip--selected {\n  background-color: #fff;\n  /* \@alternate */\n  background-color: var(--mdc-theme-surface, #fff); }\n\n.mdc-chip__checkmark-svg {\n  width: 0;\n  height: 2rem;\n  -webkit-transition: width 150ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: width 150ms cubic-bezier(0.4, 0, 0.2, 1); }\n\n.mdc-chip--selected .mdc-chip__checkmark-svg {\n  width: 2rem; }\n\n.mdc-chip-set--filter .mdc-chip__icon--leading {\n  -webkit-transition: opacity 75ms linear;\n  transition: opacity 75ms linear;\n  -webkit-transition-delay: -50ms;\n  transition-delay: -50ms;\n  opacity: 1; }\n  .mdc-chip-set--filter .mdc-chip__icon--leading + .mdc-chip__checkmark {\n    -webkit-transition: opacity 75ms linear;\n    transition: opacity 75ms linear;\n    -webkit-transition-delay: 80ms;\n    transition-delay: 80ms;\n    opacity: 0; }\n    .mdc-chip-set--filter .mdc-chip__icon--leading + .mdc-chip__checkmark .mdc-chip__checkmark-svg {\n      -webkit-transition: width 0ms;\n      transition: width 0ms; }\n\n.mdc-chip-set--filter .mdc-chip--selected .mdc-chip__icon--leading {\n  opacity: 0; }\n  .mdc-chip-set--filter .mdc-chip--selected .mdc-chip__icon--leading + .mdc-chip__checkmark {\n    width: 0;\n    opacity: 1; }\n\n.mdc-chip-set--filter .mdc-chip__icon--leading-hidden.mdc-chip__icon--leading {\n  width: 0;\n  opacity: 0; }\n  .mdc-chip-set--filter .mdc-chip__icon--leading-hidden.mdc-chip__icon--leading + .mdc-chip__checkmark {\n    width: 2rem; }\n\n\@-webkit-keyframes mdc-chip-entry {\n  from {\n    -webkit-transform: scale(0.8);\n    transform: scale(0.8);\n    opacity: .4; }\n  to {\n    -webkit-transform: scale(1);\n    transform: scale(1);\n    opacity: 1; } }\n\n\@keyframes mdc-chip-entry {\n  from {\n    -webkit-transform: scale(0.8);\n    transform: scale(0.8);\n    opacity: .4; }\n  to {\n    -webkit-transform: scale(1);\n    transform: scale(1);\n    opacity: 1; } }\n\n.mdc-chip-set {\n  padding: 0.4rem;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-wrap: wrap;\n  flex-wrap: wrap;\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box; }\n  .mdc-chip-set .mdc-chip {\n    margin: 0.4rem; }\n\n.mdc-chip-set--input .mdc-chip {\n  -webkit-animation: mdc-chip-entry 100ms cubic-bezier(0, 0, 0.2, 1);\n  animation: mdc-chip-entry 100ms cubic-bezier(0, 0, 0.2, 1); }\n\n.mdc-floating-label {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1.4rem;\n  line-height: 1.8rem;\n  font-weight: 400;\n  letter-spacing: 0.00937em;\n  text-decoration: inherit;\n  text-transform: inherit;\n  position: absolute;\n  /* \@noflip */\n  left: 0;\n  /* \@noflip */\n  -webkit-transform-origin: left top;\n  transform-origin: left top;\n  -webkit-transition: color 150ms cubic-bezier(0.4, 0, 0.2, 1), -webkit-transform 150ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: color 150ms cubic-bezier(0.4, 0, 0.2, 1), -webkit-transform 150ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1), color 150ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1), color 150ms cubic-bezier(0.4, 0, 0.2, 1), -webkit-transform 150ms cubic-bezier(0.4, 0, 0.2, 1);\n  /* \@alternate */\n  line-height: 1.84rem;\n  text-align: left;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  cursor: text;\n  overflow: hidden;\n  will-change: transform; }\n  [dir=\"rtl\"] .mdc-floating-label, .mdc-floating-label[dir=\"rtl\"] {\n    /* \@noflip */\n    right: 0;\n    /* \@noflip */\n    left: auto;\n    /* \@noflip */\n    -webkit-transform-origin: right top;\n    transform-origin: right top;\n    /* \@noflip */\n    text-align: right; }\n\n.mdc-floating-label--float-above {\n  cursor: auto; }\n\n.mdc-floating-label--float-above {\n  -webkit-transform: translateY(-50%) scale(0.75);\n  transform: translateY(-50%) scale(0.75); }\n\n.mdc-floating-label--shake {\n  -webkit-animation: mdc-floating-label-shake-float-above-standard 250ms 1;\n  animation: mdc-floating-label-shake-float-above-standard 250ms 1; }\n\n\@-webkit-keyframes mdc-floating-label-shake-float-above-standard {\n  0% {\n    -webkit-transform: translateX(calc(0 - 0%)) translateY(-50%) scale(0.75);\n    transform: translateX(calc(0 - 0%)) translateY(-50%) scale(0.75); }\n  33% {\n    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    -webkit-transform: translateX(calc(4% - 0%)) translateY(-50%) scale(0.75);\n    transform: translateX(calc(4% - 0%)) translateY(-50%) scale(0.75); }\n  66% {\n    -webkit-animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    -webkit-transform: translateX(calc(-4% - 0%)) translateY(-50%) scale(0.75);\n    transform: translateX(calc(-4% - 0%)) translateY(-50%) scale(0.75); }\n  100% {\n    -webkit-transform: translateX(calc(0 - 0%)) translateY(-50%) scale(0.75);\n    transform: translateX(calc(0 - 0%)) translateY(-50%) scale(0.75); } }\n\n\@keyframes mdc-floating-label-shake-float-above-standard {\n  0% {\n    -webkit-transform: translateX(calc(0 - 0%)) translateY(-50%) scale(0.75);\n    transform: translateX(calc(0 - 0%)) translateY(-50%) scale(0.75); }\n  33% {\n    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    -webkit-transform: translateX(calc(4% - 0%)) translateY(-50%) scale(0.75);\n    transform: translateX(calc(4% - 0%)) translateY(-50%) scale(0.75); }\n  66% {\n    -webkit-animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    -webkit-transform: translateX(calc(-4% - 0%)) translateY(-50%) scale(0.75);\n    transform: translateX(calc(-4% - 0%)) translateY(-50%) scale(0.75); }\n  100% {\n    -webkit-transform: translateX(calc(0 - 0%)) translateY(-50%) scale(0.75);\n    transform: translateX(calc(0 - 0%)) translateY(-50%) scale(0.75); } }\n\n.mdc-line-ripple {\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  height: .2rem;\n  -webkit-transform: scaleX(0);\n  transform: scaleX(0);\n  -webkit-transition: opacity 180ms cubic-bezier(0.4, 0, 0.2, 1), -webkit-transform 180ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: opacity 180ms cubic-bezier(0.4, 0, 0.2, 1), -webkit-transform 180ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: transform 180ms cubic-bezier(0.4, 0, 0.2, 1), opacity 180ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: transform 180ms cubic-bezier(0.4, 0, 0.2, 1), opacity 180ms cubic-bezier(0.4, 0, 0.2, 1), -webkit-transform 180ms cubic-bezier(0.4, 0, 0.2, 1);\n  opacity: 0;\n  z-index: 2; }\n\n.mdc-line-ripple--active {\n  -webkit-transform: scaleX(1);\n  transform: scaleX(1);\n  opacity: 1; }\n\n.mdc-line-ripple--deactivating {\n  opacity: 0; }\n\n.mdc-notched-outline {\n  display: -ms-flexbox;\n  display: flex;\n  position: absolute;\n  right: 0;\n  left: 0;\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box;\n  width: 100%;\n  max-width: 100%;\n  height: 100%;\n  /* \@noflip */\n  text-align: left;\n  pointer-events: none; }\n  [dir=\"rtl\"] .mdc-notched-outline, .mdc-notched-outline[dir=\"rtl\"] {\n    /* \@noflip */\n    text-align: right; }\n  .mdc-notched-outline__leading, .mdc-notched-outline__notch, .mdc-notched-outline__trailing {\n    -webkit-box-sizing: border-box;\n    box-sizing: border-box;\n    height: 100%;\n    border-top: .1rem solid;\n    border-bottom: .1rem solid;\n    pointer-events: none; }\n  .mdc-notched-outline__leading {\n    /* \@noflip */\n    border-left: 0.1rem solid;\n    /* \@noflip */\n    border-right: none;\n    width: 1.2rem; }\n    [dir=\"rtl\"] .mdc-notched-outline__leading, .mdc-notched-outline__leading[dir=\"rtl\"] {\n      /* \@noflip */\n      border-left: none;\n      /* \@noflip */\n      border-right: 0.1rem solid; }\n  .mdc-notched-outline__trailing {\n    /* \@noflip */\n    border-left: none;\n    /* \@noflip */\n    border-right: 0.1rem solid;\n    -ms-flex-positive: 1;\n    flex-grow: 1; }\n    [dir=\"rtl\"] .mdc-notched-outline__trailing, .mdc-notched-outline__trailing[dir=\"rtl\"] {\n      /* \@noflip */\n      border-left: 0.1rem solid;\n      /* \@noflip */\n      border-right: none; }\n  .mdc-notched-outline__notch {\n    -ms-flex: 0 0 auto;\n    flex: 0 0 auto;\n    width: auto;\n    max-width: calc(100% - 1.2rem * 2); }\n  .mdc-notched-outline .mdc-floating-label {\n    display: inline-block;\n    position: relative;\n    top: 1.7rem;\n    bottom: auto;\n    max-width: 100%; }\n  .mdc-notched-outline .mdc-floating-label--float-above {\n    text-overflow: clip; }\n  .mdc-notched-outline--upgraded .mdc-floating-label--float-above {\n    max-width: calc(100% / .75); }\n\n.mdc-notched-outline--notched .mdc-notched-outline__notch {\n  /* \@noflip */\n  padding-left: 0;\n  /* \@noflip */\n  padding-right: 0.8rem;\n  border-top: none; }\n  [dir=\"rtl\"] .mdc-notched-outline--notched .mdc-notched-outline__notch, .mdc-notched-outline--notched .mdc-notched-outline__notch[dir=\"rtl\"] {\n    /* \@noflip */\n    padding-left: 0.8rem;\n    /* \@noflip */\n    padding-right: 0; }\n\n.mdc-notched-outline--no-label .mdc-notched-outline__notch {\n  padding: 0; }\n\n.mdc-text-field-helper-text {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1.1rem;\n  line-height: 1.4rem;\n  font-weight: 400;\n  letter-spacing: 0.03333em;\n  text-decoration: inherit;\n  text-transform: inherit;\n  display: block;\n  margin-top: 0;\n  /* \@alternate */\n  line-height: normal;\n  margin: 0;\n  -webkit-transition: opacity 180ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: opacity 180ms cubic-bezier(0.4, 0, 0.2, 1);\n  opacity: 0;\n  will-change: opacity; }\n  .mdc-text-field-helper-text::before {\n    display: inline-block;\n    width: 0;\n    height: 1.6rem;\n    content: \"\";\n    vertical-align: 0; }\n\n.mdc-text-field-helper-text--persistent {\n  -webkit-transition: none;\n  transition: none;\n  opacity: 1;\n  will-change: initial; }\n\n.mdc-text-field--with-leading-icon .mdc-text-field__icon,\n.mdc-text-field--with-trailing-icon .mdc-text-field__icon {\n  position: absolute;\n  bottom: 1.6rem;\n  cursor: pointer; }\n\n.mdc-text-field__icon:not([tabindex]),\n.mdc-text-field__icon[tabindex=\"-1\"] {\n  cursor: default;\n  pointer-events: none; }\n\n.mdc-text-field {\n  --mdc-ripple-fg-size: 0;\n  --mdc-ripple-left: 0;\n  --mdc-ripple-top: 0;\n  --mdc-ripple-fg-scale: 1;\n  --mdc-ripple-fg-translate-end: 0;\n  --mdc-ripple-fg-translate-start: 0;\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n  will-change: transform, opacity;\n  border-radius: 0.4rem 0.4rem 0 0;\n  display: -ms-inline-flexbox;\n  display: inline-flex;\n  position: relative;\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box;\n  height: 5.6rem;\n  overflow: hidden;\n  will-change: opacity, transform, color; }\n  .mdc-text-field::before, .mdc-text-field::after {\n    position: absolute;\n    border-radius: 50%;\n    opacity: 0;\n    pointer-events: none;\n    content: \"\"; }\n  .mdc-text-field::before {\n    -webkit-transition: opacity 15ms linear, background-color 15ms linear;\n    transition: opacity 15ms linear, background-color 15ms linear;\n    z-index: 1; }\n  .mdc-text-field.mdc-ripple-upgraded::before {\n    -webkit-transform: scale(var(--mdc-ripple-fg-scale, 1));\n    transform: scale(var(--mdc-ripple-fg-scale, 1)); }\n  .mdc-text-field.mdc-ripple-upgraded::after {\n    top: 0;\n    /* \@noflip */\n    left: 0;\n    -webkit-transform: scale(0);\n    transform: scale(0);\n    -webkit-transform-origin: center center;\n    transform-origin: center center; }\n  .mdc-text-field.mdc-ripple-upgraded--unbounded::after {\n    top: var(--mdc-ripple-top, 0);\n    /* \@noflip */\n    left: var(--mdc-ripple-left, 0); }\n  .mdc-text-field.mdc-ripple-upgraded--foreground-activation::after {\n    -webkit-animation: 225ms mdc-ripple-fg-radius-in forwards, 75ms mdc-ripple-fg-opacity-in forwards;\n    animation: 225ms mdc-ripple-fg-radius-in forwards, 75ms mdc-ripple-fg-opacity-in forwards; }\n  .mdc-text-field.mdc-ripple-upgraded--foreground-deactivation::after {\n    -webkit-animation: 150ms mdc-ripple-fg-opacity-out;\n    animation: 150ms mdc-ripple-fg-opacity-out;\n    -webkit-transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1));\n    transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1)); }\n  .mdc-text-field::before, .mdc-text-field::after {\n    background-color: rgba(0, 0, 0, 0.87); }\n  .mdc-text-field:hover::before {\n    opacity: 0.04; }\n  .mdc-text-field:not(.mdc-ripple-upgraded):focus::before, .mdc-text-field.mdc-ripple-upgraded--background-focused::before {\n    -webkit-transition-duration: 75ms;\n    transition-duration: 75ms;\n    opacity: 0.12; }\n  .mdc-text-field::before, .mdc-text-field::after {\n    top: calc(50% - 100%);\n    /* \@noflip */\n    left: calc(50% - 100%);\n    width: 200%;\n    height: 200%; }\n  .mdc-text-field.mdc-ripple-upgraded::after {\n    width: var(--mdc-ripple-fg-size, 100%);\n    height: var(--mdc-ripple-fg-size, 100%); }\n  .mdc-text-field:not(.mdc-text-field--disabled) .mdc-floating-label {\n    color: rgba(0, 0, 0, 0.6); }\n  .mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__input::-webkit-input-placeholder {\n    color: rgba(0, 0, 0, 0.6); }\n  .mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__input:-ms-input-placeholder {\n    color: rgba(0, 0, 0, 0.6); }\n  .mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__input::-ms-input-placeholder {\n    color: rgba(0, 0, 0, 0.6); }\n  .mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__input::placeholder {\n    color: rgba(0, 0, 0, 0.6); }\n  .mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__input {\n    color: rgba(0, 0, 0, 0.87); }\n  .mdc-text-field .mdc-text-field__input {\n    caret-color: #26a69a;\n    /* \@alternate */\n    caret-color: var(--mdc-theme-primary, #26a69a); }\n  .mdc-text-field:not(.mdc-text-field--disabled):not(.mdc-text-field--outlined):not(.mdc-text-field--textarea) .mdc-text-field__input {\n    border-bottom-color: rgba(0, 0, 0, 0.12); }\n  .mdc-text-field:not(.mdc-text-field--disabled):not(.mdc-text-field--outlined):not(.mdc-text-field--textarea) .mdc-text-field__input:hover {\n    border-bottom-color: rgba(0, 0, 0, 0.12); }\n  .mdc-text-field .mdc-line-ripple {\n    background-color: #26a69a;\n    /* \@alternate */\n    background-color: var(--mdc-theme-primary, #26a69a); }\n  .mdc-text-field:not(.mdc-text-field--disabled):not(.mdc-text-field--textarea) {\n    border-bottom-color: rgba(0, 0, 0, 0.12); }\n  .mdc-text-field:not(.mdc-text-field--disabled) + .mdc-text-field-helper-text {\n    color: rgba(0, 0, 0, 0.6); }\n  .mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__icon {\n    color: rgba(0, 0, 0, 0.54); }\n  .mdc-text-field:not(.mdc-text-field--disabled) {\n    background-color: #fff; }\n  .mdc-text-field .mdc-floating-label {\n    /* \@noflip */\n    left: 1.6rem;\n    /* \@noflip */\n    right: initial;\n    top: 1.8rem;\n    pointer-events: none; }\n    [dir=\"rtl\"] .mdc-text-field .mdc-floating-label, .mdc-text-field .mdc-floating-label[dir=\"rtl\"] {\n      /* \@noflip */\n      left: initial;\n      /* \@noflip */\n      right: 1.6rem; }\n  .mdc-text-field--textarea .mdc-floating-label {\n    /* \@noflip */\n    left: 0.4rem;\n    /* \@noflip */\n    right: initial; }\n    [dir=\"rtl\"] .mdc-text-field--textarea .mdc-floating-label, .mdc-text-field--textarea .mdc-floating-label[dir=\"rtl\"] {\n      /* \@noflip */\n      left: initial;\n      /* \@noflip */\n      right: 0.4rem; }\n  .mdc-text-field--outlined .mdc-floating-label {\n    /* \@noflip */\n    left: 0.4rem;\n    /* \@noflip */\n    right: initial;\n    top: 1.7rem; }\n    [dir=\"rtl\"] .mdc-text-field--outlined .mdc-floating-label, .mdc-text-field--outlined .mdc-floating-label[dir=\"rtl\"] {\n      /* \@noflip */\n      left: initial;\n      /* \@noflip */\n      right: 0.4rem; }\n  .mdc-text-field--outlined--with-leading-icon .mdc-floating-label {\n    /* \@noflip */\n    left: 3.6rem;\n    /* \@noflip */\n    right: initial; }\n    [dir=\"rtl\"] .mdc-text-field--outlined--with-leading-icon .mdc-floating-label, .mdc-text-field--outlined--with-leading-icon .mdc-floating-label[dir=\"rtl\"] {\n      /* \@noflip */\n      left: initial;\n      /* \@noflip */\n      right: 3.6rem; }\n    .mdc-text-field--outlined--with-leading-icon .mdc-floating-label--float-above {\n      /* \@noflip */\n      left: 4rem;\n      /* \@noflip */\n      right: initial; }\n      [dir=\"rtl\"] .mdc-text-field--outlined--with-leading-icon .mdc-floating-label--float-above, .mdc-text-field--outlined--with-leading-icon .mdc-floating-label--float-above[dir=\"rtl\"] {\n        /* \@noflip */\n        left: initial;\n        /* \@noflip */\n        right: 4rem; }\n\n.mdc-text-field__input {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1.4rem;\n  line-height: 1.8rem;\n  font-weight: 400;\n  letter-spacing: 0.00937em;\n  text-decoration: inherit;\n  text-transform: inherit;\n  -ms-flex-item-align: end;\n  align-self: flex-end;\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box;\n  width: 100%;\n  height: 100%;\n  padding: 2.0rem 1.6rem .6rem;\n  -webkit-transition: opacity 180ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: opacity 180ms cubic-bezier(0.4, 0, 0.2, 1);\n  border: none;\n  border-bottom: .1rem solid;\n  border-radius: 0;\n  background: none;\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  appearance: none; }\n  .mdc-text-field__input::-webkit-input-placeholder {\n    -webkit-transition: color 180ms cubic-bezier(0.4, 0, 0.2, 1);\n    transition: color 180ms cubic-bezier(0.4, 0, 0.2, 1);\n    opacity: 1; }\n  .mdc-text-field__input:-ms-input-placeholder {\n    -webkit-transition: color 180ms cubic-bezier(0.4, 0, 0.2, 1);\n    transition: color 180ms cubic-bezier(0.4, 0, 0.2, 1);\n    opacity: 1; }\n  .mdc-text-field__input::-ms-input-placeholder {\n    -webkit-transition: color 180ms cubic-bezier(0.4, 0, 0.2, 1);\n    transition: color 180ms cubic-bezier(0.4, 0, 0.2, 1);\n    opacity: 1; }\n  .mdc-text-field__input::placeholder {\n    -webkit-transition: color 180ms cubic-bezier(0.4, 0, 0.2, 1);\n    transition: color 180ms cubic-bezier(0.4, 0, 0.2, 1);\n    opacity: 1; }\n  .mdc-text-field__input:focus {\n    outline: none; }\n  .mdc-text-field__input:invalid {\n    -webkit-box-shadow: none;\n    box-shadow: none; }\n  .mdc-text-field__input:-webkit-autofill {\n    z-index: auto !important; }\n\n.mdc-text-field__input:-webkit-autofill + .mdc-floating-label {\n  -webkit-transform: translateY(-50%) scale(0.75);\n  transform: translateY(-50%) scale(0.75);\n  cursor: auto; }\n\n.mdc-text-field--outlined {\n  border: none;\n  overflow: visible; }\n  .mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-notched-outline__leading,\n  .mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-notched-outline__notch,\n  .mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-notched-outline__trailing {\n    border-color: rgba(0, 0, 0, 0.24); }\n  .mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__input:hover ~ .mdc-notched-outline .mdc-notched-outline__leading,\n  .mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__input:hover ~ .mdc-notched-outline .mdc-notched-outline__notch,\n  .mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__input:hover ~ .mdc-notched-outline .mdc-notched-outline__trailing,\n  .mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__icon:hover ~ .mdc-notched-outline .mdc-notched-outline__leading,\n  .mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__icon:hover ~ .mdc-notched-outline .mdc-notched-outline__notch,\n  .mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__icon:hover ~ .mdc-notched-outline .mdc-notched-outline__trailing {\n    border-color: rgba(0, 0, 0, 0.87); }\n  .mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__leading,\n  .mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__notch,\n  .mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__trailing {\n    border-color: #26a69a;\n    /* \@alternate */\n    border-color: var(--mdc-theme-primary, #26a69a); }\n  .mdc-text-field--outlined .mdc-floating-label--shake {\n    -webkit-animation: mdc-floating-label-shake-float-above-text-field-outlined 250ms 1;\n    animation: mdc-floating-label-shake-float-above-text-field-outlined 250ms 1; }\n  .mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__leading {\n    /* \@noflip */\n    border-radius: 0.4rem 0 0 0.4rem; }\n    [dir=\"rtl\"] .mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__leading, .mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__leading[dir=\"rtl\"] {\n      /* \@noflip */\n      border-radius: 0 0.4rem 0.4rem 0; }\n  .mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__trailing {\n    /* \@noflip */\n    border-radius: 0 0.4rem 0.4rem 0; }\n    [dir=\"rtl\"] .mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__trailing, .mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__trailing[dir=\"rtl\"] {\n      /* \@noflip */\n      border-radius: 0.4rem 0 0 0.4rem; }\n  .mdc-text-field--outlined .mdc-floating-label--float-above {\n    -webkit-transform: translateY(-144%) scale(1);\n    transform: translateY(-144%) scale(1); }\n  .mdc-text-field--outlined .mdc-floating-label--float-above {\n    font-size: 1.2rem; }\n  .mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,\n  .mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above {\n    -webkit-transform: translateY(-130%) scale(0.75);\n    transform: translateY(-130%) scale(0.75); }\n  .mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,\n  .mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above {\n    font-size: 1.6rem; }\n  .mdc-text-field--outlined::before, .mdc-text-field--outlined::after {\n    content: none; }\n  .mdc-text-field--outlined:not(.mdc-text-field--disabled) {\n    background-color: transparent; }\n  .mdc-text-field--outlined .mdc-text-field__input {\n    display: -ms-flexbox;\n    display: flex;\n    padding: 1.2rem 1.6rem 1.4rem;\n    border: none !important;\n    background-color: transparent;\n    z-index: 1; }\n  .mdc-text-field--outlined .mdc-text-field__icon {\n    z-index: 2; }\n\n.mdc-text-field--outlined.mdc-text-field--focused .mdc-notched-outline__leading,\n.mdc-text-field--outlined.mdc-text-field--focused .mdc-notched-outline__notch,\n.mdc-text-field--outlined.mdc-text-field--focused .mdc-notched-outline__trailing {\n  border-width: 0.2rem; }\n\n.mdc-text-field--outlined.mdc-text-field--disabled {\n  background-color: transparent; }\n  .mdc-text-field--outlined.mdc-text-field--disabled .mdc-notched-outline__leading,\n  .mdc-text-field--outlined.mdc-text-field--disabled .mdc-notched-outline__notch,\n  .mdc-text-field--outlined.mdc-text-field--disabled .mdc-notched-outline__trailing {\n    border-color: rgba(0, 0, 0, 0.06); }\n  .mdc-text-field--outlined.mdc-text-field--disabled .mdc-text-field__input {\n    border-bottom: none; }\n\n.mdc-text-field--outlined.mdc-text-field--dense {\n  height: 4.8rem; }\n  .mdc-text-field--outlined.mdc-text-field--dense .mdc-floating-label--float-above {\n    -webkit-transform: translateY(-134%) scale(1);\n    transform: translateY(-134%) scale(1); }\n  .mdc-text-field--outlined.mdc-text-field--dense .mdc-floating-label--float-above {\n    font-size: 1.28rem; }\n  .mdc-text-field--outlined.mdc-text-field--dense.mdc-notched-outline--upgraded .mdc-floating-label--float-above,\n  .mdc-text-field--outlined.mdc-text-field--dense .mdc-notched-outline--upgraded .mdc-floating-label--float-above {\n    -webkit-transform: translateY(-120%) scale(0.8);\n    transform: translateY(-120%) scale(0.8); }\n  .mdc-text-field--outlined.mdc-text-field--dense.mdc-notched-outline--upgraded .mdc-floating-label--float-above,\n  .mdc-text-field--outlined.mdc-text-field--dense .mdc-notched-outline--upgraded .mdc-floating-label--float-above {\n    font-size: 1.6rem; }\n  .mdc-text-field--outlined.mdc-text-field--dense .mdc-floating-label--shake {\n    -webkit-animation: mdc-floating-label-shake-float-above-text-field-outlined-dense 250ms 1;\n    animation: mdc-floating-label-shake-float-above-text-field-outlined-dense 250ms 1; }\n  .mdc-text-field--outlined.mdc-text-field--dense .mdc-text-field__input {\n    padding: 1.2rem 1.2rem .7rem; }\n  .mdc-text-field--outlined.mdc-text-field--dense .mdc-floating-label {\n    top: 1.4rem; }\n  .mdc-text-field--outlined.mdc-text-field--dense .mdc-text-field__icon {\n    top: 1.2rem; }\n\n.mdc-text-field--with-leading-icon .mdc-text-field__icon {\n  /* \@noflip */\n  left: 1.6rem;\n  /* \@noflip */\n  right: initial; }\n  [dir=\"rtl\"] .mdc-text-field--with-leading-icon .mdc-text-field__icon, .mdc-text-field--with-leading-icon .mdc-text-field__icon[dir=\"rtl\"] {\n    /* \@noflip */\n    left: initial;\n    /* \@noflip */\n    right: 1.6rem; }\n\n.mdc-text-field--with-leading-icon .mdc-text-field__input {\n  /* \@noflip */\n  padding-left: 4.8rem;\n  /* \@noflip */\n  padding-right: 1.6rem; }\n  [dir=\"rtl\"] .mdc-text-field--with-leading-icon .mdc-text-field__input, .mdc-text-field--with-leading-icon .mdc-text-field__input[dir=\"rtl\"] {\n    /* \@noflip */\n    padding-left: 1.6rem;\n    /* \@noflip */\n    padding-right: 4.8rem; }\n\n.mdc-text-field--with-leading-icon .mdc-floating-label {\n  /* \@noflip */\n  left: 4.8rem;\n  /* \@noflip */\n  right: initial; }\n  [dir=\"rtl\"] .mdc-text-field--with-leading-icon .mdc-floating-label, .mdc-text-field--with-leading-icon .mdc-floating-label[dir=\"rtl\"] {\n    /* \@noflip */\n    left: initial;\n    /* \@noflip */\n    right: 4.8rem; }\n\n.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-text-field__icon {\n  /* \@noflip */\n  left: 1.6rem;\n  /* \@noflip */\n  right: initial; }\n  [dir=\"rtl\"] .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-text-field__icon, .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-text-field__icon[dir=\"rtl\"] {\n    /* \@noflip */\n    left: initial;\n    /* \@noflip */\n    right: 1.6rem; }\n\n.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-text-field__input {\n  /* \@noflip */\n  padding-left: 4.8rem;\n  /* \@noflip */\n  padding-right: 1.6rem; }\n  [dir=\"rtl\"] .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-text-field__input, .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-text-field__input[dir=\"rtl\"] {\n    /* \@noflip */\n    padding-left: 1.6rem;\n    /* \@noflip */\n    padding-right: 4.8rem; }\n\n.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label--float-above {\n  -webkit-transform: translateY(-144%) translateX(-3.2rem) scale(1);\n  transform: translateY(-144%) translateX(-3.2rem) scale(1); }\n  [dir=\"rtl\"] .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label--float-above, .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label--float-above[dir=\"rtl\"] {\n    -webkit-transform: translateY(-144%) translateX(3.2rem) scale(1);\n    transform: translateY(-144%) translateX(3.2rem) scale(1); }\n\n.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label--float-above {\n  font-size: 1.2rem; }\n\n.mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,\n.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above {\n  -webkit-transform: translateY(-130%) translateX(-3.2rem) scale(0.75);\n  transform: translateY(-130%) translateX(-3.2rem) scale(0.75); }\n  [dir=\"rtl\"] .mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above, .mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above[dir=\"rtl\"], [dir=\"rtl\"]\n  .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above,\n  .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above[dir=\"rtl\"] {\n    -webkit-transform: translateY(-130%) translateX(3.2rem) scale(0.75);\n    transform: translateY(-130%) translateX(3.2rem) scale(0.75); }\n\n.mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,\n.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above {\n  font-size: 1.6rem; }\n\n.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label--shake {\n  -webkit-animation: mdc-floating-label-shake-float-above-text-field-outlined-leading-icon 250ms 1;\n  animation: mdc-floating-label-shake-float-above-text-field-outlined-leading-icon 250ms 1; }\n\n[dir=\"rtl\"] .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label--shake, .mdc-text-field--with-leading-icon.mdc-text-field--outlined[dir=\"rtl\"] .mdc-floating-label--shake {\n  -webkit-animation: mdc-floating-label-shake-float-above-text-field-outlined-leading-icon-rtl 250ms 1;\n  animation: mdc-floating-label-shake-float-above-text-field-outlined-leading-icon-rtl 250ms 1; }\n\n.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label {\n  /* \@noflip */\n  left: 3.6rem;\n  /* \@noflip */\n  right: initial; }\n  [dir=\"rtl\"] .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label, .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label[dir=\"rtl\"] {\n    /* \@noflip */\n    left: initial;\n    /* \@noflip */\n    right: 3.6rem; }\n\n.mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense .mdc-floating-label--float-above {\n  -webkit-transform: translateY(-134%) translateX(-2.1rem) scale(1);\n  transform: translateY(-134%) translateX(-2.1rem) scale(1); }\n  [dir=\"rtl\"] .mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense .mdc-floating-label--float-above, .mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense .mdc-floating-label--float-above[dir=\"rtl\"] {\n    -webkit-transform: translateY(-134%) translateX(2.1rem) scale(1);\n    transform: translateY(-134%) translateX(2.1rem) scale(1); }\n\n.mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense .mdc-floating-label--float-above {\n  font-size: 1.28rem; }\n\n.mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense.mdc-notched-outline--upgraded .mdc-floating-label--float-above,\n.mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense .mdc-notched-outline--upgraded .mdc-floating-label--float-above {\n  -webkit-transform: translateY(-120%) translateX(-2.1rem) scale(0.8);\n  transform: translateY(-120%) translateX(-2.1rem) scale(0.8); }\n  [dir=\"rtl\"] .mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense.mdc-notched-outline--upgraded .mdc-floating-label--float-above, .mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense.mdc-notched-outline--upgraded .mdc-floating-label--float-above[dir=\"rtl\"], [dir=\"rtl\"]\n  .mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense .mdc-notched-outline--upgraded .mdc-floating-label--float-above,\n  .mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense .mdc-notched-outline--upgraded .mdc-floating-label--float-above[dir=\"rtl\"] {\n    -webkit-transform: translateY(-120%) translateX(2.1rem) scale(0.8);\n    transform: translateY(-120%) translateX(2.1rem) scale(0.8); }\n\n.mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense.mdc-notched-outline--upgraded .mdc-floating-label--float-above,\n.mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense .mdc-notched-outline--upgraded .mdc-floating-label--float-above {\n  font-size: 1.6rem; }\n\n.mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense .mdc-floating-label--shake {\n  -webkit-animation: mdc-floating-label-shake-float-above-text-field-outlined-leading-icon-dense 250ms 1;\n  animation: mdc-floating-label-shake-float-above-text-field-outlined-leading-icon-dense 250ms 1; }\n\n[dir=\"rtl\"] .mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense .mdc-floating-label--shake, .mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense[dir=\"rtl\"] .mdc-floating-label--shake {\n  -webkit-animation: mdc-floating-label-shake-float-above-text-field-outlined-leading-icon-dense-rtl 250ms 1;\n  animation: mdc-floating-label-shake-float-above-text-field-outlined-leading-icon-dense-rtl 250ms 1; }\n\n.mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense .mdc-floating-label {\n  /* \@noflip */\n  left: 3.2rem;\n  /* \@noflip */\n  right: initial; }\n  [dir=\"rtl\"] .mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense .mdc-floating-label, .mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense .mdc-floating-label[dir=\"rtl\"] {\n    /* \@noflip */\n    left: initial;\n    /* \@noflip */\n    right: 3.2rem; }\n\n.mdc-text-field--with-trailing-icon .mdc-text-field__icon {\n  /* \@noflip */\n  left: initial;\n  /* \@noflip */\n  right: 1.2rem; }\n  [dir=\"rtl\"] .mdc-text-field--with-trailing-icon .mdc-text-field__icon, .mdc-text-field--with-trailing-icon .mdc-text-field__icon[dir=\"rtl\"] {\n    /* \@noflip */\n    left: 1.2rem;\n    /* \@noflip */\n    right: initial; }\n\n.mdc-text-field--with-trailing-icon .mdc-text-field__input {\n  /* \@noflip */\n  padding-left: 1.2rem;\n  /* \@noflip */\n  padding-right: 4.8rem; }\n  [dir=\"rtl\"] .mdc-text-field--with-trailing-icon .mdc-text-field__input, .mdc-text-field--with-trailing-icon .mdc-text-field__input[dir=\"rtl\"] {\n    /* \@noflip */\n    padding-left: 4.8rem;\n    /* \@noflip */\n    padding-right: 1.2rem; }\n\n.mdc-text-field--with-trailing-icon.mdc-text-field--outlined .mdc-text-field__icon {\n  /* \@noflip */\n  left: initial;\n  /* \@noflip */\n  right: 1.6rem; }\n  [dir=\"rtl\"] .mdc-text-field--with-trailing-icon.mdc-text-field--outlined .mdc-text-field__icon, .mdc-text-field--with-trailing-icon.mdc-text-field--outlined .mdc-text-field__icon[dir=\"rtl\"] {\n    /* \@noflip */\n    left: 1.6rem;\n    /* \@noflip */\n    right: initial; }\n\n.mdc-text-field--with-trailing-icon.mdc-text-field--outlined .mdc-text-field__input {\n  /* \@noflip */\n  padding-left: 1.6rem;\n  /* \@noflip */\n  padding-right: 4.8rem; }\n  [dir=\"rtl\"] .mdc-text-field--with-trailing-icon.mdc-text-field--outlined .mdc-text-field__input, .mdc-text-field--with-trailing-icon.mdc-text-field--outlined .mdc-text-field__input[dir=\"rtl\"] {\n    /* \@noflip */\n    padding-left: 4.8rem;\n    /* \@noflip */\n    padding-right: 1.6rem; }\n\n.mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon .mdc-text-field__icon {\n  /* \@noflip */\n  left: 1.6rem;\n  /* \@noflip */\n  right: auto; }\n  [dir=\"rtl\"] .mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon .mdc-text-field__icon, .mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon .mdc-text-field__icon[dir=\"rtl\"] {\n    /* \@noflip */\n    left: auto;\n    /* \@noflip */\n    right: 1.6rem; }\n  .mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon .mdc-text-field__icon ~ .mdc-text-field__icon {\n    /* \@noflip */\n    right: 1.2rem;\n    /* \@noflip */\n    left: auto; }\n    [dir=\"rtl\"] .mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon .mdc-text-field__icon ~ .mdc-text-field__icon, .mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon .mdc-text-field__icon ~ .mdc-text-field__icon[dir=\"rtl\"] {\n      /* \@noflip */\n      right: auto;\n      /* \@noflip */\n      left: 1.2rem; }\n\n.mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon .mdc-text-field__input {\n  /* \@noflip */\n  padding-left: 4.8rem;\n  /* \@noflip */\n  padding-right: 4.8rem; }\n  [dir=\"rtl\"] .mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon .mdc-text-field__input, .mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon .mdc-text-field__input[dir=\"rtl\"] {\n    /* \@noflip */\n    padding-left: 4.8rem;\n    /* \@noflip */\n    padding-right: 4.8rem; }\n\n.mdc-text-field--with-leading-icon.mdc-text-field--dense .mdc-text-field__icon,\n.mdc-text-field--with-trailing-icon.mdc-text-field--dense .mdc-text-field__icon {\n  bottom: 1.6rem;\n  -webkit-transform: scale(0.8);\n  transform: scale(0.8); }\n\n.mdc-text-field--with-leading-icon.mdc-text-field--dense .mdc-text-field__icon {\n  /* \@noflip */\n  left: 1.2rem;\n  /* \@noflip */\n  right: initial; }\n  [dir=\"rtl\"] .mdc-text-field--with-leading-icon.mdc-text-field--dense .mdc-text-field__icon, .mdc-text-field--with-leading-icon.mdc-text-field--dense .mdc-text-field__icon[dir=\"rtl\"] {\n    /* \@noflip */\n    left: initial;\n    /* \@noflip */\n    right: 1.2rem; }\n\n.mdc-text-field--with-leading-icon.mdc-text-field--dense .mdc-text-field__input {\n  /* \@noflip */\n  padding-left: 4.4rem;\n  /* \@noflip */\n  padding-right: 1.2rem; }\n  [dir=\"rtl\"] .mdc-text-field--with-leading-icon.mdc-text-field--dense .mdc-text-field__input, .mdc-text-field--with-leading-icon.mdc-text-field--dense .mdc-text-field__input[dir=\"rtl\"] {\n    /* \@noflip */\n    padding-left: 1.2rem;\n    /* \@noflip */\n    padding-right: 4.4rem; }\n\n.mdc-text-field--with-leading-icon.mdc-text-field--dense .mdc-floating-label {\n  /* \@noflip */\n  left: 4.4rem;\n  /* \@noflip */\n  right: initial; }\n  [dir=\"rtl\"] .mdc-text-field--with-leading-icon.mdc-text-field--dense .mdc-floating-label, .mdc-text-field--with-leading-icon.mdc-text-field--dense .mdc-floating-label[dir=\"rtl\"] {\n    /* \@noflip */\n    left: initial;\n    /* \@noflip */\n    right: 4.4rem; }\n\n.mdc-text-field--with-trailing-icon.mdc-text-field--dense .mdc-text-field__icon {\n  /* \@noflip */\n  left: initial;\n  /* \@noflip */\n  right: 1.2rem; }\n  [dir=\"rtl\"] .mdc-text-field--with-trailing-icon.mdc-text-field--dense .mdc-text-field__icon, .mdc-text-field--with-trailing-icon.mdc-text-field--dense .mdc-text-field__icon[dir=\"rtl\"] {\n    /* \@noflip */\n    left: 1.2rem;\n    /* \@noflip */\n    right: initial; }\n\n.mdc-text-field--with-trailing-icon.mdc-text-field--dense .mdc-text-field__input {\n  /* \@noflip */\n  padding-left: 1.2rem;\n  /* \@noflip */\n  padding-right: 4.4rem; }\n  [dir=\"rtl\"] .mdc-text-field--with-trailing-icon.mdc-text-field--dense .mdc-text-field__input, .mdc-text-field--with-trailing-icon.mdc-text-field--dense .mdc-text-field__input[dir=\"rtl\"] {\n    /* \@noflip */\n    padding-left: 4.4rem;\n    /* \@noflip */\n    padding-right: 1.2rem; }\n\n.mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon.mdc-text-field--dense .mdc-text-field__icon {\n  /* \@noflip */\n  left: 1.2rem;\n  /* \@noflip */\n  right: auto; }\n  [dir=\"rtl\"] .mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon.mdc-text-field--dense .mdc-text-field__icon, .mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon.mdc-text-field--dense .mdc-text-field__icon[dir=\"rtl\"] {\n    /* \@noflip */\n    left: auto;\n    /* \@noflip */\n    right: 1.2rem; }\n  .mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon.mdc-text-field--dense .mdc-text-field__icon ~ .mdc-text-field__icon {\n    /* \@noflip */\n    right: 1.2rem;\n    /* \@noflip */\n    left: auto; }\n    [dir=\"rtl\"] .mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon.mdc-text-field--dense .mdc-text-field__icon ~ .mdc-text-field__icon, .mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon.mdc-text-field--dense .mdc-text-field__icon ~ .mdc-text-field__icon[dir=\"rtl\"] {\n      /* \@noflip */\n      right: auto;\n      /* \@noflip */\n      left: 1.2rem; }\n\n.mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon.mdc-text-field--dense .mdc-text-field__input {\n  /* \@noflip */\n  padding-left: 4.4rem;\n  /* \@noflip */\n  padding-right: 4.4rem; }\n  [dir=\"rtl\"] .mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon.mdc-text-field--dense .mdc-text-field__input, .mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon.mdc-text-field--dense .mdc-text-field__input[dir=\"rtl\"] {\n    /* \@noflip */\n    padding-left: 4.4rem;\n    /* \@noflip */\n    padding-right: 4.4rem; }\n\n.mdc-text-field--dense .mdc-floating-label--float-above {\n  -webkit-transform: translateY(-70%) scale(0.8);\n  transform: translateY(-70%) scale(0.8); }\n\n.mdc-text-field--dense .mdc-floating-label--shake {\n  -webkit-animation: mdc-floating-label-shake-float-above-text-field-dense 250ms 1;\n  animation: mdc-floating-label-shake-float-above-text-field-dense 250ms 1; }\n\n.mdc-text-field--dense .mdc-text-field__input {\n  padding: 1.2rem 1.2rem 0; }\n\n.mdc-text-field--dense .mdc-floating-label {\n  font-size: 1.3008rem; }\n  .mdc-text-field--dense .mdc-floating-label--float-above {\n    font-size: 1.3008rem; }\n\n.mdc-text-field__input:required ~ .mdc-floating-label::after,\n.mdc-text-field__input:required ~ .mdc-notched-outline .mdc-floating-label::after {\n  margin-left: .1rem;\n  content: \"*\"; }\n\n.mdc-text-field--textarea {\n  display: -ms-inline-flexbox;\n  display: inline-flex;\n  width: auto;\n  height: auto;\n  -webkit-transition: none;\n  transition: none;\n  overflow: visible; }\n  .mdc-text-field--textarea:not(.mdc-text-field--disabled) .mdc-notched-outline__leading,\n  .mdc-text-field--textarea:not(.mdc-text-field--disabled) .mdc-notched-outline__notch,\n  .mdc-text-field--textarea:not(.mdc-text-field--disabled) .mdc-notched-outline__trailing {\n    border-color: rgba(0, 0, 0, 0.24); }\n  .mdc-text-field--textarea:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__input:hover ~ .mdc-notched-outline .mdc-notched-outline__leading,\n  .mdc-text-field--textarea:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__input:hover ~ .mdc-notched-outline .mdc-notched-outline__notch,\n  .mdc-text-field--textarea:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__input:hover ~ .mdc-notched-outline .mdc-notched-outline__trailing,\n  .mdc-text-field--textarea:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__icon:hover ~ .mdc-notched-outline .mdc-notched-outline__leading,\n  .mdc-text-field--textarea:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__icon:hover ~ .mdc-notched-outline .mdc-notched-outline__notch,\n  .mdc-text-field--textarea:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__icon:hover ~ .mdc-notched-outline .mdc-notched-outline__trailing {\n    border-color: rgba(0, 0, 0, 0.87); }\n  .mdc-text-field--textarea:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__leading,\n  .mdc-text-field--textarea:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__notch,\n  .mdc-text-field--textarea:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__trailing {\n    border-color: #26a69a;\n    /* \@alternate */\n    border-color: var(--mdc-theme-primary, #26a69a); }\n  .mdc-text-field--textarea .mdc-floating-label--shake {\n    -webkit-animation: mdc-floating-label-shake-float-above-text-field-outlined 250ms 1;\n    animation: mdc-floating-label-shake-float-above-text-field-outlined 250ms 1; }\n  .mdc-text-field--textarea .mdc-notched-outline .mdc-notched-outline__leading {\n    /* \@noflip */\n    border-radius: 0.4rem 0 0 0.4rem; }\n    [dir=\"rtl\"] .mdc-text-field--textarea .mdc-notched-outline .mdc-notched-outline__leading, .mdc-text-field--textarea .mdc-notched-outline .mdc-notched-outline__leading[dir=\"rtl\"] {\n      /* \@noflip */\n      border-radius: 0 0.4rem 0.4rem 0; }\n  .mdc-text-field--textarea .mdc-notched-outline .mdc-notched-outline__trailing {\n    /* \@noflip */\n    border-radius: 0 0.4rem 0.4rem 0; }\n    [dir=\"rtl\"] .mdc-text-field--textarea .mdc-notched-outline .mdc-notched-outline__trailing, .mdc-text-field--textarea .mdc-notched-outline .mdc-notched-outline__trailing[dir=\"rtl\"] {\n      /* \@noflip */\n      border-radius: 0.4rem 0 0 0.4rem; }\n  .mdc-text-field--textarea::before, .mdc-text-field--textarea::after {\n    content: none; }\n  .mdc-text-field--textarea:not(.mdc-text-field--disabled) {\n    background-color: transparent; }\n  .mdc-text-field--textarea .mdc-floating-label--float-above {\n    -webkit-transform: translateY(-144%) scale(1);\n    transform: translateY(-144%) scale(1); }\n  .mdc-text-field--textarea .mdc-floating-label--float-above {\n    font-size: 1.2rem; }\n  .mdc-text-field--textarea.mdc-notched-outline--upgraded .mdc-floating-label--float-above,\n  .mdc-text-field--textarea .mdc-notched-outline--upgraded .mdc-floating-label--float-above {\n    -webkit-transform: translateY(-130%) scale(0.75);\n    transform: translateY(-130%) scale(0.75); }\n  .mdc-text-field--textarea.mdc-notched-outline--upgraded .mdc-floating-label--float-above,\n  .mdc-text-field--textarea .mdc-notched-outline--upgraded .mdc-floating-label--float-above {\n    font-size: 1.6rem; }\n  .mdc-text-field--textarea .mdc-text-field__input {\n    -ms-flex-item-align: auto;\n    align-self: auto;\n    -webkit-box-sizing: border-box;\n    box-sizing: border-box;\n    height: auto;\n    margin: 0.8rem 0.1rem 0.1rem 0;\n    padding: 0 1.6rem 1.6rem;\n    border: none; }\n  .mdc-text-field--textarea .mdc-floating-label {\n    top: 1.7rem;\n    bottom: auto;\n    width: auto;\n    pointer-events: none; }\n  .mdc-text-field--textarea.mdc-text-field--focused .mdc-notched-outline__leading,\n  .mdc-text-field--textarea.mdc-text-field--focused .mdc-notched-outline__notch,\n  .mdc-text-field--textarea.mdc-text-field--focused .mdc-notched-outline__trailing {\n    border-width: 0.2rem; }\n\n.mdc-text-field--fullwidth {\n  width: 100%; }\n  .mdc-text-field--fullwidth:not(.mdc-text-field--textarea) {\n    display: block; }\n    .mdc-text-field--fullwidth:not(.mdc-text-field--textarea)::before, .mdc-text-field--fullwidth:not(.mdc-text-field--textarea)::after {\n      content: none; }\n    .mdc-text-field--fullwidth:not(.mdc-text-field--textarea):not(.mdc-text-field--disabled) {\n      background-color: transparent; }\n    .mdc-text-field--fullwidth:not(.mdc-text-field--textarea) .mdc-text-field__input {\n      padding: 0; }\n  .mdc-text-field--fullwidth.mdc-text-field--textarea .mdc-text-field__input {\n    resize: vertical; }\n\n.mdc-text-field--fullwidth.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--textarea) {\n  border-bottom-color: #b00020;\n  /* \@alternate */\n  border-bottom-color: var(--mdc-theme-error, #b00020); }\n\n.mdc-text-field--dense + .mdc-text-field-helper-text {\n  margin-bottom: .4rem; }\n\n.mdc-text-field + .mdc-text-field-helper-text {\n  margin-right: 1.2rem;\n  margin-left: 1.2rem; }\n\n.mdc-text-field--outlined + .mdc-text-field-helper-text {\n  margin-right: 1.6rem;\n  margin-left: 1.6rem; }\n\n.mdc-form-field > .mdc-text-field + label {\n  -ms-flex-item-align: start;\n  align-self: flex-start; }\n\n.mdc-text-field--focused:not(.mdc-text-field--disabled) .mdc-floating-label {\n  color: rgba(38, 166, 154, 0.87); }\n\n.mdc-text-field--focused:not(.mdc-text-field--disabled) .mdc-text-field__input::-webkit-input-placeholder {\n  color: rgba(38, 166, 154, 0.87); }\n\n.mdc-text-field--focused:not(.mdc-text-field--disabled) .mdc-text-field__input:-ms-input-placeholder {\n  color: rgba(38, 166, 154, 0.87); }\n\n.mdc-text-field--focused:not(.mdc-text-field--disabled) .mdc-text-field__input::-ms-input-placeholder {\n  color: rgba(38, 166, 154, 0.87); }\n\n.mdc-text-field--focused:not(.mdc-text-field--disabled) .mdc-text-field__input::placeholder {\n  color: rgba(38, 166, 154, 0.87); }\n\n.mdc-text-field--focused .mdc-text-field__input:required ~ .mdc-floating-label::after,\n.mdc-text-field--focused .mdc-text-field__input:required ~ .mdc-notched-outline .mdc-floating-label::after {\n  color: #b00020;\n  /* \@alternate */\n  color: var(--mdc-theme-error, #b00020); }\n\n.mdc-text-field--focused + .mdc-text-field-helper-text:not(.mdc-text-field-helper-text--validation-msg) {\n  opacity: 1; }\n\n.mdc-text-field--textarea.mdc-text-field--focused:not(.mdc-text-field--disabled) .mdc-notched-outline__leading,\n.mdc-text-field--textarea.mdc-text-field--focused:not(.mdc-text-field--disabled) .mdc-notched-outline__notch,\n.mdc-text-field--textarea.mdc-text-field--focused:not(.mdc-text-field--disabled) .mdc-notched-outline__trailing {\n  border-color: #26a69a;\n  /* \@alternate */\n  border-color: var(--mdc-theme-primary, #26a69a); }\n\n.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--outlined):not(.mdc-text-field--textarea) .mdc-text-field__input {\n  border-bottom-color: #b00020;\n  /* \@alternate */\n  border-bottom-color: var(--mdc-theme-error, #b00020); }\n\n.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--outlined):not(.mdc-text-field--textarea) .mdc-text-field__input:hover {\n  border-bottom-color: #b00020;\n  /* \@alternate */\n  border-bottom-color: var(--mdc-theme-error, #b00020); }\n\n.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-line-ripple {\n  background-color: #b00020;\n  /* \@alternate */\n  background-color: var(--mdc-theme-error, #b00020); }\n\n.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-floating-label {\n  color: #b00020;\n  /* \@alternate */\n  color: var(--mdc-theme-error, #b00020); }\n\n.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-text-field__input::-webkit-input-placeholder {\n  color: #b00020;\n  /* \@alternate */\n  color: var(--mdc-theme-error, #b00020); }\n\n.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-text-field__input:-ms-input-placeholder {\n  color: #b00020;\n  /* \@alternate */\n  color: var(--mdc-theme-error, #b00020); }\n\n.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-text-field__input::-ms-input-placeholder {\n  color: #b00020;\n  /* \@alternate */\n  color: var(--mdc-theme-error, #b00020); }\n\n.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-text-field__input::placeholder {\n  color: #b00020;\n  /* \@alternate */\n  color: var(--mdc-theme-error, #b00020); }\n\n.mdc-text-field--invalid:not(.mdc-text-field--disabled).mdc-text-field--invalid + .mdc-text-field-helper-text--validation-msg {\n  color: #b00020;\n  /* \@alternate */\n  color: var(--mdc-theme-error, #b00020); }\n\n.mdc-text-field--invalid .mdc-text-field__input {\n  caret-color: #b00020;\n  /* \@alternate */\n  caret-color: var(--mdc-theme-error, #b00020); }\n\n.mdc-text-field--invalid.mdc-text-field--with-trailing-icon:not(.mdc-text-field--with-leading-icon):not(.mdc-text-field--disabled) .mdc-text-field__icon {\n  color: #b00020;\n  /* \@alternate */\n  color: var(--mdc-theme-error, #b00020); }\n\n.mdc-text-field--invalid.mdc-text-field--with-trailing-icon.mdc-text-field--with-leading-icon:not(.mdc-text-field--disabled) .mdc-text-field__icon ~ .mdc-text-field__icon {\n  color: #b00020;\n  /* \@alternate */\n  color: var(--mdc-theme-error, #b00020); }\n\n.mdc-text-field--invalid + .mdc-text-field-helper-text--validation-msg {\n  opacity: 1; }\n\n.mdc-text-field--textarea.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-notched-outline__leading,\n.mdc-text-field--textarea.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-notched-outline__notch,\n.mdc-text-field--textarea.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-notched-outline__trailing {\n  border-color: #b00020;\n  /* \@alternate */\n  border-color: var(--mdc-theme-error, #b00020); }\n\n.mdc-text-field--textarea.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__input:hover ~ .mdc-notched-outline .mdc-notched-outline__leading,\n.mdc-text-field--textarea.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__input:hover ~ .mdc-notched-outline .mdc-notched-outline__notch,\n.mdc-text-field--textarea.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__input:hover ~ .mdc-notched-outline .mdc-notched-outline__trailing,\n.mdc-text-field--textarea.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__icon:hover ~ .mdc-notched-outline .mdc-notched-outline__leading,\n.mdc-text-field--textarea.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__icon:hover ~ .mdc-notched-outline .mdc-notched-outline__notch,\n.mdc-text-field--textarea.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__icon:hover ~ .mdc-notched-outline .mdc-notched-outline__trailing {\n  border-color: #b00020;\n  /* \@alternate */\n  border-color: var(--mdc-theme-error, #b00020); }\n\n.mdc-text-field--textarea.mdc-text-field--invalid:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__leading,\n.mdc-text-field--textarea.mdc-text-field--invalid:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__notch,\n.mdc-text-field--textarea.mdc-text-field--invalid:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__trailing {\n  border-color: #b00020;\n  /* \@alternate */\n  border-color: var(--mdc-theme-error, #b00020); }\n\n.mdc-text-field--outlined.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-notched-outline__leading,\n.mdc-text-field--outlined.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-notched-outline__notch,\n.mdc-text-field--outlined.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-notched-outline__trailing {\n  border-color: #b00020;\n  /* \@alternate */\n  border-color: var(--mdc-theme-error, #b00020); }\n\n.mdc-text-field--outlined.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__input:hover ~ .mdc-notched-outline .mdc-notched-outline__leading,\n.mdc-text-field--outlined.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__input:hover ~ .mdc-notched-outline .mdc-notched-outline__notch,\n.mdc-text-field--outlined.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__input:hover ~ .mdc-notched-outline .mdc-notched-outline__trailing,\n.mdc-text-field--outlined.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__icon:hover ~ .mdc-notched-outline .mdc-notched-outline__leading,\n.mdc-text-field--outlined.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__icon:hover ~ .mdc-notched-outline .mdc-notched-outline__notch,\n.mdc-text-field--outlined.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__icon:hover ~ .mdc-notched-outline .mdc-notched-outline__trailing {\n  border-color: #b00020;\n  /* \@alternate */\n  border-color: var(--mdc-theme-error, #b00020); }\n\n.mdc-text-field--outlined.mdc-text-field--invalid:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__leading,\n.mdc-text-field--outlined.mdc-text-field--invalid:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__notch,\n.mdc-text-field--outlined.mdc-text-field--invalid:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__trailing {\n  border-color: #b00020;\n  /* \@alternate */\n  border-color: var(--mdc-theme-error, #b00020); }\n\n.mdc-text-field--disabled {\n  background-color: #fafafa;\n  border-bottom: none;\n  pointer-events: none; }\n  .mdc-text-field--disabled .mdc-text-field__input {\n    border-bottom-color: rgba(0, 0, 0, 0.06); }\n  .mdc-text-field--disabled .mdc-text-field__input {\n    color: rgba(0, 0, 0, 0.37); }\n  .mdc-text-field--disabled .mdc-floating-label {\n    color: rgba(0, 0, 0, 0.37); }\n  .mdc-text-field--disabled .mdc-text-field__input::-webkit-input-placeholder {\n    color: rgba(0, 0, 0, 0.37); }\n  .mdc-text-field--disabled .mdc-text-field__input:-ms-input-placeholder {\n    color: rgba(0, 0, 0, 0.37); }\n  .mdc-text-field--disabled .mdc-text-field__input::-ms-input-placeholder {\n    color: rgba(0, 0, 0, 0.37); }\n  .mdc-text-field--disabled .mdc-text-field__input::placeholder {\n    color: rgba(0, 0, 0, 0.37); }\n  .mdc-text-field--disabled + .mdc-text-field-helper-text {\n    color: rgba(0, 0, 0, 0.37); }\n  .mdc-text-field--disabled .mdc-text-field__icon {\n    color: rgba(0, 0, 0, 0.3); }\n  .mdc-text-field--disabled:not(.mdc-text-field--textarea) {\n    border-bottom-color: rgba(0, 0, 0, 0.12); }\n  .mdc-text-field--disabled .mdc-floating-label {\n    cursor: default; }\n\n.mdc-text-field--textarea.mdc-text-field--disabled {\n  background-color: transparent;\n  background-color: #f9f9f9; }\n  .mdc-text-field--textarea.mdc-text-field--disabled .mdc-notched-outline__leading,\n  .mdc-text-field--textarea.mdc-text-field--disabled .mdc-notched-outline__notch,\n  .mdc-text-field--textarea.mdc-text-field--disabled .mdc-notched-outline__trailing {\n    border-color: rgba(0, 0, 0, 0.06); }\n  .mdc-text-field--textarea.mdc-text-field--disabled .mdc-text-field__input {\n    border-bottom: none; }\n\n\@-webkit-keyframes mdc-floating-label-shake-float-above-text-field-dense {\n  0% {\n    -webkit-transform: translateX(calc(0 - 0%)) translateY(-70%) scale(0.8);\n    transform: translateX(calc(0 - 0%)) translateY(-70%) scale(0.8); }\n  33% {\n    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    -webkit-transform: translateX(calc(4% - 0%)) translateY(-70%) scale(0.8);\n    transform: translateX(calc(4% - 0%)) translateY(-70%) scale(0.8); }\n  66% {\n    -webkit-animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    -webkit-transform: translateX(calc(-4% - 0%)) translateY(-70%) scale(0.8);\n    transform: translateX(calc(-4% - 0%)) translateY(-70%) scale(0.8); }\n  100% {\n    -webkit-transform: translateX(calc(0 - 0%)) translateY(-70%) scale(0.8);\n    transform: translateX(calc(0 - 0%)) translateY(-70%) scale(0.8); } }\n\n\@keyframes mdc-floating-label-shake-float-above-text-field-dense {\n  0% {\n    -webkit-transform: translateX(calc(0 - 0%)) translateY(-70%) scale(0.8);\n    transform: translateX(calc(0 - 0%)) translateY(-70%) scale(0.8); }\n  33% {\n    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    -webkit-transform: translateX(calc(4% - 0%)) translateY(-70%) scale(0.8);\n    transform: translateX(calc(4% - 0%)) translateY(-70%) scale(0.8); }\n  66% {\n    -webkit-animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    -webkit-transform: translateX(calc(-4% - 0%)) translateY(-70%) scale(0.8);\n    transform: translateX(calc(-4% - 0%)) translateY(-70%) scale(0.8); }\n  100% {\n    -webkit-transform: translateX(calc(0 - 0%)) translateY(-70%) scale(0.8);\n    transform: translateX(calc(0 - 0%)) translateY(-70%) scale(0.8); } }\n\n\@-webkit-keyframes mdc-floating-label-shake-float-above-text-field-outlined {\n  0% {\n    -webkit-transform: translateX(calc(0 - 0%)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(0 - 0%)) translateY(-130%) scale(0.75); }\n  33% {\n    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    -webkit-transform: translateX(calc(4% - 0%)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(4% - 0%)) translateY(-130%) scale(0.75); }\n  66% {\n    -webkit-animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    -webkit-transform: translateX(calc(-4% - 0%)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(-4% - 0%)) translateY(-130%) scale(0.75); }\n  100% {\n    -webkit-transform: translateX(calc(0 - 0%)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(0 - 0%)) translateY(-130%) scale(0.75); } }\n\n\@keyframes mdc-floating-label-shake-float-above-text-field-outlined {\n  0% {\n    -webkit-transform: translateX(calc(0 - 0%)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(0 - 0%)) translateY(-130%) scale(0.75); }\n  33% {\n    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    -webkit-transform: translateX(calc(4% - 0%)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(4% - 0%)) translateY(-130%) scale(0.75); }\n  66% {\n    -webkit-animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    -webkit-transform: translateX(calc(-4% - 0%)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(-4% - 0%)) translateY(-130%) scale(0.75); }\n  100% {\n    -webkit-transform: translateX(calc(0 - 0%)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(0 - 0%)) translateY(-130%) scale(0.75); } }\n\n\@-webkit-keyframes mdc-floating-label-shake-float-above-text-field-outlined-dense {\n  0% {\n    -webkit-transform: translateX(calc(0 - 0%)) translateY(-120%) scale(0.8);\n    transform: translateX(calc(0 - 0%)) translateY(-120%) scale(0.8); }\n  33% {\n    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    -webkit-transform: translateX(calc(4% - 0%)) translateY(-120%) scale(0.8);\n    transform: translateX(calc(4% - 0%)) translateY(-120%) scale(0.8); }\n  66% {\n    -webkit-animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    -webkit-transform: translateX(calc(-4% - 0%)) translateY(-120%) scale(0.8);\n    transform: translateX(calc(-4% - 0%)) translateY(-120%) scale(0.8); }\n  100% {\n    -webkit-transform: translateX(calc(0 - 0%)) translateY(-120%) scale(0.8);\n    transform: translateX(calc(0 - 0%)) translateY(-120%) scale(0.8); } }\n\n\@keyframes mdc-floating-label-shake-float-above-text-field-outlined-dense {\n  0% {\n    -webkit-transform: translateX(calc(0 - 0%)) translateY(-120%) scale(0.8);\n    transform: translateX(calc(0 - 0%)) translateY(-120%) scale(0.8); }\n  33% {\n    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    -webkit-transform: translateX(calc(4% - 0%)) translateY(-120%) scale(0.8);\n    transform: translateX(calc(4% - 0%)) translateY(-120%) scale(0.8); }\n  66% {\n    -webkit-animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    -webkit-transform: translateX(calc(-4% - 0%)) translateY(-120%) scale(0.8);\n    transform: translateX(calc(-4% - 0%)) translateY(-120%) scale(0.8); }\n  100% {\n    -webkit-transform: translateX(calc(0 - 0%)) translateY(-120%) scale(0.8);\n    transform: translateX(calc(0 - 0%)) translateY(-120%) scale(0.8); } }\n\n\@-webkit-keyframes mdc-floating-label-shake-float-above-text-field-outlined-leading-icon {\n  0% {\n    -webkit-transform: translateX(calc(0 - 0)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(0 - 0)) translateY(-130%) scale(0.75); }\n  33% {\n    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    -webkit-transform: translateX(calc(4% - 0)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(4% - 0)) translateY(-130%) scale(0.75); }\n  66% {\n    -webkit-animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    -webkit-transform: translateX(calc(-4% - 0)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(-4% - 0)) translateY(-130%) scale(0.75); }\n  100% {\n    -webkit-transform: translateX(calc(0 - 0)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(0 - 0)) translateY(-130%) scale(0.75); } }\n\n\@keyframes mdc-floating-label-shake-float-above-text-field-outlined-leading-icon {\n  0% {\n    -webkit-transform: translateX(calc(0 - 0)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(0 - 0)) translateY(-130%) scale(0.75); }\n  33% {\n    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    -webkit-transform: translateX(calc(4% - 0)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(4% - 0)) translateY(-130%) scale(0.75); }\n  66% {\n    -webkit-animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    -webkit-transform: translateX(calc(-4% - 0)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(-4% - 0)) translateY(-130%) scale(0.75); }\n  100% {\n    -webkit-transform: translateX(calc(0 - 0)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(0 - 0)) translateY(-130%) scale(0.75); } }\n\n\@-webkit-keyframes mdc-floating-label-shake-float-above-text-field-outlined-leading-icon-dense {\n  0% {\n    -webkit-transform: translateX(calc(0 - 2.1rem)) translateY(-120%) scale(0.8);\n    transform: translateX(calc(0 - 2.1rem)) translateY(-120%) scale(0.8); }\n  33% {\n    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    -webkit-transform: translateX(calc(4% - 2.1rem)) translateY(-120%) scale(0.8);\n    transform: translateX(calc(4% - 2.1rem)) translateY(-120%) scale(0.8); }\n  66% {\n    -webkit-animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    -webkit-transform: translateX(calc(-4% - 2.1rem)) translateY(-120%) scale(0.8);\n    transform: translateX(calc(-4% - 2.1rem)) translateY(-120%) scale(0.8); }\n  100% {\n    -webkit-transform: translateX(calc(0 - 2.1rem)) translateY(-120%) scale(0.8);\n    transform: translateX(calc(0 - 2.1rem)) translateY(-120%) scale(0.8); } }\n\n\@keyframes mdc-floating-label-shake-float-above-text-field-outlined-leading-icon-dense {\n  0% {\n    -webkit-transform: translateX(calc(0 - 2.1rem)) translateY(-120%) scale(0.8);\n    transform: translateX(calc(0 - 2.1rem)) translateY(-120%) scale(0.8); }\n  33% {\n    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    -webkit-transform: translateX(calc(4% - 2.1rem)) translateY(-120%) scale(0.8);\n    transform: translateX(calc(4% - 2.1rem)) translateY(-120%) scale(0.8); }\n  66% {\n    -webkit-animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    -webkit-transform: translateX(calc(-4% - 2.1rem)) translateY(-120%) scale(0.8);\n    transform: translateX(calc(-4% - 2.1rem)) translateY(-120%) scale(0.8); }\n  100% {\n    -webkit-transform: translateX(calc(0 - 2.1rem)) translateY(-120%) scale(0.8);\n    transform: translateX(calc(0 - 2.1rem)) translateY(-120%) scale(0.8); } }\n\n\@-webkit-keyframes mdc-floating-label-shake-float-above-text-field-outlined-leading-icon-rtl {\n  0% {\n    -webkit-transform: translateX(calc(0 - 0)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(0 - 0)) translateY(-130%) scale(0.75); }\n  33% {\n    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    -webkit-transform: translateX(calc(4% - 0)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(4% - 0)) translateY(-130%) scale(0.75); }\n  66% {\n    -webkit-animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    -webkit-transform: translateX(calc(-4% - 0)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(-4% - 0)) translateY(-130%) scale(0.75); }\n  100% {\n    -webkit-transform: translateX(calc(0 - 0)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(0 - 0)) translateY(-130%) scale(0.75); } }\n\n\@keyframes mdc-floating-label-shake-float-above-text-field-outlined-leading-icon-rtl {\n  0% {\n    -webkit-transform: translateX(calc(0 - 0)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(0 - 0)) translateY(-130%) scale(0.75); }\n  33% {\n    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    -webkit-transform: translateX(calc(4% - 0)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(4% - 0)) translateY(-130%) scale(0.75); }\n  66% {\n    -webkit-animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    -webkit-transform: translateX(calc(-4% - 0)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(-4% - 0)) translateY(-130%) scale(0.75); }\n  100% {\n    -webkit-transform: translateX(calc(0 - 0)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(0 - 0)) translateY(-130%) scale(0.75); } }\n\n\@-webkit-keyframes mdc-floating-label-shake-float-above-text-field-outlined-leading-icon-dense-rtl {\n  0% {\n    -webkit-transform: translateX(calc(0 - -2.1rem)) translateY(-120%) scale(0.8);\n    transform: translateX(calc(0 - -2.1rem)) translateY(-120%) scale(0.8); }\n  33% {\n    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    -webkit-transform: translateX(calc(4% - -2.1rem)) translateY(-120%) scale(0.8);\n    transform: translateX(calc(4% - -2.1rem)) translateY(-120%) scale(0.8); }\n  66% {\n    -webkit-animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    -webkit-transform: translateX(calc(-4% - -2.1rem)) translateY(-120%) scale(0.8);\n    transform: translateX(calc(-4% - -2.1rem)) translateY(-120%) scale(0.8); }\n  100% {\n    -webkit-transform: translateX(calc(0 - -2.1rem)) translateY(-120%) scale(0.8);\n    transform: translateX(calc(0 - -2.1rem)) translateY(-120%) scale(0.8); } }\n\n\@keyframes mdc-floating-label-shake-float-above-text-field-outlined-leading-icon-dense-rtl {\n  0% {\n    -webkit-transform: translateX(calc(0 - -2.1rem)) translateY(-120%) scale(0.8);\n    transform: translateX(calc(0 - -2.1rem)) translateY(-120%) scale(0.8); }\n  33% {\n    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    -webkit-transform: translateX(calc(4% - -2.1rem)) translateY(-120%) scale(0.8);\n    transform: translateX(calc(4% - -2.1rem)) translateY(-120%) scale(0.8); }\n  66% {\n    -webkit-animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    -webkit-transform: translateX(calc(-4% - -2.1rem)) translateY(-120%) scale(0.8);\n    transform: translateX(calc(-4% - -2.1rem)) translateY(-120%) scale(0.8); }\n  100% {\n    -webkit-transform: translateX(calc(0 - -2.1rem)) translateY(-120%) scale(0.8);\n    transform: translateX(calc(0 - -2.1rem)) translateY(-120%) scale(0.8); } }\n\n\@-webkit-keyframes mdc-floating-label-shake-float-above-textarea {\n  0% {\n    -webkit-transform: translateX(calc(0 - 0%)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(0 - 0%)) translateY(-130%) scale(0.75); }\n  33% {\n    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    -webkit-transform: translateX(calc(4% - 0%)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(4% - 0%)) translateY(-130%) scale(0.75); }\n  66% {\n    -webkit-animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    -webkit-transform: translateX(calc(-4% - 0%)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(-4% - 0%)) translateY(-130%) scale(0.75); }\n  100% {\n    -webkit-transform: translateX(calc(0 - 0%)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(0 - 0%)) translateY(-130%) scale(0.75); } }\n\n\@keyframes mdc-floating-label-shake-float-above-textarea {\n  0% {\n    -webkit-transform: translateX(calc(0 - 0%)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(0 - 0%)) translateY(-130%) scale(0.75); }\n  33% {\n    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    -webkit-transform: translateX(calc(4% - 0%)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(4% - 0%)) translateY(-130%) scale(0.75); }\n  66% {\n    -webkit-animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    -webkit-transform: translateX(calc(-4% - 0%)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(-4% - 0%)) translateY(-130%) scale(0.75); }\n  100% {\n    -webkit-transform: translateX(calc(0 - 0%)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(0 - 0%)) translateY(-130%) scale(0.75); } }\n\n.mdc-ripple-surface {\n  --mdc-ripple-fg-size: 0;\n  --mdc-ripple-left: 0;\n  --mdc-ripple-top: 0;\n  --mdc-ripple-fg-scale: 1;\n  --mdc-ripple-fg-translate-end: 0;\n  --mdc-ripple-fg-translate-start: 0;\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n  will-change: transform, opacity;\n  position: relative;\n  outline: none;\n  overflow: hidden; }\n  .mdc-ripple-surface::before, .mdc-ripple-surface::after {\n    position: absolute;\n    border-radius: 50%;\n    opacity: 0;\n    pointer-events: none;\n    content: \"\"; }\n  .mdc-ripple-surface::before {\n    -webkit-transition: opacity 15ms linear, background-color 15ms linear;\n    transition: opacity 15ms linear, background-color 15ms linear;\n    z-index: 1; }\n  .mdc-ripple-surface.mdc-ripple-upgraded::before {\n    -webkit-transform: scale(var(--mdc-ripple-fg-scale, 1));\n    transform: scale(var(--mdc-ripple-fg-scale, 1)); }\n  .mdc-ripple-surface.mdc-ripple-upgraded::after {\n    top: 0;\n    /* \@noflip */\n    left: 0;\n    -webkit-transform: scale(0);\n    transform: scale(0);\n    -webkit-transform-origin: center center;\n    transform-origin: center center; }\n  .mdc-ripple-surface.mdc-ripple-upgraded--unbounded::after {\n    top: var(--mdc-ripple-top, 0);\n    /* \@noflip */\n    left: var(--mdc-ripple-left, 0); }\n  .mdc-ripple-surface.mdc-ripple-upgraded--foreground-activation::after {\n    -webkit-animation: 225ms mdc-ripple-fg-radius-in forwards, 75ms mdc-ripple-fg-opacity-in forwards;\n    animation: 225ms mdc-ripple-fg-radius-in forwards, 75ms mdc-ripple-fg-opacity-in forwards; }\n  .mdc-ripple-surface.mdc-ripple-upgraded--foreground-deactivation::after {\n    -webkit-animation: 150ms mdc-ripple-fg-opacity-out;\n    animation: 150ms mdc-ripple-fg-opacity-out;\n    -webkit-transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1));\n    transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1)); }\n  .mdc-ripple-surface::before, .mdc-ripple-surface::after {\n    background-color: #000; }\n  .mdc-ripple-surface:hover::before {\n    opacity: 0.04; }\n  .mdc-ripple-surface:not(.mdc-ripple-upgraded):focus::before, .mdc-ripple-surface.mdc-ripple-upgraded--background-focused::before {\n    -webkit-transition-duration: 75ms;\n    transition-duration: 75ms;\n    opacity: 0.12; }\n  .mdc-ripple-surface:not(.mdc-ripple-upgraded)::after {\n    -webkit-transition: opacity 150ms linear;\n    transition: opacity 150ms linear; }\n  .mdc-ripple-surface:not(.mdc-ripple-upgraded):active::after {\n    -webkit-transition-duration: 75ms;\n    transition-duration: 75ms;\n    opacity: 0.16; }\n  .mdc-ripple-surface.mdc-ripple-upgraded {\n    --mdc-ripple-fg-opacity: 0.16; }\n  .mdc-ripple-surface::before, .mdc-ripple-surface::after {\n    top: calc(50% - 100%);\n    /* \@noflip */\n    left: calc(50% - 100%);\n    width: 200%;\n    height: 200%; }\n  .mdc-ripple-surface.mdc-ripple-upgraded::after {\n    width: var(--mdc-ripple-fg-size, 100%);\n    height: var(--mdc-ripple-fg-size, 100%); }\n  .mdc-ripple-surface[data-mdc-ripple-is-unbounded] {\n    overflow: visible; }\n    .mdc-ripple-surface[data-mdc-ripple-is-unbounded]::before, .mdc-ripple-surface[data-mdc-ripple-is-unbounded]::after {\n      top: calc(50% - 50%);\n      /* \@noflip */\n      left: calc(50% - 50%);\n      width: 100%;\n      height: 100%; }\n    .mdc-ripple-surface[data-mdc-ripple-is-unbounded].mdc-ripple-upgraded::before, .mdc-ripple-surface[data-mdc-ripple-is-unbounded].mdc-ripple-upgraded::after {\n      top: var(--mdc-ripple-top, calc(50% - 50%));\n      /* \@noflip */\n      left: var(--mdc-ripple-left, calc(50% - 50%));\n      width: var(--mdc-ripple-fg-size, 100%);\n      height: var(--mdc-ripple-fg-size, 100%); }\n    .mdc-ripple-surface[data-mdc-ripple-is-unbounded].mdc-ripple-upgraded::after {\n      width: var(--mdc-ripple-fg-size, 100%);\n      height: var(--mdc-ripple-fg-size, 100%); }\n  .mdc-ripple-surface--primary::before, .mdc-ripple-surface--primary::after {\n    background-color: #26a69a; }\n    \@supports not (-ms-ime-align: auto) {\n      .mdc-ripple-surface--primary::before, .mdc-ripple-surface--primary::after {\n        /* \@alternate */\n        background-color: var(--mdc-theme-primary, #26a69a); } }\n  .mdc-ripple-surface--primary:hover::before {\n    opacity: 0.08; }\n  .mdc-ripple-surface--primary:not(.mdc-ripple-upgraded):focus::before, .mdc-ripple-surface--primary.mdc-ripple-upgraded--background-focused::before {\n    -webkit-transition-duration: 75ms;\n    transition-duration: 75ms;\n    opacity: 0.24; }\n  .mdc-ripple-surface--primary:not(.mdc-ripple-upgraded)::after {\n    -webkit-transition: opacity 150ms linear;\n    transition: opacity 150ms linear; }\n  .mdc-ripple-surface--primary:not(.mdc-ripple-upgraded):active::after {\n    -webkit-transition-duration: 75ms;\n    transition-duration: 75ms;\n    opacity: 0.32; }\n  .mdc-ripple-surface--primary.mdc-ripple-upgraded {\n    --mdc-ripple-fg-opacity: 0.32; }\n  .mdc-ripple-surface--accent::before, .mdc-ripple-surface--accent::after {\n    background-color: #29b6f6; }\n    \@supports not (-ms-ime-align: auto) {\n      .mdc-ripple-surface--accent::before, .mdc-ripple-surface--accent::after {\n        /* \@alternate */\n        background-color: var(--mdc-theme-secondary, #29b6f6); } }\n  .mdc-ripple-surface--accent:hover::before {\n    opacity: 0.08; }\n  .mdc-ripple-surface--accent:not(.mdc-ripple-upgraded):focus::before, .mdc-ripple-surface--accent.mdc-ripple-upgraded--background-focused::before {\n    -webkit-transition-duration: 75ms;\n    transition-duration: 75ms;\n    opacity: 0.24; }\n  .mdc-ripple-surface--accent:not(.mdc-ripple-upgraded)::after {\n    -webkit-transition: opacity 150ms linear;\n    transition: opacity 150ms linear; }\n  .mdc-ripple-surface--accent:not(.mdc-ripple-upgraded):active::after {\n    -webkit-transition-duration: 75ms;\n    transition-duration: 75ms;\n    opacity: 0.32; }\n  .mdc-ripple-surface--accent.mdc-ripple-upgraded {\n    --mdc-ripple-fg-opacity: 0.32; }\n\n:host([disabled]) {\n  pointer-events: none; }\n  :host([disabled]) .mdc-chip-set {\n    opacity: 0.5; }\n\nlimel-icon.mdc-chip__icon.mdc-chip__icon--leading {\n  background-color: var(--icon-background-color, transparent);\n  padding: 0.5rem;\n  margin-left: -1.2rem !important;\n  color: var(--icon-color, rgba(0, 0, 0, 0.54)); }\n\n.mdc-chip-set.mdc-chip-set--input {\n  margin-top: 2rem;\n  width: 100%; }\n\n.mdc-text-field {\n  width: 100%;\n  height: auto;\n  cursor: text; }\n  .mdc-text-field:hover::before {\n    opacity: 0; }\n  .mdc-text-field:not(.mdc-ripple-upgraded):focus::before, .mdc-text-field:not(.mdc-ripple-upgraded):focus-within::before, .mdc-text-field.mdc-ripple-upgraded--background-focused::before {\n    -webkit-transition-duration: 75ms;\n    transition-duration: 75ms;\n    opacity: 0; }\n  .mdc-text-field input {\n    width: auto;\n    border-bottom: none;\n    height: auto;\n    padding-top: 0;\n    -ms-flex-positive: 1;\n    flex-grow: 1;\n    -ms-flex-negative: 0;\n    flex-shrink: 0;\n    max-height: 3.5rem; }\n    .mdc-text-field input.hidden {\n      max-height: 0 !important;\n      -webkit-transition: max-height 250ms cubic-bezier(0.5, 0, 1, 0);\n      transition: max-height 250ms cubic-bezier(0.5, 0, 1, 0); }\n  .mdc-text-field .mdc-floating-label--float-above {\n    top: 2rem;\n    bottom: auto; }\n  .mdc-text-field:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) {\n    border-bottom-style: solid;\n    border-bottom-width: .1rem; }\n  .mdc-text-field:not(.mdc-text-field--disabled).mdc-text-field--focused {\n    border-bottom-style: solid;\n    border-bottom-width: .1rem; }"; }
}

export { ChipSet as LimelChipSet };
